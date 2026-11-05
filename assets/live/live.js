/* The live strip: fills <div id="nr-live"> with what is on now and next, from api/v1/live/agenda.json.
   Only between the shell's data-start and data-end (the summit), and only in the reader's browser. Lisbon is on UTC
   in November, so the clock is read in UTC. ?now=2026-11-10T11:52 on the page shows any moment. Markup and look:
   design/README.md, "the live strip" (.live-strip in assets/site.css). */
(function () {
    var root = document.getElementById('nr-live'); if (!root) return
    var q = new URLSearchParams(location.search).get('now')
    var now = q ? new Date(q + (q.length <= 16 ? ':00Z' : '')) : new Date()
    var start = Date.parse(root.dataset.start || ''), end = Date.parse(root.dataset.end || '')
    if (isNaN(now) || !(now >= start - 14 * 3600e3 && now <= end + 6 * 3600e3)) return
    var me = document.currentScript || document.querySelector('script[src$="assets/live/live.js"]')
    var base = me.src.replace(/assets\/live\/live\.js.*$/, '')
    var day = now.toISOString().slice(0, 10), t = now.toISOString().slice(11, 16)
    var e = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
    fetch(base + 'api/v1/live/agenda.json').then(function (r) { return r.json() }).then(function (j) {
        var today = j.items.filter(function (i) { return i.date === day && i.official })
        var rank = function (i) { return (i.centre ? 0 : i.kind === 'announcement' ? 1 : 2) }
        var on = today.filter(function (i) { var p = i.time.split('-'); return p[0] <= t && t < p[1] && p[1] > p[0] })
            .sort(function (a, b) { return rank(a) - rank(b) || (b.time < a.time ? -1 : 1) })[0]
        var next = today.filter(function (i) { return i.time.slice(0, 5) > t }).sort(function (a, b) { return a.time.localeCompare(b.time) || rank(a) - rank(b) })[0]
        if (!on && !next) return
        var bit = function (label, i, cls) { return '<span class="' + cls + '"><b>' + label + '</b><time>' + e(i.time.slice(0, 5)) + '</time><a href="' + e(base + i.page) + '">' + e(i.title) + '</a><span class="where">' + e(i.place) + '</span></span>' }
        root.innerHTML = '<aside class="live-strip" aria-label="Live from the summit"><div class="row"><span class="live-tag"><span class="pulse" aria-hidden="true"></span>Live</span>' +
            (on ? bit('Now', on, 'live-now') : '') + (next ? bit('Next', next, on ? 'live-next' : 'live-now') : '') +
            '<a class="more" href="' + e(base) + 'events/index.html#web-summit-' + day + '">Today’s agenda</a></div></aside>'
    }).catch(function () { })
})()
