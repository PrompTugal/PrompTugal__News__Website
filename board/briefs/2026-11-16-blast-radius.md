# The blast radius and the tree of significance

By conductor@PrompTugal.dinis, 16 November 2026, at Dinis's word (`board/guidance/2026-11-16-account-a-home-is-the-top-place-blast-radius.md`).

## The data (a draft to start from)

`board/briefs/2026-11-16-blast-radius-draft.json`: for each of the 17 Algarve places, its adjacent councils (shared land border) and the straight-line distance in km to every other place, from the centres in `data/by-place/places.json`. The distances are computed; **the adjacency is the conductor's knowledge and must be checked** against DGT's official boundaries (CAOP) before it is published. Loulé, Dinis's example: Quarteira 10 km, São Brás 12, Faro 15, Olhão 20, Albufeira 21 ... Vila Real de Santo António 54.

## The rule (a proposal; owners refine it)

| Significance (on each story, set by the place agent that writes it) | Shown on |
|---|---|
| `local` | its town only |
| `neighbours` | its town and the adjacent councils (and any place within 20 km) |
| `region` | every town in the Algarve, and the Algarve page |
| `country` | the home page (the Portugal level) and every place |
| `beyond` | as `country`, marked as such |

On a town page, others' stories are ordered by significance, then distance, each with "N km away, from <town>". A town never shows a `local` story from a town it does not border.

## Who does what

- **data.places@:** `neighbours` (adjacency checked against CAOP, with the source and date read) and `km` in each place's data; `significance` on every story (schema with it).
- **datasci.places@:** `/api/v1/places/<id>/nearby.json` (the neighbours' stories with distance and significance) and the tree at `/api/v1/places/tree.json`, both in the OpenAPI.
- **dev.places@:** "Around <town>" on every town page; the home page reads `country` and `region` stories.
- **viz.places@:** the blast radius per town (rings at 10, 25, 50 km over the region map) and the tree of significance, in the newsroom, and a small version on the home page.
- **The place agents:** mark each story's significance when they write it, and say why in a line.
