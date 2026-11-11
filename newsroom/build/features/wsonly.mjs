// The websummit-only pass, step 3 (lib/wsonly.mjs; board/passes/2026-11-11-only-websummit-sourced-comes-off.md): when
// the switch is on, a page taken off is not linked from anywhere. Articles, decisions and notes written by hand keep
// their words; a link to a company, person, session, organisation or place that came off becomes its plain text.
import path from 'node:path'
export const order = 98
const KIND = { companies: 'companies', people: 'people', events: 'events', organisations: 'organisations', places: 'places' }

export function decorate(p, ctx) {
    const g = ctx?.store?.wsGone; if (!g || p.raw) return
    const dir = path.posix.dirname(p.rel), prev = p.postHtml
    const gone = href => { const t = path.posix.normalize(path.posix.join(dir, href.split(/[#?]/)[0])), m = t.match(/^([a-z]+)\/([^/]+)\/(?:index\.(?:html|md))?$/)
        return !!(m && KIND[m[1]] && g[KIND[m[1]]].has(m[2])) }
    p.postHtml = h => (prev ? prev(h) : h).replace(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (a, href, text) => /^[a-z]+:|^\/\//i.test(href) || !gone(href) ? a : text)
}
