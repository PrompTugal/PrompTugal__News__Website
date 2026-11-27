// E, the home page (Silvio's mock E; Dinis, 6 November 2026, about 22:40 UTC; board/briefs/2026-11-06-front-page-mock-e.md).
// Filled from data, never hard-coded: the lead and the order from the correspondent's desks/correspondent/front-page.json
// (frontOrder), the briefing and the stories from the published articles, "This week" and "Now and next" from the
// agenda's items (the same data as api/v1/days.json), the numbers from the store. The markup and words are the component
// assets/front-e/ (front-e.tmpl); this file only computes. The marker <!-- front:e --> in content/index.md places it
// before the page's frame (page.before, in the shell), as one of the home page's designs (features/designs.mjs).
import fs from 'node:fs'
import path from 'node:path'
import { frontOrder, byline, minutes, imageFile, figureOf } from './front.mjs'
import { load, rank, cancelledDays } from './agenda.mjs'
import { WORDMARK } from '../lib/shell.mjs'
import { model as homeModel } from '../lib/home.mjs'
import { stripHtml } from './gamma.mjs'
export const order = 23

const T = fs.readFileSync(new URL('../../../assets/front-e/front-e.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const many = (n, list) => list.map(v => put(item(n), v)).join('')

const slugOf = a => a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
const beatOf = a => String(a.meta.beat || String(a.meta.tags || 'News').split(',')[0]).replace(/^connections:\s*/i, '').trim()
// a date on every card and headline (Dinis, 26 Nov: "a date on every card"): always absolute, "24 Nov", in a <time>; the page's own day
// is the build's day. A date given in front-page.json beside an article's slug ("date", ISO) wins over the article's own, so the correspondent can
// set the moment a headline is current from (the iOS app's JSON carries the same field).
const dayOf = v => String(v || '').slice(0, 10)
const ageDays = (ctx, v) => Math.round((Date.parse(ctx.TODAY) - Date.parse(dayOf(v))) / 864e5)
const nice = (ctx, v) => { const d = dayOf(v); if (!/^\d{4}-\d\d-\d\d$/.test(d) || isNaN(Date.parse(d))) return ''; 
    // one style, absolute ("16 Nov"; with the year when it is not this year): a built page is served long after it was built, so "Yesterday" goes wrong (no relative word anywhere, not even in a title, which would go stale the same way)
    const opts = { day: 'numeric', month: 'short', timeZone: 'UTC', ...(d.slice(0, 4) !== dayOf(ctx.TODAY).slice(0, 4) ? { year: 'numeric' } : {}) }
    return `<time class="fe-dt" datetime="${d}">${new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', opts)}</time>` }
const dt = (ctx, v) => { const t = nice(ctx, v); return t ? ' · ' + t : '' }
let FPDATES = null
const dateOf = (ctx, a) => { if (!FPDATES) { FPDATES = new Map(); try { const F = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'desks/correspondent/front-page.json'), 'utf8'))
        for (const e of [F.lead, ...(F.top || [])]) if (e && e.article && e.date) FPDATES.set(e.article, e.date) } catch {} }
    return FPDATES.get(slugOf(a)) || a.meta.date }
