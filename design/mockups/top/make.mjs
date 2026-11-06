// Mock-ups of the top of every page (pass board/passes/2026-11-06-the-top-of-the-page.md, round 1).
// designer@PrompTugal.dinis, session 2, 6 November 2026.
//
//   node design/mockups/top/make.mjs [--out DIR]  -> DIR/<variant>--<phone|desktop>[--ink].png (default: the OS temp dir)
//
// Static pictures of public pages only (security@'s condition): no signed-in view, no reader's data.
// The brand is placed unchanged: the outlined wordmark and the PT.news stamp from assets/brand/, the faces from
// assets/fonts/, the colours from assets/tokens.css. The words are the site's own (data/site/site.json) and the
// card's tagline; the stories are real headlines from content/articles/. Templates live here, not in .html files,
// because design/ ignores *.html (debrief, section 5).
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const U = p => pathToFileURL(path.join(root, p)).href
// The images go to a vault, not to git (Dinis, 6 November 2026): written outside the repository, --out <dir> to choose.
const oi = process.argv.indexOf('--out')
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-mockups-top')
fs.mkdirSync(OUT, { recursive: true })

const TAG = 'People and AI agents, reporting together.'
const SECTIONS = ['Now', 'Agenda', 'News', 'Companies', 'People', 'Portugal', 'The graph', 'About']
const LEAD = {
    kicker: 'Brazil',
    hed: "Brazil's startup mission comes to Web Summit Lisbon",
    dek: 'Brazil comes back to Lisbon with a mission led by ApexBrasil and Sebrae. Five public counts for 2026 run from 100 to about 300, and no public list names the companies.',
    img: 'design/infographics/out/brazil-startup-mission--paper--banner.png',
    img_ink: 'design/infographics/out/brazil-startup-mission--ink--banner.png',
}
const LATEST = [
    ['Europe', "Europe in Pavilion 4: the Commission's week at Web Summit", 'europe-in-pavilion-4'],
    ['Numbers', 'Web Summit 2026 in numbers: 70,000 people, 10,000 startups', 'web-summit-2026-in-numbers'],
    ['Universities', "Lisbon's universities at Web Summit: two stands and a pitch day", 'lisbon-universities-at-web-summit'],
]
const DAYS = [['Fri', 6, 'today'], ['Sat', 7], ['Sun', 8], ['Mon', 9, 'night'], ['Tue', 10, 'summit'], ['Wed', 11, 'summit'], ['Thu', 12, 'summit'], ['Fri', 13]]

const ICON = {
    search: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    ask: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 5h14v10H10l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    now: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" stroke-width="2"/></svg>',
    news: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="2"/></svg>',
}

const css = ink => `
@font-face{font-family:Newsreader;src:url(${U('assets/fonts/newsreader-variable.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(${U('assets/fonts/plex-sans-variable.woff2')}) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(${U('assets/fonts/plex-mono-400.woff2')}) format('woff2');font-weight:400}
@font-face{font-family:"IBM Plex Mono";src:url(${U('assets/fonts/plex-mono-500.woff2')}) format('woff2');font-weight:500}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--panel:#fffdf8;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;
--red:#c52830;--brand:#006600;--brand-soft:#e2eedf;--live:#b42318;--band:#121317;--on-band:#f6f3ec;--on-band-2:#c8c4ba;
--serif:Newsreader,Georgia,serif;--sans:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",monospace}
${ink ? ':root{--paper:#111214;--paper-2:#1a1b1e;--panel:#1e1f23;--ink:#eceae4;--ink-2:#c3c0b7;--ink-3:#a6a39a;--rule-2:#5f5b51;--hair:#2e2f34;--red:#f07278;--brand:#6dbb7e;--brand-soft:#16281c;--live:#ff8f7d;--band:#1e1f23}' : ''}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:15px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wm{display:block;height:var(--wmh,30px);width:auto}
.wm-d{display:${ink ? 'block' : 'none'}} .wm-l{display:${ink ? 'none' : 'block'}}
.row{max-width:1200px;margin:0 auto;padding:0 var(--g,16px);display:flex;align-items:center;gap:12px}
.mono{font-family:var(--mono);font-size:12px;letter-spacing:.02em;color:var(--ink-3)}
.green{color:var(--brand)}
.pill{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:1px solid var(--rule-2);border-radius:999px;font-size:14px;white-space:nowrap;background:transparent;color:var(--ink)}
.pill.solid{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.pill .k{font-family:var(--mono);font-size:11px;border:1px solid var(--hair);border-radius:3px;padding:0 4px;color:var(--ink-3)}
.credit b{font-family:var(--mono);font-weight:500;font-size:13px} .credit span{font-size:12px;color:var(--ink-3)}
.sections a{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:14px 0;margin-right:22px;border-bottom:3px solid transparent;white-space:nowrap}
.sections[style*='--sm'] a{margin-right:16px;font-size:12px}
.sections a.on{border-color:var(--brand)}
.tag{font-family:var(--serif);font-style:italic;font-size:17px;color:var(--ink-2)}
.indep{font-size:13px;color:var(--ink-3)} .indep a{text-decoration:underline;color:var(--brand)}
.kicker{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
.hed{font-family:var(--serif);font-weight:600;line-height:1.1;letter-spacing:-.01em}
.dek{font-family:var(--serif);color:var(--ink-2);line-height:1.45}
.img{display:block;width:100%;height:auto;border:1px solid var(--hair)}
.note{position:fixed;right:8px;top:50%;background:var(--live);color:#fff;font:600 11px var(--sans);padding:3px 7px;border-radius:3px;letter-spacing:.04em;text-transform:uppercase;z-index:9}
`

