// How much has a page changed since a synthetic reader last saw it? (synthetic@PrompTugal.dinis, 6 November 2026,
// at Dinis Cruz's word: "there's no point of running new sessions ... if the content hasn't changed").
//
//   node desks/synthetic/tools/changes.mjs [--base https://promptugal.news/] [--state DIR] [--save]
//
// Reads each page's markdown twin (<page>.md: the same content as the HTML, no browser needed), normalises it (drops
// the version, the "Source:" line, the countdown and the reading meter, which change on every release and say nothing
// about the content), and compares it with the copy seen at the last run (DIR/pages/<slug>.md; DIR is the synthetic
// vault's clone, default ~/vaults/promptugal-synthetic/state). The formula, deterministic:
//
//   C(page)  = 1 - |S_old ∩ S_new| / |S_old ∪ S_new|      S = the set of 5-word shingles of the normalised text
//   T(home)  = the same, over the first 1,200 characters of the front page's body (what a phone shows first)
//   N(home)  = articles linked from the front page now that were not there last time
//
//   a journey runs when   max C over its pages >= 0.20,  or  T(home) >= 0.10,  or  N(home) >= 1
//   otherwise: nothing to read; say so in one line and push nothing.
//
// Prints one line per page and the verdict per journey; writes desks/synthetic/seen.json (hashes and scores only) and,
// with --save, the normalised copies into DIR/pages/ (the vault, never the repository). No dependencies.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import os from 'node:os'
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const BASE = arg('--base', 'https://promptugal.news/'), SAVE = process.argv.includes('--save')
const STATE = arg('--state', path.join(os.homedir(), 'vaults/promptugal-synthetic/state'))
const HERE = path.dirname(new URL(import.meta.url).pathname), DESK = path.dirname(HERE)
const J = JSON.parse(fs.readFileSync(path.join(DESK, 'journeys.json'), 'utf8'))
const TH = J.thresholds
const norm = s => s.replace(/^\*Source: .*\*$/m, '').replace(/\bv\d+\.\d+\.\d+\b/g, '').replace(/£\d+(\.\d+)?/g, '')
    .replace(/\d+ days? to the summit|Starts tomorrow|Day \d of 3/g, '').replace(/\s+/g, ' ').trim()
const shingles = s => { const w = s.toLowerCase().split(/\W+/).filter(Boolean), o = new Set(); for (let i = 0; i + 5 <= w.length; i++) o.add(w.slice(i, i + 5).join(' ')); return o }
const change = (a, b) => { if (a === null) return 1; const A = shingles(a), B = shingles(b); let n = 0; for (const x of A) if (B.has(x)) n++; const u = A.size + B.size - n; return u ? +(1 - n / u).toFixed(3) : 0 }
const slug = p => (p.replace(/\/$/, '/index').replace(/\.html$/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'index')
const twin = p => BASE + (p === '' || p.endsWith('/') ? p + 'index.md' : p.replace(/\.html$/, '.md'))
const articles = s => new Set([...s.matchAll(/\]\((articles\/[a-z0-9-]+)\.(?:md|html)\)/g)].map(m => m[1]))
const pages = [...new Set(J.journeys.flatMap(j => j.pages))], seen = {}, out = { checked: new Date().toISOString().slice(0, 16) + 'Z', base: BASE, thresholds: TH, pages: {}, journeys: {} }
for (const p of pages) {
    const r = await fetch(twin(p)); if (!r.ok) { out.pages[p] = { status: r.status }; console.log(`${p || '/'}: HTTP ${r.status}`); continue }
    const now = norm(await r.text()), f = path.join(STATE, 'pages', slug(p) + '.md'), old = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null
    const rec = { sha256: crypto.createHash('sha256').update(now).digest('hex').slice(0, 16), chars: now.length, C: change(old, now), first_seen: old === null }
    if (p === '') { const top = s => s === null ? null : s.slice(0, 1200); rec.T = change(top(old), top(now)); rec.N = old === null ? 0 : [...articles(now)].filter(a => !articles(old).has(a)).length }
    out.pages[p] = rec; seen[p] = now
    console.log(`${(p || '/').padEnd(52)} C=${rec.C.toFixed(3)}${rec.T !== undefined ? ` T=${rec.T.toFixed(3)} N=${rec.N}` : ''}${old === null ? ' (first look)' : ''}`)
}
for (const j of J.journeys) {
    const cs = j.pages.map(p => out.pages[p]?.C ?? 0), h = out.pages['']
    const why = [Math.max(...cs) >= TH.page && `a page changed ${Math.max(...cs).toFixed(2)} >= ${TH.page}`, j.pages.includes('') && h?.T >= TH.top && `the front page's first screen changed ${h.T.toFixed(2)}`, j.pages.includes('') && h?.N >= TH.new_articles && `${h.N} new article(s) on the front page`].filter(Boolean)
    out.journeys[j.id] = { run: why.length > 0, why }
    console.log(`journey ${j.id}: ${why.length ? 'RUN (' + why.join('; ') + ')' : 'nothing new to read'}`)
}
fs.writeFileSync(path.join(DESK, 'seen.json'), JSON.stringify(out, null, 1) + '\n')
if (SAVE) { fs.mkdirSync(path.join(STATE, 'pages'), { recursive: true }); for (const [p, t] of Object.entries(seen)) fs.writeFileSync(path.join(STATE, 'pages', slug(p) + '.md'), t) }
