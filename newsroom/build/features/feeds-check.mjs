// The gate's check of the feeds out (lib/feeds.mjs: every place and every topic, RSS 2.0 and JSON Feed 1.1), so a feed
// that local media take never goes out broken (dev@PrompTugal.dinis, 17 November 2026). Node has no XML parser: the RSS
// check is the envelope, one <item> per JSON item, and no raw '&' or '<' inside a title or description.
export const order = 98
const FEEDS = /^api\/v1\/(by-place|topics)\/[^/]+\/feed\.json$/

export function validate(gate) {
    const out = [], paths = [...gate.generated].filter(p => FEEDS.test(p)).sort()
    if (!paths.length) return ['no feeds were written (api/v1/by-place/<id>/feed.json, api/v1/topics/<id>/feed.json)']
    for (const p of paths) {
        let f
        try { f = gate.json(p) } catch (e) { out.push(`${p} is not JSON`); continue }
        if (f.version !== 'https://jsonfeed.org/version/1.1' || !f.title || !Array.isArray(f.items)) { out.push(`${p} is not a JSON Feed 1.1 (version, title, items)`); continue }
        const bad = f.items.find(i => !i.id || !/^https?:\/\//.test(i.url || '') || !i.title || !/^\d{4}-\d\d-\d\dT/.test(i.date_published || ''))
        if (bad) out.push(`${p}: an item without id, http(s) url, title or date_published (${String(bad.title || bad.url).slice(0, 60)})`)
        const x = p.replace(/\.json$/, '.xml')
        if (!gate.generated.has(x)) { out.push(`${x} is missing beside ${p}`); continue }
        const xml = gate.text(x)
        if (!/^<\?xml version="1.0" encoding="UTF-8"\?>\s*<rss version="2.0"[^>]*>\s*<channel>/.test(xml) || !/<\/channel>\s*<\/rss>\s*$/.test(xml)) out.push(`${x}: not an RSS 2.0 envelope`)
        const items = (xml.match(/<item>/g) || []).length
        if (items !== f.items.length) out.push(`${x} has ${items} items, its JSON twin ${f.items.length}`)
        for (const m of xml.matchAll(/<(title|description|link|dc:creator|category)>([\s\S]*?)<\/\1>/g)) if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)|</i.test(m[2])) { out.push(`${x}: an unescaped character in <${m[1]}>`); break }
    }
    return out
}
