// The explainer of the whole agentic system, /agentic-system/ (Dinis, 15 November 2026: "a very good way to explain the
// agentic system behind the flow ... this is powered by AgentiCCells, because we are implementing here what we sell
// there. Provide the guidance of how everything fits together"). The prose is content/viz/agentic-system.md; this feature
// fills its markers with what the record says at this release: the numbers, the six layers, every agent with a live key
// and its face, the last 24 hours, the policies, the keys and site identities, the lanes, the graph, the two case studies
// and the AgentiCCells table. Words: assets/viz/system.json; markup: assets/viz/system.tmpl.
// By viz.places@PrompTugal.dinis, 15 November 2026 (board/briefs/2026-11-15-show-the-power.md).
import fs from 'node:fs'
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'
import { figure, head, tmpl, fill as tf, xesc as X } from './viz-cast.mjs'
import { record, roleOf, short, statusOf, asksOf, moodOf, runsOf, hm, dm } from './viz-record.mjs'
import { places, teamOf, newsroomRel, W } from './viz-agents.mjs'
import { history } from './viz-newsroom.mjs'

export const order = 97
const REL = 'agentic-system/index.html', ST = 'assets/viz/system.tmpl'
let COPY = null
const copy = ctx => COPY || (COPY = ctx.readJSON('assets/viz/system.json'))
const count = (ctx, dir, re = /./) => { let n = 0; const walk = d => { try { for (const f of fs.readdirSync(ctx.R(d), { withFileTypes: true })) { if (f.isDirectory()) walk(`${d}/${f.name}`); else if (re.test(f.name)) n++ } } catch {} }; walk(dir); return n }
const MOOD_RANK = { happy: 0, stressed: 1, worried: 2, unhappy: 3 }
const GROUP_COLOURS = { conductors: '#b5471b', places: '#1f5f3f', show: '#b8860b', site: '#3d7a3a', guards: '#44508f', newsroom: '#6f4a9a' }

