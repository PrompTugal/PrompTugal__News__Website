// studio.storyboard's checker, v0: node check.mjs <file.storyboard.json>. Prints problems in plain words, or "ok".
import { readFileSync } from 'node:fs'
const p = []
let s
try { s = JSON.parse(readFileSync(process.argv[2], 'utf8')) } catch (e) { console.log('Not valid JSON: ' + e.message); process.exit(1) }
for (const k of ['format', 'slug', 'title', 'audience', 'requested_by', 'summary', 'beats', 'sources']) if (!s[k]) p.push(`Missing field: ${k}`)
if (s.format !== 'studio-storyboard/0') p.push('format must be "studio-storyboard/0"')
if (s.slug && !/^[a-z0-9][a-z0-9-]*$/.test(s.slug)) p.push('slug must be lowercase letters, digits and hyphens')
const src = new Map((s.sources || []).map(x => [x.id, x]))
for (const x of s.sources || []) { if (!x.url || !x.read) p.push(`Source ${x.id}: needs a url and the date read`) }
if ((s.beats || []).length < 3) p.push('At least 3 beats')
const kinds = ['title', 'stat', 'bars', 'timeline', 'flow', 'compare', 'list', 'image', 'svg', 'timeline', 'journey']
for (const b of s.beats || []) {
  if (!b.id || !b.narration || !b.visual) p.push(`Beat ${b.id || '?'}: needs id, narration and visual`)
  const w = (b.narration || '').split(/\s+/).filter(Boolean).length
  if (w > 60) p.push(`Beat ${b.id}: narration is ${w} words, keep under 60`)
  if (b.visual && !kinds.includes(b.visual.kind)) p.push(`Beat ${b.id}: visual kind "${b.visual.kind}" is not drawable yet; add a note and the director will choose`)
  for (const f of b.facts || []) if (!src.has(f)) p.push(`Beat ${b.id}: fact ${f} is not in sources`)
}
for (const d of [s.decision, ...(s.decisions || [])].filter(Boolean)) {
  if (!d.question || !(d.options || []).length) p.push('Decision: needs a question and options')
  if (d.recommendation && !(d.options || []).some(o => o.id === d.recommendation)) p.push('Decision: recommendation is not an option id')
}
const text = JSON.stringify(s)
if (text.includes('\u2014')) p.push('No em dashes in prose')
for (const m of text.match(/[\w.+-]+@[\w.-]+\.[a-z]+/gi) || []) if (!/@(PrompTugal|AgentiCCells)\.dinis$/i.test(m)) p.push(`Email-shaped name outside the allowed domains: ${m}`)
if (/(sk-[A-Za-z0-9]{16,}|BEGIN [A-Z ]*PRIVATE KEY)/.test(text)) p.push('Looks like a key or token')
console.log(p.length ? p.join('\n') : 'ok')
process.exit(p.length ? 1 : 0)
