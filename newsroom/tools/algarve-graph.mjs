// Draws Algarve Evolution's network as a static SVG from data/organisations/algarve-evolution/network.json (the ontologist's
// data): the organisation in the middle, its programmes and events around it, the partner organisations on the outer ring,
// each joined to what it takes part in. Run: node newsroom/tools/algarve-graph.mjs  (writes assets/portugal/algarve-evolution-graph.svg)
import { readFileSync, writeFileSync } from 'node:fs'
const d = JSON.parse(readFileSync('data/organisations/algarve-evolution/network.json', 'utf8'))
const AE = 'organisation:algarve-evolution'
const nice = s => s.replace(/^[a-z]+:/, '').split('-').map(w => ({ ae: 'AE', stp: 'STP', nera: 'NERA', amal: 'AMAL', anje: 'ANJE', adi: 'ADI' }[w] || w[0].toUpperCase() + w.slice(1))).join(' ')
const name = new Map(d.programmes.map(p => [p.id, p.name]))
const SHORT = { 'programme:the-company': 'The Company', 'programme:venture-lab': 'Venture Lab', 'programme:algarve-tech-hub-summit': 'Algarve Tech Hub Summit', 'programme:algarve-digital-innovators': 'Digital Innovators (ADI)', 'event:algarve-digital-innovators-launch-2025': 'ADI launch, Lagos 2025', 'event:algarve-tech-hub-summit-2025': 'Tech Hub Summit 2025', 'event:algarve-tech-hub-summit-2024': 'Tech Hub Summit 2024' }
const label = id => SHORT[id] || name.get(id) || ({ 'organisation:university-of-algarve': 'University of Algarve', 'organisation:algarve-stp': 'Algarve STP', 'organisation:amal': 'AMAL', 'organisation:nera': 'NERA', 'organisation:anje': 'ANJE', 'organisation:junior-achievement-portugal': 'Junior Achievement PT', 'organisation:get-real': 'Get Real', 'company:startup-portugal': 'Startup Portugal', 'organisation:google-developer-group-lagos': 'GDG Lagos', 'event:algarve-startups-at-web-summit-2025': 'Web Summit 2025 (24 startups)', 'event:devfest-lagos-2026': 'DevFest Lagos 2026', 'event:impact-algarve-2024': 'Impact Algarve 2024' }[id]) || nice(id)
const edges = d.edges.filter(e => e.from !== 'role:president' && e.from !== 'role:executive-director' && e.verb !== 'based_in')
const nodes = new Map()
const add = (id, kind) => { if (!nodes.has(id)) nodes.set(id, { id, kind }) }
for (const e of edges) for (const id of [e.from, e.to]) { if (id === AE) continue; const t = id.split(':')[0]; add(id, t === 'programme' ? 'prog' : t === 'event' ? 'event' : 'partner') }
const hub = [...nodes.values()].filter(n => n.kind === 'prog' || (n.kind === 'event' && edges.some(e => e.to === n.id && e.from === AE)))
const outer = [...nodes.values()].filter(n => n.kind === 'partner' || (n.kind === 'event' && !hub.includes(n)))
const W = 1360, H = 900, cx = W / 2, cy = H / 2 + 10
const ring = (list, r, off = -90) => list.forEach((n, i) => { const a = (off + 360 * i / list.length) * Math.PI / 180; n.x = cx + r * Math.cos(a); n.y = cy + r * Math.sin(a); n.a = a })
ring(hub, 225); ring(outer, 400, -80)
const pos = id => id === AE ? { x: cx, y: cy } : nodes.get(id)
const COL = { prog: '#1d6f5f', event: '#b4580f', partner: '#2a5db0' }
const out = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d"><title id="t">Algarve Evolution's network</title><desc id="d">Programmes, events and partners. Sources on the page.</desc><rect width="${W}" height="${H}" fill="#f7f5ef"/><style>text{font-family:system-ui,sans-serif;fill:#1b1b1b}</style>`]
for (const e of edges) { const a = pos(e.from), b = pos(e.to); if (!a || !b) continue; const k = nodes.get(e.from === AE ? e.to : e.from)?.kind; out.push(`<line x1="${a.x.toFixed(0)}" y1="${a.y.toFixed(0)}" x2="${b.x.toFixed(0)}" y2="${b.y.toFixed(0)}" stroke="${COL[k] || '#888'}" stroke-opacity=".38" stroke-width="${e.from === AE || e.to === AE ? 2.4 : 1.5}"/>`) }
for (const n of nodes.values()) {
    const right = Math.cos(n.a) >= 0, outerNode = outer.includes(n), r = outerNode ? 8 : 11
    const flip = { 'programme:grow-algarve-meetup': true, 'programme:algarve-tech-hub-summit': false }[n.id]
    const side = Math.abs(Math.cos(n.a)) > 0.3 || flip !== undefined
    const rt = flip === undefined ? right : flip
    const tx = n.x + (outerNode || side ? (rt ? 15 : -15) : 0), ty = n.y + (outerNode || side ? 5 : (Math.sin(n.a) > 0 ? 28 : -18))
    out.push(`<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${r}" fill="${COL[n.kind]}"/><text x="${tx.toFixed(0)}" y="${ty.toFixed(0)}" font-size="${outerNode ? 14 : 13.5}" text-anchor="${outerNode || side ? (rt ? 'start' : 'end') : 'middle'}">${label(n.id)}</text>`)
}
out.push(`<circle cx="${cx}" cy="${cy}" r="58" fill="#1b1b1b"/><text x="${cx}" y="${cy - 4}" font-size="16" font-weight="700" text-anchor="middle" style="fill:#fff">Algarve</text><text x="${cx}" y="${cy + 16}" font-size="16" font-weight="700" text-anchor="middle" style="fill:#fff">Evolution</text>`)
out.push(`<g font-size="13"><circle cx="30" cy="${H - 70}" r="7" fill="${COL.prog}"/><text x="44" y="${H - 65}">programme</text><circle cx="140" cy="${H - 70}" r="7" fill="${COL.event}"/><text x="154" y="${H - 65}">event</text><circle cx="220" cy="${H - 70}" r="7" fill="${COL.partner}"/><text x="234" y="${H - 65}">partner</text></g>`)
out.push(`<text x="30" y="${H - 28}" font-size="12" style="fill:#555">PrompTugal.news, from network.json, read 6 Nov 2026. Not complete.</text></svg>`)
writeFileSync('assets/portugal/algarve-evolution-graph.svg', out.join('\n') + '\n')
console.log(nodes.size, 'nodes', edges.length, 'edges')
