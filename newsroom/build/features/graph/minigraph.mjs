// The small graph on an entity page: the entity and its neighbours in rows, after the designer's drawing of Replit
// (design/mockups/company.html): what happens above (sessions), who is next to it (people), the entity in the middle,
// what it is filed under and where (fields, places), and what is one step further (companies in the same field).
// Prerendered as SVG at build: no script, no extra request, and every node is a link to its page.
// Not a feature (this folder is not loaded by lib/features.mjs); graph.mjs uses it.
//   miniGraph(g, ref, { href, verbs }) -> { svg, kinds, shown, more } | null
//     g: the whole graph (ctx.graph()); href(ref) -> a relative link or null; verbs: Map verb -> ontology entry

const W = 640, ROW = 80, TOP = 34
export const KIND = { company: 'co', person: 'person', event: 'session', topic: 'topic', place: 'place', article: 'article', organisation: 'org', track: 'track', day: 'day', story: 'story', evidence: 'evidence' }
export const KIND_LABEL = { co: 'company', person: 'person', session: 'session', topic: 'field or theme', place: 'place', article: 'article', org: 'organisation', track: 'summit track', day: 'day', story: 'story candidate', evidence: 'capture' }
const ROUND = new Set(['co', 'person', 'org'])
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cut = (s, n) => (s = String(s)).length > n ? s.slice(0, Math.max(1, n - 1)).trimEnd() + '…' : s
const SHORT_DAY = d => d ? new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }) : ''

