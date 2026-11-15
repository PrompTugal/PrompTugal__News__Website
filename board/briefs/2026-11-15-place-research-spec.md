---
title: "The place research spec: the fields of data/by-place/<id>.json and how to fill them"
written: 2026-11-15 by conductor@PrompTugal.dinis
---
# The place research spec

PrompTugal.news (https://promptugal.news) is an independent publication about AI and technology in Portugal. It is building one page per Algarve place at promptugal.news/algarve/<town>/. Each page is a lens: local AI news big, wider AI news smaller. You research your assigned places and write ONE JSON file per place.

## The PrompTugal test (decides what counts)
A story is ours only if it is about AI directly, or within two or three steps (examples: a council's new data centre, and the AI workloads it will run; a startup event, and its AI founders; a university AI research group; a council using AI for services; a hotel group automating with AI; a company shipping an AI product). Write the path in plain words and the number of steps (0 = directly AI). No path to AI: leave it out, however local or big.

## Write exactly this file: data/by-place/<id>.json
```json
{
  "id": "<id, lowercase ascii, hyphens, e.g. vila-real-de-santo-antonio>",
  "name": "<proper name with accents>",
  "kind": "municipality",            // "city" for Quarteira, "region" for the Algarve file
  "parent": "algarve",               // "loule" for Quarteira, "portugal" for the Algarve file
  "status": "researching",           // then "live"
  "updated": "YYYY-MM-DD",
  "by": "place.<id>@PrompTugal.dinis",
  "mandate": "PrompTugal.news <Name>: AI and technology in <Name>, <its centre of gravity in a few words>, and what reaches <Name> from the Algarve, Portugal and the world. Independent; every fact sourced.",
  "gravity": { "text": "2 to 3 sentences: what this place is about economically and institutionally, as the sources show it (never invented).", "sources": [ { "title": "...", "url": "...", "read_on": "2026-11-15" } ] },
  "look": { "accent": "#RRGGBB", "landmark": "one landmark the town is known for", "motif": "a few words for its feel" },
  "ai_news": [ { "title": "our own short headline", "summary": "one or two sentences in our own words", "date": "YYYY-MM-DD (the source's publication date)", "publisher": "...", "url": "...", "read_on": "2026-11-15", "ai_path": "plain-words path to AI", "steps": 1 } ],
  "sources": [ { "name": "...", "url": "...", "kind": "council|press|university|business|events|other", "feed": "RSS/Atom URL if you found one, else null" } ],
  "events": [ { "title": "...", "date": "YYYY-MM-DD or a range as text", "url": "...", "read_on": "2026-11-15", "ai_path": "path, or null if it is a general tech/business event" } ],
  "ai_map": [ { "name": "...", "type": "company|startup|organisation|institution|community|public body|investor", "url": "...", "what": "one line of public fact", "source_url": "...", "read_on": "2026-11-15", "ai_path": "path to AI", "steps": 1 } ],
  "extras": [ { "label": "...", "value": "...", "source_url": "...", "read_on": "..." } ],
  "identity": { "key_id": "site.<id>-promptugal", "signed_by": "place.<id>@PrompTugal.dinis" },
  "gaps": [ "what we found no source, feed or AI news for (a town with no AI news is a finding; say which sources we should look for)" ],
  "voice": { "lede": "one playful line", "mandate": "the mandate rewritten", "gravity": "the gravity text rewritten", "gaps_intro": "one playful line before the gaps" }
}
```
- `ai_news`: aim for 3 to 6 real items, most recent first, ideally from 2025 and 2026. Fewer is fine; never pad. Regional press is good: Sul Informação, barlavento, Postal do Algarve, Jornal do Algarve, Observador do Algarve, RTP/Lusa, the council's own news, Universidade do Algarve, CCDR Algarve, Algarve Evolution, NERA, AHETA, Turismo do Algarve.
- `sources`: the council's site and news page, the regional press, the university, business associations, event listings: whatever feeds this place. 4 to 8.
- `ai_map`: EVERY AI-related company, startup, institution, community, public body and investor you can find in the place, each with its source (Dinis: map all AI-related companies in all regions; Algarve Evolution is one of them). Aim for completeness over the night.
- `look.accent`: a colour that evokes the place (Tavira's rooftops, Lagos's cliffs, Monchique's hills) AND has at least 4.5:1 contrast against white (dark enough for text).
- `voice`: an exaggerated, affectionate Algarvio voice (regional expressions, local references; Tavira should not sound like Faro). It makes fun of the place, never of its people. It is clearly playful. Keep facts identical: no new claims in the voice. Mostly English with Algarvio/Portuguese words sprinkled in.

## Rules (strict)
- Public sources only: no login, no bot challenge, no paywall. Do NOT read websummit.com, luma.com, lu.ma, meetup.com or eventbrite.* at all.
- Only facts you saw on a page you opened, with its URL. Read date is 2026-11-15. If a council site will not load, try its news page or search results, and say so in gaps.
- Write summaries in your own words; quote at most a few words.
- No contact details (no emails, phone numbers, addresses of people). Do not name private individuals; name organisations, and public officials only by role if needed.
- English prose, plain words, NO em-dashes and no en-dashes in prose (use commas, colons or full stops). No semicolons.
- Valid JSON (no comments in the file). Keep the `$schema` line: "../schemas/by-place.schema.json".
