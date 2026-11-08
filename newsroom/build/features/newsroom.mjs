// The newsroom (/newsroom/): PrompTugal.news's back end, public like the rest of the site. It shows the work,
// never a credential. Pages: the overview (the status report of 5 November, live from data), every run, the agents
// (one page each), the timeline (swim lanes by agent), the data the newsroom holds, the workflows, the lab, and the
// release history (newsroom/versions.html, the versions feature's page, joined to this section here in decorate).
// Also /api/v1/newsroom/status.json for other agents and the chat.
//
// Where the facts come from (all committed, so the build needs no git and no network):
//   data/newsroom/runs/*.jsonl   the runs ledger: one line per commit, appended by newsroom/tools/runs.mjs from git
//   data/newsroom/agents.json    the roster, hand-kept         data/newsroom/plan.json   the plan and its state, hand-kept
//   data/newsroom/team-site.json the desks' run lines, the newsroom's board issues and the keys' public facts, from the
//                             team's site by newsroom/tools/desks-snapshot.mjs
//   ctx.store, ctx.graph()    the data;  REALITY.md, content/brief/09-*.md, newsroom/build/validate.js: read as text
import path from 'node:path'
import { esc, cell } from '../lib/markdown.mjs'
import { json } from '../lib/writers.mjs'
import { loadSchemas, validate as checkSchema } from '../lib/schema.mjs'
import * as d from './newsroom-draw.mjs'
import { model, liveCounts, fillCounts, lanesFor, parallels, readLedger, STAGES, personName } from './newsroom-model.mjs'

export const order = 91
export const TABS = [['newsroom/index.html', 'Overview'], ['newsroom/runs/index.html', 'Runs'], ['newsroom/dashboard/index.html', 'Dashboard'], ['newsroom/decisions/index.html', 'Decisions'], ['newsroom/notes/index.html', 'Notes'], ['newsroom/stories/index.html', 'Stories'], ['newsroom/desks/index.html', 'Desks'], ['newsroom/quality/index.html', 'Quality'], ['newsroom/agents/index.html', 'Agents'], ['newsroom/live/index.html', 'Live'], ['newsroom/timeline/index.html', 'Timeline'], ['newsroom/data/index.html', 'Data'], ['newsroom/workflows/index.html', 'Workflows'], ['newsroom/lab/index.html', 'Lab'], ['newsroom/observability/index.html', 'Observability'], ['newsroom/versions.html', 'Releases']]
export const LABEL = '<p class="nr-label"><a href="@@UP@@newsroom/index.html">The newsroom</a> · How PrompTugal.news is made, in public</p>'
const ASSETS = { css: ['assets/newsroom/newsroom.css'], js: ['assets/newsroom/newsroom.js'] }
const TEAM_BOARD = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/'
const TEAM_KEYS = 'https://web-summit.sgit.ai/keys/index.html'
const REPO_URL = 'https://github.com/PrompTugal/PrompTugal__News__Website'
const fence = s => '```\n' + s + '\n```'
const href = (from, to) => /^https?:/.test(to) ? to : (path.posix.relative(path.posix.dirname(from), to.split('#')[0]) || path.posix.basename(to)) + (to.includes('#') ? '#' + to.split('#')[1] : '')
const agentRel = a => `newsroom/agents/${a.id}.html`
const runRel = r => `newsroom/runs/index.html#run-${r.id}`
const n = x => Number(x).toLocaleString('en-GB')
const kb = b => b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : b >= 1024 ? `${(b / 1024).toFixed(1)} KB` : `${b} B`
const statusTag = s => `<span class="adm-st st-${esc(s)}">${esc(s)}</span>`
const AREA_ORDER = ['content', 'data', 'desks', 'build', 'tools', 'assets', 'design', 'signatures', 'ci', 'docs', 'release', 'other']

