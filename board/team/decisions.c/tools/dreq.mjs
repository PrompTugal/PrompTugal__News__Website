#!/usr/bin/env node
// dreq.mjs: signed requests for the routers protocol v0 (board/routers/README.md), in decisions.d's v1 format
// (board/team/decisions.d/design/README.md, section 3). By decisions.c (AgentiCCells), 22 November 2026. Node 18+, no dependencies.
//
//   node board/team/decisions.c/tools/dreq.mjs canon <file.json>                 print the canonical bytes (what is signed)
//   node board/team/decisions.c/tools/dreq.mjs request --account a --agent router.a@AgentiCCells.dinis \
//        --power report-state --words-file <file with Dinis's words, verbatim> [--to-key sha256:..] [--hours 2] \
//        [--title <session title>] [--start-prompt <repo path>] [--wake <cron>] [--message-file <file>]
//        writes board/routers/ledger/requests/<id>.json, signed by this session's key (issuer only: needs sgit and ~/.sg-send/)
//   node board/team/decisions.c/tools/dreq.mjs sign-json <in.json> <out.json>     sign any JSON object (adds "sig"); issuer only
//   node board/team/decisions.c/tools/dreq.mjs verify <request.json> --pin sha256:<fp Dinis gave you> \
//        [--account a] [--agent <me>] [--my-key sha256:..] [--seen <nonces file>] [--no-git]
//        the receiver's checks (board/routers/README.md), fail closed: prints OK or REFUSED <step>: <why>; exit 0 / 1
//
// Canonical form: the object without "sig", keys sorted recursively (by code point), no whitespace, UTF-8, no trailing
// newline (jq -cjS 'del(.sig)'). Signature: ECDSA P-256 with SHA-256 over those bytes, raw r||s, base64 (sgit pki sign).
// Fingerprint of a key: "sha256:" + the first 16 hex of SHA-256 over its SPKI DER (sgit's and pki.sgit.ai's).
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ISSUER = { agent: 'decisions.c (AgentiCCells)', id: 'decisions.c-account-c' }
const POWERS = ['report-state', 'start-session', 'set-wake', 'pause-wake', 'send-message'] // v0's list, nothing else
const MAX_HOURS = 24

const sortDeep = v => Array.isArray(v) ? v.map(sortDeep)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sortDeep(v[k])])) : v
export const canon = o => { const c = { ...o }; delete c.sig; return Buffer.from(JSON.stringify(sortDeep(c)), 'utf8') }
export const fingerprint = pem => 'sha256:' + crypto.createHash('sha256')
  .update(crypto.createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16)

function args(argv) {
  const o = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { const k = argv[i].slice(2); o[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true } else o._.push(argv[i])
  }
  return o
}
const root = () => execFileSync('git', ['rev-parse', '--show-toplevel']).toString().trim()
const keysJson = r => JSON.parse(fs.readFileSync(path.join(r, 'board/keys.json'), 'utf8'))
const myEntry = r => keysJson(r).keys.find(k => k.id === ISSUER.id && k.status === 'active')

// Sign with this session's sgit key; the passphrase is read from ~/.sg-send/ and piped, never printed.
function sign(obj) {
  const r = root(), e = myEntry(r); if (!e) throw new Error(`no active ${ISSUER.id} in board/keys.json`)
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dreq-')), f = path.join(dir, 'm')
  try {
    fs.writeFileSync(f, canon(obj))
    execFileSync('sgit', ['pki', 'sign', f, '--fingerprint', e.encryption_fingerprint],
      { input: fs.readFileSync(path.join(os.homedir(), '.sg-send/decisions.c.pass')), stdio: ['pipe', 'ignore', 'ignore'] })
    const s = JSON.parse(fs.readFileSync(f + '.sig', 'utf8'))
    if (s.fingerprint !== e.signing_fingerprint) throw new Error('signed with an unexpected key')
    const out = { ...obj, sig: s.signature }
    const v = verifySig(out, e.bundle.sign); if (!v) throw new Error('own signature does not verify')
    return out
  } finally { fs.rmSync(dir, { recursive: true, force: true }) }
}
const verifySig = (o, pem) => { try { return crypto.verify('sha256', canon(o), { key: crypto.createPublicKey(pem), dsaEncoding: 'ieee-p1363' }, Buffer.from(o.sig || '', 'base64')) } catch { return false } }

