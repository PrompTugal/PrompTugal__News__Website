#!/usr/bin/env node
// Snapshot for /newsroom/status/ (cell 2026-11-28-promptugal-status, cl-6.maestro's brief, Dinis's word of 28 Nov): the waits on Dinis, read raw from
// the maestro's briefing.json (waiting_on_dinis[]) and the decisions agent's questions.json (questions[]), both public repositories, no token. Only the named fields are
// kept, each cut and scrubbed (agent-text.mjs); no session link, no contact, no money. Written to assets/newsroom/status-snapshot.json, which the build reads. A feed that does not answer
// keeps its previous values and read time. Run before a release:  node newsroom/tools/sync-status.mjs      cl-6.dev@PrompTugal.dinis
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cut, noMoney } from '../build/lib/agent-text.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), OUT = path.join(ROOT, 'assets/newsroom/status-snapshot.json')
const RAW = 'https://raw.githubusercontent.com/', F = 'site/factory/dinis-cruz/account-f/'
export const FEEDS = {
    briefing: `${RAW}SovereignWebsite/Site__Agent__Maestro__Claude__6/dev/${F}briefing.json`,
    questions: `${RAW}SovereignWebsite/Site__Agent__Decisions/dev/${F}questions.json`,
}
const get = async u => { try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); return r.ok ? await r.json() : null } catch { return null } }
const day = s => /^\d{4}-\d\d-\d\d/.test(String(s || '')) ? String(s).slice(0, 10) : ''
// the shapes, kept apart so a test can feed them without the network
export const fromBriefing = j => noMoney((j && Array.isArray(j.waiting_on_dinis) ? j.waiting_on_dinis : []).map(x => ({ id: cut(x.id, 60), what: cut(x.what, 420), urgency: cut(x.urgency, 80), line: cut(x.line, 240) })))
export const fromQuestions = j => noMoney((j && Array.isArray(j.questions) ? j.questions : []).filter(x => !/^(answered|closed|done|withdrawn)/i.test(String(x.status || ''))).map(x => ({ id: cut(x.id, 60), what: cut(x.question, 420), urgency: cut(x.urgency, 80), by: cut(x.asked_by, 80), since: day(x.since), line: cut(x.line_to_paste, 240), status: cut(x.status, 40) })))

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    let old = {}; try { old = JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { }
    const [b, q] = await Promise.all([get(FEEDS.briefing), get(FEEDS.questions)]), at = new Date().toISOString().slice(0, 16) + 'Z'
    const out = {
        about: 'The waits on Dinis as the maestro\'s briefing and the decisions agent\'s questions list them, for /newsroom/status/. Never served as a file (features/served.mjs); the page shows the values escaped.',
        read: at,
        briefing: b ? { read_at: at, updated: cut(b.updated, 40), items: fromBriefing(b) } : old.briefing || null,
        questions: q ? { read_at: at, updated: cut(q.updated, 40), items: fromQuestions(q) } : old.questions || null,
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
    console.log(`sync-status: briefing ${out.briefing ? out.briefing.items.length : '-'}, questions ${out.questions ? out.questions.items.length : '-'}`)
}
