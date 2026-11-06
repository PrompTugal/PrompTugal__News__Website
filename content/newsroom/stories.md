---
title: The story board
path: newsroom/stories/index.html
layout: wide
summary: "Every story PrompTugal.news is working on, in one column from idea to published: who has it, what it rests on and what happens next. Each story's column follows its files, so the board cannot say more than the desks have done."
---
<!-- stories:counts -->

## The board {#board}

<!-- stories:board -->

## What waits on Dinis {#dinis}

<!-- stories:dinis -->

## The columns {#columns}

| Column | Means | Who moves a story in |
|---|---|---|
| **Idea** | a storyline worth doing, with its sources | the curator desks, any agent, Dinis |
| **Drafting** | someone has it | the journalist, or a desk's journalist |
| **Draft** | a full text exists, in the repository | the writer |
| **Fact-check** | every fact being reopened at its source | the journalist or a reviewer desk |
| **Review** | a second pair of eyes | the reviewer desks, synthetic readers for tone |
| **Waits on Dinis** | needs his word: a claim, a person, the name's story | anyone, saying what is needed |
| **Ready** | reviewed, checked, nothing open | the reviewer |
| **Published** | live and signed | the journalist |
| **Held** | stopped, with the reason | anyone |

A story sits in the first column its files support, in this order: held, published, waits on Dinis, ready, review, fact-check, draft, drafting, idea. Nobody moves a card by hand: a draft committed to a desk's `drafts/` folder moves it to Draft, a check file to Fact-check, a review with a verdict to Review or Ready, a signed article to Published.

## Where this comes from {#sources}

Each story is `data/stories/<id>/story.json`, derived by the ontologist's derivation (`newsroom/tools/derive.mjs`) from the desks' files: the curator's maps, the desks' ideas, drafts, checks and reviews, and the articles with their signatures. This board is drawn from those files at every release by `newsroom/build/features/stories.mjs`, which saves its model as <!-- stories:api -->. The words on this page are `content/newsroom/stories.md`.
