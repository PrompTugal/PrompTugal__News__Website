// The stocktake (ARCHITECTURE.md section 5) and the weeding report. A finding has a code, a severity and an owner;
// the library flags and never fixes another's file. The dated file is named after the catalogue it counts, so a
// second run of the same inputs writes the same file.
import fs from 'node:fs'
import path from 'node:path'
import { readJson, readText, readLines, walk, cmp, mdCell, dateWords, stable, GENERATOR } from './util.mjs'
import { holdingsOf } from './cards.mjs'
import { formIndex, claudeTable, authId } from './authority.mjs'
import { danglingLinks } from './links.mjs'
import { secretFindings } from './secrets.mjs'

export const CODES = [
  ['ST01', 'holding with no card', 'fault', 'librarian@'],
  ['ST02', 'card whose file is gone (withdrawn, kept)', 'info', 'the maker named on the card'],
  ['ST03', 'dangling link, or a link whose inverse is missing', 'fault', 'librarian@'],
  ['ST04', 'orphan: no link to or from another card', 'info', 'the maker named on the card'],
  ['ST05', 'card without provenance or evidence', 'fault', 'librarian@'],
  ['ST06', 'duplicate call number or card id', 'fault', 'librarian@'],
  ['ST07', 'gap in the accession numbers of a day', 'warning', 'librarian@'],
  ['ST08', 'an agent named on a card with no authority record', 'warning', 'librarian@ (authority), the agent'],
  ['ST09', 'subject heading not in the vocabulary', 'fault', 'librarian@'],
  ['ST10', 'reality file over 250 lines (warning) or 300 (fault)', 'warning', 'librarian@'],
  ['ST11', 'EXISTS line without evidence, or whose evidence path is missing', 'warning', 'librarian@ (curator)'],
  ['ST12', 'REALITY.md claim without a tree entry', 'not run', 'conductor@'],
  ['ST13', 'call slip unanswered over two wakes', 'not run', 'librarian@'],
  ['ST14', 'agent named in CLAUDE.md with no agents.json row, key or ROLE.md', 'warning', 'the agent, conductor@'],
  ['ST15', 'pass finding with no owner', 'warning', 'conductor@'],
  ['ST16', 'a key shape, token or contact detail in what the library would publish', 'blocker', 'security@'],
  ['ST17', 'a wait on Dinis older than a day', 'warning', 'conductor@'],
  ['ST18', 'card in no domain of the reality tree (falls to misc)', 'warning', 'librarian@'],
]
const NOT_RUN = {
  ST12: 'REALITY.md claims are read by reality/for-conductor.md (section 2); matching each to a tree entry waits for a round that tags entries by claim',
  ST13: 'the reference desk is round 3: there are no call slips yet',
}
const HANDLE = /\b([a-z][a-z0-9.\-]*)@(PrompTugal|web-summit)\.(dinis|vicky|indi)\b/gi
const EXAMPLES = 10

