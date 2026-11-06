// PrompTugal.news article infographics (brand identity v2.0). designer@PrompTugal.dinis, 6 November 2026 (WS-177).
// Two styles (paper, the default; ink, the brand's dark side), three layouts chosen by what a story is about, three sizes for every article:
//   layouts  figure    a story about numbers: the number large, what it counts, the points
//            network   a story about who is involved: the story at the centre, its entities around it
//            timeline  a story about when and where: the dated items on a rail
//   sizes    thumb     480 x 480     lists (the front page's Latest, the articles index)
//            card      1200 x 630    the front page's lead and the social card (og:image)
//            banner    1600 x 560    the top of the article page
// Every word comes from the article (articles.json: extracted from content/articles/, each item with its quote);
// nothing is invented. A design tool, not the site's build: Chromium via Playwright.
//   node design/infographics/make.mjs [--all-layouts] [--out DIR] [--only slug,slug]
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const ALL = process.argv.includes('--all-layouts')
const OUT = path.resolve(arg('--out', path.join(here, 'out')))
const ONLY = arg('--only', '') ? arg('--only').split(',') : null
const data = JSON.parse(fs.readFileSync(path.join(here, 'articles.json'), 'utf8'))
const SIZES = { thumb: [480, 480], card: [1200, 630], banner: [1600, 560] }
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const F = 'file://' + path.join(root, 'assets/fonts')
const STAMP = t => 'file://' + path.join(root, `assets/brand/pt-news-stamp-${t === 'ink' ? 'dark' : 'light'}.svg`)
const THEMES = ['paper', 'ink']
const C = { paper: { paper: '#f6f3ec', ink: '#121317', mid: '#9d9580', hair: '#d9d2c1', red: '#c52830', green: '#006600' }, ink: { paper: '#121317', ink: '#f6f3ec', mid: '#6b6d66', hair: '#34353a', red: '#f07278', green: '#6dbb7e' } }
const DAY = d => { const [y, m, dd] = (d || '').split('-').map(Number); return y ? `${dd} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}` : '' }

