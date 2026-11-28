// /newsroom/status/: the waits on Dinis, every agent, the data (cell 2026-11-28-promptugal-status). The words are in assets/newsroom/status-words.json; the values in
// assets/newsroom/status-snapshot.json (newsroom/tools/sync-status.mjs), agents-snapshot.json (sync-agents.mjs) and, when it exists, data-status.json. Every value goes through cell() and is never trusted.
import { plain as cell } from './agent-text.mjs'
import { cl6Section } from './newsroom-cl6.mjs'

const rd = (ctx, f) => { try { return ctx.readJSON(f) } catch { return null } }
const note = (W, f) => f ? `${W.read}: ${cell(f.read_at)}${f.updated ? ` (${cell(f.updated)})` : ''}` : W.not_read
const item = (W, x) => [`- **${cell(x.what)}**`, x.urgency ? `  - ${W.urgency}: ${cell(x.urgency)}` : '', x.by ? `  - ${W.by}: ${cell(x.by)}${x.since ? `, ${W.since} ${cell(x.since)}` : ''}` : '', x.line ? `  - ${W.line}: ${cell(x.line)}` : ''].filter(Boolean).join('\n')

export function statusMd(ctx) {
    const W = ctx.readJSON('assets/newsroom/status-words.json'), S = rd(ctx, 'assets/newsroom/status-snapshot.json') || {}
    const waits = (title, f) => `### ${title}\n\n${note(W, f)}\n\n${f && f.items.length ? f.items.map(x => item(W, x)).join('\n') : W.none}\n`
    const T = ctx.readJSON('assets/newsroom/agents-cl6.json')
    const agents = rd(ctx, 'assets/newsroom/agents-snapshot.json') ? cl6Section(ctx, T).replace(/^## .*\{#cl6\}\n\n[\s\S]*?\n\n## .*\{#dinis\}\n\n[\s\S]*?(?=\n## )/, '') : ''
    const D = rd(ctx, 'assets/newsroom/data-status.json')
    const rows = D && Array.isArray(D.datasets) ? D.datasets.map(d => `| ${cell(d.name)} | ${cell(d.last_refresh)} | ${cell(d.source)} | ${cell(d.rows)} | ${cell(d.freshness)} | ${cell(d.owner)} |`).join('\n') : ''
    return `${W.lede}\n\n## ${W.waits_title} {#waits}\n\n${W.waits_about}\n\n${waits(W.briefing_title, S.briefing)}\n${waits(W.questions_title, S.questions)}\n## ${W.agents_title} {#agents}\n\n${W.agents_about}\n\n${agents}\n## ${W.data_title} {#data}\n\n${rows ? `${W.data_head}\n${rows}` : W.data_none}\n`
}
