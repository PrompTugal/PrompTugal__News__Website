---
title: "Brief for the conductor: the personal newsreel, and the map of everything published about the summit"
by: customers@PrompTugal.dinis
written: 2026-11-06T08:30Z
decided_by: Dinis Cruz, in customers@'s session, 6 November 2026 (his words quoted below; the reading of them, the proposals and the research are mine)
for: conductor@PrompTugal.dinis, to route
issue: WS-177
status: an idea of Dinis's, captured and scoped. Nothing here runs. No pass is opened: that is the conductor's.
---
# The personal newsreel

## What Dinis said (6 November 2026, his words, cut for length)

- **The hypothesis.** "Can we take somebody that comes to the summit or hasn't come to the summit, and can we create for them a virtual calendar ... and then create for them a newsreel? ... a personalized newsreel that basically captures the core ideas that happen at the summit, captures the videos that the person can see, captures almost like a personalized debrief of what actually happened, like the core information, the core ideas, the core stuff ... of what we can actually determine that has been published."
- **Capture everything.** "We need to make sure that we capture every single thing that has been published about the summit so that we can talk about it ... from social media ... from people talking about it, from sources that we can connect, from LinkedIn, even from X, from Reddit, from whatever other sources exist, from news articles ... and then see what is actually being published and actually get a good sense of the content."
- **The money question.** "How much would this be worth? Would somebody pay for this debrief of what happened at the summit? ... maybe investors want a specific slice ... other founders, maybe other technologists, maybe we're interested in a particular topic."
- **The people.** "We have a lot of people that we've been talking to that we can start to give them personalized briefings."
- **Delivery.** "This can be delivered via Vault ... by all sorts of different mechanisms, especially if we can get PKI involved, which should be very, very important here."
- **The past.** "There's a lot of great content here on YouTube ... can we map them out? Can we map that content? Can we start to connect those things? And then can we start to look at what's going to happen this year as they map the information, as they show the materials."
- **Even embedded.** "Even if you just embedded YouTube on a page, right, or provide access to it."

## The idea in one paragraph

Two things stacked. **(1) A coverage map:** every public thing published about the summit (this year's, and the past editions'), as data: videos, session summaries, articles, public posts, each linked to the events, companies, people and topics we already hold, with its source and the date read. **(2) A personal newsreel on top of it:** you tell us who you are (an investor, a founder, a CISO, a company, someone who is not coming), we build your calendar from the programme and the graph (the personal-schedule pass already asked for), and then, from the map, the newsreel: the core ideas of what happened in your slice, the videos you can watch, a debrief, each point with its source. Delivered to your own vault, sealed to your key. The first is a public good for the site; the second is a product.

## What already exists (read from this repository, 6 November 2026)

| What | Where | Use here |
|---|---|---|
| The summit's programme as events, places, topics, people-as-listed | `data/events`, `data/places`, `data/topics`, `data/people` (211+ events) | the calendar, and the things a clip or a post is *about* |
| The summit's 16 past editions as events, Dublin 2010 to Lisbon 2025, dates and venue from Wikipedia's timeline at a pinned revision | `data/events/web-summit-dublin-2010` to `web-summit-lisbon-2025`; `data/wikipedia/web-summit/` | the spine for a past-summits map: every video and article hangs off an edition |
| Wikipedia read as data, with its weak points found (no 2025 row, nothing on 2026) | `board/projects/wikipedia.md` | where we already know the public record is thin |
| The personal-schedule idea: personas, graph, schedule, kept in the browser, then a vault | `board/guidance/2026-11-06-events-variations-and-the-personal-schedule.md`, section 4 | the calendar half of the newsreel |
| The vault pane (needs an access key), PKI keys for every agent, sealed messages | `assets/vault/`, `board/keys.json`, `board/tools/agent_inboxes.py` | delivery sealed to the buyer's key |
| The beats and the Brazil story as a method | `desks/correspondent/`, `board/projects/brazil-at-web-summit-2026.md` | a correspondent's live capture |
| An embed of nothing: no video, no YouTube anywhere on the site today | `grep` of content, data and the build: one hit, a desk's Brazil capture | everything about video is new |

## What I could check about the sources (read 6 November 2026)

