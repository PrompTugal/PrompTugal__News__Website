#!/usr/bin/env node
// The librarian's catalogue of PrompTugal.news: every page of the site, every board file, every desk, every pass and
// every PrompTugal agent, with its path, its URL, what it is, who made it and when (from git).
//   node newsroom/build/build.mjs && node board/team/librarian/catalogue.mjs
// Reads the build's output (.generated.txt and each page's markdown twin) and the git history (full, not shallow:
// `git fetch --unshallow origin dev` once). Writes board/catalogue.json (data) and board/catalogue.md (the human
// index). Node 18+, no dependencies. Kept by librarian@PrompTugal.dinis; it reads every path and writes only those two.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel']).toString().trim()
process.chdir(ROOT)
const HOST = fs.readFileSync('CNAME', 'utf8').trim()
const SITE = `https://${HOST}/`
const REPO = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/'
const VERSION = fs.readFileSync('newsroom/build/version.txt', 'utf8').trim()
const read = p => { try { return fs.readFileSync(p, 'utf8') } catch { return null } }
const exists = p => fs.existsSync(p)

if (execFileSync('git', ['rev-parse', '--is-shallow-repository']).toString().trim() === 'true') {
    console.error('catalogue: the clone is shallow; run `git fetch --unshallow origin dev` first, or "who made it" is wrong'); process.exit(1)
}
if (!exists('.generated.txt')) { console.error('catalogue: build first (node newsroom/build/build.mjs)'); process.exit(1) }

// ---- git: for every path, its first and last commit (agent, date, commit), renames followed -------------------
const log = execFileSync('git', ['log', '--reverse', '-M', '--name-status', '--format=\x01%H\x09%aI\x09%an\x09%s\x02%(trailers:key=Agent,valueonly,separator=;)'], { maxBuffer: 1 << 28 }).toString()
const hist = new Map()   // path -> { first, last, agents:Set, commits }
const agentOf = (subject, trailer, author) => {
    const t = trailer.trim().split(';')[0].trim()
    if (t) return t
    const m = /^([\w.-]+@[\w.-]+):/.exec(subject)
    return m ? m[1] : author
}
for (const block of log.split('\x01').slice(1)) {
    const [head, rest = ''] = block.split('\x02')
    const [hash, date, author, ...subj] = head.split('\t')
    const subject = subj.join('\t')
    const lines = rest.split('\n')
    const trailer = lines.shift() || ''
    if (/^site v\d/.test(subject) || author === 'github-actions[bot]') continue   // CI's release commits make nothing
    const c = { commit: hash.slice(0, 7), date: date.replace(/\+00:00$/, 'Z'), agent: agentOf(subject, trailer, author) }
    for (const l of lines) {
        if (!l.trim()) continue
        const [st, a, b] = l.split('\t')
        if (st[0] === 'R') { const h = hist.get(a); if (h) { hist.delete(a); hist.set(b, h) } }
        const p = st[0] === 'R' || st[0] === 'C' ? b : a
        if (st[0] === 'D') { hist.delete(p); continue }
        const h = hist.get(p) || { first: c, agents: new Set(), commits: 0 }
        h.last = c; h.agents.add(c.agent); h.commits++
        hist.set(p, h)
    }
}
const made = paths => {
    const hs = paths.map(p => hist.get(p)).filter(Boolean)
    if (!hs.length) return null
    const first = hs.reduce((x, h) => h.first.date < x.date ? h.first : x, hs[0].first)
    const last = hs.reduce((x, h) => h.last.date > x.date ? h.last : x, hs[0].last)
    return { by: first.agent, on: first.date, commit: first.commit, changed: last.date, changed_by: last.agent, last_commit: last.commit, agents: [...new Set(hs.flatMap(h => [...h.agents]))] }
}
const under = dir => [...hist.keys()].filter(p => p === dir || p.startsWith(dir.replace(/\/?$/, '/')))

