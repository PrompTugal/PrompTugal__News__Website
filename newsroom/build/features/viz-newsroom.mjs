// Each place's newsroom, live and end to end (Dinis, 15 November 2026: "Each one of these needs a newsroom. How can we
// visualize the newsroom actually working in practice? We have real examples and real data. Let's see that visualization
// end to end"). One page per place, <place>/newsroom/: the stations (read, captured, tested, written, checked, published)
// with the agent in each hat, counted from the place's file at this release; the run, commit by commit, from the file's
// own git history (what each commit changed, the release that shipped it); every entry from capture to page (where and
// when it was read, its AI path, the commit that brought it in, the release that put it live); and the gaps. Nothing is
// typed in by hand. Words: assets/viz/newsroom.json; markup: assets/viz/newsroom.tmpl.
// By viz.places@PrompTugal.dinis, 15 November 2026 (board/briefs/2026-11-15-show-the-power.md).
import { execFileSync } from 'node:child_process'
import { checkSites } from '../../../board/abp/tools/site-identity.mjs'
import { figure, head, tmpl, fill, xesc as X } from './viz-cast.mjs'
import { record, runsOf, keyOf, short, hm, dm, statusOf, asksOf } from './viz-record.mjs'
import { places, teamOf, newsroomRel, W, trim, noPrefix, noDash, repoCommit } from './viz-agents.mjs'

export const order = 96
const NT = 'assets/viz/newsroom.tmpl'
let COPY = null
const copy = ctx => COPY || (COPY = ctx.readJSON('assets/viz/newsroom.json'))
const arr = v => Array.isArray(v) ? v : []
const okUrl = u => typeof u === 'string' && /^https?:\/\/\S+$/i.test(u.trim())
const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }
const keyOfItem = (kind, x) => `${kind}:${(okUrl(x.url) ? x.url : x.name || x.title || '').toLowerCase()}`
const dmy = s => (s && /^\d{4}-\d{2}-\d{2}/.test(s)) ? s.slice(0, 10) : ''

// the place's file, version by version (git log --follow is not needed: the path never moved)
const HIST = new Map()
export function history(ctx, p) {
    if (HIST.has(p.id)) return HIST.get(p.id)
    const file = `data/by-place/${p.id}.json`, R = record(ctx)
    const bySha = new Map(R.commits.map(c => [c.sha, c]))
    let log = ''
    try { log = execFileSync('git', ['log', '--format=%H%x1f%aI%x1f%s', '--', file], { cwd: ctx.ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }) } catch {}
    const out = []
    let prev = null
    for (const line of log.split('\n').filter(Boolean).reverse()) {
        const [sha, when, subject] = line.split('\x1f')
        let d = null
        try { d = JSON.parse(execFileSync('git', ['show', `${sha}:${file}`], { cwd: ctx.ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })) } catch {}
        if (!d || typeof d !== 'object') continue
        const counts = { news: arr(d.ai_news).length, map: arr(d.ai_map).length, sources: arr(d.sources).length, events: arr(d.events).length, gaps: arr(d.gaps).length }
        const keys = new Set([...arr(d.ai_news).map(x => keyOfItem('news', x)), ...arr(d.ai_map).map(x => keyOfItem('map', x)), ...arr(d.events).map(x => keyOfItem('events', x))])
        const c = bySha.get(sha.slice(0, 9))
        const m = subject.match(/^([a-z][a-z0-9.\-]*@[A-Za-z0-9.\-]+?)\s*:/)
        out.push({ sha: sha.slice(0, 9), when, t: Date.parse(when), subject, agent: m ? m[1] : 'someone', counts, keys, release: c && c.release, prev: prev && prev.counts, status: d.status })
        prev = out[out.length - 1]
    }
    HIST.set(p.id, out)
    return out
}

const relTime = (R, v) => { const r = R.releases.get(v); return r ? r.when : null }

