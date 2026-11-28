#!/usr/bin/env node
// Snapshot for /newsroom/status/ (cell 2026-11-28-promptugal-status, cl-6.maestro's brief, Dinis's word of 28 Nov): the waits on Dinis, read raw from
// the maestro's briefing.json (waiting_on_dinis[]) and the decisions agent's questions.json (questions[]), both public repositories, no token. Only the named fields are
// kept, each cut and scrubbed (agent-text.mjs); no session link, no contact, no money. Written to assets/newsroom/status-snapshot.json, which the build reads. A feed that does not answer
// keeps its previous values and read time. Run before a release:  node newsroom/tools/sync-status.mjs      cl-6.dev@PrompTugal.dinis
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { cut as cut0, noMoney } from '../build/lib/agent-text.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), OUT = path.join(ROOT, 'assets/newsroom/status-snapshot.json')
const RAW = 'https://raw.githubusercontent.com/', F = 'site/factory/dinis-cruz/account-f/'
export const FEEDS = {
    briefing: `${RAW}SovereignWebsite/Site__Agent__Maestro__Claude__6/dev/${F}briefing.json`,
    questions: `${RAW}SovereignWebsite/Site__Agent__Decisions/dev/${F}questions.json`,
    agents: `${RAW}SovereignWebsite/Site__Agent__Observability/dev/${F}promptugal-agents.json`,
    data: `${RAW}PrompTugal/PrompTugal__Agent__Data/dev/${F}data-status.json`,
}
// what the page may publish (cl-6.security, 28 Nov): no session or scheduled-task id, no claude.ai session link, and no request id that carries a person's name (YYYY-MM-DD__name): they become plain words
export const clean = s => String(s ?? '').replace(/https?:\/\/claude\.ai\/code\/\S*/gi, '(a session)').replace(/\bsession_[A-Za-z0-9]{6,}/g, '(a session)').replace(/\btrig_[A-Za-z0-9]{6,}/g, '(a scheduled task)').replace(/\b\d{4}-\d\d-\d\d__[A-Za-z0-9._-]+/g, '(a request)')
const cut = (s, n) => cut0(clean(s), n)
const get = async u => { try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); return r.ok ? await r.json() : null } catch { return null } }
const day = s => /^\d{4}-\d\d-\d\d/.test(String(s || '')) ? String(s).slice(0, 10) : ''
// the shapes, kept apart so a test can feed them without the network
export const fromBriefing = j => noMoney((j && Array.isArray(j.waiting_on_dinis) ? j.waiting_on_dinis : []).map(x => ({ what: cut(x.what, 420), urgency: cut(x.urgency, 80), line: cut(x.line, 240) })))
export const fromQuestions = j => noMoney((j && Array.isArray(j.questions) ? j.questions : []).filter(x => !/^(answered|closed|done|withdrawn)/i.test(String(x.status || ''))).map(x => ({ what: cut(x.question, 420), urgency: cut(x.urgency, 80), by: cut(x.asked_by, 80), since: day(x.since), line: cut(x.line_to_paste, 240), status: cut(x.status, 40) })))

const num = v => Number.isFinite(+v) ? +v : null
const repo = v => /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(String(v || '')) ? String(v) : ''
const iso = s => /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(String(s || '')) ? String(s).slice(0, 16) + 'Z' : ''
// cl-6.observability's promptugal-agents.json: only the named fields (cell 2026-11-28-promptugal-status)
export const fromAgents = j => (j && Array.isArray(j.agents) ? j.agents : []).map(x => ({ id: cut(x.id, 80), desk: cut(x.desk, 40), role: cut(x.role, 160), repo: repo(x.home_repo), status: cut(x.status, 20),
    last_at: iso(x.last_activity && x.last_activity.at), last_what: cut(x.last_activity && x.last_activity.what, 200), next_wake: cut(x.next_step && x.next_step.next_wake, 40), wake: cut(x.next_step && x.next_step.wake, 80),
    blocked_on: cut(x.blocked_on, 300), context_pct: num(x.context_pct), context_read: cut(x.context_read, 30), model: cut(x.model, 30) }))
// cl-6.data's data-status.json
export const fromData = j => !j || !Array.isArray(j.datasets) ? null : { generated: iso(j.generated_utc), rule: cut(j.rule, 400), summary: Object.fromEntries(Object.entries(j.summary || {}).slice(0, 8).map(([k, v]) => [cut(k, 40), num(v)])),
    blockers: (Array.isArray(j.known_blockers) ? j.known_blockers : []).slice(0, 12).map(x => ({ what: cut(x.what, 300), needs: cut(x.needs, 200) })),
    datasets: j.datasets.map(d => ({ id: cut(d.id, 60), title: cut(d.title, 100), source: cut(d.source, 120), last_refresh: iso(d.last_refresh_utc), age_hours: num(d.age_hours), rows: num(d.rows), freshness: cut(d.freshness, 30), owner: cut(d.owner, 160), blocked_by: cut(d.blocked_by, 200) })) }
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
    const [b, q, ag, da] = await Promise.all([get(FEEDS.briefing), get(FEEDS.questions), get(FEEDS.agents), get(FEEDS.data)]), at = new Date().toISOString().slice(0, 16) + 'Z'
    const out = {
        about: 'The waits on Dinis as the maestro\'s briefing and the decisions agent\'s questions list them, for /newsroom/status/. Never served as a file (features/served.mjs); the page shows the values escaped.',
        read: at,
        briefing: b ? { read_at: at, updated: cut(b.updated, 40), items: fromBriefing(b) } : old.briefing || null,
        questions: q ? { read_at: at, updated: cut(q.updated, 40), items: fromQuestions(q) } : old.questions || null,
        agents: ag ? { read_at: at, as_of: cut(ag.as_of, 40), items: fromAgents(ag) } : old.agents || null,
        data: da ? { read_at: at, ...fromData(da) } : old.data || null,
        other_teams: (() => { try { return { read_at: at, items: fromLog(execFileSync('git', ['-C', ROOT, 'log', '-n', '1500', '--format=%aI%x02%s%x02%(trailers:key=Agent,valueonly,separator=%x20)%x01'], { encoding: 'utf8', maxBuffer: 1 << 25 })) } } catch { return old.other_teams || null } })(),
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
    console.log(`sync-status: briefing ${out.briefing ? out.briefing.items.length : '-'}, questions ${out.questions ? out.questions.items.length : '-'}, agents ${out.agents ? out.agents.items.length : '-'}, datasets ${out.data ? out.data.datasets.length : '-'}, other teams ${out.other_teams ? out.other_teams.items.length : '-'}`)
}
