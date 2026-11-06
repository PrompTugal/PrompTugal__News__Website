// Articles (brief 3): content/articles/<slug>.md, signed as markdown twins. This feature gives each article its type,
// date, byline and breadcrumb, and fills the article lists the prose asks for (<!-- articles:list -->).
import { imageOf, firstSentence } from './front.mjs'
export const order = 20

const isArticle = p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html'
export const articlesOf = ctx => ctx.pages.filter(isArticle).sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''))

export function decorate(p) {
    if (!isArticle(p) || p.decorated) return
    p.decorated = true
    p.type = 'article'
    p.date = p.meta.date
    p.crumbs = [['articles/index.html', 'Articles'], [null, p.meta.title]]
    p.md = `*${p.meta.date} · ${p.meta.author} · [${p.meta.license ? 'CC BY 4.0' : 'licence'}](${p.meta.license || 'https://creativecommons.org/licenses/by/4.0/'})*\n\n` + p.md
}

export const fill = {
    // the list of articles, newest first, with links relative to the page that asks for it
    // the articles in two views, switched by the link followed (CSS :target): the wire (the default: newest first, a
    // thumbnail, the kicker, the summary, the byline) and by day (one band a day, picture cards). dev.pages@, the-articles-page
    'articles:list': (page, ctx) => {
        const list = articlesOf(ctx)
        if (!list.length) return '- Our first articles are on the way. They will appear here, newest first.'
        const wire = `{.rows .news .wire}\n` + list.map(a => {
            const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'thumb')
            return `- ${img ? `[${img}](${href}) ` : ''}**[${a.meta.title}](${href})** *${a.meta.summary.replace(/[*`]/g, '')}* \`${[a.meta.beat, ctx.DAY(a.meta.date), a.meta.author.replace(/@.*/, '')].filter(Boolean).join(' · ')}\``
        }).join('\n')
        const days = [...new Set(list.map(a => a.meta.date))]
        const byDay = days.map(d => `### ${ctx.DAY(d)} {#d-${d}}\n\n{.cards}\n` + list.filter(a => a.meta.date === d).map(a => {
            const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'card')
            return `- ${img ? `[${img}](${href}) ` : ''}**[${a.meta.title}](${href})** *${firstSentence(a.meta.summary, 190)}* \`${[a.meta.beat, a.meta.author.replace(/@.*/, '')].filter(Boolean).join(' · ')}\``
        }).join('\n')).join('\n\n')
        return `{.view-switch}\n[The wire](#v-wire) · [By day](#v-byday)\n\n::: view view-wire\n#### The wire {#v-wire}\n\n${wire}\n:::\n\n::: view view-byday\n#### By day {#v-byday}\n\n${byDay}\n:::`
    },
}
