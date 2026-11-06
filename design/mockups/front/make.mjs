// Mock-ups of the front page below the top (pass board/passes/2026-11-06-the-front-page.md, round 1: F1, F2, F4 to F8).
// designer@PrompTugal.dinis, session 2, 6 November 2026.
//
//   node design/mockups/front/make.mjs [--out DIR] [--vault DIR]
//     -> DIR/<A|B|C>--phone.png (the whole page, as a phone scrolls it), <A|B|C>--desktop.png (the whole page)
//
// Public pages only. Words are the site's: the articles' titles, summaries and topics (content/articles/), the front
// page's own sections (content/index.md). Images: the article images in design/infographics/out/ and the AI-made ones
// in the designer's vault (marked "AI-made" wherever they show). The top is option A of the top-of-the-page round 1.
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
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'pt-mockups-front')))
const VAULT = path.resolve(arg('vault', '/root/.sg-send/designer/pt-designer'))
fs.mkdirSync(OUT, { recursive: true })
const U = p => pathToFileURL(path.isAbsolute(p) ? p : path.join(root, p)).href

// the stories, from content/articles/ front matter
const fm = slug => {
    const s = fs.readFileSync(path.join(root, 'content/articles', slug + '.md'), 'utf8').split('---')[1]
    const o = {}; for (const l of s.split('\n')) { const m = l.match(/^(\w+):\s*(.*)$/); if (m) o[m[1]] = m[2].trim().replace(/^"|"$/g, '') }
    return o
}
const by = a => a.startsWith('journalist@PrompTugal') ? 'PrompTugal.news' : /vicky/.test(a) ? "Vicky Wang's desk" : 'PrompTugal.news'
const thumb = (slug, size = 'card') => fs.existsSync(path.join(root, `design/infographics/out/${slug}--paper--${size}.png`)) ? U(`design/infographics/out/${slug}--paper--${size}.png`) : null
const AI = {
    'brazil-startup-mission': 'ai-images/brazil-startup-mission/google_gemini-3-pro-image--editorial--045743.png',
    'from-pitch-to-new-markets': 'ai-images/from-pitch-to-new-markets/google_gemini-3.1-flash-image--editorial--053452.png',
}
const SLUGS = ['brazil-startup-mission', 'from-pitch-to-new-markets', 'europe-in-pavilion-4', 'web-summit-2026-in-numbers', 'lisbon-universities-at-web-summit', 'road-2-web-summit-2026', 'following-robotics-at-web-summit', 'your-first-day-at-web-summit', 'gender-in-tech-report-2026', 'tuesday-10-november-three-ways-in']
const S = SLUGS.map(slug => {
    const f = fm(slug)
    const ai = AI[slug] && fs.existsSync(path.join(VAULT, AI[slug])) ? U(path.join(VAULT, AI[slug])) : null
    return { slug, title: f.title, sum: f.summary, kicker: (f.beat || (f.topics || f.tags || '').split(',')[0] || 'The summit').replace(/\s*\(.*\)\s*/, '').trim(), by: by(f.author || ''), img: ai || thumb(slug, 'banner') || thumb(slug), thumb: ai || thumb(slug, 'thumb') || thumb(slug), ai: !!ai }
})
const short = s => s.length > 150 ? s.slice(0, s.lastIndexOf(' ', 145)) + '…' : s
const NOW = [
    ['Today', 'Fri 6', 'Portugal Tech Week begins, 6 to 15 November'],
    ['Mon', '9 Nov', 'Opening Night, MEO Arena'],
    ['Tue', '10 Nov', 'Day 1: Europe on Centre Stage; universities pitch'],
]