const wordmark = h => `<span style="--wmh:${h}px"><img class="wm wm-l" src="${U('assets/brand/promptugal-wordmark-light.svg')}" alt="PrompTugal.news"><img class="wm wm-d" src="${U('assets/brand/promptugal-wordmark-dark.svg')}" alt=""></span>`
const stamp = (h, ink) => `<img src="${U(`assets/brand/pt-news-stamp-${ink ? 'dark' : 'light'}.svg`)}" alt="PT.news" style="height:${h}px;width:${h}px;display:block">`
const credit = (word = true) => `<a class="pill credit" href="#"><b>£5.00</b>${word ? '<span>credit</span>' : '<span>cr</span>'}</a>`

// What follows the top on the front page: the lead with its image, so each mock-up shows where the page begins.
const leadPhone = ink => `<section style="padding:16px 16px 0">
<img class="img" src="${U(ink ? LEAD.img_ink : LEAD.img)}" alt="">
<p class="kicker" style="margin-top:12px">${LEAD.kicker}</p>
<h2 class="hed" style="font-size:27px;margin-top:4px">${LEAD.hed}</h2>
<p class="dek" style="font-size:17px;margin-top:8px">${LEAD.dek}</p></section>`
const leadDesk = ink => `<section class="row" style="--g:24px;align-items:flex-start;gap:40px;padding-top:28px">
<div style="flex:1.7"><img class="img" src="${U(ink ? LEAD.img_ink : LEAD.img)}" alt="">
<p class="kicker" style="margin-top:14px">${LEAD.kicker}</p><h2 class="hed" style="font-size:40px;margin-top:6px">${LEAD.hed}</h2>
<p class="dek" style="font-size:19px;margin-top:10px;max-width:40em">${LEAD.dek}</p></div>
<div style="flex:1;border-top:2px solid var(--ink);padding-top:10px"><p class="kicker" style="color:var(--ink)">Latest</p>
${LATEST.map(([k, h, s]) => `<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--hair)"><img src="${U(`design/infographics/out/${s}--${ink ? 'ink' : 'paper'}--thumb.png`)}" style="width:88px;height:66px;object-fit:cover;border:1px solid var(--hair)"><div><p class="kicker">${k}</p><p class="hed" style="font-size:17px;margin-top:2px">${h}</p></div></div>`).join('')}
</div></section>`

// ---- A. One bar. The logo left, everything else right, one row; the sections a second slim row. ----
const A = {
    title: 'A. One bar',
    phone: ink => `<header style="border-bottom:1px solid var(--rule-2)">
<div class="row" style="height:56px;justify-content:space-between;gap:6px">${wordmark(20)}
<div style="display:flex;gap:5px"><a class="pill" href="#" style="padding:0 9px" aria-label="Search">${ICON.search}</a>${credit()}<a class="pill" href="#" style="padding:0 10px">${ICON.menu}<span>Menu</span></a></div></div>
<nav class="row sections" style="overflow:hidden;height:40px;border-top:1px solid var(--hair);--sm:1"><a class="on">Now</a><a>Agenda</a><a>News</a><a>Companies</a><a style="color:var(--brand)">More ▾</a></nav>
</header>
<p class="row tag" style="font-size:15px;padding-top:10px">${TAG} <span class="indep" style="font-style:normal">&nbsp;Independent.</span></p>
${leadPhone(ink)}`,
    desktop: ink => `<div style="border-bottom:1px solid var(--hair)"><div class="row mono" style="--g:24px;height:30px;justify-content:space-between"><span>Lisbon · Friday 6 November 2026</span><span><span class="green">4 days to the summit</span> · v0.1.115</span><span>Newsroom · Sign in</span></div></div>
