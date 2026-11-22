---
title: "The Sherpa's journeys: a mountain, a crowd and a website"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-22
status: approved by Dinis as an experiment (22 Nov): "a path, a crowd on the side behind it. I like that ... let's experiment"; the story is mine, the drawing is the Studio's
---
# The Sherpa's journeys

**Dinis (22 Nov, in my session):** embrace the Sherpa and the mountains; tell the users' journeys as animated stories, with some fun: users get stuck, fall into a ravine, succeed, collaborate; a path on the left and the website on the right; "a bit of a Lemmings approach", lots of users; leverage the animation primitives and characters we already have.

**The rule that stands (Studio, 22 Nov):** the requester only tells the story; it writes one JSON file and learns no code. So I write the journeys as storyboards (`*.storyboard.json`, format `studio-storyboard/0`), and studio.d draws them with the characters it has. I do not write pages or animations myself. The first story is `feedback-door.storyboard.json`.

## The idea in one picture

```
 THE PATH (left)                               THE WEBSITE (right)
 base camp -> trail -> fork -> fog -> ravine   what the walker meets at this stop
      o o o o o o   (a crowd of walkers)       the page, the missing control, the new one
      the Sherpa ties a rope / builds a bridge  the fix appears on the site
```

One walker is a user with a need (the four kinds: Dinis, another agent, a customer, a party we wrote to). The crowd is the same journey walked by many. The mountain is the need; the summit is "the need met".

## A proposed `journey` visual (for studio.storyboard to accept, change or refuse)

`{ "kind": "journey", "stop": "<terrain>", "walkers": {"start": n, "here": n, "fell": n, "through": n, "basis": "illustrative|measured", "source": "<source id when measured>"}, "site": {"shows": "<one line of what the page shows here>", "image": "<optional url>"}, "sherpa": "<what the Sherpa does here, or empty>", "note": "<anything else>" }`

Terrain words the story may use: `base-camp`, `trail`, `fork`, `fog` (a user cannot tell where to go), `cliff` (a step too high), `ravine` (a missing thing: they fall in), `bridge` (a fix), `rope` (the Sherpa's help, or a teammate's), `hut` (a place to rest and be told they were heard), `summit` (need met).

## Rules so the fun does not mislead

1. **Crowds are illustrative unless measured.** Every count says its basis. A made-up crowd is labelled "illustrative" on the screen. A measured crowd names its source (for example the anonymous signal lane's counts, which carry no identity) and its date.
2. **No real person.** Walkers are synthetic characters, labelled as such, and are never drawn as a named individual.
3. **A fall is a finding, not a mock.** Each ravine matches a ranked finding in the journey files, so the joke always points at something fixable.
4. **The ending shows the fix and who made it.** A bridge is a change an owner shipped; the story names the owner role.
5. **Not a test with real users.** Say it in the last beat, in words.

## What I ask of studio.d
- Which characters and animation primitives exist and are readable (the presenters library was not readable from here), and which can walk, fall, wave and carry a rope.
- Whether the `journey` visual fits the player, or should be an SVG scene you draw per story.
- One review round on each story with me, as with the last two.

## Next stories (one per ranked journey)
1. **The visitor with something to say** (drawn by studio.d; Sovereign Website, the first customer).
1b. **The stand and the chasm** (`stand-chasm.storyboard.json`, from Dinis's own account of Web Summit): why impressed visitors did not buy, and the bridge he proposed.
2. **Dinis at the hub:** a cliff of equal cards, fog over "what changed", a lantern for "waiting on you".
3. **Dinis deciding:** nine links up nine ravines to one page, and the way back.
4. **A party we wrote to:** reply without a private contact.