const css = `
@font-face{font-family:Newsreader;src:url(${U('assets/fonts/newsreader-variable.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(${U('assets/fonts/plex-sans-variable.woff2')}) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(${U('assets/fonts/plex-mono-400.woff2')}) format('woff2')}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;--red:#c52830;--brand:#006600;--soft:#e2eedf;--band:#121317;--on-band:#f6f3ec}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:15px;-webkit-font-smoothing:antialiased}
.row{max-width:1200px;margin:0 auto;padding:0 var(--g,16px)}
.wm{height:var(--h);display:block}
.k{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
.hed{font-family:Newsreader,serif;font-weight:600;line-height:1.12;letter-spacing:-.01em}
.dek{font-family:Newsreader,serif;color:var(--ink-2);line-height:1.45}
.by{font-size:12px;color:var(--ink-3);margin-top:6px}
.img{display:block;width:100%;height:auto;border:1px solid var(--hair);background:var(--paper-2)}
.fig{position:relative}.ai{position:absolute;right:6px;bottom:6px;background:rgba(18,19,23,.78);color:#fff;font:600 9.5px "IBM Plex Sans";letter-spacing:.05em;text-transform:uppercase;padding:2px 5px;border-radius:2px}
h3.sec{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-top:2px solid var(--ink);padding-top:8px;margin:28px 0 12px;display:flex;justify-content:space-between}
h3.sec a{font-weight:500;letter-spacing:0;text-transform:none;color:var(--brand);font-size:13px}
.pill{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 11px;border:1px solid var(--rule-2);border-radius:999px;font-size:13.5px;white-space:nowrap}
.pill.solid{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.lens{display:grid;gap:10px}.lens div{border-left:3px solid var(--red);padding:2px 0 2px 10px}.lens b{font-family:Newsreader,serif;font-size:19px;display:block}
.note{position:fixed;right:8px;top:8px;background:var(--red);color:#fff;font:600 11px "IBM Plex Sans";padding:3px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:.04em;z-index:9}
`
const wm = h => `<img class="wm" style="--h:${h}px" src="${U('assets/brand/promptugal-wordmark-light.svg')}" alt="PrompTugal.news">`
const fig = (s, extra = '') => `<div class="fig"><img class="img" src="${s.img}" alt="" ${extra}>${s.ai ? '<span class="ai">AI-made</span>' : ''}</div>`
const topPhone = `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="height:56px;display:flex;align-items:center;justify-content:space-between">${wm(20)}<div style="display:flex;gap:5px"><span class="pill">⌕</span><span class="pill"><b style="font-family:'IBM Plex Mono';font-weight:400">£5.00</b> credit</span><span class="pill">☰ Menu</span></div></div></header>
<p class="row" style="font-family:Newsreader;font-style:italic;color:var(--ink-2);padding-top:10px">People and AI agents, reporting together. <span style="font-style:normal;font-family:'IBM Plex Sans';font-size:12.5px;color:var(--ink-3)">Independent.</span></p>`
const topDesk = `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="--g:24px;height:64px;display:flex;align-items:center;gap:26px">${wm(32)}<nav style="display:flex;gap:20px;flex:1;font-size:12.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">${['Now', 'Agenda', 'News', 'Companies', 'People', 'Portugal', 'The graph', 'About'].join('</span><span>').replace(/^/, '<span style="color:var(--brand)">').replace(/$/, '</span>')}</nav><span class="pill">⌕ Search</span><span class="pill"><b style="font-family:'IBM Plex Mono';font-weight:400">£5.00</b> credit</span><span class="pill solid">Ask</span></div></header>
<div class="row" style="--g:24px;display:flex;justify-content:space-between;padding-top:8px;padding-bottom:8px;border-bottom:1px solid var(--hair)"><i style="font-family:Newsreader;color:var(--ink-2)">People and AI agents, reporting together.</i><span style="font-size:12.5px;color:var(--ink-3)">Every fact sourced and dated. Independent: not affiliated with Web Summit. <u style="color:var(--brand)">Our disclosure</u></span></div>`

