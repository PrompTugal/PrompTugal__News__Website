// designer@PrompTugal.dinis, 19 Nov 2026: the free page with YouTube's player on promptugal.news
// (Dinis, 19 Nov: board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md section 3; rights@'s conditions
// C1 to C6 in board/team/rights/register/google-apis.md; the spec: board/spec-the-free-replays-page.md).
// Injects the proposed page into the built /about/ page on :8765 and screenshots it at 1280 and 390, light and dark.
// No AI. No YouTube asset is drawn or loaded: the player is a labelled stand-in box of the exact size the real iframe
// takes; no YouTube logo until rights@ has quoted the branding guidelines. Titles are placeholders for data.b@'s feed.
//   python3 -m http.server 8765 &  node design/free-replays/mock.mjs
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const ITEMS = [
  ['Opening Night', 'the official replay', '[title from data.b@\'s youtube-replays feed]', '[channel]', '[date]', 'WS26 2026/0001'],
  ['Day One, Centre Stage', 'the official replay', '[title from the feed]', '[channel]', '[date]', 'WS26 2026/0002'],
]
const player = `<div class="yt" role="img" aria-label="Stand-in for YouTube's iframe player"><span>YouTube's own iframe player<br><small>youtube-nocookie.com/embed/&lt;id&gt; · documented parameters only · no overlay</small></span></div>`
const item = ([h, k, t, ch, d, cn]) => `<article class="fr-i"><p class="fr-k">${k} · <a href="#">${cn}</a></p><h2>${h}</h2>${player}
<p class="fr-credit">Video on <a href="#">YouTube</a>, by ${ch} · <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a></p>
<p class="fr-t">${t} · ${d}</p></article>`
const html = `<div class="fr"><p class="fr-free"><b>Free to watch.</b> This page is never charged, never metered and needs no sign-in. <a href="#">Why this page is free →</a></p>
<p class="fr-kk">Web Summit Lisbon 2026 · the replays</p><h1>Watch the summit's own replays</h1>
<p class="fr-d">The organiser's official recordings, played in YouTube's own player. We link and embed; we copy nothing. Each video is catalogued in <a href="#">the library</a> with its source and licence.</p>
${ITEMS.map(item).join('')}
<p class="fr-foot">Videos and their attribution: YouTube and each channel, under the <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>. This page's text: CC BY 4.0. Nothing from YouTube's API is kept more than 30 days.</p></div>`
const CSS = `.fr{max-width:760px;margin:0 auto;padding:22px 0 50px;font-family:var(--serif,Georgia);color:var(--ink,#121317)}
.fr-free{font:15px/1.45 var(--sans,system-ui);background:#e9f1e9;border-left:4px solid #006600;padding:10px 14px;margin:0 0 22px}
.fr-free a{color:#0a3a14;font-weight:600}
.fr-kk,.fr-k{font:600 11px var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:#006600;margin:0 0 6px}.fr-k a{color:inherit}
.fr h1{font:600 38px/1.08 var(--serif,Georgia);margin:0 0 10px;text-transform:none;letter-spacing:-.01em;border:0;padding:0}
.fr-d{font-size:18px;line-height:1.5;color:var(--ink-2,#2a2b2f);margin:0 0 26px}.fr-d a{color:inherit}
.fr-i{border-top:1px solid var(--hair,#d8d4cb);padding:22px 0 6px}
.fr .fr-i h2{font:600 24px/1.2 var(--serif,Georgia)!important;text-transform:none!important;letter-spacing:0!important;border:0!important;padding:0!important;margin:0 0 12px!important}
/* C3: the real iframe, 16:9, at least 480 x 270 where there is room, never under 200 px tall; nothing laid over it */
.yt{width:100%;max-width:640px;aspect-ratio:16/9;min-height:200px;background:#0f0f10;color:#d9d9d9;display:flex;align-items:center;justify-content:center;text-align:center;font:600 14px/1.4 var(--sans,system-ui);border-radius:4px}
.yt small{font:400 11.5px var(--mono,monospace);color:#9a9a9a}
/* C4: the credit and YouTube's Terms right under the player, always visible */
.fr-credit{font:13px var(--sans,system-ui);margin:8px 0 2px;color:var(--ink-2,#3a3b40)}.fr-credit a{color:inherit;font-weight:600}
.fr-t{font:13px var(--sans,system-ui);color:var(--ink-3,#666860);margin:0 0 14px}
.fr-foot{font:12px/1.5 var(--mono,monospace);color:var(--ink-3,#666860);border-top:1px solid var(--hair,#d8d4cb);padding-top:12px;margin-top:20px}.fr-foot a{color:inherit}
@media(max-width:600px){.fr{padding:16px 16px 40px}.fr h1{font-size:30px}.yt{max-width:none}}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .fr-free{background:#16261a;color:#e6efe6}:root:not([data-theme=light]) .fr-free a{color:#8fd18f}:root:not([data-theme=light]) .fr-kk,:root:not([data-theme=light]) .fr-k{color:#6dbb7e}}
[data-theme=dark] .fr-free{background:#16261a;color:#e6efe6}[data-theme=dark] .fr-free a{color:#8fd18f}[data-theme=dark] .fr-kk,[data-theme=dark] .fr-k{color:#6dbb7e}`
const out = 'design/decisions/free-replays'; mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const scheme of ['light', 'dark']) for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme }); const p = await ctx.newPage()
  await p.route(/^https?:\/\/(?!localhost)/, r => r.abort())
  await p.goto('http://localhost:8765/about/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(700)
  await p.evaluate(([c, h]) => { const s = document.createElement('style'); s.textContent = c; document.head.append(s)
    ;(document.querySelector('main') || document.body).innerHTML = h
    // C1: on this page the masthead's reading-credit pill says the page is free, not the balance
    const hits = [...document.querySelectorAll('a,button,span')].filter(e => /Pay for what you read/.test(e.textContent)); hits.filter(e => !hits.some(o => o !== e && e.contains(o))).forEach(e => { const pill = e.closest('a,button') || e; pill.textContent = 'Free page' }) }, [CSS, html])
  await p.screenshot({ path: `${out}/${tag}-${scheme}.png`, fullPage: true })
  if (await p.evaluate(() => document.documentElement.scrollWidth) > w) console.log('overflow', tag, scheme)
  console.log(tag, scheme, await p.evaluate(() => { const r = document.querySelector('.yt').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] }))
  await ctx.close()
}
await b.close()
