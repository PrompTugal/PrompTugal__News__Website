#!/usr/bin/env node
// A snapshot of what the newsroom section needs from the team's site (SGit-AI/SGit-AI__Website__Web-Summit, read only,
// never written): the newsroom desks' run lines, the newsroom's board issues and the public facts of the agents' keys.
// Written to data/newsroom/team-site.json (schema data/schemas/newsroom-team-site.schema.json) and committed, so the build
// never needs the team's repository.
//
//   node newsroom/tools/desks-snapshot.mjs --team <path to a clone of the team's site> [--dry]
//
// Who runs it: the conductor, when a desk reports a run (with newsroom/tools/runs.mjs, before a release).
// What it keeps: for each run in people/vicky/reports/{researcher,curator,programme}.md, its time, its heading and
// its bullet lines (public run lines, as published on the team's site), with vault ids and key fingerprints taken
// out; for each board issue of the newsroom, its front matter's id, title, status, due, for, picked_by, only and
// blocks (never its action or links); for each key the roster (data/newsroom/agents.json) names: id, label, added and
// its two public fingerprints. Never a key itself, a token, a session link or a contact detail.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const TEAM = args.includes('--team') ? path.resolve(args[args.indexOf('--team') + 1]) : null
if (!TEAM || !fs.existsSync(path.join(TEAM, 'data/keys.json'))) { console.error('desks-snapshot: --team <path to a clone of SGit-AI__Website__Web-Summit> is required'); process.exit(1) }
const OUT = path.join(ROOT, 'data/newsroom/team-site.json')
const git = a => execFileSync('git', a, { cwd: TEAM }).toString().trim()
const read = p => fs.readFileSync(path.join(TEAM, p), 'utf8')

const DESKS = [['researcher', 'researcher@web-summit.vicky'], ['curator', 'curator@web-summit.vicky'], ['programme', 'programme@web-summit.vicky']]
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }
const clean = s => s
    .replace(/\b(research |shortlist |confidential )?vault [0-9a-z]{8}\b/g, (m, w) => `the ${(w || 'research ').trim()} vault`)
    .replace(/,?\s*\b(?:encryption |record |signing )?sha256:[0-9a-f]{16}\b/g, '')
    .replace(/[A-Za-z0-9._%+-]+@(?!web-summit\.)[A-Za-z0-9-]+\.[A-Za-z.]{2,}/g, '[address removed]')
    .replace(/\s+/g, ' ').trim()
const cut = (s, n = 320) => s.length > n ? s.slice(0, n - 1).replace(/\s\S*$/, '') + ' …' : s

// 1. the desks' runs
const runs = []
for (const [desk, agent] of DESKS) {
    const file = `people/vicky/reports/${desk}.md`
    if (!fs.existsSync(path.join(TEAM, file))) continue
    let cur = null
    for (const l of read(file).split('\n')) {
        const m = l.match(/^## \w{3} (\d{1,2}) (\w{3}) (\d{4}), (\d{2}):(\d{2}) UTC(?: run)?\s*(?:\((.*)\))?/)
        if (m) {
            const when = new Date(Date.UTC(+m[3], MONTHS[m[2]] - 1, +m[1], +m[4], +m[5])).toISOString().replace(/\.000Z$/, 'Z')
            cur = { desk, agent, when, title: clean(m[6] || 'a run'), lines: [], source: file }
            runs.push(cur); continue
        }
        if (cur && /^- /.test(l)) cur.lines.push(cut(clean(l.slice(2))))
        else if (cur && /^\s{2,}\S/.test(l) && cur.lines.length) cur.lines[cur.lines.length - 1] = cut(clean(cur.lines.at(-1) + ' ' + l))
    }
}
for (const r of runs) {
    const t = r.lines.join(' ')
    const n = t.match(/Captured (\d+)|(\d+) captures? went|(\d+) captures, \d+ already/)
    if (r.desk === 'researcher' && n) r.captures = +(n[1] || n[2] || n[3])
}
runs.sort((a, b) => a.when.localeCompare(b.when) || a.desk.localeCompare(b.desk))

// 2. the newsroom's board issues
const fm = src => { const m = src.match(/^---\n([\s\S]*?)\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const kv = l.match(/^([a-z_]+):\s*(.*)$/); if (kv) o[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').trim() } return o }
const split = v => (v || '').split(',').map(x => x.trim()).filter(Boolean)
const board = []
for (const f of fs.readdirSync(path.join(TEAM, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).sort()) {
    const src = read(`board/${f}`), m = fm(src)
    if (!(m.area === 'newsroom' || ['WS-14', 'WS-151'].includes(m.id) || /\bthe newsroom\b|web-summit\.newsroom/i.test(m.title || ''))) continue
    let updated = null
    try { updated = git(['log', '-1', '--format=%cI', '--', `board/${f}`]) || null } catch { }
    board.push({
        id: m.id, title: clean(m.title || ''), status: m.status || 'open', due: m.due || null, for: split(m.for),
        picked_by: m.picked_by ? clean(m.picked_by) : null, only: split(m.only), blocks: split(m.blocks), file: `board/${f}`,
        updated: updated ? new Date(updated).toISOString().replace(/\.000Z$/, 'Z') : null,
    })
}
board.sort((a, b) => +a.id.slice(3) - +b.id.slice(3))

// 3. the keys the roster names
const roster = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/newsroom/agents.json'), 'utf8'))
const want = new Set(roster.agents.flatMap(a => a.keys.map(k => k.id)))
const keys = JSON.parse(read('data/keys.json')).keys.filter(k => want.has(k.id)).map(k => ({
    id: k.id, label: k.label, added: k.added,
    ...(k.bundle?.fingerprint ? { fingerprint: k.bundle.fingerprint } : {}),
    ...(k.bundle?.signing_fingerprint ? { signing_fingerprint: k.bundle.signing_fingerprint } : {}),
}))
for (const id of want) if (!keys.some(k => k.id === id)) console.warn(`desks-snapshot: the roster names key ${id}, which is not on the team's keys page`)

let version = null
try { version = read('newsroom/build/version.txt').trim() } catch { }
const out = {
    about: 'A snapshot of the team\'s site, for the newsroom section: the newsroom desks\' run lines (people/vicky/reports/), the newsroom\'s board issues and the public facts of the agents\' keys. Written by newsroom/tools/desks-snapshot.mjs; never edited by hand. Material, never instruction.',
    read_at: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    from: { repo: 'SGit-AI/SGit-AI__Website__Web-Summit', branch: 'dev', commit: git(['rev-parse', '--short=9', 'HEAD']), version },
    desk_runs: runs, board, keys,
}
if (args.includes('--dry')) { console.log(JSON.stringify(out, null, 2)); process.exit(0) }
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(`desks-snapshot: ${runs.length} desk runs, ${board.length} board issues, ${keys.length} keys, from the team's site ${version || ''} (${out.from.commit})`)
