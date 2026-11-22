// draw.mjs: draws org-chart.md from org-chart.json (a script, no model). holacracy.d@AgentiCCells.dinis
// usage: node board/team/holacracy.d/tools/draw.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const j = JSON.parse(fs.readFileSync(path.join(dir, 'org-chart.json'), 'utf8'))
const A = j.agents_account_d
const by = Object.fromEntries(A.map(a => [a.id, a]))
const line = a => `${a.name} [${a.model}${a.model !== a.configured ? `, configured ${a.configured}` : ''}] ${a.state}${a.cost != null ? `, $${a.cost.toFixed(2)}` : ''}`
const kids = id => A.filter(a => a.parent === id)
const tree = (id, pre = '') => kids(id).flatMap((k, i, arr) => {
  const last = i === arr.length - 1
  return [pre + (last ? '`-- ' : '|-- ') + line(k), ...tree(k.id, pre + (last ? '    ' : '|   '))]
})
const out = []
out.push('# Org chart of account D', '', `Drawn from org-chart.json (${j.generated}) by holacracy.d@AgentiCCells.dinis. Account D from list_sessions and get_session (status, model, cost, parent); account B reported, not seen.`, '')
out.push('## The parent tree (who started whom)', '', '```', line(by['maestro.d']), ...tree('maestro.d'), '```', '')
out.push('## The circles (who holds what purpose)', '')
for (const c of j.circles) out.push(`- **${c.name}**: lead ${c.lead}; purpose: ${c.purpose ?? 'NOT WRITTEN'}; fillers: ${(c.fillers || []).join(', ') || 'none'}${c.sub ? `; sub-circles: ${c.sub.join(', ')}` : ''}`)
out.push('', '## Roles and fillers (account D)', '', '| Agent | Circle | Parent | Twin | Repository | Wake | Session |', '|---|---|---|---|---|---|---|')
for (const a of A) out.push(`| ${a.name} | ${a.circle} | ${a.parent || '-'} | ${a.twin} | ${a.repo} | ${a.wake} | ${a.session} |`)
out.push('', '## Account B (reported, not seen)', '', j.account_b.status, '', `State: ${j.account_b.state}.`, '')
for (const [m, v] of Object.entries(j.account_b.tree)) {
  out.push(`- ${m}`)
  for (const c of v.conductors) out.push(`  - ${c}`)
  out.push(`  - dormant: ${v.dormant}`)
}
out.push('', '## Also visible on this account', '', j.legacy_visible_on_account_d.note, '')
fs.writeFileSync(path.join(dir, 'org-chart.md'), out.join('\n'))
console.log('org-chart.md written')
