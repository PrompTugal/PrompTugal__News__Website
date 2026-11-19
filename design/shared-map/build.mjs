// designer@PrompTugal.dinis, 19 Nov 2026: the shared map every *.promptugal.news site vendors (Dinis, 19 Nov ~17:40 UTC:
// board/guidance/2026-11-19-cameras-as-links-and-the-map.md, "Portugal big, London and the EU small"; the spec:
// board/spec-the-shared-map.md). Writes design/shared-map/v<VERSION>/ptmap.js, ptmap.css and manifest.json (sha384 SRI
// of each), then renders a demo at 1280 and 390, light and dark. No AI.
// The outline is mainland Portugal and Spain from assets/portugal/portugal-outline.json: Natural Earth 110m (public
// domain) via world-atlas (ISC, Copyright 2013-2019 Michael Bostock; licence text kept in ptmap.js's header).
//   node design/shared-map/build.mjs        (then: python3 -m http.server 8765 &  node design/shared-map/build.mjs --shots)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
const VERSION = '1.0.1'
const O = JSON.parse(readFileSync('assets/portugal/portugal-outline.json', 'utf8')).countries
const r3 = n => Math.round(n * 1000) / 1000
const OUTLINE = { pt: O.Portugal.map(p => p.map(r => r.map(([a, b]) => [r3(a), r3(b)]))), es: O.Spain.map(p => p.map(r => r.map(([a, b]) => [r3(a), r3(b)]))) }

