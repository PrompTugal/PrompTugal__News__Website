// The articles' main categories: read once from desks/curator/categories.json (the curator's file; Vicky Wang approved the eight
// categories on 10 November 2026; new main categories need her approval). The articles page's topic filter, the lists page's filter
// and its "By topic" view show exactly those categories, in the file's order. Homepage labels (kickers) stay on the raw tags.
// With no usable file, everything behaves as before. Also here: rawTags, the bracket-safe tag split (a tags line written as a
// bracketed list, `[Portugal, practical]`, used to show as "[Portugal" and "practical]").
import fs from 'node:fs'
import path from 'node:path'

export const FILE = 'desks/curator/categories.json'
export const rawTags = v => String(v ?? '').split(',').map(t => t.replace(/^[\s[\]"']+|[\s[\]"']+$/g, '')).filter(Boolean)
export const slugOf = a => String(a && a.rel || a).replace(/^.*articles\//, '').replace(/\.(html|md)$/, '')

let cache
export function loadCategories(root) {
    if (cache && cache.root === root) return cache.value
    let value = null
    try {
        const j = JSON.parse(fs.readFileSync(path.join(root, FILE), 'utf8'))
        const categories = (Array.isArray(j.categories) ? j.categories : []).filter(c => c && c.name && c.slug)
        if (categories.length && j.articles && typeof j.articles === 'object') value = { categories, articles: j.articles, secondary: j.secondary || {} }
    } catch { /* no file, or not usable: the old behaviour */ }
    cache = { root, value }
    return value
}
// the main categories in the file's order ([{name, slug, scope}]), or null with no usable file
export const mainCategories = root => (loadCategories(root) || {}).categories || null
// an article's categories: from the file (an article with no entry has none, and the gate warns); with no file, its raw tags
export function categoriesOf(root, a) {
    const c = loadCategories(root)
    if (!c) return rawTags(a.meta.tags || a.meta.beat)
    const known = new Set(c.categories.map(x => x.name))
    return (c.articles[slugOf(a)] || []).filter(n => known.has(n))
}
// the label on an article's card on the articles page: its first main category from the file ('' with no file or no entry, so the caller
// keeps today's label). Homepage labels (kickers) never use this.
export function firstCategory(root, a) {
    const c = loadCategories(root); if (!c) return ''
    const known = new Set(c.categories.map(x => x.name))
    return (c.articles[slugOf(a)] || []).find(n => known.has(n)) || ''
}
