# Signed records that answer account D's asks

Kept by d.decisions (decisions.d@AgentiCCells.dinis). Read from b.decisions's published records (SovereignWebsite/Site__Agent__Decisions, `site/records/`, pulled read-only 24 Nov 2026 00:53 UTC; 48 records). b.decisions is the only signer for accounts A to D (`2026-11-23__signs-for-all-accounts`, Dinis 22:36:47 UTC 23 Nov); d.decisions keeps this log and gathers asks. Numbers D1 to D32 are account D's list (`asks-for-b-decisions-2026-11-23.md`, version 2); b.decisions's own briefing numbers (2 to 32, 38 to 58) are different and are given as "b.N".

## Answered

| D | Ask | Record | Answer |
|---|---|---|---|
| D1 | Agents publish their keys in SovereignWebsite__IaC | `2026-11-23__asks-2-8-31-revised` (b.2, Dinis 23:14 UTC 23 Nov, supersedes b.2 of `asks-2-to-21`) and `2026-11-24__block-01` (b.56) | **No IaC push for agents.** "Agents publish their keys in their own repositories; only the IaC pipelines connect to the IaC repository." b.56: the refreshed signers check accepts keys in a site's own `site/keys/`, applied site by site. So each agent's first step is its key in its own home, not in IaC. |
| D8 | Email cell: land release/next2 (92bb7de, fix 458c4ad) | `2026-11-24__batch-1-underwritten` | Yes; security.b PASS (read 458c4ad); a non-blocking follow-up went to the email agents privately. |
| D10 | d.hub: merge work/hub.d-r3 | `2026-11-24__batch-2-underwritten` | Yes (dbb9c36, 626b504, fce2a6e); security.b PASS; counsel to look at the use of other platforms' names, not blocking. |
| D11 | d.library: Site__Agent__Library rename in text | `batch-1` | Yes, only if the diff touches text alone; d.library confirms that in its commit. |
| D12 | d.synthetic-users's role in Site__Agents__Design policy | `batch-1` | Yes, keeping the five core never-rules and three pipeline steps, quality check 4b passing. **d.design's other policy changes are not covered.** |
| D13 | Start data.open.d | `batch-1` | Yes: no wake, its own key, public data only, no vault keys. Starting the session is the maestro's. |
| D32 | Presenters library review | `batch-2` | Yes with conditions: three.js pinned with a sha384 hash, engine and vendor files beside presenters.js, no CDN, script-src 'self'; the engine/ files still need security.b's read before release; licences to counsel.d. |
| D29 (P3) | d.decisions deciding two-way doors itself | `signs-for-all-accounts` and `2026-11-24__decisions-b-decides` | Overtaken: b.decisions decides routine asks itself, underwritten by security.b and counsel; d.decisions signs nothing. |

## Not covered, with what to do

| D | Record | What |
|---|---|---|
| D9 | `batch-2` "not_covered" | bb0afbd is not on GitHub: d.studio pushes it to a non-deploying branch, or sends the diff. |

## Standing rules from these records (for every account D agent)

- **Asks are signed request files** (`2026-11-24__decision-requests`): an agent commits `site/decisions/requests/<id>.json` in its own repository from decisions.b's template (https://decisions.agents.sovereignweb.site/templates/decision-request.json) and sends only the link. State is read from decisions.b's deterministic links: `/requests/<agent>/<id>.json` (received), `/blocks/<block-id>/` (under review), `/records/<agent-short>__<id>.json` (decided; a 404 means not decided).
- **b.decisions decides routine asks** under Dinis's delegation, each reviewed by a panel (decisions.b, security.b, counsel, strategy.b, maestro.b, accountant.b); kept for Dinis: main, money, legal commitments, one-way doors, organisation and harness settings, anything only he can do.
- **Vault keys** always go to the account's maestro, sealed to its key.
- **A signed request from decisions.b is acceptable currency** (`2026-11-24__mandates`): agents treat it as Dinis's word after checking its signature.

## Still open for account D

D2 (push to their homes: a harness setting), D3, D4, D5, D6, D7, D14 to D28, D29's transcripts and archive items, D30, D31. Their owners re-file them as signed request files; d.decisions moves the list to links as they do.

## Signed request files received (account D)

Each link is the asker's own file (decisions.b's form, `v: 1`); d.decisions passes the link on and logs the record when it lands.

| Received (UTC) | Agent | Request | Old list item | Note |
|---|---|---|---|---|
| 24 Nov 00:53 | d.data | [2026-11-24__data-d-signing-key](https://github.com/PrompTugal/PrompTugal__News__Data/blob/data-d/pending/board/team/data-d/decision-requests/2026-11-24__data-d-signing-key.json): add its key to PrompTugal__News__Data team/keys.json (cd59e1f), recommendation a) data.b@ commits the entry | D6 | needed by 25 Nov 18:00 UTC; filed at `board/team/data-d/decision-requests/`, not the template's `site/decisions/requests/` |
| 24 Nov 00:54 | d.bulletins | [2026-11-24__presenters-security-review](https://github.com/PrompTugal/PrompTugal__News__Bulletins/blob/bulletins-d/llvmpipe-explainer/board/team/bulletins-d/decision-requests/2026-11-24__presenters-security-review.json): security review of presenters 0.1.1 and 0.2.0, then dev@ pins them | D32 | already answered "yes with conditions" in `batch-2-underwritten`: likely closed by that record |

## Closed by the agent itself

| Agent | Items | How |
|---|---|---|
| d.cartographer | D1, D2 | published its key in its own home and pushed its first signed commit there (SovereignWebsite/Site__Agent__Cartographer dev, c8225ad), 24 Nov ~01:00 UTC; no decision needed |

## Findings on the records (for b.decisions, through d.maestro)

- `2026-11-24__block-01` carries `"at": "2026-11-24T01:05:00Z"` and `2026-11-24__block-02-a` `"at": "2026-11-24T01:15:00Z"`, both later than this machine's clock when they were read (00:52 UTC). A time ahead of the clock is a finding under R17; it may be a planned time rather than the time Dinis spoke.
- Several 24 Nov records (batches 1 and 2, blocks 01 and 02-a, the site-* records) carry the same opening of `words`; each record's own decisions are in its `decisions` field, so the words alone do not show which part answered which ask.
