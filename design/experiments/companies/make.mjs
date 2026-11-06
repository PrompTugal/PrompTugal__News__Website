// Experiments for the companies page (pass board/passes/2026-11-06-the-companies-page.md), round 1.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//
//   node design/experiments/companies/make.mjs [--out DIR]   (Playwright, preinstalled; no dependency of the site)
//
// Three layouts of the same 120 companies from data/companies/<id>/company.json, for Dinis to choose:
//   A  Grid by field: a card per company (monogram, name, one line, country), grouped by field, filter chips on top.
//   B  Directory by country: a dense table, one row per company, grouped by country, sticky letter index.
//   C  Search first: one big search box, counts per field as the filter, results as a ranked list with a one-line "why".
// Writes <A|B|C>.html and <A|B|C>--<phone|desktop>.png to DIR (default the OS temp dir), never to git.
// Public data only (what, field, country, attending), no logos yet (they come from a vault), no contact details.
// The brand is used as it is: tokens and faces from assets/, the PT.news stamp unchanged.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const oi = process.argv.indexOf('--out')
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-companies')
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.join(root, p)).href

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const FIELD = { security: 'Security', 'ai-agents': 'AI agents', devtools: 'Developer tools', other: 'Other', grc: 'Risk and compliance', 'portugal-startup': 'Portugal startups', platform: 'Platforms', investor: 'Investors' }
const cos = fs.readdirSync(path.join(root, 'data/companies')).map(id => {
    const f = path.join(root, 'data/companies', id, 'company.json')
    if (!fs.existsSync(f)) return null
    const d = JSON.parse(fs.readFileSync(f, 'utf8'))
    return { id, name: d.name, what: d.what || '', field: d.category || 'other', country: d.country || 'Unknown', as: d.attending_as || '' }
}).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
const short = s => { const t = s.split(/(?<=[.;:])\s/)[0].replace(/[:;,]$/, ''); return t.length > 120 ? t.slice(0, 117).replace(/\s+\S*$/, '') + '…' : t }
const group = (arr, key) => arr.reduce((m, c) => ((m[key(c)] ||= []).push(c), m), {})
// brand accents in turn (ink, the T's red, ugal's green), until logos load from a vault (designer@'s round-2 note)
const acc = n => ['var(--ink)', 'var(--brand-red)', 'var(--brand-green)'][[...n].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 3, 0)]
const mono = c => `<span class="mono" style="--m:${acc(c.name)}" aria-hidden="true">${esc(c.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2))}</span>`
const fieldCounts = Object.entries(group(cos, c => c.field)).sort((a, b) => b[1].length - a[1].length)

