---
title: "The Wardley maps site: who searches for it, the first five minutes, and what to test"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-22
for: cartographer.d (brief board/team/cartographer.d/briefs/2026-11-22-wardley-maps-site.md, read 22 Nov)
status: hypotheses from Dinis's words in the brief and from the cold-reader method; nobody who searches for Wardley maps has been asked
---
# The Wardley maps site, from the reader's side

Dinis's need, in his words (the brief, 22 Nov): "I still don't have a good website to find. Every time I Google, I don't get a good answer, and I struggle to explain." So the first user is **Dinis, explaining**; the second is **the person who searches**. The brief says the community is "almost a 100% correlation" with the customers, so the searcher is also the person we most want to reach.

## 1. The needs (in needs.json shape; all hypotheses unless Dinis said it)

They are in `needs.json` with area `wardley-maps`. In words:

| Id | User | Need (their terms) | Basis |
|---|---|---|---|
| n-wm-explain-to-others | dinis | Send someone one page that makes them understand a Wardley map, so I stop struggling to explain it. | Dinis's words (not a hypothesis) |
| n-wm-what-is-it | customer: a founder, CISO or investor who has heard the name | Know in a few minutes what it is and whether it is for me, in plain words, before any jargon. | hypothesis |
| n-wm-see-one-built | customer: the same | Watch one real map being built, step by step, on something I know, not an abstract. | hypothesis |
| n-wm-try-my-own | customer: the same | Make a map of my own situation quickly, with no install and no lesson, and keep it as a file. | hypothesis; the brief proposes an editor |
| n-wm-trust | customer: the same | See what is sourced, what is a reading, and who made it, so I know what to believe. | hypothesis; the format already marks positions as readings |
| n-wm-find-like-mine | customer: the same | Find an example near my own sector, with its source and date. | hypothesis; the brief proposes a gallery |
| n-wm-see-history | dinis, customer | See how a map changed over time ("every move is a play"). | Dinis's words |
| n-wm-search-spellings | customer: someone who types "worldly maps" or another misspelling | Land on the right page anyway. | Dinis's own voice-typed spelling in the brief |

## 2. A good first five minutes

**What the reader must understand first, and in what order.** One idea per screen, the picture before the word, and a word only after the picture that needs it.

1. **Minute 0 to 1: what it is for, then the answer.** One sentence: a map shows what you depend on and how fast each part is changing, so you can see where to act. Straight away, one finished map of a thing everyone knows, so they see the answer before the method. (The example must be one whose licence allows reuse; rights@ decides which.)
2. **Minute 1 to 2: start with the user.** The first step of the technique is the same as the Sherpa's: who needs this, and what do they need? One user, one need, drawn at the top.
3. **Minute 2 to 3: what the need depends on.** Draw the chain down from the need, and say the vertical axis in words: how visible it is to the user. The reader builds it, a plank at a time.
4. **Minute 3 to 4: how things change, left to right.** This is the hard idea, so it comes after the chain. Place the same parts from new and rare to everyday, and show one part drifting right over time.
5. **Minute 4 to 5: a decision it changes, and the next step.** One real choice the map makes visible (build or buy, where the gap is), then two doors: edit this map yourself, or watch it change over time.

**My changes to the brief's order.** The brief puts climate and doctrine before the live map. For a cold reader I would move them out of the first five minutes: they are the second lesson. And I would put the live map at minute 3, not later, because building is the quickest way to feel it.

**An idea for studio.d, not a design:** the evolution axis is a mountain path. A crowd of walkers going from genesis to commodity is the Sherpa's journey format, and it may be the story that makes "everything moves right" memorable.

## 3. What to test with synthetic readers (once there is a first page)

Synthetic readers are invented and are never real people; their reading is not evidence about real people.

| Reader | Task | What I record |
|---|---|---|
| A founder, on a phone | read the page for five minutes, then say in two sentences what a Wardley map is | the sentence they give; the word where they stopped |
| A CISO, on a desktop | after the page, say what the two axes mean | whether visibility and evolution are the right way round |
| An investor | find where the positions come from, and who made them | whether they can tell a source from a reading |
| A practitioner who already knows Wardley maps | read for errors and for anything patronising | what the page gets wrong or over-explains |
| Someone who types "worldly maps" | search, land, and say whether they are in the right place | whether the misspelling finds the page |
| Anyone | find an example near their own sector | time to a relevant example, or the dead end |

Measure on a phone in portrait and a desktop: time to the first map, where they stop reading, which word loses them, how many screens before they can do something. **A test with real people comes after:** a handful of practitioners and a few leads, through Dinis. The first honest result is whether a stranger can explain it back after five minutes.

## Sources
The brief (cartographer.d, 22 Nov, read at 16:40 UTC); Dinis's words as quoted in it; the Sherpa's cold-reader method (board/team/sherpa/ROLE.md). No claim here about what the community or the tools are: the research is the researcher's.
