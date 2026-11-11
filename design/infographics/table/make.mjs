// A table infographic drawn straight from an article's own markdown table: no AI, so every number is the article's.
// designer@PrompTugal.dinis, 7 November 2026 (WS-177). Made for WK1 after an AI draft got most of its numbers wrong.
//
//   node design/infographics/table/make.mjs --article <slug> --heading "<the table's ## heading>" \
//        [--label <column name for the row label>] [--per-column (shade each column by its own maximum)] [--cols "Mon 9,Tue 10,..."] [--note "<one line>"] [--out DIR]
//
// Writes DIR/<slug>--table.png (1376 x 768, the AI images' size, so the same fit makes thumb and card). Numeric cells are
// shaded by value (brand green, deeper for more); 0 is left pale; a cell the article set in bold keeps its bold and goes red.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const slug = arg('article'), heading = arg('heading')
if (!slug || !heading) { console.error('usage: --article <slug> --heading "<## heading>"'); process.exit(2) }
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'pt-table'))); fs.mkdirSync(OUT, { recursive: true })
const md = fs.readFileSync(path.join(root, 'content/articles', slug + '.md'), 'utf8')
const title = (md.match(/^title:\s*"?(.*?)"?\s*$/m) || [])[1] || slug
const sec = md.split(/^## /m).find(s => s.startsWith(heading))
if (!sec) { console.error('no heading: ' + heading); process.exit(1) }
const rows = sec.split('\n').filter(l => /^\|/.test(l) && !/^\|[-| :]+\|$/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()))
const head = rows.shift()
const label = arg('label', head[0]), li = head.indexOf(label)
const cols = (arg('cols') ? arg('cols').split(',') : head.filter((h, i) => i !== li && rows.every(r => /^\**[\d,]*\**$/.test(r[i])) && rows.some(r => /\d/.test(r[i])))).map(c => c.trim())
const ci = cols.map(c => head.indexOf(c))
const extra = head.indexOf(arg('extra', 'Where'))
const num = v => +v.replace(/[*,]/g, '')
const max = Math.max(...rows.flatMap(r => ci.map(i => num(r[i]))))
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const colMax = i => Math.max(...rows.map(r => num(r[i]) || 0))
const PER = process.argv.includes('--per-column')
const cell = (v, i) => { const M = PER ? colMax(i) : max; if (!/\d/.test(v)) return '<td class=e>–</td>'; const b = /^\*\*/.test(v), n = num(v); const a = n ? .15 + .75 * n / M : 0
  return `<td class="${b ? 'b' : ''}" style="${b ? '' : n ? `background:rgba(0,102,0,${a.toFixed(2)});color:${a > .5 ? '#f6f3ec' : '#121317'}` : ''}">${n.toLocaleString('en-GB')}</td>` }
const fonts = ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']
for (const f of fonts) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Newsreader;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:Plex;src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:Mono;src:url(plex-mono-400.woff2)}
*{box-sizing:border-box;margin:0}body{width:1376px;height:768px;background:#f6f3ec;color:#121317;font-family:Plex;padding:34px 48px;position:relative}
h1{font:600 38px/1.1 Newsreader;max-width:1100px}.rule{width:84px;height:4px;background:#006600;margin:14px 0 18px}
table{border-collapse:separate;border-spacing:3px;font-size:${rows.length > 12 ? 17 : 20}px}th{font:600 15px Plex;text-align:center;padding:0 10px 4px;color:#3f424a}
th.l,td.l{text-align:left;padding-right:18px}td{text-align:center;min-width:${Math.min(150, Math.floor(700 / cols.length))}px;padding:${rows.length > 12 ? 4 : 7}px 8px;background:#ece7db;font-variant-numeric:tabular-nums}
td.l{background:none;font-weight:600;white-space:nowrap}td.x{background:none;color:#595c64;font:14px Mono;text-align:left;padding-left:14px;max-width:330px}td.e{background:none;color:#9a9c94}td.b{background:#c52830;color:#f6f3ec;font-weight:700}
.foot{position:absolute;left:48px;right:48px;bottom:24px;display:flex;justify-content:space-between;align-items:center;font:13px Mono;color:#595c64}.foot img{width:40px;height:40px}
</style><h1>${esc(title)}</h1><div class=rule></div>
<table><tr><th class=l></th>${cols.map(c => `<th>${esc(c)}</th>`).join('')}${extra >= 0 ? '<th></th>' : ''}</tr>
${rows.map(r => `<tr><td class=l>${esc(r[li])}</td>${ci.map(i => cell(r[i], i)).join('')}${extra >= 0 ? `<td class=x>${esc(r[extra])}</td>` : ''}</tr>`).join('\n')}</table>
<div class=foot><span>${esc(arg('note', 'PrompTugal.news · drawn from the article\'s own table'))}</span><img src=stamp.svg alt=""></div>`
fs.writeFileSync(path.join(OUT, slug + '--table.html'), html)
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1376, height: 768 } })
await p.goto(pathToFileURL(path.join(OUT, slug + '--table.html')).href); await p.evaluate(() => document.fonts.ready)
const over = await p.evaluate(() => document.body.scrollHeight > 768)
await p.screenshot({ path: path.join(OUT, slug + '--table.png') }); await b.close()
console.log(JSON.stringify({ rows: rows.length, cols, max, overflow: over, out: path.join(OUT, slug + '--table.png') }))
