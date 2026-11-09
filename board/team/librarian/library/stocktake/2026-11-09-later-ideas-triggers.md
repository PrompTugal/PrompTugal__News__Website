---
title: "The ledger's Later list against its triggers, 9 November 2026"
by: "librarian@PrompTugal.dinis (curator sub-agent, Sonnet)"
written: 2026-11-09
source: board/guidance/2026-11-06-the-ideas-ledger.md
---

# The Later list against its triggers

48 checked: 10 due now, 19 not yet, 19 unclear; 18 already started (plus 5 partly).

Read on Monday 9 November 2026, about 10:00 UTC, the eve of Web Summit Lisbon (10 to 12 November). "Started" means a file in the repository carries the idea (not the ledger, the catalogue, the librarian's folder, run reports or the memos). Ids are the ledger's; "g/" and "p/" in the ledger's "Captured in" column are not repeated here.

## Due now

| id | idea, short | trigger as written | why due now | started? | owner in the ledger |
|---|---|---|---|---|---|
| PB-07 | Apply for a Web Summit press pass | "by, by, by tomorrow or even by Monday" | Today is Monday and the summit opens tomorrow. | Yes: `content/newsroom/decisions/registering-and-the-press-pass.md` ("Two questions from the becoming-a-publication pass"), a For Dinis page; his answer not seen | Dinis, journalist@ |
| PB-06 | Register as an official publication (UK, Portugal) | "before the press pass" | Rides with PB-07, which is due. | Yes: same page, option A "Ask a lawyer first" (recommended) | journalist@, Dinis |
| FP-24 | Publish through the summit to the last minute, by automation | "the summit days" | The summit runs 10 to 12 November. | Yes: `data/newsroom/agents.json` ("through the summit to the last minute") | correspondent@, journalist@ |
| TA-02 | Hourly wakes are for now; slower cadences later | "for now" | The cadence has already changed for the summit. | Yes: `board/team/correspondent/status.json` ("every two hours at :41 UTC from 9 November") | conductor@, Dinis |
| NR-22 | Hourly update articles (the updates section) | "the pass is queued" | The summit days are when hourly updates matter; the pass is still waiting. | No: only `board/passes/2026-11-06-the-updates-section.md`, "state: queued" | journalist@ |
| SD-15 | A back-office team or social media manager for the summit days | "we probably need a day, day or two" | Summit starts tomorrow; the day or two before is now. | No: only the stand-up, `board/guidance/2026-11-05-1800-the-stand-up.md` | Dinis, the humans |
| TA-24 | Sonnet and Haiku take tasks | "when we start" (dotted workers on Sonnet since 6 Nov 05:20) | The trigger arrived on 6 November. | Yes: `board/team/conductor/capacity-2026-11-06.md` ("backup@ ... Sonnet") | conductor@, accountant@ |
| TA-25 | Agents on Dinis's other accounts | "at his word" | He gave it: the account move of 6 November. | Yes: `board/the-account-move.md` ("Moving agents to a second account") | Dinis |
| TA-26 | Extra journalists, researchers, curators, analysts, correspondents on those accounts | "with TA-25" | Rides with TA-25. | No for the extra ex-roles as such; the second account itself exists (see TA-25) | Dinis, conductor@ |
| DV-13 | Until Drive works, backup@ keeps its zip and a human copies it over | "until DV-12" | Drive is not yet carrying backups, so the stopgap is live now. | Yes: `board/team/backup/status.json` ("container only (6 zips)") | backup@, the humans |

## The rest

| id | idea | trigger as written | verdict | started? |
|---|---|---|---|---|
| FP-07 | Vault button in the top bar | "next" | UNCLEAR (no date; the top-of-page decisions removed the button for now) | No |
| FP-04 | A better RiskMandate treatment than "Powered by" in the masthead | when found | UNCLEAR | Partly: masthead line removed, footer keeps it (`newsroom/build/lib/shell.mjs`) |
| CO-11 | RiskMandate's presence beyond its company page | "a bit later" | UNCLEAR | No |
| CO-12 | "Powered / sponsored / managed by" RiskMandate at every page foot | with CO-11 | UNCLEAR | Yes: footer "Powered by RiskMandate" in `newsroom/build/lib/shell.mjs` |
| PB-14 | promptugal.com and .ai wired up | "later" | NOT YET (`board/WS-177-plan.md`: they "stay as they are for now") | No |
| PB-15 | Three domains point to the news; set up separately later | "I could always set it up later" | NOT YET | No (`CNAME` is promptugal.news only) |
| PB-16 | promptugal.ai as the management site | later | NOT YET | No |
| PB-37 | Story of the name public, at his word | "for now" | NOT YET | Yes (in the newsroom): `newsroom/notes/2026-11-06-made-to-outlive-the-summit/index.md` |
| PB-08 | Attend press conferences as press | after the press pass | UNCLEAR (needs the pass, which has no answer yet) | No |
| PB-17 | Long-term site for everything in Portugal around AI | the long arc | NOT YET | No |
| PB-40 | Later editions after the summit edition | after the summit | NOT YET (summit not over) | No |
| SD-11 | Front page personalised to what the reader has read | once reads are captured | UNCLEAR (capture design exists, not live) | No |
| SR-17 | Each team member shapes their own version | after signed-in views | NOT YET (`board/passes/2026-11-06-signed-in-views.md` is open) | No |
| SR-18 | Super-personalisation for every reader | the long arc | NOT YET | No |
| SR-09 | Reader profile kept in a vault later | "for now" | NOT YET | Partly: the signed-in views pass plans a per-person vault |
| SR-07 | Whether the reader's profile is saved | open | UNCLEAR | No |
| AR-15 | Append lanes for readers and companies | "eventually" | NOT YET | Yes (spec): `board/spec-claimed-profiles.md` ("posts to an append lane") |
| BR-09 | Same formula on Tecnico, the UK delegation, more | after the Brazil project | NOT YET (Brazil project still running) | Yes: `newsroom/stories/S15/index.md` (Tecnico's stand) |
| PT-10 | A section per country | after /brazil/ | NOT YET | Partly: `content/portugal/` exists; no other country |
| DV-10 | Backups on Google Drive for now | "for now" | NOT YET | Yes: `board/team/backup/status.json` (Drive folder PrompTugal-backups created) |
| DV-11 | Backups as deltas | "later" | UNCLEAR | Yes (design): `board/team/backup/ROLE.md` ("deltas later"), pack-mode `tools/backup-vault.sh` |
| DV-12 | Dinis connects Google Drive | when he does | UNCLEAR (a "Go" and a folder on 6 Nov; later status says no grant on account B) | Yes: `board/team/backup/status.json` |
| DV-05 | Silvio's media and videos into vaults | when Silvio sends them | UNCLEAR | No |
| PE-06 | LinkedIn connections matched to mapped people | "there's going to be a moment" | UNCLEAR | No |
| PE-25 | Separate people vault if data grows | when it grows | NOT YET | No |
| PE-10 | Share sgit packs publicly | when sgit supports it | NOT YET | No |
| HS-07 | Past summits, deeper | after the summit | NOT YET | Partly: `board/passes/2026-11-06-past-summits.md` (open) |
| SX-04 | Sections owned by a person and agents (Silvio first) | after the framework | NOT YET (`board/passes/2026-11-06-sections-as-sub-sites.md` queued) | Yes: `board/team/customers/for-silvio-and-his-agents.md` |
| GR-24 | Dinis's own graph ideas | when he gives them | UNCLEAR | No |
| GR-10 | A ruv.sgit agent beside the graphs agent | open | UNCLEAR | No |
| PS-28 | Dinis's quality-gate notes | when he gives them | UNCLEAR | No |
| PS-05 | Whether budgets ever block | "for now" | NOT YET | No |
| AB-20 | ABP enforcement, case by case | after observing | UNCLEAR (observing since v1.1.0, no end date) | Yes: `board/abp/README.md` ("By hooks, in observe mode") |
| SD-17 | Recruit whoever praises the site | when comments come | UNCLEAR (readers arrive at the summit) | No |
| TA-49 | Writer and translator agents | when needed | UNCLEAR | Yes: `board/inboxes/writer-jose.json`, `writer-angelo.json` |
| TA-15 | Up to three journalists | when needed | UNCLEAR | Yes: `board/inboxes/journalist-vicky.json` and four more journalist lanes |
| AB-08 | Recovery vault held by Dinis | when the first vault that cannot be lost exists | NOT YET (backups are container-only; `board/team/backup/status.json`) | Partly: `board/team/security/keys-and-vaults.md` (the plan) |
| PB-31 | Social accounts in the name, posting automatically | the team's (Jose's) work | UNCLEAR | No |

## Method

Read the Later table of the ledger (rows 40 to 90) and took each trigger at its written words against today's date and the summit dates. For "once X exists" triggers I looked for X in the repository (signed-in views pass, Brazil project, sections pass, Drive and backup status, vault plans) and cited the path. "Started" came from grepping two or three distinctive keywords over `board/`, `content/`, `newsroom/` and `CLAUDE.md`, excluding the catalogue, the librarian's folder, run reports, the ledger and the memos, and reading the best hit; generated `.html` pages were not counted. Where a trigger has no date or depends on Dinis's word, it is UNCLEAR. Limits: I did not check whether Dinis has since answered the press-pass page, and a few "started" cells rest on one file.