<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="--g:24px;height:68px;gap:28px">${wordmark(34)}
<nav class="sections" style="display:flex;flex:1;align-self:stretch;align-items:flex-end;margin-left:8px">${SECTIONS.map((s, i) => `<a class="${i ? '' : 'on'}" style="padding:0 0 22px">${s}</a>`).join('')}</nav>
<a class="pill" href="#">${ICON.search}<span>Search</span><span class="k">/</span></a>${credit()}<a class="pill solid" href="#">${ICON.ask}<span>Ask</span></a></div></header>
<div class="row" style="--g:24px;height:40px;justify-content:space-between;border-bottom:1px solid var(--hair)"><span class="tag">${TAG}</span><span class="indep">Independent. Not affiliated with Web Summit. <a>Our disclosure</a></span></div>
${leadDesk(ink)}`,
    notes: [
        'The logo at the left and everything else at the right, in one row: 56 px on a phone, 68 px on a desktop with the eight sections in the same row.',
        'Phone: Search, the credit (labelled "credit") and a Menu that holds every section, the Newsroom, Sign in and the theme. Four sections and More on a slim second row.',
        'The card tagline once, as one line under the bar, with the independence line beside it. No Powered by RiskMandate, no Vault, no theme picker in the top (footer and menu).',
        'Ask is in the bar on a desktop and in the Menu on a phone: no floating button over the stories (T11, F8).',
    ],
}

// ---- B. The newspaper. A slim nameplate for the front page: logo left, tagline and independence right. ----
const B = {
    title: 'B. The slim nameplate',
    phone: ink => `<div class="row mono" style="height:40px;justify-content:space-between;border-bottom:1px solid var(--hair)"><span>Fri 6 Nov · <span class="green">4 days to go</span></span>${credit()}</div>
<header class="row" style="height:64px;justify-content:space-between">${wordmark(30)}<a class="pill" href="#">${ICON.menu}<span>Menu</span></a></header>
<p class="row tag" style="font-size:15px;margin-top:-6px">${TAG}</p>
<nav class="row" style="flex-wrap:wrap;gap:6px;padding-top:10px;padding-bottom:10px;border-bottom:3px double var(--ink)">${['Now', 'Agenda', 'News', 'Companies', 'People', 'Portugal', 'Graph', 'Search'].map((s, i) => `<a class="pill" style="height:30px;padding:0 10px;font-size:13px;${i ? '' : 'background:var(--brand-soft);border-color:var(--brand)'}">${s === 'Search' ? ICON.search + ' Search' : s}</a>`).join('')}</nav>
${leadPhone(ink)}`,
    desktop: ink => `<div style="border-bottom:1px solid var(--hair)"><div class="row mono" style="--g:24px;height:32px;justify-content:space-between"><span>Lisbon · Friday 6 November 2026 · <span class="green">4 days to the summit</span></span><span style="display:flex;gap:14px;align-items:center">Newsroom · Sign in ${credit()}</span></div></div>
