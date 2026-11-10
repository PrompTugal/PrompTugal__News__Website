/* /agentic/: list the cards A to Z (the default) or by stage, the reader's choice (designer@, 10 November: nothing on a
 * card is a judgement, so the page does not rank them unless asked). dev@PrompTugal.dinis. */
(function () {
    var grid = document.querySelector('.gr-all'), sw = document.querySelector('.gr-sort'); if (!grid || !sw) return
    var cards = [].slice.call(grid.children), az = cards.slice()
    sw.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-sort]'); if (!b) return
        var by = b.getAttribute('data-sort'), list = by === 'stage' ? cards.slice().sort(function (x, y) { return +y.getAttribute('data-n') - +x.getAttribute('data-n') }) : az
        list.forEach(function (c) { grid.appendChild(c) })
        sw.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') })
    })
})()
