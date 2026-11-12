// The graph explorer (/graph/), the small graphs on entity pages, and the graph commands a chat can call.
// By newsroom-graph@web-summit.dinis, 5 November 2026 (WS-14). The engine is ported from graphs.sgit.ai's universe
// reader (SGit-AI/SGit-AI__Website__Graphs, assets/universe/, Apache-2.0): the explore walk and its degree stepper,
// the stable-add layout, pinned slots for anchors, the focus ring, the path query, the preset views and the snapshot
// the chat attaches, drawn with the same vendored Cytoscape.js 3.30.2 (MIT, assets/vendor/cytoscape/).
//
//   /graph/                          the explorer; its state is in the URL (see llms() below)
//   /api/v1/graph/explorer.json      the whole graph, compact, with each node's degree, betweenness and PageRank and
//                                    each edge's betweenness, computed here once so the browser ranks without work
//   entity pages                     a prerendered <figure class="minigraph"> (company, event, person, organisation,
//                                    topic), with "Open in the graph" to /graph/?focus=<ref>
//   every page                       assets/graph/commands.js registers graph.* commands on window.__toolQueue
import { pageOf } from '../lib/graph.mjs'
import { rank } from './graph/rank.mjs'
import { forceLayout } from './graph/layout.mjs'
import { miniGraph, KIND_LABEL } from './graph/minigraph.mjs'
export const order = 85

const MINI_TYPES = ['company', 'event', 'person', 'organisation', 'topic']
const REL = 'graph/index.html'
const FACET_FIELDS = ['kind', 'organiser', 'date', 'time', 'country', 'category', 'role', 'organisation', 'status', 'beat', 'by', 'read']
const r4 = x => Math.round(x * 1e4) / 1e4

// the whole graph, compact, with its ranks: what the explorer and the chat commands load
function explorerData(ctx) {
    const g = ctx.graph(), ont = ctx.store.ontology
    const idx = new Map(g.nodes.map((n, i) => [n.id, i]))
    const sources = [], srcIdx = new Map()
    const src = u => { if (!u) return -1; if (!srcIdx.has(u)) { srcIdx.set(u, sources.length); sources.push(u) } return srcIdx.get(u) }
    const verbs = ont.verbs.map(v => v.verb), vIdx = new Map(verbs.map((v, i) => [v, i]))
    const pairs = g.edges.map(e => [idx.get(e.from), idx.get(e.to)])
    const R = rank(g.nodes.length, pairs)
    const XY = forceLayout(g.nodes.length, pairs)
    const pages = new Set(ctx.pages.map(p => p.rel))
    const what = new Map(ctx.store.companies.map(c => [`company:${c.id}`, c.what]))
    const nodes = g.nodes.map((n, i) => {
        const o = { id: n.id, type: n.type, label: n.label }
        if (n.page && pages.has(n.page)) o.page = n.page
        o.src = src(n.source)
        for (const f of FACET_FIELDS) if (n[f] != null && n[f] !== '') o[f] = n[f]
        if (n.our_pick) o.pick = true
        if (what.has(n.id)) o.what = what.get(n.id)
        o.deg = R.degree[i]; o.bc = r4(R.betweenness[i] * 1000); o.pr = r4(R.pagerank[i] * 1000)
        o.x = XY[i][0]; o.y = XY[i][1]
        return o
    })
    const edges = g.edges.map((e, i) => [pairs[i][0], pairs[i][1], vIdx.get(e.verb), src(e.source), e.read ? String(e.read).slice(0, 10) : 0, Math.round(R.edgeBetweenness[i])])
    return {
        id: 'explorer', version: ctx.VERSION,
        about: 'The whole graph (api/v1/graph/whole.json), compact, for the graph explorer at /graph/ and the chat\'s graph commands. nodes[i]: {id, type, label, page?, src (index into sources), facets..., deg, bc (betweenness x1000), pr (PageRank x1000), x, y (the whole graph\'s force layout, computed at build)}. edges[j]: [from node index, to node index, verb index, source index, read date or 0, edge betweenness]. Same ids and edges as the whole graph; ranks computed at build over the whole, undirected.',
        grammar: `${ctx.BASE}api/v1/ontology.json`,
        counts: { nodes: nodes.length, edges: edges.length },
        worlds: ont.worlds.map(w => ({ id: w.id, label: w.label, types: w.types })),
        types: ont.types.map(t => ({ id: t.id, label: t.label, world: t.world })),
        verbs: ont.verbs.map(v => ({ verb: v.verb, inverse: v.inverse, world: v.world, bridge: !!v.bridge, reads: v.reads, reads_inverse: v.reads_inverse })),
        views: [
            { id: 'whole', label: 'The whole graph', file: 'api/v1/graph/whole.json' },
            { id: 'industry', label: 'The industry', file: 'api/v1/graph/industry.json' },
            { id: 'summit', label: 'The summit\'s programme', file: 'api/v1/graph/summit.json' },
            { id: 'people', label: 'The people', file: 'api/v1/graph/people.json' },
        ],
        sources, nodes, edges,
    }
}

