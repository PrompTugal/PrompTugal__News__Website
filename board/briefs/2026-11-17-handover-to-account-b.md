# Hand-over to account B: what conductor.b@ picks up from account A

conductor@PrompTugal.dinis (account A), 17 November 2026, about 23:00 UTC, at Dinis's word: "you should not have any sessions here running on a schedule ... I should be able to move them to the other agentic system ... tell conductor.b@PrompTugal.dinis ... that secret for them to pick up".

## Schedules on account A

- **None of PrompTugal's.** The only one, observability@'s hourly drain (started on account A today at Dinis's word), was disabled at 22:58 UTC. Account A still runs AgentiCCells, riskmandate.ai and newsroom.sgit.ai schedules; they are not PrompTugal's and are untouched.

## What conductor.b@ starts on account B, on its schedule

| Role | Repo | State at the hand-over | Debrief |
|---|---|---|---|
| observability@PrompTugal.dinis | PrompTugal__News__Website | session 2 onboarded, key `observability-promptugal-2`; never drained: its vault keys are sealed only to Dinis (`newsroom/observability/sealed/dinis.json`); Dinis re-seals them to the new session's key | `board/team/observability/` |
| data@PrompTugal.dinis | PrompTugal__News__Data | v0.1.2 live, 9 sources, hourly CI collection at :17 | `board/team/data/debriefs/2026-11-17-first-version.md` there |
| weather@PrompTugal.dinis | PrompTugal__News__Weather | v0.1.5 live | the same path in its repo |
| civic@PrompTugal.dinis | PrompTugal__News__Civic | v0.1.4 live | the same |
| startups@PrompTugal.dinis | PrompTugal__News__Startups | v0.1.5 live | the same |
| travel@PrompTugal.dinis | PrompTugal__News__Travel | v0.1.5 live | the same |

The shared rules for the five sites: `board/briefs/2026-11-17-the-five-sites.md`.

## The secrets to pick up

- **The data vaults' keys** (each source's vault, with the write material) are held only in the account A data session until Dinis confirms in that session that it may seal them. It will seal them, as pki.sgit.ai messages, to conductor-promptugal and to Dinis's pki.sgit.ai key (dinis.cruz, sha256:db7f79fdd87e030a), and commit only the sealed files to PrompTugal__News__Data under `board/team/data/sealed/`. If conductor.b@ should receive them directly, Dinis says so in that session and names the key (conductor.b-promptugal in `board/keys.json`, published 6 November; conductor.b@ confirms it is still the one it holds).
- **CI secrets** the Data repo needs to keep its vaults current: `SG_SEND_ACCESS_TOKEN` and `DATA_VAULT_KEYS` (Dinis sets them in the repo's settings).
- **The observability vault keys:** Dinis re-seals them to observability@'s new key (see above).

## Fixes for every team on account B

1. Allow `pki-agent.mjs keygen --session` in the new sessions (refused on account A, so nothing of the five sites is signed).
2. The five repos' commit check came from an AgentiCCells template and accepts only `@AgentiCCells` agents: change it to accept `@PrompTugal.dinis`.
3. Dinis's picks: front page A, B or C on each site's `/design/`.
4. IPMA's terms forbid profit-making use: keep IPMA-based pages free (outside the meter) or ask IPMA (Dinis).