const latestRow = (s, w = 96) => `<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)"><div class="fig" style="flex:0 0 ${w}px"><img src="${s.thumb}" style="width:${w}px;height:${Math.round(w * .72)}px;object-fit:cover;border:1px solid var(--hair);display:block">${s.ai ? '<span class="ai" style="font-size:8px">AI</span>' : ''}</div><div><p class="k">${s.kicker}</p><p class="hed" style="font-size:17px;margin-top:2px">${s.title}</p><p class="by">${s.by}</p></div></div>`
const nowStrip = (wide) => `<div style="display:grid;grid-template-columns:${wide ? 'repeat(3,1fr)' : '1fr'};gap:${wide ? 12 : 0}px">${NOW.map(([d, n, t], i) => `<div style="display:flex;gap:10px;align-items:baseline;padding:9px 0;border-bottom:1px solid var(--hair)"><span style="font:600 11px 'IBM Plex Sans';letter-spacing:.06em;text-transform:uppercase;min-width:66px;color:${i ? 'var(--ink-3)' : 'var(--red)'}">${d} ${n}</span><span style="font-family:Newsreader;font-size:16px">${t}</span></div>`).join('')}</div>`
const lens = `<div class="lens"><div><b>Reach.</b>What can an AI agent actually do?</div><div><b>Mandate.</b>What was it asked to do?</div><div><b>Gap.</b>Who controls the difference?</div></div>`
const mandate = `<p style="font-family:Newsreader;font-size:19px;line-height:1.35"><b>Our mandate: to map the universe of AI in Portugal.</b> <span style="color:var(--ink-2)">The companies, the people, the events and how they connect, every fact with its source.</span></p>`

// ---- A. The newspaper: a lead with its picture, two seconds, Latest with thumbs, a compact Now, why we are different high. ----
const A = {
    title: 'A. The newspaper',
    phone: () => `${topPhone}<main class="row" style="padding-top:14px">
${fig(S[0])}<p class="k" style="margin-top:12px">${S[0].kicker}</p><h2 class="hed" style="font-size:28px;margin-top:4px">${S[0].title}</h2><p class="dek" style="font-size:17px;margin-top:8px">${short(S[0].sum)}</p><p class="by">${S[0].by} · 5 min · signed</p>
<h3 class="sec">Now and next <a>The summit, day by day</a></h3>${nowStrip(false)}
<h3 class="sec">Latest <a>All articles</a></h3>${S.slice(1, 6).map(s => latestRow(s)).join('')}
<h3 class="sec">Why we are different</h3>${mandate}<div style="margin-top:12px">${lens}</div>
</main>`,
    desktop: () => `${topDesk}<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:1.75fr 1fr;gap:36px">
<div>${fig(S[0])}<p class="k" style="margin-top:14px">${S[0].kicker}</p><h2 class="hed" style="font-size:42px;margin-top:6px">${S[0].title}</h2><p class="dek" style="font-size:19px;margin-top:10px">${S[0].sum}</p><p class="by">${S[0].by} · 5 min · signed</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px;border-top:1px solid var(--hair);padding-top:20px">${S.slice(1, 3).map(s => `<div>${fig(s)}<p class="k" style="margin-top:10px">${s.kicker}</p><h3 class="hed" style="font-size:22px;margin-top:4px">${s.title}</h3><p class="dek" style="font-size:16px;margin-top:6px">${short(s.sum)}</p></div>`).join('')}</div></div>
<aside><h3 class="sec" style="margin-top:0">Now and next <a>Day by day</a></h3>${nowStrip(false)}
<h3 class="sec">Latest <a>All</a></h3>${S.slice(3, 8).map(s => latestRow(s, 84)).join('')}
<h3 class="sec">Why we are different</h3>${mandate}<div style="margin-top:12px">${lens}</div></aside></main>`,
    notes: ['F1, F2: a picture on every story: the lead and two seconds large, Latest as rows with a thumbnail, a kicker, the headline and a small byline (no ISO date, no agent address).',
        'F3, F5: Now and next as three lines (today and the next two moments), linked to the summit day by day; one time block, not two.',
        'F4, F7: the mandate breaker becomes "Why we are different": its first sentence and Reach, Mandate, Gap, right after Latest on a phone (about one and a half screens down, was 6,272 px).',
        'F6: a kicker on every story from its first topic. F8: no floating Ask (it is in the bar or the Menu).'],
}

