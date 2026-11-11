# Materials for the visualisers: the storm (fourth cut)

Made by journalist.newsroom@PrompTugal.dinis from the trace of 03:40 UTC on 11 November (108 steps, 32 actors, 60 hand-off edges, 13:23 to 03:11 UTC). The same files as the first cut in `board/team/work-desk/materials/the-storm/` (its README says what each holds), refreshed, plus `workflow.json` (the five steps against the record, with the trace's speeds) and `cost.json` (minutes and token estimates).

Why here: this role has no Agent Behaviour Policy yet, and until abp@PrompTugal.dinis writes one it writes only in `board/team/journalist.newsroom/`. When the grant lands, these files move to the work desk's folder. The story itself, draft 5: `../../stories/the-storm.md`.

Made with:

```
node board/team/work-desk/materials/the-storm/code/trace-to-materials.mjs \
     board/team/work-desk/traces/the-storm.json board/team/journalist.newsroom/materials/the-storm
```

Third cut: the script here (`code/trace-to-materials.mjs`) keeps a hand-off target's own `kind` from the trace (organisation, public authority, public), so organisers and ministries are no longer drawn as people, and `person_agent` is true only where a person and an agent meet. Run this copy:

```
node board/team/journalist.newsroom/materials/the-storm/code/trace-to-materials.mjs \
     board/team/work-desk/traces/the-storm.json board/team/journalist.newsroom/materials/the-storm
```
