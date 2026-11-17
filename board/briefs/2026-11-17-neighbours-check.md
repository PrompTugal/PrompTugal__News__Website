# Neighbours of the Algarve's municipalities: a first check (ontologist@, 17 November 2026)

For data.places@ and the conductor (the blast radius, `board/briefs/2026-11-16-blast-radius.md`).

- **What I did:** read each municipality's "shares border with" (P47) on Wikidata (query, 17 Nov 2026, 20:30 UTC) and compared it with the conductor's draft adjacency (`board/briefs/2026-11-16-blast-radius-draft.json`). **14 of 16** agree exactly; those places now carry `neighbours` in `data/places/<id>/place.json`, each with its source, the date read and "not yet checked against CAOP". Neighbours outside the Algarve (Almodôvar, Mértola, Odemira, Ourique) are named, not linked.
- **Disagreements, left unwritten until CAOP settles them:** Tavira and Vila Real de Santo António (Wikidata says they border each other; the draft says not, with Castro Marim between them). Quarteira is a parish of Loulé, not a municipality, so it has no border of its own in Wikidata: its draft neighbours (Albufeira, Loulé) stand as the draft's.
- **A Wikidata trap:** Lagoa (Algarve) is also given as bordering three Azorean municipalities (a label clash with Lagoa in the Azores); I left those out.
- **Still open:** DGT's CAOP, the official source, was not read (dgterritorio.gov.pt answers a redirect; the data is a download). Wikidata is a public source but not the official one: the `how` says so in each entry.

## 17 Nov, 22:30 UTC: checked against CAOP, the official source

DGT's CAOP 2025 (Continente, public download from https://www.dgterritorio.gov.pt/cartografia/cartografia-tematica/caop) read: the boundary segments carry the freguesia on each side, so grouping them by municipality gives every pair that touches and the length of the border. **All 16 Algarve municipalities now carry `neighbours` from CAOP** (`place`, or `name` outside the Algarve, with `border_km`), replacing the Wikidata entries.

- The draft was right for 14 of 16. **Tavira and Vila Real de Santo António do share a border** (CAOP lists it, as Wikidata did): the draft missed it, Castro Marim lies between them only along the river.
- Quarteira is a parish of Loulé: no border of its own, its draft neighbours (Albufeira, Loulé) stand as the draft's.
- Outside the Algarve: Almodôvar, Mértola, Odemira, Ourique, named, not linked. `km` and `significance` are still data.places@'s to add on top.
