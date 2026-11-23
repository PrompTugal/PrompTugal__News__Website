// from-circles.mjs: draws holacracy.d's circles (org-chart.json circles[]) as nested cards: carto-map/1 kind "circles" plus its SVG (a script, no model).
// A circle with no written purpose is drawn red as NOT WRITTEN. Relayed circles are marked. Account B is not seen. cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const O = JSON.parse(fs.readFileSync('board/team/holacracy.d/org-chart.json', 'utf8'))
const short = s => String(s || '').replace(/@PrompTugal\.dinis|@AgentiCCells\.dinis/g, '').replace(/@(\w+)/g, ' ($1)')
const circles = O.circles.map(c => ({ id: c.id, label: c.name || c.id, lead: short(c.lead), purpose: c.purpose ? short(c.purpose) : null, fillers: (c.fillers || []).map(short), sub: c.sub || [], relayed: /relayed/i.test(JSON.stringify(c)), note: c.account_note ? short(c.account_note) : null, source: 'org' }))
const out = { format: 'carto-map/1', id: 'circles-account-d', kind: 'circles', status: 'draft', title: 'The circles of Dinis\'s estate and who leads them', made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  sources_read: { org: `board/team/holacracy.d/org-chart.json circles[] (generated ${O.generated}), read 23 Nov 2026; holacracy.d keeps the record, I draw it` },
  nodes: circles, notes: ['Red: a circle whose purpose is not written. Blue bar: holacracy.d marks something about it as relayed. Account B is reported, not seen.'] }
fs.writeFileSync('board/team/cartographer.d/maps/circles-account-d.circles.json', JSON.stringify(out, null, 1) + '\n')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const wrap = (t, n) => { const r = []; let l = ''; for (const w of String(t).split(' ')) { if ((l + ' ' + w).trim().length > n) { r.push(l); l = w } else l = (l + ' ' + w).trim() } if (l) r.push(l); return r }
const by = Object.fromEntries(circles.map(c => [c.id, c]))
const W = 1400, CW = 440, PAD = 24, LH = 16
const card = (c, x, y, w, depth) => {
  const body = [['Lead', c.lead], ['Purpose', c.purpose || 'NOT WRITTEN'], ['Fillers', c.fillers.join(', ') || 'none']]
  const lines = body.flatMap(([k, v]) => wrap(`${k}: ${v}`, Math.floor((w - 28) / 6.4)).slice(0, k === 'Purpose' ? 5 : 3).map((t, i) => ({ t, b: i === 0 })))
  if (c.note) wrap('Note: ' + c.note, Math.floor((w - 28) / 6.4)).slice(0, 3).forEach(t => lines.push({ t, b: false }))
  const subs = c.sub.map(id => by[id]).filter(Boolean)
  let h = 38 + lines.length * LH + 10
  const kids = subs.map(s => { const sh = card(s, 0, 0, w - 32, depth + 1).h; return { s, sh } })
  h += kids.reduce((a, k) => a + k.sh + 10, 0)
  const o = []
  o.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c.purpose ? '#f7f9fc' : '#fbe3e0'}" stroke="${c.purpose ? '#667' : '#b3261e'}" stroke-width="${c.purpose ? 1 : 2}"/>`)
  if (c.relayed) o.push(`<rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="#2a6fdb"/>`)
  o.push(`<text x="${x + 14}" y="${y + 24}" font-size="${depth ? 15 : 17}" font-weight="600" fill="#111">${esc(c.label)}${c.relayed ? ' (relayed)' : ''}</text>`)
  lines.forEach((l, i) => o.push(`<text x="${x + 14}" y="${y + 44 + i * LH}" font-size="12" fill="${/NOT WRITTEN/.test(l.t) ? '#b3261e' : '#222'}"${l.b ? ' font-weight="600"' : ''}>${esc(l.t)}</text>`))
  let cy = y + 38 + lines.length * LH + 10
  kids.forEach(k => { const r = card(k.s, x + 16, cy, w - 32, depth + 1); o.push(r.svg); cy += r.h + 10 })
  return { svg: o.join('\n'), h }
}
const anchor = by.anchor, top = anchor.sub.map(id => by[id]).filter(Boolean)
// layout the top circles in three columns, shortest column first
const cols = [0, 0, 0].map(() => ({ y: 130, items: [] }))
let body = ''
for (const c of top) { const col = cols.reduce((a, b) => a.y <= b.y ? a : b); const ci = cols.indexOf(col); const r = card(c, PAD + ci * (CW + 20), col.y, CW, 0); body += r.svg + '\n'; col.y += r.h + 14 }
const H = Math.max(...cols.map(c => c.y)) + 90
const s = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(out.title)}" font-family="system-ui, sans-serif"><rect width="${W}" height="${H}" fill="#fff"/>`]
s.push(`<text x="${PAD}" y="34" font-size="24" font-weight="600" fill="#111">${esc(out.title)}</text>`)
s.push(`<text x="${PAD}" y="60" font-size="13" fill="#444">circles view, ${out.status}, made ${out.made} by ${out.made_by}; drawn from holacracy.d's record. Red: purpose not written. Blue bar: relayed.</text>`)
s.push(`<rect x="${PAD - 8}" y="76" width="${W - PAD * 2 + 16}" height="${H - 96}" rx="12" fill="none" stroke="#999" stroke-dasharray="6 4"/>`)
s.push(`<text x="${PAD + 4}" y="100" font-size="15" font-weight="600" fill="${anchor.purpose ? '#111' : '#b3261e'}">${esc(anchor.label)}: lead ${esc(anchor.lead)}; purpose ${esc(anchor.purpose || 'NOT WRITTEN')}</text>`)
s.push(body)
s.push(`<text x="${PAD}" y="${H - 32}" font-size="12" fill="#555">Account B's circles are reported, not seen.</text></svg>`)
fs.writeFileSync('board/team/cartographer.d/maps/circles-account-d.circles.svg', s.join('\n') + '\n')
console.log('circles', circles.length)
