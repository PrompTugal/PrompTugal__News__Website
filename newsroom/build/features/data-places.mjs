// The data online and queryable (data.places@PrompTugal.dinis, 15 November 2026; board/briefs/2026-11-15-show-the-power.md):
// each place's data and the whole graph as JSON tables with a documented schema (api/v1/data/), a query page where a
// reader runs SQL and graph traversals in the browser (/query/, and /query/<place>/ for each place), with example
// queries the gate runs at every build. The engine is ours (assets/query/sql.js, graph.js): no outside script.
//
// The tables join two layers, named in each node's and edge's `layer`:
//   graph     the shared graph as the build makes it (lib/graph.mjs, ontologist@'s grammar), after the websummit-only pass
//   by-place  this feature's layer, derived from the place agents' files (data/by-place/<id>.json): the places, the
//             organisations on each AI map (merged across towns by name, or matched to a company or organisation of
//             the graph by its name), the local stories and events, and what a story names
// and, once detective.places@ writes it, data/by-place/connections.json (layer `connections`).
import { createRequire } from 'node:module'
import crypto from 'node:crypto'
import fs from 'node:fs'
const require = createRequire(import.meta.url)
const SQL = require('../../../assets/query/sql.js')
const PTGraph = require('../../../assets/query/graph.js')

export const order = 86
const LIST = 'data/by-place/places.json'
const CONNECTIONS = 'data/by-place/connections/connections.json'
const BANNED = /(^|\.)(websummit\.com|websummit\.net|lu\.ma|luma\.com|meetup\.com|eventbrite\.[a-z.]+)$/i
const ASSETS = { css: ['assets/query/query.css'], js: ['assets/query/sql.js', 'assets/query/graph.js', 'assets/query/query.js'] }
const CASES = ['loule', 'faro']   // Dinis's case studies, deepest first

const arr = v => Array.isArray(v) ? v : []
const str = v => v === undefined || v === null ? null : String(v)
const int = v => Number.isFinite(+v) && v !== null && v !== '' ? Math.trunc(+v) : null
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return null } }
const okUrl = u => typeof u === 'string' && /^https?:\/\//.test(u) && !BANNED.test(hostOf(u) || '')
const sha = (s, n = 10) => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, n)
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const slug = s => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'x'
// a name as a key: accents and case folded, what follows a bracket or a comma dropped, "the" dropped
const nameKey = s => slug(String(s || '').split(/\s*[(,]/)[0].replace(/^the\s+/i, ''))
const homepage = u => { try { const x = new URL(u); return (x.pathname === '/' || x.pathname === '') && !x.search ? x.hostname.replace(/^www\./, '').toLowerCase() : null } catch { return null } }
const KIND_TO_TYPE = { company: 'company', startup: 'company', investor: 'organisation', institution: 'organisation', organisation: 'organisation', 'public body': 'organisation', community: 'organisation' }

// the tables' documentation, the examples and the page's words: assets/query/catalogue.json (words out of the code)
const CAT_FILE = 'assets/query/catalogue.json'
let CAT = null
const catalogue = read => CAT || (CAT = read(CAT_FILE))
const fillT = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m)
const EXAMPLES = cat => cat.examples
const PLACE_EX = (cat, p, name) => cat.place_examples.map(e => ({ id: e.id, title: fillT(e.title, { place: p, name }), about: fillT(e.about, { place: p, name }), sql: fillT(e.sql, { place: p, name }) }))

function loadPlaces(ctx) {
    let raw = { places: [] }
    try { raw = ctx.readJSON(LIST) } catch {}
    return arr(raw.places).map(p => {
        let d = {}
        try { d = ctx.exists(`data/by-place/${p.id}.json`) ? ctx.readJSON(`data/by-place/${p.id}.json`) : {} } catch {}
        if (!d || typeof d !== 'object' || Array.isArray(d)) d = {}
        return { ...p, file: d }
    })
}

