/* days.js: the rest of a day folded under its heading ("Everything else today (N)": designer@'s D3, board/spec-list-pages-and-days-check.md).
 * The build writes <div class="fold"> with a heading first; here the heading becomes a button that opens and shuts the rest.
 * Without this script the rest shows, as before. dev.pages@PrompTugal.dinis. */
(function () {
    function start() {
        document.querySelectorAll('.fold').forEach(function (f) {
            var h = f.firstElementChild; if (!h || !/^H[2-4]$/.test(h.tagName)) return
            var rest = [].slice.call(f.children, 1)
            function set(open) { rest.forEach(function (e) { e.hidden = !open }); h.setAttribute('aria-expanded', open ? 'true' : 'false'); f.classList.toggle('is-open', open) }
            h.setAttribute('role', 'button'); h.tabIndex = 0; f.classList.add('is-fold'); set(false)
            h.addEventListener('click', function () { set(h.getAttribute('aria-expanded') !== 'true') })
            h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(h.getAttribute('aria-expanded') !== 'true') } })
        })
    }
    // the strip of days: on a phone it scrolls sideways, so bring today (or the day being viewed) to its middle
    function strip() {
        document.querySelectorAll('.day-strip').forEach(function (ul) {
            var li = ul.querySelector('.viewing') || ul.querySelector('.today'); if (!li || ul.scrollWidth <= ul.clientWidth) return
            ul.scrollLeft = Math.max(0, li.offsetLeft - (ul.clientWidth - li.offsetWidth) / 2)
        })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { start(); strip() }); else { start(); strip() }
})()