let cached
const dataOf = ctx => cached && cached.version === ctx.VERSION && cached.n === ctx.graph().nodes.length ? cached.data : (cached = { version: ctx.VERSION, n: ctx.graph().nodes.length, data: explorerData(ctx) }).data

export function api(ctx) {
    return [{ path: 'api/v1/graph/explorer.json', data: dataOf(ctx), schema: null }]
}

// ------------------------------------------------------------------ the explorer page
const ICON_SEARCH = '<svg class="s-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'

function explorerHtml(ctx) {
    const ont = ctx.store.ontology
    const worldChips = ont.worlds.map(w => `<button type="button" class="chip" data-world="${w.id}" aria-pressed="true">${ctx.md.esc(w.label.replace(/^The /, '').replace(/^summit's programme$/, 'Programme'))}</button>`).join('')
    const typeChips = ont.types.map(t => `<button type="button" class="chip" data-type="${t.id}" aria-pressed="true">${ctx.md.esc(t.label)}<span class="n"></span></button>`).join('')
    const verbChips = ont.verbs.map(v => `<button type="button" class="chip" data-verb="${v.verb}" aria-pressed="true" title="${ctx.md.esc(v.meaning)}">${v.verb.replace(/_/g, ' ')}${v.bridge ? ' ⇄' : ''}<span class="n"></span></button>`).join('')
    return `<div class="gx" id="gx" data-root="../" data-data="../api/v1/graph/explorer.json" data-captions="../assets/graph/captions.json">
<div class="gx-bar">
<form class="search gx-find" role="search" autocomplete="off"><label class="visually-hidden" for="gx-q">Find in the graph</label>${ICON_SEARCH}<input id="gx-q" type="search" placeholder="Find a company, person, session, place" role="combobox" aria-expanded="false" aria-controls="gx-pop" aria-autocomplete="list"><button type="submit">Find</button><div class="search-pop" id="gx-pop" role="listbox" hidden></div></form>
<div class="gx-row">
<label class="gx-field"><span class="label">View</span><select id="gx-view" aria-label="View"><option value="">Preset view</option></select></label>
<label class="gx-field"><span class="label">Layout</span><select id="gx-layout" aria-label="Layout"><option value="force">Force</option><option value="map">Map (whole graph)</option><option value="radial">Radial</option><option value="layered">Layered by world</option><option value="tree">Tree</option><option value="grid">Grid</option><option value="list">List</option></select></label>
<span class="gx-field gx-depth" role="group" aria-label="Explore depth"><span class="label">Depth</span><button type="button" class="chip" data-deg="down" aria-label="One hop less">−</button><output id="gx-deg">1</output><button type="button" class="chip" data-deg="up" aria-label="One hop more">+</button><button type="button" class="chip" data-deg="max" aria-pressed="false" title="Everything connected">∞</button></span>
<label class="gx-field"><span class="label">Top</span><select id="gx-topn" aria-label="Show the top"><option value="0">All</option><option>15</option><option>30</option><option>60</option><option>120</option><option>250</option></select><select id="gx-by" aria-label="Ranked by"><option value="pagerank">PageRank</option><option value="betweenness">betweenness</option><option value="degree">degree</option></select><select id="gx-what" aria-label="Of"><option value="nodes">nodes</option><option value="edges">edges</option></select></label>
<span class="gx-field gx-actions"><button type="button" class="chip" id="gx-anchor" title="Pin the selected node as an anchor">Anchor</button><button type="button" class="chip" id="gx-expand" title="Add the selected node's neighbours">Expand</button><button type="button" class="chip" id="gx-reset">Reset</button><button type="button" class="chip" id="gx-share" title="Copy a link to this view">Copy link</button></span>
</div>
<details class="gx-more"><summary>Filters</summary>
<div class="filters" role="group" aria-label="Worlds"><span class="label">Worlds</span>${worldChips}</div>
<div class="filters" role="group" aria-label="Types"><span class="label">Types</span>${typeChips}</div>
<div class="filters" role="group" aria-label="Verbs"><span class="label">Verbs</span>${verbChips}</div>
<div class="filters" role="group" aria-label="Organiser"><span class="label">Organiser</span><button type="button" class="chip" data-facet="organiser" data-value="" aria-pressed="true">All</button><button type="button" class="chip" data-facet="organiser" data-value="web-summit" aria-pressed="false">Web Summit</button><button type="button" class="chip" data-facet="organiser" data-value="other" aria-pressed="false">Other organisers</button></div>
<div class="filters" role="group" aria-label="Day" id="gx-days"><span class="label">Day</span></div>
<div class="filters gx-selects" role="group" aria-label="Facets"><label><span class="label">Field</span><select id="gx-topic"><option value="">All</option></select></label><label><span class="label">Country</span><select id="gx-country"><option value="">All</option></select></label><button type="button" class="chip" id="gx-clearf">Clear filters</button></div>
</details>
<form class="gx-path" id="gx-pathf" autocomplete="off"><span class="label">How is</span><input id="gx-from" placeholder="a company" aria-label="From"><span class="label">connected to</span><input id="gx-to" placeholder="another company" aria-label="To"><button type="submit" class="chip">Find the path</button></form>
</div>
<div class="gx-canvas" id="gx-canvas"><div class="gx-cy" id="gx-cy" aria-label="The graph canvas" role="img"></div><div class="gx-list" id="gx-list" hidden></div><div class="gx-zoom"><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit" aria-label="Fit">⤢</button></div><span class="gx-hint" id="gx-hint">Loading the graph…</span><noscript><p class="gx-noscript">The explorer needs JavaScript. The same graph is published as data: <a href="../api/v1/graph/whole.json">graph/whole.json</a>.</p></noscript></div>
<aside class="gx-side" id="gx-side" aria-live="polite"><p class="kicker">The graph</p><h2 class="gx-title">Pick a node</h2><p class="gx-note">Find a company, person or session above, or tap a node. Every node and edge names its source.</p></aside>
</div>`
}

