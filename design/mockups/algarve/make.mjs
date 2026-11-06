// The Algarve Evolution mini-site, the design for dev.portugal@ (sprint board/passes/2026-11-06-algarve-evolution-sprint.md).
// designer@PrompTugal.dinis, 6 November 2026, 14:15 UTC. Dinis (14:10): "feel free to go wide ... almost create a mini site here".
//
//   node design/mockups/algarve/make.mjs [--out DIR]  -> DIR/algarve.html (self-contained, lift the CSS and the structure)
//                                                        and algarve--<phone|desktop>[--full].png
//
// Every fact on it is from content/portugal/algarve-evolution.md (public, sourced, read 6 November 2026); self-reported
// figures say so. No person named, no contact detail. The structure, class names and CSS are the spec: copy them.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-algarve')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/portugal/algarve-evolution-graph.svg'), path.join(OUT, 'graph.svg'))

const TIMELINE = [
    ['2018', 'Starts', 'A small group of local entrepreneurs begins building the Algarve\'s innovation community.'],
    ['Sep 2025', 'Algarve Digital Innovators', 'A network of innovation communities across the 16 municipalities, launched in Lagos.'],
    ['2025', 'Web Summit Lisbon 2025', 'A project partner, with the University of Algarve, AMAL, Algarve STP and NERA, taking Algarve startups to the summit.'],
    ['Nov 2025', 'Algarve Tech Hub Summit, Lagos', 'More than 500 participants (reported).'],
    ['Jan 2026', 'Incubator recognised', 'The Algarve Evolution Incubator, recognised by Startup Portugal.'],
    ['Jul 2026', 'Venture Lab by AlgarveSTP', 'One of six partners; 12 startups and SMEs selected for mentoring.'],
    ['Oct 2026', 'Founder2Founder', 'A six-month growth programme: 8 companies from 41 applications, no equity taken.'],
    ['Nov 2026', 'Targets for 2032', '500 companies supported, 150 startups, 50,000 people.', 'now'],
    ['2027', 'Early-stage incubation', 'Planned.', 'future'],
]
const PROGRAMMES = [
    ['Algarve Digital Innovators', 'Network', 'Innovation communities in all 16 municipalities, since September 2025.'],
    ['Founder2Founder', 'Growth', 'Six months, 8 companies from 41 applications, no equity.'],
    ['Algarve Evolution Incubator', 'Incubation', 'Recognised by Startup Portugal, January 2026.'],
    ['INOVA ALGARVE 3.0', 'Tourism SMEs', 'Digital transition; a pilot of free AI and robotics consultancy for 20 SMEs.'],
    ['Algarve Tech Hub Summit', 'Event', 'With the University of Algarve and Algarve STP; 500+ in Lagos, 2025.'],
    ['Grow Algarve Meetup', 'Community', '1,623 members, monthly gatherings across the municipalities.'],
    ['Venture Lab by AlgarveSTP', 'Mentoring', 'One of six partners; 12 companies selected, July 2026.'],
    ['Education', 'Talent', 'With the University of Algarve, Junior Achievement Portugal and Vibathon Algarve.'],
    ['Collaboration Platform for Digitalization', 'Policy', 'Towards a Regional Collaborative Plan, with recommendations for CCDR-Algarve.'],
]
const PARTNERS = [['Knowledge', ['University of Algarve', 'Algarve STP']], ['The region', ['AMAL', 'CCDR-Algarve', 'NERA']], ['National', ['Startup Portugal', 'ANJE', 'Junior Achievement Portugal']], ['Data', ['Informa D&B']]]
const WEEK = [['7 Nov', 'DevFest Lagos 2026', 'Lagos', 'Partner'], ['5 to 7 Nov', 'TMCT\'26, Tourism Management and Computing Technologies', 'Portimão', 'On its calendar'], ['6 Nov', 'Private Wealth and Investment Gathering', 'Almancil · invitation only', 'On its calendar']]
const MAP = [['who', 'Who they are'], ['numbers', 'In numbers'], ['timeline', 'The story so far'], ['programmes', 'Programmes'], ['partners', 'Partners'], ['graph', 'The map'], ['week', 'Summit week'], ['correct', 'Correct us']]

