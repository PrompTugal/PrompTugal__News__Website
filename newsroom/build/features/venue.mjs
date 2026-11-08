// The venue map (WS-181 Part B1, approved by Angelo 7 November 2026): /summit/venue/ draws the summit's buildings, from
// OpenStreetMap's outlines, and says what the programme puts in each. No person on it, ever; a stage with no known
// building is left at the campus level and never guessed (the schedule names the stage, not the building).
// Built at build time into plain SVG: no script, so nothing can leave the browser. The drawing data is
// assets/venue/venue-map.json, written by the team site's people/angelo/tools/venue-map.mjs (--newsroom), which also
// writes the team's copy: one generator, two copies. Map data (c) OpenStreetMap contributors, ODbL.
import fs from 'node:fs'
export const order = 62
const TOKEN = '(The plan is drawn on the HTML page.)'
// a place (or the nearest place above it) to the drawing's areas it picks out; the campus is two buildings, so a stage in it picks out all of them
const AT = {
    'place:pavilhao-de-portugal': { key: 'pavilhao', areas: ['osm-r3266709'] },
    'place:centro-vasco-de-gama': { key: 'vasco', areas: ['osm-240816973'] },
    'place:fil': { key: 'fil', areas: ['osm-821641463'] },
    'place:meo-arena-and-fil': { key: 'campus', areas: ['osm-821641463', 'osm-821784762', 'osm-821643074', 'osm-821643075', 'osm-821643076', 'osm-821643077'] },
}
const mapData = ctx => JSON.parse(fs.readFileSync(ctx.R('assets/venue/venue-map.json'), 'utf8'))
function locate(ctx, e) {
    let p = e.place, guard = 0
    while (p && guard++ < 8) { if (AT[p]) return AT[p]; const n = ctx.store.get(p); p = n && n.located_in }
    return null
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

let W_ = {}
function svg(map, lit, small, name, aria) {
    const { width: W, height: H } = map.frame
    const on = new Set(lit.flatMap(k => k.areas))
    const label = a => a.label === 'FIL' ? '' : `<text x="${a.c[0]}" y="${a.c[1]}" text-anchor="middle" dominant-baseline="middle" class="vn-lab">${esc(a.label)}</text>`
    if (small) return `<svg class="venue-map venue-map-sm" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aria).replace('{name}', esc(name))}" xmlns="http://www.w3.org/2000/svg">` +
        `<path d="${map.river}" class="vn-river"/>` +
        map.areas.map(a => `<path d="${a.d}" class="vn-area vn-${a.kind}${on.has(a.id) ? ' vn-on' : ''}"/>`).join('') + `</svg>`
    return `<svg class="venue-map" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="vn-t vn-d" xmlns="http://www.w3.org/2000/svg">` +
        `<title id="vn-t">${esc(W_.title)}</title>` +
        `<desc id="vn-d">${esc(W_.desc)}</desc>` +
        `<path d="${map.river}" class="vn-river"/>` +
        map.streets.map(s => `<path d="${s.d}" class="vn-street"/><text x="${s.at[0]}" y="${s.at[1]}" transform="rotate(${s.angle} ${s.at[0]} ${s.at[1]})" class="vn-street-lab">${esc(s.short)}</text>`).join('') +
        map.areas.map(a => `<path d="${a.d}" data-id="${a.id}" class="vn-area vn-${a.kind}${on.has(a.id) ? ' vn-on' : ''}"><title>${esc(a.label)}</title></path>`).join('') +
        map.areas.map(label).join('') +
        `<text x="${map.areas.find(a => a.label === 'FIL').c[0]}" y="46" text-anchor="middle" class="vn-lab vn-lab-big">FIL</text></svg>`
}

const PAGE = 'summit/venue/index.html'
const ROWS = [['campus', 'place:meo-arena-and-fil'], ['fil', 'place:fil'], ['pavilhao', 'place:pavilhao-de-portugal'], ['vasco', 'place:centro-vasco-de-gama']]
const litOf = (ctx) => {
    const evs = (ctx.store.events || []).filter(e => e.date >= '2026-11-06' && e.date <= '2026-11-13').map(e => ({ e, at: locate(ctx, e) })).filter(x => x.at)
    return { evs, by: k => evs.filter(x => x.at.key === k).map(x => x.e).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))) }
}
export const fill = {
    'venue:map': () => TOKEN,
    'venue:table': (page, ctx) => {
        const { by } = litOf(ctx), days = list => { const m = {}; for (const e of list) m[e.date] = (m[e.date] || 0) + 1; return Object.keys(m).sort().map(d => `${ctx.DAY(d)}: ${m[d]}`).join('; ') }
        return `| Building | Sessions in our programme, by day |\n|---|---|\n` + ROWS.map(([k, p]) => `| [${ctx.md.cell(ctx.store.get(p).name)}](${ctx.link(PAGE, `places/${p.slice(6)}/index.html`)}) | ${by(k).length ? ctx.md.cell(`${by(k).length} (${days(by(k))})`) : 'none listed'} |`).join('\n')
    },
}
export function decorate(page, ctx) {
    W_ = WORDS(ctx)
    if (EVENT.test(page.rel)) return decorateEvent(page, ctx)
    if (page.rel !== PAGE) return
    const map = mapData(ctx), { by } = litOf(ctx), lit = ROWS.filter(([k]) => by(k).length).map(([k, p]) => AT[p])
    const prev = page.postHtml
    page.postHtml = html => { const h = html.replace(`<p>${TOKEN}</p>`, `<figure class="venue-fig">${svg(map, lit)}</figure>${myDay(ctx, page)}`); return prev ? prev(h) : h }
}

