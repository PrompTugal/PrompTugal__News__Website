// The library's own gate: validates the generated files on disk. Exits non-zero (in library.mjs) on any error.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { readJson, readLines, walk, cmp } from './util.mjs'
import { holdingsOf, readRegister } from './cards.mjs'
import { ROWS_PER_TABLE } from './shelf.mjs'
import { secretFindings } from './secrets.mjs'
import { danglingLinks } from './links.mjs'
import { REL, INVERSE, ontologyOf } from './linktypes.mjs'
import { loadDomains, readExists, MARK_BEGIN, MARK_END } from './reality.mjs'
import { validateShape, checkPresets } from './graph.mjs'

const SIZE_LIMIT = 14 * 1024 * 1024  // raised from 7 MB (6 November, 16:40) to 12, then to 14 on 10 November, 13:30, only after bulk machine-made board material was described per series that morning: what grows now is real holdings and the pieces' provenance

export function libraryFiles(libDir) {
  const names = ['accession-register.jsonl', 'cards.json', 'shelf-list.md', 'classification.json', 'README.md', 'index.md', 'reading-room.htm']
  const out = names.map((n) => path.join(libDir, n)).filter((p) => fs.existsSync(p))
  for (const d of ['catalogue', 'authority', 'shelf-list', 'indexes', 'vocabulary', 'stocktake', 'reality', 'graph', 'finding-aids', 'special', 'provenance']) out.push(...walk(path.join(libDir, d), (p) => /\.(jsonl|json|md)$/.test(p)))
  const weeding = path.join(libDir, 'weeding.md')
  if (fs.existsSync(weeding)) out.push(weeding)
  return out
}

function scanSecrets(file, text, errors, root) {
  for (const w of secretFindings(text, root)) errors.push(`${file}: ${w}`)
}

