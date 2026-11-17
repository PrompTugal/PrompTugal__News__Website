// The provenance strip under every article's headline (Dinis, 17 November 2026: who wrote it, who checked it, who signs
// it; board/spec-provenance-and-review.md, order of work step 3, dev@'s). From the article's front matter, set by
// journalist@: type, provenance_origin, provenance_research, provenance_level. In words: "Analysis · briefed by a person,
// drafted by an AI agent · researched by an AI agent, steered by a person · P2 Sourced". HTML only, like the signed line
// and the story rail: the signed markdown twin stays as signed. The filters and the radar follow. dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
import { render } from '../lib/markdown.mjs'
export const order = 20   // runs before story-rail (21), so the address sits above this strip
export const assets = { css: ['assets/provenance/provenance.css'] }
let W = null
const words = () => W || (W = JSON.parse(readFileSync(new URL('../../../assets/provenance/words.json', import.meta.url), 'utf8')))
const isArticle = p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html' && !p.withdrawn

/** The strip's parts, in words; null when the article carries none of the fields. Exported for the filters and the API. */
export function provenanceOf(meta) {
    const w = words(), m = meta || {}
    const type = w.type[String(m.type || '').toLowerCase()], origin = w.origin[m.provenance_origin], research = w.research[m.provenance_research]
    const level = /^P[0-5]$/.test(m.provenance_level || '') ? m.provenance_level : null
    if (!type && !origin && !research && !level) return null
    return { type: type || null, origin: origin || null, research: research || null, level, level_name: level ? w.level[level] : null }
}

export function decorate(p, ctx) {
    // the articles page: the filters (assets/provenance/filters.js) over api/v1/articles/provenance.json; without
    // JavaScript every article stays listed
    if (p.rel === 'articles/index.html' && !p.pvFilters) {
        p.pvFilters = true
        p.assets = { ...(p.assets || {}), js: [...((p.assets || {}).js || []), 'assets/provenance/filters.js'] }
        const prevI = p.postHtml
        p.postHtml = h => '<div id="pv-filters" class="pv-filters" hidden></div>' + (prevI ? prevI(h) : h)
        return
    }
    if (!isArticle(p) || p.provenanced || !p.meta) return
    const v = provenanceOf(p.meta)
    if (!v) return
    p.provenanced = true
    const w = words(), cell = ctx.md.cell
    const parts = [v.type && `[[${cell(v.type)}]]{.pv-type}`, v.origin && cell(v.origin), v.research && cell(v.research),
        v.level && `[[${v.level} ${cell(v.level_name)}]]{.pv-level}`].filter(Boolean)
    const html = render(`{.provenance-strip}\n${parts.join(' · ')}\n`).html
        .replace(/\[\[([^\]]+)\]\]\{\.(pv-[a-z]+)\}/g, (_, t, c) => `<span class="${c}">${t}</span>`)
    const prev = p.postHtml
    p.postHtml = h => html + (prev ? prev(h) : h)
}

// every article's provenance as codes and words, for the filters and for agents (JSON first)
export function api(ctx) {
    const w = words()
    const rows = ctx.pages.filter(isArticle).map(p => {
        const m = p.meta || {}, v = provenanceOf(m)
        return { url: p.rel, title: m.title, date: m.date, type: String(m.type || '').toLowerCase() || null, origin: m.provenance_origin || null,
            research: m.provenance_research || null, level: v ? v.level : null, words: v }
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)))
    return [{ path: 'api/v1/articles/provenance.json', schema: null, data: { about: w.about_api, version: ctx.VERSION, built: ctx.TODAY,
        filters: w.filters, ladder: w.level, articles: rows } }]
}