// brand v2.0 (design/brand/README.txt): paper, ink, red for the T alone, green for "ugal", rules and selected things
const CSS = `
@font-face { font-family: Newsreader; src: url(${F}/newsreader-variable.woff2) format('woff2'); font-weight: 200 800; }
@font-face { font-family: Newsreader; src: url(${F}/newsreader-400-italic.woff2) format('woff2'); font-style: italic; }
@font-face { font-family: 'IBM Plex Sans'; src: url(${F}/plex-sans-variable.woff2) format('woff2'); font-weight: 100 700; }
@font-face { font-family: 'IBM Plex Mono'; src: url(${F}/plex-mono-400.woff2) format('woff2'); }
:root { --paper: #f6f3ec; --paper-2: #ece7db; --ink: #121317; --ink-2: #3f424a; --ink-3: #595c64; --hair: #d9d2c1; --red: #c52830; --green: #006600; }
.ink { --paper: #121317; --paper-2: #1c1d22; --ink: #f6f3ec; --ink-2: #d6d3cb; --ink-3: #b4b6ad; --hair: #34353a; --red: #f07278; --green: #6dbb7e; }
:root {
  --serif: Newsreader, Georgia, serif; --sans: 'IBM Plex Sans', Arial, sans-serif; --mono: 'IBM Plex Mono', monospace; }
* { box-sizing: border-box; margin: 0; padding: 0 }
html, body { width: var(--w); height: var(--h); overflow: hidden } body { background: var(--paper); color: var(--ink) }
.frame { position: absolute; inset: 0; padding: var(--p); display: flex; flex-direction: column; gap: calc(var(--u) * 2) }
.top { display: flex; justify-content: space-between; align-items: baseline; font: 400 calc(var(--u) * 1.5)/1.2 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); border-bottom: 1px solid var(--hair); padding-bottom: var(--u) }
.top b { font-weight: 400; color: var(--green) }
.body { flex: 1; min-height: 0; display: grid; gap: calc(var(--u) * 4) }
.title { font: 600 var(--ts)/1.06 var(--serif); letter-spacing: -.01em; text-wrap: balance }
.fig { font: 600 var(--fs)/0.9 var(--serif); letter-spacing: -.02em; white-space: nowrap }
.fig-label { font: 400 calc(var(--u) * 1.8)/1.3 var(--mono); text-transform: uppercase; letter-spacing: .06em; color: var(--ink-2); margin-top: calc(var(--u) * 1.2); max-width: 22ch }
.rule { width: calc(var(--u) * 8); height: calc(var(--u) * .5); background: var(--green); margin: calc(var(--u) * 1.6) 0 }
ul.pts { list-style: none; display: grid; gap: calc(var(--u) * 1.1) }
ul.pts li { font: 400 calc(var(--u) * 1.95)/1.28 var(--sans); padding-left: calc(var(--u) * 2.2); position: relative; color: var(--ink) }
ul.pts li::before { content: ""; position: absolute; left: 0; top: .48em; width: calc(var(--u) * .8); height: calc(var(--u) * .8); background: var(--green) }
.foot { display: flex; justify-content: space-between; align-items: flex-end; font: 400 calc(var(--u) * 1.4)/1.2 var(--mono); color: var(--ink-3); letter-spacing: .04em }
.foot img { height: calc(var(--u) * 5.5); display: block }
.rail { position: relative; display: grid; align-content: start; align-self: start; gap: calc(var(--u) * 1.3); padding-left: calc(var(--u) * 3) }
.rail::before { content: ""; position: absolute; left: calc(var(--u) * .7); top: .5em; bottom: .5em; width: 2px; background: var(--hair) }
.rail div { position: relative; display: grid; grid-template-columns: calc(var(--u) * 15) 1fr; gap: calc(var(--u) * 1.5); align-items: baseline }
.rail div::before { content: ""; position: absolute; left: calc(var(--u) * -3 + var(--u) * .25); top: .45em; width: calc(var(--u) * 1.1); height: calc(var(--u) * 1.1); border-radius: 50%; background: var(--paper); border: 2px solid var(--green) }
.rail .w { font: 400 calc(var(--u) * 1.7)/1.3 var(--mono); color: var(--green) }
.rail .t { font: 600 calc(var(--u) * 2)/1.22 var(--serif) }
.rail .w { white-space: normal }
svg text { font-family: var(--mono) }
`

