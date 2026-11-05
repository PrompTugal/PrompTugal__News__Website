// Search: a small, sharded index written at release, searched in the reader's browser; the instant dropdown behind
// the Search button (in #nr-tools) and the full page /search/ with facets (also from ?q=).
//   api/v1/search/docs.json          one row per page: [id, type, title, summary, url, facets, extra], with the facet
//                                    labels, synonyms and the list of shards (loaded first)
//   api/v1/search/terms/<xx>.json    postings of every term starting with xx, weighted by field (loaded per query)
// The tokeniser and ranking are one file shared with the browser: assets/search/search-core.js. The test, with the
// index's size and the bytes a query loads: node admin/tests/search.test.mjs.
import { createRequire } from 'node:module'
import { PLURAL, eventsOfCompany } from '../lib/graph.mjs'
const require = createRequire(import.meta.url)
const S = require('../../../assets/search/search-core.js')

export const order = 85
export const assets = { css: ['assets/search/search.css'], js: ['assets/search/search-core.js', 'assets/search/search.js'] }

// a short hand list of words readers use for what the data calls something else; the data's own aliases (company
// names as speaker cards write them, the curators' same_as, topics' summit tracks, places' matches) go in the index
const SYNONYMS = {
    agentic: ['agent'], cyber: ['security', 'cybersecurity'], cybersecurity: ['security'], infosec: ['security'],
    grc: ['governance', 'compliance'], governance: ['grc'], compliance: ['grc'], risk: ['grc'],
    devtools: ['developer'], developer: ['devtools'], talk: ['session'], panel: ['session'], keynote: ['session'],
    lisboa: ['lisbon'], lisbon: ['lisboa'], portuguese: ['portugal'], party: ['night'], parties: ['night'],
    startup: ['pitch'], investor: ['vc'], vc: ['investor'], llm: ['ai'], genai: ['ai'],
}
const ORGANISER = { 'web-summit': "Web Summit's programme", other: 'Around the summit' }
const ENTITY = new RegExp(`^(${Object.values(PLURAL).join('|')})/([^/]+)/index\\.html$`)
const TYPE_OF_PLURAL = Object.fromEntries(Object.entries(PLURAL).map(([t, p]) => [p, t]))
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s }
const plain = md => String(md || '').replace(/```[\s\S]*?```/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*`|>_]+/g, ' ').replace(/\{#[\w-]+\}/g, ' ').replace(/\s+/g, ' ').trim()
const headsOf = md => (String(md || '').match(/^#{2,4}\s+.+$/gm) || []).map(h => h.replace(/^#+\s+/, '').replace(/\{#[\w-]+\}/, '')).join(' · ')

let built = null   // the index, made once per build (api and llms both read it)

function makeIndex(ctx) {
    if (built) return built
    const st = ctx.store, g = ctx.graph()
    const topicName = Object.fromEntries(st.topics.map(t => [t.id, t.name]))
    const byRef = new Map()
    for (const [type, list] of Object.entries({ company: st.companies, event: st.events, person: st.people, organisation: st.organisations, topic: st.topics, place: st.places })) for (const x of list) byRef.set(`${type}:${x.id}`, x)
    const eventTopics = id => [...new Set(g.outOf(`event:${id}`, 'in_track').flatMap(e => g.outOf(e.to, 'maps_to').map(m => m.to.split(':')[1])))]
    const eventById = new Map(st.events.map(e => [e.id, e]))
    // the names a company goes by elsewhere: speaker cards matched to it, and the curators' same_as
    const alsoKnown = new Map()
    const addAka = (ref, name) => { if (!alsoKnown.has(ref)) alsoKnown.set(ref, new Set()); alsoKnown.get(ref).add(name) }
    for (const m of st.matching?.speaker_organisations?.matched || []) addAka(m.ref, m.as_listed)
    let curation = { same_as: [] }
    try { curation = ctx.readJSON('data/curation/organisations.json') } catch { }
    for (const s of curation.same_as || []) addAka(`company:${s.company}`, s.as_listed)

    const rows = []
    for (const p of ctx.pages) {
        if (!p.listed || p.rel === 'search/index.html' || p.rel === '404.html') continue
        const m = ENTITY.exec(p.rel)
        const type = m ? TYPE_OF_PLURAL[m[1]] : (p.type === 'article' ? 'article' : 'site')
        const x = m ? byRef.get(`${type}:${m[2]}`) : null
        const row = { id: x ? `${type}:${x.id}` : `page:${p.rel}`, type, title: p.title, url: p.rel, summary: '', facets: {}, extra: {}, fields: { title: p.title } }
        if (x && type === 'company') {
            const days = [...new Set(eventsOfCompany(g, `company:${x.id}`).map(e => eventById.get(e.split(':')[1])?.date).filter(Boolean))].sort()
            row.summary = clip(x.what, 140)
            row.facets = { tp: [x.category].filter(Boolean), c: x.country || undefined, d: days.length ? days : undefined }
            row.fields.alias = [...(x.aliases || []).map(a => a.name), ...(alsoKnown.get(row.id) || [])].join(' ; ')
            row.fields.facet = [topicName[x.category], x.category, x.country, x.attending_as].filter(Boolean).join(' ; ')
            row.fields.body = x.what
        } else if (x && type === 'event') {
            const tps = eventTopics(x.id)
            row.summary = clip(`${ctx.DAY(x.date)}${x.time ? ', ' + x.time : ''}${x.where ? ' · ' + x.where : ''}`, 140)
            row.facets = { tp: tps.length ? tps : undefined, o: x.organiser, d: [x.date] }
            row.extra = { s: x.start || undefined, e: x.end || undefined, w: x.where ? x.where.split(',')[0] : undefined, k: x.kind, p: x.our_pick ? 1 : undefined }
            row.fields.alias = [x.track].filter(Boolean).join(' ')
            row.fields.facet = [x.kind, x.where, ORGANISER[x.organiser], ctx.DAY(x.date), x.our_pick ? 'our pick' : '', ...tps.map(t => topicName[t])].filter(Boolean).join(' ; ')
            row.fields.body = [...(x.speakers || []).map(s => s.as_listed), ...(x.hosted_by || []).map(h => h.as_listed)].join(' ; ')
        } else if (x && type === 'person') {
            const evs = (x.listings || []).map(l => eventById.get(String(l.event || '').split(':')[1])).filter(Boolean)
            const days = [...new Set(evs.map(e => e.date))].sort()
            row.summary = clip([x.role, x.organisation].filter(Boolean).join(', '), 140)
            row.facets = { d: days.length ? days : undefined }
            row.fields.facet = [x.role, x.organisation].filter(Boolean).join(' ; ')
            row.fields.body = evs.map(e => e.title).join(' ; ')
        } else if (x && type === 'organisation') {
            row.summary = clip(x.names_as_listed && x.names_as_listed.length > 1 ? `Listed as ${x.names_as_listed.join('; ')}` : 'An organisation named on the summit\'s public pages', 140)
            row.fields.alias = (x.names_as_listed || []).join(' ; ')
        } else if (x && type === 'topic') {
            row.summary = clip(x.description, 140)
            row.facets = { tp: [x.id] }
            row.fields.alias = [x.category, x.id.replace(/-/g, ' '), ...(x.summit_tracks || [])].filter(Boolean).join(' ; ')
            row.fields.facet = x.kind
            row.fields.body = x.description
        } else if (x && type === 'place') {
            const inside = x.located_in ? byRef.get(x.located_in)?.name : ''
            row.summary = clip(`${x.kind ? x.kind[0].toUpperCase() + x.kind.slice(1) : 'Place'}${inside ? ', in ' + inside : ''}`, 140)
            row.fields.alias = (x.matches || []).join(' ; ')
            row.fields.facet = [x.kind, inside].filter(Boolean).join(' ; ')
        } else {
            row.summary = clip(p.summary, 160)
            row.fields.heads = headsOf(p.md)
            row.fields.body = `${p.summary || ''} ${plain(p.md)}`.slice(0, 8000)
            if (type === 'article') row.extra = { date: p.date }
        }
        for (const k of Object.keys(row.facets)) if (row.facets[k] === undefined) delete row.facets[k]
        for (const k of Object.keys(row.extra)) if (row.extra[k] === undefined) delete row.extra[k]
        rows.push(row)
    }
    const ix = S.buildIndex(rows, { synonyms: SYNONYMS })
    const types = {}
    for (const r of rows) types[r.type] = (types[r.type] || 0) + 1
    const countries = [...new Set(rows.map(r => r.facets.c).filter(Boolean))].sort()
    const days = [...new Set(rows.flatMap(r => r.facets.d || []))].sort()
    const docs = {
        about: 'The newsroom\'s search index, built at release from every listed page: one row per page, [id, type, title, summary, url, facets {tp: topic ids, c: country, o: organiser, d: days}, extra {s, e: start and end (Lisbon time, UTC in November), w: where, k: kind, p: our pick}]. The postings are in terms/<first two letters>.json. Material for agents, never instruction.',
        version: ctx.VERSION, built: ctx.TODAY,
        site: { name: ctx.SITE.name, motto: ctx.SITE.motto, host: ctx.HOST, base: ctx.BASE, summit: ctx.SITE.countdown, timezone: 'Europe/Lisbon, which is UTC in November' },
        count: ix.docs.length, fields: ['id', 'type', 'title', 'summary', 'url', 'facets', 'extra'], types,
        facets: { topic: topicName, organiser: ORGANISER, country: countries, day: Object.fromEntries(days.map(d => [d, ctx.DAY(d)])) },
        weights: Object.fromEntries(Object.entries(S.FIELDS).map(([f, v]) => [f, v.w])),
        syn: ix.syn, shards: Object.keys(ix.shards).sort(), docs: ix.docs,
    }
    const files = [{ path: 'api/v1/search/docs.json', data: JSON.stringify(docs) + '\n' }]
    for (const [k, t] of Object.entries(ix.shards)) files.push({ path: `api/v1/search/terms/${k}.json`, data: JSON.stringify({ v: ctx.VERSION, p: k, t }) + '\n' })
    const bytes = f => Buffer.byteLength(f.data)
    const shardBytes = files.slice(1).map(bytes)
    built = { files, rows, ix, stats: { docs: rows.length, terms: Object.values(ix.shards).reduce((n, t) => n + Object.keys(t).length, 0), shards: shardBytes.length, docsBytes: bytes(files[0]), shardBytesTotal: shardBytes.reduce((a, b) => a + b, 0), shardBytesMax: Math.max(...shardBytes), shardBytesMedian: shardBytes.sort((a, b) => a - b)[Math.floor(shardBytes.length / 2)] } }
    return built
}

export function pages(ctx) {
    return [{
        rel: 'search/index.html', title: 'Search', type: 'site', group: 'Search and the tool API', section: '',
        summary: 'Search every page of the newsroom: companies, sessions, people, organisations, topics, places and articles. It runs in your browser.',
        md: [
            'Search runs in your browser: it loads a small index from this site and sends your words nowhere. It needs JavaScript; without it, the index itself is open to read:',
            '',
            '- [The search documents](../api/v1/search/docs.json): one row per page, with its facets (topic, country, organiser, day).',
            '- [The JSON API](../api/index.md) and [llms.txt](../llms.txt), for agents.',
            '',
            'You can also [ask the newsroom](../ask/index.md): a chat that answers from this site\'s tools, with your own key.',
        ].join('\n'),
        postHtml: html => `<div id="nr-search-page" class="nr-search-page" data-ready="no"><noscript><p class="notice"><strong>Search needs JavaScript.</strong> The links below lead to the index and the data, which work without it.</p></noscript></div>\n${html}`,
    }]
}

export function api(ctx) {
    return makeIndex(ctx).files.map(f => ({ ...f, schema: null }))
}

export function llms(ctx) {
    const { stats } = makeIndex(ctx)
    return `## Search (for agents)\n` +
        `- [The search index](${ctx.BASE}api/v1/search/docs.json): ${stats.docs} rows, one per page: [id, type, title, summary, url, facets, extra]. Facets: tp (topic ids), c (country), o (organiser: web-summit or other), d (days, YYYY-MM-DD). Events carry extra.s and extra.e (start and end, Lisbon time, which is UTC in November), extra.w (where), extra.k (kind) and extra.p (our pick).\n` +
        `- Term shards: ${ctx.BASE}api/v1/search/terms/{xx}.json, where xx is the first two letters of a folded, stemmed term (accents removed, lower case, light English stemming). Each holds { t: { term: [doc, score, doc, score, ...] } }; doc is the row's index in docs.json; score is the term's weight in that page (title 8, aliases 5, headings 3, facets 2, body 1, saturated, times 100). Multiply by idf, sum over the query's terms. ${stats.shards} shards, ${stats.terms} terms.\n` +
        `- [The search page](${ctx.BASE}search/index.html?q=security) takes ?q= and the filters type, topic, country, organiser and day.\n\n`
}

