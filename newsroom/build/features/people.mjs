// People (brief 3, house rules): every person a public summit page lists, in their professional capacity only: name,
// role and organisation as listed, the events they speak at, and where each listing was read. No photo, no profile
// link, no contact detail: the data has no field for one (data/schemas/person.schema.json).
import { refLink, sourceLine, timeText, dataLinks, plural, maxDate, slotLine, slotList } from '../lib/present.mjs'
export const order = 50

const RULE = 'We publish only what the summit lists publicly: name, role and organisation, and the sessions. No photos, no profiles, no contact details. Something wrong, or listed in error? Tell us and we correct it on this page, dated.'

function personPage(ctx, p) {
    const g = ctx.graph(), rel = `people/${p.id}/index.html`, pid = `person:${p.id}`, cell = ctx.md.cell
    const evs = g.outOf(pid, 'speaks_at').map(e => ctx.store.get(e.to)).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const orgs = g.outOf(pid, 'listed_under')
    const md = `{.facts}\n| | |\n|---|---|\n| **Name** | ${cell(p.name)} |\n| **Role, as listed** | ${cell(p.role || 'not listed')} |\n| **Organisation, as listed** | ${p.org ? refLink(ctx, rel, p.org, p.organisation) : cell(p.organisation || 'not listed')} |\n\n` +
        `## At the summit {#summit}\n\n` + (evs.length ? slotList(evs.map(e => slotLine(ctx, rel, e))) : 'No session in our programme lists them; a summit page in our companies\' sources does (below).') + '\n\n' +
        (orgs.length > 1 ? `## Listed under {#organisations}\n\n${orgs.map(o => `- ${refLink(ctx, rel, o.to)}`).join('\n')}\n\n` : '') +
        `## Where this comes from {#sources}\n\n{.sources}\n${p.listings.map(l => `- ${sourceLine(l.source, l.read_at, l.by)}: ${cell(l.role || 'no role')}, ${cell(l.organisation || 'no organisation')}${l.event ? ` (${refLink(ctx, rel, l.event)})` : ''}.`).join('\n')}\n\n${RULE}\n\n` +
        `${dataLinks(ctx, rel, 'people', p.id)}\n\n[All people](../index.md)`
    return {
        src: `data/people/${p.id}/person.json`, rel, type: 'person', date: maxDate(p.listings.map(l => l.read_at)),
        crumbs: [['people/index.html', 'People'], [null, p.name]],
        title: p.name,
        summary: `${[p.role, p.organisation].filter(Boolean).map(cell).join(', ') || 'Listed without a role'}, as Web Summit lists them${evs.length ? `; ${plural(evs.length, 'session')} in our programme` : ''}.`,
        md,
    }
}

// the same people in three views, switched by the link a reader follows (CSS :target): by organisation (the default,
// so the page is not an A to Z), by the day of their first session, and A to Z (dev.pages@, the-people-page)
const line = (ctx, rel, p, cell) => `- ${refLink(ctx, rel, `person:${p.id}`)}${p.role ? `, ${cell(p.role)}` : ''}${p.organisation ? `, ${p.org ? refLink(ctx, rel, p.org, p.organisation) : cell(p.organisation)}` : ''}`
function views(ctx, rel, ps, cell) {
    const ln = p => line(ctx, rel, p, cell), rows = a => `{.rows .links-cols}\n${a.map(ln).join('\n')}`
    const orgs = new Map()
    for (const p of ps) { const k = p.organisation || 'Organisation not listed'; orgs.set(k, [...(orgs.get(k) || []), p]) }
    const byOrg = [...orgs].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).map(([k, a]) => `### ${cell(k)} \`${a.length}\`\n\n${rows(a)}`).join('\n\n')
    const day = p => p.listings.map(l => (ctx.store.get(l.event) || {}).date).filter(Boolean).sort()[0] || 'none'
    const days = [...new Set(ps.map(day))].sort()
    const byDay = days.map(d => `### ${d === 'none' ? 'Not tied to a session in our programme' : ctx.DAY(d)}\n\n${rows(ps.filter(p => day(p) === d))}`).join('\n\n')
    const letters = [...new Set(ps.map(p => p.name[0].toUpperCase()))]
    const az = letters.map(L => `### ${L} {#${L.toLowerCase().replace(/[^a-z]/g, 'x')}}\n\n${rows(ps.filter(p => p.name[0].toUpperCase() === L))}`).join('\n\n')
    return `{.view-switch}\n[By organisation](#v-org) · [By first session](#v-day) · [A to Z](#v-az)\n\n::: view view-org\n#### By organisation {#v-org}\n\n${byOrg}\n:::\n\n::: view view-day\n#### By day of first session {#v-day}\n\n${byDay}\n:::\n\n::: view view-az\n#### A to Z {#v-az}\n\n${az}\n:::`
}

export function pages(ctx) {
    const ps = [...ctx.store.people].sort((a, b) => a.name.localeCompare(b.name))
    const rel = 'people/index.html', cell = ctx.md.cell
    return [{
        src: 'data/people/', rel, type: 'site', date: maxDate(ps.flatMap(p => p.listings.map(l => l.read_at))),
        title: 'People', summary: `${ps.length} people the summit's public pages list as speakers in our programme or in our companies' sources, by name, role and organisation only.`,
        md: `${RULE}\n\n` + views(ctx, rel, ps, cell, line),
    }, ...ps.map(p => personPage(ctx, p))]
}

export const searchDocs = ctx => ctx.store.people.map(p => ({ id: `person:${p.id}`, url: `people/${p.id}/index.html`, title: p.name, type: 'person', date: maxDate(p.listings.map(l => l.read_at)), text: `${p.role || ''} ${p.organisation || ''}` }))
