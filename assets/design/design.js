/* design.js: which of the home page's designs this browser shows (Silvio's lab toggle, ported; Dinis, 6 November
 * 2026, about 23:20 UTC). Loaded in <head> on the home page, so the page never flashes the other design.
 *   - The designs built on this page come in data-designs (the build), the default in data-default ("today").
 *   - ?design=<id> selects one and keeps it; else the choice kept in this browser (localStorage pt-design, in a
 *     try/catch: the page works when storage is blocked); else the default. Nothing leaves the browser.
 *   - <html data-design="<id>">; window.PTDesign.variant; the tool design.variant (read), for the page events (A/B).
 *   - Once drawn: the pill at the bottom right opens the picker; a card switches at once and is remembered. */
(function () {
    var me = document.currentScript, KEY = 'pt-design'
    var built = ((me && me.getAttribute('data-designs')) || 'today').split(' '), DEF = (me && me.getAttribute('data-default')) || 'today'
    var ok = function (v) { return built.indexOf(v) >= 0 }
    var get = function () { try { return localStorage.getItem(KEY) } catch (e) { return null } }
    var put = function (v) { try { localStorage.setItem(KEY, v) } catch (e) { } }
    var q = (location.search.match(/[?&]design=([a-z]+)\b/) || [])[1]
    if (q && ok(q)) put(q)
    var v = q && ok(q) ? q : ok(get()) ? get() : DEF
    var root = document.documentElement
    function set(id) { v = id; root.setAttribute('data-design', id); window.PTDesign.variant = id }
    window.PTDesign = { variant: v, designs: built };
    set(v);
    (window.__toolQueue = window.__toolQueue || []).push(['register', 'design.variant', {
        level: 'read', description: 'Which design of the home page this browser shows, and which are offered.',
        params: { type: 'object', properties: {} }, run: function () { return { variant: v, designs: built } },
    }])

    function ready() {
        var btn = document.querySelector('.ptd-btn'), sheet = document.getElementById('ptd-sheet')
        if (!btn || !sheet) return
        var x = sheet.querySelector('.ptd-x'), name = btn.querySelector('.ptd-name'), cards = sheet.querySelectorAll('.ptd-card')
        function mark() {
            cards.forEach(function (c) { if (c.getAttribute('data-design-id') === v) { c.setAttribute('aria-current', 'true'); name.textContent = c.getAttribute('data-name') } else c.removeAttribute('aria-current') })
        }
        function open(o) { sheet.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false'); (o ? x : btn).focus() }
        mark()
        btn.addEventListener('click', function () { open(sheet.hidden) })
        x.addEventListener('click', function () { open(false) })
        sheet.addEventListener('click', function (e) { if (e.target === sheet) open(false) })
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) open(false) })
        cards.forEach(function (c) {
            c.addEventListener('click', function (e) {
                e.preventDefault(); var id = c.getAttribute('data-design-id'); put(id); set(id); mark(); open(false); scrollTo(0, 0)
                try { history.replaceState(null, '', location.pathname + (id === DEF ? '' : '?design=' + id) + location.hash) } catch (err) { }
            })
        })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready()
})()