let FACTS = null
function facts(ctx) {
    if (FACTS) return FACTS
    const R = record(ctx), C = copy(ctx)
    const keys = (R.keys.keys || [])
    const agentKeys = keys.filter(k => k.kind !== 'site' && !/^site\./.test(k.id || ''))
    const live = agentKeys.filter(k => k.status !== 'superseded' && /@promptugal\.dinis$/i.test(k.agent || ''))
    const names = [...new Set(live.map(k => k.agent.toLowerCase()))]
    const day = R.now - 24 * 3600e3
    const recent = R.commits.filter(c => c.t > day)
    const agents = names.map(a => {
        const role = roleOf(a), list = R.byAgent.get(a) || [], last = list[list.length - 1], s = statusOf(ctx, role)
        const group = C.groups.find(g => new RegExp(g.match).test(role))
        const place = places(ctx).find(p => p.agent.toLowerCase() === a)
        return { agent: a, role, group: group.id, mood: moodOf(last && last.t, R.now, asksOf(s).length), last, place, state: s && s.state }
    }).sort((x, y) => (MOOD_RANK[x.mood] - MOOD_RANK[y.mood]) || x.role.localeCompare(y.role))
    let policies = {}
    try { policies = ctx.readJSON('board/abp/policies.json') } catch {}
    let sites = []
    try { sites = checkSites(ctx.ROOT) } catch {}
    let inbox = {}
    try { inbox = ctx.readJSON('board/inbox.json') } catch {}
    const runs = { count: 0, breaches: 0 }
    try { for (const d of fs.readdirSync(ctx.R('board/runs'))) { const r = runsOf(ctx, d); runs.count += r.count; runs.breaches += r.breaches } } catch {}
    const g = ctx.graph ? ctx.graph() : { nodes: [], edges: [] }
    const types = {}
    for (const n of g.nodes) types[n.type] = (types[n.type] || 0) + 1
    const versions = [...R.releases.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    FACTS = {
        agents, n_agents: agents.length, active: agents.filter(a => a.last && a.last.t > day).length, commits: recent.length, recent,
        releases: R.nReleases, version: versions[versions.length - 1] || ctx.VERSION, pages: (ctx.pages || []).length,
        places: places(ctx).length, guidance: count(ctx, 'board/guidance', /\.md$/), briefs: count(ctx, 'board/briefs', /\.md$/),
        status: count(ctx, 'board/team', /^status\.json$/), runs: runs.count, breaches: runs.breaches, board: count(ctx, 'board'),
        policy: { version: policies.version || '?', mode: policies.mode || '?', core: (policies.core || []).length, roles: Object.keys(policies.roles || {}).length },
        keys: { active: live.length, all_active: agentKeys.filter(k => k.status !== 'superseded').length, superseded: agentKeys.filter(k => k.status === 'superseded').length, site: keys.filter(k => k.kind === 'site').length },
        valid: sites.filter(s => s.signature === 'valid').length,
        inboxes: count(ctx, 'board/inboxes', /\.json$/), lanes: (inbox.lanes || []).length,
        nodes: g.nodes.length, edges: g.edges.length, types,
        hold: fs.existsSync(ctx.R('board/HOLD.md')),
    }
    return FACTS
}

const slot = (name, twin) => `::: vz-slot-${name}\n${twin}\n:::`

function tilesHtml(ctx) {
    const T = tmpl(ctx, ST), F = facts(ctx), C = copy(ctx)
    const v = { agents: F.n_agents, active: F.active, commits: F.commits, releases: F.releases, places: F.places, pages: F.pages }
    return tf(T.tiles, { items: C.tiles.map(t => tf(T.tile, { n: X(v[t.k]), t: X(t.t) })).join('') })
}

function vars(F) {
    return { guidance: F.guidance, briefs: F.briefs, agents: F.n_agents, active: F.active, commits: F.commits, status: F.status, runs: F.runs, releases: F.releases, version: F.version, pages: F.pages, places: F.places }
}

function systemHtml(ctx) {
    const T = tmpl(ctx, ST), F = facts(ctx), C = copy(ctx), V = vars(F)
    const headsOf = (filter, max = 40) => F.agents.filter(filter).slice(0, max).map(a => head(ctx, { role: a.role, accent: a.place && a.place.accent, mood: a.mood, size: 24, title: short(a.agent) })).join('')
    const heads = { route: headsOf(a => a.group === 'conductors'), agents: headsOf(a => a.group !== 'conductors') }
    const layers = C.layers.map((l, i) => tf(T.layer, { id: l.id, n: i + 1, h: X(l.h), t: X(W(l.t, V)), heads: heads[l.id] || '', where: X(l.where) }) + (i < C.arrows.length ? tf(T.arrow, { t: X(C.arrows[i]) }) : '')).join('')
    const S = C.side
    const box = (k, n, v) => tf(T.side, { h: X(S[k].h), n: X(n), unit: X(S[k].unit), lines: S[k].lines.map(t => tf(T.li, { t: X(W(t, v)) })).join('') })
    const side = box('policies', F.policy.core, { version: F.policy.version, mode: F.policy.mode, roles: F.policy.roles, runs: F.runs, breaches: F.breaches }) +
        box('keys', F.keys.all_active, { site: F.keys.site, valid: F.valid, places: F.places, superseded: F.keys.superseded }) +
        box('lanes', F.inboxes, { lanes: F.lanes })
    return tf(T.system, { layers, side })
}

function castHtml(ctx) {
    const T = tmpl(ctx, ST), F = facts(ctx), C = copy(ctx)
    return C.groups.map(g => {
        const list = F.agents.filter(a => a.group === g.id)
        if (!list.length) return ''
        return tf(T.group, { h: X(g.h), n: list.length, what: X(g.what), items: list.map(a => {
            const v = { mood: a.mood, fig: figure(ctx, { role: a.role, accent: a.place && a.place.accent, mood: a.mood, size: 64, title: short(a.agent) }), who: X(short(a.agent)), state: X(C.member_state[a.mood]), title: X(a.state ? String(a.state).slice(0, 200) : short(a.agent)) }
            return a.place ? tf(T.member, { ...v, href: X(ctx.link(REL, `${a.place.path}index.html`).replace(/\.md$/, '.html') + '#agents') }) : tf(T['member-plain'], v)
        }).join('') })
    }).join('')
}

function dayHtml(ctx) {
    const T = tmpl(ctx, ST), F = facts(ctx), C = copy(ctx), R = record(ctx)
    const from = Math.floor((R.now - 24 * 3600e3) / 3600e3) * 3600e3 + 3600e3, n = 24
    const groupOf = new Map(F.agents.map(a => [a.agent, a.group]))
    const grid = Array.from({ length: n }, () => ({}))
    for (const c of F.recent) { const i = Math.floor((c.t - from) / 3600e3); if (i < 0 || i >= n) continue; const g = groupOf.get(c.agent) || 'newsroom'; grid[i][g] = (grid[i][g] || 0) + 1 }
    const max = Math.max(1, ...grid.map(h => Object.values(h).reduce((s, v) => s + v, 0)))
    const w = 1000, h = 240, pl = 36, pb = 26, bw = (w - pl) / n
    let body = ''
    for (const v of [0, Math.round(max / 2), max]) body += `<text x="${pl - 6}" y="${(h - pb - (h - pb - 10) * v / max + 4).toFixed(1)}" class="vz-tick" text-anchor="end">${v}</text>`
    grid.forEach((hr, i) => {
        let y = h - pb
        for (const g of C.groups.map(g => g.id)) {
            const k = hr[g] || 0
            if (!k) continue
            const hh = (h - pb - 10) * k / max
            y -= hh
            body += `<rect x="${(pl + i * bw + 2).toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 4).toFixed(1)}" height="${hh.toFixed(1)}" fill="${GROUP_COLOURS[g]}"><title>${X(`${hm(from + i * 3600e3)} UTC, ${C.groups.find(x => x.id === g).h}: ${k}`)}</title></rect>`
        }
        if (i % 3 === 0) body += `<text x="${(pl + i * bw + bw / 2).toFixed(1)}" y="${h - 8}" class="vz-tick" text-anchor="middle">${hm(from + i * 3600e3)}</text>`
    })
    const legend = X(W(C.day_legend, { from: `${dm(from)} ${hm(from)}`, to: `${dm(from + n * 3600e3)} ${hm(from + n * 3600e3)}`, total: F.commits })) + ' ' + C.groups.map(g => tf(T.key, { c: GROUP_COLOURS[g.id], t: X(g.h) })).join('')
    return tf(T.day, { w, h, aria: X(C.day_aria), body, legend })
}

function casesHtml(ctx) {
    const T = tmpl(ctx, ST), C = copy(ctx)
    return tf(T.cases, { items: places(ctx).filter(p => p.id === 'loule' || p.id === 'faro').map(p => {
        const d = p.data || {}, H = history(ctx, p), team = teamOf(ctx, p), me = team.find(a => a.own)
        return tf(T.case, {
            href: X(ctx.link(REL, newsroomRel(p)).replace(/\.md$/, '.html')), accent: X(p.accent), name: X(p.name),
            fig: figure(ctx, { role: `place.${p.id}`, accent: p.accent, mood: me ? me.mood : 'happy', size: 80, title: `place.${p.id}@` }),
            line: X(W(C.case_line, { news: (d.ai_news || []).length, map: (d.ai_map || []).length, sources: (d.sources || []).length, releases: new Set(H.map(h => h.release).filter(Boolean)).size })),
            go: X(C.case_go),
        })
    }).join('') })
}

const twinList = (ctx, F) => F.agents.map(a => `- ${ctx.md.cell(short(a.agent))}: ${copy(ctx).member_state[a.mood]}`).join('\n')

export const fill = {
    'viz:numbers': (page, ctx) => { const F = facts(ctx), C = copy(ctx), v = { agents: F.n_agents, active: F.active, commits: F.commits, releases: F.releases, places: F.places, pages: F.pages }; return slot('numbers', C.tiles.map(t => `- **${v[t.k]}** ${t.t}`).join('\n')) },
    'viz:system': (page, ctx) => { const F = facts(ctx), C = copy(ctx), V = vars(F); return slot('system', C.layers.map((l, i) => `${i + 1}. **${l.h}.** ${W(l.t, V)} (${l.where})`).join('\n')) },
    'viz:cast': (page, ctx) => slot('cast', twinList(ctx, facts(ctx))),
    'viz:day': (page, ctx) => { const F = facts(ctx); return slot('day', W(copy(ctx).day_legend, { from: '', to: '', total: F.commits })) },
    'viz:cases': (page, ctx) => slot('cases', places(ctx).filter(p => p.id === 'loule' || p.id === 'faro').map(p => `- [The newsroom of ${p.name}](${ctx.link(page.rel, newsroomRel(p))})`).join('\n')),
    'viz:policies': (page, ctx) => { const F = facts(ctx); return W(copy(ctx).policies_md, { version: F.policy.version, mode: F.policy.mode, core: F.policy.core, roles: F.policy.roles, runs: F.runs, breaches: F.breaches }) },
    'viz:keys': (page, ctx) => { const F = facts(ctx); return W(copy(ctx).keys_md, { active: F.keys.all_active, superseded: F.keys.superseded, site: F.keys.site, valid: F.valid, places: F.places }) },
    'viz:lanes': (page, ctx) => { const F = facts(ctx); return W(copy(ctx).lanes_md, { inboxes: F.inboxes, lanes: F.lanes }) },
    'viz:graph': (page, ctx) => { const F = facts(ctx); return W(copy(ctx).graph_md, { nodes: F.nodes, edges: F.edges, types: Object.entries(F.types).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${v} ${k}`).join(', ') }) },
    'viz:cells': (page, ctx) => { const F = facts(ctx), C = copy(ctx), v = { agents: F.n_agents, guidance: F.guidance, active_keys: F.keys.all_active, board: F.board, hold: C.hold[F.hold ? 'yes' : 'no'], releases: F.releases }; return `${C.cells_head}\n${C.cells.map(([a, b]) => `| ${a} | ${W(b, v)} |`).join('\n')}` },
}

export function decorate(page, ctx) {
    if (page.rel !== REL) return
    page.type = 'site'
    const prev = page.postHtml
    page.postHtml = html => {
        let h = prev ? prev(html) : html
        const parts = { numbers: tilesHtml, system: systemHtml, cast: castHtml, day: dayHtml, cases: casesHtml }
        for (const [k, fn] of Object.entries(parts)) h = h.replace(new RegExp(`<div class="vz-slot-${k}">[\\s\\S]*?</div>`), () => fn(ctx))
        return `<div class="vz-explainer">${h}</div>`
    }
}

export function api(ctx) {
    const F = facts(ctx)
    return [{ path: 'api/v1/viz/system.json', schema: null, data: {
        about: 'The agentic system behind PrompTugal.news at this release, from the record (viz.places@PrompTugal.dinis); the page is /agentic-system/',
        version: ctx.VERSION, as_of: new Date(record(ctx).now).toISOString(),
        counts: { agents: F.n_agents, active_24h: F.active, commits_24h: F.commits, releases: F.releases, pages: F.pages, places: F.places, guidance: F.guidance, briefs: F.briefs, status_files: F.status, run_reports: F.runs, breaches: F.breaches, board_files: F.board, inboxes: F.inboxes, conductor_lanes: F.lanes, graph_nodes: F.nodes, graph_edges: F.edges },
        policy: F.policy, keys: { ...F.keys, place_files_valid: F.valid }, hold: F.hold,
        agents: F.agents.map(a => ({ agent: a.agent, group: a.group, mood: a.mood, last_commit: a.last ? a.last.when : null, place: a.place ? a.place.id : null })),
    } }]
}

export function validate(gate) {
    try { const t = gate.text(REL); return ['vz-tiles', 'vz-sys', 'vz-group', 'vz-day', 'vz-cases'].filter(c => !t.includes(`class="${c}"`)).map(c => `viz-system: ${REL} lacks its ${c}`) } catch { return [`viz-system: missing ${REL}`] }
}