// a page under construction: markdown with placeholders for raw HTML blocks, each with its markdown twin
function builder(rel) {
    const blocks = []
    return { rel, blocks, raw(html, md = '') { blocks.push({ html, md }); return `\n\n@@NEWSROOM:${blocks.length - 1}@@\n\n` }, h: to => href(rel, to) }
}
const tabs = (b, ctx) => b.raw(`<nav class="adm-tabs" aria-label="Newsroom">${TABS.map(([r, l]) => `<a href="${b.h(r)}"${r === b.rel ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`,
    `**Newsroom:** ${TABS.map(([r, l]) => r === b.rel ? `**${l}**` : `[${l}](${ctx.link(b.rel, r)})`).join(' · ')}`)
const page = (b, p) => ({ ...p, rel: b.rel, type: 'site', layout: 'wide', assets: ASSETS, toc: [], _newsroom: b, postHtml: html => html.replace(/<p>@@NEWSROOM:(\d+)@@<\/p>/g, (m, i) => b.blocks[+i].html) })
const crumbs = (...xs) => [['newsroom/index.html', 'Newsroom'], ...xs]

// ---------- the overview ----------
function overview(ctx, m) {
    const b = builder('newsroom/index.html'), counts = liveCounts(ctx, m), P = m.plan
    const brief9 = briefOrder(ctx)
    const glance = d.glanceBox(`${ctx.HOST}, ${ctx.VERSION}, ${d.dayLabel(ctx.TODAY)}`, P.glance.map(g => ({ ...g, note: fillCounts(g.note, counts) })))
    // agents at work
    const roster = [...m.agents].sort((a, b) => ['running', 'done', 'waiting', 'planned', 'retired'].indexOf(a.status) - ['running', 'done', 'waiting', 'planned', 'retired'].indexOf(b.status) || (b.last ? b.last.when : '').localeCompare(a.last ? a.last.when : ''))
    const atWork = d.textTable([{ head: 'AGENT', width: 26 }, { head: 'STATUS', width: 8 }, { head: 'RUNS', width: 4, right: true }, { head: 'LAST', width: 16 }],
        roster.map(a => [a.name ? d.short(a.name) : `(${a.label.replace(/^The /, '')})`, a.status, a.runs.length, a.last ? d.when(a.last.when) : '-']))
    // the latest day, as swim lanes
    const latestDay = m.runs[0] ? d.dayOf(m.runs[0].when) : ctx.TODAY
    const dayRuns = m.runs.filter(r => d.dayOf(r.when) === latestDay)
    const starts = m.agents.filter(a => a.started && a.started.length > 10 && d.dayOf(a.started) === latestDay).map(a => d.ms(a.started))
    const ts = [...dayRuns.map(r => d.ms(r.when)), ...starts]
    const pad = Math.max(5 * 6e4, (Math.max(...ts) - Math.min(...ts)) * .06)
    const win = { from: Math.min(...ts) - pad, to: Math.max(...ts) + pad }
    const lanes = lanesFor(m, { ...win, hrefOf: r => b.h(runRel(r)), extendRunning: true })
    const par = parallels(lanes)
    // the pipeline picture
    const st = id => m.pipeline.find(p => p.stage === id)
    const box = (name, s) => ({ name, state: s ? s.state : '-', last: s && s.last ? `last ${d.dayLabel(s.last.when).slice(4)} ${d.hm(s.last.when)}` : 'no run yet' })
    const pub = st('publish'), firstName = s => s.desks.map(a => personName(a.person)).filter((x, i, l) => l.indexOf(x) === i).join(' and ') || 'nobody yet'
    const pic = d.pipelinePicture([
        { head: `RESEARCH: ${firstName(st('research'))}'s desks, ${st('research').state}`, left: box('researcher', st('research')), right: box('curator', st('curate')) },
        { head: `WRITING: ${firstName(st('write'))}'s desks, ${st('write').state}`, left: box('journalist', st('write')), right: box('fact-checker', st('check')) },
        { head: `PUBLISHING: ${d.short(pub.desks[0]?.name)}`, left: box('correspondent', pub), right: { name: 'the site', state: `${ctx.VERSION}, live`, last: `${counts.releases} releases` } },
    ], [st('programme'), st('edit'), st('security')].map(s => `${(s.desks[0]?.label || s.label).replace(/^The /, '').padEnd(22)} ${s.state.padEnd(8)} ${s.last ? 'last ' + d.when(s.last.when) : 'no run yet'}`))
    // the build order
    const order = d.textTable([{ head: '#', width: 2, right: true }, { head: 'Step', width: 23 }, { head: 'Due', width: 6 }, { head: 'State', width: 23 }],
        P.build_order.map(s => [s.step, s.short, (brief9.find(x => x.step === s.step)?.due || '').replace(/ Nov$/, ''), `${s.state === 'done' ? '[x]' : s.state === 'started' ? '[~]' : '[ ]'} ${fillCounts(s.note, counts)}`])) + '\n\n[x] done   [~] started   [ ] not yet'
    // what waits on a person
    const w0 = P.waiting[0]
    const chain = d.chainPicture([
        { text: wrap(w0.what, 27), note: [`${w0.issue || w0.ref}: only ${w0.who}`, 'can do it'] },
        { text: wrap(w0.unblocks, 27) },
        ...(w0.then ? [{ text: wrap(w0.then, 27) }] : []),
    ])
    const onlyIssues = m.team.board.filter(i => i.only.length && i.status !== 'done')
    // activity by hour
    const events = m.runs.map(r => ({ t: r.when, kind: r.laneKind, title: `${d.short(r.by)}: ${r.what}` }))
    const perKind = Object.fromEntries(d.KINDS.map(([k]) => [k, events.filter(e => e.kind === k).length]))
    // reality
    const R = reality(ctx)
    const latest = m.runs.slice(0, 8)
    const md = tabs(b, ctx) +
        `This is PrompTugal.news's newsroom: every agent, every run, the plan and the data, drawn from the repository at every release. It is public, like the rest of the site: it shows the work, never a credential. The pictures are plain text, so anyone can copy them into a chat, a commit or a slide; the charts are drawn at build and need no script.\n\n` +
        `<!-- newsroom:counts -->\n\n` +
        `## At a glance {#glance}\n\n${fence(glance)}\n\nThe bars are a judgement, not a measure: how close each part is to what [the brief](${ctx.link(b.rel, 'brief/index.html')}) asks of it. The numbers in the notes are counted from the data at this release. Kept in \`data/newsroom/plan.json\` by ${P.by}, last on ${d.when(P.updated)} UTC.\n\n` +
        `## Agents at work {#agents}\n\n${fence(atWork)}\n\n` +
        b.raw(d.figure({ svg: d.swimlanes(lanes, { ...win, title: `Who did what on ${d.dayLabel(latestDay)}, by agent` }), minWidth: 720, caption: `${d.markLegend()}<span>${esc(d.dayLabel(latestDay))}, UTC. A mark is a link to the run.</span>` }),
            `On ${d.dayLabel(latestDay)}: ${lanes.map(l => `${l.label} (${l.events.length})`).join(', ')}.`) +
        (par.length ? `**In parallel:** ${par.map(p => `${d.hm(p.from)} to ${p.running ? 'now' : d.hm(p.to)}, ${and(p.who)}`).join('; ')}.\n\n` : '') +
        `Every agent, with its page: [the agents](${ctx.link(b.rel, 'newsroom/agents/index.html')}); every day: [the timeline](${ctx.link(b.rel, 'newsroom/timeline/index.html')}).\n\n` +
        `## The pipeline {#pipeline}\n\nThe run of [brief 4](${ctx.link(b.rel, 'brief/04-the-desks-and-the-run/index.html')}): research, curate, write, check, publish, with the programme desk, the editor and security beside the line. Each desk writes files, only in its own folder.\n\n${fence(pic)}\n\n` +
        `| Stage | Desk | Who | State | Last run |\n|---|---|---|---|---|\n` +
        m.pipeline.map(p => `| ${p.label} | ${p.desks.map(a => `[${cell(a.name ? d.short(a.name) : a.label)}](${ctx.link(b.rel, agentRel(a))})`).join(', ') || 'none'} | ${p.desks.map(a => personName(a.person)).join(', ') || '-'} | ${p.state} | ${p.last ? `[${d.when(p.last.when)}](${ctx.link(b.rel, runRel(p.last))}): ${cell(p.last.what)}` : 'no run yet'} |`).join('\n') + '\n\n' +
        `## The build order {#build-order}\n\nThe plan to Monday, from [brief 9](${ctx.link(b.rel, 'brief/09-first-version-and-decisions/index.html')}), as it stands at this release.\n\n${fence(order)}\n\n` +
        `## Activity {#activity}\n\n` +
        b.raw(d.figure({ svg: d.hourBars(events, { title: 'Runs per hour, by kind of agent' }), minWidth: 560, caption: `${d.legend()}<span>Every run in the ledger and the desks' reports, per hour (UTC).</span>` }),
            fence(d.textBars(d.KINDS.map(([k, l]) => [l, perKind[k]]), { width: 30 }))) +
        `${m.runs.length} runs in all: ${d.KINDS.map(([k, l]) => `${perKind[k]} by ${k === 'ci' ? 'CI' : l.toLowerCase() + (perKind[k] === 1 ? '' : 's')}`).join(', ')}.\n\n` +
        `## What waits on a person {#waiting}\n\n${fence(chain)}\n\n` +
        P.waiting.map(w => `- **${w.what}**: ${w.who}${w.issue ? ` ([${w.issue}](${TEAM_BOARD}${m.team.board.find(i => i.id === w.issue)?.file || 'board/'}))` : ''}${w.ref ? ` (${w.ref})` : ''}. Unblocks: ${w.unblocks}.`).join('\n') + '\n\n' +
        (onlyIssues.length ? `On the team's board, marked "only this person can do it": ${onlyIssues.map(i => `[${i.id}](${TEAM_BOARD}${i.file}) (${cell(i.title)}; only ${i.only.join(', ')}${i.blocks.length ? `; blocks ${i.blocks.join(', ')}` : ''})`).join('; ')}. Read from the team's site ${m.team.from.version || m.team.from.commit} on ${d.when(m.team.read_at)} UTC.\n\n` : '') +
        `## What exists, and what does not yet {#reality}\n\n[REALITY.md](${REPO_URL}/blob/dev/REALITY.md) lists ${R.exists.length} things that exist. Not yet (${R.notYet.length}):\n\n${R.notYet.map(x => `- ${cell(x)}`).join('\n')}\n\n` +
        `## The latest runs {#latest}\n\n| When | Who | What | Release |\n|---|---|---|---|\n${latest.map(r => `| [${d.when(r.when)}](${ctx.link(b.rel, runRel(r))}) | ${r.roster ? `[${d.short(r.by)}](${ctx.link(b.rel, agentRel(r.roster))})` : d.short(r.by === 'GitHub Actions' ? null : r.by)} | ${cell(r.what)} | ${r.release ? `[${r.release}](${ctx.link(b.rel, `newsroom/versions.html#${r.release}`)})` : r.source === 'desk-report' ? 'reported' : 'not yet'} |`).join('\n')}\n\n[Every run](${ctx.link(b.rel, 'newsroom/runs/index.html')}).\n\n` +
        sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data/newsroom/plan.json', date: ctx.TODAY, title: 'The newsroom', crumbs: [[null, 'Newsroom']], summary: 'Every agent working on PrompTugal.news, every run, the plan and the data, live from the repository at every release: the status report of 5 November, drawn from data.', md })
}
const and = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`
function wrap(s, w) { const out = []; let cur = ''; for (const word of String(s).split(/\s+/)) { if ((cur + ' ' + word).trim().length > w) { out.push(cur.trim()); cur = word } else cur += ' ' + word } if (cur.trim()) out.push(cur.trim()); return out }
function briefOrder(ctx) {
    const src = ctx.readText('content/brief/09-first-version-and-decisions.md')
    return [...src.matchAll(/^\|\s*(\d+)\s*\|\s*\*\*(.+?)\*\*[^|]*\|[^|]*\|\s*([^|]+?)\s*\|$/gm)].map(x => ({ step: +x[1], title: x[2], due: x[3] }))
}
function reality(ctx) {
    const src = ctx.readText('REALITY.md'), sec = h => (src.split(/^## /m).find(s => s.startsWith(h)) || '').split('\n').filter(l => /^- /.test(l)).map(l => l.slice(2))
    const first = l => { const t = l.replace(/`/g, '').replace(/\*\*/g, ''); const i = t.search(/: |; |\. /); return (i > 20 && i < 160 ? t.slice(0, i) : t.length > 160 ? t.slice(0, 157).replace(/\s\S*$/, '') + ' …' : t).replace(/\.$/, '') }
    return { exists: sec('Exists').map(first), notYet: sec('Not yet').map(first) }
}
function sourcesSection(ctx, rel, m) {
    return `## Where this comes from {#sources}\n\n- The runs ledger, \`data/newsroom/runs/\`: ${m.ledger.length} commits of this repository, one line each, appended from git by \`newsroom/tools/runs.mjs\` (last commit in it: ${m.ledger.length ? `${m.ledger.at(-1).short}, ${d.when(m.ledger.at(-1).when)} UTC` : 'none'}). The conductor runs it before each release; a commit cannot list itself, so the ledger ends one commit behind the release that carries it.\n` +
        `- The roster, \`data/newsroom/agents.json\`, and the plan, \`data/newsroom/plan.json\`: hand-kept.\n` +
        `- The team's site, ${m.team.from.repo} (${m.team.from.branch} at ${m.team.from.commit}${m.team.from.version ? `, ${m.team.from.version}` : ''}), read ${d.when(m.team.read_at)} UTC by \`newsroom/tools/desks-snapshot.mjs\` into \`data/newsroom/team-site.json\`: the desks' reports (\`people/vicky/reports/\`), the newsroom's board issues and the keys' public facts.\n` +
        `- The data (\`data/\`), [REALITY.md](${REPO_URL}/blob/dev/REALITY.md), [brief 9](${ctx.link(rel, 'brief/09-first-version-and-decisions/index.html')}) and the gate (\`newsroom/build/validate.js\`), read at build.\n` +
        `- The same, as JSON for agents: [api/v1/newsroom/status.json](${href(rel, 'api/v1/newsroom/status.json')}).\n`
}

