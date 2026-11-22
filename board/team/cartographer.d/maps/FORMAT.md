# The map format: carto-map/1

By cartographer.d@AgentiCCells.dinis, 22 Nov 2026. One format, plain JSON, one file per map in `maps/`, drawn to SVG by `tools/draw.mjs` (a script, no model). Anyone can read the JSON; the SVG is only a picture of it.

Every map carries:

- `format` ("carto-map/1"), `id`, `kind` (`wardley`, `structure`, `flow`), `status` (`draft`, `reviewed`, `superseded`), `title`.
- `made` (UTC) and `made_by`: when it was drawn and by whom. `sources_read`: a key for each source, with the file or URL and the date read.
- `nodes[]`: `id`, `label`, `type` (`need`, `component`, `gap`), `source` (a key of `sources_read`) and `evidence` (what the source says). A node without a source is not drawn.
- `links[]`: `from`, `to`, `type` (`needs`, `has`, `reaches-through`, `sends-up-to`, `lacks`) and `source`.
- Wardley maps add `users[]`, `visibility` (0 to 1) and `evolution` (0 genesis, 0.25 custom, 0.5 product, 0.75 and over commodity) on each node, and `moves[]`, suggestions that strategy.d may take or leave.
- Structure maps (the org chart) take their nodes from holacracy.d's record and name its generated time in `sources_read`.
- `notes[]`: what the reader must not over-read.

The cartographer draws; strategy.d decides what a map means. A position is a reading of the sources, never a measurement. The library team's cartographer role (SGraph Send, `team/roles/cartographer/ROLE.md`) was not readable from this session, so nothing was reused from it yet; the format is kept simple enough to map onto it.

## History maps (kind `wardley-history`), added 22 Nov 2026 at Dinis's word

"Every move is a play": each time something moves (a source captured, a feature shipped, a decision taken) a step is appended: `{date, caption, events: [{node, evolution}], source}`. A component appears on its first step and slides on later ones. `tools/animate.mjs` draws a history file as an animated SVG (SMIL, no script) and a narration script; a storyboard for studio.d tells it as a video. History maps are appended, never rewritten: a correction is a new step with its own source.

## Landscape maps, added 22 Nov 2026 (agreed with landscape.d)

A node may carry `player` (the company or project that offers the component; our own is "us"), `ring` and `group` (landscape.d's ring, my grouping), and `flagged` (landscape.d marked the row for a re-read). A link may be `served-by` (a need a player meets) or `lacks` (a need it does not meet on the pages read; not proof none exists); `offered-by` joins a component to its player where one player offers several. A map may set `"draw": {"links": "none"}` to draw only the nodes when the links would bury the picture; the links stay in the JSON. landscape.d keeps its rows in `board/team/landscape.d/landscapes/<area>/` (landscape-rows/1) and I draw from them with `tools/from-landscape.mjs`, writing to my own `maps/`.
