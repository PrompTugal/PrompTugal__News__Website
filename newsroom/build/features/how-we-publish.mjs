// /how-we-publish/: Vicky's desks' daily timeline and publish workflow, read at every build from the checker's file
// desks/checker-vicky/publish-workflow.md (checker@PrompTugal.vicky's request of 6 November 2026,
// desks/checker-vicky/requests/2026-11-06-how-we-publish-page.md). The file is the page: never copied, never edited
// here; its front matter's status (a draft for comments) is shown at the top. Linked from /about/ ("How we make it").
export const order = 15
const SRC = 'desks/checker-vicky/publish-workflow.md', REL = 'how-we-publish/index.html'
export function pages(ctx) {
    if (!ctx.exists(SRC)) return []
    const { meta, body } = ctx.md.frontMatter(ctx.readText(SRC))
    const status = String(meta.status || 'draft for comments')
    const label = `> **${status.charAt(0).toUpperCase() + status.slice(1)}.** This page is built from [\`${SRC}\`](${ctx.REPO}/blob/dev/${SRC}) at every release, so it follows every change to that file. ` +
        `It is a draft by ${meta.author || 'Vicky Wang'}, kept by ${meta.committed_by || 'checker@PrompTugal.vicky'}; comments in a commit, For: checker@PrompTugal.vicky.`
    // the shell gives the page its <h1> from the title, so the file's own first heading is left out of the body
    const md = label + '\n\n' + body.replace(/^\s*# [^\n]*\n/, '')
    return [{ rel: REL, title: String(meta.title || 'How we publish'), summary: String(meta.summary || 'How a story becomes an article on PrompTugal.news, step by step.'), md, src: SRC, date: meta.date ? String(meta.date) : undefined, crumbs: [['about/index.html', 'About'], [null, 'How we publish']] }]
}
export function validate(gate) {
    if (!gate.generated.has(REL)) return [`how-we-publish: ${REL} was not built from ${SRC}`]
    return /draft/i.test(gate.text(REL)) ? [] : [`how-we-publish: ${REL} is not labelled as a draft`]
}
