// The graph: one whole graph built from the store (lib/data.mjs), in the grammar of data/ontology.json, and views of
// it. A view is the subgraph the whole induces on a set of node ids: the same node objects and the same edge objects,
// so every company, event and person graph is a part of the whole, never a different format (the fractal claim).
//   node: { id: "<type>:<slug>", type, label, source, ...data }      source: the URL or repository path it came from
//   edge: { id: "<verb>:<from>:<to>", from, to, verb, source, read? }  read: when the source was read
import { ident, sha12 } from './ids.mjs'

const PAGES = { company: 'companies/{slug}/index.html', organisation: 'organisations/{slug}/index.html', person: 'people/{slug}/index.html', event: 'events/{slug}/index.html', place: 'places/{slug}/index.html', topic: 'topics/{slug}/index.html', article: 'articles/{slug}.html' }
export const PLURAL = { company: 'companies', organisation: 'organisations', person: 'people', event: 'events', place: 'places', topic: 'topics', story: 'stories', evidence: 'evidence', day: 'days', track: 'tracks', fact: 'facts', source: 'sources', article: 'articles' }
export const pageOf = ref => { const [type, slug] = ref.split(/:(.*)/); return PAGES[type] ? PAGES[type].replace('{slug}', slug) : null }
export const slugOf = ref => ref.split(/:(.*)/)[1]
export const typeOf = ref => ref.split(':')[0]

