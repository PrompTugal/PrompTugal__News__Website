// The front page "Now" (design/README.md, the front page): the lead story, the field tiles and what is on around the
// summit next, as fills the prose places (content/index.md): <!-- front:lead -->, <!-- front:latest -->,
// <!-- front:fields -->, <!-- front:around -->. Markdown with the design's class hooks; the twin reads as plain text.
import { articlesOf } from './articles.mjs'
import { refLink, slotLine, slotList } from '../lib/present.mjs'
export const order = 22

const minutes = md => Math.max(1, Math.round(md.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length / 230))

export const fill = {
    'front:lead': (page, ctx) => {
        const a = articlesOf(ctx)[0]
        if (!a) return 'Our first article is on the way.'
        const pic = (a.md.match(/```\n([\s\S]*?)\n```/) || [])[1]
        return `{.kicker}\n${ctx.md.cell(a.meta.tags || 'News')}\n\n{.lead-hed}\n[${a.meta.title}](${ctx.link(page.rel, a.rel)})\n\n{.dek}\n${a.meta.summary}\n\n{.meta-line}\n${ctx.DAY(a.meta.date)} · ${a.meta.author} · ${minutes(a.md)} min read · signed` +
            (pic ? `\n\n{.fig-thumb}\n\`\`\`\n${pic}\n\`\`\`` : '')
    },
    'front:latest': (page, ctx) => {
        const rest = articlesOf(ctx).slice(1)
        return rest.length ? `{.rows}\n${rest.map(a => `- [${a.meta.title}](${ctx.link(page.rel, a.rel)}) *${a.meta.date}, ${a.meta.author}. ${a.meta.summary}*`).join('\n')}` : 'The next articles will appear here, newest first. Each is written from the desks\' research, fact-checked, and signed with the newsroom\'s key.'
    },
    'front:fields': (page, ctx) => {
        const fields = ctx.store.topics.filter(t => t.kind === 'field').map(t => [t, ctx.store.companies.filter(c => c.category === t.category).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1])
        return `{.field-list}\n${fields.map(([t, n]) => `- [${t.name} \`${n}\`](${ctx.link(page.rel, `topics/${t.id}/index.html`)})`).join('\n')}`
    },
    'front:around': (page, ctx) => {
        const next = ctx.store.events.filter(e => e.organiser === 'other' && (e.end_date || e.date) >= ctx.TODAY).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))).slice(0, 6)
        return next.length ? `{.agenda .cols}\n${next.map(e => slotLine(ctx, page.rel, e)).join('\n')}` : 'Nothing else in our programme from today.'
    },
}