const css = `
@font-face{font-family:Newsreader;src:url(newsreader-variable.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:"IBM Plex Sans";src:url(plex-sans-variable.woff2) format('woff2');font-weight:100 700}
@font-face{font-family:"IBM Plex Mono";src:url(plex-mono-400.woff2) format('woff2')}
:root{--paper:#f6f3ec;--paper-2:#ece7db;--panel:#fffdf8;--ink:#121317;--ink-2:#3f424a;--ink-3:#595c64;--rule-2:#9d9580;--hair:#d9d2c1;--red:#c52830;--green:#006600;--soft:#e2eedf;--sea:#1f4fa0;--sea-soft:#e3eaf5;--sand:#f3e7c9}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:var(--green)}
.ae-crumb{font-size:13px;color:var(--ink-3);padding:12px 0}.ae-crumb a{color:var(--ink-3)}
.wrap{max-width:1360px;margin:0 auto;padding:0 20px}
/* HERO: full bleed, the Algarve's sea and sand in the brand's cobalt and paper */
.ae-hero{background:linear-gradient(180deg,var(--sea-soft),var(--paper));border-bottom:1px solid var(--hair);padding:28px 0 32px}
.ae-kicker{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--sea)}
.ae-hero h1{font-family:Newsreader,serif;font-weight:600;font-size:clamp(40px,7vw,76px);line-height:1;letter-spacing:-.02em;margin-top:8px}
.ae-mandate{font-family:Newsreader,serif;font-size:clamp(20px,2.6vw,28px);line-height:1.3;color:var(--ink-2);max-width:30em;margin-top:12px}
.ae-mandate b{color:var(--ink)}
.ae-tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:24px}
.ae-tile{background:var(--panel);border:1px solid var(--hair);border-top:4px solid var(--c,var(--green));padding:12px 14px}
.ae-tile b{display:block;font-family:Newsreader,serif;font-size:clamp(28px,3.4vw,40px);line-height:1}
.ae-tile span{display:block;font-size:13px;color:var(--ink-2);margin-top:4px}.ae-tile i{display:block;font-style:normal;font-size:11px;color:var(--ink-3);margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
.ae-tiles-3{grid-template-columns:repeat(3,1fr)}
.ae-tiles .goal{--c:var(--green)}.ae-tiles .self{--c:var(--sea)}
/* BODY: a left-hand map (sticky) and the content */
.ae-body{display:grid;grid-template-columns:220px 1fr;gap:40px;padding-top:28px}
.ae-map{position:sticky;top:16px;align-self:start;border-left:3px solid var(--ink);padding-left:12px}
.ae-map p{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px}
.ae-map a{display:block;color:var(--ink-2);text-decoration:none;font-size:14.5px;padding:5px 0}.ae-map a.on{color:var(--ink);font-weight:600}
.ae-map .modes{margin-top:14px;display:flex;gap:4px}.ae-map .modes span{font-size:11px;border:1px solid var(--rule-2);border-radius:999px;padding:2px 8px}.ae-map .modes span.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
section.ae{border-top:2px solid var(--ink);padding:14px 0 28px}
section.ae>h2{display:flex;justify-content:space-between;align-items:baseline;font-family:Newsreader,serif;font-size:28px;font-weight:600}
section.ae>h2 small{font:500 12px "IBM Plex Sans";color:var(--ink-3)}
.lead{font-family:Newsreader,serif;font-size:19px;color:var(--ink-2);max-width:42em;margin-top:6px}
/* TIMELINE: horizontal on a desktop, vertical on a phone */
.ae-tl{display:grid;grid-template-columns:repeat(9,1fr);gap:0;margin-top:18px;position:relative}
.ae-tl:before{content:"";position:absolute;left:0;right:0;top:9px;height:3px;background:var(--ink)}
.ae-tl div{position:relative;padding:22px 10px 0 0}
.ae-tl div:before{content:"";position:absolute;top:2px;left:0;width:17px;height:17px;border-radius:50%;background:var(--paper);border:3px solid var(--ink)}
.ae-tl div.now:before{background:var(--red);border-color:var(--red)}.ae-tl div.future:before{border-style:dashed;border-color:var(--ink-3)}
.ae-tl b{display:block;font:600 12px "IBM Plex Mono";color:var(--ink-3)}.ae-tl strong{display:block;font-family:Newsreader,serif;font-size:16px;line-height:1.2;margin-top:3px}.ae-tl span{display:block;font-size:12.5px;color:var(--ink-2);margin-top:4px}
/* PROGRAMMES: cards */
.ae-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
.ae-card{background:var(--panel);border:1px solid var(--hair);padding:14px}.ae-card i{font-style:normal;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--sea)}
.ae-card h3{font-family:Newsreader,serif;font-size:20px;line-height:1.15;margin-top:3px}.ae-card p{font-size:14px;color:var(--ink-2);margin-top:6px}
/* PARTNERS: grouped, around the centre */
.ae-partners{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px}
.ae-partners div{border-top:3px solid var(--sea);padding-top:8px}.ae-partners p{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)}
.ae-partners span{display:inline-block;margin:6px 6px 0 0;border:1px solid var(--rule-2);border-radius:999px;padding:3px 10px;font-size:14px;background:var(--panel)}
.ae-graph{background:var(--panel);border:1px solid var(--hair);padding:12px;margin-top:16px}.ae-graph img{width:100%;display:block}
/* SUMMIT WEEK */
.ae-week{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
.ae-ev{border:1px solid var(--hair);background:var(--panel);padding:12px 14px}.ae-ev b{font:600 13px "IBM Plex Mono";color:var(--red)}.ae-ev h3{font-family:Newsreader,serif;font-size:18px;line-height:1.2;margin-top:4px}.ae-ev p{font-size:13px;color:var(--ink-3);margin-top:4px}
.ae-ev em{font-style:normal;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;background:var(--soft);color:var(--green);padding:2px 6px;border-radius:2px}
/* CORRECT US */
.ae-correct{background:var(--ink);color:var(--paper);padding:20px;margin-top:8px}.ae-correct h2{font-family:Newsreader,serif;font-size:26px}.ae-correct p{color:#c8c4ba;margin-top:6px;max-width:44em}
.ae-correct a{display:inline-block;margin-top:12px;background:var(--paper);color:var(--ink);padding:8px 14px;font-weight:600;text-decoration:none}
.src{font-size:12px;color:var(--ink-3);margin-top:10px}
/* PHONE */
@media (max-width:760px){
 .ae-tiles,.ae-tiles-3{grid-template-columns:repeat(2,1fr)}
 .ae-tile b{font-size:28px}
 section.ae>h2{display:block}section.ae>h2 small{display:block;margin-top:2px}
 .ae-body{grid-template-columns:1fr;gap:0}
 .ae-map{position:sticky;top:0;z-index:2;background:var(--paper);border-left:0;border-bottom:1px solid var(--hair);padding:8px 0;display:flex;gap:14px;overflow-x:auto;white-space:nowrap}
 .ae-map p,.ae-map .modes{display:none}.ae-map a{padding:2px 0;font-size:14px}
 .ae-tl{grid-template-columns:1fr}.ae-tl:before{left:7px;right:auto;top:0;bottom:0;width:3px;height:auto}.ae-tl div{padding:0 0 14px 30px}.ae-tl div:before{top:0}
 .ae-cards,.ae-partners,.ae-week{grid-template-columns:1fr}
}
.note{position:fixed;right:8px;top:8px;background:var(--red);color:#fff;font:600 11px "IBM Plex Sans";padding:3px 7px;border-radius:3px;text-transform:uppercase;z-index:9}
`
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Algarve Evolution · PrompTugal.news (design)</title><style>${css}</style></head><body>
<div class="ae-hero"><div class="wrap">
<p class="ae-crumb"><a>Home</a> / <a>Portugal</a> / Algarve Evolution</p>
<p class="ae-kicker">Portugal · the Algarve · Faro</p>
<h1>Algarve Evolution</h1>
<p class="ae-mandate"><b>Building the Algarve's innovation economy beyond tourism:</b> connecting entrepreneurs, talent, startups, SMEs and partners across the region's 16 municipalities, since 2018.</p>
<div class="ae-tiles">
<div class="ae-tile goal"><b>500</b><span>companies to support</span><i>goal for 2032</i></div>
<div class="ae-tile goal"><b>150</b><span>startups to help create</span><i>goal for 2032</i></div>
<div class="ae-tile goal"><b>50,000</b><span>people to reach</span><i>goal for 2032</i></div>
<div class="ae-tile self"><b>118</b><span>active members</span><i>self-reported</i></div>
<div class="ae-tile self"><b>142+</b><span>events in 2024 and 2025</span><i>self-reported</i></div>
<div class="ae-tile self"><b>5,597</b><span>participants</span><i>self-reported</i></div>
</div>
<p class="src">Goals and figures as reported by Portugal Startup News, 1 November 2026, read 6 November 2026. Self-reported figures are Algarve Evolution's own; we have not verified them.</p>
</div></div>
<div class="wrap ae-body">
<nav class="ae-map" aria-label="On this page"><p>On this page</p>${MAP.map(([id, t], i) => `<a href="#${id}" class="${i ? '' : 'on'}">${t}</a>`).join('')}<div class="modes"><span class="on">Everything</span><span>Short</span></div></nav>
<main>
<section class="ae" id="who"><h2>Who they are <small>sources: Portugal Startup News, algarveevolution.pt</small></h2>
<p class="lead">A Faro-based association that connects entrepreneurs, talent, startups, SMEs and partners to build an innovation ecosystem in the Algarve. In 2026, as its executive director puts it, the work moves from building a community to making the ecosystem work.</p></section>
<section class="ae" id="numbers"><h2>In numbers <small>self-reported unless marked</small></h2>
<div class="ae-tiles ae-tiles-3">
<div class="ae-tile self"><b>~100M €</b><span>combined annual turnover of members</span><i>self-reported · about the members</i></div>
<div class="ae-tile self"><b>~1,000</b><span>direct jobs at members</span><i>self-reported · about the members</i></div>
<div class="ae-tile" style="--c:var(--ink)"><b>115</b><span>startups in the Algarve in 2024, up 16%; 95% microenterprises</span><i>Informa D&B study, Nov 2025</i></div></div></section>
<section class="ae" id="timeline"><h2>The story so far <small>2018 to 2032</small></h2>
<div class="ae-tl">${TIMELINE.map(([y, t, d, k]) => `<div class="${k || ''}"><b>${y}</b><strong>${t}</strong><span>${d}</span></div>`).join('')}</div></section>
<section class="ae" id="programmes"><h2>Programmes <small>${PROGRAMMES.length} named in public sources</small></h2>
<div class="ae-cards">${PROGRAMMES.map(([t, k, d]) => `<div class="ae-card"><i>${k}</i><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></section>
<section class="ae" id="partners"><h2>Partners <small>named in the sources</small></h2>
<div class="ae-partners">${PARTNERS.map(([g, l]) => `<div><p>${g}</p>${l.map(x => `<span>${x}</span>`).join('')}</div>`).join('')}</div></section>
<section class="ae" id="graph"><h2>The map <small>programmes and partners around it</small></h2>
<div class="ae-graph"><img src="graph.svg" alt="Algarve Evolution at the centre, with its programmes and partners"></div></section>
<section class="ae" id="week"><h2>The Algarve in summit week <small>on its own calendar</small></h2>
<div class="ae-week">${WEEK.map(([d, t, w, k]) => `<div class="ae-ev"><b>${d}</b><h3>${t}</h3><p>${w}</p><em>${k}</em></div>`).join('')}</div></section>
<section class="ae-correct" id="correct"><h2>Correct us, add to us</h2><p>Everything here is public, with its source and the date we read it. What is wrong, what programme, partner or event is missing? The correction goes into the data with its source.</p><a>Tell us what to change</a></section>
</main></div><div style="height:40px"></div><span class="note">Design</span></body></html>`
fs.writeFileSync(path.join(OUT, 'algarve.html'), html)
const b = await chromium.launch()
for (const [d, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const p = await b.newPage({ viewport: vp }); await p.goto(pathToFileURL(path.join(OUT, 'algarve.html')).href, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: path.join(OUT, `algarve--${d}.png`) })
    await p.screenshot({ path: path.join(OUT, `algarve--${d}--full.png`), fullPage: true })
    await p.close()
}
await b.close()
console.log('wrote', OUT)