<header class="row" style="--g:24px;height:104px;justify-content:space-between;align-items:flex-end;padding-bottom:16px">${wordmark(58)}
<div style="text-align:right;max-width:430px"><p class="tag" style="font-size:22px;color:var(--ink)">${TAG}</p><p class="indep" style="margin-top:6px">Every fact sourced and dated. Independent: not affiliated with Web Summit. <a>Our disclosure</a></p></div></header>
<nav style="border-top:3px double var(--ink);border-bottom:1px solid var(--rule-2)"><div class="row sections" style="--g:24px">${SECTIONS.map((s, i) => `<a class="${i ? '' : 'on'}">${s}</a>`).join('')}<span style="flex:1"></span><a class="pill" href="#" style="text-transform:none;letter-spacing:0;font-weight:400;margin:0;border:1px solid var(--rule-2);padding:0 12px">${ICON.search}<span>Search</span></a><a class="pill solid" href="#" style="text-transform:none;letter-spacing:0;font-weight:400;margin:0;padding:0 12px;border-bottom:1px solid var(--ink)">${ICON.ask}<span>Ask</span></a></div></nav>
${leadDesk(ink)}`,
    notes: [
        'The front page keeps a nameplate, but slim and left-aligned: the logo left, the card tagline and the two boxes\' words at its right as two lines (T10). Inner pages use the bar of option A.',
        'The credit top right, always, in the dateline, beside Newsroom and Sign in (T6).',
        'Phone: every section as a chip in two short rows, Search labelled as a word (T1, T12); Menu holds the Newsroom, Sign in, About and the theme.',
        'The top is 168 px on a phone (was 230) and 202 px on a desktop (was 294).',
    ],
}

// ---- C. The app. A compact top and a tab bar at the bottom of the phone, where the thumb is. ----
const C = {
    title: 'C. The app: tabs at the bottom',
    phone: ink => `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="height:52px;justify-content:space-between">
<div style="display:flex;align-items:center;gap:10px">${stamp(32, ink)}<div><p style="font-size:12px;font-weight:600;line-height:1.1">PrompTugal.news</p><p class="mono" style="font-size:11px">Fri 6 Nov · <span class="green">4 days to go</span></p></div></div>
${credit()}</div></header>
<p class="row tag" style="font-size:15px;padding-top:10px">${TAG}</p>
${leadPhone(ink)}
<nav style="position:fixed;left:0;right:0;bottom:0;height:62px;background:var(--panel);border-top:1px solid var(--rule-2);display:flex;justify-content:space-around;align-items:center">
${[['now', 'Now', 1], ['cal', 'Agenda'], ['news', 'News'], ['search', 'Search'], ['ask', 'Ask'], ['menu', 'More']].map(([i, l, on]) => `<a style="display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:600;color:${on ? 'var(--brand)' : 'var(--ink-2)'}">${ICON[i]}${l}</a>`).join('')}</nav>`,
    desktop: ink => `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="--g:24px;height:72px;gap:24px">${wordmark(36)}
<div style="flex:1;display:flex;align-items:center;gap:10px;height:40px;border:1px solid var(--rule-2);border-radius:999px;padding:0 14px;min-width:340px;max-width:420px;margin-left:16px;color:var(--ink-3)">${ICON.search}<span style="white-space:nowrap;overflow:hidden">Search companies, people, events</span><span class="k" style="margin-left:auto;font-family:var(--mono);font-size:11px;border:1px solid var(--hair);border-radius:3px;padding:0 4px">/</span></div>
<span style="flex:1"></span><span class="mono">Fri 6 Nov · <span class="green">4 days to go</span></span><span class="mono">Newsroom · Sign in</span>${credit()}<a class="pill solid">${ICON.ask}<span>Ask</span></a></div>
<nav class="row sections" style="--g:24px">${SECTIONS.map((s, i) => `<a class="${i ? '' : 'on'}" style="padding:10px 0">${s}</a>`).join('')}<span style="flex:1"></span><span class="tag" style="font-size:15px">${TAG}</span></nav></header>
${leadDesk(ink)}`,
    notes: [
        'Phone: the PT.news stamp and the name at the left, the credit at the right, one 52 px row; the first story starts in the first third of the screen.',
        'The sections a reader uses most, Search and Ask move to a tab bar at the bottom, where the thumb is; More holds the rest, the Newsroom and Sign in. No floating Ask covers a story.',
        'Desktop: search as a real field (it is the newsroom search pass\'s door), the date, Newsroom, the credit and Ask at the right; the sections and the tagline on the second row.',
        'The most app-like; it needs dev@ to keep the bottom bar out of the way of the page\'s own end.',
    ],
}

// ---- D. The summit edition. Option A's bar, with the summit's days as the second row (the summit days pass). ----
const strip = (small) => `<div style="display:flex;gap:${small ? 4 : 6}px">${DAYS.map(([d, n, k]) => `<a style="flex:${small ? '0 0 auto' : 1};min-width:${small ? 44 : 0}px;text-align:center;padding:${small ? '5px 0' : '6px 0'};border-radius:3px;border:1px solid ${k === 'today' ? 'var(--ink)' : 'var(--hair)'};background:${k === 'today' ? 'var(--ink)' : k === 'summit' || k === 'night' ? 'var(--brand-soft)' : 'transparent'};color:${k === 'today' ? 'var(--paper)' : 'var(--ink)'}"><span style="display:block;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;opacity:.8">${k === 'today' ? 'Today' : d}</span><span style="font-family:var(--serif);font-size:${small ? 17 : 19}px;font-weight:600">${n}</span></a>`).join('')}</div>`
const D = {
    title: 'D. The summit edition: the days in the top',
    phone: ink => `<header style="border-bottom:1px solid var(--rule-2)">
