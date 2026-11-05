// Small helpers features share to write markdown about entities: links between entity pages, a source with the date
// it was read, times and dates. Markdown out; no HTML (that is the shell's job) and no file access.
import { pageOf } from './graph.mjs'
import { cell } from './markdown.mjs'

// a markdown link from the page at fromRel to the entity's page; the label alone when the entity has no page
export function refLink(ctx, fromRel, ref, label) {
    const g = ctx.graph(), n = g.node.get(ref)
    const text = cell(label ?? (n ? n.label : ref))
    const to = pageOf(ref)
    return to && n ? `[${text}](${ctx.link(fromRel, to)})` : text
}
export const day10 = s => String(s || '').slice(0, 10)
export const readOn = s => day10(s)
export const shortUrl = (u, n = 70) => cell(String(u).replace(/^https?:\/\/(www\.)?/, '')).slice(0, n)
// "[websummit.com/sessions/...](url), read 2026-11-04 by programme@web-summit.vicky"
export const sourceLine = (url, read, by) => `[${shortUrl(url)}](${url})${read ? `, read ${readOn(read)}` : ''}${by ? ` by ${by}` : ''}`
export const timeText = e => e.time ? e.time.replace('-', ' to ') : 'All day'
export const maxDate = (...ds) => ds.flat().map(day10).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop() || null
export const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`
// the graph JSON and entity JSON links every entity page ends with
export const dataLinks = (ctx, fromRel, type, slug, hasGraph = true) =>
    `The same, as data: [${type}/${slug}.json](${ctx.link(fromRel, `api/v1/${type}/${slug}.json`)})` +
    (hasGraph ? ` and its graph, [graph/${type}/${slug}.json](${ctx.link(fromRel, `api/v1/graph/${type}/${slug}.json`)})` : '') +
    ` (how to read them: [the data, as JSON](${ctx.link(fromRel, 'api/index.html')})).`