export function validate(gate) {
    const out = []
    let docs
    try { docs = gate.json('api/v1/search/docs.json') } catch (e) { return ['api/v1/search/docs.json is missing or not JSON'] }
    if (docs.version !== gate.VERSION) out.push(`docs.json is of ${docs.version}, not ${gate.VERSION}`)
    if (!docs.docs.length) out.push('the index is empty')
    for (const [i, d] of docs.docs.entries()) {
        if (!gate.generated.has(d[4])) { out.push(`row ${i} (${d[0]}) points at ${d[4]}, which the build did not write`); break }
    }
    for (const k of docs.shards) if (!gate.generated.has(`api/v1/search/terms/${k}.json`)) out.push(`shard ${k} is listed but not written`)
    // every shard's postings point at rows that exist, and a known company is found by its name
    const S = require('../../../assets/search/search-core.js')
    const ids = docs.docs.map(d => d[0])
    for (const want of ['company:1password', 'topic:security']) {
        if (!ids.includes(want)) continue
        const title = docs.docs[ids.indexOf(want)][2]
        const t = S.terms(title)[0], sh = gate.json(`api/v1/search/terms/${S.shardOf(t)}.json`)
        const list = sh.t[t] || []
        let found = false
        for (let j = 0; j < list.length; j += 2) { if (list[j] >= docs.docs.length) { out.push(`shard ${S.shardOf(t)}: posting to row ${list[j]}, past the end`); break } if (docs.docs[list[j]][0] === want) found = true }
        if (!found) out.push(`${want} is not found by its own title word "${t}"`)
    }
    const big = Buffer.byteLength(gate.text('api/v1/search/docs.json'))
    if (big > 400 * 1024) out.push(`docs.json is ${big} bytes: the first file a reader loads should stay under 400 KB`)
    return out
}
