// /how-we-publish/: Vicky's desks' daily timeline and publish workflow, read at every build from the checker's file
// desks/checker-vicky/publish-workflow.md (checker@PrompTugal.vicky's request of 6 November 2026,
// desks/checker-vicky/requests/2026-11-06-how-we-publish-page.md). The file is the page: never copied, never edited
// here. Published, no longer a draft (Vicky, 6 November 2026, about 20:15 UTC). Linked from /about/ ("How we make it").
export const order = 15
const SRC = 'desks/checker-vicky/publish-workflow.md', REL = 'how-we-publish/index.html'
export function pages(ctx) {
    if (!ctx.exists(SRC)) return []
    const { meta, body } = ctx.md.frontMatter(ctx.readText(SRC))
    // the shell gives the page its <h1> from the title, so the file's own first heading is left out of the body
    const md = body.replace(/^\s*# [^\n]*\n/, '')
    return [{ rel: REL, title: String(meta.title || 'How we publish'), summary: String(meta.summary || 'How a story becomes an article on PrompTugal.news, step by step.'), md, src: SRC, date: meta.date ? String(meta.date) : undefined, crumbs: [['about/index.html', 'About'], [null, 'How we publish']] }]
}
export function validate(gate) {
    return gate.generated.has(REL) ? [] : [`how-we-publish: ${REL} was not built from ${SRC}`]
}
