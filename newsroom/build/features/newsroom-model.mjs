// The newsroom section's model: the runs ledger (data/newsroom/runs/*.jsonl, from git by newsroom/tools/runs.mjs), the roster
// (data/newsroom/agents.json), the plan (data/newsroom/plan.json) and the team-site snapshot (data/newsroom/team-site.json,
// by newsroom/tools/desks-snapshot.mjs), joined into runs, agents, releases and the pipeline. Read once per build. No
// git, no network: everything comes from committed files. Not a feature by itself (no hook); features/newsroom.mjs uses it.
import fs from 'node:fs'
import path from 'node:path'
import { ms } from './newsroom-draw.mjs'

export const STAGES = [['research', 'Research'], ['curate', 'Curate'], ['write', 'Write'], ['check', 'Check'], ['publish', 'Publish']]
export const BESIDE = [['programme', 'Programme'], ['edit', 'Edit (the desk)'], ['security', 'Security']]
export const STATE_WORD = { running: 'running', done: 'done', planned: 'planned', retired: 'retired', waiting: 'waiting' }
const PEOPLE = { dinis: 'Dinis', vicky: 'Vicky', indi: 'Indi' }
export const personName = p => PEOPLE[p] || (p ? p[0].toUpperCase() + p.slice(1) : 'nobody yet')

export function readLedger(ctx) {
    const dir = ctx.R('data/newsroom/runs')
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()
        .flatMap(f => fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map((l, i) => ({ ...JSON.parse(l), _file: `data/newsroom/runs/${f}`, _line: i + 1 })))
}

let cache
export function model(ctx) {
    if (cache) return cache
    const roster = ctx.readJSON('data/newsroom/agents.json'), plan = ctx.readJSON('data/newsroom/plan.json'), team = ctx.readJSON('data/newsroom/team-site.json')
    const ledger = readLedger(ctx).sort((a, b) => a.when.localeCompare(b.when) || a.landed.localeCompare(b.landed))
    const agents = roster.agents.map(a => ({ ...a, runs: [] }))
    const byName = new Map(agents.filter(a => a.name).map(a => [a.name, a]))
    const byId = new Map(agents.map(a => [a.id, a]))
    // which release carried each commit
    const releases = ledger.filter(c => c.kind === 'release').map(c => ({ version: c.release, when: c.landed, what: c.what, pushed_by: c.pushed_by, carries: c.carries, short: c.short }))
    const releaseOf = new Map()
    for (const r of releases) for (const s of r.carries) releaseOf.set(s, r.version)
    const shortSet = new Set(ledger.map(c => c.short))
    // every run, newest first: commits (work, merge, initial, release) and the desks' reported runs
    const runs = [
        ...ledger.map(c => ({
            id: c.short, source: 'commit', kind: c.kind, when: c.when, landed: c.landed, by: c.by, agent: c.agent,
            roster: c.agent ? byName.get(c.agent) || null : null, what: c.what, issues: c.issues, for: c.for,
            release: c.kind === 'release' ? c.release : releaseOf.get(c.short) || null, pushed_by: c.pushed_by || null,
            carries: c.carries || null, files: c.files, add: c.add, del: c.del, areas: c.areas, paths: c.paths, sha: c.sha,
            parents: c.parents.filter(p => shortSet.has(p)),
        })),
        ...team.desk_runs.map(d => ({
            id: `${d.desk}-${d.when.slice(0, 16).replace(/[-:T]/g, '')}`, source: 'desk-report', kind: 'desk', when: d.when, landed: d.when,
            by: d.agent, agent: d.agent, roster: byName.get(d.agent) || null, what: d.title, lines: d.lines, issues: [], for: [],
            release: null, captures: d.captures ?? null, report: d.source,
        })),
    ].sort((a, b) => b.when.localeCompare(a.when) || b.landed.localeCompare(a.landed) || b.id.localeCompare(a.id))
    // two runs may share an id (two reports at the same minute): make them unique
    const seen = new Map()
    for (const r of [...runs].reverse()) { const n = seen.get(r.id) || 0; seen.set(r.id, n + 1); if (n) r.id += `-${n + 1}` }
    for (const r of runs) if (r.roster) r.roster.runs.push(r)
    const laneKind = r => r.kind === 'release' ? 'ci' : r.roster ? r.roster.kind : 'conductor'
    for (const r of runs) r.laneKind = laneKind(r)
    for (const a of agents) {
        a.last = a.runs[0] || null
        a.first = a.runs.at(-1) || null
        a.commits = a.runs.filter(r => r.source === 'commit').length
        a.keyFacts = a.keys.map(k => ({ ...k, ...(team.keys.find(t => t.id === k.id) || {}) }))
    }
    const unknownAgents = [...new Set(ledger.map(c => c.agent).filter(n => n && !byName.has(n)))]
    // the pipeline: each stage's desks, their state and last run
    const stage = id => {
        const desks = agents.filter(a => a.desk === id)
        const state = !desks.length ? 'none' : desks.some(a => a.status === 'running') ? 'running' : desks.every(a => a.status === 'planned') ? 'planned' : desks[0].status
        const last = desks.flatMap(a => a.runs).sort((a, b) => b.when.localeCompare(a.when))[0] || null
        return { stage: id, desks, state, last }
    }
    const pipeline = [...STAGES, ...BESIDE].map(([id, label]) => ({ ...stage(id), label, beside: BESIDE.some(b => b[0] === id) }))
    cache = { roster, plan, team, ledger, agents, byName, byId, runs, releases, releaseOf, pipeline, unknownAgents }
    return cache
}

