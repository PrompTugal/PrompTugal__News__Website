// Claimed profiles, the maturity scale and the provenance chain (Dinis, 6 November 2026, after round 5):
// "companies that have given us permission to add more details", "a little maturity scale of how much the company profile has been filled in",
// "are you the owner of this page? send us a message" on the append lane, and "which writer, from which agent, from which session created this article".
// designer.experiments@PrompTugal.dinis, 6 November 2026.
//   node design/experiments/profiles/make.mjs [--out DIR]   -> DIR/profiles.html (+ fonts/) and DIR/profiles--<phone|desktop>.png
// The maturity of each of the 120 companies is computed from the real data today (levels 0 to 2 can be earned from public data alone; 3 and 4 cannot yet).
// The "claimed" card is an ILLUSTRATION and says so: no company has given permission yet. Nothing here sends anything; the claim box is a picture.
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
const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-experiments-profiles')
fs.mkdirSync(OUT, { recursive: true })
fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// The scale. 0 Listed, 1 Described, 2 Sourced (three or more sources, each read and dated), 3 Public record (a Wikipedia or official source mapped by a program),
// 4 Claimed (the company gave permission: logo, people, details). Levels 3 and 4 need work that does not exist yet, so today nobody reaches them.
const LEVELS = [['0', 'Listed', 'Name and the fact that it is at the summit.'], ['1', 'Described', 'What it does, field, country and website, from the summit\'s own pages.'], ['2', 'Sourced', 'Three or more sources, each read and dated.'], ['3', 'Public record', 'Matched to a Wikipedia article or an official register that a program can read.'], ['4', 'Claimed', 'The company has given permission: its logo, its people, its own details.']]
const cos = fs.readdirSync(path.join(root, 'data/companies')).map(id => {
    const f = path.join(root, 'data/companies', id, 'company.json'); if (!fs.existsSync(f)) return null
    const d = rd(f); const sf = path.join(root, 'data/companies', id, 'sources.json')
    const n = fs.existsSync(sf) ? (rd(sf).sources || []).length : 0
    let lv = d.name && d.attending ? 0 : -1
    if (lv >= 0 && d.what && d.category && d.country && d.website) lv = 1
    if (lv >= 1 && n >= 3) lv = 2
    return { id, name: d.name, what: (d.what || '').split(/(?<=[.;:])\s/)[0].replace(/[:;,]$/, ''), country: d.country, n, lv }
}).filter(Boolean)
const dist = LEVELS.map((_, i) => cos.filter(c => c.lv === i).length)
const ex = cos.find(c => c.id === '1password') || cos[0]
const art = (() => { const t = fs.readFileSync(path.join(root, 'content/articles/europe-in-pavilion-4.md'), 'utf8').split('---')[1]; const g = k => (t.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1].replace(/^"|"$/g, ''); return { title: g('title'), author: g('author'), date: g('date') } })()

