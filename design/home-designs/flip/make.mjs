// The design flip, round 1 (THE RESTART, Dinis 10 Nov 02:40: "a heavy design flip: modern, very Portuguese, at the quality of the investor decks").
// designer@PrompTugal.dinis. Three directions for the agentic edition's home page, all inside brand v2.0's palette and fonts (no brand change):
//   A Azulejo: a tile grid, geometric tile patterns drawn in CSS as section marks and card corners
//   B Calcada: black-and-white pavement waves as the dividers, big serif headlines, Lisbon light
//   C Jornal: a dense modern broadsheet grid, ruled columns, the leaderboard as a sports table
//   node design/home-designs/flip/make.mjs [--out DIR]  -> DIR/flip-{a,b,c}--{phone,desktop}.png
// Placeholders: the GAMMA-Ray companies and scores are invented ("Company A"); no GAMMA-Ray data is in the repository yet.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-flip')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))

const fonts = `@font-face{font-family:N;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:P;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:M;src:url(plex-mono-400.woff2)}`
const base = `*{box-sizing:border-box;margin:0;padding:0}body{background:#f6f3ec;color:#121317;font-family:P,sans-serif}a{color:inherit;text-decoration:none}
.tag{position:fixed;right:8px;top:8px;z-index:9;background:#c52830;color:#fff;font:600 10px P;padding:2px 6px;text-transform:uppercase}
.k{font:600 11.5px P;letter-spacing:.1em;text-transform:uppercase}.mono{font-family:M}`
const cos = [['Company A', 82, 'Agents in production, policies published'], ['Company B', 74, 'Agent platform, evidence in case studies'], ['Company C', 69, 'Customer-service agents at scale'], ['Company D', 61, 'Security for agents'], ['Company E', 55, 'Agents for developers']]
const ivs = [['Buzz Messaging AI', 'Interview', 'What a messaging company learnt putting AI agents in front of customers'], ['Student Property Network', 'Interview', 'Student housing, and where AI agents help']]
const bar = (s, c = '#006600') => `<span style="display:inline-block;height:8px;width:${s}%;background:${c};vertical-align:middle"></span>`
const head = (cls = '') => `<header class="hd ${cls}"><img src=stamp.svg alt=""><div><b>PrompTugal.news</b><span class=mono>Tue 10 Nov · the agentic edition</span></div></header>`

// A: Azulejo. A tile pattern drawn with gradients: a quatrefoil-ish motif in ink on paper, red and green accents.
const tile = (c1, c2) => `background-color:#f6f3ec;background-image:radial-gradient(circle at 0 0,${c1} 22%,transparent 23%),radial-gradient(circle at 100% 0,${c1} 22%,transparent 23%),radial-gradient(circle at 0 100%,${c1} 22%,transparent 23%),radial-gradient(circle at 100% 100%,${c1} 22%,transparent 23%),radial-gradient(circle at 50% 50%,transparent 18%,${c2} 19%,${c2} 23%,transparent 24%);background-size:40px 40px`
const A = `<style>${fonts}${base}
.hd{display:flex;gap:12px;align-items:center;padding:14px 20px;border-bottom:2px solid #121317}.hd img{width:44px}.hd b{font:600 22px N;display:block}.hd span{font-size:12px;color:#3f424a}
.band{height:56px;${tile('#121317', '#c52830')}}
main{max-width:1180px;margin:0 auto;padding:22px 20px 40px}
.top{display:grid;gap:22px}@media(min-width:900px){.top{grid-template-columns:1.25fr 1fr}}
h1{font:600 clamp(34px,6vw,58px)/1.02 N;letter-spacing:-.01em}h1 em{color:#c52830;font-style:normal}
.lede{font:400 19px/1.45 N;color:#3f424a;margin:12px 0 0;max-width:560px}
.lb{border:2px solid #121317;background:#fffdf8;position:relative}.lb:before{content:"";position:absolute;inset:-2px auto auto -2px;width:28px;height:28px;${tile('#006600', '#006600')};background-size:28px 28px}
.lb h2{font:600 20px N;padding:12px 14px 8px 40px}.lb ol{list-style:none}.lb li{display:grid;grid-template-columns:28px 1fr 46px;gap:10px;align-items:center;padding:9px 14px;border-top:1px solid #d8d4cb}
.lb li i{font:700 22px N;color:#c52830;font-style:normal}.lb li b{font:600 16px N;display:block}.lb li small{font-size:12.5px;color:#3f424a}.lb li span.s{font:700 22px N;color:#006600;text-align:right}
.lb .f{padding:10px 14px;font:12.5px M;color:#595c64;border-top:1px solid #d8d4cb}
.sec{margin-top:34px}.sec h3{display:flex;align-items:center;gap:10px;font:600 13px P;letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px}.sec h3:before{content:"";width:22px;height:22px;${tile('#121317', '#c52830')};background-size:22px 22px}
.cards{display:grid;gap:14px}@media(min-width:760px){.cards{grid-template-columns:1fr 1fr}}
.card{border:1px solid #d8d4cb;background:#fffdf8;display:grid;grid-template-columns:96px 1fr}.card .t{${tile('#121317', '#006600')};background-size:32px 32px}.card div.x{padding:14px}.card b{font:600 21px/1.2 N;display:block;margin:4px 0}.card p{font-size:14.5px;color:#3f424a}
.graph{height:220px;border:1px solid #d8d4cb;background:#fffdf8;position:relative;overflow:hidden}
</style>${head()}<div class=band></div><main>
<div class=top><div><p class=k style="color:#c52830">State of agentic · Tuesday</p><h1>Who is really running <em>AI agents</em> at Web Summit</h1><p class=lede>Every company here, scored on the evidence by GAMMA-Ray: what its agents do, under what policy, and who checked.</p></div>
<div class=lb><h2>GAMMA-Ray leaderboard</h2><ol>${cos.map((c, i) => `<li><i>${i + 1}</i><div><b>${c[0]}</b><small>${c[2]}</small></div><span class=s>${c[1]}</span></li>`).join('')}</ol><div class=f>Beta · each score links to its evidence · placeholder companies</div></div></div>
<div class=sec><h3>Our interviews</h3><div class=cards>${ivs.map(v => `<a class=card><div class=t></div><div class=x><span class=k style="color:#006600">${v[1]}</span><b>${v[0]}</b><p>${v[2]}</p></div></a>`).join('')}</div></div>
<div class=sec><h3>The graph, not the list</h3><div class=graph>${GRAPH('#121317')}</div></div></main><span class=tag>Design · A Azulejo</span>`

