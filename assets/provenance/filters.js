/* The articles page's provenance filters (Dinis, 17 November 2026; board/spec-provenance-and-review.md, "How readers
 * see it"): by type, by who wrote it, with research, by the ladder level. Reads api/v1/articles/provenance.json and hides
 * the list items that do not match; without JavaScript every article stays listed. dev@PrompTugal.dinis. */
(function () {
    var box = document.getElementById('pv-filters')
    if (!box || !window.fetch) return
    var api = new URL('../api/v1/articles/provenance.json', location.href).href
    fetch(api).then(function (r) { return r.json() }).then(function (d) {
        var by = {}
        d.articles.forEach(function (a) { by[new URL('../' + a.url, location.href).pathname] = a })
        var lvl = function (a) { return a.level ? +a.level.slice(1) : -1 }
        var match = function (f, a) {
            if (!a) return f.id === 'all'
            if (f.origin && f.origin.indexOf(a.origin) < 0) return false
            if (f.research && f.research.indexOf(a.research) < 0) return false
            if (f.type && f.type.indexOf(a.type) < 0) return false
            if (f.min_level != null && lvl(a) < f.min_level) return false
            return true
        }
        var count = function (f) { return d.articles.filter(function (a) { return match(f, a) }).length }
        var apply = function (f) {
            document.querySelectorAll('.view li').forEach(function (li) {
                var a = li.querySelector('a[href$=".html"]')
                if (!a) return
                var row = by[new URL(a.getAttribute('href'), location.href).pathname]
                li.hidden = f.id !== 'all' && !match(f, row)
            })
            box.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.id === f.id)) })
        }
        var label = document.createElement('span'); label.className = 'pv-filters-label'; label.textContent = 'Show:'
        box.appendChild(label)
        d.filters.forEach(function (f) {
            var n = f.id === 'all' ? d.articles.length : count(f)
            var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.id = f.id
            b.textContent = f.label + ' (' + n + ')'
            b.disabled = n === 0
            b.addEventListener('click', function () { apply(f) })
            box.appendChild(b)
        })
        box.hidden = false
        apply(d.filters[0])
    }).catch(function () { /* the list stays whole */ })
})()