<div class="row" style="height:56px;justify-content:space-between">${wordmark(26)}<div style="display:flex;gap:6px">${credit()}<a class="pill" href="#">${ICON.menu}<span>Menu</span></a></div></div>
<div style="padding:4px 16px 10px;overflow:hidden">${strip(true)}</div></header>
<p class="row tag" style="font-size:15px;padding-top:10px">${TAG}</p>
${leadPhone(ink)}`,
    desktop: ink => `<header style="border-bottom:1px solid var(--rule-2)"><div class="row" style="--g:24px;height:68px;gap:28px">${wordmark(34)}
<nav class="sections" style="display:flex;flex:1;align-self:stretch;align-items:flex-end;margin-left:8px">${SECTIONS.map((s, i) => `<a class="${i ? '' : 'on'}" style="padding:0 0 22px">${s}</a>`).join('')}</nav>
<a class="pill">${ICON.search}<span>Search</span></a>${credit()}<a class="pill solid">${ICON.ask}<span>Ask</span></a></div></header>
<div style="border-bottom:1px solid var(--hair)"><div class="row" style="--g:24px;padding-top:10px;padding-bottom:10px;gap:24px"><div style="width:250px"><p class="kicker" style="color:var(--ink)">Web Summit Lisbon</p><p class="tag" style="font-size:15px">${TAG}</p></div><div style="flex:1">${strip(false)}</div></div></div>
${leadDesk(ink)}`,
    notes: [
        'Option A\'s bar, and under it the summit\'s days, Friday 6 to Friday 13 November: today in ink, Opening Night and the three conference days tinted, the rest plain.',
        'A day before today opens the front page as it was that day; a day after shows what is on then (the summit days pass, board/passes/2026-11-06-the-summit-days.md).',
        'It carries the edition in the top without a line of text: the strip is the countdown. After the summit the strip leaves the top.',
        'The strip is a feature for dev@ (one per day, from data/events); the mock-up only shows where it sits.',
    ],
}


// ---- Decided (PT decision, 6 November 2026, 13:45 UTC): A, with sherpa@'s three refinements (its verdict of 12:50):
// the strip of days under A's two rows (not instead of them), one door (the Menu, no "More"), all eight days fitting at 390 px.
const stripFit = small => `<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:${small ? 3 : 6}px">${DAYS.map(([d, n, k]) => `<a style="min-width:0;text-align:center;padding:${small ? '4px 0' : '6px 0'};border-radius:3px;border:1px solid ${k === 'today' ? 'var(--ink)' : 'var(--hair)'};background:${k === 'today' ? 'var(--ink)' : k === 'summit' || k === 'night' ? 'var(--brand-soft)' : 'transparent'};color:${k === 'today' ? 'var(--paper)' : 'var(--ink)'}"><span style="display:block;font-size:${small ? 9 : 10}px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;opacity:.8">${k === 'today' ? 'Today' : d}</span><span style="font-family:var(--serif);font-size:${small ? 16 : 19}px;font-weight:600">${n}</span></a>`).join('')}</div>`
const DECIDED = {
    title: 'Decided: A, with the days under it',
    phone: ink => A.phone(ink).replace('<a style="color:var(--brand)">More ▾</a>', '<a>People</a>').replace('</nav>\n</header>', `</nav>\n<div style="padding:6px 16px 8px;border-top:1px solid var(--hair)">${stripFit(true)}</div>\n</header>`),
    desktop: ink => A.desktop(ink).replace('Every fact sourced and dated.', 'Every fact links to its source, with the date we read it.').replace('</header>', `</header>\n<div style="border-bottom:1px solid var(--hair)"><div class="row" style="--g:24px;padding-top:8px;padding-bottom:8px;gap:24px"><p class="kicker" style="color:var(--ink);width:180px">Web Summit Lisbon · the days</p><div style="flex:1">${stripFit(false)}</div></div></div>`),
    notes: ['The PT decision: A on every page, with the strip of days under its two rows on the front page and the summit pages until 13 November.',
        'sherpa@\'s refinements: the strip under A, not instead of it (search and the sections stay); one door, the Menu (no "More" beside it); all eight days fit a 390 px phone.'],
}

