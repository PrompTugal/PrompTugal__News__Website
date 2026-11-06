// Vault onboarding, the pure half (assets/onboard/onboard-core.js): the API key's two derived values, the pinned issuer,
// the pool and licence checks, the signed claim, the mailbox. The issuer's side below is the reference the sweep agent's
// Python must match (assets/onboard/test-vectors.json, made once with --write-vectors, then only checked).
//   node newsroom/build/tests/test_onboard_core.mjs [--write-vectors]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as K from '../../../assets/vendor/pki/2026-11-06/keys.js'
import * as O from '../../../assets/onboard/onboard-core.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const VEC = path.join(ROOT, 'assets/onboard/test-vectors.json')
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
const rejects = async (fn, re, what) => { try { await fn(); check(false, what) } catch (e) { check(re.test(e.message), `${what} (${e.message})`) } }
const te = new TextEncoder()
const subtle = globalThis.crypto.subtle

import { mintApiKey, mintLicence, mintPool, mintMessage } from './onboard-fixtures.mjs'

if (process.argv.includes('--write-vectors')) {
    const issuer = await K.generate('issuer vector'), apiKey = 'sgk_00112233445566778899aabbccddeeff'
    const lic = await mintLicence(apiKey, issuer), d = await O.derive(apiKey)
    fs.writeFileSync(VEC, JSON.stringify({
        about: ['Test vectors for the licence format ', '(board/spec-vault-onboarding.md), for the sweep agent to ', 'match: HKDF-SHA256 over the UTF-8 of ', 'the API key (prefix included), empty ', 'salt, the two info labels; AES-256-GCM, ', '12-byte IV, 128-bit tag appended to ', 'c, no AAD; the signature is ', 'ECDSA P-256 over SHA-256 of canonical ', 'JSON (keys sorted, compact, no trailing ', 'newline, sig left out). ', 'The issuer here is a throwaway ', 'key made for the vectors.'].join(''),
        info: O.INFO, api_key: apiKey, lookup: d.lookup, kenc_hex: K.hex(d.kenc), issuer_sign_pem: issuer.bundle.sign, issuer_signing_fingerprint: issuer.bundle.signing_fingerprint,
        licence_path: lic.path, licence_file: lic.file, licence_signed: lic.signed, canonical_bytes_utf8: K.canon((({ sig, ...r }) => r)(lic.signed)),
    }, null, 2) + '\n')
    console.log('wrote', VEC); process.exit(0)
}

console.log('making keys (slow: RSA 4096)…')
const issuer = await K.generate('issuer'), other = await K.generate('other'), agent = await K.generate('agent'), reader = await K.generate('reader')
const keysJson = { keys: [{ id: 'issuer-x', bundle: issuer.bundle, status: 'active' }, { id: 'other-x', bundle: other.bundle, status: 'active' }] }
const issuers = await O.issuersFrom([issuer.bundle.signing_fingerprint], keysJson)

// derive
const k1 = mintApiKey(), k2 = mintApiKey(), d1 = await O.derive(k1), d1b = await O.derive(k1), d2 = await O.derive(k2)
check(/^[0-9a-f]{32}$/.test(d1.lookup) && d1.kenc.length === 32, 'derive: 32 hex, 32 bytes')
check(d1.lookup === d1b.lookup && K.hex(d1.kenc) === K.hex(d1b.kenc) && d1.lookup !== d2.lookup, 'derive: stable, and different per key')
check(!K.hex(d1.kenc).startsWith(d1.lookup), 'derive: lookup reveals nothing (two labels)')
await rejects(() => O.derive('not-a-key'), /not an API key/, 'derive: refuses a malformed API key')

// the vectors file: the format the agent must match
if (fs.existsSync(VEC)) {
    const v = JSON.parse(fs.readFileSync(VEC, 'utf8')), dv = await O.derive(v.api_key)
    check(dv.lookup === v.lookup && K.hex(dv.kenc) === v.kenc_hex, 'vectors: lookup and key match the file')
    const bv = { v: 1, sign: v.issuer_sign_pem, encrypt: v.issuer_sign_pem, label: '', fingerprint: '', signing_fingerprint: v.issuer_signing_fingerprint }
    const iv = await O.issuersFrom([v.issuer_signing_fingerprint], { keys: [{ id: 'v', bundle: bv }] })
    const lic = await O.openLicence(v.licence_file, v.api_key, { issuers: iv, now: new Date('2026-12-01T00:00:00Z') })
    check(lic.access_key && K.canon((({ sig, ...r }) => r)(lic)) === v.canonical_bytes_utf8, 'vectors: licence opens, same canonical bytes')
} else check(false, 'vectors: assets/onboard/test-vectors.json is missing (node …/test_onboard_core.mjs --write-vectors)')

