// Organisations: every organisation a source names that is not one of the companies we follow (speakers' employers,
// institutions, delegations, publishers), named as listed, with the people listed under it and the events it hosts.
import { refLink, sourceLine, timeText, dataLinks, plural, maxDate, slotLine, slotList } from '../lib/present.mjs'
export const order = 55

function orgPage(ctx, o) {
    const g = ctx.graph(), rel = `organisations/${o.id}/index.html`, oid = `organisation:${o.id}`, cell = ctx.md.cell
    const people = g.inOf(oid, 'listed_under').map(e => ctx.store.get(e.from)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
    const evIds = new Set([...g.inOf(oid, 'listed_under').flatMap(e => g.outOf(e.from, 'speaks_at').map(x => x.to)), ...g.outOf(oid, 'hosts').map(x => x.to)])
    const evs = [...evIds].map(id => ctx.store.get(id)).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const organises = g.inOf(oid, 'organised_by')
    const named = g.inOf(oid, 'names').map(e => e.from)
    const md = (o.marker ? `${cell(o.marker_note)}\n\n` : '') + (o.note ? `${cell(o.note)}\n\n` : '') +
        `{.facts}\n| | |\n|---|---|\n| **Name** | ${cell(o.name)} |\n| **Names as listed** | ${o.names_as_listed.map(cell).join('; ')} |\n| **One of the companies we follow?** | No: named by a source, not in the team's company map |\n\n` +
        (organises.length ? `## The events it runs {#organises}\n\n${plural(organises.length, 'event')} in our programme: [the official programme, by day](${ctx.link(rel, 'events/index.html')}#web-summit).\n\n` : '') +
        (people.length ? `## People listed under it {#people}\n\n{.rows .links-cols}\n${people.map(p => `- ${refLink(ctx, rel, `person:${p.id}`)}${p.role ? `, ${cell(p.role)}` : ''}`).join('\n')}\n\n` : '') +
        (evs.length ? `## At the summit {#summit}\n\n${slotList(evs.map(e => slotLine(ctx, rel, e)))}\n\n` : '') +
        (named.length ? `## Named in the research {#research}\n\nThe curator's map lists it in ${plural(named.length, 'capture')} of the research desk (${named.map(n => n.slice(9)).join(', ')}), on ${[...new Set(named.map(n => ctx.store.get(n)?.beat))].join(', ')}.\n\n` : '') +
        `## Where this comes from {#sources}\n\n{.sources}\n${o.sources.map(s => `- ${sourceLine(s.url, s.read_at || s.read_on, s.by)}: ${cell(s.how)}.`).join('\n')}\n\n` +
        `${dataLinks(ctx, rel, 'organisations', o.id, false)}\n\n[All organisations](../index.md)`
    return {
        src: `data/organisations/${o.id}/organisation.json`, rel, type: 'organisation', date: maxDate(o.sources.map(s => s.read_at || s.read_on)),
        crumbs: [['organisations/index.html', 'Organisations'], [null, o.name]],
        title: o.name, summary: `Named by ${plural(o.sources.length, 'source')}${people.length ? `; ${plural(people.length, 'person', 'people')} listed under it` : ''}. Not one of the companies we follow.`,
        md,
    }
}

export function pages(ctx) {
    const os = [...ctx.store.organisations].sort((a, b) => a.name.localeCompare(b.name))
    const rel = 'organisations/index.html'
    return [{
        src: 'data/organisations/', rel, type: 'site', date: maxDate(os.flatMap(o => o.sources.map(s => s.read_at || s.read_on))),
        title: 'Organisations', summary: `${os.length} organisations named by our sources that are not among the companies we follow: speakers' employers, institutions, delegations, publishers. Named as listed; never merged by guesswork.`,
        md: `A name is linked to one of [our companies](${ctx.link(rel, 'companies/index.html')}) only when a source says it is that company (the company's own summit pages use the name) or a person has decided it, with the reason, in \`data/curation/organisations.json\`. Everything else is listed here as its own organisation. Names that differ only in case, punctuation, a leading "The" or a legal form ("Inc.", "Group") are the same name.\n\n` +
            '{.rows .links-cols}\n' + os.map(o => `- ${refLink(ctx, rel, `organisation:${o.id}`)}${o.marker ? ' (a listing placeholder)' : ''}`).join('\n'),
    }, ...os.map(o => orgPage(ctx, o))]
}

export const searchDocs = ctx => ctx.store.organisations.map(o => ({ id: `organisation:${o.id}`, url: `organisations/${o.id}/index.html`, title: o.name, type: 'organisation', date: maxDate(o.sources.map(s => s.read_at || s.read_on)), text: o.names_as_listed.join('; ') }))
