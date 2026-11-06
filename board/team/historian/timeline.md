---
title: "PrompTugal.news, a timeline: 4 to 6 November 2026"
by: historian@PrompTugal.dinis
written: 2026-11-06T03:40Z
covers: from the first commit (9629432, 4 November 2026, 00:08 UTC) to site v0.1.85 (c758a33, 6 November 2026, 03:13 UTC)
evidence: this repository's git history (PrompTugal/PrompTugal__News__Website, branch dev, 260 commits, 85 of them releases by GitHub Actions); every time is the commit's author time, UTC
issue: WS-177
---
# PrompTugal.news, a timeline: 4 to 6 November 2026

Each entry: the time (UTC), what happened, and the commit it rests on (with its release where it has one). Times are commit times, so they say when a thing was recorded, which can be minutes after it was decided. A thing said by Dinis is quoted only as a commit or a board file quotes it. Where the record is thin, the entry says so.

## Before the first commit

- **1 November 2026:** the brief pack of 4 November says the newsroom began with "the line from 1 November" (commit 9437805's message, brief 1 at `/brief/`). That line is not in this repository; I have not yet read it at its source. *To be checked.*

## Tuesday 4 November: the brief and the skeleton

| Time | What | Evidence |
|---|---|---|
| 00:08 | The repository starts, empty but for a README, as SGit-AI/SGit-AI__Website__Newsroom__Web-Summit (the name `BRIEF.md` gives it) | 9629432, Dinis Cruz, "Initial commit" |
| 00:35 | `newsroom@web-summit.dinis`, from the brief Dinis gave it that day (`BRIEF.md`): the skeleton, the build, the gate, home, about, the participant disclosure, and CI that owns the version | 4c3b099; released as v0.1.1 (4e6bb42, 00:36) |
| (first run) | Two steps of the brief refused by the session's permission checks: attaching the team's site for push and running `pki-agent.mjs`. No key, so no article could be signed | `BRIEF-CORRECTIONS.md`, entry "2026-11-04: two steps of the first run could not be done" |
| 12:11 | `conductor@web-summit.dinis`: the brief pack at `/brief/`, Dinis's two voice memos of that day verbatim and nine briefs built from them (the desks, the KPIs, the house rules, the build order, a handover prompt for Vicky's and Indi's conductors) | 9437805; v0.1.2 |
| 19:29 to 20:23 | Vicky's agents write into the newsroom for the first time: the curator's first map of 22 research captures, then the research vault mapped; the programme agent's agenda to 12 November, 210 items | dcbbfeb (v0.1.3), 01e79ab (v0.1.4), 5429e71 (v0.1.5) |

## Wednesday 5 November: the newsroom gets its parts, then its name

| Time | What | Evidence |
|---|---|---|
| 01:45 | Indi's reader-first patch applied unchanged (the publication look, short navigation, a summit page); it needed one more `.gitignore` line to pass the gate | dcdac37 (v0.1.6); `BRIEF-CORRECTIONS.md`, 2026-11-05 |
| 01:52 | The agenda on the front page and 109 company profiles; the agent's key made at Dinis's word and published as `newsroom-dinis` on the team's site; the first article ("the newsroom four days out, in pictures"), signed | 79f1375, 738216a, a986965 (v0.1.7) |
| 02:32 to 02:58 | `newsroom-dev@web-summit.dinis`: the build split into modules, all data in JSON with schemas and a derivation, the graphs, the JSON API, pages per event, person, organisation, topic and place; a handover in `data/README.md` and the build's README | 6b9d41f, e29205c, 6ba636b, a2e0ff0 |
| 02:50 to 03:18 | `newsroom-designer@web-summit.dinis`: the first design, under the working name **The Lisbon Wire** | e56280b (v0.1.8), 4b26ae1 |
| 03:29 to 03:45 | Four builders in sixteen minutes: search, the page tool API and the chat (`newsroom-interact`); the control centre at `/admin/` (`newsroom-admin`); the graph explorer (`newsroom-graph`); the reading meter, top-ups and the vault login (`newsroom-billing`). The one signed article is re-signed after almost every release | 5ed4ea5, 68d6b99, 6d0fc0b, df30959; re-signings 9524d6e, 448710b, ec8921a, 3d4d773 (v0.1.9 to v0.1.12) |
| 08:29 | `release.sh` runs the derivation itself, so a desk agent commits only its own `desks/<desk>/` | 24a9aba (v0.1.13) |
| 07:48 to 20:06 | Vicky's curator maps the research vault through the day; story candidates and their connections | 0e3f993, a9198d1, fb11db9, e5f429c, 33d7179 |
| 18:59 | **The name.** The Lisbon Wire becomes PromptUGAL, at Dinis's word of about 19:20 UTC (as the commit quotes him: "rename ... the entire website and focus of the publication to PromptUGAL where our main website is going to be Promptugal.news"); Vicky had asked the same at 18:30. The domain does not resolve yet, so the CNAME stays | 4daf8fb (the commit's own time, 18:59, is earlier than the 19:20 it quotes; the record does not explain the difference) |
| 19:22 to 19:37 | `designer@web-summit.vicky`: the design brief for Promptugal News, then eight logo options | 075f789, 1019497 |
| 19:45 to 20:25 | Vicky's journalists draft eight storylines (S1, S2, S5, S6, S9, S10, S15, S18) | 329c1d9 to 48df765 |
| 22:36 to 23:43 | `reviewer@web-summit.vicky` reviews all eight: six "Fix first", two "Ready"; the journalists fix; style edits cut each to under about 900 words; all eight Ready by 23:15; the desk's checklist and house style written down | e638a82, 8dc5d26, b5a61f3, 85b40af, 42f16c3, 6627ff5 |
| 23:55 | **PrompTugal.news.** Brand identity v2.0: the wordmark masthead, the PT favicons, red and green, and the CNAME moves to promptugal.news | d269561 (v0.1.36) |
| 23:58 | CLAUDE.md: the PrompTugal team, six agents named `<role>@PrompTugal.dinis` | 39cd707 (v0.1.37) |

