// The place pages' "Now in <town>" refreshed in the browser from data.promptugal.news's CI collectors (conductor.b@ for
// an agent building on our IPMA data, 18 November 2026: the main site's now files waited on datasci.places@'s wake).
// Adds assets/by-place/now-live.js to every page whose markdown has the now block; the built lines stay as the fallback.
// dev@PrompTugal.dinis.
export const order = 991
export function decorate(p) {
    if (!p.md || !p.md.includes('{.bp-now}') || p.nowLive) return
    p.nowLive = true
    p.assets = { ...(p.assets || {}), js: [...((p.assets && p.assets.js) || []), 'assets/by-place/now-live.js'] }
}
