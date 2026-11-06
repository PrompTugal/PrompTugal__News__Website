// What the desks are doing (Dinis, 6 November 2026: "start to visualize the data that is captured by the researcher and
// the data that's mapped by the curator"). A LETS cycle at every build:
//   Load       desks/curator/*.json (each a curator run, as the desk wrote it) and the articles' front matter (story:)
//   Extract    every capture (the researcher's, as the curator mapped it), story candidate, gap sent to the researcher,
//              question sent to the fact-checker, revision and duplicate verdict, with the run that first carried it
//   Transform  one model: the funnel (captures, candidates, articles), each candidate's captures and its article,
//              each capture's beat and the candidates it feeds, the runs over time
//   Save       api/v1/newsroom/desks.json (the model, for agents), and the page /newsroom/desks/, whose words are
//              content/newsroom/desks.md: this file only fills its <!-- desks:* --> markers.
// The researcher's own summaries stay in its vault (41j3e9s9): only what the curator copied into its runs is here.
import fs from 'node:fs'
import { day10 } from '../lib/present.mjs'
export const order = 72
const REL = 'newsroom/desks/index.html', API = 'api/v1/newsroom/desks.json', SVG = '@@DESKS:MAP@@'

let cached = null
function model(ctx) {
    if (cached) return cached
    // Load
    const runs = fs.readdirSync(ctx.R('desks/curator')).filter(f => /^\d{4}-\d{2}-\d{2}-\d{4}\.json$/.test(f)).sort().map(f => `desks/curator/${f}`)
        .map(f => ({ file: f, d: ctx.readJSON(f) }))
    const articles = ctx.content.filter(p => p.rel.startsWith('articles/') && p.meta.story)
        .map(p => ({ story: String(p.meta.story), title: p.meta.title, rel: p.rel, date: day10(p.meta.date) }))
    // Extract and transform
    const captures = new Map(), candidates = new Map(), gaps = new Map(), checks = [], revisions = [], verdicts = {}
    const R = []
    for (const { file, d } of runs) {
        const at = String(d.run || '').slice(0, 17), kind = d.kind || (/\(([^)]*)\)/.exec(d.run || '') || [])[1] || 'map'
        const newCaps = []
        for (const c of d.captures || []) {
            if (!captures.has(c.id)) { captures.set(c.id, { id: c.id, beat: c.beat || 'other', group: c.group || null, source: host(c.source_url), url: c.source_url, names: (c.names || []).length, story: c.is_story !== false, first: at, used_by: [] }); newCaps.push(c.id) }
        }
        const cands = []
        for (const s of d.story_candidates || []) {
            const old = candidates.get(s.id)
            const rests = s.rests_on || s.captures || []
            if (old) { old.last = at; old.seen++; old.title = s.title || old.title; old.beat = s.beat || old.beat; for (const r of rests) if (!old.rests_on.includes(r)) old.rests_on.push(r) }
            else candidates.set(s.id, { id: s.id, title: s.title, beat: s.beat || 'other', kind: s.kind || null, first: at, last: at, seen: 1, revised: 0, rests_on: [...rests], article: null })
            cands.push(s.id)
        }
        for (const r of [...(d.revisions || []), ...(d.revisions_to_the_first_map || [])]) { revisions.push({ at, candidate: r.candidate, change: r.change }); const c = candidates.get(r.candidate); if (c) c.revised++ }
        for (const g of d.gaps_for_the_researcher || []) { const t = typeof g === 'string' ? g : g.what || JSON.stringify(g); if (!gaps.has(t)) gaps.set(t, { text: t, first: at, last: at }); else gaps.get(t).last = at }
        for (const q of [...(d.for_the_fact_checker || []), ...(d.conflicts_for_the_fact_checker || [])]) checks.push({ at, about: q.about || q.candidate || '', what: q.what || q.question || '' })
        for (const x of d.duplicates_and_noise || []) { const v = String(x.verdict || 'noted').split(',')[0].trim(); verdicts[v] = (verdicts[v] || 0) + 1 }
        R.push({ file, at, kind, captures_new: newCaps.length, captures_in_vault: d.covers && d.covers.captures_in_vault || null, candidates: cands.length, gaps: (d.gaps_for_the_researcher || []).length, checks: (d.for_the_fact_checker || d.conflicts_for_the_fact_checker || []).length })
    }
    for (const c of candidates.values()) for (const r of c.rests_on) { const cap = captures.get(r); if (cap && !cap.used_by.includes(c.id)) cap.used_by.push(c.id) }
    for (const a of articles) { const c = candidates.get(a.story); if (c) c.article = a }
    const last = R[R.length - 1]
    const openGaps = [...gaps.values()].filter(g => last && g.last === last.at)
    cached = {
        about: (ctx.content.find(p => p.rel === REL) || { meta: {} }).meta.summary || '',   // the page's own summary (content/newsroom/desks.md)
        built: ctx.VERSION, runs: R,
        funnel: { captures: captures.size, not_a_story: [...captures.values()].filter(c => !c.story).length, feeding_a_candidate: [...captures.values()].filter(c => c.used_by.length).length, candidates: candidates.size, published: [...candidates.values()].filter(c => c.article).length },
        captures: [...captures.values()], candidates: [...candidates.values()].sort((a, b) => num(b.id) - num(a.id)),
        gaps_open: openGaps, gaps_all: [...gaps.values()], checks, revisions, verdicts,
    }
    return cached
}
const num = id => +String(id).replace(/\D/g, '') || 0
const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }
const when = at => at ? `${at.slice(8, 10)} Nov ${at.slice(11, 16)}` : ''
const BEAT_ORDER = b => ['summit', 'portugal', 'europe', 'announcements', 'connections', 'other'].indexOf(b) + 1 || 9

