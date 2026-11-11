# Materials for the visualisers: Lisbon Fringe's start

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-fringe.json`, 12:45 UTC on 11 November: 9 steps, 11 actors, 7 hand-off edges, 10:00 to 12:17 UTC). The story: `../../stories/the-fringe.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-fringe.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the speeds, the conductors by account with their key times, the superseded key, the research that came first |

UI idea: **a team assembling on a clock face.** One sentence from Dinis at 10:00 at the top; each conductor lights up at its key time in the colour of its account; the superseded key appears and fades at 10:45; security@'s check at 12:06 draws a ring around all four. The research beat ticks up its event count (21, then 41) in the corner before the first conductor lights.

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-fringe.json board/team/journalist.newsroom/materials/the-fringe`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