const JS = `/*! ptmap ${VERSION}: the shared map of the PrompTugal.news sites (designer@PrompTugal.dinis, 19 Nov 2026;
 * board/spec-the-shared-map.md in PrompTugal/PrompTugal__News__Website). Vendor this file pinned by its sha384; never load it
 * from another site. No dependencies, no network, no innerHTML: every label is set as text, every link checked.
 * Outline: Natural Earth 110m (public domain) via world-atlas, ISC licence: Copyright 2013-2019 Michael Bostock.
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
 * provided that the above copyright notice and this permission notice appear in all copies. THE SOFTWARE IS PROVIDED "AS IS".
 *
 * PTMap.render(element, {
 *   places: [{ id, name, at: [lon, lat], href, n }],   // mainland places; n (optional) sizes the dot
 *   current: 'faro',                                   // the place this page is about, drawn larger and labelled
 *   london: { href, n } | null,                        // the small inset, if this site has London data
 *   eu: { href, n } | null,                            // the small Brussels inset, if this site has EU data
 *   label: 'Places on this site'                       // the map's accessible name
 * })
 */
(function (root) {
  'use strict'
  var OUTLINE = ${JSON.stringify(OUTLINE)}
  var NS = 'http://www.w3.org/2000/svg'
  var V = { lon0: -9.65, lon1: -6.1, lat0: 36.85, lat1: 42.2 }, K = Math.cos(39.5 * Math.PI / 180), W = 300
  var SC = W / ((V.lon1 - V.lon0) * K), H = Math.round((V.lat1 - V.lat0) * SC)
  function X (lo) { return (lo - V.lon0) * K * SC } function Y (la) { return (V.lat1 - la) * SC }
  function el (n, a) { var e = document.createElementNS(NS, n); Object.keys(a).forEach(function (k) { e.setAttribute(k, String(a[k])) }); return e } // own keys only: a polluted Object.prototype adds nothing (1.0.1, security@'s low 1)
  function okHref (h) { try { var u = new URL(h, location.href); return u.protocol === 'https:' && !u.username && !u.password && !u.port && (u.hostname === 'promptugal.news' || /\\.promptugal\\.news$/.test(u.hostname)) ? u.href : null } catch (e) { return null } }
  function str (s, n) { return String(s == null ? '' : s).slice(0, n || 80) }
  function link (child, href, title) { var h = okHref(href); if (!h) return child; var a = el('a', { href: h }); var t = el('title', {}); t.textContent = str(title); a.appendChild(t); a.appendChild(child); return a }
  function inset (svg, x, y, name, sub, d, href) {
    var g = el('g', { 'class': 'ptm-inset' }); g.appendChild(el('rect', { x: x, y: y, width: 92, height: 40, rx: 4 }))
    g.appendChild(el('circle', { cx: x + 12, cy: y + 20, r: 4 }))
    var t = el('text', { x: x + 22, y: y + 17, 'class': 'ptm-in-n' }); t.textContent = name; g.appendChild(t)
    var s = el('text', { x: x + 22, y: y + 31, 'class': 'ptm-in-s' }); s.textContent = sub; g.appendChild(s)
    svg.appendChild(link(g, href, name + ' · ' + sub)); void d
  }
  function render (host, o) {
    o = o || {}; var places = (o.places || []).slice(0, 400)
    var svg = el('svg', { viewBox: '0 0 ' + (W + 104) + ' ' + H, 'class': 'ptm', role: 'img' })
    var ti = el('title', {}); ti.textContent = str(o.label || 'Map of the places on this site', 120); svg.appendChild(ti)
    ;[['es', 'ptm-es'], ['pt', 'ptm-pt']].forEach(function (c) {
      OUTLINE[c[0]].forEach(function (poly) { svg.appendChild(el('path', { 'class': c[1], d: poly.map(function (r) { return 'M' + r.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1) }).join('L') + 'Z' }).join('') })) })
    })
    places.forEach(function (p) {
      if (!p || !Array.isArray(p.at) || !isFinite(p.at[0]) || !isFinite(p.at[1]) || typeof p.at[0] !== 'number' || typeof p.at[1] !== 'number') return
      var cur = p.id === o.current, n = Math.max(0, Math.min(999, +p.n || 0))
      var c = el('circle', { cx: X(p.at[0]).toFixed(1), cy: Y(p.at[1]).toFixed(1), r: (cur ? 6 : 2.5 + Math.min(4, Math.sqrt(n) / 2)).toFixed(1), 'class': cur ? 'ptm-dot ptm-cur' : 'ptm-dot' })
      svg.appendChild(link(c, p.href, str(p.name) + (n ? ' · ' + n : '')))
      if (cur) { var l = el('text', { x: (X(p.at[0]) + 9).toFixed(1), y: (Y(p.at[1]) + 4).toFixed(1), 'class': 'ptm-cur-l' }); l.textContent = str(p.name, 40); svg.appendChild(l) }
    })
    if (o.london) inset(svg, W + 8, 18, 'London', o.london.n ? str(o.london.n, 12) + ' items' : 'the UK', 0, o.london.href)
    if (o.eu) inset(svg, W + 8, 66, 'Brussels', o.eu.n ? str(o.eu.n, 12) + ' items' : 'the EU', 0, o.eu.href)
    host.textContent = ''; host.appendChild(svg); return svg
  }
  root.PTMap = { version: '${VERSION}', render: render }
})(window)
`
const CSS = `/* ptmap ${VERSION} (designer@PrompTugal.dinis): the shared map's look, brand v2.0. Light and dark. */
.ptm{display:block;width:100%;max-width:520px;height:auto;font-family:'IBM Plex Sans',Arial,sans-serif}
.ptm .ptm-es{fill:#ece7db;stroke:#d8d4cb;stroke-width:1}
.ptm .ptm-pt{fill:#fffdf8;stroke:#121317;stroke-width:1.2}
.ptm .ptm-dot{fill:#006600;stroke:#fffdf8;stroke-width:1.5}
.ptm .ptm-cur{fill:#121317;stroke:#006600;stroke-width:2.5}
.ptm .ptm-cur-l{font:600 12px Newsreader,Georgia,serif;fill:#121317;paint-order:stroke;stroke:#fffdf8;stroke-width:3px}
.ptm .ptm-inset rect{fill:#fffdf8;stroke:#121317;stroke-width:1}
.ptm .ptm-inset circle{fill:#006600}
.ptm .ptm-in-n{font:600 11px 'IBM Plex Sans',Arial,sans-serif;fill:#121317}
.ptm .ptm-in-s{font:400 9.5px 'IBM Plex Mono',monospace;fill:#666860}
.ptm a:focus-visible circle,.ptm a:focus-visible rect{stroke:#121317;stroke-width:3}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .ptm .ptm-es{fill:#1c1d22;stroke:#2c2d33}
:root:not([data-theme=light]) .ptm .ptm-pt{fill:#22232a;stroke:#f6f3ec}
:root:not([data-theme=light]) .ptm .ptm-dot{fill:#6dbb7e;stroke:#22232a}
:root:not([data-theme=light]) .ptm .ptm-cur{fill:#f6f3ec;stroke:#6dbb7e}
:root:not([data-theme=light]) .ptm .ptm-cur-l{fill:#f6f3ec;stroke:#22232a}
:root:not([data-theme=light]) .ptm .ptm-inset rect{fill:#22232a;stroke:#f6f3ec}
:root:not([data-theme=light]) .ptm .ptm-inset circle{fill:#6dbb7e}
:root:not([data-theme=light]) .ptm .ptm-in-n{fill:#f6f3ec}:root:not([data-theme=light]) .ptm .ptm-in-s{fill:#b4b6ad}}
`
const dir = `design/shared-map/v${VERSION}`; mkdirSync(dir, { recursive: true })
const sri = s => 'sha384-' + createHash('sha384').update(s).digest('base64')
writeFileSync(`${dir}/ptmap.js`, JS); writeFileSync(`${dir}/ptmap.css`, CSS)
const manifest = { name: 'ptmap', version: VERSION, by: 'designer@PrompTugal.dinis', spec: 'board/spec-the-shared-map.md',
  files: { 'ptmap.js': sri(JS), 'ptmap.css': sri(CSS) },
  outline: { source: 'Natural Earth 110m via world-atlas', licence: 'public domain (Natural Earth); world-atlas ISC', from: 'assets/portugal/portugal-outline.json' } }