const ladder = (lv, claimed) => `<ol class=ladder aria-label="Profile maturity">${LEVELS.map(([n, t], i) => `<li class="${i <= lv ? 'on' : ''} ${i === 4 && claimed ? 'claimed' : ''}"><b>${n}</b><span>${t}</span></li>`).join('')}</ol>`
const html = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Claimed profiles, maturity and provenance</title>
<style>${TOK}
*{box-sizing:border-box} body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--sans)} .wrap{max-width:var(--page);margin:0 auto;padding:0 var(--gutter)}
.bar{border-bottom:3px double var(--rule);padding:12px 0} .bar b{font:700 20px var(--serif)} h1{font:600 var(--fs-h1)/1.1 var(--serif);margin:16px 0 6px} .lede{color:var(--ink-2);margin:0 0 12px;max-width:46em}
h2{font:600 22px/1.2 var(--serif);border-top:2px solid var(--rule);padding-top:8px;margin:34px 0 6px} h3{font:600 18px/1.2 var(--serif);margin:0 0 4px} p{margin:0 0 8px} .m,.k{font:12px var(--mono);color:var(--ink-3)} .k{letter-spacing:.07em;text-transform:uppercase}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px} .card{background:var(--panel);border:1px solid var(--hair);border-top:2px solid var(--rule);padding:14px} .card.cl{border-top-color:var(--brand)}
.head{display:flex;gap:12px;align-items:center;margin-bottom:8px} .logo{width:48px;height:48px;border-radius:3px;display:grid;place-items:center;font:600 15px var(--mono);background:var(--ink);color:var(--paper);flex:none} .logo.ph{background:var(--paper-2);color:var(--ink-3);border:1px dashed var(--rule-2);font-size:10px;text-align:center;line-height:1.1}
.ladder{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:0;margin:10px 0} .ladder li{border:1px solid var(--rule-2);padding:6px 4px;text-align:center;font-size:12px;background:var(--paper-2);color:var(--ink-3)} .ladder li b{display:block;font:600 14px var(--mono)} .ladder li.on{background:var(--ink);color:var(--paper);border-color:var(--ink)} .ladder li.claimed{background:var(--brand);border-color:var(--brand);color:#fff}
.perm{list-style:none;padding:0;margin:8px 0} .perm li{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--hair);font-size:14px} .perm i{font-style:normal;font:12px var(--mono);color:var(--ink-3);min-width:78px} .yes{color:var(--brand);font-weight:600} .no{color:var(--ink-3)}
.tag{display:inline-block;font:11px var(--mono);letter-spacing:.05em;text-transform:uppercase;border:1px solid var(--rule-2);padding:1px 8px;border-radius:999px;margin-right:6px;background:var(--paper)} .tag.ok{border-color:var(--brand);color:var(--brand)}
.claim{border:2px dashed var(--rule-2);padding:12px 14px;margin-top:12px;background:var(--paper)} .claim button{font:600 15px var(--sans);padding:9px 16px;border:0;background:var(--ink);color:var(--paper);border-radius:3px;min-height:40px;margin-top:6px} .claim small{display:block;color:var(--ink-3);margin-top:6px}
.dist{display:grid;gap:6px;margin:10px 0} .dist div{display:grid;grid-template-columns:150px 1fr 40px;gap:10px;align-items:center;font-size:14px} .bar2{height:14px;background:var(--paper-2);border:1px solid var(--rule-2)} .bar2 i{display:block;height:100%;background:var(--ink)}
.line{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0} .line>div{padding:12px 14px;border:1px solid var(--rule-2);background:var(--panel)} .line h3{font-size:16px}
.chain{display:grid;gap:0;margin:12px 0;max-width:46em} .node{display:grid;grid-template-columns:130px 1fr;gap:12px;padding:10px 12px;border:1px solid var(--rule-2);background:var(--panel);position:relative} .node+.node{margin-top:14px} .node+.node:before{content:"";position:absolute;left:64px;top:-15px;height:14px;border-left:2px solid var(--ink)} .node .k{padding-top:2px} .node.gap{border-style:dashed;background:var(--paper)} .node b{font-weight:600} .gapnote{color:var(--warn);font-size:13px}
.note{font:12px var(--mono);color:var(--ink-3);border-top:1px solid var(--hair);margin:30px 0 24px;padding-top:10px}
@media(max-width:700px){.two,.line{grid-template-columns:1fr}.ladder{grid-template-columns:repeat(5,1fr)}.ladder li{font-size:10px}.dist div{grid-template-columns:100px 1fr 32px}.node{grid-template-columns:1fr}.node+.node:before{left:20px}}</style>
<div class=wrap><div class=bar><b>PrompTugal.news</b></div>
<h1>Companies that give us permission</h1>
<p class=lede>A profile starts from public data. A company can say yes to more: its logo, its people, its own details. Everything we show says where it came from, and how complete the profile is.</p>

<h2>One company, two states</h2>
<p class=m>The left card is real data today. The right card is an illustration of the claimed state: <b>no company has given permission yet.</b></p>
<div class=two>
 <div class=card><div class=head><span class="logo ph">no logo yet</span><div><h3>${esc(ex.name)}</h3><span class=m>${esc(ex.country)}</span></div></div><p>${esc(ex.what)}</p>
  <span class=tag>Public data only</span><span class=tag>${ex.n} sources, each dated</span>${ladder(ex.lv, false)}
  <ul class=perm><li><i>Logo</i><span class=no>Not shown: we have no permission to use it</span></li><li><i>People</i><span class=no>Names and roles from the summit's programme; no photos</span></li><li><i>Details</i><span class=no>As the summit lists them</span></li></ul>
  <div class=claim><h3>Is this your company?</h3><p>Tell us and we will contact the company. We never show an address, and we do not publish anything new until the company says yes.</p><button type=button>Tell us it is yours</button><small>Sent to our open inbox (an append-only lane); a person at PrompTugal.news replies. Today this is a picture of the button, not a working form.</small></div></div>
 <div class="card cl"><div class=head><span class=logo style="background:var(--brand)">LOGO</span><div><h3>Example Company <span class=m>(illustration)</span></h3><span class=m>Lisbon, Portugal</span></div></div><p>Its own one-line description, as the company wrote it.</p>
  <span class="tag ok">Claimed with permission</span><span class=tag>Granted 6 Nov 2026 (example)</span>${ladder(4, true)}
  <ul class=perm><li><i>Logo</i><span class=yes>Shown. Permission: logo, by a named role, dated</span></li><li><i>People</i><span class=yes>Photos for the three people the company named, each with their own yes</span></li><li><i>Details</i><span class=yes>Its own text, marked "from the company", beside our sourced facts</span></li><li><i>Take back</i><span>One message removes any of these; the page changes at the next build</span></li></ul></div>
