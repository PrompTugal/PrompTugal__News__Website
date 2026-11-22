---
title: "Feedback from every site, and the hub as the way in: the needs and the dots to connect"
by: sherpa.d@AgentiCCells.dinis
written: 2026-11-22T14:10Z
status: first map, at Dinis's word (22 Nov, in my session); the hub read cold at 14:20 UTC (H1 to H5)
---
# Feedback from every site, and the hub as the way in

**Dinis's words (22 Nov, about 14:00 UTC, verbatim extracts):** "one of the ways I want to consume the data is from the Hub website ... you need to start thinking about how I navigate it"; "every website should allow me to provide feedback ... voice memos, text memos, be able to talk to the respective agent or respective agents that are working on that"; "we already have the workflow ... the QR codes, we have the flows, we have the structure ... we basically need to make a way to connect these dots."

## Who the users are (four kinds, not one)

| Kind | Who | What they need from feedback and from the hub |
|---|---|---|
| Dinis | the operator | See what changed and what waits on him; go into any site; say something in a sentence or a voice memo; know who heard it. |
| Another agent | an agent that asks, or consumes another's data | Receive a message it can verify and act on; know whom to ask; not be blocked in silence. |
| A customer | someone who uses a site or a cell | Tell us what is wrong or missing in two taps, without an account; know it was heard. |
| A party we reach out to | a company, journalist or organiser we wrote to | Reply easily to the right team; see who we are; never be asked for a private contact. |

Each kind needs a different door into the same lane: Dinis signs, an agent verifies, a customer is anonymous, an outreach contact answers a named thread.

## Journey 1: Dinis, from the hub

What he wants the hub to answer, in the order he would ask (hypothesis from his words and the earlier journey):
1. **Arrive:** what changed since I was last here, and what needs me? (the same need as the Decision Desk: one place, no hunting).
2. **Go in:** open a site, see its state, who works on it, come back to the hub in one tap.
3. **Speak:** from inside that site, say something to the people working on it, in two taps, by typing or by voice.
4. **Be heard:** see that it reached the right agent and what it did.

Where he is likely to get lost today: each site is a separate place, with no shared door back; feedback depends on a pane that exists only on some sites; he cannot tell which agent to address.

## The dots that already exist (from the record, 22 Nov; each to be re-checked by its owner)

| Dot | What it is | Where |
|---|---|---|
| PKI sign-in | a person key as QR code or link; kept non-extractable in the browser; proved against `board/person-keys.json` | `/login/` (`board/guidance/2026-11-15-talk-to-us-from-the-site.md`) |
| Agent lanes | a sealed, signed append lane per agent; senders sign, receivers verify | `board/inbox.json`, `board/inboxes/<role>.json`, `board/tools/agent_inboxes.py` |
| Anonymous signal | page views and thumbs, encrypted to a write-only lane, no IP, no cookie | `assets/obs/obs.js` |
| One registry of sites | name, URL, version for every site; the sites bar renders it everywhere | `api/v1/sites.json`, `board/guidance/2026-11-18-the-sites-bar.md` |
| Talk-to-us milestone | comment pane, reply lane, thumbs, signed in the browser and sealed to the conductor | specified 15 Nov (owner dev.places@); I have not checked how much exists |
| Voice and text on a page | dictation and typed answers stored by the page | the Decision Desk (claude.ai artifacts; private to Dinis's account, a different carrier) |
| QR codes | sign-in links; a public key as a QR | `person-key.mjs`, `pki-agent.mjs keyqr` |

## The dots that are missing (hypotheses to verify with the owners)

1. **Which agents work on this site.** The registry names sites but, as far as I read, not the agents behind each. Without that the sentence "talk to the respective agents" has no address.
2. **One control on every site.** The sites bar is already on every site from one registry. A single "Tell the team" control in the bar would give all 13 the same door. I do not design it; I name the need.
3. **Voice to text on the way in.** Dictation exists in the artifact carrier; on the sites, a voice memo needs a capture and a transcript that become a message on the lane. Whether the audio is kept is a privacy decision.
4. **The answer back.** A reply lane the person's browser reads (specified 15 Nov, not confirmed built).
5. **The same shape for the other three users.** An anonymous customer door, and a reply path for an outreach contact that never needs a login or a private contact.

## The hub, read cold (hub.sovereignweb.site, 22 Nov, 14:20 UTC, v0.1.14; the page text and structure only, not run on a phone)

Dinis gave the right address after my first attempt at a wrong one. What I read: "Websites their owners own", **33 sites** in seven groups (People 11, Startups 5, Providers 1, Businesses 3, PrompTugal.news 5, Demos 7, Tools 2), each a card that opens the live site; a top bar (Principles, Hosted, Hub, Agents, Vault, AgentiCCells, RiskMandate, Newsroom); a "Sovereign Website family" switcher; five designs to choose from. I name no person: the cards name some, and that is the hub's own page.

| # | Finding | Why a user is lost |
|---|---|---|
| H1 (rank 1) | **No door for feedback anywhere on the page.** No feedback, contact, voice, memo, report or sign-in control (0 matches in the page text). | The thing Dinis wants most from every site does not exist on the one place he enters. |
| H2 | **The page answers "what is here", not "what changed" or "what needs me".** No dates, no status per site, no marker of a site that changed today. The only version is the hub's own. | His first question (arrive: what changed?) has no answer; 33 equal cards give no order. |
| H3 | **No search and no filter** across 33 sites; navigation is seven anchors down a long page. | He must scroll to find a site he already knows. |
| H4 | **No agent shown per site.** Nothing says who works on a site, so "talk to the agents on this one" has no address, here or on the site. | The missing dot 1 above, seen from the user's side. |
| H5 | **No way back is promised from a site to the hub** (the sites open in their own pages; whether each carries a bar is for hub.d to say). | The "come back in one tap" need from the decisions journey, again. |

**What works (keep).** A single sentence says what the page is for. Every card opens a live site. Groups are plain words. The family switcher puts all the sites one tap from anywhere on the hub.

**Needs for hub.d and design.d (they decide the design):** a first area for "changed since you looked" and "waiting on you"; a per-site line saying who works on it; one feedback door in each card and on each site; a way back to the hub from every site.

## Proposed decisions for Dinis (to be shown in the studio, not typed here)

| # | Decision | My recommendation | Why |
|---|---|---|---|
| D1 | Put me on a schedule? Cadence | Twice a day, in step with the other agents (07:00 to 10:20 and 18:00 to 21:20 Lisbon, the 19 Nov rule), plus on his word | He wants me analysing and coordinating; the team already wakes twice a day; each wake costs tokens (accountant.d to set my budget). |
| D2 | Where does a site's feedback land first? | The lead agent of that site's lane, which routes to the others | One address per site; no agent is asked to guess. |
| D3 | Voice memos: keep the audio, or keep only the transcript? | Transcript only, audio dropped at once | Least private data held; a person can add a note if the transcript is wrong. |

## What follows each answer
- **D1 yes:** a scheduled wake for sherpa.d, created in his session; **no:** I work only when he or maestro.d talks to me.
- **D2 lead agent:** needs the registry to carry each site's lead; **one inbox:** simpler but a bottleneck.
- **D3 transcript only:** no audio vault needed; **keep audio:** needs a vault, a retention rule and counsel.d's view.
