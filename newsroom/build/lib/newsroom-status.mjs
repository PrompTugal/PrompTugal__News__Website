// /newsroom/status/: the waits on Dinis, every agent by desk, the data (cell 2026-11-28-promptugal-status; cl-6.designer's sketch of 28 Nov). Words: assets/newsroom/status-words.json;
// markup: assets/newsroom/status.tmpl; values: assets/newsroom/status-snapshot.json (newsroom/tools/sync-status.mjs). Every value goes through cell() and esc(): never trusted.
import fs from 'node:fs'
import { esc } from './markdown.mjs'
import { plain as cell, safeUrl } from './agent-text.mjs'
import { cl6Section } from './newsroom-cl6.mjs'

const T = fs.readFileSync(new URL('../../../assets/newsroom/status.tmpl', import.meta.url), 'utf8')
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{([a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const rd = (ctx, f) => { try { return ctx.readJSON(f) } catch { return null } }
const fill = (s, v) => String(s).replace(/\{([a-z_]+)\}/g, (m, k) => v[k] ?? '')
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// an absolute date and hour, "27 Nov 21:17 UTC"; nothing relative (cl-6.designer's rule)
export const when = s => { const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(String(s || '')); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[4]}:${m[5]} UTC` : '' }
const hour = s => when(s) || ''
const E = s => esc(cell(s))
const RANK = { 'source problem': 0, stale: 1, late: 2, 'archive (no schedule)': 4 }
const isBlocked = a => a.blocked_on && !/^(none|n\/a|-|—|nothing)\b/i.test(a.blocked_on)

const note = (W, f) => f ? `${W.read}: ${cell(f.read_at)}${f.updated ? ` (${cell(f.updated)})` : ''}` : W.not_read
const waitItem = (W, x) => [`- **${cell(x.what)}**`, x.urgency ? `  - ${W.urgency}: ${cell(x.urgency)}` : '', x.by ? `  - ${W.by}: ${cell(x.by)}${x.since ? `, ${W.since} ${cell(x.since)}` : ''}` : '', x.line ? `  - ${W.line}: ${cell(x.line)}` : ''].filter(Boolean).join('\n')

function agentsBlock(ctx, b, W, S) {
    const A = S.agents && S.agents.items.length ? S.agents : null
    if (!A) { const old = rd(ctx, 'assets/newsroom/agents-snapshot.json'); return old ? cl6Section(ctx, ctx.readJSON('assets/newsroom/agents-cl6.json')).replace(/^## .*\{#cl6\}\n\n[\s\S]*?\n\n## .*\{#dinis\}\n\n[\s\S]*?(?=\n## )/, '') : `${W.not_read}\n` }
    const by = new Map(); for (const a of A.items) (by.get(a.desk || '?') || by.set(a.desk || '?', []).get(a.desk || '?')).push(a)
    const kindOf = a => isBlocked(a) ? 'blocked' : a.status === 'working' ? 'working' : a.status === 'idle' ? 'idle' : 'none'
    const head = Object.fromEntries(['h_agent', 'h_state', 'h_last', 'h_next', 'h_blocked', 'h_repo'].map(k => [k, esc(W[k])]))
    const NR = esc(W.s_none)
    let html = '', md = ''
    for (const [desk, xs] of [...by].sort((x, y) => y[1].filter(isBlocked).length - x[1].filter(isBlocked).length || x[0].localeCompare(y[0]))) {
        const sorted = [...xs].sort((p, q) => (isBlocked(q) ? 1 : 0) - (isBlocked(p) ? 1 : 0) || p.id.localeCompare(q.id)), nb = xs.filter(isBlocked).length
        const rows = sorted.map(a => { const k = kindOf(a), url = a.repo && safeUrl(`https://github.com/${a.repo}`)
            return put(item('row'), { ...head, kind: k, name: E(a.id), chip: put(item('chip'), { kind: k, label: esc(W[`s_${k}`]) }), last: a.last_at ? `${esc(when(a.last_at))}${a.last_what ? `<br>${E(a.last_what)}` : ''}` : NR,
                next: a.next_wake ? (when(a.next_wake) ? esc(when(a.next_wake)) : E(a.next_wake)) : a.wake ? E(a.wake) : NR, blocked: a.blocked_on && isBlocked(a) ? E(a.blocked_on) : '', repo: url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${E(a.repo.replace(/^[^/]+\//, ''))}</a>` : NR }) }).join('')
        html += put(item('desk'), { ...head, desk: E(desk), counts: esc(fill(W.counts, { n: xs.length, b: nb })), open: nb ? ' open' : '', rows })
        md += `### ${cell(desk)} (${fill(W.counts, { n: xs.length, b: nb })})\n\n` + sorted.map(a => `- ${cell(a.id)}: ${W[`s_${kindOf(a)}`]}${a.last_at ? `, ${when(a.last_at)}` : ''}${isBlocked(a) ? `, ${W.h_blocked.toLowerCase()}: ${cell(a.blocked_on)}` : ''}`).join('\n') + '\n\n'
    }
    return b.raw(html, md)
}

export function statusMd(ctx, b = { raw: (h, m) => m }) {
    const W = ctx.readJSON('assets/newsroom/status-words.json'), S = rd(ctx, 'assets/newsroom/status-snapshot.json') || {}
    const waits = (title, f) => `### ${title}\n\n${note(W, f)}\n\n${f && f.items.length ? f.items.map(x => waitItem(W, x)).join('\n') : W.none}\n`
    const built = new Date().toISOString().slice(0, 13).replace('T', ' ') + ':00 UTC'
    const line = fill(W.built, { built, agents: S.agents ? hour(S.agents.read_at) || cell(S.agents.read_at) : W.not_read_short, data: S.data ? hour(S.data.read_at) || cell(S.data.read_at) : W.not_read_short })
    const D = S.data && Array.isArray(S.data.datasets) ? S.data : null
    let dataBlock = W.data_none
    if (D) {
        const dhead = Object.fromEntries(['h_dataset', 'h_owner', 'h_refresh', 'h_source', 'h_rows', 'h_verdict'].map(k => [k, esc(W[k])]))
        const drows = [...D.datasets].sort((p, q) => (RANK[p.freshness] ?? 5) - (RANK[q.freshness] ?? 5) || (q.age_hours || 0) - (p.age_hours || 0)).map(d => { const bad = (RANK[d.freshness] ?? 5) < 4
            return { d, bad, html: put(item('drow'), { ...dhead, kind: bad ? 'bad' : 'ok', name: E(d.title || d.id), owner: E(d.owner), refresh: d.last_refresh ? esc(when(d.last_refresh)) : esc(W.s_none), source: E(d.source), rows: d.rows == null ? esc(W.s_none) : esc(String(d.rows)),
                chip: put(item('chip'), { kind: bad ? 'bad' : 'ok', label: esc(W[`f_${d.freshness}`] || cell(d.freshness)) }) }) } })
        const head = Object.fromEntries(['h_dataset', 'h_owner', 'h_refresh', 'h_source', 'h_rows', 'h_verdict'].map(k => [k, esc(W[k])]))
        const summary = Object.entries(D.summary || {}).map(([k, v]) => `${v} ${cell(k)}`).join(', ')
        const blockers = D.blockers && D.blockers.length ? `\n\n### ${W.blockers_title}\n\n${D.blockers.map(x => `- ${cell(x.what)}${x.needs ? ` (${cell(x.needs)})` : ''}`).join('\n')}` : ''
        dataBlock = `${W.data_about}\n\n${D.rule ? `${W.rule_label} ${cell(D.rule)}\n\n` : ''}${summary ? `${fill(W.data_summary, { text: summary })}\n\n` : ''}` +
            b.raw(put(item('data'), { ...head, rows: drows.map(r => r.html).join('') }), drows.map(r => `- ${cell(r.d.title || r.d.id)}: ${W[`f_${r.d.freshness}`] || cell(r.d.freshness)}, ${when(r.d.last_refresh) || W.s_none}`).join('\n')) + blockers + `\n\n${W.live_view}`
    }
    const other = S.other_teams && S.other_teams.items.length ? `\n## ${W.other_title} {#other}\n\n${W.other_about}\n\n${S.other_teams.items.map(x => `- ${cell(x.id)}: ${when(x.last_at)}, ${cell(x.last_what)}`).join('\n')}\n` : ''
    return `${b.raw(put(item('built'), { text: esc(line) }), line)}\n\n${W.lede}\n\n## ${W.waits_title} {#waits}\n\n${W.waits_about}\n\n${waits(W.briefing_title, S.briefing)}\n${waits(W.questions_title, S.questions)}\n## ${W.agents_title} {#agents}\n\n${W.agents_about}\n\n${agentsBlock(ctx, b, W, S)}${other}\n## ${W.data_title} {#data}\n\n${dataBlock}\n`
}
