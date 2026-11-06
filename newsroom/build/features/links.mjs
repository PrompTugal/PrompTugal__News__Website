// External links open in a new tab (Dinis, 6 November 2026, GR-22 in board/guidance/2026-11-06-the-ideas-ledger.md):
// the renderer adds target="_blank" rel="noopener" to a link off promptugal.news (lib/markdown.mjs, OUTSIDE); this is
// the gate's check over every built page, so a template or a feature that writes a link by hand cannot miss it.
export const order = 97
export function validate(gate) {
    const out = [], A = /<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/g
    for (const f of gate.generated) {
        if (!f.endsWith('.html')) continue
        let bad = 0, first = ''
        for (const m of gate.text(f).matchAll(A)) if (!/^https?:\/\/(www\.)?promptugal\.news(\/|$)/.test(m[1]) && !/target="_blank"/.test(m[0])) { bad++; first = first || m[1] }
        if (bad) out.push(`${f}: ${bad} link(s) to the outside world without target="_blank" (first: ${first})`)
    }
    return out.slice(0, 40).concat(out.length > 40 ? [`and ${out.length - 40} more pages`] : [])
}