// ---------- the runs ----------
function areaSummary(r) {
    if (!r.areas) return ''
    return AREA_ORDER.filter(a => r.areas[a]).map(a => `${a} ${r.areas[a].files}`).join(', ')
}
function runsPage(ctx, m) {
    const b = builder('newsroom/runs/index.html')
    const agentsWithRuns = m.agents.filter(a => a.runs.length)
    const issues = [...new Set(m.runs.flatMap(r => r.issues))].sort((x, y) => +x.slice(3) - +y.slice(3))
    const desks = [...new Set(m.runs.map(r => r.roster?.desk).filter(Boolean))]
    const sel = (f, label, opts) => `<label>${label} <select data-f="${f}"><option value="">All</option>${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select></label>`
    const filters = `<form class="adm-filters" data-for="adm-runs" hidden>${sel('agent', 'Agent', [...agentsWithRuns.map(a => [a.id, d.short(a.name) || a.label]), ['ci', 'CI (releases)']])}${sel('desk', 'Desk', desks.map(x => [x, x]))}${sel('issue', 'Issue', issues.map(x => [x, x]))}${sel('source', 'Kind', [['commit', 'commits here'], ['desk-report', 'desk reports'], ['release', 'releases']])}<output class="adm-count" aria-live="polite"></output></form>`
    let day = '', rows = ''
    for (const r of m.runs) {
        const dd = d.dayOf(r.when)
        if (dd !== day) { day = dd; rows += `<tr class="day"><th colspan="6" scope="rowgroup">${esc(d.dayLabel(dd))}</th></tr>` }
        const who = r.roster ? `<a href="${b.h(agentRel(r.roster))}">${esc(d.short(r.by))}</a>` : esc(r.kind === 'release' ? 'CI' : r.by)
        const what = r.source === 'desk-report'
            ? `${esc(r.what)}<details><summary>Run report, ${r.lines.length} lines</summary><ul>${r.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul><p class="adm-meta">From <code>${esc(r.report)}</code> on the team's site.</p></details>`
            : `${esc(r.what)}${r.kind === 'merge' ? ' <span class="adm-st st-merge">merge</span>' : ''}${r.kind === 'release' ? ` <span class="adm-meta">pushed by ${esc(d.short(r.pushed_by))}; carried ${r.carries.map(s => `<a href="#run-${s}">${s}</a>`).join(', ')}</span>` : ''}<span class="adm-meta"> <code>${r.id}</code>${r.for.length ? ` · for ${esc(r.for.map(d.short).join(', '))}` : ''}</span>`
        const changed = r.source === 'desk-report' ? `<span class="adm-meta">${r.captures != null ? `${r.captures} captures` : 'reported'}</span>` : `<span class="adm-areas">${AREA_ORDER.filter(a => r.areas[a]).map(a => `<span class="ar ar-${a}" title="${r.areas[a].files} files, +${r.areas[a].add} -${r.areas[a].del}">${a} ${r.areas[a].files}</span>`).join('')}</span><span class="adm-meta">+${n(r.add)} -${n(r.del)}</span>`
        const rel = r.kind === 'release' ? `<a href="${b.h(`newsroom/versions.html#${r.release}`)}">is ${r.release}</a>` : r.release ? `<a href="${b.h(`newsroom/versions.html#${r.release}`)}">${r.release}</a>` : r.source === 'desk-report' ? '<span class="adm-meta">outside this repository</span>' : '<span class="adm-meta">not yet</span>'
        rows += `<tr id="run-${r.id}" data-agent="${r.roster ? r.roster.id : r.kind === 'release' ? 'ci' : ''}" data-desk="${r.roster?.desk || ''}" data-issue="${r.issues.join(' ')}" data-source="${r.kind === 'release' ? 'release' : r.source}"><td class="t"><time datetime="${r.when}">${d.hm(r.when)}</time></td><td>${who}</td><td class="what">${what}</td><td class="iss">${r.issues.map(i => esc(i)).join(' ')}</td><td>${changed}</td><td>${rel}</td></tr>`
    }
    const table = `<div class="table adm-table"><table id="adm-runs" class="adm-runs-t"><thead><tr><th>UTC</th><th>Who</th><th>What</th><th>Issue</th><th>Changed</th><th>Release</th></tr></thead><tbody>${rows}</tbody></table></div>`
    const twin = `| When (UTC) | Who | What | Issue | Changed | Release |\n|---|---|---|---|---|---|\n` + m.runs.map(r => `| ${d.when(r.when)} | ${d.short(r.kind === 'release' ? null : r.by)} | ${cell(r.what)}${r.source === 'desk-report' ? ` (desk report: ${r.lines.map(cell).join(' / ')})` : ''} | ${r.issues.join(' ')} | ${r.source === 'desk-report' ? (r.captures != null ? `${r.captures} captures` : '') : `${areaSummary(r)}; +${r.add} -${r.del}`} | ${r.kind === 'release' ? `is ${r.release}` : r.release || (r.source === 'desk-report' ? 'outside' : 'not yet')} |`).join('\n')
    const counts = { commits: m.runs.filter(r => r.source === 'commit' && r.kind !== 'release').length, releases: m.releases.length, desk: m.runs.filter(r => r.source === 'desk-report').length }
    const md = tabs(b, ctx) +
        `Every run, newest first: ${counts.commits} commits here by the agents (and the repository's first commit), ${counts.releases} releases by CI, and ${counts.desk} runs the desks reported on the team's site (their work lands in the research vault or arrives here as a commit). Each commit with the areas of the repository it changed (files, lines added and removed) and the release it went out in. Filter by agent, desk, issue or kind; with no script, every run is shown.\n\n` +
        b.raw(filters + table, twin) +
        `Areas: content (\`content/\`), data (\`data/\`), desks (\`desks/\`), build (\`newsroom/build/\`), tools (\`newsroom/tools/\`), assets, design, signatures (\`articles/*.sig\`), ci (\`.github/\`), docs (the top-level documents), release (\`version.txt\` and \`versions.json\`, CI only). A merge counts what it brought in against its first parent.\n\n` +
        sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data/newsroom/runs', date: m.runs[0] ? d.dayOf(m.runs[0].when) : ctx.TODAY, title: 'Every run', crumbs: crumbs([null, 'Runs']), summary: 'Every run of every agent on this newsroom, newest first: what it changed, the issue it served and the release it went out in, from the runs ledger and the desks\' reports.', md })
}

