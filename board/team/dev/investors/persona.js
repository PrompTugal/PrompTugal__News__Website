// dev@'s reviewed copy (7 November 17:15; security@'s conditions 3 to 6 checked), served at api/v1/investors/persona.js.
// Personal versions of the investor site (investors@PrompTugal.dinis, 7 November 2026; board/team/investors/tools/persona.mjs
// makes them). investors@'s working copy: it is served only from dev@'s reviewed copy (security@'s S1b), at
// api/v1/investors/persona.js, on the investor pages and the deck pages; never on a page that holds the keyring (S1).
//   1. A link ending #pk=<id>.<key> opens a version: fetch the sealed pack (board/team/investors/site/personas/<id>.json),
//      open it with the key (AES-256-GCM, WebCrypto), keep it in sessionStorage for this tab, take the key out of the address bar.
//   2. On every investor page: a bar ("A version of this site made for <name>", their page, leave), their accent colour,
//      their audience first on the home page; on /investors/for-you/ their page; on a deck page the slide words changed
//      for them (textContent only). Leave clears it.
//   3. On /investors/personas/: an image of a QR code dropped or chosen is read (BarcodeDetector, where the browser has it).
// No words of its own: every word comes from the pack (pack.ui) or the page (data-* attributes). Nothing is sent anywhere.
(function () {
    const K = 'inv-persona', S = window.sessionStorage
    let up = '/'   // the path to the site's root from this page (<meta name="inv-up">), read once the page is parsed
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    const b64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0))
    async function openPack(id, key) {
        const r = await fetch(`${up}board/team/investors/site/personas/${id}.json`, { cache: 'no-store' }); if (!r.ok) throw new Error('no pack')
        const sealed = await r.json(), k = await crypto.subtle.importKey('raw', b64(key), 'AES-GCM', false, ['decrypt'])
        const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(sealed.iv) }, k, b64(sealed.ct))
        return JSON.parse(new TextDecoder().decode(plain))
    }
    const stored = () => { try { return JSON.parse(S.getItem(K) || 'null') } catch (e) { return null } }
    const leave = () => { try { S.removeItem(K) } catch (e) { } location.reload() }
    const langOf = () => document.documentElement.lang || 'en'
    const inLang = (path, l) => `${up}investors/${l === 'en' ? '' : l + '/'}${path}`

    function apply(p) {
        const ui = p.ui || {}
        if (/^#[0-9a-f]{6}$/i.test(p.accent || '')) document.documentElement.style.setProperty('--you', p.accent)
        document.body.classList.add('inv-you')
        // the bar, under the header
        const bar = el('div', 'you-bar'), inner = el('div', 'you-in'), who = el('span', 'you-who')
        who.append(el('span', 'you-dot'), el('span', null, `${ui.made_for || ''} `), el('b', null, p.name))
        const mine = el('a', 'you-link', ui.yours || ''); mine.href = inLang('for-you/index.html', p.lang || 'en')
        const out = el('button', 'you-leave', ui.leave || '×'); out.type = 'button'; out.onclick = leave
        inner.append(who, mine, out); bar.append(inner)
        const slot = document.getElementById('persona-bar'); if (slot) slot.replaceWith(bar); else document.body.prepend(bar)
        // the home page: their audience first
        const g = document.querySelector('.who-g'), card = g && [...g.querySelectorAll('a.wc')].find(a => a.getAttribute('href').includes(`/${p.audience}/`))
        if (card) { g.prepend(card); card.classList.add('wc-you') }
        // a deck page: the words changed for them
        const deck = (document.getElementById('deck-player') && JSON.parse(document.getElementById('deck-player').dataset.player || '{}').name) || ''
        for (const [key, text] of Object.entries((p.overrides || {})[deck] || {})) document.querySelectorAll(`[data-i18n="${CSS.escape(key)}"]`).forEach(e => { e.textContent = text })
        // their page
        const view = document.getElementById('persona-view'); if (view) renderMine(view, p)
    }
    function renderMine(view, p) {
        const ui = p.ui || {}, l = p.lang || 'en'; view.textContent = ''
        const head = el('div', 'you-head'); head.append(el('p', 'kicker', `${ui.made_for || ''} ${p.name}`), el('h1', null, p.greeting || p.name), el('p', 'lead', [p.role, p.place].filter(Boolean).join(' · ')))
        if (p.demo) head.append(el('p', 'note', ui.demo || ''))
        view.append(head)
        const sec = (title, items) => { if (!items || !items.length) return; const s = el('div', 'you-sec'); s.append(el('h2', null, title)); const ul = el('ul', 'ticks'); items.forEach(t => ul.append(el('li', null, t))); s.append(ul); view.append(s) }
        sec(ui.about, p.about); sec(ui.why, p.why)
        if (p.note) { const s = el('div', 'you-sec you-note'); s.append(el('h2', null, ui.note || ''), el('blockquote', null, p.note)); view.append(s) }
        if (p.route && p.route.length) {
            const s = el('div', 'you-sec'), ol = el('ol', 'you-route'); s.append(el('h2', null, ui.route || ''))
            p.route.forEach((d, i) => { const li = el('li'), a = el('a', null, ''); a.href = `${up}investors/decks/${d}/${l === 'en' ? '' : l + '/'}index.html`
                const img = el('img'); img.src = `${up}board/team/investors/site/img/covers/${d}.${l}.jpg`; img.alt = ''; img.loading = 'lazy'
                img.onerror = () => { img.onerror = null; img.src = `${up}board/team/investors/site/img/covers/${d}.en.jpg` }
                a.append(img, el('span', 'you-n', i === 0 ? (ui.start || '') : String(i + 1))); li.append(a); ol.append(li) })
            s.append(ol); view.append(s)
        }
        if (p.pages && p.pages.length) {
            const s = el('div', 'you-sec'), c = el('p', 'chips'); s.append(el('h2', null, ui.pages || ''))
            p.pages.forEach(pg => { const a = el('a', null, (document.querySelector(`a[href*="/${CSS.escape(pg)}/"]`) || {}).textContent || pg); a.href = inLang(`${pg}/index.html`, l); c.append(a) })
            s.append(c); view.append(s)
        }
    }
    // the drop zone on /investors/personas/
    function dropZone() {
        const z = document.getElementById('qr-drop'); if (!z) return
        const say = t => { const m = z.querySelector('.qr-msg'); if (m) m.textContent = t }
        const read = async file => {
            if (!('BarcodeDetector' in window)) return say(z.dataset.nodetector || '')
            try { const codes = await new window.BarcodeDetector({ formats: ['qr_code'] }).detect(await createImageBitmap(file))
                const hit = codes.map(c => c.rawValue).find(v => /\/investors\/(?:[a-z]{2}\/)?#pk=[a-z0-9-]+\.[A-Za-z0-9_-]+$/.test(v))
                if (!hit) return say(z.dataset.none || ''); location.assign(`${up}investors/index.html${hit.slice(hit.indexOf('#'))}`)
            } catch (e) { say(z.dataset.none || '') } }
        z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('on') }); z.addEventListener('dragleave', () => z.classList.remove('on'))
        z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('on'); const f = e.dataTransfer.files[0]; if (f) read(f) })
        const input = z.querySelector('input[type=file]'); if (input) input.addEventListener('change', () => input.files[0] && read(input.files[0]))
    }

    async function start() {
        up = (document.querySelector('meta[name="inv-up"]') || {}).content || up
        dropZone()
        const m = location.hash.match(/(?:^#|&)pk=([a-z0-9-]{2,40})\.([A-Za-z0-9_-]{43})$/)
        // any key leaves the address bar at once, even one that does not parse (dev@'s review, security@'s condition 3)
        if (/pk=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search)
        if (m) {
            try { const p = await openPack(m[1], m[2]); S.setItem(K, JSON.stringify(p))
                if (p.lang && p.lang !== langOf() && document.body.classList.contains('inv-home')) { location.replace(inLang('index.html', p.lang)); return }
            } catch (e) { /* a wrong or old key: the site as usual */ }
        }
        const p = stored(); if (p) apply(p)
    }
    addEventListener('hashchange', () => { if (/pk=/.test(location.hash)) start() })
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