export function runStocktake(ctx, cards, extra) {
  const { root, libDir, catalogue } = ctx
  const findings = []
  const add = (code, subject, text) => findings.push({ code, subject, text })

  // ST01 / ST02
  const ids = new Set(cards.map((c) => c.id))
  for (const h of holdingsOf(catalogue)) if (!ids.has(h.id)) add('ST01', h.id, 'a holding of the catalogue with no card')
  for (const c of cards) if (c.status === 'withdrawn') add('ST02', c.id, `withdrawn: ${c.title}`)

  // ST03 / ST09
  const authIds = new Set(ctx.authority.records.map((r) => r.id))
  for (const k of Object.keys(ctx.entities)) for (const r of ctx.entities[k]) authIds.add(r.id)
  const subjIds = new Set((ctx.subjects || []).map((s) => s.id))
  for (const b of danglingLinks(cards, authIds, subjIds)) {
    if (b.to.startsWith('subj:')) add('ST09', b.card, `${b.rel} to the subject ${b.to}, which is not in the vocabulary`)
    else add('ST03', b.card, `${b.rel} to ${b.to}: ${b.why}`)
  }

  // ST04 orphans
  const orphans = []
  for (const c of cards) {
    if (c.status === 'withdrawn') continue
    const linked = c.links.some((l) => l.rel !== 'made_by' && !l.to.startsWith('auth:') && !l.to.startsWith('subj:'))
    const series = c.type === 'idea' || c.type === 'question' || c.type === 'concept'
    if (!linked && !series) orphans.push(c)
  }
  for (const c of orphans) add('ST04', c.id, `no link to or from another card (${c.call.split(' ')[0]})`)

  // ST05 / ST06
  const seenId = new Set()
  const seenCall = new Set()
  for (const c of cards) {
    const pv = c.provenance
    if (!pv || !pv.catalogued || !pv.catalogued.rule || !Array.isArray(pv.evidence) || !pv.evidence.length) add('ST05', c.id, 'no provenance: evidence and catalogued are both needed')
    if (seenId.has(c.id)) add('ST06', c.id, 'duplicate card id')
    seenId.add(c.id)
    if (seenCall.has(c.call)) add('ST06', c.id, `duplicate call number ${c.call}`)
    seenCall.add(c.call)
  }

  // ST07
  const reg = readLines(path.join(libDir, 'accession-register.jsonl')).map((l) => JSON.parse(l)).filter((l) => !l.event)
  const days = new Map()
  for (const l of reg) { const m = /^ACC-(\d{8})-(\d+)$/.exec(l.acc); if (m) { if (!days.has(m[1])) days.set(m[1], new Set()); days.get(m[1]).add(Number(m[2])) } }
  for (const [d, set] of [...days].sort((a, b) => cmp(a[0], b[0]))) {
    const max = Math.max(...set)
    if (set.size !== max) add('ST07', `ACC-${d}`, `${max - set.size} accession number(s) missing from the day's 1 to ${max}`)
  }

  // ST08: names with no authority record
  const fidx = formIndex(ctx.authority.records)
  const unknown = new Map()
  const seeName = (name, id) => {
    if (!name) return
    if (fidx.has(String(name).toLowerCase())) return
    if (!unknown.has(name)) unknown.set(name, { n: 0, ex: id })
    unknown.get(name).n++
  }
  for (const c of cards) {
    const pv = c.provenance || {}
    if (pv.made) seeName(pv.made.by, c.id)
    if (pv.changed) seeName(pv.changed.by, c.id)
    for (const m of `${c.title} ${c.what}`.matchAll(HANDLE)) seeName(m[0], c.id)
  }
  for (const [name, v] of [...unknown].sort((a, b) => cmp(a[0], b[0]))) add('ST08', name, `named on ${v.n} card(s), for example ${v.ex}; no authority record`)

  // ST10: reality files
  const rdir = path.join(libDir, 'reality')
  for (const f of walk(rdir, (p) => p.endsWith('.md'))) {
    const n = readText(f).split('\n').length
    const rel = 'reality/' + path.relative(rdir, f).split(path.sep).join('/')
    if (n > 300) add('ST10', rel, `${n} lines, over 300: split before the next addition`)
    else if (n > 250) add('ST10', rel, `${n} lines, over 250: a warning`)
  }

  // ST11 / ST18
  for (const e of extra.exists) {
    if (!e.evidenced) add('ST11', `${e.file}:${e.line}`, `EXISTS line without evidence: ${e.text}`)
    else if (e.missing.length) add('ST11', `${e.file}:${e.line}`, `evidence path missing: ${e.missing.join(', ')}`)
  }
  for (const c of extra.unplaced) add('ST18', c.id, `no domain rule takes ${c.where.path || c.id}`)

  // ST14: the CLAUDE.md table against the authority records, agents.json and the role files
  for (const t of claudeTable(readText(path.join(root, 'CLAUDE.md')))) {
    const rec = ctx.authority.records.find((r) => r.id === authId(t.name))
    const role = t.name.split('@')[0]
    const miss = []
    if (!rec || !rec.established.from.includes('data/newsroom/agents.json')) miss.push('no row in data/newsroom/agents.json')
    if (!rec || !rec.key_id) miss.push('no key in board/keys.json')
    if (!fs.existsSync(path.join(root, 'board/team', role, 'ROLE.md'))) miss.push('no board/team/' + role + '/ROLE.md')
    if (miss.length) add('ST14', t.name, miss.join('; '))
  }

  // ST15: findings with no owner
  for (const c of cards) if (c.type === 'finding' && c.status !== 'withdrawn' && !(c.facts && c.facts.owner)) add('ST15', c.id, 'a finding with no owner')

  // ST16: what the library would publish, scanned (outputs of this run and the tree's hand files)
  const scan = (rel, text) => { for (const w of secretFindings(text, root)) add('ST16', rel, w) }
  for (const [rel, text] of Object.entries(extra.outputs)) scan(rel, text)
  for (const f of walk(rdir, (p) => p.endsWith('.md'))) scan('reality/' + path.relative(rdir, f).split(path.sep).join('/'), readText(f))

  // ST17: waits older than a day (against the catalogue's date, so the result is the same on a second run)
  const waits = readJson(path.join(root, 'board/team/librarian/waits-on-dinis.json'), { waits: [] }).waits || []
  const ref = Date.parse(catalogue.generated || '') || null
  for (const w of waits) {
    const t = Date.parse(w.since || '')
    if (ref && t && ref - t > 86400000) add('ST17', w.id, `waiting since ${String(w.since).slice(0, 10)} (${w.kind})`)
  }

  // summary
  const counts = {}
  for (const [code] of CODES) counts[code] = 0
  for (const f of findings) counts[f.code]++
  const sev = Object.fromEntries(CODES.map(([c, , s]) => [c, s]))
  const stamp = (catalogue.generated || extra.last || '').replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}).*$/, '$1-$2$3') || 'unknown'
  const examples = {}
  for (const f of findings) { (examples[f.code] = examples[f.code] || []).push(f) }
  const latest = {
    about: `The stocktake of the library: findings by code, with a severity and an owner. Counted against the catalogue generated ${catalogue.generated || 'unknown'}; the same inputs give the same file. Codes ST12 and ST13 are not run in round 2. Generated by ${GENERATOR}; never edited by hand.`,
    catalogue_generated: catalogue.generated || null, site_version: catalogue.site_version || null, file: `stocktake/${stamp}.md`,
    cards: cards.length,
    counts, severity: sev, not_run: NOT_RUN,
    blockers: findings.filter((f) => sev[f.code] === 'blocker').length,
    faults: findings.filter((f) => sev[f.code] === 'fault').length,
    findings: Object.fromEntries(Object.entries(examples).map(([k, v]) => [k, { count: v.length, examples: v.slice(0, EXAMPLES) }])),
  }

  // the readable form
  const md = ['---', `title: ${JSON.stringify('Stocktake of the library, catalogue of ' + (catalogue.generated || 'unknown'))}`, 'by: librarian@PrompTugal.dinis', `generated: ${JSON.stringify('by ' + GENERATOR + ' from the cards and the tree')}`, `site_version: ${JSON.stringify(catalogue.site_version || '')}`, '---', '']
  md.push(`# Stocktake of the library (catalogue of ${catalogue.generated || 'unknown'}, site ${catalogue.site_version || '?'})`, '')
  md.push(`${cards.length} cards. ${latest.blockers} blocker(s), ${latest.faults} fault(s). The library flags and never fixes another's file; each finding has an owner. The data: [latest.json](latest.json).`, '')
  md.push('| Code | What | Severity | Owner | Count |', '|---|---|---|---|---|')
  for (const [code, what, s, owner] of CODES) md.push(`| ${code} | ${mdCell(what)} | ${s} | ${mdCell(owner)} | ${s === 'not run' ? 'not run' : counts[code]} |`)
  md.push('', '## Not run in round 2', '')
  for (const [k, v] of Object.entries(NOT_RUN)) md.push(`- ${k}: ${mdCell(v)}.`)
  md.push('', '## Findings (the first ten of each code)', '')
  for (const [code, what] of CODES) {
    const list = examples[code]
    if (!list) continue
    md.push(`### ${code}: ${mdCell(what)} (${list.length})`, '')
    for (const f of list.slice(0, 8)) md.push(`- \`${mdCell(f.subject)}\`: ${mdCell(f.text)}`)
    if (list.length > 8) md.push(`- ... and ${list.length - 8} more in latest.json`)
    md.push('')
  }
  return { latest, text: md.join('\n') + '\n', stamp, findings, counts }
}

