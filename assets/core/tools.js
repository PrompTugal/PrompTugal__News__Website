/* tools.js: the newsroom's core tools, registered on window.__tool through the queue (assets/core/README.md).
 *
 *   read   get_entity, list_entities, now, agenda, neighbours, get_page          (search is the search feature's)
 *   view   open, highlight
 *
 * Results are compact on purpose (ids, labels, a few fields, the API address) so a model's context stays small.
 * makeCoreTools(env) is pure and runs in Node (admin/tests/chat.test.mjs); in the page env is NRSite plus the DOM.
 * Lisbon is on UTC in November, so the summit's times are UTC times.
 */
(function (root, factory) {
    const api = factory()
    if (typeof module === 'object' && module.exports) module.exports = api
    else if (root.document) api.installInPage(root)
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const PLURAL = { company: 'companies', event: 'events', person: 'people', organisation: 'organisations', place: 'places', topic: 'topics', story: 'stories', evidence: 'evidence' }
    const SINGULAR = Object.fromEntries(Object.entries(PLURAL).map(([k, v]) => [v, k]))
    const GRAPHED = { company: 1, event: 1, person: 1 }
    const PAGED = { company: 1, event: 1, person: 1, organisation: 1, place: 1, topic: 1 }
    const DROP = new Set(['derived', 'field_sources', 'field_sources_method', 'from', 'facts', 'edges', 'recheck', 'desk_files', 'type', 'id'])
    const TYPES = Object.keys(PLURAL)
    const DOCS = 'api/v1/search/docs.json'

    const typeOf = t => { t = String(t || '').toLowerCase().trim(); return PLURAL[t] ? t : SINGULAR[t] || (t.endsWith('s') && PLURAL[t.slice(0, -1)] ? t.slice(0, -1) : null) }
    function parseRef(type, id) {
        let t = type, i = id
        if (!i && /:/.test(String(t))) [t, i] = String(t).split(/:(.*)/)
        if (i && /:/.test(String(i)) && !t) [t, i] = String(i).split(/:(.*)/)
        if (i && /:/.test(String(i))) { const [a, b] = String(i).split(/:(.*)/); if (typeOf(a)) { t = a; i = b } }
        const tt = typeOf(t)
        if (!tt) throw new Error(`unknown type "${type}": one of ${TYPES.join(', ')}`)
        if (!i) throw new Error('an id is needed (the slug, e.g. 1password, or a ref, e.g. company:1password)')
        return { type: tt, id: String(i).trim().replace(/^\/+|\/+$/g, '').replace(/\/index\.html$/, '').split('/').pop() }
    }
    const trimArr = (a, n) => Array.isArray(a) && a.length > n ? a.slice(0, n).concat([`…and ${a.length - n} more`]) : a
    function compact(v, depth) {
        depth = depth || 0
        if (Array.isArray(v)) return trimArr(v.map(x => compact(x, depth + 1)), 12)
        if (v && typeof v === 'object') {
            const o = {}
            for (const [k, x] of Object.entries(v)) if (!(depth === 0 && DROP.has(k)) && x !== null && x !== '' && !(Array.isArray(x) && !x.length)) o[k] = compact(x, depth + 1)
            return o
        }
        if (typeof v === 'string' && v.length > 400) return v.slice(0, 400) + '…'
        return v
    }
    const hm = d => d.toISOString().slice(11, 16)
    const ymd = d => d.toISOString().slice(0, 10)
    const DAYNAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayLabel = s => { const t = new Date(s + 'T12:00:00Z'); return `${DAYNAMES[t.getUTCDay()][0].toUpperCase()}${DAYNAMES[t.getUTCDay()].slice(1)} ${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}` }

    function makeCoreTools(env) {
        const base = env.base || ''
        const abs = rel => rel ? (base ? base + String(rel).replace(/^\//, '') : rel) : null
        const docsFile = () => env.fetchJSON(DOCS)
        const rowObj = (r, i) => ({ i, ref: r[0], type: r[1], title: r[2], summary: r[3], url: r[4], facets: r[5] || {}, extra: r[6] || {} })
        const events = async () => (await docsFile()).docs.map(rowObj).filter(d => d.type === 'event')
        const item = e => ({ ref: e.ref, title: e.title, start: e.extra.s || null, end: e.extra.e || null, where: e.extra.w || null, kind: e.extra.k || null, organiser: e.facets.o === 'web-summit' ? 'Web Summit' : 'around the summit', our_pick: !!e.extra.p, url: abs(e.url) })
        const byStart = (a, b) => String(a.extra.s || '99').localeCompare(String(b.extra.s || '99')) || a.title.localeCompare(b.title)

        function resolveDate(s, today) {
            if (!s || /^today$/i.test(s)) return ymd(today)
            const t = String(s).trim().toLowerCase()
            if (t === 'tomorrow') return ymd(new Date(today.getTime() + 864e5))
            if (t === 'yesterday') return ymd(new Date(today.getTime() - 864e5))
            if (/^\d{4}-\d\d-\d\d$/.test(t)) return t
            const di = DAYNAMES.findIndex(d => d.startsWith(t.slice(0, 3)))
            if (di >= 0) { for (let k = 0; k < 8; k++) { const d = new Date(today.getTime() + k * 864e5); if (d.getUTCDay() === di) return ymd(d) } }
            const m = /(\d{1,2})\s*(nov|november)?/.exec(t)
            if (m) return `2026-11-${m[1].padStart(2, '0')}`
            throw new Error(`a date as YYYY-MM-DD, today, tomorrow or a weekday, not "${s}"`)
        }

        const specs = {
            get_entity: {
                level: 'read',
                description: 'One entity of the newsroom\'s data: a company, event (session, side event), person, organisation, place, topic or story, with its public facts, sources and links. From /api/v1/<type>/<id>.json.',
                params: { type: 'object', properties: { type: { type: 'string', description: 'company, event, person, organisation, place, topic, story or evidence (or a ref like company:1password)' }, id: { type: 'string', description: 'the slug, as in search results\' ref after the colon' } }, required: ['type'] },
                example: { type: 'company', id: '1password' },
                async run(a) {
                    const { type, id } = parseRef(a.type, a.id)
                    const api = `api/v1/${PLURAL[type]}/${id}.json`
                    let j
                    try { j = await env.fetchJSON(api) } catch (e) { throw new Error(`no ${type} with id "${id}" (${api}); search for it first`) }
                    const links = j.links || {}
                    const lk = (arr, dir) => trimArr((arr || []).map(l => ({ verb: l.verb, [dir]: l.to || l.from, label: l.label })), 20)
                    return { ref: j.ref, type, label: j.label, url: j.page || null, api: abs(api), data: compact(j.data), links_out: lk(links.out, 'to'), links_in: lk(links.in, 'from') }
                },
            },
            list_entities: {
                level: 'read',
                description: 'List entities of one type, optionally filtered by topic (a topic id such as security or ai-agents), country, organiser (web-summit or other) or day (YYYY-MM-DD). Compact rows; use get_entity for one in full.',
                params: { type: 'object', properties: { type: { type: 'string', description: 'company, event, person, organisation, place, topic, article or site' }, topic: { type: 'string' }, country: { type: 'string' }, organiser: { type: 'string', enum: ['web-summit', 'other'] }, day: { type: 'string', description: 'YYYY-MM-DD' }, limit: { type: 'integer', description: 'default 40, at most 200' } }, required: ['type'] },
                example: { type: 'company', topic: 'security', country: 'Portugal' },
                async run(a) {
                    const t = a.type === 'article' || a.type === 'site' ? a.type : typeOf(a.type)
                    if (!t) throw new Error(`unknown type "${a.type}"`)
                    const d = await docsFile()
                    const f = (s => s ? String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '')
                    const rows = d.docs.map(rowObj).filter(r => r.type === t
                        && (!a.topic || (r.facets.tp || []).includes(a.topic))
                        && (!a.country || f(r.facets.c) === f(a.country) || f(r.facets.c).startsWith(f(a.country)))
                        && (!a.organiser || r.facets.o === a.organiser)
                        && (!a.day || (r.facets.d || []).includes(a.day)))
                    const limit = Math.min(200, a.limit || 40)
                    return { type: t, filters: { topic: a.topic, country: a.country, organiser: a.organiser, day: a.day }, total: rows.length, items: rows.slice(0, limit).map(r => ({ ref: r.ref, label: r.title, summary: r.summary, url: abs(r.url), ...(t === 'event' ? { start: r.extra.s, where: r.extra.w } : {}) })), ...(rows.length > limit ? { more: rows.length - limit } : {}), topics: a.topic || t !== 'company' ? undefined : d.facets.topic }
                },
            },
            now: {
                level: 'read',
                description: 'The date and time in Lisbon (UTC in November), where the summit stands (before, during, after; Web Summit runs 9 to 12 November 2026), what is on now and what is next. Use it for "today", "now" and "next".',
                params: { type: 'object', properties: {} },
                async run() {
                    const t = env.now(), today = ymd(t), at = hm(t)
                    const evs = await events()
                    const on = evs.filter(e => e.facets.d && e.facets.d[0] === today && e.extra.s && e.extra.s <= at && (e.extra.e ? at < e.extra.e : false)).sort(byStart)
                    const next = evs.filter(e => e.facets.d && e.extra.s && (e.facets.d[0] > today || (e.facets.d[0] === today && e.extra.s > at)))
                        .sort((a, b) => a.facets.d[0].localeCompare(b.facets.d[0]) || byStart(a, b)).slice(0, 6)
                    const todayCount = evs.filter(e => e.facets.d && e.facets.d[0] === today).length
                    const start = '2026-11-09', end = '2026-11-12'
                    const status = today < start ? 'before the summit' : today > end ? 'after the summit' : `day ${Math.round((Date.parse(today) - Date.parse(start)) / 864e5) + 1} of 4 of the summit`
                    return {
                        now: t.toISOString(), lisbon_time: at, date: today, day: dayLabel(today), timezone: 'Lisbon is on UTC (WET) in November',
                        summit: { status, starts: start, ends: end, ...(today < start ? { days_to_go: Math.round((Date.parse(start) - Date.parse(today)) / 864e5) } : {}) },
                        today_items: todayCount, on_now: on.slice(0, 8).map(item), next: next.map(e => ({ ...item(e), date: e.facets.d[0] })),
                    }
                },
            },
            agenda: {
                level: 'read',
                description: 'The agenda of one day, in time order: Web Summit\'s programme and what happens around it. date is YYYY-MM-DD, today (the default), tomorrow or a weekday. Optional filters: organiser (web-summit or other), kind (session, pitch, side-event, night-summit, announcement, registration), topic, our_picks.',
                params: { type: 'object', properties: { date: { type: 'string' }, organiser: { type: 'string', enum: ['web-summit', 'other'] }, kind: { type: 'string' }, topic: { type: 'string' }, our_picks: { type: 'boolean' }, limit: { type: 'integer', description: 'default 60' } } },
                example: { date: 'today' },
                async run(a) {
                    const t = env.now()
                    const date = resolveDate(a.date, t)
                    const all = (await events()).filter(e => (e.facets.d || [])[0] === date)
                    const rows = all.filter(e => (!a.organiser || e.facets.o === a.organiser) && (!a.kind || e.extra.k === a.kind) && (!a.topic || (e.facets.tp || []).includes(a.topic)) && (!a.our_picks || e.extra.p)).sort(byStart)
                    const limit = Math.min(200, a.limit || 60)
                    const at = hm(t), isToday = date === ymd(t)
                    const out = { date, day: dayLabel(date), total: rows.length, items: rows.slice(0, limit).map(e => ({ ...item(e), ...(isToday && e.extra.s ? { status: e.extra.e && e.extra.e <= at ? 'over' : e.extra.s <= at ? 'on now' : 'later' } : {}) })) }
                    if (rows.length > limit) out.more = rows.length - limit
                    if (!all.length) {
                        const days = [...new Set((await events()).map(e => (e.facets.d || [])[0]).filter(Boolean))].sort()
                        out.note = `Nothing is listed for ${date}. Days with items: ${days.join(', ')}.`
                    }
                    return out
                },
            },
            neighbours: {
                level: 'read',
                description: 'What one entity is directly connected to in the newsroom\'s graph (a company\'s sessions, people, field and country; a session\'s speakers, stage and day; a person\'s sessions and organisation). Each row has the verb read forwards and a direction: out is focus -verb-> other, in is other -verb-> focus.',
                params: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, verb: { type: 'string', description: 'keep only this verb (speaks_at, listed_under, filed_under, on_day, takes_place_at, ...)' }, limit: { type: 'integer', description: 'default 40' } }, required: ['type'] },
                example: { type: 'company', id: '1password' },
                async run(a) {
                    const { type, id } = parseRef(a.type, a.id)
                    const focus = `${type}:${id}`
                    const limit = Math.min(200, a.limit || 40)
                    let rows = []
                    if (GRAPHED[type]) {
                        const g = await env.fetchJSON(`api/v1/graph/${PLURAL[type]}/${id}.json`).catch(() => null)
                        if (g) {
                            const node = new Map(g.nodes.map(n => [n.id, n]))
                            for (const e of g.edges) {
                                if (e.from !== focus && e.to !== focus) continue
                                const other = e.from === focus ? e.to : e.from, n = node.get(other) || {}
                                rows.push({ verb: e.verb, direction: e.from === focus ? 'out' : 'in', ref: other, type: n.type, label: n.label, url: n.page ? abs(n.page) : null })
                            }
                        }
                    }
                    if (!rows.length) {
                        const j = await env.fetchJSON(`api/v1/${PLURAL[type]}/${id}.json`).catch(() => { throw new Error(`no ${type} with id "${id}"`) })
                        for (const l of (j.links && j.links.out) || []) rows.push({ verb: l.verb, direction: 'out', ref: l.to, type: l.to.split(':')[0], label: l.label, url: PAGED[l.to.split(':')[0]] ? abs(`${PLURAL[l.to.split(':')[0]]}/${l.to.split(':')[1]}/index.html`) : null })
                        const ont = await env.fetchJSON('api/v1/ontology.json').catch(() => ({ verbs: [] }))
                        const fwd = new Map((ont.verbs || []).map(v => [v.inverse, v.verb]))
                        for (const l of (j.links && j.links.in) || []) rows.push({ verb: fwd.get(l.verb) || l.verb, direction: 'in', ref: l.from, type: l.from.split(':')[0], label: l.label, url: PAGED[l.from.split(':')[0]] ? abs(`${PLURAL[l.from.split(':')[0]]}/${l.from.split(':')[1]}/index.html`) : null })
                    }
                    if (a.verb) rows = rows.filter(r => r.verb === a.verb)
                    rows = rows.filter(r => !['fact', 'source'].includes(r.type))
                    const by = {}
                    for (const r of rows) by[r.verb] = (by[r.verb] || 0) + 1
                    return { focus, total: rows.length, by_verb: by, items: rows.slice(0, limit), ...(rows.length > limit ? { more: rows.length - limit } : {}) }
                },
            },
        }
        if (env.page) {
            specs.get_page = {
                level: 'read',
                description: 'The page the reader is looking at: its address, title, type, headings and text (the first 4,000 characters). Use it for "this page", "this company", "here".',
                params: { type: 'object', properties: { max_chars: { type: 'integer', description: 'default 4000' } } },
                async run(a) { return env.page(Math.min(20000, a.max_chars || 4000)) },
            }
        }
        if (env.navigate) {
            specs.open = {
                level: 'view',
                description: 'Open a page of this site for the reader: a ref (company:1password), a path (companies/1password/index.html), a search result\'s url, or #anchor on this page. From the chat, the page opens when the answer is finished, and the chat stays open.',
                params: { type: 'object', properties: { target: { type: 'string' } }, required: ['target'] },
                example: { target: 'topic:security' },
                async run(a, ctx) {
                    const target = String(a.target).trim()
                    let rel
                    if (/^#/.test(target)) return env.navigate(target, ctx)
                    const m = /^([a-z]+):([^/\s]+)$/.exec(target)
                    if (m && typeOf(m[1])) {
                        const t = typeOf(m[1])
                        if (!PAGED[t]) throw new Error(`${t} entities have no page; use get_entity`)
                        rel = `${PLURAL[t]}/${m[2]}/index.html`
                    } else if (base && target.startsWith(base)) rel = target.slice(base.length)
                    else if (/^https?:/.test(target)) throw new Error('only pages of this site can be opened')
                    else rel = target.replace(/^\/+/, '')
                    if (rel.endsWith('/')) rel += 'index.html'
                    return env.navigate(rel, ctx)
                },
            }
        }
        if (env.highlight) {
            specs.highlight = {
                level: 'view',
                description: 'Highlight something on the current page and scroll to it: a CSS selector (h2#sources, .facts) or a piece of its text. clear: true removes earlier highlights.',
                params: { type: 'object', properties: { target: { type: 'string' }, clear: { type: 'boolean' } } },
                example: { target: 'Sources' },
                async run(a) { return env.highlight(a.target, !!a.clear) },
            }
        }
        return specs
    }

    function installInPage(w) {
        const S = () => w.NRSite
        const page = maxChars => {
            const main = w.document.querySelector('main') || w.document.body
            const heads = [...main.querySelectorAll('h1, h2, h3')].slice(0, 60).map(h => ({ level: Number(h.tagName[1]), text: h.textContent.trim(), id: h.id || undefined }))
            const clone = main.cloneNode(true)
            for (const el of clone.querySelectorAll('script, style, nav, .agent-block, .chat, .nr-chat, svg, noscript')) el.remove()
            const text = clone.textContent.replace(/\s+/g, ' ').trim()
            const meta = n => (w.document.querySelector(`meta[name="${n}"]`) || {}).content || ''
            return { url: S().canonical || w.location.href, title: (heads.find(h => h.level === 1) || {}).text || w.document.title, type: meta('page-type'), date: meta('page-date'), headings: heads, text: text.slice(0, maxChars), ...(text.length > maxChars ? { truncated: text.length } : {}) }
        }
        const navigate = (rel, ctx) => {
            if (/^#/.test(rel)) {
                const el = w.document.getElementById(rel.slice(1))
                if (!el) throw new Error(`no ${rel} on this page`)
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return { opened: rel, in_place: true }
            }
            const u = S().url(rel)
            if (ctx && ctx.via === 'chat') {
                w.__nrPendingOpen = u
                w.dispatchEvent(new CustomEvent('nr:open-pending', { detail: { url: u } }))
                return { will_open: rel, when: 'when this answer is finished; the chat stays open on the new page' }
            }
            w.location.href = u
            return { opened: rel }
        }
        const highlight = (target, clear) => {
            const d = w.document
            for (const el of d.querySelectorAll('.nr-hl')) { if (el.tagName === 'MARK' && el.dataset.nrHl) { el.replaceWith(d.createTextNode(el.textContent)) } else el.classList.remove('nr-hl') }
            if (!target) return { cleared: true }
            const main = d.querySelector('main') || d.body
            let els = []
            try { if (/^[#.\[a-z]/i.test(target) && !/\s{2,}/.test(target)) els = [...main.querySelectorAll(target)] } catch (e) { els = [] }
            if (els.length) {
                els.slice(0, 20).forEach(el => el.classList.add('nr-hl'))
                els[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
                return { found: els.length, as: 'selector', first: els[0].textContent.trim().slice(0, 120) }
            }
            const needle = String(target).toLowerCase()
            const walker = d.createTreeWalker(main, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('script, style, .chat, .nr-chat, .agent-block') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT })
            const hits = []
            let n
            while ((n = walker.nextNode()) && hits.length < 20) { const i = n.nodeValue.toLowerCase().indexOf(needle); if (i >= 0) hits.push([n, i]) }
            for (const [node, i] of hits) {
                const r = d.createRange()
                r.setStart(node, i); r.setEnd(node, i + needle.length)
                const mk = d.createElement('mark')
                mk.className = 'nr-hl'; mk.dataset.nrHl = '1'
                r.surroundContents(mk)
            }
            const first = d.querySelector('mark.nr-hl')
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return { found: hits.length, as: 'text' }
        }
        const specs = makeCoreTools({ fetchJSON: r => S().fetchJSON(r), now: () => S().now(), base: (S() && S().base) || '', page, navigate, highlight })
        const q = (w.__toolQueue = w.__toolQueue || [])
        for (const [name, spec] of Object.entries(specs)) q.push(['register', name, { ...spec, owner: 'core' }])
    }

    return { makeCoreTools, installInPage, parseRef, PLURAL }
})
