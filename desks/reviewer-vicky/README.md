# The reviewer's desk: Promptugal News

Kept by reviewer@PrompTugal.vicky (until 6 November 2026 reviewer@web-summit.vicky), the reviewer and copy editor for Vicky Wang's journalists. It checks the drafts in `desks/journalist-vicky/drafts/` before Dinis's newsroom agent publishes them, and writes one review per draft in `reviews/<story-id>.md`: a verdict (Ready, Fix first or Hold), then the problems, most important first.

## The checks, in order

1. **Facts.** Every source opened at its own address; every fact, figure, date, name and place checked against it. The summary is checked too, not only the body (S2's "five masterclasses" got past the first review: the agenda lists four). Before reviewing, check `content/articles/` and `desks/journalist-promptugal/drafts/` for the same story. A company's claim is credited to the company; a link between organisations is called a suggestion; a pronoun is used only where the source gives one.
2. **Format** (brief 3, and STYLE.md's "Match the published format" for the technical format): a title under 12 words; "In short" with 3 to 5 bullets; "What this does not claim"; "Where this comes from" with every source linked and its read date; front matter with title, date, author, summary, status, story id and beat (and license and tags). **The front matter must be valid YAML**: any value with a colon in it goes in double quotes, and the front matter is parsed (`yaml.safe_load`) as part of the check. (Rule from Vicky, 5 November 2026, after S10 and S15 passed with unquoted titles.)
2b. **Images** (STYLE.md, "Images"; Vicky, 6 November 2026): checked like text. Each matches its caption, its alt text and its source, and every number in a chart appears, sourced, in the text; public sources only. Render each at phone width (a 390 px screen, a 358 px article column, in light and dark) and look at it: send back any image with overlapping or hard-to-read labels, text under about 12 px at that width, or more than about ten labelled items. Every article has at least one image that works as its cover on `/articles/` (Vicky, 7 November 2026); when publishing, the reviewer makes the cover files from it (`design/infographics/out/<slug>--{paper,ink}--{card,thumb}.png`, 1200 x 630 and 480 x 480, and a row each in its `index.json`, For: designer@PrompTugal.dinis) and checks the card on the live `/articles/` page at phone width. A card is read at about 358 px wide on a phone, so its text is drawn at 42 px or more in the 1200-wide drawing.
3. **Tone and safety:** positive and fair; nothing about a person beyond what is public and professional; no contact details; no claims for RiskMandate; nothing private from the team.
4. **Promptugal's angle:** who could connect with whom, as a suggestion; one line suggested if missing.
5. **Style**, only when 1 to 3 need nothing from the journalist: news pieces 400 to 600 words (700 at most), practical guides around 800 (900 at most), counted from "In short" to the end of "What this does not claim". Cut only if over the limit or clearly better. Never change a fact, figure, date, name, quote, source or "What this does not claim". One commit per style edit.

## Check again

Re-review the Fix first drafts changed since **the commit that wrote the verdict**, not the review file's latest commit. (A later note on a review once hid a fix: S9, 5 November 2026.)

## Publishing

Publishing: only when Vicky asks, and only drafts with `status: approved` (STYLE.md, Status; Vicky, 6 November 2026: on her desks, nothing is published without approved).

**Standing authorisation (Vicky, in the reviewer's session, 10 November 2026, about 22:15 UTC), from then on:** the reviewer publishes factual articles and factual updates from Vicky's desks without asking her each time, once every material claim has been independently verified and cross-checked against accessible sources and all normal publishing checks pass (this checklist, STYLE.md, images and cover, the gate). The reviewer records the approval in the draft (`status: approved`, "at Vicky's standing authorisation of 10 November") and in its review. Still brought to Vicky, with a recommendation, before publishing: any remaining material uncertainty or editorial judgment (for example a claim that rests on a source the reviewer cannot open, a private source, a judgement about tone, angle or what to leave out, or anything touching another desk's article). After each publication, Vicky gets the headline, the live link and a brief verification summary. Not covered: articles of other desks (journalist@PrompTugal.dinis's and the rest), company pages (standing answer 24), and anything the ABP or CLAUDE.md forbids.

## Checking journalist@PrompTugal.dinis

Stopped on 6 November 2026 at Vicky's word: checker@PrompTugal.vicky does that job now (`desks/checker-vicky/`). The reviewer reviews Vicky's desks' drafts only. The earlier findings stay in `reviews/promptugal-dinis/`.
