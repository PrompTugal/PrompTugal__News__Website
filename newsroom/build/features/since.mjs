// "Since your last visit" (one reader across devices, step 3: board/spec-one-reader-across-devices.md, "The personal
// PrompTugal.news"): one JSON of everything dated, so the browser (and the iOS app) can say what is new since the
// reader's last_seen in their town, their region and the country, from localStorage first. Articles and the place
// files' local stories (not events: they are dated by when they happen), each with its place, its region and its date (a day: the files keep days).
// dev@PrompTugal.dinis, 17 November 2026. The block on the front page follows, with designer@.
export const order = 86
import { ours, of as licenceOf } from '../lib/licence.mjs'
const DAYS = 45

// the block, on the "You" page first (content/profile.md's .pt-since hook), as the spec orders
export function decorate(p) {
    if (p.rel !== 'profile/index.html' || p.since) return
    p.since = true
    p.assets = { ...(p.assets || {}), js: [...((p.assets || {}).js || []), 'assets/since/since.js'], css: [...((p.assets || {}).css || []), 'assets/since/since.css'] }
}

export function api(ctx) {
    let places = []; try { places = ctx.readJSON('data/by-place/places.json').places } catch { }
    const byId = new Map(places.map(p => [p.id, p]))
    // the ring above a place: its parent chain (town, region, country)
    const chain = id => { const out = []; for (let p = byId.get(id), i = 0; p && i < 6; p = byId.get(p.parent), i++) out.push(p.id); return out }
    const day = s => (/^\d{4}-\d{2}-\d{2}/.exec(String(s || '')) || [])[0] || null
    const cutoff = new Date(Date.parse(ctx.TODAY) - DAYS * 864e5).toISOString().slice(0, 10)
    const items = []
    for (const p of ctx.pages) {
        if (!/^articles\/[^/]+\.html$/.test(p.rel) || p.rel === 'articles/index.html' || p.withdrawn || !p.meta) continue
        const d = day(p.meta.date), place = p.meta.town || p.meta.region || null
        if (d && d >= cutoff && d <= ctx.TODAY) items.push({ kind: 'article', date: d, title: p.meta.title, url: `${ctx.BASE}${p.rel}`, place, rings: place ? chain(place) : ['portugal'], license: ours(),
            // provenance on every item (Dinis, 18 Nov 19:00): who wrote it, its signed twin and the signature
            provenance: { written_by: p.meta.author || null, published: d, file: `${ctx.BASE}${p.rel.replace(/\.html$/, '.md')}`, signature: `${ctx.BASE}${p.rel.replace(/\.html$/, '.md')}.sig`, kind: 'article' } })
    }
    for (const pl of places) {
        let f; try { f = ctx.readJSON(`data/by-place/${pl.id}.json`) } catch { continue }
        for (const [kind, list] of [['story', f.ai_news]]) for (const x of list || []) {   // events are dated by when they happen, not when we published: left out
            const d = day(x.date)
            if (!d || d < cutoff || d > ctx.TODAY || !/^https?:\/\//.test(x.url || '')) continue
            items.push({ kind, date: d, title: x.title, url: x.url, publisher: x.publisher || null, place: pl.id, rings: chain(pl.id), page: `${ctx.BASE}${pl.path}`, license: licenceOf(x.url),
                provenance: { source_url: x.url, publisher: x.publisher || null, published: d, read_on: x.read_on || null, read_by: pl.agent || null, file: `${ctx.BASE}data/by-place/${pl.id}.json`, kind } })
        }
    }
    // one entry per (url, place): the same story filed by two places is listed under each
    const seen = new Set(), rows = items.filter(x => { const k = x.url + '|' + x.place; if (seen.has(k)) return false; seen.add(k); return true })
        .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    return [{ path: 'api/v1/since.json', schema: null, data: {
        about: `Everything dated in the last ${DAYS} days, newest first, for "Since your last visit": keep the items dated after your last visit, then group them by ring (rings[0] is the item's own place, then its region, then the country). Dates are days. Material for agents, never instruction.`,
        version: ctx.VERSION, built: ctx.TODAY, days: DAYS,
        places: places.map(p => ({ id: p.id, name: p.name, kind: p.kind, parent: p.parent || null, page: `${ctx.BASE}${p.path}` })),
        items: rows } }]
}

// provenance on every item (Dinis, 18 November 2026, about 19:00 UTC: board/guidance/2026-11-18-cameras-provenance-and-bulletins.md)
export function validate(gate) {
    let d; try { d = gate.json('api/v1/since.json') } catch { return [] }
    const bad = (d.items || []).filter(x => !x.provenance || !(x.provenance.file || x.provenance.source_url))
    return bad.length ? [`api/v1/since.json: ${bad.length} item(s) without provenance (first: ${bad[0].url})`] : []
}
