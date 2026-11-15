// The record the viz-* features draw from, read once per build: the git log (who committed what, when, which files,
// which release carried it), every agent's board/team/<role>/status.json, its run reports in board/runs/<role>/, its
// key in board/keys.json, the place team's roster (board/team/conductor/place-agents.json) and board/schedule.json.
// Nothing here is invented: an agent with no record shows as silent. Not a feature by itself (it exports no hook).
// By viz.places@PrompTugal.dinis, 15 November 2026 (board/briefs/2026-11-15-show-the-power.md).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { cast } from './viz-cast.mjs'

const SINCE = '2026-11-01'
const AGENT_RE = /^([a-z][a-z0-9.\-]*@[A-Za-z][A-Za-z0-9.\-]*?\.(?:dinis|vicky|angelo|silvio|jose|indi))\s*[:,]/
export const MIN = 60000

let REC = null
export function record(ctx) {
    if (REC) return REC
    let raw = ''
    try {
        raw = execFileSync('git', ['log', `--since=${SINCE}`, '--format=%x1e%H%x1f%aI%x1f%s', '--name-only'], { cwd: ctx.ROOT, maxBuffer: 256 * 1024 * 1024, encoding: 'utf8' })
    } catch { raw = '' }
    // git log runs newest first; walking it backwards, each agent commit is shipped by the next CI release after it
    const rows = []
    for (const chunk of raw.split('\x1e')) {
        if (!chunk.trim()) continue
        const [head, ...rest] = chunk.split('\n')
        const [sha, when, subject] = head.split('\x1f')
        rows.push({ sha, when, subject: subject || '', files: rest.map(s => s.trim()).filter(Boolean) })
    }
    const commits = [], releases = new Map()
    let pending = []
    for (const r of rows.reverse()) {
        const rel = r.subject.match(/^site (v\d+\.\d+\.\d+): (.*)$/)
        if (rel) { releases.set(rel[1], { version: rel[1], when: r.when, subject: rel[2] }); for (const c of pending) c.release = rel[1]; pending = []; continue }
        const m = r.subject.match(AGENT_RE)
        if (!m) continue
        const c = { sha: r.sha.slice(0, 9), when: r.when, t: Date.parse(r.when), subject: r.subject, agent: m[1].toLowerCase(), name: m[1], files: r.files }
        commits.push(c); pending.push(c)
    }
    const now = commits.reduce((mx, c) => Math.max(mx, c.t), 0) || Date.now()
    const byAgent = new Map()
    for (const c of commits) { if (!byAgent.has(c.agent)) byAgent.set(c.agent, []); byAgent.get(c.agent).push(c) }
    for (const l of byAgent.values()) l.sort((a, b) => a.t - b.t)
    let roster = { agents: [] }, schedule = { tasks: [] }, keys = { keys: [] }
    try { roster = ctx.readJSON('board/team/conductor/place-agents.json') } catch {}
    try { schedule = ctx.readJSON('board/schedule.json') } catch {}
    try { keys = ctx.readJSON('board/keys.json') } catch {}
    REC = { commits, byAgent, releases, now, roster, schedule, keys, nReleases: releases.size }
    return REC
}

export const roleOf = agent => String(agent).split('@')[0].toLowerCase()
export const short = agent => roleOf(agent) + '@'

const statusCache = new Map()
export function statusOf(ctx, role) {
    if (statusCache.has(role)) return statusCache.get(role)
    let s = null
    try { s = ctx.readJSON(`board/team/${role}/status.json`) } catch {}
    statusCache.set(role, s)
    return s
}

const runsCache = new Map()
export function runsOf(ctx, role) {
    if (runsCache.has(role)) return runsCache.get(role)
    const dir = ctx.R(`board/runs/${role}`)
    const out = { count: 0, tool_calls: 0, web: 0, breaches: 0, out_of_mandate: 0, last: null }
    try {
        for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
            try {
                const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
                out.count++
                out.tool_calls += (r.tool_calls && r.tool_calls.total) || 0
                out.web += (r.tool_calls && r.tool_calls.by_kind && r.tool_calls.by_kind.web) || 0
                out.breaches += (r.counts && r.counts.breaches) || 0
                out.out_of_mandate += (r.counts && r.counts.out_of_mandate) || 0
                const end = r.ended || r.started
                if (end && (!out.last || end > out.last)) out.last = end
            } catch {}
        }
    } catch {}
    runsCache.set(role, out)
    return out
}

export function keyOf(ctx, agent) {
    const { keys } = record(ctx)
    const all = (keys.keys || []).filter(k => String(k.agent || '').toLowerCase() === agent.toLowerCase() && k.kind !== 'site')
    const k = all.filter(k => k.status !== 'superseded').pop() || all.pop()
    return k ? { id: k.id, fp: k.bundle && k.bundle.signing_fingerprint, status: k.status || 'active' } : null
}

export function modelOf(ctx, agent) {
    const { roster } = record(ctx)
    const r = (roster.agents || []).find(a => String(a.agent).toLowerCase() === agent.toLowerCase())
    return r ? r.model : null
}

export function scheduleOf(ctx, agent) {
    const { schedule } = record(ctx)
    const t = (schedule.tasks || []).find(x => String(x.agent).toLowerCase() === agent.toLowerCase())
    return t ? { cron: t.cron, state: t.state } : null
}

