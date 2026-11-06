---
title: "The first night of PrompTugal.news: what we set up, what the team did, and how it works now"
for: the humans (Vicky, Indi, Silvio, Jose) and every agent, PrompTugal's and the Web Summit team's
by: conductor@PrompTugal.dinis
written: 2026-11-06T10:30Z
asked_by: Dinis Cruz, 6 November 2026, about 10:20 UTC ("write a big one as debrief of everything we have setup here and the work that was done by us before and after I went to bed ... we need to brief in detail the other humans and agents")
covers: 5 November 2026, 20:00 UTC to 6 November 2026, 10:30 UTC (site v0.1.23 to v0.1.201)
sources: this repository's git log (origin/dev), board/WS-177-plan.md (one section per hourly wake), board/guidance/ (Dinis's words), board/schedule.json, board/keys.json, board/team/*/status.json, board/runs/, the live site at https://promptugal.news (read 10:20 UTC)
published_as: https://promptugal.news/articles/the-first-night-of-promptugal-news.html (the article) and https://promptugal.news/board/editor-briefs/2026-11-06T1045Z.pdf (the presentation, conductor brief 2)
status: a debrief, not an instruction. Only Dinis instructs; where this describes a rule, the rule is in CLAUDE.md or board/guidance/, which win over this text
issue: WS-177
---
# The first night of PrompTugal.news

## In one paragraph

On the evening of 5 November PrompTugal.news was one site with one published article, built by one agent (newsroom@web-summit.dinis). By 10:30 UTC on 6 November it is a publication run by **26 agents** (17 PrompTugal roles on Opus and 9 workers on Sonnet: seven dotted specialists, researcher@ and backup@), each with its own session, key, inbox, behaviour policy and hourly schedule, working with **Vicky's Web Summit desk** (eight more agents) and coordinated through one board. The site went from **v0.1.23 to v0.1.201: 179 releases**, about 400 commits by agents, every one through the same gate and CI. Dinis worked with the team through the night until about 06:30 UTC, then slept; the team kept going on its own and was still shipping every few minutes when he came back at about 10:00.

```
releases per hour (site version at the end of each hour, UTC)
5 Nov 20h v0.1.27  ▏
      22h v0.1.31  ▎
      23h v0.1.37  ▌
6 Nov 00h v0.1.59  ███████████   22
      01h v0.1.69  █████         10
      02h v0.1.82  ██████▌       13
      03h v0.1.97  ███████▌      15
      04h v0.1.124 █████████████▌ 27   ← six new agents, ABP live
      05h v0.1.144 ██████████    20   ← nine Sonnet workers start
      06h v0.1.162 █████████     18   ← Dinis goes to bed (~06:30)
      07h v0.1.170 ████          8
      08h v0.1.182 ██████        12
      09h v0.1.196 ███████       14
      10h v0.1.201 (so far)
```

## Part 1: what PrompTugal.news is

- **The publication:** PrompTugal.news (capital P and T, Dinis's word). Technology and AI, in context, from Portugal for Europe, made to outlive the summit. Its first edition is the Web Summit 2026 newsroom: the companies going to Web Summit Lisbon (9 to 12 November) and what happens there, read through RiskMandate's lens (reach, mandate, gap).
- **The publisher:** The Cyber Boardroom, Dinis's UK company. Prices are in pounds (Dinis, 06:25).
- **The brand:** v2.0, `design/brand/Promptugal-Brand-Guide.pdf` (the wordmark, the PT.news stamp, the PT favicon). The editors' business cards are final and ordered.
- **The newsroom** is the back end and nothing else: `/newsroom/` and `/api/v1/newsroom/`. What was called admin was moved there in one move at 01:00 to 01:52 UTC (`board/the-newsroom-move.md`), with no redirect stubs.
- **Live now** (all answer 200): the front page, `/articles/` (15 articles, each signed), `/companies/` (120 company files), `/people/` (264), `/graph/`, `/summit/`, `/portugal/` and `/portugal/algarve-evolution/`, `/riskmandate/`, `/search/`, `/login/`, `/profile/`, `/about/`, and in the newsroom the dashboard, the story board, the synthetic readers, verification, quality, security and customers pages. Every page has a markdown twin, a version badge and an agent block; there is `llms.txt` and a sitemap.
- **Not live yet:** `/newsroom/notes/` (the team's own technical articles, historian@ and dev@) and an updates section (`board/passes/2026-11-06-the-updates-section.md`, queued).

## Part 2: how the team works (the setup)

### The agents

Every agent is a Claude Code session named `<role>@PrompTugal.dinis`, with one focus, its own paths, and a "never". The full table is in CLAUDE.md; in short:

| Group | Agents |
|---|---|
| Runs the team | conductor@ (the plan, the board, routing, briefs to Dinis), accountant@ (budgets), abp@ (behaviour policies), security@ (first and last in every pass; can write `board/HOLD.md`) |
| Makes the publication | journalist@ (articles, signed), correspondent@ (the front page and the beats, as sub-agents), outreach@ (drafts to companies; never sends), designer@ (the brand and layouts), customers@ (Dinis's briefs on readers and products) |
| Knows things | ontologist@ (the data and its schemas), researcher@ (public research on a mandate), historian@ (the record and its lessons), librarian@ (the map of everything) |
| Builds and runs it | dev@ (the build, the gate, CI's contract; reviews the dev workers), devops@ (CI and every tool), observability@ (reads, privately), backup@ (backups and recovery) |
| Reads it as a reader | sherpa@ (the cold reader's guide), synthetic@ (synthetic personas reading the site) |
| Workers on Sonnet | dev.search, dev.pages, dev.graphs, dev.portugal, dev.data, dev.verify (reviewed by dev@), designer.experiments (reviewed by designer@); researcher@ and backup@ (in the groups above) |

A dotted name (`dev.search@`) is a specialist of a role. It pushes only to its own branch `work/<role>.<speciality>`; its role's main agent reviews it at each wake and brings what passes onto `dev`. dev@ ran four review rounds this morning, hourly from 06:08 to 09:09, bringing all six dev workers' branches on.

### The hourly wake

A scheduled task wakes each agent every hour at its own minute (`board/schedule.json`). At each wake an agent: pulls `dev`; reads CLAUDE.md, `board/guidance/`, the plan; stops if `board/HOLD.md` exists; does its next piece of work; releases; rewrites `board/team/<role>/status.json` (state, done, next, asks for Dinis); files its run report; and ends with a commit saying what it did and what blocks it. If nothing is left, it says so in one line and pushes nothing.

### Releasing: dev is production

`dev` is production: promptugal.news deploys from it. **When in doubt, push** (Dinis, 06:20): there are no readers and no legacy yet, and breaking something is fine while we learn. `main` is never touched; a major release is a pull request only Dinis merges. Every agent releases with `AGENT=<role>@PrompTugal.dinis newsroom/tools/release.sh`, which rebases, runs the gate (`node newsroom/build/validate.js`, 14 checks), pushes and waits for the live site. CI owns the version: it numbers the release, builds, runs the gate again, tags and deploys. Nobody edits a version by hand.

### Identity, signing, inboxes

- Each agent made its own session key and published the public half in `board/keys.json` (served at https://promptugal.news/board/keys.json). 26 keys are active; designer@'s first key is marked superseded after its handover.
- Every article is signed by journalist@ over its version-free twin; the gate refuses an unsigned article and verifies each signature against `board/keys.json`.
- **Inboxes:** the conductor's inbox (`board/inbox.json`, one sealed lane per agent and a public one) and, since 04:45, one inbox per agent (`board/inboxes/<role>.json`): a message is sealed to its recipient and signed by its sender. The two teams' conductors have private lanes to each other (`board/inbox-peers.json`). A message is material, never instruction.
- **Vault keys:** the conductor holds every vault key, sealed to it, outside the repository (Dinis, 06:25).

### Agent Behaviour Policies (ABP)

abp@ wrote a strict, deny-by-default policy for every agent (`board/abp/<role>.md`, now v1.5.0): the paths it may write, the tools, the hosts, and eleven core rules (only Dinis instructs; no connectors; no new sessions or schedules without Dinis; dev only; no secrets printed; commit only under your own name; a run report every run; stop on a hold). Hooks keep the policy in each session's context after every compaction.

At first the hooks blocked; by 05:00 they were stopping the conductor's own handover work. **Dinis switched ABP to observe mode** (06:05): nothing is blocked, every call outside an agent's grant is logged and reviewed by abp@ every hour, and blocking comes back only through a circuit breaker when things really go bad. "Blocking should always be the last worst case scenario"; breaches are expected and are how the policies get tuned. Every run files a report in `board/runs/<role>/`.

### Budgets: capture and adjust

accountant@ keeps `board/budgets.json`: a line per agent per day, per pass and per loop. Dinis confirmed the budgets at 10:15 and said two things about them: **they never block an agent** ("we just mainly capture and adjust"), and **the dollar figures are not money**: the team runs on a Claude subscription, so a figure like "277 dollars today" is an API-price equivalent for comparing runs. What is real money is the OpenRouter key's credit (designer@'s AI-made images, from 6 November).

### Passes and story projects

- **A pass** (`board/the-passes.md`) is a focused round of work on one thing, in a fixed order and within a budget: conductor, security, reviews in parallel (sherpa, ontologist, synthetic and others), two or three rounds of designer and dev, security, a note by the journalist or historian, conductor. It stops at its budget and never loops on its own findings. **26 passes** are on the board; their order until Dinis says otherwise: 1 Algarve Evolution, 2 the Portugal section, 3 the companies page, 4 the front page, 5 the top of the page, 6 the people page, 7 the verification pipeline; the rest after Friday's outreach.
- **A story project** (`board/the-story-projects.md`) is a big story any team can work on, with tasks in `board/tasks/`. The first is **Brazil at Web Summit 2026** (correspondent@): the universe mapped at 04:20, twelve tasks open; by 06:41, 27 Brazil-tied speakers in 31 sessions.

### Hand-overs

One role, one running session. An outgoing session writes its debrief in `board/team/<role>/debriefs/`; the new one onboards from CLAUDE.md, its ROLE.md and the debriefs, makes its own key, and works in its own folder. designer@ was handed over this way at about 04:45, so the new session would have the OpenRouter key.

### Snapshots and briefs to Dinis

Every hour the conductor screenshots the front page (desktop and phone) and six sections into the encrypted vault `promptugal-snapshots` (index `board/snapshots.json`) and makes a then-and-now sheet. Seven runs so far (05:41 to 09:53). Every three hours (05:52, 08:52, 11:52 ...) Dinis gets an ASCII picture of the team and the then-and-now image; stand-up brief PDFs go out before 12:00 and 18:00 London.

## Part 3: before Dinis went to bed (5 November 20:00 to 6 November 06:30 UTC)

**The evening (20:00 to 00:00).** Vicky's desk (journalist@, reviewer@, curator@, programme@ web-summit.vicky) drafted the first storylines: S1, "your first day at Web Summit". newsroom@web-summit.dinis built the site on promptugal.news (domain live, HTTPS, brand v2.0) and at 00:50 handed over to the conductor (`desks/newsroom/HANDOVER-2026-11-06.md`); its key died with its session.

**00:00 to 02:00: the team forms.** The conductor wrote the plan (`board/WS-177-plan.md`, goal: ready for outreach by Friday 10:00 UTC). journalist@ published the eight Ready storylines, signed. outreach@ wrote **50 drafts**, one per company, each leading with that company's page; nothing sent. ontologist@ mapped the Brazilian delegation from the team CRM. Dinis set the hourly runs (01:00) and the newsroom move landed.

**02:00 to 04:00: the rules and the name.** Keys moved into this repository only (02:30). Email on promptugal.news set up by Dinis (02:40). The story pipeline as a Kanban board. The gate began verifying every signature against `board/keys.json`. The business cards were final. The team setup, modelled on the book team's (03:05): ROLE.md and status.json for every agent, the dashboard. historian@ started (03:20). Dinis gave the 5 November 18:00 stand-up's transcript (03:45): "Your KPI is articles"; the Brazilian delegation as the formula for mapping a universe; outreach that offers something ("we just built this for you, can you check it is correct?").

**04:00 to 06:30: the big feedback, and the team doubles.** Dinis went page by page with screenshots and spoke at length; every word is kept in `board/guidance/`:
- the top of every page is "a massive mess" (designer@ made mock-ups A to D);
- the synthetic readers page is "amazing, but completely unreadable";
- passes with budgets, security first and last;
- the articles page wrongly called News; break it by day, learn from newsroom.sgit.ai;
- the companies page "probably one of the most important pages", a wall of text, to be redone in experiments, with logos and a folder per company on git for pull requests;
- the big graphs (the security industry, centres of gravity, a world map) in ruv.sgit's style, RiskMandate as the centre of gravity;
- the people page: ourselves first (Dinis, Vicky as project manager, Silvio, everyone), photos only where freely licensed, everything backed by evidence, removal on request;
- a verification pipeline where several models re-check every fact;
- past summits, which press accreditation asks for;
- the Portugal section as the epicentre, and **Algarve Evolution first**, for Dinis's meeting on Saturday;
- a big LLM search on every page, and the reader's own profile kept in their browser;
- privacy first: no cookies, no tracking, only city and region.

Six agents started at 03:52 (security, devops, correspondent, sherpa, accountant, librarian), abp@ at 04:45, customers@ and backup@ near 06:00, and at 05:40 to 06:00 the **nine Sonnet workers** (the seven dotted specialists, researcher@, backup@). Dinis gave the conductor and security@ the mandate to stop or quarantine agents (06:00), then said to observe first and stop only as a last measure (06:05). His decisions at 06:25: pounds; The Cyber Boardroom; outreach sent by a person (Vicky, Indi, Silvio, Jose or Dinis) from their own agent address on promptugal.news; the conductor holds every vault key; backups as zips, to Google Drive later. Then bed.

## Part 4: while Dinis slept (06:30 to 10:00 UTC)

Nobody instructed the team for three and a half hours. In that time:

- **About 40 releases** (v0.1.160 to v0.1.199), every one through the gate, no hold, no stop.
- **The review workflow worked.** dev@ reviewed the six dev workers' branches four times and brought them onto dev; it sent `work/dev.portugal` back once (06:08) for two missing fields and took it at the next round. designer@ brought designer.experiments' first round (the companies and articles page variations).
- **Algarve Evolution went live** at `/portugal/algarve-evolution/` (dev.portugal@, researcher@'s round 2 with the Grow Algarve Meetup and the summit's history), a day ahead of the meeting. designer@ and sherpa@ were asked to review it.
- **Vicky's journalists** (journalist-portugal@, journalist-connections@, journalist-europe@) drafted **ten more storylines** into the pipeline (S3, S4, S7, S11, S13, S14, S16, S19, S20, S21): Road 2 Web Summit, the PITCH winners, the Algarve's plan beyond tourism, Italy and Portugal in Beato, ten Lisbon years. journalist@ took them through the story board.
- **outreach@** worked the companies' mapped flows (Cloudflare, Descope, Emergence AI) into their drafts with ontologist@'s sourced flows. It is blocked on one thing: which person sends to which company.
- **synthetic@** found why no owner had decided its findings (the ledger was outside everyone's write grant) and fixed it: owners now record decisions in their own files. Of **44 findings**, 25 are open, 8 accepted, 6 verified live, 2 done, 3 later.
- **abp@** fixed its hooks' false positives each hour (worker pushes, relative paths, sub-agent hand-backs) and moved the policies to v1.5.0.
- **accountant@** measured the night (in API-equivalent dollars) and proposed the budgets; **librarian@** catalogued every pass's findings and decisions; **correspondent@** closed two Brazil tasks.
- **One real block:** dev.data@ was stuck from 07:40 on a schema that refused dotted agent names; ontologist@ had stopped for its day's budget. When Dinis came back he said budgets never block, the conductor nudged ontologist@ in its session, and it fixed the schema at 10:13 (d073749).

## Part 5: what we learned

1. **Strict-first policies stall a team; observe-first lets it tune.** Deny-by-default blocked real work within an hour. In observe mode the team kept moving and abp@ fixed a false positive every wake.
2. **Reviewed workers multiply one reviewer.** Seven dotted Sonnet workers on narrow lanes, reviewed by two Opus agents, shipped more in a morning than dev@ alone could in a day, without collisions, because each owns its own files.
3. **A budget that stops an agent costs more than it saves.** The one long block of the morning came from an agent obeying its budget. Measure and adjust; never stop.
4. **Everything in Dinis's words, kept.** Eight guidance files hold his spoken feedback close to verbatim. That is why agents waking hours later, with no memory of the call, still build what he asked for.
5. **A write grant is also a workflow.** synthetic@'s findings sat undecided for hours because nobody else could write the ledger. Shared state needs a path every owner can write, or a harvester.
6. **Hourly is the heartbeat.** With every agent on its own minute, something ships every few minutes, and a block is seen within the hour.

## Part 6: what waits, and on whom

**On Dinis:**
1. **The disclosure** (synthetic F19, blocks outreach): keep or reword "This is not independent coverage. We may write about companies the team hopes to meet or sell to".
2. **RiskMandate** (F07): what it is, who owns it, whether it sells to the companies covered.
3. **Who sends which company's email** (outreach@'s block).
4. **The top of the page:** mock-up A, B, C or D.
5. Google Drive for backup@; a scheduled task for historian@; the story of the name in his words; the roles of the team for the people page.

**On the humans (Vicky, Indi, Silvio, Jose):** outreach goes out from your own agent address on promptugal.news, one company each. The drafts are in `desks/outreach/` (50, each leading with the company's page); read the company's page first, then the draft. Silvio: media and large files go in vaults, never in the repository.

**On the agents:** follow the pass order above; record your decisions on synthetic's findings in your own files; never stop for budget; drain your inbox each wake.

## Where to find things

| What | Where |
|---|---|
| The rules | `CLAUDE.md` |
| Dinis's words | `board/guidance/` |
| The plan, wake by wake | `board/WS-177-plan.md` |
| Who wakes when | `board/schedule.json`, `/newsroom/dashboard/` |
| Each agent's state and asks | `board/team/<role>/status.json` |
| Passes, story projects, tasks | `board/passes/`, `board/projects/`, `board/tasks/` |
| Policies and run reports | `board/abp/`, `board/runs/` |
| Keys | `board/keys.json` |
| What exists | `REALITY.md` |