// weeding: superseded and withdrawn cards, never deleted
export function weedingPage(ctx, cards) {
  const byId = new Map(cards.map((c) => [c.id, c]))
  const rows = cards.filter((c) => c.status === 'superseded' || c.status === 'withdrawn')
  const reg = readLines(path.join(ctx.libDir, 'accession-register.jsonl')).map((l) => JSON.parse(l)).filter((l) => l.event === 'withdrawn')
  const wd = new Map()
  for (const l of reg) wd.set(l.id, l.at)
  const out = ['---', 'title: "Weeding: superseded and withdrawn holdings"', 'by: librarian@PrompTugal.dinis', `generated: ${JSON.stringify('by ' + GENERATOR + ' from the cards')}`, `site_version: ${JSON.stringify(ctx.catalogue.site_version || '')}`, '---', '', '# Weeding', '']
  out.push('Weeding is a status, never a deletion. A **superseded** card is a holding a later one replaces (a `supersedes` link: front matter, a versioned name, or the owner\'s word in `authority/forms.json`); a **withdrawn** card is a holding that has left the repository, with its register line. Both stay in the catalogue and the shelf list, shown marked, and are hidden from default views. The library proposes; the owner decides.', '')
  out.push(`${rows.filter((c) => c.status === 'superseded').length} superseded, ${rows.filter((c) => c.status === 'withdrawn').length} withdrawn.`, '')
  if (rows.length) {
    out.push('| Card | Call number | Status | Reason | Successor |', '|---|---|---|---|---|')
    for (const c of rows.slice(0, 120)) {
      const succ = c.links.filter((l) => l.rel === 'superseded_by' || l.rel === 'see').map((l) => l.to)
      const reason = c.status === 'superseded' ? 'a later holding replaces it (supersedes link)' : `left the repository (register: ${dateWords(wd.get(c.id) || '') || 'date not recorded'})`
      out.push(`| ${mdCell(c.title)} (\`${c.id}\`) | \`${c.call}\` | ${c.status} | ${mdCell(reason)} | ${succ.length ? succ.map((s) => '`' + s + '`').join(', ') : 'none named'} |`)
    }
    if (rows.length > 120) out.push('', `... and ${rows.length - 120} more in the catalogue.`)
  } else out.push('Nothing is superseded or withdrawn yet.')
  out.push('', '## Candidates for weeding', '', 'None proposed in round 2. A candidate (a stale status file, a page replaced by another) is proposed here with its owner; the owner decides.', '')
  return out.join('\n')
}
