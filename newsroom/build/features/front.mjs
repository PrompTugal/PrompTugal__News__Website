// The front page "Now" (design/README.md, the front page): the lead story, the field tiles and what is on around the
// summit next, as fills the prose places (content/index.md): <!-- front:lead -->, <!-- front:latest -->,
// <!-- front:fields -->, <!-- front:around -->. Markdown with the design's class hooks; the twin reads as plain text.
import fs from 'node:fs'
import { articlesOf } from './articles.mjs'
import { refLink, slotLine, slotList } from '../lib/present.mjs'
export const order = 22

// the designer's article images (design/infographics/out/, listed in index.json) and the words behind each
// (articles.json): a thumb for a list, a card for the lead. An article with no image renders without a box.
const OUT = 'design/infographics/out/'
const read = f => { try { return JSON.parse(fs.readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8')) } catch { return null } }
const have = new Set((read(OUT + 'index.json')?.images || []).map(i => i.file))
const words = Object.fromEntries((read('design/infographics/articles.json')?.articles || []).map(a => [a.slug, a]))
export const imageOf = (ctx, page, a, size) => {
    const slug = a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
    const file = `${slug}--paper--${size}.png`
    if (!have.has(file)) return ''
    const w = words[slug]
    const alt = (w ? `${w.short_title}: ${w.figure?.value ? w.figure.value + ' ' + w.figure.label : w.points?.[0]?.text}` : a.meta.title).replace(/[\[\]()]/g, '')
    return `![${alt}](${ctx.link(page.rel, OUT + file)})`
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

const minutes = md => Math.max(1, Math.round(md.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length / 230))

export const fill = {
    'front:lead': (page, ctx) => {
        const a = frontOrder(ctx)[0]
        if (!a) return 'Our first article is on the way.'
        const img = imageOf(ctx, page, a, 'card')
        return (img ? `{.lead-fig}\n[${img}](${ctx.link(page.rel, a.rel)})\n\n` : '') + `{.kicker}\n${ctx.md.cell(a.meta.tags || 'News')}\n\n{.lead-hed}\n[${a.meta.title}](${ctx.link(page.rel, a.rel)})\n\n{.dek}\n${a.meta.summary}\n\n{.meta-line}\n${ctx.DAY(a.meta.date)} · ${a.meta.author} · ${minutes(a.md)} min read · signed`
    },
    'front:latest': (page, ctx) => {
        const rest = frontOrder(ctx).slice(1)
        const row = a => {
            const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'thumb')
            return `- ${img ? `[${img}](${href}) ` : ''}**[${a.meta.title}](${href})** *${firstSentence(a.meta.summary)}* \`${[a.meta.beat, ctx.DAY(a.meta.date)].filter(Boolean).join(' · ')}\``
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
