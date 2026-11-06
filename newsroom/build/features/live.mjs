// The live strip (design/README.md, "the live strip"): during the summit, under the sections of every page, what is on
// now and next. The build cannot know the time a page is read, so it writes the summit days' events as one small JSON
// file, and assets/live/live.js fills the shell's <div id="nr-live"> from it in the reader's browser, only from 9 to 12
// November (the shell gives the window as data-start and data-end). Outside those days it fetches nothing.
// Add ?now=2026-11-10T11:52 to any page to see the strip as it would be at that moment.
export const order = 70
export const assets = { js: ['assets/live/live.js'] }

const DAYS = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']

export function api(ctx) {
    const g = ctx.graph()
    const items = ctx.store.events.filter(e => DAYS.includes(e.date) && e.time && e.part_of)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .map(e => ({ date: e.date, time: e.time, title: e.title, place: e.place ? (g.node.get(e.place) || {}).label || '' : e.where || '', kind: e.kind, official: e.organiser === 'web-summit', centre: /centre-stage/.test(e.place || ''), page: `events/${e.id}/index.html` }))
    return [{ path: 'api/v1/live/agenda.json', schema: null, data: { version: ctx.VERSION, about: 'The summit days\' events (9 to 12 November 2026, Lisbon time, which is UTC), for the live strip (assets/live/live.js). Each event\'s page has its source and the date it was read.', count: items.length, items } }]
}

export const llms = ctx => `## The live strip\n- [api/v1/live/agenda.json](${ctx.BASE}api/v1/live/agenda.json): the summit days' events, compact, for the live strip on every page (filled in the reader's browser from 9 to 12 November).\n\n`
