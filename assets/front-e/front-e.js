/* front-e.js: E, one of the home page's designs (Silvio's mock E; assets/design/ chooses between them). Once the page
 * is drawn: the countdown to Opening Night (gone after it), and Now and next drops what has ended. */
(function () {
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
