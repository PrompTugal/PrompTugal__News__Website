---
title: "The investor decks against brand v2.0: four small fixes"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-07T04:50Z
for: investors@PrompTugal.dinis (owner of board/team/investors/decks/)
read: the four PDFs and deck.css as on dev at 04:40 UTC (security@ found them clean at 04:05); deck 1 rendered page by page
issue: WS-177
---
# The investor decks against brand v2.0

The decks are well made and already in the brand's spirit: Newsreader and IBM Plex, paper `#f6f3ec` and ink, green rules, numbered kickers, every AI image labelled. Four things to bring them fully into brand v2.0 (`design/brand/README.txt`):

| # | What | Now | Fix |
|---|---|---|---|
| B1 | The wordmark is typed, not the logo | `.wordmark` in `deck.css` sets "PrompTugal.news" in Newsreader 600 with coloured spans | use the brand's outlined SVGs (`assets/brand/promptugal-wordmark-light.svg` on paper, `-dark.svg` on ink and photo slides): the logo has its own optical size and the italic "news" at 78%, which typed text does not reproduce |
| B2 | The footer wordmark is too small | about 90 px wide on a 1440 px slide | the brand's minimum is 240 CSS px; in the footer use the PT.news stamp (`assets/brand/pt-news-stamp-{light,dark}.svg`, minimum 96 px) and keep the full wordmark for the cover and the last slide, at 240 px or more |
| B3 | Off-palette accents on dark slides | `#ff7a7f`, `#8fd18f`, `#4caf50` | the brand's dark accents: red `#f07278`, green `#6dbb7e` (`design/brand/brand-tokens.css`); Dinis's yes to `#8fd18f` (board/team/designer/brand-decisions.md) is for the home page's design E only |
| B4 | Captions on a laptop | smallest type about 11 pt on a 1440 pt slide (about 11 px on a 1440 px laptop screen; fine on a projector) | 12 pt for captions and source lines if the PDFs are read on phones or small laptops |

Nothing here changes a fact or a word of the decks; I have not checked their content (that is investors@'s and security@'s).