export function buildGraph(store, { content = [], DAY = d => d } = {}) {
    const nodes = new Map(), edges = new Map()
    const node = (id, type, label, source, extra = {}) => { if (!nodes.has(id)) nodes.set(id, { id, type, label: String(label), source: source || null, ...(pageOf(id) ? { page: pageOf(id) } : {}), ...extra }) }
    const edge = (verb, from, to, source, read) => {
        if (!from || !to) return
        const id = `${verb}:${from}:${to}`
        if (!edges.has(id)) edges.set(id, { id, from, to, verb, source: source || null, ...(read ? { read } : {}) })
    }
    const srcUrl = (c, sid) => (c.sources.find(s => s.id === sid) || {}).url
    const srcRead = (c, sid) => (c.sources.find(s => s.id === sid) || {}).read_on

    // the summit world
    for (const p of store.places) node(`place:${p.id}`, 'place', p.name, p.source, { kind: p.kind })
    for (const p of store.places) edge('located_in', `place:${p.id}`, p.located_in, p.source)
    const tracks = new Map()
    for (const e of store.events) {
        const src = e.session_url || e.source_url
        node(`event:${e.id}`, 'event', e.title, src, { kind: e.kind, organiser: e.organiser, our_pick: e.our_pick, date: e.date, time: e.time, read: e.read_at })
        node(`day:${e.date}`, 'day', DAY(e.date), 'desks/programme/agenda.json')
        edge('on_day', `event:${e.id}`, `day:${e.date}`, src, e.read_at)
        edge('takes_place_at', `event:${e.id}`, e.place, src, e.read_at)
        edge('part_of', `event:${e.id}`, e.part_of, src, e.read_at)
        edge('organised_by', `event:${e.id}`, e.organised_by, src, e.read_at)
        if (e.track) {
            const tid = `track:${ident(e.track)}`
            if (!tracks.has(tid)) tracks.set(tid, e.track)
            node(tid, 'track', e.track, src)
            edge('in_track', `event:${e.id}`, tid, src, e.read_at)
        }
    }
    // the people world
    for (const o of store.organisations) node(`organisation:${o.id}`, 'organisation', o.name, o.sources[0]?.url, { ...(o.marker ? { marker: true } : {}) })
    for (const c of store.companies) node(`company:${c.id}`, 'company', c.name, c.sources[0]?.url, { category: c.category, country: c.country })
    for (const p of store.people) {
        node(`person:${p.id}`, 'person', p.name, p.listings[0].source, { role: p.role, organisation: p.organisation })
        const seen = new Set()
        for (const l of p.listings) if (l.org && !seen.has(l.org)) { seen.add(l.org); edge('listed_under', `person:${p.id}`, l.org, l.source, l.read_at) }
    }
    for (const e of store.events) {
        const src = e.session_url || e.source_url
        for (const s of e.speakers) edge('speaks_at', s.person, `event:${e.id}`, src, e.read_at)
        for (const h of e.hosted_by || []) edge('hosts', h.org, `event:${e.id}`, h.source, e.read_at)
    }
    // the industry world
    for (const t of store.topics) node(`topic:${t.id}`, 'topic', t.name, t.source, { kind: t.kind })
    for (const t of store.topics) {
        for (const b of t.broader) edge('narrower_than', `topic:${t.id}`, b, `data/topics/${t.id}/topic.json`)
        for (const tr of t.summit_tracks) { const tid = `track:${ident(tr)}`; if (nodes.has(tid)) edge('maps_to', tid, `topic:${t.id}`, `data/topics/${t.id}/topic.json`) }
    }
    for (const c of store.companies) for (const e of c.edges) {
        const to = e.to || (e.to_url && store.eventOfUrl(e.to_url) ? `event:${store.eventOfUrl(e.to_url)}` : null)
        if (to && nodes.has(to)) edge(e.verb, `company:${c.id}`, to, srcUrl(c, e.source), srcRead(c, e.source))
    }
    // the evidence world
    for (const c of store.companies) for (const f of c.facts) {
        const s = c.sources.find(x => x.id === f.source)
        if (!s) continue
        const fid = `fact:${c.id}-${f.id}`, sid = `source:${sha12(s.url)}`
        node(fid, 'fact', f.claim, s.url, { read: f.read_on, by: f.by })
        node(sid, 'source', s.url.replace(/^https?:\/\/(www\.)?/, ''), s.url, { url: s.url })
        edge('described_by', `company:${c.id}`, fid, s.url, f.read_on)
        edge('evidenced_by', fid, sid, s.url, f.read_on)
    }
    for (const x of store.evidence) {
        const sid = `source:${sha12(x.source_url)}`
        node(`evidence:${x.id}`, 'evidence', `${x.id} (${x.source_url.replace(/^https?:\/\/(www\.)?([^/]+).*$/, '$2')})`, x.source_url, { beat: x.beat, url: x.source_url })
        node(sid, 'source', x.source_url.replace(/^https?:\/\/(www\.)?/, ''), x.source_url, { url: x.source_url })
        edge('capture_of', `evidence:${x.id}`, sid, x.desk_file)
        for (const n of x.names) edge('names', `evidence:${x.id}`, n.ref, x.desk_file)
    }
    for (const s of store.stories) {
        node(`story:${s.id}`, 'story', s.title, s.desk_files[s.desk_files.length - 1], { status: s.status })
        for (const r of s.rests_on) edge('rests_on', `story:${s.id}`, r, s.desk_files[s.desk_files.length - 1])
        edge('about', `story:${s.id}`, s.topic, s.desk_files[s.desk_files.length - 1])
    }
    // articles, and the topics their tags name
    const topicByName = new Map(store.topics.flatMap(t => [t.name, ...(t.aliases || [])].map(n => [n.toLowerCase(), t.id])))
    for (const a of content.filter(c => /^articles\/[^/]+\.html$/.test(c.rel) && c.rel !== 'articles/index.html')) {
        const slug = a.rel.replace(/^articles\/|\.html$/g, '')
        node(`article:${slug}`, 'article', a.meta.title, a.src, { date: a.meta.date })
        for (const tag of String(a.meta.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean)) {
            if (topicByName.has(tag)) edge('about', `article:${slug}`, `topic:${topicByName.get(tag)}`, a.src)
            else if (store.has(`company:${tag}`)) edge('about', `article:${slug}`, `company:${tag}`, a.src)
        }
    }
    // drop edges whose ends are not nodes (a reference the gate would also report)
    for (const [id, e] of edges) if (!nodes.has(e.from) || !nodes.has(e.to)) edges.delete(id)
    const g = { nodes: [...nodes.values()], edges: [...edges.values()] }
    return index(g)
}

// adjacency, for views and navigators
function index(g) {
    g.node = new Map(g.nodes.map(n => [n.id, n]))
    g.out = new Map(), g.in = new Map()
    for (const e of g.edges) {
        if (!g.out.has(e.from)) g.out.set(e.from, [])
        if (!g.in.has(e.to)) g.in.set(e.to, [])
        g.out.get(e.from).push(e); g.in.get(e.to).push(e)
    }
    g.outOf = (id, verb) => (g.out.get(id) || []).filter(e => !verb || e.verb === verb)
    g.inOf = (id, verb) => (g.in.get(id) || []).filter(e => !verb || e.verb === verb)
    return g
}

// the subgraph induced on a set of ids, in the whole's order
export function view(g, ids, meta) {
    const set = new Set([...ids].filter(id => g.node.has(id)))
    const nodes = g.nodes.filter(n => set.has(n.id)), edges = g.edges.filter(e => set.has(e.from) && set.has(e.to))
    return { ...meta, counts: { nodes: nodes.length, edges: edges.length }, nodes, edges }
}

const up = (g, id, verb, out = new Set()) => { for (const e of g.outOf(id, verb)) if (!out.has(e.to)) { out.add(e.to); up(g, e.to, verb, out) } return out }

