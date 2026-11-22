#!/usr/bin/env node
// ledger.mjs: the cross-account ledger's tools (board/routers/README.md, protocol v0). Node 18+, no dependencies.
// Written by router.c (AgentiCCells), 22 November 2026.
//
//   node board/routers/ledger/tools/ledger.mjs open [--account c]        open requests (no receipt), by account
//   node board/routers/ledger/tools/ledger.mjs claims [--account c]      claims, each live or expired (lease_until)
//   node board/routers/ledger/tools/ledger.mjs receipts [--account c]    receipts: done or refused, and the step that failed
//   node board/routers/ledger/tools/ledger.mjs index [--check]           writes board/routers/ledger/index.json (--check: exit 1 if stale)
//   node board/routers/ledger/tools/ledger.mjs check <id> --pin <sha256:fp> --me <agent> --account <x> [--my-key <sha256:fp>]
//                                                                      the receiver's mechanical checks, fail closed; prints PASS or REFUSE <step>
//   node board/routers/ledger/tools/ledger.mjs selftest                 signs a throwaway request with a throwaway key and runs check on it
//
// The check covers what a script can: format, addressee, dates, the pin, the key from board/keys.json matching the pin,
// the signature (ECDSA P-256 over the request's canonical JSON without sig, sorted keys, compact: `jq -cS 'del(.sig)'`,
// raw r||s base64), nonce not seen in a claim or receipt, and the request file being on origin/dev. Whether the ask is
// inside the receiver's grant and off the never list stays the router's own judgement, written in the receipt.
// It never reads a private key, never prints one, never deletes or rewrites a ledger file.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const LEDGER = path.join(ROOT, 'board/routers/ledger')
const DIRS = ['requests', 'claims', 'receipts']
const KIND = 'agenticcells/dinis-request/v1'
const FIELDS = ['v', 'kind', 'to', 'issued', 'expires', 'nonce', 'ref', 'power', 'text', 'evidence', 'delegation', 'issuer', 'sig']
const REQUIRED = ['v', 'kind', 'to', 'issued', 'expires', 'nonce', 'text', 'issuer', 'sig']

const args = process.argv.slice(2)
const cmd = args[0]
const opt = name => { const i = args.indexOf(`--${name}`); return i > 0 ? args[i + 1] : undefined }
const flag = name => args.includes(`--${name}`)

function readDir (d) {
  const dir = path.join(LEDGER, d)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
    const id = f.slice(0, -5), file = `board/routers/ledger/${d}/${f}`
    try { return { id, file, json: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) } }
    catch (e) { return { id, file, error: `unreadable JSON: ${e.message}` } }
  })
}

const load = () => Object.fromEntries(DIRS.map(d => [d, readDir(d)]))
const accountOf = r => String(r.json?.to?.account ?? '?').toLowerCase()
const leaseState = (c, now = Date.now()) => {
  const t = Date.parse(c.json?.lease_until ?? '')
  return Number.isNaN(t) ? 'no-lease' : (t > now ? 'live' : 'expired')
}

function summary (now = new Date()) {
  const L = load()
  const claims = Object.fromEntries(L.claims.map(c => [c.id, c]))
  const receipts = Object.fromEntries(L.receipts.map(r => [r.id, r]))
  const requests = L.requests.map(r => ({
    id: r.id, file: r.file, account: accountOf(r), to_agent: r.json?.to?.agent ?? null,
    issued: r.json?.issued ?? null, expires: r.json?.expires ?? null, issuer: r.json?.issuer?.signing ?? null,
    error: r.error ?? null,
    state: receipts[r.id] ? (receipts[r.id].json?.outcome ?? 'receipted')
      : claims[r.id] ? `claimed-${leaseState(claims[r.id], now.getTime())}`
        : (Date.parse(r.json?.expires ?? '') < now.getTime() ? 'expired-unclaimed' : 'open')
  }))
  return {
    about: 'Index of the cross-account ledger (board/routers/README.md, v0). Written by board/routers/ledger/tools/ledger.mjs index; never edit by hand.',
    protocol: 'v0',
    counts: { requests: L.requests.length, claims: L.claims.length, receipts: L.receipts.length },
    by_account: requests.reduce((a, r) => { (a[r.account] ??= { open: 0, claimed: 0, receipted: 0 }); a[r.account][r.state === 'open' ? 'open' : r.state.startsWith('claimed') ? 'claimed' : 'receipted']++; return a }, {}),
    requests,
    claims: L.claims.map(c => ({ id: c.id, file: c.file, by: c.json?.router ?? null, lease_until: c.json?.lease_until ?? null, error: c.error ?? null })),
    receipts: L.receipts.map(r => ({ id: r.id, file: r.file, by: r.json?.router ?? null, outcome: r.json?.outcome ?? null, failed_step: r.json?.failed_step ?? null, error: r.error ?? null }))
  }
}

