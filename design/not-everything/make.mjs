// The websummit-only pass (board/passes/2026-11-11-only-websummit-sourced-comes-off.md, step 3: "the note on every
// affected page and list, designed with designer@"; the recovery page). designer@PrompTugal.dinis, 11 November 2026.
// The note's words follow Dinis's rule 3 (board/guidance/2026-11-11-only-websummit-sourced-comes-off.md) point by point;
// journalist@ may tune them. The recovery page's figures are the conductor's count at 18:55 UTC, labelled so; the build
// reads ontologist@'s inventory (data/websummit-only.json) instead.
//   node design/not-everything/make.mjs [--out DIR] -> DIR/note-{list,entity}--{phone,desktop}.png, recovery--{phone,desktop}--{light,dark}.png
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-not-everything')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
for (const f of ['promptugal-wordmark-light.svg', 'promptugal-wordmark-dark.svg']) fs.copyFileSync(path.join(root, 'assets/brand', f), path.join(OUT, f))

// the note: one component, two lengths. Sand, an ink rule on top, a kicker in ink (not red: it is not a warning), a link.
const noteCss = `.ne{--s:#efe6d2;--i:#121317;--i2:#3f424a;--g:#006600;background:var(--s);border-top:3px solid var(--i);padding:12px 14px 13px;margin:14px 0 18px;font-family:"IBM Plex Sans",sans-serif;color:var(--i)}
@media(prefers-color-scheme:dark){.ne{--s:#1d1f25;--i:#f6f3ec;--i2:#b9bbc2;--g:#6dbb7e}}
.ne .k{font:700 11px "IBM Plex Sans";letter-spacing:.1em;text-transform:uppercase;margin:0 0 4px}.ne p{font:15.5px/1.45 Newsreader,Georgia,serif;margin:0}.ne p+p{margin-top:6px}
.ne a{color:var(--g);font:600 14px "IBM Plex Sans";text-decoration:underline;text-underline-offset:3px}.ne .n{font:13px "IBM Plex Mono",monospace;color:var(--i2)}
.ne-tag{position:fixed;right:8px;bottom:70px;z-index:99;background:#c52830;color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;text-transform:uppercase}`
const noteList = `<aside class=ne aria-label="About this list"><p class=k>This list is not everything</p><p>Web Summit's licence does not let us republish data from its site, so on 11 November we took off what rested only on it. Every company here has another public source, cited on its page; the others come back as we find one. <span class=n>61 of 120 shown.</span></p><p><a href="#">How items come back</a></p></aside>`
const noteEntity = `<aside class=ne aria-label="About this page"><p class=k>Not everything we held</p><p>Some facts on this page rested only on Web Summit's site, which we may not republish; on 11 November we took them off. What you see has another public source, each cited. A fact comes back when we find one.</p><p><a href="#">How items come back</a></p></aside>`

const br = await chromium.launch()
async function inject(url, note, name) {
  for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1200)
    await p.evaluate(({ css, note }) => { const s = document.createElement('style'); s.textContent = css; document.head.append(s)
      const h1 = document.querySelector('main h1'); const lede = h1.nextElementSibling && h1.nextElementSibling.tagName === 'P' ? h1.nextElementSibling : h1
      const el = document.createElement('div'); el.innerHTML = note; lede.after(el.firstChild)
      const t = document.createElement('span'); t.className = 'ne-tag'; t.textContent = 'Design · the note'; document.body.append(t)
      const n = document.querySelector('.ne'); scrollTo(0, Math.max(0, n.getBoundingClientRect().top + scrollY - 260)) }, { css: noteCss, note })
    await p.waitForTimeout(200); await p.screenshot({ path: path.join(OUT, `note-${name}--${d}.png`) }); await p.close() } }
