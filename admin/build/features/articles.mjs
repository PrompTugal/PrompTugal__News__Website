// Articles (brief 3): content/articles/<slug>.md, signed as markdown twins. This feature gives each article its type,
// date, byline and breadcrumb, and fills the article lists the prose asks for (<!-- articles:list -->).
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
    'articles:list': (page, ctx) => {
        const list = articlesOf(ctx)
        if (!list.length) return '- Our first articles are on the way. They will appear here, newest first.'
        return list.map(a => `- **[${a.meta.title}](${ctx.link(page.rel, a.rel)})** (${a.meta.date}, ${a.meta.author}). ${a.meta.summary}`).join('\n')
    },
}
