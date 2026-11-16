# Restarting the PrompTugal team on this account: the plan

By conductor.b@PrompTugal.dinis, 16 November 2026, about 19:00 UTC, at Dinis's word in this session: start here the agents that were paused on the other account; most on Sonnet, a few senior ones on Opus; regular local news from every place; the storm's live data readers back on; design and implementation keep improving; a big pass mapping every news organisation and its journalists, with a page for each and feeds both ways; the graphs and the ontology central; a values section: **PrompTugal.news does not replace journalism, it scales journalism and makes journalism pay.**

This is a plan for Dinis's yes. Nothing here has been started yet.

## 1. Where we are (read from the record)

- **The site is live and in good shape**, at about v0.1.1640. The home page leads with the places. It has 36 places: the Algarve's 17 towns, the region, Portugal and 17 district capitals. It carries about 282 local AI stories, 548 organisations on the maps, 123 publishers, and "Now in <place>" live data (IPMA weather, warnings, fire risk, sea; Faro airport traffic). The place pages are translated into pt-PT, with es, fr, de and nl in the translation memory.
- **Every PrompTugal agent is paused.** At 15:25 UTC today, Dinis paused the 34 scheduled tasks on account A (`board/guidance/2026-11-16-pause-all-agents-for-the-account-move.md`). Account B's ten were paused on 13 November. The only scheduled task still on is observability.fringe@, on account B, which drains the Fringe site's logs until 13 November and then stops itself.
- **23 agents wrote an account-move debrief** (`board/team/<role>/debriefs/2026-11-16-account-move.md`):
  - the conductor, abp, accountant and security;
  - dev.places, designer.places, data.places, datasci.places and viz.places;
  - place.algarve and place.districts;
  - 12 Algarve towns: Faro, Loulé, Quarteira, Silves, Vila Real de Santo António, Portimão, Lagos, Lagoa, Aljezur, Vila do Bispo and Alcoutim.

  The others start from their last hand-over debrief and their ABP (`board/abp/<role>.md`).
- **Vicky's agents are still publishing** (reviewer@ and curator@PrompTugal.vicky, S66 and S67 this afternoon). **Jose's conductor opened its desk at 18:37** and waits on Dinis's yes.
- **Lessons the conductor recorded** (its debrief, section 4). They shape this plan:
  1. The "New from Dinis" list is the agents' only reliable channel.
  2. **Release contention, not the work, is the bottleneck**: thirty agents racing `release.sh` to `dev`.
  3. New folders need a schema before anyone writes to them.
  4. Agents without a key have no lane.

## 2. How the team is shaped (the recommendation)

**Fewer sessions, more sub-agents** (CLAUDE.md), and **Sonnet by default, Opus for the few who judge others' work**.

- A session is a role. Specialists inside a role run as sub-agents in that session's own run.
- Writers push to their own branch `work/<role>`. Only three Opus reviewers bring work onto `dev`, which ends the release race:
  - the editor-in-chief brings content;
  - dev@ brings code;
  - designer@ brings design.
- Every wake reads `board/guidance/README.md` first, then the agent's own debrief.

### The senior desk (Opus, 5 sessions)

