// The gate for the news-flow front matter (lib/article-flow.mjs): town and region are registry ids, builds_on is sound. dev@PrompTugal.dinis.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { loadContent } from '../lib/content.mjs'
import { checkFlow } from '../lib/article-flow.mjs'
export const order = 99
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
export function validate() {
    let registry; try { registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/site/places-registry.json'), 'utf8')) } catch { return ['data/site/places-registry.json: missing or not JSON'] }
    const articles = loadContent().filter(p => /^articles\/[^/]+\.html$/.test(p.rel) && p.rel !== 'articles/index.html').map(p => ({ slug: p.rel.replace(/^articles\/|\.html$/g, ''), fm: p.meta }))
    return checkFlow(articles, registry)
}
