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
    return put(part('lead'), { href: a.rel, kicker: esc(a.meta.tags || beatOf(a)), headline, dek: esc(a.meta.summary || ''), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
        pill: pill(ctx, a), storm: stormLink(ctx, a), figure: satFigure(ctx, a) || (fig ? put(item('figure'), { href: a.rel, picture: fig, cap: 'AI-made image' }) : ''), ...leadExtra(ctx, a) })
}


// the places (Dinis, 16 Nov: the home page is the top place of the by-place tree): data/by-place/places.json and each
// place's file; for each town its counts and its newest signed article (content/articles/, front matter town:)
function placesOf(ctx, all) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const L = rd('data/by-place/places.json') || { places: [], copy: {} }
    const towns = L.places.filter(p => p.kind === 'municipality' || p.kind === 'city')   // every town and city (the map); the Algarve's list filters by parent
    const art = t => all.filter(a => a.meta.town === t).sort((x, y) => String(y.meta.date).localeCompare(String(x.meta.date)))[0]
    const rows = towns.map(p => { const d = rd(`data/by-place/${p.id}.json`) || {}; return { p, news: (d.ai_news || []).length, map: (d.ai_map || []).length, a: art(p.id), n: (d.ai_news || [])[0] } })
    return { L, rows }
}

// the national map (Dinis, 16 Nov: "put a Portuguese map ... all the cities"): mainland Portugal from
// assets/portugal/portugal-outline.json (Natural Earth, public domain), a linked dot per place in places.json at its
// seat, sized by its stories, and a ring per district capital still to come (assets/portugal/next-places.json)
function ptMap(ctx, PR) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const O = rd('assets/portugal/portugal-outline.json'), N = rd('assets/portugal/next-places.json')
    if (!O) return ''
    const V = { lon0: -9.65, lon1: -6.1, lat0: 36.85, lat1: 42.2 }, k = Math.cos(39.5 * Math.PI / 180), W = 420
    const sc = W / ((V.lon1 - V.lon0) * k), H = Math.round((V.lat1 - V.lat0) * sc)
    const X = lo => ((lo - V.lon0) * k * sc).toFixed(1), Y = la => ((V.lat1 - la) * sc).toFixed(1)
    const land = (n, c) => (O.countries[n] || []).map(poly => put(item('mland'), { cls: c, d: poly.map(r => 'M' + r.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L') + 'Z').join('') })).join('')
    const esc = ctx.md.esc
    const pins = PR.filter(r => Array.isArray(r.p.at)).map(r => put(item('mpin'), { href: r.p.path + 'index.html', title: esc(`${r.p.name}: ${r.news} local AI stories, ${r.map} on the AI map`), x: X(r.p.at[0]), y: Y(r.p.at[1]), r: (2.5 + Math.min(5, Math.sqrt(r.news + r.map) * 0.8)).toFixed(1) })).join('')
    const have = new Set(PR.map(r => r.p.id)), next = (N?.places || []).filter(q => !have.has(q.id)).map(q => put(item('mnext'), { title: esc(q.name), x: X(q.at[0]), y: Y(q.at[1]), lx: (+X(q.at[0]) + 6).toFixed(1), ly: (+Y(q.at[1]) + 3).toFixed(1) })).join('')
    return put(item('map'), { w: W, h: H, aria: esc(`Map of mainland Portugal: ${PR.length} places covered, ${(N?.places || []).length} district capitals to come`), body: land('Spain', 'es') + land('Portugal', 'pt') + next + pins, ax: X(-8.9), ay: Y(36.9) })
}

// Now in the Algarve, one line under the ticker (Dinis, 16 Nov): data/by-place/now/ (board/tools/local-now.mjs); markup: front-e.tmpl
function nowLine(ctx) {
    const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }
    const R = rd('data/by-place/now/algarve.json'), F = rd('data/by-place/now/faro.json'); if (!R) return ''
    const esc = ctx.md.esc, r = F && F.station && F.station.reading, fr = F && F.fire_risk && F.fire_risk.days[0], w = R.warnings.active
    const bits = [r && put(item('nowlink'), { href: esc(F.station.source), text: `Faro ${r.temp_c} °C` }), fr && esc(`fire risk ${fr.level}`),
        put(item('nowlink'), { href: esc(R.warnings.source), text: w.length ? esc('IPMA: ' + w.map(x => `${x.level} ${x.type} from ${String(x.start).slice(5, 10)}`).join(', ')) : 'IPMA: no warning' }),
        R.airport && put(item('nowlink'), { href: esc(R.airport.source), text: `Faro airport: ${R.airport.airline.length} airline flights near` })].filter(Boolean)
    return put(item('now'), { bits: bits.join(' · '), at: esc(String(R.read_at).slice(11, 16)) })
}

function fillE(page, ctx) {
    const esc = ctx.md.esc, { AGENDA, itemsOn } = load(ctx)
    const fo = frontOrder(ctx), placed = fo.filter(a => a.meta.region || a.meta.town).sort((x, y) => (y.meta.front_lead ? 1 : 0) - (x.meta.front_lead ? 1 : 0) || String(y.meta.date).localeCompare(String(x.meta.date)))
    const all = [...placed, ...fo.filter(a => !placed.includes(a))]
    const { L: PL, rows: PR } = placesOf(ctx, all)
    const story = (a, i) => put(item('story'), { big: i ? '' : ' big', beat: esc(beatOf(a)), href: a.rel, title: esc(a.meta.title), dek: esc(cut(a.meta.summary || '', 170)), pill: pill(ctx, a),
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
        lead: lead(ctx, all[0]),
        spectrum: stripHtml(ctx, ''),   // GAMMA-Ray's cards under the lead (THE RESTART: the agentic edition), left out with no data
        ...(() => { const tk = PR.filter(r => r.a || r.n).map(r => r.a ? { href: r.a.rel, date: r.a.meta.date, when: esc(r.p.name), what: esc(cut(r.a.meta.title, 80)), where: '' } : { href: r.p.path + 'index.html', date: '', when: esc(r.p.name), what: esc(cut(r.n.title || r.n.headline || '', 80)), where: '' })
            return { '#week': many('week', tk), '#week_again': many('week', tk.map(w => ({ ...w, tab: ' tabindex="-1"' }))) } })(),
        places_intro: esc(PL.copy?.home_places_intro || ''), ptmap: ptMap(ctx, PR), nowline: nowLine(ctx),
        '#places': many('place', PR.filter(r => r.p.parent === 'algarve' || r.p.parent === 'loule').map(r => ({ href: r.p.path + 'index.html', name: esc(r.p.name), counts: `${r.news} · ${r.map}`, newest: r.a ? put(item('pnew'), { href: r.a.rel, title: esc(cut(r.a.meta.title, 70)) }) : '' }))),
        '#briefing': many('brief', all.filter(a => !(a.meta.region || a.meta.town)).slice(0, 8).map(a => ({ href: a.rel, title: esc(a.meta.title), beat: esc(beatOf(a)) }))),  // national and international (Dinis, 16 Nov): what has no place, in the correspondent's order
        '#stories': placed.slice(1, 9).map(story).join(''),
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
