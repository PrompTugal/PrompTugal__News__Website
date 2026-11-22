// from-org.mjs: turns holacracy.d's org-chart.json into a carto-map/1 structure map of account D (a script, no model).
// holacracy.d keeps the record; I only draw from it. Account B is reported, not seen, drawn as a dashed box.
// usage: node board/team/cartographer.d/tools/from-org.mjs   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const O = JSON.parse(fs.readFileSync('board/team/holacracy.d/org-chart.json', 'utf8'))
const clean = s => String(s || '').replace(/@PrompTugal\.dinis|@AgentiCCells\.dinis/g, '').replace(/@/g, ' (') + (/@/.test(String(s || '')) ? ')' : '')
const nodes = O.agents_account_d.map(a => ({
  id: a.id, label: a.id.replace(/@(\w+)/, ' ($1)'), type: 'role', circle: a.circle, parent: a.parent || null, state: String(a.state || ''),
  proposed: /central/.test(a.circle) && a.id !== 'maestro.d',   // holacracy.d: the central circle's roles are proposed, not ratified
  relayed: ['twin', 'level', 'name_note', 'conductor'].some(k => /relayed/i.test(String(a[k] || ''))),
  conductor: /conductor\.d \(SovereignWebsite\)/.test(String(a.conductor || '')) && a.parent !== 'conductor.d@SovereignWebsite' ? 'conductor.d@SovereignWebsite' : null,
  source: 'org', evidence: `purpose: ${a.purpose || 'not written'}; model ${a.model}${a.model !== a.configured ? ` (configured ${a.configured})` : ''}; state seen ${a.state_seen || O.generated}`
}))
// a role's id may carry an email-shaped suffix: only the short name is shown
for (const n of nodes) n.id = n.id
const out = {
  format: 'carto-map/1', id: 'org-chart-account-d', kind: 'structure', status: 'draft', title: 'Who started whom: the agents of account D',
  made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  for: 'holacracy.d keeps the record; this is a picture of it',
  sources_read: { org: `board/team/holacracy.d/org-chart.json (generated ${O.generated}), read 22 Nov 2026; states are as holacracy.d last read them, not refreshed by me` },
  nodes, links: [...nodes.filter(n => n.parent).map(n => ({ from: n.parent, to: n.id, type: 'started', source: 'org' })), ...nodes.filter(n => n.conductor).map(n => ({ from: n.conductor, to: n.id, type: 'conducts', source: 'org' }))],
  account_b: String(O.account_b.status).slice(0, 360),
  notes: ['The central circle\'s roles are shown as proposed, not ratified, as holacracy.d records them.', 'Relayed means holacracy.d marks the role, its twin, its level or its conductor as relayed (heard from another session, not from Dinis in this one); drawn with a blue bar, a different mark from proposed.', 'A dotted line is a second link, conducts, for roles whose conductor differs from the role that started them.', 'Account B is reported, not seen.']
}
fs.writeFileSync('board/team/cartographer.d/maps/org-chart-account-d.structure.json', JSON.stringify(out, null, 1) + '\n')
console.log('roles', nodes.length)
