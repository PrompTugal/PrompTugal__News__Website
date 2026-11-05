// Places (data/places/): the summit's venue and its stages, the other venues of the week, the cities and the
// countries the companies are based in; each with what happens there and who is based there.
import { refLink, timeText, plural, dataLinks } from '../lib/present.mjs'
export const order = 65

const KIND_ORDER = ['country', 'region', 'city', 'district', 'street', 'venue', 'building', 'stage', 'room']
const KIND_LABEL = { country: 'Countries', region: 'Regions', city: 'Cities', district: 'Districts', street: 'Streets', venue: 'Venues', building: 'Buildings', stage: 'Stages', room: 'Rooms' }

function placePage(ctx, p) {
    const g = ctx.graph(), rel = `places/${p.id}/index.html`, id = `place:${p.id}`, cell = ctx.md.cell
    const chain = []; let at = p.located_in && ctx.store.get(p.located_in)
    while (at) { chain.push(refLink(ctx, rel, `place:${at.id}`)); at = at.located_in && ctx.store.get(at.located_in) }
    const inside = g.inOf(id, 'located_in').map(e => e.from).sort((a, b) => g.node.get(a).label.localeCompare(g.node.get(b).label, 'en', { numeric: true }))
    const evs = g.inOf(id, 'takes_place_at').map(e => ctx.store.get(e.from)).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const comps = g.inOf(id, 'based_in').map(e => ctx.store.get(e.from)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
    const md = (p.note ? `${cell(p.note)}\n\n` : '') +
        `| | |\n|---|---|\n| **Kind** | ${p.kind} |\n${chain.length ? `| **In** | ${chain.join(', ')} |\n` : ''}${inside.length ? `| **Holds** | ${inside.map(x => refLink(ctx, rel, x)).join(', ')} |\n` : ''}| **Source** | ${p.source ? (/^https?:/.test(p.source) ? `[${cell(p.source.replace(/^https?:\/\/(www\.)?/, ''))}](${p.source})` : `\`${p.source}\``) : 'none'} |\n\n` +
        (evs.length ? `## What happens here {#events}\n\n${evs.map(e => `- **${ctx.DAY(e.date)}, ${timeText(e)}** · ${refLink(ctx, rel, `event:${e.id}`)}`).join('\n')}\n\n` : '') +
        (comps.length ? `## Companies based here {#companies}\n\n${plural(comps.length, 'company', 'companies')} we follow, as the team's company map gives their country.\n\n${comps.map(c => `- ${refLink(ctx, rel, `company:${c.id}`)}. ${cell(c.what)}`).join('\n')}\n\n` : '') +
        `${dataLinks(ctx, rel, 'places', p.id, false)}\n\n[All places](../index.md)`
    return { src: `data/places/${p.id}/place.json`, rel, type: 'place', crumbs: [['places/index.html', 'Places'], [null, p.name]], title: p.name, summary: `A ${p.kind}${chain.length ? ` in ${cell(g.node.get(p.located_in).label)}` : ''}${evs.length ? `; ${plural(evs.length, 'event')} in our programme` : ''}${comps.length ? `; ${plural(comps.length, 'company', 'companies')} based here` : ''}.`, md }
}

export function pages(ctx) {
    const rel = 'places/index.html'
    const ps = [...ctx.store.places].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.name.localeCompare(b.name, 'en', { numeric: true }))
    const md = `Where the summit happens, from the country down to the stage, and the countries the companies we follow are based in. The summit's venue is ${refLink(ctx, rel, 'place:meo-arena-and-fil')}.\n\n` +
        KIND_ORDER.filter(k => ps.some(p => p.kind === k)).map(k => `## ${KIND_LABEL[k]} {#${k}}\n\n` + ps.filter(p => p.kind === k).map(p => `- ${refLink(ctx, rel, `place:${p.id}`)}`).join('\n')).join('\n\n')
    return [{ src: 'data/places/', rel, type: 'site', title: 'Places', summary: 'Where things happen in the week of Web Summit Lisbon 2026, from the country to the stage, and where the companies we follow are based.', md }, ...ps.map(p => placePage(ctx, p))]
}
