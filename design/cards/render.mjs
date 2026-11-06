// The PrompTugal.news cards (generic, proof 2), from the SVG masters (make_cards.py) to what the shop asks for (the team site's /cards/print/):
// a PDF per variant (91 x 61 mm with 3 mm bleed, page 1 the front, page 2 the back) and a PNG per side
// (300 dpi, trimmed to 85 x 55 mm, no bleed), plus one overview of the three. Chromium via Playwright, a design tool
// (not the site's build): node design/cards/render.mjs
import { createRequire } from 'node:module'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, 'generic')
const editors = readdirSync(out).sort().map(id => ({ id, name: id }))
const PX = 300 / 25.4 // 300 dpi
const browser = await chromium.launch()
const page = await browser.newPage()

const sheet = (svgs, bleed) => `<!doctype html><meta charset="utf-8"><style>
  @page { size: 91mm 61mm; margin: 0 } html, body { margin: 0 } body { background: #fff }
  .p { width: 91mm; height: 61mm; overflow: hidden; break-after: page } .p:last-child { break-after: auto }
  .p svg { display: block; width: 91mm; height: 61mm } </style>${svgs.map(s => `<div class="p">${s}</div>`).join('')}`

for (const ed of editors) {
  const dir = join(out, ed.id)
  const sides = ['front', 'back'].map(s => readFileSync(join(dir, `card-${s}.svg`), 'utf8'))
  await page.setContent(sheet(sides))
  writeFileSync(join(dir, 'card.pdf'), await page.pdf({ width: '91mm', height: '61mm', printBackground: true, preferCSSPageSize: true }))
  for (const [i, s] of ['front', 'back'].entries()) {
    // trimmed: the viewBox cut to the 85 x 55 mm trim, drawn at 300 dpi
    const trimmed = sides[i].replace(/width="91.0mm" height="61.0mm" viewBox="[^"]+"/, 'width="85mm" height="55mm" viewBox="0 0 85 55"')
    await page.setViewportSize({ width: Math.round(85 * PX), height: Math.round(55 * PX) })
    await page.setContent(`<!doctype html><style>html,body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${trimmed}`)
    writeFileSync(join(dir, `card-${s}.png`), await page.screenshot({ type: 'png' }))
  }
}

// the overview: each editor's front and back at real proportions, trimmed, with the trim and safe area marked on the first
const items = [...editors.map(ed => [`generic/${ed.id}/card-front.png`, `${ed.id}, front`]), [`generic/${editors[0].id}/card-back.png`, 'the back (the same for every front)']]
await page.setViewportSize({ width: 1400, height: 400 })
const html = `<!doctype html><meta charset="utf-8"><base href="file://${here}/"><style>
  body { margin: 32px; background: #e9e6df; font: 13px 'IBM Plex Mono', monospace; color: #121317 }
  .g { display: grid; grid-template-columns: repeat(2, 640px); gap: 28px 40px }
  figure { margin: 0 } img { width: 640px; display: block; box-shadow: 0 0 0 1px #c9c4b8, 0 2px 10px rgba(0,0,0,.12) } figcaption { margin-top: 8px }</style>
  <div class="g">${items.map(([src, cap]) => `<figure><img src="${src}"><figcaption>${cap}</figcaption></figure>`).join('')}</div>`
writeFileSync(join(here, '.overview.tmp.html'), html)
await page.goto('file://' + join(here, '.overview.tmp.html'))
await page.screenshot({ path: join(here, 'overview.png'), fullPage: true })
const { unlinkSync } = await import('node:fs'); unlinkSync(join(here, '.overview.tmp.html'))
await browser.close()
console.log('rendered', editors.map(e => e.id).join(', '))