writeFileSync(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n'); console.log(JSON.stringify(manifest.files))

if (process.argv.includes('--shots')) {
  const { chromium } = createRequire(import.meta.url)('playwright')
  const towns = JSON.parse(readFileSync('assets/portugal/next-places.json', 'utf8')).places.slice(0, 18)
  const demo = { places: [...towns.map(t => ({ id: t.id, name: t.name, at: t.at, href: `https://promptugal.news/portugal/${t.id}/`, n: 4 })), { id: 'faro', name: 'Faro', at: [-7.935, 37.019], href: 'https://promptugal.news/algarve/faro/', n: 26 }],
    current: 'faro', london: { href: 'https://travel.promptugal.news/london/' }, eu: { href: 'https://civic.promptugal.news/eu/' }, label: 'Demo: district capitals, Faro selected' }
  const b = await chromium.launch()
  for (const scheme of ['light', 'dark']) for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 700 }, colorScheme: scheme }); const p = await ctx.newPage()
    await p.route('http://localhost:8765/__map', r => r.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><style>@font-face{font-family:Newsreader;src:url(/assets/fonts/newsreader-variable.woff2)}@font-face{font-family:'IBM Plex Sans';src:url(/assets/fonts/plex-sans-variable.woff2)}@font-face{font-family:'IBM Plex Mono';src:url(/assets/fonts/plex-mono-400.woff2)}body{margin:0;padding:20px 16px;background:${scheme === 'dark' ? '#121317' : '#f6f3ec'};color:${scheme === 'dark' ? '#f6f3ec' : '#121317'};font-family:'IBM Plex Sans'}h2{font:600 20px Newsreader;margin:0 0 10px}${CSS}</style><h2>Where this site reports</h2><div id=m></div><script>${JS}</script><script>PTMap.render(document.getElementById('m'),${JSON.stringify(demo)})</script>` }))
    await p.goto('http://localhost:8765/__map', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200)
    mkdirSync('design/decisions/shared-map', { recursive: true })
    await p.screenshot({ path: `design/decisions/shared-map/${tag}-${scheme}.png`, fullPage: true }); await ctx.close()
  }
  await b.close(); console.log('shots done')
}
