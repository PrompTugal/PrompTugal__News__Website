---
title: "Brand decisions: Dinis's answers on the brand v2.0, one row each"
kept_by: designer@PrompTugal.dinis
rule: the brand is Dinis's (ROLE.md, CLAUDE.md "Decisions are pages"); design/brand/ stays as he approved it; this file records each later answer, where it came from and what it changes
---
# Brand decisions

The brand v2.0 (`design/brand/`, the guide `Promptugal-Brand-Guide.pdf`) is the default everywhere. Each row below is an answer from Dinis that changes or extends it, with how it reached the designer.

| When (UTC) | Question | Dinis's answer | How it reached me | What it changes |
|---|---|---|---|---|
| 7 Nov, about 01:20 | May a home page design keep its own palette (F's violet, G's coral and gradient)? | "1 yes, F and G can keep their own colours" | relayed by conductor.b@ at 01:53; recorded verbatim in board/team/conductor.b/status.json ("decisions_from_dinis", commit 9176b834) | F (Signal) and G (The Magazine) use Silvio's palettes, inside their own designs only, with the contrast fixes below; brand v2.0 everywhere else |
| 7 Nov, about 01:20 | Is E's lead band in a deepened green (`#0a3a14`, mint accent `#8fd18f`) a yes? | asked together with the row above as question 1; conductor.b@ reads "1 yes" as covering both | the same record: the question named E's green, his answer names only F and G | none needed: E's band is live in these colours since v0.1.377. If the verbatim record says otherwise, E goes back to `#006600` |

## The palettes now allowed, and the contrast they need

Silvio's own tokens (people/silvio/lab/mocks/f.htm, g.htm at ea7f277). Fills, gradients and large type as Silvio drew them; small text (under 24 px, or 19 px bold) needs 4.5:1, so four shades are darkened for text only, keeping the hue:

| Design | Token | Silvio's | As a fill | As small text on paper |
|---|---|---|---|---|
| F | paper, ink, rule, muted | `#f7f8fc`, `#151733`, `#e3e5f0`, `#5a5f7d` | as drawn | muted 5.9:1, fine |
| F | violet (solid, a1) | `#6d4aff` | as drawn; white on it 5.2:1 | 4.9:1, fine |
| F | magenta (red) | `#e11d74` | as drawn | `#da1c71` (4.5:1; Silvio's is 4.3) |
| F | cyan (a2) | `#0891b2` | as drawn | `#077b97` (4.6:1; Silvio's is 3.5) |
| F | green (a3) | `#0e9f7e` | as drawn | `#0b8166` (4.6:1; Silvio's is 3.2) |
| G | paper, ink, rule, muted | `#fffaf3`, `#16131f`, `#ecdfcf`, `#625b6e` | as drawn | muted 6.2:1, fine |
| G | coral (red) | `#ff6a4d` | as drawn | do not use for small text (2.7:1); use ink or blue |
| G | blue (green slot) | `#3b5bfd` | as drawn | 4.9:1, fine |
| G | yellow band | `#ffd23f` | ink on it 12.7:1 | |
| G | the hero gradient | `#ff6a4d` to `#ff4f8b` to `#7b61ff` | as drawn | white on its coral end is 2.8:1: put a 30% ink scrim (`rgba(22,19,31,.3)`) behind the hero's text, or the text in ink (6.5:1 on coral, 5.9 on pink); the headline needs 3:1 at least, the standfirst 4.5:1 |

The wordmark stays the brand's own (the light wordmark on F's and G's papers; the dark one on G's hero if the text goes white). The footer, the top on inner pages and every other page stay brand v2.0.
