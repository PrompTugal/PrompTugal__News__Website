/* venue.js: "My day on the map" on /summit/venue/ (WS-181 Part B1 item 3). Reads the reader's picks from this browser
 * (localStorage nr.schedule.v1, written by schedule.js) and the programme's places from the page itself (the JSON block
 * #vn-data, written at build time), shades the picked sessions' buildings and lists them by day. No network call of any
 * kind: the picks never leave the browser (the gate checks this file as it checks schedule.js). No person is drawn.
 */
(function (w, d) {
    'use strict'
    const root = d.getElementById('vn-myday'), dataEl = d.getElementById('vn-data')
    if (!root || !dataEl) return
    let data
    try { data = JSON.parse(dataEl.textContent) } catch (e) { return }
    const KEY = 'nr.schedule.v1'
    const picks = () => { try { const s = JSON.parse(w.localStorage.getItem(KEY)); if (s && s.v === 1 && Array.isArray(s.picks)) return s.picks } catch (e) { /* none */ } return [] }
    const el = (tag, cls, text) => { const e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    function draw() {
        for (const p of d.querySelectorAll('.venue-map .vn-mine')) p.classList.remove('vn-mine')
        const list = root.querySelector('.vn-mine-list')
        list.replaceChildren()
        const mine = picks().map(p => ({ id: p.id, ev: data.events[p.id] })).filter(x => x.ev)
        root.hidden = false
        if (!mine.length) { list.append(el('p', '', data.words.empty)); return }
        let placed = 0
        const days = new Map()
        for (const x of mine) {
            const ev = x.ev
            if (ev.k) { placed++; for (const id of data.areas[ev.k] || []) { const a = d.querySelector('.venue-map [data-id="' + id + '"]'); if (a) a.classList.add('vn-mine') } }
            if (!days.has(ev.d)) days.set(ev.d, [])
            days.get(ev.d).push(ev)
        }
        list.append(el('p', 'meta', data.words.count.replace('{n}', placed).replace('{m}', mine.length - placed)))
        for (const day of [...days.keys()].sort()) {
            list.append(el('h3', '', new Date(day + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })))
            const ul = el('ul', 'rows')
            for (const ev of days.get(day).sort((a, b) => (a.t || '99').localeCompare(b.t || '99'))) {
                const li = el('li'), a = el('a', '', ev.n)
                a.href = ev.u
                li.append(el('strong', '', ev.t ? ev.t + ' ' : ''), a, el('span', '', ' · ' + (ev.b || data.words.none)))
                ul.append(li)
            }
            list.append(ul)
        }
    }
    root.append(el('div', 'vn-mine-list'))
    w.addEventListener('nr:schedule', draw)
    w.addEventListener('storage', e => { if (e.key === KEY) draw() })
    draw()
})(window, document)
