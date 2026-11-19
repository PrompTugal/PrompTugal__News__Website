// designer@PrompTugal.dinis, 18 Nov 2026: the sites bar across every *.promptugal.news site
// (Dinis, 18 Nov ~22:00 UTC; board/guidance/2026-11-18-the-sites-bar.md; the spec: board/spec-the-sites-bar.md).
// Writes the bar's markup and CSS (design/sites-bar/sites-bar.html.txt), the preview card template
// (design/sites-bar/preview-template.svg.txt) and pictures at 1280 and 390 px, light and dark. No AI.
// The sites and their one lines follow the guidance's list; the preview shown is promptugal.news's own, from counts in
// this repository; every other figure is a placeholder the site fills from its own data.
//   python3 -m http.server 8765 &  node design/sites-bar/mock.mjs     (fonts from this site's assets/fonts)
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const articles = readdirSync('content/articles').filter(f => f.endsWith('.md')).length
const places = JSON.parse(readFileSync('data/by-place/places.json', 'utf8')).places.length
const SITES = [
  ['promptugal.news', 'News', "Portugal's news, town by town"],
  ['data', 'Data', 'the open data behind every site, with APIs'],
  ['weather', 'Weather', 'warnings, fire risk, sea, place by place'],
  ['civic', 'Civic', 'public money and public services, explained'],
  ['startups', 'Startups', 'startups and their funding, by place'],
  ['travel', 'Travel', 'flights, transport, strikes, events'],
  ['events', 'Events', "what is on, and where we found it"],
  ['signals', 'Signals', 'weak signals from public sources'],
  ['library', 'Library', 'the catalogue at the heart of everything'],
  ['videos', 'Videos', 'talks and replays, by link'],
  ['live', 'Live', 'what is happening now'],
  ['cyber', 'Cyber', 'security news and advisories'],
  ['bulletins', 'Bulletins', 'the daily bulletins'],
]
const url = id => id === 'promptugal.news' ? 'https://promptugal.news/' : `https://${id}.promptugal.news/`

// The preview card: 320 x 180, the site's own figures. Placeholders in {{ }} are filled by each site at its build.
const TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180" role="img" aria-label="{{site}}: {{line}}">
  <rect width="320" height="180" rx="6" fill="#f6f3ec"/>
  <rect x="0" y="0" width="320" height="4" fill="{{accent}}"/>
  <text x="16" y="30" font-family="IBM Plex Mono, monospace" font-size="10.5" letter-spacing="1.2" fill="#666860">{{SITE}} · NOW</text>
  <text x="16" y="84" font-family="Newsreader, Georgia, serif" font-size="46" fill="#121317">{{n1}}</text>
  <text x="16" y="104" font-family="IBM Plex Sans, Arial, sans-serif" font-size="12" fill="#3a3b40">{{label1}}</text>
  <text x="176" y="72" font-family="Newsreader, Georgia, serif" font-size="26" fill="#121317">{{n2}}</text>
  <text x="176" y="88" font-family="IBM Plex Sans, Arial, sans-serif" font-size="11" fill="#3a3b40">{{label2}}</text>
  <text x="176" y="120" font-family="Newsreader, Georgia, serif" font-size="26" fill="#121317">{{n3}}</text>
  <text x="176" y="136" font-family="IBM Plex Sans, Arial, sans-serif" font-size="11" fill="#3a3b40">{{label3}}</text>
  <line x1="16" y1="150" x2="304" y2="150" stroke="#d8d4cb"/>
  <text x="16" y="168" font-family="IBM Plex Mono, monospace" font-size="10" fill="#666860">read {{read_at}} · {{licence}}</text>
