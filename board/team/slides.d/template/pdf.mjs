#!/usr/bin/env node
// pdf.mjs: render a deck made from deck.html.tpl to a PDF, one 1600x900 page per slide, every step shown.
//   node board/team/slides.d/template/pdf.mjs <deck.html> <out.pdf> [--notes] [--png <dir>]
// --notes prints each slide's notes under it; --png also writes one PNG per slide (for review, a Slides artifact or a thumbnail).
// Uses the Playwright and Chromium already in the cloud container (require('playwright')). slides.d (account-d).
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const [src, out, ...rest] = process.argv.slice(2)
if (!src || !out) { console.error('usage: pdf.mjs <deck.html> <out.pdf> [--notes] [--png <dir>]'); process.exit(2) }
const notes = rest.includes('--notes'), pngAt = rest.indexOf('--png'), pngDir = pngAt >= 0 ? rest[pngAt + 1] : null
const url = (/^https?:/.test(src) ? src : pathToFileURL(resolve(src)).href) + (notes ? '?notes' : '')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts && document.fonts.ready)
const n = await page.locator('.slide').count()
if (pngDir) {
  mkdirSync(pngDir, { recursive: true })
  for (let k = 1; k <= n; k++) {
    await page.evaluate(k => { location.hash = '#/' + k; document.querySelectorAll('.slide.active .step').forEach(e => e.classList.add('on')) }, k)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${pngDir}/slide-${String(k).padStart(2, '0')}.png` })
  }
}
await page.emulateMedia({ media: 'print' })
await page.pdf({ path: out, width: '1600px', height: '900px', printBackground: true, preferCSSPageSize: !notes })
await browser.close()
const pages = (readFileSync(out, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
if (!notes && pages !== n) { console.error(`pdf.mjs: ${pages} PDF pages for ${n} slides: a slide spills onto two pages (the investor decks' blank-page lesson)`); process.exit(1) }
console.log(`pdf.mjs: ${n} slides -> ${out}${pngDir ? ` and ${n} PNGs in ${pngDir}` : ''}`)
