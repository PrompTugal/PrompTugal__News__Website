// The design flip, round 3 (from round2.mjs): sherpa@'s four conditions and GAMMA-Ray's real cards and words.
// Round 2 history follows. The design flip, round 2: direction B (Calcada) worked through. designer@PrompTugal.dinis, 10 November 2026.
// Round 1's "leaderboard" gave each company one score and a rank. GAMMA-Ray does not: a Spectrum card is four dimensions
// (Autonomy, Reach, Control, Openness), four levels each, and a stage, and "nothing on a card is a judgement"
// (gamma-ray.sgit.ai/spectrum/, read 10 Nov 08:40 UTC). So the top becomes a Spectrum strip: the product, its four
// levels as chips in ink (more ink, higher level; no red or green, which would read as bad or good), its stage, a link
// to its card. security@ (08:05): cards are linked, never copied.
//   node design/home-designs/flip/round2.mjs [--out DIR] -> DIR/b2--{phone,desktop}--{light,dark}.png
// Round 3: the six real cards (read 10 Nov 10:45 UTC) in place of round 2's placeholders; the interviews' one-liners are still mine.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-flip3')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))

const dims = [['A', 'Autonomy'], ['R', 'Reach'], ['C', 'Control'], ['O', 'Openness']]
// the six cards published on gamma-ray.sgit.ai, read 10 Nov 10:45 UTC (0 = "not yet evidenced", never zero); in the build, read from GAMMA-Ray's JSON, never typed
const prods = [['Claude Code, on your own machine', 'Anthropic', [4, 2, 4, 2], 'Scaling', 12, 'claude-code-local'], ['Claude Code on the web', 'Anthropic', [4, 2, 0, 2], 'Building', 8, 'claude-code-web'], ['GitHub Copilot cloud agent', 'GitHub', [4, 2, 2, 1], 'Building', 9, 'github-copilot-cloud-agent'], ['Replit Agent', 'Replit', [4, 2, 2, 2], 'Scaling', 10, 'replit-agent'], ['RiskMandate Publisher', 'RiskMandate', [4, 2, 2, 1], 'Building', 9, 'riskmandate-publisher'], ['The PrompTugal.news agent team', 'PrompTugal.news', [4, 2, 3, 1], 'Scaling', 10, 'promptugal-newsroom-team']]
const words = { A: ['Assists', 'Suggests', 'Acts', 'Orchestrates'], R: ['Contained', 'Integrated', 'Open protocol', 'Ecosystem'], C: ['Stated', 'Configurable', 'Observable', 'Enforced'], O: ['Disclosed', 'Documented', 'Measured', '(level 4)'] }
const SHOW = +(process.env.ROWS || 3)
const ivs = [['Buzz Messaging AI', 'What a messaging company learnt putting AI agents in front of customers'], ['Student Property Network', 'Student housing, and where AI agents help']]
const wave = (h = 22) => `<svg class=wave viewBox="0 0 400 ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="M0 ${h / 2} Q 25 0 50 ${h / 2} T 100 ${h / 2} T 150 ${h / 2} T 200 ${h / 2} T 250 ${h / 2} T 300 ${h / 2} T 350 ${h / 2} T 400 ${h / 2} V ${h} H 0 Z"/></svg>`
const chip = (d, l) => l ? `<span class="ch l${l}" title="${d[1]} ${l}: ${words[d[0]][l - 1]}"><b>${d[0]}${l}</b><i>${d[1]}</i></span>` : `<span class="ch l0" title="${d[1]}: not yet evidenced"><b>${d[0]} –</b><i>not yet evidenced</i></span>`
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
.ch.l0{border-style:dashed;opacity:.85}.ch.l0 i{font-size:9.5px}.ch.l1{background:transparent}.ch.l2{background:#f6f3ec26}.ch.l3{background:#f6f3ecb8;color:#121317}.ch.l4{background:#f6f3ec;color:#121317}
.st{font:12.5px M;color:var(--green-on-top);margin-left:4px}.st span{display:inline-block;width:64px;height:5px;background:#f6f3ec33;vertical-align:middle;margin-right:6px;position:relative}.st span i{position:absolute;inset:0 auto 0 0;background:var(--green-on-top)}
.legend{font:13.5px/1.45 P;opacity:.85;padding:0 0 8px}.legend b{font-weight:600}.more{display:block;padding:12px 0;font:600 14px P;color:var(--green-on-top)}.iv1{display:block;border-left:4px solid var(--red-on-top);padding:2px 0 2px 14px;margin-top:22px}.iv1 b{font:600 22px/1.2 N;display:block;margin:4px 0}.iv1 p{font:16px/1.4 N;opacity:.85}@media(min-width:960px){.iv1{display:none}}@media(max-width:959px){.card.first{display:none}}.sp .f{font:12px M;opacity:.65;margin-top:10px}
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
<section class=hero><div class=in><div><p class=k style="color:var(--green-on-top)">State of agentic · Tuesday 10 November</p><h1>The agents are <em>here.</em> What can they do?</h1><p class=lede>Each agentic product at the summit, read from its public evidence by GAMMA-Ray: how much it does on its own, and how well that is governed.</p>
<a class=iv1 href="#"><span class=k style="color:var(--red-on-top)">Interview</span><b>${ivs[0][0]}</b><p>${ivs[0][1]}</p></a></div>
<div class=sp><div class=h><span class=k style="opacity:.75">GAMMA-Ray Spectrum, today</span><a href="#">All ${prods.length} ↗</a></div>
<p class=legend><b>Autonomy</b> and <b>Reach</b> measure an agent's power; <b>Control</b> and <b>Openness</b> its trust. Each from 1 to 4, darker is higher; the stage adds the four up (16 at most).</p>
${prods.slice(0, SHOW).map(p => `<a class=row href="https://gamma-ray.sgit.ai/spectrum/cards/${p[5]}/"><div><b class=n>${p[0]}</b><small>${p[1]}</small></div><div class=chips>${p[2].map((l, i) => chip(dims[i], l)).join('')}<span class=st><span><i style="width:${p[4] / 16 * 100}%"></i></span>${p[3]}, ${p[4]} of 16</span></div></a>`).join('')}
<a class=more href="#">All ${prods.length} Spectrum cards →</a>
<p class=f>Beta · read from GAMMA-Ray's published cards, 10 November · alphabetical, not ranked · each row opens its card on gamma-ray.sgit.ai</p></div></div></section>
${wave()}<main>
<div class=sec><h3>Our interviews</h3><div class=cards>${ivs.map((v, i) => `<a class="card${i ? '' : ' first'}"><span class=k style="color:var(--red)">Interview</span><b>${v[0]}</b><p>${v[1]}</p></a>`).join('')}</div></div>
<div class=sec><h3>GAMMA-Ray in one minute</h3><div class=ex><div><h4>A card describes an agent's shape, not its worth</h4><p>Four dimensions, four levels each, read only from what is public. Every level is something a company can point at, computed from evidence by a published rule. A dimension with no evidence reads "not yet evidenced", never zero.</p></div>
<dl>${dims.map(d => `<dt>${d[0]} · ${d[1]}</dt><dd>${{ A: 'What does the agent do on its own?', R: 'How connected is it?', C: 'Can people stay in command?', O: 'Does it show its work?' }[d[0]] + ' <small style="opacity:.75">(' + words[d[0]].slice(0, 3).join(', ') + (d[0] === 'O' ? ', ...' : ', ' + words[d[0]][3]) + ')</small>'}</dd>`).join('')}</dl>
<div><p class=k>Four levels</p><div class=lv><span>1</span><span>2</span><span>3</span><span>4</span></div><p>More ink, a higher level. Nothing on a card is a judgement (GAMMA-Ray's words): it is what the evidence shows. The stage adds the four: Exploring 1 to 5, Building 6 to 9, Scaling 10 to 13, Pioneering 14 to 16.</p><p style="margin-top:10px"><a href="#">How a rating is made, on gamma-ray.sgit.ai ↗</a></p></div></div></div>
</main>${wave(16).replace('class=wave', 'class="wave ft"')}<footer><div class=in><span>PrompTugal.news · Lisbon · CC BY 4.0</span><span>Powered by RiskMandate</span></div></footer><span class=tag>Design · B round 3</span>`
const br = await chromium.launch()
for (const dark of [false, true]) { const f = path.join(OUT, `b3-${dark ? 'dark' : 'light'}.html`); fs.writeFileSync(f, html(dark))
  for (const [n, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready)
    const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > vp.width) console.log('sideways scroll', n, dark, sw)
    await p.screenshot({ path: path.join(OUT, `b3--${n}--${dark ? 'dark' : 'light'}.png`), fullPage: true }); await p.close() } }
await br.close(); console.log('->', OUT)
