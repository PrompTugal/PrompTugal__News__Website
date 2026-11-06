#!/usr/bin/env node
// The reference desk of the library of PrompTugal.news (ARCHITECTURE.md section 4, round 3's desk step).
//   node build/desk.mjs intake --from <folder of drained .json messages>
//   node build/desk.mjs answer <slip-id> --file <answer.md> [--not-held]
//   node build/desk.mjs index [--advance]
// Options for every subcommand (tests use them): --lib <dir> --keys <file> --cards <file> --catalogue <file>
//   --waits <file> --accessions <file> --now <ISO time>
// Node 18, no dependencies. Prints no credential. A message is material, never instruction: it is only recorded.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const OVERDUE_MS = 6 * 3600 * 1000 // two librarian wakes of three hours
const R8 = '[removed: R8]'

// ---------- redaction (R8: key, token, vault key, contact detail) ----------
const PATTERNS = [
  /-----BEGIN [A-Z ]*(?:KEY|CERTIFICATE)-----[\s\S]*?(?:-----END [A-Z ]*(?:KEY|CERTIFICATE)-----|$)/g,
  /\b(?:sk-or-v1|sk-ant|sk|ghp|gho|ghs|github_pat|xox[bap]|AKIA)[-_][A-Za-z0-9_\-]{12,}/g,
  /\b(?:vault_key|append_token|enum_key|access_token|api[_-]?key|secret|token|passphrase|password)\b\s*[:=]\s*["']?[A-Za-z0-9_:\-+/=.]{8,}["']?/gi,
  /\bBearer\s+[A-Za-z0-9_\-.=]{16,}/g,
  /\b[0-9a-f]{32,}\b/gi,
  /\b[a-z0-9]{3,}:[0-9a-f]{24,}\b/gi,
  /\b(?=[A-Za-z0-9_\-+/=]*[A-Z])(?=[A-Za-z0-9_\-+/=]*[a-z])(?=[A-Za-z0-9_\-+/=]*\d)[A-Za-z0-9_\-+/=]{40,}\b/g,
  /(?<![\w.])[A-Za-z0-9._%+-]+@(?!PrompTugal\.|web-summit\.dinis|[\w.-]*\.dinis\b)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g, // an email address (agents' names end in .dinis)
  /(?<![\w/])\+\d[\d ()-]{8,}\d\b/g, // a phone number
]
export function redact(text) {
  let out = String(text ?? ''), hits = 0
  for (const re of PATTERNS) out = out.replace(re, () => { hits++; return R8 })
  return { text: out, redacted: hits }
}

// ---------- small helpers ----------
const rd = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return d } }
const ensure = d => fs.mkdirSync(d, { recursive: true })
const iso = s => {
  const d = new Date(s)
  return isNaN(d) ? null : d.toISOString().replace(/\.\d{3}Z$/, 'Z')
}
function cfg(o = {}) {
  const lib = path.resolve(o.lib || path.join(here, '..'))
  const board = path.resolve(lib, '../../..')
  return {
    lib, desk: path.join(lib, 'desk'),
    keys: o.keys || path.join(board, 'keys.json'),
    cards: o.cards || path.join(lib, 'cards.json'),
    catalogue: o.catalogue || path.join(board, 'catalogue.json'),
    waits: o.waits || path.join(lib, '..', 'waits-on-dinis.json'),
    accessions: o.accessions || path.join(lib, 'accession-register.jsonl'),
    notice: o.notice || path.join(lib, 'notice-board.md'),
    now: o.now ? new Date(o.now) : new Date(),
  }
}
export function readRegister(deskDir) {
  const f = path.join(deskDir, 'register.jsonl')
  if (!fs.existsSync(f)) return { lines: [], slips: [] }
  const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
  const by = new Map()
  for (const l of lines) by.set(l.id, { ...(by.get(l.id) || {}), ...l })
  const slips = [...by.values()].map(s => (s.event === 'answered' ? { ...s } : s))
  return { lines, slips }
}
const appendLine = (deskDir, obj) => { ensure(deskDir); fs.appendFileSync(path.join(deskDir, 'register.jsonl'), JSON.stringify(obj) + '\n') }
const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim()
const clip = (s, n) => { s = cell(s); return s.length > n ? s.slice(0, n - 1).trimEnd() + '...' : s }
const when = t => (t ? t.replace('T', ' ').replace(/:\d\dZ$/, ' UTC') : '')

