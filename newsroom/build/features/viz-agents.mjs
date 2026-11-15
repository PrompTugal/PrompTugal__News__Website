// The agents behind each place page (Dinis, 15 November 2026: "every one of these sites should show how many agents are
// working; use the characters from the book I created, the mini infographics, even the happy faces, to show who is working
// on what, all powered by reality"). On every place page (portugal/, algarve/, algarve/<town>/): how many agents work on
// it, each drawn in the book's construction with its mood, what it is doing now (its status.json), its last commit and
// release, a scorecard from the record, its key, and an "on stage" strip of the hours since the place team started.
// Rebuilt at every release from the record (viz-record.mjs); nothing is typed in by hand. The twin carries the same as a
// list; api/v1/viz/agents.json carries it as data (for the app too). Markup: assets/viz/panel.tmpl; words:
// assets/viz/cast.json. By viz.places@PrompTugal.dinis, 15 November 2026 (board/briefs/2026-11-15-show-the-power.md).
// The place pages are dev.places@'s (features/by-place.mjs); this feature only adds to them, through decorate.
import { figure, head, cast, tmpl, fill, xesc as X } from './viz-cast.mjs'
import { record, agentsFor, short, ago, hm, dm, hourWindow } from './viz-record.mjs'

export const order = 95
export const assets = { css: ['assets/viz/viz.css'] }

const PT = 'assets/viz/panel.tmpl'
export const W = (s, v = {}) => String(s || '').replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '')
export const moodWord = ctx => Object.fromEntries(cast(ctx).moods.map(m => [m.id, m.word]))
export const trim = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/[\s,;:.]+\S*$/, '') + '…' : s }
export const noPrefix = s => String(s || '').replace(/^[a-z][a-z0-9.\-]*@[A-Za-z0-9.\-]+\s*[:,]\s*/, '')
export const noDash = s => String(s || '').replace(/\s[—–]\s/g, ', ').replace(/[—–]/g, '-')
export const atWork = team => team.filter(a => a.mood === 'happy' || a.mood === 'stressed').length

let PLACES = null
export function places(ctx) {
    if (PLACES) return PLACES
    PLACES = ctx.readJSON('data/by-place/places.json').places.map(p => {
        let d = {}
        try { d = ctx.readJSON(`data/by-place/${p.id}.json`) || {} } catch {}
        const accent = d.look && /^#[0-9a-f]{6}$/i.test(d.look.accent || '') ? d.look.accent : '#1f5f3f'
        return { id: p.id, name: p.name, path: p.path, agent: p.agent, kind: p.kind, parent: p.parent, accent, status: d.status || 'stub', identity: d.identity || null, data: d }
    })
    return PLACES
}
const placeOfRel = (ctx, rel) => places(ctx).find(p => `${p.path}index.html` === rel)

const TEAMS = new Map()
export function teamOf(ctx, p) {
    if (!TEAMS.has(p.id)) TEAMS.set(p.id, agentsFor(ctx, p))
    return TEAMS.get(p.id)
}

export const jobLine = (ctx, a) => a.own ? W(cast(ctx).copy.place_job, { job: a.jobs[0] }) : a.jobs.join('; ')
const asof = R => `${dm(R.now)}, ${hm(R.now)}`

function twin(ctx, p, team) {
    const R = record(ctx), M = moodWord(ctx), C = cast(ctx).copy, c = s => ctx.md.cell(String(s ?? ''))
    let md = `## The agents behind this page {#agents}\n\n{.viz-lede}\n${W(C.twin_lede, { count: team.length, name: c(p.name), now: atWork(team), asof: asof(R) })}\n\n::: viz-agents\n`
    md += team.map(a => '- ' + W(C.twin_item, {
        who: c(short(a.agent)), model: a.model ? ` (${c(a.model)})` : '', mood: c(M[a.mood]), job: c(jobLine(ctx, a)),
        last: a.last ? W(C.twin_last, { ago: ago(a.ageMin), subject: c(trim(noDash(noPrefix(a.last.subject)), 140)), release: a.last.release ? ` (${a.last.release})` : '' }) : C.no_commit,
        state: a.status && a.status.state ? W(C.twin_state, { state: c(trim(noDash(a.status.state), 160)) }) : '',
    })).join('\n')
    return md + `\n:::\n\n`
}

