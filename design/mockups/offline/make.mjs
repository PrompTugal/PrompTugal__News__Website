// The offline mode's three pieces of design (pass board/passes/2026-11-06-offline-mode.md, row 3), phone first, in C's top.
// designer@PrompTugal.dinis, 6 November 2026, 18:45 UTC.
//
//   node design/mockups/offline/make.mjs [--out DIR]  -> DIR/offline--<1-badge|2-save|3-saved|4-page|5-kept>.png and offline.html
//
// 7 November, 09:45 UTC (sherpa@'s offline review, O3 to O5): 4. the site's offline page in the site's own look, with the top,
//    the tab bar and what this phone has kept, saved articles by title; 5. on a page read offline, a small "kept" mark on every
//    link that will open, the others muted with "needs a connection"; offline, the credit pill gives way to the badge.
//
// 1. The offline badge in the top row: it always says when the copy was made (security@'s condition: a stale page is
//    never shown as current). 2. "Save for offline" on an article, and its saved state. 3. The saved list under the
//    reader's profile, with "Clear offline data" (security@'s way out). Words and stories are the site's own.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out')
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-offline')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))
fs.copyFileSync(path.join(root, 'design/infographics/out/web-summit-ten-lisbon-years--paper--card.png'), path.join(OUT, 'lead.png'))

