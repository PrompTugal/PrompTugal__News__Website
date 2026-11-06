// The reality tree's generated parts. The curator's hand-written lines are never touched: this writes only between
// <!-- library:generated --> and <!-- /library:generated -->, plus reality/domains.json (seeded once, then the
// owner's) and reality/for-conductor.md (the lines where REALITY.md and the evidence disagree).
import fs from 'node:fs'
import path from 'node:path'
import { readJson, readText, cmp, mdCell, dateWords, stable, GENERATOR } from './util.mjs'
import { cardUrl } from './cards.mjs'

export const MARK_BEGIN = '<!-- library:generated -->'
export const MARK_END = '<!-- /library:generated -->'

export const DEFAULT_DOMAINS = {
  about: 'The domains of the reality tree and the rules that put a card in one. A card goes to the first rule that matches (all its conditions): call_prefix and class read the call number, path_prefix and path_regex the card\'s path, type and kind the catalogue. A card no rule takes falls into "misc" and is flagged (ST18). To add a domain, add an entry and its rules; the generator reads this file and never rewrites it.',
  domains: [
    { id: 'publication', dir: 'publication', name: 'Publication', owner: 'journalist@PrompTugal.dinis', takes_in: 'articles, the brand, the brief' },
    { id: 'pages', dir: 'pages', name: 'Pages', owner: 'dev.pages@PrompTugal.dinis', takes_in: 'the front page, site pages, lists, and the entity pages (companies, events, people, organisations, places, topics)' },
    { id: 'newsroom', dir: 'newsroom', name: 'Newsroom', owner: 'dev@PrompTugal.dinis', takes_in: 'the pages under /newsroom/' },
    { id: 'data', dir: 'data', name: 'Data', owner: 'ontologist@PrompTugal.dinis', takes_in: 'the ontology and the schemas' },
    { id: 'search', dir: 'search', name: 'Search, ask and the page tool API', owner: 'dev.search@PrompTugal.dinis', takes_in: 'the search and ask pages' },
    { id: 'graphs', dir: 'graphs', name: 'Graphs and visualisation', owner: 'dev.graphs@PrompTugal.dinis', takes_in: 'the graph, explorer and gravity pages' },
    { id: 'build-and-ci', dir: 'build-and-ci', name: 'Build, gate, CI and release', owner: 'dev@PrompTugal.dinis', takes_in: 'build, tools, the gate, CI' },
    { id: 'agents', dir: 'agents', name: 'Agents', owner: 'conductor@PrompTugal.dinis', takes_in: 'agents, roles, keys, inboxes, policies, run reports, reader findings' },
    { id: 'process', dir: 'process', name: 'Passes, budgets, decisions and the story pipeline', owner: 'conductor@PrompTugal.dinis', takes_in: 'passes, findings, decisions, plans, tasks, desks, stories, guidance and the ideas ledger, the board\'s own files' },
    { id: 'vaults-and-media', dir: 'vaults-and-media', name: 'Vaults, media, reader accounts, billing and backups', owner: 'security@PrompTugal.dinis', takes_in: 'evidence, captures, vaults' },
    { id: 'observability', dir: 'observability', name: 'Observability', owner: 'observability@PrompTugal.dinis', takes_in: 'the read counter and its report' },
    { id: 'library', dir: 'library', name: 'Library', owner: 'librarian@PrompTugal.dinis', takes_in: 'everything of the library' },
    { id: 'misc', dir: 'misc', name: 'Not yet placed', owner: 'librarian@PrompTugal.dinis', takes_in: 'cards no rule takes (flagged, ST18)' },
  ],
  rules: [
    { id: 'd-library', when: { call_prefix: 'LIB.' }, domain: 'library' },
    { id: 'd-observability', when: { call_prefix: 'RDR.OBS' }, domain: 'observability' },
    { id: 'd-team', when: { class: 'TEAM' }, domain: 'agents' },
    { id: 'd-readers', when: { class: 'RDR' }, domain: 'agents' },
    { id: 'd-evidence', when: { class: 'EVD' }, domain: 'vaults-and-media' },
    { id: 'd-build', when: { class: 'BLD' }, domain: 'build-and-ci' },
    { id: 'd-work', when: { class: 'WRK' }, domain: 'process' },
    { id: 'd-guidance', when: { class: 'GDN' }, domain: 'process' },
    { id: 'd-brief', when: { call_prefix: 'GEN.BRIEF' }, domain: 'publication' },
    { id: 'd-gen', when: { class: 'GEN' }, domain: 'process' },
    { id: 'd-search', when: { path_regex: '^(search|ask)(/|\\.|$)' }, domain: 'search' },
    { id: 'd-graphs', when: { path_regex: '^(graph|explorer|gravity|world|industry)(/|\\.|$)' }, domain: 'graphs' },
    { id: 'd-schemas', when: { call_prefix: 'DAT.SCH' }, domain: 'data' },
    { id: 'd-ontology', when: { call_prefix: 'DAT.ONT' }, domain: 'data' },
    { id: 'd-entities', when: { class: 'DAT' }, domain: 'pages' },
    { id: 'd-newsroom', when: { call_prefix: 'PUB.NEWS' }, domain: 'newsroom' },
    { id: 'd-articles', when: { call_prefix: 'PUB.ART' }, domain: 'publication' },
    { id: 'd-brand', when: { call_prefix: 'PUB.BRAND' }, domain: 'publication' },
    { id: 'd-pub', when: { class: 'PUB' }, domain: 'pages' },
  ],
  fallback: 'misc',
}