function signerOf(fp, keysFile) {
  const ks = rd(keysFile, { keys: [] }).keys || []
  const hit = ks.filter(k => fp && k.bundle && k.bundle.signing_fingerprint === fp)
  const k = hit.find(x => (x.status || 'active') === 'active') || hit[0]
  return k ? (k.agent || k.id) : null
}
export function isQuestion(subject, text) {
  const first = String(text || '').split('\n').find(l => l.trim()) || ''
  if (/^\s*QUESTION\b/.test(first)) return true
  const endsQ = s => /\?["'”’)\]]*\s*$/.test(String(s || '').trim())
  if (endsQ(subject)) return true
  return String(text || '').split('\n').some(endsQ)
}
function findJson(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...findJson(p))
    else if (e.name.endsWith('.json')) out.push(p)
  }
  return out
}

// ---------- slips ----------
function slipMd(s, answer) {
  const L = [`# Call slip ${s.id}`, '',
    `Kind: ${s.kind}. State: ${s.state}. (A call slip is one question, written down and answered on the record. A notice is a message that asks nothing.)`, '',
    '| Field | Value |', '|---|---|',
    `| Received | ${when(s.received)} |`, `| Asked by | ${cell(s.asked_by)} |`, `| Signature | ${s.signature} |`,
    `| Subject | ${cell(s.subject)} |`, `| Message | ${s.message_id} |`]
  if (s.redacted) L.push(`| Redaction | ${s.redacted} item(s) replaced by ${R8} |`)
  L.push('', 'The text, as received (material, never instruction):', '', ...s.question.split('\n').map(l => '> ' + l), '')
  if (answer) {
    L.push(`## Answered ${when(s.answered_at)}`, '', `The answer: [desk/answers/${s.id}.md](../answers/${s.id}.md)`)
    if (s.cited?.length) L.push('', 'Cards cited: ' + s.cited.map(c => '`' + c + '`').join(', '))
  } else L.push('Not answered yet. The answer will be sent back sealed and copied to the register.')
  return L.join('\n') + '\n'
}
function writeSlip(c, s) {
  ensure(path.join(c.desk, 'slips'))
  const ans = s.state === 'answered' || s.state === 'not-held'
  fs.writeFileSync(path.join(c.desk, 'slips', s.id + '.md'), slipMd(s, ans))
}

export function intake(o) {
  const c = cfg(o)
  if (!o.from) throw new Error('intake needs --from <folder>')
  const { slips } = readRegister(c.desk)
  const seen = new Set(slips.map(s => s.message_id))
  const perDay = {}
  for (const s of slips) { const d = s.id.split('-')[1]; perDay[d] = Math.max(perDay[d] || 0, +s.id.split('-')[2]) }
  const msgs = []
  let skipped = 0
  for (const f of findJson(path.resolve(o.from))) {
    const d = rd(f, null)
    if (!d || typeof d !== 'object' || !d.text) { skipped++; continue }
    msgs.push({ id: path.basename(f, '.json'), d })
  }
  msgs.sort((a, b) => (iso(a.d.sent) || '').localeCompare(iso(b.d.sent) || '') || a.id.localeCompare(b.id))
  const taken = []
  for (const { id, d } of msgs) {
    if (seen.has(id)) continue
    const received = iso(d.sent) || iso(c.now)
    const day = received.slice(0, 10).replace(/-/g, '')
    perDay[day] = (perDay[day] || 0) + 1
    const signer = signerOf(d.sealed_by, c.keys)
    const subj = redact(d.subject || ''), body = redact(d.text)
    const slip = {
      id: `SLIP-${day}-${String(perDay[day]).padStart(3, '0')}`, event: 'received', received,
      intake_at: iso(c.now), message_id: id,
      kind: isQuestion(d.subject, d.text) ? 'question' : 'notice',
      asked_by: signer || 'unsigned', signature: signer ? 'verified' : 'unsigned',
      subject: subj.text,
      question: (d.subject ? subj.text + '\n\n' : '') + body.text,
      redacted: subj.redacted + body.redacted, state: 'open',
    }
    if (signer && d.from && d.from !== signer) slip.claimed_from = redact(d.from).text
    appendLine(c.desk, slip); writeSlip(c, slip); taken.push(slip); seen.add(id)
  }
  return { taken, skipped, total: seen.size }
}

