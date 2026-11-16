// One page per agent, /agentic-system/agents/<role>/, after newsroom.sgit.ai's team pages (one page per member: its
// role, when it has failed, its rules, the files it alone writes, the keys it holds). Everything from the record at this
// release: the agent's policy (board/abp/policies.json), its key (board/keys.json), its status.json, its run reports and
// its commits. The faces on /agentic-system/ link here. Words: assets/viz/team.json.
// By viz.places@PrompTugal.dinis, 16 November 2026 (board/briefs/2026-11-15-show-the-power.md).
import { figure, xesc as X } from './viz-cast.mjs'
import { record, keyOf, modelOf, runsOf, statusOf, short, hm, dm, ago, MIN } from './viz-record.mjs'
import { W, trim, noPrefix, noDash, repoCommit, moodWord } from './viz-agents.mjs'
import { facts } from './viz-system.mjs'

export const order = 98
let COPY = null
const copy = ctx => COPY || (COPY = ctx.readJSON('assets/viz/team.json'))
const relOf = role => `agentic-system/agents/${role}/index.html`
const REPO = 'https://github.com/PrompTugal/PrompTugal__News__Website'

function page(ctx, a, policies) {
    const C = copy(ctx), R = record(ctx), M = moodWord(ctx), c = s => ctx.md.cell(String(s ?? ''))
    const rel = relOf(a.role), pol = (policies.roles || {})[a.role] || null
    const all = R.byAgent.get(a.agent) || [], s = statusOf(ctx, a.role), runs = runsOf(ctx, a.role), key = keyOf(ctx, a.agent)
    const name = (all[0] && all[0].name) || a.agent
    const L = C.rows
    const focus = pol && pol.focus ? trim(noDash(pol.focus), 400) : name
    let md = `::: vz-agent-hero\n${c(focus.charAt(0).toUpperCase() + focus.slice(1))}\n:::\n\n`
    md += `## ${C.h_now} {#now}\n\n`
    if (s) {
        if (s.state) md += `{.dek}\n${c(noDash(s.state))}\n\n`
        const next = Array.isArray(s.next) ? s.next : (s.next ? [s.next] : [])
        if (next.length) md += `**Next:**\n\n${next.slice(0, 6).map(x => `- ${c(trim(noDash(x), 300))}`).join('\n')}\n\n`
        const asks = Array.isArray(s.asks) ? s.asks.filter(x => typeof x === 'string') : []
        if (asks.length) md += `**Asks:**\n\n${asks.slice(0, 6).map(x => `- ${c(trim(noDash(x), 300))}`).join('\n')}\n\n`
    } else md += `${C.no_status}\n\n`
    const last = all[all.length - 1]
    const rows = [
        [L.mood, `${M[a.mood]}${last ? `, last commit ${ago((R.now - last.t) / MIN)}` : ''}`],
        [L.model, modelOf(ctx, a.agent) || '·'],
        [L.key, key ? `\`${key.id}\` ${key.fp ? `\`${key.fp}\`` : ''}` : '·'],
        [L.policy, pol ? `[board/abp/${a.role}.md](${REPO}/blob/dev/board/abp/${a.role}.md)` : '·'],
        [L.place, a.place ? `[${c(a.place.name)}](${ctx.link(rel, `${a.place.path}index.html`)}) · [its newsroom](${ctx.link(rel, `${a.place.path}newsroom/index.html`)})` : '·'],
        [L.first, all[0] ? `${dm(all[0].when)} ${hm(all[0].when)} UTC` : '·'],
        [L.commits, all.length], [L.releases, new Set(all.map(x => x.release).filter(Boolean)).size],
        [L.runs, runs.count || '·'], [L.tools, runs.tool_calls || '·'],
        [L.updated, s && s.updated ? c(s.updated) : '·'],
        [L.debrief, s && (s.latest_debrief || s.debrief) ? `[${c(s.latest_debrief || s.debrief)}](${REPO}/blob/dev/${s.latest_debrief || s.debrief})` : '·'],
    ]
    md += `## ${C.h_record} {#record}\n\n{.facts}\n| | |\n|---|---|\n${rows.map(([k, v]) => `| **${k}** | ${v} |`).join('\n')}\n\n`
    if (pol) {
        md += `## ${C.h_writes} {#writes}\n\n${C.writes_intro}\n\n${(pol.writes || []).map(w => `- \`${c(w)}\``).join('\n') || '- ·'}\n\n`
        if (pol.never) md += `## ${C.h_never} {#never}\n\n${c(noDash(pol.never))}\n\n`
    }
    md += `## ${C.h_failed} {#failed}\n\n${runs.count ? (runs.out_of_mandate ? W(C.failed_some, { runs: runs.count, n: runs.out_of_mandate, role: a.role }) : C.failed_none) : C.no_runs}\n\n`
    if (all.length) md += `## ${C.h_commits} {#commits}\n\n${all.slice(-10).reverse().map(x => `- ${dm(x.when)} ${hm(x.when)}: [${c(trim(noDash(noPrefix(x.subject)), 150))}](${repoCommit(ctx, x.sha)})${x.release ? ` · ${x.release}` : ''}`).join('\n')}\n\n`
    md += `[${C.back}](${ctx.link(rel, 'agentic-system/index.html')}#cast)\n`
    return {
        rel, type: 'site', layout: 'wide', date: last ? last.when.slice(0, 10) : ctx.TODAY, section: 'about', group: 'About',
        crumbs: [['agentic-system/index.html', 'The agentic system'], [null, short(a.agent)]],
        title: W(C.title, { who: name }), summary: W(C.summary, { who: short(a.agent) }), md,
        postHtml: html => html.replace(/<div class="vz-agent-hero">([\s\S]*?)<\/div>/, (m, inner) => `<div class="vz-agent-hero vz-m-${a.mood}"><div class="vz-agent-fig">${figure(ctx, { role: a.role, accent: a.place && a.place.accent, mood: a.mood, size: 150, title: short(a.agent) })}</div><div class="vz-agent-focus">${inner}</div></div>`),
    }
}

export function pages(ctx) {
    let policies = {}
    try { policies = ctx.readJSON('board/abp/policies.json') } catch {}
    return facts(ctx).agents.map(a => page(ctx, a, policies))
}

export function validate(gate) {
    try { return gate.text('agentic-system/index.html').includes('href="agents/') ? [] : ['viz-team: the system page does not link the agents\' pages'] } catch { return [] }
}
