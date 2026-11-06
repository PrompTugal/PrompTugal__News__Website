// The Algarve Evolution section as a small site (pass 2026-11-06-algarve-evolution-sprint, by dev.portugal@).
// The words and the structure are content/portugal/algarve-evolution.md (layout divs: ae, ae-hero, ae-sec); this feature
// gives that one page its width, its stylesheet and a small script that adds the left-hand map and the collapsing.
export const order = 69
const REL = 'portugal/algarve-evolution/index.html'

export function decorate(page) {
    if (page.rel !== REL) return
    page.layout = 'wide'
    page.crumbs = [['portugal/index.html', 'Portugal'], [null, 'Algarve Evolution']]
    page.assets = { css: ['assets/portugal/algarve.css'], js: ['assets/portugal/algarve.js'] }
}

export function validate(gate) {
    const out = []
    try { const t = gate.text(REL); if (!t.includes('ae-tiles') || !t.includes('ae-sec')) out.push(`${REL} lacks its tiles or sections`) } catch { out.push(`missing ${REL}`) }
    return out
}