function matches(when, c) {
  const call = c.call.split(' ')[0]
  for (const [k, v] of Object.entries(when)) {
    if (k === 'call_prefix') { if (!call.startsWith(v)) return false }
    else if (k === 'class') { if (call.split('.')[0] !== v) return false }
    else if (k === 'path_prefix') { if (!(c.where.path || '').startsWith(v)) return false }
    else if (k === 'path_regex') { if (!new RegExp(v).test(c.where.path || '')) return false }
    else if (k === 'type') { if (c.type !== v) return false }
    else if (k === 'kind') { if (c.kind !== v) return false }
    else return false
  }
  return Object.keys(when).length > 0
}

export function loadDomains(libDir) {
  const file = path.join(libDir, 'reality/domains.json')
  if (!fs.existsSync(file)) return { spec: DEFAULT_DOMAINS, seeded: true }
  return { spec: readJson(file), seeded: false }
}

export function domainOf(spec, c) {
  for (const r of spec.rules) if (matches(r.when, c)) return r.domain
  return spec.fallback
}

// replace the generated block of a hand file, or add it before the anchor (or at the end)
export function withBlock(text, block, anchorRe) {
  const b = text.indexOf(MARK_BEGIN)
  const e = text.indexOf(MARK_END)
  const full = `${MARK_BEGIN}\n${block.trim()}\n${MARK_END}`
  if (b >= 0 && e > b) return text.slice(0, b) + full + text.slice(e + MARK_END.length)
  const lines = text.replace(/\n+$/, '').split('\n')
  const at = anchorRe ? lines.findIndex((l) => anchorRe.test(l)) : -1
  if (at >= 0) { lines.splice(at, 0, full, ''); return lines.join('\n') + '\n' }
  return lines.join('\n') + '\n\n' + full + '\n'
}

function domainBlock(d, list, ctx) {
  const cur = list.filter((c) => c.status === 'current').length
  const sup = list.filter((c) => c.status === 'superseded').length
  const wd = list.filter((c) => c.status === 'withdrawn').length
  const out = ['## The library\'s cards in this domain (generated)', '']
  out.push(`${list.length} cards (${cur} current, ${sup} superseded, ${wd} withdrawn), from the catalogue generated ${ctx.catalogue.generated || 'unknown'} at site ${ctx.catalogue.site_version || '?'}; by ${GENERATOR}, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.`, '')
  const bySub = new Map()
  for (const c of list) { const k = c.call.split(' ')[0]; bySub.set(k, (bySub.get(k) || 0) + 1) }
  if (bySub.size) {
    out.push('| Call class | Cards |', '|---|---|')
    for (const k of [...bySub.keys()].sort(cmp)) out.push(`| \`${k}\` | ${bySub.get(k)} |`)
    out.push('')
    const newest = list.filter((c) => c.status !== 'withdrawn').sort((a, b) => cmp(b.acc, a.acc) || cmp(a.id, b.id)).slice(0, 5)
    out.push('Newest five accessions:', '')
    for (const c of newest) {
      const url = cardUrl(c)
      out.push(`- \`${c.acc}\` ${url ? `[${mdCell(c.title)}](${url})` : mdCell(c.title)} (\`${c.call}\`)`)
    }
  } else out.push('No cards fall in this domain yet.')
  return out.join('\n')
}

