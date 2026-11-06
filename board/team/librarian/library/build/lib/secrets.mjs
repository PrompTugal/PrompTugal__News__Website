// What must never be published: key shapes, tokens, vault keys, contact details, em-dashes. One list for the check
// and the stocktake (ST16). The gate's own shapes (newsroom/build/secrets.cjs) are read, never written, when present.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

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
    if (!AGENT_HANDLE.test(m[0])) { out.push('contains an address that is not an agent handle'); break }
  }
  for (const m of text.matchAll(/(?<![A-Za-z0-9+/_.-])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/_.-])/g)) {
    if (/[0-9]/.test(m[0]) && /[A-Z]/.test(m[0]) && /[a-z]/.test(m[0])) { out.push('contains a key-shaped string'); break }
  }
  if (text.includes('—')) out.push('contains an em-dash')
  return out
}
