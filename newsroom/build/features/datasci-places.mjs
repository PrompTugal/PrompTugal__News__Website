// Every place as a REST resource (datasci.places@PrompTugal.dinis, 15 November 2026, at Dinis's word via the conductor:
// "everything accessed from JSON ... no data that only exists in HTML"; "these GET calls are what the visualizations
// should be using"). For Portugal, the Algarve and each of the 17 towns, plain GET endpoints under
// api/v1/places/<id>/, all derived at build time from the place agent's file (data/by-place/<id>.json, cleaned the way
// the place page cleans it: features/by-place.mjs's own api() records are reused, so the page and its JSON never drift):
//
//   api/v1/places/<id>/index.json        the place's REST root: what it is, its counts, and every endpoint below
//   api/v1/places/<id>/page.json         the place page as data: each section in display order, with its items
//   api/v1/places/<id>/stories.json      its local AI stories (and, for the region, the towns'), and our articles
//   api/v1/places/<id>/ai-map.json       its AI map (for the region: every town's, merged by name)
//   api/v1/places/<id>/events.json       its events
//   api/v1/places/<id>/sources.json      the sources it reads, and every source host its facts rest on, with counts
//   api/v1/places/<id>/agents.json       the agents that keep it, from the record (places.json, status.json, run reports)
//   api/v1/places/<id>/provenance.json   one row per fact: what, the source, the read date, who kept it, the file's hash
//   api/v1/places/<id>/quality.json      the data quality numbers (coverage, freshness, sources per fact), method included
//   api/v1/places/quality.json           the quality numbers for every place, one row each, and the method
//   api/v1/articles.json, api/v1/articles/<slug>.json   every article's front matter, its links and its sources as data
//
// The OpenAPI specs that describe all of this are features/openapi.mjs; the audit is features/datasci-audit.mjs.
import crypto from 'node:crypto'
import { api as byPlaceApi } from './by-place.mjs'

