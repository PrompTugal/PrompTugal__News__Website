// What every design of the home page is made from (board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md):
// one model of the page's data, computed once per build, and a loader for a design's template. A design is a feature
// (features/front-<id>.mjs) with its component in assets/front-<id>/: it fills its template from this model and appends
// its layout to the home page's page.before, wrapped in .pt-design[data-design-of="<id>"]; features/designs.mjs offers it.
// Sources: the correspondent's desks/correspondent/front-page.json (lead, top, beats, briefing) through frontOrder, the
// published articles, the agenda's items (the same data as api/v1/days.json), the store. Nothing hard-coded.
import fs from 'node:fs'
import path from 'node:path'
import { frontOrder, byline, minutes, imageFile, figureOf } from '../features/front.mjs'
import { load, rank } from '../features/agenda.mjs'

// a component's template: parts (<!-- part:name -->) and one-line items (<!-- item:name -->), {{value}} and {{#list}}
export function tmpl(rel) {
    const T = fs.readFileSync(new URL(`../../../${rel}`, import.meta.url), 'utf8')
    const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
    const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
    const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
    const many = (n, list) => list.map(v => put(item(n), v)).join('')
    return { part, item, put, many }
}

export const slugOf = a => a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
export const beatOf = a => String(a.meta.beat || String(a.meta.tags || 'News').split(',')[0]).replace(/^connections:\s*/i, '').trim()
export const cut = (t, max) => { t = String(t || ''); return t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : t }
const plusDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10)
const read = (ROOT, f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')) } catch { return null } }

let M
export function model(ctx) {
    if (M) return M
    const esc = ctx.md.esc, has = f => fs.existsSync(path.join(ctx.ROOT, f)), all = frontOrder(ctx)
    const FRONT = read(ctx.ROOT, 'desks/correspondent/front-page.json') || {}, words = read(ctx.ROOT, 'design/infographics/articles.json')?.articles || []
    const bySlug = new Map(all.map(a => [slugOf(a), a]))
    const { AGENDA, itemsOn } = load(ctx)
    // an article as the designs need it: the words escaped, its pill (only where true), its picture's data
    const art = a => {
        const s = slugOf(a), signed = has(`${a.rel.replace(/\.html$/, '.md')}.sig`), checked = has(`board/team/dev.verify/records/${s}/verified.json`)
        const f = figureOf(a), title = esc(a.meta.title)
        return { a, slug: s, href: a.rel, title, beat: esc(beatOf(a)), tags: esc(a.meta.tags || beatOf(a)), dek: esc(a.meta.summary || ''), dekShort: esc(cut(a.meta.summary, 150)), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
            signed, checked, pill: ['agent-written', checked && 'checked', signed && 'signed'].filter(Boolean), figure: f?.value && title.includes(esc(f.value)) ? esc(f.value) : '',
            card: imageFile(a, 'card'), thumb: imageFile(a, 'thumb'), points: (words.find(w => w.slug === s)?.points || []).map(p => esc(p.text)) }
    }
    const when = i => { const d = i.date === ctx.TODAY ? 'Today' : ctx.DAY(i.date).split(' ')[0].slice(0, 3); return i.start ? `${d} ${i.start}` : `${d}, all day` }
    const ev = i => ({ href: `events/${i.id}/index.html`, date: i.date, end: `${i.date}T${i.end || i.start || '23:59'}:00Z`, when: esc(when(i)), what: esc(i.what), where: esc(i.where || '') })
    const seen = new Set()
    const weekItems = [...Array(7).keys()].map(n => plusDays(ctx.TODAY, n)).flatMap(d => [...itemsOn(d)].sort((x, y) => rank(x) - rank(y) || (x.start || '').localeCompare(y.start || '')).slice(0, 2))
        .filter(i => { const k = i.what.split(/:\s|\s\(/)[0]; return !seen.has(k) && seen.add(k) })
    const seenNext = new Set()  // one line per thing per day (sherpa@'s E1: the same registration three times)
    const next = AGENDA.items.filter(i => i.date >= ctx.TODAY && rank(i) <= 3 && !seenNext.has(i.date + i.what.split(/:\s|\s\(/)[0]) && seenNext.add(i.date + i.what.split(/:\s|\s\(/)[0])).sort((x, y) => x.date.localeCompare(y.date) || (x.start || '24:00').localeCompare(y.start || '24:00')).slice(0, 10)  // all-day things after the timed ones (sherpa@'s R6: lead with now)
    const fields = ctx.store.topics.filter(t => t.kind === 'field').map(t => ({ href: `topics/${t.id}/index.html`, name: esc(t.name), n: ctx.store.companies.filter(c => c.category === t.category).length })).filter(x => x.n).sort((x, y) => y.n - x.n)
    fields.forEach(f => { f.pct = Math.round(100 * f.n / (fields[0]?.n || 1)) })
    const opening = AGENDA.items.find(i => /opening night/i.test(i.what)), openingAt = opening ? `${opening.date}T${opening.start || '18:00'}:00Z` : ''
    const days = Math.ceil((Date.parse(openingAt) - Date.parse(ctx.TODAY + 'T12:00:00Z')) / 864e5)
    const eventsThisWeek = [...Array(7).keys()].reduce((s, n) => s + itemsOn(plusDays(ctx.TODAY, n)).length, 0)
    // the correspondent's beats (desks/correspondent/front-page.json "beats"): each a section with its published articles
    const beats = (FRONT.beats || []).map(b => ({ name: esc(b.beat), articles: (b.articles || []).filter(s => bySlug.has(s)).map(s => art(bySlug.get(s))) })).filter(b => b.articles.length)
    const briefing = (FRONT.briefing?.items || []).map(i => bySlug.get(i.article)).filter(Boolean)
    const [y] = ctx.TODAY.split('-')
    return M = {
        articles: all.map(art), beats, briefing: (briefing.length >= 3 ? briefing : all.slice(5, 10)).map(art),
        week: weekItems.map(ev), next: next.map(ev), fields,
        nums: [[ctx.store.companies.length, 'companies followed'], [eventsThisWeek, 'events this week'], [all.filter(a => has(`${a.rel.replace(/\.html$/, '.md')}.sig`)).length, 'stories, signed'], ['9 to 12', 'November, Lisbon']].map(([value, label]) => ({ value, label })),
        today: ctx.TODAY, date: `${ctx.DAY(ctx.TODAY)} ${y}`, openingAt, openingIn: days > 0 ? `${days}d` : '',
        nav: ctx.NAV.nav.map(n => ({ href: n.href, label: esc(n.label), cur: n.id === 'now' ? ' aria-current="page"' : '' })),
        asks: ['Which AI agent companies are at Web Summit?', 'What is on Tuesday for security?', 'Portuguese startups raising money'].map(q => ({ q: encodeURIComponent(q), text: esc(q) })),
    }
}

// a design's common fills, with its own template's items: the pill, a picture, the headline with its figure marked
export function pieces(t) {
    const pill = x => x.pill.length > 1 ? t.put(t.item('pill'), { text: '✦ ' + x.pill.join(' · '), title: 'Written by an AI agent; ' + x.pill.slice(1).join(' and ') }) : ''
    const picture = (x, size, lazy = true) => {
        const i = size === 'card' ? x.card : x.thumb; if (!i) return ''
        const [w, h] = size === 'card' ? [1200, 630] : [480, 480]
        return t.put(t.item('picture'), { src: i.src, ink: i.src.replace('--paper--', '--ink--'), alt: i.alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'), w, h, load: lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"' })
    }
    const headline = x => x.figure ? x.title.replace(x.figure, t.put(t.item('mark'), { text: x.figure })) : x.title
    return { pill, picture, headline }
}

// a design's assets on the home page
export const homeAssets = (p, id, js) => {
    if (p.rel !== 'index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), `assets/front-${id}/front-${id}.css`], js: [...(p.assets?.js || []), ...(js ? [`assets/front-${id}/front-${id}.js`] : [])] }
}