function explorerMd(ctx) {
    const ont = ctx.store.ontology, g = ctx.graph()
    return `The newsroom's graph, to explore: ${g.nodes.length.toLocaleString('en-GB')} nodes and ${g.edges.length.toLocaleString('en-GB')} edges in four worlds (the summit's programme, the people, the industry, the evidence), joined by named verbs, each with its inverse. It starts from a question, never from the whole: a company, a session, a person, or the most important nodes by a ranking you choose.\n\n` +
        `## How to use it {#how}\n\n` +
        `- **Find** a node by name, then **expand** it one hop at a time, or set the **depth** of the walk around it (the explore stepper of graphs.sgit.ai's reader).\n` +
        `- **Anchor** the nodes you start from: anchors are pinned to the edges of the canvas and held through every layout, so a path between two anchors reads left to right.\n` +
        `- **How is A connected to B?** Name two nodes and the explorer finds up to three shortest paths, each read as a sentence with its verbs (\`Replit is filed under Developer tools; Developer tools classifies LaunchDarkly\`).\n` +
        `- **Top**: keep the N most important nodes, by PageRank, betweenness or degree over the whole graph, or the N edges that carry the most shortest paths (edge betweenness): the bridges.\n` +
        `- **Filters**, at four levels: worlds, types, verbs, and facets (day, organiser Web Summit or other, field, country).\n` +
        `- **Layouts**: force, the map (the whole graph laid out once at build, so a large view draws at once), radial (rings by hops from the anchors), layered by world, tree, grid, and a list. A view of more than 200 nodes uses the map's positions.\n` +
        `- **The panel** shows the selected node's record, every connection read as a sentence with its source and the date it was read, and a link to its page.\n` +
        `- **The URL** holds the state, so a view can be shared.\n` +
        `- **Centres of gravity**: [an animated picture](${ctx.link(REL, 'graph/gravity/index.html')}) of the companies orbiting the wells of their field or country.\n\n` +
        `## Its address {#url}\n\n| Parameter | Example | Meaning |\n|---|---|---|\n` +
        `| \`view\` | \`whole\`, \`industry\`, \`summit\`, \`people\`, \`companies/replit\`, \`events/<slug>\`, \`people/<slug>\` | the universe: a view of the whole graph from [/api/v1/graph/](${ctx.link(REL, 'api/index.html')}) |\n` +
        `| \`focus\`, \`depth\` | \`company:replit\`, \`2\` | the node to explore from and how many hops (\`max\` for all) |\n` +
        `| \`anchors\` | \`company:replit,company:cloudflare\` | pinned start nodes |\n` +
        `| \`expand\` | \`company:1password\` | nodes expanded by one hop |\n` +
        `| \`path\` | \`company:replit~company:cloudflare\` | the paths between two nodes |\n` +
        `| \`top\`, \`by\`, \`what\` | \`60\`, \`betweenness\`, \`edges\` | the top N nodes (or edges) by a ranking |\n` +
        `| \`worlds\`, \`types\`, \`verbs\` | \`industry,people\`, \`company,person\`, \`speaks_at\` | what to show (default: all) |\n` +
        `| \`facets\` | \`date:2026-11-10;organiser:web-summit;category:security;country:Portugal\` | facet filters |\n` +
        `| \`layout\`, \`sel\` | \`radial\`, \`company:replit\` | the layout and the selected node |\n\n` +
        `## For a chat or an agent {#commands}\n\nThe graph answers commands through the page's tool API (\`window.__tool\`, registered through \`window.__toolQueue\`), from this page or any other: off this page, the view commands return the explorer's address with the state they ask for (or open it, with \`open: true\`); \`graph.query\`, \`graph.search\`, \`graph.select\` and \`graph.path\` answer anywhere.\n\n` +
        COMMANDS.map(([n, p, d]) => `- \`${n}(${p})\`: ${d}`).join('\n') + '\n\n' +
        `## The data {#data}\n\nThe explorer loads [graph/explorer.json](${ctx.link(REL, 'api/v1/graph/explorer.json')}): the whole graph compact, with each node's degree, betweenness and PageRank and each edge's betweenness, computed at build. The views it starts from are the API's own: [graph/whole.json](${ctx.link(REL, 'api/v1/graph/whole.json')}), [industry](${ctx.link(REL, 'api/v1/graph/industry.json')}), [summit](${ctx.link(REL, 'api/v1/graph/summit.json')}), [people](${ctx.link(REL, 'api/v1/graph/people.json')}), and one per company, event and person. The grammar: [ontology.json](${ctx.link(REL, 'api/v1/ontology.json')}) (${ont.types.length} types, ${ont.verbs.length} verbs).\n\n` +
        `## Where it comes from {#credits}\n\nThe engine is ported from the universe reader on [graphs.sgit.ai](https://graphs.sgit.ai/) (code Apache-2.0): the explore walk and its degree stepper, the stable-add layout (a node already on the canvas does not move when others arrive), pinned slots for anchors, the focus ring, the path query, preset views and the snapshot a chat attaches. It draws with [Cytoscape.js](https://js.cytoscape.org/) 3.30.2 (MIT, copyright the Cytoscape Consortium), vendored as graphs.sgit.ai vendors it: [its licence](${ctx.link(REL, 'assets/vendor/cytoscape/LICENSE.txt')}).`
}

