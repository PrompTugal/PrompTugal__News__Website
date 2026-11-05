#!/usr/bin/env node
// The runs ledger: every commit of this repository as one line of JSON, committed under data/admin/runs/, so the admin
// section (/admin/) shows every run without reading git at build time (CI's clone depth then never matters).
//
//   node admin/tools/runs.mjs                 append the commits of HEAD that the ledger does not have yet
//   node admin/tools/runs.mjs --ref origin/dev   the same, from another ref
//   node admin/tools/runs.mjs --check         change nothing; exit 1 if HEAD has commits the ledger lacks
//   node admin/tools/runs.mjs --dry           print what would be appended
//
// Who runs it: the conductor (newsroom@web-summit.dinis), before each release, after merging the builders' branches:
// run it, commit data/admin/runs/ with the release, then admin/tools/release.sh. It is wired into nothing automatic.
// A commit cannot list itself (its hash depends on its content), so the ledger always ends one commit behind the
// commit that carries it; the next run picks that one up.
//
// The format (one line per commit, in data/admin/runs/<YYYY-MM-DD>.jsonl, the day of the commit in UTC; schema
// data/schemas/admin-run.schema.json). Lines are only ever appended, never rewritten; re-running adds only commits
// the ledger does not have (by full sha), so it is idempotent:
//   { sha, short, when (author time, UTC), landed (commit time, UTC), kind: work | merge | release | initial,
//     agent (the Agent: trailer, null for CI and the initial commit), by (agent, or the author's name when there is no
//     agent), what (the subject without "<agent>: "), issues [Issue: trailers], for [For: trailers], parents [short],
//     release (vX.Y.Z, release commits only), pushed_by (the agent whose push CI released), carries [short shas the
//     release carried], files, add, del, areas { content|data|desks|build|tools|assets|design|signatures|ci|docs|
//     release|other: { files, add, del } }, paths [the folders touched, at most 12] }
// Never stored: e-mail addresses, the commit body, session links or any trailer other than Agent, Issue and For.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data/admin/runs')
const args = process.argv.slice(2)
const flag = f => args.includes(f)
const ref = args.includes('--ref') ? args[args.indexOf('--ref') + 1] : 'HEAD'
const git = a => execFileSync('git', a, { cwd: ROOT, maxBuffer: 256 << 20 }).toString()

// which area of the repository a path belongs to
export function areaOf(p) {
    if (p === 'admin/build/version.txt' || p === 'admin/versions.json') return 'release'
    if (p.startsWith('content/')) return 'content'
    if (p.startsWith('data/')) return 'data'
    if (p.startsWith('desks/')) return 'desks'
    if (p.startsWith('admin/build/')) return 'build'
    if (p.startsWith('admin/tools/')) return 'tools'
    if (p.startsWith('assets/')) return 'assets'
    if (p.startsWith('design/')) return 'design'
    if (p.startsWith('articles/')) return 'signatures'
    if (p.startsWith('.github/')) return 'ci'
    if (!p.includes('/') && /\.(md|txt)$|^CNAME$|^LICENSE$|^\.gitignore$/.test(p)) return 'docs'
    return 'other'
}
const folderOf = p => { const s = p.split('/'); return s.length <= 1 ? '/' : s.slice(0, Math.min(s.length - 1, s[0] === 'admin' || s[0] === 'data' || s[0] === 'content' ? 2 : 1)).join('/') + '/' }
const utc = iso => new Date(iso).toISOString().replace(/\.\d{3}Z$/, 'Z')
const list = s => (s || '').split(',').map(x => x.trim()).filter(Boolean)

