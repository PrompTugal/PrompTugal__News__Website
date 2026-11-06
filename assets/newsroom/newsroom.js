// The control centre's one script: the filters on the runs page. Without it, every run is shown.
(function () {
    var form = document.querySelector('.adm-filters'); if (!form) return
    var table = document.getElementById(form.getAttribute('data-for')); if (!table) return
    var rows = [].slice.call(table.querySelectorAll('tbody tr[id]')), days = [].slice.call(table.querySelectorAll('tbody tr.day'))
    var sels = [].slice.call(form.querySelectorAll('select')), out = form.querySelector('output')
    var params = new URLSearchParams(location.search)
    sels.forEach(function (s) { var v = params.get(s.getAttribute('data-f')); if (v) s.value = v })
    function apply() {
        var want = {}, shown = 0
        sels.forEach(function (s) { if (s.value) want[s.getAttribute('data-f')] = s.value })
        rows.forEach(function (r) {
            var ok = Object.keys(want).every(function (k) { return (' ' + (r.getAttribute('data-' + k) || '') + ' ').indexOf(' ' + want[k] + ' ') >= 0 })
            r.hidden = !ok; if (ok) shown++
        })
        days.forEach(function (d) { var n = d.nextElementSibling, any = false; while (n && !n.classList.contains('day')) { if (!n.hidden) any = true; n = n.nextElementSibling } d.hidden = !any })
        if (out) out.textContent = shown + ' of ' + rows.length + ' runs'
        var q = new URLSearchParams(want).toString()
        history.replaceState(null, '', q ? '?' + q + location.hash : location.pathname + location.hash)
    }
    sels.forEach(function (s) { s.addEventListener('change', apply) })
    form.addEventListener('submit', function (e) { e.preventDefault() })
    form.hidden = false
    apply()
})()
