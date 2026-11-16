// designer@PrompTugal.dinis, 16 Nov 2026: the look of /media/ (board/spec-the-media-pages.md).
// Groups the real media records (data/organisations/*/organisation.json, kind "media") by the place they cover,
// the Algarve first, and injects the proposed index into the built /media/ page on :8765. No AI.
//   python3 -m http.server 8765 &  node design/media/mock.mjs
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
const J = f => JSON.parse(readFileSync(f, 'utf8'))
const places = Object.fromEntries(J('data/by-place/places.json').places.map(p => [p.id, p]))
const media = readdirSync('data/organisations').map(id => `data/organisations/${id}/organisation.json`)
  .filter(existsSync).map(J).filter(o => o.kind === 'media')
const KIND = { 'regional-newspaper': 'paper', newspaper: 'paper', online: 'online', radio: 'radio', tv: 'TV', magazine: 'magazine', agency: 'agency', blog: 'blog' }
const groups = {}
for (const o of media) for (const p of (o.media?.places_covered || ['place:portugal'])) (groups[p.replace('place:', '')] ||= []).push(o)
const name = id => places[id]?.name || id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const order = ['algarve', ...Object.keys(groups).filter(k => !['algarve', 'portugal'].includes(k)).sort((a, b) => name(a).localeCompare(name(b))), 'portugal']
const card = o => `<li><a href="#">${o.name}</a><span class="mk">${KIND[o.media?.outlet_kind] || 'outlet'}</span>${o.media?.feeds?.length ? '<span class="mf">feed</span>' : ''}</li>`
const sec = id => groups[id] ? `<section class="mg${id === 'algarve' ? ' mg-a' : ''}"><h2>${id === 'portugal' ? 'National' : name(id)} <small>${groups[id].length}</small></h2><ul>${groups[id].sort((a, b) => a.name.localeCompare(b.name)).map(card).join('')}</ul>${id === 'algarve' ? '<p class="mgap">Barlavento and Postal do Algarve, the outlets the town pages cite most, have no page here yet. local@PrompTugal.jose is reading the Algarve\'s outlets.</p>' : ''}</section>` : ''
const counts = Object.entries(media.reduce((a, o) => (a[KIND[o.media?.outlet_kind] || 'outlet'] = (a[KIND[o.media?.outlet_kind] || 'outlet'] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1])
const html = `<div class="mx"><p class="mnum"><b>${media.length}</b> outlets · ${counts.map(([k, n]) => `${n} ${k}`).join(' · ')} · <b>${media.filter(o => o.media?.feeds?.length).length}</b> with a feed we read</p>
<nav class="mjump">${order.filter(id => groups[id]).map(id => `<a href="#">${id === 'portugal' ? 'National' : name(id)}</a>`).join('')}</nav>${order.map(sec).join('')}</div>`
const CSS = `.mx{max-width:1152px}
.mnum{font:13px var(--mono,monospace);color:var(--ink-3,#555);border-top:2px solid var(--ink,#111);border-bottom:1px solid var(--hair,#ddd);padding:10px 0;margin:18px 0 10px}.mnum b{color:var(--ink,#111);font-size:15px}
.mjump{display:flex;flex-wrap:wrap;gap:6px 14px;font:500 13px var(--sans,system-ui);margin:0 0 18px}.mjump a{color:inherit}
.mg{padding:16px 0 18px;border-top:1px solid var(--hair,#ddd)}
.mg h2{font:600 22px var(--serif,Georgia)!important;text-transform:none!important;letter-spacing:0!important;border:0!important;margin:0 0 10px!important;padding:0!important}.mg h2 small{font:500 12px var(--mono,monospace);color:var(--ink-3,#666);margin-left:6px}
.mg ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:0 24px}
.mg li{display:flex;align-items:baseline;gap:6px;padding:7px 0;border-bottom:1px solid var(--hair,#e5dfd2)}
.mg li a{font:500 16px var(--serif,Georgia);color:inherit;text-decoration:none;margin-right:auto}
.mk,.mf{font:500 10.5px var(--mono,monospace);padding:1px 5px;border-radius:3px;background:#ece6d8;color:#4a4232}.mf{background:#e3efe3;color:#0a3a14}
.mg-a{background:#f0ebde;margin:0 -16px;padding:16px 16px 18px;border-top:3px solid #006600}
.mgap{font:14px var(--sans,system-ui);color:#5a4a20;background:#f5efe2;border-left:3px dashed #8a7440;padding:8px 10px;margin:12px 0 0}
@media(max-width:600px){.mg-a{margin:0 -12px;padding:14px 12px}}`
const out = 'design/decisions/media'; mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:8765/media/', { waitUntil: 'load' }); await p.waitForTimeout(600)
  await p.evaluate(([c, h]) => { const s = document.createElement('style'); s.textContent = c; document.head.append(s)
    const ul = [...document.querySelectorAll('main ul')].sort((a, b) => b.children.length - a.children.length)[0]
    const host = ul.closest('.cols, .grid, div[class*=col]') && ul.closest('main') !== ul.parentElement ? ul.parentElement : ul
    host.insertAdjacentHTML('beforebegin', h); host.remove() }, [CSS, html])
  await p.screenshot({ path: `${out}/media-index-${tag}.png`, clip: { x: 0, y: 0, width: w, height: tag === 'phone' ? 2400 : 1700 } })
  await p.close()
}
await b.close(); console.log('done', media.length)
