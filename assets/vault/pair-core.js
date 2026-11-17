/**
 * pair-core.js: one reader across devices, step 1 (board/spec-one-reader-across-devices.md; the pass and security@'s
 * pre-review with conditions P1 to P10: board/passes/2026-11-17-pairing-step-1.md). The protocol only, no page and no
 * network: the device key, the pairing offer, its checks, the match code, and a hello sealed and signed for a dry run.
 * Runs in the browser and in Node 18+ (newsroom/tests/pair.test.mjs). dev@PrompTugal.dinis, 17 November 2026.
 *
 * The device's private keys are non-extractable CryptoKeys: they sign and unwrap here and are never exported. Everything
 * public (the bundle, fingerprints, the k1 code, the envelope) is pki.sgit.ai's own code, vendored and pinned
 * (assets/vendor/pki/2026-11-06/), so a hello made here opens with `sgit pki` and with keys.js's unseal.
 *
 * @module pair-core
 */
import * as K from '../vendor/pki/2026-11-06/keys.js'
import { keyCode, parseKeyCode } from '../vendor/pki/2026-11-06/message.js'

export const OFFER_KIND = 'promptugal.news/pair/v1'
export const HELLO_KIND = 'promptugal.news/pair-hello/v1'
export const OFFER_MINUTES = 10
// P5: the offer holds only the spec's fields, and nothing else is accepted
const OFFER_FIELDS = ['v', 'kind', 'device', 'name', 'key', 'lane', 'nonce', 'expires']
const LANE_FIELDS = ['vault', 'token', 'endpoint']
const ENDPOINT = 'https://dev.send.sgraph.ai'
const subtle = () => globalThis.crypto.subtle
const NONCE = /^[A-Za-z0-9_-]{22}$/   // 16 bytes, base64url, no padding

/**
 * A new device identity: two non-extractable private keys and the public bundle. The caller stores the CryptoKeys
 * (IndexedDB keeps them as they are; their bytes can never be read back).
 */
export async function newDevice(label = '') {
    const enc = await subtle().generateKey(K.RSA_GEN, false, ['encrypt', 'decrypt'])
    const sig = await subtle().generateKey(K.EC, false, ['sign', 'verify'])
    const encSpki = new Uint8Array(await subtle().exportKey('spki', enc.publicKey))
    const sigSpki = new Uint8Array(await subtle().exportKey('spki', sig.publicKey))
    const bundle = await K.bundleOf(encSpki, sigSpki, cleanName(label))
    return { bundle, keys: { decrypt: enc.privateKey, sign: sig.privateKey }, created: new Date().toISOString() }
}

/** A device name as the reader typed it: printable, one line, at most 60 characters (never the full user agent). */
export const cleanName = s => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60)

/** The pairing offer device A shows (spec, "The QR code"): valid OFFER_MINUTES minutes, its nonce single use. */
export function makeOffer(device, { name = '', lane = null, now = new Date() } = {}) {
    return {
        v: 1, kind: OFFER_KIND, device: device.bundle.signing_fingerprint, name: cleanName(name || device.bundle.label),
        key: keyCode(device.bundle).code,
        lane: lane ? { vault: String(lane.vault), token: String(lane.token), endpoint: ENDPOINT } : null,
        nonce: K.b64url(globalThis.crypto.getRandomValues(new Uint8Array(16))),
        expires: new Date(now.getTime() + OFFER_MINUTES * 60e3).toISOString().replace(/\.\d+Z$/, 'Z'),
    }
}

/** The offer as the text a QR code, the Copy button and the link carry; and the link (the offer in the #fragment only). */
export const offerText = offer => JSON.stringify(offer)
export const offerLink = (offer, base = 'https://promptugal.news/') => `${base}account/pair.html#${K.b64url(K.utf8(offerText(offer)))}`

/**
 * Read an offer from what was pasted, scanned or opened (JSON, a link or the bare fragment). Returns { offer, bundle,
 * problems }: the offer is used only when problems is empty (P7: fingerprint, expiry and nonce checked before acting).
 * seen(nonce) answers whether this device has met the nonce before (P2 and replay).
 */
export async function readOffer(text, { now = new Date(), seen = () => false } = {}) {
    const problems = []
    let s = String(text || '').trim()
    const frag = /#([A-Za-z0-9_-]+)\s*$/.exec(s)
    if (frag && !s.startsWith('{')) { try { s = K.fromUtf8(K.unb64url(frag[1])) } catch (e) { return { offer: null, bundle: null, problems: ['the link holds no pairing offer'] } } }
    let o
    try { o = JSON.parse(s) } catch (e) { return { offer: null, bundle: null, problems: ['not a pairing offer (not JSON)'] } }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return { offer: null, bundle: null, problems: ['not a pairing offer'] }
    const extra = Object.keys(o).filter(k => !OFFER_FIELDS.includes(k))
    if (extra.length) problems.push(`fields that a pairing offer never holds: ${extra.join(', ')}`)
    if (o.v !== 1 || o.kind !== OFFER_KIND) problems.push('not a promptugal.news pairing offer (kind or version)')
    if (!K.FP.test(o.device || '')) problems.push('no device fingerprint')
    if (!NONCE.test(o.nonce || '')) problems.push('no valid nonce')
    const exp = Date.parse(o.expires || '')
    if (!Number.isFinite(exp)) problems.push('no expiry')
    else if (exp <= now.getTime()) problems.push('the offer has expired')
    else if (exp - now.getTime() > (OFFER_MINUTES + 1) * 60e3) problems.push('the offer claims to last longer than ten minutes')
    if (o.lane !== null && o.lane !== undefined) {
        const l = o.lane
        if (typeof l !== 'object' || Object.keys(l).some(k => !LANE_FIELDS.includes(k)) || !l.vault || !l.token || l.endpoint !== ENDPOINT) problems.push(`the lane is not an append lane on ${ENDPOINT}`)
    }
    if (o.nonce && await seen(o.nonce)) problems.push('this offer was used already')
    let bundle = null
    try { bundle = await parseKeyCode(o.key) } catch (e) { bundle = null }
    if (!bundle) problems.push('no public key in the offer')
    else {
        const bad = await K.checkBundle(bundle)
        if (bad.length) problems.push(...bad)
        else if (bundle.signing_fingerprint !== o.device) problems.push('the key in the offer is not the device it names')
    }
    return { offer: problems.length ? null : { ...o, name: cleanName(o.name) }, bundle: problems.length ? null : bundle, problems }
}

