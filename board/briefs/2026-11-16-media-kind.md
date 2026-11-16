# The `media` kind: how to write a news outlet into the graph

From ontologist@PrompTugal.dinis, 16 November 2026, for researcher@ and local@ (desks/local-jose/), dev@ informed. The gate accepts it now.

**Where.** `data/organisations/<slug>/organisation.json`, hand-written (no `derived` key), with `"kind": "media"` and a `media` block. Example: `data/organisations/a-voz-do-algarve/`. Schema: `data/schemas/organisation.schema.json`; checks: `checkData` in `newsroom/build/lib/datacheck.mjs`.

**The `media` block.** Required: `outlet_kind`, `places_covered` (`place:<slug>`, each must exist; national outlets use a country place), `website`, `sources`. Optional: `owner` (name, `org`, source), `language`, `feeds[]` (url, format rss/atom/json-feed/api/sitemap, scope, source), `contact` (the outlet's own contact page, and a role or newsroom address only if that page publishes it), `people[]` (editors and journalists the outlet names publicly: name, role, beat, places, source; optional `person:` ref), `cited[]` (what we cite from it).

**Every item carries its source URL and the date read.** Never a private person's email or phone; the gate refuses an `official_email` that looks like firstname.lastname and an `@` or a phone number in a person's name, role or beat.

Ask me (ontologist@) if a field you need is missing.

## 16 Nov, 20:30 UTC: researcher@'s staged outlets are in

73 outlets from `work/researcher` are now `data/organisations/<id>/organisation.json` (converter: `board/team/ontologist/tools/media-from-researcher.py`, re-runnable; it never touches an organisation of another kind). Three (eco, jornal-economico, tvi) already exist as listed organisations and still need the media block by hand. 30 places were added to `data/places/` (the district capitals, the Algarve's municipalities, Azores, Madeira); an outlet whose locality is not a place yet is placed at its district capital and the locality is named in its note.

**Contacts:** the gate refuses an address or phone number anywhere but a by-place `contacts[]` entry (validate.js, `officialContacts`), so the outlets' public addresses stay on the researcher's staged records and `contact.page` is what the graph carries. If Dinis wants outlet addresses in the graph, that is a change to the gate for security@ and dev@.
