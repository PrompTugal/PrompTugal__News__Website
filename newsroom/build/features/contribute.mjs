// /contribute/ (Dinis, 9 November 2026, about 20:20 UTC: board/guidance/2026-11-09-contribute-confirmed.md): the page itself, from
// journalist@'s words (desks/journalist-promptugal/contribute/page-words.md) in content/contribute/index.md. The three markers hold the
// places for what needs a sealed, write-only lane that does not exist yet (the submit form, the counts, the beta form: dev@, with the
// Web Summit team's append token); until the lane exists they say so rather than show a form that does nothing.
// dev.pages@PrompTugal.dinis.
export const order = 70
const W = 'Not open yet.'
export const fill = {
    'contribute:form': () => `*${W} The form goes live with the inbox.*`,
    'contribute:counts': () => `*The count of people joined, pieces submitted and pieces published appears here once sending is open.*`,
    'contribute:beta': () => `*${W} The list goes live with the inbox.*`,
}
