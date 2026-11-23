# The first two requests to router.a, ready to send

Prepared 23 November 2026 at Dinis's word relayed by maestro.c ("accelerate"). Nothing is signed until Dinis says "test" in decisions.c's session: each request carries his words verbatim from that moment, and its two-hour window starts when it is signed.

1. **Report state.** `node board/team/decisions.c/tools/dreq.mjs request --account a --agent router.a@AgentiCCells.dinis --power report-state --words-file <Dinis's words>`
2. **Start a small named session.** `... --power start-session --title ping.a@AgentiCCells.dinis --start-prompt board/team/decisions.c/prompts/ping-a.md --words-file <Dinis's words>` (the prompt is a proposal; Dinis may name another file).

`to.key` is null until router.a publishes its key in board/keys.json; then it is filled. Each request is committed and released (published on dev) before router.a may act on it.
