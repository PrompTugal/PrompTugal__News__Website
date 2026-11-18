// The gate: every JSON object the site serves under api/v1/ declares its licence (Dinis, 18 November 2026: every piece of
// data carries a license link; board/guidance/2026-11-18-licences-and-submissions.md). The build gives what a feature does
// not declare CC BY 4.0 (lib/licence.mjs); this catches files written as text (feeds, search) and data that slipped past.
// An OpenAPI document's info.license may name an SPDX identifier instead of a url (they are exclusive in OpenAPI 3.1).
// Exempt: the search index's term shards and snips (docs.json declares the licence of the whole index). dev@PrompTugal.dinis.
export const order = 98
const EXEMPT = /^api\/v1\/search\/(terms\/[^/]+|snips)\.json$/

export function validate(gate) {
    const out = []
    for (const p of [...gate.generated].filter(p => /^api\/v1\/.+\.json$/.test(p) && !EXEMPT.test(p)).sort()) {
        let j; try { j = gate.json(p) } catch { continue }
        if (!j || typeof j !== 'object' || Array.isArray(j)) continue
        const l = j.license || j.licence || j._license || (j.openapi && j.info && j.info.license)
        const ok = typeof l === 'string' ? /^https?:\/\//.test(l) : !!(l && (l.url || /^[A-Za-z0-9.+-]+$/.test(l.identifier || '') || (Array.isArray(l.sources) && l.sources.length && l.sources.every(s => s && s.url))))
        if (!ok) out.push(`${p}: no license link (every piece of data carries one: ours, the source's, or "the source's terms")`)
    }
    return out.length > 10 ? [...out.slice(0, 10), `... and ${out.length - 10} more files without a license link`] : out
}
