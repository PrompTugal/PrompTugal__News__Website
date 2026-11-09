---
story: PILOT-REPLIT
draft: desks/journalist-vicky/companies/replit.md
reviewed: 2026-11-08
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Ready
---

# PILOT-REPLIT review: About, At Web Summit 2026 and From the newsroom, for Replit's company page

**Verdict: Ready**, after two small fixes of my own (standing answer 17). A manual run at Vicky's word (8 November 2026, after 14:30 UTC), per decisions.md's PILOT-REPLIT. Reviewed as of commit `88279dbb`. Vicky approved publishing once this review and dev's page checks pass.

Checked 8 November 2026, about 14:50 UTC, every source opened that day (Web Summit's pages and Replit's in a headless browser; Replit's FAQ also in its HTML).

## "Media only": an explicit public source

Yes. Web Summit's own session page says: "This press conference is held in the Media Village. Media event only." The label stays, with that page cited, as the content has it.

## Times

Listed as Web Summit lists them, with no time zone added: Tuesday 10 November, 14:00 to 14:20 (Centre Stage), 15:00 to 15:20 (Stage 2, press conference, Media Village) and 16:00 to 16:20 (Stage 13, AI Summit). The content says "Times are as Web Summit lists them" and to check the app on the day: right.

## What checks out

- **About**, four sentences, each against its source: Replit's "the AI platform that helps you turn your ideas into real outcomes" and "Describe what you want in natural language" ("no coding needed", on its home page); its Agent's "write, test, fix, and publish your software" (Replit's own description of the Agent page) and "automatically searches the Web as needed to ensure it has access to the latest information"; Web Summit's partner listing, Replit in "AI & machine learning", "United States" (the partners page and Replit's appearance page).
- **At Web Summit 2026**: event partner, AI and machine learning; the three sessions' titles, times, stages and speaker (Michele Catasta, President, Replit) match their session pages; the press conference is "Media only".
- **From the newsroom**: S28, published 8 November 2026. It is the only published article that names Replit (checked in `content/articles/`, 8 November 2026, about 14:50 UTC).
- Public, professional facts only; no contact details, outreach, CRM or meeting claims; no em-dashes; British spelling. S28 unchanged.

## My edits, committed on their own

1. "Replit is a US company that calls itself ..." became "Replit calls itself ...": the cited Replit page does not say where it is based. "United States" stays where it is sourced, in the last sentence (Web Summit's listing).
2. The closing internal note ("No other published article on this site names Replit (checked in content/articles/ ...)") moved here: it is a process note, not page copy.

## For dev (the hand-off)

The file is `status: ready`. As PILOT-REPLIT says: two optional sections on the company page template, companies only ("About" from this file when Ready; "From the newsroom", the published articles that link to `../companies/<id>/`), and "Media only" on Replit's press conference session; nothing else on any page and no `data/` file; the gate; Replit's page at 390 px and at desktop width; then release, For: dev.pages@PrompTugal.dinis and dev@PrompTugal.dinis. The "From the newsroom" link here is written root-relative (`/articles/...`); on the page, use the site's relative links.

## Live, 8 November 2026

Built and released by dev@PrompTugal.vicky at 14:53 UTC (`4417f18f`, site v0.1.714): https://promptugal.news/companies/replit/ shows the About section, From the newsroom and the "Media only" tag. (Corrects my report line of 15:20, which still said it waited for dev.) TRIAGE-REPLIT's checks D2 and D3 follow at the 16:20 re-check.

## SA23-REPLIT, the About section under standing answer 23, 8 November 2026, about 17:05 UTC

**Verdict: Ready**, after two small attributions of mine (standing answer 17). Reviewed as of journalist-connections' commit `556e9299` ("SA23-REPLIT ready for review"), at Vicky's word, a manual run.

**Against standing answer 23:** three short, plain sentences on what Replit does; no marketing quotes (the earlier "the AI platform that helps you turn your ideas into real outcomes" is gone); no event details (the partner listing moved out; Web Summit is cited only for where Replit is based); the sources, numbered, with their read dates, in a list below the paragraph; each claim marked with its source number.

**Each claim, re-read today (8 November):**
- "a US company" (3): Web Summit's Replit page, "United States".
- builds apps and websites from a plain description; "no coding needed" (1): Replit's home page, "Describe what you want in natural language" and "Turn ideas into apps in minutes — no coding needed". A company claim, now attributed.
- Replit Agent writes, tests and fixes the code and gets the app ready to publish (2): Replit's Agent page, "let AI write, test, fix, and publish your software" and its FAQ, Agent "writes the code ... and gets it ready to publish" (it also says you then publish it with one click).
- built-in database, sign-in and hosting, and outside tools (1): Replit's home page, "Built-in services with zero setup: Authentication, Database, Hosting, and Monitoring" and "100+ integrations".

**My edits, committed on their own:** "with no coding needed (1, 3)" became "(3) ... ; no coding is needed, the company says (1)", so the company's claim is attributed and the US fact has its own marker; "publishes the result" became "gets the app ready to publish", Replit's own FAQ wording.

The file's other sections are unchanged. Status: `ready`. Handed to dev: show the About with its source list below the paragraph (decisions.md, SA23-REPLIT, step 3).
