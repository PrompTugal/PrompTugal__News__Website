# Every story has an address: what we have, and what to adapt

By conductor@PrompTugal.dinis, 16 November 2026, about 04:20 UTC. Dinis asked (in the conductor's session) to check https://newsroom.sgit.ai/articles/every-story-has-an-address.html ("you have already implemented quite a number of them ... see what you can adapt"). Read from its markdown twin at 04:15 UTC. The article is Dinis's own design proposal; its mockups are images, its content the place files of 16 November.

## Already done or under way

| Idea in the article | Here |
|---|---|
| One agent and one signed file per place, every story with publisher, date and date read | live: 19 places, `data/by-place/<id>.json` + `.sig` |
| The region as a map before a list, each town a dot sized by its file | live: `/algarve/` (by-place.mjs); now also the national map on the home page |
| Gaps are journalism | live: each place's `gaps` |
| A town edition with its own voice | live: `voice` and the Algarvio toggle |
| Now, then depth: a live strip | under way: `/api/v1/places/<id>/now.json` (IPMA, Faro airport; datasci.places@) |
| Neighbours, and a thin town leaning on them | under way: the blast radius (`/api/v1/places/<id>/nearby.json`, `tree.json`; `board/briefs/2026-11-16-blast-radius.md`) |
| The front page assembled from the places, with no national desk | live since 04:30: the home page leads with place stories, the map, the towns; national and international below |
| Connections between places found by the detective | data: `data/by-place/connections.json` (16) |

## To adapt (routed)

1. **An address above every headline, and the climb beneath it.** Each place article gets `address` (parish, town, region) in its front matter and a `climb`: the sourced steps from the address up (pilot towns, region, country), each with its source. Shown above the headline on the home page and article pages ("Almancil, Loulé · the Algarve"). **journalist@ and the place agents** (front matter), **dev.places@** (render).
2. **The story page's rail:** the address and why it is filed there, how it climbed, the sources with dates read, the entities it links to, the signer and key. **dev.places@**.
3. **Distance to the beat:** each item says how many steps it is from its subject. With the blast radius: "Faro, 15 km" for neighbours, "2 steps" for a climb. **datasci.places@** (in `nearby.json`), **dev.places@**.
4. **Altitude before sections:** navigation up and down (parish, town, region, country, Europe) before topics: the breadcrumb becomes a real altitude bar on every place and story page. **dev.places@**, **designer.places@**.
5. **The locality layer:** parishes inside municipalities, municipalities inside regions, and neighbours, from DGT's official boundaries (CAOP), not by hand; a story filed in a parish shows in every edition above it. **data.places@** (it is also the adjacency check of the blast radius).
6. **The region map's borders and arcs:** grey shared borders and red arcs for the sourced connections (`connections.json`). **viz.places@**.
7. **The proof layer as a page:** the chain of custody from a local source to the front page (capture with date read, the place agent's signed file, the data agents' index and captures, the detective's links, the pages built from them). **viz.places@** with **data.places@**.
8. **An organisation page** per organisation on the AI maps, with every place and story it appears in. **data.places@** (entities), **dev.places@** (pages).

## For Dinis (the name and the line)

The article's pick: keep the PrompTugal.news masthead and name the method, "ground-up news", with the line **"Every story has an address"**. That line is 26 characters: it also fits the App Store subtitle (30 at most). The brand and positioning are Dinis's: on sherpa@'s positioning page as an option.
