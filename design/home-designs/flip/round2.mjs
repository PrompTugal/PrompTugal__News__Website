// The design flip, round 2: direction B (Calcada) worked through. designer@PrompTugal.dinis, 10 November 2026.
// Round 1's "leaderboard" gave each company one score and a rank. GAMMA-Ray does not: a Spectrum card is four dimensions
// (Autonomy, Reach, Control, Openness), four levels each, and a stage, and "nothing on a card is a judgement"
// (gamma-ray.sgit.ai/spectrum/, read 10 Nov 08:40 UTC). So the top becomes a Spectrum strip: the product, its four
// levels as chips in ink (more ink, higher level; no red or green, which would read as bad or good), its stage, a link
// to its card. security@ (08:05): cards are linked, never copied.
//   node design/home-designs/flip/round2.mjs [--out DIR] -> DIR/b2--{phone,desktop}--{light,dark}.png
// Placeholders: the products and their levels are invented ("Product A").
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-flip2')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))

const dims = [['A', 'Autonomy'], ['R', 'Reach'], ['C', 'Control'], ['O', 'Openness']]
const prods = [['Product A', 'Company A', [4, 2, 2, 1], 'Building', 9], ['Product B', 'Company B', [3, 3, 3, 2], 'Operating', 11], ['Product C', 'Company C', [2, 3, 1, 1], 'Exploring', 7], ['Product D', 'Company D', [3, 2, 3, 3], 'Operating', 11], ['Product E', 'Company E', [1, 1, 2, 2], 'Exploring', 6]]
const ivs = [['Buzz Messaging AI', 'What a messaging company learnt putting AI agents in front of customers'], ['Student Property Network', 'Student housing, and where AI agents help']]
const wave = (h = 22) => `<svg class=wave viewBox="0 0 400 ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="M0 ${h / 2} Q 25 0 50 ${h / 2} T 100 ${h / 2} T 150 ${h / 2} T 200 ${h / 2} T 250 ${h / 2} T 300 ${h / 2} T 350 ${h / 2} T 400 ${h / 2} V ${h} H 0 Z"/></svg>`
const chip = (d, l) => `<span class="ch l${l}" title="${d[1]} ${l} of 4"><b>${d[0]}${l}</b><i>${d[1]}</i></span>`
const css = `@font-face{font-family:N;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:P;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:M;src:url(plex-mono-400.woff2)}
:root{--paper:#f6f3ec;--ink:#121317;--ink2:#3f424a;--hair:#d8d4cb;--red:#c52830;--green:#006600;--card:#fffdf8;--top:#121317;--topink:#f6f3ec;--red-on-top:#f07278;--green-on-top:#6dbb7e}
.dark{--paper:#121317;--ink:#f6f3ec;--ink2:#b9bbc2;--hair:#2c2e35;--red:#f07278;--green:#6dbb7e;--card:#1a1c21;--top:#000;--topink:#f6f3ec}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:P,sans-serif}a{color:inherit;text-decoration:none}
.k{font:600 11.5px P;letter-spacing:.1em;text-transform:uppercase}
.hd{display:flex;gap:12px;align-items:center;padding:16px 20px;background:var(--top);color:var(--topink)}.hd img{width:44px;background:#f6f3ec;padding:3px}.hd b{font:600 22px N;display:block}.hd span{font:12px M;opacity:.75}
.hero{background:var(--top);color:var(--topink);padding:10px 20px 30px}.in{max-width:1180px;margin:0 auto}.hero .in{display:grid;gap:26px}@media(min-width:960px){.hero .in{grid-template-columns:1fr 1.1fr;align-items:start}}
h1{font:500 clamp(38px,7vw,70px)/1.02 N;letter-spacing:-.02em;margin-top:12px}h1 em{font-style:italic;color:var(--red-on-top)}.lede{font:19px/1.45 N;opacity:.85;margin-top:14px;max-width:520px}
.sp{border-top:1px solid #f6f3ec55}.sp .h{display:flex;justify-content:space-between;align-items:baseline;padding:8px 0}.sp .h a{font:12.5px M;color:var(--green-on-top)}
.row{display:grid;grid-template-columns:1fr;gap:8px;padding:12px 0;border-bottom:1px solid #f6f3ec2e}@media(min-width:520px){.row{grid-template-columns:150px 1fr}}
.row b.n{font:600 18px N;display:block}.row small{font:12.5px P;opacity:.7}
.chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ch{display:inline-flex;flex-direction:column;align-items:center;min-width:62px;padding:4px 6px;border:1px solid #f6f3ec66}.ch b{font:600 15px M}.ch i{font:normal 10.5px P;opacity:.8;letter-spacing:.02em}
.ch.l1{background:transparent}.ch.l2{background:#f6f3ec26}.ch.l3{background:#f6f3ecb8;color:#121317}.ch.l4{background:#f6f3ec;color:#121317}
.st{font:12.5px M;color:var(--green-on-top);margin-left:4px}.st span{display:inline-block;width:64px;height:5px;background:#f6f3ec33;vertical-align:middle;margin-right:6px;position:relative}.st span i{position:absolute;inset:0 auto 0 0;background:var(--green-on-top)}
.sp .f{font:12px M;opacity:.65;margin-top:10px}
.wave{display:block;width:100%;height:22px;background:var(--paper);fill:var(--top);transform:scaleY(-1)}.wave.ft{transform:none;fill:var(--top);height:16px}
main{max-width:1180px;margin:0 auto;padding:26px 20px 34px}.sec{margin-top:30px}.sec:first-child{margin-top:0}.sec h3{font:italic 500 30px N;margin-bottom:14px}
.cards{display:grid;gap:22px}@media(min-width:760px){.cards{grid-template-columns:1fr 1fr}}.card{border-left:4px solid var(--red);padding:4px 0 4px 16px}.card b{font:600 25px/1.15 N;display:block;margin:6px 0}.card p{font:17px/1.45 N;color:var(--ink2)}
.ex{display:grid;gap:14px;border:1px solid var(--hair);background:var(--card);padding:18px}@media(min-width:900px){.ex{grid-template-columns:1.1fr 1fr 1fr}}
.ex h4{font:600 22px/1.2 N}.ex p{font:16px/1.45 N;color:var(--ink2);margin-top:6px}.ex dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:14.5px}.ex dt{font:600 14px M}.ex dd{color:var(--ink2)}
.lv{display:flex;gap:4px;margin-top:6px}.lv span{flex:1;text-align:center;font:12px M;padding:4px 0;border:1px solid var(--ink)}.lv span:nth-child(2){background:color-mix(in srgb,var(--ink) 15%,transparent)}.lv span:nth-child(3){background:color-mix(in srgb,var(--ink) 40%,transparent)}.lv span:nth-child(4){background:var(--ink);color:var(--paper)}
.ex a{font:13px M;color:var(--green)}
footer{background:var(--top);color:var(--topink);padding:18px 20px 26px;font:13px M}footer .in{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;opacity:.8}
.tag{position:fixed;right:8px;top:8px;z-index:9;background:#c52830;color:#fff;font:600 10px P;padding:2px 6px;text-transform:uppercase}`
const html = dark => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><style>${css}</style><body class="${dark ? 'dark' : ''}">
<header class=hd><img src=stamp.svg alt=""><div><b>PrompTugal.news</b><span>Tue 10 Nov · the agentic edition</span></div></header>
<section class=hero><div class=in><div><p class=k style="color:var(--green-on-top)">State of agentic · Tuesday 10 November</p><h1>The agents are <em>here.</em> What can they do?</h1><p class=lede>Each agentic product at the summit, read from its public evidence by GAMMA-Ray: how much it does on its own, and how well that is governed.</p></div>
<div class=sp><div class=h><span class=k style="opacity:.75">GAMMA-Ray Spectrum, today</span><a href="#">All cards ↗</a></div>
${prods.map(p => `<a class=row href="#"><div><b class=n>${p[0]}</b><small>${p[1]}</small></div><div class=chips>${p[2].map((l, i) => chip(dims[i], l)).join('')}<span class=st><span><i style="width:${p[4] / 16 * 100}%"></i></span>${p[3]}, ${p[4]} of 16</span></div></a>`).join('')}
<p class=f>Beta · each row links to its card on gamma-ray.sgit.ai · in alphabetical order, not ranked · placeholder products</p></div></div></section>
${wave()}<main>
<div class=sec><h3>Our interviews</h3><div class=cards>${ivs.map(v => `<a class=card><span class=k style="color:var(--red)">Interview</span><b>${v[0]}</b><p>${v[1]}</p></a>`).join('')}</div></div>
<div class=sec><h3>GAMMA-Ray in one minute</h3><div class=ex><div><h4>A card describes an agent's shape, not its worth</h4><p>Four dimensions, four levels each, read only from what is public. Every level is computed from the evidence by a published rule, and backed by the standards it touches (NIST, the EU AI Act, OWASP and others).</p></div>
<dl>${dims.map(d => `<dt>${d[0]} · ${d[1]}</dt><dd>${{ A: 'how much it does on its own', R: 'how far into systems and data it reaches', C: 'how its use is controlled', O: 'how openly it shows what it is and does' }[d[0]]}</dd>`).join('')}</dl>
<div><p class=k>Four levels</p><div class=lv><span>1</span><span>2</span><span>3</span><span>4</span></div><p>More ink, a higher level. A higher level is not better or worse: it is what the evidence shows.</p><p style="margin-top:10px"><a href="#">How a rating is made, on gamma-ray.sgit.ai ↗</a></p></div></div></div>
</main>${wave(16).replace('class=wave', 'class="wave ft"')}<footer><div class=in><span>PrompTugal.news · Lisbon · CC BY 4.0</span><span>Powered by RiskMandate</span></div></footer><span class=tag>Design · B round 2</span>`
const br = await chromium.launch()
for (const dark of [false, true]) { const f = path.join(OUT, `b2-${dark ? 'dark' : 'light'}.html`); fs.writeFileSync(f, html(dark))
  for (const [n, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready)
    const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > vp.width) console.log('sideways scroll', n, dark, sw)
    await p.screenshot({ path: path.join(OUT, `b2--${n}--${dark ? 'dark' : 'light'}.png`), fullPage: true }); await p.close() } }
await br.close(); console.log('->', OUT)
