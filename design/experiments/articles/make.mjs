// Experiments for the articles page (pass board/passes/2026-11-06-the-articles-page.md), round 1.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/articles/make.mjs [--out DIR]   (Playwright, preinstalled)
// Three layouts of every published article (content/articles/*.md, status published) with its image from design/infographics/out/:
//   A  By day: a day band, a lead with its banner, then image cards in a wide grid, a beat label on each.
//   B  The wire: newsroom.sgit.ai's sequential list (time, thumb, hed, dek) with a right-hand "linked by" rail from the tags.
//   C  By topic: tag rails side by side (the graph made visible as columns); an article shows under each of its tags.
// Writes <A|B|C>.html and <A|B|C>--<phone|desktop>.png to DIR (default the OS temp dir), never to git. Public data only.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-articles')
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.join(root, p)).href
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const arts = fs.readdirSync(path.join(root, 'content/articles')).filter(f => f.endsWith('.md')).map(f => {
    const t = fs.readFileSync(path.join(root, 'content/articles', f), 'utf8'); const fm = t.split('---')[1] || ''
    const get = k => { const m = fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')); return m ? m[1].replace(/^"|"$/g, '').trim() : '' }
    const slug = f.replace(/\.md$/, '')
    return { slug, author: get('author'), title: get('title'), date: get('date'), summary: get('summary'), status: get('status'), beat: (get('beat') || 'News').replace(/\s*\(.*$/, ''), tags: get('tags').split(',').map(s => s.trim()).filter(Boolean) }
}).filter(a => a.status === 'published' && fs.existsSync(path.join(root, `design/infographics/out/${a.slug}--paper--card.png`)))
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
const img = (a, k) => U(`design/infographics/out/${a.slug}--paper--${k}.png`)
// designer@'s rule (synthetic@'s F35): the author agent's own name, then 'an AI agent', then who it was for; never a desk or the publication in its place
const by = a => { const m = a.author.match(/^([a-z0-9.-]+@[A-Za-z.-]+)(?:,\s*(?:for\s+([^,]+)|round[^,]*))?/); const who = m ? m[1] : a.author; const f = m && m[2] ? ', for ' + m[2] : ''; return `${who}, an AI agent${f}` }
const dek = (s, n = 150) => s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s
const day = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

const CSS = `
@import url("${U('assets/fonts.css')}"); @import url("${U('assets/tokens.css')}");
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)}
.wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0;display:flex;justify-content:space-between;align-items:center;gap:12px}
.bar b{font:700 20px var(--serif)} .bar small{font:12px var(--mono);color:var(--ink-3)}
.sw{display:flex;gap:6px;margin:8px 0;font:12px var(--mono);flex-wrap:wrap} .sw span{padding:3px 10px;border:1px solid var(--rule-2)} .sw .on{background:var(--ink);color:var(--paper)}
h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 6px} .lede{color:var(--ink-2);margin:0 0 12px;max-width:44em}
.tag{font:11px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--brand)} .meta{font:12px var(--mono);color:var(--ink-3)}
h2{font:600 22px var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:28px 0 12px;display:flex;justify-content:space-between;align-items:baseline} h2 small{font:12px var(--mono);color:var(--ink-3)}
h3{font:600 19px/1.2 var(--serif);margin:4px 0} p{margin:0}
img{display:block;width:100%;height:auto;background:var(--paper-2)}
.lead{display:grid;grid-template-columns:3fr 2fr;gap:20px} .lead h3{font-size:clamp(26px,3.4vw,38px)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:16px}
.card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:10px} .card p{font-size:14px;color:var(--ink-2)}
.wire{display:grid;grid-template-columns:1fr 280px;gap:28px} .row{display:grid;grid-template-columns:70px 120px 1fr;gap:14px;padding:14px 0;border-bottom:1px solid var(--hair)} .row p{font-size:15px;color:var(--ink-2)}
.rail{border-left:1px solid var(--rule-2);padding-left:18px;position:sticky;top:10px;align-self:start} .rail h4{font:12px var(--mono);text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px}
.pill{display:inline-block;border:1px solid var(--rule-2);border-radius:999px;padding:3px 10px;margin:0 4px 6px 0;font-size:13px;background:var(--panel)} .pill b{font:500 11px var(--mono);color:var(--ink-3);margin-left:5px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px} .col h2{margin-top:12px} .col .it{padding:10px 0;border-bottom:1px solid var(--hair)} .col .it p{font-size:13px;color:var(--ink-3)}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
@media(max-width:700px){.lead,.wire{grid-template-columns:1fr}.rail{position:static;border:0;padding:0;order:-1}.row{grid-template-columns:90px 1fr}.row .t{display:none}}
`
const head = (v, title, d) => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Experiment ${v}: ${title}</title><style>${CSS}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b><small>EXPERIMENT ${v} · ${esc(title)}</small></div>
<div class=sw>${['A', 'B', 'C'].map(x => `<span class="${x === v ? 'on' : ''}">${x}</span>`).join('')}<span>the same ${arts.length} articles, three views</span></div>
<h1>Everything we have published</h1><p class=lede>${d}</p>`
const foot = `<p class=note>Experiment mock-up, not on the site. Articles and images from content/articles/ and design/infographics/out/. Day grouping is thin today (all but one on 6 November): it will carry as the summit days arrive.</p></div>`
const card = a => `<div class=card><img src="${img(a, 'card')}" alt=""><span class=tag>${esc(a.beat)}</span><h3>${esc(a.title)}</h3><p>${esc(dek(a.summary, 120))}</p><p class=meta>${esc(by(a))}</p></div>`

const A = () => {
    const days = [...new Set(arts.map(a => a.date))]
    return head('A', 'By day', 'Newest day first. Each day opens with its lead, then everything else as pictures.') + days.map(d => {
        const l = arts.filter(a => a.date === d); const [h, ...r] = l
        return `<h2>${day(d)}<small>${l.length} articles</small></h2><div class=lead><img src="${img(h, 'banner')}" alt=""><div><span class=tag>${esc(h.beat)} · lead</span><h3>${esc(h.title)}</h3><p>${esc(dek(h.summary, 260))}</p></div></div><div class=grid>${r.map(card).join('')}</div>`
    }).join('') + foot
}
const B = () => {
    const tc = {}; arts.forEach(a => a.tags.forEach(t => tc[t] = (tc[t] || 0) + 1))
    const top = Object.entries(tc).sort((a, b) => b[1] - a[1]).slice(0, 14)
    return head('B', 'The wire', 'The plain sequence, newest first, for the reader who wants to see it all. The rail on the right is the graph: what links these stories.') +
        `<div class=wire><div>${arts.map(a => `<div class=row><span class=meta>${a.date.slice(5)}</span><span class=t><img src="${img(a, 'thumb')}" alt=""></span><div><span class=tag>${esc(a.beat)}</span><h3>${esc(a.title)}</h3><p>${esc(dek(a.summary))}</p><p class=meta>${esc(by(a))}</p></div></div>`).join('')}</div>` +
        `<aside class=rail><h4>Linked by</h4>${top.map(([t, n]) => `<span class=pill>${esc(t)}<b>${n}</b></span>`).join('')}</aside></div>` + foot
}
const C = () => {
    const tc = {}; arts.forEach(a => a.tags.filter(t => !/^the summit$/i.test(t)).forEach(t => (tc[t] ||= []).push(a)))
    const top = Object.entries(tc).sort((a, b) => b[1].length - a[1].length).slice(0, 6)
    return head('C', 'By topic', 'Each column is a topic; a story sits under every topic it touches. The overlaps are the graph, made visible.') +
        `<div class=cols>${top.map(([t, l]) => `<div class=col><h2>${esc(t)}<small>${l.length}</small></h2>${l.slice(0, 4).map(a => `<div class=it><h3 style="font-size:16px">${esc(a.title)}</h3><p>${a.date.slice(5)} · ${esc(a.beat)}</p></div>`).join('')}</div>`).join('')}</div>` + foot
}
const browser = await chromium.launch()
const sizes = { phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } }
for (const [v, fn] of Object.entries({ A, B, C })) {
    const f = path.join(OUT, v + '.html'); fs.writeFileSync(f, fn())
    for (const [s, vp] of Object.entries(sizes)) {
        const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage()
        await p.goto(pathToFileURL(f).href); await p.waitForTimeout(400)
        await p.screenshot({ path: path.join(OUT, `${v}--${s}.png`) }); await ctx.close()
    }
}
await browser.close(); console.log('written to', OUT, arts.length, 'articles')
