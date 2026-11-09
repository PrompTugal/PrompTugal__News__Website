// What must never be published: key shapes, tokens, vault keys, contact details, em-dashes. One list for the check
// and the stocktake (ST16). The gate's own shapes (newsroom/build/secrets.cjs) are read, never written, when present.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// the estate's agent handles, <role>@<project>.<operator>; operators added as they appear on the board (7 November 2026:
// Angelo's agent holds a key in board/keys.json; Silvio's design agent is credited in board/spec-front-page-e.md)
// The operator suffixes are not DNS top-level domains, so an address ending in one cannot be anyone's mailbox; the
// project before it may itself be dotted (9 November 2026: risk-mandate@promptugal.ai.dinis, named in Dinis's guidance).
const AGENT_HANDLE = /@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.(dinis|vicky|indi|angelo|silvio|jose)$/i
const SECRET_PATTERNS = [
  [/-----BEGIN [A-Z ]*KEY-----/, 'a key block'],
  [/\bsk-or-v1-[A-Za-z0-9]+/, 'an OpenRouter key'],
  [/\bOPEN_ROUTER_KEY\s*[=:]\s*\S/, 'an OpenRouter key assignment'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'a GitHub token'],
  [/\bvault[_ -]?key\s*[:=]\s*\S{8,}/i, 'a vault key'],
  [/\b[0-9a-f]{40,}\b/, 'a long hex string'],
  [/\+\d[\d ()-]{8,}\d/, 'a phone number'],
]

// and every agent that holds a key in board/keys.json (read, never written): a new operator's agent is known once its
// key is published there (7 November 2026: writer@PrompTugal.jose)
const keyed = new Map()
function keyedAgents(root) {
  if (!root) return new Set()
  if (!keyed.has(root)) {
    let s = new Set()
    try { s = new Set((JSON.parse(fs.readFileSync(path.join(root, 'board/keys.json'), 'utf8')).keys || []).map((k) => String(k.agent || '').toLowerCase()).filter((a) => /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(a))) } catch { s = new Set() }
    keyed.set(root, s)
  }
  return keyed.get(root)
}

let gate = null
function gateHits(root) {
  if (gate === null) {
    gate = false
    try {
      const f = path.join(root, 'newsroom/build/secrets.cjs')
      if (fs.existsSync(f)) gate = createRequire(import.meta.url)(f)
    } catch { gate = false }
  }
  return gate && typeof gate.keyHits === 'function' ? gate.keyHits : null
}

// the reasons a text may not be published; empty when it is clean
export function secretFindings(text, root) {
  const out = []
  for (const [re, what] of SECRET_PATTERNS) if (re.test(text)) out.push(`contains ${what}`)
  const gh = root ? gateHits(root) : null
  if (gh) for (const what of gh(text)) out.push(`contains ${what} (the gate's shape)`)
  for (const m of text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    // the domains reserved for examples (RFC 2606) are placeholders, never contact details
    if (/@(example\.(com|org|net)|[a-z0-9.-]+\.(example|test|invalid))$/i.test(m[0])) continue
    if (!AGENT_HANDLE.test(m[0]) && !keyedAgents(root).has(m[0].toLowerCase())) { out.push('contains an address that is not an agent handle'); break }
  }
  for (const m of text.matchAll(/(?<![A-Za-z0-9+/_.-])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/_.-])/g)) {
    if (/[0-9]/.test(m[0]) && /[A-Z]/.test(m[0]) && /[a-z]/.test(m[0])) { out.push('contains a key-shaped string'); break }
  }
  if (text.includes('—')) out.push('contains an em-dash')
  return out
}
