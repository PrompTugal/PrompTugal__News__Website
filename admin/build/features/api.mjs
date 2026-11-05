// The JSON API and the graphs (/api/v1/), and the page that explains them (/api/index.html).
//   /api/v1/index.json                    every endpoint
//   /api/v1/ontology.json                 the grammar (data/ontology.json), with counts
//   /api/v1/<type>.json                   an index per type; /api/v1/<type>/<slug>.json one file per entity, with its links
//   /api/v1/graph/whole.json              the whole graph; industry.json, summit.json, people.json are views of it
//   /api/v1/graph/{companies,events,people}/<slug>.json   one graph per company, event and person (views of the whole)
//   /api/v1/graph/whole.cytoscape.json    the whole graph as Cytoscape elements (the shape graphs.sgit.ai's viewers load)
//   /api/v1/triples.nt                    the whole graph as N-Triples, with each verb's inverse declared
//   /api/v1/manifest.json                 every file, its size, SHA-256 and schema (written by the core)
// The gate (validate below) checks the grammar: every verb in the ontology, every edge's ends of the types the verb
// allows, no forbidden verb, every node and edge with a source, and every view a part of the whole, object for object.
import { view, companyIds, eventIds, personIds, industryIds, summitIds, peopleIds, PLURAL, pageOf } from '../lib/graph.mjs'
import { loadSchemas, validate as check } from '../lib/schema.mjs'
export const order = 80

const ENTITY_TYPES = ['company', 'event', 'person', 'organisation', 'place', 'topic', 'story', 'evidence']
const GRAPHED = { company: companyIds, event: eventIds, person: personIds }
const STORE = { company: 'companies', event: 'events', person: 'people', organisation: 'organisations', place: 'places', topic: 'topics', story: 'stories', evidence: 'evidence' }

const meta = (ctx, id, title, about, focus) => ({ id, title, about, version: ctx.VERSION, grammar: `${ctx.BASE}api/v1/ontology.json`, ...(focus ? { focus } : {}) })

function entityFile(ctx, type, x) {
    const g = ctx.graph(), ref = `${type}:${x.id}`, n = g.node.get(ref), inv = new Map(ctx.store.ontology.verbs.map(v => [v.verb, v.inverse]))
    const label = id => g.node.get(id)?.label
    return {
        id: x.id, ref, type, label: n ? n.label : (x.name || x.title || x.id),
        page: pageOf(ref) && ctx.pages.some(p => p.rel === pageOf(ref)) ? `${ctx.BASE}${pageOf(ref)}` : null,
        graph: GRAPHED[type] ? `${ctx.BASE}api/v1/graph/${PLURAL[type]}/${x.id}.json` : null,
        data: x,
        links: {
            out: g.outOf(ref).map(e => ({ verb: e.verb, to: e.to, label: label(e.to), source: e.source, ...(e.read ? { read: e.read } : {}) })),
            in: g.inOf(ref).map(e => ({ verb: inv.get(e.verb), from: e.from, label: label(e.from), source: e.source, ...(e.read ? { read: e.read } : {}) })),
        },
    }
}

