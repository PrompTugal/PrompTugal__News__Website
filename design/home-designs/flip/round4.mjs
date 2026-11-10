// The redesign, round 4 (Dinis, 10 Nov 12:40: "pt.news is about agents, and the workflow is the picture"; board/guidance/2026-11-10-pt-news-is-about-agents.md).
// designer@PrompTugal.dinis. Recycles B round 3 (decided this morning). Three blocks lead, in this order:
//   1 our interviews (what the company does with agents; video: "Watch"), 2 the summit now (agent sessions, now and next),
//   3 the scores (GAMMA-Ray's Spectrum strip); then 4 the visual newsroom as a first-class block: how one piece was made,
//   each actor (person, tool, agent) a lane, each step in time order, each hand-off marked.
// Real material: the two interviews (desks/journalist-promptugal/interviews/), today's agent sessions (data/events, 10 Nov),
// the six Spectrum cards (gamma-ray.sgit.ai, read 10:45 UTC), the interview pipeline's eight steps (content/newsroom/interviews.md).
// The page's clock is set to 14:35 for the picture.
//   node design/home-designs/flip/round4.mjs [--out DIR] -> DIR/b4--{phone,desktop}--{light,dark}.png
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-flip4')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))

const NOW = '14:35'
const ivs = [['Buzz Messaging AI', 'Guy Ben Zvi', 'A European messaging and collaboration platform with AI agents, at the opening night', '3 min'], ['Student Property Network', 'Leo Tashev and Fraser Lloyd', 'The graduate job market, and the AI agent that sorts the jobs', 'under 3 min']]
const ses = [['10:50', '11:10', 'Your AI agent just got a passport', 'Stage 7'], ['11:25', '11:45', "Double agents: are your employees' AI agents working for or against your business?", 'Stage 4'], ['11:50', '12:10', 'The agentic internet: who controls the web?', 'Centre Stage'], ['12:30', '13:15', 'Trust issues: letting AI agents into production safely', 'Masterclass 3'], ['14:00', '14:45', "The knowledge your agents can't see: building visual context", 'Developer Lounge'], ['14:30', '14:50', 'Press conference with Gravitee: collapsing confidence in agent AI security', 'Stage 2'], ['16:30', '17:15', 'How to break your AI phone agent before your customers', 'Masterclass 4']]
const live = ses.filter(s => s[0] <= NOW && NOW < s[1]), next = ses.filter(s => s[0] > NOW).slice(0, 2), done = ses.filter(s => s[1] <= NOW).length
const dims = [['A', 'Autonomy'], ['R', 'Reach'], ['C', 'Control'], ['O', 'Openness']]
const cards = [['Claude Code, on your own machine', 'Anthropic', [4, 2, 4, 2], 'Scaling'], ['Claude Code on the web', 'Anthropic', [4, 2, 0, 2], 'Building'], ['GitHub Copilot cloud agent', 'GitHub', [4, 2, 2, 1], 'Building'], ['Replit Agent', 'Replit', [4, 2, 2, 2], 'Scaling'], ['RiskMandate Publisher', 'RiskMandate', [4, 2, 2, 1], 'Building'], ['The PrompTugal.news agent team', 'PrompTugal.news', [4, 2, 3, 1], 'Scaling']]
// the interview pipeline (content/newsroom/interviews.md, "The pipeline at a glance"): lane, step, time
const lanes = ['A person', 'Tools', 'Agents', 'Readers']
const steps = [[0, 'Record on a phone; photograph the badges', '3 min'], [0, 'Upload the files', 'by hand'], [1, 'Clean the audio', '1 min'], [1, 'Transcribe, with speakers', '10 s'], [2, 'Join picture and sound; strip metadata', '1 min'], [2, 'Cut the web version', '1 min'], [2, 'Into the public vault', 'minutes'], [2, 'Check names and facts', '10 to 20 min'], [2, 'Write the page; release', '15 to 30 min'], [3, 'Published, signed', '']]
const hand = si => si > 0 && steps[si - 1][0] !== steps[si][0]
const chip = (d, l) => l ? `<span class="ch l${l}"><b>${d[0]}${l}</b><i>${d[1]}</i></span>` : `<span class="ch l0"><b>${d[0]} –</b><i>not yet evidenced</i></span>`
const wave = (cls) => `<svg class="wave ${cls}" viewBox="0 0 400 22" preserveAspectRatio="none" aria-hidden="true"><path d="M0 11 Q 25 0 50 11 T 100 11 T 150 11 T 200 11 T 250 11 T 300 11 T 350 11 T 400 11 V 22 H 0 Z"/></svg>`
const play = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".18"/><path d="M9.5 7.5v9l7-4.5z" fill="currentColor"/></svg>`
const css = `@font-face{font-family:N;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:P;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:M;src:url(plex-mono-400.woff2)}
:root{--paper:#f6f3ec;--ink:#121317;--ink2:#3f424a;--hair:#d8d4cb;--red:#c52830;--green:#006600;--card:#fffdf8;--top:#121317;--on:#f6f3ec;--red2:#f07278;--green2:#6dbb7e}
.dark{--paper:#121317;--ink:#f6f3ec;--ink2:#b9bbc2;--hair:#2c2e35;--red:#f07278;--green:#6dbb7e;--card:#1a1c21;--top:#000}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:P,sans-serif}a{color:inherit;text-decoration:none}.in{max-width:1180px;margin:0 auto}
.k{font:600 11.5px P;letter-spacing:.1em;text-transform:uppercase}
.hd{background:var(--top);color:var(--on);padding:14px 20px}.hd .in{display:flex;gap:12px;align-items:center}.hd img{width:42px;background:#f6f3ec;padding:3px}.hd b{font:600 21px N;display:block}.hd span{font:12px M;opacity:.75}
.top{background:var(--top);color:var(--on);padding:10px 20px 30px}
h1{font:500 clamp(36px,6.4vw,66px)/1.02 N;letter-spacing:-.02em;margin:10px 0 0;max-width:900px}h1 em{font-style:italic;color:var(--red2)}.lede{font:19px/1.45 N;opacity:.85;margin-top:12px;max-width:640px}
.iv{display:grid;gap:14px;margin-top:22px}@media(min-width:760px){.iv{grid-template-columns:1fr 1fr}}
.v{display:grid;grid-template-columns:132px 1fr;gap:14px;align-items:start;border-top:1px solid #f6f3ec44;padding-top:14px}.v .th{aspect-ratio:4/3;background:linear-gradient(135deg,#2a2c33,#3a3d46);position:relative;display:grid;place-items:center;color:var(--on)}.v .th svg{width:40px;height:40px}
.v b{font:600 22px/1.15 N;display:block;margin:4px 0}.v p{font:15.5px/1.4 N;opacity:.85}.v .w{display:inline-block;margin-top:8px;font:600 13px P;color:var(--green2)}
.wave{display:block;width:100%;height:22px;fill:var(--top)}.wave.dn{transform:scaleY(-1);background:var(--paper)}.wave.up{background:var(--paper)}
main{padding:24px 20px 10px}.blk{margin-bottom:34px}.blk>h2{display:flex;align-items:baseline;gap:12px;font:italic 500 30px N;margin-bottom:12px}.blk>h2 small{font:12.5px M;color:var(--ink2);font-style:normal}
.three{display:grid;gap:34px}@media(min-width:1000px){.three{grid-template-columns:1fr 1.25fr;gap:44px}}
.now li{list-style:none;display:grid;grid-template-columns:62px 1fr;gap:4px 12px;padding:10px 0;border-bottom:1px solid var(--hair)}.now .t{font:14px M}.now b{font:600 17px/1.25 N}.now small{grid-column:2;font-size:13px;color:var(--ink2)}
.now li.on .t{color:var(--red);font-weight:600}.now li.on .t:before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:6px}.now .lab{font:600 11px P;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2);padding:12px 0 2px}.now a.all{display:block;padding:10px 0;font:600 14px P;color:var(--green)}
.lg{font:13.5px/1.45 P;color:var(--ink2);margin-bottom:6px}
.row{display:grid;grid-template-columns:1fr;gap:6px;padding:10px 0;border-bottom:1px solid var(--hair)}@media(min-width:560px){.row{grid-template-columns:170px 1fr}}.row b{font:600 17px N;display:block}.row small{font-size:12.5px;color:var(--ink2)}
.chips{display:flex;gap:5px;flex-wrap:wrap;align-items:center}.ch{display:inline-flex;flex-direction:column;align-items:center;min-width:60px;padding:3px 6px;border:1.5px solid var(--ink)}.ch b{font:600 14px M}.ch i{font:normal 10.5px P}
.ch.l2{background:color-mix(in srgb,var(--ink) 14%,var(--paper))}.ch.l3{background:color-mix(in srgb,var(--ink) 55%,var(--paper));color:var(--paper)}.ch.l4{background:var(--ink);color:var(--paper)}.ch.l0{border-style:dashed;color:var(--ink2)}.ch.l0 i{font-size:9.5px}
.stg{font:12.5px M;color:var(--green);margin-left:4px}
.nw{background:var(--card);border:1px solid var(--hair);padding:16px;overflow-x:auto}.nw .cap{font:16px/1.4 N;color:var(--ink2);margin-bottom:12px;max-width:760px}
.sw{display:grid;grid-template-columns:96px repeat(${steps.length},minmax(92px,1fr));min-width:${96 + steps.length * 92}px;position:relative}
.sw .ln{grid-column:1;font:600 11px P;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);border-top:1px solid var(--hair);padding:10px 6px 0 0;min-height:76px}
.sw .cell{border-top:1px solid var(--hair);min-height:76px;position:relative}.vt{display:none;list-style:none}.vt li{display:grid;grid-template-columns:78px 1fr;gap:10px;align-items:start;padding:0 0 0 0}.vt .who{font:600 10.5px P;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);padding-top:14px;text-align:right}.vt .st{margin:6px 0}.vt li.h{border-top:2px solid var(--red);margin-top:6px}.vt li.h .who{color:var(--red)}@media(max-width:699px){.sw{display:none}.vt{display:block}.nw{overflow:visible}}
.st{position:relative;margin:8px 4px;border:1.5px solid var(--ink);background:var(--paper);padding:5px 6px;font:12px/1.25 P}.st i{display:block;font:11px M;color:var(--ink2);font-style:normal;margin-top:3px}.st.p{border-color:var(--red)}.st.a{background:var(--ink);color:var(--paper)}.st.a i{color:inherit;opacity:.75}.st.r{border-color:var(--green);color:var(--green)}
.sw .st.h:after{content:"hand-off";position:absolute;left:-2px;top:-9px;background:var(--red);color:#fff;font:600 9.5px P;padding:1px 5px;text-transform:uppercase;letter-spacing:.04em}
.key{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px;font:12.5px P;color:var(--ink2)}.key span:before{content:"";display:inline-block;width:12px;height:12px;border:1.5px solid var(--ink);margin-right:5px;vertical-align:-2px}.key .p:before{border-color:var(--red)}.key .a:before{background:var(--ink)}
footer{background:var(--top);color:var(--on);padding:16px 20px 24px;font:13px M}footer .in{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;opacity:.8}
.tag{position:fixed;right:8px;top:8px;z-index:9;background:#c52830;color:#fff;font:600 10px P;padding:2px 6px;text-transform:uppercase}`
const html = dark => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><style>${css}</style><body class="${dark ? 'dark' : ''}">
<header class=hd><div class=in><img src=stamp.svg alt=""><div><b>PrompTugal.news</b><span>Tue 10 Nov · about AI agents, from Web Summit</span></div></div></header>
<section class=top><div class=in><p class=k style="color:var(--green2)">Day 1 of Web Summit · ${NOW} in Lisbon</p><h1>What companies are doing <em>with agents,</em> in their own words</h1><p class=lede>Interviews from the floor, the agent sessions on now, and how each product's agents are built, read from the evidence.</p>
<div class=iv>${ivs.map(v => `<a class=v href="#"><span class=th>${play}</span><span><span class=k style="color:var(--red2)">Interview</span><b>${v[0]}</b><p>${v[1]}: ${v[2]}</p><span class=w>▶ Watch · ${v[3]}</span></span></a>`).join('')}</div></div></section>
${wave('dn')}<main><div class=in>
<div class="three blk"><section class=now><h2 style="font:italic 500 30px N;margin-bottom:6px">The summit now</h2><p class=lg>Sessions about agents, today. ${done} done.</p><ol>
<li class=lab>On now</li>${live.map(s => `<li class=on><span class=t>${s[0]}</span><b>${s[2]}</b><small>until ${s[1]} · ${s[3]}</small></li>`).join('')}
<li class=lab>Next</li>${next.map(s => `<li><span class=t>${s[0]}</span><b>${s[2]}</b><small>until ${s[1]} · ${s[3]}</small></li>`).join('')}</ol><a class=all href="#">All ${ses.length} agent sessions today →</a></section>
<section><h2 style="font:italic 500 30px N;margin-bottom:6px">The scores</h2><p class=lg><b>Autonomy</b> and <b>Reach</b> measure an agent's power; <b>Control</b> and <b>Openness</b> its trust. Each from 1 to 4, darker is higher. Read from GAMMA-Ray's published cards; alphabetical, not ranked.</p>
${cards.slice(0, 4).map(c => { const s = c[2].reduce((a, b) => a + b, 0); return `<a class=row href="#"><div><b>${c[0]}</b><small>${c[1]}</small></div><div class=chips>${c[2].map((l, i) => chip(dims[i], l)).join('')}<span class=stg>${c[3]}, ${s} of 16</span></div></a>` }).join('')}
<a class=all href="#" style="display:block;padding:10px 0;font:600 14px P;color:var(--green)">All ${cards.length} Spectrum cards →</a></section></div>
<section class=blk><h2>The newsroom, at work <small>how this interview was made</small></h2><div class=nw><p class=cap>Every piece on this site shows who made it: the people, the tools and the agents, each step in order, and every hand-off between them. This is the interview with Buzz Messaging AI, step by step.</p>
<div class=sw>${lanes.map((ln, li) => `<div class=ln style="grid-row:${li + 1}">${ln}</div>` + steps.map((s, si) => `<div class=cell style="grid-row:${li + 1};grid-column:${si + 2}">${s[0] === li ? `<div class="st ${['p', 't', 'a', 'r'][li]}${hand(si) ? ' h' : ''}">${s[1]}${s[2] ? `<i>${s[2]}</i>` : ''}</div>` : ''}</div>`).join('')).join('')}</div>
<ol class=vt>${steps.map((s, si) => `<li class="${hand(si) ? 'h' : ''}"><span class=who>${hand(si) ? 'to ' : ''}${lanes[s[0]].replace('A person', 'a person').toLowerCase()}</span><div class="st ${['p', 't', 'a', 'r'][s[0]]}">${s[1]}${s[2] ? `<i>${s[2]}</i>` : ''}</div></li>`).join('')}</ol>
<div class=key><span class=p>a person</span><span>a tool</span><span class=a>an agent</span><span style="color:var(--red)">hand-off: the work changes hands</span></div></div></section>
</div></main>${wave('up')}<footer><div class=in><span>PrompTugal.news · Lisbon · CC BY 4.0</span><span>Powered by RiskMandate</span></div></footer><span class=tag>Design · round 4</span>`
const br = await chromium.launch()
for (const dark of [false, true]) { const f = path.join(OUT, `b4-${dark ? 'dark' : 'light'}.html`); fs.writeFileSync(f, html(dark))
  for (const [n, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready)
    const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > vp.width) console.log('sideways scroll', n, dark, sw)
    await p.screenshot({ path: path.join(OUT, `b4--${n}--${dark ? 'dark' : 'light'}.png`), fullPage: true }); await p.close() } }
await br.close(); console.log('->', OUT)
