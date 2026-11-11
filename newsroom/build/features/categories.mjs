// The gate's check of the articles' main categories (desks/curator/categories.json, the curator's file). Added 10 November 2026,
// at Vicky Wang's word (dev@PrompTugal.vicky; owned by dev@PrompTugal.dinis).
//   FAIL (validate): the file names a category an article cannot have (not one of its eight), or has an entry for a slug with no
//     article file. The file is the curator's, so these are the curator's to fix and never another desk's release to block.
//   WARN (warn, never a failure): an article file with no entry, named, so a new article from any desk is caught without
//     blocking anyone's release. dev@PrompTugal.dinis may make this a FAIL later.
// With no usable file, neither check runs. A small command for a single article: node newsroom/tools/categories-check.mjs <slug>.
import fs from 'node:fs'
import path from 'node:path'
import { loadCategories } from '../lib/categories.mjs'
export const order = 90

const slugs = root => { try { return fs.readdirSync(path.join(root, 'content/articles')).filter(f => f.endsWith('.md') && f !== 'index.md').map(f => f.replace(/\.md$/, '')) } catch { return [] } }

export function check(root) {
    const c = loadCategories(root); if (!c) return { problems: [], warnings: [] }
    const known = new Set(c.categories.map(x => x.name)), have = new Set(slugs(root)), problems = [], warnings = []
    for (const [slug, names] of Object.entries(c.articles)) {
        if (!have.has(slug)) problems.push(`desks/curator/categories.json has an entry for "${slug}", which has no article file`)
        if (!Array.isArray(names)) { problems.push(`desks/curator/categories.json: the entry for "${slug}" is not a list`); continue }
        for (const n of names) if (!known.has(n)) problems.push(`desks/curator/categories.json: "${slug}" has the unknown category "${n}" (the main categories are: ${[...known].join(', ')})`)
    }
    for (const s of have) if (!(s in c.articles)) warnings.push(`article "${s}" has no entry in desks/curator/categories.json (the curator adds it; it shows in no category until then)`)
    return { problems, warnings }
}
export const validate = gate => check(gate.ROOT).problems
export const warn = gate => check(gate.ROOT).warnings