// other companies reachable from a company through a shared event or a shared topic, with the path that joins them
export function relatedCompanies(g, cid) {
    const rel = new Map()
    const add = (other, via) => { if (other === cid) return; if (!rel.has(other)) rel.set(other, []); if (!rel.get(other).includes(via)) rel.get(other).push(via) }
    for (const ev of eventsOfCompany(g, cid)) for (const c of companiesOfEvent(g, ev)) add(c, ev)
    for (const t of g.outOf(cid, 'filed_under')) for (const e of g.inOf(t.to, 'filed_under')) add(e.from, t.to)
    return [...rel.entries()].map(([company, via]) => ({ company, via }))
}
// a company's events: those whose page names it (appears_in, hosts) and those its people speak at
export function eventsOfCompany(g, cid) {
    const ev = new Set([...g.outOf(cid, 'appears_in'), ...g.outOf(cid, 'hosts')].map(e => e.to))
    for (const p of g.inOf(cid, 'listed_under')) for (const e of g.outOf(p.from, 'speaks_at')) ev.add(e.to)
    return [...ev]
}
export function companiesOfEvent(g, eid) {
    const cs = new Set([...g.inOf(eid, 'appears_in'), ...g.inOf(eid, 'hosts')].map(e => e.from).filter(id => id.startsWith('company:')))
    for (const s of g.inOf(eid, 'has_speaker').concat(g.inOf(eid, 'speaks_at'))) for (const l of g.outOf(s.from, 'listed_under')) if (l.to.startsWith('company:')) cs.add(l.to)
    return [...cs]
}

// the node sets of the zooms
export function companyIds(g, cid) {
    const ids = new Set([cid])
    for (const e of g.outOf(cid)) { ids.add(e.to); if (e.verb === 'described_by') for (const s of g.outOf(e.to, 'evidenced_by')) ids.add(s.to) }
    for (const t of g.outOf(cid, 'filed_under')) up(g, t.to, 'narrower_than', ids)
    for (const p of g.inOf(cid, 'listed_under')) ids.add(p.from)
    for (const ev of eventsOfCompany(g, cid)) { ids.add(ev); for (const e of g.outOf(ev)) if (['on_day', 'takes_place_at', 'in_track'].includes(e.verb)) ids.add(e.to) }
    for (const r of relatedCompanies(g, cid)) ids.add(r.company)
    for (const e of g.inOf(cid)) if (['names', 'about', 'hosts'].includes(e.verb)) ids.add(e.from)
    return ids
}
export function eventIds(g, eid) {
    const ids = new Set([eid])
    for (const e of g.outOf(eid)) { ids.add(e.to); if (e.verb === 'takes_place_at') up(g, e.to, 'located_in', ids); if (e.verb === 'in_track') for (const m of g.outOf(e.to, 'maps_to')) ids.add(m.to) }
    for (const e of g.inOf(eid)) { ids.add(e.from); if (e.verb === 'speaks_at') for (const l of g.outOf(e.from, 'listed_under')) ids.add(l.to) }
    return ids
}
export function personIds(g, pid) {
    const ids = new Set([pid])
    for (const e of g.outOf(pid)) {
        ids.add(e.to)
        if (e.verb === 'speaks_at') for (const x of g.outOf(e.to)) if (['on_day', 'takes_place_at'].includes(x.verb)) ids.add(x.to)
        if (e.verb === 'speaks_at') for (const s of g.inOf(e.to, 'speaks_at')) { ids.add(s.from); for (const l of g.outOf(s.from, 'listed_under')) ids.add(l.to) }
    }
    return ids
}
export const idsOfType = (g, types) => new Set(g.nodes.filter(n => types.includes(n.type)).map(n => n.id))
export function industryIds(g) {
    const ids = idsOfType(g, ['topic', 'company'])
    for (const e of g.edges) if (e.verb === 'maps_to') ids.add(e.from)
    for (const e of g.edges) if (e.verb === 'based_in') ids.add(e.to)
    return ids
}
export function summitIds(g) {
    const ids = idsOfType(g, ['event', 'place', 'day', 'track'])
    for (const e of g.edges) if (e.verb === 'organised_by') ids.add(e.to)
    for (const p of g.nodes.filter(n => n.type === 'place' && n.kind === 'country')) if (!g.inOf(p.id, 'located_in').length && !g.inOf(p.id, 'takes_place_at').length) ids.delete(p.id)
    return ids
}
export function peopleIds(g) {
    const ids = idsOfType(g, ['person'])
    for (const e of g.edges) if (e.verb === 'listed_under' || e.verb === 'speaks_at') ids.add(e.to)
    return ids
}

// the ontology's verb table, both ways
export function verbTable(ontology) {
    const t = new Map()
    for (const v of ontology.verbs) t.set(v.verb, v)
    return t
}
