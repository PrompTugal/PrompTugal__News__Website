// The article graphs: each article's small graph, the article in the middle and what it names around it (sessions above,
// companies, organisations, fields and places below), drawn from the links in the article's own text, so it shows what the
// article names and nothing more. Prerendered SVG, no script; the signed markdown twin is left as written (a change would break its signature); No "Open in the graph" link yet: the explorer's graph has no "mentions" edge for articles (ask ontologist@).
// By dev.graphs@PrompTugal.dinis, 6 November 2026 (WS-177; pass the-big-graphs). The drawing is graph/minigraph.mjs.
import { miniGraph, KIND_LABEL } from './graph/minigraph.mjs'
import { pageOf } from '../lib/graph.mjs'
export const order = 91
const TYPE = { companies: 'company', events: 'event', organisations: 'organisation', people: 'person', topics: 'topic', places: 'place' }
const LINK = /\]\((?:\.\.\/)+(companies|events|organisations|people|topics|places)\/([a-z0-9-]+)\/index\.(?:md|html)/g
const isArticle = rel => /^articles\/[^/]+\.html$/.test(rel) && rel !== 'articles/index.html'

export function decorate(page, ctx) {
    if (!isArticle(page.rel) || page.minigraph || page.withdrawn) return
    const ref = `article:${page.rel.replace(/^articles\/|\.html$/g, '')}`, base = ctx.graph()
    if (!base.node.has(ref)) return
    const named = [...new Set([...String(page.md).matchAll(LINK)].map(m => `${TYPE[m[1]]}:${m[2]}`))].filter(id => base.node.has(id))
    if (named.length < 2) return
    const mentions = named.map(to => ({ from: ref, to, verb: 'mentions' }))
    const g = { ...base, outOf: (id, v) => [...base.outOf(id, v), ...(id === ref && (!v || v === 'mentions') ? mentions : [])], inOf: (id, v) => [...base.inOf(id, v), ...(v === 'mentions' || !v ? mentions.filter(e => e.to === id) : [])] }
    const pages = new Set(ctx.pages.map(p => p.rel)), up = '../'.repeat(page.rel.split('/').length - 1)
    const mg = miniGraph(g, ref, { verbs: new Map(ctx.store.ontology.verbs.map(v => [v.verb, v])), href: id => { const p = pageOf(id); return p && pages.has(p) ? up + p : null } })
    if (!mg) return
    page.minigraph = true
    const legend = mg.kinds.map(k => `<span><i class="l-${k}"></i>${KIND_LABEL[k]}</span>`).join('')
    const fig = `<figure class="minigraph" data-focus="${ref}">${mg.svg}<figcaption><span class="g-legend">${legend}${mg.more ? `<span class="g-more">and ${mg.more} more</span>` : ''}</span></figcaption></figure>`
    const prev = page.postHtml
    page.postHtml = html => (prev ? prev(html) : html) + '\n' + fig
}