export const order = 84
const LIST = 'data/by-place/places.json'
const SITE_URL = 'https://promptugal.news/'
const arr = v => Array.isArray(v) ? v : []
const okUrl = u => typeof u === 'string' && /^https?:\/\/[^\s]+$/i.test(u.trim())
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return null } }
const day = s => (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}/.test(s)) ? s.slice(0, 10) : null
const daysBetween = (a, b) => Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5)
const median = xs => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
const r2 = x => x === null || x === undefined || Number.isNaN(x) ? null : Math.round(x * 100) / 100
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex')
const roleOf = agent => String(agent || '').split('@')[0]
const urlsIn = (s, out = []) => { String(s || '').replace(/https?:\/\/[^\s"'<>)\]]+/g, u => out.push(u.replace(/[.,;:]+$/, ''))); return out }

// the fields each kind of fact should carry (what "coverage" counts)
const EXPECT = {
    story: ['title', 'url', 'date', 'publisher', 'read_on', 'ai_path', 'summary'],
    map: ['name', 'type', 'url', 'what', 'source_url', 'read_on', 'ai_path'],
    event: ['title', 'url', 'date', 'read_on', 'ai_path'],
}
const has = (o, k) => o && o[k] !== undefined && o[k] !== null && String(o[k]).trim() !== ''

let CACHE = null
let BUILDING = false
function model(ctx) {
    if (CACHE) return CACHE
    BUILDING = true
    let files; try { files = byPlaceApi(ctx) } finally { BUILDING = false }
    const recs = files.filter(f => /^api\/v1\/by-place\/(?!index\.json)[^/]+\.json$/.test(f.path)).map(f => f.data)
    const list = ctx.readJSON(LIST)
    const byId = new Map(recs.map(r => [r.id, r]))
    const raw = new Map(list.places.map(p => { let d = {}; try { d = ctx.readJSON(`data/by-place/${p.id}.json`) } catch {} return [p.id, { entry: p, file: d }] }))
    return (CACHE = { recs, byId, list, raw, copy: list.copy || {} })
}

const towns = M => M.recs.filter(r => r.kind === 'municipality' || r.kind === 'city')

// the facts of a place, one row each, the shape provenance and quality share
function facts(M, r) {
    const by = r.by || r.agent, rows = []
    for (const a of arr(r.ai_news)) rows.push({ kind: 'story', label: a.title, url: a.url, source: a.url, read_on: day(a.read_on), date: day(a.date), steps: a.steps ?? null, by, item: a })
    for (const m of arr(r.ai_map)) rows.push({ kind: 'map', label: m.name, url: m.url || null, source: m.source_url || m.url || null, read_on: day(m.read_on), date: null, steps: m.steps ?? null, by, item: m })
    for (const e of arr(r.events)) rows.push({ kind: 'event', label: e.title, url: e.url, source: e.url, read_on: day(e.read_on), date: day(e.date), steps: e.steps ?? null, by, item: e })
    for (const x of arr(r.extras)) rows.push({ kind: 'figure', label: `${x.label}: ${x.value}`, url: null, source: okUrl(x.source_url) ? x.source_url : null, read_on: day(x.read_on), date: null, steps: null, by, item: x })
    return rows
}

export function quality(ctx, r) {
    const M = model(ctx), today = ctx.TODAY, F = facts(M, r)
    const cov = {}
    let filled = 0, expected = 0
    for (const [kind, fields] of Object.entries(EXPECT)) {
        const items = F.filter(f => f.kind === kind).map(f => f.item)
        const per = Object.fromEntries(fields.map(k => [k, items.length ? r2(items.filter(i => has(i, k)).length / items.length) : null]))
        for (const i of items) for (const k of fields) { expected++; if (has(i, k)) filled++ }
        cov[kind] = { items: items.length, fields: per }
    }
    const reads = F.map(f => f.read_on).filter(Boolean), ages = reads.map(d => daysBetween(d, today))
    const storyDates = F.filter(f => f.kind === 'story' && f.date).map(f => daysBetween(f.date, today))
    const sourced = F.filter(f => okUrl(f.source))
    const hosts = {}
    for (const f of sourced) { const h = hostOf(f.source); if (h) hosts[h] = (hosts[h] || 0) + 1 }
    const total = sourced.length, shares = Object.values(hosts).map(c => c / (total || 1))
    const hhi = total ? shares.reduce((s, x) => s + x * x, 0) : null
    const perFact = F.length ? F.reduce((s, f) => s + new Set([f.url, f.source].filter(okUrl).map(u => u.replace(/\/+$/, ''))).size, 0) / F.length : null
    const steps = {}
    for (const f of F) if (typeof f.steps === 'number') steps[f.steps] = (steps[f.steps] || 0) + 1
    const updated = day(r.updated)
    const completeness = expected ? filled / expected : 0
    const freshness = ages.length ? Math.max(0, 1 - median(ages) / 30) : 0
    const diversity = total ? Math.min(1, (1 - hhi) / 0.8) : 0
    const volume = Math.min(1, F.length / 30)
    const score = Math.round(100 * (0.35 * completeness + 0.25 * freshness + 0.25 * diversity + 0.15 * volume))
    return {
        id: r.id, name: r.name, kind: r.kind, agent: r.agent, status: r.status, built: today,
        counts: { facts: F.length, stories: r.counts.ai_news, ai_map: r.counts.ai_map, events: r.counts.events, figures: arr(r.extras).length, sources_listed: r.counts.sources, gaps: arr(r.gaps).length, articles: r.counts.articles },
        coverage: { overall: r2(completeness), fields_filled: filled, fields_expected: expected, by_kind: cov, with_source: F.length ? r2(total / F.length) : null, with_read_date: F.length ? r2(reads.length / F.length) : null, with_ai_path: F.length ? r2(F.filter(f => has(f.item, 'ai_path')).length / F.length) : null },
        freshness: { updated, days_since_update: updated ? daysBetween(updated, today) : null, newest_read: reads.length ? reads.reduce((a, b) => a > b ? a : b) : null, oldest_read: reads.length ? reads.reduce((a, b) => a < b ? a : b) : null, median_read_age_days: median(ages), read_in_last_7_days: reads.length ? r2(ages.filter(a => a <= 7).length / reads.length) : null, median_story_age_days: median(storyDates) },
        sources: { distinct_hosts: Object.keys(hosts).length, sources_per_fact: r2(perFact), top_host: Object.entries(hosts).sort((a, b) => b[1] - a[1])[0]?.[0] || null, top_host_share: total ? r2(Math.max(...shares)) : null, concentration_hhi: r2(hhi), by_host: Object.entries(hosts).sort((a, b) => b[1] - a[1]).map(([host, facts]) => ({ host, facts })) },
        ai_path_steps: steps,
        score: { value: score, parts: { completeness: r2(completeness), freshness: r2(freshness), diversity: r2(diversity), volume: r2(volume) } },
    }
}

// the words live in assets/datasci/words.json (the quality gate keeps prose out of code)
let WORDS = null
export const words = ctx => WORDS || (WORDS = ctx.readJSON('assets/datasci/words.json'))
export const fillW = (s, v = {}) => String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m)

// the agents that keep a place, from the record only
function agents(ctx, r) {
    let team = { agents: [] }
    try { team = ctx.readJSON('board/team/conductor/place-agents.json') } catch {}
    const one = (agent, part) => {
        const role = roleOf(agent), status = (() => { try { return ctx.readJSON(`board/team/${role}/status.json`) } catch { return null } })()
        let runs = []
        try { runs = ctx.walk(ctx.R(`board/runs/${role}`), p => p.endsWith('.json')).map(p => p.split('/').pop()).sort() } catch {}
        const t = arr(team.agents).find(a => a.agent === agent)
        return {
            agent, role, part, model: t ? t.model || null : null,
            state: status ? status.state || null : null, updated: status ? status.updated || null : null, focus: status ? status.focus || null : null,
            done: status ? arr(status.done).length : 0, next: status ? arr(status.next).slice(0, 5) : [],
            status_file: status ? `${SITE_URL}board/team/${role}/status.json` : null,
            runs: runs.length, last_run: runs.length ? `board/runs/${role}/${runs[runs.length - 1]}` : null,
        }
    }
    const shared = ['dev.places@PrompTugal.dinis', 'designer.places@PrompTugal.dinis', 'data.places@PrompTugal.dinis', 'viz.places@PrompTugal.dinis', 'detective.places@PrompTugal.dinis', 'datasci.places@PrompTugal.dinis', 'abp@PrompTugal.dinis']
    return [one(r.agent, words(ctx).parts.place), ...shared.filter(a => arr(team.agents).some(t => t.agent === a) || a.startsWith('datasci')).map(a => one(a, words(ctx).parts.shared))]
}

// the page as data: the same sections, in the same order, with the same items as features/by-place.mjs draws
function pageView(ctx, M, r) {
    const region = M.byId.get('algarve'), T = towns(M), copy = M.copy
    const W = (k, v = {}) => String(copy[k] || '').replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '')
    const gravity = { id: 'gravity', title: 'The centre of gravity', text: r.gravity && r.gravity.text || null, sources: arr(r.gravity && r.gravity.sources).filter(s => okUrl(s && s.url)), voice: r.voice && r.voice.gravity || null }
    const inside = M.recs.filter(x => x.parent === r.id).map(x => ({ id: x.id, name: x.name, page: x.page, api: `${SITE_URL}api/v1/places/${x.id}/index.json` }))
    const side = [
        { id: 'inside', title: `Inside ${r.name}`, items: inside },
        { id: 'events', title: 'Events', items: r.events },
        ...(r.kind !== 'country' ? [{ id: 'weather', title: 'Weather', text: W('weather', { name: r.name }), links: urlsIn(W('weather', { name: r.name })) }] : []),
        { id: 'figures', title: 'In figures', items: r.extras },
        { id: 'sources', title: 'Sources we read', items: r.sources },
        { id: 'gaps', title: 'Gaps', items: r.gaps, voice: r.voice && r.voice.gaps_intro || null },
    ]
    const how = { id: 'how', title: 'How this page is made', text: W('test_note'), links: urlsIn(W('test_note')), identity: r.identity }
    const mast = { id: 'mast', name: r.name, landmark: r.look.landmark, mandate: r.mandate, voice: r.voice || null, status: r.status, updated: r.updated, agent: r.agent, accent: r.look.accent, at: r.at }
    let sections
    if (r.kind === 'region') {
        const allMap = mergedMap(M, [r, ...T])
        const latest = T.flatMap(t => arr(t.ai_news).map(a => ({ ...a, town: t.id }))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        sections = [mast,
            { id: 'tiles', items: [{ label: 'places in the first wave', value: T.length }, { label: 'local AI stories', value: T.reduce((s, t) => s + t.counts.ai_news, 0) }, { label: 'on the AI map', value: allMap.length }, { label: 'places live', value: T.filter(t => t.status === 'live').length }] },
            { id: 'towns', title: 'The towns', items: T.map(t => ({ id: t.id, name: t.name, status: t.status, stories: t.counts.ai_news, ai_map: t.counts.ai_map, landmark: t.look.landmark, accent: t.look.accent, at: t.at, page: t.page, api: `${SITE_URL}api/v1/places/${t.id}/index.json` })) },
            { id: 'latest', title: 'The latest from the towns', shown: 8, items: latest },
            { id: 'region', title: 'Across the region', shown: 10, items: r.ai_news },
            { id: 'ours', title: 'Our articles', items: r.articles },
            { id: 'sources', title: 'Regional sources', items: r.sources },
            { id: 'gaps', title: 'Gaps', items: r.gaps },
            { id: 'map', title: 'The AI map of the Algarve', items: allMap },
            how]
    } else if (r.kind === 'country') {
        sections = [mast, gravity, { id: 'local', title: 'AI in Portugal', shown: 8, items: r.ai_news }, { id: 'by-place', title: 'By place', items: [region, ...T].filter(Boolean).map(t => ({ id: t.id, name: t.name, page: t.page, api: `${SITE_URL}api/v1/places/${t.id}/index.json` })) }, { id: 'map', title: 'The national AI map', items: r.ai_map }, ...side, how]
    } else {
        sections = [mast, gravity,
            { id: 'local', title: `AI in ${r.name}`, items: r.ai_news },
            { id: 'ours', title: `Our articles on ${r.name}`, items: r.articles },
            { id: 'region', title: 'From the Algarve', shown: 4, items: region ? region.ai_news : [], from: region ? `${SITE_URL}api/v1/places/algarve/stories.json` : null },
            { id: 'map', title: 'The AI map', items: r.ai_map },
            ...side, how]
    }
    return { id: r.id, name: r.name, page: r.page, twin: r.twin, about: fillW(words(ctx).api.page_about, { page: r.page }), sections }
}

function mergedMap(M, list) {
    const seen = new Set(), out = []
    for (const t of list) for (const m of arr(t.ai_map)) { const k = String(m.name).toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push({ ...m, place: t.id }) }
    return out
}


// the blast radius and the tree of significance (board/briefs/2026-11-16-blast-radius.md): who borders whom and how far,
// from data.places@'s board/team/data.places/neighbours.json (pt.wikipedia at a named revision; CAOP check owed), and
// each story's significance as its place agent marks it
const RANK = { beyond: 4, country: 3, region: 2, neighbours: 1, local: 0 }
function geography(ctx) {
    let n = { places: [], distances: [] }
    try { n = ctx.readJSON('board/team/data.places/neighbours.json') } catch {}
    const km = new Map(), borders = new Map(), src = new Map()
    for (const [a, b, d] of arr(n.distances)) { km.set(`${a}|${b}`, d); km.set(`${b}|${a}`, d) }
    for (const p of arr(n.places)) { src.set(p.id, { source: p.source || null, read_on: p.read_on || null }); for (const b of arr(p.borders)) if (b.place) { (borders.get(p.id) || borders.set(p.id, new Set()).get(p.id)).add(b.place); (borders.get(b.place) || borders.set(b.place, new Set()).get(b.place)).add(p.id) } }
    return { km: (a, b) => km.get(`${a}|${b}`) ?? null, adjacent: (a, b) => !!(borders.get(a) && borders.get(a).has(b)), borders: id => [...(borders.get(id) || [])], src, check_owed: n.check_owed || null }
}
// does a story from place `from` show on place `on`? (the brief's table; a story with no significance is not shown away from home)
function reach(sig, on, from, G, M) {
    const k = G.km(on, from), adj = G.adjacent(on, from), onRec = M.byId.get(on)
    if (!sig) return { shown: false, why: 'not marked' }
    if (sig === 'local') return { shown: false, why: 'local: its town only' }
    if (sig === 'neighbours') return (adj || (k !== null && k <= 20)) ? { shown: true, why: adj ? 'neighbours: borders it' : 'neighbours: within 20 km' } : { shown: false, why: 'neighbours: not adjacent, over 20 km' }
    if (sig === 'region') return { shown: !!onRec && onRec.kind !== 'country', why: 'region: every Algarve place' }
    return { shown: true, why: `${sig}: every place` }
}
function nearby(ctx, M, G, r) {
    const T = towns(M), others = r.kind === 'country' ? [M.byId.get('algarve'), ...T].filter(Boolean) : r.kind === 'region' ? T : T.filter(t => t.id !== r.id)
    const items = []
    for (const t of others) for (const a of arr(t.ai_news)) {
        const sig = typeof a.significance === 'string' && a.significance in RANK ? a.significance : null
        const rr = r.kind === 'town' || r.kind === 'municipality' || r.kind === 'city' ? reach(sig, r.id, t.id, G, M) : { shown: !!sig && RANK[sig] >= (r.kind === 'region' ? RANK.region : RANK.country), why: r.kind === 'region' ? 'region or wider' : 'country or wider' }
        const kmv = G.km(r.id, t.id)
        items.push({ from: t.id, from_name: t.name, km: kmv, distance: kmv !== null ? `${t.name}, ${Math.round(kmv)} km` : (t.parent === r.id ? `${t.name}, inside ${r.name}` : `${t.name}, ${r.kind === 'region' || r.kind === 'country' ? 'inside' : 'in'} ${r.name}`), adjacent: G.adjacent(r.id, t.id), significance: sig, significance_why: a.significance_why || a.why_significance || null, shown: rr.shown, why: rr.why, title: a.title, url: a.url, date: a.date || null, publisher: a.publisher || null, read_on: a.read_on || null,
            // provenance on every item (Dinis, 18 Nov 19:00; dev@): the story's own page, read by the place agent that filed it, in its signed file
            provenance: { source_url: a.url || null, publisher: a.publisher || null, published: a.date || null, read_on: a.read_on || null, read_by: t.agent || null, file: `${SITE_URL}data/by-place/${t.id}.json`, kind: 'story' } })
    }
    items.sort((a, b) => (b.shown - a.shown) || ((RANK[b.significance] ?? -1) - (RANK[a.significance] ?? -1)) || ((a.km ?? 999) - (b.km ?? 999)) || String(b.date || '').localeCompare(String(a.date || '')))
    const marked = items.filter(i => i.significance).length
    return {
        borders: G.borders(r.id).map(id => ({ id, name: (M.byId.get(id) || {}).name || id, km: G.km(r.id, id) })),
        distances: T.filter(t => t.id !== r.id && G.km(r.id, t.id) !== null).map(t => ({ id: t.id, name: t.name, km: G.km(r.id, t.id), adjacent: G.adjacent(r.id, t.id) })).sort((a, b) => a.km - b.km),
        geography_source: G.src.get(r.id) || null, check_owed: G.check_owed,
        counts: { stories: items.length, shown: items.filter(i => i.shown).length, marked, unmarked: items.length - marked },
        rule: RULE, items,
    }
}
const RULE = { local: 'its town only', neighbours: 'its town, the councils it borders, and any place within 20 km', region: 'every Algarve town and the Algarve page', country: 'the home page and every place', beyond: 'as country, marked as such' }
function tree(M) {
    const node = r => {
        const by = {}
        for (const a of arr(r.ai_news)) { const k = typeof a.significance === 'string' && a.significance in RANK ? a.significance : 'unmarked'; by[k] = (by[k] || 0) + 1 }
        return { id: r.id, name: r.name, kind: r.kind, page: r.page, api: `${SITE_URL}api/v1/places/${r.id}/index.json`, stories: arr(r.ai_news).length, by_significance: by, children: M.recs.filter(x => x.parent === r.id).map(node) }
    }
    return M.recs.filter(r => !r.parent || !M.byId.has(r.parent)).map(node)
}

export function endpoints(id) {
    const b = `${SITE_URL}api/v1/places/${id}/`
    return { index: `${b}index.json`, page: `${b}page.json`, stories: `${b}stories.json`, ai_map: `${b}ai-map.json`, events: `${b}events.json`, sources: `${b}sources.json`, agents: `${b}agents.json`, provenance: `${b}provenance.json`, quality: `${b}quality.json`, nearby: `${b}nearby.json`, openapi: `${b}openapi.json`, record: `${SITE_URL}api/v1/by-place/${id}.json`, tables: `${SITE_URL}api/v1/data/places/${id}.json` }
}
export function nearbyOf(ctx, id) { if (BUILDING) return null; const M = model(ctx), r = M.byId.get(id); return r ? nearby(ctx, M, geography(ctx), r) : null }
export const placeIds = ctx => model(ctx).recs.map(r => r.id)
export const placeOf = (ctx, id) => model(ctx).byId.get(id)
export const placeList = ctx => model(ctx).recs

function articlesData(ctx) {
    const arts = ctx.content.filter(c => /^articles\/[^/]+\.html$/.test(c.rel) && c.rel !== 'articles/index.html' && c.meta && c.meta.title && c.meta.date)
        .sort((a, b) => String(b.meta.date || '').localeCompare(String(a.meta.date || '')))
    const one = c => {
        const slug = c.rel.replace(/^articles\/|\.html$/g, ''), m = c.meta
        const links = [...String(c.md).matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map(x => ({ text: x[1], url: x[2] }))
        const seen = new Set(), sources = links.filter(l => { const k = l.url.replace(/\/+$/, ''); if (seen.has(k)) return false; seen.add(k); return true })
        return {
            id: slug, title: m.title, date: day(String(m.date || '')), author: m.author || null, summary: m.summary || null, status: m.status || null, licence: m.license || m.licence || null,
            town: m.town || null, region: m.region || null,
            page: `${SITE_URL}${c.rel}`, twin: `${SITE_URL}${c.rel.replace(/\.html$/, '.md')}`, signature: ctx.exists(`articles/${slug}.md.sig`) ? `${SITE_URL}articles/${slug}.md.sig` : null,
            words: String(c.md).split(/\s+/).filter(Boolean).length,
            sources: sources.map(l => ({ url: l.url, host: hostOf(l.url), text: l.text })),
        }
    }
    return arts.map(one)
}

export function api(ctx) {
    const M = model(ctx), out = [], A = words(ctx).api
    const add = (path, data, schema = null) => out.push({ path, data, schema })
    const meta = (r, what) => ({ id: r.id, name: r.name, about: `${what} ${A.tail}`, version: ctx.VERSION, built: ctx.TODAY, place: `${SITE_URL}api/v1/places/${r.id}/index.json` })
    const all = []
    for (const r of M.recs) {
        const file = `data/by-place/${r.id}.json`
        let fileSha = null
        try { fileSha = sha256(ctx.readText(file)) } catch {}
        const q = quality(ctx, r)
        all.push(q)
        const T = towns(M), isRegion = r.kind === 'region'
        const storiesFrom = isRegion ? T.flatMap(t => arr(t.ai_news).map(a => ({ ...a, place: t.id }))) : []
        add(`api/v1/places/${r.id}/index.json`, {
            ...meta(r, fillW(A.index, { name: r.name })),
            kind: r.kind, parent: r.parent, inside: r.inside, agent: r.agent, status: r.status, updated: r.updated, page: r.page, at: r.at, accent: r.look.accent,
            counts: { ...r.counts, facts: q.counts.facts }, score: q.score.value,
            swagger: `${SITE_URL}${M.list.places.find(p => p.id === r.id).path}api/`,
            endpoints: endpoints(r.id),
        }, 'datasci-place-index')
        add(`api/v1/places/${r.id}/page.json`, { ...meta(r, fillW(A.page, { name: r.name })), ...pageView(ctx, M, r) }, null)
        add(`api/v1/places/${r.id}/stories.json`, { ...meta(r, fillW(A.stories, { name: r.name, region: isRegion ? A.stories_region : '' })), count: r.ai_news.length, items: r.ai_news, ...(isRegion ? { from_towns: storiesFrom } : {}), articles: r.articles }, null)
        add(`api/v1/places/${r.id}/ai-map.json`, { ...meta(r, fillW(A.ai_map, { name: r.name, region: isRegion ? A.ai_map_region : '' })), count: r.ai_map.length, items: r.ai_map, ...(isRegion ? { merged: mergedMap(M, [r, ...T]) } : {}) }, null)
        add(`api/v1/places/${r.id}/events.json`, { ...meta(r, fillW(A.events, { name: r.name })), count: r.events.length, items: r.events }, null)
        add(`api/v1/places/${r.id}/sources.json`, { ...meta(r, fillW(A.sources, { name: r.name })), listed: r.sources, hosts: q.sources.by_host, gravity: arr(r.gravity && r.gravity.sources) }, null)
        add(`api/v1/places/${r.id}/agents.json`, { ...meta(r, fillW(A.agents, { name: r.name })), agents: agents(ctx, r) }, null)
        add(`api/v1/places/${r.id}/provenance.json`, {
            ...meta(r, fillW(A.provenance, { name: r.name })),
            file: { path: file, raw: `${SITE_URL}${file}`, sha256: fileSha, signature: r.identity.signature, key_id: r.identity.key_id, signed_by: r.identity.signed_by, keys: r.identity.keys, updated: r.updated, by: r.by },
            facts: facts(M, r).map(({ item, ...f }) => ({ ...f, host: hostOf(f.source) })),
        }, null)
        add(`api/v1/places/${r.id}/quality.json`, { ...meta(r, fillW(A.quality, { name: r.name })), ...q, method: words(ctx).method }, 'datasci-quality')
    }
    const G = geography(ctx)
    for (const r of M.recs) add(`api/v1/places/${r.id}/nearby.json`, { ...meta(r, fillW(A.nearby, { name: r.name })), ...nearby(ctx, M, G, r) }, null)
    add('api/v1/places/tree.json', { about: A.tree, version: ctx.VERSION, built: ctx.TODAY, rule: RULE, levels: ['country', 'region', 'municipality', 'city'], tree: tree(M) }, null)
    const scores = all.map(q => q.score.value)
    add('api/v1/places/quality.json', {
        about: A.quality_all,
        version: ctx.VERSION, built: ctx.TODAY, method: words(ctx).method,
        summary: { places: all.length, facts: all.reduce((s, q) => s + q.counts.facts, 0), median_score: median(scores), min_score: Math.min(...scores), max_score: Math.max(...scores), median_coverage: median(all.map(q => q.coverage.overall || 0)), median_read_age_days: median(all.map(q => q.freshness.median_read_age_days).filter(x => x !== null)) },
        columns: ['id', 'name', 'kind', 'score', 'facts', 'coverage', 'with_source', 'median_read_age_days', 'read_in_last_7_days', 'distinct_hosts', 'sources_per_fact', 'top_host_share', 'days_since_update'],
        rows: all.map(q => [q.id, q.name, q.kind, q.score.value, q.counts.facts, q.coverage.overall, q.coverage.with_source, q.freshness.median_read_age_days, q.freshness.read_in_last_7_days, q.sources.distinct_hosts, q.sources.sources_per_fact, q.sources.top_host_share, q.freshness.days_since_update]),
        places: all.map(q => ({ id: q.id, name: q.name, score: q.score.value, quality: `${SITE_URL}api/v1/places/${q.id}/quality.json` })),
    }, 'datasci-quality-all')
    const arts = articlesData(ctx)
    add('api/v1/articles.json', { about: A.articles, version: ctx.VERSION, count: arts.length, items: arts.map(a => ({ id: a.id, title: a.title, date: a.date, author: a.author, town: a.town, region: a.region, sources: a.sources.length, api: `${SITE_URL}api/v1/articles/${a.id}.json`, page: a.page })) }, null)
    for (const a of arts) add(`api/v1/articles/${a.id}.json`, { version: ctx.VERSION, ...a }, null)
    return out
}

export const llms = ctx => fillW(words(ctx).api.llms, { base: ctx.BASE })
