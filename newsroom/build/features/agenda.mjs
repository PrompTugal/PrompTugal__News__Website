// The agenda (brief 6): built from the programme desk's desks/programme/agenda.json (through data/events/) at every release.
// Fills <!-- agenda:front --> (today and the days to 12 November, at most six highlights a day),
// <!-- agenda:full --> (every item, every day) and <!-- agenda:meta --> (where it comes from).
import { slotLine, slotList } from '../lib/present.mjs'
export const order = 25

let A
const load = ctx => A || (A = (() => {
    const { TODAY, DAY } = ctx
    // the agenda's items are the events derived from the programme desk's file (data/events/, newsroom/tools/derive.mjs)
    const items = ctx.store.events.filter(e => e.listed_as).map(e => ({ ...e, what: e.title, kind: e.listed_as, speakers: e.speakers.map(s => s.as_listed) }))
    const AGENDA = { items, count: items.length, agent: [...new Set(items.map(i => i.read_by))].join(', ') }
    const days = [...new Set(AGENDA.items.map(i => i.date))].sort()
    const itemsOn = d => AGENDA.items.filter(i => i.date === d).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    const r = AGENDA.items.map(i => i.read_at).sort()
    return { AGENDA, days, itemsOn, readSpan: `${r[0].slice(0, 10)} to ${r[r.length - 1].slice(0, 10)}`, TODAY, DAY }
})())

const KIND = { registration: 'Registration', summit: 'Summit', announcement: 'Press conference', pitch: 'PITCH', 'night-summit': 'Night Summit', 'side-event': 'Side event', 'team-pick': 'Our pick' }
const linkOf = i => i.session_url || i.source_url
// the events page's day anchor for a day's list: the official programme's, unless the day has only other events
const i0 = all => all.some(i => i.organiser === 'web-summit') ? 'web-summit' : 'other'
const rank = i => i.kind === 'registration' || /opening night/i.test(i.what) ? 0
    : i.kind === 'announcement' || (i.kind === 'pitch' && /final|winner/i.test(i.what)) ? 1
    : i.kind === 'summit' ? 2 : i.kind === 'side-event' ? 3 : i.kind === 'night-summit' ? 4 : 5

// the days strip (designer@'s S1, dev.pages@): eight cells, Friday 6 to Friday 13 November, today marked, the summit's days
// tinted; each cell links to that day's agenda, with its count of items. Pages for each day wait on Dinis's go.
const STRIP = ['2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']
const LABEL = { '2026-11-09': 'Opening', '2026-11-10': 'Day 1', '2026-11-11': 'Day 2', '2026-11-12': 'Day 3', '2026-11-13': 'After' }

export const fill = {
    'days:strip': (page, ctx) => {
        const { itemsOn, TODAY } = load(ctx)
        const cells = STRIP.map(d => {
            const wd = new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }), n = itemsOn(d).length
            const cls = [d === TODAY ? 'today' : d < TODAY ? 'past' : '', d >= '2026-11-09' && d <= '2026-11-12' ? 'summit' : ''].filter(Boolean).join(' ')
            return `- ${cls ? `{${cls}} ` : ''}[**${wd} ${+d.slice(8)}** *${d === TODAY ? 'Today' : LABEL[d] || (n ? n + ' items' : '')}*](${ctx.link(page.rel, 'summit/agenda.html')}#d-${d})`
        })
        return `{.day-strip}\n${cells.join('\n')}`
    },
    'agenda:front': (page, ctx) => {
        // today and the next three days with something on, three highlights a day (sherpa F3: the column was two phone screens), drawn as the design's agenda
        const { days, itemsOn, TODAY, DAY } = load(ctx)
        return days.filter(d => d >= TODAY).slice(0, 4).map(d => {
            const all = itemsOn(d)
            const top = [...all].sort((a, b) => rank(a) - rank(b) || (a.time || '').localeCompare(b.time || '')).slice(0, 3)
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
            const more = all.length - top.length
            return `### ${d === TODAY ? 'Today, ' : ''}${DAY(d)}\n\n` + slotList(top.map(i => slotLine(ctx, page.rel, i, { day: false, extra: [KIND[i.kind] || i.kind] }))) +
                (more > 0 ? `\n\n{.more-line}\n[${more} more on ${DAY(d).split(' ')[0]}](${ctx.link(page.rel, 'events/index.html')}#${i0(all)}-${d})` : '')
        }).join('\n\n') || `The summit is over. [The full agenda](${ctx.link(page.rel, 'summit/agenda.html')}) stays as it was.`
    },
    'agenda:full': (page, ctx) => {
        const { days, itemsOn, TODAY, DAY } = load(ctx), cell = ctx.md.cell
        return days.map(d => {
            const all = itemsOn(d)
            return `## ${DAY(d)}${d < TODAY ? ' (past)' : d === TODAY ? ' (today)' : ''} {#d-${d}}\n\n${all.length} item${all.length === 1 ? '' : 's'}.\n\n| Time | What | Where | Kind |\n|---|---|---|---|\n` +
                all.map(i => `| ${i.time || 'All day'} | [${cell(i.what)}](${ctx.link(page.rel, `events/${i.id}/index.html`)}) ([source](${linkOf(i)}))${i.speakers && i.speakers.length ? `. With ${cell(i.speakers.join(', '))}` : ''}${i.note ? ` (${cell(i.note)})` : ''} | ${cell(i.where)} | ${KIND[i.kind] || i.kind} |`).join('\n')
        }).join('\n\n')
    },
    'agenda:meta': (page, ctx) => {
        const { AGENDA, days, readSpan, DAY } = load(ctx)
        return `${AGENDA.count} items from ${DAY(days[0])} to ${DAY(days[days.length - 1])}, each read at its public source between ${readSpan} by ${AGENDA.agent}, the programme desk. Times are Lisbon time (UTC in November) and may change: check the summit's own schedule before you go.`
    },
}