await inject('https://promptugal.news/companies/', noteList, 'list')
await inject('https://promptugal.news/companies/cloudflare/', noteEntity, 'entity')
// sherpa@'s NE1 (12 Nov 00:35): on the agenda, the day pages and the app, the note says where the full programme still is
const noteAgenda = `<aside class=ne aria-label="About this list"><p class=k>Not the full programme</p><p>Web Summit's licence does not let us republish its programme, so on 11 November we took off the sessions that rested only on its site. <b>The full programme is in Web Summit's own app and at websummit.com/schedule.</b> What is here has another public source; the rest comes back as we find one.</p><p><a href="#">Web Summit's schedule ↗</a> &nbsp; <a href="#">How items come back</a></p></aside>`
await inject('https://promptugal.news/events/', noteAgenda, 'agenda')
// sherpa@'s NE2: People at 0 of 285: the note is the page. Why first, then what is still there, then the way back.
const emptyCss = noteCss + `.ne.big{border-top-width:4px;padding:18px 16px}.ne.big .k{font-size:12px}.ne.big p{font-size:17.5px}.ne.big ul{margin:8px 0 0 18px;font:16px/1.5 Newsreader}`
const noteEmpty = `<aside class="ne big" aria-label="About this page"><p class=k>No one listed, for now</p><p>Every person on this page came from Web Summit's speaker list, which its licence does not let us republish. On 11 November we took all 285 off.</p><p>What is still here:</p><ul><li>people named in our articles and interviews, cited there;</li><li>speakers named on their company's own pages, on that company's page with us;</li><li>Web Summit's own app and site, for the full speaker list.</li></ul><p style="margin-top:8px">A person comes back when we find a public source of their own. <a href="#">How items come back</a></p></aside>`
for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
  const p = await br.newPage({ viewport: vp }); await p.goto('https://promptugal.news/people/', { waitUntil: 'load' }); await p.waitForTimeout(1200)
  await p.evaluate(({ css, note }) => { const s = document.createElement('style'); s.textContent = css; document.head.append(s)
    const h1 = document.querySelector('main h1'); const main = h1.closest('main'); [...main.children].forEach(c => { if (!c.contains(h1) && !c.matches('nav,.crumbs')) c.style.display = 'none' })
    let host = h1; while (host.parentElement !== main) host = host.parentElement; [...host.children].forEach(c => { if (c !== h1 && !c.contains(h1) && !c.matches('nav,.crumbs')) c.style.display = 'none' })
    const el = document.createElement('div'); el.innerHTML = note; h1.after(el.firstChild)
    const t = document.createElement('span'); t.className = 'ne-tag'; t.textContent = 'Design · the empty page'; document.body.append(t)
    scrollTo(0, Math.max(0, h1.getBoundingClientRect().top + scrollY - 200)) }, { css: emptyCss, note: noteEmpty })
  await p.waitForTimeout(200); await p.screenshot({ path: path.join(OUT, `note-empty--${d}.png`) }); await p.close() }

