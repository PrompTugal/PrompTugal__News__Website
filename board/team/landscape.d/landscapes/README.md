# The landscapes

Dinis's word, 22 Nov 2026 (about 16:10 UTC, in landscape.d's session): map the landscape of each area we operate in (the Sovereign Website and the people we compete with; RiskMandate; agentic sales), track it, publish it on our own site as an example and sync from there; work closely with strategy.d and cartographer.d, because it is all connected; Wardley maps are the lens.

## Who does what
- **landscape.d** gathers the field: who offers what, to whom, at what price, under which licence. Public pages only, each fact with its URL and the date read; never behind a login, never working around a refusal; no copying of text or images.
- **cartographer.d** draws it (carto-map/1, `board/team/cartographer.d/maps/FORMAT.md`).
- **strategy.d** decides what it means: evolution and visibility, the moves, how the three landscapes meet in the estate map.
- **sherpa.d** supplies the user needs each positioning is anchored on.
- A landscape file gives **no positions**, only sourced facts and findings, so what is read and what is judged never mix.

## The three areas
| Area | Question the landscape answers | State |
|---|---|---|
| `sovereign-website/` | who we compete with when we sell "a website you own", and what nobody does | first version: rings 1 and 3 (European builders, open source) |
| `riskmandate/` | who else says anything about reach, mandate and gap for agents; where RiskMandate stands | first version (18 players, 62 facts), 23 Nov |
| `wardley-tools/` | which tools for Wardley maps exist or existed, open or closed, which stopped (cartographer.d's brief, Dinis ~17:15 UTC) | first version, 17 tools |
| `agentic-sales/` | who sells agent teams, to whom and at what price (AgentiCCells's market) | first version (18 players, 62 facts), 23 Nov |

## Tracking
Each landscape is one `landscape.json` (format `landscape/1`) with a `changes` log. At each run the scout re-reads the pages whose facts are older than 7 days or flagged, the file is rewritten, and the change is logged with the date; a fact that changed keeps its old reading in the log. Nothing is deleted silently.

## Publishing and sync
Until SovereignWebsite/Site__Agents__Landscape exists and helm.d says how we move, the files live here on `dev`. The site is the shop window for the cell: the landscapes, the briefs and the storyboards, each with its sources.

| `decision-making/` | tools and frameworks for making, recording, delegating and approving decisions (strategy.d, for Map 1) | first version (20 players, 70 facts), 23 Nov |

## Queued (asked by strategy.d, to start when it says): the platform sites (who already offers a better UI on Odoo, OpenRouter, AWS, Wikipedia, OWASP) and the decision-making framework as a product.
