---
title: "PrompTugal.news by place: Portugal, the Algarve and its towns (Dinis's brief, 14 November)"
given: 2026-11-14, about 18:10 to 18:20 UTC, Dinis's brief written by conductor@web-summit.dinis at his word; recorded here by conductor@PrompTugal.dinis on 15 November, after Dinis pointed to it ("it is on web-summit.sgit.ai and on the attached pdf")
source: https://web-summit.sgit.ai/people/dinis/local-sites/ (team site `people/dinis/local-sites/source.md`) and the signed article `content/articles/promptugal-by-place.md` (cce8a53cf); it answers Vicky's plan `people/vicky/local-sites/` (option A)
issue: WS-177
---
# PrompTugal.news by place

The full brief is at the source above; this is the short form for this repository's agents.

## The decisions

- **One publication, three levels of place:** Portugal (promptugal.news, which also carries Europe and the world), the Algarve, and the towns.
- **The first wave is all 17 places at once,** not Loulé first: the 16 municipalities plus Quarteira. They are Faro, Loulé, Quarteira, Silves, Tavira, Vila Real de Santo António, Portimão, Lagos, Olhão, Albufeira, Lagoa, Monchique, Aljezur, Vila do Bispo, Castro Marim, Alcoutim and São Brás de Alportel.
- **Each site is a lens on one shared graph.** A story is written once and has one home; every site it concerns lists it and never copies it. Closeness to the site's place sets where a story shows and how big.
- **The north star:**
  1. The brand is always PrompTugal.news ("PrompTugal.news · Faro").
  2. Every story passes the PrompTugal test: it is about AI, directly or within two or three steps in the graph, with the path written down.
  3. Place decides where a story shows; AI decides whether it is ours at all.
  4. Every site opens with its two-line mandate.
- **News flows down and up.** National and international AI news is picked for each place by what it means there. Local sources are captured at town level and rise when they matter.
- **Every town site shows:** its mandate; its centre of gravity (found from sources, never invented); local AI news, big; wider AI news, smaller; events; local companies (public facts, sourced and dated); factual extras such as IPMA weather; and its gaps.
- **Each town looks like itself** inside the unchanged PrompTugal.news frame. **For fun:** a clearly labelled toggle rewrites the page in an exaggerated local Algarvio voice, with the facts unchanged.
- **How it is built:**
  - everything in this repository, with one build;
  - making a place is one entry in a list (name, parent, mandate, sources).
- **Builders:**
  - dev@ (the build);
  - ontologist@ (the places and the graph);
  - dev.portugal@ (the Algarve, with Algarve Evolution first, now named publicly as the partner);
  - researcher@ (sources and centres of gravity);
  - designer@ (each town's look);
  - correspondent@ (what leads);
  - journalist@ and Vicky's journalist-portugal (the stories).
- **Not now:** DNS, separate repositories, any new brand, and a dedicated local desk (option C is Vicky's call).

## One point to settle: addresses

- The PDF brief (18:10 UTC) says subdomains from the start (`algarve.promptugal.news`, `<town>.promptugal.news`), never a `/town` path, with DNS not set up yet.
- The signed article and the team site's page, as rewritten at 18:20 UTC, say paths to start (`promptugal.news/algarve/` and `promptugal.news/algarve/<town>/`), with subdomains once DNS is automated.
- The later text reads as the decision. Asked of Dinis on 15 November; the build is the same either way (one list, so a move changes the address, not the build).

## Where it stands (15 November)

- **Nothing is built in this repository yet.** /algarve/ answers 404. The PrompTugal builders have been off since the hand brake of 12 November, and their tasks were not re-enabled after the hold was lifted.
- **The graph has 5 of the 17 places** (`data/places/`: faro, tavira, portimao, lagos, albufeira, plus algarve as a region). 12 are missing.
- **Vicky's desks already apply the PrompTugal test** (team site `people/vicky/decisions.md`, standing answer 81). S65 (Loulé) waits for a `region` and `town` tag once the place pages exist (standing answer 78).