const CSS = `
@import url("${U('assets/fonts.css')}"); @import url("${U('assets/tokens.css')}");
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)}
.wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0;display:flex;justify-content:space-between;align-items:center;gap:12px}
.bar b{font:700 20px var(--serif)} .bar small{font:12px var(--mono);color:var(--ink-3)}
h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:20px 0 6px} .dek{color:var(--ink-2);margin:0 0 16px;max-width:44em}
.tag{font:11px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 20px}
.chip{border:1px solid var(--rule-2);border-radius:999px;padding:5px 12px;font-size:14px;background:var(--panel);white-space:nowrap}
.chip b{font-family:var(--mono);font-weight:500;color:var(--ink-3);margin-left:6px;font-size:12px}
.chip.on{background:var(--brand);color:#fff;border-color:var(--brand)} .chip.on b{color:#dbe4f7}
h2{font:600 22px var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:28px 0 12px;display:flex;justify-content:space-between}
h2 small{font:12px var(--mono);color:var(--ink-3);align-self:center}
.mono{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:3px;font:600 13px var(--mono);color:var(--paper);background:var(--m);flex:none}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:12px;display:flex;gap:10px}
.card h3{font:600 17px/1.2 var(--serif);margin:0 0 2px} .card p{margin:0;font-size:14px;color:var(--ink-2)}
.card em{display:block;margin-top:6px;font:11px var(--mono);color:var(--ink-3);font-style:normal}
table{width:100%;border-collapse:collapse;font-size:15px} td{padding:8px 6px;border-bottom:1px solid var(--hair);vertical-align:top}
td.n{font:600 16px var(--serif);white-space:nowrap} td.f{font:12px var(--mono);color:var(--ink-3);white-space:nowrap}
.idx{display:flex;flex-wrap:wrap;gap:2px;font:12px var(--mono);margin-bottom:8px} .idx span{padding:2px 6px;border:1px solid var(--hair)}
.search{display:flex;gap:8px;margin:16px 0} .search div{flex:1;border:2px solid var(--ink);background:var(--panel);padding:14px 16px;font-size:20px;color:var(--ink-3);border-radius:3px}
.search button{border:0;background:var(--brand);color:#fff;padding:0 22px;font:600 16px var(--sans);border-radius:3px}
.hint{font-size:14px;color:var(--ink-3)} ol.rank{list-style:none;padding:0;margin:0} ol.rank li{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)}
ol.rank h3{font:600 18px var(--serif);margin:0} ol.rank p{margin:2px 0 0;color:var(--ink-2);font-size:15px}
.sw{display:flex;gap:6px;margin:8px 0;font:12px var(--mono)} .sw span{padding:3px 10px;border:1px solid var(--rule-2)} .sw .on{background:var(--ink);color:var(--paper)}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
@media(max-width:600px){td.f.c{display:none}.chips{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}}
`
const head = (v, title, dek) => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Experiment ${v}: ${title}</title><style>${CSS}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b><small>EXPERIMENT ${v} · ${esc(title)}</small></div>
<div class=sw>${['A', 'B', 'C'].map(x => `<span class="${x === v ? 'on' : ''}">${x}</span>`).join('')}<span>the same ${cos.length} companies, three views</span></div>
<span class=tag>Companies at Web Summit Lisbon, 9 to 12 November 2026</span><h1>${cos.length} companies, one click from their page</h1><p class=dek>${dek}</p>`
const foot = `<p class=note>Experiment mock-up, not on the site. Data: data/companies/ (public facts, each with its source on the company's page). No logos yet: they will load from a vault; the monogram is a placeholder.</p></div>`

const A = () => {
    const g = group(cos, c => c.field)
    return head('A', 'Grid by field', 'Pick a field, or scroll: every company is a card with what it does in one line.') +
        `<div class=chips><span class="chip on">All<b>${cos.length}</b></span>${fieldCounts.map(([k, v]) => `<span class=chip>${FIELD[k] || k}<b>${v.length}</b></span>`).join('')}</div>` +
        fieldCounts.slice(0, 4).map(([k, v]) => `<h2>${FIELD[k] || k}<small>${v.length} companies</small></h2><div class=grid>${v.slice(0, 8).map(c => `<div class=card>${mono(c)}<div><h3>${esc(c.name)}</h3><p>${esc(short(c.what))}</p><em>${esc(c.country)}${c.as ? ' · ' + esc(c.as) : ''}</em></div></div>`).join('')}</div>`).join('') + foot
}
const B = () => {
    const g = Object.entries(group(cos, c => c.country)).sort((a, b) => b[1].length - a[1].length)
    const letters = [...new Set(cos.map(c => c.name[0].toUpperCase()))]
    return head('B', 'Directory by country', 'The dense view for people who know what they are looking for: one row each, grouped by where the company is from.') +
        `<div class=idx>${letters.map(l => `<span>${l}</span>`).join('')}</div>` +
        g.slice(0, 5).map(([k, v]) => `<h2>${esc(k)}<small>${v.length}</small></h2><table>${v.slice(0, 9).map(c => `<tr><td class=n>${esc(c.name)}</td><td>${esc(short(c.what))}</td><td class="f c">${FIELD[c.field] || c.field}</td></tr>`).join('')}</table>`).join('') + foot
}
const C = () => {
    const q = cos.filter(c => c.field === 'security').slice(0, 10)
    return head('C', 'Search first', 'Start from a question, not a list. The fields below are the filters; the answer is a short ranked list.') +
        `<div class=search><div>identity security for AI agents</div><button>Search</button></div><div class=chips>${fieldCounts.map(([k, v]) => `<span class="chip ${k === 'security' ? 'on' : ''}">${FIELD[k] || k}<b>${v.length}</b></span>`).join('')}</div>` +
        `<p class=hint>${q.length} of ${cos.length} shown · sorted by how well the company matches</p><ol class=rank>${q.map(c => `<li>${mono(c)}<div><h3>${esc(c.name)} <span class=tag>${esc(c.country)}</span></h3><p>${esc(short(c.what))}</p></div></li>`).join('')}</ol>` + foot
}

const browser = await chromium.launch()
const sizes = { phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } }
for (const [v, fn] of Object.entries({ A, B, C })) {
    const f = path.join(OUT, v + '.html'); fs.writeFileSync(f, fn())
    for (const [s, vp] of Object.entries(sizes)) {
        const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage()
        await p.goto(pathToFileURL(f).href); await p.waitForTimeout(300)
        await p.screenshot({ path: path.join(OUT, `${v}--${s}.png`), fullPage: false }); await ctx.close()
    }
}
await browser.close(); console.log('written to', OUT)
