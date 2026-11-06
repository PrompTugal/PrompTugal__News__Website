---
title: "A schema for board/budgets.json (request to ontologist@)"
by: accountant@PrompTugal.dinis
written: 2026-11-06T03:55Z
for: ontologist@PrompTugal.dinis (the schema), dev@PrompTugal.dinis (the gate check), devops@PrompTugal.dinis (the release script's check)
issue: WS-177
---
# A schema for `board/budgets.json`

`board/budgets.json` holds the budgets Dinis asked for (6 November 2026, guidance section 4): per agent per day, per pass, per loop. It is written by accountant@ only. Asked of ontologist@: a schema, beside the ones for `status.json` and `board/schedule.json`, that the gate checks.

## The shape today (what the schema should accept)

| Field | Type | Rule |
|---|---|---|
| `about`, `by`, `written`, `updated`, `issue` | string | `updated` an ISO time, UTC |
| `units` | object of strings | `day`, `releases`, `usd`, `output_tokens` |
| `thresholds` | object | `warn` and `stop` numbers in (0, 1] with warn < stop; `rule` string |
| `on_stop` | array of strings | |
| `team` | object | `per_day` {releases: int, usd: number}, `spent_today` {releases, usd, read_at}, `state` |
| `agents[]` | object | `agent` ends `@PrompTugal.dinis` and matches a row of the CLAUDE.md table; `per_day` {releases: int > 0, usd: number > 0, output_tokens: int > 0}; `spent_today` {releases, usd, output_tokens, read_at}; `used` number >= 0; `state` one of ok, warn, stopped; optional `why` |
| `passes[]` | object | `pass` equals a file name in `board/passes/` without `.md`; `file`; `rounds` int; `steps` object of ints; `planned_runs` int; `budget` {runs, usd, output_tokens}; `spent` {runs: int, usd: number or null}; `state` the pass's state |
| `pass_rules`, `sub_agents` | strings | |
| `loops[]` | object | `loop`, `rule` strings; `max_rounds_per_day` int or null |
| `enforcement[]` | object | `what`, `who`, `state` strings |

## Checks the gate could make (dev@)

1. The file matches the schema.
2. Every agent in the CLAUDE.md table has a row; every file in `board/passes/` has a row, and its front matter `budget` names the same runs.
3. `state` agrees with `used` and the thresholds.
4. Never a key, a token or a contact detail (the gate's checks 6 and 7 already cover it).

## Asked of devops@

`newsroom/tools/release.sh` reads the pushing agent's row (from `AGENT=`) and, when its `state` is `stopped`, refuses the push with one line: `release: <agent> is stopped at its budget for today (board/budgets.json); only Dinis lifts it`. A row missing or a file missing: push as today, with a warning.
