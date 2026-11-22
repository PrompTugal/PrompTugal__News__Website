// from-landscape.mjs: turns landscape.d's rows.json (landscape-rows/1) into a carto-map/1 landscape map (a script, no model).
// usage: node board/team/cartographer.d/tools/from-landscape.mjs [<area>]   (default sovereign-website)   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const area = process.argv[2] || 'sovereign-website'
const R = JSON.parse(fs.readFileSync(`board/team/landscape.d/landscapes/${area}/rows.json`, 'utf8'))
// my reading of where each group stands (visibility to a small-business owner; evolution); not landscape.d's, not a measurement
const group = (id, ring) => ring === 4 ? 'host' : /infomaniak|ionos|jimdo|hostinger|framer|wix|squarespace|webflow/.test(id) ? 'builder' : /sovereign-website|-us$|-us-/.test(id) ? 'us' : /10web|durable/.test(id) ? 'ai-wp' : /saldia|lovable|bolt-boltnew|v0-by/.test(id) ? 'ai-closed' : /hugo|jekyll|eleventy|astro|zola/.test(id) ? 'engine' : /wordpress|ghost/.test(id) ? 'cms' : 'ai-open'
const base = { builder: [0.8, 0.72], 'ai-closed': [0.84, 0.36], 'ai-wp': [0.7, 0.5], engine: [0.34, 0.8], cms: [0.5, 0.78], 'ai-open': [0.62, 0.2], host: [0.2, 0.86], us: [0.5, 0.3] }
const seen = {}
const needs = R.proposed_needs
const needNodes = needs.map((n, i) => ({ id: n.id, label: (n.text || n.id).replace(/ and be able to move it.*/, ' and move it freely').slice(0, 80), type: 'need', visibility: 1.0, evolution: [0.18, 0.4, 0.62, 0.84][i % 4], hypothesis: true, source: 'landscape', evidence: 'proposed by landscape.d, marked as its own and not sherpa.d\'s' }))
const nodes = [...needNodes], links = []
for (const p of R.rows) {
  const g = group(p.id, p.ring), k = (seen[g] = (seen[g] || 0) + 1) - 1
  const [v, e] = base[g]
  nodes.push({ id: p.id, label: p.name, player: p.name, type: 'component', ring: p.ring, group: g, visibility: Math.round((v + 0.04 - k * 0.05) * 100) / 100, evolution: Math.round(Math.min(0.97, Math.max(0.03, e + ((k * 7) % 5 - 2) * 0.035)) * 100) / 100, flagged: p.flagged, source: 'landscape', evidence: `${/webflow/.test(p.id) ? 'UNREAD: every Webflow page failed to load; its band and position come from general knowledge, not from landscape.d\'s reading. ' : ''}${/dyad/.test(p.id) ? 'Open only in part (Apache 2.0 outside src/pro, which is under the Functional Source License). ' : ''}${/totalum/.test(p.id) ? 'Totalum\'s open builder hosts the generated apps itself. ' : ''}${p.what} Price: ${p.price_line}. ${p.source_url} (read ${p.date_read})${p.flagged ? '; flagged for re-read by landscape.d' : ''}` })
  for (const n of p.serves_needs) links.push({ from: n, to: p.id, type: 'served-by', source: 'landscape' })
  for (const n of p.lacks_needs) links.push({ from: n, to: p.id, type: 'lacks', source: 'landscape' })
}
// layout: each group has a band (visibility) and a stretch of the axis (evolution); players sit on a grid inside it, so labels never collide.
// A drawing aid: where a group sits is my reading; where a player sits inside its group means nothing.
const band = { 'ai-closed': [0.82, 0.58, 0.12, 0.42, 2], 'ai-wp': [0.82, 0.58, 0.12, 0.42, 2], builder: [0.86, 0.5, 0.58, 0.82, 2], 'ai-open': [0.56, 0.3, 0.04, 0.34, 2], us: [0.46, 0.46, 0.38, 0.38, 1], cms: [0.5, 0.4, 0.44, 0.66, 2], engine: [0.36, 0.14, 0.46, 0.8, 3], host: [0.1, 0.03, 0.6, 0.9, 3] }
const members = {}
for (const n of nodes.filter(n => n.type === 'component')) (members[n.group] ||= []).push(n)
members['ai-closed'] = [...(members['ai-closed'] || []), ...(members['ai-wp'] || [])]; delete members['ai-wp']
for (const [g, list] of Object.entries(members)) {
  const [v0, v1, e0, e1, cols] = band[g] || band['ai-open'], rows = Math.ceil(list.length / cols)
  list.forEach((n, k) => {
    const c = k % cols, r = Math.floor(k / cols)
    n.evolution = Math.round((cols === 1 ? e0 : e0 + c * (e1 - e0) / (cols - 1)) * 1000) / 1000
    n.visibility = Math.round((rows === 1 ? v0 : v0 - r * (v0 - v1) / (rows - 1)) * 1000) / 1000
  })
}
// the white space, computed from the rows: a need set that no player serves in full
const key = re => needs.find(n => re.test(n.id))?.id
const trio = [key(/no-technical/), key(/own/), key(/know/)].filter(Boolean)
const full = R.rows.filter(p => trio.every(n => p.serves_needs.includes(n)))
const best = R.rows.map(p => [p.name, trio.filter(n => p.serves_needs.includes(n)).length]).sort((a, b) => b[1] - a[1]).filter(x => x[1] === Math.max(...R.rows.map(p => trio.filter(n => p.serves_needs.includes(n)).length))).map(x => x[0])
if (trio.length === 3 && !full.length) nodes.push({ id: 'gap-all-three', label: 'No technical skill, own it and move it, know who holds it: no player found serving all three', type: 'gap', visibility: 0.97, evolution: 0.06, source: 'cartographer', evidence: 'Computed from rows.json (' + R.rows.length + ' players, rings ' + (R.rings_read || []).join(', ') + '): none lists all of ' + trio.join(', ') + ' as served. Closest: ' + best.join(', ') + ' (partial). Absence in the pages read, not proof; flagged rows are low confidence; "lacks" means no path found on the pages read' })

const out = {
  format: 'carto-map/1', id: `landscape-${area}`, kind: 'wardley', status: 'draft', title: `Landscape: ${area}, rings ${(R.rings_read || []).join(', ')}`, version: '0.1.0',
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
  notes: ['Which band a player sits in (closed builders, closed AI builders, static engines, CMS, open AI builders, hosts) is my reading; where it sits inside its band is only a drawing aid and means nothing; the facts behind each player are landscape.d\'s, with URL and date.',
    'The needs are landscape.d\'s proposals, not sherpa.d\'s.',
    'Rows flagged by landscape.d are drawn faint with a dashed ring: low confidence (Webflow could not be read at all; Hetzner\'s price has an ambiguous setup fee; Cloudflare\'s headquarters are inferred; some re-reads).']
}
fs.writeFileSync(`board/team/cartographer.d/maps/landscape-${area}.wardley.json`, JSON.stringify(out, null, 1) + '\n')
console.log('nodes', nodes.length, 'links', links.length, 'needs', needs.map(n => n.id).join(','))
