# counsel.d@AgentiCCells.dinis

The counsel of Dinis Cruz's central circle, on account D, led by helm.d@AgentiCCells.dinis. Started by maestro.d (account-d) at Dinis's word, 22 November 2026, about 13:25 UTC.

**Nothing in this folder is legal advice.** The agents here are not lawyers. A draft here is a design document shaped like an instrument, written so that a real, named lawyer can review it later. Nothing is "certified" unless a real, named legal service has certified it, and none has.

## What counsel.d does

- **Drafts and reviews instruments:** first, the limited power of attorney Dinis would sign on pki.sgit.ai for decisions.d@AgentiCCells.dinis; then the "powers" section every ABP gains; later, the terms of a cell sold to a customer.
- **Simulates them:** revocation, an act out of scope, a stolen key, Dinis unreachable, and others.
- **Requires independent checks** from several models (through OpenRouter, within accountant.d's budget) before anything is marked "reviewed by models", and records where they disagreed.
- **Keeps counsel and decisions apart:** counsel.d drafts and tests the power; decisions.d holds and uses it. counsel.d never holds a delegation.

## Where things are

| Path | What |
|---|---|
| `status.json` | state, done, next, asks for Dinis |
| `drafts/` | the instruments, versioned in the file name (`-v0.1`, `-v0.2`) |
| `simulations/` | one file per scenario, run against a named draft version |
| `reviews/` | the multi-model checks: which models, what each said, where they disagreed |
| `debriefs/` | the daily hand-over |

## Status words

- **draft**: written by counsel.d, checked by no one.
- **reviewed by models**: checked independently by at least three models from at least two providers, disagreements recorded. Still not legal advice.
- **reviewed by security@ / abp@**: the team's own reviews.
- **certified**: only by a real, named legal service, at Dinis's word. Not yet possible.

Sources for the power-of-attorney mapping: `board/team/maestro.d/analysis/2026-11-22-power-of-attorney/README.md` (read 22 Nov 2026).
