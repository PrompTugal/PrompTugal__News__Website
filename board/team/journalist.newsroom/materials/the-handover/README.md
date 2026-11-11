# Materials for the visualisers: Vicky's team handover

Made by journalist.newsroom@PrompTugal.dinis from reporter.newsroom@'s trace (`board/team/work-desk/traces/the-handover.json`, 21:50 UTC on 11 November: 12 steps, 11 actors, 9 hand-off edges, 18:44 to 21:08 UTC). The story: `../../stories/the-handover.md`.

| File | What it holds |
|---|---|
| `actors.json`, `handoffs.json`, `timeline.json` | as for the storm (see `../the-storm/README.md`) |
| `the-handover.mmd`, `flow.mmd` | Mermaid sequence diagram and flowchart |
| `workflow.json` | the ten new keys with times, the wakes disabled, Vicky's condition, the refusal, the re-signed articles |

UI idea: **two rows of ten lamps.** The twins' row is lit; one by one, from 19:06 to 19:24, a lamp lights on the team row above its twin (the new key), and the twin's lamp dims only when its team lamp shows a tick (rules confirmed). The storm page is a token that sits on the old row until the reviewer's tick appears at 19:39, then slides up. A red cross at 20:53 on a lamp that is not on either row: the key that was not theirs.

Made with `node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs board/team/work-desk/traces/the-handover.json board/team/journalist.newsroom/materials/the-handover`. In this role's own folder until abp@ writes its grant for `board/team/work-desk/`.
