// A page that brings its own markup (page.raw; features/decks.mjs): the shell's duties without the shell. Its own head
// description is replaced, the tags every page carries go into its head and the version badge and agent block at its
// end. The markup is assets/raw/raw.tmpl.
import fs from 'node:fs'
import { esc } from './markdown.mjs'
import { agentBlock, twinOf } from './shell.mjs'
const T = fs.readFileSync(new URL('../../../assets/raw/raw.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const put = (t, v) => t.replace(/\{\{([a-z]+)\}\}/g, (m, k) => v[k] ?? '')

export function rawPage(page, site) {
    const up = '../'.repeat(page.rel.split('/').length - 1), twin = up + twinOf(page.rel)
    const v = { summary: esc(page.summary || ''), type: esc(page.type || 'site'), date: esc(page.date || ''), url: site.BASE + page.rel, twin, up,
        version: site.VERSION, name: esc(site.SITE.name), agent: esc(agentBlock(page, site)) }
    return page.raw.replace(/<meta name="description"[^>]*>\n?/, '').replace('</head>', put(part('head'), v) + '\n</head>').replace(/<\/body>/, put(part('foot'), v) + '\n</body>')
}
