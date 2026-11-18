# Hand-over to account B: what conductor.b@ picks up from account A

conductor@PrompTugal.dinis (account A), 17 November 2026, about 23:00 UTC, at Dinis's word: "you should not have any sessions here running on a schedule ... I should be able to move them to the other agentic system ... tell conductor.b@PrompTugal.dinis ... that secret for them to pick up".

## Schedules on account A

- **None of PrompTugal's.** The only one, observability@'s hourly drain (started on account A today at Dinis's word), was disabled at 22:58 UTC. Account A still runs AgentiCCells, riskmandate.ai and newsroom.sgit.ai schedules; they are not PrompTugal's and are untouched.

## What conductor.b@ starts on account B, on its schedule

| Role | Repo | State at the hand-over | Debrief |
|---|---|---|---|
| observability@PrompTugal.dinis | PrompTugal__News__Website | **stays on account A** (Dinis, 18 November: "the main observability is here"); do not start a second one on B. Session 2 onboarded, key `observability-promptugal-2`; never drained: its vault keys are sealed only to Dinis (`newsroom/observability/sealed/dinis.json`); Dinis re-seals them to the new session's key | `board/team/observability/` |
| data@PrompTugal.dinis | PrompTugal__News__Data | v0.1.2 live, 9 sources, hourly CI collection at :17 | `board/team/data/debriefs/2026-11-17-first-version.md` there |
| weather@PrompTugal.dinis | PrompTugal__News__Weather | v0.1.5 live | the same path in its repo |
| civic@PrompTugal.dinis | PrompTugal__News__Civic | v0.1.4 live | the same |
| startups@PrompTugal.dinis | PrompTugal__News__Startups | v0.1.5 live | the same |
| travel@PrompTugal.dinis | PrompTugal__News__Travel | v0.1.5 live | the same |

The shared rules for the five sites: `board/briefs/2026-11-17-the-five-sites.md`.

## The secrets to pick up

- **The data vaults' keys: sealed (23:00 UTC, at Dinis's word in the data session).** The nine source vaults' keys, with ids, names, read keys and the `DATA_VAULT_KEYS` object for the CI secret (not `SG_SEND_ACCESS_TOKEN`), are sealed twice and kept in a dedicated sgit vault, `5qzpmf4m` on dev.send.sgraph.ai, which holds ciphertext only (its public read key is in the data session's last message to the conductor; ask Dinis). Not committed: the leak scan flags the ciphertext.
  - `vault-keys-dinis.json`: a pki.sgit.ai message (`m1`) to dinis.cruz (sha256:db7f79fdd87e030a), expires 1 December 2026. Dinis opens it at pki.sgit.ai/m/ and keeps the keys in his master vaults, or re-seals them to conductor.b@.
  - `vault-keys-conductor.json`: an sgit pki envelope to conductor-promptugal (account A's conductor).
  - The write key of that vault itself is held only in the account A data session.
- **CI secrets** the Data repo needs to keep its vaults current: `SG_SEND_ACCESS_TOKEN` and `DATA_VAULT_KEYS` (Dinis sets them in the repo's settings).
- **The observability vault keys:** Dinis re-seals them to observability@'s new key (see above).

## Observability for the sub-sites

Each site team adds `obs.js` to its pages with a lane of its own (weather, civic, startups, travel, data; and newsroom.sgit.ai) and sends the lane names to conductor@ (account A, inbox `board/inboxes/conductor.json`), who passes them to observability@ on account A.

## Fixes for every team on account B

1. Allow `pki-agent.mjs keygen --session` in the new sessions (refused on account A, so nothing of the five sites is signed).
2. The five repos' commit check came from an AgentiCCells template and accepts only `@AgentiCCells` agents: change it to accept `@PrompTugal.dinis`.
3. Dinis's picks: front page A, B or C on each site's `/design/`.
4. IPMA's terms forbid profit-making use: keep IPMA-based pages free (outside the meter) or ask IPMA (Dinis).
