// Talk to us from the site (Dinis, 15 November 2026, about 23:30 UTC: "comment and give feedback on the website itself
// and get answers there"; conductor@'s routing). Built by dev.places@PrompTugal.dinis after the team site's feedback pane.
// On every page, at the foot of the main column:
//   a comment     kind, text and an optional quoted passage, sealed in this browser to the conductor's key (sgit hybrid
//                 envelope v2, as assets/obs/obs.js) and appended to the conductor's public, write-only lane
//                 (board/inbox.json public_lane). No name, no cookie, nothing that identifies the reader.
//   signed        a reader signed in (localStorage pt.me, set by assets/login/keyring.js) can send it signed instead: the
//                 draft goes to /talk/, the one page here that loads the keyring (security@'s S1), where the person key
//                 signs it and the conductor's answers, sealed to that key (ws-ecies-1), are opened in this browser only.
//   a vote        yes or no, through the page-view lane (window.PTObs.vote), with no identity.
// Every word is in assets/talk/talk.json (served as api/v1/talk/config.json with the lane). Never blocks the page.
(() => {
    'use strict'
    const script = document.currentScript
    const base = script ? script.src.replace(/talk\.js(\?.*)?$/, '') : '/assets/talk/'
    const root = base.replace(/assets\/talk\/$/, '')
    const page = location.href.split('#')[0].split('?')[0].replace(root, '').replace(/index\.html$/, '') || './'
    const SS = { get: k => { try { return sessionStorage.getItem('pt.talk.' + k) } catch { return null } }, set: (k, v) => { try { v === null ? sessionStorage.removeItem('pt.talk.' + k) : sessionStorage.setItem('pt.talk.' + k, v) } catch { } } }
    const me = (() => { try { return localStorage.getItem('pt.me') || '' } catch { return '' } })()
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    const fill = (s, v) => String(s || '').replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '')
    const CONTACT = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:\+|00)\d[\d\s().-]{7,}\d|\b\d{3}[\s.-]?\d{3}[\s.-]?\d{3,4}\b/
    const b64 = bytes => { let s = ''; for (const x of new Uint8Array(bytes)) s += String.fromCharCode(x); return btoa(s) }
    const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
    async function seal(pem, text) {
        const S = crypto.subtle
        const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
        const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
        const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
        return btoa(btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) })))
    }
    let cfgP = null
    const cfg = () => cfgP || (cfgP = fetch(root + 'api/v1/talk/config.json', { cache: 'no-cache' }).then(r => r.json()))
    async function send(message) {
        const c = await cfg()
        const payload = await seal(c.recipient.encrypt, JSON.stringify(message))
        const r = await fetch(`${c.endpoint}/api/vault/append/write/${c.vault_id}`, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer',
            headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: c.append_token, payload }) })
        if (!r.ok) throw new Error('lane ' + r.status)
    }
    // one comment format for the website and the app (promptugal/comment/v1, ios.places@'s proposal relayed by conductor@):
    // the signature, when there is one, is ECDSA P-256 SHA-256 raw r||s over kind\nperson\nat\nplace\nitem\ntext, checked
    // against the person's sign key in board/person-keys.json (newsroom/tools/person-key.mjs verify)
    const KIND = 'promptugal/comment/v1'
    const placeId = () => { const f = document.querySelector('.bp-frame[data-place]'); return f ? f.dataset.place : '' }
    const body = (d, version) => ({ kind: KIND, person: '', key: '', signing_key: '', at: new Date().toISOString(), place: d.place || '', item: d.item || '',
        title: d.title || '', page: d.page, text: d.text, feedback: '', from: 'web', topic: d.kind, quote: d.quote || null, site_version: version || null, signature: '' })
    const signedText = m => [m.kind, m.person, m.at, m.place, m.item, m.text].join('\n')

    // a passage the reader selected in the main column, quoted with the comment
    let quote = ''
    const main = document.getElementById('main') || document.querySelector('main')
    document.addEventListener('selectionchange', () => {
        try { const s = getSelection(), t = String(s || '').trim(); if (t && main && main.contains(s.anchorNode) && !s.anchorNode.parentElement.closest('.talk')) quote = t.slice(0, 400) } catch { }
    })

    async function pane(c) {
        const W = c.words, box = el('section', 'talk'); box.setAttribute('aria-labelledby', 'talk-h')
        const h = el('h2', null, W.heading); h.id = 'talk-h'; box.append(h, el('p', 'talk-lede', W.lede))
        // the vote
        const vote = el('div', 'talk-vote'); vote.append(el('span', null, W.vote_q))
        const voted = SS.get('voted.' + page)
        for (const [v, label] of [[1, W.vote_up], [-1, W.vote_down]]) {
            const b = el('button', 'talk-btn', label); b.type = 'button'; b.disabled = !!voted
            b.onclick = () => { try { window.PTObs && window.PTObs.vote(v, page) } catch { } SS.set('voted.' + page, String(v)); vote.querySelectorAll('button').forEach(x => { x.disabled = true }); note.textContent = W.voted }
            vote.append(b)
        }
        const note = el('span', 'talk-voted', voted ? W.voted : ''); vote.append(note); box.append(vote)
        // the comment
        const form = el('form', 'talk-form'); form.noValidate = true
        const kind = el('select', 'talk-kind'); kind.setAttribute('aria-label', 'kind')
        for (const [k, label] of Object.entries(W.kinds)) { const o = el('option', null, label); o.value = k; kind.append(o) }
        const q = el('blockquote', 'talk-quote'); q.hidden = true
        const text = el('textarea', 'talk-text'); text.rows = 4; text.maxLength = 4000; text.placeholder = W.placeholder; text.setAttribute('aria-label', W.heading)
        text.value = SS.get('text.' + page) || ''; text.oninput = () => SS.set('text.' + page, text.value)
        text.onfocus = () => { if (quote) { q.textContent = ''; q.append(el('small', null, W.quote_label), el('span', null, quote)); q.hidden = false; q.dataset.quote = quote } }
        const row = el('div', 'talk-row'), msg = el('p', 'talk-msg'); msg.setAttribute('role', 'status')
        const anon = el('button', 'talk-btn talk-send', W.send); anon.type = 'submit'
        row.append(kind, anon)
        if (me) { const signed = el('button', 'talk-btn talk-signed', fill(W.send_signed, { person: me })); signed.type = 'button'; signed.dataset.signed = '1'; row.append(signed) }
        form.append(q, text, row, msg, el('p', 'talk-fine', me ? W.signed_note : W.anon_note))
        const draft = () => {
            const t = text.value.trim()
            if (!t) { msg.textContent = W.empty; return null }
            if (t.length > 4000) { msg.textContent = W.too_long; return null }
            if (CONTACT.test(t)) { msg.textContent = W.contact; return null }
            return { page, place: placeId(), title: document.title.replace(/\s*[·|].*$/, ''), item: '', kind: kind.value, text: t, quote: q.hidden ? null : q.dataset.quote }
        }
        form.onsubmit = async e => {
            e.preventDefault(); const d = draft(); if (!d) return
            anon.disabled = true
            try { await send(body(d, c.version)); msg.textContent = W.sent; text.value = ''; SS.set('text.' + page, null); q.hidden = true }
            catch { msg.textContent = W.failed } finally { anon.disabled = false }
        }
        form.addEventListener('click', e => {
            if (!e.target.dataset || !e.target.dataset.signed) return
            const d = draft(); if (!d) return
            SS.set('draft', JSON.stringify(d)); location.href = root + 'talk/'
        })
        box.append(form)
        // answers waiting for this person about this page (counted from public metadata; opened only on /talk/)
        if (me) try {
            const [reg, rep] = await Promise.all([fetch(root + 'board/person-keys.json').then(r => r.json()), fetch(root + 'api/v1/talk/replies.json', { cache: 'no-cache' }).then(r => r.json())])
            const k = (reg.keys || []).find(x => x.person === me && x.status === 'active')
            const n = k ? (rep.replies || []).filter(x => x.to === k.fingerprint && x.about === page).length : 0
            if (n) { const p = el('p', 'talk-replies'); const a = el('a', null, W.open_replies); a.href = root + 'talk/'; p.append(fill(n === 1 ? W.replies : W.replies_many, { n }) + ': ', a); box.insertBefore(p, form) }
        } catch { }
        const at = document.getElementById('agents')
        if (at && at.parentNode) at.parentNode.insertBefore(box, at); else if (main) main.append(box)
    }

    // /talk/: sign and send a draft; open the answers sealed to this person's key
    async function talkPage(c, mount) {
        const W = c.words, KR = window.PTKeyring
        mount.textContent = ''
        if (!KR) { mount.append(el('p', 'talk-msg', W.talk_need_key)); return }
        await KR.ready.catch(() => { })
        if (!KR.person) { const p = el('p', 'talk-msg', W.talk_need_key + ' '); const a = el('a', null, '/login/'); a.href = root + 'login/'; p.append(a); mount.append(p); return }
        const raw = SS.get('draft')
        if (raw) {
            const d = JSON.parse(raw), box = el('div', 'talk-draft')
            box.append(el('p', null, fill(W.talk_draft, { page: d.page })), el('blockquote', 'talk-quote', d.text))
            const b = el('button', 'talk-btn talk-send', fill(W.send_signed, { person: KR.person })); b.type = 'button'
            const msg = el('p', 'talk-msg'); msg.setAttribute('role', 'status')
            b.onclick = async () => {
                b.disabled = true
                try {
                    const reg = await fetch(root + 'board/person-keys.json').then(r => r.json()).catch(() => ({ keys: [] }))
                    const k = (reg.keys || []).find(x => x.fingerprint === KR.fingerprint) || {}
                    const m = Object.assign(body(d, c.version), { person: KR.person, key: KR.fingerprint, signing_key: k.signing_fingerprint || '' })
                    m.signature = await KR.sign(signedText(m))
                    await send(m)
                    SS.set('draft', null); msg.textContent = W.sent_signed
                } catch { msg.textContent = W.failed; b.disabled = false }
            }
            box.append(b, msg); mount.append(box)
        }
        let rep = { replies: [] }
        try { rep = await fetch(root + 'api/v1/talk/replies.json', { cache: 'no-cache' }).then(r => r.json()) } catch { }
        const mine = (rep.replies || []).filter(x => x.to === KR.fingerprint)
        if (!mine.length) { mount.append(el('p', 'talk-msg', W.talk_none)); return }
        const list = el('ol', 'talk-thread')
        for (const r of mine) {
            const li = el('li'); li.append(el('p', 'talk-meta', fill(W.talk_from, { page: r.about }) + (r.at ? ' · ' + r.at.slice(0, 16).replace('T', ' ') : '')))
            try { const m = await KR.open(r.envelope); li.append(el('p', null, typeof m === 'string' ? m : (m.text || ''))) } catch { li.append(el('p', 'talk-msg', W.talk_bad)) }
            list.append(li)
        }
        mount.append(list)
    }

    const start = async () => {
        try {
            const c = await cfg()
            // until security@'s review the pane is off for readers; ?talk=on turns it on for this tab (the milestone test)
            if (/[?&]talk=on\b/.test(location.search)) SS.set('on', '1')
            const mount = document.querySelector('.talk-mount')
            if (!c.enabled && !mount && SS.get('on') !== '1') return
            if (mount) return talkPage(c, mount)
            if (!main || document.querySelector('.talk')) return
            await pane(c)
        } catch { }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
