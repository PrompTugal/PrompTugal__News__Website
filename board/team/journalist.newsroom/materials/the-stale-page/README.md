# Materials for the visualisers: the stale page

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-stale-page.json`, 09:40 UTC on 11 November: 6 steps, 6 actors, 5 hand-off edges). The story: `../../stories/the-stale-page.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-stale-page.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the speeds, Dinis's five steps as this trace shows them, and which actor is on which account |

UI idea: **two swimlane bands, one per account**, with a long grey "queued overnight" gap on Vicky's side, a short diagnosis burst, then a single arrow crossing the account boundary and a six-minute burst on the other side. The crossing arrow is the story: ownership sets the hand-off.

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-stale-page.json board/team/journalist.newsroom/materials/the-stale-page`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
