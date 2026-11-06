/* passkey.js: sign in with a passkey (WebAuthn, discoverable credential, PRF extension) to open the person's own
 * vault key, the same on every device the passkey syncs to. Design and its open questions for security@:
 * board/team/dev.search/design/passkey-vault.md. It proves no person (verified stays the person-key signature in
 * login.js); it derives a key. Nothing is stored or sent: the key is a non-extractable CryptoKey in this page's memory.
 * Acts only on a page with the .pt-passkey hook (content/login.md): it defines nothing elsewhere. Words: content/login.md.
 */
(function (w, d) {
    'use strict'
    const root = d.querySelector('.pt-passkey')
    if (!root) return
    const te = new TextEncoder()
    const b64 = u8 => btoa(String.fromCharCode(...new Uint8Array(u8)))
    const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    let vaultKey = null, label = ''

    const supported = () => !!(w.PublicKeyCredential && navigator.credentials && w.crypto && w.crypto.subtle)
    const salt = () => crypto.subtle.digest('SHA-256', te.encode('promptugal.news vault v1'))
    async function keyFrom(prf) {
        const base = await crypto.subtle.importKey('raw', prf, 'HKDF', false, ['deriveKey'])
        return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: te.encode('vault-key') }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
    }
    const prfOf = cred => { const r = cred.getClientExtensionResults && cred.getClientExtensionResults().prf; return r && r.results && r.results.first ? r.results.first : null }
    const common = { rpId: w.location.hostname }

    // register: a discoverable credential that supports PRF (no fallback that stores a secret)
    async function register(name) {
        if (!supported()) throw new Error('this browser has no passkeys')
        const cred = await navigator.credentials.create({ publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { id: common.rpId, name: 'PrompTugal.news' },
            user: { id: crypto.getRandomValues(new Uint8Array(16)), name: name, displayName: name },
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
            authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
            extensions: { prf: {} },
        } })
        const ext = cred.getClientExtensionResults().prf
        if (!ext || !ext.enabled) throw new Error('this passkey cannot derive a key (no PRF): nothing was kept')
        return signIn()
    }
    // sign in: the passkey answers (any credential for this site), the PRF output becomes the vault key
    async function signIn() {
        if (!supported()) throw new Error('this browser has no passkeys')
        const cred = await navigator.credentials.get({ publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)), rpId: common.rpId, userVerification: 'required',
            extensions: { prf: { eval: { first: await salt() } } },
        } })
        const out = prfOf(cred)
        if (!out) throw new Error('this passkey did not return a key (no PRF)')
        vaultKey = await keyFrom(out)
        label = ''
        draw()
        return true
    }
    const lock = () => { vaultKey = null; draw() }
    async function seal(obj) {
        if (!vaultKey) throw new Error('the vault is locked: sign in with the passkey')
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, vaultKey, te.encode(JSON.stringify(obj)))
        return { v: 1, iv: b64(iv), ct: b64(ct) }
    }
    async function open(env) {
        if (!vaultKey) throw new Error('the vault is locked: sign in with the passkey')
        if (!env || env.v !== 1) throw new Error('unknown envelope')
        return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(env.iv) }, vaultKey, unb64(env.ct))))
    }
    w.PTPasskey = { supported, register, signIn, lock, seal, open, get unlocked() { return !!vaultKey } }

    const el = (tag, text, attrs) => { const e = d.createElement(tag); if (text != null) e.textContent = text; for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v); return e }
    function draw() {
        root.replaceChildren()
        const msg = el('p', '', { class: 'pt-login-msg', role: 'status' })
        const run = (fn, ok) => async () => { try { msg.textContent = '…'; await fn(); msg.textContent = ok } catch (e) { msg.textContent = e && e.message || String(e) } }
        if (!supported()) { root.append(el('p', 'No passkeys in this browser.')); return }
        const row = el('div', '', { class: 'pt-login-row' })
        if (vaultKey) {
            row.append(Object.assign(el('button', 'Lock', { type: 'button' }), { onclick: lock }))
            root.append(el('p', 'Vault key open, in this page only.'))
        } else {
            const name = el('input', '', { type: 'text', 'aria-label': 'A name for this passkey', placeholder: 'A name for this passkey', autocomplete: 'off' })
            row.append(Object.assign(el('button', 'Sign in with a passkey', { type: 'button' }), { onclick: run(signIn, '') }), name,
                Object.assign(el('button', 'Create a passkey', { type: 'button' }), { onclick: run(() => register(name.value.trim() || 'PrompTugal.news'), '') }))
        }
        root.append(row, msg)
    }
    draw()
})(window, document)
