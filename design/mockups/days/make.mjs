// Mock-ups of the summit's days (pass board/passes/2026-11-06-the-summit-days.md, round 1: proposals; sherpa@'s D1 to D5).
// designer@PrompTugal.dinis, session 2, 6 November 2026.
//
//   node design/mockups/days/make.mjs [--out DIR] [--vault DIR]
//     -> DIR/<today|past|future>--<phone|desktop>.png and index.json
//
// Three views with the same strip of days in the same place (D5): today (Friday 6, filled, D1), a past day (Thursday 5,
// the site as it was at the end of that day, v0.1.37, built from its tag with the clock frozen: D2, D6), a future day
// (Tuesday 10, planned, as listed, five things and the rest collapsed: D3, D4). The events are the site's own
// (data/events/*/event.json); the past screenshot is in the designer's vault (summit-days/round-1/past/). Public pages only.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const VAULT = path.resolve(arg('vault', '/root/.sg-send/designer/pt-designer'))
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'pt-mockups-days')))
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.isAbsolute(p) ? p : path.join(root, p)).href

// the events, by day
const EV = {}
for (const id of fs.readdirSync(path.join(root, 'data/events'))) {
    const f = path.join(root, 'data/events', id, 'event.json')
    if (!fs.existsSync(f)) continue
    const e = JSON.parse(fs.readFileSync(f, 'utf8'))
    const day = String(e.date || '').slice(0, 10)
    if (day.startsWith('2026-11')) (EV[day] ||= []).push(e)
}
const count = d => (EV[d] || []).length
const DAYS = [['Thu', 5, 'before'], ['Fri', 6, 'before'], ['Sat', 7, 'before'], ['Sun', 8, 'before'], ['Mon', 9, 'night'], ['Tue', 10, 'summit'], ['Wed', 11, 'summit'], ['Thu', 12, 'summit'], ['Fri', 13, 'after']]
const iso = n => `2026-11-${String(n).padStart(2, '0')}`

const css = `
@font-face{font-family:Newsreader;src:url(${U('assets/fonts/newsreader-variable.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(${U('assets/fonts/plex-sans-variable.woff2')}) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(${U('assets/fonts/plex-mono-400.woff2')}) format('woff2')}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;--red:#c52830;--brand:#006600;--soft:#e2eedf;--warn:#8a5200;--warn-soft:#f6ead6}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:15px;-webkit-font-smoothing:antialiased}
.row{max-width:1200px;margin:0 auto;padding:0 var(--g,16px)}
.k{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
.hed{font-family:Newsreader,serif;font-weight:600;line-height:1.12}
.pill{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 11px;border:1px solid var(--rule-2);border-radius:999px;font-size:13.5px;white-space:nowrap}
.pill.solid{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.strip{display:grid;grid-template-columns:repeat(8,1fr);gap:4px}
.d{text-align:center;border:1px solid var(--hair);border-radius:3px;padding:4px 0 5px;line-height:1.1}
.d small{display:block;font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)}
.d b{font-family:Newsreader,serif;font-size:18px}.d i{display:block;font-style:normal;font-size:9px;color:var(--ink-3);margin-top:1px}
.d.summit,.d.night{background:var(--soft)}.d.past{opacity:.55}.d.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}.d.on small,.d.on i{color:#c8c4ba}
.d.sel{outline:3px solid var(--red);outline-offset:-1px}
.legend{display:flex;gap:12px;font-size:11px;color:var(--ink-3);margin-top:6px}
.item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--hair)}.item time{font-family:"IBM Plex Mono";font-size:12.5px;min-width:44px;color:var(--ink-3);padding-top:2px}
.item p{font-family:Newsreader;font-size:17px;line-height:1.25}.item span{display:block;font-size:12px;color:var(--ink-3);margin-top:3px}
.note{position:fixed;right:8px;top:8px;background:var(--red);color:#fff;font:600 11px "IBM Plex Sans";padding:3px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:.04em;z-index:9}
`
const wm = h => `<img style="height:${h}px;display:block" src="${U('assets/brand/promptugal-wordmark-light.svg')}" alt="PrompTugal.news">`
const topPhone = `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="height:56px;display:flex;align-items:center;justify-content:space-between">${wm(20)}<div style="display:flex;gap:5px"><span class="pill">⌕</span><span class="pill"><b style="font-family:'IBM Plex Mono';font-weight:400">£5.00</b> credit</span><span class="pill">☰ Menu</span></div></div></header>`
const topDesk = `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="--g:24px;height:64px;display:flex;align-items:center;gap:26px">${wm(32)}<nav style="display:flex;gap:20px;flex:1;font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase"><span style="color:var(--brand)">Now</span><span>Agenda</span><span>News</span><span>Companies</span><span>People</span><span>Portugal</span><span>The graph</span><span>About</span></nav><span class="pill">⌕ Search</span><span class="pill"><b style="font-family:'IBM Plex Mono';font-weight:400">£5.00</b> credit</span><span class="pill solid">Ask</span></div></header>`

