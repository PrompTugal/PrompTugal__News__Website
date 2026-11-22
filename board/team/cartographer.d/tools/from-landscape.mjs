// from-landscape.mjs: turns landscape.d's rows.json (landscape-rows/1) into a carto-map/1 landscape map (a script, no model).
// usage: node board/team/cartographer.d/tools/from-landscape.mjs [<area>]   (default sovereign-website)   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const area = process.argv[2] || 'sovereign-website'
const R = JSON.parse(fs.readFileSync(`board/team/landscape.d/landscapes/${area}/rows.json`, 'utf8'))
// my reading of where each group stands (visibility to a small-business owner; evolution); not landscape.d's, not a measurement
const group = id => /infomaniak|ionos|jimdo|hostinger|framer/.test(id) ? 'builder' : /saldia/.test(id) ? 'ai-closed' : /hugo|jekyll|eleventy|astro|zola/.test(id) ? 'engine' : /wordpress|ghost/.test(id) ? 'cms' : 'ai-open'
const base = { builder: [0.78, 0.72], 'ai-closed': [0.82, 0.38], engine: [0.3, 0.8], cms: [0.5, 0.78], 'ai-open': [0.62, 0.22] }
const seen = {}
const needs = R.proposed_needs
const needNodes = needs.map((n, i) => ({ id: n.id, label: (n.text || n.id).replace(/ and be able to move it.*/, ' and move it freely').slice(0, 80), type: 'need', visibility: 1.0, evolution: [0.18, 0.4, 0.62, 0.84][i % 4], hypothesis: true, source: 'landscape', evidence: 'proposed by landscape.d, marked as its own and not sherpa.d\'s' }))
const nodes = [...needNodes], links = []
for (const p of R.rows) {
  const g = group(p.id), k = (seen[g] = (seen[g] || 0) + 1) - 1
  const [v, e] = base[g]
  nodes.push({ id: p.id, label: p.name, player: p.name, type: 'component', ring: p.ring, group: g, visibility: Math.round((v + 0.04 - k * 0.05) * 100) / 100, evolution: Math.round(Math.min(0.97, Math.max(0.03, e + ((k * 7) % 5 - 2) * 0.035)) * 100) / 100, flagged: p.flagged, source: 'landscape', evidence: `${p.what} Price: ${p.price_line}. ${p.source_url} (read ${p.date_read})${p.flagged ? '; flagged for re-read by landscape.d' : ''}` })
  for (const n of p.serves_needs) links.push({ from: n, to: p.id, type: 'served-by', source: 'landscape' })
  for (const n of p.lacks_needs) links.push({ from: n, to: p.id, type: 'lacks', source: 'landscape' })
}
// the white space: a need that no player found serves in both ways
nodes.push({ id: 'gap-own-it-without-skill', label: 'Own it and move it, with no technical skill (nobody found in rings 1 and 3)', type: 'gap', visibility: 0.92, evolution: 0.08, source: 'cartographer', evidence: 'In rows.json no player serves both pn-own-it-move-it and pn-no-technical-skill: ring 1 builders lack the first, ring 3 tools lack the second. Absence in rings 1 and 3 only; rings 2 and 4 are not yet read, and "lacks" means no export path found on the pages read, not proof none exists' })
const out = {
  format: 'carto-map/1', id: `landscape-${area}`, kind: 'wardley', status: 'draft', title: `Landscape: ${area}, rings ${R.rings_read || '1 and 3'}`, version: '0.1.0',
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'landscape.d and strategy.d (what it means); the players are landscape.d\'s findings, the positions are my reading',
  sources_read: {
    landscape: `board/team/landscape.d/landscapes/${area}/rows.json (landscape-rows/1, made ${R.made}), read 22 Nov 2026; each row's facts and URLs are in landscape.json beside it`,
    cartographer: 'cartographer.d\'s reading: where each group of players stands on visibility and evolution, and the gap. A judgement, not a measurement; strategy.d may move any node with a reason'
  },
  draw: { links: 'none' },
  axes: { y: 'visibility to the user (1 = the user sees it)', x: 'evolution: genesis 0, custom 0.25, product 0.5, commodity 0.75 to 1' },
  users: [{ id: 'u-owner', label: 'A small-business owner who wants a site', source: 'landscape' }],
  nodes, links,
  notes: ['Positions of players are my reading by group (closed builders, closed AI builder, static engines, CMS, open AI builders); the facts behind each player are landscape.d\'s, with URL and date.',
    'The needs are landscape.d\'s proposals, not sherpa.d\'s.',
    'Rings 2 (Wix, Squarespace, Webflow, Lovable, Bolt, v0) and 4 (hosting) are not read yet; the gap may close when they are.']
}
fs.writeFileSync(`board/team/cartographer.d/maps/landscape-${area}.wardley.json`, JSON.stringify(out, null, 1) + '\n')
console.log('nodes', nodes.length, 'links', links.length, 'needs', needs.map(n => n.id).join(','))
