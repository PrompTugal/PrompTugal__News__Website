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
