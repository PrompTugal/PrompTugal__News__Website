# Graphs and visualisation: EXISTS

**Domain:** `graphs/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The graph explorer, the centres-of-gravity, world, industry, RiskMandate and stories views, the per-entity graphs.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Graph explorer `/graph/` (Cytoscape.js vendored; explore walk, filters, layouts, shortest routes, URL state). Evidence: `newsroom/build/features/graph.mjs`, `assets/graph`; first added `d5dcff89` on 2026-11-06.
- [F] Centres of gravity `/graph/gravity/` (canvas, Save as PNG). Evidence: `newsroom/build/features/graph-gravity.mjs`, `content/graph/gravity.md`; first added `dc911e94` on 2026-11-06.
- [F] Stories graph view `/graph/stories/`. Evidence: `newsroom/build/features/graph-stories.mjs`; first added `af325f76` on 2026-11-06.
- [F] Industry, RiskMandate and world views. Evidence: `content/graph/industry.md`, `content/graph/riskmandate.md`, `content/graph/world.md`; first added `20cbcaa1` on 2026-11-06.
- [F] Vendored libraries: Cytoscape.js, world-atlas, jsQR. Evidence: `assets/vendor/cytoscape`, `assets/vendor/world-atlas`; first added `6d0fc0bb` on 2026-11-05.
- [S] Whole-graph JSON, Cytoscape elements and N-Triples in the API (1,441 nodes at 5 November, S). Evidence: `newsroom/build/features/api.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Infographics tool (article infographics from JSON). Evidence: `design/infographics/make.mjs`; first added `242ba060` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

9 cards (9 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-06T22:26:02Z at site v0.1.363; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `PUB.SITE` | 9 |

Newest five accessions:

- `ACC-20261106-2930` [Web Summit in Lisbon, edition by edition](https://promptugal.news/graph/past-summits/) (`PUB.SITE past-summits`)
- `ACC-20261106-2928` [The cloud centres](https://promptugal.news/graph/cloud-centres/) (`PUB.SITE cloud-centres`)
- `ACC-20261106-2643` [Algarve Evolution, drawn](https://promptugal.news/graph/algarve-evolution/) (`PUB.SITE algarve-evolution:2`)
- `ACC-20261106-1788` [The world map](https://promptugal.news/graph/world/) (`PUB.SITE world`)
- `ACC-20261106-1783` [The best of the graph](https://promptugal.news/graph/stories/) (`PUB.SITE stories`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
