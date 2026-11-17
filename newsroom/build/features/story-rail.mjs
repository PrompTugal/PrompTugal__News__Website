// Every story has an address (board/briefs/2026-11-16-every-story-has-an-address.md, items 1, 2 and 4): an article that is
// filed under a place (front matter town: or region:) shows its address above the headline ("Loulé · the Algarve · Portugal")
// and, at the end, a rail: the altitude from the place up to the country, each step a page. The ladder comes from
// data/by-place/places.json (parent links), never by hand. Words: assets/story-rail/words.json.
import { readFileSync } from 'node:fs'
import { render } from '../lib/markdown.mjs'
export const order = 21
let W = null, T = null
const words = ctx => W || (W = JSON.parse(readFileSync(new URL('../../../assets/story-rail/words.json', import.meta.url), 'utf8')))
const tree = ctx => { if (T) return T; const m = new Map(); try { for (const p of ctx.readJSON('data/by-place/places.json').places) m.set(p.id, p) } catch {} return T = m }
const isArticle = p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html' && !p.withdrawn
// the ladder: the place, its parent, and so on up (guarded against loops)
export function ladder(ctx, id) {
    const m = tree(ctx), out = []
    for (let p = m.get(id), i = 0; p && i < 6; p = m.get(p.parent), i++) out.push(p)
    return out
}
export function decorate(p, ctx) {
    if (!isArticle(p) || p.railed || !p.meta) return
    const id = (p.meta.town || p.meta.region || '').trim()
    const steps = id ? ladder(ctx, id) : []
    if (!steps.length) return
    p.railed = true
    const w = words(ctx), cell = ctx.md.cell
    const link = s => `[${cell(s.name)}](${ctx.link(p.rel, `${s.path}index.html`)})`
    const address = steps.map(link).join(' · ')
    // HTML only: the signed twin must stay as signed, so nothing is added to p.md (the same way as the signed line)
    const prev = p.postHtml
    const top = render(`{.story-address}\n${address}\n`).html
    const rail = render(`## ${w.rail_h} {#rail}\n\n${w.rail_intro.replace('{name}', cell(steps[0].name))}\n\n{.story-climb}\n${steps.map((s, i) => `${i + 1}. ${link(s)}`).join('\n')}\n\n${w.sources_note}\n`).html
    p.postHtml = html => top + (prev ? prev(html) : html) + rail
}
export const assets = { css: ['assets/story-rail/story-rail.css'] }
