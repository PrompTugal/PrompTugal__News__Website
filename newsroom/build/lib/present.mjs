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
export const shortUrl = (u, n = 70) => { const s = cell(String(u).replace(/^https?:\/\/(www\.)?/, '')); return s.length > n ? s.slice(0, n - 1) + '…' : s }
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

// The schedule line every page uses for an event, in the design's slot shape (design/README.md, "agenda"):
//   - **14:00** [Title](event) *Tue 10 Nov, until 14:20 · [Centre Stage](place) · extra* `Our pick`
// It reads as plain text in the twin; with {.agenda} before the list, the page draws a time column.
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const shortDay = d => { const t = new Date(d + 'T12:00:00Z'); return `${DOW[t.getUTCDay()]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]}` }
// a town's region after its name ("Lagos, Algarve"), from the place data's located_in; nothing for a stage, a venue in Lisbon or a country
function regionOf(ctx, ref) {
    const p = ctx.store.get(ref), up = p && p.located_in && ctx.store.get(p.located_in)
    return up && up.kind === 'region' && p.kind !== 'region' ? `, ${cell(up.name)}` : ''
}
export function slotLine(ctx, fromRel, e, { day = true, place = true, extra = [], tags = [] } = {}) {
    const [a, b] = (e.time || '').split('-')
    const meta = [day ? shortDay(e.date) + (b ? `, until ${b}` : '') : (b ? `until ${b}` : ''), place ? (e.place ? refLink(ctx, fromRel, e.place) + regionOf(ctx, e.place) : e.where ? cell(e.where) : '') : '', ...extra].filter(Boolean)
    const t = [...tags, ...(e.our_pick ? ['Our pick'] : [])]
    return `- **${a || 'All day'}** ${refLink(ctx, fromRel, `event:${e.id}`)}${meta.length ? ` *${meta.join(' · ')}*` : ''}${t.map(x => ` \`${x}\``).join('')}`
}
// a list of schedule lines with the class hook that draws them as an agenda
export const slotList = lines => lines.length ? `{.agenda}\n${lines.join('\n')}` : ''
