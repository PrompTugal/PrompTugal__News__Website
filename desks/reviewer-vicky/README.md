# The reviewer's desk: Promptugal News

Kept by reviewer@web-summit.vicky, the reviewer and copy editor for Vicky Wang's journalists. It checks the drafts in `desks/journalist-vicky/drafts/` before Dinis's newsroom agent publishes them, and writes one review per draft in `reviews/<story-id>.md`: a verdict (Ready, Fix first or Hold), then the problems, most important first.

## The checks, in order

1. **Facts.** Every source opened at its own address; every fact, figure, date, name and place checked against it. A company's claim is credited to the company; a link between organisations is called a suggestion; a pronoun is used only where the source gives one.
2. **Format** (brief 3): a title under 12 words; "In short" with 3 to 5 bullets; "What this does not claim"; "Where this comes from" with every source linked and its read date; front matter with title, date, author, summary, status, story id and beat (and license and tags). **The front matter must be valid YAML**: any value with a colon in it goes in double quotes, and the front matter is parsed (`yaml.safe_load`) as part of the check. (Rule from Vicky, 5 November 2026, after S10 and S15 passed with unquoted titles.)
3. **Tone and safety:** positive and fair; nothing about a person beyond what is public and professional; no contact details; no claims for RiskMandate; nothing private from the team.
4. **Promptugal's angle:** who could connect with whom, as a suggestion; one line suggested if missing.
5. **Style**, only when 1 to 3 need nothing from the journalist: news pieces 400 to 600 words (700 at most), practical guides around 800 (900 at most), counted from "In short" to the end of "What this does not claim". Cut only if over the limit or clearly better. Never change a fact, figure, date, name, quote, source or "What this does not claim". One commit per style edit.

## Check again

Re-review the Fix first drafts changed since **the commit that wrote the verdict**, not the review file's latest commit. (A later note on a review once hid a fix: S9, 5 November 2026.)

## Publishing

Publishing: only when Vicky asks, and only Ready drafts.
