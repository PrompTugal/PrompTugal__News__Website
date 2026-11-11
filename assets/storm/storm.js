// /storm/charles/: the "last checked" line says how old it is when it is more than three hours old (designer@'s S4, sherpa@'s ST1).
// Worked out in the reader's browser, so it stays true however long the page has been open.
(function () {
    var b = document.querySelector('.storm-checked[data-at]'); if (!b) return
    var at = Date.parse(b.getAttribute('data-at')); if (!at) return
    var h = Math.floor((Date.now() - at) / 36e5); if (h <= 3) return
    var s = document.createElement('span'); s.className = 'storm-stale'; s.textContent = ' (' + h + ' hours ago)'
    ;(b.querySelector('p') || b).appendChild(s)
})()
