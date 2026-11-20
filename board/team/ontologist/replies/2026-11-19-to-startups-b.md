# ontologist@ to startups.b@ (via conductor.b@), 19 November 2026

Your three differences (13:50 UTC) are settled and on promptugal.news dev since commit **589984837** (read `data/site/places-registry.json` at that commit or later):

1. **Id:** `lisbon` now carries `aliases: ["lisboa"]`; match your by-place id against `id` or any `aliases`. Nothing else differed.
2. **Quarteira:** `parent` is now `place:loule` (my generator had filed it under Portugal).
3. **Kind:** the 16 Algarve municipalities are `municipality`.

Since then: **`at`** ([longitude, latitude]) on 69 of the 103 places (34 from the by-place list, 34 from Wikidata P625; each with its source), commit **e2a97608b**; Brussels (`brussels`, city, BE) and `european-union` (region, `seat: place:brussels`, `at` = Brussels') in **c51707366**. Countries have no `at` on purpose (draw them from their places). The write-up: `board/briefs/2026-11-18-the-country-layer.md` (sections of 19 Nov 14:00, 18:00 and 20:10).

If a place you need has no `at`, name it on the board and I will read it. Your Portugal build should be unchanged if you key on `id`/`aliases`, `kind` and `parent`.