// the map: captures (by beat), story candidates, articles, and the lines between them; drawn at build, no script
function drawMap(M, link) {
    const caps = [...M.captures].sort((a, b) => BEAT_ORDER(a.beat) - BEAT_ORDER(b.beat) || a.id.localeCompare(b.id))
    const cands = [...M.candidates].sort((a, b) => num(a.id) - num(b.id))
    const arts = cands.filter(c => c.article)
    const ROW = 15, TOP = 28, H = TOP + Math.max(caps.length, cands.length) * ROW + 10, X = [8, 340, 680], W = 960
    const yC = new Map(caps.map((c, i) => [c.id, TOP + i * ROW])), yS = new Map(cands.map((c, i) => [c.id, TOP + i * ROW + (caps.length - cands.length) * ROW / 2]))
    const yA = new Map(arts.map((c, i) => [c.id, TOP + i * ROW * 2 + (caps.length - arts.length * 2) * ROW / 2]))
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const cut = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s
    const parts = []
    for (const [x, t] of [[X[0], 'Captures, by beat'], [X[1], 'Story candidates'], [X[2], 'Published']]) parts.push(`<text class="dk-h" x="${x}" y="14">${t}</text>`)
    for (const s of cands) for (const r of s.rests_on) if (yC.has(r)) parts.push(`<path class="dk-l${s.article ? ' on' : ''}" d="M${X[0] + 270} ${yC.get(r) - 4} C${X[1] - 60} ${yC.get(r) - 4} ${X[1] - 60} ${yS.get(s.id) - 4} ${X[1] - 8} ${yS.get(s.id) - 4}"/>`)
    for (const s of arts) parts.push(`<path class="dk-l on" d="M${X[1] + 280} ${yS.get(s.id) - 4} C${X[2] - 40} ${yS.get(s.id) - 4} ${X[2] - 40} ${yA.get(s.id) - 4} ${X[2] - 8} ${yA.get(s.id) - 4}"/>`)
    let beat = ''
    for (const c of caps) {
        const y = yC.get(c.id)
        parts.push(`<g class="dk-c b-${esc(c.beat)}${c.used_by.length ? '' : ' idle'}"><title>${esc(c.id)}: ${esc(c.source)}, ${esc(c.beat)}, first mapped ${when(c.first)}</title><circle cx="${X[0] + 274}" cy="${y - 4}" r="3.5"/><text x="${X[0]}" y="${y}">${c.beat !== beat ? `${esc(c.beat)} · ` : ''}${esc(cut(c.id.replace(/^v-/, ''), c.beat !== beat ? 30 : 40))}</text></g>`)
        beat = c.beat
    }
    for (const s of cands) parts.push(`<g class="dk-s${s.article ? ' on' : ''}"><title>${esc(s.id)}: ${esc(s.title)} (${esc(s.beat)}), first ${when(s.first)}${s.revised ? `, revised ${s.revised}x` : ''}</title><circle cx="${X[1] - 4}" cy="${yS.get(s.id) - 4}" r="4"/><text x="${X[1] + 4}" y="${yS.get(s.id)}">${esc(s.id)} ${esc(cut(s.title, 38))}</text></g>`)
    for (const s of arts) parts.push(`<a href="${link(s.article.rel)}"><g class="dk-a"><circle cx="${X[2] - 4}" cy="${yA.get(s.id) - 4}" r="4"/><text x="${X[2] + 4}" y="${yA.get(s.id)}">${esc(cut(s.article.title, 40))}</text></g></a>`)
    return `<figure class="dk-map"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Captures, story candidates and published articles, and the links between them">${parts.join('')}</svg></figure>`
}