// the recovery page
const kinds = [['Company facts', 311, 239, 0], ['People', 285, 285, 0], ['Sessions and events', 248, 215, 0]]
const rec = dark => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><style>@font-face{font-family:Newsreader;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:"IBM Plex Sans";src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:"IBM Plex Mono";src:url(plex-mono-400.woff2)}
:root{--p:#f6f3ec;--i:#121317;--i2:#3f424a;--h:#d8d4cb;--r:#c52830;--g:#006600;--s:#efe6d2}.dark{--p:#121317;--i:#f6f3ec;--i2:#b9bbc2;--h:#2c2e35;--r:#f07278;--g:#6dbb7e;--s:#1d1f25}
*{box-sizing:border-box;margin:0}body{background:var(--p);color:var(--i);font-family:"IBM Plex Sans",sans-serif}.w{max-width:860px;margin:0 auto;padding:16px}
.mast{text-align:center;padding:6px 0 10px;border-bottom:3px solid var(--i)}.mast img{width:min(320px,62vw);min-width:240px}.wm-d{display:none}.dark .wm-l{display:none}.dark .wm-d{display:inline}
.crumb{font:12.5px "IBM Plex Mono";color:var(--i2);margin:14px 0 6px}h1{font:600 clamp(30px,5vw,44px)/1.08 Newsreader}.lede{font:18px/1.5 Newsreader;color:var(--i2);margin:10px 0 18px}
h2{border-top:3px solid var(--i);padding-top:8px;font:700 13px "IBM Plex Sans";letter-spacing:.1em;text-transform:uppercase;margin:26px 0 12px}
.k3{display:grid;gap:10px}@media(min-width:640px){.k3{grid-template-columns:repeat(3,1fr)}}
.kd{border:1px solid var(--h);padding:12px;background:color-mix(in srgb,var(--p) 92%,var(--i))}.kd b{font:600 17px Newsreader;display:block}.kd .bar{height:10px;background:var(--h);margin:10px 0 6px;position:relative}.kd .bar i{position:absolute;inset:0 auto 0 0;background:var(--i)}.kd .bar u{position:absolute;inset:0 auto 0 0;background:var(--g)}
.kd .n{font:13px "IBM Plex Mono";color:var(--i2);display:flex;justify-content:space-between}.kd .n b{font:600 13px "IBM Plex Mono";display:inline;color:var(--g)}
.key{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--i2);margin-top:8px}.key span:before{content:"";display:inline-block;width:12px;height:10px;margin-right:5px;vertical-align:-1px;background:var(--h)}.key .o:before{background:var(--i)}.key .b:before{background:var(--g)}
.path{display:grid;gap:8px;grid-template-columns:1fr}@media(min-width:640px){.path{grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch}}
.st{border:1.5px solid var(--i);padding:10px;font:15px/1.4 Newsreader;background:var(--p)}.st .k{font:700 10.5px "IBM Plex Sans";letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:4px}.st.off{border-style:dashed;color:var(--i2)}.st.back{border-color:var(--g)}.st.back .k{color:var(--g)}
.ar{align-self:center;justify-self:center;font:20px "IBM Plex Mono";color:var(--i2)}@media(max-width:639px){.ar{transform:rotate(90deg)}}
p.t{font:16.5px/1.5 Newsreader;margin:0 0 10px}a{color:var(--g)}.src{font:12.5px "IBM Plex Mono";color:var(--i2);margin-top:14px}
.fr{border-top:3px solid var(--i);background:var(--s);padding:14px;margin-top:8px}.fr b{font:600 20px Newsreader}
.tag{position:fixed;right:8px;top:8px;background:#c52830;color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;text-transform:uppercase}</style><body class="${dark ? 'dark' : ''}"><div class=w>
<div class=mast><img class=wm-l src=promptugal-wordmark-light.svg alt="PrompTugal.news"><img class=wm-d src=promptugal-wordmark-dark.svg alt=""></div>
<p class=crumb>Home / About / What came off, and what came back</p><h1>What came off the site, and how it comes back</h1>
<p class=lede>Web Summit's licence does not let us republish data from its site. On 11 November we took off every fact that rested only on it. Each one comes back when we find it at another public source, or in a capture of our own. This page counts both, and shows the route.</p>
<h2>By kind</h2><div class=k3>${kinds.map(([n, t, off, back]) => `<div class=kd><b>${n}</b><div class=bar><i style="width:${off / t * 100}%"></i><u style="width:${back / t * 100}%"></u></div><div class=n><span>${off} of ${t} came off</span><span><b>${back}</b> back</span></div></div>`).join('')}</div>
<div class=key><span>kept (another source)</span><span class=o>came off</span><span class=b>came back</span></div>
<p class=src>The conductor's count at 18:55 UTC, 11 November. The page reads ontologist@'s inventory (data/websummit-only.json) at each release, and shows its time.</p>
<h2>The route, for one fact</h2><p class=t>Every fact that comes back shows this route on its page, and the best examples are listed here.</p>
<div class=path><div class="st off"><span class=k>Came off, 11 Nov</span>A fact whose only source was websummit.com</div><span class=ar>→</span><div class=st><span class=k>A shadow source</span>The company's own site, a press release, a news report, Wikipedia, the speaker's own page, or Dinis's capture</div><span class=ar>→</span><div class="st back"><span class=k>Came back</span>The same fact, cited to the new source, with the date read</div></div>
<p class=t style="margin-top:12px">The method is <a href="#">"Sources and their shadows"</a> (newsroom.sgit.ai). No login, no paywall, no bot challenge is read around.</p>
<h2>The showcase</h2><div class=fr><b>Lisbon Tech Fringe</b><p class=t style="margin:6px 0 0">The alternative and community events around the summit, built from open sources. <a href="#">lisbontechfringe.com ↗</a></p></div>
</div><span class=tag>Design · recovery page</span>`
for (const dark of [false, true]) { const f = path.join(OUT, `recovery-${dark ? 'dark' : 'light'}.html`); fs.writeFileSync(f, rec(dark))
  for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
    const p = await br.newPage({ viewport: vp }); await p.goto(pathToFileURL(f).href); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: path.join(OUT, `recovery--${d}--${dark ? 'dark' : 'light'}.png`), fullPage: true }); await p.close() } }
await br.close(); console.log('->', OUT)
