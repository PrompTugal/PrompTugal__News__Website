// Data in the browser for the place pages' Faro airport line (Dinis, 19 Nov 2026, about 01:13 UTC:
// board/guidance/2026-11-19-load-the-data-in-the-browser.md): adds assets/by-place/airport-live.js to the pages whose
// Now block has it. The built line stays as the fallback. dev@PrompTugal.dinis.
export const order = 991
export function decorate(p) {
    if (!p.md || !p.md.includes('{.bp-now}') || !p.md.includes('**Faro airport**') || p.airportLive) return
    p.airportLive = true
    p.assets = { ...(p.assets || {}), js: [...((p.assets && p.assets.js) || []), 'assets/by-place/airport-live.js'] }
}
