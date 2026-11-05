// Portugal (brief 6's nav, brief 3's beat): the Portuguese tech scene in the week of the summit, from data that already
// exists, public facts with their sources only: the research desk's captures on the Portugal beat (data/evidence/),
// the Portuguese companies we follow, the events in Portugal outside the summit's programme, and the summit sessions
// that involve a Portuguese company or name Portugal. Fills <!-- portugal:front --> for the front page.
import { refLink, slotLine, slotList, plural, maxDate, day10 } from '../lib/present.mjs'
import { companiesOfEvent } from '../lib/graph.mjs'
export const order = 68

const short = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')
const urlDate = u => { const m = u.match(/\/(20\d\d)\/(\d\d)\/(\d\d)\//); return m ? `${m[1]}-${m[2]}-${m[3]}` : null }
const groupName = g => String(g || '').replace(/^G\d+\s+/, '')

function data(ctx) {
    const g = ctx.graph()
    const captures = ctx.store.evidence.filter(e => e.beat === 'portugal').sort((a, b) => (urlDate(b.source_url) || '0').localeCompare(urlDate(a.source_url) || '0') || a.id.localeCompare(b.id))
    const companies = ctx.store.companies.filter(c => c.category === 'portugal-startup' || /^Portugal/.test(c.country)).sort((a, b) => a.name.localeCompare(b.name))
    const ptIds = new Set(companies.map(c => `company:${c.id}`))
    const around = ctx.store.events.filter(e => e.organiser === 'other').sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const atSummit = ctx.store.events.filter(e => e.organiser === 'web-summit' && e.part_of && (/portug/i.test(e.title) || companiesOfEvent(g, `event:${e.id}`).some(c => ptIds.has(c))))
        .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    return { captures, companies, around, atSummit }
}

function captureLine(ctx, rel, c) {
    const d = urlDate(c.source_url)
    const names = c.names.filter(n => n.ref && !/web-summit$/.test(n.ref)).map(n => refLink(ctx, rel, n.ref, n.as_listed))
    return `- [${short(c.source_url)}](${c.source_url})${d ? `, ${ctx.DAY(d).replace(/^\w+ /, '')} ${d.slice(0, 4)} (the date in its address)` : ''}: ${names.length ? `names ${names.join(', ')}` : 'names no company we follow'}. Mapped by ${c.by} on ${day10(c.run)} under "${groupName(c.group)}".`
}
const coLine = (ctx, rel, c) => `- ${refLink(ctx, rel, `company:${c.id}`)} (${ctx.md.cell(c.country)}). ${ctx.md.cell(c.what)}`

export function pages(ctx) {
    const rel = 'portugal/index.html'
    const { captures, companies, around, atSummit } = data(ctx)
    const md = `Portugal's tech scene in the week of Web Summit Lisbon: what the research desk has found, the Portuguese companies we follow, the events across the country around the summit, and the summit sessions that involve Portugal. Public facts only, each with its source. The beat is ${refLink(ctx, rel, 'topic:portugal')}; the country is ${refLink(ctx, rel, 'place:portugal')}.\n\n` +
        `::: cols-8-4\n::: col\n## From the research desk {#research}\n\nSources the research desk captured and the curator mapped to the Portugal beat: ${plural(captures.length, 'source')}. They are sources, not our articles: nothing here has been written up or fact-checked yet, and each line says only what the source is and whom it names.\n\n{.sources}\n${captures.map(c => captureLine(ctx, rel, c)).join('\n')}\n\n` +
        `## At the summit {#summit}\n\nSessions in the summit's programme that a Portuguese company we follow is part of, or that name Portugal: ${plural(atSummit.length, 'session')}.\n\n${slotList(atSummit.map(e => slotLine(ctx, rel, e))) || 'None in our programme yet.'}\n:::\n` +
        `::: col\n## Portuguese companies we follow {#companies}\n\n${plural(companies.length, 'company', 'companies')} based in Portugal or filed under ${refLink(ctx, rel, 'topic:portugal-startup')}.\n\n{.rows}\n${companies.map(c => coLine(ctx, rel, c)).join('\n')}\n\n` +
        `## Around the summit, across Portugal {#around}\n\nEvents others run in the same weeks, from Lisbon to the Algarve: ${plural(around.length, 'event')}. Not run by Web Summit.\n\n${slotList(around.map(e => slotLine(ctx, rel, e)))}\n:::\n:::\n\n` +
        `Every event's page and every company's profile has its sources and the date each was read. [All events, official and other](${ctx.link(rel, 'events/index.html')}) · [All companies](${ctx.link(rel, 'companies/index.html')}).`
    return [{ src: 'admin/build/features/portugal.mjs', rel, type: 'site', layout: 'wide', date: maxDate(ctx.store.events.map(e => day10(e.read_at)), captures.map(c => day10(c.run))), crumbs: [[null, 'Portugal']], title: 'Portugal', summary: `The Portuguese tech scene in the week of Web Summit Lisbon 2026: ${plural(captures.length, 'source')} from the research desk, ${plural(companies.length, 'Portuguese company', 'Portuguese companies')} we follow, and ${plural(around.length + atSummit.length, 'event')}. Public facts only, each with its source.`, md }]
}

export const fill = {
    'portugal:front': (page, ctx) => {
        const rel = page.rel, { captures, companies } = data(ctx)
        return `::: cols-8-4\n::: col\n{.sources}\n${captures.slice(0, 4).map(c => captureLine(ctx, rel, c)).join('\n')}\n\n{.more-line}\n[Portugal this week: every source, company and event](${ctx.link(rel, 'portugal/index.html')})\n:::\n::: col\n{.mini-h}\nPortuguese companies we follow\n\n{.chip-list}\n${companies.map(c => `- ${refLink(ctx, rel, `company:${c.id}`)}`).join('\n')}\n:::\n:::`
    },
}

export const searchDocs = ctx => [{ id: 'page:portugal/index.html', url: 'portugal/index.html', title: 'Portugal', type: 'site', date: ctx.TODAY, text: 'Portugal tech scene startups research Portuguese companies events Portugal Tech Week Algarve Lisbon' }]
