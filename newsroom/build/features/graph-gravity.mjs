// Centres of gravity (/graph/gravity/): an animated infographic of the companies as bodies orbiting the wells of their
// field or country, from api/v1/graph/explorer.json. The first of the big graphs (pass the-big-graphs).
// By dev.graphs@PrompTugal.dinis, 6 November 2026 (WS-177). The page and its words are content/graph/gravity.md;
// this feature adds the infographic's markup and assets to it.
export const order = 86
const REL = 'graph/gravity/index.html'

export function decorate(page, ctx) {
    if (page.rel !== REL) return
    const fm = page.meta || {}
    const e = ctx.md.esc
    const ui = JSON.stringify({ field: fm.by_field, country: fm.by_country, png: fm.png, group: fm.group, canvas: fm.canvas, empty: fm.empty, fail: fm.fail, noscript: fm.noscript })
    const html = `<div class="gv" id="gv" data-root="../../" data-data="../../api/v1/graph/explorer.json" data-ui="${e(ui)}"></div>`
    page.assets = { css: ['assets/graph/gravity.css'], js: ['assets/graph/gravity.js'] }
    const prev = page.postHtml
    page.postHtml = h => html + '\n' + (prev ? prev(h) : h)
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/graph/gravity.js', 'assets/graph/gravity.css']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try { if (!gate.text(REL).includes('id="gv"')) out.push(`${REL} does not carry the infographic`) } catch { out.push(`missing ${REL}`) }
    return out
}