| Source | What I found | State |
|---|---|---|
| **Web Summit's own session summaries** (text, no video) | https://websummit.com/summaries/lis25/ lists Lisbon 2025 summaries (the index I read showed six, with a "See more" button, so there may be more); each page is dated and says it is by Web Summit, with no licence beyond the site's terms | **verified, public, no login** |
| **Web Summit's YouTube channel** | the channel page loads as "Web Summit - YouTube"; its id came from a search summary of a 2024 press release (UCJtkHqH4Qof97TSx7BzE5IQ); the page text I could read did not show its videos or playlists, and its RSS feed address returned 404 | **channel confirmed to exist; its contents not read.** A researcher has to open it properly |
| **"Only Centre Stage is listed on YouTube"** | a search snippet quoted this from the organiser's speaker-support pages, which sit behind a Google login | **not used.** It is a login-gated page, outside our rule (public, no login); treat as unverified and read the channel itself |
| Press and news coverage | any number of outlets cover each edition (search results for 2024 and 2025 returned national and trade press, EU bodies, event listings) | **exists; not yet mapped** |
| LinkedIn, X, Reddit | not read. Each has terms against bulk collection and most of what is useful sits behind a login | **see the rules below** |

## The rules this has to follow (from CLAUDE.md, the stand-up and the ABPs; for security@ and the conductor to confirm)

1. **Public, reachable without a login, only.** Dinis, 5 November: "we should only be consuming materials from websites that we can reach without login." That rules out most of LinkedIn and X as sources to *read in bulk*. What it leaves: a public post's URL and its public text where the platform's terms allow it, a platform's own public search or API within its terms, an organisation's own public page, a news article. **I have not tested a single platform's terms and I am not the one to decide them**; security@ should, before anything is captured at scale.
2. **Link and cite, do not copy.** A coverage item is a record (url, publisher, date, title, what it is about, the date read), with at most a short quote for the point made. We do not republish an article, a transcript or a post. A video is linked, or embedded on a click, never re-hosted.
3. **A post is a person.** Nothing about a person that is not already public and professional; no contact details; a private individual's post is not ours to collect into a profile. The map holds *the post and what it says*, not a file on its author; the author's organisation is recorded only where the post says so about itself.
4. **Privacy-first applies to our readers too.** The site says no cookies and no tracking. A standard YouTube embed loads Google's scripts and sets cookies when played; even the "nocookie" address is a third-party request. S1 and the participant disclosure are why this is for dev@ and security@: the safe default is a **click-to-load** card (our own page, the video's title and a link, the embed only after the reader chooses) or a plain link; a thumbnail from YouTube's servers is itself a request to Google and should be self-hosted or left out.
5. **Say what was and was not found.** Dinis, 5 November: if there is little data, "that is a signal in itself." Each map says what it covers and what it could not read. A summary of a talk nobody recorded publicly is not written from imagination.
6. **Sourced or not said.** The newsreel's every point carries the link it came from. Summaries by a model are checked (dev.verify@'s pipeline) before a buyer sees them; a point that cannot be traced is dropped.
7. **A person sends it.** Delivery to a buyer is by Dinis or someone he names (ABP R7); an agent seals and prepares.

## The product, sketched

**For whom.** (a) Someone at the summit who wants a plan and a debrief. (b) Someone who is not coming and wants the core ideas. (c) A slice for an investor (who raised, who announced, what the field said), a founder (peers, competitors, what to copy), a technologist (the talks on one stack or topic), a company (everything said about it and its field).

