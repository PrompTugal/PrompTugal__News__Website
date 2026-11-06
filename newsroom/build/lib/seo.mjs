// Search and link previews: the <head> tags that make a page findable and make a shared link look right
// (Open Graph, the Twitter/X card, robots, an RSS link) and its structured data (JSON-LD: the site and the
// organisation on the front page, NewsArticle on an article, BreadcrumbList wherever the page has crumbs).
// Added 6 November 2026 at Dinis's word (an SEO pass, with promptugal.news now in Google Search Console).
//
// The image: an article's front matter `image:` (a path in the repository or an absolute URL, 1200x630 is best)
// with `image_alt:`; that is where each article's mini infographic goes. Without one, the site's card,
// assets/brand/social-card.png (1200x630, made from the brand's wordmark and PT.news stamp).

export const CARD = { src: 'assets/brand/social-card.png', width: 1200, height: 630, alt: 'PrompTugal.news: technology and AI, in context. Mapping the universe of AI in Portugal.' }
export const LOGO = { src: 'assets/brand/icon-512.png', width: 512, height: 512 }

const attr = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const abs = (site, u) => (/^https?:/.test(u) ? u : site.BASE + String(u).replace(/^\/+/, ''))
const isDate = d => /^\d{4}-\d{2}-\d{2}/.test(d || '')
// JSON inside <script>: no "</" may close the element early
// Pages kept out of search: the sign-in page and the 404 (a page can also say noindex: true itself)
export const noindex = p => !!(p.noindex || p.meta?.noindex || /^(login\/|404\.html$)/.test(p.rel))
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

export function imageOf(page, site) {
    const m = page.meta || {}
    if (m.image) return { url: abs(site, m.image), alt: m.image_alt || page.title, width: m.image_width, height: m.image_height }
    return { url: abs(site, CARD.src), alt: CARD.alt, width: CARD.width, height: CARD.height }
}

export function seoHead(page, site) {
    const S = site.SITE
    const url = site.BASE + page.rel
    const front = page.rel === 'index.html'
    const article = page.type === 'article'
    const img = imageOf(page, site)
    const m = page.meta || {}
    const tags = [
        `<meta name="robots" content="${noindex(page) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">`,
        `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
        `<meta property="og:locale" content="en_GB">`,
        `<meta property="og:image" content="${attr(img.url)}">`,
        `<meta property="og:image:alt" content="${attr(img.alt)}">`,
        ...(img.width ? [`<meta property="og:image:width" content="${img.width}">`, `<meta property="og:image:height" content="${img.height}">`] : []),
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${attr(page.title)}">`,
        `<meta name="twitter:description" content="${attr(page.summary || '')}">`,
        `<meta name="twitter:image" content="${attr(img.url)}">`,
        `<meta name="twitter:image:alt" content="${attr(img.alt)}">`,
        `<link rel="alternate" type="application/rss+xml" title="${attr(S.name)}: articles" href="${site.BASE}feed.xml">`,
    ]
    if (article) {
        if (isDate(m.date)) tags.push(`<meta property="article:published_time" content="${m.date.slice(0, 10)}">`)
        if (m.beat) tags.push(`<meta property="article:section" content="${attr(m.beat)}">`)
        for (const t of String(m.tags || '').split(',').map(x => x.trim()).filter(Boolean)) tags.push(`<meta property="article:tag" content="${attr(t)}">`)
    }

    const org = { '@type': 'NewsMediaOrganization', '@id': `${site.BASE}#organization`, name: S.name, url: site.BASE, logo: { '@type': 'ImageObject', url: abs(site, LOGO.src), width: LOGO.width, height: LOGO.height }, publishingPrinciples: `${site.BASE}about/participant.html` }
    const graph = []
    if (front) {
        graph.push(org, {
            '@type': 'WebSite', '@id': `${site.BASE}#website`, name: S.name, url: site.BASE, inLanguage: 'en-GB', description: page.summary || S.motto, publisher: { '@id': org['@id'] },
            potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${site.BASE}search/index.html?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
        })
    }
    if (article) {
        graph.push({
            '@type': 'NewsArticle', '@id': `${url}#article`, mainEntityOfPage: url, url, headline: page.title, description: page.summary || '',
            image: [img.url], inLanguage: 'en-GB', isAccessibleForFree: true,
            ...(isDate(m.date) ? { datePublished: m.date.slice(0, 10), dateModified: m.date.slice(0, 10) } : {}),
            // the byline names an agent and the editor it works for; the organisation is the author of record
            author: [{ '@type': 'Organization', name: S.name, url: site.BASE }],
            ...(m.author ? { creditText: String(m.author) } : {}),
            publisher: org,
            ...(m.license ? { license: m.license } : {}),
            ...(m.tags ? { keywords: String(m.tags) } : {}),
            ...(m.beat ? { articleSection: m.beat } : {}),
        })
    }
    if (page.crumbs?.length) {
        const items = [['index.html', 'Home'], ...page.crumbs, [null, page.title]]
            .filter(([, t], i, a) => !(i === a.length - 1 && a[i - 1] && a[i - 1][1] === t))
        graph.push({ '@type': 'BreadcrumbList', itemListElement: items.map(([h, t], i) => ({ '@type': 'ListItem', position: i + 1, name: t, ...(h || i === items.length - 1 ? { item: h ? site.BASE + h : url } : {}) })) })
    }
    if (graph.length) tags.push(ld({ '@context': 'https://schema.org', '@graph': graph }))
    return tags.join('\n')
}