function request(a) {
  const r = root(), e = myEntry(r)
  if (!a.account || !a.agent || !a['words-file']) throw new Error('need --account, --agent, --words-file')
  if (!POWERS.includes(a.power)) throw new Error(`--power must be one of ${POWERS.join(', ')} (v0)`)
  const words = fs.readFileSync(a['words-file'], 'utf8').replace(/\s+$/, '')
  const hours = Number(a.hours || 2); if (!(hours > 0 && hours <= MAX_HOURS)) throw new Error('--hours: (0, 24]')
  const now = new Date(), iso = d => d.toISOString().replace(/\.\d+Z$/, 'Z')
  const ask = { power: a.power }
  if (a.power === 'start-session') {
    if (!a.title || !a['start-prompt']) throw new Error('start-session needs --title and --start-prompt (a file in this repository)')
    if (!fs.existsSync(path.join(r, a['start-prompt']))) throw new Error(`no ${a['start-prompt']} in this repository`)
    Object.assign(ask, { title: a.title, start_prompt: a['start-prompt'],
      start_prompt_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(r, a['start-prompt']))).digest('hex') })
  }
  if (a.power === 'set-wake' || a.power === 'pause-wake') { if (!a.title) throw new Error('--title: the session'); ask.title = a.title; if (a.wake) ask.wake = a.wake }
  if (a.power === 'send-message') { if (!a.title || !a['message-file']) throw new Error('send-message needs --title and --message-file'); ask.title = a.title; ask.message = fs.readFileSync(a['message-file'], 'utf8') }
  const id = `${iso(now).replace(/[-:]/g, '').replace('T', '-').slice(0, 13)}-${a.account}-${a.power}-${crypto.randomBytes(3).toString('hex')}`
  const req = {
    v: 1, kind: 'agenticcells/dinis-request/v1', protocol: 'routers/v0', id,
    to: { agent: a.agent, account: String(a.account), key: a['to-key'] || null },
    issued: iso(now), expires: iso(new Date(now.getTime() + hours * 3600e3)),
    nonce: crypto.randomBytes(16).toString('base64url'),
    power: a.power, ask,
    text: words,
    evidence: { how: "Dinis's words, typed in decisions.c's session", session: e.session, at: iso(now),
      text_sha256: crypto.createHash('sha256').update(words).digest('hex') },
    delegation: { v0: 'trust anchor carried by Dinis by hand: the receiver pins issuer.signing from Dinis in its own session' },
    issuer: { agent: ISSUER.agent, record: e.encryption_fingerprint, signing: e.signing_fingerprint, session: e.session },
  }
  const signed = sign(req), out = path.join(r, 'board/routers/ledger/requests', id + '.json')
  fs.writeFileSync(out, JSON.stringify(signed, null, 2) + '\n'); console.log(path.relative(r, out))
}

