// Feeds out, for local media and readers to take (dev@PrompTugal.dinis, 16 November 2026; the restart plan's "feeds
// both ways", board/team/conductor.b/plans/2026-11-16-restart-here.md). One feed, two formats:
//   <dir>/feed.json   JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/)
//   <dir>/feed.xml    RSS 2.0
// An item is either our own article (its link is our page) or a local story we found (its link is the publisher's own
// page, its author the publisher, our line on why it is AI news in the summary): we link, they report.
import { ours, of as licenceOf } from './licence.mjs'
const xml = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const isDay = d => /^\d{4}-\d{2}-\d{2}/.test(String(d || ''))
const okUrl = u => typeof u === 'string' && /^https?:\/\/\S+$/i.test(u.trim())
const iso = d => `${String(d).slice(0, 10)}T09:00:00Z`
const rfc = d => new Date(iso(d)).toUTCString()

// items: [{ id, url, title, summary, date, author, kind: 'article' | 'story', tags: [] }]; newest first, at most 50
export function feedFiles({ dir, base, title, description, home, items, language = 'en' }) {
    const list = items.filter(i => okUrl(i.url) && i.title && isDay(i.date))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(a.title).localeCompare(String(b.title))).slice(0, 50)
    const json = {
        version: 'https://jsonfeed.org/version/1.1', title, home_page_url: home, feed_url: `${base}${dir}feed.json`, description, language,
        items: list.map(i => ({ id: i.id || i.url, url: i.url, title: i.title, summary: i.summary || undefined, content_text: i.summary || i.title,
            date_published: iso(i.date), authors: i.author ? [{ name: i.author }] : undefined, tags: i.tags && i.tags.length ? i.tags : undefined,
            _promptugal: { kind: i.kind, ...(i.via ? { via: i.via } : {}) },
            // every item's licence (Dinis, 18 Nov): ours for our articles, the source's for what it reported
            _license: i.kind === 'article' ? ours() : (licenceOf(i.url) || ours()),
            // and its provenance (Dinis, 18 Nov 19:00): the caller's when it has one; else our article's twin and
            // signature, or the story's own page and who reported it
            _provenance: i.provenance || (i.kind === 'article'
                ? { written_by: i.author || null, published: String(i.date).slice(0, 10), file: i.url.replace(/\.html$/, '.md'), signature: i.url.replace(/\.html$/, '.md.sig'), kind: 'article' }
                : { source_url: i.url, publisher: i.author || null, published: String(i.date).slice(0, 10), ...(i.via ? { file: i.via } : {}), kind: i.kind || 'story' }) })),
        _license: { ...ours(), scope: 'the feed and our articles; each item carries its own license' },
    }
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(title)}</title>
<link>${xml(home)}</link>
<atom:link href="${xml(`${base}${dir}feed.xml`)}" rel="self" type="application/rss+xml"/>
<description>${xml(description)}</description>
<language>${xml(language)}</language>
<copyright>${xml(`PrompTugal.news articles: CC BY 4.0 (${ours().url}). Stories reported by others: under their sources' terms, each linked to its outlet.`)}</copyright>
${list.map(i => `<item><title>${xml(i.title)}</title><link>${xml(i.url)}</link><guid isPermaLink="${i.id ? 'false' : 'true'}">${xml(i.id || i.url)}</guid><pubDate>${rfc(i.date)}</pubDate>${i.author ? `<dc:creator>${xml(i.author)}</dc:creator>` : ''}<description>${xml(i.summary || '')}</description>${(i.tags || []).map(t => `<category>${xml(t)}</category>`).join('')}</item>`).join('\n')}
</channel>
</rss>
`
    return [{ path: `${dir}feed.json`, data: JSON.stringify(json, null, 1) + '\n' }, { path: `${dir}feed.xml`, data: rss }]
}

// A place's feed: our articles about it, and the local AI stories its desk found, each crediting its publisher.
export function placeFeed(base, r) {
    const items = [
        ...(r.articles || []).map(a => ({ url: a.url, title: a.title, summary: a.summary, date: a.date, author: 'PrompTugal.news', kind: 'article', tags: [r.name] })),
        ...(r.ai_news || []).map(s => ({ id: `${base}api/v1/by-place/${r.id}/feed#${encodeURIComponent(s.url || '')}`, url: s.url, title: s.title,
            summary: [s.summary, s.ai_path ? `Why it is here: ${s.ai_path}` : ''].filter(Boolean).join(' '), date: s.date, author: s.publisher, kind: 'story',
            tags: [r.name, s.significance].filter(Boolean), via: `${base}${String(r.page || '').replace(/^https?:\/\/[^/]+\//, '')}` })),
    ]
    return feedFiles({ dir: `api/v1/by-place/${r.id}/`, base, title: `PrompTugal.news: ${r.name}`, home: r.page,
        description: `AI and technology news from ${r.name}: our articles and the local stories we found, each linked to the outlet that reported it.`, items })
}
