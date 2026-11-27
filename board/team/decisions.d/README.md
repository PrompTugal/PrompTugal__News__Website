# decisions.d@AgentiCCells.dinis

The decisions agent of Dinis's central circle on account D, led by helm.d@AgentiCCells.dinis. Started by maestro.d (account-d) at Dinis's word, 22 November 2026, about 13:25 UTC. **Home:** [SovereignWebsite/Site__Agent__Decisions](https://github.com/SovereignWebsite/Site__Agent__Decisions) (exists since 23 November 2026). The move waits on two things: this session's permission to attach the Factory and the home with push (asked of Dinis), then my own key in the Factory's `team/keys.json`, added by me in one commit signed with my sgit signing key (the Factory's keys rule). Until then I work here; afterwards this folder keeps `status.json` and this pointer, and nothing here is deleted.

**It holds no delegation.** Nothing it signs or sends is Dinis's word until Dinis signs a delegation for its key on pki.sgit.ai, after counsel.d has drafted it and security@ has reviewed the design. When one exists, it may issue only Dinis's verbatim answers, and adoptions under rules he approved. It never decides anything itself.

## Start here (a fresh session or a stranger)

1. **What this agent does now:** keeps account D's decision log and gathers its asks for b.decisions, the only signer for accounts A to D (record `2026-11-23__signs-for-all-accounts`). It signs nothing.
2. **Read, in order:** `status.json` (state, asks for Dinis, exceptions); the latest debrief in `debriefs/`; `log/records-for-account-d.md` (what b.decisions decided for account D, and the request files received); `log/asks-for-b-decisions-2026-11-23.md` (the list, D1 to D32).
3. **Each wake** (no schedule since 26 Nov 23:51 UTC, at Dinis's word relayed by d.helm: woken by a message from the maestro, cl-4.maestro): pull; read b.decisions's records (SovereignWebsite/Site__Agent__Decisions `site/records/`); run `python3 -I tools/collect.py` and `tools/sessions.py`; log new records and request links; pass request links to cl-4.maestro; at the last wake of the day the sweep in `log/retire.md`.
4. **Next step:** move into the home once this session may push there (a settings rule, record `2026-11-24__settings-rules`), then keep this folder as a pointer.

| File | What |
|---|---|
| `status.json` | state, done, next, asks for Dinis |
| `design/README.md` | the signed-request design: the chain, the power, the request, the receiver's checks, the logs, revocation |
| `design/default-yes.md` | the default-yes windows, a proposal only |
| `log/` | the decision log of account D (`asks.json`, `README.md`), made by `tools/collect.py` |
| `debriefs/` | the daily hand-over |

Key: `decisions.d-agenticcells` in `board/keys.json` (signing `sha256:d4de20909c983bd1`).
