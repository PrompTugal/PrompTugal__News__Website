// The Spectrum block on a company page (the agentic edition, direction B). designer@PrompTugal.dinis, 10 November 2026.
// A company page is paper, so the chips invert: ink fills grow with the level. One row per product the company has a
// GAMMA-Ray card for (data/companies' optional gamma_ray link, ontologist@'s schema); the levels are read from GAMMA-Ray's
// data at build; the row links to the card. Example: RiskMandate Publisher, read from gamma-ray.sgit.ai 10 Nov 10:45 UTC.
//   node design/home-designs/flip/company.mjs [--out DIR] -> DIR/company-spectrum--{phone,desktop}--{light,dark}.png
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-company')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
const dims = [['A', 'Autonomy', 'power', ['Assists', 'Suggests', 'Acts', 'Orchestrates']], ['R', 'Reach', 'power', ['Contained', 'Integrated', 'Open protocol', 'Ecosystem']], ['C', 'Control', 'trust', ['Stated', 'Configurable', 'Observable', 'Enforced']], ['O', 'Openness', 'trust', ['Disclosed', 'Documented', 'Measured', 'level 4']]]
const card = { product: 'RiskMandate Publisher', kind: 'a deployment', levels: [4, 2, 2, 1], stage: 'Building', read: '10 November 2026', slug: 'riskmandate-publisher' }
const sum = card.levels.reduce((a, b) => a + b, 0)
const css = `@font-face{font-family:N;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:P;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:M;src:url(plex-mono-400.woff2)}
:root{--paper:#f6f3ec;--ink:#121317;--ink2:#3f424a;--hair:#d8d4cb;--card:#fffdf8;--green:#006600}.dark{--paper:#121317;--ink:#f6f3ec;--ink2:#b9bbc2;--hair:#2c2e35;--card:#1a1c21;--green:#6dbb7e}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:P,sans-serif}main{max-width:760px;margin:0 auto;padding:22px 16px 40px}
.crumb{font:12.5px M;color:var(--ink2)}h1{font:600 38px/1.1 N;margin:6px 0}.lede{font:18px/1.45 N;color:var(--ink2)}
.sx{margin-top:24px;border-top:4px solid var(--ink);padding-top:12px}.sx .k{font:600 11.5px P;letter-spacing:.1em;text-transform:uppercase}.sx h2{font:600 22px/1.2 N;margin:4px 0 2px}.sx .meta{font:12.5px M;color:var(--ink2)}
.lg{font:14px/1.45 P;color:var(--ink2);margin:10px 0}
.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}@media(min-width:620px){.g{grid-template-columns:repeat(4,1fr)}}
.c{border:1.5px solid var(--ink);padding:10px;min-height:96px;display:flex;flex-direction:column;gap:2px}.c b{font:600 22px M}.c span{font:600 13px P}.c i{font:italic 15px N;margin-top:auto}.c small{font:11px P;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.c.l1{background:var(--card)}.c.l2{background:color-mix(in srgb,var(--ink) 14%,var(--paper))}.c.l3{background:color-mix(in srgb,var(--ink) 55%,var(--paper));color:var(--paper)}.c.l4{background:var(--ink);color:var(--paper)}.c.l0{border-style:dashed;color:var(--ink2)}
.st{display:flex;align-items:center;gap:10px;margin-top:12px;font:14px M}.st .bar{flex:0 0 160px;height:8px;background:var(--hair);position:relative}.st .bar i{position:absolute;inset:0 auto 0 0;background:var(--green)}
.sx a.go{display:inline-block;margin-top:12px;font:600 14px P;color:var(--green)}.sx .f{font:12px M;color:var(--ink2);margin-top:8px}
.tag{position:fixed;right:8px;top:8px;background:#c52830;color:#fff;font:600 10px P;padding:2px 6px;text-transform:uppercase}`
const chip = (d, l) => l ? `<div class="c l${l}"><small>${d[2]}</small><b>${d[0]}${l}</b><span>${d[1]}</span><i>${d[3][l - 1]}</i></div>` : `<div class="c l0"><small>${d[2]}</small><b>${d[0]} –</b><span>${d[1]}</span><i>not yet evidenced</i></div>`
const html = dark => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><style>${css}</style><body class="${dark ? 'dark' : ''}"><main>
<p class=crumb>Companies / RiskMandate</p><h1>RiskMandate</h1><p class=lede>The company's page as today: what it does, at the summit, its sources.</p>
<section class=sx aria-labelledby=sx-h><p class=k>GAMMA-Ray Spectrum · beta</p><h2 id=sx-h>${card.product}</h2><p class=meta>${card.kind} · read ${card.read}</p>
<p class=lg>How much it does on its own (power) and how well that is governed (trust), each from 1 to 4, read only from public evidence. Nothing on a card is a judgement.</p>
<div class=g>${card.levels.map((l, i) => chip(dims[i], l)).join('')}</div>
<div class=st><span class=bar><i style="width:${sum / 16 * 100}%"></i></span><span>${card.stage}, ${sum} of 16</span></div>
<a class=go href="https://gamma-ray.sgit.ai/spectrum/cards/${card.slug}/">The full card and its evidence, on gamma-ray.sgit.ai ↗</a>
<p class=f>Read from GAMMA-Ray's published card; corrections go to GAMMA-Ray, not here.</p></section></main><span class=tag>Design · company page</span>`
const br = await chromium.launch()
for (const dark of [false, true]) { const f = path.join(OUT, `company-${dark ? 'dark' : 'light'}.html`); fs.writeFileSync(f, html(dark))
  for (const [n, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 800 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: path.join(OUT, `company-spectrum--${n}--${dark ? 'dark' : 'light'}.png`), fullPage: true }); await p.close() } }
await br.close(); console.log('->', OUT)