// The RSS 2.0 feed of the articles, newest first (feed readers, aggregators and search engines discover it from
// every page's <link rel="alternate">).
export function rssXml(site, articles) {
    const S = site.SITE
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const rfc = d => new Date(`${d.slice(0, 10)}T09:00:00Z`).toUTCString()
    const items = articles.filter(a => isDate(a.meta?.date)).slice(0, 50).map(a => {
        const img = imageOf(a, site)
        return `<item><title>${esc(a.title)}</title><link>${site.BASE}${a.rel}</link><guid isPermaLink="true">${site.BASE}${a.rel}</guid><pubDate>${rfc(a.meta.date)}</pubDate><description>${esc(a.summary || '')}</description>${a.meta.beat ? `<category>${esc(a.meta.beat)}</category>` : ''}<media:content url="${esc(img.url)}" medium="image"/></item>`
    }).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(S.name)}</title>
<link>${site.BASE}</link>
<atom:link href="${site.BASE}feed.xml" rel="self" type="application/rss+xml"/>
<description>${esc(S.motto)}. ${esc(S.promise)}</description>
<language>en-gb</language>
<image><url>${site.BASE}${LOGO.src}</url><title>${esc(S.name)}</title><link>${site.BASE}</link></image>
${items}
</channel>
</rss>
`
}

// The sitemap with each page's last change (its page-date), and a Google News sitemap of the articles from the
// last two days before the build (Google News reads only those).
export function sitemapXml(site, pages) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !noindex(p)).map(p => `<url><loc>${site.BASE}${p.rel}</loc>${isDate(p.date) ? `<lastmod>${p.date.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`
}
export function newsSitemapXml(site, articles) {
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const today = Date.parse(`${site.TODAY}T00:00:00Z`)
    const recent = articles.filter(a => isDate(a.meta?.date) && today - Date.parse(`${a.meta.date.slice(0, 10)}T00:00:00Z`) <= 2 * 864e5)
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${recent.map(a => `<url><loc>${site.BASE}${a.rel}</loc><news:news><news:publication><news:name>${esc(site.SITE.name)}</news:name><news:language>en</news:language></news:publication><news:publication_date>${a.meta.date.slice(0, 10)}</news:publication_date><news:title>${esc(a.title)}</news:title></news:news></url>`).join('\n')}\n</urlset>\n`
}
export const robotsTxt = site => `User-agent: *\nAllow: /\nSitemap: ${site.BASE}sitemap.xml\nSitemap: ${site.BASE}news-sitemap.xml\n`
