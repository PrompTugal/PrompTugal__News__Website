// One page width for the whole site (Dinis, 6 November 2026, 22:55 UTC: "the width has to stay the same as the home page").
// Three ways to hold the home page's width on an inner page (an article), drawn with the site's own tokens. An ILLUSTRATION: the text is a stand-in,
// the rail items are examples, nothing links anywhere. designer.experiments@PrompTugal.dinis.
//   node design/experiments/width/make.mjs [--out DIR]  -> DIR/width.html (+ fonts/) and DIR/width--<desktop|phone>--<a|b|c>.png
import { createRequire } from 'node:module'
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(fileURLToPath(import.meta.url)); const root = path.resolve(here, '../../..')
const i = process.argv.indexOf('--out'); const OUT = i > 0 ? path.resolve(process.argv[i + 1]) : path.join(os.tmpdir(), 'pt-experiments-width')
fs.mkdirSync(OUT, { recursive: true }); fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const P = 'An AI agent wrote this paragraph as a stand-in, to show how a line of text sits in the frame. Every fact in a real article carries its source and the date it was read. '
const body = `<p>${P.repeat(2)}</p><h2>A stand-in heading</h2><p>${P.repeat(3)}</p><figure class="fig"><div class="img">image</div><figcaption>A stand-in caption.</figcaption></figure><p>${P.repeat(2)}</p>`
const head = `<p class="kick">NEWS · EXAMPLE</p><h1>A stand-in headline for an article, long enough to wrap on a phone</h1><p class="dek">A stand-in standfirst that says in two lines what the article is about.</p>`
const rail = `<aside class="rail"><h3>Now and next</h3><ul><li><b>10:00</b> Example session</li><li><b>11:30</b> Example keynote</li><li><b>14:00</b> Example panel</li></ul><h3>Related</h3><ul><li>Example related article</li><li>Example related company</li></ul></aside>`
const V = {
  a: ['A · Full frame', 'Text runs the whole frame, the home page\'s width exactly. Most width and the longest lines (about 150 characters): hard to read.', `<main class="a">${head}${body}</main>`],
  b: ['B · Frame the same, text centred', 'The frame, the masthead and the images are the home page\'s width; only the text sits in a reading column, centred. The nameplate and the text stay aligned on the centre line.', `<main class="b"><header>${head}</header>${body}</main>`],
  c: ['C · Frame the same, text left with a rail', 'The same frame; the reading column sits left on the frame\'s edge and a rail takes the right (the home page\'s "Now and next"). Fills the width with something useful and keeps lines near 70 characters.', `<main class="c"><div>${head}${body}</div>${rail}</main>`]
}
const css = `${TOK}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:var(--fs-body)/1.55 var(--serif)}
.note{max-width:var(--page);margin:0 auto;padding:12px var(--gutter);font:12px var(--mono);color:var(--ink-2)}
.mast{max-width:var(--page);margin:0 auto;padding:14px var(--gutter);text-align:center;border-bottom:4px double var(--rule);font:700 28px var(--serif)}
.mast i{display:block;font:11px var(--mono);letter-spacing:.14em;color:var(--ink-3);font-style:normal}
.frame{max-width:var(--page);margin:0 auto;padding:22px var(--gutter) 40px}
.kick{font:600 11px var(--mono);letter-spacing:.14em;color:var(--brand-red)}h1{font:700 var(--fs-h1)/1.1 var(--serif);margin:.2em 0}.dek{font-size:var(--fs-dek);color:var(--ink-2)}
h2{font:700 1.3em var(--serif)}.fig{margin:1.2em 0}.img{background:var(--paper-2);border:1px solid var(--rule);height:260px;display:grid;place-items:center;font:12px var(--mono);color:var(--ink-3)}figcaption{font:12px var(--mono);color:var(--ink-3)}
.b header,.b>p{max-width:var(--measure);margin-left:auto;margin-right:auto}.b>h2{max-width:calc(var(--measure) / 1.3);margin-left:auto;margin-right:auto}.b h1{text-align:center}
.c{display:grid;grid-template-columns:minmax(0,var(--measure)) minmax(0,1fr);gap:48px}.c .rail{border-left:1px solid var(--rule);padding-left:24px;font:14px var(--sans)}.c h3{font:600 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}.c ul{padding:0;list-style:none}.c li{padding:6px 0;border-bottom:1px solid var(--rule-2)}
@media(max-width:767px){.c{grid-template-columns:1fr;gap:16px}.c .rail{border-left:0;padding-left:0;border-top:1px solid var(--rule);padding-top:12px}.img{height:160px}}
section.v{border-top:10px solid var(--ink);margin-top:24px}section.v h2.t{max-width:var(--page);margin:0 auto;padding:12px var(--gutter) 0;font:700 14px var(--mono)}`
const page = (keys, solo) => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Width variations</title><style>${css}</style>
${solo ? '' : '<p class=note>ILLUSTRATION by designer.experiments@: one inner page in three ways to hold the home page\'s width. Stand-in text; rail items are examples; nothing links anywhere.</p>'}
${keys.map(k => `<section class=v><h2 class=t>${V[k][0]}</h2><p class=note>${V[k][1]}</p><div class=mast><i>PrompTugal.news</i>Nameplate</div><div class=frame>${V[k][2]}</div></section>`).join('')}`
fs.writeFileSync(path.join(OUT, 'width.html'), page(['a', 'b', 'c']))
const b = await chromium.launch(); const errs = []
for (const [dev, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  for (const k of ['a', 'b', 'c']) {
    const pg = await b.newPage({ viewport: vp }); pg.on('pageerror', e => errs.push(e.message))
    await pg.setContent(page([k], true)); await pg.waitForTimeout(150)
    await pg.screenshot({ path: path.join(OUT, `width--${dev}--${k}.png`), fullPage: true }); await pg.close()
  }
}
await b.close(); console.log(errs.length ? 'page errors: ' + errs.join('; ') : 'no page errors', '->', OUT)
