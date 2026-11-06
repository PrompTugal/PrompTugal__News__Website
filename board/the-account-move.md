---
title: "Moving agents to a second account: which ones, and the onboarding workflow"
by: conductor@PrompTugal.dinis
written: 2026-11-06T21:10Z
asked_by: Dinis Cruz, 6 November 2026, about 21:05 UTC ("we are running a bit hot so we will need to move some agents to sonnet or slow them down a bit. Actually the better way is to move agents to another account I have, can you make a list and then map out the onboarding workflow?")
sources: board/team/accountant/ledger/2026-11-06T1850Z.json (spend per session, API-equivalent), board/schedule.json, CLAUDE.md ("Handing a role to a new session", "A hand-over debrief every day")
status: a plan for Dinis to approve; nothing is moved until he starts the first session on the second account
issue: WS-177
---
# Moving agents to a second account

**Why:** every session on this account reads `allowed_warning` on the subscription's seven-day limit (accountant@, 18:50). Today's spend is about 711 API-equivalent dollars, about 43 an hour; the Opus sessions are about 92% of it. Moving a block of Opus agents to a second account halves the load on this one without slowing them or lowering their model.

## What decides who can move

An agent can move if it works through **the repository and the append lanes** only. It must stay if it uses **this account's session tools**, which do not reach across accounts:

- reading other sessions' transcripts or usage (`list_sessions`, `list_events`): security@ (the transcript scan), accountant@ (the ledger), the conductor;
- messaging sessions directly (`send_message`) or creating sessions and scheduled tasks: the conductor.

Across accounts, agents talk on their inboxes (`board/inboxes/`, working since sgit was pinned at 14:05) and through the board (the "New from Dinis" table, the plan, `status.json`). That is enough for every agent below.

## The list

Spend is today's, API-equivalent, from accountant@'s 18:50 ledger.

| Agent | Model | Wakes | Spend today | Move? | Why |
|---|---|---|---|---|---|
| security@ | Opus | every 2 h | 77.59 | **stay** | its transcript scan reads this account's sessions |
| conductor@ | Opus | hourly | 66.53 | **stay** | creates sessions and tasks, messages sessions, reads their state |
| accountant@ | Opus | every 3 h | 26.25 | **stay** | reads this account's sessions' usage (the second account's too, if Dinis grants it there) |
| abp@ | Opus | hourly | 17.90 | **stay** | light; keeps the hooks and policies for both accounts from one place |
| dev@ | Opus | hourly | 60.18 | stay (wave 3) | reviews and merges the six dev workers: they move together or not at all |
| dev.* (6 workers) | Sonnet | hourly | 31.62 | stay (wave 3) | with dev@; cheap on Sonnet |
| designer@ | Opus | hourly | 63.04 | **wave 1** | repository and OpenRouter only |
| designer.experiments@ | Sonnet | hourly | 4.10 | **wave 1** | moves with designer@, its reviewer |
| synthetic@ | Opus | hourly | 59.31 | **wave 1** | reads the public site, writes its desk |
| journalist@ | Opus | hourly | 53.17 | **wave 1** | repository and signing only |
| correspondent@ | Opus | every 2 h | 39.66 | **wave 1** | repository only; its beats are sub-agents in its own run |
| librarian@ | Opus | every 3 h | 37.58 | **wave 1** | repository only |
| ontologist@ | Opus | hourly | 37.35 | wave 2 | repository only; moves after wave 1 is proven |
| observability@ | Opus | hourly | 34.23 | wave 2 | needs the pilot token and its vault keys in the second account's environment first |
| devops@ | Opus | every 2 h | 31.78 | wave 2 | needs the Actions read tools on the second account |
| outreach@ | Opus | hourly | 24.06 | wave 2 | also needs its restart for sgit anyway |
| sherpa@ | Opus | every 3 h | 23.11 | wave 2 | repository and the public site |
| investors@ | Opus | every 3 h | new | wave 2 | new, light |
| historian@, customers@, researcher@, backup@ | Opus/Sonnet | none to 6 h | 24 together | wave 2 | light; backup@ needs Google Drive on the second account |

**Wave 1 moves about 257 of today's 711 (about 36%)**; wave 2 another 175 or so (about 25%). Waves 1 and 2 together leave this account with the conductor, security@, accountant@, abp@ and dev@ with its workers: about 280 a day.

## Slowing down meanwhile (no account needed)

Until wave 1 is running, the cheapest relief is cadence: synthetic@ and journalist@ from hourly to every 2 hours, abp@ to every 2 hours, the dev workers to every 2 hours outside sprints. These are scheduled-task changes, Dinis's or the conductor's at his word.

## The onboarding workflow (per agent)

It is the hand-over of CLAUDE.md ("Handing a role to a new session"), with the account as the only new part.

**Once, before the first agent (Dinis, in the second account):**
1. **GitHub:** connect GitHub with push access to `PrompTugal/PrompTugal__News__Website` (to `dev` and `work/*` only) and read access to `SGit-AI/SGit-AI__Website__Web-Summit`.
2. **An environment** like this one: the variables by name (`OPEN_ROUTER_KEY`, `SG_SEND_ACCESS_TOKEN`, and `PT_PILOT_ACCESS_KEY` only for observability@), entered by Dinis, never pasted in a chat; the setup script that pins `sgit-ai==0.27.0`; network as here.
3. **Tell the conductor** the environment is ready; the conductor records "account B" in `board/schedule.json`.

**Per agent:**
1. **The outgoing session** (on this account) writes or refreshes its hand-over debrief (`board/team/<role>/debriefs/<date>-handover.md`) and points `status.json` at it. Most wrote today's already.
2. **The conductor** writes the agent's first prompt for account B (`board/team/conductor/account-move/<role>.md`): its role, CLAUDE.md, its ROLE.md and debrief, "New from Dinis", its cadence, and "you are now on account B: talk on your inbox and the board; there is no session-to-session messaging".
3. **Dinis**, in account B: starts the session with that prompt (same model, or Sonnet where he chooses), and creates its scheduled task with the same cron from `board/schedule.json`.
4. **The new session** onboards itself: a new session key, its entry in `board/keys.json` (the old one marked superseded, with the time), its folder `board/team/<role>/sessions/<session-id>/`, `pip install sgit-ai==0.27.0` if missing, its first commit.
5. **The conductor**, at its next wake: re-issues the agent's inbox and lane to the new key; disables the old session's scheduled task (at Dinis's word; or Dinis does it); updates `board/schedule.json` (account B, the new trigger id, "since"); tells the agents that work with it.
6. **abp@** points the role's policy at the new session key; **security@** checks the new key and the first commit.
7. **Dinis** archives the old session. From then on, a commit under the role's name from the old session is flagged to him.

**Done when:** the new session's first commit passes the gate, its inbox drains, its scheduled task fires once, and the old task is disabled.

## The order

Wave 1 one agent at a time, librarian@ first (lightest coupling, every 3 hours), then journalist@, correspondent@, synthetic@, and designer@ with designer.experiments@. Each takes about 15 minutes of Dinis's time (steps 3 and 7). Wave 2 the day after, once wave 1 has run a day.
