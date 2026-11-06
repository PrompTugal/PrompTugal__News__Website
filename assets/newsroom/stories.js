// The story board's filters (features/stories.mjs): by desk, beat and assignee, read from api/v1/newsroom/stories.json.
// Without this script every card is shown; with it, a card whose story does not match is hidden.
(function () {
    var board = document.querySelector('.kb'); if (!board || !window.fetch) return
    var api = window.NRSite && window.NRSite.url ? window.NRSite.url('api/v1/newsroom/stories.json') : new URL('../../api/v1/newsroom/stories.json', location.href)
    fetch(api).then(function (r) { return r.json() }).then(function (M) {
        var by = {}; M.stories.forEach(function (s) { by[s.id] = s })
        var cards = [].slice.call(board.querySelectorAll('li')).map(function (li) { var a = li.querySelector('a'); var m = a && /(?:^|\/)([^/]+)\/index\.html$/.exec(a.getAttribute('href')); return { li: li, s: m && by[m[1]] } })
        var keys = [['desk', 'Desk'], ['beat', 'Beat'], ['assignee', 'Who has it']], want = {}
        var bar = document.createElement('div'); bar.className = 'kb-filters'
        keys.forEach(function (k) {
            var vals = {}; M.stories.forEach(function (s) { if (s[k[0]]) vals[s[k[0]]] = 1 })
            var lab = document.createElement('label'); lab.textContent = k[1] + ' '
            var sel = document.createElement('select'); sel.append(new Option('All', ''))
            Object.keys(vals).sort().forEach(function (v) { sel.append(new Option(v, v)) })
            sel.addEventListener('change', function () { want[k[0]] = sel.value; apply() })
            lab.append(sel); bar.append(lab)
        })
        board.parentNode.insertBefore(bar, board)
        function apply() { cards.forEach(function (c) { c.li.hidden = !!c.s && keys.some(function (k) { return want[k[0]] && c.s[k[0]] !== want[k[0]] }) }) }
    }).catch(function () { })
})()
