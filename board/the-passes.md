---
title: "Passes: focused rounds of work on one thing, with a plan, a budget, reviews and a close"
by: conductor@PrompTugal.dinis
written: 2026-11-06T04:10Z
decided_by: Dinis Cruz, 6 November 2026, about 04:00 UTC (board/guidance/2026-11-06-design-and-passes.md, sections 3 to 5)
learn_from: newsroom.sgit.ai (its passes and runs), the book team's wake protocol (https://the-ultimate-insider.book.sgit.ai/admin/docs/wake-protocol.md)
issue: WS-177
---
# Passes

A **pass** is a focused piece of work on one thing (a page, a feature, a story, a set of findings), done by several agents in a fixed order, within a budget, and closed with a record. The hourly runs keep each agent moving; a pass is how they work *together* on one thing until it is good.

## The shape of every pass

```
 conductor ─▶ security ─▶ REVIEW (parallel) ─▶ ROUNDS (in sequence, 2 or 3) ─▶ security ─▶ RECORD ─▶ conductor
  opens:       pre-review:  sherpa (the user)     designer ─▶ dev ─▶ sherpa       post-review:  journalist or      closes:
  the thing,   the plan     ontologist (what      ─▶ designer ─▶ dev ...          the diff,     historian: a note  what changed,
  the goal,    against the  the page says)        each round: one change,         the gate,     in /newsroom/      what was spent,
  the budget   rules        synthetic (readers)   measured                        harm          notes/             what is next
               (go/stop)    others as the pass                                    (clean/stop)
                            needs
```

- **One file per pass:** `board/passes/<YYYY-MM-DD>-<slug>.md` with front matter `goal`, `owner` (the conductor), `budget` (runs and tokens, from the accountant), `state` (open, reviewing, round 1..n, closing, closed, stopped), `agents`, and a log: each step's agent, time, verdict (go, change, stop; done, partial; clean, finding), commit, and spend.
- **The budget is a hard stop.** When a pass spends its runs or tokens it stops where it is, records why, and the conductor puts it to Dinis. A pass never loops on its own findings: the plan fixes the number of rounds.
- **Security first and last:** a stop from security stops the pass (and `board/HOLD.md` if it is serious).
- **Every finding is answered:** in the pass file, each finding from a review gets an owner and a decision (fix in round n, later, no, and why). This is "who actually has read this?": the pass file says.
- **Close:** the conductor writes what changed (before and after, with screenshots), what was spent, and what is next; the journalist or historian writes the note.

## The first passes

| Pass | Goal | Agents | Budget (until the accountant sets it) |
|---|---|---|---|
| `2026-11-06-the-top-of-the-page` | Dinis's feedback (guidance, section 1): the masthead and bars; logo left, things right, the card tagline, no "Powered by RiskMandate", the credit top right, no Vault for now, the Newsroom link on a phone; quick fixes first, then several mock-ups for Dinis to choose | sherpa, designer, dev, synthetic | 3 rounds |
| `2026-11-06-the-synthetic-readers-page` | /newsroom/synthetic.html readable: an infographic view, a graph of its findings, every finding with an owner and a decision | sherpa, ontologist, historian, synthetic, designer, dev | 3 rounds |
| `2026-11-06-the-newsroom-search` | A search over every page of the site, the newsroom's included, like a settings search | sherpa, dev, designer | 2 rounds |

## Who builds the machinery

| Agent | The work |
|---|---|
| `conductor@` | the pass files, opening and closing; the order |
| `accountant@` | the budgets: per pass, per agent per day; reads what each run spent; stops a pass at its budget |
| `security@` | the pre-review and post-review of every pass |
| `dev@` | `/newsroom/passes/` built from `board/passes/`: each pass, its steps, its spend; later, a gate check that a closed pass has every step |
| `librarian@` | an index of every pass, finding and decision, findable by search |
