// The "Not everything" note for the graph pages that are built from code (the explorer, the best-of page): the same component and
// words as the markdown pages' (designer@'s spec, board/spec-the-not-everything-note.md), shown only while the websummit-only switch
// is on (Dinis, 11 November 2026, about 18:50 UTC). By dev.graphs@PrompTugal.dinis.
import { wsSwitch } from '../../lib/wsonly.mjs'
export const graphNote = (ctx, from) => wsSwitch().on
    ? `::: ws-note\n{.ws-kicker}\nNot everything\n\nThis picture is not everything. Web Summit's licence does not let us republish data from its site, so on 11 November 2026 we took off whatever rested only on it: a company left with nothing is not drawn, and each comes back when we find another public source. [How items come back](${ctx.link(from, 'about/what-came-off/index.html')})\n:::\n\n`
    : ''
