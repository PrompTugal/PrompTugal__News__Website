// Article segments for translation (cl-6.translator's rule and the app's need, 26 Nov 2026): the API half only. No page changes: articles stay in English.
//   api/v1/i18n/articles/index.json       each article, its segments (id article:<slug>#<n>, key) and how many each culture holds
//   api/v1/i18n/articles/segments.json    key to English text
//   api/v1/i18n/<culture>/segments.json   key to {t, ok} for the article segments the memory holds (the culture's index.json is by-place.mjs's)
// Withdrawn articles are left out entirely. cl-6.dev@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
import { segmentArticle } from '../lib/article-segments.mjs'
import { withdrawn } from '../lib/withdrawn.mjs'
export const order = 61

const TM = 'data/i18n/tm'
const CULTURE = /^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-[A-Z]{2})?$/

function memory(ctx, c) {
    const m = new Map(), dir = path.join(ctx.ROOT, TM, c)
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
        try { for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))) if (v && typeof v.t === 'string' && v.t.trim()) m.set(k, { t: v.t, ok: v.ok === true }) } catch { }
    }
    return m
}

export function api(ctx) {
    const about = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'assets/i18n/articles.json'), 'utf8'))
    const gone = new Set(withdrawn().articles), dir = path.join(ctx.ROOT, 'content/articles')
    const articles = [], text = new Map()
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
        const slug = f.replace(/\.md$/, '')
        if (gone.has(slug)) continue
        const src = fs.readFileSync(path.join(dir, f), 'utf8')
        if (!/^status: published\s*$/m.test(src.split('\n---\n')[0])) continue   // the listing page and drafts are not articles
        const segs = segmentArticle(src)
        if (!segs.length) continue
        for (const s of segs) text.set(s.key, s.text)
        articles.push({ slug, segs })
    }
    let cultures = []; try { cultures = fs.readdirSync(path.join(ctx.ROOT, TM)).filter(c => CULTURE.test(c)).sort() } catch { }
    const mem = cultures.map(c => ({ c, m: memory(ctx, c) })).filter(x => x.m.size)
    const have = (m, segs) => segs.filter(s => m.has(s.key)).length
    const sorted = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)))
    return [
        { path: 'api/v1/i18n/articles/segments.json', schema: null, data: { about: about.segments_about, version: ctx.VERSION, built: ctx.TODAY, rule: about.rule, segments: sorted(Object.fromEntries(text)) } },
        { path: 'api/v1/i18n/articles/index.json', schema: null, data: { about: about.about, version: ctx.VERSION, built: ctx.TODAY, rule: about.rule, segments_total: text.size,
            articles: articles.map(a => ({ slug: a.slug, page: `https://promptugal.news/articles/${a.slug}.html`, segments: a.segs.map(s => ({ id: `article:${a.slug}#${s.n}`, key: s.key, part: s.part })),
                translated: Object.fromEntries(mem.map(x => [x.c, have(x.m, a.segs)])) })) } },
        ...mem.map(({ c, m }) => ({ path: `api/v1/i18n/${c}/segments.json`, schema: null, data: { about: about.culture_about, culture: c, version: ctx.VERSION, built: ctx.TODAY,
            segments: sorted(Object.fromEntries([...text.keys()].filter(k => m.has(k)).map(k => [k, m.get(k)]))) } }))
    ]
}
