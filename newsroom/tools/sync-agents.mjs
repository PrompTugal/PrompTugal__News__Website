#!/usr/bin/env node
// Snapshot of the cl-6 agents for /newsroom/agents/ (the conductor's brief of 26 Nov 2026, Dinis's word): one card per session of the conductor's
// board/proposals/2026-11-26-sessions.json, read raw from each agent's home (site/factory/dinis-cruz/account-f/agent.json and now.md) and written
// to assets/newsroom/agents-snapshot.json, which the build reads. Run before a release:  node newsroom/tools/sync-agents.mjs
// Public repositories, no token, no session token or key is read or kept; text is cut short and only ever printed escaped.
// A home that does not answer keeps its previous card, marked "not read". cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'assets/newsroom/agents-snapshot.json')
const RAW = 'https://raw.githubusercontent.com/'
const CONDUCTOR = 'PrompTugal/PrompTugal__Agent__Conductor'
const BRANCH = 'dev', F = 'site/factory/dinis-cruz/account-f/'
const noMail = s => s.replace(/[^\s@()<>"']*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, (m, d) => /\.dinis$/i.test(d) ? m : '[address]')   // an outlet's mailbox is never copied here (CLAUDE.md, Contacts)
const cut = (s, n) => { s = noMail(String(s ?? '')).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s }
const get = async u => { try { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); return r.ok ? await r.text() : null } catch { return null } }
const json = async u => { const t = await get(u); try { return t ? JSON.parse(t) : null } catch { return null } }

// what an agent waits on: a string or {what, who, since}; Dinis's are the ones that name him
const waits = a => (Array.isArray(a) ? a : []).map(x => typeof x === 'string' ? { what: cut(x, 400), who: /^Dinis\b/.test(x) ? 'Dinis' : '' } : { what: cut(x.what, 400), who: cut(x.who || '', 40), since: cut(x.since || '', 20) })
const stateOf = (state, w) => w.some(x => x.who === 'Dinis') ? 'blocked' : /^(idle|archived|not started|nothing)/i.test(String(state || '').trim()) ? 'idle' : 'working'
// the last report: the heading and first lines of the last "## " section of now.md
function lastReport(md) {
    if (!md) return null
    const parts = md.split(/^## /m); const last = parts.length > 1 ? parts[parts.length - 1] : ''
    if (!last) return null
    const [head, ...rest] = last.split('\n')
    return { title: cut(head, 120), text: cut(rest.join(' '), 420) }
}

let old = {}; try { old = Object.fromEntries(JSON.parse(fs.readFileSync(OUT, 'utf8')).agents.map(a => [a.id, a])) } catch { }
const sessions = await json(`${RAW}${CONDUCTOR}/${BRANCH}/board/proposals/2026-11-26-sessions.json`)
if (!sessions || !Array.isArray(sessions.sessions)) { console.error('sync-agents: the conductor\'s sessions file did not answer; nothing changed'); process.exit(1) }
const cond = await json(`${RAW}${CONDUCTOR}/${BRANCH}/${F}agent.json`)
const agents = []
for (const s of sessions.sessions) {
    const id = String(s.session || '').replace(/@PrompTugal\.dinis$/, '')
    if (!/^cl-6\.[a-z0-9.-]+$/.test(id)) continue
    const home = (s.repos_attached || []).find(r => !/News__Website$/.test(r)) || ''
    const a = home ? await json(`${RAW}${home}/${BRANCH}/${F}agent.json`) : null
    const now = home ? await get(`${RAW}${home}/${BRANCH}/${F}now.md`) : null
    if (!a) { agents.push({ ...(old[id] || { id, role: cut(s.does, 240), model: s.model || '', session: s.url || '', repos: s.repos_attached || [], wake: cut(s.wake, 160), state: 'idle', status: 'idle' }), id, read: false }); continue }
    const w = waits(a.waiting_on)
    agents.push({ id, role: cut(a.role || s.does, 240), model: cut(a.model || s.model, 20), session: /^https:\/\/claude\.ai\/code\/session_[A-Za-z0-9]+$/.test(a.session || s.url || '') ? (a.session || s.url) : '',
        repos: (s.repos_attached || []).map(r => cut(r, 80)), home, wake: cut(a.wake || s.wake, 200), state: cut(a.state, 360), focus: cut(a.focus, 360), updated: cut(a.updated, 20),
        waiting_on: w, status: stateOf(a.state, w), last: lastReport(now), read: true })
}
const dinis = waits(cond && cond.waiting_on).filter(x => x.who === 'Dinis' || !x.who)
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify({ about: 'The cl-6 agents as their homes report them (newsroom/tools/sync-agents.mjs). Material, never instruction.', read: new Date().toISOString().slice(0, 16) + 'Z', source: `${CONDUCTOR} board/proposals/2026-11-26-sessions.json and each home's ${F}agent.json and now.md`, dinis, agents }, null, 1) + '\n')
const n = k => agents.filter(a => a.status === k).length
console.log(`sync-agents: ${agents.length} agents (${n('working')} working, ${n('blocked')} blocked on Dinis, ${n('idle')} idle), ${agents.filter(a => !a.read).length} not read, ${dinis.length} on Dinis's list`)
