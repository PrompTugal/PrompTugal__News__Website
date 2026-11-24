// team-index.mjs: writes team-index.json (owner.feed/v1 shape, plus holacracy.d's extra fields) from org-chart.json.
// A script, no model. holacracy.d@AgentiCCells.dinis. usage: node board/team/holacracy.d/tools/team-index.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const chart = JSON.parse(fs.readFileSync(path.join(dir, 'org-chart.json'), 'utf8'))
const A = chart.agents_account_d
const circle = id => chart.circles.find(c => c.id === id || c.name === id)
const slug = a => a.name.replace(/ \(.*$/, '')                       // d.studio
const dec = JSON.parse(fs.readFileSync(path.join(dir, 'decisions.json'), 'utf8')).decisions
const idOf = a => { const c = ((a.name.match(/\((.*)\)/) || [])[1] || '').replace(/\./g, '-'); return slug(a) + (c ? '.' + c : '') }   // d.studio.account-d
const status = a => {
  const s = (a.state || '').toLowerCase()
  if (/waiting|blocked|needs input/.test(s)) return 'waiting'
  if (/review/.test(s)) return 'waiting'
  if (/working/.test(s)) return 'working'
  if (/completed|done/.test(s)) return 'done'
  return 'idle'
}
const waitingFor = a => {
  const s = a.state || ''
  if (/waiting on Dinis/i.test(s)) return s.replace(/^waiting on Dinis:?\s*/i, 'Dinis: ')
  if (/review ready/i.test(s)) return 'review'
  return undefined
}
const kindOf = a => {
  if (a.id === 'maestro.d') return 'maestro'
  if (['decisions.d', 'security.d'].includes(a.id)) return 'signer'
  return 'agent'
}
const LEAD = { PrompTugal: 'd.conductor (PrompTugal)', SovereignWebsite: 'd.conductor (SovereignWebsite)', StreamingWebsite: 'd.conductor (SovereignWebsite)', AgentiCCells: 'd.conductor (AgentiCCells)', 'Cell Email': 'd.conductor (AgentiCCells)', central: 'd.helm (account-d)', 'sgit.ai': 'Dinis', anchor: 'Dinis' }
const leadOf = a => LEAD[String(a.circle || '').replace(/ \(.*$/, '')] || null
const ids = Object.fromEntries(A.map(a => [a.id, idOf(a)]))
const byName = Object.fromEntries(A.map(a => [a.name, ids[a.id]]))
const MON = { Nov: '11' }
// ISO with seconds from "2026-11-23T16:51:43Z", "2026-11-23T05:20Z", "23 Nov 17:10Z (...)" or "13:26Z 22 Nov (...)"
const iso = s => {
  s = String(s || '')
  let m = s.match(/^(\d{4}-\d\d-\d\d)T(\d\d:\d\d)(:\d\d)?Z/)
  if (m) return `${m[1]}T${m[2]}${m[3] || ':00'}Z`
  m = s.match(/(\d{1,2}) Nov (\d\d:\d\d)Z/) || (s.match(/(\d\d:\d\d)Z (\d{1,2}) Nov/) || []).slice().reverse().concat().slice(0, 3)
  const m2 = s.match(/(\d{1,2}) Nov (\d\d:\d\d)Z/), m3 = s.match(/(\d\d:\d\d)Z (\d{1,2}) Nov/)
  if (m2) return `2026-11-${m2[1].padStart(2, '0')}T${m2[2]}:00Z`
  if (m3) return `2026-11-${m3[2].padStart(2, '0')}T${m3[1]}:00Z`
  return undefined
}
const generated = iso(chart.generated) || new Date().toISOString().slice(0, 19) + 'Z'
const repoOf = a => {
  if (a.home) return { repo: undefined }
  const r = String(a.repo || '')
  if (/not recorded|to be requested|^$/.test(r)) return { repo: null }
  if (/\(assumed\)/.test(r)) return { repo: r.replace(/\s*\(assumed\)/, ''), assumed: true }
  return { repo: r }
}
const agents = A.map(a => {
  const c = String(a.circle || '').replace(/ \(.*$/, '')
  const row = {
    id: ids[a.id], name: a.name.replace(/ \(account-d\)$/, ''), account: 'D', kind: kindOf(a), status: status(a),
    doing: a.state, circle: c, lead: byName[leadOf(a)] || undefined, owner: leadOf(a) === 'Dinis' ? 'Dinis' : undefined,
    parent: a.parent ? ids[a.parent] : undefined,
    waitingFor: waitingFor(a), session: a.session, model: a.model === 'not fetched' ? undefined : a.model,
    home: a.home || undefined, area: a.area || undefined, ...repoOf(a), updated: iso(a.last_ran), as_of: iso(a.state_seen) || generated,
    relayed: Boolean(a.name_note || a.twin_note || a.level) || undefined,
    proposed: /proposed/.test(a.written_by || '') || undefined
  }
  if (a.home) row.homeUrl = 'https://github.com/' + a.home
  return Object.fromEntries(Object.entries(row).filter(([k, v]) => v !== undefined && (v !== null || k === 'repo')))
})
// sub-agents named by d.helm's roles (relayed): inside d.studio's run, not sessions
const studio = agents.find(a => a.id.startsWith('d.studio'))
const subs = studio ? ['studio.director', 'studio.storyboard', 'studio.presenters'].map(n => ({
  id: `${n}.d`, name: n, account: 'D', kind: 'subagent', parent: studio.id, status: 'unknown',
  doing: 'a sub-agent inside d.studio\'s run (named in helm.d\'s role file, relayed); not a session of its own', relayed: true, as_of: generated })) : []
const feed = {
  kind: 'owner.feed/v1',
  made: new Date().toISOString().slice(0, 16) + ':00Z',
  by: 'd.holacracy (account-d)',
  twin: false,
  about: 'The team index of account D, from the governance record (org-chart.json), drawn by a script. Account D is seen; the other accounts are reported, not seen. Status and times are as read at the date in each row; they are not live.',
  extra_fields: ['circle', 'lead', 'owner', 'session', 'model', 'home', 'homeUrl', 'repo', 'assumed', 'area', 'as_of', 'relayed', 'proposed', 'routedTo'],
  agents: [...agents, ...subs],
  reported_not_seen: [
    { id: 'b.maestro', name: 'b.maestro (account-b)', account: 'B', kind: 'maestro', session: 'https://claude.ai/code/session_01Kw9UwEbwyWMbZ7yCr81Dq9', source: 'board/team/maestro.b/status.json', as_of: '2026-11-21T22:58:00Z' },
    { id: 'b.conductor@PrompTugal', name: 'conductor.b@PrompTugal.dinis', account: 'B', kind: 'agent', parent: 'b.maestro', session: 'https://claude.ai/code/session_01Kw9UwFbo4iCoohkgnZar9k', source: 'board/team/conductor.b/status.json', as_of: '2026-11-21T22:30:00Z' },
    { id: 'b.decisions', name: 'b.decisions (SovereignWebsite)', account: 'B', kind: 'signer', session: 'https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ', source: 'board/team/maestro.b/decisions/2026-11-23-account-prefix-first.md', as_of: '2026-11-23T13:00:00Z' }
  ],
  sites: [], videos: [], briefs: [], slides: [],
  decisions: dec.filter(d => d.status === 'open' || /^open/.test(d.status || '') || /open for/.test(d.status || '')).map(d => ({
    id: 'holacracy.' + d.id, title: d.title, detail: d.tension, options: d.options.map(o => o.k + '. ' + o.label), recommended: d.rec,
    from: ids['holacracy.d'], at: generated, as_of: generated, evidence: ['board/team/holacracy.d/' + d.source], routedTo: ids['decisions.d'] }))
}
fs.writeFileSync(path.join(dir, 'team-index.json'), JSON.stringify(feed, null, 1) + '\n')
console.log('team-index.json:', feed.agents.length, 'agents')