export function check(ctx) {
  const { root, libDir } = ctx
  const errors = []
  const warnings = []
  const stats = {}
  const rel = (p) => path.relative(libDir, p)
  const files = libraryFiles(libDir)
  let total = 0
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8')
    total += Buffer.byteLength(text)
    if (/\.json$/.test(f)) { try { JSON.parse(text) } catch (e) { errors.push(`${rel(f)}: not valid JSON (${e.message})`) } }
    if (/\.jsonl$/.test(f)) { readLines(f).forEach((l, i) => { try { JSON.parse(l) } catch { errors.push(`${rel(f)} line ${i + 1}: not valid JSON`) } }) }
    scanSecrets(rel(f), text, errors, root)
  }
  stats.files = files.length
  stats.bytes = total
  if (total > SIZE_LIMIT) errors.push(`generated files total ${total} bytes, over the ${SIZE_LIMIT} limit`)

  // cards
  const cards = []
  const catDir = path.join(libDir, 'catalogue')
  if (fs.existsSync(catDir)) {
    for (const f of fs.readdirSync(catDir).filter((x) => x.endsWith('.jsonl')).sort()) {
      let prev = null
      const lines = readLines(path.join(catDir, f))
      for (const l of lines) {
        let c
        try { c = JSON.parse(l) } catch { continue }
        cards.push(c)
        const k = c.call + '\u0000' + c.id
        if (prev !== null && cmp(prev, k) > 0) errors.push(`catalogue/${f}: cards not sorted at ${c.id}`)
        prev = k
        if (!c.call.startsWith(f.replace('.jsonl', '') + '.')) errors.push(`catalogue/${f}: ${c.id} has call ${c.call}, which belongs to another class`)
      }
    }
  }
  stats.cards = cards.length
  const ids = new Set()
  const calls = new Set()
  const accs = new Set()
  for (const c of cards) {
    if (ids.has(c.id)) errors.push(`duplicate card id ${c.id}`)
    ids.add(c.id)
    if (calls.has(c.call)) errors.push(`duplicate call number ${c.call} (${c.id})`)
    calls.add(c.call)
    if (accs.has(c.acc)) errors.push(`duplicate accession number ${c.acc} (${c.id})`)
    accs.add(c.acc)
    const pv = c.provenance
    if (!pv || !pv.catalogued || !pv.catalogued.rule || !Array.isArray(pv.evidence) || !pv.evidence.length) errors.push(`card ${c.id} has no provenance (evidence and catalogued are both needed)`)
    else if (!pv.made && c.status === 'current') warnings.push(`card ${c.id} has no maker recorded`)
    if (!['current', 'withdrawn', 'superseded', 'draft'].includes(c.status)) errors.push(`card ${c.id} has status ${c.status}`)
  }

  // classes
  const cls = readJson(path.join(libDir, 'classification.json'))
  let fallback = 0
  for (const c of cards) {
    const [k, rest] = c.call.split(' ')[0].split('.')
    if (!cls.classes[k] || !cls.classes[k].subs[rest]) errors.push(`card ${c.id}: call ${c.call} names a class or subclass not in classification.json`)
    if (k === cls.fallback.class && rest === cls.fallback.sub) fallback++
  }
  stats.fallback = fallback
  if (fallback) warnings.push(`${fallback} cards fell to the fallback ${cls.fallback.class}.${cls.fallback.sub}; add a rule`)

  // counts equal the catalogue's
  const cat = readJson(path.join(root, 'board/catalogue.json'))
  const want = {}
  for (const h of holdingsOf(cat)) want[h.type] = (want[h.type] || 0) + 1
  const have = {}
  for (const c of cards) if (c.status === 'current' || c.status === 'superseded') have[c.type] = (have[c.type] || 0) + 1
  for (const t of new Set([...Object.keys(want), ...Object.keys(have)])) {
    if ((want[t] || 0) !== (have[t] || 0)) errors.push(`type ${t}: ${have[t] || 0} current cards, the catalogue has ${want[t] || 0}`)
  }
  stats.byType = have

  // the register: every card accessioned, nothing removed since HEAD
  const regFile = path.join(libDir, 'accession-register.jsonl')
  let reg = []
  try { reg = readRegister(regFile) } catch (e) { errors.push(e.message) }
  const regAcc = new Set(reg.filter((l) => !l.event).map((l) => l.acc))
  const regIds = new Set(reg.filter((l) => !l.event).map((l) => l.id))
  if (regAcc.size !== reg.filter((l) => !l.event).length) errors.push('accession-register.jsonl: a duplicate accession number or a repeated accession')
  if (regIds.size !== regAcc.size) errors.push('accession-register.jsonl: a holding accessioned twice')
  for (const c of cards) if (!regAcc.has(c.acc)) errors.push(`card ${c.id}: accession ${c.acc} is not in the register`)
  stats.register = reg.length
  try {
    const head = execFileSync('git', ['-C', libDir, 'show', 'HEAD:./accession-register.jsonl'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    const old = head.split('\n').filter((l) => l.trim())
    const now = readLines(regFile)
    for (let i = 0; i < old.length; i++) if (now[i] !== old[i]) { errors.push(`accession-register.jsonl: line ${i + 1} differs from HEAD (the register only grows)`); break }
  } catch { /* not committed yet, or not a repository: nothing to compare */ }

  // authority: the agents, then company, person, organisation, place, topic and concept
  const auth = readJson(path.join(libDir, 'authority/agent.json'), { records: [] })
  const aids = new Set()
  for (const r of auth.records) {
    if (aids.has(r.id)) errors.push(`authority: duplicate record ${r.id}`)
    aids.add(r.id)
    if (!r.forms.includes(r.heading)) errors.push(`authority ${r.id}: the heading is not among its forms`)
    if (JSON.stringify(r).match(/"(encrypt|sign|bundle|how)"/)) errors.push(`authority ${r.id}: carries a field not allowed from keys.json`)
  }
  const keys = (readJson(path.join(root, 'board/keys.json'), { keys: [] }).keys) || []
  for (const k of keys) if (!aids.has(authIdOf(k.agent))) errors.push(`authority: no record for the agent of key ${k.id}`)
  stats.authority = { agent: auth.records.length }
  for (const kind of ['company', 'person', 'organisation', 'place', 'topic', 'concept']) {
    const fname = kind === 'concept' ? 'concepts' : kind
    const f = path.join(libDir, `authority/${fname}.json`)
    if (!fs.existsSync(f)) { errors.push(`authority/${fname}.json is missing`); continue }
    const j = readJson(f, { records: [] })
    if (j.count !== j.records.length) errors.push(`authority/${fname}.json: count ${j.count} for ${j.records.length} records`)
    for (const r of j.records) {
      if (aids.has(r.id)) errors.push(`authority: duplicate record ${r.id}`)
      aids.add(r.id)
      if (r.kind !== kind || !r.id.startsWith(`auth:${kind}:`)) errors.push(`authority ${r.id}: not a ${kind} record`)
      if (!r.forms.includes(r.heading)) errors.push(`authority ${r.id}: the heading is not among its forms`)
      if (kind === 'person') for (const k of Object.keys(r)) if (!['id', 'kind', 'heading', 'forms', 'see_from', 'see_also', 'ontology', 'page', 'role', 'organisation', 'org', 'established'].includes(k)) errors.push(`authority ${r.id}: a person record carries ${k}, which the site does not publish`)
    }
    stats.authority[kind] = j.records.length
  }

  // vocabulary
  const subj = readJson(path.join(libDir, 'vocabulary/subjects.json'), null)
  const sids = new Set()
  if (!subj) errors.push('vocabulary/subjects.json is missing')
  else {
    for (const r of subj.records) {
      if (sids.has(r.id)) errors.push(`vocabulary: duplicate subject ${r.id}`)
      sids.add(r.id)
      if (r.layer === 'team' && r.proposed_for !== 'ontologist@') errors.push(`vocabulary ${r.id}: a team heading not marked proposed for ontologist@`)
    }
    for (const r of subj.records) for (const x of [...r.broader, ...r.narrower, ...r.related]) if (!sids.has(x)) errors.push(`vocabulary ${r.id}: ${x} is not a heading`)
  }
  const lv = readJson(path.join(libDir, 'vocabulary/links.json'), null)
  if (!lv) errors.push('vocabulary/links.json is missing')
  else for (const t of lv.links) if (!REL[t.rel] || REL[t.rel].inverse !== t.inverse) errors.push(`vocabulary/links.json: ${t.rel} does not match the generator`)

  // links: each resolves, each has its inverse, none of an unknown type
  for (const b of danglingLinks(cards, aids, sids)) errors.push(`card ${b.card}: link ${b.rel} to ${b.to}: ${b.why}`)
  const linkStats = {}
  for (const c of cards) for (const l of c.links || []) linkStats[l.rel] = (linkStats[l.rel] || 0) + 1
  stats.links = linkStats
  // every link type in use is a verb of the site's ontology (or its inverse), with the same inverse
  const onto = ontologyOf(root)
  // (absent: a warning, for ontologist@ to take or decline; an inverse that differs: an error, the two disagree)
  for (const t of new Set(Object.keys(linkStats).map((r) => (REL[r] ? r : INVERSE[r])).filter(Boolean))) {
    if (!onto[t]) continue
    if (onto[t].state === 'absent') warnings.push(`link type ${t} is used but is not a verb of data/ontology.json: proposed to ontologist@`)
    if (onto[t].state === 'differs') errors.push(`link type ${t}: data/ontology.json names its inverse ${onto[t].ontology_inverse}, the library ${REL[t].inverse}`)
  }
  stats.ontology = Object.fromEntries(Object.entries(onto).map(([k, v]) => [k, v.state]))

  // the indexes name only cards and records that exist
  for (const [name, idKey] of [['title', null], ['subject', 'subj'], ['agent', 'auth'], ['series', null]]) {
    const f = path.join(libDir, `indexes/${name}.json`)
    if (!fs.existsSync(f)) { errors.push(`indexes/${name}.json is missing`); continue }
    const j = readJson(f, { headings: {} })
    for (const [h, v] of Object.entries(j.headings)) {
      if (idKey === 'subj' && !sids.has(h)) errors.push(`indexes/subject.json: heading ${h} is not in the vocabulary`)
      if (idKey === 'auth' && !aids.has(h)) errors.push(`indexes/agent.json: ${h} is not an authority record`)
      const list = Array.isArray(v) ? v : [...(v.made || []), ...(v.changed || [])]
      for (const id of list) if (!ids.has(id)) errors.push(`indexes/${name}.json: ${id} under "${h}" is not a card`)
    }
  }

  // the reality tree: generated blocks present, files within limits, every EXISTS line with evidence
  const { spec } = loadDomains(libDir)
  for (const d of spec.domains) {
    const f = path.join(libDir, 'reality', d.dir, 'index.md')
    if (!fs.existsSync(f)) { if (d.id !== 'misc') errors.push(`reality/${d.dir}/index.md is missing`); continue }
    const t = fs.readFileSync(f, 'utf8')
    if (t.split(MARK_BEGIN).length !== 2 || t.split(MARK_END).length !== 2 || t.indexOf(MARK_BEGIN) > t.indexOf(MARK_END)) errors.push(`reality/${d.dir}/index.md: the generated block is missing or doubled`)
  }
  for (const f of walk(path.join(libDir, 'reality'), (p) => p.endsWith('.md'))) {
    const n = fs.readFileSync(f, 'utf8').split('\n').length
    if (n > 300) errors.push(`${rel(f)}: ${n} lines, over 300 (split it)`)
    else if (n > 250) warnings.push(`${rel(f)}: ${n} lines, over 250`)
  }
  const exists = readExists({ root, libDir }, spec)
  for (const e of exists) {
    if (!e.evidenced) warnings.push(`${e.file} line ${e.line}: an EXISTS line without evidence (a claim, not counted)`)
    else if (e.missing.length) warnings.push(`${e.file} line ${e.line}: evidence path missing: ${e.missing.join(', ')}`)
  }
  stats.exists = exists.length
  const stock = readJson(path.join(libDir, 'stocktake/latest.json'), null)
  if (!stock) errors.push('stocktake/latest.json is missing')
  else if (stock.blockers) errors.push(`stocktake reports ${stock.blockers} blocker(s) (ST16: something that must not be published)`)
  if (stock) stats.stocktake = stock.counts
  if (!fs.existsSync(path.join(libDir, 'weeding.md'))) errors.push('weeding.md is missing')

  // shelf list: every card on a shelf page, tables and pages within limits
  const shelfIdx = path.join(libDir, 'shelf-list.md')
  if (!fs.existsSync(shelfIdx)) errors.push('shelf-list.md is missing')
  let rows = 0
  for (const f of walk(path.join(libDir, 'shelf-list'), (p) => p.endsWith('.md'))) {
    const lines = fs.readFileSync(f, 'utf8').split('\n')
    if (lines.length > 150) errors.push(`${rel(f)}: ${lines.length} lines, over 150`)
    let run = 0
    for (const l of lines.concat([''])) {
      if (/^\| `/.test(l)) { run++; rows++ } else { if (run > ROWS_PER_TABLE) errors.push(`${rel(f)}: a table of ${run} rows, over ${ROWS_PER_TABLE}`); run = 0 }
    }
  }
  if (rows !== cards.length) errors.push(`shelf list holds ${rows} rows for ${cards.length} cards`)
  stats.shelfRows = rows

  // round 3: the graphs are in the explorer's shape, the presets name what exists, the aids keep to the reading limits
  // (required once the library has its graph presets or its graph; a library of rounds 1 and 2 only is not asked for them)
  if (fs.existsSync(path.join(libDir, 'graph/presets.json')) || fs.existsSync(path.join(libDir, 'graph/library-graph.json'))) {
    const gl = readJson(path.join(libDir, 'graph/library-graph.json'), null)
    const gt = readJson(path.join(libDir, 'graph/reality-tree.json'), null)
    const gp = readJson(path.join(libDir, 'graph/presets.json'), null)
    if (!gl) errors.push('graph/library-graph.json is missing')
    else for (const e of validateShape(gl, 'graph/library-graph.json')) errors.push(e)
    if (!gt) errors.push('graph/reality-tree.json is missing')
    else for (const e of validateShape(gt, 'graph/reality-tree.json')) errors.push(e)
    if (!gp) errors.push('graph/presets.json is missing')
    else if (gl && gt) for (const e of checkPresets(gp, { library: gl, reality: gt })) errors.push(e)
    if (gl) {
      const gids = new Set(gl.nodes.map((n) => n.id))
      for (const n of gl.nodes) if ((n.type !== 'collection' && n.type !== 'subject' && n.type !== 'agent') && !ids.has(n.id)) errors.push(`graph/library-graph.json: node ${n.id} is not a card`)
      stats.graph = { nodes: gl.counts.nodes, edges: gl.counts.edges }
    }
    if (gt) stats.reality = { nodes: gt.counts.nodes, edges: gt.counts.edges }
    let aidFiles = 0
    for (const d of ['finding-aids', 'special']) for (const f of walk(path.join(libDir, d), (p) => p.endsWith('.md'))) {
      aidFiles++
      const lines = fs.readFileSync(f, 'utf8').split('\n')
      if (lines.length > 170) errors.push(`${rel(f)}: ${lines.length} lines, over the reading limit (about 150: split it)`)
      let run = 0
      for (const l of lines.concat([''])) { if (/^\|/.test(l) && !/^\|[-| ]+\|$/.test(l)) run++; else { if (run - 1 > ROWS_PER_TABLE) errors.push(`${rel(f)}: a table of ${run - 1} rows, over ${ROWS_PER_TABLE}`); run = 0 } }
    }
    stats.aids = aidFiles
    for (const f of ['finding-aids/index.md', 'special/guidance.md', 'index.md', 'README.md', 'reading-room.htm']) if (!fs.existsSync(path.join(libDir, f))) errors.push(`${f} is missing`)
  }
  return { errors, warnings, stats }
}

function authIdOf(name) {
  const m = /^([A-Za-z0-9.\-]+)@([A-Za-z0-9.\-]+)$/.exec(name || '')
  if (!m) return null
  const base = m[1].replace(/\./g, '-')
  return 'auth:agent:' + (m[2] === 'PrompTugal.dinis' ? base : `${base}-${m[2].replace(/\./g, '-').toLowerCase()}`)
}