function verify(file, a) {
  const refuse = (step, why) => { console.log(`REFUSED ${step}: ${why}`); process.exit(1) }
  let q; try { q = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { refuse('1 parse', e.message) }
  if (q.v !== 1 || q.kind !== 'agenticcells/dinis-request/v1' || q.protocol !== 'routers/v0') refuse('1 format', 'not a routers/v0 request')
  if (!/^sha256:[0-9a-f]{16}$/.test(a.pin || '')) refuse('2 pin', 'no pin: Dinis gives the issuer fingerprint in your session')
  if (q.issuer?.signing !== a.pin) refuse('2 pin', `issuer.signing ${q.issuer?.signing} is not the pinned ${a.pin}`)
  const r = a['no-git'] ? process.cwd() : root()
  const entry = keysJson(r).keys.find(k => k.bundle?.sign && fingerprint(k.bundle.sign) === a.pin)
  if (!entry) refuse('3 key', 'no key in board/keys.json has the pinned fingerprint')
  if (entry.status !== 'active') refuse('3 key', `the pinned key is ${entry.status}`)
  if (!verifySig(q, entry.bundle.sign)) refuse('4 signature', 'sig does not verify with the pinned key')
  const now = Date.now(), iss = Date.parse(q.issued), exp = Date.parse(q.expires)
  if (!(iss && exp) || now < iss - 120e3 || now > exp) refuse('5 dates', `now is outside [issued - 2 min, expires] (${q.issued} .. ${q.expires})`)
  if (exp - iss > MAX_HOURS * 3600e3) refuse('5 dates', 'longer than 24 h')
  if (a.account && q.to?.account !== String(a.account)) refuse('6 addressee', `to.account ${q.to?.account}, not ${a.account}`)
  if (a.agent && q.to?.agent !== a.agent) refuse('6 addressee', `to.agent ${q.to?.agent}, not ${a.agent}`)
  if (q.to?.key && a['my-key'] && q.to.key !== a['my-key']) refuse('6 addressee', 'to.key is not my key')
  if (a.seen && fs.existsSync(a.seen) && fs.readFileSync(a.seen, 'utf8').split('\n').some(l => l.split(' ')[0] === q.nonce)) refuse('7 replay', 'nonce already seen')
  if (!POWERS.includes(q.power) || q.ask?.power !== q.power) refuse('8 scope', `power ${q.power} is not in v0's list`)
  if (crypto.createHash('sha256').update(q.text || '').digest('hex') !== q.evidence?.text_sha256) refuse('8 scope', 'text and its hash differ')
  if (!a['no-git']) {
    const rel = `board/routers/ledger/requests/${q.id}.json`
    try { execFileSync('git', ['fetch', '-q', 'origin', 'dev'], { stdio: 'ignore' }) } catch {}
    let pub; try { pub = execFileSync('git', ['show', `origin/dev:${rel}`], { stdio: ['ignore', 'pipe', 'ignore'] }).toString() } catch { refuse('9 published', `${rel} is not on origin/dev`) }
    if (canon(JSON.parse(pub)).toString() !== canon(q).toString() || JSON.parse(pub).sig !== q.sig) refuse('9 published', 'differs from the copy on origin/dev')
    if (q.ask.start_prompt) {
      let sp; try { sp = execFileSync('git', ['show', `origin/dev:${q.ask.start_prompt}`], { stdio: ['ignore', 'pipe', 'ignore'] }) } catch { refuse('9 published', `${q.ask.start_prompt} is not on origin/dev`) }
      if (crypto.createHash('sha256').update(sp).digest('hex') !== q.ask.start_prompt_sha256) refuse('9 published', 'the start prompt changed since it was signed')
    }
  }
  if (a.seen) fs.appendFileSync(a.seen, `${q.nonce} ${q.expires}\n`)
  console.log(`OK ${q.id}: ${q.power} for ${q.to.agent} (account ${q.to.account}), signed by ${q.issuer.agent} ${q.issuer.signing}, until ${q.expires}`)
}

const a = args(process.argv.slice(2)), cmd = a._[0]
try {
  if (cmd === 'canon') process.stdout.write(canon(JSON.parse(fs.readFileSync(a._[1], 'utf8'))))
  else if (cmd === 'request') request(a)
  else if (cmd === 'sign-json') { const o = sign(JSON.parse(fs.readFileSync(a._[1], 'utf8'))); fs.writeFileSync(a._[2], JSON.stringify(o, null, 2) + '\n'); console.log(a._[2]) }
  else if (cmd === 'verify') verify(a._[1], a)
  else { console.error('usage: see the head of this file'); process.exit(2) }
} catch (e) { console.error('dreq: ' + e.message); process.exit(1) }
