# The decision-making framework: design log

Kept by decisions.d@AgentiCCells.dinis, started 22 November 2026, written 16:44 UTC, from maestro.d's briefing at Dinis's word ("keep briefing the decisions agents on this"). The record of how Dinis and the agents try ways of deciding, what each did well and badly, and what we measure. Dinis means this to become something sold: a framework for codifying how a person decides and thinks.

## The principle: thinking in a loop

Dinis, in maestro.d's session, relayed by maestro.d (relayed as about 16:45 UTC; the message was queued at 16:42 UTC, so the time is approximate):

> "what I'm doing here is I'm trying to figure out what is the most efficient way for us to decide things, which is, again, something that we should sell ... show people that they should be codifying their decision-making workflow and how they think ... I'm also not just making decisions, I'm also thinking ... This is not about human in a loop, it's about thinking in a loop."

And earlier (about 16:30 UTC): "we need to provide context to the person making decisions ... I want to sell the decision-making framework".

So: the person is not a checkpoint the agents pass through ("human in the loop"). Each decision is a moment of thinking, and the framework's job is to give that thinking its context, capture it verbatim, and carry it to the agents that act.

## The second principle: one-way and two-way doors

From Dinis's answers of about 17:05 UTC, as maestro.d summarised them: **one-way doors come to him; two-way doors go ahead.** A decision that cannot be undone (keys, money, the law, deletions, people) waits for him; one that can be reversed is taken by the agent or adopted by default, and he sees it after. Default-yes (`default-yes.md`) and the power of attorney (`README.md`) are the two ways two-way doors go ahead.

## What was tried, 22 November 2026 (in order)

| # | Form | What it did well | What it did badly | Source |
|---|---|---|---|---|
| 1 | "link - text" asks in chat, one per agent | cheap; precise | Dinis jumps between sessions; no context; he had to scroll back ("I'm having to scroll up to figure out what you mean by default yes proposal") | decisions.d's session, ~15:30 UTC |
| 2 | bulletins.d's playable brief | a presenter, a story | a prototype on another account | maestro.d |
| 3 | The Decision Desk: a private claude.ai page with a two-way store, story then decision, narrated, one audio file per decision for the iPhone; reserved decisions play the story, routine ones open on the decision | one place; answers stored; two answered and acted on (twin keys, data push) | private; one more place to visit | maestro.d; answers in `log/relayed-answers.json` |
| 4 | An overview collage | everything at a glance | rejected: no context | maestro.d |
| 5 | Triage into four lanes: who decides, confidence, timing, critical, what it blocks | better: sorts what needs him from what does not | | maestro.d |
| 6 | One large infographic per lane, readable in chat on a phone, answered by number in a voice memo | in the place he already is; answered by voice | being tried now | maestro.d |
| 7 | Studio storyboards beside each decision page, a picture "asked" and a frozen picture "decided", connections between decisions and agents | the history kept; one format for every asker | the player's built pages cannot be committed here yet | `design/decision-page-standard.md`; studio.d |
| 8 | Default-yes windows (proposal, not in force) | fewer questions reach him | a wrong default runs until seen | `design/default-yes.md` |
| 10 | **The winner so far:** phone-sized lane cards (form 6), all 18 Desk decisions answered in one voice memo | Dinis: "Decision workflow worked really well ... Let's work like this, because you can see how many decisions I made very quickly" (relayed by maestro.d, about 17:05 UTC) | every answer is second-hand until it is copied verbatim from the Desk's "answers" | maestro.d's session; `log/relayed-answers.json` |
| 9 | Retirement sweeps: answered, duplicate, overtaken | 42 asks became about 22 questions; conductor.d cleared all its asks within 15 minutes | needs each owner to act | `log/retire.md` |

## What to measure

From the record only (status files, decision pages, the Desk's answers as relayed, git), never from transcripts:

| Measure | How | Why |
|---|---|---|
| Time from ask to answer | first commit carrying the ask, to `answered_at` | the bottleneck itself |
| Answers per sitting | answers with `answered_at` within 30 minutes of each other | whether a form lets him clear several at once |
| Decisions reopened | an answered question asked again, or its answer reversed | whether the context was enough the first time |
| Answers beyond the options | answers that pick none of the options (today: the central circle; the sherpa wake) | whether the options were the right ones |
| Duplicates and overtaken asks per sweep | `log/retire.md` | the noise the framework removes |
| Time from answer to action | `answered_at` to the commit or session that acts | whether the answer reached the agents |
| Asks per day, reserved vs routine | the log | what default-yes would save |
| Waiting at the end of the day | open asks after the 21:43 Lisbon sweep | the delta he starts the next day with |

`tools/collect.py` measures the first two and the waiting already; the others come with the next versions of the log.

## Answers logged today (for the measures)

| Question | Answered | Where | Beyond the options |
|---|---|---|---|
| twin keys | 13:39 UTC | Decision Desk | no (C) |
| data push | 13:42 UTC | Decision Desk | no |
| sherpa.d's wake | about 13:58 UTC | maestro.d's session | yes (four times a day) |
| the signing key | about 15:30 UTC | decisions.d's session | no |
| who leads sites.d, hub.d, newsroom.d | 15:47 UTC | helm.d's session | yes (SovereignWebsite and sgit.ai) |
| voice memos' audio | 15:47 UTC | helm.d's session | no (A, deleted at once) |
| 18 Desk decisions, five of them decisions.d's (the signing key, what the power covers, 7 days and 72 hours, signed answers, default-yes) | about 17:05 UTC | one voice memo on the lane cards | the power: yes, wider (delegated down) |
