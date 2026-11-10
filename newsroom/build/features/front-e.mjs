// E, the home page (Silvio's mock E; Dinis, 6 November 2026, about 22:40 UTC; board/briefs/2026-11-06-front-page-mock-e.md).
// Filled from data, never hard-coded: the lead and the order from the correspondent's desks/correspondent/front-page.json
// (frontOrder), the briefing and the stories from the published articles, "This week" and "Now and next" from the
// agenda's items (the same data as api/v1/days.json), the numbers from the store. The markup and words are the component
// assets/front-e/ (front-e.tmpl); this file only computes. The marker <!-- front:e --> in content/index.md places it
// before the page's frame (page.before, in the shell), as one of the home page's designs (features/designs.mjs).
import fs from 'node:fs'
import path from 'node:path'
import { frontOrder, byline, minutes, imageFile, figureOf } from './front.mjs'
import { load, rank } from './agenda.mjs'
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
// the satellite loop: the lead's chart stays in the HTML (it is what shows while the live frames load, and the fallback if none
// are usable); for the article named in assets/satellite/loop.json the chart's figure carries the loop's configuration, and
// assets/satellite/loop.js swaps the loop in once frames from EUMETSAT's Web Map Service have loaded. No frames are stored here.
function satAttr(ctx, a) {
    let L; try { L = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/satellite/loop.json'), 'utf8')) } catch { return '' }
    if (L.article !== slugOf(a) || !L.live || !/^https:\/\/view\.eumetsat\.int\//.test(L.live.caps || '') || !/^https:\/\/view\.eumetsat\.int\//.test(L.live.wms || '')) return ''
    const cfg = { live: L.live, credit: L.credit, source_url: L.source_url, lisbon: L.lisbon, delay: L.delay_minutes, check: L.check_minutes, min: L.min_frames,
        alt: 'Infrared satellite image of mainland Portugal and the Atlantic to its west, Lisbon marked' }
    return ` data-sat="${ctx.md.esc(JSON.stringify(cfg))}"`
}
function lead(ctx, a) {
    if (!a) return part('none')
    const esc = ctx.md.esc, f = figureOf(a), fig = picture(esc, a, 'card', false)
    let headline = esc(a.meta.title)
    if (f?.value && headline.includes(esc(f.value))) headline = headline.replace(esc(f.value), put(item('mark'), { text: esc(f.value) }))
    return put(part('lead'), { href: a.rel, kicker: esc(a.meta.tags || beatOf(a)), headline, dek: esc(a.meta.summary || ''), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
        pill: pill(ctx, a), figure: fig ? put(item('figure'), { href: a.rel, picture: fig, sat: satAttr(ctx, a) }) : '', ...leadExtra(ctx, a) })
}

function fillE(page, ctx) {
    const esc = ctx.md.esc, all = frontOrder(ctx), { AGENDA, itemsOn } = load(ctx)
    const story = (a, i) => put(item('story'), { big: i ? '' : ' big', beat: esc(beatOf(a)), href: a.rel, title: esc(a.meta.title), dek: esc(cut(a.meta.summary || '', 170)), pill: pill(ctx, a),
        thumb: i && imageFile(a, 'thumb') ? put(item('thumb'), { href: a.rel, picture: picture(esc, a, 'thumb', true) }) : '' })
    // this week: today and the six days after it, the two that matter most each day
    const week = [...Array(7).keys()].map(n => plusDays(ctx.TODAY, n)).flatMap(d => [...itemsOn(d)].sort((x, y) => rank(x) - rank(y) || (x.start || '').localeCompare(y.start || '')).slice(0, 2))
    const seenWk = new Set()
    const wk = week.filter(i => { const k = i.what.split(/:\s|\s\(/)[0]; return !seenWk.has(k) && seenWk.add(k) }).map(i => ({ href: `events/${i.id}/index.html`, date: i.date, when: esc(when(ctx, i)), what: esc(cut(i.what, 80)), where: i.where ? ' · ' + esc(i.where) : '' }))
    // now and next: what has not ended yet, in time order, the bigger moments first within a day (the page drops the ended)
    const seenNext = new Set()
    const next = AGENDA.items.filter(i => i.date >= ctx.TODAY && rank(i) <= 3 && !seenNext.has(i.date + i.what.split(/:\s|\s\(/)[0]) && seenNext.add(i.date + i.what.split(/:\s|\s\(/)[0])).sort((x, y) => x.date.localeCompare(y.date) || (x.start || '24:00').localeCompare(y.start || '24:00')).slice(0, 10)  // all-day things after the timed ones (sherpa@'s R6: lead with now)
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
        '#week': many('week', wk), '#week_again': many('week', wk.map(w => ({ ...w, tab: ' tabindex="-1"' }))),
        '#briefing': many('brief', homeModel(ctx).briefing.map(x => ({ href: x.href, title: x.title, beat: x.beat }))),  // the correspondent's five (front-page.json 'briefing'), else the next five
        '#stories': all.slice(1, 5).map(story).join(''),
        '#next': many('next', next.map(i => ({ href: `events/${i.id}/index.html`, date: i.date, end: endOf(i), when: esc(when(ctx, i)), what: esc(cut(i.what, 110)), where: esc(i.where || '') }))),
        '#radar': many('radar', fields.slice(0, 6).map(([t, n]) => ({ href: `topics/${t.id}/index.html`, name: esc(t.name), n, pct: Math.round(100 * n / max) }))),
        '#nums': many('num', [[ctx.store.companies.length, 'companies followed'], [week.length && [...Array(7).keys()].reduce((s, n) => s + itemsOn(plusDays(ctx.TODAY, n)).length, 0), 'events this week'], [signed, 'stories, signed'], ['9 to 12', 'November, Lisbon']].map(([value, label]) => ({ value, label }))),
        '#asks': many('ask', ['Which AI agent companies are at Web Summit?', 'What is on Tuesday for security?', 'Portuguese startups raising money'].map(q => ({ q: encodeURIComponent(q), text: esc(q) }))),
    })
    return ''
}

// the home page carries E's look and its script
export function decorate(p, ctx) {
    if (p.rel !== 'index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/front-e/front-e.css'], js: [...(p.assets?.js || []), 'assets/front-e/front-e.js', ...(fs.existsSync(path.join(ctx.ROOT, 'assets/satellite/loop.json')) ? ['assets/satellite/loop.js'] : [])] }
}
export const fill = { 'front:e': fillE }
