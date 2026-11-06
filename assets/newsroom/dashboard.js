// The dashboard's live parts (features/dashboard.mjs): the UTC clock and each scheduled agent's next wake, from
// api/v1/newsroom/dashboard.json; drawn into the layout hook .dash-live. Without it, the page shows the build's time.
(function () {
    var box = document.querySelector('.dash-live'); if (!box || !window.fetch) return
    var api = window.NRSite && window.NRSite.url ? window.NRSite.url('api/v1/newsroom/dashboard.json') : new URL('../../api/v1/newsroom/dashboard.json', location.href)
    fetch(api).then(function (r) { return r.json() }).then(function (M) {
        var clock = document.createElement('p'), list = document.createElement('p')
        box.textContent = ''; box.append(clock, list)
        function tick() {
            var now = new Date(), mins = now.getUTCMinutes()
            clock.textContent = 'Now ' + now.toISOString().slice(11, 16) + ' UTC.'
            var next = M.agents.filter(function (a) { return a.scheduled && a.minute != null }).map(function (a) { return { r: a.role, in: (a.minute - mins + 60) % 60 || 60 } }).sort(function (a, b) { return a.in - b.in })
            list.textContent = 'Next wakes: ' + next.slice(0, 6).map(function (n) { return n.r + ' in ' + n.in + ' min' }).join(', ') + '.'
        }
        tick(); setInterval(tick, 30000)
    }).catch(function () { })
})()
