// designer@PrompTugal.dinis, 19 Nov 2026: one way every *.promptugal.news site draws the past, today and the forecast,
// and "what we said / what happened" (Dinis, 19 Nov ~01:17 UTC: board/guidance/2026-11-19-show-the-past.md;
// the spec: board/spec-past-and-forecast.md). Writes the chart as an SVG template (design/past-and-forecast/chart.svg.txt
// is one rendered example) and pictures at 1280 and 390 px, light and dark. No AI.
// THE VALUES ARE ILLUSTRATIVE, NOT DATA: real readings carry their source's licence and are drawn by each site from its
// own /api/v1/history/ files (IPMA's history may not appear on promptugal.news, R12 and R13).
//   python3 -m http.server 8765 &  node design/past-and-forecast/mock.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

// Illustrative: 7 days observed (one missing), today, 5 days forecast; for the past days, the forecast shown 1 day before.
const DAYS = [
  { d: 'Thu 12', obs: [12, 19], said: [12, 20], rain: 0 }, { d: 'Fri 13', obs: [13, 20], said: [12, 19], rain: 0 },
  { d: 'Sat 14', obs: null, said: [13, 21], rain: null }, { d: 'Sun 15', obs: [14, 21], said: [14, 22], rain: 2 },
  { d: 'Mon 16', obs: [12, 20], said: [12, 20], rain: 0 }, { d: 'Tue 17', obs: [16, 19], said: [18, 21], rain: 14 },
  { d: 'Wed 18', obs: [17, 20], said: [19, 22], rain: 22 },
  { d: 'Today', today: true, obs: [15, 19], fc: [14, 20], rain: 3 },
  { d: 'Fri 20', fc: [12, 20], rain: 0 }, { d: 'Sat 21', fc: [11, 19], rain: 0 }, { d: 'Sun 22', fc: [12, 18], rain: 5 },
  { d: 'Mon 23', fc: [13, 19], rain: 10 },
]
const FIRST = 'Thu 12 Nov'
const past = DAYS.filter(x => x.obs && x.said && !x.today), errs = past.map(x => Math.max(Math.abs(x.obs[0] - x.said[0]), Math.abs(x.obs[1] - x.said[1])))
const HITS = `${errs.filter(e => e <= 1).length} of ${errs.length}`
function chart(w, dark) {
  const ink = dark ? '#f6f3ec' : '#121317', mute = dark ? '#b4b6ad' : '#666860', rule = dark ? '#44453f' : '#d8d4cb',
    said = dark ? '#6dbb7e' : '#006600', bg = dark ? '#121317' : '#f6f3ec'
  const L = 34, R = 10, T = 26, H = 170, n = DAYS.length, cw = (w - L - R) / n, lo = 8, hi = 24
  const y = v => T + H - (v - lo) / (hi - lo) * H
  const bw = Math.min(14, cw * 0.34)
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${T + H + 92}" width="${w}" role="img" aria-label="Low and high temperature, 7 days observed, today and 5 days forecast; for past days, what we forecast the day before beside what was measured. Illustrative values.">
<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${bg}"/><line x1="0" y1="0" x2="0" y2="6" stroke="${ink}" stroke-width="2"/></pattern></defs>
<rect width="100%" height="100%" fill="${bg}"/>`
  for (const v of [10, 15, 20]) s += `<line x1="${L}" x2="${w - R}" y1="${y(v)}" y2="${y(v)}" stroke="${rule}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-family="IBM Plex Mono" font-size="10.5" fill="${mute}">${v}°</text>`
  const ti = DAYS.findIndex(x => x.today), tx = L + cw * ti
  s += `<rect x="${tx}" y="${T - 14}" width="${cw}" height="${H + 14}" fill="${dark ? '#1c1d22' : '#ece7db'}"/><text x="${tx + cw / 2}" y="${T - 4}" text-anchor="middle" font-family="IBM Plex Sans" font-weight="600" font-size="11" fill="${ink}">Today</text>`
  s += `<text x="${L}" y="${T - 4}" font-family="IBM Plex Mono" font-size="10.5" fill="${mute}">Record begins ${FIRST}</text>`
  DAYS.forEach((x, i) => {
    const cx = L + cw * i + cw / 2
    if (x.obs) s += `<rect x="${cx - bw - 1}" y="${y(x.obs[1])}" width="${bw}" height="${y(x.obs[0]) - y(x.obs[1])}" rx="3" fill="${ink}"><title>${x.d}: measured ${x.obs[0]}° to ${x.obs[1]}°</title></rect>`
    else if (!x.fc) s += `<rect x="${cx - bw - 1}" y="${T + 40}" width="${bw}" height="${H - 80}" rx="3" fill="none" stroke="${mute}" stroke-dasharray="3 3"/>${w < 500 ? '' : `<text x="${cx - bw / 2 - 1}" y="${T + H / 2 + 4}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="${mute}" transform="rotate(-90 ${cx - bw / 2 - 1} ${T + H / 2})">no reading</text>`}`
    if (x.said) s += `<rect x="${cx + 1}" y="${y(x.said[1])}" width="${bw}" height="${y(x.said[0]) - y(x.said[1])}" rx="3" fill="none" stroke="${said}" stroke-width="2"><title>${x.d}: we said ${x.said[0]}° to ${x.said[1]}° the day before</title></rect>`
    if (x.fc) { const fx = x.today ? cx + 1 : cx - bw / 2
      s += `<rect x="${fx}" y="${y(x.fc[1])}" width="${bw}" height="${y(x.fc[0]) - y(x.fc[1])}" rx="3" fill="url(#hatch)" stroke="${ink}" stroke-width="1.5"><title>${x.d}: forecast ${x.fc[0]}° to ${x.fc[1]}°</title></rect>` }
    s += `<text x="${cx}" y="${T + H + 16}" text-anchor="middle" font-family="IBM Plex Sans" font-size="${w < 500 ? 9.5 : 11}" fill="${x.today ? ink : mute}" font-weight="${x.today ? 600 : 400}">${w < 500 ? x.d.replace(/^\w+ /, '') : x.d}</text>`
    if (x.obs && x.said) { const e = Math.max(Math.abs(x.obs[0] - x.said[0]), Math.abs(x.obs[1] - x.said[1]))
      s += `<text x="${cx}" y="${T + H + 32}" text-anchor="middle" font-family="IBM Plex Mono" font-size="${w < 500 ? 9 : 10.5}" fill="${ink}">${e === 0 ? '✓' : '±' + e + '°'}</text>` }
  })
  s += `<text x="${L}" y="${T + H + 50}" font-family="IBM Plex Sans" font-size="11" fill="${mute}">${w < 500 ? '± how far our day-before forecast was · ✓ exact' : 'Under each past day: how far our day-before forecast was from the measurement (✓ exact).'}</text>`
  // legend: texture and outline, never colour alone
  const ly = T + H + 70
  s += `<rect x="${L}" y="${ly - 9}" width="10" height="12" rx="2" fill="${ink}"/><text x="${L + 16}" y="${ly + 1}" font-family="IBM Plex Sans" font-size="11.5" fill="${ink}">Measured</text>
<rect x="${L + 92}" y="${ly - 9}" width="10" height="12" rx="2" fill="none" stroke="${said}" stroke-width="2"/><text x="${L + 108}" y="${ly + 1}" font-family="IBM Plex Sans" font-size="11.5" fill="${ink}">What we said the day before</text>
<rect x="${L + (w < 500 ? 0 : 290)}" y="${ly - 9 + (w < 500 ? 18 : 0)}" width="10" height="12" rx="2" fill="url(#hatch)" stroke="${ink}"/><text x="${L + (w < 500 ? 16 : 306)}" y="${ly + 1 + (w < 500 ? 18 : 0)}" font-family="IBM Plex Sans" font-size="11.5" fill="${ink}">Forecast</text>
<rect x="${L + (w < 500 ? 92 : 380)}" y="${ly - 9 + (w < 500 ? 18 : 0)}" width="10" height="12" rx="2" fill="none" stroke="${mute}" stroke-dasharray="3 3"/><text x="${L + (w < 500 ? 108 : 396)}" y="${ly + 1 + (w < 500 ? 18 : 0)}" font-family="IBM Plex Sans" font-size="11.5" fill="${ink}">No reading (a gap, not filled)</text>`
  return s + '</svg>'
}
const page = (w, dark) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Newsreader;src:url(/assets/fonts/newsreader-variable.woff2)}@font-face{font-family:'IBM Plex Sans';src:url(/assets/fonts/plex-sans-variable.woff2)}@font-face{font-family:'IBM Plex Mono';src:url(/assets/fonts/plex-mono-400.woff2)}
body{margin:0;background:${dark ? '#121317' : '#f6f3ec'};color:${dark ? '#f6f3ec' : '#121317'};font-family:'IBM Plex Sans'}
.w{max-width:760px;margin:0 auto;padding:22px 16px}.k{font:600 11px 'IBM Plex Mono';letter-spacing:.1em;text-transform:uppercase;color:${dark ? '#6dbb7e' : '#006600'};margin:0 0 4px}
h2{font:600 24px Newsreader;margin:0 0 4px}.s{font-size:13px;color:${dark ? '#b4b6ad' : '#666860'};margin:0 0 14px}
.tr{margin:16px 0 0;padding:12px 14px;border:1px solid ${dark ? '#44453f' : '#d8d4cb'};border-radius:4px;font-size:14px}.tr b{font:600 22px Newsreader}
.note{font:11px 'IBM Plex Mono';color:${dark ? '#b4b6ad' : '#666860'};margin-top:12px}</style></head><body><div class="w">
<p class="k">Quarteira · the last 7 days and the next 5</p><h2>Low and high, measured and forecast</h2>
<p class="s">Station: <u>[nearest station]</u> · forecast: <u>[source]</u> · read [time] · <u>table view</u></p>
${chart(Math.min(w - 32, 728), dark)}
<div class="tr"><b>${HITS}</b> past days within 1° of what we said the day before · our track record for this place, <u>every day since ${FIRST}</u></div>
<p class="note">Illustrative values for the design, not data.</p></div></body></html>`
mkdirSync('design/decisions/past-and-forecast', { recursive: true })
writeFileSync('design/past-and-forecast/chart.svg.txt', chart(728, false) + '\n')
const b = await chromium.launch()
for (const dark of [false, true]) for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: 600 } })
  await p.route('http://localhost:8765/__chart', r => r.fulfill({ body: page(w, dark), contentType: 'text/html; charset=utf-8' }))
  await p.goto('http://localhost:8765/__chart', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300)
  await p.screenshot({ path: `design/decisions/past-and-forecast/${tag}-${dark ? 'dark' : 'light'}.png`, fullPage: true })
  if (await p.evaluate(() => document.documentElement.scrollWidth) > w) console.log('overflow', tag)
  await p.close()
}
await b.close(); console.log('done')
