// Dinis's dashboard (board/the-team-setup.md, "The dashboard"): /newsroom/dashboard/ (its words:
// content/newsroom/dashboard.md) and api/v1/newsroom/dashboard.json. A LETS cycle at every build:
//   Load       board/schedule.json, board/team/*/status.json, board/HOLD.md, the story board's model (data/stories/),
//              and the last 24 hours of git log before HEAD (each commit's time and its Agent:, For: and To: trailers)
//   Extract    per agent: its schedule, its own words (focus, state, done, next, asks), its wakes, its commits by hour
//   Transform  what waits on Dinis (oldest first), one row per agent, the wake grid (agents by hour), the hand-offs
//   Save       the model as the API file; the page fills its markers from it. The clock and the next wakes run live
//              in the browser (assets/newsroom/dashboard.js, from the API).
// Time is HEAD's commit time, so the same commit always builds the same page.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
export const order = 74
const REL = 'newsroom/dashboard/index.html', API = 'api/v1/newsroom/dashboard.json'
const CELL = { ok: '●', partial: '◐', idle: '○', failed: '✕', held: 'H' }
const short = a => String(a || '').split('@')[0]

function gitLog(ROOT) {
    try {
        const out = execFileSync('git', ['log', '-n', '600', '--format=%H%x1f%cI%x1f%(trailers:key=Agent,valueonly,separator=%x2c)%x1f%(trailers:key=For,valueonly,separator=%x2c)%x1f%(trailers:key=To,valueonly,separator=%x2c)%x1e'], { cwd: ROOT, maxBuffer: 32 << 20 }).toString()
        return out.split('\x1e').map(l => l.trim()).filter(Boolean).map(l => { const [sha, at, agent, forr, to] = l.split('\x1f'); return { sha: sha.slice(0, 7), at: new Date(at), agent: (agent || '').trim(), for: (forr || '').split(',').map(s => s.trim()).filter(Boolean), to: (to || '').split(',').map(s => s.trim()).filter(Boolean) } })
    } catch { return [] }
}

let cached = null
export function model(ctx) {
    if (cached) return cached
    const read = p => { try { return JSON.parse(fs.readFileSync(ctx.R(p), 'utf8')) } catch { return null } }
    const schedule = read('board/schedule.json') || { tasks: [] }
    const teamDir = ctx.R('board/team')
    const roles = fs.existsSync(teamDir) ? fs.readdirSync(teamDir).filter(r => fs.existsSync(path.join(teamDir, r, 'status.json'))).sort() : []
    const status = Object.fromEntries(roles.map(r => [r, read(`board/team/${r}/status.json`)]))
    const holdPath = ctx.R('board/HOLD.md'), hold = fs.existsSync(holdPath) ? fs.readFileSync(holdPath, 'utf8').trim() : null
    const log = gitLog(ctx.ROOT), now = log[0]?.at || new Date(ctx.TODAY + 'T12:00:00Z')
    const since = new Date(now - 24 * 3600e3), recent = log.filter(c => c.at > since)
    const hours = Array.from({ length: 24 }, (_, i) => new Date(Math.floor(now / 3600e3) * 3600e3 - (23 - i) * 3600e3))
    const names = [...new Set([...schedule.tasks.map(t => short(t.agent)), ...roles])].sort()
    const agents = names.map(role => {
        const s = status[role] || {}, task = schedule.tasks.find(t => short(t.agent) === role) || null
        const wakes = (s.wakes || []).map(w => ({ ...w, t: new Date(String(w.started || '').replace(/Z?$/, 'Z')) })).filter(w => !isNaN(w.t))
        const mine = recent.filter(c => short(c.agent) === role)
        const grid = hours.map(h => { const e = new Date(+h + 3600e3), w = wakes.filter(x => x.t >= h && x.t < e).pop(); return w ? (CELL[w.outcome] || '●') : mine.some(c => c.at >= h && c.at < e) ? '•' : '·' })
        const updated = s.updated ? new Date(String(s.updated).replace(/Z?$/, 'Z')) : null
        return {
            role, agent: s.agent || task?.agent || `${role}@PrompTugal.dinis`, focus: s.focus || null, state: s.state || null,
            minute: task ? task.minute : null, scheduled: !!task && task.state === 'enabled', updated: s.updated || null,
            stale: !!task && task.state === 'enabled' && (!updated || now - updated > 2 * 3600e3 + 15 * 60e3),
            last_wake: wakes.length ? { started: wakes[wakes.length - 1].started, outcome: wakes[wakes.length - 1].outcome, release: wakes[wakes.length - 1].release || null, line: wakes[wakes.length - 1].line || null } : null,
            done: s.done || [], next: s.next || [], asks: s.asks || [], commits_24h: mine.length, grid: grid.join(''),
        }
    })
    const asks = agents.flatMap(a => a.asks.map(q => ({ from: a.role, since: a.updated, ask: q })))
    for (const st of ctx.store.stories.filter(x => x.status === 'waits-on-dinis')) asks.push({ from: 'story board', since: (st.history || []).slice(-1)[0]?.at || null, ask: `${st.id}: ${st.needs?.question || st.title}` })
    asks.sort((a, b) => String(a.since || '').localeCompare(String(b.since || '')))
    const hand = {}
    for (const c of recent) for (const to of [...c.for, ...c.to]) { const k = `${short(c.agent) || 'CI'}→${short(to) || to}`; hand[k] = (hand[k] || 0) + 1 }
    cached = {
        about: (ctx.content.find(p => p.rel === REL) || { meta: {} }).meta.summary || '',
        built: ctx.VERSION, at: now.toISOString(), hold, asks, agents,
        grid_hours: hours.map(h => h.toISOString().slice(11, 13)), handoffs: Object.entries(hand).map(([k, n]) => ({ from: k.split('→')[0], to: k.split('→')[1], n })).sort((a, b) => b.n - a.n),
        schedule: schedule.tasks,
    }
    return cached
}

