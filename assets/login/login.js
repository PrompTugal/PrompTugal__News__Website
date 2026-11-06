// Sign in to PrompTugal.news with the key a conductor issued you (Dinis, 6 November 2026). The key is a pair of P-256
// keys in a link (https://promptugal.news/login/#key=...), handed over as a QR code by the conductor
// (newsroom/tools/person-key.mjs). assets/login/keyring.js (window.PTKeyring) takes it into this browser as
// non-extractable keys in IndexedDB; this script proves it: it signs a fresh challenge with the browser's key and
// verifies the signature against the person's public key in board/person-keys.json. Signing in identifies you to the
// parts of the site that act for a person (the drain on /newsroom/observability/); every page stays public.
//
//   window.PTLogin: { ready (a promise of the state), state(), signIn(text), signOut() }
//   state: { person, fingerprint, verified (true | false), status ('signed-out' | 'verified' | 'replaced' | 'unknown' |
//            'mismatch' | 'no-crypto' | 'elsewhere'), entry (the public record, or null) }
//   event 'pt:login' on window, with the state, whenever it changes; tool auth.whoami (read) on window.__tool.
//
// On every page: a small chip in #nr-tools once you are signed in. On /login/: the sign-in panel (.pt-login, a layout hook in content/login.md): scan the
// QR code with the camera, choose or paste or drop a picture of it, or paste the link. QR codes are read with the browser's
// BarcodeDetector where it has one, else with jsQR (assets/vendor/jsqr/1.4.0/, loaded only then).
(() => {
    'use strict'
    const S = window.crypto && window.crypto.subtle, te = new TextEncoder()
    const site = () => window.NRSite || { url: r => r, mount: () => null, fetchJSON: async r => (await fetch(r)).json() }
    const h = (tag, attrs = {}, kids = []) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v) } for (const c of [].concat(kids)) e.append(c); return e }
    const fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    const title = p => p ? p.charAt(0).toUpperCase() + p.slice(1) : ''
    let state = { person: '', fingerprint: '', verified: false, status: 'signed-out', entry: null }

    // the keyring loads only on the pages that use the key (S1): elsewhere there is no key to wait for
    const HERE = !!document.querySelector('script[src*="login/keyring.js"]')
    async function keyring() {
        if (!HERE) return null
        for (let i = 0; i < 50 && !window.PTKeyring; i++) await new Promise(r => setTimeout(r, 50))
        const KR = window.PTKeyring; if (KR) await KR.ready.catch(() => { }); return KR
    }
    async function register() {
        try { const r = await fetch(site().url('board/person-keys.json'), { cache: 'no-cache' }); return (await r.json()).keys || [] } catch { return [] }
    }
    // the proof: the browser's private key signs a fresh challenge; the published public key must verify it
    async function check() {
        const KR = await keyring()
        if (!HERE) return set({ person: '', fingerprint: '', verified: false, status: 'elsewhere', entry: null })
        if (!S || !KR) return set({ person: '', fingerprint: '', verified: false, status: 'no-crypto', entry: null })
        if (!KR.person) return set({ person: '', fingerprint: '', verified: false, status: 'signed-out', entry: null })
        const keys = await register(), entry = keys.find(k => k.fingerprint === KR.fingerprint) || null
        const base = { person: KR.person, fingerprint: KR.fingerprint, verified: false, entry }
        if (!entry) return set({ ...base, status: 'unknown' })
        if (entry.person !== KR.person) return set({ ...base, status: 'mismatch' })
        const challenge = `promptugal.news/login ${KR.fingerprint} ${new Date().toISOString()} ${[...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join('')}`
        let ok = false
        try {
            const pub = await S.importKey('jwk', { ...entry.sign, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify'])
            ok = await S.verify({ name: 'ECDSA', hash: 'SHA-256' }, pub, fromB64(await KR.sign(challenge)), te.encode(challenge))
        } catch { ok = false }
        if (!ok) return set({ ...base, status: 'mismatch' })
        return set({ ...base, verified: entry.status === 'active', status: entry.status === 'active' ? 'verified' : 'replaced' })
    }
    function set(s) { state = s; try { window.dispatchEvent(new CustomEvent('pt:login', { detail: s })) } catch { } drawChip(); drawPanel(); return s }

    async function signIn(text) {
        const KR = await keyring(); if (!KR) throw new Error('this browser cannot hold a key here (no IndexedDB or Web Crypto)')
        await KR.add(String(text || '').trim()); return check()
    }
    async function signOut() { const KR = await keyring(); if (KR) await KR.lock(); return check() }

    // the chip: only once someone is signed in, so a reader's page is unchanged
    let chip = null
    function drawChip() {
        const tools = site().mount('nr-tools'); if (!tools) return
        if (!state.person) { if (chip) { chip.remove(); chip = null } return }
        if (!chip) { chip = h('a', { class: 'pt-login-chip' }); tools.prepend(chip) }
        chip.href = site().url('login/index.html')
        chip.className = 'pt-login-chip ' + (state.verified ? 'ok' : 'warn')
        chip.title = state.verified ? `signed in as ${title(state.person)} (key ${state.fingerprint}, verified against board/person-keys.json)` : `a key for ${title(state.person)} is in this browser but is not verified (${state.status})`
        chip.textContent = (state.verified ? '● ' : '○ ') + title(state.person)
    }

    // the panel on /login/
    const SAY = {
        'signed-out': 'You are not signed in on this browser.',
        verified: 'Signed in. Your browser signed a fresh challenge and your published key verified it.',
        replaced: 'This browser holds a key that has since been replaced: ask the conductor for your new QR code, then sign in again.',
        unknown: 'This browser holds a key that is not in board/person-keys.json: it may have been issued on another site. Sign out and sign in with the QR code the conductor gave you.',
        mismatch: 'This browser holds a key whose signature does not match its published key. Sign out and sign in again.',
        'elsewhere': 'Your key is not used on this page.',
        'no-crypto': 'This browser cannot hold a key here (it needs IndexedDB and Web Crypto, over HTTPS).',
    }
    let panel = null, msg = null, video = null, stream = null
    function drawPanel() {
        panel = document.querySelector('#pt-login, .pt-login'); if (!panel) return
        stopCamera(); panel.textContent = ''
        const st = state
        panel.append(h('div', { class: 'pt-login-state ' + (st.verified ? 'ok' : st.person ? 'warn' : '') }, [
            h('p', { class: 'pt-login-who' }, [st.person ? h('b', { text: title(st.person) }) : 'Signed out', st.person ? ` · key ${st.fingerprint}` : '']),
            h('p', { text: SAY[st.status] || '' }),
            st.entry ? h('p', { class: 'pt-login-meta', text: `Issued ${String(st.entry.issued_at || '').slice(0, 16).replace('T', ' ')} UTC by ${st.entry.issued_by || 'a conductor'}; ${st.entry.valid || ''}.` }) : '',
            st.person ? h('button', { type: 'button', class: 'pt-login-out', text: 'Sign out on this browser', onclick: () => signOut() }) : '',
        ]))
        if (st.verified) return
        wirePaste()
        msg = h('p', { class: 'pt-login-msg', role: 'status' })
        const paste = h('textarea', { rows: '3', placeholder: 'https://promptugal.news/login/#key=…', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'your sign-in link' })
        const file = h('input', { type: 'file', accept: 'image/*', hidden: '', onchange: () => file.files[0] && readImage(file.files[0]) })
        video = h('video', { playsinline: '', muted: '', hidden: '', class: 'pt-login-video' })
        panel.append(h('div', { class: 'pt-login-ways' }, [
            h('h2', { text: 'Sign in with your QR code' }),
            h('div', { class: 'pt-login-row' }, [
                h('button', { type: 'button', text: 'Scan it with the camera', onclick: () => startCamera() }),
                h('button', { type: 'button', text: 'Choose a picture of it', onclick: () => file.click() }), file,
                h('button', { type: 'button', text: 'Paste the QR code', onclick: () => pasteFromClipboard() }),
            ]),
            video,
            h('label', { text: 'Or paste the QR code (a copied image: Ctrl or Cmd+V, or drop it here) or the link it holds:' }), paste,
            h('button', { type: 'button', text: 'Sign in', onclick: () => tryText(paste.value) }),
            msg,
        ]))
    }
    const say = t => { if (msg) msg.textContent = t }
    // a QR code shared as an image: pasted (Ctrl or Cmd+V anywhere on the page), dropped, or read from the clipboard
    const imageOf = items => { for (const it of items || []) { const f = it.kind === 'file' ? it.getAsFile() : it; if (f && /^image\//.test(f.type)) return f } return null }
    let wired = false
    function wirePaste() {
        if (wired) return; wired = true
        document.addEventListener('paste', e => { if (!panel || !document.contains(panel) || state.verified) return; const f = imageOf(e.clipboardData && e.clipboardData.items); if (f) { e.preventDefault(); readImage(f) } })
        document.addEventListener('dragover', e => { if (panel && !state.verified && e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault() })
        document.addEventListener('drop', e => { if (!panel || state.verified) return; const f = imageOf(e.dataTransfer && e.dataTransfer.files); if (f) { e.preventDefault(); readImage(f) } })
    }
    async function pasteFromClipboard() {
        if (!navigator.clipboard || !navigator.clipboard.read) return say('This browser does not let the page read the clipboard: press Ctrl or Cmd+V on this page instead.')
        try {
            for (const item of await navigator.clipboard.read()) {
                const type = item.types.find(t => /^image\//.test(t))
                if (type) return readImage(await item.getType(type))
                if (item.types.includes('text/plain')) return tryText(await (await item.getType('text/plain')).text())
            }
            say('The clipboard holds no image or link. Copy the QR code first.')
        } catch (e) { say('Could not read the clipboard (' + (e && e.message || e) + '). Press Ctrl or Cmd+V on this page instead.') }
    }
    async function tryText(text) {
        if (!/key=|^[A-Za-z0-9_-]{100,}$/.test(String(text || '').trim())) return say('That is not a sign-in link: it should contain #key=.')
        say('Checking your key…')
        try { const s = await signIn(text); if (!s.verified) say(SAY[s.status]) } catch (e) { say('Could not sign in: ' + (e && e.message || e)) }
    }

    // reading a QR code: BarcodeDetector where there is one, else jsQR on the pixels
    let jsqrP = null
    const loadJsQR = () => jsqrP || (jsqrP = new Promise((ok, no) => { const s = document.createElement('script'); s.src = site().url('assets/vendor/jsqr/1.4.0/jsQR.js'); s.onload = () => ok(window.jsQR); s.onerror = () => no(new Error('could not load the QR reader')); document.head.append(s) }))
    async function decode(source, w, hgt) {
        if ('BarcodeDetector' in window) {
            try { const d = new window.BarcodeDetector({ formats: ['qr_code'] }); const r = await d.detect(source); if (r.length) return r[0].rawValue; return null } catch { }
        }
        const jsQR = await loadJsQR()
        const c = document.createElement('canvas'); c.width = w; c.height = hgt
        const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(source, 0, 0, w, hgt)
        const r = jsQR(g.getImageData(0, 0, w, hgt).data, w, hgt, { inversionAttempts: 'attemptBoth' })
        return r ? r.data : null
    }
    async function readImage(f) {
        say('Reading the picture…')
        try {
            const img = await createImageBitmap(f), scale = Math.min(1, 1600 / Math.max(img.width, img.height))
            const text = await decode(img, Math.round(img.width * scale), Math.round(img.height * scale))
            if (!text) return say('No QR code found in that picture. Try a sharper, closer picture, or paste the link.')
            await tryText(text)
        } catch (e) { say('Could not read that picture: ' + (e && e.message || e)) }
    }
    async function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return say('This browser gives no camera to the page. Choose a picture of the QR code instead.')
        try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }) } catch (e) { return say('No camera: ' + (e && e.message || e)) }
        video.srcObject = stream; video.hidden = false; await video.play().catch(() => { })
        say('Hold the QR code in front of the camera…')
        const tick = async () => {
            if (!stream) return
            if (video.videoWidth) {
                const text = await decode(video, video.videoWidth, video.videoHeight).catch(() => null)
                if (text) { stopCamera(); return tryText(text) }
            }
            setTimeout(tick, 250)
        }
        tick()
    }
    function stopCamera() { if (stream) { for (const t of stream.getTracks()) t.stop(); stream = null } if (video) video.hidden = true }

    ; (window.__toolQueue = window.__toolQueue || []).push(['register', 'auth.whoami', {
        level: 'read', description: 'Who is signed in on this browser (the person, their key fingerprint, and whether the key verified against board/person-keys.json). Never returns a key.',
        params: { type: 'object', properties: {} },
        run: async () => { await ready; const { entry, ...s } = state; return { ...s, issued_by: entry && entry.issued_by || null, login_page: site().url('login/index.html') } },
    }])
    const ready = (document.readyState === 'loading' ? new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true })) : Promise.resolve()).then(check)
    window.PTLogin = { ready, state: () => state, signIn, signOut }
})()
