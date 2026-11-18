/**
 * now-live.js: "Now in <town>" refreshed in the reader's browser from data.promptugal.news, whose IPMA collectors run in CI
 * twice an hour (conductor.b@, 18 Nov: the main site's now files waited on a session's wake). The built lines stay as the
 * fallback: a value is replaced only when the data site's reading is newer than the built one. The place's station and
 * warning area come from our own api/v1/by-place/<id>/now.json; only public files are fetched, credentials omitted,
 * nothing about the reader sent beyond the request itself. Every string by textContent. dev@PrompTugal.dinis.
 */
(function () {
    var DATA = 'https://data.promptugal.news/api/v1/'
    function el(t, x) { var e = document.createElement(t); if (x != null) e.textContent = x; return e }
    function get(u) { return fetch(u, { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() }) }
    function hm(s) { return String(s || '').slice(11, 16) + ' UTC' }
    function line(li, label, text, link, linkText, note) {
        li.replaceChildren(el('strong', label), document.createTextNode(' ' + text + ' '))
        var em = el('em'), a = el('a', linkText); a.href = link; a.target = '_blank'; a.rel = 'noopener'
        em.append(a, document.createTextNode(note)); li.append(em)
    }
    function go() {
        var ul = document.querySelector('ul.bp-now'); if (!ul) return
        var id = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '').split('/').pop()
        if (!/^[a-z0-9-]+$/.test(id || '')) return
        get(location.origin + '/api/v1/by-place/' + id + '/now.json').then(function (mine) {
            return Promise.all([get(DATA + 'ipma-observations/latest.json'), get(DATA + 'ipma-warnings/latest.json')]).then(function (r) {
                var obs = r[0], warn = r[1], lis = ul.querySelectorAll(':scope > li')
                // Now: the same station, if the data site's hour is newer than ours
                var st = mine.station, mineAt = st && st.reading && st.reading.at
                var s = st && (obs.stations || []).filter(function (x) { return x.id === st.id })[0]
                if (s && s.reading && s.reading.temp_c != null && Date.parse(obs.hour_utc) > Date.parse(mineAt || 0)) {
                    var li = [].filter.call(lis, function (x) { return x.querySelector('strong') && x.querySelector('strong').textContent === 'Now' })[0]
                    var R = s.reading, q = function (v) { return v == null ? '?' : v }
                    if (li) line(li, 'Now', q(R.temp_c) + ' °C · humidity ' + q(R.humidity_pct) + '% · wind ' + q(R.wind_kmh) + ' km/h', (obs.provenance && obs.provenance.page) || st.page, st.name,
                        ', ' + st.km + ' km, ' + hm(obs.hour_utc) + ' (live, via data.promptugal.news)')
                }
                // Warnings: the place's area, if the data site read after our build's file
                var area = mine.warnings && String(mine.warnings.area || '').split(' ')[0]
                if (area && Date.parse(warn.read_at) > Date.parse(mine.read_at || 0)) {
                    var now = Date.now(), act = (warn.active || []).filter(function (w) { return w.area === area && Date.parse(w.end + 'Z') > now })
                    var old = [].filter.call(lis, function (x) { var t = x.querySelector('strong'); return t && /^Warning/.test(t.textContent) })
                    if (old.length) {
                        var page = (warn.provenance && warn.provenance.page) || mine.warnings.page, first = old[0]
                        var fresh = act.length ? act.map(function (w) { var li = el('li'); line(li, 'Warning', w.level.replace(/^./, function (c) { return c.toUpperCase() }) + ': ' + w.type + ' from ' + String(w.start).slice(0, 16).replace('T', ' '), page, 'IPMA', ', read ' + hm(warn.read_at) + ' (live)'); return li })
                            : [(function () { var li = el('li'); line(li, 'Warnings', 'none', page, 'IPMA', ', read ' + hm(warn.read_at) + ' (live)'); return li })()]
                        fresh.forEach(function (n) { ul.insertBefore(n, first) }); old.forEach(function (o) { o.remove() })
                    }
                }
            })
        }).catch(function () { /* the built lines stay */ })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go()
})()
