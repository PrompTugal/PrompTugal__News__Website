// Variant C with a real article and a real rail (designer@'s note of 23:35 UTC): content/articles/brazil-startup-mission.md, Now and next from
// api/v1/days/<day>.json, related companies from data/companies (those that name Brazil). Frame 1260 px, text left, rail right. Public data only.
// designer.experiments@PrompTugal.dinis.   node design/experiments/width/real.mjs [--day 2026-11-10] [--out DIR]
import { createRequire } from 'node:module'
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const DAY = arg('--day') || '2026-11-10'; const OUT = arg('--out') ? path.resolve(arg('--out')) : path.join(os.tmpdir(), 'pt-experiments-width-real')
fs.mkdirSync(OUT, { recursive: true }); fs.cpSync(path.join(root, 'assets/fonts'), path.join(OUT, 'fonts'), { recursive: true })
const TOK = fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'assets/tokens.css'), 'utf8')
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
const raw = fs.readFileSync(path.join(root, 'content/articles/brazil-startup-mission.md'), 'utf8').split('---'); const fm = raw[1]; const md = raw.slice(2).join('---')
const g = k => (fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1].replace(/^"|"$/g, '')
let html = '', list = false, n = 0; const close = () => { if (list) { html += '</ul>'; list = false } }
for (const l of md.split('\n')) { if (n > 60) break
  if (/^## /.test(l)) { close(); html += `<h2>${inl(l.slice(3))}</h2>`; n += 4 } else if (/^- /.test(l)) { if (!list) { html += '<ul>'; list = true } html += `<li>${inl(l.slice(2))}</li>`; n++ }
  else if (/^\|\s*\|/.test(l) || /^\|[-| ]+\|$/.test(l) || !l.trim()) close(); else if (/^\|/.test(l)) { close(); const c = l.split('|').slice(1, -1).map(x => x.trim()); html += `<p class=kv>${inl(c[0])} ${inl(c.slice(1).join(' '))}</p>`; n += 2 } else { close(); html += `<p>${inl(l)}</p>`; n += 3 } }
close()
const day = JSON.parse(fs.readFileSync(path.join(root, `api/v1/days/${DAY}.json`), 'utf8'))
const next = day.items.filter(x => !/regist/i.test(x.kind) && /^\d\d:\d\d/.test(x.time)).sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5)
const rel = []; for (const id of fs.readdirSync(path.join(root, 'data/companies'))) { const f = path.join(root, 'data/companies', id, 'company.json'); if (!fs.existsSync(f)) continue
  const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.country === 'Brazil' || /brazil/i.test(c.country || '')) rel.push(c) }
const rail = `<aside class=rail><h3>Now and next · ${esc(day.label)}</h3><ul>${next.map(x => `<li><b>${esc(x.time.slice(0, 5))}</b> ${esc(x.title.slice(0, 70))}</li>`).join('')}</ul><h3>Companies from Brazil</h3><ul>${rel.slice(0, 5).map(c => `<li>${esc(c.name)}</li>`).join('')}</ul></aside>`
const css = `${TOK}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:var(--fs-body)/1.55 var(--serif)}
.note{max-width:1260px;margin:0 auto;padding:12px var(--gutter);font:12px var(--mono);color:var(--ink-2)}
.mast{max-width:1260px;margin:0 auto;padding:14px var(--gutter);text-align:center;border-bottom:4px double var(--rule);font:700 28px var(--serif)}.mast i{display:block;font:11px var(--mono);letter-spacing:.14em;color:var(--ink-3);font-style:normal}
.frame{max-width:1260px;margin:0 auto;padding:22px var(--gutter) 40px}.kick{font:600 11px var(--mono);letter-spacing:.14em;color:var(--brand-red)}h1{font:700 var(--fs-h1)/1.1 var(--serif);margin:.2em 0}.dek{font-size:var(--fs-dek);color:var(--ink-2)}h2{font:700 1.3em var(--serif)}
.c{display:grid;grid-template-columns:minmax(0,var(--measure)) minmax(0,1fr);gap:48px}.rail{border-left:1px solid var(--rule);padding-left:24px;font:14px var(--sans);align-self:start;position:sticky;top:12px}.rail h3{font:600 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}.rail ul{padding:0;list-style:none}.rail li{padding:6px 0;border-bottom:1px solid var(--rule-2)}
@media(max-width:767px){.c{grid-template-columns:1fr;gap:16px}.rail{position:static;border-left:0;padding-left:0;border-top:1px solid var(--rule);padding-top:12px}}`
const page = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Width C, real</title><style>${css}</style>
<p class=note>ILLUSTRATION by designer.experiments@: variant C with the real article (first part) and a real rail (${esc(day.label)}, companies naming Brazil). Nothing links anywhere.</p>
<div class=mast><i>PrompTugal.news</i>Nameplate</div><div class=frame><div class=c><main><p class=kick>${esc(g('beat')).toUpperCase()}</p><h1>${esc(g('title'))}</h1><p class=dek>${esc(g('summary'))}</p>${html}</main>${rail}</div></div>`
fs.writeFileSync(path.join(OUT, 'width-c-real.html'), page)
const b = await chromium.launch(); const errs = []
for (const [dev, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) { const pg = await b.newPage({ viewport: vp }); pg.on('pageerror', e => errs.push(e.message)); await pg.setContent(page); await pg.waitForTimeout(150); await pg.screenshot({ path: path.join(OUT, `width-c-real--${dev}.png`), fullPage: true }); await pg.close() }
await b.close(); console.log(errs.length ? 'page errors: ' + errs.join('; ') : 'no page errors', 'rail items', next.length, rel.length, '->', OUT)
