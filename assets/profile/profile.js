/* profile.js: the reader's own profile, kept in their browser (localStorage `nr.profile.v1`) and never sent anywhere.
 * On every page: records the page view (time, path, title, the page before on this site) and the settled searches
 * (the engine's query, after 1.5 s of quiet); adds a person icon to #nr-tools; registers the tool profile.summary.
 * On /profile/ (the .pt-profile hook of content/profile.md): the profile drawn as the reader's own observability,
 * with Pause, Clear and Download. Words of the page are in content/profile.md; the few labels here are UI labels.
 */
(function (w, d) {
    'use strict'
    const Site = w.NRSite
    const KEY = 'nr.profile.v1', MAX_VIEWS = 500, MAX_SEARCHES = 200
    const store = {
        load() { try { const p = JSON.parse(w.localStorage.getItem(KEY)); if (p && p.v === 1) return p } catch (e) { /* none */ } return { v: 1, since: new Date().toISOString(), paused: false, views: [], searches: [] } },
        save(p) { try { w.localStorage.setItem(KEY, JSON.stringify(p)); return true } catch (e) { return false } },
        clear() { try { w.localStorage.removeItem(KEY) } catch (e) { /* none */ } },
    }
    const relOf = href => { try { const u = new URL(href, w.location.href); if (u.origin !== w.location.origin) return null; return Site && Site.base && u.href.startsWith(Site.base) ? u.pathname + u.search : u.pathname + u.search } catch (e) { return null } }
    const cap = (a, n) => (a.length > n ? a.slice(a.length - n) : a)

    function recordView() {
        const p = store.load()
        if (p.paused) return
        const here = w.location.pathname + w.location.search
        const last = p.views[p.views.length - 1]
        if (last && last.p === here && Date.now() - Date.parse(last.t) < 3000) return
        p.views.push({ t: new Date().toISOString(), p: here, title: (d.title || '').slice(0, 140), from: relOf(d.referrer) })
        p.views = cap(p.views, MAX_VIEWS)
        store.save(p)
    }
    function recordSearch(q) {
        q = String(q || '').trim().slice(0, 200)
        if (q.length < 2) return
        const p = store.load()
        if (p.paused) return
        const last = p.searches[p.searches.length - 1]
        if (last && last.q === q) return
        p.searches.push({ t: new Date().toISOString(), q, on: w.location.pathname })
        p.searches = cap(p.searches, MAX_SEARCHES)
        store.save(p)
    }
    // searches: wrap the engine's query, record a query once it has settled
    let timer = null, pending = ''
    function watchSearch() {
        const e = w.NRSearch
        if (!e || e.__profiled || typeof e.query !== 'function') return !!(e && e.__profiled)
        const q0 = e.query.bind(e)
        e.query = function (q, o) { pending = q; clearTimeout(timer); timer = setTimeout(() => recordSearch(pending), 1500); return q0(q, o) }
        e.__profiled = true
        return true
    }
    const summary = () => {
        const p = store.load(), count = (arr, f) => { const m = {}; for (const x of arr) m[f(x)] = (m[f(x)] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]) }
        return { since: p.since, paused: p.paused, pages: p.views.length, searches: p.searches.length, top_pages: count(p.views, v => v.p).slice(0, 10).map(([path, n]) => ({ path, n })), recent_searches: p.searches.slice(-10).map(s => s.q), recent_pages: p.views.slice(-10).map(v => ({ path: v.p, title: v.title, t: v.t })) }
    }
    ;(w.__toolQueue = w.__toolQueue || []).push(['register', 'profile.summary', {
        level: 'read', owner: 'profile',
        description: "The reader's own profile, kept in their browser: counts, the most visited pages, recent pages and recent searches. It never leaves the browser.",
        params: { type: 'object', properties: {} }, example: {},
        async run() { return summary() },
    }])

    const h = (tag, attrs, ...kids) => { const el = d.createElement(tag); for (const [k, v] of Object.entries(attrs || {})) { if (k === 'class') el.className = v; else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v) } for (const c of kids.flat()) el.append(c && c.nodeType ? c : d.createTextNode(c == null ? '' : String(c))); return el }
    const day = t => t.slice(0, 10)
    const link = (path, text) => { const a = h('a', { href: path }, text); return a }

    function icon() {
        const tools = Site && Site.mount('nr-tools')
        if (!tools || tools.querySelector('.tool.profile')) return
        const a = h('a', { class: 'tool profile', href: Site.url('profile/index.html'), 'aria-label': 'Your profile' })
        a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6 8-6s7 1.5 8 6"/></svg><span class="tool-label">You</span>'
        tools.append(a)
    }

    function draw(root) {
        const render = () => {
            const p = store.load(), s = summary()
            root.replaceChildren()
            root.append(h('dl', { class: 'stats' },
                [['Pages read', s.pages], ['Searches', s.searches], ['Days', new Set(p.views.map(v => day(v.t))).size], ['Since', p.since.slice(0, 10)]].map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))))
            root.append(h('p', { class: 'profile-controls' },
                h('button', { type: 'button', class: 'btn', onclick() { const q = store.load(); q.paused = !q.paused; store.save(q); render() } }, p.paused ? 'Resume recording' : 'Pause recording'), ' ',
                h('button', { type: 'button', class: 'btn', onclick() { const blob = new Blob([JSON.stringify(store.load(), null, 2)], { type: 'application/json' }); const a = h('a', { href: URL.createObjectURL(blob), download: 'promptugal-profile.json' }); d.body.append(a); a.click(); a.remove() } }, 'Download'), ' ',
                h('button', { type: 'button', class: 'btn', onclick() { if (w.confirm('Erase your profile from this browser?')) { store.clear(); render() } } }, 'Clear'),
                p.paused ? h('span', { class: 'chip warn' }, ' paused') : h('span', { class: 'chip ok' }, ' recording')))
            if (!p.views.length && !p.searches.length) { root.append(h('p', {}, 'Nothing recorded yet: open a few pages and come back.')); return }
            root.append(h('h2', {}, 'Most visited'), h('ol', { class: 'rows' }, s.top_pages.map(t => { const v = p.views.filter(x => x.p === t.path).pop(); return h('li', {}, link(t.path, (v && v.title) || t.path), ` · ${t.n}`) })))
            root.append(h('h2', {}, 'Searches'), p.searches.length ? h('ul', { class: 'rows' }, p.searches.slice().reverse().slice(0, 30).map(x => h('li', {}, link(Site.url('search/index.html') + '?q=' + encodeURIComponent(x.q), x.q), ` · ${x.t.slice(0, 16).replace('T', ' ')}`))) : h('p', {}, 'No searches yet.'))
            root.append(h('h2', {}, 'Your path'), h('ol', { class: 'rows' }, p.views.slice().reverse().slice(0, 60).map(v => h('li', {}, `${v.t.slice(0, 16).replace('T', ' ')} `, link(v.p, v.title || v.p), v.from ? ` (from ${v.from})` : ''))))
        }
        render()
    }

    function init() {
        recordView()
        if (d.getElementById('nr-search-page')) recordSearch(new URLSearchParams(w.location.search).get('q'))
        icon()
        if (!watchSearch()) { let n = 0; const iv = setInterval(() => { if (watchSearch() || ++n > 40) clearInterval(iv) }, 250) }
        const root = d.querySelector('.pt-profile')
        if (root) draw(root)
    }
    w.NRProfile = { summary, clear: store.clear, load: store.load }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init()
})(window, document)