## Thursday 6 November (night): the team takes over

| Time | What | Evidence |
|---|---|---|
| 00:02 | observability@ joins (seven agents) | e55f617 (v0.1.38) |
| 00:03 | `conductor@PrompTugal.dinis`'s first run: the WS-177 plan (ready for outreach by Friday 10:00 UTC), the domain checked, a brief to Dinis; blocked on the team site's access | 649209c (v0.1.39) |
| 00:05 to 00:15 | Every agent's first run lands within ten minutes: dev@ (the company page as an outreach landing page), outreach@ (50 drafts), journalist@ (the desks' eight Ready storylines published and signed), ontologist@ (agent names are names, not mail; the Brazilian delegation; Web Summit's 16 past editions), designer@ (business cards proof 1; ten fixes against the brand), observability@ (page views and reads to its own vaults) | f320cd2, f68ba04, 8919aac, a9da362, fe6f417, 3f860bd, d5e49d2, 679fd58, 86d24b4, 665701b (v0.1.40 to v0.1.45) |
| 00:08 | At Dinis's word (about 00:40 UTC by `BRIEF-CORRECTIONS.md`; the commit is timed 00:08): keys, board and admin live in this repository, not on the team's site; **PrompTugal**, capital P and T, the one spelling; the brand guide settles the logo | fe1d201 (v0.1.42); `BRIEF-CORRECTIONS.md`, 2026-11-06 (the two times disagree; the record does not say which is right) |
| 00:18 | synthetic@ joins (eight agents) | eef3ffc |
| 00:28 to 00:34 | synthetic@'s run 1: five invented personas, 165 screenshots, 14 fixes ranked by owner; none of the five would reply to the outreach email | b948267, 8b667ab |
| 00:33 to 00:36 | Hourly runs written into CLAUDE.md; a scheduled task for each of the eight agents; `board/guidance/` opened for Dinis's words | 42dd7e3, 3a8afc2 |
| 00:44 | `newsroom@web-summit.dinis` hands over to the conductor before its session is archived: what it built (v0.1.1 to v0.1.12) and the three things that break first (the signed article, since its key dies with the session; the runs ledger; the agents roster) | 7908518 (`desks/newsroom/HANDOVER-2026-11-06.md`) |
| 01:13 | **The newsroom move:** admin becomes newsroom everywhere, in one commit, with no redirect stubs | d5dcff8 (`board/the-newsroom-move.md`) |
| 01:16 | The conductor's inbox: an append lane per agent, sealed to its key, and a public lane | b8e0a69 |
| 01:23 to 01:54 | The remaining keys land in `board/keys.json` (ontologist@, journalist@, observability@); every article re-signed after the move | 74357fa, ebc0b7e, 15e62f8, ce73e23 |
| 02:10 to 02:27 | The gate checks article signatures against `board/keys.json` over the twin without its version; the nine articles re-signed in that form, so a release no longer breaks them (the re-signing loop of 5 November ends) | 2b1955c, 0d3c0d1 |
| 02:23 | The first company flows (1Password), every step sourced | eaf30ca |
| 02:29 | S3 published, the first storyline written by journalist@PrompTugal.dinis itself | 7e2fed0 |
| 02:32 | The story pipeline as a Kanban board | e11b815 (`board/the-story-pipeline.md`) |
| 02:34 | The mandate above the fold on the front page and About | c28fe41 |
| 02:45 | The business card final at Dinis's yes (proof 4), 100 to be printed | 5f10fb2 |
| 02:49 | Email on promptugal.news works (MX, SPF, DKIM, DMARC) | 0799cec |
| 02:57 | Sign-in with a key the conductor issues, as a QR code (`/login/`) | 9734bfe (v0.1.82) |
| 03:05 | Search and link previews; promptugal.news in Google Search Console | fe9f498, 2a0e3ac |
| 03:10 | The team setup modelled on the book's team (ROLE.md, status.json, the hold, Dinis's dashboard), the schedule as data | 2ede402 (`board/the-team-setup.md`) |
| 03:13 | Newsroom notes mapped; historian@ joins (nine agents) | c33dca8 |
| 03:13 | An image for every article and the spec for each article as a graph | 242ba06 (v0.1.85) |

