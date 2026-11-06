// "I am interested in <product>, contact me" (customers@PrompTugal.dinis, 6 November 2026).
// A visitor's message, sealed in their browser to the customers inbox's public key and written to its append lane.
// The same envelope as assets/obs/obs.js (sgit hybrid envelope v2: RSA-OAEP-SHA256 + AES-256-GCM; the .enc text is
// base64 of the JSON {v, w, i, c}; the lane takes base64 of that text). Like obs.js's page events it is unsigned: a
// visitor has no key, and the lane's token is public, so who sent it is whatever the visitor typed, never proven.
// No server of ours, no cookie, no storage, no analytics, no host but the lane's own (config.endpoint).
// Nothing runs on import. Nothing is sent unless the page calls sendInterest from the visitor's press of Send.
//
//   import { sendInterest } from './interest.js'
//   const r = await sendInterest({ product, note, reach, name }, config)   // -> { ok: true } | { ok: false, why }
//
// config = { endpoint, vault_id, append_token, recipient: { encrypt: '<PEM public key>' } }, filled by the page from
// board/inboxes/customers.json at build time. A third argument { fetch, now } is for tests.

const MAX = { product: 120, note: 2000, reach: 300, name: 120 }

const b64 = bytes => { let s = ''; for (const x of new Uint8Array(bytes)) s += String.fromCharCode(x); return btoa(s) }
const unpem = pem => Uint8Array.from(atob(String(pem).replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
const clip = (v, n) => String(v == null ? '' : v).trim().slice(0, n)
const webcrypto = async () => globalThis.crypto && globalThis.crypto.subtle ? globalThis.crypto : (await import('node:crypto')).webcrypto

// the message, as the owner will read it
export function buildMessage(f, now = new Date()) {
    let page = ''; try { page = location.pathname } catch { }
    return { kind: 'interest', product: clip(f.product, MAX.product), note: clip(f.note, MAX.note), reach: clip(f.reach, MAX.reach),
        name: clip(f.name, MAX.name), page, sent: now.toISOString(), v: 1 }
}

// obs.js's seal(), unchanged but for the crypto source: returns the text the lane takes (base64 of the .enc text)
export async function seal(pem, text) {
    const C = await webcrypto(), S = C.subtle
    const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
    const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
    const iv = C.getRandomValues(new Uint8Array(12))
    const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
    const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
    return btoa(btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) })))
}

export async function sendInterest(fields, config, opts = {}) {
    try {
        const c = config || {}
        if (!c.endpoint || !c.vault_id || !c.append_token || !c.recipient || !c.recipient.encrypt) return { ok: false, why: 'not configured' }
        if (!/^https:\/\//.test(c.endpoint) && !opts.fetch) return { ok: false, why: 'endpoint must be https' }
        const msg = buildMessage(fields || {}, opts.now || new Date())
        if (!msg.product) return { ok: false, why: 'say which product' }
        if (!msg.reach) return { ok: false, why: 'say how to reach you' }
        const payload = await seal(c.recipient.encrypt, JSON.stringify(msg))
        const f = opts.fetch || globalThis.fetch
        const r = await f(`${String(c.endpoint).replace(/\/+$/, '')}/api/vault/append/write/${encodeURIComponent(c.vault_id)}`, {
            method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ append_token: c.append_token, payload }) })
        return r.ok ? { ok: true } : { ok: false, why: r.status === 507 ? 'the inbox is full for now, try again later' : `the inbox answered ${r.status}` }
    } catch (e) { return { ok: false, why: 'could not send: ' + (e && e.name || 'error') } }
}
