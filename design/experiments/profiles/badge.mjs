// The maturity badge (designer@'s round-6 note): a small component a company page could carry, 0 to 4, sized for a phone,
// with what each level needs and what this company still lacks. Three variants, each with a no-script popover (<details>).
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/profiles/badge.mjs [--out DIR]   -> DIR/badge.html (+ fonts/), DIR/badge--<phone|desktop>[--dark].png
// Levels as in board/spec-claimed-profiles.md: 0 Listed, 1 Described, 2 Sourced, 3 Public record, 4 Claimed. Computed from data/companies/ for four real companies.
// Accessible by text: every badge says "Profile level N of 4: Name" in words, never by colour alone; the popover is keyboard-reachable.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-badge')
fs.mkdirSync(OUT, { recursive: true })
fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const NEEDS = [['Listed', 'Name, and that it is at the summit'], ['Described', 'What it does, field, country, website'], ['Sourced', 'Three or more sources, each read and dated'], ['Public record', 'Matched to Wikipedia or an official register'], ['Claimed', 'The company gave permission: logo, people, details']]
const level = id => {
    const d = rd(path.join(root, 'data/companies', id, 'company.json')); const sf = path.join(root, 'data/companies', id, 'sources.json')
    const n = fs.existsSync(sf) ? (rd(sf).sources || []).length : 0
    let lv = d.name && d.attending ? 0 : -1
    if (lv >= 0 && d.what && d.category && d.country && d.website) lv = 1
    if (lv >= 1 && n >= 3) lv = 2
    return { name: d.name, lv, n }
}
// four real companies at the levels we have: pick the lowest-sourced listed one, a described one, two sourced ones
const all = fs.readdirSync(path.join(root, 'data/companies')).filter(id => fs.existsSync(path.join(root, 'data/companies', id, 'company.json'))).map(id => ({ id, ...level(id) }))
const pick = [all.find(c => c.lv === 0), all.find(c => c.lv === 1), all.find(c => c.id === '1password'), all.find(c => c.lv === 2 && c.n >= 5 && c.id !== '1password')].filter(Boolean)
const lack = lv => lv >= 4 ? '<li>Nothing: the company has said yes.</li>' : NEEDS.slice(lv + 1).map(([t, d], i) => `<li><b>Level ${lv + 1 + i}, ${t}:</b> ${d}</li>`).join('')
const label = (c, lv = c.lv) => `Profile level ${lv} of 4: ${NEEDS[lv][0]}`
const pop = c => `<div class=pop><p><b>${esc(c.name)}: ${NEEDS[c.lv][0]}.</b> ${NEEDS[c.lv][1]}.</p><p class=k>Still to come</p><ul>${lack(c.lv)}</ul><p class=m>Computed from the company's data and its ${c.n} dated sources. Level 4 comes only with the company's own permission.</p></div>`
const A = c => `<details class=bd><summary aria-label="${label(c)}"><span class=segs>${[0, 1, 2, 3, 4].map(i => `<i class="${i <= c.lv ? 'on' : ''} ${i === 4 && c.lv === 4 ? 'cl' : ''}"></i>`).join('')}</span><span class=t>${NEEDS[c.lv][0]}</span><span class=n>${c.lv}/4</span></summary>${pop(c)}</details>`
const ring = lv => { const r = 15, C = 2 * Math.PI * r; return `<svg width=38 height=38 viewBox="0 0 38 38" aria-hidden=true><circle cx=19 cy=19 r=${r} fill=none stroke="var(--hair)" stroke-width=4 /><circle cx=19 cy=19 r=${r} fill=none stroke="${lv === 4 ? 'var(--brand)' : 'var(--ink)'}" stroke-width=4 stroke-dasharray="${(C * (lv + 1) / 5).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 19 19)" /><text x=19 y=23 text-anchor=middle font-size=12 font-family="var(--mono)" fill="var(--ink)">${lv}</text></svg>` }
const B = c => `<details class=bd><summary aria-label="${label(c)}">${ring(c.lv)}<span class=t>${NEEDS[c.lv][0]}</span><span class=n>of 4</span></summary>${pop(c)}</details>`
const C = c => `<details class=bd><summary aria-label="${label(c)}"><span class="pill ${c.lv === 4 ? 'cl' : ''}">${c.lv === 4 ? 'Claimed' : 'Level ' + c.lv + ' · ' + NEEDS[c.lv][0]}</span></summary>${pop(c)}</details>`
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>The maturity badge: three variants</title>
<style>${TOK}
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)} .wrap{max-width:900px;margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)} h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 6px} .lede{color:var(--ink-2);margin:0 0 10px}
h2{font:600 20px var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:26px 0 4px} .m,.k{font:12px var(--mono);color:var(--ink-3)} .k{letter-spacing:.06em;text-transform:uppercase;margin:6px 0 2px}
.co{display:grid;grid-template-columns:minmax(120px,170px) 1fr;gap:12px;align-items:start;padding:10px 0;border-bottom:1px solid var(--hair)} .co h3{font:600 17px var(--serif);margin:6px 0}
.bd{position:relative} .bd summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:4px 10px 4px 6px;border:1px solid var(--rule-2);border-radius:3px;background:var(--panel)} .bd summary::-webkit-details-marker{display:none}
.bd summary:focus-visible{outline:3px solid var(--focus);outline-offset:2px} .bd[open] summary{border-color:var(--ink)}
.segs{display:flex;gap:2px} .segs i{width:12px;height:16px;background:var(--paper-2);border:1px solid var(--rule-2)} .segs i.on{background:var(--ink);border-color:var(--ink)} .segs i.cl{background:var(--brand);border-color:var(--brand)}
.t{font:600 14px var(--sans)} .n{font:12px var(--mono);color:var(--ink-3)} .pill{font:600 13px var(--sans);padding:2px 6px} .pill.cl{color:var(--brand)}
.pop{margin-top:6px;padding:10px 12px;border:1px solid var(--ink);background:var(--panel);max-width:340px;font-size:14px;box-shadow:var(--shadow)} .pop p{margin:0 0 4px} .pop ul{margin:0 0 6px;padding-left:18px} .pop li{margin:2px 0}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:26px 0 24px;padding-top:10px}
@media(max-width:560px){.co{grid-template-columns:1fr}}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div><h1>The maturity badge</h1>
<p class=lede>A small badge on a company page and its card: how filled in the profile is, and what would take it up a level. Tap or press Enter to open. It says the level in words, never by colour alone.</p>
${[['A', 'Segments', A, 'Five steps at a glance; the name of the level beside them.'], ['B', 'Ring', B, 'A dial; compact, the number is inside it.'], ['C', 'Text pill', C, 'Words only; smallest, for a dense list or a card corner.']].map(([k, n, f, d]) => `<h2>${k}. ${n}</h2><p class=m>${d}</p>${pick.map(c => `<div class=co><div><h3>${esc(c.name)}</h3></div><div>${f(c)}</div></div>`).join('')}`).join('')}
<p class=note>Experiment, not on the site. Levels computed from data/companies/ for four real companies; no company is at level 3 or 4 yet. The popover opens without a script (the details element).</p></div>`
const f = path.join(OUT, 'badge.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch()
for (const [s, vp] of Object.entries({ phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1100, height: 900, deviceScaleFactor: 1 } })) for (const dark of [false, true]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone', colorScheme: dark ? 'dark' : 'light' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)))
    await p.goto(pathToFileURL(f).href); await p.waitForTimeout(250)
    await p.click('.bd summary'); await p.waitForTimeout(100)
    await p.screenshot({ path: path.join(OUT, `badge--${s}${dark ? '--dark' : ''}.png`) }); console.log(s, dark ? 'dark' : 'light', errs.length ? errs : 'ok'); await ctx.close()
}
await browser.close(); console.log(pick.map(c => c.name + ' ' + c.lv).join(' | '))