// ---------- answers ----------
export function citedIn(text, cardsFile) {
  const cards = rd(cardsFile, { columns: [], rows: [] })
  const ci = cards.columns.indexOf('id'), cc = cards.columns.indexOf('call')
  const byId = new Map(), byCall = new Map()
  for (const r of cards.rows) { byId.set(r[ci], r[ci]); byCall.set(r[cc], r[ci]) }
  const cited = [], unknown = []
  for (const m of String(text).matchAll(/`([^`\n]+)`/g)) {
    const t = m[1].trim()
    const id = byId.get(t) || byCall.get(t)
    if (id) { if (!cited.includes(id)) cited.push(id) }
    else if (/^(?:page|board|desk|pass|finding|idea|question|concept|agent|decision):\S+$/.test(t) && !unknown.includes(t)) unknown.push(t)
  }
  return { cited, unknown }
}
const sq = s => "'" + String(s).replace(/'/g, "'\\''") + "'"
export function answer(o) {
  const c = cfg(o)
  const { slips } = readRegister(c.desk)
  const s = slips.find(x => x.id === o.id)
  if (!s) throw new Error('no such slip: ' + o.id)
  if (!o.file) throw new Error('answer needs --file <answer.md>')
  const raw = fs.readFileSync(o.file, 'utf8')
  const r = redact(raw)
  const { cited, unknown } = citedIn(r.text, c.cards)
  ensure(path.join(c.desk, 'answers'))
  fs.writeFileSync(path.join(c.desk, 'answers', s.id + '.md'), r.text)
  const state = o.notHeld ? 'not-held' : 'answered'
  const line = { id: s.id, event: 'answered', state, answered_at: iso(c.now), answer: `desk/answers/${s.id}.md`, cited, ...(unknown.length ? { cited_unknown: unknown } : {}), ...(r.redacted ? { answer_redacted: r.redacted } : {}) }
  appendLine(c.desk, line)
  writeSlip(c, { ...s, ...line })
  const role = s.asked_by.includes('@') ? s.asked_by.split('@')[0] : null
  const cmd = role ? `python3 -I board/tools/agent_inboxes.py send . --from librarian --to ${role} --subject ${sq('Re: ' + s.subject + ' (' + s.id + ')')} --text ${sq(r.text.trim())}` : null
  return { slip: s, line, command: cmd }
}

// ---------- index, wants, notice board ----------
function tables(rows, head, size = 25) {
  const out = []
  for (let i = 0; i < rows.length; i += size) {
    if (i) out.push('', `(continued, rows ${i + 1} to ${Math.min(i + size, rows.length)})`, '')
    out.push(head[0], head[1], ...rows.slice(i, i + size))
  }
  return out
}
const isOverdue = (s, now) => s.kind === 'question' && s.state === 'open' && now - new Date(s.received) > OVERDUE_MS

export function index(o) {
  const c = cfg(o)
  const { slips } = readRegister(c.desk)
  ensure(c.desk)
  const newest = (a, b) => b.received.localeCompare(a.received) || b.id.localeCompare(a.id)
  const open = slips.filter(s => s.state === 'open').sort(newest)
  const done = slips.filter(s => s.state !== 'open').sort(newest)
  const row = s => `| ${s.id} | ${when(s.received)} | ${cell(s.asked_by)} | ${s.kind} | ${clip(s.subject, 60)} | ${isOverdue(s, c.now) ? '**overdue**' : s.state === 'open' ? 'open' : s.state} | ${(s.cited || []).slice(0, 5).map(x => '`' + x + '`').join(' ')} |`
  const head = ['| Slip | Received | Asked by | Kind | Subject | State | Cards cited |', '|---|---|---|---|---|---|---|']
  const nOver = open.filter(s => isOverdue(s, c.now)).length
  const L = ['---', 'title: "The reference desk register"', 'by: librarian@PrompTugal.dinis (generated by build/desk.mjs; never hand-edited)', `generated: ${iso(c.now)}`, '---',
    '# The reference desk register', '',
    'Every question to the library is a call slip (one question, written down), and every answer is on the record. Questions are public by default. Open slips come first, then the answered ones, newest first. Overdue means open for longer than two librarian wakes (6 hours).', '',
    `${slips.length} slips: ${open.length} open (${nOver} overdue), ${done.length} answered or closed.`, '',
    '## Open', '', ...(open.length ? tables(open.map(row), head) : ['Nothing is open.']), '',
    '## Answered and closed', '', ...(done.length ? tables(done.map(row), head) : ['Nothing is answered yet.']), '',
    'How to ask: seal one question to the librarian lane (`board/inboxes/librarian.json`) with `python3 -I board/tools/agent_inboxes.py send`, first line `QUESTION`. The answer is sent back within about an hour and copied here.', '']
  fs.writeFileSync(path.join(c.desk, 'index.md'), L.join('\n'))

  const wants = slips.filter(s => s.state === 'not-held' || (s.kind === 'question' && s.state === 'open'))
  const W = ['---', 'title: "The wants list: what the library could not answer yet"', `generated: ${iso(c.now)}`, '---',
    '# The wants list', '', 'Questions the library could not answer yet (nothing held, or not answered so far): things it should acquire, and who could supply them.', '',
    ...(wants.length ? tables(wants.sort(newest).map(s => `| ${s.id} | ${cell(s.asked_by)} | ${clip(s.subject, 80)} | ${s.state === 'not-held' ? 'not held by the library' : isOverdue(s, c.now) ? 'open, overdue' : 'open'} |`), ['| Slip | Asked by | Subject | Why it is here |', '|---|---|---|---|']) : ['Nothing is wanted at the moment.']), '']
  fs.writeFileSync(path.join(c.desk, 'wants.md'), W.join('\n'))
  const nb = noticeBoard(c, slips)
  fs.writeFileSync(c.notice, nb.text)
  if (o.advance) fs.writeFileSync(path.join(c.desk, 'notice-state.json'), JSON.stringify({ at: iso(c.now) }, null, 1) + '\n')
  return { slips: slips.length, open: open.length, overdue: nOver, noticeLines: nb.text.trimEnd().split('\n').length }
}

function noticeBoard(c, slips) {
  const MAX = 59
  const state = rd(path.join(c.desk, 'notice-state.json'), null)
  const cat = rd(c.catalogue, {})
  const cards = rd(c.cards, { columns: [], rows: [] })
  const ix = n => cards.columns.indexOf(n)
  const titleOf = new Map(cards.rows.map(r => [r[ix('id')], r[ix('title')]]))
  const head = ['---', 'title: "The notice board"', 'by: librarian@PrompTugal.dinis (generated by build/desk.mjs)', `generated: ${iso(c.now)}`, `site_version: ${cat.site_version || ''}`, '---',
    `# The notice board, ${when(iso(c.now))}`, '(What an agent reads at each wake, in this order, without asking. Plain words: findings to you, what waits on Dinis, what is new, notices.)', '']
  const sec = []
  // findings to you: findings not yet decided, by owner
  const open = (cat.findings || []).filter(f => !f.decided)
  const byOwner = {}
  for (const f of open) (byOwner[f.owner || 'unassigned'] ||= []).push(f)
  const F = ['## Findings to you']
  if (!open.length) F.push('No open findings: every finding of every pass has a decision.')
  else for (const [ow, fs_] of Object.entries(byOwner).slice(0, 8)) F.push(`- to ${ow}: ${clip(fs_[0].title, 90)}${fs_.length > 1 ? ` (and ${fs_.length - 1} more)` : ''}`)
  const q = slips.filter(s => s.kind === 'question' && s.state === 'open')
  if (q.length) F.push(`- ${q.length} call slip(s) wait for the librarian's answer: [the register](desk/index.md)`)
  sec.push(F)
  const w = rd(c.waits, { waits: [], counts: {} })
  const Wt = [`## Waiting on Dinis (${w.counts?.blocked ?? 0} blocked, ${w.counts?.question ?? 0} questions)`]
  const ws = [...(w.waits || [])].sort((a, b) => (a.kind === 'blocked' ? 0 : 1) - (b.kind === 'blocked' ? 0 : 1))
  for (const x of ws.slice(0, 8)) Wt.push(`- ${x.agent || ''}: ${clip(x.text, 110)}`)
  if (ws.length > 8) Wt.push(`(${ws.length - 8} more in waits-on-dinis.md)`)
  if (!ws.length) Wt.push('Nothing waits on Dinis.')
  sec.push(Wt)
  const accs = fs.existsSync(c.accessions) ? fs.readFileSync(c.accessions, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []
  const fresh = state ? accs.filter(a => a.at > state.at) : accs
  const A = [`## New accessions (${fresh.length}${state ? ` since ${when(state.at)}` : ', no earlier notice board'})`]
  const kinds = {}
  for (const a of fresh) (kinds[a.id.split(':')[0]] ||= []).push(a)
  const sorted = Object.entries(kinds).sort((a, b) => b[1].length - a[1].length)
  A.push(sorted.map(([k, v]) => `${k} ${v.length}`).join(', ') || 'none')
  for (const a of fresh.slice(-10).reverse()) A.push(`- \`${a.id}\` ${clip(titleOf.get(a.id) || a.call, 70)}`)
  if (fresh.length > 10) A.push(`(${fresh.length - 10} more in accession-register.jsonl)`)
  sec.push(A)
  const n = slips.filter(s => s.kind === 'notice' && s.state === 'open')
  const N = ['## Notices']
  const over = slips.filter(s => isOverdue(s, c.now)).length
  if (over) N.push(`- ${over} call slip(s) are overdue (open longer than 6 hours): the desk is slow, ask the conductor.`)
  for (const s of n.sort((a, b) => b.received.localeCompare(a.received)).slice(0, 8)) N.push(`- from ${cell(s.asked_by)}, ${when(s.received)}: ${clip(s.subject, 80)}`)
  if (n.length > 8) N.push(`(${n.length - 8} older notices in the register)`)
  if (N.length === 1) N.push('None.')
  sec.push(N)
  let lines = [...head]
  for (const s of sec) lines.push(...s, '')
  lines.push('Back to the front door: [the library](index.md)')
  while (lines.length > MAX) { // trim the longest section's tail, never the headings
    const idx = lines.map((l, i) => [l, i]).filter(([l]) => l.startsWith('- ') || l.startsWith('(')).map(([, i]) => i)
    if (!idx.length) break
    lines.splice(idx[idx.length - 1], 1)
  }
  return { text: lines.join('\n') + '\n' }
}

// ---------- command line ----------
function parse(argv) {
  const o = {}, pos = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--not-held') o.notHeld = true
    else if (a === '--advance') o.advance = true
    else if (a.startsWith('--')) o[a.slice(2)] = argv[++i]
    else pos.push(a)
  }
  return { cmd: pos[0], pos: pos.slice(1), o }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { cmd, pos, o } = parse(process.argv.slice(2))
  try {
    if (cmd === 'intake') {
      const r = intake(o)
      console.log(`desk intake: ${r.taken.length} new slip(s), ${r.total} in the register${r.skipped ? `, ${r.skipped} file(s) skipped (not a message)` : ''}`)
      for (const s of r.taken) console.log(`  ${s.id} ${s.kind} ${s.asked_by} | ${s.subject}${s.redacted ? ` (${s.redacted} redacted)` : ''}`)
    } else if (cmd === 'answer') {
      const r = answer({ ...o, id: pos[0] })
      console.log(`desk answer: ${r.line.id} ${r.line.state}; cards cited: ${r.line.cited.join(', ') || 'none'}${r.line.cited_unknown ? `; not in cards.json: ${r.line.cited_unknown.join(', ')}` : ''}`)
      console.log(r.command ? 'Send it back with (not sent):\n' + r.command : 'The asker is unsigned: nothing to send back; ask the conductor who it was.')
    } else if (cmd === 'index') {
      const r = index(o)
      console.log(`desk index: ${r.slips} slips, ${r.open} open, ${r.overdue} overdue; notice board ${r.noticeLines} lines`)
    } else { console.error('usage: desk.mjs intake --from <folder> | answer <slip-id> --file <answer.md> [--not-held] | index [--advance]'); process.exit(2) }
  } catch (e) { console.error('desk: ' + e.message); process.exit(1) }
}
