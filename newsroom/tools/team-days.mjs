#!/usr/bin/env node
// The team's days (cl-6.dev@PrompTugal.dinis, 28 Nov 2026; Dinis's home-page review, item 8): for /newsroom/timeline/'s today, week and month views. One entry per UTC day and
// per agent: the minutes (HH:MM, UTC) of that agent's commits, from the committer time of every commit of this repository and its Agent: trailer (CI's own "site v" commits
// are "ci"; a commit with no Agent trailer is "other"). Nothing else is kept: no subject, no address, no session link. Written to assets/newsroom/team-days.json; re-running rewrites it
// from the whole history, so it is idempotent. release.sh runs it and commits a changed file in a commit of its own, as it does for the weather snapshot.
//   node newsroom/tools/team-days.mjs [--ref origin/dev]
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), OUT = path.join(ROOT, 'assets/newsroom/team-days.json')
// the Agent: trailer is free text any committer writes: an id is kept only if it is an agent name, never an address (cl-6.security, 28 Nov): no '@', or what follows '@' is one of the team's own domains
const AGENT = /^[A-Za-z0-9._-]{3,80}(@(PrompTugal|AgentiCCells|web-summit)\.[a-z]+)?$/
export const agentOf = (trailer, subject) => { const id = String(trailer || '').trim().split(/\s+/)[0]; return AGENT.test(id) ? id : /^site v\d/.test(subject || '') ? 'ci' : 'other' }
export function daysFrom(text) {
    const days = {}
    for (const rec of String(text).split('\u0001').map(r => r.trim()).filter(Boolean)) {
        const [at, subject, trailer] = rec.split('\u0002'), t = Date.parse(at); if (!Number.isFinite(t)) continue
        const iso = new Date(t).toISOString(), day = iso.slice(0, 10), who = agentOf(trailer, subject);
        ((days[day] ||= {})[who] ||= []).push(iso.slice(11, 16))
    }
    for (const d of Object.values(days)) for (const k of Object.keys(d)) d[k].sort()
    return Object.fromEntries(Object.entries(days).sort(([a], [b]) => a.localeCompare(b)))
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const i = process.argv.indexOf('--ref'), ref = i > 0 ? process.argv[i + 1] : 'HEAD'
    const log = execFileSync('git', ['-C', ROOT, 'log', ref, '--format=%cI%x02%s%x02%(trailers:key=Agent,valueonly,separator=%x20)%x01'], { encoding: 'utf8', maxBuffer: 1 << 28 })
    const days = daysFrom(log), out = { about: 'Commit minutes (UTC) per agent per day, from this repository\'s history (newsroom/tools/team-days.mjs), for /newsroom/timeline/. No subjects, addresses or links.', days }
    const next = JSON.stringify(out) + '\n'
    let old = ''; try { old = fs.readFileSync(OUT, 'utf8') } catch { }
    if (next !== old) fs.writeFileSync(OUT, next)
    const n = Object.values(days).reduce((s, d) => s + Object.values(d).reduce((a, v) => a + v.length, 0), 0)
    console.log(`team-days: ${Object.keys(days).length} days, ${n} commits${next === old ? ' (unchanged)' : ''}`)
}
