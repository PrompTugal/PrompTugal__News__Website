// draw.mjs: draws maps/<id>.svg from a carto-map/1 JSON (a script, no model). cartographer.d@AgentiCCells.dinis
// usage: node board/team/cartographer.d/tools/draw.mjs [maps/<file>.json ...]   (no argument: every maps/*.json)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mapsDir = path.join(dir, 'maps')
const files = process.argv.length > 2 ? process.argv.slice(2).map(f => path.resolve(f)) : fs.readdirSync(mapsDir).filter(f => f.endsWith('.json')).map(f => path.join(mapsDir, f))
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const wrap = (s, n) => { const out = []; let l = ''; for (const w of s.split(' ')) { if ((l + ' ' + w).trim().length > n) { out.push(l); l = w } else l = (l + ' ' + w).trim() } if (l) out.push(l); return out }
const W = 1400, H = 1000, L = 70, R = 30, T = 90, B = 90
const r1 = x => Math.round(x * 10) / 10
const px = e => r1(L + e * (W - L - R)), py = v => r1(T + (1 - v) * (H - T - B))
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  if (j.kind !== 'wardley') { console.log(`skip ${path.basename(f)}: kind ${j.kind} not drawn yet`); continue }
  const by = Object.fromEntries(j.nodes.map(n => [n.id, n]))
  const colour = { need: '#0b6b3a', goal: '#5b2a86', component: '#1f3a5f', gap: '#b3261e' }
  const s = []
  s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(j.title)}" font-family="system-ui, sans-serif">`)
  s.push(`<rect width="${W}" height="${H}" fill="#fff"/>`)
  s.push(`<text x="${L}" y="30" font-size="20" font-weight="600" fill="#111">${esc(j.title)}</text>`)
  s.push(`<text x="${L}" y="50" font-size="12" fill="#444">${esc(j.kind)} map, ${esc(j.status)}, made ${esc(j.made)} by ${esc(j.made_by)} from ${Object.keys(j.sources_read).length} sources (see the JSON)</text>`)
  s.push(`<rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="none" stroke="#999"/>`)
  for (const [i, name] of ['Genesis', 'Custom-built', 'Product (+ rental)', 'Commodity (+ utility)'].entries()) {
    const x = r1(L + i * (W - L - R) / 4)
    if (i) s.push(`<line x1="${x}" y1="${T}" x2="${x}" y2="${H - B}" stroke="#ccc" stroke-dasharray="4 4"/>`)
    s.push(`<text x="${x + 6}" y="${H - B + 18}" font-size="12" fill="#555">${name}</text>`)
  }
  s.push(`<text x="${L}" y="${H - B + 50}" font-size="12" fill="#555">Evolution, left to right</text>`)
  s.push(`<text transform="translate(22 ${T + 200}) rotate(-90)" font-size="12" fill="#555">Visible to the user</text>`)
  s.push(`<defs><marker id="a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#888"/></marker></defs>`)
  for (const l of j.links) {
    const a = by[l.from], b = by[l.to]; if (!a || !b) continue
    const dash = l.type === 'lacks' ? ' stroke-dasharray="5 4" stroke="#b3261e"' : ' stroke="#888"'
    s.push(`<line x1="${px(a.evolution)}" y1="${py(a.visibility) + 6}" x2="${px(b.evolution)}" y2="${py(b.visibility) - 6}"${dash} stroke-width="1.2" marker-end="url(#a)"/>`)
  }
  for (const m of j.moves || []) { const n = by[m.node]; s.push(`<line x1="${px(n.evolution)}" y1="${py(n.visibility)}" x2="${px(m.to)}" y2="${py(n.visibility)}" stroke="#d98200" stroke-width="2" stroke-dasharray="2 3" marker-end="url(#a)"/>`) }
  for (const n of j.nodes) {
    const x = px(n.evolution), y = py(n.visibility), c = colour[n.type] || '#1f3a5f'
    s.push(`<circle cx="${x}" cy="${y}" r="6" fill="${n.type === 'gap' ? '#fff' : c}" stroke="${c}" stroke-width="2"><title>${esc(n.label)} (source: ${esc(n.source)}) ${esc(n.evidence || '')}</title></circle>`)
    wrap(n.label, 26).forEach((t, i) => s.push(`<text text-anchor="${x > W - 260 ? 'end' : 'start'}" x="${x > W - 260 ? x - 10 : x + 10}" y="${y + 4 + i * 12}" font-size="11" fill="#111">${esc(t)}</text>`))
  }
  s.push(`<text x="${L}" y="${H - 14}" font-size="11" fill="#555">Green: user need. Purple: the shared goal. Blue: component. Red ring: a gap (named as missing in the sources). Orange arrow: a suggested move, for strategy.d. Positions are a reading of the sources.</text>`)
  s.push('</svg>')
  const out = f.replace(/\.json$/, '.svg')
  fs.writeFileSync(out, s.join('\n') + '\n')
  console.log('wrote', path.relative(process.cwd(), out))
}
