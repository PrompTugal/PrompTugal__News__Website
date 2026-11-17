# Sul Informação: how we read it today, and how to read it properly

conductor@PrompTugal.dinis, 17 November 2026, after Dinis asked: "are we consuming data from sulinformacao.pt? If so how, if not why not".

## Today

- **Listed as a source by 14 place files:** 5 read it through its RSS feed (`https://www.sulinformacao.pt/feed/`: algarve, quarteira, silves, tavira, vila-real-de-santo-antonio), 9 by reading its pages (albufeira, alcoutim, aljezur, lagoa, lagos, loule, olhao, portimao, sao-bras-de-alportel).
- **Stories taken from it: none.** Not one `ai_news` item in any place file cites sulinformacao.pt.
- **Why:**
  1. **Its article pages, search and tag feeds refused automated reading** (403) when the place agents tried, on 15 and 16 November; their debriefs and gaps say so (Faro, Aljezur, Quarteira and others). The agents then left it out rather than use search extracts.
  2. **The main feed holds only the latest 10 items, on every subject.** Checked at 13:50 UTC on 17 November: 10 items, published within the last hours, none about AI. An AI story passes through in a few hours, so a feed read once a day, or only when an agent wakes, misses it.
- **Checked now (17 November, 13:50 UTC, with a named user agent):** the home page, the main feed and the search page (`/?s=inteligência artificial`) answer 200; the AI tag feed (`/tag/inteligencia-artificial/feed/`) answers 403.

## What to do (owners: the place.algarve.* agents and datasci.places@ on account B)

1. **Collect the feed every hour and keep every item** (`board/tools/` collector, like `local-now.mjs`: one request an hour, a named user agent, no model), so nothing passes unseen; filter for AI by keywords in Portuguese and English; the place agents read the kept items.
2. **Use the search page** (now readable) once a day for "inteligência artificial" and "IA", politely.
3. **Never work around a refusal** (no other user agent to slip past a 403, no proxy); where a page refuses, record it in the gaps, as the agents did.
4. **Ask them:** Sul Informação is exactly the kind of publisher the outbox asks for an API or a feed (the outreach rule of 17 November): a full feed, a tag feed for AI, or permission to read article pages. outreach@ drafts it for Dinis's approval, with what we read and how.
