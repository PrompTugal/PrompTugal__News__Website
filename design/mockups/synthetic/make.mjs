// Mock-up of the synthetic readers page, the designer's two findings (pass board/passes/2026-11-06-the-synthetic-readers-page.md):
// S9 the scoreboard as tiles, S5 a card per persona (who, arrived from, device, what lost them, their findings); and S10's one
// SYNTHETIC line on top (security@'s condition kept: every reader marked SYNTHETIC wherever they appear).
// designer@PrompTugal.dinis, session 2, 6 November 2026.
//
//   node design/mockups/synthetic/make.mjs [--out DIR]   -> DIR/synthetic--<phone|desktop>[--full].png
//
// Data: synthetic@'s own desk files, read only: desks/synthetic/findings.json (counts by status and owner, live),
// journeys.json (the personas), page.json (the latest line). No faces: initials on a tile, as no reader is real.
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
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'pt-mockups-synthetic')))
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.join(root, p)).href
const J = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const F = J('desks/synthetic/findings.json').items
const journeys = J('desks/synthetic/journeys.json').journeys
const page = J('desks/synthetic/page.json')
const STATES = [['open', 'open', 'sent, no decision yet'], ['accepted', 'accepted', 'the owner will do it'], ['later', 'later', 'after Friday'], ['done', 'done', 'the owner says it is live'], ['verified', 'verified', 'measured live']]
const byState = Object.fromEntries(STATES.map(([k]) => [k, F.filter(f => f.status === k).length]))
const waiting = Object.entries(F.filter(f => !['done', 'verified'].includes(f.status)).reduce((m, f) => (m[f.owner] = (m[f.owner] || 0) + 1, m), {})).sort((a, b) => b[1] - a[1])
const maxW = Math.max(...waiting.map(w => w[1]))
const COL = { open: 'var(--ink-3)', accepted: 'var(--cobalt)', later: 'var(--warn)', done: 'var(--brand)', verified: 'var(--ok)' }

const people = journeys.map(j => {
    const [name] = j.persona.split(' (SYNTHETIC)')
    const rest = j.persona.split('): ')[1] || ''
    const arrives = (rest.match(/arrives from (.*)$/) || [])[1] || ''
    const who = rest.replace(/;\s*arrives from.*$/, '')
    const first = name.split(' ')[0]
    const mine = F.filter(f => JSON.stringify(f).includes(first))
    const lost = mine.find(f => f.severity === 'blocking') || mine.find(f => f.severity === 'costly') || mine[0]
    const latest = (page.latest_readers || []).find(r => r.who.startsWith(name))
    return { name, initials: name.split(' ').map(w => w[0]).join(''), who, arrives, ids: mine.map(f => f.id), lost, latest }
})

