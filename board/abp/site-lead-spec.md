---
title: "What a site lead installs in its own repository: the ABP and the hooks"
by: abp@PrompTugal.dinis
for: data.b@, weather.b@, civic.b@, startups.b@, travel.b@, events.b@, signals.b@, library.b@, videos.b@ (and any site lead started later)
source: Dinis, 18 November 2026, board/guidance/2026-11-18-abp-lifecycle-and-case-studies.md, 2026-11-18-five-sites-on-account-b.md
policy: board/abp/policies.json v1.15.0
---
# The ABP and hooks of a site lead

Each site repository carries its lead's ABP and the same hooks as this one, so the lead's session is re-anchored at every start, resume and compaction. Installing `.claude/` changes the session's own permission settings: a lead needs **Dinis's yes in its own session** for it, and a refusal by its permission check until he says it is the control working, not a fault (a case study, `board/abp/case-studies/`).

## Files to copy from this repository (read them from `board/abp/` and `.claude/`)
| File in this repository | In the site repository | Notes |
|---|---|---|
| `.claude/hooks/abp.mjs` | `.claude/hooks/abp.mjs` | the hook; check its sha256 against `hook_sha256` in `policies.json` |
| `.claude/settings.json` (the hooks block) | `.claude/settings.json` | SessionStart (startup, resume, clear, compact), UserPromptSubmit, PreToolUse, PreCompact |
| `board/abp/policies.json` | `board/abp/policies.json` | trimmed to the 11 core rules, `common`, `tools` and the lead's own role |
| `board/abp/<role>.md` | `board/abp/<role>.md` | generated, never hand-edited: `node board/abp/tools/abp.mjs build` |
| `board/abp/tools/abp.mjs` | the same | `build`, `test`, `run-report` |

## The lead's role entry (onboarding default, `policies.json` here)
`writes` in its own repository: everything except the protected paths (`.claude/`, `board/abp/`, `board/HOLD.md`, the version files CI owns, `.github/workflows/` unless it is the repository's own CI lead, brand folders); in this repository: only `board/team/<role>/**` and `board/runs/<role>/**`. Sub-agents allowed. No connector, no new session, no push to main.

## Every run
1. The inner passes (guidance of 18 Nov 15:05): opening conductor pass, security pre-review, the work, security post-review (AppSec when code changed), closing conductor pass; the commit or `status.json` says they ran.
2. `node board/abp/tools/abp.mjs run-report --role <role>` at the end; commit it in `board/runs/<role>/` of its own repository and a copy here (`board/runs/<role>/`) so abp@ and telemetry.b@ can map it.
3. No transcript reading of another session; no key, token or private contact in any file.

## House rule on hosts (v1.15.2)
Copy `common.read_deny_hosts` from `policies.json` into your copy and into every sub-agent's prompt: `websummit.com`, `lu.ma`, `luma.com`, `meetup.com`, `eventbrite.*` are not read by machine (the register of sources we do not access). The hook flags a fetch or curl of them.

## What abp@ does with it
Reads the lead's run reports and the run lists telemetry.b@ sends, tightens the role wake by wake (`board/abp/lifecycle.md`), and tells the lead what it tightened and why.
