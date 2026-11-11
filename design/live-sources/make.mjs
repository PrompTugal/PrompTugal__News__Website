// The live sources strip at the top of the home page (Dinis, 11 Nov 10:00: "a clear, visible link to
// https://storm-charles.promptugal.news goes at the top, with the storm site named as the live source"; Lisbon Fringe
// beside it once live). designer@PrompTugal.dinis. Put on the live home page under E's nav for the picture; light and dark.
//   node design/live-sources/make.mjs [--out DIR] [--fringe] -> DIR/live-sources--{phone,desktop}--{light,dark}[--fringe].png
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const { chromium } = createRequire(import.meta.url)('playwright')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-live-sources')
const FRINGE = process.argv.includes('--fringe'); fs.mkdirSync(OUT, { recursive: true })
const css = `
.ls{--sand:#efe6d2;--i:#121317;--i2:#3f424a;--r:#c52830;--g:#006600;background:var(--sand);border-bottom:1px solid #d8d4cb;padding:0 16px}
@media(prefers-color-scheme:dark){.ls{--sand:#1d1f25;--i:#f6f3ec;--i2:#b9bbc2;--r:#f07278;--g:#6dbb7e;border-color:#2c2e35}}
.ls .w{max-width:1180px;margin:0 auto;display:grid;gap:0}@media(min-width:760px){.ls .w{grid-template-columns:${FRINGE ? '1.4fr 1fr' : '1fr'}}}
.ls a{display:grid;grid-template-columns:auto 1fr auto;gap:4px 12px;align-items:center;padding:11px 0;color:var(--i);text-decoration:none;min-height:52px}
.ls a+a{border-top:1px solid #d8d4cb}@media(min-width:760px){.ls a+a{border-top:0;border-left:1px solid #d8d4cb;padding-left:18px}}
.ls .k{font:700 11px "IBM Plex Sans",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--r);white-space:nowrap}.ls .k:before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--r);margin-right:6px;vertical-align:1px}
.ls .k.n{color:var(--g)}.ls .k.n:before{background:var(--g)}
.ls b{font:600 17px/1.2 Newsreader,Georgia,serif}.ls small{display:block;font:13px/1.35 "IBM Plex Sans",sans-serif;color:var(--i2)}
.ls .go{font:600 13px "IBM Plex Mono",monospace;color:var(--g);white-space:nowrap}
@media(max-width:759px){.ls a{grid-template-columns:1fr;gap:2px;padding:9px 0}.ls small{display:none}.ls .go{font-size:12px}}
.ls-tag{position:fixed;right:8px;bottom:70px;z-index:99;background:#c52830;color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;text-transform:uppercase}`
const strip = `<div class=w><a href="https://storm-charles.promptugal.news/"><span class=k>Live source</span><span><b>Storm Charles: the weather, now</b><small>Warnings, decisions and the timeline, each with its source and the time read. Not a warning service: follow IPMA and ANEPC.</small></span><span class=go>storm-charles.promptugal.news ↗</span></a>${FRINGE ? `<a href="https://fringe.promptugal.news/"><span class="k n">New</span><span><b>Lisbon Fringe</b><small>The alternative and community events around the summit. Independent.</small></span><span class=go>fringe.promptugal.news ↗</span></a>` : ''}</div>`
const br = await chromium.launch()
for (const dark of [false, true]) for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
  const p = await br.newPage({ viewport: vp, colorScheme: dark ? 'dark' : 'light' }); await p.goto('https://promptugal.news/', { waitUntil: 'load' }); await p.waitForTimeout(1500)
  await p.evaluate(({ css, strip }) => { const s = document.createElement('style'); s.textContent = css; document.head.append(s)
    const nav = document.querySelector('nav.em-nav'); const host = nav.closest('header') || nav.parentElement
    const el = document.createElement('div'); el.className = 'ls'; el.innerHTML = strip; host.after(el)
    const t = document.createElement('span'); t.className = 'ls-tag'; t.textContent = 'Design · live sources'; document.body.append(t) }, { css, strip })
  await p.waitForTimeout(200); await p.screenshot({ path: path.join(OUT, `live-sources--${d}--${dark ? 'dark' : 'light'}${FRINGE ? '--fringe' : ''}.png`) }); await p.close() }
await br.close(); console.log('->', OUT)
