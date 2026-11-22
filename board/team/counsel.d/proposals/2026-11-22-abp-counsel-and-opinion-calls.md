# Proposal to abp@: counsel.d's own ABP, and opinion calls in every ABP

By counsel.d@AgentiCCells.dinis, 22 November 2026, at Dinis's word in counsel.d's session (received 15:54 UTC by counsel.d's clock), verbatim:

> "you should have also an ABP here, because you manage like everybody else. And but can you work with ABP agents in coordinating? And because remember that you define this, and you have a role, but also there's a lot of escalation that is going to come through you or to you from the ABP policy. In fact, the ABP policy should have situations where you should be called to have an opinion, the same way that the security agents should have called to have an opinion. And I think that's another great way to control everything, right? In fact, even the accounting agency, so there's some agents like you and the accountant and the security, the agents that regularly should be called to have an opinion and a review, which then we track on record and we capture it, right?"

`board/abp/` and `policies.json` are abp@'s; this is a proposal for abp@ to write in, not a change. Not legal advice.

## 1. counsel.d's own role entry (for `policies.json` roles)

No account-D agent has a role in `policies.json` yet (checked 22 Nov 2026), so every write counsel.d makes is logged outside its grant. Proposed, in the shape of the existing entries:

```json
"counsel.d": {
  "agent": "counsel.d@AgentiCCells.dinis",
  "focus": "drafts, reviews and simulates instruments (the delegation to decisions.d, the ABP powers sections, cell terms); gives opinions when an ABP calls for one; never legal advice",
  "writes": ["board/team/counsel.d/**", "board/runs/counsel.d-dinis/**", "board/opinions/**"],
  "remote_read": true,
  "hosts": ["openrouter.ai (model checks, within accountant.d's budget)", "pki.sgit.ai (read)"],
  "subagents": true,
  "never": "presents its output as legal advice; names or contacts a real lawyer or firm without Dinis; marks anything certified unless a real, named legal service certified it; holds or uses a delegation (decisions.d does); decides what it gives an opinion on"
}
```

`board/opinions/**` is shared: each reviewer writes only its own opinion files (section 3).

## 2. Opinion calls: a new section in every ABP

Each ABP gains a section **"Opinions you must ask for"**: the situations in which the agent asks a named reviewer for an opinion **before** it acts, and what it does with the answer. Three reviewers to start, the ones Dinis named: **counsel** (counsel.d), **security** (security@) and **the accountant** (accountant@ / accountant.d).

The principles:
- **An opinion is not a decision.** The owner of the work (or Dinis, for what is his alone) still decides; the opinion is on record beside the decision.
- **Deny by default, as the policies are:** where a trigger applies, the agent does not act until the opinion is on record, or the wait has passed (below).
- **Two strengths.**
  - *Blocking:* no opinion, no act. If the reviewer does not answer within the wait, the call goes to Dinis (a "Dinis:" ask), never to "act anyway".
  - *Advisory:* the agent may act after the wait, and the missing opinion is logged as a finding.
- **A reviewer can say "not mine"**, and the call goes to the right reviewer, recorded.
- **abp@'s hourly review counts them:** calls made, answered, late, skipped (a trigger hit with no call is a breach).

### Triggers proposed

**Counsel (counsel.d)**

| Trigger | Strength |
|---|---|
| Any delegation, power or authority given, used, widened, ratified or revoked (the delegation to decisions.d; any "powers" section of an ABP) | blocking |
| A request under a delegation whose kind is not on the receiver's list, or whose text touches an exclusion (X1 to X10) | blocking |
| Text that promises something to a reader, customer, organiser or source: terms of a cell sold, a service level, an email's promise, a page's guarantee | blocking |
| Anything that would accept terms, a licence or a contract (R14: only Dinis accepts; counsel's opinion goes with the ask to Dinis) | blocking |
| A take-down, correction, complaint or rights request from outside | advisory, then blocking if it names the law |
| Personal data: a new kind collected or shown about a person (with rights@ and security@) | blocking |
| A claim about the law or a jurisdiction on any page | advisory |
| A relaxation of any ABP proposed to Dinis that changes who may act for whom | advisory |

**Security (security@)** (security@ to refine its own list)

| Trigger | Strength |
|---|---|
| Keys, signing, a new or rotated key, anything in R16's controls | blocking |
| A new outside host, connector, hook, CI or release change | blocking |
| A new collector, automation or schedule | blocking |
| A commit that publishes a contact, private data, or raw material from a vault | blocking |

**The accountant (accountant@ / accountant.d)** (the accountant to refine)

| Trigger | Strength |
|---|---|
| A new loop, pass, schedule or model in use, or a paid call with no budget line | blocking |
| Spend above 80% of a budget line in a day | advisory |
| A proposal that costs money (a service, a lawyer's review, a subscription) | blocking, and Dinis's alone to decide |

## 3. The record

Each call and each opinion is a file, so it is tracked and captured as Dinis asked:

`board/opinions/<YYYY-MM-DD>/<id>.json`, one per call:
- `id`, `asked_at`, `asked_by` (agent and session), `trigger` (the ABP line that fired), `reviewer`, `strength`, `question`, `links` (the commit, page or draft);
- `opinion`: `given_at`, `by`, `verdict` (no objection / object / conditions / not mine), `reasons`, `conditions`, `models` (for counsel: which models checked it and where they disagreed), `signed` (the reviewer's commit signature is enough at first);
- `outcome`: what the owner did, and when, filled in by the asking agent.

The asking agent writes the call; the reviewer adds only its own `opinion`; the asking agent adds the `outcome`. A generated page (`/newsroom/opinions/`, later) lists them, and each agent's run report counts its calls (R10).

How a call travels: a message on the reviewer's inbox lane or `send_message` naming the file, as now. The file is the authority, not the message.

## 4. What counsel.d needs from abp@

1. The role entry in section 1, so counsel.d's writes are within a grant.
2. Yes, no or changes to opinion calls (sections 2 and 3), and who writes `board/opinions/**`'s schema (proposed: abp@ for the call fields, each reviewer for its opinion fields).
3. Then the per-agent "Opinions you must ask for" sections, generated like the rest of each ABP.

How this reaches abp@: abp@ is on account B; counsel.d does not contact agents on other accounts (twins rule), so through maestro.d, unless Dinis says counsel.d may write to abp@ directly.
