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

function svg(map, lit) {
    const { width: W, height: H } = map.frame
    const on = new Set(lit.flatMap(k => k.areas))
    const label = a => a.label === 'FIL' ? '' : `<text x="${a.c[0]}" y="${a.c[1]}" text-anchor="middle" dominant-baseline="middle" class="vn-lab">${esc(a.label)}</text>`
    return `<svg class="venue-map" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="vn-t vn-d" xmlns="http://www.w3.org/2000/svg">` +
        `<title id="vn-t">The summit's buildings in Parque das Nações</title>` +
        `<desc id="vn-d">A stylised plan from OpenStreetMap: FIL with Pavilions 1 to 4, the MEO Arena, the Pavilhão de Portugal, Oriente station and the Vasco da Gama centre. Buildings that hold sessions in our programme are shaded. No person is shown.</desc>` +
        `<path d="${map.river}" class="vn-river"/>` +
        map.streets.map(s => `<path d="${s.d}" class="vn-street"/><text x="${s.at[0]}" y="${s.at[1]}" transform="rotate(${s.angle} ${s.at[0]} ${s.at[1]})" class="vn-street-lab">${esc(s.short)}</text>`).join('') +
        map.areas.map(a => `<path d="${a.d}" class="vn-area vn-${a.kind}${on.has(a.id) ? ' vn-on' : ''}"><title>${esc(a.label)}</title></path>`).join('') +
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
    if (page.rel !== PAGE) return
    const map = mapData(ctx), { by } = litOf(ctx), lit = ROWS.filter(([k]) => by(k).length).map(([k, p]) => AT[p])
    const prev = page.postHtml
    page.postHtml = html => { const h = html.replace(`<p>${TOKEN}</p>`, `<figure class="venue-fig">${svg(map, lit)}</figure>`); return prev ? prev(h) : h }
}

export const assets = { css: ['assets/venue/venue.css'] }
export const llms = ctx => `## Venue map\n- [summit/venue/](${ctx.BASE}summit/venue/index.md): the summit's buildings in Parque das Nações, from OpenStreetMap, and the sessions our programme puts in each. No people on it.`

export function validate(gate) {
    const out = [], j = gate.text('assets/venue/venue-map.json'), page = gate.text('summit/venue/index.html')
    if (!/OpenStreetMap/.test(page) || !/ODbL/.test(page)) out.push('summit/venue/: the OpenStreetMap and ODbL attribution is missing')
    if (/<svg[\s\S]*?<\/svg>/.test(page) && /<(script|a\b|foreignObject)|\son[a-z]+=/i.test(page.match(/<svg[\s\S]*?<\/svg>/)[0])) out.push('summit/venue/: the drawing holds a script, link or handler; it is plain shapes')
    if (!/<svg/.test(page)) out.push('summit/venue/: the drawing is missing')
    if (/"(person|people|zone|vault|lat|lon|pin)"\s*:/.test(j.replace(/"frame":\{[^}]*\}/, ''))) out.push('assets/venue/venue-map.json: holds a person, zone, vault or pin; the public map has none')
    if (/—/.test(j)) out.push('assets/venue/venue-map.json: an em-dash')
    return out
}