export function pages() { return [] }   // the page is content/newsroom/desks.md

export function decorate(p, ctx) {
    if (p.rel !== REL) return
    p.assets = { css: [...(p.assets?.css || []), 'assets/newsroom/desks.css'], js: [...(p.assets?.js || [])] }
    const href = to => { const up = '../'.repeat(REL.split('/').length - 1); return up + to }
    const old = p.postHtml
    p.postHtml = html => (old ? old(html) : html).replace(`<p>${SVG}</p>`, drawMap(model(ctx), href))
    Object.defineProperty(p, 'twinMd', { configurable: true, enumerable: true, get() { return this.md.replace(SVG, 'The map is a picture on the page; the table below holds the same links.') } })
}

const cell = (ctx, s) => ctx.md.cell(String(s ?? ''))
export const fill = {
    'desks:map': () => SVG,
    'desks:funnel': (p, ctx) => {
        const F = model(ctx).funnel
        return `{.facts}\n| | |\n|---|---|\n| **Captures the curator mapped** | ${F.captures} (${F.not_a_story} marked not a story) |\n| **Captures behind a story candidate** | ${F.feeding_a_candidate} |\n| **Story candidates** | ${F.candidates} |\n| **Published as articles** | ${F.published} |`
    },
    'desks:runs': (p, ctx) => {
        const R = model(ctx).runs, max = Math.max(1, ...R.map(r => r.captures_new + r.candidates))
        const bar = n => '█'.repeat(Math.round(18 * n / max)) || (n ? '▏' : '')
        return '| Run (UTC) | Kind | New captures | Candidates | Gaps sent | Questions | |\n|---|---|---:|---:|---:|---:|---|\n' +
            R.map(r => `| ${when(r.at)} | ${cell(ctx, r.kind)} | ${r.captures_new} | ${r.candidates} | ${r.gaps} | ${r.checks} | \`${bar(r.captures_new)}${bar(r.candidates).replace(/█/g, '▓')}\` |`).join('\n')
    },
    'desks:candidates': (p, ctx) => {
        const M = model(ctx)
        return '| Id | Candidate | Beat | First | Rests on | Article |\n|---|---|---|---|---|---|\n' + M.candidates.map(c =>
            `| ${c.id} | ${cell(ctx, c.title)} | ${cell(ctx, c.beat)} | ${when(c.first)}${c.revised ? `, revised ${c.revised}x` : ''} | ${c.rests_on.length ? c.rests_on.map(r => `\`${cell(ctx, r)}\``).join(', ') : 'no capture yet'} | ${c.article ? `[${cell(ctx, c.article.title)}](${ctx.link(REL, c.article.rel)})` : 'not yet'} |`).join('\n')
    },
    'desks:beats': (p, ctx) => {
        const by = {}
        for (const c of model(ctx).captures) { const b = by[c.beat] || (by[c.beat] = { n: 0, used: 0, hosts: new Set() }); b.n++; if (c.used_by.length) b.used++; if (c.source) b.hosts.add(c.source) }
        return '| Beat | Captures | Behind a candidate | Sources |\n|---|---:|---:|---|\n' + Object.entries(by).sort((a, b) => BEAT_ORDER(a[0]) - BEAT_ORDER(b[0])).map(([b, x]) => `| ${cell(ctx, b)} | ${x.n} | ${x.used} | ${[...x.hosts].sort().map(h => cell(ctx, h)).join(', ')} |`).join('\n')
    },
    'desks:gaps': (p, ctx) => {
        const G = model(ctx).gaps_open
        return G.length ? '{.rows}\n' + G.map(g => `- ${cell(ctx, g.text)} (first asked ${when(g.first)})`).join('\n') : 'None open.'
    },
    'desks:checks': (p, ctx) => {
        const Q = model(ctx).checks
        return Q.length ? '{.rows}\n' + Q.slice().reverse().map(q => `- **${cell(ctx, q.about)}** (${when(q.at)}): ${cell(ctx, q.what)}`).join('\n') : 'None.'
    },
    'desks:api': (p, ctx) => `[${API}](${ctx.link(REL, API)})`,
}

export const api = ctx => [{ path: API, data: model(ctx), schema: null }]
export const llms = ctx => `## The desks\n- [newsroom/desks/](${ctx.BASE}newsroom/desks/index.md): what the curator mapped from the researcher's captures, run by run, the story candidates and the articles published from them; as data: [${API}](${ctx.BASE}${API}).\n\n`
