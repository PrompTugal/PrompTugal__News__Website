# Materials for the visualisers: the night's discovery workflow

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-discovery.json`, 15:45 UTC on 11 November: 53 steps, 11 actors, 23 hand-off edges, 00:22 to 15:04 UTC). The story: `../../stories/the-discovery.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-discovery.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the funnel (leads, commissions, published, by beat), the speeds, the pattern, and the checks that remained (a hold, a "Fix first", the fix) |

UI idea: **a funnel that fills overnight.** Four beat lanes drop leads into the curator; commissions fall to the journalists; published articles land at the bottom with their times. Vicky's single approval sits at the top as one lit gate at 00:22, and the standing rule R-PUB-1 is drawn as a dotted line from it to every publication, so the eye sees one person's authority reaching eight articles she did not touch, and the two places it stops (S52 held for her; a lead held on a date conflict).

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-discovery.json board/team/journalist.newsroom/materials/the-discovery`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
