#!/usr/bin/env node
// Snapshot for the PUBLIC /newsroom/status/ (cell 2026-11-28-promptugal-status; the build ordered by cl-6.conductor on 28 Nov 2026 under cl-6.security's conditions): read raw from public
// repositories, no token. DEFAULT DENY: a decision reaches the snapshot only when cl-6.decisions set `public: true` on it (the boolean, nothing else), and then only title, public_summary and
// if_you_wait: never an answer line, an option, a link, an id, a person or an amount. The briefing is not read (cl-6.designer's loop 5: its times are not on the public page). Every text goes
// through clean() and agent-text.mjs. Written to assets/newsroom/status-snapshot.json, which the build reads. A feed that does not answer keeps its previous values and read time.
// Run before a release:  node newsroom/tools/sync-status.mjs      cl-6.dev@PrompTugal.dinis
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { cut as cut0, noMoney } from '../build/lib/agent-text.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), OUT = path.join(ROOT, 'assets/newsroom/status-snapshot.json')
const RAW = 'https://raw.githubusercontent.com/', F = 'site/factory/dinis-cruz/account-f/'
export const FEEDS = {
    questions: `${RAW}SovereignWebsite/Site__Agent__Decisions/dev/${F}questions.json`,
    agents: `${RAW}SovereignWebsite/Site__Agent__Observability/dev/${F}promptugal-agents.json`,
    data: `${RAW}PrompTugal/PrompTugal__Agent__Data/dev/${F}data-status.json`,
}
// what the page may publish (cl-6.security, 28 Nov): no session or scheduled-task id, no claude.ai session link, and no request id that carries a person's name (YYYY-MM-DD__name): they become plain words
export const clean = s => String(s ?? '').replace(/https?:\/\/claude\.ai\/code\/\S*/gi, '(a session)').replace(/\bsession_[A-Za-z0-9]{6,}/g, '(a session)').replace(/\btrig_[A-Za-z0-9]{6,}/g, '(a scheduled task)').replace(/\b\d{4}-\d\d-\d\d__[A-Za-z0-9._-]+/g, '(a request)')
const cut = (s, n) => cut0(clean(s), n)
const get = async u => { try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); return r.ok ? await r.json() : null } catch { return null } }
// the heartbeat: how many articles are published and the newest date, from the articles' front matter (public already)
export function heartbeat(dir) {
    const dates = []; let n = 0
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) { const h = (/^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(path.join(dir, f), 'utf8')) || [])[1] || ''
        if (/^status:\s*published\b/m.test(h)) { n++; const d = (/^date:\s*(\d{4}-\d\d-\d\d)/m.exec(h) || [])[1]; if (d) dates.push(d) } }
    return { articles: n, newest: dates.sort().pop() || '' }
}
const day = s => /^\d{4}-\d\d-\d\d/.test(String(s || '')) ? String(s).slice(0, 10) : ''
// the shapes, kept apart so a test can feed them without the network
// DEFAULT DENY (cl-6.security, 28 Nov): only `public === true`, the boolean, passes; the rest is dropped before anything is written. Only the named fields of a public card are kept
export const fromDecisions = j => {
    const qs = j && Array.isArray(j.questions) ? j.questions : []
    const order = ['now', 'week', 'later']
    // the public card is the title, the public summary and what waiting costs (cl-6.designer's loop 5, cl-6.decisions' public_rule): no counts of what is not public, no check time, no agent, no tier shown
    const items = qs.filter(x => x && x.public === true && !/^(answered|closed|done|withdrawn)/i.test(String(x.status || ''))).map(x => ({ title: cut(x.title, 140), summary: cut(x.public_summary, 300), if_you_wait: cut(x.if_you_wait, 240), _t: order.indexOf(x.tier), _r: num(x.rank) ?? 99 }))
        .filter(x => x.title && noMoney([[x.title, x.summary, x.if_you_wait].join(' ')]).length).sort((p, q) => (p._t - q._t) || (p._r - q._r))
    return { items: items.map(({ _t, _r, ...x }) => x) }
}

