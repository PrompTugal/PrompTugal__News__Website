---
title: "First read of holacracy.d's org chart page and Find an agent (Dinis's R5, 'the team browsable')"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-23T22:39Z
what_this_is: my own read of the page built locally from board/team/holacracy.d/tools/page.mjs (the page is generated, not served anywhere yet), at 390 x 664 and 1280 x 800; a review by one agent, not user research
---
# The org chart page, as Dinis would meet it

**His need (R5, 23 Nov, a.maestro's record):** "find me an holacracy agent ... update the org chart ... make sure it's well designed, and I can start to navigate the website"; every agent, its details, its past runs.

## Measured
No script errors, no sideways scroll, on a phone (2.7 screens, 3.5 with Find an agent open) and a desktop (1.8 and 2.2). Tabs: Who started whom, Circles, Find an agent, Decisions, Light / dark. A search box with examples ("studio, counsel, d.helm, SovereignWebsite"); 39 agents of account D; a status chip on each card (working, relayed).

## Findings, ranked (owners in brackets; the design is theirs)
1. **He cannot open it.** The page is made by a script into a file kept out of the repository (the gate treats any html under board/ as a site page) and is not served at any address, so "navigate the website" is not yet possible. The committed team-index.json (owner.feed/v1) is the data; the page that shows it needs a home. [holacracy.d, with helm.d for the home]
2. **Two lists use the same decision numbers.** This page's Decisions tab lists "D1 One naming rule for agents", "D2 A grant for every account D agent" and so on; d.decisions's list of asks for b.decisions (board/team/decisions.d/log/asks-for-b-decisions-2026-11-23.md) has "ASK D1" (a key in the Factory) and "ASK D2" (push to the homes). Both are "waiting for you", so a reader meets two different D1s. Prefix them (for example H-D1 and ASK D1) or share one numbering. [holacracy.d, decisions.d]
3. **A long self-description comes before the content.** The first phone screen is the title, then three lines of provenance ("Drawn by holacracy.d from the governance record ... by a script ... not yet ratified") before the first control. It is honest and useful; collapse it behind a "how this was made" line. [holacracy.d]
4. **Mixed naming in the cards** ("d.maestro (account-d)": the account twice, in two forms), while the rename to account-letter-first is under way. Minor. [holacracy.d]

## What works (keep)
The headline says what the page is and whose it is ("The agents of account D, and what is waiting for you"). Plain tab names. A search box that says what to type. A status on each agent. It reports what it has not seen (account B). No errors and no sideways scroll on a phone.

## Not checked
The Circles and Who started whom views; the Decisions tab beyond its list; whether the cards link to each agent's runs (R5 asks for past runs).
