// /contribute/: the rules of the game as an infographic, and the collaborators' wall, in brand v2.0.
// designer@PrompTugal.dinis, 9 November 2026 (brief:20261109T2020Z-contribute; the words: desks/journalist-promptugal/contribute/page-words.md).
//
//   node design/contribute/make.mjs [--out DIR]
//     -> DIR/rules.html (the fragment and its CSS, to lift into the page as HTML: real text, readable, translatable)
//        DIR/rules--{phone,desktop}.png, DIR/rules--share.png (1200 x 630, the page's share picture)
//        DIR/wall.html, DIR/wall--{phone,desktop}.png (the wall's look, with placeholder contributors: names only with consent)
// No AI: every word of the rules is the journalist's, read from page-words.md.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../..')
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(os.tmpdir(), 'pt-contribute')
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['newsreader-variable.woff2', 'plex-sans-variable.woff2', 'plex-mono-400.woff2']) fs.copyFileSync(path.join(root, 'assets/fonts', f), path.join(OUT, f))
fs.copyFileSync(path.join(root, 'assets/brand/pt-news-stamp-light.svg'), path.join(OUT, 'stamp.svg'))

// the seven rules, exactly as written
const words = fs.readFileSync(path.join(root, 'desks/journalist-promptugal/contribute/page-words.md'), 'utf8')
const sec = words.split(/^## /m).find(s => s.startsWith('The rules of the game'))
const rules = sec.split('\n').filter(l => /^\d+\. /.test(l)).map(l => { const m = l.match(/^(\d+)\. \*\*(.+?)\*\*\s*(.*)$/); return { n: m[1], head: m[2], body: m[3] } })
if (rules.length !== 7) throw new Error('expected 7 rules, found ' + rules.length)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const fonts = `@font-face{font-family:Newsreader;src:url(newsreader-variable.woff2);font-weight:200 800}@font-face{font-family:"IBM Plex Sans";src:url(plex-sans-variable.woff2);font-weight:100 700}@font-face{font-family:"IBM Plex Mono";src:url(plex-mono-400.woff2)}`
// the fragment's CSS uses the site's own tokens, with brand v2.0 values as fallbacks
const rulesCss = `
.ct-rules{--p:var(--paper,#f6f3ec);--i:var(--ink,#121317);--i2:var(--ink-2,#3f424a);--r:var(--brand-red,#c52830);--g:var(--brand-green,#006600);--h:var(--hair,#d8d4cb);
  background:var(--p);color:var(--i);border-top:4px solid var(--i);padding:18px 0 8px;font-family:"IBM Plex Sans",Arial,sans-serif}
.ct-rules h2{font:600 26px/1.15 Newsreader,Georgia,serif;margin:0 0 4px}.ct-rules .sub{font-size:15px;color:var(--i2);margin:0 0 14px}
.ct-rules ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0}
.ct-rules li{display:grid;grid-template-columns:52px 1fr;gap:0 14px;padding:14px 0;border-bottom:1px solid var(--h);align-items:start}
.ct-rules .n{font:700 34px/1 Newsreader,Georgia,serif;color:var(--r);text-align:right}
.ct-rules b{display:block;font:600 19px/1.25 Newsreader,Georgia,serif}.ct-rules span{display:block;font-size:15.5px;line-height:1.45;color:var(--i2);margin-top:2px}
.ct-rules li.open .n,.ct-rules li.priv .n{color:var(--g)}
.ct-rules .foot{display:flex;justify-content:space-between;align-items:center;font:13px "IBM Plex Mono",monospace;color:var(--i2);padding-top:10px}
@media(min-width:900px){.ct-rules ol{grid-template-columns:1fr 1fr;column-gap:40px}.ct-rules li:nth-child(odd):last-child{grid-column:1/-1}}
`
// rules 5 and 6 are the promises to the contributor (open licence, privacy): green, the brand's "done/kept" colour
const cls = n => n === '5' ? 'open' : n === '6' ? 'priv' : ''
const rulesHtml = `<section class="ct-rules" aria-labelledby="ct-rules-h">
<h2 id="ct-rules-h">The rules of the game</h2>
<p class="sub">Seven lines. Everything else is on this page.</p>
<ol>${rules.map(r => `<li class="${cls(r.n)}"><span class="n" aria-hidden="true">${r.n}</span><div><b>${esc(r.head)}</b><span>${esc(r.body)}</span></div></li>`).join('')}</ol>
<p class="foot"><span>CC BY 4.0 · PrompTugal.news</span></p>
</section>`
const page = (body, w, extra = '') => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><style>${fonts}
*{box-sizing:border-box}body{margin:0;background:#f6f3ec;color:#121317;font-family:"IBM Plex Sans",sans-serif}.wrap{max-width:${w}px;margin:0 auto;padding:20px 16px}${rulesCss}${extra}</style><div class=wrap>${body}</div>`
fs.writeFileSync(path.join(OUT, 'rules.html'), `<!-- the fragment for /contribute/: lift the <style> into the page's CSS and the <section> into the page -->\n<style>${rulesCss}</style>\n${rulesHtml}\n`)

// the share picture: the seven heads only, big, on 1200 x 630
const share = `<!doctype html><meta charset=utf-8><style>${fonts}*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#f6f3ec;color:#121317;font-family:"IBM Plex Sans";padding:44px 56px;position:relative}
h1{font:600 48px/1.05 Newsreader}.rule{width:90px;height:5px;background:#006600;margin:16px 0 22px}
ol{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,auto);grid-auto-flow:column;gap:16px 48px}li{display:flex;gap:14px;align-items:baseline;font:600 25px/1.2 Newsreader}li i{font:700 30px Newsreader;color:#c52830;font-style:normal;width:26px;text-align:right}li.g i{color:#006600}
.f{position:absolute;left:56px;right:56px;bottom:34px;display:flex;justify-content:space-between;align-items:center;font:16px "IBM Plex Mono";color:#3f424a}.f img{width:52px}</style>
<h1>Write for PrompTugal.news</h1><div class=rule></div>
<ol>${rules.map(r => `<li class="${cls(r.n) ? 'g' : ''}"><i>${r.n}</i>${esc(r.head)}</li>`).join('')}</ol>
<div class=f><span>promptugal.news/contribute · CC BY 4.0</span><img src=stamp.svg alt=""></div>`

// the wall: placeholders only (a name appears only with its owner's yes)
const people = [['A', 'Contributor A', '3 pieces', 'A session write-up, a photo, a review'], ['B', 'Contributor B', '1 piece', 'A company page checked'], ['C', 'Contributor C', '2 pieces', 'An interview at a stand, a translation'], ['?', 'Name not shown', '1 piece', 'Published without a name, at the contributor\'s choice']]
const wallCss = `
.ct-wall{border-top:4px solid #121317;padding-top:16px}.ct-wall h2{font:600 26px/1.15 Newsreader;margin:0 0 4px}.ct-wall .sub{font-size:15px;color:#3f424a;margin:0 0 12px}
.ct-count{display:flex;gap:10px;margin:0 0 16px}.ct-count div{flex:1;border:1px solid #d8d4cb;background:#fffdf8;padding:10px 12px}.ct-count b{display:block;font:700 30px/1 Newsreader;color:#006600}.ct-count span{font:600 11.5px "IBM Plex Sans";letter-spacing:.08em;text-transform:uppercase;color:#3f424a}
.ct-grid{display:grid;grid-template-columns:1fr;gap:12px}@media(min-width:760px){.ct-grid{grid-template-columns:1fr 1fr}}@media(min-width:1100px){.ct-grid{grid-template-columns:1fr 1fr 1fr}}
.ct-p{display:grid;grid-template-columns:56px 1fr;gap:12px;border:1px solid #d8d4cb;background:#fffdf8;padding:12px}
.ct-p .av{width:56px;height:56px;border-radius:50%;background:#121317;color:#f6f3ec;display:grid;place-items:center;font:600 22px Newsreader}.ct-p.anon .av{background:#ece7db;color:#3f424a}
.ct-p b{font:600 18px/1.2 Newsreader}.ct-p .n{font:12.5px "IBM Plex Mono";color:#006600;margin-top:2px}.ct-p p{font-size:14px;color:#3f424a;margin:4px 0 8px}
.ct-share{display:flex;gap:6px;flex-wrap:wrap}.ct-share a{font:600 12.5px "IBM Plex Sans";border:1px solid #121317;border-radius:999px;padding:5px 11px;min-height:30px;color:#121317;text-decoration:none}
.ct-note{font:12.5px "IBM Plex Mono";color:#595c64;margin-top:12px}.ct-tag{position:fixed;right:8px;top:8px;background:#c52830;color:#fff;font:600 10px "IBM Plex Sans";padding:2px 6px;text-transform:uppercase}`
const wallHtml = `<section class="ct-wall"><h2>The wall</h2><p class="sub">The people who helped write PrompTugal.news.</p>
<div class="ct-count"><div><b>12</b><span>joined</span></div><div><b>9</b><span>submitted</span></div><div><b>5</b><span>published</span></div></div>
<div class="ct-grid">${people.map(([i, n, c, w]) => `<article class="ct-p${i === '?' ? ' anon' : ''}"><div class="av" aria-hidden="true">${i}</div><div><b>${n}</b><div class="n">${c}</div><p>${w}</p>${i === '?' ? '' : '<div class="ct-share"><a href="#">Share on LinkedIn</a><a href="#">X</a><a href="#">WhatsApp</a></div>'}</div></article>`).join('')}</div>
<p class="ct-note">Illustration: placeholder contributors and counts. A real name or photo shows only with its owner's yes; photos are published without location data.</p></section><span class="ct-tag">Design</span>`
fs.writeFileSync(path.join(OUT, 'wall.html'), page(wallHtml, 1200, wallCss))
fs.writeFileSync(path.join(OUT, 'rules-page.html'), page(rulesHtml, 1100))
fs.writeFileSync(path.join(OUT, 'share.html'), share)

const b = await chromium.launch()
const shot = async (file, out, vp, full = true) => { const p = await b.newPage({ viewport: vp }); await p.goto(pathToFileURL(path.join(OUT, file)).href); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: path.join(OUT, out), fullPage: full }); await p.close() }
await shot('rules-page.html', 'rules--phone.png', { width: 390, height: 844 })
await shot('rules-page.html', 'rules--desktop.png', { width: 1280, height: 800 })
await shot('share.html', 'rules--share.png', { width: 1200, height: 630 }, false)
await shot('wall.html', 'wall--phone.png', { width: 390, height: 844 })
await shot('wall.html', 'wall--desktop.png', { width: 1280, height: 800 })
await b.close()
console.log('rules:', rules.map(r => r.head).join(' | '), '->', OUT)
