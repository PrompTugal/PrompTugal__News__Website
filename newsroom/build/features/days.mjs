// The summit's days (guidance 6 Nov 13:20 UTC, board/spec-the-summit-days.md): a page for each of the eight days,
// Friday 6 to Friday 13 November, under the strip of days. One day reads three ways, switched by the link followed
// (CSS :target): C five things (the default), A a timeline of every session, B the sessions grouped by stage.
// The five are the highest-ranked items of the day for now; the correspondent's own pick will replace them.
// A past day says it is the past. Rebuilding the site as it was that day (S2) is not built yet, and the page says so.
import { slotLine, slotList } from '../lib/present.mjs'
import { load, rank, KIND, STRIP_DAYS, stripMd } from './agenda.mjs'
export const order = 60

const byTime = (a, b) => (a.time || '').localeCompare(b.time || '')

function dayPage(ctx, d, i) {
    const { itemsOn, TODAY, DAY } = load(ctx), rel = `days/${d}/index.html`, items = itemsOn(d)
    const line = e => slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })
    const rk = e => e.kind === 'registration' && d >= '2026-11-10' ? 4 : rank(e)   // on conference days registration is not the highlight
    const five = [...items].sort((a, b) => rk(a) - rk(b) || byTime(a, b)).slice(0, 5).sort(byTime)
    const stages = [...new Set(items.map(e => e.where || 'Place not listed'))].sort()
    const when = d < TODAY ? 'past' : d === TODAY ? 'today' : 'future'
    const banner = {
        past: `**The past: ${DAY(d)}.** This day has gone. Below is what was on, as we hold it today. The site as it looked at the end of that day is planned and not built yet. [Back to today](${ctx.link(rel, 'index.html')}).`,
        today: `**Today: ${DAY(d)}.** What is on today, then the other days in the strip above.`,
        future: `**Planned: ${DAY(d)}**, as listed on ${DAY(TODAY)}. Times and rooms can move: each item links to its source.`,
    }[when]
    const prev = STRIP_DAYS[i - 1], next = STRIP_DAYS[i + 1]
    const md = `${stripMd(ctx, rel, d)}\n\n{.notice .brand}\n${banner}\n\n` +
        (items.length ? `{.view-switch}\n[Five things](#v-five) · [Every session, by time](#v-all) · [By stage](#v-stages)\n\n` +
            `::: view view-five\n#### Five things {#v-five}\n\n${slotList(five.map(line))}\n\n${items.length > 5 ? `${items.length - 5} more: use *Every session, by time* above.` : ''}\n:::\n\n` +
            `::: view view-all\n#### Every session, by time ({#v-all})\n\n${slotList([...items].sort(byTime).map(line))}\n:::\n\n`.replace(' ({#v-all})', ' {#v-all}') +
            `::: view view-stages\n#### By stage {#v-stages}\n\n${stages.map(w => `### ${ctx.md.cell(w)}\n\n${slotList(items.filter(e => (e.where || 'Place not listed') === w).sort(byTime).map(line))}`).join('\n\n')}\n:::\n\n`
            : `Nothing from our programme is listed for ${DAY(d)} yet. [The full agenda](${ctx.link(rel, 'summit/agenda.html')}).\n\n`) +
        `{.more-line}\n${prev ? `[Earlier: ${DAY(prev)}](${ctx.link(rel, `days/${prev}/index.html`)})` : ''}${prev && next ? ' · ' : ''}${next ? `[Later: ${DAY(next)}](${ctx.link(rel, `days/${next}/index.html`)})` : ''} · [The full agenda](${ctx.link(rel, 'summit/agenda.html')})`
    return {
        src: 'data/events/', rel, type: 'site', date: TODAY, section: 'agenda',
        crumbs: [['summit/index.html', 'The summit'], [null, DAY(d)]],
        title: `${DAY(d)}: what is on`,
        summary: `${items.length} item${items.length === 1 ? '' : 's'} in our programme on ${DAY(d)}, Web Summit Lisbon week: five things to plan around, every session by time and by stage.`,
        md,
    }
}

export function pages(ctx) { return STRIP_DAYS.map((d, i) => dayPage(ctx, d, i)) }
