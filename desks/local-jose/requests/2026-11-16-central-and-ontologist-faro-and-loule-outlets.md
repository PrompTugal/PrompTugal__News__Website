---
title: "For place.algarve.central@ and ontologist@PrompTugal.dinis: Faro's and Loulé's outlets, read and ready"
date: 2026-11-16
author: local@PrompTugal.jose, for Jose Bota
for: place.algarve.central@PrompTugal.dinis; ontologist@PrompTugal.dinis; researcher@PrompTugal.dinis
status: open
---
# Faro and Loulé: outlets read on 16 November 2026

The files: `desks/local-jose/towns/faro.json` and `desks/local-jose/towns/loule.json`. Each outlet under `outlets[]` is in the fields of the `media` kind, each fact with its source URL and the time read. The fields this desk added for its own use (`in_place_file`, `in_organisations`, `feed_checked_on`, `unreachable`, the `_note` fields, `reading_stopped`) are not in the schema and are dropped on merge. The towns are **not done**: ERC's register could not be searched from this environment, so the lists may be incomplete.

## For ontologist@: ready to merge into `data/organisations/`

| Proposed id | Outlet | What was read |
|---|---|---|
| `barlavento` | Barlavento, a regional newspaper | the home page, the Faro and Loulé sections, the Ficha Técnica (owner, ERC number, director, newsroom), the about page, robots.txt; four feeds: the main RSS, an RSS per town section, and the site's REST API |
| `algarve-primeiro` | Algarve Primeiro, a daily regional site | the home page, the Ficha Técnica (owner and director, ERC number), the Estatuto Editorial, the Contactos page, robots.txt; **no RSS** (three usual paths answered 404), a sitemap only |

**Not ready:** Sul Informação. Its main RSS was fetched once, then its robots.txt was read: it refuses Anthropic's agents by name and signals `ai-train=no, use=reference`; its town feeds and API answer with a bot challenge. This desk stopped reading it there. What is in the town files is only what was read before that. Whether and how the site may read its feed is asked of Dinis.

**A field asked:** none is missing. One choice is left to you: Algarve Primeiro's `outlet_kind` (`online` here; its own page says "generalista regional").

**For your own record `a-voz-do-algarve`**, facts read today from its Ficha Técnica (`https://www.avozdoalgarve.pt/p/ficha-tecnica/3`, 16 November 2026, 20:12 UTC), which your note says are still to be read in. This desk has not touched the record:
- owner and publisher: Goldenhouse – Med. Imob. Edição e Comércio de Jornais, Lda.;
- Diretora: Nathalie Dias, also named under Redação with a journalist's card number;
- newsroom in Loulé, so `place:loule` could join `places_covered`; founded 13 September 2012; daily;
- the page lists about twenty collaborators by name; this desk did not copy them;
- its feed answered with 25 items; its Contactos page has a message form.

## For place.algarve.central@: what the town files could gain

- **Faro** (`data/by-place/faro.json`, `sources[]`): Barlavento's Faro section has a feed of its own, `https://www.barlavento.pt/algarve/faro/feed/` (the file gives the whole paper's feed). Algarve Primeiro and A Voz do Algarve cover Faro and are not in the file.
- **Loulé** (`data/by-place/loule.json`): the four press sources have `feed: null`. Read today: Barlavento's Loulé section feed `https://www.barlavento.pt/algarve/loule/feed/`; Algarve Primeiro has no RSS; Sul Informação's main feed exists (see above before using it); Regiao Sul sits behind a bot challenge and was not read. A Voz do Algarve, whose newsroom is in Loulé, is not in the file.
- The SGit Newsroom entry under Faro's press sources is the team's own newsroom, not a Faro outlet.

## For researcher@

Faro is also a district capital. This desk read its outlets as an Algarve town; nothing of yours for Faro was on `dev` at 20:10 UTC. Take from the town file what is useful; say if Faro's outlets should be yours and this desk leaves them.

Nothing outside `desks/local-jose/` is changed by this request.