function stations(ctx, p) {
    const C = copy(ctx), L = C.lines, R = record(ctx), d = p.data || {}
    const H = history(ctx, p), role = `place.${p.id}`
    const runs = runsOf(ctx, role), s = statusOf(ctx, role), asks = asksOf(s)
    const news = arr(d.ai_news), map = arr(d.ai_map), events = arr(d.events), extras = arr(d.extras), sources = arr(d.sources)
    const items = [...news, ...map, ...events]
    const hosts = new Set(items.map(x => host(x.url || x.source_url)).concat(map.map(x => host(x.source_url))).filter(Boolean))
    const reads = items.map(x => dmy(x.read_on)).filter(Boolean).sort()
    const steps = [0, 1, 2, 3].map(k => items.filter(x => x.steps === k).length), nopath = items.filter(x => !x.ai_path).length
    const passed = items.filter(x => x.ai_path).length
    const site = (() => { try { return checkSites(ctx.ROOT).find(r => r.id === p.id) } catch { return null } })()
    const releases = [...new Set(H.map(h => h.release).filter(Boolean))]
    const ak = keyOf(ctx, p.agent)
    const line = (k, v) => W(L[k], v)
    const st = {
        read: { big: sources.length, lines: [runs.web ? line('pages_read', { n: runs.web }) : null, line('hosts', { n: hosts.size }), asks.length ? line('blocked', { n: asks.length }) : null] },
        capture: { big: items.length + extras.length, lines: [line('news', { n: news.length }), line('map', { n: map.length }), events.length ? line('events', { n: events.length }) : null, extras.length ? line('extras', { n: extras.length }) : null, reads.length ? line('read_span', { from: reads[0], to: reads[reads.length - 1] }) : null, L.screens] },
        test: { big: passed, lines: [...steps.map((n, k) => n ? line('steps', { n, label: L.step_labels[k] }) : null), nopath ? line('nopath', { n: nopath }) : null, line('gaps', { n: arr(d.gaps).length })] },
        write: { big: 7, lines: [L.sections, line('voice', { state: d.voice && Object.keys(d.voice).length ? 'written' : 'not yet' }), line('articles', { n: (ctx.content || []).filter(c => c.meta && c.meta.town === p.id && c.rel.startsWith('articles/')).length })] },
        check: { big: 2, lines: [L.gate, line('signature', { state: site ? (C.sig_states[site.signature] || site.signature) : '?' }), site && site.site_key ? line('identity', { key: site.site_key }) : null, ak ? line('agent_key', { key: ak.id }) : null] },
        publish: { big: releases.length, lines: [releases.length ? line('first', { v: releases[0], t: `${dm(relTime(R, releases[0]))} ${hm(relTime(R, releases[0]))}` }) : null, releases.length ? line('latest', { v: releases[releases.length - 1], t: `${dm(relTime(R, releases[releases.length - 1]))} ${hm(relTime(R, releases[releases.length - 1]))}` }) : null, L.ci] },
    }
    return C.stations.map((x, i) => ({ ...x, n: i + 1, ...st[x.id], lines: st[x.id].lines.filter(Boolean) }))
}

function stationsHtml(ctx, p, list) {
    const T = tmpl(ctx, NT), C = copy(ctx)
    return fill(T.stations, {
        accent: X(p.accent),
        items: list.map(s => fill(T.station, {
            id: s.id, n: s.n, label: X(s.label), big: X(s.big), unit: X(s.unit),
            fig: s.look ? figure(ctx, { role: s.look, colour: p.accent, mood: 'happy', size: 84, title: W(C.who.agent_hat, { who: `place.${p.id}@`, hat: C.hats[s.id] || s.look }) }) : fill(T.box, { t: 'CI' }),
            who: X(s.id === 'check' ? C.who.check : s.id === 'publish' ? C.who.publish : W(C.who.agent_hat, { who: `place.${p.id}@`, hat: C.hats[s.id] })),
            lines: s.lines.map(t => fill(T.line, { t: X(t) })).join(''),
        })).join(''),
    })
}