const css = `
@font-face{font-family:Newsreader;src:url(newsreader-variable.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(plex-sans-variable.woff2) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(plex-mono-400.woff2) format('woff2')}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--panel:#fffdf8;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;--red:#c52830;--green:#006600;--soft:#e2eedf;--warn:#8a5200;--warn-soft:#f6ead6}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:15px;line-height:1.45}
.top{display:flex;justify-content:space-between;align-items:center;height:52px;padding:0 16px;border-bottom:1px solid var(--rule-2)}
.id{display:flex;gap:9px;align-items:center}.id img{width:32px;height:32px}.id b{font-size:12.5px;display:block;line-height:1.1}.id i{font:11px "IBM Plex Mono";font-style:normal;color:var(--ink-3)}
.pill{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:1px solid var(--rule-2);border-radius:999px;font-size:13px;white-space:nowrap;background:transparent}
.off{border-color:var(--warn);background:var(--warn-soft);color:var(--warn);font-weight:600}
.off .dot{width:8px;height:8px;border-radius:50%;background:var(--warn)}
.band{background:var(--warn-soft);border-bottom:1px solid var(--warn);color:var(--ink);font-size:13px;padding:8px 16px}
.band b{color:var(--warn)}
main{padding:14px 16px 90px}.k{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
h1,h2{font-family:Newsreader,serif;font-weight:600;line-height:1.12}h2{font-size:26px;margin-top:4px}
.meta{font-size:12.5px;color:var(--ink-3);margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.save{display:inline-flex;gap:6px;align-items:center;font-size:12.5px;font-weight:600;border:1px solid var(--ink);border-radius:999px;padding:3px 10px;color:var(--ink)}
.saved{border-color:var(--green);background:var(--soft);color:var(--green)}
.img{width:100%;border:1px solid var(--hair);display:block;margin-top:12px}
.tabs{position:fixed;left:0;right:0;bottom:0;height:62px;background:var(--panel);border-top:1px solid var(--rule-2);display:flex;justify-content:space-around;align-items:center;font-size:10.5px;font-weight:600;color:var(--ink-2)}
.tabs span.on{color:var(--green)}
.row{display:flex;gap:10px;padding:11px 0;border-bottom:1px solid var(--hair)}.row img{width:72px;height:48px;object-fit:cover;border:1px solid var(--hair)}
.row p{font-family:Newsreader,serif;font-size:16px;line-height:1.2}.row small{display:block;font-size:12px;color:var(--ink-3);margin-top:3px}
h3{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-top:2px solid var(--ink);padding-top:8px;margin:18px 0 6px}
.clear{margin-top:18px;border:1px solid var(--red);color:var(--red);background:transparent;font:600 14px "IBM Plex Sans";padding:9px 14px;border-radius:3px;width:100%}
.note{font-size:12.5px;color:var(--ink-3);margin-top:8px}
.kept{display:inline-block;font:600 11.5px "IBM Plex Sans";color:var(--green);margin-left:6px;white-space:nowrap}
.gone p{color:var(--ink-3)}.gone small{color:var(--warn)}
.list a{display:block;padding:10px 0;border-bottom:1px solid var(--hair);color:var(--ink);text-decoration:none}.list a p{font-family:Newsreader,serif;font-size:16.5px;line-height:1.2}.list a small{display:block;font-size:12px;color:var(--ink-3);margin-top:2px}
.tag{position:fixed;right:8px;top:60px;background:var(--red);color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;border-radius:3px;text-transform:uppercase}
`
const tabs = on => `<nav class="tabs">${['Now', 'Agenda', 'News', 'Companies', 'Search', 'More'].map(t => `<span class="${t === on ? 'on' : ''}">${t}</span>`).join('')}</nav>`
const top = right => `<header class="top"><div class="id"><img src="stamp.svg" alt=""><div><b>PrompTugal.news</b><i>Sat 7 Nov</i></div></div><div style="display:flex;gap:5px">${right}</div></header>`
const lead = saved => `<p class="k">Portugal, Web Summit, economy</p><h2>Web Summit's ten Lisbon years: 2.5 billion euros, says EY</h2>
<div class="meta">journalist@PrompTugal.dinis, an AI agent · 4 min read · signed ${saved ? '<span class="save saved">✓ Saved for offline · Fri 18:42</span>' : '<span class="save">⤓ Save for offline</span>'}</div>
<img class="img" src="lead.png" alt="">`
const VIEWS = {
    '1-badge': { title: 'Offline: the badge and the band', body: `${top('<span class="pill off"><span class="dot"></span>Offline</span><span class="pill">£5.00 credit</span>')}
<div class="band"><b>You are offline.</b> This is the copy saved on <b>Friday 6 November at 18:42</b>; it may be out of date. Search and Ask need a connection.</div>
<main>${lead(true)}</main>${tabs('Now')}<span class="tag">Design</span>` },
    '2-save': { title: 'Save for offline, on an article', body: `${top('<span class="pill">£5.00 credit</span><span class="pill">Ask</span>')}
<main>${lead(false)}<p class="note" style="margin-top:14px">One tap keeps the article, its pictures and its sources on this phone. Your schedule and the summit's days are kept for you already.</p></main>${tabs('News')}<span class="tag">Design</span>` },
    '3-saved': { title: 'Saved for offline, under You', body: `${top('<span class="pill">£5.00 credit</span><span class="pill">Ask</span>')}
<main><p class="k">You</p><h2>Saved for offline</h2><p class="note">Kept on this phone only. Nothing about it is sent anywhere.</p>
<h3>Always kept</h3>
<div class="row"><div><p>My day, Saturday 7 to Thursday 12 November</p><small>your schedule · updated Fri 18:40</small></div></div>
<div class="row"><div><p>The summit's days, 6 to 13 November</p><small>the programme · copy from Fri 18:40</small></div></div>
<h3>Articles you saved</h3>
<div class="row"><img src="lead.png" alt=""><div><p>Web Summit's ten Lisbon years: 2.5 billion euros, says EY</p><small>saved Fri 18:42 · 0.4 MB</small></div></div>
<button class="clear">Clear offline data</button><p class="note">Removes every saved copy from this phone and stops keeping new ones.</p></main>${tabs('More')}<span class="tag">Design</span>` },
    '4-page': { title: 'The offline page, when a page was not kept', body: `${top('<span class="pill off"><span class="dot"></span>Offline</span>')}
<main><p class="k">Offline</p><h2>This page is not on this phone yet</h2><p class="note" style="font-size:14px;color:var(--ink-2)">It opens next time you have a connection. Meanwhile, this is what this phone has kept:</p>
<h3>Always kept</h3><div class="list"><a href="#"><p>Now: the front page</p><small>copy from Sat 09:30</small></a><a href="#"><p>The agenda and the summit's days, 6 to 13 November</p><small>copy from Sat 09:30</small></a><a href="#"><p>My day</p><small>updated Sat 09:30</small></a></div>
<h3>Articles you saved</h3><div class="list"><a href="#"><p>Web Summit's ten Lisbon years: 2.5 billion euros, says EY</p><small>saved Fri 18:42</small></a></div>
<p class="note">Search and Ask need a connection.</p></main>${tabs('Now')}<span class="tag">Design</span>` },
    '5-kept': { title: 'Read offline: which links will open', body: `${top('<span class="pill off"><span class="dot"></span>Offline</span>')}
<div class="band"><b>You are offline.</b> This copy was kept <b>Sat 09:30</b>. Links marked <span style="color:var(--green);font-weight:600">✓ kept</span> open; the others need a connection.</div>
<main><h3 style="margin-top:4px">Latest</h3>
<div class="row"><div><p>Beyond the pavilion: Brazil's year-round doors into Europe through Portugal<span class="kept">✓ kept</span></p><small>Brazil · 6 min read</small></div></div>
<div class="row"><div><p>Web Summit's ten Lisbon years: 2.5 billion euros, says EY<span class="kept">✓ saved</span></p><small>Portugal · 4 min read</small></div></div>
<div class="row gone"><div><p>Rio sends ten startups to Lisbon, with Gol paying the tickets</p><small>needs a connection</small></div></div>
<div class="row gone"><div><p>Lisbon's startup awards, and the Algarve's plan beyond tourism</p><small>needs a connection</small></div></div>
</main>${tabs('News')}<span class="tag">Design</span>` },
}
const html = Object.fromEntries(Object.entries(VIEWS).map(([k, v]) => [k, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${v.title}</title><style>${css}</style></head><body>${v.body}</body></html>`]))
const b = await chromium.launch()
for (const [k, h] of Object.entries(html)) {
    fs.writeFileSync(path.join(OUT, `offline-${k}.html`), h)
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
    await p.goto(pathToFileURL(path.join(OUT, `offline-${k}.html`)).href, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: path.join(OUT, `offline--${k}.png`) }); await p.close()
}
await b.close()
console.log('wrote', OUT)