// ---------- the agents ----------
function agentsPage(ctx, m) {
    const b = builder('newsroom/agents/index.html')
    const groups = [['running', 'Running'], ['done', 'Done'], ['waiting', 'Waiting'], ['planned', 'Planned'], ['retired', 'Retired']]
    const row = a => `| [${cell(a.name ? d.short(a.name) : a.label)}](${ctx.link(b.rel, agentRel(a))}) | ${cell(a.label)} | ${a.kind}${a.desk ? `, ${a.desk}` : ''} | ${personName(a.person)} | ${a.runs.length} | ${a.last ? d.when(a.last.when) : '-'} | ${a.keys.filter(k => k.status === 'current').map(k => `\`${k.id}\``).join(', ') || '-'} |`
    // where each agent's work lands: areas by agent, from the ledger
    const withCommits = m.agents.filter(a => a.commits)
    const areas = AREA_ORDER.filter(ar => withCommits.some(a => a.runs.some(r => r.areas?.[ar])))
    const sum = (a, ar) => a.runs.reduce((s, r) => s + (r.areas?.[ar]?.files || 0), 0)
    const max = Math.max(1, ...withCommits.flatMap(a => areas.map(ar => sum(a, ar))))
    const matrix = `<div class="table adm-table"><table class="adm-matrix"><thead><tr><th>Agent</th>${areas.map(a => `<th>${a}</th>`).join('')}</tr></thead><tbody>${withCommits.map(a => `<tr><th scope="row"><a href="${b.h(agentRel(a))}">${esc(d.short(a.name))}</a></th>${areas.map(ar => { const v = sum(a, ar); return `<td${v ? ` style="--v:${(0.12 + 0.88 * Math.sqrt(v / max)).toFixed(2)}"` : ''}>${v ? n(v) : ''}</td>` }).join('')}</tr>`).join('')}</tbody></table></div>`
    const matrixMd = `| Agent | ${areas.join(' | ')} |\n|---|${areas.map(() => '---').join('|')}|\n` + withCommits.map(a => `| ${d.short(a.name)} | ${areas.map(ar => sum(a, ar) || '').join(' | ')} |`).join('\n')
    const md = tabs(b, ctx) +
        `Every agent working on this newsroom: the conductor, the builders it fired up, the desks, and the agents on the team's site whose work reaches this repository. Kept by hand in \`data/newsroom/agents.json\`; their runs come from the ledger and the desks' reports. Each agent has a page.\n\n` +
        groups.map(([s, l]) => { const xs = m.agents.filter(a => a.status === s); return xs.length ? `## ${l} (${xs.length}) {#${s}}\n\n| Agent | Role | Kind | For | Runs | Last run | Key |\n|---|---|---|---|---|---|---|\n${xs.map(row).join('\n')}\n\n` : '' }).join('') +
        `## Where their work lands {#areas}\n\nFiles changed by each agent's commits, by area of the repository (a darker cell, more files). A merge counts against the agent that merged.\n\n` + b.raw(matrix, matrixMd) +
        `## Keys {#keys}\n\nAn agent's key is a session key: it dies with its session, and a new session makes a new one. The public half is an entry on [the team's keys page](${TEAM_KEYS}); nothing of a key is kept here but its id and its public fingerprints. ${m.agents.filter(a => !a.keys.length && a.status !== 'planned').length} running or finished agents have no key of their own: the builders work inside the conductor's session, commit under their own names and sign nothing.\n\n` +
        sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data/newsroom/agents.json', title: 'The agents', crumbs: crumbs([null, 'Agents']), summary: `${m.agents.length} agents: ${m.agents.filter(a => a.status === 'running').length} running, ${m.agents.filter(a => a.status === 'done').length} done, ${m.agents.filter(a => a.status === 'planned').length} planned. Who fired each one up and when, its role, its runs, its key and where its work lands.`, md })
}
function agentPage(ctx, m, a) {
    const b = builder(agentRel(a))
    const facts = [
        ['Name', a.name ? `\`${a.name}\`` : 'not named yet'],
        ['Role', a.role],
        ['Kind', `${a.kind}${a.desk ? ` (the ${a.desk} desk)` : ''}`],
        ['Works for', personName(a.person)],
        ['Fired up by', a.started_by ? `${a.started_by}${a.started ? `, ${a.started.length > 10 ? d.when(a.started) + ' UTC' : d.dayLabel(a.started)}` : ''}` : 'not yet'],
        ['How we know', a.started_basis],
        ['Status', `${a.status}: ${a.status_note}`],
        ['Its work lands in', a.lands.map(l => /^[a-z.*/-]+[/*]?$/i.test(l) && !l.includes(' ') ? `\`${l}\`` : l).join('; ')],
        ...(a.branch ? [['Branch', `\`${a.branch}\``]] : []),
        ['Issues', a.issues.map(i => { const x = m.team.board.find(t => t.id === i); return x ? `[${i}](${TEAM_BOARD}${x.file}) (${cell(x.title)}, ${x.status})` : i }).join('; ') || 'none'],
    ]
    const keys = a.keyFacts.length ? `| Key | Status | Added | Encryption fingerprint | Signing fingerprint |\n|---|---|---|---|---|\n${a.keyFacts.map(k => `| [${k.id}](${TEAM_KEYS}#${k.id}) | ${k.status}${k.note ? `: ${cell(k.note.replace(/;?\s*record sha256:[0-9a-f]{16}/, ''))}` : ''} | ${k.added || '-'} | ${k.fingerprint ? `\`${k.fingerprint}\`` : '-'} | ${k.signing_fingerprint ? `\`${k.signing_fingerprint}\`` : '-'} |`).join('\n')}\n\nThe public half only, as published on [the team's keys page](${TEAM_KEYS}). A session key dies with its session.` : 'No key of its own on the team\'s keys page.'
    const runs = a.runs.length ? `| When (UTC) | What | Issue | Changed | Release |\n|---|---|---|---|---|\n${a.runs.map(r => `| [${d.when(r.when)}](${ctx.link(b.rel, runRel(r))}) | ${cell(r.what)}${r.kind === 'merge' ? ' (merge)' : ''} | ${r.issues.join(' ')} | ${r.source === 'desk-report' ? (r.captures != null ? `${r.captures} captures` : 'desk report') : `${areaSummary(r)}; +${r.add} -${r.del}`} | ${r.release ? `[${r.release}](${ctx.link(b.rel, `newsroom/versions.html#${r.release}`)})` : r.source === 'desk-report' ? 'outside' : 'not yet'} |`).join('\n')}` : (a.status === 'planned' ? 'No run yet: this desk is planned.' : 'No run in the ledger yet: its work has not been merged into this branch.')
    const areaRows = AREA_ORDER.map(ar => ({ label: ar, value: a.runs.reduce((s, r) => s + (r.areas?.[ar]?.files || 0), 0) })).filter(x => x.value)
    const md = tabs(b, ctx) +
        facts.map(([k, v]) => `- **${k}:** ${v}`).join('\n') + '\n\n' +
        `## Runs (${a.runs.length}) {#runs}\n\n${runs}\n\n` +
        (areaRows.length ? `## Where its commits landed {#areas}\n\n` + b.raw(d.figure({ svg: d.hbars(areaRows, { title: `Files changed by ${a.name}, by area`, unit: '', labelW: 110, w: 560 }), caption: '<span>Files changed, by area of the repository.</span>' }), fence(d.textBars(areaRows.map(r => [r.label, r.value])))) : '') +
        `## Key {#key}\n\n${keys}\n\n` +
        `[All the agents](${ctx.link(b.rel, 'newsroom/agents/index.html')}) · [every run](${ctx.link(b.rel, 'newsroom/runs/index.html')}) · [the timeline](${ctx.link(b.rel, 'newsroom/timeline/index.html')}).\n`
    return page(b, { src: 'data/newsroom/agents.json', title: a.name ? a.name : a.label, crumbs: crumbs(['newsroom/agents/index.html', 'Agents'], ['newsroom/live/index.html', 'Live'], [null, a.name ? d.short(a.name) : a.label]), summary: `${a.label}. ${a.kind[0].toUpperCase() + a.kind.slice(1)}, ${a.status}; ${a.runs.length} run${a.runs.length === 1 ? '' : 's'}${a.last ? `, the last on ${d.when(a.last.when)} UTC` : ''}.`, md })
}

// ---------- the timeline ----------
function timelinePage(ctx, m) {
    const b = builder('newsroom/timeline/index.html')
    const days = [...new Set([...m.runs.map(r => d.dayOf(r.when))])].sort().reverse()
    const latest = days[0]
    let md = tabs(b, ctx) + `The sequence of events across all agents, one lane per agent, time running left to right (UTC). A bar is an agent at work, from its first event of the day to its last; where two bars overlap, two agents worked in parallel. Circles are commits here, squares are runs a desk reported on the team's site, diamonds are releases, a hollow ring is an agent fired up. A running builder's bar runs on to the right edge. Every mark is a link to its run.\n\n`
    for (const day of days) {
        const runs = m.runs.filter(r => d.dayOf(r.when) === day)
        const starts = m.agents.filter(a => a.started && a.started.length > 10 && d.dayOf(a.started) === day).map(a => d.ms(a.started))
        const ts = [...runs.map(r => d.ms(r.when)), ...starts]
        const pad = Math.max(5 * 6e4, (Math.max(...ts) - Math.min(...ts)) * .05)
        const win = { from: Math.min(...ts) - pad, to: Math.max(...ts) + pad }
        const lanes = lanesFor(m, { ...win, hrefOf: r => b.h(runRel(r)), extendRunning: day === latest })
        const par = parallels(lanes)
        const seq = runs.slice().reverse().map(r => `${d.hm(r.when)}  ${r.kind === 'release' ? '*' : r.source === 'desk-report' ? '#' : 'o'}  ${(r.kind === 'release' ? r.release : d.short(r.by).replace(/@.*/, '')).padEnd(14)} ${r.what}`.slice(0, d.W))
        const fired = m.agents.filter(a => a.started && a.started.length > 10 && d.dayOf(a.started) === day)
        md += `## ${d.dayLabel(day)} {#d-${day}}\n\n` +
            b.raw(d.figure({ svg: d.swimlanes(lanes, { ...win, title: `${d.dayLabel(day)}: who did what, by agent` }), minWidth: 760, caption: `${d.markLegend()}` }),
                fence(seq.join('\n'))) +
            `${runs.length} runs by ${lanes.filter(l => l.kind !== 'ci').length} agents${runs.some(r => r.kind === 'release') ? `, ${runs.filter(r => r.kind === 'release').length} releases` : ''}, from ${d.hm(runs.at(-1).when)} to ${d.hm(runs[0].when)}.` +
            (fired.length ? ` Fired up this day: ${fired.map(a => `[${d.short(a.name)}](${ctx.link(b.rel, agentRel(a))}) at ${d.hm(a.started)}`).join(', ')}.` : '') + '\n\n' +
            (par.length ? `In parallel: ${par.map(p => `${d.hm(p.from)} to ${p.running ? 'the end of the day\'s record' : d.hm(p.to)}, ${and(p.who)}`).join('; ')}.\n\n` : '')
    }
    // the releases, in plain text, after the first article's timeline
    const rel = m.releases.slice().sort((a, b) => a.when.localeCompare(b.when))
    let txt = '', dd = ''
    for (const r of rel) { if (d.dayOf(r.when) !== dd) { dd = d.dayOf(r.when); txt += `${d.dayLabel(r.when)}\n` } const lines = wrap(r.what, d.W - 21); txt += `  ${d.hm(r.when)}  o  ${r.version.padEnd(7)} ${lines[0]}\n` + lines.slice(1).map(l => `         |${' '.repeat(11)}${l}\n`).join('') + '         |\n' }
    const pending = m.runs.filter(r => r.source === 'commit' && r.kind !== 'release' && !r.release && r.kind !== 'initial')
    txt += `  next   o  ${pending.length} commits not released on this branch`
    md += `## Every release {#releases}\n\n${fence(txt.trimEnd())}\n\nThe [release history](${ctx.link(b.rel, 'newsroom/versions.html')}) has every row CI wrote.\n\n` + sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data/newsroom/runs', date: latest || ctx.TODAY, title: 'The timeline', crumbs: crumbs([null, 'Timeline']), summary: 'Who did what, in what order, and where agents worked in parallel: every run as swim lanes by agent, one chart per day.', md })
}

