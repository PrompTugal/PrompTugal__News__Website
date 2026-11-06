// Silvio's mock E (board/briefs/2026-11-06-front-page-mock-e.md): the ticker ("This week"), the three columns (the
// briefing, the stories, Now and next) and the numbers band, all from data, as fills: <!-- e:ticker -->, <!-- e:cols -->,
// <!-- e:numbers -->. Markdown with the design's class hooks; the twin reads as plain text. dev.pages@, for dev@'s shell.
//   ticker       the week's top items from the day data (the agenda), from today on
//   briefing     desks/correspondent/front-page.json "briefing" (five slugs), else the correspondent's order
//   stories      the articles after the lead, in the correspondent's order, with their pills only where true
//   now and next the next items from today on
//   numbers      counted: companies, events from today to the end of the week, signed stories, the summit's days
import fs from 'node:fs'
import { frontOrder, imageOf, firstSentence } from './front.mjs'
import { load, rank } from './agenda.mjs'
export const order = 23

const read = f => { try { return JSON.parse(fs.readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8')) } catch { return null } }
const W = read('data/site/list-views.json').front_e
const exists = f => fs.existsSync(new URL(`../../../${f}`, import.meta.url))
const slugOf = a => a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
const kickerOf = (ctx, a) => ctx.md.cell(String(a.meta.beat || a.meta.tags || 'News').split(',')[0].replace(/["']/g, '').replace(/\s*\(.*\)$/, ''))
const WEEK_END = '2026-11-13'

// the items of the week from today on, from the agenda
function weekItems(ctx) {
    const { days, itemsOn, TODAY } = load(ctx)
    return days.filter(d => d >= TODAY && d <= WEEK_END).flatMap(d => [...itemsOn(d)])
}
const stamp = (ctx, e) => `${ctx.DAY(e.date).split(' ').slice(0, 2).join(' ').replace(/^(\w{3})\w*/, '$1')} ${(e.time || '').split('-')[0] || W.all_day}`
const evLink = (ctx, page, e) => `[${ctx.md.cell(String(e.what).split(/:\s|\s\(/)[0])}](${ctx.link(page.rel, `events/${e.id}/index.html`)})`

// "signed" only when the article's signature file is there (the gate refuses an unsigned article); "checked" only when
// dev.verify@ has a verified block for it. "agent-written" is always true here.
const pills = a => [W.agent_written, exists(`board/team/dev.verify/records/${slugOf(a)}/verified.json`) && W.checked, exists(`articles/${slugOf(a)}.md.sig`) && W.signed].filter(Boolean).map(x => `\`${x}\``).join(' ')

export const fill = {
    'e:ticker': (page, ctx) => {
        const { itemsOn, days, TODAY } = load(ctx)
        const top = days.filter(d => d >= TODAY && d <= WEEK_END).flatMap(d => [...itemsOn(d)].sort((a, b) => rank(a) - rank(b) || (a.time || '').localeCompare(b.time || '')).slice(0, 3).sort((a, b) => (a.time || '').localeCompare(b.time || '')))
        if (!top.length) return ''
        return `::: e-live\n{.e-label}\n**${W.this_week}**\n\n{.e-ticker}\n${top.map(e => `- \`${stamp(ctx, e)}\` ${evLink(ctx, page, e)}`).join('\n')}\n:::`
    },
    'e:cols': (page, ctx) => {
        const order = frontOrder(ctx), by = new Map(order.map(a => [slugOf(a), a]))
        const bl = (read('desks/correspondent/front-page.json')?.briefing?.items || []).map(i => by.get(i.article)).filter(Boolean)
        const brief = [...bl, ...order.filter(a => !bl.includes(a))].slice(0, 5)
        const stories = order.slice(1, 7)
        const next = weekItems(ctx).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))).slice(0, 7)
        const L = a => ctx.link(page.rel, a.rel)
        const col1 = `::: e-brief\n### ${W.briefing}\n\n` + brief.map((a, i) => `${i + 1}. [${a.meta.title}](${L(a)}) \`${kickerOf(ctx, a)}\``).join('\n') + '\n:::'
        const col2 = `::: e-stories\n### ${W.stories}\n\n` + stories.map((a, i) => {
            const img = i === 0 ? '' : imageOf(ctx, page, a, 'thumb')
            return `::: e-story\n${img ? `{.e-img}\n[${img}](${L(a)})\n\n` : ''}{.e-k}\n${kickerOf(ctx, a)}\n\n#### [${a.meta.title}](${L(a)}) {#s-${slugOf(a)}}\n\n${firstSentence(a.meta.summary, i === 0 ? 260 : 170)}\n\n{.e-pills}\n${pills(a)}${img ? ` \`${W.ai_image}\`` : ''}\n:::`
        }).join('\n\n') + `\n\n{.more-line}\n[${W.more_articles}](${ctx.link(page.rel, 'articles/index.html')})\n:::`
        const col3 = `::: e-next\n### ${W.now_next}\n\n{.e-nextlist}\n` + next.map(e => `- \`${stamp(ctx, e)}\` ${evLink(ctx, page, e)}`).join('\n') + `\n\n{.more-line}\n[${W.more_agenda}](${ctx.link(page.rel, 'events/index.html')})\n:::`
        return `::: e-cols\n${col1}\n\n${col2}\n\n${col3}\n:::`
    },
    'e:numbers': (page, ctx) => {
        const signed = frontOrder(ctx).filter(a => exists(`articles/${slugOf(a)}.md.sig`)).length
        return `{.e-nums}\n- **${ctx.store.companies.length}** ${W.n_companies}\n- **${weekItems(ctx).length}** ${W.n_events}\n- **${signed}** ${W.n_stories}\n- **9–12** ${W.summit_days}`
    },
}
