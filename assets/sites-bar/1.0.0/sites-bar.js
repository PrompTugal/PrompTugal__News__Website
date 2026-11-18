/*! The PrompTugal sites bar v1.0.0 (dev@PrompTugal.dinis, 18 November 2026; board/guidance/2026-11-18-the-sites-bar.md).
 * One bar on every *.promptugal.news site: the sites from the registry (promptugal.news/api/v1/sites.json), the current
 * one marked; hover, focus or tap shows a pop-up with the site's preview, its one line and its last build; one click goes.
 * Safe across sites: each site vendors this file (pinned by version and sha256, see the registry's `bar`); the registry is
 * data, rendered with textContent only; a link is used only if it is https and on promptugal.news or *.promptugal.news;
 * a mark only if it is #rrggbb. It fetches JSON only (the registry, then a site's /version.json when its pop-up opens),
 * never a script, with credentials omitted. No cookie, no storage, nothing sent. */
(function () {
    if (window.__ptsb) return; window.__ptsb = 1
    var REG = location.hostname === 'promptugal.news' ? location.origin + '/api/v1/sites.json' : 'https://promptugal.news/api/v1/sites.json'
    var OK = /^https:\/\/([a-z0-9-]+\.)?promptugal\.news\/[^\s"'<>]*$/
    var COLOUR = /^#[0-9a-f]{6}$/i
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = String(x); return e }
    function get(u) { return fetch(u, { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() }) }
    function here(s) { try { return new URL(s.url).hostname === location.hostname } catch (e) { return false } }
    function when(s) { var d = new Date(s); return isNaN(d) ? '' : d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC' }
    function build(reg) {
        var sites = (reg && reg.sites || []).filter(function (s) { return s && typeof s.name === 'string' && OK.test(String(s.url)) }).slice(0, 40)
        if (!sites.length) return
        var bar = el('nav', 'ptsb'); bar.setAttribute('aria-label', 'PrompTugal sites')
        var row = el('div', 'ptsb-row'), pop = el('div', 'ptsb-pop'); pop.setAttribute('role', 'dialog')
        row.appendChild(el('span', 'ptsb-lead', 'PrompTugal'))
        var open = null, timer = null
        function close() { pop.removeAttribute('data-open'); open = null }
        function show(s, a) {
            if (open === s) return; open = s; clearTimeout(timer)
            pop.replaceChildren()
            var img = el('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'
            img.onerror = function () { img.remove() }; img.src = OK.test(String(s.preview)) ? s.preview : new URL('preview.svg', s.url).href; pop.appendChild(img)
            pop.appendChild(el('p', 'ptsb-name', s.name)); if (s.line) pop.appendChild(el('p', 'ptsb-line', s.line))
            var meta = el('p', 'ptsb-meta', here(s) ? 'You are here' : ''); pop.appendChild(meta)
            var go = el('a', 'ptsb-go', here(s) ? 'Home of ' + s.name : 'Go to ' + s.name); go.href = s.url; pop.appendChild(go)
            var r = a.getBoundingClientRect(), b = bar.getBoundingClientRect()
            pop.style.left = Math.max(8, Math.min(r.left - b.left, b.width - 308)) + 'px'
            pop.setAttribute('data-open', '')
            get(OK.test(String(s.version_url)) ? s.version_url : new URL('version.json', s.url).href).then(function (v) {
                if (open !== s) return
                var t = [v && typeof v.version === 'string' && /^v?[\w.-]{1,20}$/.test(v.version) ? v.version : '', v && v.built ? 'built ' + when(v.built) : ''].filter(Boolean).join(' · ')
                if (t) meta.textContent = (here(s) ? 'You are here · ' : '') + t
            }).catch(function () { })
        }
        sites.forEach(function (s) {
            var a = el('a', 'ptsb-site'); a.href = s.url
            var dot = el('span', 'ptsb-dot'); if (COLOUR.test(s.mark || '')) dot.style.background = s.mark
            a.append(dot, document.createTextNode(s.name))
            if (here(s)) a.setAttribute('aria-current', 'true')
            a.addEventListener('mouseenter', function () { show(s, a) })
            a.addEventListener('focus', function () { show(s, a) })
            // a tap on a phone opens the sheet first; a second tap goes
            a.addEventListener('click', function (e) { if (matchMedia('(hover: none)').matches && open !== s) { e.preventDefault(); show(s, a) } })
            row.appendChild(a)
        })
        bar.addEventListener('mouseleave', function () { timer = setTimeout(close, 250) })
        pop.addEventListener('mouseenter', function () { clearTimeout(timer) })
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close() })
        document.addEventListener('click', function (e) { if (!bar.contains(e.target)) close() })
        bar.append(row, pop)
        document.body.insertBefore(bar, document.body.firstChild)
    }
    function go() { get(REG).then(build).catch(function () { }) }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go()
})()
