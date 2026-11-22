# Proposals for Dinis (accountant.c@AgentiCCells.dinis, account C, 22 Nov 2026)

Dinis's word (voice memo in maestro.c's session, ~17:25 UTC 22 Nov): no account is ever maxed out again; track costs and tell the story so we maximise quality without hitting a limit; check every hour that agents are scheduled and on the right model; Opus where it earns it, but try Sonnet, Haiku and third parties (OpenRouter, Mistral, Qwen) and measure; move many workflows to Mistral (credits there). I measure, report and propose. Nothing here pauses, starts or schedules anything until Dinis says yes.

## 1. The guard: no account ever maxes out

### What is measured, at every reading
| Signal | Source | Cadence |
|---|---|---|
| five-hour window: `allowed` / `allowed_warning` / `rejected`, resetsAt, overage | `get_session` rate_limit_info (any session of the account) | every maestro wake |
| weekly percent | Dinis, by hand ("account C, weekly n%"); no session can read it | once a day, more often above 60% |
| burn rate per session (API-equivalent between two readings) | `get_session` usage | every reading |
| context size of every scheduled session | `get_session` context_usage | every reading (a wake's cost grows with its context) |
| what is scheduled and on which model | `list_triggers`, `get_session` model | every reading |

Forecast: `hours_to_limit = (100 - weekly%) / (weekly% per hour, from the last two readings)`. The level is set by the percent **or** by the forecast reaching 100% before the reset, whichever is worse.

### Levels and who does what
| Level | Trigger | What happens | Who acts |
|---|---|---|---|
| Green | weekly < 60% and five-hour `allowed` | normal | none |
| Amber | weekly 60-75%, or five-hour `allowed_warning`, or forecast hits 100% before reset | no new sessions; non-critical wakes slowed (hourly to 3-hourly); any scheduled session over 400k context compacts or hands over before its next wake; new routable work goes to Sonnet, Mistral or the account with most headroom | accountant.c raises it in status.json and a line to maestro.c; maestro.c changes the schedules |
| Red | weekly 75-88%, or five-hour `rejected` once | only the maestro and one conductor per circle keep wakes; routable jobs move to Mistral / OpenRouter or to another account (through the maestros' files) | maestro.c, at the standing rule |
| Stop | weekly >= 88% | the maestro alone, every 4 h; the last 12% is kept for Dinis's own interactive work | maestro.c; Dinis told at once |

Thresholds are a first guess; after a week of readings they are tuned to where the forecast actually proved right. **The one decision for Dinis:** may maestro.c act on these levels without asking each time (a standing rule), with every change recorded in from-c.md and told to him? Without it the guard only warns.

### Two findings that matter now (account C, 17:22 UTC)
1. A cowork inbox session (RM @inbox) is **94% of account C's lifetime spend** (1,503 API-equivalent): Opus at medium effort, a 285k-token context replayed every two hours by a run that rebooks itself. Proposal: compact or restart it with a short hand-over, and run its routine checks on Sonnet (or Haiku), keeping Opus for drafting.
2. conductor.C@PrompTugal.news still wakes hourly (trig_01Dqi53Bzf6iVEh11bf89TnS) at a 240k context with no job; its own summary asks to be disabled and archived. Proposal: disable that task (Dinis or maestro.c at his word).

## 2. Model routing: which job where, and how quality is measured

| Job | Default | Try against | Why |
|---|---|---|---|
| Maestro and conductor decisions, briefs to Dinis, security and ABP reviews, reviewing workers' branches | Opus | none for now | judgement and risk; the cost of a wrong call is higher than the tokens |
| Code features, the gate, CI | Opus lead, Sonnet workers (the dotted pattern) | Sonnet alone on small fixes | already the team's rule |
| A wake with nothing new ("pull, check, say one line") | a script with no model, or Haiku | Sonnet | most hourly wakes end in one line; replaying a large Opus context for that is the biggest waste seen today |
| Inbox and status triage, run logs, summaries, tagging, classification | Haiku or Mistral Small | Sonnet | short, structured, checkable |
| Article and bulletin first drafts, bulk descriptions of sources or places | Sonnet or Mistral Large | Opus as editor | the editor (Opus) still signs |
| Translation into Portuguese and the 21 cultures | Mistral Large (European languages; credits) | Sonnet, DeepL-like baselines via OpenRouter | measured on a back-translation and a native reader sample |
| Fact re-checks, second opinions (dev.verify@, counsel.d) | two providers via OpenRouter and Mistral | Opus alone | disagreement between providers is the signal |
| Data collection, derivation, JSON | no model (scripts) | Haiku for extraction | deterministic is cheaper and explainable |

**Quality is measured, not assumed**, per job and model:
- **gate pass rate** first time, and **rework rate** (a fix or revert of that output within 24 h, from git);
- **blind pairwise review** of a 10% sample by an Opus judge and, monthly, by Dinis (which is better: A or B);
- **Dinis's corrections** counted per job (his attention is the dearest input);
- for reader-facing text, synthetic@'s persona scores;
- **cost per accepted output** (API-equivalent or real money for Mistral / OpenRouter).
A job moves to a cheaper model when, over a week of A/B on the same inputs, the cheaper one's accepted rate is within 5 points of Opus's; it moves back if rework rises. Results go to `finance/routing-results.json` (to start with the first A/B).

## 3. Mistral (with mistral.c, same account)

Ask mistral.c (through files, or a logged send_message within account C) for: the credit balance and its expiry, the models and per-token prices, and one workflow to move first. My proposal for the first: **translation** and **the no-news wake check**, both easy to measure. Its spend is real money: a separate primitive (`mistral_usd`), read from Mistral's usage page.

## 4. The routing agent ("kind of like Kubernetes"): a design to propose to maestro.c

A scheduler, not a worker: it takes a job (type, size, deadline, sensitivity) and places it on a venue (account A to D, model, or Mistral / OpenRouter) from three inputs: the capacity ledgers (headroom per account), the routing table above (allowed models per job type) and the quality results (which venue is good enough). Its rules: never place on an account at Red or Stop; private or secret-bearing work never leaves Claude accounts; Opus only where the table says. It writes each placement to a log I read, so every choice is explainable. It needs Dinis's word to exist and, like the maestros, acts only on its own account; across accounts it proposes through the maestros' files.

## Asks for Dinis
1. The standing rule for the guard (section 1): may maestro.c act on the levels without asking each time?
2. Account C's weekly percent now, by hand.
3. The two findings: disable conductor.C's hourly wake; move the inbox run's checks off Opus.
4. Mistral credit amount and expiry (or let mistral.c read it), and yes or no to translation as the first move.
