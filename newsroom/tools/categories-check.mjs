#!/usr/bin/env node
// Is this article categorised? For the reviewer before publishing (Vicky Wang, 10 November 2026):
//   node newsroom/tools/categories-check.mjs <slug>        e.g. red-wind-warning-lisbon-wednesday
// Exits 0 and prints the article's categories if desks/curator/categories.json has an entry whose categories are all known;
// exits 1 (and says why) if the slug has no entry, an empty entry or an unknown category, or has no article file.
import fs from 'node:fs'
import path from 'node:path'
import { loadCategories } from '../build/lib/categories.mjs'
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const slug = String(process.argv[2] || '').replace(/^.*articles\//, '').replace(/\.(html|md)$/, '')
if (!slug) { console.error('usage: node newsroom/tools/categories-check.mjs <article-slug>'); process.exit(2) }
const c = loadCategories(root)
if (!c) { console.error('categories-check: desks/curator/categories.json is missing or not usable'); process.exit(1) }
if (!fs.existsSync(path.join(root, 'content/articles', `${slug}.md`))) { console.error(`categories-check: no article file content/articles/${slug}.md`); process.exit(1) }
const names = c.articles[slug], known = new Set(c.categories.map(x => x.name))
if (!Array.isArray(names) || !names.length) { console.error(`categories-check: "${slug}" has no categories in desks/curator/categories.json: ask the curator to add it (main categories: ${[...known].join(', ')})`); process.exit(1) }
const bad = names.filter(n => !known.has(n))
if (bad.length) { console.error(`categories-check: "${slug}" has unknown categories: ${bad.join(', ')}`); process.exit(1) }
console.log(`categories-check: ${slug}: ${names.join(', ')}`)
