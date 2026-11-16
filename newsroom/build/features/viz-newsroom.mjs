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
import { figure, head, tmpl, fill as tf, xesc as X } from './viz-cast.mjs'
import { record, runsOf, keyOf, short, hm, dm, statusOf, asksOf } from './viz-record.mjs'
import { places, teamOf, newsroomRel, W, trim, noPrefix, noDash, repoCommit, moodWord } from './viz-agents.mjs'

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
    return tf(T.stations, {
        accent: X(p.accent),
        items: list.map(s => tf(T.station, {
            id: s.id, n: s.n, label: X(s.label), big: X(s.big), unit: X(s.unit),
            fig: s.look ? figure(ctx, { role: s.look, colour: p.accent, mood: 'happy', size: 84, title: W(C.who.agent_hat, { who: `place.${p.id}@`, hat: C.hats[s.id] || s.look }) }) : tf(T.box, { t: 'CI' }),
            who: X(s.id === 'check' ? C.who.check : s.id === 'publish' ? C.who.publish : W(C.who.agent_hat, { who: `place.${p.id}@`, hat: C.hats[s.id] })),
            lines: s.lines.map(t => tf(T.line, { t: X(t) })).join(''),
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
    return tf(T.chart, { w, h, aria: X(C.chart_aria), body, legend: X(W(C.chart_legend, { from: `${dm(t0)} ${hm(t0)}`, to: `${dm(t1)} ${hm(t1)}` })) + ' ' + SERIES.map(([k, c]) => tf(T.key, { c, t: X(C.series[k]) })).join('') })
}

function delta(C, h) {
    if (!h.prev) return C.delta_first
    const parts = []
    for (const k of ['news', 'map', 'sources', 'events', 'gaps']) { const dd = h.counts[k] - h.prev[k]; if (dd) parts.push(`${dd > 0 ? '+' : ''}${dd} ${k === 'map' ? 'map' : k}`) }
    return parts.join(', ') || C.delta_none
}

function runHtml(ctx, p, H) {
    const T = tmpl(ctx, NT), C = copy(ctx)
    return tf(T.run, { rows: H.map(h => tf(T['run-row'], {
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

// the region's agents on the map: the coast and border from assets/portugal/algarve-outline.json (Natural Earth), each
// town's agent's head at its seat (places.json "at"), its face by the site's one rule
let AT = null
const placesAt = ctx => AT || (AT = new Map(ctx.readJSON('data/by-place/places.json').places.filter(x => Array.isArray(x.at) && (x.parent === 'algarve' || x.parent === 'loule')).map(x => [x.id, x])))
function agentMap(ctx, region, national = false) {
    const T = tmpl(ctx, NT), C = copy(ctx), R = record(ctx), rel = newsroomRel(region)
    let O = { countries: {} }
    try { O = ctx.readJSON(national ? 'assets/portugal/portugal-outline.json' : 'assets/portugal/algarve-outline.json') } catch {}
    const V = national ? { lon0: -9.8, lon1: -6.0, lat0: 36.8, lat1: 42.3 } : { lon0: -9.12, lon1: -7.30, lat0: 36.92, lat1: 37.62 }, w = national ? 620 : 1000
    const k = Math.cos((national ? 39.5 : 37.2) * Math.PI / 180), sc = w / ((V.lon1 - V.lon0) * k), h = Math.round((V.lat1 - V.lat0) * sc)
    const X0 = lon => ((lon - V.lon0) * k * sc), Y0 = lat => ((V.lat1 - lat) * sc)
    const ring = r => 'M' + r.map(([lo, la]) => `${X0(lo).toFixed(1)},${Y0(la).toFixed(1)}`).join('L') + 'Z'
    let body = ''
    for (const [name, cls] of [['Spain', 'es'], ['Portugal', 'pt']]) for (const poly of (O.countries[name] || [])) body += `<path d="${poly.map(ring).join('')}" class="vz-am-land ${cls}"/>`
    const all = ctx.readJSON('data/by-place/places.json').places.filter(x => Array.isArray(x.at))
    const inAlg = x => x.parent === 'algarve' || x.parent === 'loule'
    const towns = places(ctx).filter(t => all.some(x => x.id === t.id && (national || inAlg(x))))
    let now = 0
    for (const t of towns) {
        const at = all.find(x => x.id === t.id), me = teamOf(ctx, t).find(a => a.own), mood = me ? me.mood : 'unhappy'
        if (mood === 'happy' || mood === 'stressed') now++
        const x = X0(at.at[0]), y = Y0(at.at[1]), side = national ? 'e' : (at.label || 's'), small = national && inAlg(at)
        const [lx, ly, anchor] = side === 'n' ? [0, -44, 'middle'] : side === 'e' ? [14, 4, 'start'] : side === 'w' ? [-14, 4, 'end'] : side === 'sw' ? [-10, 22, 'end'] : [0, 22, 'middle']
        body += tf(T['agentmap-pin'], { href: X(ctx.link(rel, newsroomRel(t)).replace(/\.md$/, '.html')), title: X(`${t.name}: ${short(t.agent.toLowerCase())}, ${moodWord(ctx)[mood]}`), x: x.toFixed(1), y: y.toFixed(1), c: X(t.accent),
            hx: small ? -8 : -14, hy: small ? -20 : -36, head: head(ctx, { role: `place.${t.id}`, accent: t.accent, mood, size: small ? 14 : 26, title: short(t.agent.toLowerCase()) }), lx, ly, anchor, name: small ? '' : X(t.name) })
    }
    if (national) { const alg = all.filter(inAlg); if (alg.length) { const ax = Math.max(...alg.map(a => X0(a.at[0]))), ay = Y0(Math.min(...alg.map(a => a.at[1]))); body += `<text x="${(ax + 10).toFixed(1)}" y="${(ay + 24).toFixed(1)}" class="vz-am-label">${X(`The Algarve (${alg.length})`)}</text>` } }
    return tf(T.agentmap, { w, h, aria: X(C.agentmap_aria), body, caption: X(W(C.agentmap_caption, { asof: `${dm(R.now)} ${hm(R.now)}`, now, count: towns.length })) }).replace('class="vz-agentmap"', national ? 'class="vz-agentmap vz-national"' : 'class="vz-agentmap"')
}


// the blast radius and the tree of significance (Dinis, 16 November 2026, 01:20 UTC; board/briefs/2026-11-16-blast-radius.md):
// borders and distances from data.places@'s board/team/data.places/neighbours.json; each story's significance as its
// place agent marks it; the reach rule is the brief's (as datasci.places@ serves it in api/v1/places/<id>/nearby.json)
const SIGS = ['local', 'neighbours', 'region', 'country', 'beyond']
let GEO = null
function geo(ctx) {
    if (GEO) return GEO
    let n = { places: [], distances: [] }
    try { n = ctx.readJSON('board/team/data.places/neighbours.json') } catch {}
    const km = new Map(), borders = new Map()
    for (const [a, b, d] of arr(n.distances)) { km.set(`${a}|${b}`, d); km.set(`${b}|${a}`, d) }
    for (const pl of arr(n.places)) for (const b of arr(pl.borders)) if (b.place) { for (const [x, y] of [[pl.id, b.place], [b.place, pl.id]]) { if (!borders.has(x)) borders.set(x, new Set()); borders.get(x).add(y) } }
    const read = arr(n.places).map(x => x.read_on).filter(Boolean).sort().pop() || ''
    GEO = { km: (a, b) => km.get(`${a}|${b}`) ?? null, adj: (a, b) => !!(borders.get(a) && borders.get(a).has(b)), read }
    return GEO
}
const sigOf = a => (typeof a.significance === 'string' && SIGS.includes(a.significance)) ? a.significance : null
function reaches(sig, on, from, G) {
    if (!sig || sig === 'local') return false
    if (sig === 'neighbours') { const k = G.km(on, from); return G.adj(on, from) || (k !== null && k <= 20) }
    return true
}
function proj(ctx) {
    let O = { countries: {} }
    try { O = ctx.readJSON('assets/portugal/algarve-outline.json') } catch {}
    const V = { lon0: -9.12, lon1: -7.30, lat0: 36.92, lat1: 37.62 }, w = 1000
    const k = Math.cos(37.2 * Math.PI / 180), sc = w / ((V.lon1 - V.lon0) * k), h = Math.round((V.lat1 - V.lat0) * sc)
    const X0 = lon => ((lon - V.lon0) * k * sc), Y0 = lat => ((V.lat1 - lat) * sc)
    const ring = r => 'M' + r.map(([lo, la]) => `${X0(lo).toFixed(1)},${Y0(la).toFixed(1)}`).join('L') + 'Z'
    let land = ''
    for (const [name, cls] of [['Spain', 'es'], ['Portugal', 'pt']]) for (const poly of (O.countries[name] || [])) land += `<path d="${poly.map(ring).join('')}" class="vz-am-land ${cls}"/>`
    return { w, h, X0, Y0, land, pxPerKm: sc / 111.2 }
}
function blastData(ctx, p) {
    const G = geo(ctx), towns = places(ctx).filter(t => placesAt(ctx).has(t.id) && t.id !== p.id)
    return towns.map(t => {
        const news = arr(t.data && t.data.ai_news)
        return { t, km: G.km(p.id, t.id), adj: G.adj(p.id, t.id), n: news.filter(a => reaches(sigOf(a), p.id, t.id, G)).length, unmarked: news.filter(a => !sigOf(a)).length }
    })
}
function blastHtml(ctx, p, fromRel) {
    const T = tmpl(ctx, NT), C = copy(ctx), P = proj(ctx), at = placesAt(ctx).get(p.id)
    if (!at) return ''
    const cx = P.X0(at.at[0]), cy = P.Y0(at.at[1]), rel = fromRel || newsroomRel(p), D = blastData(ctx, p)
    let body = P.land
    for (const r of [50, 25, 10]) body += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * P.pxPerKm).toFixed(1)}" class="vz-bl-ring r${r}"/><text x="${(cx + r * P.pxPerKm * 0.71 + 4).toFixed(1)}" y="${(cy - r * P.pxPerKm * 0.71).toFixed(1)}" class="vz-bl-km">${r} km</text>`
    for (const d of D.filter(d => d.adj)) { const a = placesAt(ctx).get(d.t.id).at; body += `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${P.X0(a[0]).toFixed(1)}" y2="${P.Y0(a[1]).toFixed(1)}" class="vz-bl-border"/>` }
    for (const d of D) {
        const a = placesAt(ctx).get(d.t.id).at, x = P.X0(a[0]), y = P.Y0(a[1])
        body += tf(T['blast-pin'], { href: X(ctx.link(rel, newsroomRel(d.t)).replace(/\.md$/, '.html')), title: X(`${d.t.name}: ${d.km ?? '?'} km${d.adj ? ', borders ' + p.name : ''}; ${d.n} of its stories reach ${p.name}`),
            x: x.toFixed(1), y: y.toFixed(1), r: (5 + Math.sqrt(d.n) * 4).toFixed(1), cls: d.n ? 'on' : 'off', lx: x.toFixed(1), ly: (y + 20 + Math.sqrt(d.n) * 4).toFixed(1), name: X(d.t.name) })
    }
    body += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9" class="vz-bl-home"/><text x="${cx.toFixed(1)}" y="${(cy - 16).toFixed(1)}" text-anchor="middle" class="vz-bl-homelabel">${X(p.name)}</text>`
    const shown = D.reduce((s, d) => s + d.n, 0), from = D.filter(d => d.n).length, unmarked = D.reduce((s, d) => s + d.unmarked, 0)
    return tf(T.blast, { accent: X(p.accent), w: P.w, h: P.h, aria: X(W(C.blast_aria, { name: p.name })), body, caption: X(W(C.blast_caption, { shown, from, name: p.name, unmarked, read: geo(ctx).read })) })
}
function blastTwin(ctx, p) {
    const C = copy(ctx), c = s => ctx.md.cell(String(s ?? ''))
    return blastData(ctx, p).filter(d => d.km !== null).sort((a, b) => a.km - b.km).map(d => W(C.blast_twin, { name: c(d.t.name), km: d.km, border: d.adj ? C.blast_border : '', n: d.n })).join('\n')
}
function treeHtml(ctx) {
    const T = tmpl(ctx, NT), C = copy(ctx), L = C.sig_labels
    const count = pl => { const by = {}; for (const a of arr(pl.data && pl.data.ai_news)) { const k = sigOf(a) || 'unmarked'; by[k] = (by[k] || 0) + 1 } return by }
    const all0 = places(ctx), max = Math.max(1, ...all0.map(pl => arr(pl.data && pl.data.ai_news).length))
    const row = (pl, depth) => { const by = count(pl), n = Object.values(by).reduce((s, v) => s + v, 0)
        return tf(T['tree-row'], { depth, name: X(pl.name), n, pct: (100 * n / max).toFixed(1), segs: [...SIGS, 'unmarked'].filter(k => by[k]).map(k => tf(T['tree-seg'], { sig: k, k: by[k], title: X(`${pl.name}: ${by[k]} ${L[k]}`) })).join('') }) }
    const all = places(ctx), root = all.filter(x => x.kind === 'country'), region = all.filter(x => x.kind === 'region')
    let rows = root.map(r => row(r, 0)).join('') + region.map(r => row(r, 1)).join('')
    const kids = id => all.filter(x => x.parent === id)
    for (const t of kids('algarve')) { rows += row(t, 2); for (const u of kids(t.id)) rows += row(u, 3) }
    return tf(T.tree, { rows }) + tf(T['tree-key'], { items: [...SIGS, 'unmarked'].map(k => tf(T['tree-key-item'], { sig: k, label: X(L[k]) })).join('') })
}
function treeTwin(ctx) {
    const C = copy(ctx), L = C.sig_labels
    return places(ctx).map(pl => { const by = {}; for (const a of arr(pl.data && pl.data.ai_news)) { const k = sigOf(a) || 'unmarked'; by[k] = (by[k] || 0) + 1 } return `- ${ctx.md.cell(pl.name)}: ${Object.entries(by).map(([k, v]) => `${v} ${L[k]}`).join(', ') || 'no stories yet'}` }).join('\n')
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
    if (placesAt(ctx).has(p.id)) md += `## ${W(C.h_blast, { name: p.name })} {#blast}\n\n${W(C.blast_intro, { name: p.name })}\n\n::: vz-blast-slot\n${blastTwin(ctx, p)}\n:::\n\n`
    if (p.id === 'algarve') md += `## ${C.h_tree} {#tree}\n\n${C.tree_intro}\n\n::: vz-tree-slot\n${treeTwin(ctx)}\n:::\n\n`
    if (p.id === 'portugal') md += `## ${C.h_agentmap_pt} {#agentmap}\n\n::: vz-agentmap-slot\n${places(ctx).filter(t => t.kind !== 'country' && t.kind !== 'region').map(t => `- ${c(t.name)}: ${c(short(t.agent.toLowerCase()))}`).join('\n')}\n:::\n\n`
    if (p.id === 'algarve') md += `## ${C.h_agentmap} {#agentmap}\n\n::: vz-agentmap-slot\n${places(ctx).filter(t => placesAt(ctx).has(t.id)).map(t => `- ${c(t.name)}: ${c(short(t.agent.toLowerCase()))}`).join('\n')}\n:::\n\n` + townsBoard(ctx, p)
    md += `## ${C.h_run} {#run}\n\n${C.run_intro}\n\n::: vz-chart-slot\n${c(W(C.chart_legend, { from: H[0] ? `${dm(H[0].t)} ${hm(H[0].t)}` : '', to: `${dm(record(ctx).now)} ${hm(record(ctx).now)}` }))}\n:::\n\n`
    md += `::: vz-run-slot\n${H.map(h => `- ${dm(h.t)} ${hm(h.t)}, ${c(short(h.agent.toLowerCase()))}: ${c(trim(noDash(noPrefix(h.subject)), 150))} (${c(delta(C, h))}; ${c(h.release || C.unreleased)})`).join('\n')}\n:::\n\n`
    md += `## ${C.h_items} {#items}\n\n${C.items_intro}\n\n${itemRows(ctx, p, H)}\n`
    const gaps = arr(d.gaps).filter(g => typeof g === 'string')
    if (gaps.length) md += `## ${C.h_gaps} {#gaps}\n\n${C.gaps_intro}\n\n${gaps.map(g => `- ${c(g)}`).join('\n')}\n\n`
    const placeRel = `${p.path}index.html`
    return {
        rel, src: `data/by-place/${p.id}.json`, type: 'site', layout: 'wide', date: dmy(d.updated) || ctx.TODAY, section: 'portugal', group: 'Portugal',
        crumbs: [['portugal/index.html', 'Portugal'], ...((p.parent === 'algarve' || p.parent === 'loule') ? [['algarve/index.html', 'The Algarve']] : []), [placeRel, p.name], [null, 'Newsroom']],
        title: W(C.title, { name: p.name }),
        summary: W(C.summary, { name: p.name, sources: arr(d.sources).length, items, releases: releases.length, first: H[0] ? `${dm(H[0].t)} ${hm(H[0].t)} UTC` : 'today' }),
        md,
        postHtml: html => {
            const T = tmpl(ctx, NT), lk = to => X(ctx.link(rel, to).replace(/\.md$/, '.html'))
            const explainer = (ctx.pages || []).find(x => x.rel === 'agentic-system/index.html')
            html = html.replace(/<div class="vz-hero-slot">[\s\S]*?<\/div>/, () => tf(T.hero, {
                accent: X(p.accent), lede: X(W(C.lede, { id: p.id, name: p.name })),
                heads: team.map(a => head(ctx, { role: a.role, accent: p.accent, mood: a.mood, size: 30, title: short(a.agent) })).join(''),
                place: lk(placeRel), agents: lk(placeRel) + '#agents', explainer: explainer ? lk(explainer.rel) : lk(placeRel) + '#how',
            }))
            html = html.replace(/<div class="vz-stations-slot">[\s\S]*?<\/div>/, () => stationsHtml(ctx, p, list))
            html = html.replace(/<div class="vz-chart-slot">[\s\S]*?<\/div>/, () => chart(ctx, p, H))
            html = html.replace(/<div class="vz-blast-slot">[\s\S]*?<\/div>/, () => blastHtml(ctx, p))
            html = html.replace(/<div class="vz-tree-slot">[\s\S]*?<\/div>/, () => treeHtml(ctx))
            if (p.id === 'algarve' || p.id === 'portugal') html = html.replace(/<div class="vz-agentmap-slot">[\s\S]*?<\/div>/, () => agentMap(ctx, p, p.id === 'portugal'))
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

// The blast radius and the tree on any page (the brief: "a small version on the home page", which is dev.places@'s):
// place <!-- viz:tree --> or <!-- viz:blast --> (the blast radius of Loulé, the case study) or <!-- viz:blast:<id> -->
// in a page's markdown; the twin keeps a list, the page gets the picture in its small form.
const MARK = /<!-- viz:(tree|blast(?::([a-z0-9-]+))?) -->/g
export const fill = {
    'viz:tree': (page, ctx) => `::: vz-mini vz-tree-slot\n${treeTwin(ctx)}\n:::`,
    'viz:blast': (page, ctx) => { const p = places(ctx).find(x => x.id === 'loule'); return p ? `::: vz-mini vz-blast-slot\n${blastTwin(ctx, p)}\n:::` : '' },
}
for (const id of ['faro', 'loule', 'quarteira', 'silves', 'tavira', 'vila-real-de-santo-antonio', 'portimao', 'lagos', 'olhao', 'albufeira', 'lagoa', 'monchique', 'aljezur', 'vila-do-bispo', 'castro-marim', 'alcoutim', 'sao-bras-de-alportel'])
    fill[`viz:blast:${id}`] = (page, ctx) => { const p = places(ctx).find(x => x.id === id); return p ? `::: vz-mini vz-blast-slot-${id}\n${blastTwin(ctx, p)}\n:::` : '' }
export function decorate(page, ctx) {
    if (page.rel.endsWith('/newsroom/index.html') || !String(page.md || '').includes('<!-- viz:')) return
    const marks = [...String(page.md).matchAll(MARK)]
    if (!marks.length) return
    const prev = page.postHtml
    page.postHtml = html => {
        let h = prev ? prev(html) : html
        h = h.replace(/<div class="vz-mini vz-tree-slot">[\s\S]*?<\/div>/, () => `<div class="vz-mini">${treeHtml(ctx)}</div>`)
        h = h.replace(/<div class="vz-mini vz-blast-slot(?:-([a-z0-9-]+))?">[\s\S]*?<\/div>/g, (m, id) => { const p = places(ctx).find(x => x.id === (id || 'loule')); return p ? `<div class="vz-mini">${blastHtml(ctx, p, page.rel)}</div>` : m })
        return h
    }
}