// --- canonical bytes and the signature --------------------------------------------------------------
const canon = v => Array.isArray(v) ? `[${v.map(canon).join(',')}]`
  : v && typeof v === 'object' ? `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`
    : JSON.stringify(v)
export const signedBytes = req => { const { sig, ...rest } = req; return Buffer.from(canon(rest), 'utf8') }
export const fingerprint = pem => 'sha256:' + crypto.createHash('sha256').update(crypto.createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16)
export function verifySig (req, pem) {
  try { return crypto.verify('sha256', signedBytes(req), { key: crypto.createPublicKey(pem), dsaEncoding: 'ieee-p1363' }, Buffer.from(req.sig, 'base64')) }
  catch { return false }
}

function keyForSigning (fp, keysFile = path.join(ROOT, 'board/keys.json')) {
  const j = JSON.parse(fs.readFileSync(keysFile, 'utf8'))
  return (j.keys ?? []).filter(k => (k.signing_fingerprint === fp || k.bundle?.signing_fingerprint === fp))
}

function onDev (file) {
  try { execFileSync('git', ['-C', ROOT, 'cat-file', '-e', `origin/dev:${file}`], { stdio: 'ignore' }); return true }
  catch { return false }
}

export function check (req, { pin, me, account, myKey, file, keysFile, now = Date.now(), seenNonces = new Set(), requireOnDev = true }) {
  const refuse = (step, why) => ({ ok: false, step, why })
  if (!pin) return refuse('0-pin', 'no issuer pinned by Dinis in this session: act on nothing')
  if (!req || typeof req !== 'object') return refuse('1-parse', 'not a JSON object')
  if (req.v !== 1 || req.kind !== KIND) return refuse('1-parse', `unknown v or kind (${req.v}, ${req.kind})`)
  const extra = Object.keys(req).filter(k => !FIELDS.includes(k)); if (extra.length) return refuse('1-parse', `extra fields: ${extra.join(', ')}`)
  const missing = REQUIRED.filter(k => req[k] === undefined); if (missing.length) return refuse('1-parse', `missing: ${missing.join(', ')}`)
  if (req.to?.agent !== me || String(req.to?.account ?? '').toLowerCase() !== String(account).toLowerCase()) return refuse('2-addressee', `to ${req.to?.agent}/${req.to?.account}, I am ${me}/${account}`)
  if (myKey && req.to?.key !== myKey) return refuse('2-addressee', 'to.key is not my current signing key')
  const iss = Date.parse(req.issued), exp = Date.parse(req.expires)
  if (Number.isNaN(iss) || Number.isNaN(exp)) return refuse('3-dates', 'issued or expires unreadable')
  if (exp - iss > 24 * 3600e3) return refuse('3-dates', 'lives longer than 24 hours')
  if (now < iss - 120e3 || now > exp) return refuse('3-dates', 'not in date')
  if (req.issuer?.signing !== pin) return refuse('4-pin', 'issuer.signing is not the pinned fingerprint')
  const keys = keyForSigning(pin, keysFile).filter(k => k.status === 'active')
  if (keys.length !== 1) return refuse('4-pin', `${keys.length} active entries in board/keys.json carry the pinned fingerprint`)
  const pem = keys[0].bundle?.sign
  if (!pem || fingerprint(pem) !== pin) return refuse('4-pin', 'the key in board/keys.json does not hash to the pin')
  if (!verifySig(req, pem)) return refuse('5-signature', 'sig does not verify')
  if (seenNonces.has(req.nonce)) return refuse('7-replay', 'nonce already seen')
  if (requireOnDev && !(file && onDev(file))) return refuse('6-published', 'request file is not on origin/dev')
  return { ok: true, step: 'pass', why: 'mechanical checks pass; the scope (grant, never list) is the router\'s to judge and record' }
}

// --- commands ---------------------------------------------------------------------------------------------
function table (rows, cols) {
  if (!rows.length) { console.log('(none)'); return }
  for (const r of rows) console.log(cols.map(c => `${c}=${r[c] ?? '-'}`).join('  '))
}

