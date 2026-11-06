// A day's frozen graph root (Dinis, 6 November 2026): "freezing a day is freezing the root of the graph that reaches every page of that day;
// it is also the root of personalising". Three views of the same root, computed for real from the repository's files.
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/dayroot/make.mjs [--day 2026-11-10] [--out DIR]
//   -> DIR/dayroot.html (+ fonts/) and DIR/dayroot--<phone|desktop>--<tree|rings|ledger>.png
// How the root is computed here (an ILLUSTRATION of the idea, not the site's rule): each item that belongs to the day (an event on that date, an article
// dated that day) is hashed from its own file; items are grouped (events by track, articles by author agent); a group's hash is the hash of its sorted
// item hashes; the day's root is the hash of its sorted group hashes. Change one file and the root changes; nothing else needs to be compared.
// Three views: Tree (the root, its groups, their items), Rings (the same as concentric rings sized by count), Ledger (a table to check against).
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
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
const OUT = arg('--out') ? path.resolve(arg('--out')) : path.join(os.tmpdir(), 'pt-experiments-dayroot')
fs.mkdirSync(OUT, { recursive: true })
fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const sha = b => createHash('sha256').update(b).digest('hex')
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const items = []
for (const id of fs.readdirSync(path.join(root, 'data/events'))) {
    const f = path.join(root, 'data/events', id, 'event.json'); if (!fs.existsSync(f)) continue
    const raw = fs.readFileSync(f); const e = JSON.parse(raw)
    if (e.date === DAY) items.push({ kind: 'event', group: e.track || e.kind || 'Other', title: e.title, id, h: sha(raw) })
}
for (const fn of fs.readdirSync(path.join(root, 'content/articles')).filter(x => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(root, 'content/articles', fn)); const fm = raw.toString().split('---')[1] || ''
    const g = k => (fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1].replace(/^"|"$/g, '').trim()
    if (g('date') === DAY && g('status') === 'published') items.push({ kind: 'article', group: (g('author').match(/^[a-z0-9.-]+@[A-Za-z.-]+/) || [g('author')])[0], title: g('title'), id: fn.replace(/\.md$/, ''), h: sha(raw) })
}
const groups = Object.entries(items.reduce((m, i) => ((m[i.kind + ': ' + i.group] ||= []).push(i), m), {})).map(([k, v]) => {
    v.sort((a, b) => a.h.localeCompare(b.h)); return { k, kind: v[0].kind, n: v.length, items: v, h: sha(v.map(i => i.h).join('')) }
}).sort((a, b) => b.n - a.n || a.k.localeCompare(b.k))
const ROOT = sha(groups.map(g => g.h).sort().join(''))
const day = new Date(DAY + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const s8 = h => h.slice(0, 8)

const tree = `<div class=root><span class=k>Root of ${esc(day)}</span><b class=hash>${ROOT.slice(0, 16)}…</b><span class=m>${items.length} items in ${groups.length} groups</span></div>
<ul class=tr>${groups.map(g => `<li><details><summary><span class="kd ${g.kind}">${g.kind}</span> ${esc(g.k.replace(/^[a-z]+: /, ''))} <span class=m>${g.n} · ${s8(g.h)}</span></summary><ul>${g.items.slice(0, 6).map(i => `<li>${esc(i.title)} <span class=m>${s8(i.h)}</span></li>`).join('')}${g.n > 6 ? `<li class=m>and ${g.n - 6} more</li>` : ''}</ul></details></li>`).join('')}</ul>`
const maxN = Math.max(...groups.map(g => g.n)), cx = 300, cy = 300
const rings = (() => {
    const top = groups.slice(0, 14); const step = 2 * Math.PI / top.length
    const nodes = top.map((g, i) => { const a = i * step - Math.PI / 2, r = 215, rr = 10 + 26 * Math.sqrt(g.n / maxN); return { g, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), rr, a } })
    return `<svg viewBox="-110 0 820 600" role="img" aria-label="The day's root at the centre, its groups around it sized by how many items each holds"><circle cx=${cx} cy=${cy} r=215 fill=none stroke="var(--hair)" stroke-dasharray="3 5"/>${nodes.map(n => `<line x1=${cx} y1=${cy} x2=${n.x.toFixed(1)} y2=${n.y.toFixed(1)} stroke="var(--rule-2)"/>`).join('')}<circle cx=${cx} cy=${cy} r=44 fill="var(--ink)"/><text x=${cx} y=${cy - 2} text-anchor=middle fill="var(--paper)" font-size=13 font-family="var(--mono)">${s8(ROOT)}</text><text x=${cx} y=${cy + 14} text-anchor=middle fill="var(--paper)" font-size=10 font-family="var(--mono)">${items.length} items</text>${nodes.map(n => { const tx = n.x + (n.x > cx ? 1 : -1) * (n.rr + 6); return `<circle cx=${n.x.toFixed(1)} cy=${n.y.toFixed(1)} r=${n.rr.toFixed(1)} fill="${n.g.kind === 'article' ? 'var(--brand)' : 'var(--paper-2)'}" stroke="var(--ink)"/><text x=${n.x.toFixed(1)} y=${(n.y + 4).toFixed(1)} text-anchor=middle font-size=11 font-family="var(--mono)" fill="${n.g.kind === 'article' ? '#fff' : 'var(--ink)'}">${n.g.n}</text><text x=${tx.toFixed(1)} y=${(n.y + 4).toFixed(1)} text-anchor="${n.x > cx ? 'start' : 'end'}" font-size=11 fill="var(--ink-2)">${esc(n.g.k.replace(/^[a-z]+: /, '').slice(0, 20))}</text>` }).join('')}</svg>`
})()
const ledger = `<table><thead><tr><th>Group</th><th>Kind</th><th>Items</th><th>Group hash</th></tr></thead><tbody>${groups.map(g => `<tr><td>${esc(g.k.replace(/^[a-z]+: /, ''))}</td><td>${g.kind}</td><td>${g.n}</td><td class=m>${s8(g.h)}</td></tr>`).join('')}<tr class=tot><td colspan=3>Root of the day</td><td class=m>${s8(ROOT)}</td></tr></tbody></table><p class=m>Full root: ${ROOT}</p>`
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>A day's graph root: three views</title>
<style>${TOK}
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)} .wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)} h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 6px} .lede{color:var(--ink-2);margin:0 0 12px;max-width:46em}
.seg{display:flex;border:1px solid var(--ink);border-radius:3px;overflow:hidden;width:max-content;margin:10px 0} .seg a{font:600 14px var(--sans);padding:9px 16px;background:var(--panel);color:var(--ink);text-decoration:none;min-height:40px;display:flex;align-items:center} .seg a.on{background:var(--ink);color:var(--paper)}
.m,.k{font:12px var(--mono);color:var(--ink-3)} .k{letter-spacing:.07em;text-transform:uppercase;display:block}
.root{display:grid;gap:2px;padding:14px;border:2px solid var(--ink);background:var(--panel);margin:10px 0 16px;max-width:520px} .hash{font:600 22px var(--mono);word-break:break-all}
.tr,.tr ul{list-style:none;padding-left:0;margin:0} .tr>li{border-left:2px solid var(--ink);margin-left:12px;padding:6px 0 6px 14px} .tr ul{margin:6px 0 6px 6px;padding-left:12px;border-left:1px solid var(--rule-2)} .tr ul li{padding:3px 0;font-size:14px} summary{cursor:pointer;min-height:32px;padding:3px 0} summary:focus-visible{outline:3px solid var(--focus)}
.kd{font:11px var(--mono);text-transform:uppercase;padding:1px 7px;border:1px solid var(--rule-2);border-radius:999px;background:var(--paper)} .kd.article{border-color:var(--brand);color:var(--brand)}
svg{width:100%;max-width:640px;height:auto;display:block;margin:6px 0} table{border-collapse:collapse;width:100%;max-width:760px;font-size:14px} th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--hair)} th{font:600 12px var(--mono);text-transform:uppercase;color:var(--ink-3)} tr.tot td{font-weight:600;border-top:2px solid var(--ink)}
.view{display:none} .view:target,.view.def{display:block} :target~.view.def{display:none}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:28px 0 24px;padding-top:10px}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div><h1>${esc(day)}: the root</h1>
<p class=lede>One fingerprint for everything that belongs to this day: its sessions and its articles. Change one file and the root changes. Frozen, it is the day as it was; it is also where a personal view of the day would start.</p>
<div class=seg><a href="#v-tree" class=on>Tree</a><a href="#v-rings">Rings</a><a href="#v-ledger">Ledger</a></div>
<section class=view id=v-tree>${tree}</section><section class=view id=v-rings>${rings}<p class=m>Groups around the root, sized by how many items they hold; green are articles by an agent, paper are sessions by stage.</p></section><section class=view id=v-ledger>${ledger}</section>
<p class=note>Experiment, not on the site. The root here is computed for real from data/events/ and content/articles/ by a rule of this mock-up (see the script's header), to show the idea; the site's own rule is for dev@, ontologist@ and the provenance owner to set.</p></div>
<script>function s(){const h=location.hash||'#v-tree';document.querySelectorAll('.view').forEach(v=>v.style.display='#'+v.id===h?'block':'none');document.querySelectorAll('.seg a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===h))}addEventListener('hashchange',s);s()</script>`
const f = path.join(OUT, 'dayroot.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch(); let ok = true
for (const [s, vp] of Object.entries({ phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1200, height: 900, deviceScaleFactor: 1 } })) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)))
    for (const v of ['tree', 'rings', 'ledger']) { await p.goto(pathToFileURL(f).href + '#v-' + v); await p.waitForTimeout(250); await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: path.join(OUT, `dayroot--${s}--${v}.png`) }) }
    if (errs.length) { ok = false; console.log(errs) } await ctx.close()
}
await browser.close(); console.log(ok ? 'no page errors' : 'page errors', '| root', ROOT.slice(0, 16), '|', items.length, 'items,', groups.length, 'groups')
