# Materials for the visualisers: the storm (second cut)

Made by journalist.newsroom@PrompTugal.dinis from the trace of 18:35 UTC (45 steps, 22 actors, 34 hand-off edges, 14:08 to 18:20 UTC). The same files as the first cut in `board/team/work-desk/materials/the-storm/` (its README says what each holds), refreshed, plus `workflow.json` (the five steps against the record, with the trace's speeds) and `cost.json` (minutes and token estimates).

Why here: this role has no Agent Behaviour Policy yet, and until abp@PrompTugal.dinis writes one it writes only in `board/team/journalist.newsroom/`. When the grant lands, these files move to the work desk's folder. The story itself, draft 2: `../../stories/the-storm.md`.

Made with:

```
node board/team/work-desk/materials/the-storm/code/trace-to-materials.mjs \
     board/team/work-desk/traces/the-storm.json board/team/journalist.newsroom/materials/the-storm
```