const cell = (ctx, s) => ctx.md.cell(String(s ?? ''))
export const fill = {
    'dashboard:now': (p, ctx) => {
        const M = model(ctx)
        const head = `{.facts}\n| | |\n|---|---|\n| **Built** | ${M.at.slice(0, 16).replace('T', ' ')} UTC, ${M.built} |\n| **Hold** | ${M.hold ? `**on**: ${cell(ctx, M.hold.split('\n')[0])}` : 'none'} |\n| **Agents** | ${M.agents.length}, ${M.agents.filter(a => a.scheduled).length} on a schedule, ${M.agents.filter(a => a.stale).length} with a status older than two wakes |`
        return head + '\n\n' + (M.asks.length ? '| Since | From | What |\n|---|---|---|\n' + M.asks.map(a => `| ${cell(ctx, String(a.since || '').slice(0, 16).replace('T', ' '))} | ${cell(ctx, a.from)} | ${cell(ctx, a.ask)} |`).join('\n') : 'Nothing waits on Dinis.')
    },
    'dashboard:agents': (p, ctx) => '| Agent | Minute | Last wake | State | Next | Focus |\n|---|---:|---|---|---|---|\n' + model(ctx).agents.map(a =>
        `| **${a.role}**${a.stale ? ' (stale)' : ''} | ${a.minute ?? ''} | ${a.last_wake ? `${cell(ctx, String(a.last_wake.started).slice(11, 16))} ${cell(ctx, a.last_wake.outcome)}${a.last_wake.release ? `, ${cell(ctx, a.last_wake.release)}` : ''}` : 'none yet'} | ${cell(ctx, a.state)} | ${cell(ctx, a.next[0] || '')} | ${cell(ctx, a.focus)} |`).join('\n'),
    'dashboard:grid': (p, ctx) => {
        const M = model(ctx), w = Math.max(...M.agents.map(a => a.role.length))
        const top = ' '.repeat(w + 1) + M.grid_hours.map((h, i) => i % 3 ? ' ' : h[0]).join('') + '\n' + ' '.repeat(w + 1) + M.grid_hours.map((h, i) => i % 3 ? ' ' : h[1]).join('')
        return '```\n' + top + '\n' + M.agents.map(a => a.role.padEnd(w) + ' ' + a.grid).join('\n') + '\n```'
    },
    'dashboard:handoffs': (p, ctx) => { const H = model(ctx).handoffs; return H.length ? '| From | To | Commits |\n|---|---|---:|\n' + H.map(h => `| ${cell(ctx, h.from)} | ${cell(ctx, h.to)} | ${h.n} |`).join('\n') : 'None in the last 24 hours.' },
    'dashboard:record': (p, ctx) => '| Agent | Cron | State | Since | Task |\n|---|---|---|---|---|\n' + model(ctx).schedule.map(t => `| ${cell(ctx, short(t.agent))} | \`${cell(ctx, t.cron)}\` | ${cell(ctx, t.state)} | ${cell(ctx, t.since)} | \`${cell(ctx, t.trigger)}\` |`).join('\n'),
    'dashboard:api': (p, ctx) => `[${API}](${ctx.link(REL, API)})`,
}

export function decorate(p) { if (p.rel === REL) p.assets = { css: [...(p.assets?.css || [])], js: [...(p.assets?.js || []), 'assets/newsroom/dashboard.js'] } }
export const api = ctx => [{ path: API, data: model(ctx), schema: null }]
export const llms = ctx => `## The dashboard\n- [newsroom/dashboard/](${ctx.BASE}newsroom/dashboard/index.md): every agent, its schedule, last wake and next step, what waits on Dinis, the wake grid; as data: [${API}](${ctx.BASE}${API}).\n\n`
export function warn(gate) { return gate.json(API).agents.filter(a => a.stale).map(a => `${a.role}: board/team/${a.role}/status.json last updated ${a.updated || 'never'}, older than two of its wakes`) }
