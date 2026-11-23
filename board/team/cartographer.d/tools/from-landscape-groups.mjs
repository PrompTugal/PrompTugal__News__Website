// from-landscape-groups.mjs: draws a landscape whose rows carry a group field (landscape-rows/1 + group) as a carto-map/1 landscape map (a script, no model).
// usage: node board/team/cartographer.d/tools/from-landscape-groups.mjs <area> "<title>" "<what we are>"
// The order of the groups (top to bottom) and the evolution of each are my reading, set below per area; where a player sits inside its group means nothing.
import fs from 'node:fs'
const [area, title, usLabel] = process.argv.slice(2)
const R = JSON.parse(fs.readFileSync(`board/team/landscape.d/landscapes/${area}/rows.json`, 'utf8'))
const reading = {
  riskmandate: { order: ['us', 'agent-identity', 'governance-platform', 'open-source', 'framework'], evo: { us: 0.12, 'agent-identity': 0.58, 'governance-platform': 0.5, 'open-source': 0.64, framework: 0.62 }, vis: { us: 0.9, 'agent-identity': 0.78, 'governance-platform': 0.62, 'open-source': 0.42, framework: 0.22 } },
  'agentic-sales': { order: ['us', 'digital-worker', 'vendor-platform', 'framework', 'services'], evo: { us: 0.12, 'digital-worker': 0.3, 'vendor-platform': 0.62, framework: 0.64, services: 0.76 }, vis: { us: 0.9, 'digital-worker': 0.78, 'vendor-platform': 0.58, framework: 0.34, services: 0.16 } }
}[area]
const label = { 'agent-identity': 'Agent identity', 'governance-platform': 'Governance platforms', 'open-source': 'Open-source tools', framework: 'Frameworks and standards', us: 'Us', 'digital-worker': 'Digital workers', 'vendor-platform': 'Vendor platforms', services: 'Services firms' }
const nodes = []
const by = {}
for (const p of R.rows) (by[p.group] ||= []).push(p)
for (const g of reading.order) {
  const list = by[g] || [], ec = reading.evo[g], v0 = reading.vis[g], cols = list.length > 3 ? 2 : 1
  list.forEach((p, k) => {
    const c = k % cols, r = Math.floor(k / cols)
    nodes.push({ id: p.id, label: g === 'us' ? usLabel : p.name, player: p.name, type: g === 'us' ? 'component' : 'component', group: g, visibility: Math.round((v0 - r * 0.055) * 1000) / 1000, evolution: Math.round(Math.min(0.78, Math.max(0.04, cols === 1 ? ec : ec - 0.12 + c * 0.24)) * 1000) / 1000, flagged: p.flagged, source: 'landscape', evidence: `${p.what} ${p.price_line ? 'Price: ' + p.price_line + '. ' : ''}${p.source_url} (read ${p.date_read})${p.flagged ? '; flagged by landscape.d: a page failed or was not read, low confidence' : ''}` })
  })
}
// group captions
for (const g of reading.order) if (g !== 'us') { const m = nodes.filter(n => n.group === g); const top = Math.max(...m.map(n => n.visibility)) + 0.045; nodes.push({ id: 'cap-' + g, label: label[g] + ':', type: 'caption', visibility: Math.min(0.97, top), evolution: Math.max(0.03, Math.min(...m.map(n => n.evolution)) - 0.02), source: 'cartographer', evidence: 'a heading for the group below it' }) }
const out = {
  format: 'carto-map/1', id: `landscape-${area}`, kind: 'wardley', status: 'draft', title, version: '0.1.0',
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'landscape.d and strategy.d (what it means); the players and facts are landscape.d\'s, the placing is my reading',
  sources_read: { landscape: `board/team/landscape.d/landscapes/${area}/rows.json (landscape-rows/1 with group, made ${R.made}), read 23 Nov 2026; the facts and URLs are in landscape.json beside it`, cartographer: 'cartographer.d\'s reading of each group\'s evolution and where the groups sit; where a player sits inside its group means nothing' },
  draw: { links: 'none' },
  axes: { y: 'visibility to the buyer (1 = what they see first)', x: 'evolution: genesis 0, custom 0.25, product 0.5, commodity 0.75 to 1' },
  users: [{ id: 'u-buyer', label: 'The buyer', source: 'landscape' }],
  nodes, links: [],
  notes: [({ riskmandate: 'Our own row (RiskMandate) is only what riskmandate.ai says of itself; its position is a reading of its pages, not a measure of the product. Its own about page lists what is not yet true: Insurability Index in design, Licence to Operate a template, a small reviewer network, no customers named.', 'agentic-sales': 'Our own row (AgentiCCells) is only what agenticcells.ai says of itself: fixed one-off sizes, none sold yet; the buyer owns the output and brings a Claude plan, GitHub, host and domain. Its position is a reading of those pages, not a measure of the product. The page also admits some agents heard a test stop late, which matters for any reading of its control. Botpress is faint for a hosting fact not found, not for its offer.' })[area], 'landscape.d gives no needs column for this area (the users are not in sherpa.d\'s needs yet), so no needs or gap are drawn.', 'Faint dashed rows are flagged by landscape.d: a page failed or was not read.', 'Groups are landscape.d\'s; their evolution and order are my reading, a judgement, not a measurement.']
}
fs.writeFileSync(`board/team/cartographer.d/maps/landscape-${area}.wardley.json`, JSON.stringify(out, null, 1) + '\n')
console.log(area, 'nodes', nodes.length)