const SERIES = [['map', '#1f5f3f'], ['news', '#c52830'], ['sources', '#6b7280']]
function chart(ctx, p, H) {
    const T = tmpl(ctx, NT), C = copy(ctx), R = record(ctx)
    if (H.length < 1) return ''
    const w = 1000, h = 220, pad = { l: 40, r: 120, t: 14, b: 30 }
    const t0 = H[0].t, t1 = Math.max(R.now, H[H.length - 1].t + 60e3)
    const max = Math.max(1, ...H.flatMap(x => SERIES.map(([k]) => x.counts[k])))
    const x = t => pad.l + (w - pad.l - pad.r) * (t - t0) / (t1 - t0), y = v => h - pad.b - (h - pad.t - pad.b) * v / max
    let body = `<path d="M${pad.l} ${h - pad.b}H${w - pad.r}" class="vz-axis"/>`
    for (const v of [0, Math.round(max / 2), max]) body += `<text x="${pad.l - 6}" y="${y(v) + 4}" class="vz-tick" text-anchor="end">${v}</text>`
    const ticks = 5
    for (let i = 0; i <= ticks; i++) { const t = t0 + (t1 - t0) * i / ticks; body += `<text x="${x(t)}" y="${h - 10}" class="vz-tick" text-anchor="middle">${hm(t)}</text>` }
    for (const [k, c] of SERIES) {
        let d = '', last = null
        for (const v of H) { const yy = y(v.counts[k]); d += last == null ? `M${x(v.t).toFixed(1)} ${yy.toFixed(1)}` : `H${x(v.t).toFixed(1)}V${yy.toFixed(1)}`; last = yy }
        d += `H${x(t1).toFixed(1)}`
        body += `<path d="${d}" stroke="${c}" class="vz-series"/>`
        body += `<text x="${(x(t1) + 6).toFixed(1)}" y="${(last + 4).toFixed(1)}" class="vz-slabel" fill="${c}">${X(H[H.length - 1].counts[k] + ' ' + C.series[k])}</text>`
        for (const v of H) body += `<circle cx="${x(v.t).toFixed(1)}" cy="${y(v.counts[k]).toFixed(1)}" r="3.2" fill="${c}"><title>${X(`${hm(v.t)} ${short(v.agent)}: ${v.counts[k]} ${C.series[k]}`)}</title></circle>`
    }
    for (const v of H.filter(v => v.release)) body += `<path d="M${x(v.t).toFixed(1)} ${pad.t}V${h - pad.b}" class="vz-relmark"><title>${X(v.release)}</title></path>`
    return fill(T.chart, { w, h, aria: X(C.chart_aria), body, legend: X(W(C.chart_legend, { from: `${dm(t0)} ${hm(t0)}`, to: `${dm(t1)} ${hm(t1)}` })) + ' ' + SERIES.map(([k, c]) => fill(T.key, { c, t: X(C.series[k]) })).join('') })
}

function delta(C, h) {
    if (!h.prev) return C.delta_first
    const parts = []
    for (const k of ['news', 'map', 'sources', 'events', 'gaps']) { const dd = h.counts[k] - h.prev[k]; if (dd) parts.push(`${dd > 0 ? '+' : ''}${dd} ${k === 'map' ? 'map' : k}`) }
    return parts.join(', ') || C.delta_none
}

function runHtml(ctx, p, H) {
    const T = tmpl(ctx, NT), C = copy(ctx)
    return fill(T.run, { rows: H.map(h => fill(T['run-row'], {
        t: X(`${dm(h.t)} ${hm(h.t)}`), head: head(ctx, { role: String(h.agent).split('@')[0].toLowerCase(), accent: p.accent, size: 22, title: short(h.agent.toLowerCase()) }),
        who: X(short(h.agent.toLowerCase())), href: X(repoCommit(ctx, h.sha)), subject: X(trim(noDash(noPrefix(h.subject)), 150)),
        delta: X(delta(C, h)), rel: X(h.release || C.unreleased),
    })).join('') })
}