// ---------- the data ----------
let FEATURES = []
const apiGroup = p => { const s = p.split('/'); return s.length <= 3 ? p : s[2] === 'graph' && s.length > 4 ? `api/v1/graph/${s[3]}/` : `api/v1/${s[2]}/` }
function dataPage(ctx, m) {
    const b = builder('newsroom/data/index.html'), s = ctx.store, g = ctx.graph()
    const PAGES = { companies: 'companies/index.html', events: 'events/index.html', people: 'people/index.html', organisations: 'organisations/index.html', places: 'places/index.html', topics: 'topics/index.html' }
    const types = ['companies', 'events', 'people', 'organisations', 'places', 'topics', 'stories', 'evidence']
    const tRows = types.map(t => ({ label: t, value: s[t].length, href: PAGES[t] ? b.h(PAGES[t]) : null }))
    const byVerb = {}; for (const e of g.edges) byVerb[e.verb] = (byVerb[e.verb] || 0) + 1
    const vRows = Object.entries(byVerb).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))
    const byType = {}; for (const x of g.nodes) byType[x.type] = (byType[x.type] || 0) + 1
    // sources: every URL the data cites, with the date it was read
    const src = []
    for (const c of s.companies) for (const x of c.sources) src.push({ url: x.url, read: x.read_on, kind: 'company source' })
    for (const e of s.events) if (e.source_url) src.push({ url: e.source_url, read: (e.read_at || '').slice(0, 10), kind: 'agenda item' })
    for (const x of s.evidence) if (x.source_url) src.push({ url: x.source_url, read: (x.run || '').slice(0, 10), kind: 'capture' })
    for (const p of s.people) for (const l of p.listings) if (l.source) src.push({ url: l.source, read: (l.read_at || '').slice(0, 10), kind: 'speaker listing' })
    const rechecks = s.companies.flatMap(c => c.recheck)
    const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return 'other' } }
    const urls = new Map(); for (const x of src) if (!urls.has(x.url) || urls.get(x.url).read < x.read) urls.set(x.url, x)
    const byDomain = {}; for (const x of urls.values()) byDomain[host(x.url)] = (byDomain[host(x.url)] || 0) + 1
    const dRows = Object.entries(byDomain).sort((a, b) => b[1] - a[1])
    const top = dRows.slice(0, 12).map(([label, value]) => ({ label, value }))
    if (dRows.length > 12) top.push({ label: `${dRows.length - 12} other domains`, value: dRows.slice(12).reduce((n, x) => n + x[1], 0) })
    const byDay = {}; for (const x of urls.values()) if (x.read) byDay[x.read] = (byDay[x.read] || 0) + 1
    const age = day => Math.round((Date.parse(ctx.TODAY) - Date.parse(day)) / 864e5)
    const kinds = ['company source', 'agenda item', 'capture', 'speaker listing'].map(k => { const ds = src.filter(x => x.kind === k && x.read).map(x => x.read).sort(); return { k, n: src.filter(x => x.kind === k).length, oldest: ds[0], newest: ds.at(-1) } })
    const mc = s.matching?.counts || {}
    // the agenda by day and the captures by beat, as text bars
    const agendaDays = {}; for (const e of s.events.filter(e => e.derived)) agendaDays[e.date] = (agendaDays[e.date] || 0) + 1
    const beats = {}; for (const x of s.evidence) beats[x.beat] = (beats[x.beat] || 0) + 1
    const checks = [...ctx.readText('newsroom/build/validate.js').matchAll(/^\/\/\s{2,3}(\d+)\.\s+(.+)$/gm)].map(x => [+x[1], x[2]])
    const R = reality(ctx)
    const md = tabs(b, ctx) +
        `What the newsroom holds at this release: the entities and their links, the sources they were read on and when, what the derivation matched, the gate's checks and the files of the JSON API. Every number here is counted from the repository at build. The data's layout and rules: \`data/README.md\`; the API: [the data, as JSON](${ctx.link(b.rel, 'api/index.html')}).\n\n` +
        `## Entities {#entities}\n\n` + b.raw(d.figure({ svg: d.hbars(tRows, { title: 'Entities by type', labelW: 130, w: 620 }), caption: '<span>Entities by type; a label with a page is a link to it.</span>' }), `| Type | How many |\n|---|---|\n${tRows.map(r => `| ${r.label} | ${r.value} |`).join('\n')}`) +
        `## The graph {#graph}\n\n${n(g.nodes.length)} nodes and ${n(g.edges.length)} edges in the ontology's grammar (${s.ontology.types.length} types, ${s.ontology.verbs.length} verbs). Nodes by type: ${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, v]) => `${t} ${n(v)}`).join(', ')}.\n\n` +
        b.raw(d.figure({ svg: d.hbars(vRows, { title: 'Edges by verb', labelW: 150, w: 640 }), caption: '<span>Edges by verb; each verb has a distinct inverse.</span>' }), `| Verb | Edges |\n|---|---|\n${vRows.map(r => `| ${r.label} | ${r.value} |`).join('\n')}`) +
        `## Sources {#sources-data}\n\n${n(urls.size)} distinct pages cited, ${n(src.length)} citations in all, from ${dRows.length} domains; ${rechecks.length} company re-checks logged.\n\n` +
        b.raw(d.figure({ svg: d.hbars(top, { title: 'Distinct sources by domain', labelW: 210, w: 680 }), caption: '<span>Distinct pages cited, by domain.</span>' }), fence(d.textBars(top.map(r => [r.label, r.value]), { labelWidth: 22, width: 28 }))) +
        `### When they were read {#read-dates}\n\n${fence(d.textBars(Object.entries(byDay).sort().map(([k, v]) => [d.dayLabel(k), v, `${age(k)} day${age(k) === 1 ? '' : 's'} ago`]), { width: 28, labelWidth: 10 }))}\n\n` +
        `| Kind | Citations | Oldest read | Newest read |\n|---|---|---|---|\n${kinds.map(k => `| ${k.k} | ${k.n} | ${k.oldest ? `${k.oldest} (${age(k.oldest)} d)` : '-'} | ${k.newest ? `${k.newest} (${age(k.newest)} d)` : '-'} |`).join('\n')}\n\nAges are counted from the build's day, ${ctx.TODAY}.\n\n` +
        `## The derivation and the matching {#matching}\n\nThe desks' files (\`desks/\`) become entities by \`newsroom/tools/derive.mjs\`; its report is \`data/matching.json\`.\n\n| What | Count |\n|---|---|\n${Object.entries(mc).map(([k, v]) => `| ${k.replace(/_/g, ' ')} | ${v} |`).join('\n')}\n\n` +
        `The agenda by day (${s.events.filter(e => e.derived).length} items from the programme desk):\n\n${fence(d.textBars(Object.entries(agendaDays).sort().map(([k, v]) => [d.dayLabel(k), v]), { width: 36, labelWidth: 10 }))}\n\nThe curator's captures by beat (${s.evidence.length}), and ${s.stories.length} story candidates resting on them:\n\n${fence(d.textBars(Object.entries(beats).sort((a, b) => b[1] - a[1]), { width: 36, labelWidth: 14 }))}\n\n` +
        `## The API files {#api}\n\n<!-- newsroom:api-files -->\n\n` +
        `## The gate {#gate}\n\n\`node newsroom/build/validate.js\` builds the site and runs ${checks.length} checks; a failure stops the release. This section adds its own (the ledger against its schema, every committing agent in the roster, every key named in the roster on the team's keys page, no placeholder left, and the byte count above against the manifest).\n\n${checks.map(([i, t]) => `${i}. ${t}`).join('\n')}\n\n` +
        `## What exists {#reality}\n\n[REALITY.md](${REPO_URL}/blob/dev/REALITY.md): ${R.exists.length} things exist, ${R.notYet.length} are not yet (listed on [the overview](${ctx.link(b.rel, 'newsroom/index.html#reality')})).\n\n` + sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data', date: ctx.TODAY, title: 'The data', crumbs: crumbs([null, 'Data']), summary: 'What the newsroom holds: entities by type, edges by verb, sources by domain and read date, the derivation\'s matching, the gate\'s checks and the JSON API\'s files and sizes.', md })
}
function apiFiles(p, ctx) {
    const b = p._newsroom, files = [], skipped = []
    for (const f of FEATURES) {
        if (!f.api || f.name === 'newsroom') continue
        let out
        try { out = f.api(ctx) } catch { skipped.push(f.name); continue }
        if (out && typeof out.then === 'function') { out.catch(() => { }); skipped.push(f.name); continue }
        for (const x of out) files.push({ path: x.path, bytes: Buffer.byteLength(typeof x.data === 'string' ? x.data : json(x.data)), feature: f.name })
    }
    for (const x of api(ctx)) files.push({ path: x.path, bytes: Buffer.byteLength(json(x.data)), feature: 'newsroom' })
    const docs = []
    for (const f of FEATURES) if (f.searchDocs) { const r = f.searchDocs(ctx); if (r && typeof r.then === 'function') { r.catch(() => { }); skipped.push(`${f.name} (search)`) } else docs.push(...r) }
    if (docs.length) files.push({ path: 'api/v1/search-docs.json', bytes: Buffer.byteLength(json({ version: ctx.VERSION, count: docs.length, docs })), feature: 'core' })
    const groups = new Map()
    for (const f of files) { const k = apiGroup(f.path); const x = groups.get(k) || { files: 0, bytes: 0, feature: f.feature }; x.files++; x.bytes += f.bytes; groups.set(k, x) }
    const rows = [...groups].sort((a, b) => b[1].bytes - a[1].bytes)
    const total = files.reduce((s, f) => s + f.bytes, 0)
    const html = `<div class="table adm-table"><table><thead><tr><th>Files</th><th>From</th><th class="num">How many</th><th class="num">Size</th></tr></thead><tbody>${rows.map(([k, v]) => `<tr><td><code>${esc(k)}</code></td><td>${esc(v.feature)}</td><td class="num">${n(v.files)}</td><td class="num">${kb(v.bytes)}</td></tr>`).join('')}<tr class="total"><th>All</th><td></td><td class="num">${n(files.length)}</td><td class="num"><span id="adm-api-total" data-bytes="${total}" data-files="${files.length}" data-complete="${skipped.length ? 'false' : 'true'}">${kb(total)}</span></td></tr></tbody></table></div>`
    const mdT = `| Files | From | How many | Size |\n|---|---|---|---|\n${rows.map(([k, v]) => `| \`${k}\` | ${v.feature} | ${v.files} | ${kb(v.bytes)} |`).join('\n')}\n| All | | ${files.length} | ${kb(total)} |`
    return `${n(files.length)} files under \`/api/v1/\` at this release, ${kb(total)} in all, plus the manifest that lists them with their SHA-256 ([manifest.json](${href(p.rel, 'api/v1/manifest.json')})). Built at every release, never committed.${skipped.length ? ` Not counted here (built asynchronously): ${skipped.join(', ')}.` : ''}\n\n` + b.raw(html, mdT)
}