// the network: the story at the centre, its entities on a ring, each a type's shape (deterministic, no randomness)
const TYPE = { company: 'sq', organisation: 'ring', person: 'dot', place: 'tri', event: 'dia', topic: 'ring' }
function network(a, w, h, opt = {}) {
    const k0 = C[opt.theme || 'paper']
    const ents = (a.entities || []).slice(0, opt.max || 8)
    const fsz = Math.max(13, Math.min(w, h) * .036), r = Math.min(w, h) * .04
    // the ring's radius leaves room for the longest label on either side, so no name is cut at the edge
    const longest = Math.max(0, ...ents.map(e => Math.min(e.name.length, 17))) * fsz * .64
    const cx = w / 2, cy = h / 2, R = opt.labels === false ? Math.min(w, h) * .38 : Math.max(Math.min(w, h) * .2, Math.min(h * .34, w / 2 - longest / 2 - 8))
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
    const pts = ents.map((e, i) => { const t = -Math.PI / 2 + i * 2 * Math.PI / ents.length; return { e, x: cx + R * Math.cos(t), y: cy + R * Math.sin(t), t } })
    for (const p of pts) s += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${k0.mid}" stroke-width="1.5"/>`
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; if (pts.length > 2) s += `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${k0.hair}" stroke-width="1"/>` }
    s += `<circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="${k0.ink}"/><circle cx="${cx}" cy="${cy}" r="${r * 1.5 + 6}" fill="none" stroke="${k0.green}" stroke-width="2.5"/>`
    for (const [i, p] of pts.entries()) {
        const k = TYPE[p.e.type] || 'dot', g = k0.green, ink = k0.ink
        if (k === 'sq') s += `<rect x="${p.x - r}" y="${p.y - r}" width="${2 * r}" height="${2 * r}" fill="${g}"/>`
        else if (k === 'ring') s += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${k0.paper}" stroke="${ink}" stroke-width="2.5"/>`
        else if (k === 'tri') s += `<path d="M${p.x} ${p.y - r * 1.15}L${p.x + r} ${p.y + r * .75}L${p.x - r} ${p.y + r * .75}Z" fill="${k0.red}"/>`
        else if (k === 'dia') s += `<path d="M${p.x} ${p.y - r * 1.2}L${p.x + r * 1.2} ${p.y}L${p.x} ${p.y + r * 1.2}L${p.x - r * 1.2} ${p.y}Z" fill="${k0.paper}" stroke="${g}" stroke-width="2.5"/>`
        else s += `<circle cx="${p.x}" cy="${p.y}" r="${r * .85}" fill="${ink}"/>`
        if (opt.labels !== false) {
            // every label centred on its node: under it, or above it for the nodes on the top half's crest
            const anchor = 'middle', lx = p.x, ly = Math.sin(p.t) < -.7 ? p.y - r * 1.5 : p.y + r * 1.5 + fsz * .85 + (Math.sin(p.t) > .5 && i % 2 ? fsz * 1.05 : 0)
            const name = p.e.name.length > 17 ? p.e.name.slice(0, 16) + '…' : p.e.name
            s += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="${fsz}" fill="${ink}">${esc(name)}</text>`
        }
    }
    return s + '</svg>'
}

function figureSize(v, width, max) { const n = Math.max(String(v).length, 2); return Math.min(max, width * 1.45 / (n + (/%/.test(v) ? .6 : 0))) }

function page(a, layout, size, theme = 'paper') {
    const [w, h] = SIZES[size], u = Math.round(Math.min(w, h) / 48), p = Math.round(Math.min(w, h) * .075)
    const vars = `--w:${w}px;--h:${h}px;--u:${u}px;--p:${p}px;`
    const beat = String(a.beat || '').replace(/\s*\(.*\)\s*$/, '')
    const top = `<div class="top"><span><b>PrompTugal.news</b> · ${esc(beat)}</span>${size === 'thumb' ? '' : `<span>${esc(DAY(a.date))}</span>`}</div>`
    const LEGEND = '■ company  ○ organisation  ● person  ▲ place  ◇ event'
    const foot = `<div class="foot"><span>${layout === 'network' ? `<span style="color:var(--green)">${LEGEND}</span><br>` : ''}promptugal.news · every fact sourced</span><img src="${STAMP(theme)}" alt=""></div>`
    const fig = a.figure || { value: (a.schedule || []).length || (a.entities || []).length, label: (a.schedule || []).length ? 'dated items' : 'organisations and people' }
    const pts = (a.points || []).slice(0, size === 'card' ? 3 : 4).map(x => `<li>${esc(x.text)}</li>`).join('')
    const rail = n => (a.schedule || []).slice(0, n).map(x => `<div><span class="w">${esc(x.when)}</span><span class="t">${esc(x.what)}</span></div>`).join('')
    let body
    if (size === 'thumb') {
        const ts = u * 3.6
        if (layout === 'network') body = `<div class="body" style="grid-template-rows:auto 1fr;gap:${u}px"><div class="title" style="--ts:${ts}px">${esc(a.short_title)}</div><div>${network(a, w - 2 * p, h - 2 * p - ts * 2.6 - u * 4, { labels: false, max: 8, theme })}</div></div>`
        else if (layout === 'timeline' && (a.schedule || []).length) body = `<div class="body" style="grid-template-rows:auto 1fr;gap:${u * 2}px"><div class="title" style="--ts:${ts}px">${esc(a.short_title)}</div><div class="rail" style="--u:${u * .9}px">${rail(3)}</div></div>`
        else body = `<div class="body" style="grid-template-rows:1fr auto;gap:${u}px"><div style="align-self:end"><div class="fig" style="--fs:${figureSize(fig.value, w - 2 * p, h * .34)}px">${esc(fig.value)}</div><div class="fig-label">${esc(fig.label)}</div></div><div><div class="rule"></div><div class="title" style="--ts:${ts}px">${esc(a.short_title)}</div></div></div>`
        return wrap(vars, `${top}${body}`, theme)
    }
    const ts = (size === 'banner' ? u * 5.4 : u * 4.6) * ((a.short_title || '').length > 22 ? .82 : 1)
    const left = `<div style="display:flex;flex-direction:column;gap:${u * 1.6}px;min-width:0"><div class="title" style="--ts:${ts}px">${esc(a.short_title)}</div><div class="rule" style="margin:${u * .4}px 0"></div><ul class="pts">${pts}</ul></div>`
    if (layout === 'network') {
        const gw = Math.round((w - 2 * p) * (size === 'banner' ? .52 : .5)), gh = h - 2 * p - u * 10
        body = `<div class="body" style="grid-template-columns:1fr ${gw}px;align-items:center">${left}<div>${network(a, gw, gh, { theme })}</div></div>`
    } else if (layout === 'timeline' && (a.schedule || []).length) {
        body = `<div class="body" style="grid-template-columns:${size === 'banner' ? '0.9fr 1.1fr' : '1fr 1fr'};align-items:center"><div style="display:flex;flex-direction:column;gap:${u * 1.6}px"><div class="title" style="--ts:${ts}px">${esc(a.short_title)}</div><div class="rule" style="margin:${u * .4}px 0"></div><div class="fig-label" style="max-width:none">${esc(fig.value)} ${esc(fig.label)}</div></div><div class="rail">${rail(size === 'banner' ? 5 : 4)}</div></div>`
    } else {
        const fw = (w - 2 * p) * .42
        body = `<div class="body" style="grid-template-columns:1fr ${Math.round(fw)}px;align-items:center">${left}<div><div class="fig" style="--fs:${figureSize(fig.value, fw, h * .42)}px">${esc(fig.value)}</div><div class="fig-label">${esc(fig.label)}</div></div></div>`
    }
    return wrap(vars, `${top}${body}${foot}`, theme)
}
const wrap = (vars, inner, theme) => `<!doctype html><meta charset="utf-8"><style>${CSS}</style><body class="${theme}" style="${vars}"><div class="frame">${inner}</div></body>`

const pick = a => a.kind === 'schedule' && (a.schedule || []).length ? 'timeline' : a.kind === 'network' ? 'network' : 'figure'
const browser = await chromium.launch()
const pg = await browser.newPage()
const tmp = path.join(OUT, '.tmp.html')
fs.mkdirSync(OUT, { recursive: true })
const index = []
for (const a of data.articles) {
    if (ONLY && !ONLY.includes(a.slug)) continue
    const layouts = ALL ? ['figure', 'network', 'timeline'].filter(l => l !== 'timeline' || (a.schedule || []).length) : [pick(a)]
    for (const theme of THEMES) for (const layout of layouts) for (const [size, [w, h]] of Object.entries(SIZES)) {
        fs.writeFileSync(tmp, page(a, layout, size, theme))
        await pg.setViewportSize({ width: w, height: h })
        await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready)
        const name = ALL ? `${a.slug}--${theme}--${layout}--${size}.png` : `${a.slug}--${theme}--${size}.png`
        await pg.screenshot({ path: path.join(OUT, name) })
        index.push({ slug: a.slug, theme, layout, size, file: name, auto: layout === pick(a) })
    }
}
fs.unlinkSync(tmp)
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ made: new Date().toISOString(), by: 'designer@PrompTugal.dinis', sizes: SIZES, images: index }, null, 2) + '\n')
await browser.close()
console.log(`${index.length} images in ${path.relative(root, OUT)}`)
