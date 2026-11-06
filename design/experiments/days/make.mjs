// Experiments for a summit day (pass board/passes/2026-11-06-the-summit-days.md, round 1; designer@'s strip of eight days is the fixed top).
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/days/make.mjs [--day 2026-11-10] [--out DIR]   (Playwright, preinstalled)
// Three views of the same day from data/events/<id>/event.json (title, date, start, end, track, where, our_pick):
//   A  Timeline: hours down the page, each session a row with its stage; our picks marked.
//   B  Stages: one column per stage, sessions stacked by time (a desktop view; a phone gets the stage as a tab row).
//   C  Five things: the day as five picks with why, the rest folded to counts per stage (designer@'s D4: short days).
// Writes <A|B|C>.html and <A|B|C>--<phone|desktop>.png to DIR (default the OS temp dir), never to git. Public data only: no speakers' details beyond what the event lists.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const DAY = arg('--day') || '2026-11-10'
const OUT = arg('--out') ? path.resolve(arg('--out')) : path.join(os.tmpdir(), 'pt-experiments-days')
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.join(root, p)).href
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const evs = fs.readdirSync(path.join(root, 'data/events')).map(id => {
    const f = path.join(root, 'data/events', id, 'event.json'); if (!fs.existsSync(f)) return null
    const d = JSON.parse(fs.readFileSync(f, 'utf8'))
    return { id, title: d.title, date: d.date, start: d.start || '', end: d.end || '', track: d.track || d.kind || 'Other', where: d.where || '', pick: !!d.our_pick, n: (d.speakers || []).length }
}).filter(e => e && e.date === DAY && e.start).sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title))
const tracks = Object.entries(evs.reduce((m, e) => ((m[e.track] = (m[e.track] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1])
const dayName = new Date(DAY + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const hue = n => { let h = 0; for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) % 360; return h }
const dot = t => `<i class=dot style="--h:${hue(t)}"></i>`

const CSS = `
@import url("${U('assets/fonts.css')}"); @import url("${U('assets/tokens.css')}");
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)}
.wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0;display:flex;justify-content:space-between;align-items:center} .bar b{font:700 20px var(--serif)} .bar small{font:12px var(--mono);color:var(--ink-3)}
.strip{display:flex;gap:4px;margin:10px 0;font:12px var(--mono)} .strip span{flex:1;text-align:center;padding:6px 0;border:1px solid var(--rule-2);background:var(--panel)} .strip .on{background:var(--ink);color:var(--paper)} .strip .sum{border-bottom:3px solid var(--brand)}
.sw{display:flex;gap:6px;margin:8px 0;font:12px var(--mono);flex-wrap:wrap} .sw span{padding:3px 10px;border:1px solid var(--rule-2)} .sw .on{background:var(--ink);color:var(--paper)}
h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:14px 0 4px} .lede{color:var(--ink-2);margin:0 0 14px;max-width:44em}
.tag{font:11px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)} .t{font:600 14px var(--mono);color:var(--brand)}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:hsl(var(--h) 45% 40%);margin-right:6px}
.row{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid var(--hair)} .row h3{font:600 17px/1.25 var(--serif);margin:0}
.hr{font:600 20px var(--serif);border-top:2px solid var(--rule);padding-top:6px;margin:20px 0 0}
.pick{background:var(--panel);box-shadow:inset 3px 0 0 var(--brand);padding-left:10px}
.cols{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(210px,1fr);gap:12px;overflow-x:auto;padding-bottom:8px}
.col{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:10px} .col h2{font:600 16px var(--serif);margin:0 0 8px;display:flex;justify-content:space-between} .col h2 small{font:11px var(--mono);color:var(--ink-3)}
.col .it{padding:7px 0;border-top:1px solid var(--hair)} .col .it h3{font:600 14px/1.25 var(--serif);margin:0}
.five{counter-reset:f;display:grid;gap:12px;margin:8px 0} .five>div{background:var(--panel);border:1px solid var(--hair);border-left:4px solid var(--brand);padding:12px 14px;counter-increment:f} .five h3{font:600 20px/1.2 var(--serif);margin:2px 0}
.fold{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0} .fold span{border:1px solid var(--rule-2);border-radius:999px;padding:4px 12px;font-size:13px;background:var(--panel)} .fold b{font:500 11px var(--mono);color:var(--ink-3);margin-left:6px}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}
@media(max-width:700px){.row{grid-template-columns:70px 1fr}}
`
const days = ['6', '7', '8', '9', '10', '11', '12', '13']
const head = (v, title, d) => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Experiment ${v}: ${title}</title><style>${CSS}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b><small>EXPERIMENT ${v} · ${esc(title)}</small></div>
<div class=strip>${days.map(x => `<span class="${x === String(+DAY.slice(8)) ? 'on' : ''} ${+x >= 9 && +x <= 12 ? 'sum' : ''}">${x} Nov</span>`).join('')}</div>
<div class=sw>${['A', 'B', 'C'].map(x => `<span class="${x === v ? 'on' : ''}">${x}</span>`).join('')}<span>the same ${evs.length} sessions, three views</span></div>
<h1>${dayName}</h1><p class=lede>${d}</p>`
const foot = `<p class=note>Experiment mock-up, not on the site. Sessions from data/events/ for ${DAY} (those with a start time). The strip above is designer@'s, unchanged; only the day below it varies.</p></div>`

const A = () => {
    const hrs = [...new Set(evs.map(e => e.start.slice(0, 2)))]
    return head('A', 'Timeline', 'Hour by hour, every session in order. Our picks are marked.') + hrs.slice(0, 6).map(h => `<div class=hr>${h}:00</div>` + evs.filter(e => e.start.startsWith(h)).slice(0, 6).map(e => `<div class="row ${e.pick ? 'pick' : ''}"><span class=t>${e.start}${e.end ? '<br><span class=tag>to ' + e.end + '</span>' : ''}</span><div><h3>${esc(e.title)}</h3><span class=tag>${dot(e.track)}${esc(e.track)}${e.pick ? ' · our pick' : ''}</span></div></div>`).join('')).join('') + foot
}
const B = () => head('B', 'Stages', 'One column per stage, so you can see what is on at once. Scroll sideways for more stages.') +
    `<div class=cols>${tracks.slice(0, 5).map(([t, n]) => `<div class=col><h2>${dot(t)}${esc(t)}<small>${n}</small></h2>${evs.filter(e => e.track === t).slice(0, 7).map(e => `<div class=it><span class=t style="font-size:12px">${e.start}</span><h3>${esc(e.title)}</h3></div>`).join('')}</div>`).join('')}</div>` + foot
const C = () => {
    const picks = (evs.filter(e => e.pick).concat(evs.filter(e => !e.pick && e.n >= 2))).slice(0, 5)
    return head('C', 'Five things', 'The day short: five sessions worth planning around. Everything else folded.') +
        `<div class=five>${picks.map((e, i) => `<div><span class=t>${e.start} · ${esc(e.where.split(',')[0] || e.track)}</span><h3>${esc(e.title)}</h3><span class=tag>${e.pick ? 'our pick' : e.n + ' speakers listed'}</span></div>`).join('')}</div>` +
        `<p class=tag>And the rest of the day</p><div class=fold>${tracks.map(([t, n]) => `<span>${dot(t)}${esc(t)}<b>${n}</b></span>`).join('')}</div>` + foot
}
const browser = await chromium.launch()
const sizes = { phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } }
for (const [v, fn] of Object.entries({ A, B, C })) {
    const f = path.join(OUT, v + '.html'); fs.writeFileSync(f, fn())
    for (const [s, vp] of Object.entries(sizes)) {
        const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage()
        await p.goto(pathToFileURL(f).href); await p.waitForTimeout(300)
        await p.screenshot({ path: path.join(OUT, `${v}--${s}.png`) }); await ctx.close()
    }
}
await browser.close(); console.log('written to', OUT, evs.length, 'sessions')
