// External links open in a new tab (Dinis, 6 November 2026, GR-22 in board/guidance/2026-11-06-the-ideas-ledger.md):
// the renderer adds target="_blank" rel="noopener" to a link off promptugal.news (lib/markdown.mjs, OUTSIDE); this is
// the gate's check over every built page, so a template or a feature that writes a link by hand cannot miss it.
// The PrompTugal sites (*.promptugal.news) are the site's own family, not the outside world: moving between them is one
// tap in the same tab (Dinis, 19 November 2026, about 03:18 UTC: board/guidance/2026-11-18-the-sites-bar.md, line 23).
export const order = 97
export function validate(gate) {
    const out = [], A = /<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/g
    for (const f of gate.generated) {
        if (!f.endsWith('.html')) continue
        let bad = 0, first = ''
        for (const m of gate.text(f).matchAll(A)) if (!/^https?:\/\/([a-z0-9-]+\.)?promptugal\.news(\/|$)/.test(m[1]) && !/target="_blank"/.test(m[0])) { bad++; first = first || m[1] }
        if (bad) out.push(`${f}: ${bad} link(s) to the outside world without target="_blank" (first: ${first})`)
    }
    return out.slice(0, 40).concat(out.length > 40 ? [`and ${out.length - 40} more pages`] : [])
}