const READ = new Set(['graph.state', 'graph.query', 'graph.search'])
// [name, params, what it does]: also the llms.txt list
const COMMANDS = [
    ['graph.load', '{view}', 'show a view: whole, industry, summit, people, or companies/<slug>, events/<slug>, people/<slug>'],
    ['graph.focus', '{id, depth?}', 'explore from one node (an id such as company:replit, or a name), depth hops (default 1, "max" for all)'],
    ['graph.expand', '{id}', 'add a node\'s neighbours, one hop, without moving what is already drawn'],
    ['graph.filter', '{types?, verbs?, worlds?, facets?, reset?}', 'what to show; facets: {date, organiser, kind, category, country, track}'],
    ['graph.anchors', '{ids, mode?}', 'pin start nodes (mode set, add or clear); a two-anchor view reads left to right'],
    ['graph.top', '{n, by?, what?}', 'keep the top n nodes (or edges) by pagerank, betweenness or degree; n 0 clears; returns the ranking'],
    ['graph.layout', '{name}', 'force, map (the whole graph\'s layout, computed at build), radial, layered, tree, grid or list'],
    ['graph.path', '{from, to, max?, avoid?}', 'up to three shortest paths between two nodes, each with its verbs and as a sentence'],
    ['graph.select', '{id}', 'select a node; returns its record, its connections with their sources, and its page'],
    ['graph.state', '{}', 'what is on screen: view, filters, anchors, focus, counts, the selection, the URL'],
    ['graph.snapshot', '{full?}', 'the canvas as a PNG data URL, for the chat to attach as an image'],
    ['graph.query', '{type?, verb?, from?, to?, text?, limit?}', 'read: edges (with verb) or nodes (without) matching, over the whole graph'],
    ['graph.search', '{text, type?, limit?}', 'read: nodes whose name matches, with their ids'],
    ['graph.reset', '{}', 'back to the start view'],
]

