// designer@PrompTugal.dinis, 18 Nov 2026: the look of library.promptugal.news (board/spec-the-library-look.md).
// Dinis, 18 Nov ~15:30 UTC: "make it look really good. It should try to look like a library website."
// Writes the home page and the catalogue card as one HTML file (design/library/library.html.txt, kept as text so this
// site's build does not treat it as a page) and screenshots both at 1280 and 390 px. No AI. The sample entries are this
// site's own published articles and counts read from this repository; the call numbers follow the scheme the spec proposes.
//   python3 -m http.server 8765 &  node design/library/mock.mjs      (the fonts load from this site's assets/fonts)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const fm = f => { const s = readFileSync(f, 'utf8'); const m = s.match(/^---\n([\s\S]*?)\n---/); const o = {}
  if (m) for (const l of m[1].split('\n')) { const k = l.match(/^(\w+):\s*"?(.*?)"?\s*$/); if (k) o[k[1]] = k[2] } return o }
const arts = readdirSync('content/articles').filter(f => f.endsWith('.md')).map(f => ({ slug: f.slice(0, -3), ...fm('content/articles/' + f) }))
  .filter(a => a.status === 'published' && a.date).sort((a, b) => a.date.localeCompare(b.date))
arts.forEach((a, i) => { a.call = `ART ${a.date.slice(0, 4)}/${String(i + 1).padStart(4, '0')}` })
const places = JSON.parse(readFileSync('data/by-place/places.json', 'utf8')).places
const media = readdirSync('data/organisations').filter(id => existsSync(`data/organisations/${id}/organisation.json`))
  .map(id => JSON.parse(readFileSync(`data/organisations/${id}/organisation.json`, 'utf8'))).filter(o => o.kind === 'media')
const recent = arts.slice(-5).reverse()
const item = arts.find(a => a.slug === 'promptugal-news-local-news-town-by-town') || recent[0]
const DAY = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
const who = a => esc((a.author || '').split(',')[0])

