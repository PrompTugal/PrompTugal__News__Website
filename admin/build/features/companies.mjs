// The companies (build step 3, brief 6): data/companies/<id>/, public facts only, each with its source and date read.
// A profile per company, and the navigators: its sessions at the summit, its people, the companies related to it
// through a shared event or a shared field, and its graph as JSON. Fills <!-- companies:count --> and
// <!-- companies:list --> in the prose.
import { refLink, sourceLine, timeText, maxDate, dataLinks, plural, slotLine, slotList } from '../lib/present.mjs'
import { eventsOfCompany, relatedCompanies } from '../lib/graph.mjs'
export const order = 30

const ATTENDING = (a, cell) => a === 'unknown' ? 'a participant (the role is not stated in our sources)' : cell(a).replace(/^speaker's company/, "a speaker's company").replace(/^startup \(growth\)/, 'a startup (GROWTH programme)').replace(/^partner/, 'a partner')
const topicName = (ctx, id) => (ctx.store.get(`topic:${id}`) || {}).name || id

function summitSection(ctx, rel, c) {
    const g = ctx.graph(), cid = `company:${c.id}`, cell = ctx.md.cell
    const evs = eventsOfCompany(g, cid).map(id => ctx.store.get(id)).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const lines = evs.map(e => {
        const eid = `event:${e.id}`
        const how = []
        for (const x of g.outOf(cid).filter(x => x.to === eid && (x.verb === 'appears_in' || x.verb === 'hosts'))) how.push(`${x.verb === 'hosts' ? 'it hosts the session' : 'the session page names it'} (${sourceLine(x.source, x.read, 'the team\'s curator')})`)
        const speakers = g.inOf(eid, 'speaks_at').filter(s => g.outOf(s.from, 'listed_under').some(l => l.to === cid)).map(s => refLink(ctx, rel, s.from))
        if (speakers.length) how.push(`${speakers.join(', ')} ${speakers.length === 1 ? 'speaks' : 'speak'} (${sourceLine(e.session_url || e.source_url, e.read_at, e.read_by)})`)
        return slotLine(ctx, rel, e, { extra: [how.join('; ')] })
    })
    const unresolved = (ctx.store.matching?.company_sessions?.unresolved || []).filter(u => u.company === cid)
    const gone = unresolved.map(u => `- A session page in its sources that is not in our programme: ${sourceLine(u.url)}. The programme desk found it answering 404 on 4 November, so it is left out until it is found again.`)
    if (!lines.length && !gone.length) return `No session in our programme names ${cell(c.name)} yet. Our programme holds the summit's Centre Stage, PITCH, press conferences, Night Summit and the sessions the team picked; the full schedule is at [websummit.com/schedule](https://websummit.com/schedule/).`
    return [slotList(lines), gone.length ? `{.rows}\n${gone.join('\n')}` : ''].filter(Boolean).join('\n\n')
}

function peopleSection(ctx, rel, c) {
    const g = ctx.graph(), cid = `company:${c.id}`
    const ps = g.inOf(cid, 'listed_under').map(e => ({ e, p: ctx.store.get(e.from) })).filter(x => x.p).sort((a, b) => a.p.name.localeCompare(b.p.name))
    if (!ps.length) return `No one is listed under ${ctx.md.cell(c.name)} in the summit pages we have read.`
    return '{.rows}\n' + ps.map(({ e, p }) => { const l = p.listings.find(x => x.org === cid) || p.listings[0]; return `- ${refLink(ctx, rel, e.from)}, ${ctx.md.cell(l.role || 'role not listed')}, as listed under "${ctx.md.cell(l.organisation)}" (${sourceLine(l.source, l.read_at)}).` }).join('\n')
}

function relatedSection(ctx, rel, c) {
    const g = ctx.graph(), cid = `company:${c.id}`
    const rs = relatedCompanies(g, cid)
    const byEvent = rs.filter(r => r.via.some(v => v.startsWith('event:'))).sort((a, b) => g.node.get(a.company).label.localeCompare(g.node.get(b.company).label))
    const out = byEvent.map(r => `- ${refLink(ctx, rel, r.company)}: also at ${r.via.filter(v => v.startsWith('event:')).map(v => refLink(ctx, rel, v)).join(', ')}.`)
    for (const t of g.outOf(cid, 'filed_under')) {
        const same = g.inOf(t.to, 'filed_under').map(e => e.from).filter(x => x !== cid).sort((a, b) => g.node.get(a).label.localeCompare(g.node.get(b).label))
        if (same.length) out.push(`- Also filed under ${refLink(ctx, rel, t.to)} (${same.length}): ${same.map(x => refLink(ctx, rel, x)).join(', ')}.`)
    }
    return out.length ? `How we get from one company to the next: through an event both are at, or a field both are filed under. Each line says which.\n\n{.rows}\n${out.join('\n')}` : 'None in our data yet.'
}

export function pages(ctx) {
    const { AGENT, TEAM_SITE } = ctx, cell = ctx.md.cell
    return ctx.store.companies.map(x => {
        const rel = `companies/${x.id}/index.html`
        const chk = x.recheck[x.recheck.length - 1] || {}
        const sp = chk.summit_page, ws = chk.website
        const country = `place:${(x.edges.find(e => e.verb === 'based_in') || {}).to?.slice(6)}`
        return {
            src: `data/companies/${x.id}/company.json`, rel, type: 'company', date: maxDate(x.sources.map(s => s.read_on), x.recheck.map(r => r.checked_at)),
            crumbs: [['companies/index.html', 'Companies'], [null, x.name]],
            title: x.name, summary: `Based in ${cell(x.country)}; at Web Summit Lisbon 2026 as ${ATTENDING(x.attending_as, cell)}. Public facts only, each with its source.`,
            md: `{.facts}\n| | |\n|---|---|\n| **What they do** | ${cell(x.what)} |\n| **Based in** | ${ctx.store.has(country) ? refLink(ctx, rel, country, x.country) : cell(x.country)} |\n| **At Web Summit as** | ${ATTENDING(x.attending_as, cell)} |\n| **Confirmed for 2026** | ${cell(x.attending).replace(/^confirmed: /, 'Yes: ').replace(/^unconfirmed: /, 'Not yet: ')} |\n| **Website** | ${x.website ? `[${cell(x.website).replace(/^https?:\/\/(www\.)?|\/$/g, '')}](${x.website})` : 'not in our sources'} |\n| **Filed under** | ${refLink(ctx, rel, `topic:${x.category}`, topicName(ctx, x.category))} |\n\n` +
                `::: navigator n3\n::: nv\n## At the summit {#summit}\n\n${summitSection(ctx, rel, x)}\n:::\n` +
                `::: nv\n## People {#people}\n\nPeople the summit's pages list under ${cell(x.name)}, by name, role and organisation only.\n\n${peopleSection(ctx, rel, x)}\n:::\n` +
                `::: nv\n## Related companies {#related}\n\n${relatedSection(ctx, rel, x)}\n:::\n:::\n\n` +
                `## Our question for them {#question}\n\nAs for every company we follow, three questions, not claims. We have not asked ${cell(x.name)} yet. When they answer, it goes here.\n\n{.lens}\n1. **Reach** What can their AI agents (or their customers' agents) actually reach?\n2. **Mandate** What were they authorised to do?\n3. **Gap** Who controls the gap between the two?\n\n` +
                `## Where this comes from {#sources}\n\n{.sources}\n` +
                x.sources.map(s => `- [${cell(s.url).replace(/^https?:\/\//, '').slice(0, 70)}](${s.url}), read ${s.read_on} by the team's curator: ${cell(s.supports)}.`).join('\n') +
                `\n\nRe-checked by ${AGENT}${chk.checked_at ? ` on ${chk.checked_at.slice(0, 10)} at ${chk.checked_at.slice(11, 16)} UTC` : ''}: ` +
                [sp ? (sp.status === 200 ? `the summit's page answered and is still live` : sp.status ? `the summit's page answered with HTTP ${sp.status}, so its listing has moved or gone: until it is found again, treat its place at the summit as not re-confirmed` : `the summit's page did not answer in time; the listing is as the team read it on 1 November`) : `there is no summit page for it in the team's sources`,
                ws ? `the company's website answered ${ws.status >= 200 && ws.status < 400 ? 'and is live' : ws.status ? `with HTTP ${ws.status} to an automated read` : 'not at all to an automated read'}` : ''].filter(Boolean).join('; ') + '.' +
                `\n\nTaken from the team's company map (\`data/companies.json\` on [web-summit.sgit.ai](${TEAM_SITE})), public facts only. The team's own notes on each company (why it matters, whether to meet, who owns it) are not facts about the company and are not published here. Something wrong? Tell us and we correct it on this page, dated.\n\n` +
                `${dataLinks(ctx, rel, 'companies', x.id)}\n\n[All companies](../index.md)`,
        }
    })
}

export const fill = {
    'companies:count': (page, ctx) => String(ctx.store.companies.length),
    'companies:list': (page, ctx) => {
        const cats = ctx.store.companies, cell = ctx.md.cell
        const fields = ctx.store.topics.filter(t => t.kind === 'field')
        return fields.filter(t => cats.some(x => x.category === t.category)).map(t =>
            `## ${t.name} {#${t.category}}\n\n{.rows .links-cols}\n` + cats.filter(x => x.category === t.category).sort((a, b) => a.name.localeCompare(b.name))
                .map(x => `- **[${cell(x.name)}](${x.id}/index.md)** (${cell(x.country)}). ${cell(x.what)}`).join('\n')).join('\n\n')
    },
}

export const searchDocs = ctx => ctx.store.companies.map(c => ({ id: `company:${c.id}`, url: `companies/${c.id}/index.html`, title: c.name, type: 'company', date: maxDate(c.sources.map(s => s.read_on)), text: `${c.what} ${c.country} ${c.category} ${c.aliases.map(a => a.name).join(' ')}` }))
