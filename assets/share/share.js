/* share.js: the share row (newsroom/build/features/share.mjs). The links work without it; this marks each link by its
 * target, adds Copy link, and on a phone (or wherever the browser has the phone's own share sheet) one Share button that
 * opens the sheet. Nothing is loaded or sent: the sheet and the links go only where the reader chooses. */
(function () {
    var rows = document.querySelectorAll('.share'); if (!rows.length) return
    var canon = document.querySelector('link[rel="canonical"]'), url = canon ? canon.href : location.href.split('#')[0]
    var desc = document.querySelector('meta[name="description"]'), title = document.title, text = desc ? desc.content : ''
    var KIND = { 'www.linkedin.com': 'linkedin', 'twitter.com': 'x', 'wa.me': 'whatsapp' }
    var narrow = window.matchMedia('(max-width: 640px)')
    function el(tag, cls, label) { var e = document.createElement(tag); e.className = cls; if (label) e.textContent = label; return e }
    Array.prototype.forEach.call(rows, function (r) {
        var p = r.querySelector('p:last-child') || r
        Array.prototype.forEach.call(p.querySelectorAll('a'), function (a) {
            var k = a.protocol === 'mailto:' ? 'email' : (KIND[a.host] || 'link'); a.classList.add('share-to', 'share-' + k)
        })
        var said = el('span', 'share-said visually-hidden'); said.setAttribute('role', 'status'); said.setAttribute('aria-live', 'polite')
        var copy = el('button', 'share-to share-copy', r.dataset.copy || 'Copy link'); copy.type = 'button'
        copy.addEventListener('click', function () {
            var done = function () { var o = copy.textContent; copy.textContent = said.textContent = 'Link copied'; setTimeout(function () { copy.textContent = o }, 2000) }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { prompt('', url) })
            else prompt('', url)
        })
        p.appendChild(copy); p.appendChild(said)
        if (navigator.share && narrow.matches) {
            var open = el('button', 'share-open', 'Share'); open.type = 'button'
            open.addEventListener('click', function () { navigator.share({ title: title, text: text, url: url }).catch(function () { }) })
            r.classList.add('share-collapsed'); r.insertBefore(open, r.firstChild)
        }
    })
})()