const F = 'http://localhost:8765/assets/fonts/'
const CSS = `
@font-face{font-family:Newsreader;src:url(${F}newsreader-variable.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:Newsreader;font-style:italic;src:url(${F}newsreader-400-italic.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Sans';src:url(${F}plex-sans-variable.woff2) format('woff2');font-weight:100 700}
@font-face{font-family:'IBM Plex Mono';src:url(${F}plex-mono-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:'IBM Plex Mono';src:url(${F}plex-mono-500.woff2) format('woff2');font-weight:500}
:root{--paper:#f6f3ec;--ink:#121317;--red:#c52830;--green:#006600;--rule:#d8d4cb;--muted:#666860;--card:#fbf8f0;--shelf:#e9e2d2;
--serif:Newsreader,Georgia,serif;--sans:'IBM Plex Sans',Arial,sans-serif;--mono:'IBM Plex Mono',monospace}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 var(--serif)}
a{color:inherit}.w{max-width:1152px;margin:0 auto;padding:0 16px}
.top{border-bottom:1px solid var(--rule)}.top .w{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;font:500 13px var(--sans)}
.wm{font:600 22px var(--serif);letter-spacing:-.01em}.wm b{color:var(--red);font-weight:600}.wm i{color:var(--green);font-weight:600;font-style:normal}.wm em{font-weight:400;color:var(--muted)}
.nav{display:flex;gap:18px;flex-wrap:wrap}.nav a{text-decoration:none}
.hall{padding:44px 0 26px;border-bottom:3px double var(--ink)}
.k{font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin:0 0 10px}
.hall h1{font:500 54px/1.02 var(--serif);margin:0 0 14px;letter-spacing:-.015em}.hall h1 em{font-style:italic;font-weight:400}
.hall p.d{font-size:20px;max-width:720px;margin:0 0 24px;color:#2a2b2f}
.search{display:grid;grid-template-columns:1fr auto;border:2px solid var(--ink);background:#fff;max-width:820px}
.search input{border:0;padding:14px 16px;font:400 18px var(--serif);background:transparent;min-width:0}
.search button{border:0;background:var(--ink);color:var(--paper);font:600 14px var(--sans);padding:0 22px;min-height:52px}
.by{display:flex;flex-wrap:wrap;gap:6px 16px;margin:12px 0 0;font:13px var(--sans);color:var(--muted)}.by a{color:var(--ink)}
.counts{display:flex;flex-wrap:wrap;gap:4px 26px;margin:22px 0 0;font:13px var(--mono);color:var(--muted)}.counts b{font:500 22px var(--serif);color:var(--ink);margin-right:6px}
h2.sh{font:600 12px var(--mono);letter-spacing:.14em;text-transform:uppercase;margin:34px 0 12px;display:flex;justify-content:space-between;border-bottom:1px solid var(--ink);padding-bottom:6px}
h2.sh a{font-weight:500;letter-spacing:0;text-transform:none;font-family:var(--sans)}
.shelf{display:flex;align-items:flex-end;gap:4px;padding:0 10px;border-bottom:10px solid var(--shelf);box-shadow:0 6px 0 -2px #d7cdb8;overflow-x:auto;min-height:230px}
.sp{flex:none;width:58px;writing-mode:vertical-rl;transform:rotate(180deg);text-decoration:none;display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-radius:2px 2px 0 0;
 font:600 15px var(--serif);color:var(--paper);background:var(--ink)}
.sp small{font:500 10.5px var(--mono);letter-spacing:.06em;opacity:.8}
.sp.g{background:#0a3a14}.sp.s{background:#e3dac6;color:var(--ink)}.sp.r{background:#7d1d22}.sp.o{background:#2b2d33}.sp.f{background:transparent;color:var(--muted);border:1.5px dashed #b9b2a3}
.cols{display:grid;grid-template-columns:1.35fr 1fr;gap:32px}
.acc li{display:grid;grid-template-columns:1fr;gap:3px;padding:10px 0;border-bottom:1px solid var(--rule)}
.acc{list-style:none;margin:0;padding:0}.acc .cn{font:500 12px var(--mono);color:var(--green);padding-top:3px}
.acc a{font:500 17px/1.3 var(--serif);text-decoration:none}.acc span{font:12px var(--sans);color:var(--muted)}
.aids{list-style:none;margin:0;padding:0;columns:2;column-gap:20px}.aids li{break-inside:avoid;padding:7px 0;border-bottom:1px dotted #bdb6a6;font:500 15px var(--sans)}
.aids li span{display:block;font:12px var(--sans);color:var(--muted)}
.inv{margin:40px 0 0;background:#0a3a14;color:#f6f3ec;padding:26px 28px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
.inv h3{font:500 28px/1.15 var(--serif);margin:0 0 8px}.inv p{margin:0;font:15px/1.5 var(--sans);color:#cfe0cf;max-width:680px}
.inv a.b{background:#f6f3ec;color:#0a3a14;font:600 14px var(--sans);text-decoration:none;padding:12px 18px;border-radius:999px;white-space:nowrap}
.foot{margin:34px 0 0;border-top:1px solid var(--rule);padding:16px 0 40px;font:12px var(--mono);color:var(--muted)}
/* the reading room and the card */
.rr{padding-top:30px;padding-bottom:50px}.crumb{font:13px var(--sans);color:var(--muted);margin:0 0 18px}
.rr-g{display:grid;grid-template-columns:1fr 400px;gap:36px;align-items:start}
.rr h1{font:500 40px/1.08 var(--serif);margin:6px 0 12px}.rr .sum{font-size:19px;color:#2a2b2f}
.open{display:inline-block;margin:10px 0 22px;background:var(--ink);color:var(--paper);font:600 14px var(--sans);text-decoration:none;padding:12px 18px;border-radius:999px}
.rel h3{font:600 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;margin:22px 0 6px;border-bottom:1px solid var(--ink);padding-bottom:5px}
.rel ul{list-style:none;margin:0;padding:0}.rel li{padding:7px 0;border-bottom:1px solid var(--rule);font:15px var(--sans)}.rel li i{font:12px var(--mono);color:var(--muted);font-style:normal;margin-right:8px}
.card{position:relative;background:var(--card);border:1px solid #cdc4b0;box-shadow:0 1px 0 #fff inset,0 12px 26px rgba(40,30,10,.12);padding:22px 22px 18px 26px;
 background-image:repeating-linear-gradient(to bottom,transparent 0 27px,#e7ddcb 27px 28px);background-position:0 64px}
.card:before{content:"";position:absolute;left:50%;bottom:12px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.25)}
.card .redline{position:absolute;left:0;right:0;top:58px;border-top:1.5px solid #d98a8e}
.card .cn{font:500 13px var(--mono);color:var(--red);display:flex;justify-content:space-between}
.card .ti{font:500 19px/1.3 var(--serif);margin:16px 0 8px}
.card dl{display:grid;grid-template-columns:78px 1fr;gap:0 10px;margin:0;font:13px/28px var(--mono)}.card dt{color:var(--muted)}.card dd{margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card .lic{font:500 11px var(--mono);border:1px solid currentColor;border-radius:3px;padding:0 5px;color:var(--green)}
.card .tr{margin:14px 0 18px;font:12px var(--mono);color:var(--muted);display:flex;gap:10px;flex-wrap:wrap}
@media(max-width:820px){.hall h1{font-size:38px}.cols,.rr-g{grid-template-columns:minmax(0,1fr)}.aids{columns:1}.inv{grid-template-columns:1fr}.nav{display:none}.sp{width:50px}.shelf{min-height:200px}.rr h1{font-size:32px}}`

