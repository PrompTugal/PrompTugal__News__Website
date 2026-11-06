// The library's own gate: validates the generated files on disk. Exits non-zero (in library.mjs) on any error.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { readJson, readLines, walk, cmp } from './util.mjs'
import { holdingsOf, readRegister } from './cards.mjs'
import { ROWS_PER_TABLE } from './shelf.mjs'

const SIZE_LIMIT = 3.5 * 1024 * 1024
const AGENT_HANDLE = /@(PrompTugal|web-summit)\.(dinis|vicky|indi)$/i
const SECRET_PATTERNS = [
  [/-----BEGIN [A-Z ]*KEY-----/, 'a key block'],
  [/\bsk-or-v1-[A-Za-z0-9]+/, 'an OpenRouter key'],
  [/\bOPEN_ROUTER_KEY\s*[=:]\s*\S/, 'an OpenRouter key assignment'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'a GitHub token'],
  [/\bvault[_ -]?key\s*[:=]\s*\S{8,}/i, 'a vault key'],
  [/\b[0-9a-f]{40,}\b/, 'a long hex string'],
  [/\+\d[\d ()-]{8,}\d/, 'a phone number'],
]

export function libraryFiles(libDir) {
  const names = ['accession-register.jsonl', 'cards.json', 'shelf-list.md', 'classification.json']
  const out = names.map((n) => path.join(libDir, n)).filter((p) => fs.existsSync(p))
  for (const d of ['catalogue', 'authority', 'shelf-list']) out.push(...walk(path.join(libDir, d), (p) => /\.(jsonl|json|md)$/.test(p)))
  return out
}

function scanSecrets(file, text, errors) {
  for (const [re, what] of SECRET_PATTERNS) if (re.test(text)) errors.push(`${file}: contains ${what}`)
  for (const m of text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    if (!AGENT_HANDLE.test(m[0])) { errors.push(`${file}: contains an address that is not an agent handle`); break }
  }
  for (const m of text.matchAll(/(?<![A-Za-z0-9+/_.-])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/_.-])/g)) {
    if (/[0-9]/.test(m[0]) && /[A-Z]/.test(m[0]) && /[a-z]/.test(m[0])) { errors.push(`${file}: contains a key-shaped string`); break }
  }
  if (text.includes('\u2014')) errors.push(`${file}: contains an em-dash`)
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
    scanSecrets(rel(f), text, errors)
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
    if (!['current', 'withdrawn'].includes(c.status)) errors.push(`card ${c.id} has status ${c.status}`)
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
  for (const c of cards) if (c.status === 'current') have[c.type] = (have[c.type] || 0) + 1
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

  // authority and links
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
  for (const c of cards) {
    for (const l of c.links || []) {
      const ok = l.to.startsWith('auth:') ? aids.has(l.to) : ids.has(l.to)
      if (!ok) errors.push(`card ${c.id}: link ${l.rel} to ${l.to} does not resolve`)
    }
  }

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
  return { errors, warnings, stats }
}

function authIdOf(name) {
  const m = /^([A-Za-z0-9.\-]+)@([A-Za-z0-9.\-]+)$/.exec(name || '')
  if (!m) return null
  const base = m[1].replace(/\./g, '-')
  return 'auth:agent:' + (m[2] === 'PrompTugal.dinis' ? base : `${base}-${m[2].replace(/\./g, '-').toLowerCase()}`)
}