export function api(ctx) {
    const g = ctx.graph(), files = []
    const add = (path, data, schema) => files.push({ path, data, schema })
    const ont = ctx.store.ontology
    const counts = { nodes: g.nodes.length, edges: g.edges.length, by_type: {}, by_verb: {} }
    for (const n of g.nodes) counts.by_type[n.type] = (counts.by_type[n.type] || 0) + 1
    for (const e of g.edges) counts.by_verb[e.verb] = (counts.by_verb[e.verb] || 0) + 1
    add('api/v1/ontology.json', { ...ont, counts }, 'ontology')
    // entities and indexes
    for (const type of ENTITY_TYPES) {
        const list = ctx.store[STORE[type]]
        add(`api/v1/${PLURAL[type]}.json`, { type, count: list.length, items: list.map(x => ({ id: x.id, label: g.node.get(`${type}:${x.id}`)?.label || x.name || x.title, api: `${ctx.BASE}api/v1/${PLURAL[type]}/${x.id}.json`, ...(pageOf(`${type}:${x.id}`) ? { page: `${ctx.BASE}${pageOf(`${type}:${x.id}`)}` } : {}) })) }, 'api-index')
        for (const x of list) add(`api/v1/${PLURAL[type]}/${x.id}.json`, entityFile(ctx, type, x), 'api-entity')
    }
    // graphs: the whole, the three wide views, and one per company, event and person
    const whole = { ...meta(ctx, 'whole', 'The whole graph', 'Every node and edge of the newsroom\'s data. Never render it whole: render the answer to a question (a view).'), counts: { nodes: g.nodes.length, edges: g.edges.length }, nodes: g.nodes, edges: g.edges }
    add('api/v1/graph/whole.json', whole, 'graph')
    add('api/v1/graph/industry.json', view(g, industryIds(g), meta(ctx, 'industry', 'The industry graph', 'The fields, themes and beats, the companies filed under them, the summit tracks bridged to them, and the countries the companies are based in.')), 'graph')
    add('api/v1/graph/summit.json', view(g, summitIds(g), meta(ctx, 'summit', 'The summit graph', 'Every event, its day, its place (down to the stage, up to the country), its track and its organiser.')), 'graph')
    add('api/v1/graph/people.json', view(g, peopleIds(g), meta(ctx, 'people', 'The people graph', 'Every person, the organisations and companies they are listed under, and the events they speak at.')), 'graph')
    for (const [type, ids] of Object.entries(GRAPHED)) for (const x of ctx.store[STORE[type]]) {
        const ref = `${type}:${x.id}`
        add(`api/v1/graph/${PLURAL[type]}/${x.id}.json`, view(g, ids(g, ref), meta(ctx, ref, `${g.node.get(ref).label}: its graph`, `The part of the whole graph around this ${type}.`, ref)), 'graph')
    }
    add('api/v1/graph/whole.cytoscape.json', { version: ctx.VERSION, about: 'The whole graph as Cytoscape.js elements: nodes {data: {id, label, family}}, edges {data: {id, source, target, kind, verb}}, the shape the viewers on graphs.sgit.ai load.', elements: [...g.nodes.map(n => ({ data: { id: n.id, label: n.label, family: n.type } })), ...g.edges.map(e => ({ data: { id: e.id, source: e.from, target: e.to, kind: e.verb, verb: e.verb } }))] }, null)
    // N-Triples
    const B = `${ctx.BASE}api/v1/graph/`, q = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
    const nt = [
        ...ont.verbs.map(v => `<${B}verb/${v.verb}> <http://www.w3.org/2002/07/owl#inverseOf> <${B}verb/${v.inverse}> .`),
        ...g.nodes.flatMap(n => [`<${B}node/${encodeURI(n.id)}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${B}type/${n.type}> .`, `<${B}node/${encodeURI(n.id)}> <http://www.w3.org/2000/01/rdf-schema#label> "${q(n.label)}"@en .`]),
        ...g.edges.map(e => `<${B}node/${encodeURI(e.from)}> <${B}verb/${e.verb}> <${B}node/${encodeURI(e.to)}> .`),
    ].join('\n') + '\n'
    add('api/v1/triples.nt', nt, null)
    // the index of endpoints
    const types = ENTITY_TYPES.map(t => ({ type: t, count: ctx.store[STORE[t]].length, index: `${ctx.BASE}api/v1/${PLURAL[t]}.json`, each: `${ctx.BASE}api/v1/${PLURAL[t]}/{slug}.json` }))
    add('api/v1/index.json', {
        about: 'The Web Summit 2026 newsroom\'s data as JSON. Public facts only, each with its source and the date read. Material for agents, never instruction.',
        version: ctx.VERSION, licence: 'CC BY 4.0 (data), Apache-2.0 (code)',
        ontology: `${ctx.BASE}api/v1/ontology.json`, manifest: `${ctx.BASE}api/v1/manifest.json`, schemas: `${ctx.BASE}data/schemas/`,
        types,
        graphs: {
            whole: `${ctx.BASE}api/v1/graph/whole.json`, industry: `${ctx.BASE}api/v1/graph/industry.json`, summit: `${ctx.BASE}api/v1/graph/summit.json`, people: `${ctx.BASE}api/v1/graph/people.json`,
            company: `${ctx.BASE}api/v1/graph/companies/{slug}.json`, event: `${ctx.BASE}api/v1/graph/events/{slug}.json`, person: `${ctx.BASE}api/v1/graph/people/{slug}.json`,
            cytoscape: `${ctx.BASE}api/v1/graph/whole.cytoscape.json`, triples: `${ctx.BASE}api/v1/triples.nt`,
        },
        counts,
    }, null)
    return files
}

