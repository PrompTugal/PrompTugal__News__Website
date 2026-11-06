// "Brief me on this page" (pass page-presentations): a slideshow on a page, made from the page's own data. A page's slides are in
// assets/briefing/briefings.json; this feature fills their numbers from the graph, escapes them into a JSON block on the page, and
// adds the script and style to that page only. By dev.graphs@PrompTugal.dinis, 6 November 2026 (WS-177).
import fs from 'node:fs'
import path from 'node:path'
export const order = 88
const file = ctx => path.join(ctx.ROOT || process.cwd(), 'assets/briefing/briefings.json')

export function decorate(page, ctx) {
    const B = JSON.parse(fs.readFileSync(file(ctx), 'utf8')).pages[page.rel]
    if (!B) return
    const g = ctx.graph(), count = t => g.nodes.filter(n => n.type === t).length
    const fill = { nodes: g.nodes.length, edges: g.edges.length, companies: count('company'), people: count('person'), events: count('event'), places: count('place') }
    const sub = s => typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (m, k) => k in fill ? fill[k].toLocaleString('en-GB') : m) : s
    const root = '../'.repeat(page.rel.split('/').length - 1)
    const data = { ...B, root, slides: B.slides.map(s => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, sub(v)]))) }
    const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    page.assets = { css: [...(page.assets?.css || []), 'assets/briefing/briefing.css'], js: [...(page.assets?.js || []), 'assets/briefing/briefing.js'] }
    const prev = page.postHtml
    page.postHtml = h => `<script type="application/json" id="briefing">${json}</script>\n` + (prev ? prev(h) : h)
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/briefing/briefing.js', 'assets/briefing/briefing.css', 'assets/briefing/briefings.json']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try {
        const pages = JSON.parse(gate.text('assets/briefing/briefings.json')).pages
        for (const rel of Object.keys(pages)) {
            const t = gate.text(rel)
            if (!t.includes('id="briefing"')) out.push(`${rel} has no briefing block`)
            if (/\{(nodes|edges|companies|people|events|places)\}/.test(t)) out.push(`${rel}: a briefing placeholder was not filled`)
            for (const s of pages[rel].slides) if (s.href && !gate.exists?.(s.href) && !gate.generated.includes(s.href)) out.push(`${rel}: a slide links to ${s.href}, which is not a page`)
        }
    } catch (e) { out.push(`cannot check the briefings: ${e.message}`) }
    return out
}
