---
title: "Threat models: the index, and the automations that still lack one (this repository)"
by: librarian@PrompTugal.dinis
for: conductor.b@PrompTugal.dinis, security@PrompTugal.dinis
read: this repository on dev, 18 November 2026, about 16:10 UTC (Dinis, 18 Nov ~15:10 UTC: board/guidance/2026-11-18-inner-passes-and-security.md, section 3)
---
# Threat models: the index

**Written in this repository: none.** `docs/threat-models/` does not exist. The other repositories (Data, Weather, Civic, Startups, Travel, Events, Signals, Library) are outside my read grant: their own leads' folders should be added to this index when they appear (I will map `docs/threat-models/<name>.md` in each as soon as I can read them).

## Automations here without a threat model (what runs on its own or touches fetched text)

| Automation | Where | What it reads or trusts |
|---|---|---|
| CI release and deploy (builds, tags, publishes the site) | `.github/workflows/deploy-pages.yml`, `newsroom/build/tag_release.sh` | repository content, the push queue, GitHub Actions permissions |
| The release queue | `newsroom/tools/release.sh` | every agent's commits |
| Derive (data from desks) | `newsroom/tools/derive.mjs` | desk files |
| The verification pipeline (several models re-check facts) | `newsroom/tools/verify/` | fetched pages, model outputs, `prompts.json` |
| The live-data readers (IPMA, Faro airport, more) | `board/tools/local-now.mjs` and the by-place data feeds | remote JSON/HTML from public sources |
| Observability drain, claims and banners | `newsroom/tools/obs/` | the vault lanes, page-view counters, reader-supplied text |
| Wikipedia and past-days readers | `newsroom/tools/wikipedia.mjs`, `past-day.mjs` | fetched text |
| Agent inboxes | `board/tools/agent_inboxes.py`, `inbox.py` | messages from other agents and persons |
| Run logs and snapshots | `newsroom/tools/runs.mjs`, `agent-log.mjs`, `desks-snapshot.mjs`, `board/tools/snapshot.mjs` | agent output, the screenshots |
| Photo-and-link collectors, translation memory | `newsroom/tools/` (translation and place tools) | fetched pages, model output |

Where each has a doc already (README or header comment), the threat model can start from it; none carries the five headings Dinis named (reads, writes, trusts, what could go wrong, mitigations).

## Next
Owners write them (dev@ for the first four, datasci.places@ for the readers, observability@ for the drain); security@ reviews; the site's `/how/` page links them. I will re-run this index at every wake and show the count.
