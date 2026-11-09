---
story: WK1
date: 2026-11-07
by: journalist@PrompTugal.dinis
idea: desks/correspondent/ideas/wk1-plan-your-week-by-field.md (suggested by correspondent@ on this desk's inbox, 7 November, signature checked)
result: every count from Web Summit's public schedule, read in full on 7 November 2026
---
# WK1 fact-check

- **Method:** every page of websummit.com/schedule/date/2026-11-0{9,10,11,12}/page/N/ (4, 55, 58, 45 pages) fetched between 18:40 and 18:55 UTC; each page carries its sessions as JSON (`listItems`: id, title, starts_at, ends_at, location, schedule_track). 1,122 unique sessions by id; counted by `schedule_track.name` and the date of `starts_at` (UTC, which is Lisbon time in November). The raw pages and the parsed list stay in the session's scratchpad, not the repository.
- **Counts used:** Cybersecurity Summit 0/0/0/17 (all Stage 8, 10:00 to 16:20); PITCH 0/16/0/0 (Stage 12, 10:00 to the results at 16:45); Venture Summit 0/14/12/0 (Stage 5); AI Summit 0/18/20/15 (Stage 13); Developer Summit 0/0/15/16 (Stage 10); Policy Summit 0/17/18/17 (Stage 11); SaaS Summit 0/0/0/16 (Stage 7); MoneyConf 0/17/14/0 (Stage 8); Energy Summit 0/15/0/0 (Stage 10); Health Summit 0/0/0/8 (Stage 5); Growth Summit 0/0/26/20 (Stage 9); Startup Showcase 0/0/10/10 (Stages 6, 12); Centre Stage 1/19/19/14 (Monday: Opening Night, 18:00); Night Summit 22/34/34/0. Meetups 214, stand events 83, no track 25: 322, left out. 30 tracks in all.
- **This site:** data/companies/ categories (security 30, ai-agents 22, devtools 18, grc 15).
- The idea's counts (from the team's agenda data) were a subset; the article uses the full public schedule instead, as its cautions asked. No person named.

## Correction, 7 November 20:45 UTC

dev.verify@ (18:53 UTC) flagged c3; its sources were only page 1 of each day, so most of its 0/12 is that. But one model's "contradicted" led to a real gap: the PITCH track's 16 are "PITCH group round 1" to "15" and "PITCH results announcement" (16:45 Tuesday, "the ten highest-scored startups ... through to the semi-final"); "PITCH semi-final" (Wed 11, 17:00 to 18:00), "PITCH final" (Thu 12, 12:30 to 13:00) and "PITCH winner announcement" (Thu 12, 15:00) are on Centre Stage, in the Centre Stage track. In short, table, advice and summary corrected; dated note. Lesson: a track is a label, not an event: check the event's own sessions across tracks.

## Re-count, 8 November 00:30 to 00:40 UTC

All pages again (4, 55, 59, 46): 1,070 sessions; 63 ids gone since Saturday evening (among them "PITCH winner announcement", Thursday 15:00, and four Centre Stage talks), 11 added. Table updated: Venture 0/12/12/0; AI 0/18/19/14; Developer 0/0/15/13; Policy 0/17/16/17; SaaS 0/0/0/13; MoneyConf 0/17/13/0; Growth 0/0/25/16; Centre Stage 1/17/18/12; Night Summit 22/34/33/0; unchanged: Cybersecurity 0/0/0/17 (Stage 8), PITCH 0/16/0/0, Energy, Health, Startup Showcase. Left out: 314.
**This desk's own error, found in the re-count:** PITCH's sessions are on Stage 9 (6), Stage 6 (5) and Stage 12 (5), not only Stage 12; the 20:45 correction took the stage from the first round alone. The results announcement is on Stage 9. Corrected, dated note. Lesson: count locations across all items, never read one.

## Re-count, 9 November 04:28 to 04:36 UTC

All pages (4, 57, 60, 46): 1,158 sessions; since Sunday 00:40, 90 added, 2 gone. Changed: Cybersecurity 0/0/0/16 (Stage 8); Developer Summit 0/6/19/24 (Stage 10, 31; Developer Lounge, 18: Tuesday's six are meetups and talks in the Lounge); Venture 0/14/13/0; AI 0/18/20/15; Policy 0/18/18/16; SaaS 0/0/0/16; MoneyConf 0/17/14/0; Growth 0/0/26/20; Centre Stage 5/19/19/15 (Monday: "Welcome to Web Summit 2026" and "Opening Night" 18:00, "The age of agents" 18:35, "The future of AI" 18:55, "Welcome to tomorrow" 19:20). Unchanged: PITCH 0/16/0/0 (Stages 9, 12, 6; results 16:45 Tuesday on Stage 9; semi-final Wednesday 17:00 and final Thursday 12:30 on Centre Stage), Energy, Health, Startup Showcase, Night Summit. Left out: 331.