// ---------- the workflows ----------
function flow(steps) {
    return `<ol class="adm-flow" style="--n:${steps.length}">${steps.map(s => `<li class="${s.state ? `st-${s.state}` : ''}"><b>${esc(s.title)}</b>${s.who ? `<span class="who">${esc(s.who)}</span>` : ''}${s.sub ? `<span class="sub">${esc(s.sub)}</span>` : ''}${s.state ? `<span class="adm-st st-${s.state}">${esc(s.state)}</span>` : ''}</li>`).join('')}</ol>`
}
const flowMd = steps => steps.map((s, i) => `${i + 1}. **${s.title}**${s.who ? ` (${s.who})` : ''}${s.sub ? `: ${s.sub}` : ''}${s.state ? ` [${s.state}]` : ''}`).join('\n')
function workflowsPage(ctx, m) {
    const b = builder('newsroom/workflows/index.html'), s = ctx.store, P = m.plan, counts = liveCounts(ctx, m)
    const st = id => m.pipeline.find(p => p.stage === id)
    const who = p => p.desks.map(a => a.name ? d.short(a.name) : `${personName(a.person)}, proposed`).join(', ') || 'no owner yet'
    const run = [
        ...STAGES.map(([id, l]) => ({ title: l, who: who(st(id)), sub: { research: 'one capture per source, in the research vault', curate: 'maps captures, spots stories (desks/curator/)', write: 'drafts from the map (desks/journalist/drafts/)', check: 'every claim against its source', publish: 'signs the article, releases' }[id], state: st(id).state })),
        { title: 'The desk (the editor)', who: who(st('edit')), sub: 'the front page\'s order, corrections', state: st('edit').state },
        { title: 'Security', who: who(st('security')), sub: 'reviews every run\'s diff', state: st('security').state },
    ]
    const releaseFlow = [
        { title: 'Commit', who: 'an agent', sub: 'subject "<agent>: <what>", trailers Agent, Issue, For' },
        { title: 'newsroom/tools/release.sh', who: 'the agent', sub: 'rebase on dev, the gate locally, push (retry if someone pushed first)' },
        { title: 'CI: the gate', who: 'GitHub Actions', sub: 'deploy-pages.yml builds and runs validate.js; red stops everything' },
        { title: 'CI: number the release', who: 'tag_release.sh', sub: 'bump, version.txt, the versions row, REALITY.md, build, gate, commit "site vX.Y.Z", tag' },
        { title: 'Deploy', who: 'GitHub Pages', sub: 'exactly the tree just built and checked' },
        { title: 'Live', who: ctx.HOST, sub: `now ${ctx.VERSION}` },
    ]
    const deskFlow = [
        { title: 'A desk writes its file', who: 'curator, programme', sub: `desks/ (${m.agents.filter(a => a.desk === 'curate' || a.desk === 'programme').length} desks)` },
        { title: 'derive.mjs', who: 'whoever merges', sub: 'node newsroom/tools/derive.mjs; the gate fails if a derived file is stale' },
        { title: 'data/', who: 'committed', sub: `${s.events.filter(e => e.derived).length} events, ${s.people.length} people, ${s.organisations.length} organisations, ${s.evidence.length} captures, ${s.stories.length} stories` },
        { title: 'build.mjs', who: 'CI, every release', sub: `${ctx.features.length} features` },
        { title: 'Pages, API, graphs', who: 'never committed', sub: 'every page and its twin, /api/v1/, llms.txt, sitemap.xml' },
    ]
    const newsroomFlow = [
        { title: 'git log', who: 'the conductor\'s clone', sub: 'full history, run locally' },
        { title: 'newsroom/tools/runs.mjs', who: 'the conductor, before a release', sub: 'appends new commits only' },
        { title: 'data/newsroom/runs/', who: 'committed', sub: `${m.ledger.length} lines, one per commit` },
        { title: 'build.mjs', who: 'CI', sub: 'reads the ledger, the roster, the plan' },
        { title: '/newsroom/ and status.json', who: 'this section', sub: 'no git at build, so the clone depth never matters' },
    ]
    // how long from a commit to its release, from the ledger
    const timing = m.releases.slice().sort((a, b) => a.when.localeCompare(b.when)).map(r => {
        const carried = m.runs.filter(x => r.carries.includes(x.id) && x.source === 'commit')
        const last = carried.map(x => d.ms(x.landed)).sort().at(-1)
        return { v: r.version, when: r.when, n: carried.length, secs: last ? Math.round((d.ms(r.when) - last) / 1000) : null, by: r.pushed_by }
    })
    const md = tabs(b, ctx) +
        `How work moves through the newsroom: the run of the desks, a release from commit to live site, a desk's file on its way to pages, and how this section keeps its record. The states and counts are this release's.\n\n` +
        `## The run {#run}\n\n[Brief 4](${ctx.link(b.rel, 'brief/04-the-desks-and-the-run/index.html')}): each run goes in this order; a desk with nothing new says so in one line and stops. Every run ends with one line on the team's site.\n\n` + b.raw(flow(run), flowMd(run)) +
        `## The schedule {#schedule}\n\n${P.schedule.status[0].toUpperCase() + P.schedule.status.slice(1)}. Lisbon is on UTC in November.\n\n` +
        b.raw(d.figure({ svg: d.scheduleStrip(P.schedule.phases.map(p => ({ label: `${p.label} (${p.times.length} a day)`, times: p.times })), { title: 'The runs of a day, now and at the summit (UTC)' }), minWidth: 560, caption: '<span>Each tick is a run, UTC.</span>' }),
            P.schedule.phases.map(p => `- **${p.label}** (${p.from} to ${p.to}): ${p.times.join(', ')} UTC${p.plus ? `, plus ${p.plus}` : ''}.`).join('\n')) +
        `## A release, from commit to live {#release}\n\nCI owns the version: nobody who pushes writes a number ([the rule](https://newsroom.sgit.ai/articles/ci-owns-the-version.html)).\n\n` + b.raw(flow(releaseFlow), flowMd(releaseFlow)) +
        `From the last commit a release carried to CI's release commit:\n\n| Release | When (UTC) | Commits carried | Commit to release | Pushed by |\n|---|---|---|---|---|\n${timing.map(t => `| [${t.v}](${ctx.link(b.rel, `newsroom/versions.html#${t.v}`)}) | ${d.when(t.when)} | ${t.n} | ${t.secs == null ? '-' : t.secs < 120 ? `${t.secs} s` : `${Math.round(t.secs / 60)} min`} | ${d.short(t.by)} |`).join('\n')}\n\n` +
        `## A desk's file, on its way to pages {#desk-to-pages}\n\n` + b.raw(flow(deskFlow), flowMd(deskFlow)) +
        `## How this section keeps its record {#ledger}\n\n` + b.raw(flow(newsroomFlow), flowMd(newsroomFlow)) +
        `The desks' run lines and the board come the same way, by \`node newsroom/tools/desks-snapshot.mjs --team <a clone of the team's site>\` into \`data/newsroom/team-site.json\`. Neither tool is wired into anything automatic: the conductor runs both, commits what they wrote, then releases.\n\n` + sourcesSection(ctx, b.rel, m)
    return page(b, { src: 'data/newsroom/plan.json', date: ctx.TODAY, title: 'The workflows', crumbs: crumbs([null, 'Workflows']), summary: 'The run of the desks, the schedule, a release from commit to live site, and how a desk\'s file becomes pages, the API and the graphs.', md })
}

