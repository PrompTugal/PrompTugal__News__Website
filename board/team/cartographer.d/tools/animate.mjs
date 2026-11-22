// animate.mjs: draws maps/<id>.history.json as an animated SVG (SMIL, no script) and a narration script (a script, no model).
// usage: node board/team/cartographer.d/tools/animate.mjs [maps/<file>.history.json]   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const f = process.argv[2] ? path.resolve(process.argv[2]) : path.join(dir, 'maps/decision-making.history.json')
const j = JSON.parse(fs.readFileSync(f, 'utf8'))
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const r1 = x => Math.round(x * 10) / 10
const W = 1100, H = 700, L = 70, R = 40, T = 80, B = 130
const px = e => r1(L + e * (W - L - R)), py = v => r1(T + (1 - v) * (H - T - B))
const N = j.steps.length, STEP = 5, TOTAL = N * STEP + 3   // seconds: each step 5 s, a 3 s hold at the end, then it loops
const kt = t => (t / TOTAL).toFixed(4)
const state = {}   // node -> [ {t, e} ]
j.steps.forEach((s, i) => { for (const ev of s.events) (state[ev.node] ||= []).push({ t: i * STEP, e: ev.evolution, first: !state[ev.node] }) })
const o = []
o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(j.title)}" font-family="system-ui, sans-serif">`)
o.push(`<rect width="${W}" height="${H}" fill="#fff"/>`)
o.push(`<text x="${L}" y="32" font-size="20" font-weight="600" fill="#111">${esc(j.title)}</text>`)
o.push(`<text x="${L}" y="54" font-size="12" fill="#444">history map, ${esc(j.status)}, made ${esc(j.made)} by ${esc(j.made_by)}; plays in a loop of ${TOTAL} seconds; positions are a reading of the sources</text>`)
o.push(`<rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="none" stroke="#999"/>`)
;['Genesis', 'Custom-built', 'Product (+ rental)', 'Commodity (+ utility)'].forEach((n, i) => {
  const x = r1(L + i * (W - L - R) / 4)
  if (i) o.push(`<line x1="${x}" y1="${T}" x2="${x}" y2="${H - B}" stroke="#ccc" stroke-dasharray="4 4"/>`)
  o.push(`<text x="${r1(x + 6)}" y="${H - B + 18}" font-size="12" fill="#555">${n}</text>`)
})
// nodes
for (const [id, ks] of Object.entries(state)) {
  const c = j.components[id], y = py(c.visibility)
  const keyT = [], pos = [], op = []
  ks.forEach((k, i) => {
    if (i === 0) { keyT.push(0); pos.push(px(k.e)); op.push(0); keyT.push(Math.max(k.t, 0.01)); pos.push(px(k.e)); op.push(0) ; keyT.push(k.t + 0.8); pos.push(px(k.e)); op.push(1) }
    else { keyT.push(k.t + 0.8); pos.push(px(ks[i - 1].e)); op.push(1); keyT.push(k.t + 3.2); pos.push(px(k.e)); op.push(1) }
  })
  keyT.push(TOTAL); pos.push(pos[pos.length - 1]); op.push(1)
  // the node loops: start hidden at 0
  const kts = keyT.map(kt).join(';')
  o.push(`<g opacity="0"><animate attributeName="opacity" values="${op.join(';')}" keyTimes="${kts}" dur="${TOTAL}s" repeatCount="indefinite"/>`)
  o.push(`<g><animateTransform attributeName="transform" type="translate" values="${pos.map(p => `${p} ${y}`).join(';')}" keyTimes="${kts}" dur="${TOTAL}s" repeatCount="indefinite"/>`)
  o.push(`<circle r="7" fill="#1f3a5f"/><text x="12" y="4" font-size="12" fill="#111">${esc(c.label)}</text></g></g>`)
}
// captions: each shows for its step; the first starts visible, the last holds to the end
const cap = (i) => {
  const a = i * STEP, b = a + STEP, last = i === N - 1
  let ts, vs
  if (i === 0) { ts = [0, b - 0.4, b, TOTAL]; vs = [1, 1, 0, 0] }
  else if (last) { ts = [0, a, a + 0.4, TOTAL]; vs = [0, 0, 1, 1] }
  else { ts = [0, a, a + 0.4, b - 0.4, b, TOTAL]; vs = [0, 0, 1, 1, 0, 0] }
  return `opacity="${vs[0]}"><animate attributeName="opacity" values="${vs.join(';')}" keyTimes="${ts.map(kt).join(';')}" dur="${TOTAL}s" repeatCount="indefinite"/>`
}
j.steps.forEach((s, i) => {
  o.push(`<text x="${L}" y="${H - 70}" font-size="15" fill="#111" ${cap(i)}${esc(s.caption)}</text>`)
  o.push(`<text x="${L}" y="${H - 48}" font-size="12" fill="#666" ${cap(i)}${esc(s.date)}; source: ${esc(s.source)} (see sources_read in the JSON)</text>`)
})
o.push(`<text x="${L}" y="${H - 14}" font-size="11" fill="#555">Evolution, left to right. Visible to the user, bottom to top. A circle appears when the sources first record the component and slides as it matures.</text>`)
o.push('</svg>')
const out = f.replace(/\.json$/, '.svg')
fs.writeFileSync(out, o.join('\n') + '\n')
const narr = ['# Narration: ' + j.title, '', `By cartographer.d@AgentiCCells.dinis, ${j.made}. One paragraph per step, about ${STEP} seconds each, for studio.d to voice. Facts and dates are from the sources in the history file.`, '',
  ...j.steps.map((s, i) => `${i + 1}. (${s.date}) ${s.caption}`), '']
fs.writeFileSync(f.replace(/\.json$/, '.narration.md'), narr.join('\n'))
console.log('wrote', path.relative(process.cwd(), out), 'and the narration')
