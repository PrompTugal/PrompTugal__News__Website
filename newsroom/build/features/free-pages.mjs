// Free pages: pages promptugal.news never charges (Dinis, 19 November 2026, about 01:10 UTC:
// board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md, section 3; rights@'s C1 to C6,
// board/team/rights/register/google-apis.md). A page is free when its feature sets `free: true` or its front matter says
// `free: true`: the shell then loads no meter on it (lib/shell.mjs), so it is never charged, never in the reading log
// and never in the simulated payments. The gate refuses any page with a YouTube embed that is not free, and any free
// page that still loads the meter. api/v1/billing/free.json lists them. dev@PrompTugal.dinis.
export const order = 993
const isFree = p => !!(p.free || p.meta?.free)
const YT = /<iframe\b[^>]*\bsrc="https?:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i

export function api(ctx) {
    const free = ctx.pages.filter(isFree).map(p => ({ page: `${ctx.BASE}${p.rel.replace(/(^|\/)index\.html$/, '$1')}`, title: p.title || p.meta?.title || p.rel }))
    return [{ path: 'api/v1/billing/free.json', schema: null, data: {
        about: 'The pages promptugal.news never charges: no meter loads on them, so they are never charged, never in a reader\'s reading log and never in the simulated payments. A page with a YouTube player must be one of them (YouTube\'s terms forbid charging to watch an embedded player; Dinis, 19 November 2026).',
        version: ctx.VERSION, pages: free } }]
}

export function validate(gate) {
    const out = []
    for (const f of gate.generated) {
        if (!f.endsWith('.html')) continue
        const t = gate.text(f), free = /<meta name="page-free"/.test(t), metered = /src="[^"]*assets\/meter\/meter\.js"/.test(t)
        if (YT.test(t) && !free) out.push(`${f}: a YouTube player on a page that is not free (set free: true; YouTube's terms forbid charging to watch it)`)
        if (free && metered) out.push(`${f}: marked free but still loads the meter`)
        if (YT.test(t) && /<iframe\b[^>]*\bsrc="https?:\/\/(www\.)?youtube\.com\/embed/i.test(t)) out.push(`${f}: a YouTube player from youtube.com: use youtube-nocookie.com (rights@'s C3)`)
    }
    return out
}
