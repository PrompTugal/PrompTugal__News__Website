---
title: "Spec: the newsroom section's header and label, in the brand"
by: designer@PrompTugal.dinis
for: dev@PrompTugal.dinis
written: 2026-11-06T01:45Z
issue: WS-177
source: the newsroom move, row 2 (board/the-newsroom-move.md); the build of v0.1.63, looked at in a browser at 1280 and 390 px, light and dark
---
# Spec: the newsroom section's header and label

The move put the section at `/newsroom/`, and the top bar's utility link already says **Newsroom**. The section itself still calls itself "the control centre", and its header does not line up with its own body. This spec changes words and layout only: no new colour, no new face, nothing in `design/brand/`. The files are dev@'s (`newsroom/build/features/newsroom*.mjs`, `assets/newsroom/newsroom.css`); designer@ has not edited them.

## 1. One name: the newsroom

Dinis's word (6 November): the back end is **the newsroom**, and the word has that one meaning. Replace "control centre" everywhere it names the section:

| Where | Now | Becomes |
|---|---|---|
| H1 of `/newsroom/` (`newsroom.mjs:112`, `title:`) | The control centre | The newsroom |
| Breadcrumb (`crumbs:` on every section page) | Home / Control centre | Home / Newsroom |
| The tabs' `aria-label` (`tabs`, `newsroom.mjs:40`) | Control centre | Newsroom |
| The intro paragraph (`newsroom.mjs:90`) | "This is the newsroom's control centre: every agent, ..." | "This is PrompTugal.news's newsroom: every agent, ..." |
| The summary under the H1 | "Every agent working on this newsroom, ..." | "Every agent working on PrompTugal.news, ..." |
| `llms.txt` group (`newsroom.mjs:440`) | ## The control centre | ## The newsroom |
| `api/v1/newsroom/status.json` `about` (`:426`) | The newsroom's control centre as JSON | The newsroom as JSON |
| Footer (`data/site/nav.json`) | "The newsroom" sits alone, in no column | the first link of a column "The newsroom" (see 4) |
| The file header comment (`newsroom.mjs:1`) | The control centre (/newsroom/) | The newsroom (/newsroom/) |

## 2. A label that says where the reader is

Every section page gets one line above the breadcrumb, so a reader who came from an article knows they have left the publication for its back end:

```
THE NEWSROOM · HOW PROMPTUGAL.NEWS IS MADE, IN PUBLIC
```

- IBM Plex Mono 400, `--fs-label` (12px), letter-spacing .06em, uppercase, colour `--ink-3`; "The newsroom" in `--brand` (green), as the section kickers on the front page are.
- No background, no box: a 1px `--hair` rule under it, the width of the section's grid.
- In the markup it is a `<p class="nr-label">` before the crumbs; it is dropped from the markdown twin like the other hooks.

## 3. Line the header up with its body

Today the breadcrumb, H1 and summary sit in the reading column (left edge 307px at 1280px wide) while the tabs, tiles and charts start at 90px, so the page looks as if it has two left edges (brand audit, item 10). The section is a wide layout: put the label, breadcrumb, H1 and summary on the same left edge as the tabs (the `wide` page's grid), and keep the summary to `--measure` (36em) so it still reads. On a phone nothing changes (both are already at the 16px gutter).

## 4. The footer

In `data/site/nav.json` the link "The newsroom" has no column, so it sits alone in the footer (brand audit, item 8), and the back end's pages (Design review, Release history, Synthetic readers) are listed under "PrompTugal.news" with the pages about the publication. Split them:

- **PrompTugal.news:** About and editors, Our disclosure, Powered by RiskMandate, The brief (about the publication).
- **The newsroom:** The newsroom, Release history, Design review, Synthetic readers (how it is made).

Also in that file, item 3 of the brand audit: "Source code" still points at SGit-AI/SGit-AI__Website__Newsroom__Web-Summit; it is PrompTugal/PrompTugal__News__Website.

## 5. The tabs on a phone

At 390px the tabs run off the right edge ("WO..." is cut) with nothing to say they scroll. Give the tab row `overflow-x: auto` with a 24px fade at the right edge (a `mask-image` linear gradient to transparent), and scroll the current tab into view on load. The same fix suits the top bar's section nav, which is cut the same way ("N..." at 390px).

## Not in this spec

The tiles, charts and ASCII pictures keep their look. The admin chart colours (blue, orange, teal) are a separate fix, brand audit item 2: map the agent kinds to green, red, ink and ink-3, as that audit says.

## Done looks like

`/newsroom/` and every section page show the label, "The newsroom" as H1 (on the overview) and in the breadcrumb, one left edge from label to charts at 1280px, the tabs scrollable with a fade at 390px; `grep -rn "control centre" newsroom/ data/site/` finds nothing; the gate OK.
