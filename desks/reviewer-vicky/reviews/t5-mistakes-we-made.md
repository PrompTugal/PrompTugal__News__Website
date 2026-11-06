---
story: T5
draft: desks/journalist-vicky/drafts/t5-mistakes-we-made.md
reviewed: 2026-11-06
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Fix first
---

# T5 review: three mistakes our agents made

**Verdict: Fix first.** The three stories are right in substance; the summary and "In short" say more than the record does, and one sentence has the wrong subject. 635 words: no cut needed. Reviewed as of commit `a4f05b23`; held for Vicky's approval in any case.

Checked 6 November 2026, about 21:45 UTC, against every cited commit (`6935cbd3`, `1da8fb9b`, `44a43911`, `cf2ed858`), STYLE.md, the curator's README, the published S9, the reviewer's note on source links, Vicky's agents' reports and prompts files and `people/vicky/decisions.md` on the team site.

## Fix first

1. **Summary: "...and kept pushing to an old address."** One push went to the old address (journalist@PrompTugal.vicky's, about 11:15 UTC, in its own report); every other report says the address was reset before any push, and one says a pull went through it. Suggest: "...and found their copies pointing at an old address."
2. **Summary: "None of it lasted the day: each mistake became a written rule that every agent now reads before it works."** and In short, bullet 4. The old address kept coming back all day (reports at 16:56 and 17:49); the links were fixed in the build, not by a rule; and the rules (STYLE.md, decisions.md, the prompts files) bind Vicky's agents only. Suggest: "Each mistake left a written rule for Vicky's agents, or a fix in the site itself."
3. **In short, bullet 1: "every writer now checks both teams' drafts and the published articles first."** The rule is in Vicky's journalists' style guide; it binds Vicky's writers. Suggest "each of Vicky's writers".
4. **"Many drafts listed their sources as bare addresses between angle brackets."** It was the published articles: the reviewer's note and commit `44a43911` count "0 of 100 sources clickable" on the 14 news articles published by Dinis's journalist. Suggest "Many published articles".
5. **"This writer has used it: one storyline was skipped on 6 November because it repeated an earlier draft."** The skip was S12, which repeated the writer's own S15 (journalist-ai's report): that is the older "check drafts/ first" line of STYLE.md, not Vicky's new rule about Dinis's drafts and the published articles. Reword so it doesn't claim the new rule, or cut it.
6. **Pronouns.** "her journalists' style guide" and "Her reviewer": no source gives Vicky's pronouns (the team's `data/team.json` uses "they"), so STYLE.md says use the name: "Vicky's journalists' style guide", "Vicky's reviewer".

## Small, the journalist's call

- "Dinis Cruz's journalist reworked it the next morning from that first version": the article says it was "Rewritten ... on 6 November" "from the project's data", crediting the first version; no time is given. "Rewrote it on 6 November, crediting that first version" is exact.
- "Vicky's journalists now start every scheduled run by checking the address": true (step 2 of their scheduled prompts), but the prompts files (`people/vicky/prompts/journalist*.md`) are not in the source list. Add them.
- The source list shortens commit `44a43911`'s subject; its full subject begins "note for dev, the build doesn't render <url> ...".
- "three that Vicky Wang asked about": Vicky can confirm; I found no record of the request.

## The closing line (all of T1 to T5): for Vicky

See `t2-who-does-the-work.md`, "The closing line".

## What checks out

S14, S21 and S23 dropped as duplicates at Vicky's word (`6935cbd3`, 20:50 UTC); Vicky's rule of 10:03 UTC, quoted word for word as in STYLE.md; the reviewer checking before reviewing; "0 of 100" at 10:49 UTC; dev@PrompTugal.vicky's build fix at 18:58 UTC; the named-link format; S9 drafted on 5 November by Vicky's journalist and published by Dinis's; "at least seven" agents found the old address (eight did); the one push GitHub forwarded, owned up to in the agent's own report; standing answers 3, 6 and 9; T1's capital letter, fixed in about a minute with no release in between. Nothing unfair to a named agent; no contact details; nothing personal beyond the professional.

## Status

Set to `status: fix`. No style edit yet.

## Check again, 6 November 2026, about 22:10 UTC

journalist-ai's commit `bfecef10` changes only the closing line, which now names "the RiskMandate booth, A1-30 in Pavilion 1", as the source says. Still open: the Fix first points above, the booth details' non-public origin (Vicky's call), and moving the stand's source line from "Who made this" into "Where this comes from". Verdict unchanged: Fix first.

## Check again, 6 November 2026, about 22:25 UTC

**Verdict: Ready. Held for Vicky's approval.** journalist-ai's commit `d2586e1c` makes every Fix first change above, each checked at its source. The booth line stands with Dinis's yes (21:35 UTC, Vicky's word).

Style edit (mine, committed on its own): the stand's source line moved from "Who made this" into "Where this comes from", unchanged. Words: 659, unchanged; no cut needed.

Status: `ready`. Vicky sets `approved`.

Checked: The summary and In short now say what the record says (one push; rules for Vicky's agents, or a fix in the site); "published articles", not drafts; the skip under the older line of STYLE.md; S9 "rewritten on 6 November, crediting" the first version; the prompts files and the full commit subject in the sources; "three that Vicky Wang asked about" dropped.

## Images, 6 November 2026, about 22:25 UTC

At Vicky's word, images only (journalist-ai's commits `732a07c3` and `7f1d77fd`), rendered at phone width (390 px screen, 358 px in the article column, as on the live T1 page). The before and after image: the same two sources of [Road 2 Web Summit](https://promptugal.news/articles/road-2-web-summit-2026.html), Executive Digest and Tek Notícias, as in the article; before, the addresses in angle brackets as plain text (v0.1.316, built before dev@PrompTugal.vicky's fix `cf2ed858` at 18:58 UTC); after, the same addresses as links (v0.1.358). Matches the caption, the alt text and the story. Readable on a phone. **Images: pass.**
