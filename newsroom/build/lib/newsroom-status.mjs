// /newsroom/status/, the PUBLIC mode: the heartbeat, the counts, every agent with its role, the data, the briefing times and the decisions cl-6.decisions flagged public (cell 2026-11-28-promptugal-status; cl-6.designer's loop 3 and 4). Words: assets/newsroom/status-words.json;
// markup: assets/newsroom/status.tmpl; values: assets/newsroom/status-snapshot.json (newsroom/tools/sync-status.mjs). Every value goes through cell() and esc(): never trusted.
import fs from 'node:fs'
import { esc } from './markdown.mjs'
import { plain, safeUrl } from './agent-text.mjs'
import { cl6Section } from './newsroom-cl6.mjs'

// an asterisk in a feed's text (a glob such as content/about/**) would open bold in the renderer, which has no backslash escape: the asterisk operator looks the same and is not markup
const cell = s => plain(s).replace(/\*/g, '\u2217')
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
const isBlocked = a => a.blocked === true

function agentsBlock(ctx, b, W, S) {
    const A = S.agents && S.agents.items.length ? S.agents : null
    if (!A) { const old = rd(ctx, 'assets/newsroom/agents-snapshot.json'); return old ? cl6Section(ctx, ctx.readJSON('assets/newsroom/agents-cl6.json')).replace(/^## .*\{#cl6\}\n\n[\s\S]*?\n\n## .*\{#dinis\}\n\n[\s\S]*?(?=\n## )/, '') : `${W.not_read}\n` }
    const by = new Map(); for (const a of A.items) (by.get(a.desk || '?') || by.set(a.desk || '?', []).get(a.desk || '?')).push(a)
    const kindOf = a => isBlocked(a) ? 'blocked' : a.status === 'working' ? 'working' : a.status === 'idle' ? 'idle' : 'none'
    const head = Object.fromEntries(['h_agent', 'h_role', 'h_state', 'h_last', 'h_next', 'h_repo'].map(k => [k, esc(W[k])]))
    const NR = esc(W.s_none)
    let html = '', md = ''
    for (const [desk, xs] of [...by].sort((x, y) => y[1].filter(isBlocked).length - x[1].filter(isBlocked).length || x[0].localeCompare(y[0]))) {
        const sorted = [...xs].sort((p, q) => (isBlocked(q) ? 1 : 0) - (isBlocked(p) ? 1 : 0) || p.id.localeCompare(q.id)), nb = xs.filter(isBlocked).length
        const rowsOf = list => list.map(a => { const k = kindOf(a), url = a.repo && safeUrl(`https://github.com/${a.repo}`)
            return put(item('row'), { ...head, kind: k, name: E(a.id), role: a.role ? E(a.role) : NR, chip: put(item('chip'), { kind: k, label: esc(W[`s_${k}`]) }), last: a.last_at ? esc(when(a.last_at)) : NR,
                next: a.next_wake ? (when(a.next_wake) ? esc(when(a.next_wake)) : E(a.next_wake)) : NR, repo: url ? put(item('ext'), { url: esc(url), text: E(a.repo.replace(/^[^/]+\//, '')) }) : NR }) }).join('')
        const tbl = rs => put(item('tbl'), { ...head, rows: rs })
        const blockedRows = sorted.filter(isBlocked), restRows = sorted.filter(a => !isBlocked(a))
        const body = (blockedRows.length ? tbl(rowsOf(blockedRows)) : '') + (restRows.length ? put(item('more'), { label: esc(fill(W.more_agents, { n: restRows.length })), table: tbl(rowsOf(restRows)) }) : '')
        html += put(item('desk'), { desk: E(desk), counts: esc(fill(W.counts, { n: xs.length, b: nb })), body })
        md += `### ${cell(desk)} (${fill(W.counts, { n: xs.length, b: nb })})\n\n` + sorted.map(a => `- ${cell(a.id)}${a.role ? ` (${cell(a.role)})` : ''}: ${W[`s_${kindOf(a)}`]}${a.last_at ? `, ${when(a.last_at)}` : ''}`).join('\n') + '\n\n'
    }
    return b.raw(put(item('fold'), { label: esc(W.fold_agents), body: html }), md)
}

const pick = (S, k) => S && S[k] && (Array.isArray(S[k].items) || S[k].read_at) ? S[k] : null
export function statusMd(ctx, b = { raw: (h, m) => m }) {
    const W = ctx.readJSON('assets/newsroom/status-words.json'), S = rd(ctx, 'assets/newsroom/status-snapshot.json') || {}
    const built = new Date().toISOString().slice(0, 13).replace('T', ' ') + ':00 UTC'
    const line = fill(W.built, { built, agents: S.agents ? hour(S.agents.read_at) || cell(S.agents.read_at) : W.not_read_short, data: S.data ? hour(S.data.read_at) || cell(S.data.read_at) : W.not_read_short })
    const A = S.agents && S.agents.items.length ? S.agents.items : [], D = S.data && Array.isArray(S.data.datasets) ? S.data : null, H = pick(S, 'heartbeat'), DEC = pick(S, 'decisions')
    // the heartbeat and the counts: plain sentences from the files, nothing typed by hand
    const parts = []
    if (H && H.articles) parts.push(fill(W.hb_articles, { n: H.articles, d: H.newest ? day(H.newest) : '' }))
    if (ctx.VERSION) parts.push(fill(W.hb_build, { v: cell(ctx.VERSION) }))
    const nA = k => A.filter(a => (isBlocked(a) ? 'blocked' : a.status) === k).length
    if (A.length) parts.push(fill(W.hb_agents, { n: A.length, w: nA('working'), i: nA('idle'), b: nA('blocked') }))
    const bad = D ? D.datasets.filter(d => (RANK[d.freshness] ?? 5) < 4).length : 0, arch = D ? D.datasets.filter(d => d.freshness === 'archive (no schedule)').length : 0
    if (D) parts.push(fill(W.hb_data, { n: D.datasets.length, f: D.datasets.filter(d => d.freshness === 'fresh').length, a: arch, p: bad }))
    const heart = parts.length ? `- ${parts.join('\n- ')}` : W.not_read
    // the decisions the decisions agent flagged public: title and short lines, never an answer, a link, an id or a name
    const decOf = x => put(item('dec'), { title: E(x.title), summary: x.summary ? E(x.summary) : '', rows: [['d_wait', x.if_you_wait]].filter(r => r[1]).map(r => put(item('lb'), { label: esc(W[r[0]]), text: E(r[1]) })).join('') })
    const decMd = x => `- **${cell(x.title)}**${x.summary ? `: ${cell(x.summary)}` : ''}${[['d_wait', x.if_you_wait]].filter(r => r[1]).map(r => `\n  - ${W[r[0]]} ${cell(r[1])}`).join('')}`
    const cardsHtml = DEC && DEC.items.length ? put(item('decs'), { items: DEC.items.map(decOf).join('') }) : put(item('p'), { text: esc(W.none) }), cardsMd = DEC && DEC.items.length ? DEC.items.map(decMd).join('\n') : W.none
    // the top of the page (cl-6.designer's loop 5 public mock): the heartbeat and the waiting decisions, side by side from 1100 px (the rail), stacked on a phone; the pointer says where the answers go, with no link and no id
    const top = b.raw(put(item('top'), { heart_title: esc(W.heart_title), heart: parts.length ? put(item('ul'), { items: parts.map(x => put(item('li'), { text: esc(x) })).join('') }) : put(item('p'), { text: esc(W.not_read) }), waits_title: esc(W.waits_title), waits_about: esc(W.waits_about), cards: cardsHtml, pointer: esc(W.d_pointer) }),
        `## ${W.heart_title} {#heartbeat}\n\n${heart}\n\n## ${W.waits_title} {#waits}\n\n${W.waits_about}\n\n${cardsMd}\n\n${W.d_pointer}`)
    let dataBlock = W.data_none
    if (D) {
        const dhead = Object.fromEntries(['h_dataset', 'h_owner', 'h_refresh', 'h_source', 'h_rows', 'h_verdict'].map(k => [k, esc(W[k])]))
        const drows = [...D.datasets].sort((p, q) => (RANK[p.freshness] ?? 5) - (RANK[q.freshness] ?? 5) || (q.age_hours || 0) - (p.age_hours || 0)).map(d => { const isBad = (RANK[d.freshness] ?? 5) < 4
            return { d, bad: isBad, html: put(item('drow'), { ...dhead, kind: isBad ? 'bad' : 'ok', name: E(d.title || d.id), owner: E(d.owner), refresh: d.last_refresh ? esc(when(d.last_refresh)) : esc(W.s_none), source: E(d.source), rows: d.rows == null ? esc(W.s_none) : esc(String(d.rows)),
                chip: put(item('chip'), { kind: isBad ? 'bad' : 'ok', label: esc(W[`f_${d.freshness}`] || cell(d.freshness)) }) }) } })
        dataBlock = 
            b.raw(put(item('fold'), { label: esc(W.fold_data), body: (D.rule ? put(item('rule'), { text: `${esc(W.rule_label)} ${E(D.rule)}` }) : '') + (drows.some(r => r.bad) ? put(item('data'), { ...dhead, rows: drows.filter(r => r.bad).map(r => r.html).join('') }) : '') + (drows.some(r => !r.bad) ? put(item('more'), { label: esc(fill(W.more_data, { n: drows.filter(r => !r.bad).length })), table: put(item('data'), { ...dhead, rows: drows.filter(r => !r.bad).map(r => r.html).join('') }) }) : '') }), drows.map(r => `- ${cell(r.d.title || r.d.id)}: ${W[`f_${r.d.freshness}`] || cell(r.d.freshness)}, ${when(r.d.last_refresh) || W.s_none}`).join('\n')) + `\n\n${W.live_view}`
    }
    const other = S.other_teams && S.other_teams.items.length ? `\n## ${W.other_title} {#other}\n\n${b.raw(put(item('fold'), { label: esc(fill(W.fold_other, { n: S.other_teams.items.length })), body: put(item('p'), { text: esc(W.other_about) }) + put(item('ul'), { items: S.other_teams.items.map(x => put(item('li'), { text: `${E(x.id)}: ${esc(when(x.last_at))}` })).join('') }) }), W.other_about + '\n\n' + S.other_teams.items.map(x => `- ${cell(x.id)}: ${when(x.last_at)}`).join('\n'))}\n` : ''
    return `${b.raw(put(item('built'), { text: esc(line) }), line)}\n\n${W.lede}\n\n${top}\n\n## ${W.agents_title} {#status-agents}\n\n${parts.find(x => /agents/.test(x)) || ''}\n\n${agentsBlock(ctx, b, W, S)}${other}\n## ${W.data_title} {#data}\n\n${D ? fill(W.hb_data, { n: D.datasets.length, f: D.datasets.filter(d => d.freshness === 'fresh').length, a: arch, p: bad }) : ''}\n\n${dataBlock}\n`
}
const day = s => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(s || '')); return m ? `${+m[3]} ${MON[+m[2] - 1]}` : '' }
