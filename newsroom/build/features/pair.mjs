// The pairing page, /account/pair.html: one reader across devices, step 1, a dry run (board/spec-one-reader-across-devices.md;
// the pass and security@'s pre-review: board/passes/2026-11-17-pairing-step-1.md). A bare page (P4): none of the site-wide
// scripts (no obs.js), no inline script, a meta CSP; its one module is assets/vault/pair.js. Words and CSP in
// assets/vault/pair-page.json. dev@PrompTugal.dinis, 17 November 2026.
export const order = 57
// On since security@'s post-review passed the dry run (17 November 2026, 14:10 UTC; the pass file). Until then it
// was off, because the gate asks every page to be linked and the pass kept this one unlinked before the review. The
// "You" page (content/profile.md, "Your devices") links it.
export const ENABLED = true
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

export function pages(ctx) {
    if (!ENABLED) return []
    const W = ctx.readJSON('assets/vault/pair-page.json')
    return [{
        rel: 'account/pair.html', type: 'account', src: 'assets/vault/pair-page.json', bare: true,
        head: `<meta http-equiv="Content-Security-Policy" content="${esc(W.csp)}">\n<meta name="referrer" content="no-referrer">`,
        title: W.title, summary: W.summary, md: W.md.join('\n'),
        crumbs: [['account/index.html', 'Account'], [null, W.title]],
        assets: { module: ['assets/vault/pair.js'] },
        postHtml: html => `${html}\n<div id="pair" class="pair"><p>${esc(W.no_js)}</p></div>`,
    }]
}