const num = v => Number.isFinite(+v) ? +v : null
const repo = v => /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(String(v || '')) ? String(v) : ''
const iso = s => /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(String(s || '')) ? String(s).slice(0, 16) + 'Z' : ''
// cl-6.observability's promptugal-agents.json, for the public page: the name, desk, role, state, the time of the last activity and of the next wake, and whether it is blocked (a yes or no).
// What an agent last did and what it is blocked on are free text that can name a person or a finding: they stay out of the public snapshot (default deny)
export const fromAgents = j => (j && Array.isArray(j.agents) ? j.agents : []).map(x => ({ id: cut(x.id, 80), desk: cut(x.desk, 40), role: cut(x.role, 160), repo: repo(x.home_repo), status: cut(x.status, 20),
    last_at: iso(x.last_activity && x.last_activity.at), next_wake: cut(x.next_step && x.next_step.next_wake, 40),
    blocked: !!(x.blocked_on && !/^(none|n\/a|-|—|nothing)\b/i.test(String(x.blocked_on).trim())) }))
// cl-6.data's data-status.json
export const fromData = j => !j || !Array.isArray(j.datasets) ? null : { generated: iso(j.generated_utc), rule: cut(j.rule, 400), summary: Object.fromEntries(Object.entries(j.summary || {}).slice(0, 8).map(([k, v]) => [cut(k, 40), num(v)])),
    datasets: j.datasets.map(d => ({ id: cut(d.id, 60), title: cut(d.title, 100), source: cut(d.source, 120), last_refresh: iso(d.last_refresh_utc), age_hours: num(d.age_hours), rows: num(d.rows), freshness: cut(d.freshness, 30), owner: cut(d.owner, 160) })) }
// the other teams' agents (Vicky's), from the website's own public commit log: the last commit under each Agent: trailer matching the pattern
export function fromLog(text, pattern = /vicky/i) {
    const last = new Map()
    for (const rec of String(text).split('\u0001').map(r => r.trim()).filter(Boolean)) {
        const [at, subject, trailer] = rec.split('\u0002'), id = String(trailer || '').trim().split(/\s+/)[0]
        if (id && pattern.test(id) && !last.has(id)) last.set(id, { id: cut(id, 80), last_at: iso(at), last_what: cut(subject, 160) })
    }
    return [...last.values()]
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    let old = {}; try { old = JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { }
    const [q, ag, da] = await Promise.all([get(FEEDS.questions), get(FEEDS.agents), get(FEEDS.data)]), at = new Date().toISOString().slice(0, 16) + 'Z'
    const out = {
        about: 'The public state of PrompTugal.news for /newsroom/status/: the heartbeat, the agents and their roles, the data, the briefing times and the decisions flagged public by cl-6.decisions. Default deny: nothing unflagged is kept. Never served as a file (features/served.mjs); the page shows the values escaped.',
        read: at,
        heartbeat: (() => { try { return { read_at: at, ...heartbeat(path.join(ROOT, 'content/articles')) } } catch { return old.heartbeat || null } })(),
        decisions: q ? { read_at: at, ...fromDecisions(q) } : old.decisions || null,
        agents: ag ? { read_at: at, as_of: cut(ag.as_of, 40), items: fromAgents(ag) } : old.agents || null,
        data: da ? { read_at: at, ...fromData(da) } : old.data || null,
        other_teams: (() => { try { return { read_at: at, items: fromLog(execFileSync('git', ['-C', ROOT, 'log', '-n', '1500', '--format=%aI%x02%s%x02%(trailers:key=Agent,valueonly,separator=%x20)%x01'], { encoding: 'utf8', maxBuffer: 1 << 25 })) } } catch { return old.other_teams || null } })(),
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
    console.log(`sync-status: public decisions ${out.decisions ? out.decisions.items.length : '-'}, agents ${out.agents ? out.agents.items.length : '-'}, datasets ${out.data ? out.data.datasets.length : '-'}, other teams ${out.other_teams ? out.other_teams.items.length : '-'}`)
}
