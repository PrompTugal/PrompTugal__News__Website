// Algarve Evolution page: a left-hand map built from the sections, and sections that open and close.
// Progressive: without this script the page is the same words in order, with the shell's own table of contents.
(function () {
    var root = document.querySelector('.ae'); if (!root) return
    var secs = Array.prototype.slice.call(root.querySelectorAll('.ae-sec'))
    var nav = document.createElement('nav'), p = document.createElement('p'), ol = document.createElement('ol')
    nav.className = 'ae-map'; nav.setAttribute('aria-label', 'On this page'); p.textContent = 'On this page'; nav.appendChild(p); nav.appendChild(ol)
    secs.forEach(function (s) {
        var h = s.querySelector('h2'); if (!h) return
        s.id = h.id
        var li = document.createElement('li'), a = document.createElement('a')
        a.href = '#' + h.id; a.textContent = h.textContent; li.appendChild(a); ol.appendChild(li)
        h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.setAttribute('aria-expanded', 'true')
        var toggle = function () { var c = s.classList.toggle('closed'); h.setAttribute('aria-expanded', c ? 'false' : 'true') }
        h.addEventListener('click', toggle)
        h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } })
        a.addEventListener('click', function () { s.classList.remove('closed'); h.setAttribute('aria-expanded', 'true') })
    })
    root.insertBefore(nav, root.children[1] || null)
    root.classList.add('js')
})()
