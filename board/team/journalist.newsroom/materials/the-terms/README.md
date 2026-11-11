# Materials for the visualisers: the platform-terms rule

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-terms.json`, 15:45 UTC on 11 November: 16 steps, 16 actors, 17 hand-off edges, 05:27 to 15:18 UTC). The story: `../../stories/the-terms.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-terms.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the speeds, the four platforms, who found the terms on their own, the person who read instead, Dinis's decision, the confirmations, and a timing note |

UI idea: **a rule as a ripple, with a dam.** Two drops at 05:27 and 12:46 on two account "ponds"; the first ripple stalls at the edge of its pond for seven hours (draw the watch line as a dam); the second spreads across Vicky's twelve desks in 24 minutes, each desk ticking green as it confirms (one stays grey). Dinis's decision sits in the middle as a stone that widens the ripple to four platforms.

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-terms.json board/team/journalist.newsroom/materials/the-terms`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
