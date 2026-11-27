// The flow of news up the levels, as front matter (cl-6.ontologist's proposal 2026-11-27, agreed by cl-6.dev): `town` and `region` are ids of the
// places registry (data/site/places-registry.json); `builds_on` is a list of earlier articles a piece builds on (the graph verb "feeds" is derived
// from it). The level of an article is derived, never written: local, regional, national, europe, unplaced. All optional, so untagged articles pass.
export const LEVELS = ['local', 'regional', 'national', 'europe', 'unplaced']
const RANK = { local: 0, regional: 1, national: 2 }
const DAY = /^\d{4}-\d\d-\d\d/
export const listOf = v => (Array.isArray(v) ? v : String(v == null ? '' : v).replace(/^\s*\[|\]\s*$/g, '').split(',')).map(s => String(s).trim()).filter(Boolean)
export const rowOf = (registry, fm) => { const w = fm.town || fm.region, id = w && registry.index[String(w).toLowerCase()]; return id ? registry.places.find(p => p.id === id) || null : null }
export const levelOfRow = r => !r ? 'unplaced' : r.country && r.country !== 'PT' ? 'europe' : r.kind === 'country' ? 'national' : r.kind === 'region' ? 'regional' : 'local'
export const levelOfArticle = (registry, fm) => levelOfRow(rowOf(registry, fm))

// articles: [{ slug, fm }]; returns the problems, each starting with the slug
export function checkFlow(articles, registry) {
    const out = [], by = new Map(articles.map(a => [a.slug, a]))
    for (const a of articles) {
        for (const k of ['town', 'region']) if (a.fm[k] && !registry.index[String(a.fm[k]).toLowerCase()]) out.push(`${a.slug}: ${k} "${a.fm[k]}" is not in the places registry`)
        const lv = levelOfArticle(registry, a.fm), date = String(a.fm.date || '').slice(0, 10)
        for (const s of listOf(a.fm.builds_on)) {
            const b = by.get(s)
            if (!b) { out.push(`${a.slug}: builds_on "${s}" is not an article`); continue }
            if (s === a.slug) { out.push(`${a.slug}: builds_on itself`); continue }
            if (DAY.test(date) && DAY.test(String(b.fm.date || '')) && String(b.fm.date).slice(0, 10) > date) out.push(`${a.slug}: builds_on "${s}", which is dated later`)
            const lb = levelOfArticle(registry, b.fm)
            if (lb in RANK && lv in RANK && RANK[lb] > RANK[lv]) out.push(`${a.slug}: builds_on "${s}", a higher level (${lb} above ${lv})`)
        }
    }
    // no cycle of any length
    const state = new Map(), stack = []
    const visit = s => {
        if (state.get(s) === 2) return
        if (state.get(s) === 1) { out.push(`${s}: builds_on has a cycle (${[...stack.slice(stack.indexOf(s)), s].join(' > ')})`); return }
        state.set(s, 1); stack.push(s)
        for (const n of listOf((by.get(s) || { fm: {} }).fm.builds_on)) if (n !== s && by.has(n)) visit(n)
        stack.pop(); state.set(s, 2)
    }
    for (const a of articles) visit(a.slug)
    return out
}
