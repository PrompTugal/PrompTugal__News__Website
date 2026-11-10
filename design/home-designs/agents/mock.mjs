// pt.news about agents: mock-ups of the home page and a piece page with its workflow map (phone and desktop).
// Recycles direction B round 3 (../flip/round3.mjs): its fonts, tokens and Spectrum chips. conductor-newsroom@web-summit.indi, 10 Nov 2026.
//   node design/home-designs/agents/mock.mjs [--out DIR] -> DIR/{home,piece}--{phone,desktop}.png
// Sample rows in "The summit now" are labelled as samples; the cards are GAMMA-Ray's six real ones (read 10 Nov 10:45 UTC, from round3.mjs).
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : here
fs.mkdirSync(OUT, { recursive: true })
const font = f => 'file://' + path.join(root, 'assets/fonts', f)
const stamp = 'file://' + path.join(root, 'assets/brand/pt-news-stamp-light.svg')
const cards = [['Claude Code, on your own machine', 'Anthropic', [4, 2, 4, 2], 'Scaling'], ['Replit Agent', 'Replit', [4, 2, 2, 2], 'Scaling'], ['GitHub Copilot cloud agent', 'GitHub', [4, 2, 2, 1], 'Building'], ['The PrompTugal.news agent team', 'PrompTugal.news', [4, 2, 3, 1], 'Scaling']]
const chips = l => ['A', 'R', 'C', 'O'].map((d, i) => `<span class="ch l${l[i]}">${d}${l[i] || ' –'}</span>`).join('')
const ROLES = [['Person', '#ffe1d0', '#e58c62'], ['Researcher', '#d6ecfa', '#5fa3d6'], ['Scorer', '#fff3c4', '#c9a72e'], ['Journalist', '#e3ddf7', '#8b7bd1'], ['Agent', '#cdefe3', '#4fae8c']]
const STEPS = [0, 1, 2, 0, 0, 0, 0, 3, 3, 3, 3, 3, 4, 0]
function map(w) {
  const LH = 30, X0 = 86, DX = (w - X0 - 14) / STEPS.length, H = ROLES.length * LH + 8, y = r => 4 + r * LH + LH / 2, x = i => X0 + i * DX + DX / 2
  return `<svg viewBox="0 0 ${w} ${H}" width="100%">${ROLES.map(([n, f, e], k) => `<rect y="${4 + k * LH}" width="${w}" height="${LH}" fill="${f}" opacity=".6"/><text x="6" y="${4 + k * LH + 19}" class="ml">${n}</text>`).join('')}${STEPS.slice(1).map((r, j) => { const p = STEPS[j], h = p !== r; return `<path d="M${x(j)} ${y(p)} L${x(j + 1)} ${y(r)}" stroke="${h ? '#121317' : '#999'}" stroke-width="${h ? 2.4 : 1.2}" fill="none"/>` }).join('')}${STEPS.map((r, i) => `<circle cx="${x(i)}" cy="${y(r)}" r="7" fill="#fff" stroke="${ROLES[r][2]}" stroke-width="2.5"/>`).join('')}</svg>`
}
const css = `@font-face{font-family:N;src:url(${font('newsreader-variable.woff2')});font-weight:200 800}@font-face{font-family:P;src:url(${font('plex-sans-variable.woff2')});font-weight:100 700}
*{box-sizing:border-box}body{margin:0;background:#f6f3ec;color:#121317;font:16px/1.45 P,sans-serif}
.top{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:3px solid #121317}.top img{height:30px}.top nav{margin-left:auto;display:flex;gap:14px;font-weight:600;font-size:14px}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px}h2{font:700 13px P;letter-spacing:.12em;text-transform:uppercase;border-bottom:2px solid #121317;padding:18px 0 6px;margin:0 0 12px}
h1,h3{font-family:N;margin:0}.lead h1{font-size:34px;line-height:1.1;margin:8px 0}.k{color:#c52830;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.08em}
.grid{display:grid;gap:18px}.d .grid.three{grid-template-columns:2fr 1fr}.ph{background:linear-gradient(135deg,#d9d2c1,#bdb4a0);aspect-ratio:16/9;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:42px;color:#fff}
.card{background:#fffdf8;border:1px solid #d9d2c1;padding:12px;border-radius:4px}.ch{display:inline-block;font:600 12px P;padding:2px 6px;margin-right:4px;border:1.5px solid #121317;border-radius:3px}.l4{background:#121317;color:#f6f3ec}.l3{background:#5a5b62;color:#fff}.l2{background:#c8c6c0}.l1{background:#fff}.l0{border-style:dashed;color:#777}
.now li{padding:8px 0;border-bottom:1px solid #d9d2c1;list-style:none}.now{padding:0;margin:0}.t{font:600 13px P;color:#006600;margin-right:8px}.sample{font-size:11px;color:#8a5200}
.mapbox{background:#fff;border:1px solid #d9d2c1;border-radius:4px;padding:8px}.ml{font:600 11px P;fill:#121317}.cap{font-size:13px;color:#555;margin:4px 0 0}
.spec{display:grid;gap:10px}.d .spec{grid-template-columns:repeat(4,1fr)}.foot{background:#121317;color:#f6f3ec;padding:18px 16px;margin-top:24px}`
const head = d => `<!doctype html><meta charset=utf-8><style>${css}</style><body class="${d ? 'd' : 'p'}"><div class="top"><img src="${stamp}" alt="PT.news"><b style="font-family:N;font-size:20px">PrompTugal.news</b>${d ? '<nav><span>Interviews</span><span>The summit now</span><span>Agents and risk</span><span>The newsroom</span></nav>' : ''}</div><div class="wrap">`
const home = d => head(d) + `
<h2>Interviews: what companies do with agents</h2>
<div class="grid three"><div class="lead"><div class="ph">▶</div><p class="k">Interview · Night Summit</p><h1>What a messaging company learnt putting AI agents in front of customers</h1><p>Buzz Messaging AI. <span class="ch l0">not yet scanned</span></p><div class="mapbox">${map(d ? 640 : 340)}<p class="cap">How this was made: 14 steps, 6 hand-overs, 1 person, 4 agents.</p></div></div>
<div class="grid"><div class="card"><p class="k">Interview</p><h3>Student housing, and where AI agents help</h3><p>Student Property Network</p>${map(300)}</div><div class="card"><p class="k">Next interview</p><h3>Filmed today, being cleaned</h3><p class="cap">Step 8 of 14: the journalist agent is cleaning the sound.</p></div></div></div>
<h2>The summit now: agents</h2><ul class="now"><li><span class="t">14:00</span>A talk on agents in security <span class="sample">sample row</span></li><li><span class="t">14:30</span>A panel on who controls an AI agent <span class="sample">sample row</span></li><li><span class="t">15:10</span>What people are posting about agents at the summit <span class="sample">sample row</span></li></ul>
<h2>Agents and their risks: the GAMMA-Ray cards</h2><div class="spec">${cards.map(([n, c, l, s]) => `<div class="card"><h3 style="font-size:17px">${n}</h3><p class="cap">${c} · ${s}</p>${chips(l)}</div>`).join('')}</div>
<p class="cap">A = how much it does on its own, R = what it can reach, C = how it is controlled, O = how open it is. From public evidence, in beta. Cards link to gamma-ray.sgit.ai.</p>
</div><div class="foot"><b>The live newsroom.</b> 3 pieces in progress. Every step, every person, every agent, in the open.</div>`
const piece = d => head(d) + `<p class="k" style="margin-top:16px">Interview · Night Summit, 9 November</p><h1 style="font-size:${d ? 40 : 30}px">What a messaging company learnt putting AI agents in front of customers</h1>
<div class="card" style="margin:12px 0"><b>The company's GAMMA-Ray card:</b> <span class="ch l0">not yet scanned</span> <span class="cap">Being made by the scorer agent.</span></div><div class="ph">▶</div>
<h2>What they said about their agents</h2><p>[The journalist's text, from the checked transcript.]</p><h2>How this was made</h2><div class="mapbox">${map(d ? 1100 : 340)}</div>
<ol class="cap"><li>Indi met them and asked for a yes (person)</li><li>Public facts looked up (researcher)</li><li>…</li><li>Sound cleaned with Audo, checked, written, published (journalist)</li></ol></div>`
const b = await chromium.launch()
for (const [name, fn] of [['home', home], ['piece', piece]]) for (const [dev, w, d] of [['phone', 390, false], ['desktop', 1280, true]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
  const f = path.join(OUT, `.${name}-${dev}.html`); fs.writeFileSync(f, fn(d)); await p.goto('file://' + f, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); fs.unlinkSync(f); await p.screenshot({ path: path.join(OUT, `${name}--${dev}.png`), fullPage: true }); await p.close()
}
await b.close(); console.log('mock-ups in', OUT)