export function pages(ctx) {
    return [{
        rel: REL, src: 'newsroom/build/features/graph.mjs', type: 'data', title: 'The graph',
        summary: 'Explore how the companies, sessions, people, places and fields of Web Summit Lisbon 2026 connect: start from one, expand, filter, rank, and ask how one company is connected to another.',
        crumbs: [[null, 'The graph']], toc: [],
        md: explorerMd(ctx),
        assets: { css: [], js: ['assets/vendor/cytoscape/cytoscape.min.js', 'assets/graph/engine.js', 'assets/graph/explorer.js'] },
        postHtml: html => explorerHtml(ctx) + '\n' + html,
    }]
}

// ------------------------------------------------------------------ the small graphs on entity pages
const refOfRel = rel => { const m = rel.match(/^(companies|events|people|organisations|topics)\/([^/]+)\/index\.html$/); return m ? `${{ companies: 'company', events: 'event', people: 'person', organisations: 'organisation', topics: 'topic' }[m[1]]}:${m[2]}` : null }

export function decorate(page, ctx) {
    if (!MINI_TYPES.includes(page.type) || page.minigraph) return
    const ref = refOfRel(page.rel)
    if (!ref || !ctx.graph().node.has(ref)) return
    const up = '../'.repeat(page.rel.split('/').length - 1)
    const pages = new Set(ctx.pages.length ? ctx.pages.map(p => p.rel) : [])
    const verbs = new Map(ctx.store.ontology.verbs.map(v => [v.verb, v]))
    const mg = miniGraph(ctx.graph(), ref, { verbs, href: id => { const p = pageOf(id); return p && (!pages.size || pages.has(p)) ? up + p : null } })
    if (!mg) return
    page.minigraph = true
    const open = `graph/index.html?focus=${encodeURIComponent(ref)}`
    const legend = mg.kinds.map(k => `<span><i class="l-${k}"></i>${KIND_LABEL[k]}</span>`).join('')
    const fig = `<figure class="minigraph" data-focus="${ref}">${mg.svg}<figcaption><span class="g-legend">${legend}${mg.more ? `<span class="g-more">and ${mg.more} more</span>` : ''}</span><a class="more" href="${up}${open}">Open in the graph</a></figcaption></figure>`
    // the twin and the page both say where the graph is; the page's link is made relative so it works anywhere
    page.md += `\n\n[Open ${ctx.md.cell(ctx.graph().node.get(ref).label)} in the graph](${ctx.BASE}${open.replace('index.html', '')})`
    const prev = page.postHtml
    page.postHtml = html => {
        html = prev ? prev(html) : html
        html = html.split(`href="${ctx.BASE}${open.replace('index.html', '')}"`).join(`href="${up}${open}"`)
        return fig + '\n' + html
    }
}