/**
 * P1: the match code both screens show and the reader confirms: six digits from SHA-256(nonce, A's fingerprint, B's).
 * Not fingerprint prefixes (those can be ground); A is always the device that showed the offer.
 */
export async function matchCode(nonce, fpA, fpB) {
    const h = await K.sha256(K.utf8(`promptugal.news/pair-match/v1\n${nonce}\n${fpA}\n${fpB}`))
    const n = ((h[0] << 24) >>> 0) + (h[1] << 16) + (h[2] << 8) + h[3]
    return String(n % 1e6).padStart(6, '0')
}

/** The hello B sends to A's lane (protocol step 3): sealed to A's encryption key, signed by B's device key. */
export async function makeHello(device, offer, aBundle, { name = '', lane = null, at = new Date() } = {}) {
    const body = { kind: HELLO_KIND, nonce: offer.nonce, device: device.bundle.signing_fingerprint, key: keyCode(device.bundle).code,
        name: cleanName(name || device.bundle.label), lane: lane ? { vault: String(lane.vault), token: String(lane.token), endpoint: ENDPOINT } : null,
        to: offer.device, at: at.toISOString() }
    return sealSigned(aBundle, K.utf8(JSON.stringify(body)), device)
}

/**
 * A opens a hello (protocol step 4) with its non-extractable key, and checks it before anything is shown (P7): the
 * signature by the key inside the hello, that key's fingerprint, the nonce of this offer, and that it is addressed to A.
 * P2 (the first hello wins) is the caller's: it closes the offer once a hello is accepted.
 */
export async function openHello(device, offer, enc) {
    const env = K.parseEnvelope(enc)
    let raw
    try { raw = await subtle().decrypt(K.RSA, device.keys.decrypt, K.unb64(env.w)) } catch (e) { return { ok: false, problems: ['not sealed to this device'] } }
    const aes = await subtle().importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt'])
    let bytes
    try { bytes = new Uint8Array(await subtle().decrypt({ name: 'AES-GCM', iv: K.unb64(env.i), tagLength: 128 }, aes, K.unb64(env.c))) }
    catch (e) { return { ok: false, problems: ['changed on the way'] } }
    let h; try { h = JSON.parse(K.fromUtf8(bytes)) } catch (e) { return { ok: false, problems: ['not a hello'] } }
    const problems = []
    if (!h || h.kind !== HELLO_KIND) problems.push('not a pairing hello')
    if (h.nonce !== offer.nonce) problems.push('the hello is for another offer')
    if (h.to !== offer.device) problems.push('the hello is addressed to another device')
    let b = null
    try { b = await parseKeyCode(h.key) } catch (e) { b = null }
    if (!b || (await K.checkBundle(b)).length) problems.push('no valid public key in the hello')
    else if (b.signing_fingerprint !== h.device) problems.push('the key in the hello is not the device it names')
    if (!env.s || !env.f) problems.push('the hello is not signed')
    else if (b && env.f !== b.signing_fingerprint) problems.push('signed by another key than the one it carries')
    else if (b && !(await K.verifyBytes(b.sign, K.unb64(env.s), K.unb64(env.c)))) problems.push('the signature does not check')
    if (problems.length) return { ok: false, problems }
    return { ok: true, problems: [], hello: { ...h, name: cleanName(h.name) }, bundle: b }
}

/** Seal bytes to a bundle and sign the ciphertext with a device's non-extractable signing key: keys.js's v2 envelope. */
export async function sealSigned(toBundle, bytes, device) {
    const pub = await subtle().importKey('spki', K.unpem(toBundle.encrypt).der, K.RSA, false, ['encrypt'])
    const aes = await subtle().generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const c = new Uint8Array(await subtle().encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, bytes))
    const w = new Uint8Array(await subtle().encrypt(K.RSA, pub, new Uint8Array(await subtle().exportKey('raw', aes))))
    const s = new Uint8Array(await subtle().sign(K.ECDSA, device.keys.sign, c))
    return btoa(JSON.stringify({ v: 2, w: K.b64(w), i: K.b64(iv), c: K.b64(c), s: K.b64(s), f: device.bundle.signing_fingerprint }))
}
