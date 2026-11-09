// The list pages as applications (the approved mock-ups: designer.experiments@'s companies, people and articles
// switch.mjs; Dinis, 6 November 2026, 13:20 UTC, "just implement it all"; the gap is in board/briefs/2026-11-09-the-mockups-vs-the-live-site.md):
// one list, three views switched by a button, cards, a live filter and a count. The page carries its list as JSON and
// assets/lists/lists.js draws it; without script the page keeps its static views, and the markdown twin is unchanged.
// The marker <!-- companies:app --> in content/companies/index.md places it before the static list.
// dev.pages@PrompTugal.dinis, 9 November 2026.
import fs from 'node:fs'
import { articlesOf } from './articles.mjs'
import { imageFile, byline, firstSentence } from './front.mjs'
export const order = 30

const T = fs.readFileSync(new URL('../../../assets/lists/companies.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const json = o => JSON.stringify(o).replace(/</g, '\\u003c')
const put = (t, v) => t.replace(/\{\{([a-z]+)\}\}/g, (m, k) => v[k] ?? '')
const MOUNT = 'co-static'

export const fill = {
    // the articles are known only when the markers are filled (ctx.pages is set after decorate)
    'articles:app': (page, ctx) => { articlesApp(page, ctx); return '' },
    'companies:app': (page, ctx) => {
        const fields = Object.fromEntries(ctx.store.topics.filter(t => t.kind === 'field').map(t => [t.category, t.name]))
        const first = s => { const t = String(s || '').split(/(?<=[.;:])\s/)[0].replace(/[:;,]$/, ''); return t.length > 130 ? t.slice(0, 127).replace(/\s+\S*$/, '') + '…' : t }
        const list = ctx.store.companies.map(c => ({ id: c.id, n: c.name, w: first(c.what), f: c.category || 'other', c: c.country || 'Unknown', a: c.attending_as || '' }))
            .sort((a, b) => a.n.localeCompare(b.n))
        const html = put(part('app'), { data: json({ companies: list, fields }) })
        const prev = page.postHtml
        page.postHtml = h => { const out = prev ? prev(h) : h, i = out.indexOf(MOUNT); const at = i < 0 ? -1 : out.lastIndexOf('<', i); return at < 0 ? out : out.slice(0, at) + html + '\n' + out.slice(at) }
        return ''
    },
}
// the people page: its list as JSON for the application, placed before the static views (which stay without script)
const TP = fs.readFileSync(new URL('../../../assets/lists/people.tmpl', import.meta.url), 'utf8')
const partP = n => (TP.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
function peopleApp(p, ctx) {
    const list = [...ctx.store.people].sort((a, b) => a.name.localeCompare(b.name)).map(x => ({ id: x.id, n: x.name, r: x.role || '', o: x.organisation || '',
        e: [...new Set(x.listings.map(l => l.event).filter(Boolean))].map(id => ctx.store.get(id)).filter(Boolean).map(e => [e.title, `${e.date.slice(5)} ${e.time || ''}`.trim(), e.id]) }))
    const html = put(partP('app'), { data: json({ people: list }) }), prev = p.postHtml
    p.postHtml = h => { const out = prev ? prev(h) : h, i = out.indexOf(MOUNT); const at = i < 0 ? -1 : out.lastIndexOf('<', i); return at < 0 ? out : out.slice(0, at) + html + '\n' + out.slice(at) }
}
// the articles page: its list as JSON, newest first, placed before the static list (which stays without script)
const TA = fs.readFileSync(new URL('../../../assets/lists/articles.tmpl', import.meta.url), 'utf8')
const partA = n => (TA.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
function articlesApp(p, ctx) {
    const list = articlesOf(ctx).map(a => { const im = imageFile(a, 'thumb'), slug = a.rel.replace(/^articles\//, '').replace(/\.html$/, '')
        return { s: slug, t: a.meta.title, sum: firstSentence(a.meta.summary || '', 200), d: a.meta.date, b: String(a.meta.beat || String(a.meta.tags || 'News').split(',')[0]).replace(/^connections:\s*/i, '').trim(),
            g: String(a.meta.tags || a.meta.beat || '').split(',').map(x => x.trim()).filter(Boolean), by: byline(a.meta.author), i: im ? `../${im.src}` : '', ia: im ? im.alt : '' } })
    const html = put(partA('app'), { data: json({ articles: list }) }), prev = p.postHtml
    p.postHtml = h => { const out = prev ? prev(h) : h, i = out.indexOf(MOUNT); const at = i < 0 ? -1 : out.lastIndexOf('<', i); return at < 0 ? out : out.slice(0, at) + html + '\n' + out.slice(at) }
}
export function decorate(p, ctx) {
    if (!['companies/index.html', 'people/index.html', 'articles/index.html'].includes(p.rel)) return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/lists/lists.css'], js: [...(p.assets?.js || []), 'assets/lists/lists.js'] }
    if (p.rel === 'people/index.html' && ctx) peopleApp(p, ctx)
}
