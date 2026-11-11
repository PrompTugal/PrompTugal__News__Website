// Articles (brief 3): content/articles/<slug>.md, signed as markdown twins. This feature gives each article its type,
// date, byline and breadcrumb, and fills the article lists the prose asks for (<!-- articles:list -->).
import { mainCategories, categoriesOf, rawTags, firstCategory } from '../lib/categories.mjs'
import { imageOf, firstSentence } from './front.mjs'
import fs from 'node:fs'
import { render } from '../lib/markdown.mjs'
const SIGNED = fs.readFileSync(new URL('../../../assets/article/signed-line.md', import.meta.url), 'utf8').trim()  // its words (synthetic@'s F28)
export const order = 20
const W = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')).articles

const isArticle = p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html'
export const articlesOf = ctx => ctx.pages.filter(isArticle).sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''))

export function decorate(p) {
    if (!isArticle(p) || p.decorated) return
    p.decorated = true
    p.type = 'article'
    p.date = p.meta.date
    p.crumbs = [['articles/index.html', 'Articles'], [null, p.meta.title]]
    // the signature a reader can check (synthetic@'s F28), on the page only: the twin it signs stays as signed
    const slug = p.rel.replace(/^articles\//, '').replace(/\.html$/, ''), prev = p.postHtml
    p.postHtml = html => (prev ? prev(html) : html) + render(`{.signed-line}\n` + SIGNED.replace(/\{twin\}/g, `${slug}.md`).replace(/\{sig\}/g, `${slug}.md.sig`).replace(/\{keys\}/g, '../board/keys.json').replace(/\{how\}/g, '../how-we-publish/index.md')).html.replace(`href="${slug}.html"`, `href="${slug}.md"`)
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
            return `- ${img ? `[${img}](${href}) ` : ''}**[${a.meta.title}](${href})** *${a.meta.summary.replace(/[*`]/g, '')}* \`${[firstCategory(ctx.ROOT, a) || a.meta.beat, ctx.DAY(a.meta.date), a.meta.author.replace(/@.*/, '')].filter(Boolean).join(' · ')}\``
        }).join('\n')
        const days = [...new Set(list.map(a => a.meta.date))]
        const byDay = days.map(d => `### ${ctx.DAY(d)} {#d-${d}}\n\n{.cards}\n` + list.filter(a => a.meta.date === d).map(a => {
            const href = ctx.link(page.rel, a.rel), img = imageOf(ctx, page, a, 'card')
            return `- ${img ? `[${img}](${href}) ` : ''}**[${a.meta.title}](${href})** *${firstSentence(a.meta.summary, 190)}* \`${[firstCategory(ctx.ROOT, a) || a.meta.beat, a.meta.author.replace(/@.*/, '')].filter(Boolean).join(' · ')}\``
        }).join('\n')).join('\n\n')
        // by topic: each article under every tag it carries (front matter `tags`), the busiest topics first
        // with desks/curator/categories.json: the eight main categories, in the file's order; without it, the tags as before
        const cats = mainCategories(ctx.ROOT), tags = new Map()
        if (cats) cats.forEach(c => tags.set(c.name, []))
        for (const a of list) for (const t of cats ? categoriesOf(ctx.ROOT, a) : rawTags(a.meta.tags || a.meta.beat)) tags.set(t, [...(tags.get(t) || []), a])
        const byTopic = [...tags].filter(([, a]) => cats ? a.length > 0 : a.length > 1).sort((x, y) => cats ? 0 : y[1].length - x[1].length || x[0].localeCompare(y[0])).map(([t, a]) => `### ${ctx.md.cell(t)} \`${a.length}\`\n\n{.rows .news .wire}\n` + a.map(x => {
            const href = ctx.link(page.rel, x.rel), img = imageOf(ctx, page, x, 'thumb')
            return `- ${img ? `[${img}](${href}) ` : ''}**[${x.meta.title}](${href})** *${firstSentence(x.meta.summary, 190)}* \`${ctx.DAY(x.meta.date)}\``
        }).join('\n')).join('\n\n')
        return `{.view-switch}\n[${W.wire}](#v-wire) · [${W.byday}](#v-byday) · [${W.bytopic}](#v-bytopic)\n\n::: view view-wire\n#### ${W.wire} {#v-wire}\n\n${wire}\n:::\n\n::: view view-byday\n#### ${W.byday} {#v-byday}\n\n${byDay}\n:::\n\n::: view view-bytopic\n#### ${W.bytopic} {#v-bytopic}\n\n${byTopic}\n:::`
    },
}
