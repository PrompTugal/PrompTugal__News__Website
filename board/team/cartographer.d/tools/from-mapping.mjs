// from-mapping.mjs: draws holacracy.d's 16-part mapping (public/02-the-mapping.md) as a strip, a carto-map/1 "strip" map and its SVG (a script, no model).
// usage: node board/team/cartographer.d/tools/from-mapping.mjs   cartographer.d@AgentiCCells.dinis
import fs from 'node:fs'
const md = fs.readFileSync('board/team/holacracy.d/public/02-the-mapping.md', 'utf8')
const rows = md.split('\n').filter(l => /^\|/.test(l)).slice(2).map(l => l.split('|').slice(1, -1).map(c => c.trim())).filter(r => r.length === 3)
const level = m => /^strong/i.test(m) ? 'strong' : /^partial/i.test(m) ? 'partial' : /^missing/i.test(m) ? 'missing' : /^scattered/i.test(m) ? 'partial' : 'partial'
const nodes = rows.map((r, i) => ({ id: 'h' + (i + 1), label: r[0], type: 'part', match: level(r[2]), ours: r[1], note: r[2], source: 'mapping' }))
const out = {
  format: 'carto-map/1', id: 'holacracy-mapping', kind: 'strip', status: 'draft', title: 'Holacracy against how Dinis\'s agents run: 16 parts', made: new Date().toISOString().slice(0, 16) + 'Z', made_by: 'cartographer.d@AgentiCCells.dinis',
  sources_read: { mapping: 'board/team/holacracy.d/public/02-the-mapping.md, read 22 Nov 2026; the match (Strong, Partial, Missing) is holacracy.d\'s and maestro.d\'s own judgement, drawn as given; Holacracy constitution v5.0' },
  nodes, notes: ['I only draw; holacracy.d keeps the table.']
}
fs.writeFileSync('board/team/cartographer.d/maps/holacracy-mapping.strip.json', JSON.stringify(out, null, 1) + '\n')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const wrap = (s, n) => { const o = []; let l = ''; for (const w of s.split(' ')) { if ((l + ' ' + w).trim().length > n) { o.push(l); l = w } else l = (l + ' ' + w).trim() } if (l) o.push(l); return o }
const col = { strong: '#cfe9d6', partial: '#fdebc8', missing: '#f6cfcb' }, W = 1400, CW = 330, CH = 150, G = 14, PER = 4, X0 = 30, Y0 = 120
const H = Y0 + Math.ceil(nodes.length / PER) * (CH + G) + 70
const s = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(out.title)}" font-family="system-ui, sans-serif"><rect width="${W}" height="${H}" fill="#fff"/>`]
s.push(`<text x="${X0}" y="36" font-size="24" font-weight="600" fill="#111">${esc(out.title)}</text>`)
s.push(`<text x="${X0}" y="62" font-size="14" fill="#444">strip, ${out.status}, made ${out.made} by ${out.made_by}; the match is holacracy.d's and maestro.d's own judgement (Holacracy constitution v5.0)</text>`)
const n = k => nodes.filter(x => x.match === k).length
s.push(`<text x="${X0}" y="90" font-size="15" fill="#111">Strong: ${n('strong')}   Partial: ${n('partial')}   Missing: ${n('missing')}   (green, amber, red)</text>`)
nodes.forEach((p, i) => {
  const x = X0 + (i % PER) * (CW + G), y = Y0 + Math.floor(i / PER) * (CH + G)
  s.push(`<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="6" fill="${col[p.match]}" stroke="#666"><title>${esc(p.label)}: ${esc(p.ours)} (${esc(p.note)})</title></rect>`)
  wrap(p.label, 34).slice(0, 2).forEach((t, k) => s.push(`<text x="${x + 10}" y="${y + 22 + k * 18}" font-size="15" font-weight="600" fill="#111">${esc(t)}</text>`))
  wrap(p.ours, 44).slice(0, 5).forEach((t, k) => s.push(`<text x="${x + 10}" y="${y + 68 + k * 15}" font-size="12" fill="#222">${esc(t)}</text>`))
  wrap(p.note, 46).slice(0, 2).forEach((t, k, a) => s.push(`<text x="${x + 10}" y="${y + CH - 8 - (a.length - 1 - k) * 15}" font-size="12" font-weight="600" fill="#333">${esc(t)}</text>`))
})
s.push('</svg>')
fs.writeFileSync('board/team/cartographer.d/maps/holacracy-mapping.strip.svg', s.join('\n') + '\n')
console.log('parts', nodes.length, 'strong', n('strong'), 'partial', n('partial'), 'missing', n('missing'))