function itemRows(ctx, p, H) {
    const C = copy(ctx), d = p.data || {}, c = s => ctx.md.cell(String(s ?? ''))
    const first = new Map()
    for (const h of H) for (const k of h.keys) if (!first.has(k)) first.set(k, h)
    const rows = []
    for (const [kind, list] of [['news', arr(d.ai_news)], ['map', arr(d.ai_map)], ['events', arr(d.events)]]) {
        for (const x of list) {
            const h = first.get(keyOfItem(kind, x)), src = x.url && kind !== 'map' ? x.url : (x.source_url || x.url)
            const name = x.title || x.name || ''
            rows.push(`| ${okUrl(x.url) ? `[${c(trim(name, 90))}](${x.url.trim().replace(/\(/g, '%28').replace(/\)/g, '%29')})` : c(trim(name, 90))} | ${c(C.kinds[kind])} | ${c(host(src))} | ${c(dmy(x.read_on) || '·')} | ${c(trim(x.ai_path || '·', 110))}${typeof x.steps === 'number' ? ` (${x.steps === 0 ? 'direct' : x.steps})` : ''} | ${h ? `${dm(h.t)} ${hm(h.t)}` : '·'} | ${h && h.release ? h.release : c(C.unreleased)} |`)
        }
    }
    return rows.length ? `{.vz-items}\n${C.items_cols}\n|---|---|---|---|---|---|---|\n${rows.join('\n')}\n` : ''
}

// the region's newsroom: every town's loop side by side
function townsBoard(ctx, region) {
    const C = copy(ctx), c = s => ctx.md.cell(String(s ?? '')), rel = newsroomRel(region)
    const towns = places(ctx).filter(t => t.parent === 'algarve' || t.parent === 'loule')
    const rows = towns.map(t => {
        const st = Object.fromEntries(stations(ctx, t).map(s => [s.id, s.big])), H = history(ctx, t), last = H[H.length - 1]
        const me = teamOf(ctx, t).find(a => a.own)
        return `| [${c(t.name)}](${ctx.link(rel, newsroomRel(t))}) | ${c(short(t.agent.toLowerCase()))} | ${c(me ? (me.mood === 'happy' || me.mood === 'stressed' ? 'at work' : me.mood === 'worried' ? 'quiet' : 'silent') : '')} | ${st.read} | ${st.capture} | ${st.test} | ${st.publish} | ${last ? `${dm(last.t)} ${hm(last.t)}` : ''} |`
    })
    return `## ${C.h_towns} {#towns}\n\n${C.towns_intro}\n\n{.vz-towns}\n${C.towns_cols}\n|---|---|---|---:|---:|---:|---:|---|\n${rows.join('\n')}\n\n`
}

