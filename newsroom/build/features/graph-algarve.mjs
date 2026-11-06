// Algarve Evolution, drawn: the data for the three pictures (assets/portugal/algarve-evolution.js) as one API file. The network
// (programmes, partners, events, roles and the edges between them, each with its sources) is the ontologist's
// data/organisations/algarve-evolution/network.json, named from the data folders; the timeline, the places and the labels are
// assets/portugal/algarve-evolution-data.json. By dev.graphs@PrompTugal.dinis, 6 November 2026 (WS-177).
import fs from 'node:fs'
import path from 'node:path'
export const order = 92
const J = (ctx, f) => JSON.parse(fs.readFileSync(path.join(ctx.ROOT || process.cwd(), f), 'utf8'))
const KIND = { programme: 'programme', organisation: 'partner', company: 'partner', event: 'event', role: 'role' }
const NAME = { event: ['events', 'event.json', 'title'], organisation: ['organisations', 'organisation.json', 'name'] }
const title = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export function api(ctx) {
    const base = J(ctx, 'assets/portugal/algarve-evolution-data.json'), net = J(ctx, 'data/organisations/algarve-evolution/network.json')
    const lab = new Map(base.sources && Object.entries(base.sources)), srcs = list => (list || []).map(s => ({ url: s.url, label: s.note || s.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], read: s.read_on }))
    const label = id => {
        const [t, s] = id.split(':'), n = NAME[t]
        if (n) { try { return J(ctx, `data/${n[0]}/${s}/${n[1]}`)[n[2]] } catch { /* falls through */ } }
        return title(s)
    }
    const nodes = new Map(), verb = v => v.replace(/_/g, ' ')
    const put = (id, extra) => { if (!nodes.has(id)) { const t = id.split(':')[0]; nodes.set(id, { id, label: label(id), kind: id === 'organisation:algarve-evolution' ? 'centre' : KIND[t] || 'partner', ...extra }) } return nodes.get(id) }
    for (const p of net.programmes) put(p.id, { label: p.name, note: p.what, srcs: srcs(p.sources) })
    for (const r of net.roles) put(r.id, { label: r.role, note: r.term, srcs: srcs(r.sources) })
    const links = []
    for (const e of net.edges) {
        if (e.to === 'place:faro' || e.from === 'place:faro') continue
        const a = put(e.from), b = put(e.to)
        for (const n of [a, b]) if (!n.srcs) n.srcs = srcs(e.sources)
        links.push([e.from, e.to, verb(e.verb), srcs(e.sources)])
    }
    const centre = nodes.get('organisation:algarve-evolution')
    if (centre) centre.note = base.nodes.find(n => n.id === 'ae').note
    const ws = base.nodes.find(n => n.id === 'ws26')
    nodes.set('ws26', { id: 'ws26', label: ws.label, kind: 'summit', note: ws.note, dashed: true, srcs: [{ url: base.sources[ws.src].url, label: base.sources[ws.src].label }] })
    links.push(['organisation:algarve-evolution', 'ws26', 'none found yet', []])
    const toSrcs = k => base.sources[k] ? [{ url: base.sources[k].url, label: base.sources[k].label }] : []
    const timeline = base.timeline.map(t => ({ ...t, srcs: t.srcOverride ? [t.srcOverride] : toSrcs(t.src) }))
    const places = base.places.map(p => ({ ...p, srcs: toSrcs(p.src) }))
    const figures = net.figures.map(f => ({ what: f.what, value: f.value, as_of: f.as_of, kind: f.kind, srcs: srcs(f.sources) }))
    return [{ path: 'api/v1/portugal/algarve-evolution-viz.json', schema: null, data: { id: 'algarve-evolution-viz', about: 'Algarve Evolution as data for its three pictures: nodes and links from data/organisations/algarve-evolution/network.json, the timeline and places from assets/portugal/algarve-evolution-data.json. Every item carries its sources.', ui: base.ui, nodes: [...nodes.values()], links, timeline, places, figures } }]
}

export function validate(gate) {
    try {
        const d = gate.json('api/v1/portugal/algarve-evolution-viz.json'), ids = new Set(d.nodes.map(n => n.id)), out = []
        for (const l of d.links) if (!ids.has(l[0]) || !ids.has(l[1])) out.push(`algarve-evolution-viz.json: a link names a node that does not exist: ${l[0]} ${l[1]}`)
        for (const n of d.nodes) if (n.id !== 'ws26' && !(n.srcs && n.srcs.length)) out.push(`algarve-evolution-viz.json: ${n.id} has no source`)
        return out
    } catch (e) { return [`cannot read the Algarve Evolution data: ${e.message}`] }
}
