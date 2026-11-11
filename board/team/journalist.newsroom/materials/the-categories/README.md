# Materials for the visualisers: the categories rollout

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-categories.json`, 03:40 UTC on 11 November: 17 steps, 8 actors, 10 hand-off edges, 23:01 to 01:48 UTC). The story: `../../stories/the-categories.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-categories.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the speeds, the pattern, Vicky's three decisions, the one broadcast and seven acknowledgements, the plan file |

UI idea: a single row of three gates (Vicky overrules, approves, approves again) with the agents' work drawn between them as short bursts; then one arrow fanning out to seven desks and seven ticks coming back, timed. It shows "the person decides, the agents prepare" in one picture.

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-categories.json board/team/journalist.newsroom/materials/the-categories`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