function page(ctx, p) {
    const C = copy(ctx), d = p.data || {}, rel = newsroomRel(p), H = history(ctx, p)
    const list = stations(ctx, p), team = teamOf(ctx, p), c = s => ctx.md.cell(String(s ?? ''))
    const releases = [...new Set(H.map(h => h.release).filter(Boolean))]
    const items = arr(d.ai_news).length + arr(d.ai_map).length + arr(d.events).length
    let md = `::: vz-hero-slot\n${c(W(C.lede, { id: p.id, name: p.name }))}\n:::\n\n`
    md += `## ${C.h_flow} {#flow}\n\n::: vz-stations-slot\n${list.map(s => `- **${s.n}. ${c(s.label)}: ${c(s.big)} ${c(s.unit)}.** ${s.lines.map(c).join('; ')}`).join('\n')}\n:::\n\n`
    if (p.id === 'algarve') md += townsBoard(ctx, p)
    md += `## ${C.h_run} {#run}\n\n${C.run_intro}\n\n::: vz-chart-slot\n${c(W(C.chart_legend, { from: H[0] ? `${dm(H[0].t)} ${hm(H[0].t)}` : '', to: `${dm(record(ctx).now)} ${hm(record(ctx).now)}` }))}\n:::\n\n`
    md += `::: vz-run-slot\n${H.map(h => `- ${dm(h.t)} ${hm(h.t)}, ${c(short(h.agent.toLowerCase()))}: ${c(trim(noDash(noPrefix(h.subject)), 150))} (${c(delta(C, h))}; ${c(h.release || C.unreleased)})`).join('\n')}\n:::\n\n`
    md += `## ${C.h_items} {#items}\n\n${C.items_intro}\n\n${itemRows(ctx, p, H)}\n`
    const gaps = arr(d.gaps).filter(g => typeof g === 'string')
    if (gaps.length) md += `## ${C.h_gaps} {#gaps}\n\n${C.gaps_intro}\n\n${gaps.map(g => `- ${c(g)}`).join('\n')}\n\n`
    const placeRel = `${p.path}index.html`
    return {
        rel, src: `data/by-place/${p.id}.json`, type: 'site', layout: 'wide', date: dmy(d.updated) || ctx.TODAY, section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], ...(p.id === 'portugal' ? [] : p.id === 'algarve' ? [] : [['algarve/index.html', 'The Algarve']]), [placeRel, p.name], [null, 'Newsroom']],
        title: W(C.title, { name: p.name }),
        summary: W(C.summary, { name: p.name, sources: arr(d.sources).length, items, releases: releases.length, first: H[0] ? `${dm(H[0].t)} ${hm(H[0].t)} UTC` : 'today' }),
        md,
        postHtml: html => {
            const T = tmpl(ctx, NT), lk = to => X(ctx.link(rel, to).replace(/\.md$/, '.html'))
            const explainer = (ctx.pages || []).find(x => x.rel === 'agentic-system/index.html')
            html = html.replace(/<div class="vz-hero-slot">[\s\S]*?<\/div>/, () => fill(T.hero, {
                accent: X(p.accent), lede: X(W(C.lede, { id: p.id, name: p.name })),
                heads: team.map(a => head(ctx, { role: a.role, accent: p.accent, mood: a.mood, size: 30, title: short(a.agent) })).join(''),
                place: lk(placeRel), agents: lk(placeRel) + '#agents', explainer: explainer ? lk(explainer.rel) : lk(placeRel) + '#how',
            }))
            html = html.replace(/<div class="vz-stations-slot">[\s\S]*?<\/div>/, () => stationsHtml(ctx, p, list))
            html = html.replace(/<div class="vz-chart-slot">[\s\S]*?<\/div>/, () => chart(ctx, p, H))
            html = html.replace(/<div class="vz-run-slot">[\s\S]*?<\/div>/, () => runHtml(ctx, p, H))
            return `<div class="vz-nr" style="--c:${X(p.accent)}">${html}</div>`
        },
    }
}

export function pages(ctx) {
    return places(ctx).map(p => page(ctx, p))
}

export function api(ctx) {
    const out = {}
    for (const p of places(ctx)) {
        const H = history(ctx, p)
        out[p.id] = { stations: stations(ctx, p).map(s => ({ id: s.id, label: s.label, count: s.big, unit: s.unit, lines: s.lines })), run: H.map(h => ({ when: h.when, sha: h.sha, agent: h.agent, subject: noPrefix(h.subject), counts: h.counts, release: h.release || null })) }
    }
    const per = places(ctx).map(p => ({ path: `api/v1/viz/newsrooms/${p.id}.json`, schema: null, data: { place: p.id, name: p.name, page: newsroomRel(p), version: ctx.VERSION, ...out[p.id] } }))
    return [...per, { path: 'api/v1/viz/newsrooms.json', schema: null, data: { about: "Each PrompTugal.news place's newsroom, end to end, from the record at this release (viz.places@PrompTugal.dinis)", version: ctx.VERSION, places: out } }]
}

export function validate(gate) {
    const out = []
    let list
    try { list = JSON.parse(gate.text('data/by-place/places.json')).places } catch { return out }
    for (const p of list) { try { if (!gate.text(`${p.path}newsroom/index.html`).includes('class="vz-stations"')) out.push(`viz-newsroom: ${p.path}newsroom/ lacks its stations`) } catch { out.push(`viz-newsroom: missing ${p.path}newsroom/index.html`) } }
    return out
}
