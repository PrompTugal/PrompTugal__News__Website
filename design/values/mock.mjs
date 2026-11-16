// designer@PrompTugal.dinis, 16 Nov 2026: the look of /values/ (board/spec-the-values-page.md).
// Renders journalist@'s draft words (desks/journalist-promptugal/values/page-words.md) in the proposed look,
// inside the built /about/ page served on :8765, and screenshots it. No AI.
//   python3 -m http.server 8765 &  node design/values/mock.mjs
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
const md = readFileSync('desks/journalist-promptugal/values/page-words.md', 'utf8').replace(/^---[\s\S]*?---\n/, '')
// A link to a .json file is outlined in red in the mock-up: Dinis, 16 Nov 10:40, no JSON link for a reader.
const inl = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => `<a href="#"${/\.json$/.test(h) ? ' class="vj"' : ''}>${t}</a>`)
const parts = md.split(/\n## /)
const blocks = parts.slice(1)
const lead = parts[0].split('\n').filter(l => l.trim() && !l.startsWith('# '))
const card = b => {
  const [h, ...rest] = b.split('\n'); const title = h.replace(/\s*\{#.*\}/, ''); const m = title.match(/^(\d)\.\s*(.*)/)
  const body = rest.filter(l => l.trim())
  const ps = body.filter(l => !l.startsWith('- ')).map(l => `<p>${inl(l)}</p>`).join('')
  const ok = body.filter(l => l.startsWith('- **Check it:**')).map(l => `<div class="vc-ok"><span>Check it</span><p>${inl(l.replace('- **Check it:** ', ''))}</p></div>`).join('')
  const no = body.filter(l => l.startsWith('- **Not built yet:**')).map(l => `<div class="vc-no"><span>Not built yet</span><p>${inl(l.replace('- **Not built yet:** ', ''))}</p></div>`).join('')
  if (!m) return `<section class="v-ask"><h2>${title}</h2>${ps}</section>`
  return `<section class="vc"><div class="vc-n">${m[1]}</div><div><h2>${m[2]}</h2>${ps}<div class="vc-ev">${ok}${no}</div></div></section>`
}
const toc = blocks.filter(b => /^\d\./.test(b)).map(b => {
  const m = b.split('\n')[0].replace(/\s*\{#.*\}/, '').match(/^(\d)\.\s*(.*)/); const built = !/Not built yet/.test(b)
  return `<li><a href="#"><b>${m[1]}</b> ${m[2]}</a><i class="${built ? 'y' : 'p'}">${built ? 'checkable today' : 'in part'}</i></li>`
}).join('')
const html = `<article class="vv"><p class="vk">PrompTugal.news · our values</p><h1>Our values</h1>
<p class="vs">${inl(lead[0])}</p><p class="vl">${inl(lead[1] || '')}</p>
<ol class="vtoc">${toc}</ol>${blocks.map(card).join('')}
<p class="vdraft">The team's draft; the wording waits on Dinis (<a href="#">the decision page</a>). Words: journalist@PrompTugal.dinis.</p></article>`
const CSS = `.vv{max-width:760px;margin:0 auto;padding:28px 0 60px;font-family:var(--serif,Georgia);color:var(--ink,#1a1a1a)}
.vk{font:700 11px var(--mono,monospace);letter-spacing:.12em;text-transform:uppercase;color:#006600;margin:0 0 6px}
.vv h1{font:600 44px/1.05 var(--serif,Georgia);margin:0 0 18px}
.vs{font:500 25px/1.3 var(--serif,Georgia);border-left:4px solid #006600;padding:2px 0 2px 18px;margin:0 0 18px}
.vl{font-size:18px;line-height:1.55;color:var(--ink-2,#333)}
.vtoc{list-style:none;padding:0;margin:26px 0 34px;border-top:2px solid var(--ink,#1a1a1a)}
.vtoc li{display:flex;justify-content:space-between;gap:12px;align-items:baseline;border-bottom:1px solid var(--hair,#ddd6c8);padding:9px 0}
.vtoc a{color:inherit;text-decoration:none;font-size:17px}.vtoc b{font:700 13px var(--mono,monospace);color:#006600;margin-right:8px}
.vtoc i{font:500 11px var(--mono,monospace);font-style:normal;white-space:nowrap;padding:2px 6px;border-radius:3px}
.vtoc i.y{background:#e3efe3;color:#0a3a14}.vtoc i.p{background:#efe7d6;color:#5a4a20}
.vc{display:grid;grid-template-columns:56px 1fr;gap:6px 18px;padding:26px 0;border-top:1px solid var(--hair,#ddd6c8)}
.vc-n{font:400 48px/1 var(--serif,Georgia);color:#006600}
.vv .vc h2,.vv .v-ask h2{text-transform:none;letter-spacing:0;border:0;padding:0}
.vc h2{font:600 24px/1.2 var(--serif,Georgia);margin:4px 0 10px}.vc p{font-size:17px;line-height:1.55;margin:0 0 10px}
.vc-ev{display:grid;gap:8px;margin-top:6px}
.vc-ok,.vc-no{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:10px 12px;border-radius:4px;font-family:var(--sans,system-ui)}
.vc-ok{background:#eef4ee;border-left:3px solid #006600}.vc-no{background:#f5efe2;border-left:3px dashed #8a7440}
.vc-ok span,.vc-no span{font:700 10.5px var(--mono,monospace);letter-spacing:.08em;text-transform:uppercase;padding-top:3px}
.vc-ok span{color:#0a3a14}.vc-no span{color:#5a4a20}.vc-ev p{font:15px/1.45 var(--sans,system-ui);margin:0}
.vc a,.vl a{color:inherit}.vj{outline:2px solid #c00;outline-offset:1px}
.v-ask{background:#0a3a14;color:#f4f1ea;padding:24px 26px;border-radius:4px;margin-top:22px}.v-ask h2{font:600 24px var(--serif,Georgia);margin:0 0 8px}.v-ask p{font-size:18px;margin:0}.v-ask a{color:#fff}
.vdraft{font:12px var(--mono,monospace);color:var(--ink-3,#666);margin-top:22px}
@media(max-width:600px){.vv{padding:18px 16px 40px}.vv h1{font-size:34px}.vs{font-size:21px}.vc{grid-template-columns:34px 1fr}.vc-n{font-size:32px}.vc-ok,.vc-no{grid-template-columns:1fr;gap:4px}.vtoc li{flex-wrap:wrap}}`
const out = 'design/decisions/values'; mkdirSync(out, { recursive: true })
const b = await chromium.launch()
for (const [w, tag] of [[1280, 'desktop'], [390, 'phone']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } })
  await p.goto('http://localhost:8765/about/', { waitUntil: 'load' }); await p.waitForTimeout(600)
  await p.evaluate(([c, h]) => { const s = document.createElement('style'); s.textContent = c; document.head.append(s)
    const m = document.querySelector('main') || document.body; m.innerHTML = h }, [CSS, html])
  await p.screenshot({ path: `${out}/values-${tag}.png`, fullPage: true })
  await p.close()
}
await b.close(); console.log('done')
