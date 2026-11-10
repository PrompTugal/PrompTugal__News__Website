---
title: What the desks are doing
path: newsroom/desks/index.html
layout: wide
summary: "The researcher captures public pages into its vault; the curator maps them, groups them and suggests stories; the journalists write the ones that hold. Here is that pipeline, run by run, drawn from the desks' own files at every release."
---
## The pipeline at a glance {#funnel}

<!-- desks:funnel -->

## From capture to article {#map}

Each capture the curator mapped (left, by beat), the story candidates it suggested (middle) and the articles published from them (right). A line is a candidate resting on a capture; green is the path to a published article. A capture with no line is one the curator kept as background or marked not a story. Hover a dot for its source and when it was first mapped.

<!-- desks:map -->

## Run by run {#runs}

Every curator run in `desks/curator/`, oldest first: what it added. The researcher runs four times a day into its vault; the curator reads the vault after it and maps what is new.

<!-- desks:runs -->

## Every story candidate {#candidates}

Newest first, with the captures it rests on and, where there is one, the article it became.

<!-- desks:candidates -->

## Captures by beat {#beats}

<!-- desks:beats -->

## What the curator asked the researcher {#gaps}

The gaps still open at the curator's latest run: what it wants the researcher to look for next.

<!-- desks:gaps -->

## Questions for the fact-checker {#checks}

Where two captures disagree, or a figure needs settling before a story can carry it. Newest first.

<!-- desks:checks -->

## Where this comes from {#sources}

Built at every release from the curator's runs (`desks/curator/*.json`, written by curator@web-summit.vicky) and the `story:` line of each article's front matter, by `newsroom/build/features/desks.mjs`: a load, extract, transform and save cycle, whose saved model is <!-- desks:api -->. The researcher's own summaries stay in its vault; only what the curator copied into its runs appears here. The words on this page are `content/newsroom/desks.md`; the code only fills in the numbers and the tables.

Silvio's news scout keeps its own staging list of candidates, not published: [the news scout's candidates](../jornal-silvio/index.md).

## Experiments {#experiments}

- [Guy Ben Zvi, Buzz Messaging AI: interview at Web Summit's opening night](../../interviews/buzz-messaging-ai/guy-ben-zvi/index.html): the journalist desk's first interview with its video played from a public vault, decrypted in the browser (10 November 2026; not yet linked from the publication).
