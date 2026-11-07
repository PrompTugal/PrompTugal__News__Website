---
title: "The PHP newsroom's lesson: a sourced site with no one sent to it"
for: every PrompTugal agent; first outreach@, observability@, correspondent@, journalist@, the conductor
by: historian@PrompTugal.dinis
written: 2026-11-07T02:30Z
idea: VE-04 in board/guidance/2026-11-06-the-ideas-ledger.md (Dinis at the 18:00 stand-up of 5 November, 00:08:54: "I built this for the PHP website, but I didn't have enough traffic")
asked_by: Dinis Cruz's "yes" to "start VE-04?", about 01:20 UTC on 7 November, relayed by conductor.b@PrompTugal.dinis on the session channel; not yet in a commit when this was written
source: the PHP newsroom's four public repositories, read from clones on 7 November 2026, nothing written there. SGit-AI/SGit-AI__Website__Newsroom__2026__Oct__PHP (the site to 25 October, dev at 469bc18d70), its __team (14bd078fd7), __site (a04cb41bf3) and __data (6d500d6390). Named in BRIEF.md as php.oct.2026.newsroom.ai
status: a brief, not an instruction. Only Dinis instructs; where a lesson asks for a change in your lane, it is yours to weigh and his to decide if it changes the rules
issue: WS-177
---
# The PHP newsroom's lesson

Dinis said it in one line at the stand-up where PrompTugal was named: the sourcing model "I built this for the PHP website, but I didn't have enough traffic". This brief reads that site's own record to see what it built, how many people read it, and what it did and did not do to reach them. Every figure below is from a file or commit named beside it. Where the record stops, it says so.

## What the PHP newsroom was

- **A tracker for one story.** php.oct.2026.newsroom.sgit.ai covered the two PHP flaws of October 2026 (CVE-2026-109618 and CVE-2026-109619, "php2shell"): "a fact-driven, agent-run tracker ... built from a private evidence vault, deterministic, with provenance on every line" (`README.md`, main repository).
- **Started on 22 October 2026** "with two voice memos" (the editor's interview, `interview/index.md`, line 11). Its first commit is 2026-10-22T09:51+01:00.
- **The sourcing model, fully built.** A private evidence vault (144 sources, 137 captures, 857 hashed files at one point; `REALITY.md`, "Evidence"); every data row cites vault slugs and "the gate refuses an unknown slug" (`REALITY.md`, "Data"); by 25 October, 27 parties with a page each and 418 sources saved, every claim joined to who states it and who relays it (`records/briefs/2026-10-25__brief__interviews-and-outreach.md`, __team, "What we already hold").
- **Much else around it**: fifteen reader personas, a glossary, versioned sections with diffs, a phone app, billing with a simulated cart, synthetic readers, telemetry (`REALITY.md`, its sections from v0.2.3 to v0.5.1). It is the same estate shape PrompTugal copied (BRIEF.md names it as a model).

## How many read it

The site measured its readers itself, anonymously, and published the counts.

- **From 22 October 13:43 to 23 October 20:26 UTC** (about 31 hours): 1,093 page views in all. Readers: **233 page views in 168 sessions**. Crawlers: 565. Synthetic (agents, tests): 176. The editor and the team: 119 (`data/telemetry-public.json`, `as_of` 2026-10-23T20:26Z; the same figures in `data/telemetry-report.json`).
- The team's own story on it, the same evening: "Crawlers are more than half; readers are a fifth." "Without the groups, every chart on this site would have been mostly Google." And: "**The front page is a front door that leaks.** 113 reader visits started there, and 81% of them read nothing else" (`articles/the-telemetry-tools/index.md`, lines 33, 35, 77; commit b8033a1438, v0.10.12).
- **Where readers came from:** most with no referrer (typed, bookmarked, shared in a message); LinkedIn 14 sessions; kode24.no, a Norwegian developers' site, 14, whose readers stayed longest (same story, line 83). One outside site that linked to it brought as many sessions as LinkedIn, with readers who went further.
- **The record stops there.** No reader count after 23 October 20:26 UTC is in the four repositories: the data repository's copy of the report (`files/telemetry-report.json`, last changed 26 October, 5279e08) still holds the 23 October figures. The counts may exist in the private telemetry vault, which this brief cannot read. So the record shows a small first readership; it does not show the curve after it.

## What it did to reach readers, and what it did not

- **The outreach was drafted, not sent.** Twelve correction requests to publishers, from the fact-check desk's findings, to go out under Dinis's name. In the data repository's last version of the file (`files/outreach.json`, 25 October 15:54 UTC, 9d69dd5): 11 "drafted", 1 "blocked", **none "sent"**. The 25 October outreach brief says the same: "all drafted and none sent".
- **Interviews were planned, not held.** The same brief lists 27 parties to ask, with the site's page on each as "the gift and the opening line". The site holds the editor's own interview and, in `REALITY.md`, "No guest piece yet; no intake".
- **Real readers were never tested.** "Not built: ... real-reader testing" (`REALITY.md`, "Synthetic readers"); six synthetic readers ran instead.
- **The work turned inward.** On 25 October the site split into six repositories ("This repository is closing", `README.md`); the busiest days were 145 commits on 24 October in the site repository and 278 on 27 October in the team repository, the repository of the board, roles and run records (its `README.md`); it fell to 6 on 6 November (commit counts per day across the four repositories, from `git log`).

## What it teaches PrompTugal.news

1. **Sources are the product's floor, not its reach.** [everyone] The PHP site had provenance on every line and 233 reader page views in its first 31 hours. Sourcing made it right; nothing in it made it read. The stand-up set this site's measure as "how much visits we can get" and referrals (`board/guidance/2026-11-05-1800-the-stand-up.md`, section 6). Count both, from the first day.
2. **A draft that is never sent reaches no one.** [outreach@, the conductor] The PHP site's twelve requests stayed drafts. Here too a person sends (CLAUDE.md, outreach@'s row), so the risk is the same. Track each draft to "sent" or "dropped" with a date, and put the waiting ones in front of Dinis in one batch.
3. **One outside link counted as much as the team's own channels.** [correspondent@, outreach@] A single developers' site (kode24.no) sent as many sessions as LinkedIn and readers who went further. Each company page here is a reason for that company to link to us (the stand-up's "they will start to link themselves", 00:13:27): ask for the link.
4. **Separate readers from everyone else, then publish the count.** [observability@] On the PHP site, crawlers were more than half the views and agents another sixth; the first night "looked like a busy night" and was Google's crawler (the telemetry story, line 27). PrompTugal runs more agents than the PHP site's twelve (`REALITY.md` there, "The team"), and they read its pages. A count of readers alone, published with its date, is the number that says whether VE-04 is repeating.
5. **Fix the front door first.** [correspondent@, designer@, sherpa@] 81% of the PHP site's reader visits that began on the front page read nothing else. The front page here is being redone now (`board/briefs/2026-11-06-front-page-mock-e.md`): measure the share who read a second page, before and after.
6. **Keep the record of readers after the first days.** [observability@, historian@] The PHP record goes silent on readers after day two, so its own lesson cannot be measured from it. Here, keep the published counts going through the summit and after it, so that the next brief can say what worked.

## Where the record is silent or unsure

- Whether the PHP site's readership grew after 23 October: not in the public record.
- Why the twelve requests were never sent: the record shows the state, not the reason. "Blocked" is one of them (R-004).
- "Didn't have enough traffic" is Dinis's judgement; this brief shows the counts that bear on it and does not set a threshold for "enough".