// B: Calcada. Pavement waves (alternating black and white curves) as dividers, a dark masthead, big type.
const wave = (fg, bg, h = 22) => `<svg viewBox="0 0 400 ${h}" preserveAspectRatio="none" style="display:block;width:100%;height:${h}px;background:${bg}"><path d="M0 ${h / 2} Q 25 0 50 ${h / 2} T 100 ${h / 2} T 150 ${h / 2} T 200 ${h / 2} T 250 ${h / 2} T 300 ${h / 2} T 350 ${h / 2} T 400 ${h / 2} V ${h} H 0 Z" fill="${fg}"/></svg>`
function GRAPH(ink) { const n = [[50, 50, 'Agents', 1], [22, 30, 'Security', 0], [78, 28, 'Fintech', 0], [30, 76, 'Health', 0], [72, 74, 'Developers', 0], [12, 58, '', 2], [40, 16, '', 2], [62, 12, '', 2], [90, 52, '', 2], [86, 88, '', 2], [52, 90, '', 2], [14, 90, '', 2]]
  const ed = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 7], [2, 8], [4, 9], [3, 10], [3, 11], [4, 10]]
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${ed.map(([a, b]) => `<line x1=${n[a][0]} y1=${n[a][1]} x2=${n[b][0]} y2=${n[b][1]} stroke="${ink}" stroke-opacity=".35" stroke-width=".3" vector-effect="non-scaling-stroke"/>`).join('')}</svg>` +
  n.map(([x, y, l, k]) => `<span style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);${k === 2 ? `width:10px;height:10px;border-radius:50%;background:${ink};opacity:.55` : `font:600 ${k ? 15 : 13}px P;padding:5px 10px;border-radius:999px;background:${k ? '#c52830' : '#006600'};color:#f6f3ec;white-space:nowrap`}">${l}</span>`).join('') }
const B = `<style>${fonts}${base}
.hd{display:flex;gap:12px;align-items:center;padding:16px 20px;background:#121317;color:#f6f3ec}.hd img{width:44px;background:#f6f3ec;padding:3px}.hd b{font:600 22px N;display:block}.hd span{font-size:12px;opacity:.75}
.hero{background:#121317;color:#f6f3ec;padding:8px 20px 34px}.hero>div{max-width:1180px;margin:0 auto;display:grid;gap:26px}@media(min-width:900px){.hero>div{grid-template-columns:1.2fr 1fr;align-items:end}}
h1{font:500 clamp(38px,7vw,72px)/1.02 N;letter-spacing:-.02em;margin-top:12px}h1 em{font-style:italic;color:#f07278}.lede{font:400 19px/1.45 N;opacity:.85;margin-top:14px;max-width:540px}
.lb{border-top:1px solid #f6f3ec55}.lb li{list-style:none;display:grid;grid-template-columns:24px 1fr auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #f6f3ec33}.lb i{font:italic 600 20px N;color:#f07278}.lb b{font:600 17px N}.lb .s{font:600 15px M;color:#6dbb7e}.lb .bar{grid-column:2/4;margin-top:-4px}
.lb .f{font:12px M;opacity:.6;margin-top:8px}
main{max-width:1180px;margin:0 auto;padding:30px 20px 40px}
.sec h3{font:italic 500 30px N;margin-bottom:14px}.cards{display:grid;gap:22px}@media(min-width:760px){.cards{grid-template-columns:1fr 1fr}}
.card{border-left:4px solid #c52830;padding:4px 0 4px 16px}.card b{font:600 26px/1.15 N;display:block;margin:6px 0}.card p{font:17px/1.45 N;color:#3f424a}
.graph{height:240px;position:relative;margin-top:8px}
</style>${head()}<section class=hero><div><div><p class=k style="color:#6dbb7e">State of agentic · Tuesday 10 November</p><h1>The agents are <em>here.</em> Which ones work?</h1><p class=lede>GAMMA-Ray scores every company at the summit on the evidence of its agents. Beta, and every score shows its sources.</p></div>
<div class=lb><p class=k style="opacity:.7;margin-bottom:6px">GAMMA-Ray leaderboard</p><ol>${cos.map((c, i) => `<li><i>${i + 1}</i><b>${c[0]}</b><span class=s>${c[1]}</span><span class=bar>${bar(c[1], '#6dbb7e')}</span></li>`).join('')}</ol><p class=f>Placeholder companies and scores</p></div></div></section>
${wave('#f6f3ec', '#121317')}<main><div class=sec><h3>Our interviews</h3><div class=cards>${ivs.map(v => `<a class=card><span class=k style="color:#c52830">${v[1]}</span><b>${v[0]}</b><p>${v[2]}</p></a>`).join('')}</div></div>
<div style="margin:34px -20px 26px">${wave('#121317', '#f6f3ec', 14)}</div><div class=sec><h3>The graph, not the list</h3><div class=graph>${GRAPH('#121317')}</div></div></main><span class=tag>Design · B Calcada</span>`