const cut = (t, max) => t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : t
// the pill only where true: "signed" when the article's signature is in the repository (the gate verifies every one
// against board/keys.json and refuses the release otherwise), "checked" when dev.verify@'s verified record exists
function pill(ctx, a) {
    const s = slugOf(a), has = f => fs.existsSync(path.join(ctx.ROOT, f))
    const parts = ['agent-written', has(`board/team/dev.verify/records/${s}/verified.json`) && 'checked', has(`${a.rel.replace(/\.html$/, '.md')}.sig`) && 'signed'].filter(Boolean)
    return parts.length > 1 ? put(item('pill'), { text: '✦ ' + parts.join(' · '), title: 'Written by an AI agent; ' + parts.slice(1).join(' and ') }) : ''
}
function picture(esc, a, size, lazy) {
    const i = imageFile(a, size); if (!i) return ''
    const [w, h] = size === 'card' ? [1200, 630] : [480, 480]
    // the lead's phone picture, where the designer made one (designer@'s E10: the card's type is too small on a phone)
    const ph = size === 'card' && i.src.replace('--card.png', '--phone.png'), phone = ph && fs.existsSync(new URL(`../../../${ph}`, import.meta.url)) ? put(item('phone'), { phone: ph, phone_ink: ph.replace('--paper--', '--ink--') }) : ''
    return put(item('picture'), { src: i.src, ink: i.src.replace('--paper--', '--ink--'), alt: esc(i.alt), w, h, phone, load: lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"' })
}
// an agenda item's moment, in Lisbon's time (UTC in November): "Today 15:00", "Sat 09:30", "Sat, all day"
const when = (ctx, i) => { const d = i.date === ctx.TODAY ? 'Today' : ctx.DAY(i.date).split(' ')[0].slice(0, 3); return i.start ? `${d} ${i.start}` : `${d}, all day` }
const endOf = i => `${i.date}T${i.end || i.start || '23:59'}:00Z`
const plusDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10)

// the optional lead fields the correspondent may set in front-page.json's "lead" (standfirst, developments, programme, last_checked, live);
// each is shown only when present, so the block is unchanged until they are filled; all text is escaped, links must be http(s) or site-relative
// outside links open in a new tab (the gate requires it); site-relative links stay as they are
const tgtOf = h => /^https?:\/\//i.test(h) ? ' target="_blank" rel="noopener"' : ''
const safeHref = h => /^(https?:\/\/|[a-z0-9][a-z0-9\-_\/.]*$)/i.test(String(h || '')) ? String(h) : ''
function leadExtra(ctx, a) {
    let L = {}
    try { L = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'desks/correspondent/front-page.json'), 'utf8')).lead || {} } catch { return {} }
    if (!L.article || L.article !== slugOf(a)) return {}
    const esc = ctx.md.esc, str = v => typeof v === 'string' ? v.trim() : ''
    const stamp = v => { const t = str(v); if (!t) return ''; const d = /^\d{4}-\d\d-\d\d[T ]\d\d:\d\d/.test(t) ? new Date(t) : null
        return d && !isNaN(d) ? `<time datetime="${d.toISOString()}">${d.toISOString().slice(11, 16)} UTC</time>` : esc(t) }
    const src = o => { const h = safeHref(o && o.source); if (!h) return ''; const c = stamp(o.checked)
        return put(item('lsrc'), { href: esc(h), tgt: tgtOf(h), checked: c ? put(item('lchecked'), { time: c }) : '' }) }
    const out = {}
    if (str(L.standfirst)) out.dek = esc(str(L.standfirst))  // the standfirst replaces the summary as the dek; the summary stays the fallback
    const p = L.programme
    if (p && str(p.text)) out.programme = put(item('programme'), { label: esc(str(p.label) || 'Programme'), text: esc(str(p.text)), src: src(p) })
    const devs = (Array.isArray(L.developments) ? L.developments : []).filter(d => d && str(d.text)).slice(0, 3)
    if (devs.length) out.developments = put(item('developments'), { items: devs.map(d => put(item('devitem'), { text: esc(str(d.text)), src: src(d) })).join('') })
    const lc = stamp(L.last_checked), lh = L.live && safeHref(L.live.href)
    if (lc || lh) out.live = put(item('live'), { lastchecked: lc ? put(item('lastchecked'), { time: lc }) : '', livelink: lh ? put(item('livelink'), { href: esc(lh), tgt: tgtOf(lh), label: esc(str(L.live.label) || 'Live updates') }) : '' })
    return out
}
// the satellite loop, in the lead's picture slot, for the article named in assets/satellite/loop.json. The static warning chart is no
// longer on the home page (it stays in the article): the HTML carries an empty satellite panel with the loop's configuration, and
// assets/satellite/loop.js loads the newest Meteosat frames from EUMETSAT's Web Map Service into it. If no satellite image can be loaded
// the panel says 'Satellite image unavailable right now' with a link to the article. No frames are stored here.
function satFigure(ctx, a) {
    let L; try { L = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/satellite/loop.json'), 'utf8')) } catch { return '' }
    if (L.article !== slugOf(a) || !L.live || !/^https:\/\/view\.eumetsat\.int\//.test(L.live.wms || '')) return ''
    const esc = ctx.md.esc
    const cfg = { live: L.live, credit: L.credit, product: L.product, terms: L.terms_url, policy: L.policy_url, source_url: L.source_url, lisbon: L.lisbon, delay: L.delay_minutes, check: L.check_minutes, min: L.min_frames, story: a.rel,
        alt: `Infrared satellite image of mainland Portugal and the Atlantic to its west, Lisbon marked. ${L.credit}, ${L.product}.` }
    return put(item('satfig'), { cfg: esc(JSON.stringify(cfg)), href: a.rel, credit: esc(L.credit), product: esc(L.product), terms: esc(L.terms_url), policy: esc(L.policy_url) })
}
// the lead links to the storm page when this is the satellite's article (S41) and the page's data exists
const stormLink = (ctx, a) => { try { const L = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/satellite/loop.json'), 'utf8')); return L.article === slugOf(a) && fs.existsSync(path.join(ctx.ROOT, 'desks/dev-vicky/storm/charles.json')) ? item('lstorm') : '' } catch { return '' } }
function lead(ctx, a) {
    if (!a) return part('none')
    const esc = ctx.md.esc, f = figureOf(a), fig = picture(esc, a, 'card', false)
    let headline = esc(a.meta.title)
    if (f?.value && headline.includes(esc(f.value))) headline = headline.replace(esc(f.value), put(item('mark'), { text: esc(f.value) }))
    return put(part('lead'), { href: a.rel, kicker: esc(a.meta.tags || beatOf(a)) + dt(ctx, dateOf(ctx, a)), headline, dek: esc(a.meta.summary || ''), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
        pill: pill(ctx, a), storm: stormLink(ctx, a), figure: satFigure(ctx, a) || (fig ? put(item('figure'), { href: a.rel, picture: fig, cap: 'AI-made image' }) : ''), ...leadExtra(ctx, a) })
}


// the places (Dinis, 16 Nov: the home page is the top place of the by-place tree): data/by-place/places.json and each
// place's file; for each town its counts and its newest signed article (content/articles/, front matter town:)
function placesOf(ctx, all) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const L = rd('data/by-place/places.json') || { places: [], copy: {} }
    const towns = L.places.filter(p => p.kind === 'municipality' || p.kind === 'city')   // every town and city (the map); the Algarve's list filters by parent
    const art = t => all.filter(a => a.meta.town === t).sort((x, y) => String(y.meta.date).localeCompare(String(x.meta.date)))[0]
    const first = t => { const m = String(t || '').match(/^.*?[.!?](?=\s|$)/); const x = (m ? m[0] : String(t || '')).trim(); if (x.length <= 100) return x
        // two lines at most, ended at a word, and never inside an open bracket (designer@, 27 Nov): "research (a…" becomes "research…"
        let y = x.slice(0, 99).replace(/\s+\S*$/, ''); const o = y.lastIndexOf('('); if (o > y.lastIndexOf(')')) y = y.slice(0, o).trimEnd()
        return y.replace(/[,;:\s]+$/, '') + '…' }
    const rows = towns.map(p => { const d = rd(`data/by-place/${p.id}.json`) || {}, a = art(p.id)
        // every dated item of the place: its local AI stories and its signed articles; the newest, and how many fall in the last day and the last week
        const ds = [...(d.ai_news || []).map(x => dayOf(x.date || x.read_on)), ...all.filter(x => x.meta.town === p.id).map(x => dayOf(x.meta.date))].filter(x => /^\d{4}-\d\d-\d\d$/.test(x)).sort().reverse()
        const within = n => ds.filter(x => ageDays(ctx, x) <= n).length
        return { p, d, news: (d.ai_news || []).length, map: (d.ai_map || []).length, a, n: (d.ai_news || [])[0], about: first(d.gravity && d.gravity.text), newest: ds[0] || '', day: within(1), wk: within(7) } })
    return { L, rows }
}

// the national map (Dinis, 16 Nov: "put a Portuguese map ... all the cities"): mainland Portugal from
// assets/portugal/portugal-outline.json (Natural Earth, public domain), a linked dot per place in places.json at its
// seat, sized by its stories, and a ring per district capital still to come (assets/portugal/next-places.json)
function ptMap(ctx, PR, named = new Set(), view = null) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const O = rd('assets/portugal/portugal-outline.json'), N = rd('assets/portugal/next-places.json')
    if (!O) return ''
    const V = view || { lon0: -9.65, lon1: -6.1, lat0: 36.85, lat1: 42.2 }, inV = ([lo, la]) => lo >= V.lon0 && lo <= V.lon1 && la >= V.lat0 && la <= V.lat1, k = Math.cos(39.5 * Math.PI / 180), W = 420
    const sc = W / ((V.lon1 - V.lon0) * k), H = Math.round((V.lat1 - V.lat0) * sc)
    const X = lo => ((lo - V.lon0) * k * sc).toFixed(1), Y = la => ((V.lat1 - la) * sc).toFixed(1)
    const land = (n, c) => (O.countries[n] || []).map(poly => put(item('mland'), { cls: c, d: poly.map(r => 'M' + r.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L') + 'Z').join('') })).join('')
    const esc = ctx.md.esc, algWk = PR.filter(r => r.p.parent === 'algarve' || r.p.parent === 'loule').reduce((n, r) => n + r.wk, 0)
    // the towns shown in the grid carry their names (designer@, 27 Nov), each at the first spot of eight around its dot that clears the labels already placed; the other pins stay plain
    const placed = [], lbl = new Map(), SPOTS = [[7, -8, 'start'], [7, 15, 'start'], [-7, -8, 'end'], [-7, 15, 'end'], [7, 4, 'start'], [-7, 4, 'end'], [0, -17, 'middle'], [0, 26, 'middle']]
    for (const r of PR.filter(r => named.has(r.p.id) && Array.isArray(r.p.at) && (!view || inV(r.p.at))).sort((a, b) => b.news - a.news)) {
        const x0 = +X(r.p.at[0]), y0 = +Y(r.p.at[1]), w = 6.6 * String(r.p.name).length
        const box = ([dx, dy, a]) => { const x = x0 + dx; return { x, y: y0 + dy, l: a === 'start' ? x : a === 'end' ? x - w : x - w / 2, t: y0 + dy - 10, w, h: 12 } }
        const hit = b => b.l < 2 || b.l + b.w > W - 2 || placed.some(o => b.l < o.l + o.w && o.l < b.l + b.w && b.t < o.t + o.h && o.t < b.t + b.h)
        const pick = SPOTS.find(sp => !hit(box(sp))) || SPOTS[0], b = box(pick); placed.push(b)
        lbl.set(r.p.id, put(item('mlbl'), { x: b.x.toFixed(1), y: b.y.toFixed(1), anchor: pick[2], name: esc(r.p.name) }))
    }
    const pins = PR.filter(r => Array.isArray(r.p.at) && (!view || inV(r.p.at))).map(r => put(item('mpin'), { href: r.p.path + 'index.html', title: esc(`${r.p.name}: ${r.news} local AI stories, ${r.map} on the AI map${r.day ? `; ${r.day} dated in the last day` : r.wk ? `; ${r.wk} dated in the last week` : ''}`),
        cls: r.day ? ' is-day' : r.wk ? ' is-week' : '', lbl: lbl.get(r.p.id) || '',
        cnt: r.wk && r.p.parent === 'portugal' ? put(item('mcnt'), { x: (+X(r.p.at[0]) + 8).toFixed(1), y: (+Y(r.p.at[1]) + 3).toFixed(1), n: r.wk }) : '', x: X(r.p.at[0]), y: Y(r.p.at[1]), r: (2.5 + Math.min(5, Math.sqrt(r.news + r.map) * 0.8)).toFixed(1) })).join('')
    const have = new Set(PR.map(r => r.p.id)), next = (N?.places || []).filter(q => !have.has(q.id) && (!view || inV(q.at))).map(q => put(item('mnext'), { title: esc(q.name), x: X(q.at[0]), y: Y(q.at[1]), lx: (+X(q.at[0]) + 6).toFixed(1), ly: (+Y(q.at[1]) + 3).toFixed(1) })).join('')
    return put(item('map'), { cls: view ? ' fe-ptmap-alg' : '', w: W, h: H, aria: view ? esc(`The Algarve, enlarged: ${named.size} towns named`) : esc(`Map of mainland Portugal: ${PR.length} places covered, ${(N?.places || []).length} district capitals to come`), body: land('Spain', 'es') + land('Portugal', 'pt') + next + pins, ax: X(-8.9), ay: Y(36.9),
        rg: view ? '' : 'The Algarve' + (algWk ? ` · ${algWk} this week` : '') })
}

// Now in the Algarve, one line under the ticker (Dinis, 16 Nov): data/by-place/now/ (board/tools/local-now.mjs); markup: front-e.tmpl
function nowLine(ctx) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const R = rd('data/by-place/now/algarve.json'), F = rd('data/by-place/now/faro.json'); if (!R) return ''
    // promptugal.news bills, so no IPMA values here (Dinis, 18 Nov 23:45: board/guidance/2026-11-18-billing-only-on-the-main-site.md):
    // Faro airport (adsb.lol, ODbL) and a link to the weather on weather.promptugal.news
    const esc = ctx.md.esc, ap = (F && F.airport) || R.airport
    const bits = [ap && put(item('nowlink'), { href: esc(ap.source), text: `Faro airport: ${ap.airline.length} airline flight${ap.airline.length === 1 ? '' : 's'} near` }),
        put(item('nowlink'), { href: 'https://weather.promptugal.news/places/algarve/', text: 'the weather and IPMA warnings: PrompTugal Weather' })].filter(Boolean)
    return put(item('now'), { bits: bits.join(' · '), at: esc(String(R.read_at).slice(11, 16)) })
}

// the numbers beside the stories (Dinis, 16 Nov: "add more statistics on the right-hand side"), all from the place files
function statsOf(ctx, PR, all) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const sum = f => PR.reduce((s, r) => s + f(r.d), 0), pubs = new Set(), types = {}
    for (const r of PR) { for (const x of r.d.ai_news || []) if (x.publisher) pubs.add(x.publisher); for (const x of r.d.ai_map || []) { const t = x.type || 'other'; types[t] = (types[t] || 0) + 1 } }
    const F = rd('data/by-place/now/faro.json'), signed = all.filter(a => fs.existsSync(path.join(ctx.ROOT, a.rel.replace(/\.html$/, '.md') + '.sig'))).length
    const rows = [[PR.length, 'places, an agent each'], [PR.filter(r => r.p.parent === 'algarve' || r.p.parent === 'loule').length, 'Algarve towns'], [PR.filter(r => r.p.parent === 'portugal').length, 'district capitals so far'],
        [sum(d => (d.ai_news || []).length), 'local AI stories, sourced'], [pubs.size, 'publishers read'], [sum(d => (d.ai_map || []).length), 'organisations on the AI maps'],
        ...Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t, n]) => [n, `on the maps: ${t}`]),
        [sum(d => (d.events || []).length), 'events'], [sum(d => (d.sources || []).length), 'sources the agents read'], [sum(d => (d.gaps || []).length), 'gaps: looked for, not found'],
        [all.filter(a => a.meta.region || a.meta.town).length, 'place stories written'], [signed, 'stories signed'],
        ...(F && F.airport ? [[F.airport.airline.length, `airline flight${F.airport.airline.length === 1 ? '' : 's'} near Faro at ${String(F.airport.at).slice(11, 16)} UTC`]] : [])]
    return rows.map(([n, label]) => ({ n, label: ctx.md.esc(label) }))
}

function fillE(page, ctx) {
    const esc = ctx.md.esc, { AGENDA, itemsOn } = load(ctx)
    const fo = frontOrder(ctx), placed = fo.filter(a => a.meta.region || a.meta.town).sort((x, y) => (y.meta.front_lead ? 1 : 0) - (x.meta.front_lead ? 1 : 0) || String(y.meta.date).localeCompare(String(x.meta.date)))
    const all = [...placed, ...fo.filter(a => !placed.includes(a))]
    // the lead is the correspondent's (front-page.json "lead": what leads, a PT decision of 26 Nov 2026 on the conductor's word); with none published,
    // the first placed article as before. The places band keeps its own lead: the placed stories below start from the first placed article.
    const FP = (() => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'desks/correspondent/front-page.json'), 'utf8')) } catch { return null } })()
    const pick = FP?.lead?.article && fo.find(a => slugOf(a) === FP.lead.article), theLead = pick || all[0]
    const { L: PL, rows: PR } = placesOf(ctx, all)
    // the Algarve's grid beside the map: the towns with the newest news first, capped so the two columns balance, then a link to all of them
    const algTowns = PR.filter(r => r.p.parent === 'algarve' || r.p.parent === 'loule').sort((x, y) => (y.newest || '').localeCompare(x.newest || '') || (y.news + y.map) - (x.news + x.map) || x.p.name.localeCompare(y.p.name))
    const ALG_CAP = 9
    const story = (a, i) => put(item('story'), { big: i ? '' : ' big', beat: esc(beatOf(a)) + dt(ctx, dateOf(ctx, a)), href: a.rel, title: esc(a.meta.title), dek: esc(cut(a.meta.summary || '', 170)), pill: pill(ctx, a),
        thumb: i && imageFile(a, 'thumb') ? put(item('thumb'), { href: a.rel, picture: picture(esc, a, 'thumb', true) }) : '' })
    // this week: today and the six days after it, the two that matter most each day
    const week = [...Array(7).keys()].map(n => plusDays(ctx.TODAY, n)).filter(d => !cancelledDays()[d]).flatMap(d => [...itemsOn(d)].sort((x, y) => rank(x) - rank(y) || (x.start || '').localeCompare(y.start || '')).slice(0, 2))
    const seenWk = new Set()
    const wk = week.filter(i => { const k = i.what.split(/:\s|\s\(/)[0]; return !seenWk.has(k) && seenWk.add(k) }).map(i => ({ href: `events/${i.id}/index.html`, date: i.date, when: esc(when(ctx, i)), what: esc(cut(i.what, 80)), where: i.where ? ' · ' + esc(i.where) : '' }))
    // now and next: what has not ended yet, in time order, the bigger moments first within a day (the page drops the ended)
    const seenNext = new Set()
    const next = AGENDA.items.filter(i => i.date >= ctx.TODAY && !cancelledDays()[i.date] && rank(i) <= 3 && !seenNext.has(i.date + i.what.split(/:\s|\s\(/)[0]) && seenNext.add(i.date + i.what.split(/:\s|\s\(/)[0])).sort((x, y) => x.date.localeCompare(y.date) || (x.start || '24:00').localeCompare(y.start || '24:00')).slice(0, 10)  // all-day things after the timed ones (sherpa@'s R6: lead with now)
    const fields = ctx.store.topics.filter(t => t.kind === 'field').map(t => [t, ctx.store.companies.filter(c => c.category === t.category).length]).filter(x => x[1]).sort((x, y) => y[1] - x[1])
    const max = fields[0]?.[1] || 1
    const opening = AGENDA.items.find(i => /opening night/i.test(i.what))
    const openingAt = opening ? `${opening.date}T${opening.start || '18:00'}:00Z` : ''
    const days = Math.ceil((Date.parse(openingAt) - Date.parse(ctx.TODAY + 'T12:00:00Z')) / 864e5)
    const signed = all.filter(a => fs.existsSync(path.join(ctx.ROOT, a.rel.replace(/\.html$/, '.md') + '.sig'))).length
    const [y, mo, d] = ctx.TODAY.split('-')
    page.before = (page.before || '') + put(part('page'), {
        today: ctx.TODAY, date: `${ctx.DAY(ctx.TODAY)} ${y}`, opening_at: openingAt, opening_in: days > 0 ? `${days}d` : '', name: esc(ctx.SITE.name), wordmark: WORDMARK(''),
        '#nav': many('nav', ctx.NAV.nav.map(n => ({ href: n.href, label: esc(n.label), cur: n.id === 'now' ? ' aria-current="page"' : '' }))),
        lead: lead(ctx, theLead),
        explainer: (() => { const x = FP && FP.explainer, rel = x && typeof x.path === 'string' ? x.path : ''   // the correspondent's link to the pay-for-what-you-read page: shown only for a page that exists
            return /^[a-z0-9-]+(\/[a-z0-9-]+)*\/index\.html$/.test(rel) && typeof x.label === 'string' && x.label.trim() && fs.existsSync(path.join(ctx.ROOT, 'content', rel.replace(/index\.html$/, 'index.md'))) ? many('explainer', [{ href: esc(rel), label: esc(cut(x.label.trim(), 80)) }]) : '' })(),
        spectrum: stripHtml(ctx, ''),   // GAMMA-Ray's cards under the lead (THE RESTART: the agentic edition), left out with no data
        ...(() => { const tk = PR.filter(r => r.a || r.n).map(r => r.a ? { href: r.a.rel, date: r.a.meta.date, when: esc(r.p.name), what: esc(cut(r.a.meta.title, 80)), where: '' } : { href: r.p.path + 'index.html', date: '', when: esc(r.p.name), what: esc(cut(r.n.title || r.n.headline || '', 80)), where: '' })
            return { '#week': many('week', tk), '#week_again': many('week', tk.map(w => ({ ...w, tab: ' tabindex="-1"' }))) } })(),
        places_all: `All ${algTowns.length} towns`, places_shown: String(Math.min(ALG_CAP, algTowns.length)), places_total: String(algTowns.length), places_intro: esc(PL.copy?.home_places_intro || ''), ptmap: ptMap(ctx, PR), ptmap_alg: ptMap(ctx, PR, new Set(algTowns.slice(0, ALG_CAP).map(r => r.p.id)), { lon0: -9.05, lon1: -7.3, lat0: 36.9, lat1: 37.55 }),
        ptk: (() => { const day = PR.filter(r => r.day), wk = PR.filter(r => r.wk && !r.day), n = wk.length + day.length
            // a legend entry only when its count is above zero: no "(0)" that reads as broken (designer@, 27 Nov)
            return [`<span class="on"></span> a place we cover`, n ? `<span class="on is-week"></span> dated news this week (${n})` : '', day.length ? `<span class="on is-day"></span> today or yesterday (${day.length})` : '', `<span class="next"></span> a district capital, coming next`].filter(Boolean).join(' ') })(), nowline: nowLine(ctx),
        '#places': many('place', algTowns.slice(0, ALG_CAP).map(r => ({ href: r.p.path + 'index.html', name: esc(r.p.name), counts: `${r.news} stories · ${r.map} on the AI map`, about: esc(r.about),
            newest: r.a ? put(item('pnew'), { href: r.a.rel, date: nice(ctx, r.a.meta.date), title: esc(cut(r.a.meta.title, 80)) }) : r.n && r.n.title ? put(item('pnew'), { href: r.p.path + 'index.html#local', date: nice(ctx, r.n.date || r.n.read_on), title: esc(cut(r.n.title, 80)) }) : '' }))),
        '#stats': many('stat', statsOf(ctx, PR, all).slice(0, 4)), '#stats_more': many('stat', statsOf(ctx, PR, all).slice(4)), nstats: String(statsOf(ctx, PR, all).length),
        '#briefing': many('brief', all.filter(a => !(a.meta.region || a.meta.town) && a !== theLead).slice(0, 8).map(a => ({ href: a.rel, title: esc(a.meta.title), beat: esc(beatOf(a)) + dt(ctx, dateOf(ctx, a)) }))),  // national and international (Dinis, 16 Nov): what has no place, in the correspondent's order
        '#stories': placed.filter(a => a !== theLead).slice(pick && !placed.includes(pick) ? 0 : 1, pick && !placed.includes(pick) ? 8 : 9).map(story).join(''),
        '#next': many('next', next.map(i => ({ href: `events/${i.id}/index.html`, date: i.date, end: endOf(i), when: esc(when(ctx, i)), what: esc(cut(i.what, 110)), where: esc(i.where || '') }))),
        '#radar': many('radar', fields.slice(0, 6).map(([t, n]) => ({ href: `topics/${t.id}/index.html`, name: esc(t.name), n, pct: Math.round(100 * n / max) }))),
        '#nums': many('num', [[PR.length, 'places, an agent each'], [PR.reduce((s, r) => s + r.news, 0), 'local AI stories, sourced'], [PR.reduce((s, r) => s + r.map, 0), 'AI builders mapped'], [signed, 'stories, signed']].map(([value, label]) => ({ value, label }))),
        '#asks': many('ask', ['AI companies in Faro', 'Who builds AI in Loulé?', 'Startups in the Algarve'].map(q => ({ q: encodeURIComponent(q), text: esc(q) }))),
    })
    return ''
}

// the home page carries E's look and its script
export function decorate(p, ctx) {
    if (p.rel !== 'index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/front-e/front-e.css'], js: [...(p.assets?.js || []), 'assets/front-e/front-e.js', ...(fs.existsSync(path.join(ctx.ROOT, 'assets/satellite/loop.json')) ? ['assets/satellite/loop.js'] : [])] }
}
export const fill = { 'front:e': fillE }
