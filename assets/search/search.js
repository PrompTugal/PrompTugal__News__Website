/* search.js: search in the page. The Search button in the top bar (#nr-tools) with the instant dropdown, the full
 * page /search/ (facets, ?q=), the "/" key, and the `search` tool on window.__tool. The index and ranking are in
 * search-core.js (shared with the build); the files are fetched from this site and nothing is sent anywhere.
 * Markup and class names are the designer's (design/README.md: .search, .search-pop, .sp-*, .results, .res).
 */
(function (w, d) {
    'use strict'
    const Core = w.NRSearchCore, Site = w.NRSite
    if (!Core || !Site) return
    const engine = Core.createEngine(rel => Site.fetchJSON(rel))
    w.NRSearch = engine
    const TL = Core.TYPE_LABEL, TP = Core.TYPE_PLURAL
    const ORDER = ['topic', 'company', 'event', 'person', 'organisation', 'place', 'article', 'site', 'newsroom', 'story']
    const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    const marked = (text, ws) => Core.mark(text, ws).map(([t, hit]) => hit ? `<mark>${esc(t)}</mark>` : esc(t)).join('')
    const searchPage = Site.url('search/index.html')
    const onSearchPage = () => !!d.getElementById('nr-search-page')
    let uid = 0

    /* ---------------------------------------------------------------- the tool */
    ;(w.__toolQueue = w.__toolQueue || []).push(['register', 'search', Core.searchTool(engine, Site.base || '')])

    /* ---------------------------------------------------------------- shared: the dropdown on any .search form */
    function grouped(results, cap) {
        const by = {}
        for (const r of results) (by[r.doc.type] = by[r.doc.type] || []).push(r)
        // groups in the order of their best result, so the best match is always the first one offered
        return Object.keys(by).sort((a, b) => results.indexOf(by[a][0]) - results.indexOf(by[b][0]) || ORDER.indexOf(a) - ORDER.indexOf(b)).map(t => [t, by[t].slice(0, cap)])
    }
    function attachInstant(form, input, opts) {
        opts = opts || {}
        const pop = d.createElement('div')
        pop.className = 'search-pop'
        pop.id = `nr-sp-${++uid}`
        pop.setAttribute('role', 'listbox')
        pop.setAttribute('aria-label', 'Suggestions')
        pop.hidden = true
        form.appendChild(pop)
        input.setAttribute('role', 'combobox')
        input.setAttribute('aria-controls', pop.id)
        input.setAttribute('aria-expanded', 'false')
        input.setAttribute('aria-autocomplete', 'list')
        input.setAttribute('autocomplete', 'off')
        let timer = null, last = '', sel = -1
        const items = () => [...pop.querySelectorAll('.sp-item')]
        const select = i => {
            const it = items()
            sel = it.length ? (i + it.length) % it.length : -1
            it.forEach((el, j) => el.setAttribute('aria-selected', j === sel ? 'true' : 'false'))
            if (sel >= 0) { input.setAttribute('aria-activedescendant', it[sel].id); it[sel].scrollIntoView({ block: 'nearest' }) }
        }
        const close = () => { pop.hidden = true; input.setAttribute('aria-expanded', 'false'); sel = -1 }
        async function run() {
            const q = input.value
            if (q === last && !pop.hidden) return
            last = q
            if (!Core.words(q).length) { close(); return }
            let r
            try { r = await engine.query(q, { limit: 14 }) } catch (e) { pop.innerHTML = `<div class="sp-foot">The index did not load (${esc(e.message)}).</div>`; pop.hidden = false; return }
            if (input.value !== q) return
            const groups = grouped(r.results, 4)
            pop.innerHTML = (groups.length ? groups.map(([t, rs]) => `<div class="sp-group"><h4>${esc(TP[t] || t)}</h4>${rs.map(x => `<a class="sp-item" role="option" id="${pop.id}-${x.doc.i}" aria-selected="false" href="${esc(Site.url(x.doc.url))}"><span class="t1">${marked(x.doc.title, r.words)}</span><span class="t2">${esc(x.doc.summary)}</span><span class="k tag">${esc(TL[x.doc.type] || x.doc.type)}</span></a>`).join('')}</div>`).join('')
                : `<div class="sp-group"><p class="sp-none">Nothing matches "${esc(q)}".</p></div>`) +
                `<div class="sp-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</span><a href="${esc(searchPage)}?q=${encodeURIComponent(q)}">All results for "${esc(q)}"${r.total ? ` (${r.total})` : ''}</a></div>`
            pop.hidden = false
            input.setAttribute('aria-expanded', 'true')
            sel = -1
            if (opts.autoselect !== false && groups.length) select(0)
        }
        input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 70) })
        input.addEventListener('focus', () => { if (input.value && pop.hidden && opts.reopen !== false) { last = ''; run() } })
        input.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); if (pop.hidden) run(); else select(sel + 1) }
            else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1) }
            else if (e.key === 'Escape') { if (!pop.hidden) { e.preventDefault(); close() } else if (opts.onEscape) opts.onEscape() }
            else if (e.key === 'Enter') {
                const it = items()
                if (!pop.hidden && sel >= 0 && it[sel]) { e.preventDefault(); w.location.href = it[sel].href }
            }
        })
        d.addEventListener('click', e => { if (!form.contains(e.target)) close() })
        return { run, close }
    }

    /* ---------------------------------------------------------------- the top bar: a Search button and a floating box */
    function topBar() {
        const tools = Site.mount('nr-tools')
        if (tools.querySelector('.nr-search-btn')) return
        let btn = tools.querySelector('a.tool[href*="search"]')   // the designer's shell may already draw it
        if (!btn) {
            btn = d.createElement('a')
            btn.className = 'tool'
            btn.href = searchPage
            btn.setAttribute('aria-label', 'Search')
            btn.innerHTML = `${ICON}<span class="tool-label">Search</span><kbd>/</kbd>`
            tools.insertBefore(btn, tools.firstChild)
        }
        btn.classList.add('nr-search-btn')
        btn.setAttribute('aria-keyshortcuts', '/')
        const box = d.createElement('div')
        box.className = 'nr-search-float'
        box.hidden = true
        box.setAttribute('role', 'dialog')
        box.setAttribute('aria-label', 'Search the newsroom')
        box.innerHTML = `<form class="search" role="search" action="${esc(searchPage)}"><label class="visually-hidden" for="nr-q-top">Search the newsroom</label>${ICON.replace('<svg', '<svg class="s-icon"')}<input id="nr-q-top" type="search" name="q" placeholder="Companies, sessions, people, topics"><button type="submit">Search</button></form>`
        d.body.appendChild(box)
        const form = box.querySelector('form'), input = box.querySelector('input')
        const hide = () => { box.hidden = true; btn.setAttribute('aria-expanded', 'false') }
        attachInstant(form, input, { onEscape: () => { hide(); btn.focus() } })
        const place = () => {
            const nav = d.querySelector('nav.site')
            const top = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0
            box.style.top = top + 'px'
        }
        w.NRSearchOpen = q => {
            if (onSearchPage()) { const i = d.getElementById('nr-q'); if (i) { i.focus(); i.select() } return }
            place(); box.hidden = false; btn.setAttribute('aria-expanded', 'true')
            if (q != null) { input.value = q; input.dispatchEvent(new Event('input')) }
            input.focus(); input.select()
        }
        btn.setAttribute('aria-expanded', 'false')
        btn.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); box.hidden ? w.NRSearchOpen() : hide() })
        d.addEventListener('click', e => { if (!box.hidden && !box.contains(e.target) && !btn.contains(e.target)) hide() })
        w.addEventListener('scroll', () => { if (!box.hidden) place() }, { passive: true })
    }
    d.addEventListener('keydown', e => {
        if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
        const t = e.target
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
        e.preventDefault()
        if (w.NRSearchOpen) w.NRSearchOpen()
    })

    /* ---------------------------------------------------------------- the search page */
    const FACETS = [['type', 'Kind'], ['topic', 'Topic'], ['day', 'Day'], ['organiser', 'Organiser'], ['country', 'Country']]
    function searchPageUI(mount) {
        const P = new URLSearchParams(w.location.search)
        const pref = (() => { try { return JSON.parse(w.localStorage.getItem('nr.profile.prefs.v1')) || {} } catch (e) { return {} } })()
        const st = { q: P.get('q') || '', type: P.get('type') || (pref.newsroomFirst && w.PTLogin && w.PTLogin.state().verified ? 'newsroom' : ''), topic: P.get('topic') || '', day: P.get('day') || '', organiser: P.get('organiser') || '', country: P.get('country') || '', limit: 25 }
        mount.innerHTML = `<form class="search" role="search" action=""><label class="visually-hidden" for="nr-q">Search the newsroom</label>${ICON.replace('<svg', '<svg class="s-icon"')}<input id="nr-q" type="search" name="q" placeholder="Companies, sessions, people, topics" value="${esc(st.q)}"><button type="submit">Search</button></form>
<p class="nr-search-status" id="nr-search-status" role="status">Loading the index…</p>
<div class="nr-facets" id="nr-facets"></div>
<ol class="results" id="nr-results"></ol>
<p class="nr-more" id="nr-more" hidden><button type="button" class="btn quiet">Show more</button></p>`
        mount.dataset.ready = 'loading'
        const form = mount.querySelector('form'), input = mount.querySelector('#nr-q')
        const status = mount.querySelector('#nr-search-status'), facetsEl = mount.querySelector('#nr-facets'), list = mount.querySelector('#nr-results'), more = mount.querySelector('#nr-more')
        let labels = {}, docsInfo = null, seq = 0
        const label = (k, v) => k === 'type' ? (TP[v] || v) : k === 'topic' ? (labels.topic || {})[v] || v : k === 'organiser' ? (labels.organiser || {})[v] || v : k === 'day' ? ((labels.day || {})[v] || v).replace(/ November.*/, ' Nov') : v
        const loaded = () => {
            try {
                return performance.getEntriesByType('resource').filter(e => /api\/v1\/search\//.test(e.name)).reduce((a, e) => { a.files++; a.bytes += e.encodedBodySize || e.transferSize || 0; return a }, { files: 0, bytes: 0 })
            } catch (e) { return null }
        }
        function sync() {
            const u = new URL(w.location.href)
            for (const k of ['q', ...FACETS.map(f => f[0])]) { if (st[k]) u.searchParams.set(k, st[k]); else u.searchParams.delete(k) }
            w.history.replaceState(null, '', u)
        }
        async function render() {
            const my = ++seq
            sync()
            if (!Core.words(st.q).length) {
                list.innerHTML = ''
                facetsEl.innerHTML = ''
                more.hidden = true
                status.textContent = docsInfo ? `${docsInfo.count} pages indexed in this browser. Type to search; nothing you type leaves the page.` : 'Type to search.'
                list.innerHTML = `<li class="res nr-tips"><span class="r-kind">Try</span><br>${['security', 'Replit', 'agents', 'Centre Stage', 'Portugal', 'pitch'].map(x => `<a href="?q=${encodeURIComponent(x)}" data-q="${esc(x)}">${esc(x)}</a>`).join(' · ')}</li>`
                mount.dataset.ready = 'full'
                return
            }
            let r
            try { r = await engine.query(st.q, { ...st, limit: st.limit }) } catch (e) { status.textContent = `The index did not load: ${e.message}`; return }
            if (my !== seq) return
            const groups = FACETS.map(([k, name]) => {
                const counts = r.facets[k] || {}
                const keys = Object.keys(counts).sort((a, b) => k === 'day' ? a.localeCompare(b) : counts[b] - counts[a]).slice(0, k === 'country' ? 8 : 12)
                if (!keys.length && !st[k]) return ''
                if (st[k] && !keys.includes(st[k])) keys.unshift(st[k])
                return `<div class="filters" role="group" aria-label="${name}"><span class="label">${name}</span><button type="button" class="chip" data-k="${k}" data-v="" aria-pressed="${!st[k]}">All</button>${keys.map(v => `<button type="button" class="chip" data-k="${k}" data-v="${esc(v)}" aria-pressed="${st[k] === v}">${esc(label(k, v))} <span class="n">${counts[v] || 0}</span></button>`).join('')}</div>`
            }).join('')
            facetsEl.innerHTML = groups
            list.innerHTML = r.results.length ? r.results.map(x => {
                const doc = x.doc, f = doc.facets
                const kind = [TL[doc.type] || doc.type, doc.type === 'event' && f.d ? label('day', f.d[0]) + (doc.extra.s ? ' · ' + doc.extra.s : '') : '', doc.type === 'event' && doc.extra.w ? doc.extra.w : '', doc.type === 'company' && f.c ? f.c : ''].filter(Boolean).join(' · ')
                const meta = [(f.tp || []).map(t => label('topic', t)).join(', '), doc.type === 'event' ? label('organiser', f.o) : '', doc.extra.p ? 'Our pick' : ''].filter(Boolean).join(' · ')
                return `<li class="res"><span class="r-kind">${esc(kind)}</span><br><a class="r-title" href="${esc(Site.url(doc.url))}">${marked(doc.title, r.words)}</a>${doc.summary ? `<p class="r-snip">${marked(doc.summary, r.words)}</p>` : ''}${meta ? `<p class="r-meta">${esc(meta)}</p>` : ''}</li>`
            }).join('') : `<li class="res"><p class="r-snip">Nothing matches "${esc(st.q)}"${FACETS.some(f => st[f[0]]) ? ' with these filters' : ''}.</p></li>`
            more.hidden = r.total <= r.results.length
            const ld = loaded()
            status.textContent = `${r.total} result${r.total === 1 ? '' : 's'} for "${st.q}"` + (ld && ld.files ? ` · the index so far: ${ld.files} files, ${(ld.bytes / 1024).toFixed(0)} KB, from this site only` : '')
            mount.dataset.ready = 'full'
            mount.dataset.total = String(r.total)
        }
        engine.docs().then(dd => { docsInfo = dd; labels = dd.facets || {}; if (!Core.words(st.q).length) render() }).catch(e => { status.textContent = `The index did not load: ${e.message}` })
        let timer = null
        input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { st.q = input.value; st.limit = 25; render() }, 90) })
        form.addEventListener('submit', e => { e.preventDefault(); st.q = input.value; render() })
        facetsEl.addEventListener('click', e => { const b = e.target.closest('button.chip'); if (!b) return; st[b.dataset.k] = b.dataset.v; st.limit = 25; render() })
        list.addEventListener('click', e => { const a = e.target.closest('a[data-q]'); if (!a) return; e.preventDefault(); input.value = st.q = a.dataset.q; render() })
        more.addEventListener('click', () => { st.limit += 25; render() })
        input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; st.q = ''; render() } })
        if (st.q) render()
    }

    /* the big bar: at the top of the page's main column on every page but the search page, larger on the front page */
    function bigBar() {
        const main = d.getElementById('main')
        if (!main || onSearchPage() || main.querySelector('.nr-big')) return
        const form = d.createElement('form'), label = d.createElement('label'), input = d.createElement('input'), btn = d.createElement('button'), holder = d.createElement('span')
        form.className = 'search nr-big'; form.setAttribute('role', 'search'); form.action = searchPage
        label.className = 'visually-hidden'; label.htmlFor = 'nr-q-big'; label.textContent = 'Search the newsroom'
        holder.innerHTML = ICON
        holder.firstChild.setAttribute('class', 's-icon')
        input.id = 'nr-q-big'; input.type = 'search'; input.name = 'q'; input.placeholder = 'Search: a company, a session, a person, a topic'
        btn.type = 'submit'; btn.textContent = 'Search'
        form.append(label, holder.firstChild, input, btn)
        main.insertBefore(form, main.firstChild)
        attachInstant(form, input, {})
    }
    function init() {
        topBar()
        bigBar()
        const m = d.getElementById('nr-search-page')
        if (m) searchPageUI(m)
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init()
})(window, document)