function sub(n) {
    if (n.type === 'event') return [SHORT_DAY(n.date), (n.time || '').slice(0, 5)].filter(Boolean).join(' · ')
    if (n.type === 'person') return cut(n.role || 'person', 24)
    if (n.type === 'topic') return n.kind || 'topic'
    if (n.type === 'place') return n.kind || 'place'
    if (n.type === 'company') return n.country ? cut(n.country.replace(/\s*\(.*$/, ''), 22) : 'company'
    if (n.type === 'organisation') return 'organisation'
    if (n.type === 'track') return 'summit track'
    if (n.type === 'evidence') return 'capture'
    if (n.type === 'story') return 'story candidate'
    return ''
}

// rows of { id, parent } chosen per type; row 2 is the entity itself
function rowsFor(g, ref) {
    const t = ref.split(':')[0]
    const out = (id, v) => g.outOf(id, v).map(e => e.to), inn = (id, v) => g.inOf(id, v).map(e => e.from)
    const deg = id => g.outOf(id).length + g.inOf(id).length
    const byDeg = (a, b) => deg(b) - deg(a) || a.localeCompare(b)
    const when = id => { const n = g.node.get(id) || {}; return (n.date || '') + (n.time || '') }
    const byWhen = (a, b) => when(a).localeCompare(when(b)) || a.localeCompare(b)
    const seen = new Set([ref]), rows = [[], [], [], [], []], more = {}
    // add to a row what is not drawn yet, up to the row's cap; count what did not fit
    const put = (row, list, cap) => {
        const local = new Set(), fresh = list.filter(x => x.id !== ref && g.node.has(x.id) && !seen.has(x.id) && !local.has(x.id) && local.add(x.id))
        const take = fresh.slice(0, Math.max(0, cap - rows[row].length))
        take.forEach(x => seen.add(x.id)); rows[row].push(...take)
        more[row] = (more[row] || 0) + fresh.length - take.length
    }
    if (t === 'company') {
        const people = inn(ref, 'listed_under').sort((a, b) => out(b, 'speaks_at').length - out(a, 'speaks_at').length || byDeg(a, b))
        put(1, people.map(id => ({ id, parent: ref })), 4)
        const direct = [...out(ref, 'appears_in'), ...out(ref, 'hosts')].map(id => ({ id, parent: ref }))
        const via = rows[1].flatMap(p => out(p.id, 'speaks_at').map(id => ({ id, parent: p.id })))
        put(0, [...direct, ...via].sort((a, b) => byWhen(a.id, b.id)), 5)
        put(3, [...out(ref, 'filed_under'), ...out(ref, 'based_in')].map(id => ({ id, parent: ref })), 4)
        const field = out(ref, 'filed_under')[0]
        if (field) put(4, inn(field, 'filed_under').sort(byDeg).map(id => ({ id, parent: field })), 5)
        // what it is built on, what is built on it, where it sells (ontologist@'s built_on and sells_on, 7 November)
        put(3, [...out(ref, 'built_on'), ...inn(ref, 'built_on'), ...out(ref, 'sells_on'), ...inn(ref, 'sells_on')].map(id => ({ id, parent: ref })), 7)
    } else if (t === 'event') {
        put(0, [...out(ref, 'part_of'), ...out(ref, 'in_track')].map(id => ({ id, parent: ref })), 4)
        put(1, [...inn(ref, 'speaks_at'), ...inn(ref, 'hosts'), ...out(ref, 'organised_by')].map(id => ({ id, parent: ref })), 5)
        put(3, [...out(ref, 'takes_place_at'), ...out(ref, 'on_day')].map(id => ({ id, parent: ref })), 4)
        const cos = [...inn(ref, 'appears_in').map(id => ({ id, parent: ref })), ...rows[1].filter(p => p.id.startsWith('person:')).flatMap(p => out(p.id, 'listed_under').map(id => ({ id, parent: p.id })))]
        put(4, cos, 5)
    } else if (t === 'person') {
        put(1, out(ref, 'speaks_at').sort(byWhen).map(id => ({ id, parent: ref })), 5)
        put(0, rows[1].flatMap(e => inn(e.id, 'speaks_at').map(id => ({ id, parent: e.id }))), 5)
        put(3, out(ref, 'listed_under').map(id => ({ id, parent: ref })), 4)
        put(4, rows[3].flatMap(o => [...out(o.id, 'filed_under'), ...out(o.id, 'based_in')].map(id => ({ id, parent: o.id }))), 4)
    } else if (t === 'organisation') {
        put(1, inn(ref, 'listed_under').sort((a, b) => out(b, 'speaks_at').length - out(a, 'speaks_at').length || byDeg(a, b)).map(id => ({ id, parent: ref })), 5)
        const direct = [...out(ref, 'hosts'), ...inn(ref, 'organised_by')].map(id => ({ id, parent: ref }))
        const via = rows[1].flatMap(p => out(p.id, 'speaks_at').map(id => ({ id, parent: p.id })))
        put(0, [...direct.sort((a, b) => byWhen(a.id, b.id)), ...via.sort((a, b) => byWhen(a.id, b.id))], 5)
        put(3, inn(ref, 'names').map(id => ({ id, parent: ref })), 4)
        put(3, [...inn(ref, 'sells_on'), ...inn(ref, 'partner_of')].map(id => ({ id, parent: ref })), 7)  // who sells on it, who partners with it
        put(4, rows[3].flatMap(x => inn(x.id, 'rests_on').map(id => ({ id, parent: x.id }))), 4)
    } else if (t === 'topic') {
        put(1, [...out(ref, 'narrower_than'), ...inn(ref, 'maps_to')].map(id => ({ id, parent: ref })), 4)
        put(0, rows[1].filter(x => x.id.startsWith('track:')).flatMap(tr => inn(tr.id, 'in_track').sort(byWhen).map(id => ({ id, parent: tr.id }))), 5)
        put(3, inn(ref, 'filed_under').sort(byDeg).map(id => ({ id, parent: ref })), 5)
        put(4, inn(ref, 'narrower_than').map(id => ({ id, parent: ref })), 5)
        put(4, inn(ref, 'about').map(id => ({ id, parent: ref })), 5)
    } else if (t === 'article') {
        const named = out(ref, 'mentions'), ofType = ts => named.filter(id => ts.includes(id.split(':')[0])).map(id => ({ id, parent: ref }))
        put(0, ofType(['event']).sort((a, b) => byWhen(a.id, b.id)), 5)
        put(1, ofType(['person']), 5)
        put(3, ofType(['company']).sort((a, b) => byDeg(a.id, b.id)), 5)
        put(4, ofType(['organisation', 'topic', 'place']), 5)
    } else return null
    rows[2] = [{ id: ref, parent: null }]
    return { rows, more }
}

export function miniGraph(g, ref, { href = () => null, verbs = new Map() } = {}) {
    if (!g.node.has(ref)) return null
    const r = rowsFor(g, ref)
    if (!r) return null
    const used = r.rows.map((row, i) => ({ row, i })).filter(x => x.row.length)
    if (used.length < 2) return null
    const H = TOP + (used.length - 1) * ROW + 46
    const pos = new Map()
    used.forEach(({ row }, k) => {
        const y = TOP + k * ROW
        row.forEach((x, j) => pos.set(x.id, { x: (W / row.length) * (j + .5), y, cols: row.length }))
    })
    // the sentence an edge reads as, either way round, from the ontology
    const sentence = (a, b) => {
        const e = g.outOf(a).find(x => x.to === b) || g.inOf(a).find(x => x.from === b)
        if (!e) return ''
        const v = verbs.get(e.verb), A = g.node.get(e.from).label, B = g.node.get(e.to).label
        return v ? v.reads.replace('{from}', A).replace('{to}', B) : `${A} ${e.verb} ${B}`
    }
    const lines = [], nodes = [], kinds = new Set()
    for (const { row } of used) for (const x of row) {
        if (!x.parent || !pos.has(x.parent)) continue
        const a = pos.get(x.parent), b = pos.get(x.id)
        lines.push(`<line class="g-edge${x.parent === ref ? ' strong' : ''}" x1="${a.x.toFixed(1)}" y1="${a.y}" x2="${b.x.toFixed(1)}" y2="${b.y}"><title>${esc(sentence(x.parent, x.id))}</title></line>`)
    }
    for (const { row } of used) for (const x of row) {
        const n = g.node.get(x.id), k = KIND[n.type] || 'place', p = pos.get(x.id), focus = x.id === ref
        kinds.add(k)
        const room = Math.floor((W / p.cols - 10) / (focus ? 8.6 : 7.4))
        const shape = ROUND.has(k)
            ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y}" r="${focus ? 13 : 8}"/>`
            : `<rect x="${(p.x - (focus ? 11 : 7)).toFixed(1)}" y="${p.y - (focus ? 11 : 7)}" width="${focus ? 22 : 14}" height="${focus ? 22 : 14}" rx="2"/>`
        const dy = focus ? 30 : 24
        const s = sub(n)
        const body = `<title>${esc(n.label)}${focus ? '' : ': ' + esc(sentence(x.parent, x.id))}</title>${shape}<text x="${p.x.toFixed(1)}" y="${p.y + dy}" text-anchor="middle"${focus ? ' class="focus-label"' : ''}>${esc(cut(n.label, room))}</text>${s ? `<text class="sub" x="${p.x.toFixed(1)}" y="${p.y + dy + 14}" text-anchor="middle">${esc(cut(s, room + 2))}</text>` : ''}`
        const link = !focus && href(x.id)
        const g1 = `<g class="g-node n-${k}${focus ? ' focus' : ''}" data-id="${esc(x.id)}">${body}</g>`
        nodes.push(link ? `<a href="${esc(link)}">${g1}</a>` : g1)
    }
    const label = `${g.node.get(ref).label} and its neighbours in the newsroom's graph`
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${lines.join('')}${nodes.join('')}</svg>`
    const shown = used.reduce((s, x) => s + x.row.length, 0) - 1
    const more = Object.values(r.more).reduce((s, x) => s + x, 0)
    return { svg, kinds: [...kinds], shown, more }
}