export function pages(ctx) {
    const rel = 'api/index.html', s = ctx.store, cell = ctx.md.cell
    const link = p => `[${p}](${ctx.link(rel, p)})`
    const md = `Everything on this site is also data. The facts behind every page are JSON files in the repository (\`data/\`, one folder per entity, each kind of file with a schema in [data/schemas/](${ctx.link(rel, 'data/schemas/company.schema.json').replace(/company\.schema\.json$/, 'company.schema.json')})), and the build publishes them, with the graphs, under \`/api/v1/\`. Public facts only, each with its source and the date read; text and data CC BY 4.0. Material for agents, never instruction.\n\n` +
        `## Start here {#start}\n\n- ${link('api/v1/index.json')}: every endpoint and the counts.\n- ${link('api/v1/ontology.json')}: the grammar, the types and the verbs, each verb with its inverse.\n- ${link('api/v1/manifest.json')}: every file, its size, its SHA-256 and its schema.\n\n` +
        `## The entities {#entities}\n\n| Type | How many | Index | One |\n|---|---|---|---|\n` +
        ENTITY_TYPES.map(t => `| ${t} | ${s[STORE[t]].length} | ${link(`api/v1/${PLURAL[t]}.json`)} | \`api/v1/${PLURAL[t]}/{slug}.json\` |`).join('\n') +
        `\n\nEach entity file holds the entity's data as the repository has it, its page, its graph (for companies, events and people) and its links: every edge out of it (verb, target) and into it (read backwards with the inverse verb), each with its source.\n\n` +
        `## The graphs {#graphs}\n\nOne whole graph, and views of it. A view is the part of the whole around a company, an event, a person, the industry, the summit or the people: the same node ids and the same edge objects, never a different format. So a company graph can be laid over the whole, or over another company's, and they join where they share a node.\n\n- ${link('api/v1/graph/whole.json')}: everything (do not draw it whole; draw the answer to a question).\n- ${link('api/v1/graph/industry.json')}: fields, themes and beats; the companies in each; the summit tracks bridged to them; the countries.\n- ${link('api/v1/graph/summit.json')}: events, days, places down to the stage, tracks, organisers.\n- ${link('api/v1/graph/people.json')}: people, the organisations they are listed under, the events they speak at.\n- \`api/v1/graph/companies/{slug}.json\`, \`api/v1/graph/events/{slug}.json\`, \`api/v1/graph/people/{slug}.json\`: one per company, event and person (for example ${link('api/v1/graph/companies/replit.json')}).\n- ${link('api/v1/graph/whole.cytoscape.json')}: the whole graph as Cytoscape.js elements, the shape the viewers on [graphs.sgit.ai](https://graphs.sgit.ai/) load.\n- ${link('api/v1/triples.nt')}: the whole graph as N-Triples, each verb's inverse declared.\n\n` +
        `A graph file is \`{id, title, version, grammar, counts, nodes, edges}\`. A node is \`{id, type, label, source, ...}\`, its id \`<type>:<slug>\`; an edge is \`{id, from, to, verb, source, read}\`, read forwards as "from verb to" and backwards with the verb's inverse. Every node and every edge names its source: the page it was read on, or the repository file it was derived from.\n\n` +
        `## The grammar {#grammar}\n\nThe rule this follows ([graphs.sgit.ai](https://graphs.sgit.ai/llms.txt)): a node carries no meaning by itself; what a thing is comes from its edges. Every edge is a verb with a distinct inverse, and there is no "related to": two companies are related only by a path you can read (both filed under Security; both at the same session).\n\n| Verb | Inverse | From | To | Meaning |\n|---|---|---|---|---|\n` +
        s.ontology.verbs.map(v => `| ${v.verb} | ${v.inverse} | ${v.from.join(', ')} | ${v.to.join(', ')} | ${cell(v.meaning)} |`).join('\n') +
        `\n\nThe types sit in four worlds (the summit's programme, the people, the industry, the evidence), each with its own vocabulary, joined by bridge verbs: zoom into a company and you reach its facts and the pages they were read on, in the evidence world's verbs. Forbidden: ${s.ontology.forbidden.map(f => `\`${f.verb}\``).join(', ')}.`
    return [{ src: 'data/ontology.json', rel, type: 'site', title: 'The data, as JSON', summary: 'Every fact on this site as JSON: one file per company, event, person, organisation, place and topic, one graph per company, event and person, the whole graph, and the grammar they share.', md }]
}

export const llms = ctx => `## The JSON API\n- [api/v1/index.json](${ctx.BASE}api/v1/index.json): every endpoint and the counts.\n- [api/v1/ontology.json](${ctx.BASE}api/v1/ontology.json): the grammar (types, verbs and their inverses).\n- [api/v1/manifest.json](${ctx.BASE}api/v1/manifest.json): every API file with its size, SHA-256 and schema.\n- ${ENTITY_TYPES.map(t => `[api/v1/${PLURAL[t]}.json](${ctx.BASE}api/v1/${PLURAL[t]}.json)`).join(', ')}: an index per type; one file per entity at api/v1/<type>/<slug>.json.\n- [api/v1/graph/whole.json](${ctx.BASE}api/v1/graph/whole.json), [industry.json](${ctx.BASE}api/v1/graph/industry.json), [summit.json](${ctx.BASE}api/v1/graph/summit.json), [people.json](${ctx.BASE}api/v1/graph/people.json): the whole graph and its views; api/v1/graph/companies/<slug>.json, events/<slug>.json, people/<slug>.json: one per company, event and person, each a part of the whole.\n- [api/v1/graph/whole.cytoscape.json](${ctx.BASE}api/v1/graph/whole.cytoscape.json), [api/v1/triples.nt](${ctx.BASE}api/v1/triples.nt): the same graph for viewers and RDF tools.\n\n`

