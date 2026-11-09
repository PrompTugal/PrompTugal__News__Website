/* The news app on the web, step 1 (board/briefs/2026-11-09-the-app-on-the-web.md): the programme by day, the reader's
 * picks (the site's own, localStorage nr.schedule.v1, shared with "Add to my day" and /my-day/), clashes between picks,
 * the free time between them, and Add to Calendar as .ics files made in the browser. It reads the public programme
 * (api/v1/days/); the picks never leave the browser. Words: the template (assets/app/app.tmpl). dev@PrompTugal.dinis. */
(function () {
    'use strict'
    var root = document.getElementById('pt-app'); if (!root) return
    var up = root.getAttribute('data-up') || '../', W = {}
    try { W = JSON.parse(document.getElementById('pa-words').textContent) } catch (e) { }
    if (window.top !== window) document.documentElement.classList.add('pa-in-pane')
    var KEY = 'nr.schedule.v1', DAYS = [], st = { day: '', tab: 'all', q: '' }
    var list = root.querySelector('.pa-list'), nav = root.querySelector('.pa-days'), q = root.querySelector('.pa-q'), all = root.querySelector('.pa-ics-all')

    function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1 && Array.isArray(s.picks)) return s } catch (e) { } return { v: 1, picks: [] } }
    function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { } }
    function picked(id) { return load().picks.some(function (p) { return p.id === id }) }
    function toggle(id) { var s = load(), i = s.picks.findIndex(function (p) { return p.id === id }); if (i >= 0) s.picks.splice(i, 1); else s.picks.push({ id: id, at: new Date().toISOString() }); save(s) }
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }
    function mins(t) { var p = (t || '').split(':'); return +p[0] * 60 + +p[1] }
    function span(i) { if (!/^\d\d:\d\d/.test(i.time || '')) return [0, 1440]; var p = i.time.split('-'), a = mins(p[0]); return [a, p[1] ? Math.max(mins(p[1]), a) : a + 30] }
    function allDay(i) { return !/^\d\d:\d\d/.test(i.time || '') }
    function hm(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0') }
    function rel(u) { return up + String(u || '').replace(/^https:\/\/promptugal\.news\//, '') + (/\/$/.test(u) ? 'index.html' : '') }

    // the .ics text for one or more sessions (Lisbon is UTC in November, so the times are written in UTC)
    function ics(items) {
        var stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', esc = function (s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n') }
        var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PrompTugal.news//app//EN', 'CALSCALE:GREGORIAN']
        items.forEach(function (i) {
            var s = span(i), d = i.date.replace(/-/g, ''), n = new Date(Date.parse(i.date) + 864e5).toISOString().slice(0, 10).replace(/-/g, '')
            var when = allDay(i) ? ['DTSTART;VALUE=DATE:' + d, 'DTEND;VALUE=DATE:' + n] : ['DTSTART:' + d + 'T' + hm(s[0]).replace(':', '') + '00Z', 'DTEND:' + d + 'T' + hm(s[1]).replace(':', '') + '00Z']
            out.push('BEGIN:VEVENT', 'UID:' + i.id + '@promptugal.news', 'DTSTAMP:' + stamp, when[0], when[1],
                'SUMMARY:' + esc(i.title), 'LOCATION:' + esc(i.where), 'URL:' + (i.page || ''), 'DESCRIPTION:' + esc(i.source || ''), 'END:VEVENT')
        })
        out.push('END:VCALENDAR'); return out.join('\r\n') + '\r\n'
    }
    function download(name, items) { var a = el('a'); a.href = URL.createObjectURL(new Blob([ics(items)], { type: 'text/calendar' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 500) }

    function dayItems(d) { var x = DAYS.find(function (y) { return y.date === d }); return x ? x.items : [] }
    function mine() { var ids = load().picks.map(function (p) { return p.id }), out = []; DAYS.forEach(function (d) { d.items.forEach(function (i) { if (ids.indexOf(i.id) >= 0) out.push(i) }) }); return out }

    function row(i, clash) {
        var s = span(i), li = el('li', 'pa-it' + (picked(i.id) ? ' on' : '') + (clash.length ? ' clash' : ''))
        var t = el('time', null, allDay(i) ? W.all_day : hm(s[0])), body = el('div'), a = el('a', null, i.title); a.href = rel(i.page); a.target = '_top'
        body.appendChild(a); body.appendChild(el('p', 'pa-meta', (i.kind ? i.kind + ' · ' : '') + (i.where || '') + (allDay(i) ? '' : ' · ' + (W.until || 'until') + ' ' + hm(s[1]))))
        if (clash.length) body.appendChild(el('p', 'pa-clash', (W.clash || 'Clashes with') + ' ' + clash.map(function (c) { return c.title }).join('; ')))
        var b = el('button', 'pa-pick', picked(i.id) ? W.picked : W.pick); b.type = 'button'; b.setAttribute('aria-pressed', picked(i.id) ? 'true' : 'false')
        b.addEventListener('click', function () { toggle(i.id); draw() })
        var c = el('button', 'pa-cal', W.ics || 'Calendar'); c.type = 'button'; c.addEventListener('click', function () { download(i.id + '.ics', [i]) })
        var tools = el('div', 'pa-tools'); tools.appendChild(b); if (picked(i.id)) tools.appendChild(c)
        li.appendChild(t); li.appendChild(body); li.appendChild(tools); return li
    }

    // where I need to be next: today's next pick (or the one on now), its place, and Directions (the maps app, the destination
    // only, opened by the reader: nothing is sent from here)
    var nx = root.querySelector('.pa-next')
    function next() {
        var now = new Date(), today = now.toISOString().slice(0, 10), m = now.getUTCHours() * 60 + now.getUTCMinutes()
        var ids = load().picks.map(function (p) { return p.id }), list = dayItems(today).filter(function (i) { return ids.indexOf(i.id) >= 0 && !allDay(i) && span(i)[1] - span(i)[0] <= 180 && span(i)[1] > m })
        list.sort(function (a, b) { return span(a)[0] - span(b)[0] })
        var i = list[0]; nx.hidden = !i; if (!i) return
        var wait = span(i)[0] - m, apple = /iPhone|iPad|Macintosh/.test(navigator.userAgent)
        nx.querySelector('.pa-next-k').textContent = wait <= 0 ? W.next_now : W.next_in + ' ' + (wait >= 60 ? Math.floor(wait / 60) + ' ' + W.next_h + ' ' : '') + (wait % 60) + ' ' + W.next_min
        nx.querySelector('.pa-next-t').textContent = hm(span(i)[0]) + ' ' + i.title
        nx.querySelector('.pa-next-w').textContent = i.where || ''
        nx.querySelector('.pa-dir').href = (apple ? 'https://maps.apple.com/?daddr=' : 'https://www.google.com/maps/dir/?api=1&destination=') + encodeURIComponent(i.where || 'Web Summit, Lisbon')
    }
    function draw() {
        next()
        nav.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-d') === st.day ? 'true' : 'false') })
        root.querySelectorAll('.pa-tabs button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tab') === st.tab ? 'true' : 'false') })
        var items = dayItems(st.day).slice().sort(function (a, b) { return span(a)[0] - span(b)[0] }), ids = load().picks.map(function (p) { return p.id })
        var picks = items.filter(function (i) { return ids.indexOf(i.id) >= 0 })
        var long = function (i) { var s = span(i); return s[1] - s[0] > 180 }  // all-day things (registration, the expo) clash with nothing
        var clashOf = function (i) { var s = span(i); return ids.indexOf(i.id) < 0 || long(i) ? [] : picks.filter(function (p) { var r = span(p); return p.id !== i.id && !long(p) && r[0] < s[1] && s[0] < r[1] }) }
        var n = st.q.toLowerCase(), shown = (st.tab === 'mine' ? picks : items).filter(function (i) { return !n || (i.title + ' ' + i.where + ' ' + i.kind).toLowerCase().indexOf(n) >= 0 })
        list.textContent = ''
        if (!shown.length) { list.appendChild(el('p', 'pa-note', st.tab === 'mine' ? W.none_mine : W.none)); all.hidden = !mine().length; return }
        var ul = el('ul', 'pa-ul'), last = null
        shown.forEach(function (i) {
            // in My picks, the free time between one pick and the next (half an hour or more)
            if (st.tab === 'mine' && last !== null && !long(i) && span(i)[0] - last >= 30) ul.appendChild(el('li', 'pa-free', (W.free || 'Free') + ' ' + hm(last) + ' to ' + hm(span(i)[0])))
            ul.appendChild(row(i, clashOf(i))); if (!long(i)) last = Math.max(last || 0, span(i)[1])
        })
        list.appendChild(ul); all.hidden = !mine().length
    }

    function start(days) {
        DAYS = days
        var today = new Date().toISOString().slice(0, 10), ds = DAYS.map(function (d) { return d.date })
        st.day = ds.indexOf(today) >= 0 ? today : (ds.find(function (d) { return d > today }) || ds[ds.length - 1])
        DAYS.forEach(function (d) {
            var b = el('button', null, d.label.replace(/ November$/, '').replace(/^(\w{3})\w*/, '$1')); b.type = 'button'; b.setAttribute('data-d', d.date)
            if (d.date === today) b.className = 'today'
            b.addEventListener('click', function () { st.day = d.date; draw() }); nav.appendChild(b)
        })
        draw()
    }
    root.querySelectorAll('.pa-tabs button').forEach(function (b) { b.addEventListener('click', function () { st.tab = b.getAttribute('data-tab'); draw() }) })
    q.addEventListener('input', function () { st.q = q.value; draw() })
    all.addEventListener('click', function () { download('promptugal-my-picks.ics', mine()) })
    window.addEventListener('storage', function (e) { if (e.key === KEY) draw() })
    setInterval(function () { if (DAYS.length) next() }, 60000)

    // Add to Home Screen opens the app full screen; the site's own offline worker keeps it and the programme on the device
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register(up + 'sw.js', { scope: up }).catch(function () { })
    fetch(up + 'api/v1/days.json').then(function (r) { return r.json() }).then(function (j) {
        return Promise.all(j.days.map(function (d) { return fetch(up + 'api/v1/days/' + d.date + '.json').then(function (r) { return r.json() }).then(function (x) { x.items.forEach(function (i) { i.date = d.date }); return { date: d.date, label: d.label, items: x.items } }) }))
    }).then(start).catch(function () { list.textContent = ''; list.appendChild(el('p', 'pa-note', W.failed)) })
})()