const css = `
@font-face{font-family:Newsreader;src:url(${U('assets/fonts/newsreader-variable.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(${U('assets/fonts/plex-sans-variable.woff2')}) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(${U('assets/fonts/plex-mono-400.woff2')}) format('woff2')}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--panel:#fffdf8;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;--red:#c52830;--brand:#006600;--ok:#2b6a3c;--warn:#8a5200;--cobalt:#1f4fa0;--soft:#e2eedf}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:15px;-webkit-font-smoothing:antialiased}
.row{max-width:1200px;margin:0 auto;padding:0 var(--g,16px)}
.k{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
h1{font-family:Newsreader;font-weight:600;line-height:1.1}h2{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-top:2px solid var(--ink);padding-top:8px;margin:26px 0 12px}
.syn{display:inline-block;background:var(--ink);color:var(--paper);font:600 10px "IBM Plex Sans";letter-spacing:.08em;padding:2px 6px;border-radius:2px;vertical-align:middle}
.tiles{display:grid;gap:8px}.tile{background:var(--panel);border:1px solid var(--hair);border-top:4px solid var(--c);padding:10px 12px}
.tile b{display:block;font-family:Newsreader;font-size:34px;line-height:1}.tile span{display:block;font-size:12.5px;font-weight:600;margin-top:4px}.tile i{display:block;font-style:normal;font-size:11.5px;color:var(--ink-3)}
.bar{display:flex;height:12px;border-radius:2px;overflow:hidden;margin-top:12px}
.own{display:grid;grid-template-columns:110px 1fr 24px;gap:8px;align-items:center;font-size:13px;padding:3px 0}.own div{height:10px;background:var(--ink-2);border-radius:2px}
.cards{display:grid;gap:12px}.card{background:var(--panel);border:1px solid var(--hair);padding:14px}
.av{width:44px;height:44px;border-radius:3px;background:var(--paper-2);border:1px dashed var(--rule-2);display:grid;place-items:center;font:600 15px "IBM Plex Mono";color:var(--ink-2);flex:none}
.card h3{font-family:Newsreader;font-size:20px;line-height:1.15}.card p{font-size:13.5px;line-height:1.45;color:var(--ink-2)}
.lbl{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin-top:10px}
.chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.chips span{font:12px "IBM Plex Mono";border:1px solid var(--rule-2);border-radius:999px;padding:1px 7px}
.note{position:fixed;right:8px;top:8px;background:var(--red);color:#fff;font:600 11px "IBM Plex Sans";padding:3px 7px;border-radius:3px;text-transform:uppercase;z-index:9}
`
const tiles = cols => `<div class="tiles" style="grid-template-columns:repeat(${cols},1fr)">${STATES.map(([k, l, d]) => `<div class="tile" style="--c:${COL[k]}"><b>${byState[k]}</b><span>${l}</span><i>${d}</i></div>`).join('')}</div>
<div class="bar">${STATES.map(([k]) => `<span style="flex:${byState[k]};background:${COL[k]}"></span>`).join('')}</div>
<p style="font-size:12.5px;color:var(--ink-3);margin-top:6px">${F.length} fixes sent to their owners since run 1</p>`
const owners = `${waiting.map(([o, n]) => `<div class="own"><span>${esc(o)}</span><div style="width:${Math.round(n / maxW * 100)}%"></div><b>${n}</b></div>`).join('')}`
const card = p => `<div class="card"><div style="display:flex;gap:12px;align-items:flex-start"><div class="av" aria-hidden="true">${p.initials}</div><div><h3>${esc(p.name)} <span class="syn">SYNTHETIC</span></h3><p>${esc(p.who)}</p></div></div>
<p class="lbl">Arrived from</p><p>${esc(p.arrives)}</p>
${p.latest ? `<p class="lbl">Latest read</p><p>${esc(p.latest.line)}</p>` : ''}
${p.lost ? `<p class="lbl">What lost them most (${p.lost.id}, ${p.lost.severity})</p><p>${esc(p.lost.finding.length > 170 ? p.lost.finding.slice(0, p.lost.finding.lastIndexOf(' ', 165)) + '…' : p.lost.finding)}</p>` : ''}
<p class="lbl">Their findings</p><div class="chips">${p.ids.map(i => `<span>${i}</span>`).join('')}</div></div>`
const head = `<div style="background:var(--ink);color:var(--paper)"><div class="row" style="padding-top:7px;padding-bottom:7px;font-size:13px"><span class="syn" style="background:var(--paper);color:var(--ink)">SYNTHETIC</span>&nbsp; Every reader on this page is invented by a language model reading screenshots. Not user research. <u>How this was made</u></div></div>`
const body = phone => `${head}<main class="row" style="padding-top:18px;padding-bottom:40px;${phone ? '' : '--g:24px'}">
<p class="k">The newsroom</p><h1 style="font-size:${phone ? 32 : 44}px;margin-top:4px">Synthetic readers</h1><p style="font-family:Newsreader;font-size:18px;color:var(--ink-2);margin-top:6px">Invented readers try the site; what loses them becomes a fix with an owner.</p>
<div style="display:grid;grid-template-columns:${phone ? '1fr' : '1.4fr 1fr'};gap:${phone ? 0 : 36}px">
<section><h2>The scoreboard</h2>${tiles(phone ? 2 : 5)}</section>
<section><h2>Waiting, by owner</h2>${owners}</section></div>
<h2>The readers</h2><div class="cards" style="grid-template-columns:${phone ? '1fr' : 'repeat(2,1fr)'}">${people.map(card).join('')}</div>
</main>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-syn-'))
const browser = await chromium.launch(); const made = []
for (const [dev, vp] of [['phone', { width: 390, height: 664 }], ['desktop', { width: 1440, height: 900 }]]) {
    const f = path.join(tmp, `${dev}.html`)
    fs.writeFileSync(f, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css}</style></head><body>${body(dev === 'phone')}<span class="note">Mock-up</span></body></html>`)
    const p = await browser.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: path.join(OUT, `synthetic--${dev}.png`) })
    const h = Math.min(await p.evaluate(() => document.documentElement.scrollHeight), 4000)
    await p.screenshot({ path: path.join(OUT, `synthetic--${dev}--full.png`), clip: { x: 0, y: 0, width: vp.width, height: h }, fullPage: true })
    made.push(dev); await p.close()
}
await browser.close(); fs.rmSync(tmp, { recursive: true, force: true })
console.log(`made ${made.length * 2} images in ${OUT}; ${F.length} findings, ${people.length} readers`)