// ------------------------------------------------------------------ site-wide: the commands, and the minigraph's look
export const assets = { css: ['assets/graph/graph.css'], js: ['assets/graph/commands.js'] }

export function llms(ctx) {
    return `## The graph explorer\n\n- [/graph/](${ctx.BASE}graph/): explore the graph (needs JavaScript). Start from a node, expand, filter by world, type, verb and facet, rank (top N nodes or edges by PageRank, betweenness or degree), anchor, and find how two nodes connect (paths read as sentences). Its state is in the URL: view (whole, industry, summit, people, companies/<slug>, events/<slug>, people/<slug>), focus and depth, anchors, expand, path (a~b), top, by, what (nodes or edges), worlds, types, verbs, facets (date:2026-11-10;organiser:web-summit;category:security;country:Portugal), layout (force, map, radial, layered, tree, grid, list), sel. Example: ${ctx.BASE}graph/?path=company:replit~company:cloudflare\n` +
        `- [graph/explorer.json](${ctx.BASE}api/v1/graph/explorer.json): the whole graph compact, with degree, betweenness and PageRank per node and betweenness per edge.\n` +
        `- Company, event, person, organisation and topic pages carry a small graph of the entity and its neighbours, linked to the explorer.\n` +
        `- Commands for a chat (window.__tool, registered through window.__toolQueue; view-level unless marked read): ${COMMANDS.map(([n, p]) => `${n}(${p})${READ.has(n) ? ' (read)' : ''}`).join(', ')}. Off /graph/, view commands return the explorer's address for the state they ask (open: true navigates); the read commands answer anywhere.\n\n`
}

export function validate(gate) {
    const out = []
    const need = ['assets/vendor/cytoscape/cytoscape.min.js', 'assets/vendor/cytoscape/LICENSE.txt', 'assets/graph/engine.js', 'assets/graph/explorer.js', 'assets/graph/commands.js', 'assets/graph/graph.css']
    for (const f of need) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try { if (!/Copyright \(c\) 2016-2024, The Cytoscape Consortium/.test(gate.text('assets/vendor/cytoscape/cytoscape.min.js').slice(0, 400))) out.push('the vendored Cytoscape.js lost its copyright header') } catch { }
    let ex, whole
    try { ex = gate.json('api/v1/graph/explorer.json'); whole = gate.json('api/v1/graph/whole.json') } catch (e) { return [...out, `cannot read the graphs: ${e.message}`] }
    if (ex.nodes.length !== whole.nodes.length || ex.edges.length !== whole.edges.length) out.push(`explorer.json (${ex.nodes.length}/${ex.edges.length}) does not match whole.json (${whole.nodes.length}/${whole.edges.length})`)
    const ids = new Set(whole.nodes.map(n => n.id))
    for (const n of ex.nodes) if (!ids.has(n.id)) { out.push(`explorer.json has a node the whole graph does not: ${n.id}`); break }
    const wholeEdges = new Set(whole.edges.map(e => `${e.verb}:${e.from}:${e.to}`))
    for (const e of ex.edges) { const k = `${ex.verbs[e[2]].verb}:${ex.nodes[e[0]].id}:${ex.nodes[e[1]].id}`; if (!wholeEdges.has(k)) { out.push(`explorer.json has an edge the whole graph does not: ${k}`); break } }
    // every entity page of the five types whose entity has an edge carries its small graph and the explorer's link
    const deg = new Map(ex.nodes.map(n => [n.id, n.deg]))
    const missing = []
    for (const f of gate.generated) {
        const ref = refOfRel(f)
        if (!ref || !deg.get(ref)) continue
        const t = gate.text(f)
        if (!t.includes('class="minigraph"') || !t.includes(`graph/index.html?focus=${encodeURIComponent(ref)}`)) missing.push(f)
    }
    if (missing.length) out.push(`${missing.length} entity pages have no small graph (first: ${missing[0]})`)
    if (!gate.text('graph/index.html').includes('id="gx"')) out.push('graph/index.html does not carry the explorer')
    return out
}
