// from-strategy.mjs: turns strategy.d's map.json and sherpa.d's needs.json into a carto-map/1 file (a script, no model).
// usage: node board/team/cartographer.d/tools/from-strategy.mjs   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const S = JSON.parse(fs.readFileSync('board/team/strategy.d/maps/2026-11-22-decision-making/map.json', 'utf8'))
const N = JSON.parse(fs.readFileSync('board/team/sherpa.d/needs/needs.json', 'utf8')).needs
const want = ['n-decide-one-place', 'n-decide-come-back', 'n-know-it-landed', 'n-agent-verifiable-answer', 'n-agent-not-blocked']
const needs = N.filter(n => want.includes(n.id))
const pos = { 'n-decide-one-place': 0.31, 'n-decide-come-back': 0.18, 'n-know-it-landed': 0.44, 'n-agent-verifiable-answer': 0.6, 'n-agent-not-blocked': 0.78 }
const serves = { // my proposals, marked as such in each link's source
  'n-decide-one-place': ['decision-page', 'context-brief', 'playable-brief'],
  'n-decide-come-back': ['playable-brief', 'device-key'],
  'n-know-it-landed': ['decision-log', 'inbox-lanes'],
  'n-agent-verifiable-answer': ['chain-check', 'agent-keys'],
  'n-agent-not-blocked': ['inbox-lanes', 'context-brief'] }
const out = {
  format: 'carto-map/1', id: 'decision-making', kind: 'wardley', status: 'draft', title: S.title, version: '0.2.0',
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'strategy.d decides what the map means; the needs at the top are sherpa.d\'s (hypotheses marked)',
  sources_read: {
    strategy: 'board/team/strategy.d/maps/2026-11-22-decision-making/map.json v' + S.version + ', drawn ' + S.drawn + ', read 22 Nov 2026 (its components, positions, evidence and links)',
    sherpa: 'board/team/sherpa.d/needs/needs.json, read 22 Nov 2026 (the user needs; each carries its own source and hypothesis flag)',
    cartographer: 'cartographer.d\'s own proposal: which component serves which need (sherpa.d\'s serves_via was empty); for strategy.d and sherpa.d to correct'
  },
  axes: { y: 'visibility to the user (1 = the user sees it)', x: 'evolution: genesis 0, custom 0.25, product 0.5, commodity 0.75 to 1' },
  users: S.users.map(u => ({ id: u.id, label: u.label, source: 'strategy' })),
  nodes: [
    ...needs.map(n => ({ id: n.id, label: n.need.length > 70 ? n.need.slice(0, 67) + '...' : n.need, type: 'need', visibility: 1.0, evolution: pos[n.id], hypothesis: n.hypothesis, source: 'sherpa', evidence: `${n.user_name}; ${n.hypothesis ? 'a hypothesis' : 'his own words'}; ${n.source}` })),
    ...S.users.filter(u => !['dinis', 'agent'].includes(u.id)).map(u => ({ id: 'need-' + u.id, label: (u.need || u.label).slice(0, 72), type: 'need', visibility: 1.0, evolution: 0.92, source: 'strategy', evidence: u.label + '; strategy.d\'s user, added in its v' + S.version })),
    ...S.components.map(c => ({ id: c.id, label: c.label, type: c.id === 'good-decisions' ? 'goal' : (c.evolution < 0.2 ? 'component' : 'component'), visibility: c.id === 'good-decisions' ? 0.9 : c.visibility, evolution: c.evolution, source: 'strategy', evidence: c.evidence }))
  ],
  links: [
    ...needs.map(n => ({ from: n.user === 'dinis' ? 'dinis' : 'agent', to: n.id, type: 'has', source: 'sherpa' })),
    ...needs.flatMap(n => serves[n.id].map(t => ({ from: n.id, to: t, type: 'needs', source: 'cartographer' }))),
    ...S.links.filter(([a, b]) => !['dinis', 'agent'].includes(a) && S.users.some(u => u.id === a)).map(([a, b]) => ({ from: 'need-' + a, to: b, type: 'needs', source: 'strategy' })),
    ...S.links.filter(([a]) => !S.users.some(u => u.id === a)).map(([a, b]) => ({ from: a, to: b, type: 'needs', source: 'strategy' }))
  ],
  moves: (S.movements || []).filter(m => m.component || m.id).map(m => ({ node: m.component || m.id, to: m.to_evolution ?? m.to, why: m.why || m.text || '', source: 'strategy', kind: 'strategy.d\'s movement' })),
  notes: ['Positions are strategy.d\'s judgement, drawn as given, except the shared goal, lowered from 0.97 to 0.9 so it does not sit on the needs. strategy.d decides what the map means.',
    'The links from needs to components are mine (source: cartographer) because sherpa.d left serves_via empty.',
    'strategy.d\'s inertia and pipelines sections are in its map.json and are not redrawn here.']
}
fs.writeFileSync('board/team/cartographer.d/maps/decision-making.wardley.json', JSON.stringify(out, null, 1) + '\n')
console.log('nodes', out.nodes.length, 'links', out.links.length, 'moves', out.moves.length)
