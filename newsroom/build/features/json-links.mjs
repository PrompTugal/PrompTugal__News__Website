// No reader-facing link to a .json file outside the API pages (Dinis, 16 November 2026, about 10:40 UTC;
// board/briefs/2026-11-16-live-data-up-front.md, dev.places@'s part): a page that links this site's JSON (an entity's
// "as data", a place's "How this page is made", provenance, the agents panel) links the API page instead, which keeps
// every endpoint one click deeper. Outside sources (IPMA's open data, a commit on GitHub) stay as cited. The gate refuses
// a page outside api/ that links this site's JSON.
import path from 'node:path'
export const order = 99
const API_PAGE = 'api/index.html'
const internal = href => !/^(?:[a-z]+:|\/\/)/i.test(href)
const isApi = rel => rel.startsWith('api/')

export function decorate(p) {
    if (p.raw || isApi(p.rel)) return
    const prev = p.postHtml, to = path.posix.relative(path.posix.dirname(p.rel), API_PAGE) || 'index.html'
    p.postHtml = h => (prev ? prev(h) : h).replace(/(<a\b[^>]*?\bhref=")([^"#?]+\.json)((?:[?#][^"]*)?")/g, (m, a, href, rest) => internal(href) ? a + to + '"' : m)
}

export function validate(gate) {
    const out = []
    for (const f of gate.generated) {
        if (!f.endsWith('.html') || isApi(f)) continue
        let t; try { t = gate.text(f) } catch { continue }
        for (const m of t.matchAll(/<a\b[^>]*?\bhref="([^"#?]+\.json)[?#"]/g)) if (internal(m[1])) { out.push(`${f}: links ${m[1]} (a reader-facing link to JSON outside the API pages: link a page; board/briefs/2026-11-16-live-data-up-front.md)`); break }
    }
    return out
}