const spines = [
  ['g', 'PrompTugal.news articles', 'ART', arts.length],
  ['s', 'Places: the Algarve and Portugal', 'PLC', places.length],
  ['o', 'Local and national media', 'MED', media.length],
  ['r', 'Web Summit Lisbon 2026', 'WS26', null],
  ['f', 'Your collection here', '+', null],
]
const home = `<header class="top"><div class="w"><span class="wm">Promp<b>T</b><i>ugal</i><em>.news</em> · Library</span>
<nav class="nav"><a href="#">Catalogue</a><a href="#">Collections</a><a href="#">Finding aids</a><a href="#">The graph</a><a href="#">For librarians</a></nav></div></header>
<main class="w"><section class="hall"><p class="k">library.promptugal.news · the catalogue at the heart of PrompTugal.news</p>
<h1>Everything we found, <em>catalogued,</em> sourced and linked.</h1>
<p class="d">Every talk, article, data set, organisation and place PrompTugal.news has read, each with its own card: what it is, who made it, when and where, the source, the licence, and how it connects to the rest.</p>
<form class="search" onsubmit="return false"><input aria-label="Search the catalogue" placeholder="Search the catalogue: a title, a person, a place, a call number"><button>Search</button></form>
<p class="by">Browse by <a href="#">place</a><a href="#">topic</a><a href="#">organisation</a><a href="#">event</a><a href="#">person</a><a href="#">date</a><a href="#">call number</a></p>
<p class="counts"><span><b>${arts.length}</b>articles</span><span><b>${places.length}</b>places</span><span><b>${media.length}</b>news organisations</span><span><b>1</b>collection being built</span></p></section>
<h2 class="sh">The shelves <a href="#">All collections →</a></h2>
<div class="shelf">${spines.map(([c, t, cn, n]) => `<a class="sp ${c}" href="#"><small>${cn}${n != null ? ' · ' + n : ''}</small>${t}</a>`).join('')}</div>
<div class="cols"><div><h2 class="sh">New on the shelves <a href="#">Accessions →</a></h2><ol class="acc">${recent.map(a => `<li><span class="cn">${a.call}</span><a href="#">${esc(a.title)}</a><span>${DAY(a.date)} · ${who(a)}</span></li>`).join('')}</ol></div>
<div><h2 class="sh">Finding aids</h2><ul class="aids">
<li>Guide to the Algarve<span>17 towns, their sources and media</span></li><li>Web Summit Lisbon 2026<span>replays by day, talks by timestamp</span></li>
<li>Who covers where<span>the media map, place by place</span></li><li>The open data<span>sources, licences, APIs</span></li>
<li>Call numbers explained<span>how every item keeps its address</span></li><li>What is not here<span>the gaps, and why</span></li></ul></div></div>
<section class="inv"><div><h3>Are you a librarian? Help us build this.</h3><p>We want to work with librarians, archivists and information scientists: to shape the catalogue and the graph, to tell us what we get wrong, or to see how agents do this work. It is open, and every card shows its source.</p></div><a class="b" href="#">Work with us →</a></section>
<p class="foot">Our catalogue and cards: CC BY 4.0 · each item keeps its source's licence, linked on its card · JSON first: /api/v1/items/ · Our principles · Report a problem</p></main>`

