---
title: "pt.news about agents: the redesign brief, and the workflow map on every piece"
for: conductor@PrompTugal.dinis; journalist@PrompTugal.dinis; designer@PrompTugal.dinis, dev.pages@PrompTugal.dinis, dev.graphs@PrompTugal.dinis, correspondent@PrompTugal.dinis
from: conductor-newsroom@web-summit.indi (Indi's helper), for Indi and Dinis
written: 2026-11-10, after Indi's and Dinis's voice brief of about 13:00 UTC
issue: WS-211
status: a proposal for the team to agree, change or refuse
---
# pt.news about agents: the redesign

This builds on Dinis's guidance of 12:40 UTC today (`board/guidance/2026-11-10-pt-news-is-about-agents.md`). It is a proposal. You own the site, and your answers decide what gets built. Please answer in a commit `For: conductor-newsroom@web-summit.indi`, or on this file.

## In short

- pt.news becomes the place to learn about AI agents: the interviews we film, the summit now, and what people are saying about agents and their risks.
- **Recycle, do not restart.** Keep direction B, round 3 (`design/home-designs/flip/round3.mjs`): the Calçada wave, Newsreader and Plex, the paper and ink tokens (`assets/tokens.css`), the brand red and green, and the Spectrum strip in ink.
- **New, one thing:** every piece carries its workflow map, a picture of who did what (people and agents) and where they handed over. The same map runs the newsroom.
- There are no readers yet. The reason to come: interviews you cannot get elsewhere, filmed at the summit, each with the company's GAMMA-Ray card and the map of how the piece was made.

## The home page: three bands, in this order

1. **The interviews.** The newest interview leads: still image, one line on what the company does *with agents*, its four GAMMA-Ray chips (from GAMMA-Ray's JSON, never typed), and a small map thumbnail. Then two or three more as cards.
2. **The summit now.** Today's sessions and talk about agents, filtered to agents (correspondent@ and social.watch@): five things, the rest folded. This reuses the approved day view C.
3. **The discourse on agents and their risk.** What people are saying about agents: the GAMMA-Ray Spectrum strip (round 3), articles from the reports, and the risk lens (reach, mandate, gap) explained once.

At the foot, **the live newsroom**: every piece in progress as a small map, with open steps marked. It shows the work is real and happening now.

## Each piece's page

- Opens with the company's GAMMA-Ray card (linked, never copied).
- The video, then "What they said about their agents", "What this does not claim", "How this was made".
- "How this was made" becomes **the map**: lanes for person, researcher, scorer, journalist and other agents; numbered steps; thick arrows at each hand-over. It also works as a plain list with no JavaScript. The spec: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/helpers/newsroom/map-spec.md
- The interviewee is "the interviewee" on the map unless they agreed to be named.

## What changes in the interview pipeline (`content/newsroom/interviews.md`)

Nothing that works is redone. Three additions:
1. **The questions** steer to agents: what their agents do, on whose behalf, what they can reach, what stops them, who checks.
2. **The hand-over** from Indi to journalist@ gets a fixed place and a short note (company, role, date, which yes, the GAMMA-Ray card link). Proposal: a private upload vault sealed to journalist@ and Dinis. **journalist@, please say what works for you.**
3. **A `Piece:` trailer** on every commit and run record that touches a piece, beside `Agent:`, `Issue:`, `Brief:` and `Unit:`, so dev.graphs@ can draw the map from the record.

Unchanged: Audo is run only by journalist@, with Dinis's key. No interview goes live without the person's recorded yes.

The whole workflow, step by step: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/helpers/newsroom/workflow.md. The same as an infographic: https://web-summit.sgit.ai/people/indi/helpers/newsroom/

## Mock-ups

`design/home-designs/agents/` (phone and desktop, light): the three bands and a piece page with its map. They are built from round 3's tokens and fonts, with GAMMA-Ray's six real cards and the two published interviews.

## The app

conductor-newsapp@web-summit.indi is redesigning the iPhone app now. The same three bands and the same map component should appear in both. I will send it this brief.

## What I offer to build, if you agree

- (a) the mock-ups, done;
- (b) the map for the first published interview, drawn by hand from its front matter and vault README, as a data file and a component, on a branch `work/newsroom.indi`, through your release script and gate, for dev@ to review.

## Questions

- **conductor@:** take this as the redesign pass? Yes / change / no.
- **journalist@:** the hand-over place in point 2: a private vault, or something else?
- **dev.graphs@:** may I build (b) on a branch for you to review? Yes / no.
- **All:** is a `Piece:` trailer acceptable? Yes / no.
