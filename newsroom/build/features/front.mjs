// The front page "Now" (design/README.md, the front page): the lead story, the field tiles and what is on around the
// summit next, as fills the prose places (content/index.md): <!-- front:lead -->, <!-- front:latest -->,
// <!-- front:fields -->, <!-- front:around -->. Markdown with the design's class hooks; the twin reads as plain text.
import fs from 'node:fs'
import { articlesOf } from './articles.mjs'
import { load, rank, KIND } from './agenda.mjs'
import { refLink, slotLine, slotList } from '../lib/present.mjs'
export const order = 22

// the designer's article images (design/infographics/out/, listed in index.json) and the words behind each
// (articles.json): a thumb for a list, a card for the lead. An article with no image renders without a box.
const OUT = 'design/infographics/out/'
const read = f => { try { return JSON.parse(fs.readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8')) } catch { return null } }
const have = new Set((read(OUT + 'index.json')?.images || []).map(i => i.file))
const words = Object.fromEntries((read('design/infographics/articles.json')?.articles || []).map(a => [a.slug, a]))
// an article's image as data ({ src, alt }, or null), for a fill that writes markdown (imageOf) or a component (front-e)
export const imageFile = (a, size) => {
    const slug = a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
    const file = `${slug}--paper--${size}.png`
    if (!have.has(file)) return null
    const w = words[slug]
    const alt = (w ? `${w.short_title}: ${w.figure?.value ? w.figure.value + ' ' + w.figure.label : w.points?.[0]?.text}` : a.meta.title).replace(/[\[\]()]/g, '')
    return { src: OUT + file, alt }
}
export const figureOf = a => words[a.rel.replace(/^articles\//, '').replace(/\.html$/, '')]?.figure || null
export const imageOf = (ctx, page, a, size) => {
    const i = imageFile(a, size)
    return i ? `![${i.alt}](${ctx.link(page.rel, i.src)})` : ''
}
export const firstSentence = (t, max = 150) => { const s = (t.match(/^.*?[.!?](?=\s|$)/) || [t])[0]; return s.length > max ? s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : s }

// the correspondent's choices (desks/correspondent/front-page.json, kept by correspondent@): its lead, then its top
// stories in its order, then every other article newest first. A slug that is not a published article is skipped.
const FRONT = read('desks/correspondent/front-page.json')
const slugOf = a => a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
export function frontOrder(ctx) {
    const all = articlesOf(ctx), by = new Map(all.map(a => [slugOf(a), a]))
    const picks = [FRONT?.lead?.article, ...(FRONT?.top || []).map(t => t.article)].filter(s => s && by.has(s))
    const seen = new Set(picks)
    return [...picks.map(s => by.get(s)), ...all.filter(a => !seen.has(slugOf(a)))]
}

// a byline that names the agent in words (designer@'s F6, F10; sherpa@'s F9: the address stays on the article):
// journalist-portugal@web-summit.vicky, for Vicky Wang -> "the Portugal desk, an AI agent, for Vicky Wang"
const OWNER = { dinis: 'Dinis Cruz', vicky: 'Vicky Wang', indi: 'Indi Gupte' }
const ROLE = { security: 'the security agent', newsroom: 'the newsroom', conductor: 'the conductor' }
export function byline(author) {
    const first = String(author || '').split(',')[0].trim(), forr = (String(author).match(/, for ([^,]+)/) || [])[1]
    const [local, domain = ''] = first.split('@'), [role, desk] = local.split('-')
    const who = ROLE[role] && !desk ? ROLE[role] : desk ? `the ${desk === 'ai' ? 'AI' : desk.charAt(0).toUpperCase() + desk.slice(1)} desk` : `the ${role}`
    const owner = forr || OWNER[domain.split('.').pop()]
    return `${who}, an AI agent${owner ? `, for ${owner}` : ''}`
}
export const minutes = md => Math.max(1, Math.round(md.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length / 230))

// a beat as a link to its topic page (dev.pages@, sherpa F6), when a topic of that name exists; else the plain words
const beatLink = (ctx, page, beat) => {
    const b = String(beat || '').replace(/["']/g, '').replace(/^connections:\s*/i, '').replace(/\s*\(.*\)$/, '').trim()
    const t = ctx.store.topics.find(x => x.name.toLowerCase() === b.toLowerCase())
    return b ? (t ? `[${t.name}](${ctx.link(page.rel, `topics/${t.id}/index.html`)})` : `\`${b}\``) : ''
}
// two second stories under the lead (designer@'s F8, A): a picture, the kicker, the headline
function seconds(ctx, page) {
    const two = frontOrder(ctx).slice(1, 3); if (!two.length) return ''
    return '\n\n{.rows .seconds}\n' + two.map(a => { const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'thumb')
        return `- ${img ? `[${img}](${href}) ` : ''}${beatLink(ctx, page, a.meta.beat || String(a.meta.tags || 'News').split(',')[0])} **[${a.meta.title}](${href})** *${byline(a.meta.author)}*` }).join('\n')
}

export const fill = {
    // now and next in three lines (designer@'s F5, A): today's first thing, then the next two moments
    'front:next': (page, ctx) => {
        const { days, itemsOn, TODAY, DAY } = load(ctx), out = []
        for (const d of days.filter(d => d >= TODAY)) {
            const top = [...itemsOn(d)].sort((a, b) => rank(a) - rank(b) || (a.time || '').localeCompare(b.time || ''))[0]
            if (top) out.push(`- \`${d === TODAY ? 'Today ' : ''}${DAY(d).split(' ')[0].slice(0, 3)} ${DAY(d).split(' ')[1]}\` [${ctx.md.cell(String(top.what).split(/:\s|\s\(/)[0])}](${ctx.link(page.rel, `events/${top.id}/index.html`)})${top.where ? ` *${ctx.md.cell(top.where)}*` : ''}`)  // its place (sherpa@'s H2)
            if (out.length === 3) break
        }
        return out.length ? `{.rows .next3}\n${out.join('\n')}` : ''
    },
    // C's briefing card above the lead on the summit days (9 to 12 November): today's five things, and the way to the day
    // page. Empty on every other day (guidance 6 Nov 13:20, the front page: A now, C's card on the summit days).
    'front:briefing': (page, ctx) => {
        const { itemsOn, TODAY, DAY } = load(ctx)
        if (TODAY < '2026-11-09' || TODAY > '2026-11-12') return ''
        const five = [...itemsOn(TODAY)].sort((a, b) => (rank(a) - rank(b)) || (a.time || '').localeCompare(b.time || '')).slice(0, 5).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
        return `{.notice .brand}\n**Today at Web Summit: ${DAY(TODAY)}.** Five things to plan around, then [the whole day](${ctx.link(page.rel, `days/${TODAY}/index.html`)}).\n\n` +
            slotList(five.map(e => slotLine(ctx, page.rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })))
    },
    'front:lead': (page, ctx) => {
        const a = frontOrder(ctx)[0]
        if (!a) return 'Our first article is on the way.'
        const img = imageOf(ctx, page, a, 'card')
        return (img ? `{.lead-fig}\n[${img}](${ctx.link(page.rel, a.rel)})\n\n` : '') + `{.kicker}\n${ctx.md.cell(a.meta.tags || 'News')}\n\n{.lead-hed}\n[${a.meta.title}](${ctx.link(page.rel, a.rel)})\n\n{.dek}\n${a.meta.summary}\n\n{.meta-line}\n${byline(a.meta.author)} · ${minutes(a.md)} min · signed` + seconds(ctx, page)
    },
    'front:latest': (page, ctx) => {
        const rest = frontOrder(ctx).slice(3)
        const row = a => {
            const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'thumb')
            return `- ${img ? `[${img}](${href}) ` : ''}${beatLink(ctx, page, a.meta.beat || String(a.meta.tags || 'News').split(',')[0])} **[${a.meta.title}](${href})** *${byline(a.meta.author)}*`
        }
        return rest.length ? `{.rows .news}\n${rest.map(row).join('\n')}` : 'The next articles will appear here, newest first. Each is written from the desks\' research, fact-checked, and signed with the newsroom\'s key.'
    },
    'front:fields': (page, ctx) => {
        const fields = ctx.store.topics.filter(t => t.kind === 'field').map(t => [t, ctx.store.companies.filter(c => c.category === t.category).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1])
        return `{.field-list}\n${fields.map(([t, n]) => `- [${t.name} \`${n}\`](${ctx.link(page.rel, `topics/${t.id}/index.html`)})`).join('\n')}`
    },
    'front:around': (page, ctx) => {
        const next = ctx.store.events.filter(e => e.organiser === 'other' && (e.end_date || e.date) >= ctx.TODAY).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))).slice(0, 3)
        return next.length ? `{.agenda .cols}\n${next.map(e => slotLine(ctx, page.rel, e)).join('\n')}` : 'Nothing else in our programme from today.'
    },
}
