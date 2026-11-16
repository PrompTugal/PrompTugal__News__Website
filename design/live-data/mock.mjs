// designer@PrompTugal.dinis, 16 Nov 2026: the live-data mock-ups (board/spec-the-live-data-up-front.md).
// Reads data/by-place/now/*.json, injects the proposed panels into the built pages served on :8765,
// and screenshots them into design/decisions/live-data/. No AI. Run from the repository root after a build:
//   python3 -m http.server 8765 &  node design/live-data/mock.mjs
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const J = f => JSON.parse(readFileSync(f, 'utf8'))
const now = id => J(`data/by-place/now/${id}.json`)
const places = Object.fromEntries(J('data/by-place/places.json').places.map(p => [p.id, p]))
// West to east along the coast, then the hills (geography, for reading order only).
const ORDER = ['aljezur','vila-do-bispo','lagos','monchique','portimao','lagoa','silves','albufeira','quarteira','loule','sao-bras-de-alportel','faro','olhao','tavira','castro-marim','vila-real-de-santo-antonio','alcoutim']
const DAY = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
const WHEN = s => { const d = new Date(s + 'Z'); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }) + ', ' + s.slice(11, 16) }
const HM = s => s.slice(11, 16)
const ago = s => Math.round((Date.parse('2026-11-16T19:40:00Z') - Date.parse(s)) / 36e5)
const IPMA_OBS = 'https://www.ipma.pt/en/otempo/obs.superficie/'
const IPMA_FC = 'https://www.ipma.pt/en/otempo/prev.localidade.hora/'
const IPMA_WARN = 'https://www.ipma.pt/en/otempo/prev-sam/'

