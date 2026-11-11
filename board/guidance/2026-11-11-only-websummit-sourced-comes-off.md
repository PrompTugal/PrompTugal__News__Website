---
title: "What rests only on websummit.com comes off the site, with a note; shadow sources bring it back"
given: 2026-11-11, about 18:50 UTC, Dinis in conductor@PrompTugal.dinis's session (spoken, lightly cleaned), after talking with Vicky
kept_by: conductor@PrompTugal.dinis
answers: security@'s S39 (data machine-read from websummit.com before its terms were known is still published)
follows: desks/conductor-vicky/standing-rules.md (no machine reads of websummit.com, its app, Luma, Meetup, Eventbrite; 3a76f421c, df3ab8f83)
method: https://newsroom.sgit.ai/articles/sources-and-shadows.html (Dinis, 25 October 2026)
issue: WS-177
---
# What rests only on websummit.com comes off the site; shadow sources bring it back

## Dinis's words (11 November 2026, about 18:50 UTC)

> "We have an interesting curveball, but actually that's not that bad. I was just talking to Vicky, and she was saying that according to the licences, we cannot show the data."

> "Read what I call shadow content and shadow messages: when we can find messages and information from one source without reading the other source. Things like Wikipedia and a bunch of others. It's on newsroom.sgit.ai."

> "Do the same thing here. We need to remove content from the website, but only remove content from pages where the only source that exists is the website. See if you can find other sources that actually show that somebody's exhibiting. If you can find those sources, we can add them back. Or even tomorrow, if I take some screenshots of pages that we have X-rays for, or pages that we have information for, we can add it back to the site."

> "Now that we have the Fringe application, that's okay, because that's a good one to show the work. That's actually a cool use case for our workflow."

> "So we remove them from the site with a note. Add a note to say that this doesn't have everything, because we couldn't get the data, because we don't have the licence for it. Say: these are the pages that we can figure out, and good examples show the path to it."

## The rule

1. **A fact whose only source is websummit.com** (the site, its subdomains or the Web Summit app) **comes off the public site**: off its page, the lists, the graphs, the served JSON and the markdown twins. A fact with at least one other public source stays, cited to that source.
2. **An entity left with no fact** (a company, a person, a session) gets no page. It returns when one fact has another source.
3. **Every affected page and list carries a note**, in plain words:
   - this is not everything;
   - Web Summit's licence does not let us republish data from its site, so on 11 November we took off whatever rested only on it;
   - what you see has another public source, each one cited;
   - each item comes back when we find one;
   - how we do it, linked: the shadow method and the recovery page below.
4. **Shadow sources** (the method in "Sources and their shadows"). The same fact, found where we may read it:
   - the company's own site, press release or blog;
   - news outlets;
   - Wikipedia;
   - the speaker's own pages;
   - other event listings whose terms allow it.
   Each one is cited with its URL and the date read. No login, no bot challenge, no paywall read around; Luma, Meetup and Eventbrite are not read by machine (Vicky's rule).
5. **Dinis's own captures count.** A screenshot Dinis takes himself of a page (for example the companies with GAMMA-Ray X-rays) is a source: cited as his capture, with its date. He may add these from 12 November.
6. **A recovery page shows the path:**
   - how many facts and pages came off and how many have come back, by kind;
   - for good examples, the route from the websummit-only fact to the shadow source that brought it back.
   Lisbon Fringe (lisbontechfringe.com), built from open sources, is the showcase of the workflow.
7. **Nothing else changes.** Facts with other sources stay as they are. The git history is not rewritten. Whether the copies in this public repository's `data/` must also go is security@'s advice to Dinis; until then the build keeps them out of everything the site serves.

## The size (conductor's count at 18:55 UTC, from `data/`)

| Kind | Total | Resting only on websummit.com | Left with nothing |
|---|---|---|---|
| Company facts (`data/companies/*/facts.json`) | 311 | 239 | 59 of 120 companies |
| People (`data/people/*/person.json`) | 285 | 285 (every external source is websummit.com) | 285 |
| Sessions and events (`data/events/`) | 248 | 215 | 215 |
| Articles citing websummit.com | 66 | 29 cite it (each sentence to check) | (journalist@) |

ontologist@'s inventory replaces these figures with exact ones per fact.