| Session | Does | Wake |
|---|---|---|
| **conductor** (this session takes the role, superseding the paused conductor@'s key; or a fresh one: Dinis decides) | the plan, the roster, the guidance list, the briefs to Dinis, starting and pausing the others | hourly |
| **editor-in-chief** (journalist@, senior) | reads every draft from the place desks and the beats, checks sources and the PrompTugal test, signs and publishes the articles, brings content branches onto `dev`; keeps an eye on everything | hourly |
| **dev@** | code review and merge, the gate, **a release queue first** (one pusher at a time), the API and the features | hourly |
| **designer@** | the design system and brand v2.0, the live-data loop, review of designer.places@'s work | every 2 h |
| **security@** | the pre-review and post-review of every pass and push; contact data and personal data above all now | every 2 h |

### The working desks (Sonnet, about 14 sessions, each running sub-agents)

| Session | Sub-agents in its run | Does | Wake |
|---|---|---|---|
| **place.algarve.west** | Aljezur, Vila do Bispo, Lagos, Portimão, Lagoa, Monchique, Silves | local news per town, each fact sourced, the blast radius, significance marked; drafts to the editor-in-chief | hourly |
| **place.algarve.central** | Albufeira, Loulé, Quarteira, Faro, São Brás de Alportel, Olhão | the same | hourly |
| **place.algarve.east** | Tavira, Castro Marim, Vila Real de Santo António, Alcoutim, plus the region page | the same | hourly |
| **place.portugal** | the 17 district capitals (Lisboa, Porto, Beja, Viseu ...), the national page | the same, wider | every 2 h |
| **correspondent** | the beats (AI, Portugal, Europe) | the front page, what leads | every 2 h |
| **live.data** (datasci.places@) | none: the open-data readers, no model needed for the reads | **the storm readers back on**: `board/tools/local-now.mjs` hourly (IPMA, Faro airport LPFR), then more keyless sources per place; `/api/v1/by-place/<id>/now.json` | hourly |
| **media.map** (new, researcher@) | one per region | **the news organisations pass** (section 4) | hourly for the first 2 days, then daily |
| **ontologist** (with data.places@ folded in) | companies, people, organisations, places | the graph, the schemas, adjacency and distances, the media kind | every 2 h |
| **dev.places** | dev.pages, dev.graphs, viz | page layouts from data, the graphs, the organisation and journalist pages, the feeds | hourly, `work/` branch |
| **designer.places** | experiments | variations for Dinis, the live data up front | every 2 h, `work/` branch |
| **translator** | one per culture | the translation memory, never the same text twice | every 3 h |
| **outreach** | none | **drafts only**, to each news organisation and journalist, each leading with their page on our site; a person sends | every 3 h |
| **sherpa + synthetic** (one session) | the personas | the reader's experience and the values page's test | every 3 h |
| **librarian + accountant** (one session) | none | the map of everything; the budgets per agent per day, read from usage | every 3 h |

That makes about 19 sessions instead of the 34 that were running, with several times as many workers inside them. The cost stays visible: account B's ten agents cost about $1,745 API-equivalent from 6 to 12 November (`board/team/conductor.b/ledger/`), so accountant@ sets a budget per desk before the first wake.

**The other way, for Dinis to choose: one Sonnet session per town** (17 Algarve + Portugal + districts = 19 place sessions alone). Each town gets its own agent with its own voice, which is closest to "one agent per place". The cost is roughly double, and the release race comes back unless they all go through the queue. Recommendation: the three regional desks, with a town's own session added where the news warrants one (Faro and Loulé first).

## 3. Values: a section of its own

A page `/values/`, linked from the footer, `/about/` and `/contribute/`, drafted by the editor-in-chief with sherpa@, tested by synthetic@ on a journalist and a local editor. The premise, in Dinis's words: **not about replacing journalism, about scaling journalism and making journalism pay.** It would set out what that means in practice, each line backed by something on the site:

1. **We send readers to the people who did the reporting.** Every place page links its local media first.
2. **We credit and link every source**, with the date it was read.
3. **We pay**: the billing meter (`api/v1/billing/meter.json`) records what each source would earn.
4. **Journalists and local media are partners**: they can write for their town, take our feeds and give us theirs.
5. **Agents do the work in the open**: you can see who did what.
6. **Anyone can correct a fact.**
7. **Nothing about a person beyond the public and professional.**

Positioning and the brand are Dinis's, so the page goes live as the team's draft, with a "For Dinis" decision page for the wording.

## 4. The news organisations and journalists pass

**The goal:** every news organisation that covers a place we cover is mapped, has a page, is linked from its place, and has a feed both ways. Their journalists who are public and professional (bylines, beats) are on the organisation's page.

**Work by agent:**
- **media.map (researcher@, Sonnet).** Uses public sources only: the outlet's own site, its about and contact pages, ERC's public register of media (Portugal's media regulator), and Wikipedia. For each outlet it records:
  - name, kind (newspaper, radio, TV, online, blog), places covered, owner where public;
  - its RSS or API;
  - the editors and journalists it names publicly, by role and beat;
  - the URL of its contact page.

  Data goes in `data/organisations/<id>.json` with a new `media` kind and schema (ontologist@ first, so writes are not refused), each fact with source and date read. Order: the Algarve, then the district capitals, then the nationals.
- **dev.places.** A page per outlet (`/media/<id>/`) and a media index per place. Each outlet's RSS read into its place page (headlines and links only, sending readers to them). **Our feeds out**: an RSS and JSON feed per place and per topic, for them to take.
- **ontologist.** Outlets and journalists in the graph (who covers which place, who wrote what we cite), so the graphs show where local journalism is and where it is missing.
- **outreach.** A draft to each outlet leading with its page, offering the feeds, a desk of its own and a share of what the meter counts. **A person sends it** (CLAUDE.md; the comms protocol).

**The line on contacts (please confirm):**
- **On the public site:** the outlet's own published contact page, linked, and its editors and journalists by name and role where they publish them.
- **Not on the public site:** a person's email or phone. CLAUDE.md says "no contact details, ever".
- **In the private team CRM:** the direct contacts Dinis wants for outreach, through the comms protocol, never in this public repository.

If Dinis wants more than that published, it is his call to change the rule.

## 5. Order of starting (each step on Dinis's go in this session)

1. **Now, with the go: the base.**
   - The conductor takes over here: a new key, lanes re-issued, `board/schedule.json` and the roster updated.
   - **security@ and dev@ first**: dev@'s first job is the release queue, before twenty agents push.
   - **live.data**: the storm readers back on within the hour.
2. **Then: the newsroom.**
   - The editor-in-chief, the three Algarve desks, place.portugal and the correspondent.
   - Local news flowing hourly, each draft through the editor-in-chief.
3. **Then: the map.** media.map, the ontologist and outreach (drafts): the news organisations pass.
4. **Then: the craft.** designer@, designer.places, dev.places, translator, sherpa + synthetic, librarian + accountant.

Each new session onboards from its debrief, makes its own key, supersedes the old entry in `board/keys.json`, and only then commits under the role's name. One session per role, never two.

## 6. What waits on Dinis

1. **The go for step 1.** Also, that "here" supersedes the 16 Nov 01:20 word ("everything in account A; account B's agents should not run").
2. **Three regional desks or one session per town** (section 2).
3. **This session as the conductor**, or a fresh conductor session.
4. **The contacts line** (section 4).
5. **The values page's wording** (a For Dinis page; it ships as the draft meanwhile).
6. **Jose's conductor desk** (opened 18:37, asks for your yes) and **Vicky's agents** (still publishing): do they fold into this team or stay their own?
7. **OpenRouter credit** for dev.verify (the multi-model fact check). It is paused for no credit since 10 November.

## 7. What we take from newsroom.sgit.ai

These pages were read on 16 November; much of that site is design rather than running, and it says so.

- **The Editor places; publishing is adding a file.** One role answers pitches and decides what leads. Here that is the editor-in-chief (Opus), with the correspondent for the front page. ([newsroom](https://newsroom.sgit.ai/newsroom/index.html))
- **Each role has a written "has failed" sentence and a write list.** Our ABPs already do this; each desk's brief gets its failure sentence. (same)
- **Desk health at every build:** placements pointing at nothing, unplaced articles, open pitches, missing graphs. This goes to librarian + accountant and to dev@'s gate.
- **Gaps are journalism.** Each place page says what it looked for and could not find, and that is the next agent's lead. ([every story has an address](https://newsroom.sgit.ai/articles/every-story-has-an-address.html))
- **Altitude before sections:** parish, town, region, country, then topics. Also the **distance to the beat**. Both are already in dev.places@'s open brief. (same)
- **Map every local paper, radio and newsletter per town: link and credit them, never replace them.** Agents draft, a person sends, and first contact goes only to the contacts an organisation publishes. This is section 4's rule. ([the next phase](https://newsroom.sgit.ai/articles/promptugal-news-the-next-phase.html))
- **The verification ladder:** sourced, then model-checked (three model families), then read and signed, then source-confirmed, then certified. "Signed by the source" asks the people quoted to sign that they are represented correctly, which is a natural first offer to journalists. (same)
- **Paying the fact's creator:** the 60/25/10/5 split, which that site marks as never tested, and **trust as a service** (the fact-certifier as a paid role). These feed the values page's "we pay" line and the meter. ([economics](https://newsroom.sgit.ai/economics/index.html))
- **The values page's model:** open by default (CC BY 4.0 for content, Apache 2.0 for code); disclose our stake (the participant disclosure, already on our site); four asks of readers: read, rate, say what is missing, put your agents on a problem. ([about](https://newsroom.sgit.ai/about/index.html))
- **Cost:** most of an agent's tokens go on re-reading its own session. Short sessions with debriefs, restarted when full, are cheaper than long ones. ([a newsroom built in a night](https://newsroom.sgit.ai/articles/storm-charles-a-newsroom-built-in-a-night.html))
