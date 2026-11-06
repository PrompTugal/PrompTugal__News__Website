// The issuer's side, for the onboarding tests (what observability@'s sweep does in Python, in JS): an API key, a licence
// file, a signed pool, a message. Shared by test_onboard_core.mjs and test_onboard_browser.mjs.
import * as K from '../../../assets/vendor/pki/2026-11-06/keys.js'
import * as O from '../../../assets/onboard/onboard-core.js'

const te = new TextEncoder()
const subtle = globalThis.crypto.subtle
export const mintApiKey = () => 'sgk_' + K.hex(globalThis.crypto.getRandomValues(new Uint8Array(16)))
export async function mintLicence(apiKey, issuer, o = {}) {
    const { lookup, kenc } = await O.derive(o.derivedFrom || apiKey)
    const inner = { v: 1, kind: 'licence', lookup: o.lookup || lookup, access_key: o.access_key ?? 'pilot-token-for-tests', access_key_name: 'pilot-shared-test', plan: 'pilot',
        limits: { vaults: 5, bytes: 104857600 }, issued: '2026-11-06T17:00:00Z', not_after: o.not_after || '2027-02-06T00:00:00Z', issuer: issuer.bundle.signing_fingerprint }
    const signed = await O.signSigned(inner, (o.signWith || issuer).private.sign)
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const key = await subtle.importKey('raw', (await O.derive(o.encryptFor || apiKey)).kenc, 'AES-GCM', false, ['encrypt'])
    const c = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, te.encode(JSON.stringify(signed))))
    return { path: `licences/${lookup}.json`, file: { v: 1, iv: K.b64(iv), c: K.b64(c) }, signed }
}
export const mintPool = (issuer, keys, o = {}) => O.signSigned({ v: 1, kind: 'pool', issuer: o.issuer || issuer.bundle.signing_fingerprint, updated: '2026-11-06T17:00:00Z', entries: keys.map(k => ({ api_key: k, added: '2026-11-06T17:00:00Z' })) }, (o.signWith || issuer).private.sign)
export const mintMessage = async (issuer, reader, n, body = { api_key: 'sgk_' + '0'.repeat(32) }, o = {}) => {
    const m = await O.signSigned({ v: 1, kind: o.kind || 'welcome', n, in_reply_to: 'sha256:' + '1'.repeat(64), body, at: '2026-11-06T18:00:00Z', issuer: issuer.bundle.signing_fingerprint }, (o.signWith || issuer).private.sign)
    return { v: 1, envelope: await K.seal(reader.bundle, JSON.stringify(m), null) }
}

