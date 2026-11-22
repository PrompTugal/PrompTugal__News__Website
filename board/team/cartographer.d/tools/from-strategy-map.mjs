// from-strategy-map.mjs: turns one of strategy.d's map.json files into a carto-map/1 file (a script, no model).
// usage: node board/team/cartographer.d/tools/from-strategy-map.mjs <folder-name> <id>   e.g. 2026-11-22-the-estate the-estate
// Each user becomes a need at the top (its own text, or the text of sherpa.d's needs it names); the user's direct links become the need's links.
// strategy.d's players (landscape groups) become player nodes; positions are strategy.d's, drawn as given. cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const [folder, id] = process.argv.slice(2)
const dirp = `board/team/strategy.d/maps/${folder}`
const S = JSON.parse(fs.readFileSync(`${dirp}/map.json`, 'utf8'))
const sh = JSON.parse(fs.readFileSync('board/team/sherpa.d/needs/needs.json', 'utf8')).needs
const byLandscape = Object.fromEntries(sh.filter(n => n.landscape_id).map(n => [n.landscape_id, n]))
const userIds = new Set(S.users.map(u => u.id))
const compIds = new Set(S.components.map(c => c.id))
const needText = u => u.need || (u.needs || []).map(n => byLandscape[n]?.need || n).join('; ') || u.label
const trunc = t => t.length > 72 ? t.slice(0, 69) + '...' : t
const nodes = [], links = []
S.users.forEach((u, i) => {
  nodes.push({ id: 'need-' + u.id, label: trunc(needText(u)), type: 'need', visibility: i % 2 ? 0.92 : 1.0, evolution: Math.round((0.12 + i * 0.8 / Math.max(1, S.users.length - 1)) * 100) / 100, hypothesis: true, source: 'strategy', evidence: `${u.label}; ${u.basis || 'basis in strategy.d\'s map.json'}` })
  links.push({ from: 'need-' + u.id, to: 'need-' + u.id, type: 'has', source: 'strategy' })
})
for (const c of S.components) nodes.push({ id: c.id, label: c.label, type: 'component', visibility: c.visibility, evolution: c.evolution, source: 'strategy', evidence: c.evidence })
const lk = []
for (const [a, b] of S.links) {
  if (userIds.has(a)) { if (compIds.has(b)) lk.push({ from: 'need-' + a, to: b, type: 'needs', source: 'strategy' }) }
  else if (compIds.has(a) && compIds.has(b)) lk.push({ from: a, to: b, type: 'needs', source: 'strategy' })
}
const out = {
  format: 'carto-map/1', id, kind: 'wardley', status: 'draft', title: S.title, version: S.version,
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'strategy.d decides what the map means; positions are strategy.d\'s judgement, drawn as given',
  sources_read: { strategy: `${dirp}/map.json v${S.version}, drawn ${S.drawn}, read 22 Nov 2026 (components, positions, evidence, links, users)`, sherpa: 'board/team/sherpa.d/needs/needs.json where a user\'s needs are named there' },
  axes: { y: 'visibility to the user (1 = the user sees it)', x: 'evolution: genesis 0, custom 0.25, product 0.5, commodity 0.75 to 1' },
  users: S.users.map(u => ({ id: u.id, label: u.label, source: 'strategy' })),
  nodes: [...nodes], links: lk,
  moves: (S.movements || []).filter(m => compIds.has(m.id)).map(m => ({ node: m.id, to: m.to_evolution, why: m.why || '', source: 'strategy', kind: 'strategy.d\'s movement' })),
  notes: ['Positions are strategy.d\'s judgement, drawn as given; I have moved none. strategy.d decides what the map means.', 'One need per user, at the top, from strategy.d\'s users; sherpa.d\'s needs are used where the user names them.']
}
// players (groups of competitors on a component): drawn as player nodes beside the component they offer
for (const p of S.players || []) {
  const on = S.components.find(c => c.id === p.on)
  if (!on) continue
  const pid = 'player-' + p.group.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)
  out.nodes.push({ id: pid, label: p.group.replace(/\s*\(.*$/, '') + ' (players)', player: p.group, type: 'player', visibility: Math.max(0.03, Math.round((on.visibility - 0.04) * 100) / 100), evolution: p.evolution, source: 'strategy', evidence: p.note })
  out.links.push({ from: p.on, to: pid, type: 'offered-by', source: 'strategy' })
}
// compact: a need node linking to itself was only a marker
out.links = out.links.filter(l => l.from !== l.to)
fs.writeFileSync(`board/team/cartographer.d/maps/${id}.wardley.json`, JSON.stringify(out, null, 1) + '\n')
console.log(id, 'nodes', out.nodes.length, 'links', out.links.length, 'moves', out.moves.length)
