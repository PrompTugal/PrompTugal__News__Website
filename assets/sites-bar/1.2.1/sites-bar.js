/*! The PrompTugal sites bar v1.2.1, the behaviour (dev@PrompTugal.dinis, from designer@'s board/spec-the-sites-bar.md, SB3 to SB5).
 * The bar's links are in the page already (rendered at build by sites-bar-render.mjs). This adds: the pop-up per site
 * (hover after 150 ms, focus, tap; Escape closes and returns focus), with the site's /preview.svg as an <img> only, and its
 * version and update time from its /version.json (JSON only, credentials omitted, each value matched to a strict pattern);
 * on a phone one row that scrolls sideways with the current site centred, and no pop-up (SB9, SB10). Every string by textContent; nothing stored or sent. */
(function () {
    var nav = document.querySelector('nav.ptsb'); if (!nav || nav.__ptsb) return; nav.__ptsb = 1
    var links = [].slice.call(nav.querySelectorAll('ul a[data-host]')), phone = matchMedia('(max-width: 760px)')
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
        a.addEventListener('mouseenter', function () { if (phone.matches) return; clearTimeout(t); t = setTimeout(function () { show(a) }, 150) })
        a.addEventListener('mouseleave', function () { clearTimeout(t) })
        a.addEventListener('focus', function () { if (!phone.matches) show(a) })
    })
    nav.addEventListener('mouseleave', function () { clearTimeout(t); t = setTimeout(function () { close(false) }, 250) })
    pop.addEventListener('mouseenter', function () { clearTimeout(t) })
    // a phone (SB10): one row, the current site scrolled to the centre; no pop-up, one tap goes (SB9)
    var cur = nav.querySelector('ul a[aria-current]')
    if (cur && phone.matches) try { cur.scrollIntoView({ inline: 'center', block: 'nearest' }) } catch (e) { }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true) })
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) close(false) })
})()
