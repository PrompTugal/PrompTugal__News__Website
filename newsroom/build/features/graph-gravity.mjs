// The big graphs' pages: centres of gravity (/graph/gravity/) the industry map (/graph/industry/) RiskMandate's ring (/graph/riskmandate/) and the world map (/graph/world/), animated canvas
// infographics from api/v1/graph/explorer.json (pass the-big-graphs). By dev.graphs@PrompTugal.dinis, 6 November 2026
// (WS-177). Each page and its words are content/graph/<name>.md; this feature adds the mount point and the assets.
export const order = 86
const PAGES = {
    'graph/gravity/index.html': { id: 'gv', name: 'gravity', ui: ['by_field', 'by_country', 'png', 'canvas', 'empty', 'fail', 'noscript'] },
    'graph/industry/index.html': { id: 'gi', name: 'industry', ui: ['replay', 'png', 'canvas', 'empty', 'fail', 'noscript', 'caption', 'open'] },
    'graph/riskmandate/index.html': { id: 'gr', name: 'riskmandate', ui: ['replay', 'png', 'canvas', 'empty', 'fail', 'noscript', 'caption', 'open', 'reach', 'mandate', 'gap', 'notasked'] },
    'graph/world/index.html': { id: 'gw', name: 'world', ui: ['all', 'png', 'canvas', 'empty', 'fail', 'noscript', 'caption', 'lisbon', 'count', 'europe', 'worldv'], extra: 'data-world="../../assets/graph/world.json" data-outline="../../assets/vendor/world-atlas/countries-110m.json"' },
    'graph/algarve-evolution/index.html': { id: 'ae-viz', name: 'algarve-evolution', dir: 'portugal', ui: [], extra: 'data-data="../../api/v1/portugal/algarve-evolution-viz.json" data-outline="../../assets/portugal/algarve-outline.json"', plain: true },
}

export function decorate(page, ctx) {
    const P = PAGES[page.rel]
    if (!P) return
    const fm = page.meta || {}, e = ctx.md.esc
    const ui = JSON.stringify(Object.fromEntries(P.ui.map(k => [k, fm[k]]).map(([k, v]) => [k === 'by_field' ? 'field' : k === 'by_country' ? 'country' : k, v])))
    const html = P.plain ? `<div id="${P.id}" ${P.extra}></div>` : `<div class="gv" id="${P.id}" data-root="../../" data-data="../../api/v1/graph/explorer.json" data-ui="${e(ui)}"${P.extra ? ' ' + P.extra : ''}></div>`
    page.assets = { css: ['assets/graph/gravity.css'], js: [`assets/${P.dir || 'graph'}/${P.name}.js`] }
    const prev = page.postHtml
    page.postHtml = h => html + '\n' + (prev ? prev(h) : h)
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/graph/gravity.js', 'assets/graph/industry.js', 'assets/graph/riskmandate.js', 'assets/graph/world.js', 'assets/graph/world.json', 'assets/vendor/world-atlas/countries-110m.json', 'assets/vendor/world-atlas/LICENSE.txt', 'assets/graph/gravity.css', 'assets/portugal/algarve-evolution.js', 'assets/portugal/algarve-evolution-data.json', 'assets/portugal/algarve-outline.json']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    for (const [rel, P] of Object.entries(PAGES)) { try { if (!gate.text(rel).includes(`id="${P.id}"`)) out.push(`${rel} does not carry the infographic`) } catch { out.push(`missing ${rel}`) } }
    return out
}