// the strip: Fri 6 to Fri 13 (eight days, D1); "today" is Friday 6; sel = the day being viewed
const strip = (sel, cols = 8) => `<div class="strip" style="grid-template-columns:repeat(${cols},1fr)">${DAYS.slice(1).map(([w, n, k]) => {
    const cls = ['d', k, n < 6 ? 'past' : '', n === 6 ? 'on' : '', n === sel ? 'sel' : ''].join(' ')
    const lab = n === 6 ? 'Today' : k === 'night' ? 'Opening' : k === 'summit' ? `Day ${n - 9}` : k === 'after' ? 'After' : ''
    return `<div class="${cls}"><small>${w}</small><b>${n}</b><i>${lab || '&nbsp;'}</i></div>`
}).join('')}</div>`
const stripHead = sel => `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><p class="k" style="color:var(--ink)">Web Summit Lisbon · the days</p><span style="font-size:12px;color:var(--brand)">‹ Earlier days</span></div>${strip(sel)}<div class="legend"><span>■ today</span><span style="color:var(--brand)">■ the summit</span><span>red ring: the day you are on</span></div>`

const items = (list, n = 5) => list.slice(0, n).map(e => `<div class="item"><time>${e.start || 'All day'}</time><div><p>${e.title}</p><span>${(e.where || '').split(',')[0]}${e.listed_as && e.listed_as !== 'summit' && e.listed_as !== 'team-pick' ? ' · ' + e.listed_as.replace('-', ' ') : ''}</span></div></div>`).join('')
const pick = (day, re) => (EV[day] || []).filter(e => re.test(e.title)).sort((a, b) => (a.start || '').localeCompare(b.start || ''))

// TODAY: Friday 6
const today = EV[iso(6)] || []
const next = [...pick(iso(7), /Registration|DevFest/).slice(0, 2), ...pick(iso(8), /Tech Run/)]
const todayBody = phone => `<p class="k" style="color:var(--red)">Today · Friday 6 November</p><h2 class="hed" style="font-size:${phone ? 25 : 30}px;margin-top:4px">Three days before the summit</h2>
${items(today)}<p class="k" style="margin-top:18px;color:var(--ink)">Next</p>${items(next, 3)}
<p style="margin-top:10px;font-size:13px;color:var(--brand)">Tap a day to see it: the past as it was, the future as planned.</p>`

// PAST: Thursday 5, the site at v0.1.37
const pastImg = dev => U(path.join(VAULT, `summit-days/round-1/past/v0.1.37--front--${dev}.png`))
const pastBanner = `<div style="background:var(--warn-soft);border:1px solid var(--warn);border-left-width:5px;padding:10px 12px"><p class="k" style="color:var(--warn)">The past · Thursday 5 November 2026</p><p style="font-family:Newsreader;font-size:17px;margin-top:3px">This is PrompTugal.news as it was at the end of that day: release <b>v0.1.37</b>, 23:00 UTC. Today is Friday 6 November.</p><p style="font-size:13px;margin-top:6px"><span style="color:var(--brand);font-weight:600">← Back to today</span> &nbsp;·&nbsp; What changed since: 116 releases</p></div>`
const pastFrame = dev => `<div style="margin-top:12px;border:1px solid var(--rule-2);box-shadow:0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08);position:relative;overflow:hidden;max-height:${dev === 'phone' ? 380 : 560}px"><img src="${pastImg(dev)}" style="display:block;width:100%"><span style="position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(transparent,var(--paper))"></span></div>`

