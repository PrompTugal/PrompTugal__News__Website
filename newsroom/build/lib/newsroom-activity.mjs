// The /newsroom/activity/ page (the conductor's brief, Dinis's word of 26 Nov 2026): data feeds by freshness, the timeline of signed decisions and
// agent runs, the run reports by agent, and Dinis's waiting list. From assets/newsroom/activity-snapshot.json (newsroom/tools/sync-activity.mjs) and
// agents-snapshot.json; the words are in assets/newsroom/activity.json. Every value is escaped; none is trusted. No cost figure. cl-6.dev@PrompTugal.dinis.
import { esc, cell } from './markdown.mjs'

const HOUR = 3600e3
const tFmt = (s, n) => s.replace('{n}', n)

export function activityParts(ctx, T, now = new Date()) {
    let S, A; try { S = ctx.readJSON('assets/newsroom/activity-snapshot.json'); A = ctx.readJSON('assets/newsroom/agents-snapshot.json') } catch { return null }
    const F = T.fresh
    const age = iso => { const t = Date.parse(iso || ''); return Number.isFinite(t) ? (now - t) / HOUR : null }
    const level = h => h === null ? F.red : h < F.green_h ? F.green : h < F.amber_h ? F.amber : F.red
    const agoOf = h => h === null ? T.ago.none : h < 48 ? tFmt(T.ago.h, Math.max(0, Math.round(h))) : tFmt(T.ago.d, Math.round(h / 24))
    const feeds = [...S.feeds].map(f => { const h = age(f.read_at); return { ...f, h, level: level(h), ago: agoOf(h) } }).sort((a, b) => (b.h ?? 1e9) - (a.h ?? 1e9))
    const counts = Object.fromEntries([F.green, F.amber, F.red].map(l => [l, feeds.filter(f => f.level === l).length]))
    const feedsHtml = `<div class="adm-feeds">${feeds.map(f => `<${f.page ? `a href="${esc(f.page)}"` : 'div'} class="adm-feed adm-fresh-${f.level}"><b>${esc(f.title || f.id)}</b><span>${esc(f.ago)}</span><i>${esc(f.cadence)} · ${esc(f.level)}</i></${f.page ? 'a' : 'div'}>`).join('')}</div>`
    const feedsMd = `| Feed | Read | Cadence | Freshness |\n|---|---|---|---|\n` + feeds.map(f => `| ${f.page ? `[${cell(f.title || f.id)}](${f.page})` : cell(f.title || f.id)} | ${cell(f.ago)} | ${cell(f.cadence)} | ${f.level} |`).join('\n')
    // the timeline: decisions and runs, newest first, by day
    const ev = [...S.decisions.map(d => ({ at: d.at, kind: T.decision, md: `[${cell(d.record)}](${d.url}): ${cell(d.what)}` })),
        ...S.runs.map(r => ({ at: r.ended || r.started, kind: T.run, md: `${cell(r.agent.replace(/@.*/, ''))}${r.breaches ? `, ${r.breaches} ${T.breaches}` : ''}: ${cell(r.line)}` }))]
        .filter(e => /^\d{4}-\d\d-\d\dT/.test(e.at || '')).sort((a, b) => b.at.localeCompare(a.at))
    const days = new Map(); for (const e of ev) { const d = e.at.slice(0, 10); if (!days.has(d)) days.set(d, []); days.get(d).push(e) }
    const timeline = [...days].map(([d, xs]) => `### ${d} {#d${d}}\n\n${xs.map(e => `- ${e.at.slice(11, 16)} UTC · ${e.kind} · ${e.md}`).join('\n')}`).join('\n\n')
    // run reports by agent
    const by = new Map(); for (const r of S.runs) { const a = by.get(r.agent) || { n: 0, last: '', requests: 0, tools: 0, breaches: 0 }; a.n++; a.requests += r.requests; a.tools += r.tool_calls; a.breaches += r.breaches; if ((r.ended || r.started) > a.last) a.last = r.ended || r.started; by.set(r.agent, a) }
    const C = T.cols
    const runs = `| ${C.agent} | ${C.runs} | ${C.last} | ${C.requests} | ${C.tools} | ${C.breaches} |\n|---|---|---|---|---|---|\n` + [...by].sort((x, y) => y[1].last.localeCompare(x[1].last)).map(([a, v]) => `| ${cell(a.replace(/@.*/, ''))} | ${v.n} | ${cell(v.last.slice(0, 16))} | ${v.requests} | ${v.tools} | ${v.breaches} |`).join('\n')
    const waiting = (A.dinis || []).length ? A.dinis.map(w => `- ${cell(w.what)}${w.since ? ` (${cell(w.since)})` : ''}`).join('\n') : T.none
    return { counts, feedsHtml, feedsMd, timeline, runs, waiting, read: S.read }
}

export function activityMd(ctx, b, T, now) {
    const p = activityParts(ctx, T, now); if (!p) return ''
    const link = ctx.link(b.rel, 'newsroom/agents/index.html')
    return `${T.about}\n\n${T.read}: ${cell(p.read)}.\n\n## ${T.feeds_h} {#feeds}\n\n${T.feeds_about}\n\n${Object.entries(p.counts).map(([l, n]) => `${n} ${l}`).join(' · ')}\n\n` + b.raw(p.feedsHtml, p.feedsMd) +
        `\n\n## ${T.timeline_h} {#timeline}\n\n${T.timeline_about}\n\n${p.timeline}\n\n## ${T.runs_h} {#runs}\n\n${T.runs_about}\n\n${p.runs}\n\n## ${T.waiting_h} {#waiting}\n\n${T.waiting_about} [${T.agents_link}](${link}).\n\n${p.waiting}\n`
}
