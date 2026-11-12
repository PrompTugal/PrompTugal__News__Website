// Topics: the newsroom's taxonomy (data/topics/): the fields the companies are filed under, the broader themes, the
// beats; the summit tracks bridged to each. /topics/ is the industry map in text.
import { refLink, timeText, dataLinks, plural, slotLine, slotList } from '../lib/present.mjs'
export const order = 60

const KIND = { field: 'Fields', theme: 'Themes', beat: 'Beats' }
const KIND_ABOUT = {
    field: 'The industry fields the team\'s company map files each company under.',
    theme: 'Broader themes: fields and the summit\'s own tracks are bridged to them. The bridges are our judgement, published so they can be disagreed with.',
    beat: 'The newsroom\'s beats (brief 3): what we write about.',
}

function countries(ctx, cs) {
    const n = new Map()
    for (const c of cs) { const k = c.country.replace(/\s*\(.*$/, ''); n.set(k, (n.get(k) || 0) + 1) }
    return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, v]) => `${k} ${v}`).join(', ')
}

function topicPage(ctx, t) {
    const g = ctx.graph(), rel = `topics/${t.id}/index.html`, tid = `topic:${t.id}`, cell = ctx.md.cell
    const comps = g.inOf(tid, 'filed_under').map(e => ctx.store.get(e.from)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
    const narrower = g.inOf(tid, 'narrower_than').map(e => e.from), broader = g.outOf(tid, 'narrower_than').map(e => e.to)
    const tracks = g.inOf(tid, 'maps_to').map(e => e.from)
    const evs = tracks.flatMap(tr => g.inOf(tr, 'in_track').map(e => ctx.store.get(e.from))).filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
    const stories = g.inOf(tid, 'about').filter(e => e.from.startsWith('story:')).map(e => ctx.store.get(e.from)).filter(Boolean)
    const articles = g.inOf(tid, 'about').filter(e => e.from.startsWith('article:'))
    const md = `${cell(t.description)}\n\n` +
        (broader.length || narrower.length ? `{.facts}\n| | |\n|---|---|\n${broader.length ? `| **Inside** | ${broader.map(b => refLink(ctx, rel, b)).join(', ')} |\n` : ''}${narrower.length ? `| **Holds** | ${narrower.map(b => refLink(ctx, rel, b)).join(', ')} |\n` : ''}\n` : '') +
        (comps.length ? `## Companies filed under it {#companies}\n\n${plural(comps.length, 'company', 'companies')}, by country: ${countries(ctx, comps)}.\n\n{.rows}\n${comps.map(c => `- ${refLink(ctx, rel, `company:${c.id}`)} (${cell(c.country)}). ${cell(c.what)}`).join('\n')}\n\n` : '') +
        (tracks.length ? `## At the summit {#summit}\n\nThe summit's own track${tracks.length > 1 ? 's' : ''} ${tracks.map(x => `"${cell(g.node.get(x).label)}"`).join(', ')} ${tracks.length > 1 ? 'are' : 'is'} bridged to this topic (our judgement, declared in \`data/topics/${t.id}/topic.json\`). The sessions in our programme on ${tracks.length > 1 ? 'them' : 'it'}:\n\n${slotList(evs.map(e => slotLine(ctx, rel, e))) || '- None in our programme yet.'}\n\n` : '') +
        (articles.length ? `## Our articles on it {#articles}\n\n${articles.map(a => `- ${refLink(ctx, rel, a.from)}`).join('\n')}\n\n` : '') +
        (stories.length ? `## Story candidates on this beat {#stories}\n\nWhat the curator proposes to write next; candidates, not articles. Their angles stay in the desk's files.\n\n${stories.map(s => `- ${s.id}: ${cell(s.title)} (${s.desk_files.map(f => ctx.store.wsGone && /^desks\/curator\//.test(f) ? f.split('/').pop() : `[${f.split('/').pop()}](${ctx.link(rel, f)})`).join(', ')})`).join('\n')}\n\n` : '') +
        `${dataLinks(ctx, rel, 'topics', t.id, false)} The industry graph, all fields and companies: [graph/industry.json](${ctx.link(rel, 'api/v1/graph/industry.json')}).\n\n[All topics](../index.md)`
    return { src: `data/topics/${t.id}/topic.json`, rel, type: 'topic', crumbs: [['topics/index.html', 'Topics'], [null, t.name]], title: t.name, summary: `${{ field: 'A field', theme: 'A theme', beat: 'A beat' }[t.kind]} in the newsroom's taxonomy${comps.length ? `: ${plural(comps.length, 'company', 'companies')} filed under it` : ''}.`, md }
}

export function pages(ctx) {
    const g = ctx.graph(), rel = 'topics/index.html', cell = ctx.md.cell
    const md = `The industry map, in text: the fields the companies we follow are filed under, the themes above them, and the newsroom's beats. Every field links to its companies; every theme to the summit's own tracks bridged to it. The same map as a graph: [graph/industry.json](${ctx.link(rel, 'api/v1/graph/industry.json')}).\n\n` +
        Object.keys(KIND).map(k => `## ${KIND[k]} {#${k}}\n\n${KIND_ABOUT[k]}\n\n` + ctx.store.topics.filter(t => t.kind === k).map(t => {
            const n = g.inOf(`topic:${t.id}`, 'filed_under').length, tr = g.inOf(`topic:${t.id}`, 'maps_to').map(e => g.node.get(e.from).label)
            return `- **${refLink(ctx, rel, `topic:${t.id}`)}**${n ? ` (${plural(n, 'company', 'companies')})` : ''}. ${cell(t.description)}${tr.length ? ` Summit track${tr.length > 1 ? 's' : ''}: ${tr.join(', ')}.` : ''}`
        }).join('\n')).join('\n\n')
    return [{ src: 'data/topics/', rel, type: 'site', title: 'Topics', summary: 'The industry map in text: the fields, themes and beats of the newsroom\'s taxonomy, and the companies and summit tracks in each.', md }, ...ctx.store.topics.map(t => topicPage(ctx, t))]
}
