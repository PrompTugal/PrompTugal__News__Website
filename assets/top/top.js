/* top.js: the top of every page is C (Dinis, 6 November 2026, about 13:20 UTC: "C on every page"; the spec
 * board/spec-the-top-of-the-page.md, the pictures design/decisions/the-top-of-the-page/answered--*.jpg).
 * Loaded in <head>, before the body is drawn, so the page never flashes the other top.
 *   - The variant: C by default; A (the bar before C) for the A/B test: ?top=a on any page keeps A in this browser,
 *     ?top=c goes back. <html data-top="c|a">; window.PTTop.variant; the tool top.variant (read).
 *   - C: the tools the features put in #nr-tools (the credit, Ask, the profile, the sign-in chip) move into C's row;
 *     the theme picker moves to the footer (Q4); "More" in the tab bar opens every section.
 * Without this script the page shows A, as before. */
(function () {
    var KEY = 'pt-top', v = 'c'
    try {
        var q = (location.search.match(/[?&]top=(a|c)\b/) || [])[1]
        if (q) localStorage.setItem(KEY, q)
        v = q || localStorage.getItem(KEY) || 'c'
    } catch (e) { }
    if (v !== 'a') v = 'c'
    document.documentElement.setAttribute('data-top', v)
    window.PTTop = { variant: v };
    (window.__toolQueue = window.__toolQueue || []).push(['register', 'top.variant', {
        level: 'read', description: 'Which top of the page this browser shows: c (the default) or a (the A/B test).',
        params: { type: 'object', properties: {} }, run: function () { return { variant: v } },
    }])
    if (v !== 'c') return

    function ready() {
        // the Agenda tab, on a day page of the summit's week: from 20:00 Lisbon (UTC in November) it opens tomorrow's (sherpa@'s A1)
        document.querySelectorAll('.ctabs a[href*="days/2026-11-"]').forEach(function (a) {
            var m = a.getAttribute('href').match(/days\/(2026-11-(\d\d))\//), now = new Date()
            if (m && now.getUTCHours() >= 20 && +m[2] < 13 && now.toISOString().slice(0, 10) === m[1]) a.setAttribute('href', a.getAttribute('href').replace(m[1], '2026-11-' + String(+m[2] + 1).padStart(2, '0')))
        })
        var slot = document.querySelector('.ctop-tools'), tools = document.getElementById('nr-tools')
        if (slot && tools && tools.parentNode !== slot) slot.appendChild(tools)
        var foot = document.querySelector('.foot-theme')
        function moveTheme() { var t = tools && tools.querySelector('.theme-pick'); if (t && foot) foot.appendChild(t) }
        moveTheme()
        if (tools && window.MutationObserver) new MutationObserver(moveTheme).observe(tools, { childList: true })
        var more = document.querySelector('.ctabs-more'), sheet = document.getElementById('ctop-more')
        if (more && sheet) {
            function set(open) { sheet.hidden = !open; more.setAttribute('aria-expanded', open ? 'true' : 'false'); document.documentElement.classList.toggle('cmore-open', open) }
            more.addEventListener('click', function () { set(sheet.hidden) })
            sheet.addEventListener('click', function (e) { if (e.target === sheet) set(false) })
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { set(false); more.focus() } })
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready()
})()