function masterBlock(spec, byDomain, total, ctx) {
  const out = ['## The library\'s cards by domain (generated)', '']
  out.push(`${total} cards in all, from the catalogue generated ${ctx.catalogue.generated || 'unknown'} at site ${ctx.catalogue.site_version || '?'}. A card is counted in one domain, the first rule of [domains.json](domains.json) that takes it. Generated by ${GENERATOR}.`, '')
  out.push('| Domain | Cards | Newest accession |', '|---|---|---|')
  for (const d of spec.domains) {
    const list = byDomain.get(d.id) || []
    if (!list.length && d.id === 'misc') continue
    const newest = list.filter((c) => c.status !== 'withdrawn').sort((a, b) => cmp(b.acc, a.acc))[0]
    out.push(`| [${mdCell(d.name)}](${d.dir}/index.md) | ${list.length} | ${newest ? `\`${newest.acc}\`` : ''} |`)
  }
  return out.join('\n')
}

// the EXISTS lines of each domain file, with the state of their evidence
export function readExists(ctx, spec) {
  const out = []
  for (const d of spec.domains) {
    const f = path.join(ctx.libDir, 'reality', d.dir, 'index.md')
    if (!fs.existsSync(f)) continue
    const lines = fs.readFileSync(f, 'utf8').split('\n')
    let inExists = false
    lines.forEach((l, i) => {
      if (/^## /.test(l)) inExists = /^## EXISTS\b/.test(l)
      if (l.startsWith(MARK_BEGIN)) inExists = false
      if (!inExists || !/^\s*- /.test(l)) return
      const ev = /[Ee]vidence:\s*(.*)$/.exec(l)
      const paths = ev ? [...ev[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]).filter((p) => /^[A-Za-z0-9_.@-]+(\/[A-Za-z0-9_.@<>*-]*)+\/?$|^[A-Za-z0-9_.@-]+\.[a-z]{2,4}$/.test(p)) : []
      const missing = paths.filter((p) => !/[<>*]/.test(p) && !fs.existsSync(path.join(ctx.root, p)))
      out.push({ domain: d.id, file: `reality/${d.dir}/index.md`, line: i + 1, text: l.replace(/^\s*- /, '').slice(0, 110), evidenced: paths.length > 0, paths: paths.length, missing })
    })
  }
  return out
}

function countDir(root, rel, pred) {
  try { return fs.readdirSync(path.join(root, rel), { withFileTypes: true }).filter(pred).length } catch { return null }
}

// re-checks of the curator's carried differences: what REALITY.md says now against what the repository has now
const RECHECKS = [
  {
    match: /schemas/i, what: 'schemas in data/schemas/',
    says: (r) => { const m = /(\d+) schemas in `data\/schemas\/`/.exec(r); return m ? Number(m[1]) : null },
    actual: (root) => countDir(root, 'data/schemas', (e) => e.isFile() && e.name.endsWith('.json')),
  },
  {
    match: /companies/i, what: 'company folders in data/companies/',
    says: (r) => { const m = /`data\/companies\/<id>\/` \((\d+) companies\)/.exec(r) || /`companies\/` \((\d+),/.exec(r); return m ? Number(m[1]) : null },
    actual: (root) => countDir(root, 'data/companies', (e) => e.isDirectory()),
  },
  {
    match: /events/i, what: 'event folders in data/events/',
    says: (r) => { const m = /Events? (\d+)/.exec(r) || /\bevents[^.\n]{0,40}?\((\d+)\b/i.exec(r); return m ? Number(m[1]) : null },
    actual: (root) => countDir(root, 'data/events', (e) => e.isDirectory()),
  },
  {
    match: /checks/i, what: 'numbered checks listed in newsroom/build/validate.js',
    says: (r) => { const m = /validate\.js`, (\d+) checks/.exec(r); return m ? Number(m[1]) : null },
    actual: (root) => { const t = readText(path.join(root, 'newsroom/build/validate.js')); return t ? t.split('\n').slice(0, 40).filter((l) => /^\/\/ {1,3}\d+\. /.test(l)).length : null },
  },
  {
    match: /Articles/, what: 'markdown articles in content/articles/',
    says: (r) => (/Articles: `content\/articles\/newsroom-status-four-days-out\.md`/.test(r) ? 1 : null),
    actual: (root) => countDir(root, 'content/articles', (e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md'),
  },
  {
    match: /editorial board/i, what: 'content/about/board.md', fmt: (n) => (n ? 'a board page' : 'no board page'),
    says: (r) => (/no editorial board page/.test(r) ? 0 : null),
    actual: (root) => (fs.existsSync(path.join(root, 'content/about/board.md')) ? 1 : 0),
  },
]

function parseChangelogRows(text) {
  const rows = []
  let on = false
  for (const l of text.split('\n')) {
    if (/^## Where REALITY\.md and the evidence differ/.test(l)) { on = true; continue }
    if (on && /^## /.test(l)) break
    if (!on || !l.startsWith('|') || /^\|\s*-/.test(l) || /REALITY\.md says/.test(l)) continue
    const c = l.split('|').slice(1, -1).map((s) => s.trim())
    if (c.length >= 3) rows.push({ says: c[0], shows: c[1], where: c[2] })
  }
  return rows
}

// paths that REALITY.md names between backticks and that are not in the repository
function realityMissingPaths(ctx, realityText) {
  const out = []
  const tops = /^(board|content|data|desks|newsroom|assets|design|articles|\.github)\//
  realityText.split('\n').forEach((l, i) => {
    for (const m of l.matchAll(/`([^`]+)`/g)) {
      const p = m[1].replace(/[.,;:]+$/, '')
      if (!tops.test(p) || /[<>*{}\s#=]/.test(p) || /^https?:/.test(p)) continue
      if (!fs.existsSync(path.join(ctx.root, p))) out.push({ line: i + 1, path: p })
    }
  })
  const seen = new Set()
  return out.filter((o) => { const k = o.path; if (seen.has(k)) return false; seen.add(k); return true })
}

export function forConductor(ctx, spec, exists) {
  const realityText = readText(path.join(ctx.root, 'REALITY.md'))
  const rows = parseChangelogRows(readText(path.join(ctx.libDir, 'reality/changelog.md')))
  const out = ['---', 'title: "For the conductor: where REALITY.md and the evidence disagree"', 'by: librarian@PrompTugal.dinis', `generated: ${JSON.stringify('by ' + GENERATOR + ' from REALITY.md, the repository and reality/changelog.md; catalogue as generated ' + (ctx.catalogue.generated || 'unknown'))}`, `site_version: ${JSON.stringify(ctx.catalogue.site_version || '')}`, 'for: conductor@PrompTugal.dinis', '---', '']
  out.push('# For the conductor: where REALITY.md and the evidence disagree', '')
  out.push('Material for REALITY.md, which is the conductor\'s file and is never edited by the library. Each row below is carried from the curator\'s first accession ([changelog.md](changelog.md)) and re-read against REALITY.md and the repository as they stand now. The tree feeds REALITY.md; it never replaces it.', '')
  let differ = 0
  let agree = 0
  let carried = 0
  const table = []
  for (const r of rows) {
    const rc = RECHECKS.find((x) => x.match.test(r.says))
    let state = 'carried from the changelog, not re-checked by a script'
    if (rc) {
      const said = rc.says(realityText)
      const have = rc.actual(ctx.root)
      if (said === null) { state = `REALITY.md no longer says this (not found now); repository has ${have} (${rc.what})`; agree++ }
      else if (have === null) { state = `could not read the repository (${rc.what})`; carried++ }
      else if (said !== have) { state = `**still differs**: REALITY.md says ${rc.fmt ? rc.fmt(said) : said}, the repository has ${rc.fmt ? rc.fmt(have) : have} (${rc.what})`; differ++ }
      else { state = `agrees now: both ${have} (${rc.what})`; agree++ }
    } else carried++
    table.push(`| ${mdCell(r.says)} | ${mdCell(r.shows)} | ${mdCell(state)} |`)
  }
  out.push(`## 1. Differences carried and re-checked (${rows.length}: ${differ} still differ, ${agree} agree now or are gone, ${carried} carried)`, '')
  if (table.length) out.push('| REALITY.md says | The repository shows | Re-check now |', '|---|---|---|', ...table)
  else out.push('The changelog has no table of differences to carry.')
  out.push('')
  const missing = realityMissingPaths(ctx, realityText)
  out.push(`## 2. Paths REALITY.md names that are not in the repository (${missing.length})`, '')
  if (missing.length) { out.push('Each is a claim no file backs (or a path since moved); the line is the line of REALITY.md.', '', '| Line | Path |', '|---|---|'); for (const m of missing.slice(0, 40)) out.push(`| ${m.line} | \`${m.path}\` |`); if (missing.length > 40) out.push('', `... and ${missing.length - 40} more.`) }
  else out.push('None: every path REALITY.md names between backticks exists.')
  out.push('')
  const unev = exists.filter((e) => !e.evidenced)
  const unres = exists.filter((e) => e.missing.length)
  out.push(`## 3. The tree's own EXISTS lines (${exists.length}): ${unev.length} without evidence, ${unres.length} whose evidence path is missing`, '')
  out.push('An EXISTS line without evidence is a claim and is not counted. A line whose evidence path is missing may have moved: reread it.', '')
  if (unev.length || unres.length) {
    out.push('| Domain file | Line | State | The line |', '|---|---|---|---|')
    for (const e of [...unev, ...unres.filter((x) => x.evidenced)].slice(0, 40)) out.push(`| \`${e.file}\` | ${e.line} | ${e.evidenced ? 'evidence missing: ' + e.missing.map((m) => '`' + m + '`').join(', ') : 'no evidence'} | ${mdCell(e.text)} |`)
  } else out.push('Every EXISTS line names evidence and every evidence path resolves.')
  out.push('', '## 4. What the tree holds that REALITY.md does not say', '')
  out.push('Carried from the changelog row "No mention at all" (the ABP policies, the per-agent inboxes, decision pages, the notes and stories sections, the Portugal section, the verification tool, the budgets file, the passes, the backup tool, the catalogue and the library). Candidates to add to REALITY.md, by the conductor\'s choice.', '')
  return { text: out.join('\n') + '\n', differ, agree, carried, missing: missing.length, unevidenced: unev.length, unresolved: unres.length, rows: rows.length }
}

export function buildReality(ctx, cards) {
  const { spec, seeded } = loadDomains(ctx.libDir)
  const byDomain = new Map()
  for (const d of spec.domains) byDomain.set(d.id, [])
  const unplaced = []
  for (const c of cards) {
    const d = domainOf(spec, c)
    if (!byDomain.has(d)) byDomain.set(d, [])
    byDomain.get(d).push(c)
    if (d === spec.fallback) unplaced.push(c)
  }
  const files = {}
  if (seeded) files['reality/domains.json'] = stable(DEFAULT_DOMAINS, 1) + '\n'
  for (const d of spec.domains) {
    const rel = `reality/${d.dir}/index.md`
    const f = path.join(ctx.libDir, rel)
    const list = byDomain.get(d.id) || []
    if (d.id === 'misc' && !list.length && !fs.existsSync(f)) continue
    let text = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : `# ${d.name}: EXISTS\n\n**Domain:** \`${d.dir}\` | **Owner:** ${d.owner}\n\n${d.takes_in}.\n\nNo hand-written lines yet; the curator adds what EXISTS here, each with its evidence.\n`
    files[rel] = withBlock(text, domainBlock(d, list, ctx), /^See also:/)
  }
  const mf = path.join(ctx.libDir, 'reality/index.md')
  const master = fs.existsSync(mf) ? fs.readFileSync(mf, 'utf8') : `# Reality: the holdings by subject (master index)\n\nThe library's reality tree.\n`
  files['reality/index.md'] = withBlock(master, masterBlock(spec, byDomain, cards.length, ctx), /^## How to read the counts/)
  // the exists lines are read from the hand text that is already on disk (a block never holds EXISTS lines)
  const exists = readExists(ctx, spec)
  const fc = forConductor(ctx, spec, exists)
  files['reality/for-conductor.md'] = fc.text
  return { files, byDomain, unplaced, exists, conductor: fc, spec }
}
