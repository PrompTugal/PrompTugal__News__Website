// What the home page's designs A, B and C (Silvio's mocks, built from data) have in common: the template reader, the
// pill that is true only where it is, the picture, the moments in Lisbon's time, and the data every design draws on
// (the correspondent's order and briefing, the field radar, the numbers, the days, now and next, the countdown).
// dev.pages@PrompTugal.dinis, 7 November 2026 (board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md).
import fs from 'node:fs'
import path from 'node:path'
import { frontOrder, imageFile } from '../features/front.mjs'
import { load, rank, STRIP_DAYS } from '../features/agenda.mjs'

export const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
export function template(file) {
    const T = fs.readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8')
    const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
    const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
    return { part, item, many: (n, list) => list.map(v => put(item(n), v)).join('') }
}
export const slugOf = a => a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
export const beatOf = a => String(a.meta.beat || String(a.meta.tags || 'News').split(',')[0]).replace(/^connections:\s*/i, '').trim()
export const cut = (t, max) => t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : t
const read = f => { try { return JSON.parse(fs.readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8')) } catch { return null } }
export const plusDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10)

// the pill only where true: "signed" when the article's signature is in the repository, "checked" when dev.verify@'s
// verified record exists; "agent-written" is always true here
export function pill(ctx, T, a) {
    const s = slugOf(a), has = f => fs.existsSync(path.join(ctx.ROOT, f))
    const parts = ['agent-written', has(`board/team/dev.verify/records/${s}/verified.json`) && 'checked', has(`${a.rel.replace(/\.html$/, '.md')}.sig`) && 'signed'].filter(Boolean)
    return parts.length > 1 ? put(T.item('pill'), { text: '✦ ' + parts.join(' · '), title: 'Written by an AI agent; ' + parts.slice(1).join(' and ') }) : ''
}
export function picture(ctx, T, a, size, lazy = true) {
    const i = imageFile(a, size); if (!i) return ''
    const [w, h] = size === 'card' ? [1200, 630] : [480, 480]
    return put(T.item('picture'), { src: i.src, ink: i.src.replace('--paper--', '--ink--'), alt: ctx.md.esc(i.alt), w, h, load: lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"' })
}
export const when = (ctx, i) => { const d = i.date === ctx.TODAY ? 'Today' : ctx.DAY(i.date).split(' ')[0].slice(0, 3); return i.start ? `${d} ${i.start}` : `${d}, all day` }
export const endOf = i => `${i.date}T${i.end || i.start || '23:59'}:00Z`

export function data(ctx) {
    const all = frontOrder(ctx), by = new Map(all.map(a => [slugOf(a), a])), { AGENDA, itemsOn } = load(ctx)
    const bl = (read('desks/correspondent/front-page.json')?.briefing?.items || []).map(i => by.get(i.article)).filter(Boolean)
    const briefing = [...bl, ...all.filter(a => !bl.includes(a))].slice(0, 5)
    const fields = ctx.store.topics.filter(t => t.kind === 'field').map(t => [t, ctx.store.companies.filter(c => c.category === t.category).length]).filter(x => x[1]).sort((x, y) => y[1] - x[1])
    const opening = AGENDA.items.find(i => /opening night/i.test(i.what))
    const openingAt = opening ? `${opening.date}T${opening.start || '18:00'}:00Z` : ''
    const left = Math.ceil((Date.parse(openingAt) - Date.parse(ctx.TODAY + 'T12:00:00Z')) / 864e5)
    const next = AGENDA.items.filter(i => i.date >= ctx.TODAY && rank(i) <= 3).sort((x, y) => x.date.localeCompare(y.date) || (x.start || '').localeCompare(y.start || '')).slice(0, 10)
    const signed = all.filter(a => fs.existsSync(path.join(ctx.ROOT, a.rel.replace(/\.html$/, '.md') + '.sig'))).length
    const weekEvents = [...Array(7).keys()].reduce((s, n) => s + itemsOn(plusDays(ctx.TODAY, n)).length, 0)
    return { all, briefing, fields, openingAt, openingIn: left > 0 ? `${left}d` : '', next, signed, weekEvents, itemsOn, days: STRIP_DAYS,
        date: `${ctx.DAY(ctx.TODAY)} ${ctx.TODAY.slice(0, 4)}`, companies: ctx.store.companies.length }
}
// the pieces nearly every design has
export const radar = (ctx, T, D, n = 6) => { const max = D.fields[0]?.[1] || 1
    return T.many('radar', D.fields.slice(0, n).map(([t, c]) => ({ href: `topics/${t.id}/index.html`, name: ctx.md.esc(t.name), n: c, pct: Math.round(100 * c / max) }))) }
export const asks = T => T.many('ask', ['Which AI agent companies are at Web Summit?', 'What is on Tuesday for security?', 'Portuguese startups raising money'].map(q => ({ q: encodeURIComponent(q), text: q })))
export const dayCells = (ctx, T, D, TODAY = ctx.TODAY) => T.many('day', D.days.map(d => ({
    href: `days/${d}/index.html`, wd: ctx.DAY(d).split(' ').slice(0, 2).join(' ').replace(/^(\w{3})\w*/, '$1'), cur: d === TODAY ? ' on' : d >= '2026-11-09' && d <= '2026-11-12' ? ' ws' : '',
    sub: d === TODAY ? 'Today' : ({ '2026-11-09': 'Opening', '2026-11-10': 'Day 1', '2026-11-11': 'Day 2', '2026-11-12': 'Day 3', '2026-11-13': 'After' })[d] || `${D.itemsOn(d).length} items` })))
export const nextItems = (ctx, T, D, n = 6) => T.many('next', D.next.slice(0, n).map(i => ({ href: `events/${i.id}/index.html`, date: i.date, end: endOf(i), when: ctx.md.esc(when(ctx, i)), what: ctx.md.esc(cut(i.what, 100)) })))
