/**
 * drop.js: the encrypted drop on /report/ (Dinis, 18 November 2026). The report is sealed in this browser to each
 * recipient's public key (pki.sgit.ai's v2 envelope: RSA-OAEP 4096 wraps a fresh AES-256-GCM key) and appended to a
 * write-only lane. No cookie, no IP kept by us, nothing identifying beyond what the reader writes. Until the lane is named
 * (api/v1/report/drop.json), the form says so and sends nothing. Every string is written with textContent.
 * dev@PrompTugal.dinis.
 */
import * as K from '../vendor/pki/2026-11-06/keys.js'

const root = typeof document !== 'undefined' ? document.getElementById('drop') : null
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }

/** The record appended to the lane: one sealed envelope per recipient; nothing about the reader. */
export async function sealReport(text, recipients, at = new Date()) {
    const body = JSON.stringify({ kind: 'promptugal.news/report-drop/v1', at: at.toISOString().slice(0, 16) + 'Z', text: String(text) })
    const envelopes = []
    for (const r of recipients) envelopes.push(r.kind === 'person' ? { to: r.fingerprint, ecies: await sealToPerson(r, body) } : { to: r.bundle.fingerprint, enc: await K.seal(r.bundle, body) })
    return { v: 1, kind: 'promptugal.news/report-drop/v1', envelopes }
}

/** ws-ecies-1 (newsroom/tools/person-key.mjs, assets/login/keyring.js): an ephemeral P-256 key, ECDH with the person's
 *  key, HKDF-SHA256 (empty salt, info "ws-ecies-1") to AES-256-GCM; ct is the ciphertext and its tag, base64. */
export async function sealToPerson(r, text) {
    const S = globalThis.crypto.subtle, te = new TextEncoder()
    const pub = await S.importKey('jwk', { ...r.encrypt, ext: true }, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
    const eph = await S.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
    const secret = await S.deriveBits({ name: 'ECDH', public: pub }, eph.privateKey, 256)
    const hk = await S.importKey('raw', secret, 'HKDF', false, ['deriveKey'])
    const key = await S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('ws-ecies-1') }, hk, { name: 'AES-GCM', length: 256 }, false, ['encrypt'])
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const ct = new Uint8Array(await S.encrypt({ name: 'AES-GCM', iv }, key, te.encode(text)))
    const e = await S.exportKey('jwk', eph.publicKey)
    return { v: 'ws-ecies-1', to: r.id, key: r.fingerprint, by: 'promptugal.news/report', at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), epk: { kty: 'EC', crv: 'P-256', x: e.x, y: e.y }, iv: K.b64(iv), ct: K.b64(ct) }
}

async function main() {
    if (!root) return
    let d
    try { d = await (await fetch(new URL('../api/v1/report/drop.json', location.href).href, { credentials: 'omit', referrerPolicy: 'no-referrer' })).json() }
    catch (e) { root.replaceChildren(el('p', 'note', 'The encrypted form could not load. Use the public issue or the email above.')); return }
    root.replaceChildren()
    root.append(el('h2', '', 'The encrypted form'))
    root.append(el('p', 'note', `Readable only by: ${d.recipients.map(r => `${r.who} (${r.fingerprint})`).join(' and ')}.`))
    const ta = el('textarea', 'drop-text'); ta.rows = 7; ta.maxLength = 8000
    ta.placeholder = 'What is wrong, and where (a link helps). Add a way to answer you only if you want an answer.'
    const go = el('button', 'btn', 'Encrypt and send'); go.type = 'button'
    const out = el('p', 'drop-status')
    root.append(ta, go, out)
    if (!d.lane || !d.lane.vault_id || !d.lane.append_token) {
        go.disabled = true
        out.textContent = 'This form opens as soon as its lane is set up. Until then, please use the public issue or the email above.'
        return
    }
    go.onclick = async () => {
        const text = ta.value.trim()
        if (!text) { out.textContent = 'Write something first.'; return }
        go.disabled = true; out.textContent = 'Encrypting in this browser…'
        try {
            const payload = await sealReport(text, d.recipients)
            const r = await fetch(`${d.lane.endpoint}/api/vault/append/write/${d.lane.vault_id}`, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer',
                headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: d.lane.append_token, payload }) })
            if (!r.ok) throw new Error(`the lane answered ${r.status}`)
            ta.value = ''; out.textContent = 'Sent, encrypted. Thank you: it is read at the next check, about hourly.'
        } catch (e) { out.textContent = 'Not sent: ' + e.message + '. Please use the public issue or the email above.'; go.disabled = false }
    }
}
if (typeof document !== 'undefined') main()
