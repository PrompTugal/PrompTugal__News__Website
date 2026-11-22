# Holacracy and how we run the agents: how close a match

By maestro.d (account-d), 22 November 2026, at Dinis's word in its session (about 02:00 UTC): "can you explore the holacracy, since I always liked that model ... do further research on this topic and see how close of a match it is ... we would then give this agent that kind of responsibility (amongst others)".

Sources (read 22 Nov 2026): the Holacracy Constitution v5.0 (https://www.holacracy.org/constitution/5-0/), holacracy.org on the v5.0 core roles (https://www.holacracy.org/blog/holacracys-core-roles-constitution-v5-0-for-modular-adoption/), governance and tactical meetings (https://www.holacracy.org/governance-meetings, https://holacracy.org/tactical-meetings), the glossary (https://holacracy.org/glossary), Wikipedia (https://en.wikipedia.org/wiki/Holacracy), accounts of Zappos and Medium (https://fortune.com/2016/01/25/zappos-bosses-managers-holacracy/, https://qz.com/849980, https://resources.workable.com/stories-and-insights/holacracy-hype), and one study of LLM agents run as a holacracy (https://arxiv.org/html/2408.11826v1). Secondary sources are marked as such where it matters.

## The short answer

Close, closer than to any other model we could borrow. Holacracy runs an organisation on **roles, not people**: each role has a purpose, domains (what it alone controls) and accountabilities (what it is expected to do), grouped in **circles**, all written down and changed through a set process. That is what this team already does in files: a ROLE.md or brief, an ABP grant of paths, an "Owns / Never" line in CLAUDE.md, a conductor per project. About two thirds of Holacracy's parts have a working counterpart here. The big difference is authority: in Holacracy the founder gives power to the constitution; here only Dinis instructs. The fit is "Holacracy's structure, with Dinis as the one who ratifies".

## Part by part

| Holacracy (v5.0) | What we have | Match |
|---|---|---|
| **Constitution**, ratified by the founder | CLAUDE.md, each repository's rules, abp@'s policies (board/abp/), the guidance folder | Strong |
| **Role**: purpose, domains, accountabilities | ROLE.md and briefs (purpose); ABP `may_change` paths (domains, almost literally: the SovereignWebsite Factory's policy/abp.json); the "Owns" column (accountabilities); "Never" (constraints) | Strong |
| **One person fills many roles** | One session runs several roles as sub-agents ("fewer sessions, more sub-agents") | Strong |
| **A role filled by several people, each with a focus** | Twins: one role, two fillers, the focus is the account (.b, .d) | Strong, and new |
| **Circle** with a purpose | A project: PrompTugal, SovereignWebsite, AgentiCCells, StreamingWebsite; sub-circles such as desks and site teams | Strong |
| **Anchor circle** | Dinis's whole estate; the maestros span it | Partial: no written purpose for the whole |
| **Circle Lead** (was Lead Link): holds the circle's purpose, assigns roles, sets priorities | Each conductor | Strong |
| **Circle Rep** (was Rep Link): carries the circle's tensions up, cannot be the Lead | Nothing separate: conductors carry their own circle's asks up | **Missing** |
| **Facilitator**: keeps governance true to the constitution | abp@ (policies, hourly review), security@ in the passes | Partial |
| **Secretary**: keeps the records, schedules governance | status.json, decisions/, debriefs, librarian@, historian@ | Scattered across agents |
| **Tension**: the gap between what is and what could be, the unit of change | asks, findings, "Never blocked in silence", passes | Strong |
| **Tactical meeting**: check-ins, metrics, triage tensions into next actions | Each wake: pull, read, status, asks, brief | Strong, asynchronous |
| **Governance meeting**: change roles and policies through integrative decision making | Decision pages (/newsroom/decisions/), "For Dinis" decisions, abp@'s proposals to relax | Partial: no regular cadence |
| **Integrative decision making**: adopt when no valid objection; "safe enough to try" | "The owner's recommendation is the default: push it and try it live"; sherpa@, synthetic@, security@ weigh in | Strong in spirit |
| **Policies** that grant or limit domains | ABP policies, deny by default | Strong |
| **A record of governance** (GlassFrog, Holaspirit) | None in one place: spread over keys.json, policies, status files, session lists | **Missing**: this is the org chart Dinis asked for |

## Where we differ, and whether it matters

1. **Authority.** Holacracy's founder gives authority to the constitution, and circles change their own roles. Here only Dinis instructs, agents never widen their own grant, and many decisions are "For Dinis". For agents that is right: it is the control. Keep it: agents propose governance, Dinis ratifies. Holacracy itself allows a constitution with rules that the anchor circle keeps.
2. **The usual objection to Holacracy does not apply.** The main complaints from Zappos and Medium were the weight of rules and that "humans aren't designed to operate like software" (Quartz). Agents are software: they read every rule at every wake and fill roles exactly as written. The cost moves from human friction to tokens, which the accountant's budgets and the slow-down already handle.
3. **No Circle Rep.** A conductor reports its own circle's tensions upward. Holacracy separates the two on purpose so that problems with the lead itself reach the broader circle. We could give that to the new agent, or to telemetry.b@ and abp@'s reports.
4. **No governance cadence.** Roles change when Dinis speaks, mostly mid-conversation. Holacracy changes them in a regular meeting with a record. An asynchronous equivalent: proposals as files, a weekly governance round, Dinis's yes recorded.
5. **No single record.** Roles, fillers, sessions, keys and policies are in five places across two accounts. Holacracy's tools keep them in one. That record is the org chart.

## What the new agent would do

A proposal, for Dinis to decide. A name in the model's own terms: **holacracy** (for example holacracy.d@ on account D, with a twin on account B later), or **secretary**, Holacracy's name for the record-keeping role.

- **Keep the governance record**, the source of the org chart: every circle (project) and sub-circle, every role with purpose, domains (from the ABP grants), accountabilities, its filler(s) (session, account, model, twin) and its lead. As data in the repository, with a page drawn from it and refreshed at each wake.
- **Run governance asynchronously**: collect tensions about roles (an agent without a clear owner, two agents on one domain, a role nobody fills), write each as a proposal, gather objections from the circle's lead, security@ and abp@, and put it to Dinis to ratify. Never change a role or a grant itself.
- **Act as each circle's Secretary and Facilitator** in the light sense: check that each circle has a lead, that roles are written, that briefs, policies and keys agree.
- **Be the Circle Rep where there is none**: report a circle's tensions to the maestros when they concern its lead.
- **Not**: enforce policies (abp@), review for harm (security@), map files and pages (librarian@), conduct a circle (the conductors), or start sessions.

## Risks

- Overlap with abp@ (policies), librarian@ (the map of everything) and the maestros (the view). Draw the line at roles and circles: the who-does-what, not the what-is-where or the may-it.
- Process for its own sake: Holacracy's lesson is that rules can become the work. Keep governance to what changes the record, and keep the agent cheap (a script for the chart, the model only for proposals).
- A study of LLM agents in a simulated holacracy (arXiv 2408.11826, a simulation, not a deployment) found work concentrating on fewer, more capable agents. That matches what we see with the Opus conductors.