// 1. history, oldest first
const SEP = '\u001e', US = '\u001f'
const fmt = `${SEP}%H${US}%P${US}%an${US}%aI${US}%cI${US}%s${US}%(trailers:key=Agent,valueonly,separator=%x2C)${US}%(trailers:key=Issue,valueonly,separator=%x2C)${US}%(trailers:key=For,valueonly,separator=%x2C)${US}%b`
const raw = git(['log', ref, '--reverse', '--no-renames', '--numstat', '--diff-merges=first-parent', `--format=${fmt}`])
const commits = []
for (const chunk of raw.split(SEP).filter(c => c.trim())) {
    const [head, ...rest] = chunk.split('\n')
    const f = (head + '\n' + rest.join('\n')).split(US)
    const [sha, parents, author, aI, cI, subject, agentT, issueT, forT] = f
    // the numstat lines follow the body: take every line that is "<n|->\t<n|->\t<path>"
    const stat = f.slice(9).join(US).split('\n').filter(l => /^(\d+|-)\t(\d+|-)\t/.test(l)).map(l => { const [a, d, ...p] = l.split('\t'); return { add: a === '-' ? 0 : +a, del: d === '-' ? 0 : +d, path: p.join('\t') } })
    // CI's release commits name the pushed agent in a body line git does not read as a trailer; read that one line
    const bodyAgent = (f.slice(9).join(US).match(/^Agent: ([^\s]+@web-summit\.[a-z0-9-]+)\s*$/m) || [])[1] || null
    commits.push({ sha, parents: parents.split(' ').filter(Boolean), author, aI, cI, subject, agentT: list(agentT)[0] || bodyAgent, issues: list(issueT), for: list(forT), stat })
}
const bySha = new Map(commits.map(c => [c.sha, c]))
const isRelease = c => c.author === 'GitHub Actions' && /^site v\d+\.\d+\.\d+:/.test(c.subject)
const ancestors = (sha, out = new Set()) => { const st = [sha]; while (st.length) { const s = st.pop(); if (!s || out.has(s) || !bySha.has(s)) continue; out.add(s); st.push(...bySha.get(s).parents) } return out }
const vnum = v => v.slice(1).split('.').map(Number).reduce((a, n) => a * 1e4 + n, 0)

function line(c) {
    const kind = !c.parents.length ? 'initial' : isRelease(c) ? 'release' : c.parents.length > 1 ? 'merge' : 'work'
    const agent = kind === 'release' ? null : (c.agentT || (/@web-summit\./.test(c.author) ? c.author : null))
    const what = c.subject.replace(/^[^ :]+@web-summit\.[a-z0-9-]+: /, '').replace(/^site v[0-9.]+: /, '')
    const areas = {}
    for (const s of c.stat) { const a = areaOf(s.path); areas[a] ??= { files: 0, add: 0, del: 0 }; areas[a].files++; areas[a].add += s.add; areas[a].del += s.del }
    const paths = [...new Set(c.stat.map(s => folderOf(s.path)))].sort().slice(0, 12)
    const out = {
        sha: c.sha, short: c.sha.slice(0, 7), when: utc(c.aI), landed: utc(c.cI), kind, agent,
        by: kind === 'release' ? 'GitHub Actions' : agent || c.author, what,
        issues: c.issues, for: c.for, parents: c.parents.map(p => p.slice(0, 7)),
    }
    if (kind === 'release') {
        out.release = c.subject.match(/^site (v\d+\.\d+\.\d+):/)[1]
        out.pushed_by = c.agentT
        // the commits this release carried: what its parent reaches that the previous release did not
        const before = ancestors(c.parents[0])
        const prev = [...before].map(s => bySha.get(s)).filter(isRelease).sort((a, b) => vnum(b.subject.slice(5)) - vnum(a.subject.slice(5)))[0]
        const old = prev ? ancestors(prev.sha) : new Set()
        out.carries = commits.filter(x => before.has(x.sha) && !old.has(x.sha) && !isRelease(x)).map(x => x.sha.slice(0, 7))
    }
    Object.assign(out, { files: c.stat.length, add: c.stat.reduce((n, s) => n + s.add, 0), del: c.stat.reduce((n, s) => n + s.del, 0), areas, paths })
    return out
}

// 2. what the ledger has
const have = new Set()
if (fs.existsSync(DIR)) for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.jsonl'))) for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').filter(Boolean)) have.add(JSON.parse(l).sha)
const fresh = commits.filter(c => !have.has(c.sha)).map(line).sort((a, b) => a.when.localeCompare(b.when) || a.landed.localeCompare(b.landed))
if (flag('--check')) {
    if (fresh.length) { console.log(`runs: ${fresh.length} commit(s) of ${ref} are not in the ledger (newest ${fresh.at(-1).short}); run node admin/tools/runs.mjs`); process.exit(1) }
    console.log(`runs: the ledger has all ${commits.length} commits of ${ref}`); process.exit(0)
}
if (flag('--dry')) { for (const l of fresh) console.log(JSON.stringify(l)); console.log(`would append ${fresh.length}`); process.exit(0) }
fs.mkdirSync(DIR, { recursive: true })
for (const l of fresh) fs.appendFileSync(path.join(DIR, `${l.when.slice(0, 10)}.jsonl`), JSON.stringify(l) + '\n')
console.log(`runs: appended ${fresh.length} commit(s) to data/admin/runs/ (the ledger now has ${have.size + fresh.length}; ${ref} has ${commits.length})`)