// "My day on the map" (B1 item 3): a hidden block that assets/venue/venue.js fills from the reader's own picks. The page
// carries the programme's places as JSON (event id to building), the one thing the script needs; no person, no network.
function myDay(ctx, page) {
    const w = JSON.parse(fs.readFileSync(ctx.R('assets/venue/my-day.json'), 'utf8')), events = {}, areas = {}
    for (const [k, p] of ROWS) areas[k] = AT[p].areas
    for (const e of ctx.store.events || []) {
        if (!e.date || e.date < '2026-11-06' || e.date > '2026-11-13') continue
        const at = locate(ctx, e), id = e.id.replace(/^event:/, '')
        const b = at ? (at.key === 'campus' ? JSON.parse(fs.readFileSync(ctx.R('assets/venue/where-is-it.json'), 'utf8')).campus : ctx.store.get(ROWS.find(r => r[0] === at.key)[1]).name) : ''
        events[id] = { n: e.title || id, d: e.date, t: e.time || '', k: at ? at.key : '', b, u: ctx.link(page.rel, `events/${id}/index.html`).replace(/index\.md$/, 'index.html') }
    }
    const json = JSON.stringify({ events, areas, words: w }).replace(/</g, '\\u003c')
    const link = ctx.link(page.rel, 'my-day/index.html').replace(/index\.md$/, 'index.html')
    return w.html.replace('{heading}', esc(w.heading)).replace('{intro}', w.intro.replace('{link}', link)).replace('{json}', () => json)
}

// "Where is it?" (B1 item 2): on an event page of the 2026 programme, its building picked out on a small copy of the map.
// A stage with no known building (and any event outside 6 to 13 November 2026) gets no map: never guessed.
const WORDS = ctx => JSON.parse(fs.readFileSync(ctx.R('assets/venue/where-is-it.json'), 'utf8'))
const EVENT = /^events\/[^/]+\/index\.html$/
export function decorateEvent(page, ctx) {
    const e = ctx.store.get(`event:${page.rel.split('/')[1]}`)
    if (!e || !e.date || e.date < '2026-11-06' || e.date > '2026-11-13') return
    const at = locate(ctx, e)
    if (!at) return
    const w = WORDS(ctx), name = at.key === 'campus' ? w.campus : ctx.store.get(ROWS.find(r => r[0] === at.key)[1]).name
    const fill = t => t.replace('{name}', esc(name)).replace('{link}', ctx.link(page.rel, PAGE).replace(/index\.md$/, 'index.html'))
    const fig = `<figure class="venue-fig venue-fig-sm" id="where-is-it"><figcaption>${fill(w.caption)}</figcaption>${svg(mapData(ctx), [at], true, name, w.aria)}</figure>`
    const prev = page.postHtml
    page.postHtml = html => { const h = html.replace('</table>', () => '</table>' + fig); return prev ? prev(h) : h }
}
export const assets = { css: ['assets/venue/venue.css'], js: ['assets/venue/venue.js'] }
export const llms = ctx => `## Venue map\n- [summit/venue/](${ctx.BASE}summit/venue/index.md): the summit's buildings in Parque das Nações, from OpenStreetMap, and the sessions our programme puts in each. No people on it.`

export function validate(gate) {
    const out = [], j = gate.text('assets/venue/venue-map.json'), page = gate.text('summit/venue/index.html')
    if (!/OpenStreetMap/.test(page) || !/ODbL/.test(page)) out.push('summit/venue/: the OpenStreetMap and ODbL attribution is missing')
    if (/<svg[\s\S]*?<\/svg>/.test(page) && /<(script|a\b|foreignObject)|\son[a-z]+=/i.test(page.match(/<svg[\s\S]*?<\/svg>/)[0])) out.push('summit/venue/: the drawing holds a script, link or handler; it is plain shapes')
    if (!/<svg/.test(page)) out.push('summit/venue/: the drawing is missing')
    if (/"(person|people|zone|vault|lat|lon|pin)"\s*:/.test(j.replace(/"frame":\{[^}]*\}/, ''))) out.push('assets/venue/venue-map.json: holds a person, zone, vault or pin; the public map has none')
    let n = 0
    for (const d of fs.readdirSync(gate.R('events'))) {
        const f = `events/${d}/index.html`
        if (!fs.existsSync(gate.R(f))) continue
        const h = gate.text(f), m = h.match(/<figure class="venue-fig venue-fig-sm"[\s\S]*?<\/figure>/)
        if (!m) continue
        n++
        if (!/OpenStreetMap/.test(m[0]) || !/ODbL/.test(m[0])) out.push(`${f}: map: no attribution`)
        if (/<(script|foreignObject)|\son[a-z]+=/i.test(m[0])) out.push(`${f}: map: script`)
    }
    if (!n) out.push('events/: no map')
    const js = gate.text('assets/venue/venue.js')
    if (/fetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts/.test(js)) out.push('assets/venue/venue.js: network call')
    if (/—/.test(js)) out.push('assets/venue/venue.js: an em-dash')
    if (!/id="vn-data"/.test(page)) out.push('summit/venue/: no data block')
    else if (/"(person|people|zone|vault|lat|lon|pin)"\s*:/.test(page.match(/id="vn-data">([\s\S]*?)<\/script>/)[1])) out.push('summit/venue/: data block holds a person')
    if (/—/.test(j)) out.push('assets/venue/venue-map.json: an em-dash')
    return out
}