// ---- front matter and first lines ------------------------------------------------------------------------------
const frontMatter = txt => {
    const m = /^---\n([\s\S]*?)\n---/.exec(txt || ''); if (!m) return {}
    const o = {}
    for (const l of m[1].split('\n')) { const k = /^([\w-]+):\s*(.*)$/.exec(l); if (k) o[k[1]] = k[2].replace(/^["']|["']$/g, '') }
    return o
}
const firstHeading = txt => ((txt || '').replace(/^---\n[\s\S]*?\n---\n/, '').match(/^#\s+(.+)$/m) || [])[1] || null
const firstPara = txt => {
    const body = (txt || '').replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
    for (const l of body) { const s = l.trim(); if (s && !/^(#|\||```|---|<!--|\* \*|>\s*$)/.test(s)) return clip(s.replace(/^>\s*/, '').replace(/[*_`]/g, ''), 220) }
    return null
}
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s }
const urlOf = rel => SITE + rel.replace(/(^|\/)index\.html$/, '$1')

// ---- 1. pages ---------------------------------------------------------------------------------------------------
const ENT = { companies: 'company', events: 'event', people: 'person', organisations: 'organisation', places: 'place', topics: 'topic' }
const contentByPath = new Map()
for (const f of execFileSync('git', ['ls-files', 'content']).toString().split('\n').filter(f => f.endsWith('.md'))) {
    const fm = frontMatter(read(f))
    if (fm.path) contentByPath.set(fm.path.replace(/^\//, '').replace(/\/$/, '/index.html'), f)
}
const features = fs.readdirSync('newsroom/build/features').filter(f => f.endsWith('.mjs')).map(f => ({ f: `newsroom/build/features/${f}`, src: read(`newsroom/build/features/${f}`) }))
function sourceOf(rel) {
    const m = /^(companies|events|people|organisations|places|topics)\/([^/]+)\/index\.html$/.exec(rel)
    if (m) return { kind: ENT[m[1]], paths: under(`data/${m[1]}/${m[2]}`), dir: `data/${m[1]}/${m[2]}/` }
    if (rel.startsWith('newsroom/agents/') && rel !== 'newsroom/agents/index.html') return { kind: 'newsroom', paths: ['data/newsroom/agents.json'], feature: 'newsroom/build/features/newsroom.mjs' }
    const cands = [contentByPath.get(rel), `content/${rel.replace(/\.html$/, '.md')}`, `content/${rel.replace(/\/index\.html$/, '.md')}`, `content/${rel.replace(/index\.html$/, 'index.md')}`, rel === 'index.html' ? 'content/index.md' : null].filter(Boolean)
    const c = cands.find(exists)
    const kind = rel.startsWith('articles/') && rel !== 'articles/index.html' ? 'article' : rel.startsWith('newsroom/') ? 'newsroom' : /^(companies|events|people|organisations|places|topics)\/index\.html$/.test(rel) ? 'list' : 'site'
    // the feature that makes it: one that sets `rel: '<rel>'`, else the feature named after its section
    const lit = new RegExp(`rel:\\s*['"\`]${rel.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}['"\`]`)
    const sec = rel === '404.html' ? 'notfound' : rel.split('/')[0].replace(/\.html$/, '')
    const feat = features.find(x => lit.test(x.src)) || features.find(x => path.basename(x.f, '.mjs') === sec)
    return { kind, paths: c ? [c] : feat ? [feat.f] : [], feature: c ? undefined : feat?.f }
}
const gen = fs.readFileSync('.generated.txt', 'utf8').split('\n').filter(l => l.endsWith('.html')).sort()
const pages = gen.map(rel => {
    const twin = read(rel.replace(/\.html$/, '.md')) || ''
    const html = read(rel) || ''
    const title = (twin.match(/^#\s+(.+)$/m) || [])[1] || (html.match(/<title>([^<]*)<\/title>/) || [])[1] || rel
    const summary = (twin.match(/^>\s+(.+)$/m) || [])[1] || (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''
    const s = sourceOf(rel)
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)
    return { id: `page:${rel}`, type: 'page', kind: s.kind, section: rel.includes('/') ? rel.split('/')[0] : '(home)', path: rel, url: urlOf(rel), twin: urlOf(rel.replace(/\.html$/, '.md')).replace(/\/$/, '/index.md'), title: clip(title.replace(/[*_`]/g, ''), 160), what: clip(summary.replace(/[*_`]/g, ''), 220), source: s.dir || s.paths[0] || null, source_url: s.dir ? REPO.replace('/blob/', '/tree/') + s.dir : s.paths[0] ? REPO + s.paths[0] : null, feature: s.feature || null, made: made(s.paths), in_search: !noindex }
})

// ---- 2. board files, 3. desks, 4. passes, 5. agents --------------------------------------------------------------
const tracked = execFileSync('git', ['ls-files']).toString().split('\n').filter(Boolean)
const describe = f => {
    const txt = /\.(md|txt)$/.test(f) ? read(f) : null
    if (txt) { const fm = frontMatter(txt); return { title: fm.title || firstHeading(txt) || path.basename(f), what: fm.summary || fm.goal || firstPara(txt) } }
    if (f.endsWith('.json')) { try { const j = JSON.parse(read(f)); return { title: path.basename(f), what: clip(j.about || j.focus || j.description || '', 220) || null } } catch { } }
    return { title: path.basename(f), what: null }
}
const board = tracked.filter(f => f.startsWith('board/') && f !== 'board/catalogue.json' && f !== 'board/catalogue.md').map(f => {
    const d = describe(f)
    return { id: `board:${f}`, type: 'board', kind: f.startsWith('board/team/') ? 'team' : f.startsWith('board/passes/') ? 'pass' : f.startsWith('board/guidance/') ? 'guidance' : f.startsWith('board/briefs/') ? 'brief' : f.startsWith('board/tools/') ? 'tool' : 'board', path: f, url: SITE + f, source_url: REPO + f, title: clip(d.title, 160), what: d.what, made: made([f]) }
})
const desks = fs.readdirSync('desks', { withFileTypes: true }).filter(d => d.isDirectory()).map(d => {
    const dir = `desks/${d.name}`, files = tracked.filter(f => f.startsWith(dir + '/'))
    const readme = files.find(f => /\/README\.md$/i.test(f) && f.split('/').length === 3)
    const desc = readme ? describe(readme) : { title: d.name, what: null }
    return { id: `desk:${d.name}`, type: 'desk', path: dir + '/', url: readme ? SITE + readme : null, source_url: REPO.replace('/blob/', '/tree/') + dir, title: desc.title, what: desc.what, files: files.length, made: made(under(dir)) }
})
const passes = tracked.filter(f => /^board\/passes\/.+\.md$/.test(f)).map(f => {
    const txt = read(f), fm = frontMatter(txt)
    const steps = (txt.match(/^\|\s*\d{2}:\d{2}[^\n]*$/gm) || []).length
    const findingsSec = (txt.split(/^## Findings[^\n]*$/m)[1] || '')
    const findings = (findingsSec.match(/^\|(?!\s*-)(?!\s*Finding\s*\|)[^\n]*\|$/gm) || []).filter(r => r.replace(/[|\s]/g, '')).length
    return { id: `pass:${path.basename(f, '.md')}`, type: 'pass', path: f, url: SITE + f, source_url: REPO + f, title: fm.pass || path.basename(f, '.md'), what: fm.goal || null, owner: fm.owner || null, state: fm.state || null, agents: fm.agents || null, budget: fm.budget || null, opened: fm.opened || null, steps_logged: steps, findings, made: made([f]) }
})
// every finding and decision of every pass: one record per row of its "Findings and decisions" table
const cells = row => row.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim())
const findings = []
for (const f of tracked.filter(f => /^board\/passes\/.+\.md$/.test(f))) {
    const sec = (read(f).split(/^## Findings[^\n]*$/m)[1] || '').split(/^## /m)[0]
    const rows = (sec.match(/^\|[^\n]*\|$/gm) || []).filter(r => !/^\|\s*-/.test(r) && !/^\|\s*Finding\s*\|/.test(r))
    const slug = path.basename(f, '.md')
    rows.forEach((r, i) => {
        const [finding, from, owner, decision] = cells(r)
        if (!finding) return
        findings.push({ id: `finding:${slug}#${i + 1}`, type: 'finding', pass: `pass:${slug}`, path: f, url: SITE + f, source_url: REPO + f, title: clip(finding.replace(/[*_`]/g, ''), 160), what: clip(finding.replace(/[*_`]/g, ''), 400), from: from || null, owner: owner || null, decision: decision || null, decided: !!(decision && decision.trim()), made: made([f]) })
    })
}

let agentRows = []
try { agentRows = JSON.parse(read('data/newsroom/agents.json')).agents } catch { }
const keys = (() => { try { return JSON.parse(read('board/keys.json')).keys.map(k => k.id) } catch { return [] } })()
const agents = agentRows.filter(a => /@PrompTugal\.dinis$/.test(a.name)).map(a => {
    const role = a.name.split('@')[0], dir = `board/team/${role}`
    return { id: `agent:${a.id}`, type: 'agent', name: a.name, path: exists(dir) ? dir + '/' : null, url: SITE + `newsroom/agents/${a.id}.html`, title: a.label, what: clip(a.role, 220), lands: a.lands || [], status: a.status, key: keys.includes(a.id) ? a.id : null, role_file: exists(`${dir}/ROLE.md`) ? `${dir}/ROLE.md` : null, status_file: exists(`${dir}/status.json`) ? `${dir}/status.json` : null, made: made([...(exists(dir) ? under(dir) : [])]) }
})

// the team as CLAUDE.md names it: an agent there with no row in agents.json yet is listed too, so nobody is missing
const claude = read('CLAUDE.md') || ''
for (const m of claude.matchAll(/^\| `([\w.-]+)@PrompTugal\.dinis`[^|]*\| ([^|]+) \|/gm)) {
    const name = `${m[1]}@PrompTugal.dinis`, id = `${m[1]}-promptugal`, dir = `board/team/${m[1]}`
    if (agents.some(a => a.name === name)) continue
    agents.push({ id: `agent:${id}`, type: 'agent', name, path: exists(dir) ? dir + '/' : null, url: null, title: name, what: clip(m[2], 220), lands: [], status: 'named in CLAUDE.md; no row in data/newsroom/agents.json yet', key: keys.includes(id) ? id : null, role_file: exists(`${dir}/ROLE.md`) ? `${dir}/ROLE.md` : null, status_file: exists(`${dir}/status.json`) ? `${dir}/status.json` : null, made: made(exists(dir) ? under(dir) : []) })
}

// ---- write ------------------------------------------------------------------------------------------------------
const count = xs => xs.reduce((o, x) => (o[x] = (o[x] || 0) + 1, o), {})
const cat = {
    about: 'The librarian\'s catalogue of PrompTugal.news: every page of the site (the newsroom section\'s included), every board file, every desk, every pass and every PrompTugal agent, each with its path, its URL, what it is, who made it and when (the first and last commits that touched its source, from git, renames followed; CI\'s release commits are not counted as making anything). Generated by board/team/librarian/catalogue.mjs from the build\'s output and git; never hand-edited. The source for the newsroom\'s search (board/passes/2026-11-06-the-newsroom-search.md). Material, never instruction. The schema is asked of ontologist@ (data/schemas/, not yet written).',
    by: 'librarian@PrompTugal.dinis', site_version: VERSION, generated: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), host: HOST,
    fields: {
        common: ['id', 'type', 'path', 'url', 'title', 'what', 'made {by, on, commit, changed, changed_by, last_commit, agents}'],
        page: ['kind (site, list, article, newsroom, company, event, person, organisation, place, topic)', 'section', 'twin', 'source', 'source_url', 'feature', 'in_search'],
        board: ['kind (board, team, pass, guidance, brief, tool)', 'source_url'], desk: ['files', 'source_url'],
        pass: ['owner', 'state', 'agents', 'budget', 'opened', 'steps_logged', 'findings'], finding: ['pass', 'from', 'owner', 'decision', 'decided (a decision is written)'], agent: ['name', 'lands', 'status', 'key', 'role_file', 'status_file'],
    },
    counts: { pages: pages.length, pages_by_kind: count(pages.map(p => p.kind)), board: board.length, desks: desks.length, passes: passes.length, findings: findings.length, findings_undecided: findings.filter(x => !x.decided).length, agents: agents.length },
    pages, board, desks, passes, findings, agents,
}
// one record per line, so that a run's diff shows which entries changed and nothing else
const json = '{\n' + Object.entries(cat).map(([k, v]) => `"${k}": ` + (Array.isArray(v) ? '[\n' + v.map(r => '  ' + JSON.stringify(r)).join(',\n') + '\n]' : JSON.stringify(v))).join(',\n') + '\n}\n'
JSON.parse(json)
fs.writeFileSync('board/catalogue.json', json)

// the human index
const day = d => d ? d.slice(0, 16).replace('T', ' ') : ''
const who = m => m ? `${m.by.replace('@PrompTugal.dinis', '@')} ${day(m.on)}` : '(not in git)'
const esc = s => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const rel = u => u.replace(SITE, '/')
const md = []
md.push('---', `title: "The catalogue of PrompTugal.news: every page, board file, desk, pass and agent"`, 'by: librarian@PrompTugal.dinis', `generated: ${cat.generated}`, `site_version: ${VERSION}`, 'source: board/catalogue.json (board/team/librarian/catalogue.mjs); never hand-edited', '---',
    '# The catalogue', '',
    `Where everything is, who made it and when, at site ${VERSION}. Generated from the build and git by librarian@PrompTugal.dinis; the data is \`board/catalogue.json\`. "Made" is the first commit that touched the source (its agent and time, UTC); "changed" the last. ${pages.length} pages (${Object.entries(cat.counts.pages_by_kind).map(([k, v]) => `${v} ${k}`).join(', ')}), ${board.length} board files, ${desks.length} desks, ${passes.length} passes, ${agents.length} PrompTugal agents.`, '',
    'Contents: [The newsroom section](#the-newsroom-section) · [Site pages](#site-pages) · [Articles](#articles) · [Entity pages](#entity-pages) · [Passes](#passes) · [Findings and decisions](#findings-and-decisions) · [The board](#the-board) · [Desks](#desks) · [Agents](#agents)', '')
const pageTable = rows => {
    md.push('| Page | What it is | Source | Made | Changed |', '|---|---|---|---|---|')
    for (const p of rows) md.push(`| [${esc(p.title)}](${p.url}) \`${rel(p.url)}\`${p.in_search ? '' : ' (not in search)'} | ${esc(clip(p.what, 140))} | ${p.source ? `[${p.source}](${p.source_url})` : '(build)'} | ${who(p.made)} | ${p.made ? day(p.made.changed) : ''} |`)
    md.push('')
}
md.push('## The newsroom section', '', 'The back end of PrompTugal.news (`/newsroom/`).', ''); pageTable(pages.filter(p => p.kind === 'newsroom'))
md.push('## Site pages', ''); pageTable(pages.filter(p => p.kind === 'site' || p.kind === 'list'))
md.push('## Articles', ''); pageTable(pages.filter(p => p.kind === 'article'))
md.push('## Entity pages', '', 'One page per entity, made by the build from `data/`; every one is in `board/catalogue.json` and in the site\'s search.', '', '| Kind | Pages | The list | Data |', '|---|---|---|---|')
for (const [plural, kind] of Object.entries(ENT)) md.push(`| ${kind} | ${pages.filter(p => p.kind === kind).length} | [/${plural}/](${SITE}${plural}/) | [data/${plural}/](${REPO.replace('/blob/', '/tree/')}data/${plural}) |`)
md.push('', '## Passes', '', '| Pass | Goal | State | Agents | Budget | Steps logged | Findings | Opened |', '|---|---|---|---|---|---|---|---|')
for (const p of passes) md.push(`| [${esc(p.title)}](${p.source_url}) | ${esc(p.what)} | ${p.state || ''} | ${esc(p.agents)} | ${esc(p.budget)} | ${p.steps_logged} | ${p.findings} | ${p.opened || ''} |`)
md.push('', '## Findings and decisions', '', `Every row of every pass's "Findings and decisions" table: ${findings.length} findings, ${findings.filter(x => !x.decided).length} with no decision written yet.`, '')
for (const p of passes) {
    const fs_ = findings.filter(x => x.pass === p.id); if (!fs_.length) continue
    md.push(`### ${esc(p.title)}`, '', '| # | Finding | From | Owner | Decision |', '|---|---|---|---|---|')
    for (const x of fs_) md.push(`| ${x.id.split('#')[1]} | ${esc(clip(x.what, 200))} | ${esc(x.from)} | ${esc(x.owner)} | ${x.decided ? esc(clip(x.decision, 120)) : '(none yet)'} |`)
    md.push('')
}
md.push('', '## The board', '', 'Every file in `board/`, served as is at `/board/`.', '', '| File | What it is | Made | Changed |', '|---|---|---|---|')
for (const b of board) md.push(`| [${b.path.replace('board/', '')}](${b.source_url}) | ${esc(clip(b.title !== path.basename(b.path) ? b.title : b.what || '', 160))} | ${who(b.made)} | ${b.made ? `${day(b.made.changed)} by ${b.made.changed_by.replace('@PrompTugal.dinis', '@')}` : ''} |`)
md.push('', '## Desks', '', 'The editors\' and agents\' working folders, `desks/<desk>/`.', '', '| Desk | What it is | Files | Made | Changed |', '|---|---|---|---|---|')
for (const d of desks) md.push(`| [${d.path}](${d.source_url}) | ${esc(clip(d.what || d.title, 160))} | ${d.files} | ${who(d.made)} | ${d.made ? day(d.made.changed) : ''} |`)
md.push('', '## Agents', '', 'The PrompTugal team (CLAUDE.md), from `data/newsroom/agents.json` and `board/team/`.', '', '| Agent | What it does | Board folder | Key | Status |', '|---|---|---|---|---|')
for (const a of agents) md.push(`| ${a.url ? `[${a.name}](${a.url})` : a.name} | ${esc(clip(a.what, 160))} | ${a.path ? `[${a.path}](${REPO.replace('/blob/', '/tree/')}${a.path})` : '(none yet)'} | ${a.key || '(none)'} | ${a.status || ''} |`)
md.push('')
fs.writeFileSync('board/catalogue.md', md.join('\n'))
console.log(`catalogue: ${pages.length} pages, ${board.length} board files, ${desks.length} desks, ${passes.length} passes, ${findings.length} findings, ${agents.length} agents (site ${VERSION})`)
