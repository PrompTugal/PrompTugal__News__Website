// Events (brief 6): every event in data/events/, the official programme (organiser web-summit) and the others
// (side events, Portugal Tech Week, conferences elsewhere in Portugal), clearly apart, by day; a page per event with
// its people, its organisations and companies, its place, its source.
import { refLink, sourceLine, timeText, dataLinks, plural, day10, slotLine, slotList, shortDay } from '../lib/present.mjs'
import { companiesOfEvent } from '../lib/graph.mjs'
export const order = 40

const KIND = { summit: 'The summit', session: 'Session', pitch: 'PITCH', announcement: 'Press conference', 'night-summit': 'Night Summit', registration: 'Registration', 'side-event': 'Side event', festival: 'Festival' }
const sortKey = e => `${e.date} ${e.time || '00:00'} ${e.title}`
export const ORGANISER = { 'web-summit': 'Web Summit (the official programme)', other: 'Other organisers' }

function line(ctx, rel, e) {
    return slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })
}
function byDay(ctx, rel, list) {
    const days = [...new Set(list.map(e => e.date))].sort()
    return days.map(d => { const on = list.filter(e => e.date === d).sort((a, b) => sortKey(a).localeCompare(sortKey(b))); return `### ${ctx.DAY(d)} {#${list[0].organiser}-${d}}\n\n${slotList(on.map(e => line(ctx, rel, e)))}` }).join('\n\n')
}

function eventPage(ctx, e) {
    const g = ctx.graph(), rel = `events/${e.id}/index.html`, eid = `event:${e.id}`, cell = ctx.md.cell
    const chain = []; let at = e.place && ctx.store.get(e.place)
    while (at) { chain.push(refLink(ctx, rel, `place:${at.id}`)); at = at.located_in && ctx.store.get(at.located_in) }
    const rows = [
        ['When', `${ctx.DAY(e.date)}${e.end_date ? ` to ${ctx.DAY(e.end_date)}` : ''}, ${timeText(e)} (Lisbon time)`],
        ['Where', chain.length ? chain.join(', ') : cell(e.where || 'not given by the source')],
        ...(e.where && chain.length ? [['As the source puts it', cell(e.where)]] : []),
        ['Kind', KIND[e.kind] || e.kind],
        ['Organiser', e.organised_by ? refLink(ctx, rel, e.organised_by) + (e.organiser === 'web-summit' ? ' (the official programme)' : '') : 'not Web Summit: ' + (e.session_url ? 'listed on the summit\'s schedule, run by others' : 'run by others')],
        ...(e.part_of ? [['Part of', refLink(ctx, rel, e.part_of)]] : []),
        ...(e.track ? [['Track', cell(e.track)]] : []),
        ['Our pick', e.our_pick ? 'Yes: the team chose to follow it' : 'No'],
    ]
    const speakers = e.speakers.map(s => `- ${refLink(ctx, rel, s.person)}${s.role ? `, ${cell(s.role)}` : ''}${s.org ? `, ${refLink(ctx, rel, s.org, s.organisation)}` : s.organisation ? `, ${cell(s.organisation)}` : ''}`)
    const comps = companiesOfEvent(g, eid).sort().map(c => {
        const how = g.outOf(c).filter(x => x.to === eid).map(x => x.verb === 'hosts' ? 'hosts it' : 'named by the session page')
        if (g.inOf(eid, 'speaks_at').some(s => g.outOf(s.from, 'listed_under').some(l => l.to === c))) how.push('a speaker is listed under it')
        return `- ${refLink(ctx, rel, c)}: ${how.join('; ')}.`
    })
    const hostsOrg = g.inOf(eid, 'hosts').filter(x => x.from.startsWith('organisation:')).map(x => `- ${refLink(ctx, rel, x.from)}: hosts it (the session title says so).`)
    const children = g.inOf(eid, 'part_of').map(x => ctx.store.get(x.from)).filter(Boolean).sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
    const kids = !children.length ? '' : `## What it includes {#includes}\n\n` + (children.length > 30
        ? `${plural(children.length, 'event')} in our programme are part of it: [every one, by day](${ctx.link(rel, 'events/index.html')}#${children[0].organiser}).`
        : slotList(children.map(c => slotLine(ctx, rel, c)))) + '\n\n'
    const md = `{.facts}\n| | |\n|---|---|\n${rows.map(([k, v]) => `| **${k}** | ${v} |`).join('\n')}\n\n` +
        (e.note ? `${cell(e.note)}\n\n` : '') +
        (speakers.length || comps.length || hostsOrg.length ? '::: navigator n2\n' : '') +
        (speakers.length ? `::: nv\n## Speakers {#speakers}\n\nAs the event's page lists them: name, role, organisation.\n\n${speakers.join('\n')}\n:::\n\n` : '') +
        (comps.length || hostsOrg.length ? `::: nv\n## Companies and organisations {#companies}\n\n${[...comps, ...hostsOrg].join('\n')}\n:::\n\n` : '') +
        (speakers.length || comps.length || hostsOrg.length ? ':::\n\n' : '') +
        kids +
        `## Where this comes from {#sources}\n\n{.sources}\n- ${sourceLine(e.session_url || e.source_url, e.read_at, e.read_by)}${e.session_url && e.source_url !== e.session_url ? `, found on ${sourceLine(e.source_url)}` : ''}.${e.via ? ` Via ${cell(e.via)}.` : ''}\n\nTimes are Lisbon time (UTC in November) and may change: check the source before you go.\n\n` +
        `${dataLinks(ctx, rel, 'events', e.id)}\n\n[All events](../index.md)`
    return {
        src: `data/events/${e.id}/event.json`, rel, type: 'event', date: day10(e.read_at),
        crumbs: [['events/index.html', 'Events'], [null, e.title]],
        title: e.title,
        summary: `${KIND[e.kind] || e.kind}, ${ctx.DAY(e.date)}${e.time ? `, ${timeText(e)}` : ''}${e.where ? `, ${cell(e.where)}` : ''}. ${e.organiser === 'web-summit' ? 'Part of the official Web Summit programme.' : 'Not run by Web Summit.'}`,
        md,
    }
}

