---
title: "Spec: an image for every article, and every article as a graph"
by: designer@PrompTugal.dinis
for: dev@PrompTugal.dinis, ontologist@PrompTugal.dinis, journalist@PrompTugal.dinis; conductor@PrompTugal.dinis to route
written: 2026-11-06
issue: WS-177
decided_by: Dinis Cruz, 6 November 2026 ("for every single one, we always have a thumbnail, a bit of a bigger image, maybe a more flat image ... used in the main page"; "a graph version of the article", with "a summary and then the short introduction" and "bits and bobs from the graph")
---
# Spec: an image for every article, and every article as a graph

## 1. The images exist (designer@, done)

`design/infographics/out/` holds 60 PNGs: every published article in two styles (paper, ink) and three sizes (thumb 480 x 480, card 1200 x 630, banner 1600 x 560), named `<slug>--<style>--<size>.png`, listed in `design/infographics/out/index.json`. Every word on them comes from the article (`design/infographics/articles.json` keeps the quote behind each item). How they are made: `design/infographics/README.txt`. They are served as they are at `https://promptugal.news/design/infographics/out/...`.

## 2. Use them on the site (dev@)

| Where | Image | How |
|---|---|---|
| The front page's lead | `card` | above the lead's kicker, full width of the lead column |
| The front page's Latest list and the articles index | `thumb` | to the left of each item, 96 px square on a desktop, 72 px on a phone, the headline beside it |
| The top of the article page | `banner` | under the headline and standfirst, full width of the reading column |
| The social card | `card`, paper | `og:image` (absolute URL), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, `og:type` article, `twitter:card` summary_large_image; this closes item 1 of the brand audit for articles |

- **Both styles:** a `<picture>` with the ink image as `<source media="(prefers-color-scheme: dark)">` and paper as the `<img>`, so dark mode gets the dark image.
- **Every `<img>`:** `width` and `height` (no layout shift), `loading="lazy"` except the front page's lead, and `alt` = the article's short title and the figure or the first point (from `articles.json`), never empty.
- **An article with no image yet:** render as today, with no empty box. The build reads `index.json`; a missing slug means no image.
- **Markdown images:** the same work makes `![alt](src)` render as an `<img>` in `newsroom/build/lib/markdown.mjs` (today it renders as a link with a stray "!"), so the design reviews can show their screenshots.
- **Moving them:** if dev@ would rather serve them from `assets/articles/<slug>/`, copy them at build from `design/infographics/out/`; the designer keeps `out/` as the source.

## 3. Every article as a graph (ontologist@, then dev@)

Today an article is not a node: the graph has companies, events, people, organisations, topics and places, and the article pages carry no small graph. Dinis wants a graph version of each article.

- **ontologist@:** an `article` entity (`data/articles/` or derived from `content/articles/`), with an edge `mentions` (and its inverse) to each company, organisation, person, place, event and topic the article names, each edge with the article's sentence as its evidence. `design/infographics/articles.json` already lists 4 to 8 entities per article with their type and role, checked against the text: a starting point, to match against the graph's own ids (most are already entities: ApexBrasil, Técnico, OutSystems, the European Commission, Pavilion 4, ...).
- **dev@:** on every article page, in this order, as the newsroom's pages do:
  1. **In short** (the summary: every article already opens with it).
  2. **The introduction:** the first paragraph of "The story", as the standfirst.
  3. **From the graph:** the entities the article mentions, each linked to its page, grouped by type, with what the graph knows (a company's sessions, a person's organisation).
  4. **The article's graph:** the small prerendered graph the company pages have, the article at the centre, with "Open in the graph".
  5. The story, then the sources.
- **journalist@:** keep every article opening with "In short" and a first paragraph that works as an introduction (all ten do today).
- **The look of the article's graph:** the network layout of the infographics (the story at the centre; company a green square, organisation a ring, person a dot, place a red triangle, event a green diamond; the legend under it), so the image and the live graph read the same.

## 4. New articles

When an article is published, the designer adds its entry to `articles.json` (from the article, with quotes) and runs the generator at the next wake; until then the article shows without an image. Later this could be the journalist's step or the build's, once the facts can be read from the article's graph (section 3).

## Done looks like

The front page shows the lead's card and a thumbnail on each Latest item; each article page shows its banner, In short, the introduction, From the graph and the article's graph; each article's `og:image` is its card; the gate OK.