// ---- Answered by Dinis (13:20 UTC, board/guidance/2026-11-06-the-four-design-decisions.md): C on every page, with D's strip of days
// on the front page and the summit pages. Two refinements within C, for sherpa@'s two concerns of 12:50: Companies gets a tab
// (Ask moves to the top row beside the credit), and the tab bar keeps clear of the phone's bottom edge (safe area).
const ICON_CO = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4" y="9" width="7" height="11" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="4" width="7" height="16" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
const FINAL = {
    title: 'Answered: C on every page, with the days on the front page',
    phone: ink => C.phone(ink)
        .replace(' · <span class="green">4 days to go</span>', '')
        .replace(/(<\/div><\/div>\n)(<a class="pill credit"[\s\S]*?<\/a>)(<\/div><\/header>)/, (m, a, cr, b) => `${a}<div style="display:flex;gap:5px">${cr}<a class="pill" style="padding:0 10px">${ICON.ask}<span>Ask</span></a></div>${b}`)
        .replace('</header>', `<div style="padding:6px 16px 8px;border-top:1px solid var(--hair)">${stripFit(true)}</div></header>`)
        .replace(/\[\['now', 'Now', 1\][^\n]*?\]\]/, '')
        .replace(/<nav style="position:fixed;left:0;right:0;bottom:0;height:62px([^"]*)">\n[\s\S]*?<\/nav>/, (m, st) => `<nav style="position:fixed;left:0;right:0;bottom:0;height:62px${st}">\n${[['now', 'Now', 1], ['cal', 'Agenda'], ['news', 'News'], ['co', 'Companies'], ['search', 'Search'], ['menu', 'More']].map(([i, l, on]) => `<a style="display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;font-weight:600;color:${on ? 'var(--brand)' : 'var(--ink-2)'}">${i === 'co' ? ICON_CO : ICON[i]}${l}</a>`).join('')}</nav>`),
    desktop: ink => C.desktop(ink).replace('</header>', `</header>\n<div style="border-bottom:1px solid var(--hair)"><div class="row" style="--g:24px;padding-top:8px;padding-bottom:8px;gap:24px"><p class="kicker" style="color:var(--ink);width:180px">Web Summit Lisbon · the days</p><div style="flex:1">${stripFit(false)}</div></div></div>`),
    notes: ['Dinis, 13:20 UTC: C on every page, with D\'s strip of the summit\'s days on the front page and the summit pages.',
        'Refinements within C, for sherpa@\'s concerns: a Companies tab (Ask moves to the top row beside the credit); the tab bar sits above the phone\'s safe area, clear of Safari\'s own bar.'],
}
const VARIANTS = { A, B, C, D, DECIDED, FINAL }
const page = (body, ink, label) => `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css(ink)}</style></head><body>${body}<span class="note">Mock-up ${label}</span></body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-top-'))
const browser = await chromium.launch()
const made = []
for (const [key, v] of Object.entries(VARIANTS)) {
    for (const ink of [false, true]) {
        for (const [dev, vp] of [['phone', { width: 390, height: 664 }], ['desktop', { width: 1440, height: 900 }]]) {
            const file = path.join(tmp, `${key}-${dev}-${ink}.html`)
            fs.writeFileSync(file, page(v[dev](ink), ink, key))
            const p = await browser.newPage({ viewport: vp, deviceScaleFactor: dev === 'phone' ? 2 : 1 })
            await p.goto(pathToFileURL(file).href, { waitUntil: 'load' })
            await p.evaluate(() => document.fonts.ready)
            const name = `${key}--${dev}${ink ? '--ink' : ''}.png`
            await p.screenshot({ path: path.join(OUT, name) })
            await p.close()
            made.push(name)
        }
    }
}
await browser.close()
fs.rmSync(tmp, { recursive: true, force: true })
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({
    pass: 'board/passes/2026-11-06-the-top-of-the-page.md', by: 'designer@PrompTugal.dinis', made: new Date().toISOString().slice(0, 16) + 'Z',
    variants: Object.fromEntries(Object.entries(VARIANTS).map(([k, v]) => [k, { title: v.title, notes: v.notes, images: made.filter(m => m.startsWith(k + '--')) }])),
}, null, 1) + '\n')
console.log(`made ${made.length} images in ${OUT}`)