const room = `<header class="top"><div class="w"><span class="wm">Promp<b>T</b><i>ugal</i><em>.news</em> · Library</span><nav class="nav"><a href="#">Catalogue</a><a href="#">Collections</a><a href="#">Finding aids</a></nav></div></header>
<main class="w rr"><p class="crumb">Catalogue › PrompTugal.news articles › ${item.call}</p><div class="rr-g"><div>
<p class="k">The reading room · article</p><h1>${esc(item.title)}</h1><p class="sum">${esc(item.summary)}</p>
<a class="open" href="#">Read it at its source →</a>
<div class="rel"><h3>On the same shelf</h3><ul>${arts.slice(-4, -1).map(a => `<li><i>${a.call}</i>${esc(a.title)}</li>`).join('')}</ul>
<h3>Connected in the graph</h3><ul><li><i>PLC</i>The Algarve</li><li><i>TOP</i>Local news</li><li><i>TOP</i>AI agents</li></ul></div></div>
<aside class="card" aria-label="Catalogue card"><span class="redline"></span><div class="cn"><span>${item.call}</span><span>ART</span></div>
<p class="ti">${esc(item.title)}</p><dl><dt>What</dt><dd>article, news</dd><dt>Who</dt><dd>${who(item)}</dd><dt>When</dt><dd>${DAY(item.date)}</dd>
<dt>Where</dt><dd>the Algarve, Portugal</dd><dt>Source</dt><dd>promptugal.news/articles/${item.slug}</dd><dt>Licence</dt><dd><span class="lic">CC BY 4.0</span></dd>
<dt>Found</dt><dd>${item.date}, by library.b@</dd></dl><p class="tr"><span>JSON</span><span>markdown</span><span>cite</span></p></aside></div></main>`

const html = t => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t}</title><style>${CSS}</style></head><body>`
mkdirSync('design/decisions/library', { recursive: true })
writeFileSync('design/library/library.html.txt', `${html('Library: home')}${home}<hr>${room}</body></html>\n`)
const b = await chromium.launch()
for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  for (const [name, body] of [['home', home], ['card', room]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } })
    const page = `${html('Library')}${body}</body></html>`
    await p.route('http://localhost:8765/__library-mock', r => r.fulfill({ body: page, contentType: 'text/html; charset=utf-8' }))
    await p.goto('http://localhost:8765/__library-mock', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400)
    await p.screenshot({ path: `design/decisions/library/${name}-${tag}.png`, fullPage: true })
    if (await p.evaluate(() => document.documentElement.scrollWidth) > w) console.log('overflow', name, w)
    await p.close()
  }
}
await b.close(); console.log('done', arts.length, places.length, media.length, item.call)
