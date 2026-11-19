/*! The PrompTugal sites bar v1.1.1, the behaviour (dev@PrompTugal.dinis, from designer@'s board/spec-the-sites-bar.md, SB3 to SB5).
 * The bar's links are in the page already (rendered at build by sites-bar-render.mjs). This adds: the pop-up per site
 * (hover after 150 ms, focus, tap; Escape closes and returns focus), with the site's /preview.svg as an <img> only, and its
 * version and update time from its /version.json (JSON only, credentials omitted, each value matched to a strict pattern);
 * on a phone the "Sites" sheet (scrim, Escape, focus trapped while open). Every string by textContent; nothing stored or sent. */
(function () {
    var nav = document.querySelector('nav.ptsb'); if (!nav || nav.__ptsb) return; nav.__ptsb = 1
    var links = [].slice.call(nav.querySelectorAll('ul a[data-host]'))
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = String(x); return e }
    function same(u, host) { try { var x = new URL(u); return x.protocol === 'https:' && x.hostname === host && !x.port && !x.username && !x.password } catch (e) { return false } }   // 1.1.1: no user info (LIB-2026-026)
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    function when(s) { var d = new Date(s); return isNaN(d) ? '' : d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + ', ' + ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2) + ' UTC' }
    var pop = el('div', 'ptsb-pop'); pop.setAttribute('role', 'dialog'); pop.hidden = true; nav.appendChild(pop)
    var open = null, t = null, cache = {}
    function close(back) { pop.hidden = true; if (back && open) open.focus(); open = null }
    function show(a) {
        if (open === a) return; open = a
        var host = a.getAttribute('data-host'), name = a.getAttribute('data-name'), href = a.href
        pop.replaceChildren(); pop.setAttribute('aria-label', name)
        var pv = a.getAttribute('data-preview')
        if (same(pv, host)) { var img = el('img'); img.alt = name + ': its numbers now'; img.width = 320; img.height = 180; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; img.onerror = function () { img.remove() }; img.src = pv; pop.appendChild(img) }
        pop.appendChild(el('h4', '', name + ' · ' + host)); pop.appendChild(el('p', '', a.getAttribute('data-line')))
        var go = el('p', 'go'), meta = el('span', '', a.getAttribute('aria-current') ? 'you are here' : ''), to = el('a', '', 'Go →')
        to.href = href; to.rel = 'noopener noreferrer'; if (a.target) to.target = a.target; go.append(meta, to); pop.appendChild(go)
        var r = a.getBoundingClientRect(), b = nav.getBoundingClientRect(), left = Math.max(8, Math.min(r.left - b.left, b.width - 348))
        pop.style.left = left + 'px'; pop.style.setProperty('--ptsb-arrow', Math.max(12, Math.min(r.left - b.left - left + 14, 320)) + 'px'); pop.hidden = false
        var vu = a.getAttribute('data-version')
        if (!same(vu, host)) return
        var p = cache[vu] || (cache[vu] = fetch(vu, { credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error' }).then(function (r) { if (!r.ok) throw 0; return r.json() }))
        p.then(function (v) {
            if (open !== a || !v) return
            var ver = typeof v.version === 'string' && /^v?\d{1,4}(\.\d{1,6}){1,3}$/.test(v.version) ? v.version.replace(/^v?/, 'v') : ''
            var up = v.built ? when(v.built) : ''
            var txt = [up && /^\d{1,2} [A-Z][a-z]{2}, \d{2}:\d{2} UTC$/.test(up) ? 'updated ' + up : '', ver].filter(Boolean).join(' · ')
            if (txt) meta.textContent = (a.getAttribute('aria-current') ? 'you are here · ' : '') + txt
        }).catch(function () { })
    }
    links.forEach(function (a) {
        a.addEventListener('mouseenter', function () { clearTimeout(t); t = setTimeout(function () { show(a) }, 150) })
        a.addEventListener('mouseleave', function () { clearTimeout(t) })
        a.addEventListener('focus', function () { show(a) })
        a.addEventListener('click', function (e) { if (matchMedia('(hover: none)').matches && open !== a) { e.preventDefault(); show(a) } })
    })
    nav.addEventListener('mouseleave', function () { clearTimeout(t); t = setTimeout(function () { close(false) }, 250) })
    pop.addEventListener('mouseenter', function () { clearTimeout(t) })
    // the phone sheet
    var all = nav.querySelector('.ptsb-all'), scrim = el('div', 'ptsb-scrim'), sheet = el('div', 'ptsb-sheet')
    scrim.hidden = sheet.hidden = true; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'The PrompTugal.news sites'); sheet.id = 'ptsb-sheet'
    sheet.appendChild(el('div', 'grab')); sheet.appendChild(el('h3', '', 'The PrompTugal.news sites'))
    var ul = el('ul'); links.forEach(function (a) { var li = el('li'), x = el('a'); x.href = a.href; x.rel = 'noopener noreferrer'; if (a.target) x.target = a.target; if (a.getAttribute('aria-current')) x.setAttribute('aria-current', 'page'); x.append(el('b', '', a.getAttribute('data-name')), el('span', '', a.getAttribute('data-line'))); li.appendChild(x); ul.appendChild(li) })
    sheet.appendChild(ul); document.body.append(scrim, sheet)
    function shut() { sheet.hidden = scrim.hidden = true; if (all) all.focus() }
    if (all) all.addEventListener('click', function (e) { e.preventDefault(); sheet.hidden = scrim.hidden = false; var f = sheet.querySelector('a'); if (f) f.focus() })
    scrim.addEventListener('click', shut)
    var y0 = null; sheet.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY }, { passive: true })
    sheet.addEventListener('touchend', function (e) { if (y0 != null && e.changedTouches[0].clientY - y0 > 60) shut(); y0 = null })
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { if (!sheet.hidden) shut(); else close(true) }
        if (e.key === 'Tab' && !sheet.hidden) { var f = sheet.querySelectorAll('a'), first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() } }
    })
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) close(false) })
})()
