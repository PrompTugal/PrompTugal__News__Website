/* views.js: a page's view switch made real (the list pages: articles, companies, people; board/briefs/2026-11-09-the-mockups-vs-the-live-site.md).
 * The build writes <p class="view-switch"> with links to #v-<view> and a <div class="view ..."> per view whose heading has
 * that id. Here: one view shows at a time, the links become a pressed/unpressed switch, the choice is kept in the address
 * (#v-<view>) and in this browser (localStorage, in a try/catch). Without this script every view shows, as before. */
(function () {
    function start() {
        document.querySelectorAll('p.view-switch').forEach(function (sw) {
            var links = [].slice.call(sw.querySelectorAll('a[href^="#v-"]')), views = links.map(function (a) {
                var h = document.getElementById(a.getAttribute('href').slice(1)); return h && h.closest('.view')
            })
            if (!links.length || views.some(function (v) { return !v })) return
            var key = 'pt-view:' + location.pathname
            function show(i, keep) {
                views.forEach(function (v, j) { v.hidden = j !== i; v.classList.toggle('on', j === i) })
                links.forEach(function (a, j) { a.setAttribute('aria-pressed', j === i ? 'true' : 'false'); a.classList.toggle('on', j === i) })
                if (keep) { try { localStorage.setItem(key, links[i].getAttribute('href')) } catch (e) { } try { history.replaceState(null, '', links[i].getAttribute('href')) } catch (e) { } }
            }
            var want = location.hash, saved = null
            try { saved = localStorage.getItem(key) } catch (e) { }
            var i = links.findIndex(function (a) { return a.getAttribute('href') === want })
            if (i < 0) i = links.findIndex(function (a) { return a.getAttribute('href') === saved })
            show(i < 0 ? 0 : i, false)
            sw.classList.add('is-switch'); sw.setAttribute('role', 'group')
            links.forEach(function (a, j) { a.setAttribute('role', 'button'); a.addEventListener('click', function (e) { e.preventDefault(); show(j, true) }) })
        })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
