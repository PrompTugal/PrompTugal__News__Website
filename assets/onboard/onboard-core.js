/* onboard-core.js: the pure half of vault onboarding (board/spec-vault-onboarding.md): what the browser computes and
 * checks, with no page and no network, so Node tests it and the sweep agent's Python can be checked against its test
 * vectors (assets/onboard/test-vectors.json). Built on pki.sgit.ai's keys.js (assets/vendor/pki/2026-11-06/).
 *
 *   derive(apiKey)                      the licence's lookup id and its AES key, from the API key (HKDF-SHA256)
 *   issuersFrom(pinned, keysJson)       the issuer bundles whose signing fingerprints the site config pins
 *   verifyPool(pool, issuers)           the pool file is signed by a pinned issuer
 *   pick(pool)                          one entry at random
 *   openLicence(file, apiKey, opts)     decrypt, check the lookup, the issuer's signature and the expiry
 *   newReader(label)                    the reader's key pair (RSA-OAEP 4096 and ECDSA P-256)
 *   newMailboxId()                      32 hex random, unlinkable to the key
 *   claimFor(...) / sealClaim(...)      the claim, sealed to the sweep agent and signed with the reader's key
 *   openMailbox(enc, ...)               a mailbox message: opened, the issuer's signature and its n checked
 *
 * Formats and the reasons: the spec's "File and message formats". Nothing here keeps a secret or sends anything.
 */
import * as K from '../vendor/pki/2026-11-06/keys.js'

export const INFO = { lookup: 'pt.news/licence/lookup/v1', enc: 'pt.news/licence/enc/v1' }
const te = new TextEncoder(), td = new TextDecoder()
const subtle = () => globalThis.crypto.subtle
export const API_KEY = /^sgk_[0-9a-f]{32}$/

/** HKDF-SHA256 over the API key's UTF-8 bytes (including its prefix), an empty salt, the info label above. */
async function hkdf(apiKey, info, bytes) {
    const base = await subtle().importKey('raw', te.encode(apiKey), 'HKDF', false, ['deriveBits'])
    return new Uint8Array(await subtle().deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode(info) }, base, bytes * 8))
}
/** lookup = first 32 hex of HKDF(info lookup); kenc = 32 bytes of HKDF(info enc). Two labels: a path says nothing of its key. */
export async function derive(apiKey) {
    if (!API_KEY.test(String(apiKey))) throw new Error('not an API key')
    return { lookup: K.hex(await hkdf(apiKey, INFO.lookup, 16)), kenc: await hkdf(apiKey, INFO.enc, 32) }
}

/** The issuers' bundles: the entries of board/keys.json whose signing fingerprint is one the site config pins. */
export async function issuersFrom(pinned, keysJson) {
    const out = new Map()
    for (const e of (keysJson && keysJson.keys) || []) {
        const b = e && e.bundle
        if (!b || !b.sign) continue
        let fp; try { fp = await K.fingerprint(b.sign) } catch (x) { continue }
        if (pinned.includes(fp) && e.status !== 'revoked') out.set(fp, { ...b, signing_fingerprint: fp })
    }
    return out
}

/** The pool file: kind pool, an issuer we pin, and that issuer's signature over the canonical bytes. */
export async function verifyPool(pool, issuers) {
    if (!pool || pool.v !== 1 || pool.kind !== 'pool' || !Array.isArray(pool.entries)) return false
    const b = issuers.get(pool.issuer)
    return !!b && await K.verifyStatement(pool, b.sign)
}
export function pick(pool, rand = n => globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % n) {
    const live = pool.entries.filter(e => API_KEY.test(e.api_key))
    if (!live.length) return null
    return live[rand(live.length)]
}

/** The licence: { v, iv, c } decrypted with kenc; then bound to its lookup, signed by a pinned issuer, not expired. */
export async function openLicence(file, apiKey, { issuers, now = new Date() }) {
    const { lookup, kenc } = await derive(apiKey)
    if (!file || file.v !== 1 || !file.iv || !file.c) throw new Error('not a licence file')
    let plain
    try { plain = await subtle().decrypt({ name: 'AES-GCM', iv: K.unb64(file.iv), tagLength: 128 }, await subtle().importKey('raw', kenc, 'AES-GCM', false, ['decrypt']), K.unb64(file.c)) }
    catch (e) { throw new Error('the licence does not open with this API key') }
    const lic = JSON.parse(td.decode(plain))
    if (lic.kind !== 'licence' || lic.v !== 1) throw new Error('not a licence')
    if (lic.lookup !== lookup) throw new Error('the licence belongs to another path')
    const b = issuers.get(lic.issuer)
    if (!b) throw new Error('the licence is signed by an issuer this site does not pin')
    if (!(await K.verifyStatement(lic, b.sign))) throw new Error('the issuer’s signature on the licence does not check')
    if (lic.not_after && Date.parse(lic.not_after) <= now.getTime()) throw new Error('the licence has expired')
    if (!lic.access_key) throw new Error('the licence holds no access key')
    return lic
}

export const newReader = label => K.generate(label)
export const newMailboxId = () => K.hex(globalThis.crypto.getRandomValues(new Uint8Array(16)))

/** The claim, as the spec shows it: never the API key, the access key or a door secret. */
export function claimFor({ lookup, site = 'promptugal.news', reader, mailbox, doorMode, at = new Date().toISOString() }) {
    if (!['passkey-prf', 'door-secret'].includes(doorMode)) throw new Error('door_mode must be passkey-prf or door-secret')
    return { v: 1, kind: 'claim', lookup, site, reader: { sign_pub: reader.bundle.sign, encrypt_pub: reader.bundle.encrypt }, mailbox, door_mode: doorMode, at }
}
/** Sealed to the agent's encryption key (envelope v2) and signed by the reader (keys.js seal, as message.js does): the .enc text. */
export function sealClaim(claim, agentBundle, reader) {
    return K.seal(agentBundle, JSON.stringify(claim), { sign: reader.private.sign, fingerprint: reader.bundle.signing_fingerprint })
}

/** A mailbox message: sealed to the reader, the inner object signed by the issuer, its n the one asked for. */
export async function openMailbox(enc, { reader, issuers, n }) {
    const r = await K.unseal(reader.private.encrypt, enc)
    if (r.text == null) throw new Error('the message is not text')
    const m = JSON.parse(r.text)
    const b = issuers.get(m.issuer)
    if (!b) throw new Error('the message is signed by an issuer this site does not pin')
    if (!(await K.verifyStatement(m, b.sign))) throw new Error('the issuer’s signature on the message does not check')
    if (m.n !== n) throw new Error('the message is not number ' + n)
    return m
}
