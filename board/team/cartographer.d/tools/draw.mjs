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
  if (j.kind === 'structure') { drawStructure(j, f); continue }
  if (j.kind !== 'wardley') { console.log(`skip ${path.basename(f)}: kind ${j.kind} not drawn yet`); continue }
  const by = Object.fromEntries(j.nodes.map(n => [n.id, n]))
  const colour = { need: '#0b6b3a', goal: '#5b2a86', player: '#7a5a00', component: '#1f3a5f', gap: '#b3261e' }
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
  for (const l of (j.draw?.links === 'none' ? [] : j.links)) {
    const a = by[l.from], b = by[l.to]; if (!a || !b) continue
    const dash = l.type === 'lacks' ? ' stroke-dasharray="5 4" stroke="#b3261e"' : ' stroke="#888"'
    s.push(`<line x1="${px(a.evolution)}" y1="${py(a.visibility) + 6}" x2="${px(b.evolution)}" y2="${py(b.visibility) - 6}"${dash} stroke-width="1.2" marker-end="url(#a)"/>`)
  }
  for (const m of j.moves || []) { const n = by[m.node]; s.push(`<line x1="${px(n.evolution)}" y1="${py(n.visibility)}" x2="${px(m.to)}" y2="${py(n.visibility)}" stroke="#d98200" stroke-width="2" stroke-dasharray="2 3" marker-end="url(#a)"/>`) }
  for (const n of j.nodes) {
    const x = px(n.evolution), y = py(n.visibility), c = colour[n.type] || '#1f3a5f'
    s.push(`<circle cx="${x}" cy="${y}" r="6" fill="${n.type === 'gap' || n.flagged ? '#fff' : c}" stroke="${c}" stroke-width="2"${n.flagged ? ' stroke-dasharray="3 2" opacity="0.6"' : ''}><title>${esc(n.label)} (source: ${esc(n.source)}) ${esc(n.evidence || '')}</title></circle>`)
    wrap(n.label, 26).forEach((t, i) => s.push(`<text text-anchor="${x > W - 260 ? 'end' : 'start'}" x="${x > W - 260 ? x - 10 : x + 10}" y="${y + 4 + i * 12}" font-size="13" fill="#111">${esc(t)}</text>`))
  }
  s.push(`<text x="${L}" y="${H - 14}" font-size="11" fill="#555">Green: user need. Purple: the shared goal. Blue: component. Red ring: a gap (named as missing in the sources). Orange arrow: a suggested move, for strategy.d. Faint dashed: low confidence. Positions are a reading of the sources.</text>`)
  s.push('</svg>')
  const out = f.replace(/\.json$/, '.svg')
  fs.writeFileSync(out, s.join('\n') + '\n')
  console.log('wrote', path.relative(process.cwd(), out))
}

// structure maps: a parent tree, left to right, one row per role; colour by state; dashed where the role is proposed, not ratified
function drawStructure(j, f) {
  const by = Object.fromEntries(j.nodes.map(n => [n.id, n]))
  const kids = id => j.nodes.filter(n => n.parent === id)
  const roots = j.nodes.filter(n => !n.parent || !by[n.parent])
  let row = 0
  const place = (n, depth) => { n.depth = depth; n.row = row++; kids(n.id).forEach(k => place(k, depth + 1)) }
  roots.forEach(r => place(r, 0))
  const maxDepth = Math.max(...j.nodes.map(n => n.depth)), BW = 330, BH = 34, GAP = 22, X0 = 30, Y0 = 110
  const Wd = X0 * 2 + (maxDepth + 1) * (BW + 40) + 20, Hd = Y0 + row * (BH + 8) + 150
  const col = s => /working/.test(s) ? '#d8f0df' : /waiting/.test(s) ? '#fdebc8' : /completed|review/.test(s) ? '#e4e4e4' : '#fff'
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="${esc(j.title)}" font-family="system-ui, sans-serif"><rect width="${Wd}" height="${Hd}" fill="#fff"/>`]
  o.push(`<text x="${X0}" y="34" font-size="22" font-weight="600" fill="#111">${esc(j.title)}</text>`)
  o.push(`<text x="${X0}" y="58" font-size="13" fill="#444">structure map, ${esc(j.status)}, made ${esc(j.made)} by ${esc(j.made_by)}; drawn from holacracy.d's org-chart.json</text>`)
  o.push(`<text x="${X0}" y="80" font-size="13" fill="#444">Green: working. Amber: waiting on Dinis. Grey: completed or in review. Dashed border: proposed, not ratified. Blue bar: relayed. Dotted blue line: conducts. Reading: the line from a role goes to the role that started it.</text>`)
  const xy = n => ({ x: X0 + n.depth * (BW + 40), y: Y0 + n.row * (BH + 8) })
  for (const n of j.nodes) { const p = by[n.parent]; if (!p) continue; const a = xy(p), b = xy(n)
    o.push(`<path d="M${a.x + 14} ${a.y + BH} V${b.y + BH / 2} H${b.x}" fill="none" stroke="#999"/>`) }
  for (const l of j.links.filter(l => l.type === 'conducts')) { const a = by[l.from], b = by[l.to]; if (!a || !b) continue; const p = xy(a), q = xy(b)
    o.push(`<path d="M${p.x + BW} ${p.y + BH / 2} C${p.x + BW + 36} ${p.y + BH / 2} ${q.x + BW + 36} ${q.y + BH / 2} ${q.x + BW} ${q.y + BH / 2}" fill="none" stroke="#2a6fdb" stroke-dasharray="2 3" stroke-width="1.6"/>`) }
  for (const n of j.nodes) { const { x, y } = xy(n)
    o.push(`<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="4" fill="${col(n.state)}" stroke="#555"${n.proposed ? ' stroke-dasharray="5 3"' : ''}><title>${esc(n.label)}; ${esc(n.state)}; ${esc(n.source)}</title></rect>`)
    if (n.relayed) o.push(`<rect x="${x}" y="${y}" width="6" height="${BH}" fill="#2a6fdb"/>`)
    o.push(`<text x="${x + 12}" y="${y + 14}" font-size="13" font-weight="600" fill="#111">${esc(n.label)}${n.relayed ? ' (relayed)' : ''}</text>`)
    o.push(`<text x="${x + 12}" y="${y + 28}" font-size="11" fill="#444">${esc((n.circle || '') + ' | ' + (n.state || '').slice(0, 48))}</text>`) }
  const by0 = Y0 + row * (BH + 8) + 20
  o.push(`<rect x="${X0}" y="${by0}" width="${Wd - X0 * 2}" height="90" fill="none" stroke="#777" stroke-dasharray="6 4"/>`)
  o.push(`<text x="${X0 + 10}" y="${by0 + 22}" font-size="14" font-weight="600" fill="#333">Account B (reported, not seen)</text>`)
  wrap(j.account_b || '', 150).slice(0, 3).forEach((t, i) => o.push(`<text x="${X0 + 10}" y="${by0 + 42 + i * 16}" font-size="12" fill="#444">${esc(t)}</text>`))
  o.push('</svg>')
  const out = f.replace(/\.json$/, '.svg'); fs.writeFileSync(out, o.join('\n') + '\n'); console.log('wrote', path.relative(process.cwd(), out))
}
