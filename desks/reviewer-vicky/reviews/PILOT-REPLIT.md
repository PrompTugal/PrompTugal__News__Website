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
