#!/usr/bin/env node
/* test_article_segments.mjs: the article segmenter against cl-6.translator's rule; it also reports how many segments of nine articles of 26 Nov 2026 have a pt-PT entry.
 * node newsroom/build/tests/test_article_segments.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { segmentArticle, key } from '../lib/article-segments.mjs'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const md = '---\ntitle: "A  title"\nsummary: "Sum."\n---\n\n## Head\n\nPara one.\n\n- a\n- b\n\n- c\n  more\n- d\n\n```js\ncode\n```\n\n| t |\n|---|\n\nPara one.\n'
const s = segmentArticle(md)
t('title, summary, heading, paragraph, two list items, a list with a continuation, no code or table, no repeat', s.map(x => x.text), ['A title', 'Sum.', '## Head', 'Para one.', 'a', 'b', '- c\nmore\n- d'])
t('numbered in reading order', s.map(x => x.n), [1, 2, 3, 4, 5, 6, 7])
t('key is the memory key', s[0].key, key('A title'))
const NINE = 'cocus-vila-nova-de-gaia-tech-hubs europe-startup-funding-81-billion-atomico portugal-tech-investment-top-10-atomico-estimate priberam-kenya-broadcasters-ai-media-webinar reach-ai-lisbon-brands-in-ai-answers smartex-porto-ai-fabric-checks-fadell-chair cost-holds-back-portuguese-firms-from-ai eu-quantum-act-and-sovereign-tech-equity-fund two-studies-agent-code-size-and-review'.split(' ')
const keys = new Set()
for (const slug of NINE) { const f = path.join(root, 'content/articles', slug + '.md'); if (fs.existsSync(f)) for (const x of segmentArticle(fs.readFileSync(f, 'utf8'))) keys.add(x.key) }
let tm = {}; try { for (const f of fs.readdirSync(path.join(root, 'data/i18n/tm/pt-PT'))) Object.assign(tm, JSON.parse(fs.readFileSync(path.join(root, 'data/i18n/tm/pt-PT', f), 'utf8'))) } catch { }
const miss = [...keys].filter(k => !(k in tm))
console.log(`nine articles: ${keys.size} segments, ${miss.length} without a pt-PT entry`)
// articles are edited after they are translated, so a gap is reported, never a failure
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_article_segments: OK')