export function pages(ctx) {
    const evs = ctx.store.events
    const official = evs.filter(e => e.organiser === 'web-summit' && e.part_of), other = evs.filter(e => e.organiser === 'other')
    const rel = 'events/index.html'
    const index = {
        src: 'data/events/', rel, type: 'site', layout: 'wide', date: [...evs.map(e => day10(e.read_at))].sort().pop(),
        title: 'Events', summary: `Every event we know of in the week of Web Summit Lisbon 2026: the summit's official programme (${official.length}) and, apart from it, the events others run (${other.length}). By day, each with its source.`,
        md: `Two lists, kept apart: what [Web Summit](${ctx.link(rel, 'organisations/web-summit/index.html')}) itself runs, and what others run around it. Times are Lisbon time (UTC in November) and may change; each event's page links to where it was read. For the summit at a glance, see [the summit](${ctx.link(rel, 'summit/index.html')}); for one table of everything, [the agenda](${ctx.link(rel, 'summit/agenda.html')}).\n\n` +
            `::: seg-links\n${[...new Set(evs.filter(e => e.organiser === 'other' || e.part_of).map(e => e.date))].sort().map(d => `[${shortDay(d).replace(/ Nov$/, '')} · ${evs.filter(e => e.date === d && (e.organiser === 'other' || e.part_of)).length}](#${official.some(e => e.date === d) ? 'web-summit' : 'other'}-${d})`).join(' ')}\n:::\n\n` +
            `::: cols-8-4\n::: col day-sec\n## The official programme {#web-summit}\n\nOpening Night, Centre Stage and the stage sessions, PITCH, press conferences, Night Summit and registration: ${plural(official.length, 'event')}, all part of ${refLink(ctx, rel, 'event:web-summit-lisbon-2026')}. The full schedule has hundreds of sessions a day: see [websummit.com/schedule](https://websummit.com/schedule/).\n\n${byDay(ctx, rel, official)}\n:::\n` +
            `::: col day-sec\n## Other events {#other}\n\nSide events (some listed on the summit's schedule but run by others), Portugal Tech Week, and conferences elsewhere in Portugal: ${plural(other.length, 'event')}. Not run by Web Summit.\n\n${byDay(ctx, rel, other)}\n:::\n:::`,
    }
    return [index, ...evs.map(e => eventPage(ctx, e))]
}

export const searchDocs = ctx => ctx.store.events.map(e => ({ id: `event:${e.id}`, url: `events/${e.id}/index.html`, title: e.title, type: 'event', date: day10(e.read_at), text: `${e.kind} ${e.date} ${e.time || ''} ${e.where || ''} ${e.track || ''} ${e.speakers.map(s => s.as_listed).join('; ')}` }))
