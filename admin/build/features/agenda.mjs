// The agenda (brief 6): built from the programme desk's desks/programme/agenda.json at every release.
// Fills <!-- agenda:front --> (today and the days to 12 November, at most six highlights a day),
// <!-- agenda:full --> (every item, every day) and <!-- agenda:meta --> (where it comes from).
export const order = 25

let A
const load = ctx => A || (A = (() => {
    const { readJSON, TODAY, DAY } = ctx
    const AGENDA = readJSON('desks/programme/agenda.json')
    const days = [...new Set(AGENDA.items.map(i => i.date))].sort()
    const itemsOn = d => AGENDA.items.filter(i => i.date === d).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    const r = AGENDA.items.map(i => i.read_at).sort()
    return { AGENDA, days, itemsOn, readSpan: `${r[0].slice(0, 10)} to ${r[r.length - 1].slice(0, 10)}`, TODAY, DAY }
})())

const KIND = { registration: 'Registration', summit: 'Summit', announcement: 'Press conference', pitch: 'PITCH', 'night-summit': 'Night Summit', 'side-event': 'Side event', 'team-pick': 'Our pick' }
const linkOf = i => i.session_url || i.source_url
const rank = i => i.kind === 'registration' || /opening night/i.test(i.what) ? 0
    : i.kind === 'announcement' || (i.kind === 'pitch' && /final|winner/i.test(i.what)) ? 1
    : i.kind === 'summit' ? 2 : i.kind === 'side-event' ? 3 : i.kind === 'night-summit' ? 4 : 5

export const fill = {
    'agenda:front': (page, ctx) => {
        const { days, itemsOn, TODAY, DAY } = load(ctx), cell = ctx.md.cell
        return days.filter(d => d >= TODAY).map(d => {
            const all = itemsOn(d)
            const top = [...all].sort((a, b) => rank(a) - rank(b) || (a.time || '').localeCompare(b.time || '')).slice(0, 6)
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
            const more = all.length - top.length
            return `### ${d === TODAY ? 'Today, ' : ''}${DAY(d)}\n\n` +
                top.map(i => `- **${i.time ? i.time.replace('-', ' to ') : 'All day'}** · [${cell(i.what)}](${linkOf(i)})${i.where ? ` · ${cell(i.where)}` : ''}`).join('\n') +
                (more > 0 ? `\n- [${more} more on ${DAY(d).split(' ')[0]}](${ctx.link(page.rel, 'summit/agenda.html')}#d-${d})` : '')
        }).join('\n\n') || `The summit is over. [The full agenda](${ctx.link(page.rel, 'summit/agenda.html')}) stays as it was.`
    },
    'agenda:full': (page, ctx) => {
        const { days, itemsOn, TODAY, DAY } = load(ctx), cell = ctx.md.cell
        return days.map(d => {
            const all = itemsOn(d)
            return `## ${DAY(d)}${d < TODAY ? ' (past)' : d === TODAY ? ' (today)' : ''} {#d-${d}}\n\n${all.length} item${all.length === 1 ? '' : 's'}.\n\n| Time | What | Where | Kind |\n|---|---|---|---|\n` +
                all.map(i => `| ${i.time || 'All day'} | [${cell(i.what)}](${linkOf(i)})${i.speakers && i.speakers.length ? `. With ${cell(i.speakers.join(', '))}` : ''}${i.note ? ` (${cell(i.note)})` : ''} | ${cell(i.where)} | ${KIND[i.kind] || i.kind} |`).join('\n')
        }).join('\n\n')
    },
    'agenda:meta': (page, ctx) => {
        const { AGENDA, days, readSpan, DAY } = load(ctx)
        return `${AGENDA.count} items from ${DAY(days[0])} to ${DAY(days[days.length - 1])}, each read at its public source between ${readSpan} by ${AGENDA.agent}, the programme desk. Times are Lisbon time (UTC in November) and may change: check the summit's own schedule before you go.`
    },
}
