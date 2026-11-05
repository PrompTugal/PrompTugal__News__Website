// The companies (build step 3): data/companies.json, public facts only, each with its source and date read.
export const order = 30

const CATEGORY = { 'ai-agents': 'AI agents', security: 'Security', devtools: 'Developer tools', grc: 'Governance, risk and compliance', 'portugal-startup': 'Portuguese startups', platform: 'Platforms', investor: 'Investors', other: 'Other' }
let C
const load = ctx => C || (C = ctx.exists('data/companies.json') ? ctx.readJSON('data/companies.json') : { companies: [] })

export function pages(ctx) {
    const { AGENT, TEAM_SITE } = ctx, cell = ctx.md.cell
    const ATTENDING = a => a === 'unknown' ? 'a participant (the role is not stated in our sources)' : cell(a).replace(/^speaker's company/, "a speaker's company").replace(/^startup \(growth\)/, 'a startup (GROWTH programme)').replace(/^partner/, 'a partner')
    return load(ctx).companies.map(x => {
        const chk = x.recheck || {}
        const sp = chk.summit_page, ws = chk.website
        return {
            src: 'data/companies.json', rel: `companies/${x.id}/index.html`, type: 'company',
            crumbs: [['companies/index.html', 'Companies'], [null, x.name]],
            title: x.name, summary: `Based in ${cell(x.country)}; at Web Summit Lisbon 2026 as ${ATTENDING(x.attending_as)}. Public facts only, each with its source.`,
            md: `| | |\n|---|---|\n| **What they do** | ${cell(x.what)} |\n| **Based in** | ${cell(x.country)} |\n| **At Web Summit as** | ${ATTENDING(x.attending_as)} |\n| **Confirmed for 2026** | ${cell(x.attending).replace(/^confirmed: /, 'Yes: ').replace(/^unconfirmed: /, 'Not yet: ')} |\n| **Website** | [${cell(x.website).replace(/^https?:\/\/(www\.)?|\/$/g, '')}](${x.website}) |\n| **Filed under** | [${CATEGORY[x.category] || x.category}](../index.md#${x.category}) |\n\n` +
                `## Our question for them {#question}\n\nAs for every company we follow, three questions, not claims: what can their AI agents (or their customers' agents) actually reach, what were they authorised to do, and who controls the gap between the two? We have not asked ${cell(x.name)} yet. When they answer, it goes here.\n\n` +
                `## Where this comes from {#sources}\n\n` +
                x.sources.map(s => `- [${cell(s.url).replace(/^https?:\/\//, '').slice(0, 70)}](${s.url}), read ${s.read_on} by the team's curator: ${cell(s.supports || s.what || '')}.`).join('\n') +
                `\n\nRe-checked by ${AGENT}${chk.checked_at ? ` on ${chk.checked_at.slice(0, 10)} at ${chk.checked_at.slice(11, 16)} UTC` : ''}: ` +
                [sp ? (sp.status === 200 ? `the summit's page answered and is still live` : sp.status ? `the summit's page answered with HTTP ${sp.status}, so its listing has moved or gone: until it is found again, treat its place at the summit as not re-confirmed` : `the summit's page did not answer in time; the listing is as the team read it on 1 November`) : `there is no summit page for it in the team's sources`,
                ws ? `the company's website answered ${ws.status >= 200 && ws.status < 400 ? 'and is live' : ws.status ? `with HTTP ${ws.status} to an automated read` : 'not at all to an automated read'}` : ''].filter(Boolean).join('; ') + '.' +
                `\n\nTaken from the team's company map (\`data/companies.json\` on [web-summit.sgit.ai](${TEAM_SITE})), public facts only. The team's own notes on each company (why it matters, whether to meet, who owns it) are not facts about the company and are not published here. Something wrong? Tell us and we correct it on this page, dated.\n\n[All companies](../index.md)`,
        }
    })
}

export const fill = {
    'companies:count': (page, ctx) => String(load(ctx).companies.length),
    'companies:list': (page, ctx) => {
        const cats = load(ctx).companies, cell = ctx.md.cell
        return Object.keys(CATEGORY).filter(c => cats.some(x => x.category === c)).map(c =>
            `## ${CATEGORY[c]} {#${c}}\n\n` + cats.filter(x => x.category === c).sort((a, b) => a.name.localeCompare(b.name))
                .map(x => `- **[${cell(x.name)}](${x.id}/index.md)** (${cell(x.country)}). ${cell(x.what)}`).join('\n')).join('\n\n')
    },
}