const CSS = `
.ld{font-family:var(--sans,system-ui);color:var(--fe-on-band,#f4f1ea);border-left:1px solid rgba(255,255,255,.18);padding-left:28px}
.ld h3{font:700 11px/1 var(--mono,monospace);letter-spacing:.12em;text-transform:uppercase;margin:0 0 12px;display:flex;align-items:center;gap:8px;color:#bfe3c4}
.ld h3 i{width:8px;height:8px;border-radius:50%;background:#3ccf5a;box-shadow:0 0 0 4px rgba(60,207,90,.18)}
.ld h3 small{margin-left:auto;font-weight:500;letter-spacing:0;text-transform:none;color:#a9c4ad}
.ld-warn{display:flex;gap:10px;align-items:flex-start;background:rgba(0,0,0,.22);border-radius:4px;padding:10px 12px;margin:0 0 14px;font-size:14px;line-height:1.35}
.ld-lvl{font:700 10.5px/1 var(--mono,monospace);text-transform:uppercase;padding:4px 6px;border-radius:3px;background:#f2c94c;color:#1a1a1a;flex:none;margin-top:1px}
.ld-warn a{color:inherit}
.ld-towns{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.12)}
.ld-towns li{background:var(--fe-band,#0a3a14);padding:7px 8px 6px}
.ld-towns a{color:inherit;text-decoration:none;display:block}
.ld-towns span{display:block;font:500 11px/1.2 var(--sans,system-ui);color:#cfe0d1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ld-towns b{font:400 22px/1.15 var(--serif,Georgia);color:#fff}
.ld-towns b.na{font-size:15px;color:#8fae95}
.ld-next{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:14px 0 0;text-align:center}
.ld-next div{background:rgba(0,0,0,.18);border-radius:4px;padding:6px 2px;font:500 11px var(--mono,monospace);color:#cfe0d1}
.ld-next b{display:block;font:400 17px var(--serif,Georgia);color:#fff;margin:2px 0}
.ld-next em{font-style:normal;color:#cfe0d1}
.ld-next .wet em{color:#0a3a14;background:#f4f1ea;border-radius:2px;padding:0 3px;font-weight:700}
.ld-src{font:11px/1.4 var(--mono,monospace);color:#a9c4ad;margin:12px 0 0}
.ld-src a{color:inherit}
@media (max-width:820px){.ld{border-left:0;padding-left:0;border-top:1px solid rgba(255,255,255,.18);padding-top:18px}.ld-towns{grid-template-columns:repeat(3,minmax(0,1fr))}}
/* the town page: the five days under the band */
.ld5{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:rgba(255,255,255,.12);margin:4px 0 0;border-top:1px solid rgba(255,255,255,.12)}
.ld5 div{background:#121418;padding:10px 12px;font:500 11px var(--mono,monospace);color:#aab}
.ld5 b{display:block;font:400 20px var(--serif,Georgia);color:#fff;margin:3px 0}
.ld5 em{font-style:normal}.ld5 .wet{background:#22252b}.ld5 .wet em{color:#121418;background:#f4f1ea;padding:0 3px;border-radius:2px;font-weight:700}
.ldw{font:400 17px/1.35 var(--serif,Georgia);color:#fff}.ldw small{display:block;font:12px var(--sans,system-ui);color:#aab;margin-top:4px}
@media (max-width:600px){.ld5{grid-template-columns:repeat(5,minmax(0,1fr))}.ld5 div{padding:8px 4px;text-align:center}.ld5 b{font-size:16px}}
`
function homePanel() {
  const a = now('algarve'), t = Object.fromEntries(a.places.map(p => [p.place, p]))
  const w = a.warnings.active[0]
  const faro = now('faro')
  const towns = ORDER.map(id => { const p = t[id]; const n = places[id]?.name || id
    return `<li><a href="algarve/${id}/index.html"><span>${n}</span>${p && p.temp_c != null ? `<b>${Math.round(p.temp_c)}°</b>` : '<b class="na">no reading</b>'}</a></li>` }).join('')
  const days = faro.forecast.days.map((d, i) => `<div class="${d.rain_prob_pct >= 60 ? 'wet' : ''}">${i ? DAY(d.date) : 'Today'}<b>${Math.round(d.t_max_c)}°</b><em>${d.rain_prob_pct}%</em></div>`).join('')
  return `<aside class="ld" aria-label="Now in the Algarve"><h3><i></i>Now in the Algarve <small>${Math.round(J('data/by-place/now/algarve.json').places.length)} towns · IPMA</small></h3>
${w ? `<p class="ld-warn"><span class="ld-lvl">${w.level}</span><span><a href="${IPMA_WARN}">${w.type[0].toUpperCase() + w.type.slice(1)}</a> on the west coast, waves of 4 to 5 m, ${WHEN(w.start)} to ${WHEN(w.end)}</span></p>` : ''}
<ul class="ld-towns">${towns}</ul>
<div class="ld-next" aria-label="Faro, the next five days: highest temperature and chance of rain">${days}</div>
<p class="ld-src">Faro, the next five days. <a href="${IPMA_OBS}">IPMA's stations</a>, read ${HM(a.read_at)} UTC (${ago(a.read_at)} h ago) · <a href="algarve/index.html">every town →</a></p></aside>`
}
function townFive(id) {
  const f = now(id), w = f.warnings.active[0]
  const days = f.forecast.days.map((d, i) => `<div class="${d.rain_prob_pct >= 60 ? 'wet' : ''}">${i ? DAY(d.date) + ' ' + d.date.slice(8) : 'Today'}<b>${Math.round(d.t_min_c)}° / ${Math.round(d.t_max_c)}°</b><em>rain ${d.rain_prob_pct}%</em></div>`).join('')
  return { days: `<div class="ld5" aria-label="The next five days">${days}</div>`,
    warn: w ? `<div class="ldw"><span class="ld-lvl">${w.level}</span> ${w.type}, west coast<small>${WHEN(w.start)} to ${WHEN(w.end)} UTC · waves of 4 to 5 m · <a href="${IPMA_WARN}" style="color:inherit">IPMA</a></small></div>` : '' }
}
const out = 'design/decisions/live-data'; mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
  await p.goto('http://localhost:8765/', { waitUntil: 'load' }); await p.waitForTimeout(800)
  await p.evaluate(([css, html]) => { const s = document.createElement('style'); s.textContent = css; document.head.append(s)
    document.querySelector('.fe-band .fe-w').insertAdjacentHTML('beforeend', html); document.querySelector('.fe-now')?.remove() }, [CSS, homePanel()])
  await p.screenshot({ path: `${out}/home-${tag}.png`, clip: { x: 0, y: 0, width: w, height: tag === 'phone' ? 1500 : 820 } })
  await p.goto('http://localhost:8765/algarve/faro/', { waitUntil: 'load' }); await p.waitForTimeout(800)
  const t = townFive('faro')
  await p.evaluate(([css, t]) => { const s = document.createElement('style'); s.textContent = css; document.head.append(s)
    const band = document.querySelector('.bp-nowband'); band.insertAdjacentHTML('beforeend', t.days)
    const warn = [...band.querySelectorAll('li')].find(li => /warning|aviso/i.test(li.querySelector('strong')?.textContent || ''))
    if (warn && t.warn) { const s0 = warn.querySelector('strong'); warn.innerHTML = ''; warn.append(s0); warn.insertAdjacentHTML('beforeend', t.warn) }
  }, [CSS, t])
  const el = await p.$('.bp-nowband'); await el.screenshot({ path: `${out}/faro-${tag}.png` })
  await p.close()
}
await b.close(); console.log('mock-ups in', out)