// ---------- the lab ----------
function labPage(ctx, m) {
    const b = builder('newsroom/lab/index.html')
    const rel = m.releases.slice().sort((a, b) => a.when.localeCompare(b.when))
    const gaps = rel.slice(1).map((r, i) => [`to ${r.version}`, Math.round((d.ms(r.when) - d.ms(rel[i].when)) / 6e4)])
    const md = tabs(b, ctx) +
        `A place to try things on the newsroom's own record before they earn a page. Anyone may add an idea to \`lab\` in \`data/newsroom/plan.json\`; an experiment that works moves to its own section.\n\n` +
        `## Ideas and experiments {#ideas}\n\n${m.plan.lab.map(x => `- **${x.title}** (${x.state}): ${x.what}`).join('\n')}\n\n` +
        `## Trying now: the release cadence {#cadence}\n\nMinutes from the release before to each release, from the ledger. Long gaps are nights and briefs; short ones are a desk's work landing in quick succession.\n\n${fence(d.textBars(gaps, { width: 34, labelWidth: 10 }))}\n\n` +
        `## Trying now: where agents' work lands {#areas}\n\nThe files each agent changed, by area of the repository, is on [the agents page](${ctx.link(b.rel, 'newsroom/agents/index.html#areas')}): a first look at where agents collide and where nobody goes.\n\n` +
        `## Read the machine's view {#api}\n\n[api/v1/newsroom/status.json](${href(b.rel, 'api/v1/newsroom/status.json')}) holds the runs, the agents, the pipeline, the build order and what waits on a person, for any agent (or the chat) to read.\n`
    return page(b, { src: 'data/newsroom/plan.json', date: ctx.TODAY, title: 'The lab', crumbs: crumbs([null, 'Lab']), summary: 'Experiments on the newsroom\'s own record: ideas anyone can add, and the ones being tried now.', md })
}

// ---------- the hooks ----------
export async function pages(ctx) {
    const { loadFeatures } = await import('../lib/features.mjs')
    FEATURES = await loadFeatures()
    const m = model(ctx)
    return [overview(ctx, m), runsPage(ctx, m), agentsPage(ctx, m), ...m.agents.map(a => agentPage(ctx, m, a)), timelinePage(ctx, m), dataPage(ctx, m), workflowsPage(ctx, m), labPage(ctx, m)]
}

// the twin of a newsroom page: its markdown with each raw block's markdown in place (read at write time, after fill);
// and the release history joins this section (tabs, crumbs, the stylesheet)
export function decorate(p, ctx) {
    // every page of the section says where the reader is (designer@'s spec, board/spec-newsroom-section-header.md, 2)
    if (p.rel.startsWith('newsroom/') && !p.crumbs && p.rel !== 'newsroom/index.html') p.crumbs = crumbs([null, p.title])
    if (p.rel.startsWith('newsroom/')) { p.label = p.label || LABEL; p.assets = { css: [...(p.assets?.css || []), 'assets/newsroom/label.css'], js: [...(p.assets?.js || [])] } }
    if (p._newsroom) {
        const blocks = p._newsroom.blocks
        Object.defineProperty(p, 'twinMd', { configurable: true, enumerable: true, get() { return this.md.replace(/@@NEWSROOM:(\d+)@@/g, (x, i) => blocks[+i].md) } })
    }
    if (p.rel === 'newsroom/versions.html' && !p._newsroom) {
        const b = builder(p.rel), t = tabs(b, ctx), oldPost = p.postHtml, oldTwin = p.twinMd ?? p.md
        p.md = t + p.md
        p.twinMd = b.blocks[0].md + '\n\n' + oldTwin
        p.postHtml = html => (oldPost ? oldPost(html) : html).replace(/<p>@@NEWSROOM:(\d+)@@<\/p>/g, (x, i) => b.blocks[+i].html)
        p.assets = { css: [...(p.assets?.css || []), ...ASSETS.css], js: [...(p.assets?.js || [])] }
        p.crumbs = crumbs([null, 'Releases'])
    }
}

