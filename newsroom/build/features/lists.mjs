// The list pages as applications (the approved mock-ups: designer.experiments@'s companies, people and articles
// switch.mjs; Dinis, 6 November 2026, 13:20 UTC, "just implement it all"; the gap is in board/briefs/2026-11-09-the-mockups-vs-the-live-site.md):
// one list, three views switched by a button, cards, a live filter and a count. The page carries its list as JSON and
// assets/lists/lists.js draws it; without script the page keeps its static views, and the markdown twin is unchanged.
// The marker <!-- companies:app --> in content/companies/index.md places it before the static list.
// dev.pages@PrompTugal.dinis, 9 November 2026.
import fs from 'node:fs'
export const order = 30

const T = fs.readFileSync(new URL('../../../assets/lists/companies.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const json = o => JSON.stringify(o).replace(/</g, '\\u003c')
const put = (t, v) => t.replace(/\{\{([a-z]+)\}\}/g, (m, k) => v[k] ?? '')
const MOUNT = 'co-static'

export const fill = {
    'companies:app': (page, ctx) => {
        const fields = Object.fromEntries(ctx.store.topics.filter(t => t.kind === 'field').map(t => [t.category, t.name]))
        const first = s => { const t = String(s || '').split(/(?<=[.;:])\s/)[0].replace(/[:;,]$/, ''); return t.length > 130 ? t.slice(0, 127).replace(/\s+\S*$/, '') + '…' : t }
        const list = ctx.store.companies.map(c => ({ id: c.id, n: c.name, w: first(c.what), f: c.category || 'other', c: c.country || 'Unknown', a: c.attending_as || '' }))
            .sort((a, b) => a.n.localeCompare(b.n))
        const html = put(part('app'), { data: json({ companies: list, fields }) })
        const prev = page.postHtml
        page.postHtml = h => { const out = prev ? prev(h) : h, i = out.indexOf(MOUNT); const at = i < 0 ? -1 : out.lastIndexOf('<', i); return at < 0 ? out : out.slice(0, at) + html + '\n' + out.slice(at) }
        return ''
    },
}
export function decorate(p) {
    if (p.rel !== 'companies/index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/lists/lists.css'], js: [...(p.assets?.js || []), 'assets/lists/lists.js'] }
}
