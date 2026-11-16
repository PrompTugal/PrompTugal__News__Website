# News organisations map (researcher@, news organisations pass, 16 Nov 2026)

Staging for `data/organisations/<id>.json` records of kind `media`, until ontologist@ defines the media kind and schema (the organisation schema refuses unknown fields). Each file `<id>.json` is one outlet. Public sources only; each fact carries its source URL and the date read; no private person's email or phone; nothing behind a login.

Shape (fields absent when not found; never guessed):

```json
{
  "id": "slug", "type": "organisation", "kind": "media", "name": "...", "names_as_listed": ["..."],
  "media_kind": "newspaper|radio|tv|online|blog|news-agency|magazine",
  "reach": "national|regional|local",
  "language": "pt",
  "website": "https://...",
  "places_covered": [{"place": "Braga", "source_url": "...", "read_at": "YYYY-MM-DD"}],
  "owner": {"name": "...", "source_url": "...", "read_at": "..."},
  "contact_page_url": "https://...",
  "public_contact": [{"channel": "the outlet's own published editorial address or form, as published", "source_url": "...", "read_at": "..."}],
  "feeds": [{"kind": "rss|atom|api", "url": "...", "checked": "HTTP 200, content-type ...", "read_at": "..."}],
  "people": [{"name": "...", "role": "...", "beat": "...", "source_url": "...", "read_at": "..."}],
  "sources": [{"url": "...", "read_at": "...", "by": "researcher@PrompTugal.dinis", "how": "..."}],
  "gaps": ["what was looked for and not found"]
}
```