// FUTURE: Tuesday 10, Day 1
const tue = EV[iso(10)] || []
const tuePick = [...pick(iso(10), /agent/i).slice(0, 3), ...pick(iso(10), /Portugal's startup scene|DSA/).slice(0, 2)].sort((a, b) => (a.start || '').localeCompare(b.start || ''))
const futureBanner = `<div style="background:var(--soft);border:1px solid var(--brand);border-left-width:5px;padding:10px 12px"><p class="k">Planned · Tuesday 10 November 2026 · Day 1</p><p style="font-family:Newsreader;font-size:17px;margin-top:3px">What is on, as listed on Friday 6 November. Times and rooms can move; each item links to its source.</p></div>`
const futureBody = phone => `${futureBanner}<h2 class="hed" style="font-size:${phone ? 25 : 30}px;margin-top:14px">Day 1: five sessions to start with</h2>${items(tuePick)}
<p style="margin-top:12px;font-size:14px"><span class="pill">▾ All ${tue.length} events on Tuesday</span></p>`

const V = {
    today: { title: 'Today: Friday 6, with the days', phone: () => `${topPhone}<div class="row" style="padding-top:10px;padding-bottom:10px;border-bottom:1px solid var(--hair)">${strip(6)}</div><main class="row" style="padding-top:14px">${todayBody(true)}</main>`, desktop: () => `${topDesk}<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:1.8fr 1fr;gap:36px"><div>${todayBody(false)}</div><aside style="border-top:2px solid var(--ink);padding-top:10px">${stripHead(6)}<p style="font-size:13px;color:var(--ink-3);margin-top:12px;line-height:1.5">Before: registration opens Saturday at the airport and the Pavilhão de Portugal. The summit: Opening Night Monday, three conference days. After: Friday 13.</p></aside></main>` },
    past: { title: 'A past day: Thursday 5, as the site was (v0.1.37)', phone: () => `${topPhone}<div class="row" style="padding-top:10px;padding-bottom:10px;border-bottom:1px solid var(--hair)">${strip(5)}</div><main class="row" style="padding-top:12px">${pastBanner}${pastFrame('phone')}</main>`, desktop: () => `${topDesk}<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:1.8fr 1fr;gap:36px"><div>${pastBanner}${pastFrame('desktop')}</div><aside style="border-top:2px solid var(--ink);padding-top:10px">${stripHead(5)}</aside></main>` },
    future: { title: 'A future day: Tuesday 10, as planned', phone: () => `${topPhone}<div class="row" style="padding-top:10px;padding-bottom:10px;border-bottom:1px solid var(--hair)">${strip(10)}</div><main class="row" style="padding-top:12px">${futureBody(true)}</main>`, desktop: () => `${topDesk}<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:1.8fr 1fr;gap:36px"><div>${futureBody(false)}</div><aside style="border-top:2px solid var(--ink);padding-top:10px">${stripHead(10)}</aside></main>` },
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-days-'))
const browser = await chromium.launch(); const made = []
for (const [k, v] of Object.entries(V)) for (const [dev, vp] of [['phone', { width: 390, height: 664 }], ['desktop', { width: 1440, height: 900 }]]) {
    const f = path.join(tmp, `${k}-${dev}.html`)
    fs.writeFileSync(f, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css}</style></head><body>${v[dev]()}<span class="note">Mock-up</span></body></html>`)
    const p = await browser.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready)
    const name = `${k}--${dev}.png`; await p.screenshot({ path: path.join(OUT, name) }); await p.close(); made.push(name)
}
await browser.close(); fs.rmSync(tmp, { recursive: true, force: true })
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ pass: 'board/passes/2026-11-06-the-summit-days.md', by: 'designer@PrompTugal.dinis', views: Object.fromEntries(Object.entries(V).map(([k, v]) => [k, v.title])), events_per_day: Object.fromEntries(DAYS.map(([, n]) => [iso(n), count(iso(n))])) }, null, 1) + '\n')
console.log(`made ${made.length} images in ${OUT}`)
