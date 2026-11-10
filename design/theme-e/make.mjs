// The Front Page (design E) as the whole site's theme: "after" pictures of inner pages (Dinis, 10 Nov 14:35:
// "change the default design and theme of the website and iOS app to be 'The Front Page' and apply it to the entire site").
// designer@PrompTugal.dinis. Loads the live pages, hides today's header, and puts E's own masthead on them (E's date line,
// wordmark and centred nav, lifted from the live home page), with E's section and kicker treatment. A design picture, not the build.
//   node design/theme-e/make.mjs [--out DIR] -> DIR/<page>--{before,after}--{phone,desktop}.png
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const { chromium } = createRequire(import.meta.url)('playwright')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-theme-e')
fs.mkdirSync(OUT, { recursive: true })
const SITE = 'https://promptugal.news/'
const pages = [['companies', 'companies/'], ['article', 'articles/red-wind-warning-lisbon-wednesday.html'], ['events', 'events/']]
// E's inner-page treatment (brand v2.0 tokens, as E on the home page)
const css = `
header.ctop,.ctop,.site-nav,nav.cnav,.cnav{display:none!important}
.te{background:var(--paper,#f6f3ec);padding:0 16px}.te .w{max-width:1180px;margin:0 auto}
.te .dl .tools{display:flex;gap:14px;align-items:center}.te .dl .tools a{color:#121317;font:600 12px 'IBM Plex Sans';border:1px solid #121317;border-radius:999px;padding:3px 10px}.te .dl{align-items:center;display:flex;justify-content:space-between;font:12px "IBM Plex Mono",monospace;color:#666860;padding:10px 0 6px}
.te .wm{display:block;text-align:center;padding:8px 0 10px}.te .wm img{width:min(420px,72vw);min-width:240px;height:auto}
.te nav{border-top:1px solid #121317;border-bottom:3px solid #121317;display:flex;justify-content:center;gap:22px;flex-wrap:wrap;padding:9px 0;font:600 13px "IBM Plex Sans",sans-serif}
.te nav a{color:#121317;text-decoration:none}.te nav a.on{color:#006600;box-shadow:inset 0 -2px #006600}
@media(max-width:699px){.te .dl .li{display:none}.te .dl .tools{gap:6px}.te .dl .tools a{padding:2px 8px}.te nav{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;gap:18px;padding:9px 2px}.te nav a{white-space:nowrap}}
main h1,.page-title{font-family:Newsreader,Georgia,serif!important;letter-spacing:-.01em}
main h2:not([class]){border-top:3px solid #121317;padding-top:8px;font:700 13px "IBM Plex Sans",sans-serif!important;letter-spacing:.1em;text-transform:uppercase}
.te-tag{position:fixed;right:8px;bottom:8px;z-index:99;background:#c52830;color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;text-transform:uppercase}`
const br = await chromium.launch()
// E's nav, as on the home page
const hp = await br.newPage(); await hp.goto(SITE, { waitUntil: 'networkidle' })
const nav = await hp.evaluate(() => { const e = document.querySelector('.pt-design[data-design-of="e"] nav'); return e ? [...e.querySelectorAll('a')].map(a => [a.textContent.trim(), a.href]) : [] }); await hp.close()
for (const [name, rel] of pages) for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
  const p = await br.newPage({ viewport: vp }); await p.goto(SITE + rel, { waitUntil: 'networkidle' })
  await p.screenshot({ path: path.join(OUT, `${name}--before--${d}.png`) })
  await p.evaluate(({ css, nav, name, SITE }) => {
    const s = document.createElement('style'); s.textContent = css; document.head.append(s)
    const day = new Date('2026-11-10T16:40:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const on = { companies: 'Companies', article: 'News', events: 'Agenda' }[name]
    const h = document.createElement('div'); h.className = 'te'
    h.innerHTML = `<div class=w><div class=dl><span>${day}</span><span class=tools><a>Search</a><a>Ask</a><a>App</a><a>You</a><span class=li>Lisbon · Independent</span></span></div><a class=wm href="${SITE}"><img src="${SITE}assets/brand/promptugal-wordmark-light.svg" alt="PrompTugal.news"></a><nav>${nav.map(([t, u]) => `<a href="${u}" class="${t === on ? 'on' : ''}">${t}</a>`).join('')}</nav></div>`
    document.body.prepend(h); const lb = [...document.querySelectorAll('body *')].find(e => /^\s*LIVE/.test(e.textContent) && e.offsetHeight > 20 && e.offsetHeight < 60 && e.offsetWidth > 300); if (lb) document.body.prepend(lb)
    const t = document.createElement('span'); t.className = 'te-tag'; t.textContent = 'Design · E theme'; document.body.append(t)
  }, { css, nav, name, SITE })
  await p.waitForTimeout(300); await p.screenshot({ path: path.join(OUT, `${name}--after--${d}.png`) }); await p.close() }
await br.close(); console.log('nav', nav.map(n => n[0]).join(' · '), '->', OUT)
