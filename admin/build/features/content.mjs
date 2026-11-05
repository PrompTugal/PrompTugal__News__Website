// The prose pages: every published content/**/*.md, as the content loader read it (lib/content.mjs).
// Other features decorate some of these (articles) or fill their markers (agenda, companies, articles).
// A page that sits beside its section's index (about/participant.html, summit/agenda.html) gets a crumb to it,
// named as the navigation names that section.
export const order = 10

export function pages(ctx) {
    const byRel = new Map(ctx.content.map(c => [c.rel, c]))
    return ctx.content.map(c => {
        const m = c.rel.match(/^([^/]+)\/(?!index\.html$)[^/]+\.html$/)
        const parent = m && byRel.get(`${m[1]}/index.html`)
        const label = parent && ((ctx.NAV.nav.find(n => n.href === parent.rel) || {}).label || parent.meta.title)
        return { ...c, title: c.meta.title, summary: c.meta.summary, ...(parent ? { crumbs: [[parent.rel, label], [null, c.meta.title]] } : {}) }
    })
}