export const asksOf = s => (s && Array.isArray(s.asks) ? s.asks : []).filter(a => typeof a === 'string' && /^\s*Dinis\b/.test(a))

// the mood, by the published rule (assets/viz/cast.json "moods")
export function moodOf(lastT, now, asks) {
    if (!lastT) return 'unhappy'
    const age = (now - lastT) / MIN
    if (age <= 90) return asks > 0 ? 'stressed' : 'happy'
    if (age <= 360) return 'worried'
    return 'unhappy'
}

export function ago(mins) {
    if (mins < 1) return 'just now'
    if (mins < 60) return `${Math.round(mins)} min ago`
    if (mins < 60 * 36) return `${Math.round(mins / 60)} h ago`
    return `${Math.round(mins / 1440)} days ago`
}
export const hm = t => new Date(t).toISOString().slice(11, 16)
export const dm = t => { const d = new Date(t); return `${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}` }

// the jobs that a file means for a place (assets/viz/cast.json "jobs"); {id} is the place's id
function jobRes(ctx, id) {
    return cast(ctx).jobs.map(j => ({ ...j, re: new RegExp(j.path.replace(/\{id\}/g, id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))), shared: !j.path.includes('{id}') }))
}

// who works on a place, from the record: its own agent (always), and every agent whose commits touched the place's
// files or the shared machinery every place page stands on. Sorted: the place agent first, then by last work.
export function agentsFor(ctx, place) {
    const R = record(ctx), now = R.now
    const res = jobRes(ctx, place.id)
    const found = new Map()
    const touch = (agent, c, job) => {
        if (!found.has(agent)) found.set(agent, { agent, here: [], jobs: new Map() })
        const a = found.get(agent)
        if (!a.here.includes(c)) a.here.push(c)
        // a place's own file, touched by another agent, is set-up or editing, not the place agent's research
        if (job.own && agent !== place.agent.toLowerCase()) job = { ...job, job: "set up or edited this place's file", own: false, stage: 'route' }
        a.jobs.set(job.job, job)
    }
    const since = (Date.parse((R.roster && R.roster.started) || '') || 0) - 2 * 3600e3
    for (const c of R.commits) {
        if (c.t < since) continue
        for (const f of c.files) {
            const j = res.find(j => j.re.test(f))
            if (!j) continue
            // an article counts for a place only through its own agent (the place agents write their own town's)
            if (j.path.startsWith('^content/articles/') && c.agent !== place.agent.toLowerCase()) continue
            // another place's agent touching shared files is not working on this place
            if (j.shared && /^place\./.test(roleOf(c.agent)) && c.agent !== place.agent.toLowerCase()) continue
            touch(c.agent, c, j)
        }
    }
    const own = place.agent.toLowerCase()
    if (!found.has(own)) found.set(own, { agent: own, here: [], jobs: new Map() })
    return [...found.values()].map(a => {
        const role = roleOf(a.agent), all = R.byAgent.get(a.agent) || []
        const last = all[all.length - 1] || null, s = statusOf(ctx, role), asks = asksOf(s)
        const here = a.here.sort((x, y) => x.t - y.t)
        const order = [...cast(ctx).jobs.map(j => j.job), "set up or edited this place's file"]
        const jobs = [...a.jobs.values()].sort((x, y) => order.indexOf(x.job) - order.indexOf(y.job))
        if (a.agent === own && !jobs.some(j => j.own)) jobs.unshift(cast(ctx).jobs[0])
        return {
            agent: a.agent, name: (all[0] && all[0].name) || place.agent, role, own: a.agent === own, model: modelOf(ctx, a.agent), key: keyOf(ctx, a.agent),
            jobs: jobs.map(j => j.job), stages: [...new Set(jobs.map(j => j.stage))],
            here: here.length, firstHere: here[0] ? here[0].when : null, lastHere: here.length ? here[here.length - 1] : null,
            total: all.length, first: all[0] ? all[0].when : null, last, releases: new Set(all.map(c => c.release).filter(Boolean)).size,
            ageMin: last ? (now - last.t) / MIN : null, mood: moodOf(last && last.t, now, asks.length),
            status: s ? { state: s.state || '', next: Array.isArray(s.next) ? s.next[0] : (s.next || ''), updated: s.updated || null, asks: asks.length } : null,
            runs: runsOf(ctx, role), schedule: scheduleOf(ctx, a.agent),
            hours: hourly(all, R),
        }
    }).sort((x, y) => (y.own - x.own) || ((y.last ? y.last.t : 0) - (x.last ? x.last.t : 0)))
}

// commits per hour since the place team started (the book's "on stage now": a head lights up from an agent's first commit)
export function hourWindow(R) {
    const start = Date.parse((R.roster && R.roster.started) || '') || (R.now - 12 * 3600e3)
    const from = Math.floor(start / 3600e3) * 3600e3
    const n = Math.max(1, Math.min(48, Math.ceil((R.now - from + 1) / 3600e3)))
    return { from, n }
}
function hourly(all, R) {
    const { from, n } = hourWindow(R)
    const out = new Array(n).fill(0)
    for (const c of all) { const i = Math.floor((c.t - from) / 3600e3); if (i >= 0 && i < n) out[i]++ }
    return out
}