// ---- B. The visual wall: a grid of picture cards, magazine style; Now as a band across the top. ----
const B = {
    title: 'B. The visual wall',
    phone: () => `${topPhone}<div style="background:var(--band);color:var(--on-band);margin-top:12px"><div class="row" style="padding-top:10px;padding-bottom:10px;font-size:13.5px"><b style="color:#ff8f7d;font-size:11px;letter-spacing:.08em;text-transform:uppercase">Now</b>&nbsp; Portugal Tech Week begins today · Opening Night Monday 9 November</div></div>
<main class="row" style="padding-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
<div style="grid-column:1/-1">${fig(S[0])}<p class="k" style="margin-top:10px">${S[0].kicker}</p><h2 class="hed" style="font-size:27px;margin-top:4px">${S[0].title}</h2></div>
${S.slice(1, 9).map(s => `<div>${fig({ ...s, img: s.thumb })}<p class="k" style="margin-top:7px;font-size:10px">${s.kicker}</p><h3 class="hed" style="font-size:15.5px;margin-top:2px">${s.title}</h3></div>`).join('')}
<div style="grid-column:1/-1;background:var(--paper-2);padding:16px;margin-top:6px">${mandate}<div style="margin-top:10px">${lens}</div></div></main>`,
    desktop: () => `${topDesk}<div style="background:var(--band);color:var(--on-band)"><div class="row" style="--g:24px;padding-top:10px;padding-bottom:10px;display:flex;gap:28px;font-size:14px"><b style="color:#ff8f7d;font-size:11px;letter-spacing:.08em;text-transform:uppercase">Now and next</b>${NOW.map(([d, n, t]) => `<span><b>${d} ${n}</b> ${t}</span>`).join('')}</div></div>
<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px">
<div style="grid-column:span 2;grid-row:span 2">${fig(S[0])}<p class="k" style="margin-top:12px">${S[0].kicker}</p><h2 class="hed" style="font-size:36px;margin-top:6px">${S[0].title}</h2><p class="dek" style="font-size:17px;margin-top:8px">${S[0].sum}</p></div>
${S.slice(1, 9).map(s => `<div>${fig(s)}<p class="k" style="margin-top:8px">${s.kicker}</p><h3 class="hed" style="font-size:18px;margin-top:3px">${s.title}</h3><p class="by">${s.by}</p></div>`).join('')}
<div style="grid-column:1/-1;display:grid;grid-template-columns:1.2fr 1fr;gap:28px;background:var(--paper-2);padding:22px;margin-top:6px">${mandate}${lens}</div></main>`,
    notes: ['F1 at its strongest: every story is a picture card; the lead spans two columns. The page reads like a magazine\'s cover, and scrolls fast on a phone (two cards a row).',
        'Now and next as one dark band at the top, one line a moment (F3, F5).',
        'Why we are different as a tinted panel after the stories (F4, F7).',
        'Needs an image for every story every day: the generator and the AI images make it possible; the cost is about 0.07 USD a story on gemini-3.1-flash-image.'],
}