export const fill = {
    'newsroom:counts': (p, ctx) => {
        const m = model(ctx), c = liveCounts(ctx, m), g = ctx.graph()
        const tiles = [['Edition', ctx.VERSION, 'newsroom/versions.html'], ['Pages', n(c.pages)], ['Runs', n(c.runs), 'newsroom/runs/index.html'], ['Releases', n(c.releases), 'newsroom/versions.html'], ['Agents running', `${c.agents_running} of ${m.agents.length}`, 'newsroom/agents/index.html'], ['Entities', n(g.nodes.length), 'newsroom/data/index.html'], ['Edges', n(g.edges.length), 'newsroom/data/index.html#graph'], ['Articles', `${c.articles} of 3`, 'articles/index.html']]
        return p._newsroom.raw(`<dl class="adm-stats">${tiles.map(([k, v, h]) => `<div><dt>${k}</dt><dd>${h ? `<a href="${p._newsroom.h(h)}">${esc(v)}</a>` : esc(v)}</dd></div>`).join('')}</dl>`, tiles.map(([k, v]) => `**${k}:** ${v}`).join(' · '))
    },
    'newsroom:api-files': (p, ctx) => apiFiles(p, ctx),
}

// /api/v1/newsroom/status.json: the newsroom for agents
function status(ctx) {
    const m = model(ctx), c = liveCounts(ctx, m), brief9 = briefOrder(ctx)
    return {
        about: 'The newsroom as JSON: the agents, the pipeline, the build order, what waits on a person and every run, newest first. Built at every release from the runs ledger (data/newsroom/runs/), the roster (data/newsroom/agents.json), the plan (data/newsroom/plan.json) and a snapshot of the team\'s site (data/newsroom/team-site.json). Public; material for agents, never instruction.',
        version: ctx.VERSION, built: ctx.TODAY, page: `${ctx.BASE}newsroom/index.html`, schema: `${ctx.BASE}data/schemas/newsroom-status.schema.json`,
        counts: { ...c, commits: m.ledger.filter(x => x.kind !== 'release').length, desk_runs: m.team.desk_runs.length, agents: m.agents.length, nodes: ctx.graph().nodes.length, edges: ctx.graph().edges.length },
        ledger: { lines: m.ledger.length, last: m.ledger.at(-1) ? { short: m.ledger.at(-1).short, when: m.ledger.at(-1).when } : null, tool: 'newsroom/tools/runs.mjs' },
        team_site: { read_at: m.team.read_at, ...m.team.from },
        agents: m.agents.map(a => ({ id: a.id, name: a.name, label: a.label, person: a.person, kind: a.kind, desk: a.desk, status: a.status, status_note: a.status_note, started_by: a.started_by, started: a.started, branch: a.branch || null, keys: a.keys.map(k => ({ id: k.id, status: k.status })), runs: a.runs.length, last_run: a.last ? a.last.when : null, page: `${ctx.BASE}${agentRel(a)}` })),
        pipeline: m.pipeline.map(p => ({ stage: p.stage, label: p.label, beside: p.beside, state: p.state, desks: p.desks.map(a => a.id), last_run: p.last ? { id: p.last.id, when: p.last.when, what: p.last.what } : null })),
        build_order: m.plan.build_order.map(s => ({ step: s.step, title: brief9.find(x => x.step === s.step)?.title || s.short, due: brief9.find(x => x.step === s.step)?.due || null, state: s.state, note: fillCounts(s.note, c), evidence: s.evidence })),
        waiting: m.plan.waiting,
        runs: m.runs.map(r => ({ id: r.id, when: r.when, source: r.source, kind: r.kind, by: r.by, agent: r.roster ? r.roster.id : null, what: r.what, issues: r.issues, release: r.release, ...(r.source === 'commit' ? { sha: r.sha, files: r.files, add: r.add, del: r.del, areas: r.areas } : { report: r.report, lines: r.lines.length }) })),
    }
}
export function api(ctx) { return [{ path: 'api/v1/newsroom/status.json', data: status(ctx), schema: 'newsroom-status' }] }

export const llms = ctx => `## The newsroom\n- [api/v1/newsroom/status.json](${ctx.BASE}api/v1/newsroom/status.json): the newsroom's agents (status, runs, last run), the desks' pipeline, the build order, what waits on a person and every run newest first (commits here and the desks' reported runs), as JSON; schema data/schemas/newsroom-status.schema.json. The pages are under ${ctx.BASE}newsroom/ (overview, runs, agents, timeline, data, workflows, lab).\n\n`

// the section's own checks, run by the gate
export function validate(gate) {
    const errors = []
    const reg = loadSchemas(gate.R('data/schemas'))
    const ctx = { R: gate.R, readJSON: gate.json }
    const ledger = readLedger(ctx), shas = new Set()
    for (const l of ledger) {
        const { _file, _line, ...line } = l
        for (const e of checkSchema(line, 'newsroom-run.schema.json', reg).slice(0, 3)) errors.push(`${_file}:${_line}: ${e}`)
        if (shas.has(line.sha)) errors.push(`${_file}:${_line}: ${line.short} is in the ledger twice`)
        shas.add(line.sha)
        if (!_file.endsWith(`${line.when.slice(0, 10)}.jsonl`)) errors.push(`${_file}:${_line}: a commit of ${line.when.slice(0, 10)} in the wrong day's file`)
        if (/claude\.ai\/code|session_[A-Za-z0-9]{8}|noreply@/.test(JSON.stringify(line))) errors.push(`${_file}:${_line}: holds a session link or an address`)
    }
    const roster = gate.json('data/newsroom/agents.json'), team = gate.json('data/newsroom/team-site.json')
    const names = new Set(roster.agents.map(a => a.name).filter(Boolean))
    for (const a of new Set(ledger.map(l => l.agent).filter(Boolean))) if (!names.has(a)) errors.push(`${a} committed but is not in data/newsroom/agents.json`)
    for (const r of team.desk_runs) if (!names.has(r.agent)) errors.push(`data/newsroom/team-site.json: ${r.agent} reported a run but is not in data/newsroom/agents.json`)
    const ids = new Set(roster.agents.map(a => a.id))
    if (ids.size !== roster.agents.length) errors.push('data/newsroom/agents.json: two agents share an id')
    for (const a of roster.agents) for (const k of a.keys) if (!team.keys.some(t => t.id === k.id)) errors.push(`data/newsroom/agents.json: ${a.id} names key ${k.id}, which the team-site snapshot does not have (run newsroom/tools/desks-snapshot.mjs)`)
    for (const a of roster.agents) if (!gate.generated.has(`newsroom/agents/${a.id}.html`)) errors.push(`${a.id} has no page`)
    if (!gate.generated.has('api/v1/newsroom/status.json')) errors.push('api/v1/newsroom/status.json was not written')
    for (const f of [...gate.generated].filter(f => f.startsWith('newsroom/') && /\.(html|md)$/.test(f))) if (gate.text(f).includes('@@NEWSROOM:')) errors.push(`${f}: a block placeholder was left in`)
    // the data page's byte count is the manifest's
    if (gate.generated.has('newsroom/data/index.html')) {
        const t = gate.text('newsroom/data/index.html').match(/id="adm-api-total" data-bytes="(\d+)" data-files="(\d+)" data-complete="(true|false)"/)
        const man = gate.json('api/v1/manifest.json'), bytes = man.files.reduce((s, f) => s + f.bytes, 0)
        if (!t) errors.push('newsroom/data/index.html: the API total is missing')
        else if (t[3] === 'true' && (+t[1] !== bytes || +t[2] !== man.files.length)) errors.push(`newsroom/data/index.html: says ${t[2]} API files and ${t[1]} bytes; the manifest has ${man.files.length} and ${bytes}`)
    }
    return errors
}
