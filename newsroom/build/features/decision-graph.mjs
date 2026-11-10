// The decision graph, drawn: decision-makers as nodes, "this usually follows that" as edges, each node happened / expected / not
// announced / unknown, with its source and the time read. The data is the weather desk's own file, desks/weather-vicky/decision-graph.json
// (weather@PrompTugal.vicky; ANALYSIS is labelled as analysis there and here); this feature passes it through unchanged to
// api/v1/newsroom/decision-graph.json so the page can read it, and checks that every edge names two nodes. The picture is
// assets/newsroom/decision-graph.js. A layout preview in the newsroom: the public page for the storm is the desk's proposal
// (desks/weather-vicky/proposal-storm-page.md) and waits at Vicky's or Dinis's word.
// By dev.graphs@PrompTugal.dinis, 10 November 2026 (WS-177), at the storm guidance (board/guidance/2026-11-10-the-storm-as-our-case-study.md).
import fs from 'node:fs'
import path from 'node:path'
export const order = 95
const SRC = 'desks/weather-vicky/decision-graph.json', API = 'api/v1/newsroom/decision-graph.json', PAGE = 'newsroom/decision-graph/index.html'

export function api(ctx) {
    const f = path.join(ctx.ROOT || process.cwd(), SRC)
    if (!fs.existsSync(f)) return []
    return [{ path: API, schema: null, data: JSON.parse(fs.readFileSync(f, 'utf8')) }]
}

export function decorate(page) {
    if (page.rel !== PAGE) return
    page.assets = { css: ['assets/newsroom/decision-graph.css'], js: ['assets/newsroom/decision-graph.js'] }
    const prev = page.postHtml
    page.postHtml = h => (prev ? prev(h) : h) + '\n<div class="dg" id="dg" data-data="../../' + API + '"></div>'
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/newsroom/decision-graph.js', 'assets/newsroom/decision-graph.css']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try {
        const d = gate.json(API), ids = new Set(d.nodes.map(n => n.id))
        if (ids.size !== d.nodes.length) out.push('decision-graph.json: a node id is used twice')
        for (const e of d.edges) if (!ids.has(e.from) || !ids.has(e.to)) out.push(`decision-graph.json: an edge names a node that does not exist (${e.from} to ${e.to})`)
        for (const n of d.nodes) if (!d.legend[n.status]) out.push(`decision-graph.json: ${n.id} has a status the legend does not know (${n.status})`)
    } catch (e) { out.push(`cannot check decision-graph.json: ${e.message}`) }
    try { if (!gate.text(PAGE).includes('id="dg"')) out.push(`${PAGE} does not carry the graph`) } catch { out.push(`missing ${PAGE}`) }
    return out
}
