// The companies (build step 3, brief 6): data/companies/<id>/, public facts only, each with its source and date read.
// A profile per company, and the navigators: its sessions at the summit, its people, the companies related to it
// through a shared event or a shared field, and its graph as JSON. Fills <!-- companies:count --> and
// <!-- companies:list --> in the prose.
import { shortUrl, refLink, sourceLine, timeText, maxDate, dataLinks, plural, slotLine, slotList } from '../lib/present.mjs'
import { eventsOfCompany, relatedCompanies } from '../lib/graph.mjs'
export const order = 30
import fs from 'node:fs'
const LV = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')), FILTER = LV.filters.companies, V = LV.companies
export const assets = { js: ['assets/filter/filter.js'] }

const ATTENDING = (a, cell) => a === 'unknown' ? 'a participant (the role is not stated in our sources)' : cell(a).replace(/^speaker's company/, "a speaker's company").replace(/^startup \(growth\)/, 'a startup (GROWTH programme)').replace(/^partner/, 'a partner')
const topicName = (ctx, id) => (ctx.store.get(`topic:${id}`) || {}).name || id

// PILOT-REPLIT (Vicky, 8 November 2026; the team site's people/vicky/decisions.md): a company page may carry two optional
// sections, built from files, never typed here. "About": the "## About" section of desks/journalist-vicky/companies/<id>.md
// when that file exists and its front matter says status: ready (written by Vicky's journalist, checked by her reviewer).
// "From the newsroom": the published articles in content/articles/ that link to this company's page, also only when that
// file is Ready, so no other company page changes. The same file's
// "At Web Summit 2026" list marks a session "Media only" with the session's own page as its source; that session gets
// the tag here. Without such a file, or with no article, a page is exactly as before.
const deskFile = id => `desks/journalist-vicky/companies/${id}.md`
const norm = u => String(u || '').replace(/\/+$/, '')
function deskOf(ctx, id) {
    if (!ctx.exists(deskFile(id))) return null
    const { meta, body } = ctx.md.frontMatter(ctx.readText(deskFile(id)))
    if (String(meta.status || '').trim() !== 'ready') return null
    const section = name => ((body.split(/^## /m).find(x => x.startsWith(name + '\n')) || '').slice(name.length + 1)).trim()
    const media = new Set(section('At Web Summit 2026').split('\n').filter(l => /Media only/.test(l)).flatMap(l => l.match(/https:\/\/websummit\.com\/sessions\/[^\s)]+/g) || []).map(norm))
    return { about: section('About'), media, read: meta.date ? String(meta.date) : null }
}
// the sessions marked Media only by a Ready company file, by their session URL: the read date of that file (TRIAGE-REPLIT
// D1: the search index carries it to the reader's own day, so a saved press conference keeps its marker)
export function mediaOnlyEvents(ctx) {
    const out = new Map()
    for (const x of ctx.store.companies) { const desk = deskOf(ctx, x.id); if (desk) for (const u of desk.media) out.set(u, desk.read) }
    return out
}
function newsroomSection(ctx, rel, c) {
    const link = new RegExp(`\\.\\./companies/${c.id}/`)
    const arts = ctx.content.filter(p => p.rel.startsWith('articles/') && String(p.meta.status || '') === 'published' && link.test(p.md || ''))
        .sort((a, b) => String(b.meta.date || '').localeCompare(String(a.meta.date || '')) || String(a.meta.title).localeCompare(String(b.meta.title)))
    // each article: its link in the site's ordinary link style, then its own published summary just under it (TRIAGE-REPLIT D4, D5)
    return arts.map(p => `[${ctx.md.cell(p.meta.title)}](${ctx.link(rel, p.rel)})${p.meta.date ? `, ${readDay(p.meta.date)}` : ''}${p.meta.summary ? `\n\n{.meta}\n${ctx.md.cell(p.meta.summary)}` : ''}`).join('\n\n')
}
const readDay = d => { const x = new Date(String(d).slice(0, 10) + 'T12:00:00Z'); return isNaN(x) ? String(d) : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) }

function summitSection(ctx, rel, c, desk) {
    const g = ctx.graph(), cid = `company:${c.id}`, cell = ctx.md.cell
    const evs = eventsOfCompany(g, cid).map(id => ctx.store.get(id)).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const lines = evs.map(e => {
        const eid = `event:${e.id}`
        const how = []
        for (const x of g.outOf(cid).filter(x => x.to === eid && (x.verb === 'appears_in' || x.verb === 'hosts'))) how.push(`${x.verb === 'hosts' ? 'it hosts the session' : 'the session page names it'} (${sourceLine(x.source, x.read, 'the team\'s curator')})`)
        const speakers = g.inOf(eid, 'speaks_at').filter(s => g.outOf(s.from, 'listed_under').some(l => l.to === cid)).map(s => refLink(ctx, rel, s.from))
        if (speakers.length) how.push(`${speakers.join(', ')} ${speakers.length === 1 ? 'speaks' : 'speak'} (${sourceLine(e.session_url || e.source_url, e.read_at, e.read_by)})`)
        const media = desk && e.session_url && desk.media.has(norm(e.session_url))
        if (media) how.push(`media only (${sourceLine(e.session_url, desk.read)})`)
        return slotLine(ctx, rel, e, { extra: [how.join('; ')], tags: media ? ['Media only'] : [] })
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

// Its flows and where AI agents are in them (data/companies/<id>/flows.json, kept by the ontologist). A flow is
// { id, name, summary?, source, steps: [{ what, actor?, agent?, source }] }; a step's agent, when present, says what
// an AI agent does at that step, as the source says it. Every flow and step cites a source in sources.json (the gate
// checks it). Without a mapped flow the section says so and asks; it never guesses one.
// its products (ontologist@'s data/companies/<id>/products.json, c.products): each with what it is and its source
function productsSection(ctx, c) {
    const cell = ctx.md.cell, src = new Map(c.sources.map(s => [s.id, s]))
    const cite = ids => [ids].flat().filter(Boolean).map(id => src.get(id)).filter(Boolean).map(s => sourceLine(s.url, s.read_on)).join('; ')
    return c.products.map(p => `- **${cell(p.name)}**${p.agentic ? ' (agentic)' : ''}: ${cell(p.what || '')}${p.source ? ` (${cite(p.source)})` : ''}${(p.flows || []).length ? ` · [its flow](#flow-${p.flows[0]})` : ''}`).join('\n')
}
function flowsSection(ctx, c) {
    const cell = ctx.md.cell, src = new Map(c.sources.map(s => [s.id, s]))
    const cite = ids => [ids].flat().filter(Boolean).map(id => src.get(id)).filter(Boolean).map(s => sourceLine(s.url, s.read_on)).join('; ')
    if (!c.flows.length) return `We have not mapped ${cell(c.name)}'s flows yet: how work moves through its product, from a request to a result, and at which steps an AI agent acts. We map them only from public pages (its own site and documentation, its talks), each step with its source, and never guess. If you are at ${cell(c.name)}, the quickest way to get this right is to tell us how it works.`
    const agents = c.flows.reduce((n, f) => n + (f.steps || []).filter(s => s.agent).length, 0)
    return `How work moves through ${cell(c.name)}'s product, as its public pages describe it, and the steps where an AI agent acts (${plural(agents, 'step')} with an AI agent in it, marked **AI agent here**). Each step cites its source.\n\n` + c.flows.map(f =>
        `### ${cell(f.name)} {#flow-${f.id}}\n\n${f.summary ? cell(f.summary) + ' ' : ''}(${cite(f.source)})\n\n` +
        (f.steps || []).map((st, i) => `${i + 1}. ${st.actor ? `**${cell(st.actor)}**: ` : ''}${cell(st.what)}${st.agent ? ` **AI agent here:** ${cell(st.agent)}` : ''} (${cite(st.source)})`).join('\n')).join('\n\n')
}

// What PrompTugal.news is, for a reader who arrives from an email: who makes it, what it is not, the disclosure.
// Words from data/site/site.json, so this block and the shell's footer cannot disagree.
function aboutSection(ctx, rel, c) {
    const S = ctx.SITE, cell = ctx.md.cell
    return `**${cell(S.name)}**: ${cell(S.motto)}. ${cell(S.promise)} ${cell(S.footer_note)}\n\n` +
        `- **Why this page exists.** We keep a page on every company we follow at the summit, built only from public pages, so that anyone, ${cell(c.name)} included, can see what we know and where it comes from. Nothing on it is an endorsement.\n` +
        `- **Independence.** ${cell(S.independence)} ${cell(S.disclosure)} [Our disclosure](${ctx.link(rel, 'about/participant.html')}) says it in full; please weigh what we say with it in mind.\n` +
        `- **Corrections.** If something here is wrong or out of date, we correct it on this page, dated. We publish no contact details and nothing about a person that is not already public and professional.\n` +
        `- **More.** [About ${cell(S.name)}](${ctx.link(rel, 'about/index.html')}), [all the companies](${ctx.link(rel, 'companies/index.html')}), [the summit](${ctx.link(rel, 'summit/index.html')}).`
}

export function pages(ctx) {
    const { AGENT, TEAM_SITE } = ctx, cell = ctx.md.cell
    return ctx.store.companies.map(x => {
        const rel = `companies/${x.id}/index.html`
        const chk = x.recheck[x.recheck.length - 1] || {}
        const sp = chk.summit_page, ws = chk.website
        const country = `place:${(x.edges.find(e => e.verb === 'based_in') || {}).to?.slice(6)}`
        // both sections only on a page whose company has a Ready file (Replit, for now): every other page is unchanged
        const desk = deskOf(ctx, x.id), news = desk ? newsroomSection(ctx, rel, x) : ''
        return {
            src: `data/companies/${x.id}/company.json`, rel, type: 'company', date: maxDate(x.sources.map(s => s.read_on), x.recheck.map(r => r.checked_at)),
            crumbs: [['companies/index.html', 'Companies'], [null, x.name]],
            title: x.name, summary: `Based in ${cell(x.country)}; at Web Summit Lisbon 2026 as ${ATTENDING(x.attending_as, cell)}. Public facts only, each with its source.`,
            md: `{.facts}\n| | |\n|---|---|\n| **What they do** | ${cell(x.what)} |\n| **Based in** | ${ctx.store.has(country) ? refLink(ctx, rel, country, x.country) : cell(x.country)} |\n| **At Web Summit as** | ${ATTENDING(x.attending_as, cell)} |\n| **Confirmed for 2026** | ${cell(x.attending).replace(/^confirmed: /, 'Yes: ').replace(/^unconfirmed: /, 'Not yet: ')} |\n| **Website** | ${x.website ? `[${cell(x.website).replace(/^https?:\/\/(www\.)?|\/$/g, '')}](${x.website})` : 'not in our sources'} |\n| **Filed under** | ${refLink(ctx, rel, `topic:${x.category}`, topicName(ctx, x.category))} |\n\n` +
                (desk && desk.about ? `## About ${cell(x.name)} {#company-about}\n\n${desk.about}\n\n` : '') +
                `::: navigator n3\n::: nv\n## At the summit {#summit}\n\n${summitSection(ctx, rel, x, desk)}\n:::\n` +
                `::: nv\n## People {#people}\n\nPeople the summit's pages list under ${cell(x.name)}, by name, role and organisation only.\n\n${peopleSection(ctx, rel, x)}\n:::\n` +
                `::: nv\n## Related companies {#related}\n\n${relatedSection(ctx, rel, x)}\n:::\n:::\n\n` +
                (news ? `## From the newsroom {#newsroom}\n\n${news}\n\n` : '') +
                (x.products.length ? `## Its products {#products}\n\n${productsSection(ctx, x)}\n\n` : '') +
                `## Its flows, and where AI agents are in them {#flows}\n\n${flowsSection(ctx, x)}\n\n` +
                `## Our question for them {#question}\n\nAs for every company we follow, three questions, not claims. We have not asked ${cell(x.name)} yet. When they answer, it goes here.\n\n{.lens}\n1. **Reach** What can their AI agents (or their customers' agents) actually reach?\n2. **Mandate** What were they authorised to do?\n3. **Gap** Who controls the gap between the two?\n\n` +
                `## Where this comes from {#sources}\n\n{.sources}\n` +
                x.sources.map(s => `- [${shortUrl(s.url)}](${s.url}), read ${s.read_on} by the team's curator: ${cell(s.supports)}.`).join('\n') +
                `\n\nRe-checked by ${AGENT}${chk.checked_at ? ` on ${chk.checked_at.slice(0, 10)} at ${chk.checked_at.slice(11, 16)} UTC` : ''}: ` +
                [sp ? (sp.status === 200 ? `the summit's page answered and is still live` : sp.status ? `the summit's page answered with HTTP ${sp.status}, so its listing has moved or gone: until it is found again, treat its place at the summit as not re-confirmed` : `the summit's page did not answer in time; the listing is as the team read it on 1 November`) : `there is no summit page for it in the team's sources`,
                ws ? `the company's website answered ${ws.status >= 200 && ws.status < 400 ? 'and is live' : ws.status ? `with HTTP ${ws.status} to an automated read` : 'not at all to an automated read'}` : ''].filter(Boolean).join('; ') + '.' +
                `\n\nTaken from the team's company map (\`data/companies.json\` on [web-summit.sgit.ai](${TEAM_SITE})), public facts only. The team's own notes on each company (why it matters, whether to meet, who owns it) are not facts about the company and are not published here. Something wrong? Tell us and we correct it on this page, dated.\n\n` +
                `## About ${cell(ctx.SITE.name)} {#about}\n\n${aboutSection(ctx, rel, x)}\n\n` +
                `${dataLinks(ctx, rel, 'companies', x.id)}\n\n[All companies](../index.md)`,
        }
    })
}

export const fill = {
    'companies:count': (page, ctx) => String(ctx.store.companies.length),
    // three views of the same companies, switched by the link a reader follows (CSS :target, no script):
    // by field (the default), by country, and a compact A to Z grid (dev.pages@, the-companies-page)
    'companies:list': (page, ctx) => {
        const cats = ctx.store.companies, cell = ctx.md.cell
        const fields = ctx.store.topics.filter(t => t.kind === 'field')
        const line = x => `- **[${cell(x.name)}](${x.id}/index.md)** (${cell(x.country)}). ${cell(x.what)}`
        const byName = (a, b) => a.name.localeCompare(b.name)
        const byField = fields.filter(t => cats.some(x => x.category === t.category)).map(t =>
            `### ${t.name} {#${t.category}}\n\n{.rows .links-cols}\n` + cats.filter(x => x.category === t.category).sort(byName).map(line).join('\n')).join('\n\n')
        const countries = [...new Set(cats.map(x => x.country))].sort((a, b) => cats.filter(x => x.country === b).length - cats.filter(x => x.country === a).length || a.localeCompare(b))
        const byCountry = countries.map(k => `### ${cell(k)} \`${cats.filter(x => x.country === k).length}\`\n\n{.rows .links-cols}\n` + cats.filter(x => x.country === k).sort(byName).map(line).join('\n')).join('\n\n')
        const grid = `{.tiles}\n` + [...cats].sort(byName).map(x => `- **[${cell(x.name)}](${x.id}/index.md)** *${cell(x.country)}*`).join('\n')
        return `::: pt-filter\n${FILTER}\n:::\n\n{.view-switch}\n[${V.field}](#v-field) · [${V.country}](#v-country) · [${V.az}](#v-grid)\n\n::: view view-field\n#### ${V.field} {#v-field}\n\n${byField}\n:::\n\n::: view view-country\n#### ${V.country} {#v-country}\n\n${byCountry}\n:::\n\n::: view view-grid\n#### ${V.az} {#v-grid}\n\n${grid}\n:::`
    },
}

export const searchDocs = ctx => ctx.store.companies.map(c => ({ id: `company:${c.id}`, url: `companies/${c.id}/index.html`, title: c.name, type: 'company', date: maxDate(c.sources.map(s => s.read_on)), text: `${c.what} ${c.country} ${c.category} ${c.aliases.map(a => a.name).join(' ')}` }))
