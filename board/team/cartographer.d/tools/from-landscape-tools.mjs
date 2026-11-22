// from-landscape-tools.mjs: draws landscape.d's Wardley-tools rows as a carto-map/1 landscape map (a script, no model).
// usage: node board/team/cartographer.d/tools/from-landscape-tools.mjs   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const R = JSON.parse(fs.readFileSync('board/team/landscape.d/landscapes/wardley-tools/rows.json', 'utf8'))
const SH = JSON.parse(fs.readFileSync('board/team/sherpa.d/needs/needs.json', 'utf8')).needs
const pick = ['n-wm-explain-to-others', 'n-wm-try-my-own', 'n-wm-trust', 'n-wm-see-history'].map(id => SH.find(n => n.id === id)).filter(Boolean)
// my reading of the group a tool belongs to: [visibility band, evolution range, columns]
const grp = id => /mapscript|mapkeep|sharpcloud|mapaware/.test(id) ? 'hosted' : /miro|excalidraw|glamorous/.test(id) ? 'general' : /create-maps/.test(id) ? 'ai' : /map--macos/.test(id) ? 'native' : 'text'
const band = { text: [0.7, 0.3, 0.1, 0.36, 2], hosted: [0.88, 0.7, 0.58, 0.8, 2], general: [0.55, 0.4, 0.72, 0.92, 1], ai: [0.84, 0.84, 0.1, 0.1, 1], native: [0.25, 0.25, 0.6, 0.6, 1] }
const members = {}
for (const p of R.rows) (members[grp(p.id)] ||= []).push(p)
const nodes = pick.map((n, i) => ({ id: n.id, label: n.need.slice(0, 70), type: 'need', visibility: i % 2 ? 0.93 : 1.0, evolution: [0.1, 0.35, 0.6, 0.85][i], hypothesis: n.hypothesis, source: 'sherpa', evidence: n.source }))
for (const [g, list] of Object.entries(members)) {
  const [v0, v1, e0, e1, cols] = band[g], rows = Math.ceil(list.length / cols)
  list.forEach((p, k) => nodes.push({ id: p.id, label: p.name, player: p.name, type: 'component', group: g, visibility: Math.round((rows === 1 ? v0 : v0 - Math.floor(k / cols) * (v0 - v1) / (rows - 1)) * 1000) / 1000, evolution: Math.round((cols === 1 ? e0 : e0 + (k % cols) * (e1 - e0)) * 1000) / 1000, flagged: p.flagged, source: 'landscape', evidence: `${p.what} Kind: ${p.kind}. Openness: ${p.openness}. Status: ${p.status}. ${p.source_url} (read ${p.date_read})` }))
}
nodes.push({ id: 'gap-history-and-sources', label: 'Dated history played over time, and a source on every node: no page read mentions either (to verify)', type: 'gap', visibility: 0.78, evolution: 0.4, source: 'cartographer', evidence: 'landscape.d finding wt-g4: possible gap, to verify before any claim; its gaps wt-g5: most commit dates are not visible, three sites were unreachable, the AI map creator was read as a listing only. Not a claim that nobody does this' })
const out = {
  format: 'carto-map/1', id: 'landscape-wardley-tools', kind: 'wardley', status: 'draft', title: 'Landscape: Wardley map tools, now and before', version: '0.1.0',
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'strategy.d and landscape.d (what it means); the tools are landscape.d\'s findings, the bands are my reading',
  sources_read: { landscape: `board/team/landscape.d/landscapes/wardley-tools/rows.json (landscape-rows/1, made ${R.made}), read 22 Nov 2026; the facts and URLs are in landscape.json beside it`, sherpa: 'board/team/sherpa.d/needs/needs.json, the Wardley site needs shown at the top', cartographer: 'cartographer.d\'s reading of each group\'s band; where a tool sits inside its band means nothing' },
  draw: { links: 'none' },
  axes: { y: 'visibility to a map maker (1 = what they see first)', x: 'evolution: genesis 0, custom 0.25, product 0.5, commodity 0.75 to 1' },
  users: [{ id: 'u-mapper', label: 'Someone who wants to make or explain a Wardley map', source: 'sherpa' }],
  nodes, links: [],
  notes: ['Bands: text-first tools (the .owm family and the others, mostly open), hosted collaborative tools (MapScript, Mapkeep, MapAware, SharpCloud: a third-party listing marks three discontinued; no page read says why), general whiteboards and toolkits, a native app, an AI creator.', 'Faint dashed rows are flagged by landscape.d as low confidence.', 'The gap is a reading to verify, not a claim.']
}
fs.writeFileSync('board/team/cartographer.d/maps/landscape-wardley-tools.wardley.json', JSON.stringify(out, null, 1) + '\n')
console.log('nodes', nodes.length)