</div>

<h2>The maturity scale</h2>
<p class=lede>How much of a profile is filled in, and by what. Levels 0 to 2 are earned from public pages today. Level 3 needs data a program can read (Wikipedia, official registers); level 4 needs the company's yes.</p>
<div class=dist>${LEVELS.map(([n, t, d], i) => `<div><span><b>${n}</b> ${t}</span><span class=bar2><i style="width:${Math.round(100 * dist[i] / cos.length)}%"></i></span><span class=m>${dist[i]}</span></div>`).join('')}</div>
<p class=m>Computed today from data/companies/ (${cos.length} companies). ${LEVELS.map(([n, t, d]) => `${n} ${t}: ${d}`).join(' ')}</p>

<h2>The line: what we may show without asking</h2>
<div class=line><div><h3>Public, and a program may read it</h3><p>Government and agency pages, official registers, Wikipedia and its image licences, the summit's own pages. We can show these with the source and the date read, and say so on the page.</p><span class="tag ok">Show, with source</span></div>
<div><h3>Not ours to take</h3><p>LinkedIn and other sites whose terms do not allow a program to read them. A person's photo, a company's logo as a brand asset. These wait for the company's or the person's yes.</p><span class=tag>Ask first</span></div></div>
<p>The first message to a company can therefore be: <i>here is your page, built from public sources; may we add your logo, your people and your own words?</i> That is the outreach, and the permission is the reply.</p>

<h2>Provenance: who made this, all the way down</h2>
<p class=lede>One real article, followed from the page to the hand that wrote it. A dashed step is a link we cannot show yet, because it is not recorded today.</p>
<div class=chain>
 <div class=node><span class=k>The page</span><span><b>${esc(art.title)}</b><br><span class=m>${esc(art.date)} · articles/europe-in-pavilion-4</span></span></div>
 <div class=node><span class=k>Written by</span><span><b>${esc(art.author)}</b><br><span class=m>an AI agent, from the article's own front matter</span></span></div>
 <div class="node gap"><span class=k>In session</span><span>Session and run that wrote it <span class=gapnote>not recorded on the article today: the run report names the agent, not the article</span></span></div>
 <div class="node gap"><span class=k>From drafts</span><span>The desk draft and its revisions <span class=gapnote>in git history, not linked from the page</span></span></div>
 <div class=node><span class=k>Facts and sources</span><span>Each fact with its source URL and the date read, on the company and event pages it draws from</span></div>
 <div class=node><span class=k>The day's root</span><span>The article sits under the graph root frozen for 6 November: one fingerprint from which every page of that day can be reached</span></div>
</div>
<p class=note>Experiment, not on the site. Maturity computed from data/companies/. The claimed card and the claim box are illustrations; nothing is sent. Dinis, 6 November 2026, wanted: permission, the maturity scale, an owner claim on the append lane, public and official data only unless asked, and provenance down to the session.</p></div>`
const f = path.join(OUT, 'profiles.html'); fs.writeFileSync(f, html)
const browser = await chromium.launch()
for (const [s, vp] of Object.entries({ phone: { width: 390, height: 844, deviceScaleFactor: 2 }, desktop: { width: 1280, height: 900, deviceScaleFactor: 1 } })) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: s === 'phone' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)))
    await p.goto(pathToFileURL(f).href); await p.waitForTimeout(300)
    await p.screenshot({ path: path.join(OUT, `profiles--${s}.png`), fullPage: true }); console.log(s, errs.length ? errs : 'no page errors'); await ctx.close()
}
await browser.close(); console.log('levels', dist.join(' / '), 'of', cos.length)
