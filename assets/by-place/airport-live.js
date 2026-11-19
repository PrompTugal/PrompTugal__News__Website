/**
 * airport-live.js: data in the browser (Dinis, 19 November 2026, about 01:13 UTC: board/guidance/2026-11-19-load-the-data-in-the-browser.md).
 * The "Faro airport" line of Now in <town> is loaded when the page opens, from data.promptugal.news (our own host; no
 * third party, no cookie, no referrer), and replaces the built line only if the file passes its checks: its licence says
 * commercial_use "allowed" (promptugal.news bills: R13), its data_read_at is newer than the built reading, its counts are
 * whole numbers in bounds and each callsign is 3 to 8 capitals and digits. It shows its read time, linked to its source
 * and licence, and is marked stale once older than the file's own stale_after_seconds (twice-daily collection: 13 hours), or twice its cadence. Every value by textContent. dev@PrompTugal.dinis.
 */
(function () {
    var URL_ = 'https://data.promptugal.news/api/v1/adsb-faro/latest.json'
    function el(t, x) { var e = document.createElement(t); if (x != null) e.textContent = String(x); return e }
    function hm(s) { return String(s || '').slice(11, 16) + ' UTC' }
    var ok = function (d) {
        if (!d || !d.license || d.license.commercial_use !== 'allowed') return false
        if (isNaN(Date.parse(d.data_read_at))) return false
        var c = d.counts || {}, n = function (v) { return typeof v === 'number' && v >= 0 && v <= 1000 && Math.floor(v) === v }
        if (!n(c.airline) || !n(c.other_aircraft) || !Array.isArray(d.airline) || d.airline.length > 200) return false
        return d.airline.every(function (a) { return a && /^[A-Z0-9]{3,8}$/.test(String(a.callsign || '')) })
    }
    function go() {
        var li = [].filter.call(document.querySelectorAll('ul.bp-now > li'), function (x) { var s = x.querySelector('strong'); return s && s.textContent === 'Faro airport' })[0]
        if (!li) return
        var id = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '').split('/').pop()
        if (!/^[a-z0-9-]+$/.test(id || '')) return
        fetch(location.origin + '/api/v1/by-place/' + id + '/now.json', { credentials: 'omit' }).then(function (r) { return r.json() }).then(function (mine) {
            var builtAt = mine && mine.airport && mine.airport.at
            return fetch(URL_, { credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error' }).then(function (r) { if (!r.ok) throw 0; return r.json() }).then(function (d) {
                if (!ok(d) || !(Date.parse(d.data_read_at) > Date.parse(builtAt || 0))) return
                var age = Date.now() - Date.parse(d.data_read_at), ec = d.expected_cadence || {}, staleAfter = (ec.stale_after_seconds > 0 ? ec.stale_after_seconds : 2 * (ec.seconds || 3600)) * 1000
                var names = d.airline.slice(0, 6).map(function (a) { return a.callsign }).join(', ')
                li.replaceChildren(el('strong', 'Faro airport'), document.createTextNode(' ' + d.counts.airline + ' airline, ' + d.counts.other_aircraft + ' other, ' + ((d.airport && d.airport.within_nm) || 40) + ' nm' + (names ? ' (' + names + ')' : '') + ' '))
                var em = el('em'), a = el('a', 'adsb.lol'); a.href = (d.provenance && /^https:\/\//.test(d.provenance.page || '') ? d.provenance.page : 'https://globe.adsb.lol/'); a.target = '_blank'; a.rel = 'noopener'
                var lic = el('a', d.license.name || 'ODbL 1.0'); lic.href = /^https:\/\//.test(d.license.url || '') ? d.license.url : 'https://opendatacommons.org/licenses/odbl/1-0/'; lic.target = '_blank'; lic.rel = 'noopener'
                em.append(a, document.createTextNode(', read ' + hm(d.data_read_at) + (age > staleAfter ? ' (stale)' : '') + ', '), lic, document.createTextNode(', via data.promptugal.news'))
                li.append(em)
            })
        }).catch(function () { /* the built line stays */ })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go()
})()
