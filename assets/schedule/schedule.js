/* schedule.js: the reader's own day (a first step to the personal schedule): an "Add to my day" button on every event
 * page and beside every event in an agenda list, and the page /my-day/ (the .pt-myday hook of content/my-day.md) listing
 * the picks by day, in time order, from the search index. Kept in this browser (localStorage nr.schedule.v1) and, when the
 * reader's vault is open, in it too (window.__vault, path agenda/picks), merged by pick. Nothing is sent anywhere.
 * Tool schedule.picks (read). Words: content/my-day.md; the few labels here are the buttons'.
 */
(function (w, d) {
    'use strict'
    const Site = w.NRSite
    if (!Site) return
    const KEY = 'nr.schedule.v1', VPATH = 'agenda/picks'
    const EVENT = /(?:^|\/)events\/([^/]+)\/index\.html$/
    const load = () => { try { const s = JSON.parse(w.localStorage.getItem(KEY)); if (s && s.v === 1 && Array.isArray(s.picks)) return s } catch (e) { /* none */ } return { v: 1, picks: [] } }
    const save = s => { try { w.localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { /* none */ } }
    const has = id => load().picks.some(p => p.id === id)
    let vtimer = null
    function toVault() {
        clearTimeout(vtimer)
        vtimer = setTimeout(() => { if (w.__vault) w.__vault.save(VPATH, load()).catch(() => { /* kept in the browser */ }) }, 2000)
    }
    function toggle(id) {
        const s = load(), i = s.picks.findIndex(p => p.id === id)
        if (i >= 0) s.picks.splice(i, 1); else s.picks.push({ id, at: new Date().toISOString() })
        save(s); toVault()
        w.dispatchEvent(new CustomEvent('nr:schedule', { detail: { id, picked: i < 0 } }))
        return i < 0
    }
    async function fromVault() {
        const V = w.__vault
        if (!V || !V.status().open) return false
        const theirs = await V.load(VPATH)
        if (!theirs || !Array.isArray(theirs.picks)) return false
        const s = load(), m = new Map(s.picks.map(p => [p.id, p]))
        for (const p of theirs.picks) if (!m.has(p.id)) m.set(p.id, p)
        s.picks = [...m.values()]
        save(s)
        return true
    }
    ;(w.__toolQueue = w.__toolQueue || []).push(['register', 'schedule.picks', {
        level: 'read', owner: 'schedule', params: { type: 'object', properties: {} }, example: {},
        description: "The sessions the reader picked for their own day, kept in their browser: event ids with the time they were added.",
        async run() { return load() },
    }])

    const el = (tag, cls, text) => { const e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    function button(id, small) {
        const b = el('button', 'btn quiet nr-pick')
        b.type = 'button'; if (small) b.classList.add('nr-sm')
        const paint = () => { const on = has(id); b.textContent = on ? '★ In my day' : '☆ Add to my day'; b.setAttribute('aria-pressed', on ? 'true' : 'false') }
        paint()
        b.addEventListener('click', e => { e.preventDefault(); toggle(id); paint() })
        w.addEventListener('nr:schedule', e => { if (e.detail.id === id) paint() })
        return b
    }
    function decorate() {
        const here = EVENT.exec(w.location.pathname)
        const h1 = d.querySelector('main h1')
        if (here && h1 && !d.querySelector('.nr-pick')) h1.after(button(here[1]))
        // every link to an event inside a list item or a table cell of the page's body: one button beside it
        for (const a of d.querySelectorAll('main li > a[href], main td > a[href]')) {
            if (a.closest('nav, .toc, .crumbs, .pt-myday')) continue
            const m = EVENT.exec(new URL(a.getAttribute('href'), w.location.href).pathname)
            const box = a.parentNode
            if (m && !box.querySelector('.nr-pick')) { const b = button(m[1]); b.classList.add('nr-sm'); box.append(' ', b) }
        }
    }

    async function draw(root) {
        root.replaceChildren()
        const picks = load().picks
        if (!picks.length) { root.append(el('p', '', 'Nothing in your day yet: add sessions from any event page or the agenda.')); return }
        let docs
        try { docs = (await Site.fetchJSON('api/v1/search/docs.json')).docs } catch (e) { root.append(el('p', '', 'The programme did not load: ' + e.message)); return }
        const byId = new Map(docs.map(r => [r[0], r]))
        const days = new Map()
        for (const p of picks) {
            const r = byId.get('event:' + p.id)
            if (!r) continue
            const day = ((r[5] && r[5].d) || ['zzzz'])[0]
            if (!days.has(day)) days.set(day, [])
            days.get(day).push(r)
        }
        for (const day of [...days.keys()].sort()) {
            const when = day === 'zzzz' ? 'No day' : new Date(day + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
            root.append(el('h2', '', when))
            const ul = el('ul', 'rows')
            for (const r of days.get(day).sort((a, b) => ((a[6] && a[6].s) || '99').localeCompare((b[6] && b[6].s) || '99'))) {
                const li = el('li'), a = el('a', '', r[2]); a.href = Site.url(r[4])
                const ex = r[6] || {}
                li.append(el('strong', '', ex.s ? ex.s + (ex.e ? ' to ' + ex.e : '') + ' ' : ''), a, el('span', '', ex.w ? ' · ' + ex.w : ''), ' ', button(r[0].slice(6), true))
                ul.append(li)
            }
            root.append(ul)
        }
        w.addEventListener('nr:schedule', () => draw(root), { once: true })
    }

    function init() {
        decorate()
        w.addEventListener('nr-vault-status', () => { fromVault().then(ok => { const r = d.querySelector('.pt-myday'); if (ok && r) draw(r) }).catch(() => { }) })
        const root = d.querySelector('.pt-myday')
        if (root) draw(root)
    }
    w.NRSchedule = { picks: () => load().picks, toggle, has }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init()
})(window, document)