// the live counts a plan note may name in braces
export function liveCounts(ctx, m) {
    const s = ctx.store
    return {
        companies: s.companies.length,
        articles: ctx.content.filter(p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html').length,
        agenda: s.events.filter(e => e.derived).length,
        captures: s.evidence.length,
        stories: s.stories.length,
        people: s.people.length,
        pages: ctx.pages?.length || 0,
        releases: m.releases.length,
        runs: m.runs.filter(r => r.kind !== 'release').length,
        agents_running: m.agents.filter(a => a.status === 'running').length,
    }
}
export const fillCounts = (s, counts) => String(s).replace(/\{([a-z_]+)\}/g, (x, k) => k in counts ? String(counts[k]) : x)

// spans of work per agent within [from, to]: first to last event, or from its start to now when it is running
export function lanesFor(m, { from, to, hrefOf, extendRunning = false }) {
    const inWin = t => ms(t) >= from && ms(t) <= to
    const order = { conductor: 0, desk: 1, builder: 2 }
    const lanes = []
    for (const a of [...m.agents].sort((x, y) => order[x.kind] - order[y.kind] || (x.first ? ms(x.first.when) : 9e15) - (y.first ? ms(y.first.when) : 9e15))) {
        const ev = a.runs.filter(r => inWin(r.when)).map(r => ({ t: r.when, type: r.source === 'desk-report' ? 'desk' : r.kind === 'merge' ? 'merge' : 'commit', title: `${a.name}: ${r.what}`, href: hrefOf(r) }))
        const started = a.started && a.started.length > 10 ? a.started : null
        const startIn = started && inWin(started)
        if (startIn) ev.push({ t: started, type: 'start', title: `${a.name} fired up by ${a.started_by}` })
        if (!ev.length) continue
        const ts = ev.map(e => ms(e.t))
        const running = extendRunning && a.status === 'running' && a.kind === 'builder'
        lanes.push({ id: a.id, label: a.name ? a.name.replace('@web-summit.', '@') : a.label, sub: `${a.kind}, ${a.status}`, kind: a.kind, events: ev.sort((x, y) => ms(x.t) - ms(y.t)), span: [new Date(Math.min(...ts)).toISOString(), new Date(running ? to : Math.max(...ts)).toISOString()], running, agent: a })
    }
    const rel = m.runs.filter(r => r.kind === 'release' && inWin(r.when))
    if (rel.length) lanes.push({ id: 'ci', label: 'CI (GitHub Actions)', sub: 'numbers, tags, deploys', kind: 'ci', events: rel.map(r => ({ t: r.when, type: 'release', title: `${r.release}: ${r.what}`, href: hrefOf(r) })).reverse(), span: null })
    return lanes
}

// when agents worked in parallel: the stretches of time when two or more builders or desks were at work (the
// conductor is at work throughout, so it is left out), each with who; a running agent is at work to the window's end
export function parallels(lanes) {
    const ls = lanes.filter(l => l.span && l.kind !== 'ci' && l.kind !== 'conductor')
    const cuts = [...new Set(ls.flatMap(l => l.span.map(ms)))].sort((a, b) => a - b), out = []
    for (let i = 0; i < cuts.length - 1; i++) {
        const a = cuts[i], b = cuts[i + 1], who = ls.filter(l => ms(l.span[0]) <= a && ms(l.span[1]) >= b)
        if (who.length < 2 || b - a < 120e3) continue   // a stretch under two minutes is a fan-out's seconds, not parallel work
        const key = who.map(l => l.label).join(', '), last = out.at(-1)
        if (last && last.key === key && last.b === a) last.b = b
        else out.push({ key, a, b, who: who.map(l => l.label), running: who.some(l => l.running) })
    }
    const end = cuts.at(-1)
    return out.map(x => ({ who: x.who, from: new Date(x.a).toISOString(), to: new Date(x.b).toISOString(), running: x.running && x.b === end }))
}