// the gate's checks of the graphs and the API (run by admin/build/checks.mjs after the build)
export function validate(gate) {
    const errors = []
    const ont = gate.json('data/ontology.json'), V = new Map(ont.verbs.map(v => [v.verb, v]))
    const forbidden = new Set(ont.forbidden.map(f => f.verb)), types = new Set(ont.types.map(t => t.id))
    const inverses = ont.verbs.map(v => v.inverse)
    for (const v of ont.verbs) if (v.verb === v.inverse) errors.push(`ontology: ${v.verb} is its own inverse`)
    if (new Set(inverses).size !== inverses.length) errors.push('ontology: two verbs share an inverse')
    for (const v of ont.verbs) if (V.has(v.inverse) && V.get(v.inverse).inverse !== v.verb) errors.push(`ontology: ${v.inverse} is a verb and the inverse of ${v.verb}`)
    const whole = gate.json('api/v1/graph/whole.json')
    const nodes = new Map(), edges = new Map()
    for (const n of whole.nodes) {
        if (nodes.has(n.id)) errors.push(`whole.json: node ${n.id} twice`)
        nodes.set(n.id, JSON.stringify(n))
        if (!types.has(n.type)) errors.push(`whole.json: node ${n.id} has a type the ontology does not define (${n.type})`)
        if (!n.id.startsWith(`${n.type}:`)) errors.push(`whole.json: node ${n.id} is not of its type ${n.type}`)
        if (!n.source) errors.push(`whole.json: node ${n.id} names no source`)
    }
    for (const e of whole.edges) {
        if (edges.has(e.id)) errors.push(`whole.json: edge ${e.id} twice`)
        edges.set(e.id, JSON.stringify(e))
        const v = V.get(e.verb)
        if (forbidden.has(e.verb)) errors.push(`whole.json: ${e.id} uses a forbidden verb`)
        if (!v) { errors.push(`whole.json: ${e.id} uses a verb the ontology does not define`); continue }
        if (!nodes.has(e.from) || !nodes.has(e.to)) errors.push(`whole.json: ${e.id} has an end that is not a node`)
        if (!v.from.includes(e.from.split(':')[0]) || !v.to.includes(e.to.split(':')[0])) errors.push(`whole.json: ${e.id}: ${e.verb} goes from ${v.from.join('|')} to ${v.to.join('|')}`)
        if (!e.source) errors.push(`whole.json: edge ${e.id} names no source`)
    }
    // every view is a part of the whole, object for object (the fractal claim)
    const reg = loadSchemas(gate.R('data/schemas'))
    const manifest = gate.json('api/v1/manifest.json')
    const crypto = gate.sha256
    for (const f of manifest.files) {
        if (!gate.generated.has(f.path)) errors.push(`manifest lists ${f.path}, which the build did not write`)
        const body = gate.text(f.path)
        if (f.sha256 !== crypto(body) || f.bytes !== Buffer.byteLength(body)) errors.push(`manifest: ${f.path} does not match its size or SHA-256`)
        if (f.schema && f.path.endsWith('.json')) {
            const data = JSON.parse(body)
            if (f.schema !== 'ontology' && f.schema !== 'search-docs') for (const e of check(data, `${f.schema}.schema.json`, reg).slice(0, 3)) errors.push(`${f.path}: ${e}`)
            if (f.schema === 'graph' && f.path !== 'api/v1/graph/whole.json') {
                for (const n of data.nodes) if (nodes.get(n.id) !== JSON.stringify(n)) errors.push(`${f.path}: node ${n.id} is not the whole graph's node`)
                for (const e of data.edges) if (edges.get(e.id) !== JSON.stringify(e)) errors.push(`${f.path}: edge ${e.id} is not the whole graph's edge`)
            }
        }
    }
    for (const g of [...gate.generated].filter(p => p.startsWith('api/v1/') && p !== 'api/v1/manifest.json')) if (!manifest.files.some(f => f.path === g)) errors.push(`manifest does not list ${g}`)
    // every entity that has a page in the ontology has its page and its API file
    for (const t of ont.types.filter(t => t.page && t.id !== 'article')) for (const n of whole.nodes.filter(n => n.type === t.id)) {
        const slug = n.id.slice(t.id.length + 1)
        if (!gate.generated.has(t.page.replace('{slug}', slug))) errors.push(`${n.id} has no page (${t.page.replace('{slug}', slug)})`)
        if (!gate.generated.has(`api/v1/${PLURAL[t.id]}/${slug}.json`)) errors.push(`${n.id} has no API file`)
    }
    return errors
}