// issuers
check(issuers.size === 1 && issuers.has(issuer.bundle.signing_fingerprint), 'issuers: only the pinned fingerprint')

// pool
const pool = await mintPool(issuer, [k1, k2])
check(await O.verifyPool(pool, issuers), 'pool: pinned issuer verifies')
check(!(await O.verifyPool({ ...pool, entries: [...pool.entries, { api_key: mintApiKey(), added: 'x' }] }, issuers)), 'pool: entry added later fails')
check(!(await O.verifyPool(await mintPool(other, [k1]), issuers)), 'pool: unpinned signer refused')
check(!(await O.verifyPool(await mintPool(issuer, [k1], { signWith: other }), issuers)), 'pool: pinned name, wrong key')
check(O.pick(pool).api_key.startsWith('sgk_') && O.pick({ entries: [] }) === null, 'pool: one entry, or null')

// licence
const lic = await mintLicence(k1, issuer)
const open = await O.openLicence(lic.file, k1, { issuers })
check(open.access_key === 'pilot-token-for-tests' && open.lookup === d1.lookup, 'licence: opens, carries the access key')
await rejects(() => O.openLicence(lic.file, k2, { issuers }), /does not open/, 'licence: another API key cannot open it')
const flipped = { ...lic.file, c: K.b64(Uint8Array.from(K.unb64(lic.file.c), (b, i) => i === 5 ? b ^ 1 : b)) }
await rejects(() => O.openLicence(flipped, k1, { issuers }), /does not open/, 'licence: a changed byte is caught')
const moved = await mintLicence(k1, issuer, { lookup: d2.lookup })
await rejects(() => O.openLicence(moved.file, k1, { issuers }), /another path/, 'licence: copied to another path')
const forged = await mintLicence(k1, issuer, { signWith: other })
await rejects(() => O.openLicence(forged.file, k1, { issuers }), /signature/, 'licence: a forged signature is refused')
const unpinned = await mintLicence(k1, other)
await rejects(() => O.openLicence(unpinned.file, k1, { issuers }), /does not pin/, 'licence: unpinned issuer refused')
const old = await mintLicence(k1, issuer, { not_after: '2026-11-01T00:00:00Z' })
await rejects(() => O.openLicence(old.file, k1, { issuers, now: new Date('2026-11-06T00:00:00Z') }), /expired/, 'licence: an expired licence is refused')
const empty = await mintLicence(k1, issuer, { access_key: '' })
await rejects(() => O.openLicence(empty.file, k1, { issuers }), /no access key/, 'licence: no access key refused')

// claim
const mailbox = O.newMailboxId()
check(/^[0-9a-f]{32}$/.test(mailbox) && mailbox !== O.newMailboxId(), 'claim: random 32-hex mailbox')
const claim = O.claimFor({ lookup: d1.lookup, reader, mailbox, doorMode: 'passkey-prf', at: '2026-11-06T17:03:12Z' })
const enc = await O.sealClaim(claim, agent.bundle, reader)
const opened = await K.unseal(agent.private.encrypt, enc, [reader.bundle])
check(opened.verified === true && opened.signer === reader.bundle.signing_fingerprint, 'claim: agent opens, signature checks')
check(JSON.parse(opened.text).mailbox === mailbox && JSON.parse(opened.text).lookup === d1.lookup, 'claim: lookup and mailbox inside')
check(!opened.text.includes(k1) && !opened.text.includes('pilot-token-for-tests') && !/door_secret|passphrase|private/i.test(opened.text), 'claim: no key or door secret')
const bystander = await K.unseal(other.private.encrypt, enc).then(() => 'opened', () => 'closed')
check(bystander === 'closed', 'claim: nobody but the agent opens it')
try { O.claimFor({ lookup: 'x', reader, mailbox, doorMode: 'nothing' }); check(false, 'claim: refuses an unknown door mode') } catch (e) { check(/door_mode/.test(e.message), 'claim: refuses an unknown door mode') }

// mailbox
const m1 = await mintMessage(issuer, reader, 1)
const got = await O.openMailbox(m1, { reader, issuers, n: 1 })
check(got.kind === 'welcome' && got.body.api_key.startsWith('sgk_'), 'mailbox: opens, issuer signature checks')
await rejects(() => O.openMailbox(m1, { reader, issuers, n: 2 }), /not number 2/, 'mailbox: replay at a later n')
const mForged = await mintMessage(issuer, reader, 1, undefined, { signWith: other })
await rejects(() => O.openMailbox(mForged, { reader, issuers, n: 1 }), /signature/, 'mailbox: wrong signer refused')
await rejects(() => O.openMailbox(m1, { reader: other, issuers, n: 1 }), /not sealed to this key/, 'mailbox: only its reader opens it')

console.log(failed ? `\n${failed} FAILED` : '\nALL ONBOARDING CORE CHECKS PASS')
process.exit(failed ? 1 : 0)