export const repoCommit = (ctx, sha) => `${String(ctx.REPO || 'https://github.com/PrompTugal/PrompTugal__News__Website').replace(/\/$/, '')}/commit/${sha}`

export function card(ctx, p, a) {
    const T = tmpl(ctx, PT), M = moodWord(ctx), C = cast(ctx).copy, Lb = C.labels, S = C.score
    const st = a.status || {}
    const stale = st.updated && a.last && (Date.parse(st.updated) || 0) < a.last.t - 6 * 3600e3
    const row = (cls, label, text) => fill(T.row, { cls, label: X(label), text: X(text) })
    let rows = ''
    if (st.state) rows += row('now', stale ? Lb.said : Lb.now, trim(noDash(st.state), 190))
    if (st.next) rows += row('next', Lb.next, trim(noDash(st.next), 150))
    if (st.asks) rows += row('ask', Lb.ask, W(C.ask, { n: st.asks }))
    rows += a.last ? fill(T['row-link'], { cls: 'last', label: X(Lb.last), href: X(repoCommit(ctx, a.last.sha)), text: X(trim(noDash(noPrefix(a.last.subject)), 130)), rel: a.last.release ? fill(T.rel, { v: X(a.last.release) }) : '' }) : row('last', Lb.last, Lb.none)
    const score = [[S.first, a.first ? (dm(a.first) === dm(record(ctx).now) ? hm(a.first) : dm(a.first)) : '·'], [S.here, a.here], [S.total, a.total], [S.releases, a.releases], [S.runs, a.runs.count], [S.tools, a.runs.tool_calls || '·'], [S.web, a.runs.web || '·']]
    return fill(T.card, {
        mood: a.mood, own: a.own ? ' vz-own' : '',
        fig: figure(ctx, { role: a.role, accent: p.accent, mood: a.mood, size: 92, title: `${short(a.agent)}, ${M[a.mood]}` }),
        who: X(short(a.agent)),
        role: X((a.own ? C.place_role : a.stages.map(s => C.stages[s] || s).join(', ')) + (a.model ? ` · ${a.model}` : '')),
        moodword: X(M[a.mood] + (a.ageMin != null ? ` · ${ago(a.ageMin)}` : '')),
        job: X(trim(jobLine(ctx, a), 170)), rows,
        score: score.map(([k, v]) => fill(T.score, { k: X(k), v: X(v) })).join(''),
        key: a.key ? fill(T.key, { id: X(a.key.id), fp: X(a.key.fp || '') }) : T.nokey,
    })
}

export function onStage(ctx, p, team) {
    const T = tmpl(ctx, PT), R = record(ctx), { from, n } = hourWindow(R), C = cast(ctx).copy
    const max = Math.max(1, ...team.flatMap(a => a.hours))
    const hours = Array.from({ length: n + 1 }, (_, i) => hm(from + i * 3600e3))
    const step = n > 16 ? Math.ceil(n / 8) : 2
    return fill(T.stage, {
        from: `${dm(from)}, ${hours[0]}`, n,
        rows: team.map(a => fill(T['stage-row'], {
            head: head(ctx, { role: a.role, accent: p.accent, mood: a.mood, size: 20 }), who: X(short(a.agent)),
            cells: a.hours.map((k, i) => fill(T.cell, { k: k ? (0.25 + 0.75 * k / max).toFixed(2) : 0, title: X(W(C.cell_title, { who: short(a.agent), k, from: hours[i], to: hours[i + 1] })) })).join(''),
        })).join(''),
        axis: hours.slice(0, n).map((h, i) => fill(T.tick, { t: i % step === 0 ? X(h) : '' })).join(''),
    })
}

