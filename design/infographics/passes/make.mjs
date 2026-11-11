// The cover for "Web Summit's nineteen passes": the article's own colour samples (writer@PrompTugal.angelo's, read from
// Web Summit's app) in a grid, each with its pass name as the article writes it. No AI. designer@PrompTugal.dinis, 11 Nov 2026.
//   node design/infographics/passes/make.mjs [--out DIR] -> DIR/web-summit-passes-and-colours--grid.png (1376 x 768)
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-passes')
fs.mkdirSync(OUT, { recursive: true })
const slug = 'web-summit-passes-and-colours'
const md = fs.readFileSync(path.join(root, 'content/articles', slug + '.md'), 'utf8')
const title = md.match(/^title:\s*"(.*)"/m)[1]
const rows = md.split('\n').filter(l => /^\| [A-Z]/.test(l) && /img\/passes\//.test(l)).map(l => { const c = l.split('|').map(s => s.trim()); return { name: c[1].replace(/\s*\(.*\)/, ''), file: c[2].match(/passes\/([a-z-]+\.png)/)[1] } })
if (rows.length !== 19) throw new Error('expected 19 passes, found ' + rows.length)
for (const r of rows) fs.copyFileSync(path.join(root, 'desks/writer-angelo/img/passes', r.file), path.join(OUT, r.file))
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const html = `<!doctype html><meta charset=utf-8><style>@font-face{font-family:N;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:P;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:M;src:url(plex-mono-400.woff2)}
*{box-sizing:border-box;margin:0}body{width:1376px;height:768px;background:#f6f3ec;color:#121317;font-family:P;padding:34px 48px;position:relative}
h1{font:600 40px/1.1 N}.rule{width:84px;height:4px;background:#006600;margin:14px 0 22px}
.g{display:grid;grid-template-columns:repeat(4,1fr);gap:18px 22px}.p{display:flex;flex-direction:column;gap:5px}.p img{width:100%;height:68px;object-fit:cover;border-radius:6px;display:block}.p span{font:600 13px P;letter-spacing:.06em}
.foot{position:absolute;left:48px;right:48px;bottom:24px;display:flex;justify-content:space-between;align-items:center;font:13px M;color:#595c64}.foot img{width:40px}</style>
<h1>${esc(title)}</h1><div class=rule></div><div class=g>${rows.map(r => `<div class=p><img src="${r.file}" alt=""><span>${esc(r.name)}</span></div>`).join('')}</div>
<div class=foot><span>PrompTugal.news · the colours as Web Summit's app draws each pass · from the article's own samples</span><img src=stamp.svg alt=""></div>`
fs.writeFileSync(path.join(OUT, slug + '--grid.html'), html)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1376, height: 768 } })
await p.goto(pathToFileURL(path.join(OUT, slug + '--grid.html')).href); await p.evaluate(() => document.fonts.ready)
const over = await p.evaluate(() => document.body.scrollHeight > 768); await p.screenshot({ path: path.join(OUT, slug + '--grid.png') }); await b.close()
console.log(JSON.stringify({ passes: rows.length, overflow: over }))