// C: Jornal. A modern broadsheet: a thick ruled masthead, three ruled columns, the leaderboard as a results table.
const C = `<style>${fonts}${base}
.mast{max-width:1180px;margin:0 auto;padding:18px 20px 0;text-align:center}.mast .r{border-top:3px solid #121317;border-bottom:1px solid #121317;height:6px}
.mast b{font:700 clamp(40px,8vw,84px)/1 N;letter-spacing:-.02em;display:block;padding:10px 0 6px}.mast b span{color:#c52830}.mast .l{display:flex;justify-content:space-between;font:12px M;color:#3f424a;padding:6px 0;border-bottom:3px solid #121317}
main{max-width:1180px;margin:0 auto;padding:18px 20px 40px;display:grid;gap:22px}@media(min-width:900px){main{grid-template-columns:1.5fr 1fr;column-rule:1px solid #d8d4cb}.wide{grid-column:1/-1}}
h1{font:700 clamp(30px,5vw,48px)/1.04 N}.lede{font:18px/1.45 N;color:#3f424a;margin-top:10px}.k.r{color:#c52830}
table{width:100%;border-collapse:collapse;font-size:15px}th{font:600 11px P;letter-spacing:.08em;text-transform:uppercase;text-align:left;border-bottom:2px solid #121317;padding:6px 4px}td{padding:8px 4px;border-bottom:1px solid #d8d4cb}td.n{font:700 18px N;color:#c52830;width:28px}td.s{font:700 18px N;color:#006600;text-align:right}td b{font:600 16px N}
.cap{font:12px M;color:#595c64;margin-top:6px}
.ivs{display:grid;gap:0}@media(min-width:760px){.ivs{grid-template-columns:1fr 1fr;column-gap:22px}}.iv{border-top:1px solid #121317;padding:10px 0 14px}.iv b{font:600 23px/1.15 N;display:block;margin:4px 0}.iv p{font:16px/1.45 N;color:#3f424a}
.graph{height:220px;position:relative;border-top:3px solid #121317}
</style><div class=mast><div class=r></div><b>PrompTugal<span>.</span>news</b><div class=l><span>Tuesday 10 November 2026</span><span>The agentic edition</span><span>Lisbon</span></div></div>
<main><div><p class="k r">State of agentic</p><h1>Who is really running AI agents at Web Summit</h1><p class=lede>Every company at the summit, scored on the evidence by GAMMA-Ray: what its agents do, under what policy, and who checked. Beta.</p>
<div class=ivs style="margin-top:18px">${ivs.map(v => `<a class=iv><span class="k" style="color:#006600">${v[1]}</span><b>${v[0]}</b><p>${v[2]}</p></a>`).join('')}</div></div>
<div><table><tr><th></th><th>GAMMA-Ray, today</th><th style="text-align:right">Score</th></tr>${cos.map((c, i) => `<tr><td class=n>${i + 1}</td><td><b>${c[0]}</b><br><small style="color:#3f424a">${c[2]}</small></td><td class=s>${c[1]}</td></tr>`).join('')}</table><p class=cap>Placeholder companies and scores · each links to its evidence</p></div>
<div class="wide"><p class="k" style="margin:8px 0">The graph, not the list</p><div class=graph>${GRAPH('#121317')}</div></div></main><span class=tag>Design · C Jornal</span>`

const pages = { a: A, b: B, c: C }
for (const [k, v] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, `flip-${k}.html`), `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width">${v}`)
const br = await chromium.launch()
for (const k of Object.keys(pages)) for (const [n, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
  const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(path.join(OUT, `flip-${k}.html`)).href); await p.evaluate(() => document.fonts.ready)
  const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > vp.width) console.log('sideways scroll', k, n, sw)
  await p.screenshot({ path: path.join(OUT, `flip-${k}--${n}.png`), fullPage: true }); await p.close() }
await br.close(); console.log('->', OUT)
