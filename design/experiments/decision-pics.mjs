// Decision pictures: every variation of every experiment as a small framed JPEG, for designer@ to put in a decision page
// (board/guidance/2026-11-06-decisions-as-pages.md). designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/decision-pics.mjs [--out DIR]   (runs the experiment tools, then re-shoots their pages)
// Desktop 1200 px wide, phone 600 px wide, JPEG quality 72, a 2 px ink frame, the first screen of each variation (no scrolling).
// Pictures go to DIR (default the OS temp dir), never to git: they belong in the designer's vault.
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const here = path.dirname(fileURLToPath(import.meta.url))
const oi = process.argv.indexOf('--out')
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-decision-pics')
const WORK = path.join(OUT, 'pages'); fs.mkdirSync(WORK, { recursive: true })
for (const t of ['companies/make', 'articles/make', 'days/make']) execFileSync('node', [path.join(here, t + '.mjs'), '--out', path.join(WORK, t.split('/')[0])], { stdio: 'ignore' })
for (const t of ['companies/switch', 'articles/switch', 'people/switch']) execFileSync('node', [path.join(here, t + '.mjs'), '--out', path.join(WORK, t.replace('/', '-'))], { stdio: 'ignore' })
// [label, html file, hash to open (for the switch pages)]
const jobs = []
for (const p of ['companies', 'articles', 'days']) for (const v of ['A', 'B', 'C']) jobs.push([`${p}--${v}`, path.join(WORK, p, v + '.html'), ''])
const sw = { 'companies-switch': ['grid', 'directory', 'search'], 'articles-switch': ['day', 'wire', 'topic'], 'people-switch': ['org', 'session', 'az'] }
for (const [d, vs] of Object.entries(sw)) for (const v of vs) jobs.push([`${d}--${v}`, path.join(WORK, d, 'switch.html'), '#v=' + v])
const sizes = { desktop: { width: 1200, height: 800 }, phone: { width: 600, height: 900 } }
const browser = await chromium.launch(); const made = []
for (const [label, file, hash] of jobs) for (const [s, vp] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 }); const p = await ctx.newPage()
    await p.goto(pathToFileURL(file).href + hash); await p.waitForTimeout(300)
    await p.addStyleTag({ content: 'html{box-shadow:inset 0 0 0 2px #121317}' })
    const out = path.join(OUT, `${label}--${s}.jpg`)
    await p.screenshot({ path: out, type: 'jpeg', quality: 72 }); made.push([path.basename(out), fs.statSync(out).size]); await ctx.close()
}
await browser.close()
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(made.map(([f, b]) => ({ file: f, bytes: b })), null, 1))
console.log(made.length, 'pictures,', Math.round(made.reduce((a, [, b]) => a + b, 0) / 1024), 'KB, in', OUT)