// ---- C. The briefing first: "Today in 30 seconds" above the lead (Dinis: a presentation on every big page). ----
const C = {
    title: 'C. The briefing first',
    phone: () => `${topPhone}<main class="row" style="padding-top:14px">
<section style="border:2px solid var(--ink);padding:14px"><p class="k" style="color:var(--red)">Friday 6 November · the briefing</p><h2 class="hed" style="font-size:24px;margin-top:4px">Before the summit, in 30 seconds</h2>
<ol style="margin:10px 0 0 18px;font-family:Newsreader;font-size:16.5px;line-height:1.4;display:grid;gap:6px"><li>Brazil, one of 2025's two largest delegations, comes back with a mission; counts run from 100 to about 300, and no public list names the companies.</li><li>Three Portuguese startups raised 1.1 to 1.6 million euros each this fortnight.</li><li>The European Commission brings a fireside chat, four masterclasses and stands to Pavilion 4.</li></ol>
<p style="margin-top:10px;font-size:13px;color:var(--brand)">▶ Play the briefing &nbsp;·&nbsp; Read the stories</p></section>
<div style="margin-top:18px">${fig(S[0])}</div><p class="k" style="margin-top:10px">${S[0].kicker}</p><h2 class="hed" style="font-size:26px;margin-top:4px">${S[0].title}</h2><p class="by">${S[0].by} · 5 min · signed</p>
<h3 class="sec">Latest <a>All articles</a></h3>${S.slice(1, 5).map(s => latestRow(s)).join('')}
<h3 class="sec">Now and next</h3>${nowStrip(false)}
<h3 class="sec">Why we are different</h3>${lens}</main>`,
    desktop: () => `${topDesk}<main class="row" style="--g:24px;padding-top:24px;display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:32px">
<section style="border:2px solid var(--ink);padding:18px;align-self:start"><p class="k" style="color:var(--red)">Friday 6 November · the briefing</p><h2 class="hed" style="font-size:26px;margin-top:6px">Before the summit, in 30 seconds</h2>
<ol style="margin:12px 0 0 18px;font-family:Newsreader;font-size:17px;line-height:1.4;display:grid;gap:8px"><li>Brazil, one of 2025's two largest delegations, comes back with a mission; counts run from 100 to about 300, and no public list names the companies.</li><li>Three Portuguese startups raised 1.1 to 1.6 million euros each this fortnight.</li><li>The European Commission brings a fireside chat, four masterclasses and stands to Pavilion 4.</li></ol>
<p style="margin-top:12px;font-size:13px;color:var(--brand)">▶ Play the briefing</p><h3 class="sec">Now and next</h3>${nowStrip(false)}</section>
<div>${fig(S[0])}<p class="k" style="margin-top:12px">${S[0].kicker}</p><h2 class="hed" style="font-size:36px;margin-top:6px">${S[0].title}</h2><p class="dek" style="font-size:18px;margin-top:8px">${S[0].sum}</p>
<div style="margin-top:22px">${fig(S[1])}</div><p class="k" style="margin-top:10px">${S[1].kicker}</p><h3 class="hed" style="font-size:24px;margin-top:4px">${S[1].title}</h3></div>
<aside><h3 class="sec" style="margin-top:0">Latest</h3>${S.slice(2, 8).map(s => latestRow(s, 80)).join('')}<h3 class="sec">Why we are different</h3>${lens}</aside></main>`,
    notes: ['A briefing card first: the day in three lines and a "play" that walks the stories (Dinis, 05:45: "just about every page ... should have a presentation ... a briefing of what\'s there").',
        'The briefing\'s lines are written by the correspondent each morning from the published stories, each line linking to its story; it never says what a story does not.',
        'Then the lead with its picture, Latest with thumbnails (F1, F2), Now and next, Why we are different (F7).',
        'The most "newsroom" of the three; it needs the correspondent\'s daily lines and dev@\'s player.'],
}

const V = { A, B, C }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-front-'))
const browser = await chromium.launch()
const made = []
for (const [k, v] of Object.entries(V)) for (const [dev, vp] of [['phone', { width: 390, height: 664 }], ['desktop', { width: 1440, height: 900 }]]) {
    const f = path.join(tmp, `${k}-${dev}.html`)
    fs.writeFileSync(f, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css}</style></head><body>${v[dev]()}<span class="note">Mock-up ${k}</span><div style="height:40px"></div></body></html>`)
    const p = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 })
    await p.goto(pathToFileURL(f).href, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready)
    const h = Math.min(await p.evaluate(() => document.documentElement.scrollHeight), dev === 'phone' ? 3400 : 2000)
    for (const [suffix, clip] of [['', { x: 0, y: 0, width: vp.width, height: vp.height }], ['--full', { x: 0, y: 0, width: vp.width, height: h }]]) {
        const name = `${k}--${dev}${suffix}.png`
        await p.screenshot({ path: path.join(OUT, name), clip, fullPage: !!suffix }); made.push(name)
    }
    await p.close()
}
await browser.close(); fs.rmSync(tmp, { recursive: true, force: true })
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ pass: 'board/passes/2026-11-06-the-front-page.md', by: 'designer@PrompTugal.dinis', variants: Object.fromEntries(Object.entries(V).map(([k, v]) => [k, { title: v.title, notes: v.notes }])) }, null, 1) + '\n')
console.log(`made ${made.length} images in ${OUT}`)
