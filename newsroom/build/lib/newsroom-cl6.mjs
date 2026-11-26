// The cl-6 sessions section of /newsroom/agents/ (the conductor's brief of 26 Nov 2026): cards from assets/newsroom/agents-snapshot.json (newsroom/tools/sync-agents.mjs),
// Dinis's list on top, then the agents grouped by state. The words are in assets/newsroom/agents-cl6.json. Every value is escaped; none is trusted.
// cl-6.dev@PrompTugal.dinis.
import { esc, cell } from './markdown.mjs'

const id = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-')
const line = (k, v) => v ? `- **${k}:** ${v}` : ''

export function cl6Section(ctx, T) {
    let D; try { D = ctx.readJSON('assets/newsroom/agents-snapshot.json') } catch { return '' }
    const L = T.labels, waits = a => (a.waiting_on || []).map(w => `  - ${cell(w.what)}${w.who && w.who !== 'Dinis' ? ` (${cell(w.who)})` : ''}${w.since ? ` ${L.since} ${cell(w.since)}` : ''}`).join('\n')
    const card = a => [`### ${cell(a.id)} {#${id(a.id)}}`, '',
        line(L.role, cell(a.role)), line(L.model, cell(a.model)),
        line(L.session, a.session ? `[${cell(a.session.replace('https://claude.ai/code/', ''))}](${a.session})` : ''),
        line(L.repos, (a.repos || []).map(r => `[${cell(r.replace('PrompTugal/', ''))}](https://github.com/${encodeURI(r)})`).join(', ')),
        line(L.wake, cell(a.wake)), line(L.state, cell(a.state || a.focus)),
        (a.waiting_on || []).length ? `- **${L.waits}:**\n${waits(a)}` : '',
        a.last ? line(L.last, `${cell(a.last.title)}: ${cell(a.last.text)}`) : '', line(L.updated, cell(a.updated)),
        a.read === false ? `*${L.not_read}*` : '', ''].filter((x, i, r) => x !== '' || r[i - 1] !== '').join('\n')
    const groups = ['blocked', 'working', 'idle'].map(k => { const xs = D.agents.filter(a => a.status === k); return xs.length ? `## ${T.groups[k]} (${xs.length}) {#${k}}\n\n${xs.map(card).join('\n\n')}\n` : '' }).join('\n')
    const dinis = (D.dinis || []).length ? (D.dinis).map(w => `- ${cell(w.what)}${w.since ? ` (${L.since} ${cell(w.since)})` : ''}`).join('\n') : T.none
    return `## ${T.title} {#cl6}\n\n${T.about}\n\n${T.read}: ${cell(D.read)}. ${T.source}: ${cell(D.source)}.\n\n## ${T.dinis_title} {#dinis}\n\n${T.dinis_about}\n\n${dinis}\n\n${groups}\n`
}
