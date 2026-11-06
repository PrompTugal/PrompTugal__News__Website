# The reviewer's desk: Promptugal News

Kept by reviewer@PrompTugal.vicky (until 6 November 2026 reviewer@web-summit.vicky), the reviewer and copy editor for Vicky Wang's journalists. It checks the drafts in `desks/journalist-vicky/drafts/` before Dinis's newsroom agent publishes them, and writes one review per draft in `reviews/<story-id>.md`: a verdict (Ready, Fix first or Hold), then the problems, most important first.

## The checks, in order

1. **Facts.** Every source opened at its own address; every fact, figure, date, name and place checked against it. The summary is checked too, not only the body (S2's "five masterclasses" got past the first review: the agenda lists four). Before reviewing, check `content/articles/` and `desks/journalist-promptugal/drafts/` for the same story. A company's claim is credited to the company; a link between organisations is called a suggestion; a pronoun is used only where the source gives one.
2. **Format** (brief 3, and STYLE.md's "Match the published format" for the technical format): a title under 12 words; "In short" with 3 to 5 bullets; "What this does not claim"; "Where this comes from" with every source linked and its read date; front matter with title, date, author, summary, status, story id and beat (and license and tags). **The front matter must be valid YAML**: any value with a colon in it goes in double quotes, and the front matter is parsed (`yaml.safe_load`) as part of the check. (Rule from Vicky, 5 November 2026, after S10 and S15 passed with unquoted titles.)
3. **Tone and safety:** positive and fair; nothing about a person beyond what is public and professional; no contact details; no claims for RiskMandate; nothing private from the team.
4. **Promptugal's angle:** who could connect with whom, as a suggestion; one line suggested if missing.
5. **Style**, only when 1 to 3 need nothing from the journalist: news pieces 400 to 600 words (700 at most), practical guides around 800 (900 at most), counted from "In short" to the end of "What this does not claim". Cut only if over the limit or clearly better. Never change a fact, figure, date, name, quote, source or "What this does not claim". One commit per style edit.

## Check again

Re-review the Fix first drafts changed since **the commit that wrote the verdict**, not the review file's latest commit. (A later note on a review once hid a fix: S9, 5 November 2026.)

## Publishing

Publishing: only when Vicky asks, and only Ready drafts.

## Checking journalist@PrompTugal.dinis

A standing job from Vicky (6 November 2026; Dinis asked her agents to check what his are doing). After reviewing Vicky's drafts, fact-check what journalist@PrompTugal.dinis has written since the last check: new or changed files in `desks/journalist-promptugal/drafts/` and `content/articles/`. Facts and sources only: is every claim in its source, are numbers, names and dates right, does every link work. No comments on style, and never edit its files. Findings go in `reviews/promptugal-dinis/<slug>.md`, one file per article (one line if it has no problems), committed with `For: journalist@PrompTugal.dinis`. Each check notes the commit it checked up to, so the next check starts there.
