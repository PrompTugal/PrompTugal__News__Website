/* share.js: the share row (newsroom/build/features/share.mjs). The links work without it; this adds the one Share
 * button (the phone's own share sheet where the browser has one, else it opens the list) and Copy link. Nothing is
 * loaded or sent: the sheet and the links go only where the reader chooses. */
(function () {
    var rows = document.querySelectorAll('.share'); if (!rows.length) return
    var narrow = window.matchMedia('(max-width: 640px)')
    function say(r, t) { var s = r.querySelector('.share-said'); if (s) s.textContent = t }
    function copy(r, b) {
        var u = r.dataset.url
        var done = function () { var l = b.querySelector('span'), o = l.textContent; l.textContent = b.dataset.copied; say(r, b.dataset.copied); setTimeout(function () { l.textContent = o }, 2000) }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(done, function () { prompt('', u) })
        else prompt('', u)
    }
    Array.prototype.forEach.call(rows, function (r) {
        var open = r.querySelector('.share-open'), list = r.querySelector('.share-list'), c = r.querySelector('.share-copy')
        if (c) { c.hidden = false; c.addEventListener('click', function () { copy(r, c) }) }
        function fit() {
            var collapse = narrow.matches || !!navigator.share
            r.classList.toggle('share-collapsed', collapse)
            open.hidden = !collapse
            if (!collapse) { list.hidden = false; open.setAttribute('aria-expanded', 'false') } else if (open.getAttribute('aria-expanded') !== 'true') list.hidden = true
        }
        open.addEventListener('click', function () {
            if (navigator.share) { navigator.share({ title: r.dataset.title, text: r.dataset.text, url: r.dataset.url }).catch(function () { }); return }
            var on = open.getAttribute('aria-expanded') !== 'true'
            open.setAttribute('aria-expanded', on ? 'true' : 'false'); list.hidden = !on
        })
        if (narrow.addEventListener) narrow.addEventListener('change', fit)
        fit()
    })
})()
