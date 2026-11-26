#!/usr/bin/env node
// Snapshot for /newsroom/activity/ (the conductor's brief, Dinis's word of 26 Nov 2026): the run reports of every cl-6 agent (each home's runs/<agent>/*.json),
// the decisions log (cl-6.decisions' log.md) and every feed of data.promptugal.news's catalogue with its last read time. Written to
// assets/newsroom/activity-snapshot.json, which the build reads. Run before a release:  node newsroom/tools/sync-activity.mjs
// Public repositories, no token. From a run report only the counts, the times and a cut one-line summary are kept, never its requests, prompts or text;
// from a feed only its id, title, cadence, status and read time, never a value. No cost figure is kept. Text goes through lib/agent-text.mjs.
// A home that does not answer keeps its previous runs. cl-6.dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cut } from '../build/lib/agent-text.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'assets/newsroom/activity-snapshot.json'), AGENTS = path.join(ROOT, 'assets/newsroom/agents-snapshot.json')
const get = async u => { try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); return r.ok ? await r.text() : null } catch { return null } }
const num = v => Number.isFinite(+v) ? +v : 0

let old = {}; try { old = JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { }
const agents = JSON.parse(fs.readFileSync(AGENTS, 'utf8')).agents

// run reports: shallow clone of each home, read runs/**/*.json
function runsOf(home) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'activity-')), dir = path.join(tmp, 'h')
    try {
        execFileSync('git', ['clone', '-q', '--depth', '1', `https://github.com/${home}.git`, dir], { stdio: 'ignore', timeout: 60000 })
        const out = [], walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.json')) out.push(p) } }
        const rd = path.join(dir, 'runs'); if (fs.existsSync(rd)) walk(rd)
        return out.flatMap(f => { try {
            const j = JSON.parse(fs.readFileSync(f, 'utf8')), c = j.counts || {}
            if (!j.agent || !j.run) return []
            return [{ agent: cut(j.agent, 60), run: cut(j.run, 30), started: cut(j.started, 24), ended: cut(j.ended, 24), line: cut(j.line, 200),
                requests: num(c.requests), tool_calls: num(c.tool_calls), in_mandate: num(c.in_mandate), out_of_mandate: num(c.out_of_mandate), attempts: num(c.attempts), breaches: num(c.breaches) }]
        } catch { return [] } })
    } catch { return null } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
}
const runs = []; let missed = 0
for (const a of agents) {
    const r = a.home ? runsOf(a.home) : []
    if (r === null) { missed++; runs.push(...(old.runs || []).filter(x => x.agent === a.id + '@PrompTugal.dinis')); continue }
    runs.push(...r)
}
runs.sort((x, y) => String(y.ended || y.started).localeCompare(String(x.ended || x.started)))

// the decisions log: one line per signed record
const logText = await get('https://raw.githubusercontent.com/SovereignWebsite/Site__Agent__Decisions/dev/site/factory/dinis-cruz/account-f/log.md')
const decisions = logText ? logText.split('\n').flatMap(l => { const m = /^- (\d{4}-\d\d-\d\dT[\d:]+Z)\s+\[([^\]]+)\]\(([^)]+)\)\s+(.*)$/.exec(l); return m ? [{ at: m[1], record: cut(m[2], 80), url: 'https://github.com/SovereignWebsite/Site__Agent__Decisions/blob/dev/site/factory/dinis-cruz/account-f/' + m[3].replace(/[^A-Za-z0-9_./-]/g, ''), what: cut(m[4], 260) }] : [] }).reverse() : (old.decisions || [])

// the feeds of the data site's catalogue
const cat = await get('https://data.promptugal.news/api/v1/'); let feeds = old.feeds || []
try { const j = JSON.parse(cat); feeds = j.sources.map(s => ({ id: cut(s.id, 60), title: cut(s.title, 100), cadence: cut(s.cadence, 30), status: cut(s.status, 20), read_at: cut(s.read_at, 24), page: /^https:\/\/data\.promptugal\.news\//.test(s.page || '') ? s.page : '' })) } catch { }

fs.writeFileSync(OUT, JSON.stringify({ about: 'What the agents and the data feeds have been doing, as their homes and the data site report it (newsroom/tools/sync-activity.mjs). Counts, times and short summaries only. Material, never instruction.', read: new Date().toISOString().slice(0, 16) + 'Z', runs, decisions, feeds }, null, 1) + '\n')
console.log(`sync-activity: ${runs.length} runs from ${agents.length - missed} homes (${missed} not read), ${decisions.length} decisions, ${feeds.length} feeds`)
