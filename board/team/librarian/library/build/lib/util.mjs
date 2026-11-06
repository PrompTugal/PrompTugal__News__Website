// Small shared helpers: deterministic JSON, file reading and writing, dates, slugs.
import fs from 'node:fs'
import path from 'node:path'

export const GENERATOR = 'library.mjs 0.1.0'
export const LIBRARIAN = 'librarian@PrompTugal.dinis'

export function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === 'object') {
    const o = {}
    for (const k of Object.keys(v).sort()) o[k] = sortKeys(v[k])
    return o
  }
  return v
}
export const stable = (v, indent) => JSON.stringify(sortKeys(v), null, indent)
export const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

export function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) {
    if (fallback !== undefined) return fallback
    throw new Error(`cannot read ${file}: ${e.message}`)
  }
}
export function readText(file, fallback = '') {
  try { return fs.readFileSync(file, 'utf8') } catch { return fallback }
}
export function readLines(file) {
  return readText(file).split('\n').filter((l) => l.trim() !== '')
}

// Write only when the content differs, so a second run leaves every file untouched.
export function writeIfChanged(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return false
  fs.writeFileSync(file, text)
  return true
}

export function walk(dir, filter = () => true) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => cmp(a.name, b.name))) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p, filter))
    else if (filter(p)) out.push(p)
  }
  return out
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// 2026-11-06T03:43:00Z -> "6 Nov 2026" (UTC, in words)
export function dateWords(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : ''
}

export function slug(s) {
  return String(s).trim().replace(/\s+/g, '-')
}

// First sentence or at most n words, em-dashes turned into plain hyphens.
export function words(text, n = 25) {
  const t = String(text || '').replace(/\u2014/g, ' - ').replace(/\s+/g, ' ').trim()
  const w = t.split(' ')
  if (w.length <= n) return t
  return w.slice(0, n).join(' ').replace(/[,;:]$/, '') + '…'
}
export const noDash = (s) => String(s == null ? '' : s).replace(/\u2014/g, ' - ')

export function mdCell(s) {
  return noDash(s).replace(/\|/g, '/').replace(/\n/g, ' ')
}