let DB = null
export function database(ctx) {
    if (DB) return DB
    const cat = catalogue(ctx.readJSON), W = cat.words
    const places = loadPlaces(ctx)
    const g = ctx.graph()
    const nodes = new Map(), edges = new Map()
    const N = (id, o) => { if (!nodes.has(id)) nodes.set(id, { id, type: null, kind: null, label: id, page: null, source: null, read: null, layer: 'graph', places: new Set(), ...o }); const n = nodes.get(id); return n }
    const E = (verb, src, dst, o = {}) => { if (!src || !dst) return; const id = `${verb}:${src}:${dst}`; if (!edges.has(id)) edges.set(id, { id, src, verb, dst, source: null, read: null, layer: 'by-place', note: null, ...o }) }
    for (const n of g.nodes) N(n.id, { type: n.type, kind: str(n.kind || n.category || null), label: n.label, page: n.page || null, source: str(n.source), read: str(n.read || null) })
    for (const e of g.edges) E(e.verb, e.from, e.to, { source: str(e.source), read: str(e.read || null), layer: 'graph' })

    // graph names to resolve a map entry: a company's or organisation's name and aliases, and a company's home page
    const byName = new Map(), bySite = new Map()
    for (const c of ctx.store.companies) { if (!nodes.has(`company:${c.id}`)) continue
        for (const a of [c.name, ...arr(c.aliases).map(x => x && (x.name || x))]) if (a) byName.set(nameKey(a), `company:${c.id}`)
        const h = c.website && hostOf(c.website); if (h) bySite.set(h, `company:${c.id}`) }
    for (const o of ctx.store.organisations) if (nodes.has(`organisation:${o.id}`) && !o.marker && !byName.has(nameKey(o.name))) byName.set(nameKey(o.name), `organisation:${o.id}`)

    // the places
    const rows = { places: [], news: [], map: [], events: [], sources: [], gaps: [], companies: [], articles: [], merges: [], connections: [] }
    for (const p of places) {
        const id = `place:${p.id}`, f = p.file
        N(id, { type: 'place', kind: p.kind, label: p.name, page: `${p.path}index.html`, source: `data/by-place/${p.id}.json`, read: str(f.updated), layer: nodes.has(id) ? 'graph' : 'by-place' })
        if (p.parent && ![...edges.values()].some(e => e.verb === 'located_in' && e.src === id)) E('located_in', id, `place:${p.parent}`, { source: LIST, note: 'data/by-place/places.json' })
        rows.places.push([p.id, p.name, p.kind, p.parent || null, id, `${p.path}index.html`, p.agent || null, f.status || 'stub', str(f.updated), int(p.at && p.at[0] * 1000) / 1000 || (p.at ? p.at[0] : null), p.at ? p.at[1] : null,
            (f.identity && f.identity.key_id) || null, arr(f.ai_news).length, arr(f.ai_map).length, arr(f.events).length, arr(f.sources).length, arr(f.gaps).length, str(f.mandate)])
    }
    // the AI maps: resolve each entry (union by name and by home page), then the nodes and edges
    const entries = []
    for (const p of places) arr(p.file.ai_map).forEach((m, i) => { if (m && m.name) entries.push({ p, m, i }) })
    const parent = new Map(), find = k => { while (parent.get(k) !== k) { parent.set(k, parent.get(parent.get(k))); k = parent.get(k) } return k }
    const union = (a, b) => { for (const k of [a, b]) if (!parent.has(k)) parent.set(k, k); parent.set(find(a), find(b)) }
    for (const x of entries) {
        // by name only: a home page is shared by a university and its units (CEOT cites ualg.pt), so it is no key
        x.keys = [`name:${nameKey(x.m.name)}`]
        union(x.keys[0], x.keys[0])
    }
    for (const a of arr(cat.aliases && cat.aliases.same)) { const ks = arr(a.names).map(n => `name:${n}`).filter(k => parent.has(k)); for (const k of ks.slice(1)) union(ks[0], k) }
    const clusters = new Map()
    for (const x of entries) { const r = find(x.keys[0]); if (!clusters.has(r)) clusters.set(r, []); clusters.get(r).push(x) }
    for (const list of clusters.values()) {
        let node = null, how = 'new'
        for (const x of list) { const nm = byName.get(nameKey(x.m.name)); if (nm) { node = nm; how = 'graph-name'; break } }
        if (!node) for (const x of list) { const h = okUrl(x.m.url) && hostOf(x.m.url); if (h && bySite.has(h) && homepage(x.m.url)) { node = bySite.get(h); how = 'graph-site'; break } }
        if (!node) {
            const counts = {}; for (const x of list) counts[nameKey(x.m.name)] = (counts[nameKey(x.m.name)] || 0) + 1
            node = `local:${Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))[0]}`
            if (new Set(list.map(x => x.p.id)).size > 1 || list.length > 1) how = new Set(list.map(x => nameKey(x.m.name))).size > 1 ? 'alias' : 'same-name'
        }
        const first = list[0].m, kind = (list.find(x => x.m.type) || list[0]).m.type
        const n = N(node, { type: KIND_TO_TYPE[kind] || 'organisation', kind: str(kind), label: String(first.name).split(/\s*\(/)[0], source: okUrl(first.url) ? first.url : (okUrl(first.source_url) ? first.source_url : null), read: str(first.read_on), layer: 'by-place' })
        for (const x of list) { x.node = node; n.places.add(x.p.id) }
        rows.merges.push([node, how, [...new Set(list.map(x => x.m.name))].join(' | '), [...new Set(list.map(x => x.p.id))].join(','), list.length])
    }
    for (const x of entries) {
        const m = x.m, src = okUrl(m.source_url) ? m.source_url : okUrl(m.url) ? m.url : null
        rows.map.push([x.p.id, x.i + 1, x.node, str(m.name), str(m.type), okUrl(m.url) ? m.url : null, src, hostOf(src), str(m.read_on), int(m.steps), str(m.ai_path), str(m.what)])
        E('on_ai_map_of', x.node, `place:${x.p.id}`, { source: src, read: str(m.read_on), note: str(m.ai_path) })
    }
    // what a story or an event names: a map entry's short name (or its acronym in brackets) found in its words
    const names = []
    for (const list of clusters.values()) for (const x of [list[0]]) {
        const forms = new Set()
        for (const y of list) { const short = String(y.m.name).split(/\s*[(,]/)[0].trim(); if (short.length >= 4) forms.add(fold(short))
            const acr = /\(([A-Z][A-Za-z0-9-]{2,12})\)/.exec(y.m.name); if (acr) forms.add(fold(acr[1])) }
        for (const f of forms) names.push([f, x.node])
    }
    const named = text => { const t = ' ' + fold(text).replace(/[^a-z0-9]+/g, ' ') + ' '; return [...new Set(names.filter(([f]) => t.includes(' ' + f.replace(/[^a-z0-9]+/g, ' ').trim() + ' ')).map(([, n]) => n))] }
    // a town's name in a story's words (towns only: "Algarve" and "Portugal" are in nearly every story)
    const townNames = places.filter(p => p.kind === 'municipality').map(p => [' ' + fold(p.name).replace(/[^a-z0-9]+/g, ' ').trim() + ' ', p.id])
    const placeNamed = text => { const t = ' ' + fold(text).replace(/[^a-z0-9]+/g, ' ') + ' '; return townNames.filter(([f]) => t.includes(f)).map(([, id]) => id) }
    // the stories
    for (const p of places) arr(p.file.ai_news).forEach((a, i) => {
        if (!a || !a.title || !okUrl(a.url)) return
        const id = `news:${sha(a.url)}`
        const n = N(id, { type: 'news', kind: 'local AI story', label: a.title, source: a.url, read: str(a.read_on), layer: 'by-place', page: `${p.path}index.html` }); n.places.add(p.id)
        rows.news.push([p.id, i + 1, id, str(a.title), str(a.date), str(a.publisher), a.url, hostOf(a.url), str(a.read_on), int(a.steps), str(a.ai_path), str(a.summary)])
        E('reported_in', id, `place:${p.id}`, { source: a.url, read: str(a.read_on), note: str(a.ai_path) })
        for (const who of named(`${a.title} ${a.summary || ''}`)) E('mentions', id, who, { source: a.url, read: str(a.read_on), note: W.note_story })
        for (const q of placeNamed(`${a.title} ${a.summary || ''}`)) if (q !== p.id) E('mentions', id, `place:${q}`, { source: a.url, read: str(a.read_on), note: W.note_story_town })
    })
    // the events: the places' and the graph's agenda
    for (const p of places) arr(p.file.events).forEach(e => {
        if (!e || !e.title || !okUrl(e.url)) return
        const id = `local-event:${sha(e.url + '|' + e.title)}`
        const n = N(id, { type: 'event', kind: 'local event', label: e.title, source: e.url, read: str(e.read_on), layer: 'by-place', page: `${p.path}index.html` }); n.places.add(p.id)
        rows.events.push([p.id, id, str(e.title), str(e.date), e.url, str(e.read_on), str(e.ai_path), 'by-place'])
        E('held_in', id, `place:${p.id}`, { source: e.url, read: str(e.read_on), note: str(e.ai_path) })
        for (const who of named(e.title)) E('mentions', id, who, { source: e.url, read: str(e.read_on), note: W.note_event })
    })
    for (const n of g.nodes) if (n.type === 'event') rows.events.push([null, n.id, n.label, str(n.date), str(n.source), str(n.read || null), null, 'graph'])
    // the sources, with how many of the place's items rest on each host
    for (const p of places) {
        const hosts = new Map()
        for (const r of rows.news.filter(r => r[0] === p.id)) hosts.set(r[7], (hosts.get(r[7]) || 0) + 1)
        for (const r of rows.map.filter(r => r[0] === p.id)) hosts.set(r[7], (hosts.get(r[7]) || 0) + 1)
        arr(p.file.sources).forEach((s, i) => { if (s && s.name && okUrl(s.url)) rows.sources.push([p.id, i + 1, str(s.name), s.url, hostOf(s.url), str(s.kind), okUrl(s.feed) ? s.feed : null, hosts.get(hostOf(s.url)) || 0]) })
        arr(p.file.gaps).forEach((t, i) => { if (typeof t === 'string' && t.trim()) rows.gaps.push([p.id, i + 1, t]) })
    }
    // the companies and the articles
    for (const c of ctx.store.companies) if (nodes.has(`company:${c.id}`)) rows.companies.push([c.id, `company:${c.id}`, c.name, str(c.category), str(c.country), okUrl(c.website) ? c.website : null, c.attending ? 1 : 0, str(c.what), arr(c.sources).length, `companies/${c.id}/index.html`])
    for (const a of ctx.content.filter(c => /^articles\/[^/]+\.html$/.test(c.rel) && c.meta && c.meta.date && c.meta.status !== 'draft')) {
        const s = a.rel.replace(/^articles\/|\.html$/g, ''), id = `article:${s}`, m = a.meta
        N(id, { type: 'article', kind: str(m.status), label: m.title, page: a.rel, source: `content/articles/${s}.md`, read: String(m.date).slice(0, 10), layer: 'by-place' })
        rows.articles.push([s, id, str(m.title), String(m.date).slice(0, 10), str(m.author), str(m.region), str(m.town), a.rel])
        for (const pl of [m.town, m.region].filter(Boolean).map(String)) if (nodes.has(`place:${pl}`)) E('about_place', id, `place:${pl}`, { source: `content/articles/${s}.md`, read: String(m.date).slice(0, 10), note: W.note_tagged })
        for (const who of named(`${m.title} ${m.summary || ''}`)) E('mentions', id, who, { source: `content/articles/${s}.md`, note: W.note_article })
    }
    // detective.places@'s connections (data/by-place/connections/connections.json, its schema by-place-connections):
    // a link's two ends are {name, type, place}; each is resolved like a map entry (by name, the aliases, then the graph)
    if (ctx.exists(CONNECTIONS)) {
        let cf = {}; try { cf = ctx.readJSON(CONNECTIONS) } catch {}
        const byKey = new Map()
        for (const x of entries) byKey.set(find(x.keys[0]), x.node)
        const resolveEnd = e => {
            const k = `name:${nameKey(e.name)}`
            if (parent.has(k) && byKey.has(find(k))) return byKey.get(find(k))
            for (const a of arr(cat.aliases && cat.aliases.same)) if (arr(a.names).includes(nameKey(e.name))) for (const n of a.names) { const kk = `name:${n}`; if (parent.has(kk) && byKey.has(find(kk))) return byKey.get(find(kk)) }
            return byName.get(nameKey(e.name)) || `local:${nameKey(e.name)}`
        }
        for (const c of arr(cf.links)) {
            if (!c || !c.from || !c.to || !c.from.name || !c.to.name || !c.relation || !okUrl(c.source_url)) continue
            const [a, b] = [resolveEnd(c.from), resolveEnd(c.to)]
            for (const [ref, end] of [[a, c.from], [b, c.to]]) {
                const n = N(ref, { type: KIND_TO_TYPE[end.type] || end.type || 'organisation', kind: str(end.type), label: String(end.name).split(/\s*\(/)[0], layer: 'connections', source: c.source_url, read: str(c.read_on) })
                for (const pl of [end.place, ...arr(c.places)].filter(Boolean)) if (n.layer === 'connections') n.places.add(pl)
            }
            rows.connections.push([str(c.id), a, c.relation, b, c.source_url, str(c.read_on), str(c.verified), int(c.steps), str(c.what), str(c.ai_path), arr(c.places).join(',') || null])
            E(c.relation, a, b, { source: c.source_url, read: str(c.read_on), layer: 'connections', note: str(c.what) })
        }
    }
    // only edges whose two ends exist
    const tables = {}
    for (const [name, def] of Object.entries(cat.tables)) tables[name] = { about: def.about, columns: def.columns.map(c => c.name), types: def.columns.map(c => c.type), docs: def.columns.map(c => c.about), rows: rows[name] || [] }
    tables.nodes.rows = [...nodes.values()].map(n => [n.id, n.type, n.kind, n.label, n.page, n.source, n.read, n.layer, [...n.places].join(',') || null])
    tables.edges.rows = [...edges.values()].filter(e => nodes.has(e.src) && nodes.has(e.dst)).map(e => [e.id, e.src, e.verb, e.dst, e.source, e.read, e.layer, e.note])
    DB = { tables, places }
    return DB
}

const engine = db => ({ tables: db.tables, functions: PTGraph.functions(db) })
export const runSQL = (ctx, sql) => { const db = database(ctx); return SQL.run(sql, engine(db)) }

// ---- pages: query/index.html is content/query/index.md (its words), with the markers below; one page per place
const esc = (ctx, s) => ctx.md.esc ? ctx.md.esc(String(s)) : String(s)
const cell = (ctx, v) => { if (v === null || v === undefined) return ''; let s = String(v); if (s.length > 140) s = s.slice(0, 137) + '...'; return (ctx.md.cell ? ctx.md.cell(s) : s.replace(/\|/g, '\\|')).replace(/\n/g, ' ') }
function resultTable(ctx, r, W, max = 12) {
    if (!r.rows.length) return `*${W.no_rows}*\n\n`
    const head = `| ${r.columns.map(c => cell(ctx, c)).join(' | ')} |\n|${r.columns.map(() => '---').join('|')}|\n`
    const body = r.rows.slice(0, max).map(row => `| ${row.map(v => cell(ctx, v)).join(' | ')} |`).join('\n')
    return `{.pq-result}\n${head}${body}\n\n*${r.rows.length} row${r.rows.length === 1 ? '' : 's'}${r.rows.length > max ? `, the first ${max} shown` : ''}.*\n\n`
}
function exampleBlock(ctx, ex) {
    const W = catalogue(ctx.readJSON).words
    let r, err = null
    try { r = runSQL(ctx, ex.sql) } catch (e) { err = e.message }
    return `### ${esc(ctx, ex.title)} {#q-${ex.id}}\n\n${esc(ctx, ex.about)}\n\n{.pq-example}\n\`\`\`sql\n${ex.sql}\n\`\`\`\n\n` + (err ? `*${W.failed} ${esc(ctx, err)}*\n\n` : resultTable(ctx, r, W))
}
const mount = (ctx, scope) => `{.pq-mount}\n${catalogue(ctx.readJSON).words.mount}${scope ? ` (scope: place = '${scope}')` : ''}\n\n`

export const fill = {
    'data:facts': (page, ctx) => {
        const db = database(ctx), rel = page.rel, c = Object.fromEntries(Object.entries(db.tables).map(([k, t]) => [k, t.rows.length]))
        return `{.facts}\n| | |\n|---|---|\n| Tables | ${Object.keys(db.tables).length}: ${Object.keys(db.tables).map(t => `[${t}](#t-${t})`).join(', ')} |\n| The graph | ${c.nodes} nodes, ${c.edges} edges |\n| The places | ${c.places}, with ${c.news} local AI stories and ${c.map} map entries |\n| As JSON | [api/v1/data/index.json](${ctx.link(rel, 'api/v1/data/index.json')}); one file per place, as [api/v1/data/places/loule.json](${ctx.link(rel, 'api/v1/data/places/loule.json')}) |\n| The engine | [sql.js](${ctx.link(rel, 'assets/query/sql.js')}), [graph.js](${ctx.link(rel, 'assets/query/graph.js')}) |\n| Built | ${ctx.TODAY}, v${ctx.VERSION} |\n\n`
    },
    'data:places': (page, ctx) => { const db = database(ctx)
        const cases = CASES.map(c => db.places.find(x => x.id === c)).filter(Boolean).map(p => `[${esc(ctx, p.name)}](${ctx.link(page.rel, `query/${p.id}/index.html`)})`).join(' · ')
        return `{.mini-h}\n${cases}\n\n{.chip-list}\n${db.places.map(p => `- [${esc(ctx, p.name)}](${ctx.link(page.rel, `query/${p.id}/index.html`)})`).join('\n')}\n\n` },
    'data:ask': (page, ctx) => mount(ctx, ''),
    'data:examples': (page, ctx) => EXAMPLES(catalogue(ctx.readJSON)).map(ex => exampleBlock(ctx, ex)).join(''),
    'data:tables': (page, ctx) => { const db = database(ctx)
        return Object.entries(db.tables).map(([name, t]) => `### ${name} {#t-${name}}\n\n${esc(ctx, t.about)} ${t.rows.length} rows: [api/v1/data/tables/${name}.json](${ctx.link(page.rel, `api/v1/data/tables/${name}.json`)}).\n\n{.pq-schema}\n| column | type | what it holds |\n|---|---|---|\n` + t.columns.map((c, i) => `| \`${c}\` | ${t.types[i]} | ${cell(ctx, t.docs[i])} |`).join('\n') + '\n\n').join('') },
}

function placePage(ctx, p) {
    const rel = `query/${p.id}/index.html`, db = database(ctx), W = catalogue(ctx.readJSON).words
    const row = db.tables.places.rows.find(r => r[0] === p.id) || []
    let md = `${fillT(W.place_intro, { name: esc(ctx, p.name) })}\n\n`
    md += `{.facts}\n| | |\n|---|---|\n| The place | [${esc(ctx, p.name)}](${ctx.link(rel, `${p.path}index.html`)}), ${esc(ctx, p.kind)}, kept by ${esc(ctx, p.agent || '')} |\n| Status | ${esc(ctx, row[7] || 'stub')}, updated ${esc(ctx, row[8] || '')} |\n| In the data | ${row[12] || 0} stories, ${row[13] || 0} map entries, ${row[14] || 0} events, ${row[15] || 0} sources, ${row[16] || 0} gaps |\n| As JSON | [api/v1/data/places/${p.id}.json](${ctx.link(rel, `api/v1/data/places/${p.id}.json`)}): ${W.place_json} |\n| Every table | [The data, queryable](${ctx.link(rel, 'query/index.html')}) |\n\n`
    md += `## Ask {#ask}\n\n` + mount(ctx, p.id)
    md += `## Answers {#examples}\n\n` + PLACE_EX(catalogue(ctx.readJSON), p.id, p.name).map(ex => exampleBlock(ctx, ex)).join('')
    return { rel, title: `${p.name}: the data`, summary: fillT(W.place_summary, { name: p.name }), md, type: 'place', layout: 'wide', assets: ASSETS, src: `data/by-place/${p.id}.json`, crumbs: [['query/index.html', 'The data'], [null, p.name]] }
}

export function pages(ctx) { return database(ctx).places.map(p => placePage(ctx, p)) }

// the index page gets the query box's script; each place page links to its data
export function decorate(page, ctx) {
    if (page.rel === 'query/index.html') { page.assets = { css: [...(page.assets?.css || []), ...ASSETS.css], js: [...(page.assets?.js || []), ...ASSETS.js] }; return }
    const db = database(ctx)
    const p = db.places.find(x => page.rel === `${x.path}index.html`)
    if (!p || page.raw || typeof page.md !== 'string') return
    page.md += `\n\n{.more-line}\n[${fillT(catalogue(ctx.readJSON).words.place_link, { name: p.name })} →](${ctx.link(page.rel, `query/${p.id}/index.html`)})\n`
}

// ---- the JSON
export function api(ctx) {
    const db = database(ctx), W = catalogue(ctx.readJSON).words
    const tableFile = (name, t) => ({ table: name, about: t.about, version: ctx.VERSION, built: ctx.TODAY, columns: t.columns.map((c, i) => ({ name: c, type: t.types[i], about: t.docs[i] })), count: t.rows.length, rows: t.rows })
    const out = Object.entries(db.tables).map(([name, t]) => ({ path: `api/v1/data/tables/${name}.json`, data: tableFile(name, t), schema: 'data-table' }))
    out.push({ path: 'api/v1/data/index.json', schema: 'data-index', data: {
        about: W.api_index_about,
        version: ctx.VERSION, built: ctx.TODAY, by: 'data.places@PrompTugal.dinis', page: 'query/index.html', engine: ['assets/query/sql.js', 'assets/query/graph.js'],
        tables: Object.entries(db.tables).map(([name, t]) => ({ name, about: t.about, url: `api/v1/data/tables/${name}.json`, count: t.rows.length, columns: t.columns.map((c, i) => ({ name: c, type: t.types[i], about: t.docs[i] })) })),
        functions: [{ name: 'neighbours', args: ['start', 'depth', 'verbs?'], columns: ['id', 'type', 'label', 'depth', 'verb', 'via', 'path', 'path_ids'] }, { name: 'paths', args: ['from', 'to', 'max_depth?', 'verbs?'], columns: ['n', 'hops', 'path', 'path_ids', 'verbs'] }],
        places: db.places.map(p => ({ id: p.id, name: p.name, url: `api/v1/data/places/${p.id}.json`, page: `query/${p.id}/index.html` })),
        examples: EXAMPLES(catalogue(ctx.readJSON)),
    } })
    for (const p of db.places) {
        const pick = (name, test) => { const t = db.tables[name]; return { columns: t.columns, rows: t.rows.filter(test) } }
        const sub = runSQL(ctx, `SELECT id FROM neighbours('place:${p.id}', 2, '-located_in')`).rows.map(r => r[0])
        const keep = new Set(sub)
        out.push({ path: `api/v1/data/places/${p.id}.json`, schema: 'data-place', data: {
            about: fillT(W.api_place_about, { name: p.name }),
            id: p.id, name: p.name, version: ctx.VERSION, built: ctx.TODAY, source: `data/by-place/${p.id}.json`, page: `query/${p.id}/index.html`,
            tables: { places: pick('places', r => r[0] === p.id), news: pick('news', r => r[0] === p.id), map: pick('map', r => r[0] === p.id), events: pick('events', r => r[0] === p.id), sources: pick('sources', r => r[0] === p.id), gaps: pick('gaps', r => r[0] === p.id),
                nodes: pick('nodes', r => keep.has(r[0])), edges: pick('edges', r => keep.has(r[1]) && keep.has(r[3])) },
        } })
    }
    return out
}

export const searchDocs = ctx => {
    const db = database(ctx)
    return [{ id: 'page:query/index.html', url: 'query/index.html', title: 'The data, queryable', type: 'site', date: ctx.TODAY, text: 'data SQL query graph traversal tables nodes edges JSON API places AI map stories sources ' + EXAMPLES(catalogue(ctx.readJSON)).map(e => e.title).join(' ') },
        ...db.places.map(p => ({ id: `page:query/${p.id}/index.html`, url: `query/${p.id}/index.html`, title: `${p.name}: the data`, type: 'place', date: ctx.TODAY, text: `${p.name} data SQL query AI map stories sources graph` }))]
}
export function llms(ctx) {
    const db = database(ctx)
    return `## The data, queryable\n- [The data, queryable](query/index.md): every table and the graph, with SQL and graph traversals in the browser; the schema at api/v1/data/index.json, every table at api/v1/data/tables/<name>.json\n${db.places.map(p => `- [${p.name}: the data](query/${p.id}/index.md): api/v1/data/places/${p.id}.json`).join('\n')}\n\n`
}

// the gate: every example answers, run against the JSON tables the build wrote (what is served); the case studies'
// answers are not empty; every edge's two ends are nodes
function servedDB(gate) {
    const idx = gate.json('api/v1/data/index.json'), tables = {}
    for (const t of idx.tables) { const f = gate.json(t.url); tables[t.name] = { columns: f.columns.map(c => c.name), rows: f.rows } }
    return { idx, tables }
}
export function validate(gate) {
    const out = []
    let S
    try { S = servedDB(gate) } catch (e) { return [`data-places: api/v1/data/ could not be read: ${e.message}`] }
    const cat = catalogue(f => JSON.parse(fs.readFileSync(`${gate.ROOT}/${f}`, 'utf8')))
    const db = { tables: S.tables }, eng = engine(db)
    const ids = new Set(S.tables.nodes.rows.map(r => r[0]))
    for (const e of S.tables.edges.rows) if (!ids.has(e[1]) || !ids.has(e[3])) out.push(`edge ${e[0]} has an end that is not a node`)
    const run = (ex, where, must) => { try { const r = SQL.run(ex.sql, eng); if (must && !r.rows.length) out.push(`the example "${ex.title}" (${where}) answers nothing`) } catch (err) { out.push(`the example "${ex.title}" (${where}) fails: ${err.message}`) } }
    for (const ex of EXAMPLES(cat)) run(ex, 'query/', true)
    for (const p of S.idx.places) for (const ex of PLACE_EX(cat, p.id, p.name)) run(ex, `query/${p.id}/`, CASES.includes(p.id) && ['map', 'news', 'two-steps', 'sources'].includes(ex.id))
    for (const p of S.idx.places) if (!gate.generated.has(p.url)) out.push(`${p.url} was not built`)
    return out
}
export function warn(gate) {
    let S; try { S = servedDB(gate) } catch { return [] }
    const cat = catalogue(f => JSON.parse(fs.readFileSync(`${gate.ROOT}/${f}`, 'utf8')))
    const eng = engine({ tables: S.tables }), out = []
    for (const p of S.idx.places) for (const ex of PLACE_EX(cat, p.id, p.name).filter(e => ['map', 'news'].includes(e.id))) { try { if (!SQL.run(ex.sql, eng).rows.length) out.push(`data-places: query/${p.id}/: "${ex.title}" answers nothing yet`) } catch {} }
    return out
}