const acct = opt('account')?.toLowerCase()
if (cmd === 'open') {
  table(summary().requests.filter(r => r.state === 'open' && (!acct || r.account === acct)), ['account', 'id', 'to_agent', 'expires', 'error'])
} else if (cmd === 'claims') {
  const S = summary(), byId = Object.fromEntries(S.requests.map(r => [r.id, r.account]))
  table(load().claims.map(c => ({ account: byId[c.id] ?? '?', id: c.id, router: c.json?.router, lease_until: c.json?.lease_until, lease: leaseState(c), error: c.error }))
    .filter(r => !acct || r.account === acct), ['account', 'id', 'router', 'lease_until', 'lease', 'error'])
} else if (cmd === 'receipts') {
  const S = summary(), byId = Object.fromEntries(S.requests.map(r => [r.id, r.account]))
  table(S.receipts.map(r => ({ ...r, account: byId[r.id] ?? '?' })).filter(r => !acct || r.account === acct), ['account', 'id', 'by', 'outcome', 'failed_step', 'error'])
} else if (cmd === 'index') {
  const S = summary(), f = path.join(LEDGER, 'index.json')
  const out = JSON.stringify(S, null, 1) + '\n'
  // the index changes only when the ledger does: request states that depend on the clock (lease, expiry) are recomputed
  // by every reader, so the stale check compares the ledger's files, not the clock-dependent states.
  const strip = s => JSON.stringify({ ...s, by_account: undefined, requests: s.requests.map(({ state, ...r }) => r) })
  if (flag('check')) {
    const old = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null
    if (!old || strip(old) !== strip(S)) { console.error('ledger: index.json is stale; run: node board/routers/ledger/tools/ledger.mjs index'); process.exit(1) }
    console.log('ledger: index.json current')
  } else { fs.writeFileSync(f, out); console.log(`ledger: wrote board/routers/ledger/index.json (${S.counts.requests} requests, ${S.counts.claims} claims, ${S.counts.receipts} receipts)`) }
} else if (cmd === 'check') {
  const id = args[1], r = load().requests.find(x => x.id === id)
  if (!r) { console.log(`REFUSE 1-parse no request ${id}`); process.exit(1) }
  const L = load(), seen = new Set([...L.claims, ...L.receipts].filter(x => x.id !== id).map(x => x.json?.nonce).filter(Boolean))
  const res = r.error ? { ok: false, step: '1-parse', why: r.error } : check(r.json, { pin: opt('pin'), me: opt('me'), account: opt('account'), myKey: opt('my-key'), file: r.file, seenNonces: seen })
  console.log(`${res.ok ? 'PASS' : 'REFUSE ' + res.step} ${res.why}`); process.exit(res.ok ? 0 : 1)
} else if (cmd === 'selftest') {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' })
  const pem = publicKey.export({ type: 'spki', format: 'pem' }), fp = fingerprint(pem)
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'ledger-selftest-')), keysFile = path.join(tmp, 'keys.json')
  fs.writeFileSync(keysFile, JSON.stringify({ keys: [{ id: 't', status: 'active', signing_fingerprint: fp, bundle: { sign: pem } }] }))
  const now = Date.now()
  const req = { v: 1, kind: KIND, to: { agent: 'router.t', account: 't' }, issued: new Date(now - 60e3).toISOString(), expires: new Date(now + 3600e3).toISOString(), nonce: crypto.randomBytes(16).toString('base64url'), text: 'report the account state', issuer: { agent: 'test', signing: fp } }
  req.sig = crypto.sign('sha256', signedBytes(req), { key: privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64')
  const base = { pin: fp, me: 'router.t', account: 't', keysFile, requireOnDev: false }
  const cases = [
    ['good request passes', check(req, base).ok === true],
    ['no pin refuses', check(req, { ...base, pin: undefined }).step === '0-pin'],
    ['other pin refuses', check(req, { ...base, pin: 'sha256:' + 'ab'.repeat(8) }).step === '4-pin'],
    ['wrong addressee refuses', check(req, { ...base, me: 'router.x' }).step === '2-addressee'],
    ['tampered text refuses', check({ ...req, text: 'start everything' }, base).step === '5-signature'],
    ['expired refuses', check(req, { ...base, now: now + 7200e3 }).step === '3-dates'],
    ['extra field refuses', check({ ...req, x: 1 }, base).step === '1-parse'],
    ['replayed nonce refuses', check(req, { ...base, seenNonces: new Set([req.nonce]) }).step === '7-replay'],
    ['not on dev refuses', check(req, { ...base, requireOnDev: true, file: 'board/routers/ledger/requests/none.json' }).step === '6-published']
  ]
  fs.rmSync(tmp, { recursive: true })
  for (const [name, ok] of cases) console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`)
  process.exit(cases.every(c => c[1]) ? 0 : 1)
} else {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).slice(0, 12).map(l => l.slice(3)).join('\n'))
  process.exit(cmd ? 1 : 0)
}
