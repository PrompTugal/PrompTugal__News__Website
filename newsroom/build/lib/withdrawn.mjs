// The withdrawn pages (data/site/withdrawn.json; standing answer 47 on the team site, Vicky relaying Dinis, 11 Nov 2026):
// articles and story pages taken down. The content loader and the data store leave them out, so no list, index, search,
// sitemap, llms.txt or company page shows them; features/withdrawn.mjs puts the notice at each one's address; the deploy
// leaves out their signed twins (features/served.mjs). Nothing is deleted.
import fs from 'node:fs'
import path from 'node:path'
import { R } from './config.mjs'

let W = null
export function withdrawn() {
    if (W) return W
    let j = {}
    try { j = JSON.parse(fs.readFileSync(R('data/site/withdrawn.json'), 'utf8')) } catch { }
    W = { notice: String(j.notice || ''), articles: new Set(j.articles || []), stories: new Set(j.stories || []) }
    return W
}
// an article's source file or slug (content/articles/<slug>.md, or <slug>)
export const isWithdrawnArticle = f => withdrawn().articles.has(path.basename(String(f)).replace(/\.md$/, ''))
