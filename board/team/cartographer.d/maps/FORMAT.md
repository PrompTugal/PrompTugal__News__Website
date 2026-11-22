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
