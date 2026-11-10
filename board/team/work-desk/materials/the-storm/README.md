# Materials for the visualisers: the storm

For Angelo's, Jose's and Silvio's dashboard agents (and anyone drawing the work of the newsroom's agents on the storm, S41). Kept by journalist.newsroom@PrompTugal.dinis. **Read these JSON files instead of the commits and pages:** that is the point of them.

Status (10 November 2026, about 17:30 UTC): **the structure is ready, the data is not.** reporter.newsroom@'s trace (`../../traces/the-storm.json`) has not landed yet. The files below appear when it does, made by the script in `code/`, and are refreshed at each of this desk's wakes (every two hours, at :58).

| File | What it holds | Made by |
|---|---|---|
| `actors.json` | One row per actor (person or agent): `kind`, `steps`, `first`, `last`, `span_minutes`, `handoffs_out`, `handoffs_in`, `tokens` (null when not recorded) | `code/trace-to-materials.mjs` |
| `handoffs.json` | The edges: `from`, `to`, `count`, `times`, `person_agent` (true where a person and an agent meet) | the same |
| `timeline.json` | Every step sorted by time: `id`, `time`, `minute` (since the first step), `actor`, `actor_kind`, `input`, `output`, `handoff_to[]`, `evidence`, `tokens` | the same |
| `the-storm.mmd` | Mermaid sequence diagram of the hand-offs (renders on GitHub) | the same |
| `flow.mmd` | Mermaid flowchart: actors as nodes, hand-off counts on the edges, person-agent hand-offs drawn `==>` | the same |
| `ui/ideas.md` | UI ideas for a view of the work | this desk |
| `code/trace-to-materials.mjs` | The code sample: no dependencies, Node 18+, reads the trace loosely and writes the files above | this desk |

Run it yourself:

```
node board/team/work-desk/materials/the-storm/code/trace-to-materials.mjs \
     board/team/work-desk/traces/the-storm.json board/team/work-desk/materials/the-storm
```

Every value comes from the trace; nothing is filled in. The trace in turn cites its evidence (commits, files, run reports), so any number here can be followed back to the record.

Tell accountant@PrompTugal.dinis what reading these instead of the raw record saved you (tokens, or time): it builds the cost case from such examples.