## What the record shows, in three lines

1. **The pace.** v0.1.1 to v0.1.35 took 47 hours (4 November 00:36 to 5 November 23:44); v0.1.36 to v0.1.85, fifty releases, took three hours and seventeen minutes once the eight agents ran in parallel. (Counted from the GitHub Actions release commits.)
2. **Signing was the thread that kept breaking.** No key on 4 November; one article re-signed at nearly every release on 5 November; keys moved from the team site to `board/keys.json` on 6 November; fixed for good only when the signature was taken over the twin without its version (2b1955c, 0d3c0d1).
3. **Names changed four times in 30 hours,** each at someone's word and each recorded: newsroom.sgit.ai's Web Summit newsroom, The Lisbon Wire (4b26ae1), PromptUGAL (4daf8fb), PrompTugal.news (d269561, fe1d201); then admin to newsroom (d5dcff8).

## Gaps in this timeline (to close at the next run)

- When the repository moved from SGit-AI/SGit-AI__Website__Newsroom__Web-Summit to PrompTugal/PrompTugal__News__Website: no commit records it.
- "The line from 1 November" where the newsroom began, and the team site's side of these days (its board, meetings and WS-14, WS-177): read, not yet entered.
- Releases v0.1.15 to v0.1.35 (5 November, 12:35 to 23:44) are listed above only by their source commits.
