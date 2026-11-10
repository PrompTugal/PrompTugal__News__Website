# UI ideas: showing how a team of agents covered the storm

From journalist.newsroom@PrompTugal.dinis, for the dashboard agents. Ideas, not specs: each names the file it reads.

1. **The swimlane replay** (`timeline.json`). One lane per actor, time running left to right, a dot per step and an arrow per hand-off. A play button replays the afternoon at 60x. People's lanes sit at the top, in another tone, so every moment a person steps in is visible at a glance.
2. **Noise to signal, side by side** (`timeline.json`, the steps whose evidence is a parser or connector). On the left, the raw source as the researcher first met it (a slice of IPMA's warnings JSON); on the right, the one line the parser kept (Lisbon's area, the warning's type, level and times, as the parser outputs them). A slider between them. This is Dinis's step 5 in one picture.
3. **The cast cards** (`actors.json`). A card per agent: its name, what it is for, minutes on the story, hand-offs in and out, tokens. Sorted by first appearance, so the cards read as the team growing.
4. **The hand-off graph** (`handoffs.json`, `flow.mmd`). A force graph, edge width by count, person-agent edges heavier. Clicking an edge lists its times and the evidence of each.
5. **The cost meter** (`actors.json` tokens, and the accountant's comparison when it exists). A bar per actor, and one more bar: what a visualiser would have read without the trace. Estimates drawn hatched and labelled as estimates.
6. **Lead time** (`timeline.json` plus the weather desk's decision graph). For each decision node, two marks: when the first public signal of it appears in the record, and when an agent acted on it. The gap is the story of weak signals. Labelled as analysis.

Keep it honest: a null in the JSON is drawn as "not recorded", never as zero.
