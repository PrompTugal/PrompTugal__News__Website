/* front-e.js: the home page's switch, E (Silvio's mock E, the default) or A (the front page before it), for the A/B
 * test (board/briefs/2026-11-06-front-page-mock-e.md). Loaded in <head> on the home page only, so it never flashes.
 *   ?front=a keeps A in this browser, ?front=e goes back. <html data-front="e|a">; window.PTFront.variant; the tool
 *   front.variant (read), for observability@'s page events.
 * Once the page is drawn: the countdown to Opening Night (gone after it), and Now and next drops what has ended. */
(function () {
    var KEY = 'pt-front', v = 'e'
    try {
        var q = (location.search.match(/[?&]front=(a|e)\b/) || [])[1]
        if (q) localStorage.setItem(KEY, q)
        v = q || localStorage.getItem(KEY) || 'e'
    } catch (e) { }
    if (v !== 'a') v = 'e'
    document.documentElement.setAttribute('data-front', v)
    window.PTFront = { variant: v };
    (window.__toolQueue = window.__toolQueue || []).push(['register', 'front.variant', {
        level: 'read', description: 'Which home page this browser shows: e (the default) or a (the A/B test).',
        params: { type: 'object', properties: {} }, run: function () { return { variant: v } },
    }])
    if (v !== 'e') return

    function pad(n) { return (n < 10 ? '0' : '') + n }
    function ready() {
        var cd = document.querySelector('.fe-cd'), at = cd && Date.parse(cd.getAttribute('data-at'))
        function tick() {
            var d = at - Date.now()
            if (!(d > 0)) { if (cd) cd.hidden = true; return false }
            var D = Math.floor(d / 864e5), H = Math.floor(d / 36e5) % 24, M = Math.floor(d / 6e4) % 60
            cd.querySelector('[data-cd]').textContent = D + 'd ' + H + 'h ' + pad(M) + 'm'
            return true
        }
        if (cd && tick()) setInterval(tick, 30000)
        var now = Date.now(), shown = 0
        document.querySelectorAll('.fe-nx li[data-end]').forEach(function (li) {
            var end = Date.parse(li.getAttribute('data-end'))
            if (end && end < now) li.remove(); else if (++shown > 6) li.remove()
        })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready()
})()
