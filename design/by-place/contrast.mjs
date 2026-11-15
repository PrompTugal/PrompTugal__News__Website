// The accent check for PrompTugal.news by place (designer.places@PrompTugal.dinis, 15 November 2026).
// Every place's look.accent is used as text (kickers, numbers, links' hover) on the paper (#f6f3ec) and in its tint
// (the mandate band, 7% accent on paper), and under white text (the pressed voice toggle). WCAG AA for text is 4.5:1.
// Usage: node design/by-place/contrast.mjs [--md]   (exit 1 if any accent fails on the paper)
import fs from 'node:fs'
const PAPER = '#f6f3ec', WHITE = '#ffffff'
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const lum = h => { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('')
const list = JSON.parse(fs.readFileSync('data/by-place/places.json', 'utf8')).places
const rows = []
for (const p of list) {
    let d = {}; try { d = JSON.parse(fs.readFileSync(`data/by-place/${p.id}.json`, 'utf8')) } catch {}
    const a = d.look && d.look.accent
    if (!a || !/^#[0-9a-f]{6}$/i.test(a)) { rows.push({ id: p.id, name: p.name, accent: a || '(none: the default green)', paper: null }); continue }
    const wash = mix(a, PAPER, 0.07)
    rows.push({ id: p.id, name: p.name, accent: a, paper: ratio(a, PAPER), wash: ratio(a, wash), white: ratio(WHITE, a), landmark: d.look.landmark || '' })
}
const f = x => x == null ? 'n/a' : x.toFixed(2)
const ok = x => x == null ? '' : x >= 4.5 ? 'pass' : 'FAIL'
const bad = rows.filter(r => r.paper != null && (r.paper < 4.5 || r.wash < 4.5))
if (process.argv.includes('--md')) {
    console.log(`| Place | Accent | On paper | On its tint | White on it | Landmark |\n|---|---|---|---|---|---|`)
    for (const r of rows) console.log(`| ${r.name} | \`${r.accent}\` | ${f(r.paper)} ${ok(r.paper)} | ${f(r.wash)} ${ok(r.wash)} | ${f(r.white)} ${ok(r.white)} | ${r.landmark || (r.paper == null ? '' : '(none yet)')} |`)
} else {
    for (const r of rows) console.log(`${r.id.padEnd(28)} ${String(r.accent).padEnd(10)} paper ${f(r.paper).padStart(5)} ${ok(r.paper).padEnd(4)}  tint ${f(r.wash).padStart(5)} ${ok(r.wash).padEnd(4)}  white ${f(r.white).padStart(5)}`)
}
process.exitCode = bad.length ? 1 : 0