</svg>`
const xml = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fill = (t, v) => t.replace(/\{\{(\w+)\}\}/g, (m, k) => k === 'accent' ? (/^#[0-9a-f]{6}$/.test(v[k]) ? v[k] : '#121317') : (v[k] != null ? xml(v[k]) : m))  // escape every value (the AppSec post-review)
const preview = fill(TEMPLATE, { site: 'PrompTugal.news', SITE: 'PROMPTUGAL.NEWS', line: SITES[0][2], accent: '#006600',
  n1: String(articles), label1: 'articles, each signed', n2: String(places), label2: 'places with their own page',
  n3: '17', label3: 'Algarve towns', read_at: '18 Nov, 22:00 UTC', licence: 'CC BY 4.0' })

const F = 'http://localhost:8765/assets/fonts/'
const CSS = `
@font-face{font-family:Newsreader;src:url(${F}newsreader-variable.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:'IBM Plex Sans';src:url(${F}plex-sans-variable.woff2) format('woff2');font-weight:100 700}
@font-face{font-family:'IBM Plex Mono';src:url(${F}plex-mono-400.woff2) format('woff2')}
:root{--paper:#f6f3ec;--ink:#121317;--rule:#d8d4cb;--muted:#666860;--green:#006600;--bar:#121317;--bar-ink:#f6f3ec;--bar-mute:#a9aba3;--chip:#26272d;--pop:#fff}
[data-theme=dark]{--paper:#121317;--ink:#f6f3ec;--rule:#44453f;--muted:#b4b6ad;--green:#6dbb7e;--bar:#0b0c0f;--bar-ink:#f6f3ec;--bar-mute:#8e9088;--chip:#22232a;--pop:#1c1d22}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 Newsreader,Georgia,serif}
/* the bar: 36 px, ink, above every site's own masthead */
.ptsb{background:var(--bar);color:var(--bar-ink);font:500 12.5px/1 'IBM Plex Sans',Arial,sans-serif;position:relative;z-index:40}
.ptsb-w{max-width:1152px;margin:0 auto;padding:0 16px;display:flex;align-items:center;gap:2px;height:36px}
.ptsb-mark{font:600 13px Newsreader,Georgia,serif;margin-right:10px;white-space:nowrap}.ptsb-mark b{color:#e0575d}.ptsb-mark i{font-style:normal;color:#6dbb7e}
.ptsb ul{list-style:none;margin:0;padding:0;display:flex;gap:2px;overflow:hidden}
.ptsb a{color:var(--bar-mute);text-decoration:none;padding:6px 9px;border-radius:4px;display:block;white-space:nowrap}
.ptsb a:hover,.ptsb a:focus-visible{color:var(--bar-ink);background:var(--chip);outline:none}
.ptsb a[aria-current=page]{color:var(--bar-ink);box-shadow:inset 0 -2px 0 #6dbb7e}
.ptsb .ptsb-all{margin-left:auto;display:none}
/* the pop-up: 340 px, under the hovered name, with the site's own preview */
.ptsb-pop{position:absolute;top:40px;width:340px;background:var(--pop);color:var(--ink);border:1px solid var(--rule);border-radius:8px;box-shadow:0 16px 36px rgba(0,0,0,.18);padding:10px 10px 12px;font-family:'IBM Plex Sans',Arial,sans-serif}
.ptsb-pop:before{content:"";position:absolute;top:-6px;left:28px;width:10px;height:10px;background:var(--pop);border-left:1px solid var(--rule);border-top:1px solid var(--rule);transform:rotate(45deg)}
.ptsb-pop svg{display:block;width:100%;height:auto;border-radius:6px}
.ptsb-pop h4{font:600 17px Newsreader,Georgia,serif;margin:10px 4px 2px}.ptsb-pop p{margin:0 4px;font-size:13px;color:var(--muted)}
.ptsb-pop .go{display:flex;justify-content:space-between;align-items:center;margin:10px 4px 0;font-size:12px;color:var(--muted)}.ptsb-pop .go a{color:var(--ink);font-weight:600;font-size:13px;text-decoration:none}
/* a phone: one "Sites" button; the list as a sheet from the bottom */
.sheet{position:fixed;left:0;right:0;bottom:0;background:var(--pop);color:var(--ink);border-radius:14px 14px 0 0;box-shadow:0 -12px 30px rgba(0,0,0,.25);padding:8px 16px 18px;font-family:'IBM Plex Sans',Arial,sans-serif;max-height:78vh;overflow:auto}
.sheet .grab{width:40px;height:4px;border-radius:2px;background:var(--rule);margin:2px auto 10px}
.sheet h3{font:600 12px 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;margin:0 0 6px;color:var(--muted)}
.sheet ul{list-style:none;margin:0;padding:0}.sheet li a{display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid var(--rule);text-decoration:none;color:var(--ink);min-height:44px;align-items:center}
.sheet li a b{font:600 16px Newsreader,Georgia,serif}.sheet li a span{font-size:12.5px;color:var(--muted);text-align:right}
.sheet li a[aria-current=page] b:after{content:" · you are here";font:500 11px 'IBM Plex Mono',monospace;color:var(--green)}
.scrim{position:fixed;inset:0;background:rgba(0,0,0,.35)}
@media(max-width:760px){.ptsb-mark{display:none}.ptsb-w{padding:0}.ptsb ul{overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding:0 12px;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14px,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 14px,#000 calc(100% - 28px),transparent)}.ptsb ul::-webkit-scrollbar{display:none}.ptsb li{scroll-snap-align:center}.ptsb a{padding:9px 11px;font-size:13px}.ptsb a[aria-current=page]{background:var(--chip)}}
/* a stand-in for the host site underneath */
.host{max-width:1152px;margin:0 auto;padding:22px 16px}.host .wm{font:600 40px Newsreader,Georgia,serif;text-align:center;margin:8px 0 14px}.host .wm b{color:#c52830}.host .wm i{color:var(--green);font-style:normal}
.host p{color:var(--muted);font:15px 'IBM Plex Sans',Arial,sans-serif;max-width:640px}`

const bar = cur => `<nav class="ptsb" aria-label="The PrompTugal.news sites"><div class="ptsb-w"><span class="ptsb-mark">Promp<b>T</b><i>ugal</i>.news sites</span>
<ul>${SITES.map(([id, name]) => `<li><a href="${url(id)}"${id === cur ? ' aria-current="page"' : ''} data-site="${id}" aria-haspopup="dialog">${name}</a></li>`).join('')}</ul>
<a class="ptsb-all" href="#sites" aria-haspopup="dialog">Sites ▾</a></div></nav>`
const pop = (x, [id, name, line]) => `<div class="ptsb-pop" role="dialog" aria-label="${name}" style="left:${x}px">${preview}<h4>${name} · ${id === 'promptugal.news' ? 'promptugal.news' : id + '.promptugal.news'}</h4><p>${line}</p><p class="go"><span>updated 18 Nov, 21:40 UTC · v0.1.1830</span><a href="${url(id)}">Go →</a></p></div>`
const host = `<div class="host"><div class="wm">Promp<b>T</b><i>ugal</i>.news <span style="font-weight:400">Library</span></div><p>The site's own page continues here. The bar above is the same on all thirteen sites; this one is library.promptugal.news, marked in the bar.</p></div>`
const sheet = cur => `<div class="scrim"></div><div class="sheet" role="dialog" aria-label="The PrompTugal.news sites"><div class="grab"></div><h3>The PrompTugal.news sites</h3><ul>${SITES.map(([id, name, line]) => `<li><a href="${url(id)}"${id === cur ? ' aria-current="page"' : ''}><b>${name}</b><span>${line}</span></a></li>`).join('')}</ul></div>`

const page = (theme, body) => `<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head><body>${body}</body></html>`
mkdirSync('design/decisions/sites-bar', { recursive: true })
writeFileSync('design/sites-bar/sites-bar.html.txt', `<!-- the bar, its pop-up and the phone sheet; CSS in the <style>. designer@, 18 Nov 2026 -->\n<style>${CSS}</style>\n${bar('library')}\n${pop(96, SITES[0])}\n${sheet('library')}\n`)
writeFileSync('design/sites-bar/preview-template.svg.txt', TEMPLATE + '\n')
const b = await chromium.launch()
for (const theme of ['light', 'dark']) {
  for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
    const body = w > 760 ? `${bar('library')}<div style="position:relative;max-width:1152px;margin:0 auto">${pop(96, SITES[0])}</div>${host}` : `${bar('library')}${host}<script>document.querySelector('.ptsb a[aria-current]').scrollIntoView({inline:'center',block:'nearest'})</script>`
    const p = await b.newPage({ viewport: { width: w, height: w > 760 ? 420 : 300 } })
    await p.route('http://localhost:8765/__sites-bar', r => r.fulfill({ body: page(theme, body), contentType: 'text/html; charset=utf-8' }))
    await p.goto('http://localhost:8765/__sites-bar', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300)
    await p.screenshot({ path: `design/decisions/sites-bar/${tag}-${theme}.png` })
    if (await p.evaluate(() => document.documentElement.scrollWidth) > w) console.log('overflow', tag, theme)
    await p.close()
  }
}
await b.close(); console.log('done', articles, places)
