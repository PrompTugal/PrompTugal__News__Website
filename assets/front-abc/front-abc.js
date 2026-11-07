/* front-abc.js: the home page's designs A, B and C (Silvio's mocks). Once drawn: the countdown to Opening Night (gone
 * after it), and Now and next drops what has ended. */
(function () {
    function pad(n) { return (n < 10 ? '0' : '') + n }
    function ready() {
        var cds = [].slice.call(document.querySelectorAll('.fx-cd'))
        function tick() {
            var live = false
            cds.forEach(function (cd) {
                var d = Date.parse(cd.getAttribute('data-at')) - Date.now()
                if (!(d > 0)) { cd.hidden = true; return }
                live = true
                var D = Math.floor(d / 864e5), H = Math.floor(d / 36e5) % 24, M = Math.floor(d / 6e4) % 60
                cd.querySelector('[data-cd]').textContent = D + 'd ' + H + 'h ' + pad(M) + 'm'
            })
            return live
        }
        if (cds.length && tick()) { var t = setInterval(function () { if (!tick()) clearInterval(t) }, 30000) }
        document.querySelectorAll('.fx-list li[data-end]').forEach(function (li) { if (Date.parse(li.getAttribute('data-end')) < Date.now()) li.hidden = true })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready()
})()
