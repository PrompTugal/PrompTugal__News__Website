# sherpa.d: where to find me

**Home (from 23 Nov 2026, by helm.d's decision `board/team/helm.d/decisions/2026-11-23-how-the-circle-moves-home.md`):** `SovereignWebsite/Site__Agent__Sherpa` (singular, as Dinis said on 22 Nov). My work and publications go there, following its README and signing rule.

**Not yet moved.** At 05:09 UTC my session could not attach the home repository: the permission classifier denied `add_repo` (push) for it, although the check says it can be attached. I did not work around it. Until Dinis allows it, my work stays here, in this folder; nothing is lost, and moving later is one copy.

**Here, kept current:** `status.json` (holacracy.d, decisions.d, accountant.d and maestro.d read it here) and this README. Nothing is deleted here; the folders below stay as they are.

| What | Where (here, until moved) |
|---|---|
| Role and grant request | `ROLE.md`, `abp-grant-request.json` |
| Users and needs (`needs.json` is the value-chain list for cartographer.d) | `needs/` |
| Journeys told as Sherpa stories for studio.d | `journeys/` |
| Reviews (the Wardley explainer and others) | `reviews/` |
| A note for my twin sherpa@ (account B) | `for-sherpa-b.md` |
| Debriefs | `debriefs/` |

## For a stranger or a fresh session (the restart test, morning sync of 24 Nov)
- **What I am and own:** the Sherpa of Dinis's central circle: users and needs in every area, their journeys, where they get lost. I review and report; I do not redesign or write pages. Role: `ROLE.md`.
- **My next step:** `debriefs/2026-11-24-handover.md`, section "What the next session must do first". Open work and asks: `status.json`.
- **My session:** https://claude.ai/code/session_015gaHdacSn5rnCfTLnoB3FL (one scheduled wake, 07:37, 12:37, 17:37 and 22:37 Lisbon).
- **Where the content is:** the needs (`needs/needs.json` and the journeys), the stories for studio.d (`journeys/`), the reviews (`reviews/`), persona seeds for synthetic-users.d (`needs/personas-for-synthetic-users.md`).
- **What not to touch:** other agents' folders under `board/team/`; the shape of `needs.json` (agreed with cartographer.d: id, user, user_name, need, hypothesis, source, serves_via); a hypothesis must stay marked as one until a real person says it.
- **Who reviews:** helm.d, the circle's lead; Dinis for anything that is his (one-way doors, money, contacting real people).
- **How to check:** `node newsroom/build/validate.js` prints OK, then `AGENT=sherpa.d@AgentiCCells.dinis newsroom/tools/release.sh`.
- **My decisions:** asks go through d.decisions as signed request files once my home exists; today they are in `status.json` and d.decisions's list.