// the newsroom page of a place, once viz-newsroom.mjs makes it
export const newsroomRel = p => `${p.path}newsroom/index.html`
const rel2 = (ctx, from, to) => ctx.link(from, to).replace(/\.md$/, '.html')

function panel(ctx, p, team) {
    const T = tmpl(ctx, PT), R = record(ctx)
    const hasNewsroom = ctx.pages && ctx.pages.some(x => x.rel === newsroomRel(p))
    return fill(T.panel, {
        accent: X(p.accent), count: team.length, name: X(p.name), now: atWork(team), asof: X(asof(R)),
        newsroom: hasNewsroom ? fill(T['newsroom-link'], { href: X(rel2(ctx, `${p.path}index.html`, newsroomRel(p))), name: X(p.name), ex: X(rel2(ctx, `${p.path}index.html`, 'agentic-system/index.html')) }) : '',
        cards: team.map(a => card(ctx, p, a)).join(''),
        stage: onStage(ctx, p, team),
        how: fill(T.how, { moods: cast(ctx).moods.map(m => fill(T.mood, { head: head(ctx, { role: 'plain', mood: m.id, size: 18 }), word: X(m.word), rule: X(m.rule) })).join('') }),
    })
}

function strip(ctx, p, team) {
    const T = tmpl(ctx, PT)
    return fill(T.strip, { heads: team.slice(0, 9).map(a => head(ctx, { role: a.role, accent: p.accent, mood: a.mood, size: 22, title: short(a.agent) })).join(''), count: team.length, now: atWork(team) })
}

export function decorate(page, ctx) {
    const p = placeOfRel(ctx, page.rel)
    if (!p) return
    const team = teamOf(ctx, p)
    page.md = String(page.md || '') + '\n\n' + twin(ctx, p, team)
    const prev = page.postHtml
    page.postHtml = html => {
        let h = prev ? prev(html) : html
        h = h.replace(/<div class="viz-agents">[\s\S]*?<\/div>/, () => panel(ctx, p, team))
        h = h.replace(/(<p class="bp-meta">[\s\S]*?<\/p>)/, m => m + strip(ctx, p, team))
        return h
    }
}

export function api(ctx) {
    const R = record(ctx), M = moodWord(ctx), out = {}
    for (const p of places(ctx)) {
        out[p.id] = teamOf(ctx, p).map(a => ({
            agent: a.name, place_agent: a.own, model: a.model, jobs: a.jobs, mood: a.mood, mood_word: M[a.mood],
            commits_here: a.here, commits: a.total, releases: a.releases, first_commit: a.first,
            last_commit: a.last ? { when: a.last.when, sha: a.last.sha, subject: noPrefix(a.last.subject), release: a.last.release || null } : null,
            status: a.status, runs: a.runs, key: a.key, hours: a.hours,
        }))
    }
    const { from, n } = hourWindow(R)
    return [{ path: 'api/v1/viz/agents.json', schema: null, data: {
        about: 'The agents behind each PrompTugal.news place page, drawn from the record at this release (viz.places@PrompTugal.dinis). Moods follow the rules in "moods".',
        as_of: new Date(R.now).toISOString(), version: ctx.VERSION, hours_from: new Date(from).toISOString(), hours: n,
        moods: cast(ctx).moods, places: out,
    } }]
}

export function validate(gate) {
    const out = []
    let list
    try { list = JSON.parse(gate.text('data/by-place/places.json')).places } catch { return out }
    for (const p of list) {
        const rel = `${p.path}index.html`
        try { if (!gate.text(rel).includes('class="vz-panel"')) out.push(`viz-agents: ${rel} lacks its agents panel`) } catch {}
    }
    return out
}