**What it contains.**
1. *The calendar:* the sessions and the places that matter to the person, in order (the personal-schedule pass).
2. *The newsreel:* the core ideas of what happened in their slice, each a sentence with its source link; the videos they can watch (linked or click-to-load), in the order they matter; what was announced; what is missing.
3. *The debrief:* one to three pages after the days, "what actually happened", with what was not found said.
4. *The data:* the same as JSON, so their own agent can read it (the site's habit).

**How it is delivered.** To a vault the buyer owns (the vault month, A2, pairs naturally with this), sealed to their PKI key so only they open it; or, until that exists, as a page and a PDF handed over by a person. The PKI angle Dinis names is the point of difference: *a debrief only you can open*, with a signature that shows who made it and when.

**What it might be worth, and how to find out** (not guessed). Dinis asks it as a question, so I treat it as one:
- *Anchors:* the nearest thing in the register is E3, the post-summit pack (500 pounds, a proposal). A one-person newsreel is the scalable version of that; an investor or company slice is closer to a briefing than a clip. Proposals, to be tested: **personal newsreel 25 pounds; a topic or investor slice 250 pounds; a company's everything-about-us-and-our-field 500 pounds.** All are guesses with no evidence behind them.
- *Test 1, before the days (cheap):* show a sample, last year's newsreel for one persona, to the people Dinis has already been talking to, and see who asks "can I have mine?" Count the asks in `requests.json` (the rule of seven). No payment taken; the signal is the ask.
- *Test 2, a price that finds itself:* Stripe's Payment Links can let a customer choose what to pay (Stripe documentation, read 6 November 2026). A pay-what-you-want link for the sample shows the range without our guessing.
- *Test 3, the days themselves:* a free first-day newsreel, then the offer for the rest.
- *The honest risk:* people may like it and not pay. Another is that it is *free elsewhere*: Web Summit publishes its own summaries and Centre Stage video. What we add is the personal slice, the cross-source map and the sealed delivery. If a buyer would just watch the organiser's channel, the product is worth little. The test says.

## What this asks of the team (a reading, for the conductor to plan; not Dinis's words)

| Who | What |
|---|---|
| **conductor@** | open a pass, "the coverage map and the newsreel", in the usual order, with accountant@'s budget; decide the order against the summit dates; this brief is the input |
| **security@** | first: the source rules above, platform terms for any social source, the embed question; pre-review before capture at scale |
| **researcher@** | past summits first: Web Summit's YouTube channel (the playlists per edition and per stage, titles, dates, durations, licence stated on the page), the organiser's summaries per edition, the main press coverage per edition; into a data folder, public sources only, no login; and say what could not be read |
| **ontologist@** | the entity: a *coverage item* (kind: video, summary, article, post; publisher; date; url; about: links to events, companies, topics, people-as-listed; licence as stated; read_on), the link from each to a past edition; a schema; where it meets the graph |
| **dev.data@** | the coverage items as data folders and the past editions' structure (with ontologist@) |
| **dev.verify@** | the check on every summary and every point of a newsreel |
| **dev.pages@** | the past-editions pages with their videos and coverage; the calendar view |
| **dev@** | the click-to-load embed; the sealed delivery to a vault and the key issuing (with A2); a gate check on third-party requests |
| **correspondent@** | during 9 to 12 November, the live capture: what is published each hour; with the beat correspondents as sub-agents inside its run |
| **journalist@** | the debrief's words; a signed sample |
| **designer@** | the shape of a newsreel: how a person sees it on a phone, what comes first |
| **sherpa@, synthetic@** | read the sample as the person who gets it |
| **accountant@** | the budget, and the cost per newsreel, so the price is a margin |
| **librarian@** | the index, so "where is X" covers the coverage map |
| **customers@ (me)** | the prices, the tests above, the packages and the ledger; the quote and the delivery runbook once a sample exists |

## A proposed order (days are tight: today is 6 November, the summit opens on 9 November)

1. **Now to 8 November: the past.** Researcher@ and ontologist@ map the past editions' videos and coverage (Lisbon 2025 and 2024 first, the recent ones Dinis was looking at). Security@ rules on sources. This is useful on its own as a page of last year's best, and it is the sample for Test 1.
2. **8 November: one sample newsreel**, by hand if need be, from last year's content, for one persona, to show Dinis and to test the ask.
3. **9 to 12 November: live capture** by the correspondent, on the sources security@ allows, with the verification on; a first-day newsreel, free, to see the ask.
4. **13 November onward: the debrief.** Packages E3 and the newsreel on sale to whoever asked, delivered by a person to a vault, sealed.

If the time is not there for all of it, **cut the live capture and keep the past map and the sample**: they test the one thing that is not known, whether anyone wants it.

## What needs Dinis

1. **Which sources are in.** Public news and the organiser's own pages and channel are clear. Social posts need security@'s reading of the platforms' terms first; do you want that read before anything is captured?
2. **Embeds.** Click-to-load (my suggestion), a plain link, or a standard embed, which sets Google's cookies and would sit badly with "no cookies, no tracking"?
3. **Who sends a newsreel** to a buyer, and from where.
4. **The people he has already been talking to**: where the list lives (not here: this repository is public); who may be offered the sample.
5. **Whether the newsreel is a paid product or a free feature** for the first days. My suggestion: free first day, then paid, so the ask is measured.
