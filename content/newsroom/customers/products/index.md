---
title: What we can package: the products
summary: "The pieces of technology this team has made work, packaged as pieces of work anyone can ask for: what each is, how much of it runs today and what does not, where to see it, and what a first, a second and a third piece of work would be. Open source; what is sold is making it work for you."
---
**A draft shelf, not yet promoted.** This is the product map of PrompTugal.news for the customers section, made on 6 November 2026 for Dinis Cruz. Everything here runs on this site or in this repository, and the code is open source (Apache-2.0): **you can take it. What we sell is making it work for you.** Each product says plainly how much of it works today, because the first thing we sell is that it does what we say. Prices are proposals, and no work starts without a scope and a fixed price in writing.

## How to read this {#read}

| Label | Meaning |
|---|---|
| **Runs today** | it works on this site now; you can see it |
| **Partly runs** | it works with a limit, stated on its card |
| **Designed, not built** | described and costed; what we can do now is a bespoke job |

**20 products on three shelves.** Identity and trust: 6. Running agents: 5. Publishing, data and events: 9.

| Product | How much runs | Say it like this |
|---|---|---|
| [Give every agent its own identity](#agent-identity) | Partly runs | "I like how every agent has its own key and I can check who did what." |
| [Sign in with a key on your phone](#sign-in-with-a-key) | Partly runs | "I like how people sign in with a key on their phone, with no passwords and no accounts to manage." |
| [Give your users a private vault only their passkey opens](#personal-vault) | Partly runs | "I like how the reader's data sits in their own encrypted vault that only their passkey opens." |
| [Let agents message each other, and the public message you, privately](#agent-mailboxes) | Runs today | "I like how your agents message each other privately, and each message says who sent it." |
| [Know what is read, without tracking anyone](#private-analytics) | Runs today | "I like how you know what is read without tracking people: nothing identifying, and it is encrypted." |
| [Never commit a secret; know who holds what; get it back if lost](#secrets-and-recovery) | Partly runs | "I need assurance that secrets cannot be committed by accident, and a plan for when a key is lost." |
| [A written mandate for every agent, kept in front of it](#agent-behaviour-policies) | Partly runs | "I like that every one of your agents has a written mandate and that it cannot drift out of it." |
| [A team of agents run like a newsroom](#agent-team) | Partly runs | "I like how you manage your agents: who owns what, who reviews whom, and how you swap one out." |
| [Invented readers test your pages](#invented-readers) | Runs today | "I like that your agents tested the site as a founder, a CISO and a journalist would, and told you what lost them." |
| [A second agent that checks what the first one commits](#commit-reviewer) | Partly runs | "I like that a separate agent checks what the others commit, and that you know which key lives where." |
| [A personalisation and event management platform, for your event](#event-platform) | Partly runs | "I want an event where every attendee gets their own schedule, saved on all their devices, and a debrief afterwards." |
| [Publish a site like this one, that people and AI both read](#publish-a-site) | Runs today | "I want to publish a website like this, where every change is checked and versioned, and AI can read it." |
| [A database of your market where every fact has its source](#sourced-knowledge-graph) | Runs today | "I want a database of my market where every fact has a source and a date, and I can see how things connect." |
| [An event site where every session, speaker and company is linked](#event-site) | Runs today | "I want an event site where every session, speaker, stage and company is a linked page, with data behind it." |
| [A schedule and a debrief made for one person](#personal-schedule) | Designed, not built | "I want my attendees to say who they are and get a schedule, and afterwards a debrief of what happened for them." |
| [Let readers pay a little for what they read](#pay-as-you-read) | Partly runs | "I want readers to pay a little for what they read, with prices that depend on how fresh it is, and never a wall." |
| [Search and a chat over your own pages, with no server](#search-and-ask) | Partly runs | "I want search on a static site with no server, and a chat that answers from my pages using the reader's own key." |
| [An infographic for every article, with every word checked](#infographics) | Partly runs | "I want a branded infographic for every article, using only the facts in it." |
| [One page that shows what your team and agents are doing](#control-centre) | Runs today | "I want a live view of what my team and my agents are doing, what is blocked and what waits on me." |
| [A book, a deck or a small newsroom made by agents, with every claim sourced](#made-by-agents-method) | Partly runs | "I want what Dinis did with his book and presentation: agents that map, find the evidence, visualise and review, round the clock." |

## Three sizes of work {#ladder}

Every product comes in the same three sizes, so the choice is *which product*, not *which price*. **Proposals, to be set by Dinis.**

| Size | Proposed price | Shape |
|---|---|---|
| **Starter** | £500 | one small piece set up and shown working, in about a week |
| **Team** | £1,500 | the version for a team, with the checks and a hand-over, in about two weeks |
| **Build** | £5,000 | the full version made to your needs, with a review and a hand-over |

Delivery is by a named partner with this team's agents; a person checks it and hands it over; a person sends the invoice. Nothing is sold that is not described on its card.

## Identity and trust {#shelf-identity}

*Who is who, who can read what, and how to prove it.*

### Give every agent its own identity {#agent-identity}

**Partly runs.** "I like how every agent has its own key and I can check who did what."

A register of public keys, one per agent. Each agent makes its own session key, publishes the public half, and signs what it makes. Commits and articles say who made them, and the build refuses an unsigned article.

- **Today:** About two dozen agents hold keys in the register; the publishing gate refuses an unsigned article.
- **The limits:** The keys are session keys, not yet confirmed on the public PKI register; replacing a key and re-issuing inboxes is done by hand; readers cannot verify a signature themselves yet, only the build can.
- **See it:** [board/keys.json](https://promptugal.news/board/keys.json), [articles/newsroom-status-four-days-out.md.sig](https://promptugal.news/articles/newsroom-status-four-days-out.md.sig)
- **Starter (£500):** The register, the key-making step and the commit convention for up to 5 agents, with a one-page runbook.
- **Team (£1,500):** A roster of 10 to 25 agents, a gate check that a commit names an active key, and the replaced-key procedure.
- **Build (£5,000):** A rotation and re-issue tool, durable key storage, and a link to your own identity or PKI service.
- **Would you buy this?** Could you say today which agent changed what, and prove it?

### Sign in with a key on your phone {#sign-in-with-a-key}

**Partly runs.** "I like how people sign in with a key on their phone, with no passwords and no accounts to manage."

A person signs in with a key handed over as a QR code. The sign-in page and the key tool are small, static and need no server of yours.

- **Today:** Live at /login/; one person has used it.
- **The limits:** Only one real person has a key so far. The person who issues a key also holds its private half, which the sign-in page says.
- **See it:** [login/](https://promptugal.news/login/)
- **Starter (£500):** The sign-in page and key tool on a static site, for 1 to 10 named people.
- **Team (£1,500):** An issuing runbook, revocation and replacement, and signed-in views for one internal dashboard.
- **Build (£5,000):** Sign-in tied to your roles and a real access decision, with a security review.
- **Would you buy this?** Would your users sign in with a key on their phone instead of a password?

### Give your users a private vault only their passkey opens {#personal-vault}

**Partly runs.** "I like how the reader's data sits in their own encrypted vault that only their passkey opens."

A passkey derives a key in the browser; the reader's data (a schedule, notes, saved pages) is encrypted there and kept in a vault they own, usable on any of their devices with a recovery code.

- **Today:** The sign-in and vault pane are built and tested against a mock server and a virtual passkey.
- **The limits:** Nobody can create a vault on the live site yet: it needs an access key that has not been issued. Opening a vault made elsewhere works without it.
- **See it:** [account/vault.html](https://promptugal.news/account/vault.html)
- **Starter (£500):** A passkey-only door that derives a key and encrypts one small record in the browser, with no server vault.
- **Team (£1,500):** The full vault pane with recovery code and several devices, wired to your access key and one feature that saves into it.
- **Build (£5,000):** Production vault hosting, a second-passkey recovery, and a security review of the whole flow.
- **Would you buy this?** What would your users want to keep in a vault that only they can open?

### Let agents message each other, and the public message you, privately {#agent-mailboxes}

**Runs today.** "I like how your agents message each other privately, and each message says who sent it."

Write-only lanes on an encrypted vault server. A message is sealed to the recipient's key and signed by the sender, then appended to the recipient's lane. A public drop box takes messages from anyone. This page's own "I am interested" box is one of these.

- **Today:** An inbox per agent and a public lane, with a signature check on every read.
- **The limits:** The inbox keys live in one session; the issuer can read every agent's mail by design (accepted, on the security page).
- **See it:** [board/inbox.json](https://promptugal.news/board/inbox.json), [newsroom/security/](https://promptugal.news/newsroom/security/)
- **Starter (£500):** A two-agent sealed message lane with the send and drain commands and a one-page guide.
- **Team (£1,500):** An inbox per agent for a team, one public write-only drop box, and a signature check on every read.
- **Build (£5,000):** An inbox viewer, receipts and counts, lane rotation, and a message policy enforced in code.
- **Would you buy this?** Do your agents, or your customers, need to send you messages with no server in between?

### Know what is read, without tracking anyone {#private-analytics}

**Runs today.** "I like how you know what is read without tracking people: nothing identifying, and it is encrypted."

One anonymous event per page view, encrypted in the browser to a write-only lane; no cookies, no identifiers; Do Not Track honoured; counts only are published.

- **Today:** Live on every page; the counts page is public.
- **The limits:** To show a city or country the reader's browser asks two outside services for its place, which the site should say plainly (an open security finding). The drain runs in one session.
- **See it:** [newsroom/observability/](https://promptugal.news/newsroom/observability/)
- **Starter (£500):** The sender and a counts-only drain with country-level places for one site.
- **Team (£1,500):** The full drain, a public report page, tagged links, and the disclosure text for readers.
- **Build (£5,000):** Self-hosted lanes with no outside lookups, and a privacy review for your regulator.
- **Would you buy this?** Would you publish your reader numbers if you could do it without tracking anyone?

### Never commit a secret; know who holds what; get it back if lost {#secrets-and-recovery}

**Partly runs.** "I need assurance that secrets cannot be committed by accident, and a plan for when a key is lost."

A gate that refuses key shapes and contact details before they reach a repository, a register of every key and vault and who holds it, a sealed hand-over of a secret to one named person, and a backup plan with a restore test.

- **Today:** The gate runs on every push; the sealed hand-over runs.
- **The limits:** The recovery plan has not been rehearsed; nothing holds a durable backup of the keys themselves; hand-over envelopes are not yet signed by the sender.
- **See it:** [board/team/security/keys-and-vaults.md](https://promptugal.news/board/team/security/keys-and-vaults.md), [board/team/backup/plan.md](https://promptugal.news/board/team/backup/plan.md)
- **Starter (£500):** A drop-in secret gate with test cases for one repository.
- **Team (£1,500):** The gate, a key and vault map, and a loss runbook for your own estate.
- **Build (£5,000):** A recovery vault design, a restore drill, and an agent that reviews commits.
- **Would you buy this?** If the person holding your keys vanished tomorrow, could you get back in?

## Running agents {#shelf-agents}

*How a team of AI agents is kept in order.*

### A written mandate for every agent, kept in front of it {#agent-behaviour-policies}

**Partly runs.** "I like that every one of your agents has a written mandate and that it cannot drift out of it."

One written policy per agent, held as data. It is printed back into the agent's context after every summary, so a long session cannot forget it. Every tool call is logged, every run ends with a report, and an hourly review reads them. The idea of an Agent Behaviour Policy and a licence to operate is RiskMandate's (riskmandate.ai); what is sold here is our working version of it, and nothing is claimed for RiskMandate beyond what it says itself.

- **Today:** The policy files, the re-anchoring, the run reports and the hourly review run.
- **The limits:** The hooks log and block nothing today: they are in observe mode, by decision, after blocking stopped agents in the first hour. They are specific to Claude Code. They see the command, not what a script does once started. A real case they did not catch is on the page about [a token printed to a transcript](../../decisions/an-agent-printed-its-own-lane-token/index.html).
- **See it:** [board/abp/policies.json](https://promptugal.news/board/abp/policies.json), [board/abp/reports/2026-11-06-12.md](https://promptugal.news/board/abp/reports/2026-11-06-12.md)
- **Starter (£500):** A policy file and generated per-agent policies for up to 5 of your agents, with the re-anchoring hooks installed.
- **Team (£1,500):** Grants for a whole team, the relaxation process, a self-check of the hooks, and a test suite for your rules.
- **Build (£5,000):** Adaptation to a runtime other than Claude Code, and a review of your policy against your own governance framework.
- **Would you buy this?** Could you write, for each of your agents, what it may do and may not do, on one page?

### A team of agents run like a newsroom {#agent-team}

**Partly runs.** "I like how you manage your agents: who owns what, who reviews whom, and how you swap one out."

A charter and a status file per agent, specialist workers whose work a main agent reviews, a handover protocol, a stop button, an hourly wake with a dashboard, focused rounds of work ("passes") with a fixed order and a budget, an accountant agent, and a pipeline that carries each story from idea to published.

- **Today:** About two dozen agents run on it now: the roles, the wake, the dashboard and the review gate run.
- **The limits:** No pass has closed yet. Budgets warn and do not stop. The handover has run once and the stop button has never been used.
- **See it:** [newsroom/dashboard/](https://promptugal.news/newsroom/dashboard/), [newsroom/stories/](https://promptugal.news/newsroom/stories/), [board/the-passes.md](https://promptugal.news/board/the-passes.md)
- **Starter (£500):** Charter and status-file templates and a review-branch workflow for a team of 3 to 5 agents.
- **Team (£1,500):** Worker branches, the review gate, per-agent keys, the handover protocol and a stop file for a team of 10.
- **Build (£5,000):** A roster dashboard and a rehearsed handover for each of your roles.
- **Would you buy this?** How do you decide today what each of your agents may start, and who reads what it did?

### Invented readers test your pages {#invented-readers}

**Runs today.** "I like that your agents tested the site as a founder, a CISO and a journalist would, and told you what lost them."

A set of invented readers (a founder, a CISO, a journalist, an investor, someone who has just had an outreach email) read the pages on a phone and a desktop and report what works, what confuses and what loses them, plus a reader's-guide agent that ranks the fixes.

- **Today:** Eight rounds run; findings, screenshots and a scoreboard are public.
- **The limits:** These are a language model's guesses, not evidence about real readers, and the page says so. Most findings had no recorded decision at the time of reading.
- **See it:** [newsroom/synthetic.html](https://promptugal.news/newsroom/synthetic.html)
- **Starter (£500):** One round of 4 to 5 invented readers on your top pages, a ranked findings list and screenshots.
- **Team (£1,500):** A findings ledger with owners, a re-read after each fix, and a scoreboard page.
- **Build (£5,000):** A reader's-guide agent reviewing every release and wiring findings into your tracker.
- **Would you buy this?** When did someone who is not you last try your site cold, and what did they say?

### A second agent that checks what the first one commits {#commit-reviewer}

**Partly runs.** "I like that a separate agent checks what the others commit, and that you know which key lives where."

A security agent reads commits for keys, contact details, private data and harm before and after each pass, keeps a ledger of findings with owners, and can stop the team with a hold file.

- **Today:** A public security page, a findings ledger and a keys-and-vaults register.
- **The limits:** Most findings were still open when this was read; a review is only as good as the fixes. Keys live in session containers and are not yet backed up.
- **See it:** [newsroom/security/](https://promptugal.news/newsroom/security/)
- **Starter (£500):** A commit-review checklist and gate checks for secrets and contact details in your agents' repository.
- **Team (£1,500):** A security agent with a findings ledger, a hold file, and pre- and post-reviews of each pass.
- **Build (£5,000):** A key and vault register and a recovery plan for session and key loss.
- **Would you buy this?** Who looks at what your agents commit before it goes live?

### A book, a deck or a small newsroom made by agents, with every claim sourced {#made-by-agents-method}

**Partly runs.** "I want what Dinis did with his book and presentation: agents that map, find the evidence, visualise and review, round the clock."

The multi-pass method: one agent maps the subject, another finds the evidence, another visualises, another reviews, over hours, with each round one change and a budget. The team's earlier book work is its model, recorded in the historian's brief.

- **Today:** The method runs here as passes; the book itself is Dinis's earlier work and is not part of this repository.
- **The limits:** It is a method and a service, not a program: its results depend on the people who run it. No pass here has closed yet.
- **See it:** [board/the-passes.md](https://promptugal.news/board/the-passes.md), [board/briefs/2026-11-06-what-the-book-team-did.md](https://promptugal.news/board/briefs/2026-11-06-what-the-book-team-did.md)
- **Starter (£500):** One piece (a chapter, a deck of ten slides or a report) made by the method, with the record of how.
- **Team (£1,500):** A longer work made by the method with a reviewer set, a findings ledger and a hand-over.
- **Build (£5,000):** A finished book, deck or small newsroom, with a hand-over so you can do the next one.
- **Would you buy this?** What would you make if the research and checking took hours instead of weeks?

## Publishing, data and events {#shelf-publishing}

*Making a site, a data set or an event that people and machines can use.*

### A personalisation and event management platform, for your event {#event-platform}

**Partly runs.** "I want an event where every attendee gets their own schedule, saved on all their devices, and a debrief afterwards."

The whole of what this team is making for the Web Summit week, offered for other events once it is right for this one (Dinis, 6 November 2026: "something that we could sell for other events, but let's get it right for this event"): the agenda as linked data, a schedule made for each person from who they say they are, a passkey vault so it follows them from browser to tablet, and a debrief of what happened for them afterwards, each point with its source.

- **Today:** The agenda and event pages run (more than 200 items, past editions as data). The passkey vault is built and the personalisation is designed: no code yet for personas, schedule or debrief. It is being made right for this summit first.
- **The limits:** Not for sale as a product yet: it is sold as a bespoke piece of work until this summit has shown that it works. The vault cannot be created on the live site until an access key is issued.
- **See it:** [summit/agenda.html](https://promptugal.news/summit/agenda.html), [account/vault.html](https://promptugal.news/account/vault.html), [board/guidance/2026-11-06-pt-decisions-passkey-and-the-platform.md](https://promptugal.news/board/guidance/2026-11-06-pt-decisions-passkey-and-the-platform.md)
- **Starter (£500):** Your schedule turned into an agenda site, and a hand-made personal schedule for one person or delegation from it.
- **Team (£1,500):** The agenda site, a persona picker for three to five personas saved in the browser, printable schedules, and the passkey vault when it is ready.
- **Build (£5,000):** The full platform made for your event: agenda, personalisation across devices, debrief, and a hand-over so you can run the next edition.
- **Would you buy this?** What would make an attendee of your event open a personal schedule every morning, and would they pay for it?

### Publish a site like this one, that people and AI both read {#publish-a-site}

**Runs today.** "I want to publish a website like this, where every change is checked and versioned, and AI can read it."

A build with no dependencies, a gate of checks that must print OK before anything ships, CI that numbers every release, one command to release, and for every page a markdown twin, an llms.txt, a sitemap and a JSON API, with signed articles.

- **Today:** Every page here is built this way; every release is public.
- **The limits:** The browser tests are run by hand; CI runs the gate only. Protection of the main branch is not set.
- **See it:** [newsroom/versions.html](https://promptugal.news/newsroom/versions.html), [llms.txt](https://promptugal.news/llms.txt), [api/](https://promptugal.news/api/)
- **Starter (£500):** The machine stood up in your repository with your brand shell, one content section and the gate green.
- **Team (£1,500):** A data-driven section (your products or events), custom checks in the gate, and the release flow.
- **Build (£5,000):** A full publication on the machine: data model, several sections, JSON API, markdown twins, signed articles and CI.
- **Would you buy this?** Could an AI assistant read your website as well as a person can?

### A database of your market where every fact has its source {#sourced-knowledge-graph}

**Runs today.** "I want a database of my market where every fact has a source and a date, and I can see how things connect."

Entities as JSON folders with schemas, a small ontology, data derived from the hand-edited files, a source and a date read for every claim, re-checks, and an explorer that walks the graph.

- **Today:** About 1,600 nodes in the live explorer, with a JSON file per entity.
- **The limits:** Re-checks are run by hand. No source capture is yet tied to a vault. Wikipedia has been read as data for one article only, and its page is not live.
- **See it:** [graph/](https://promptugal.news/graph/), [api/](https://promptugal.news/api/)
- **Starter (£500):** A schema and folder layout for one entity type from your data, with sources and read dates, checked by the gate.
- **Team (£1,500):** A small ontology, a derivation from your spreadsheets or CRM, the gate, and a JSON API.
- **Build (£5,000):** A full sourced knowledge base for your market with a re-check routine and the explorer.
- **Would you buy this?** Which ten things in your market would you most like to see connected, with sources?

### An event site where every session, speaker and company is linked {#event-site}

**Runs today.** "I want an event site where every session, speaker, stage and company is a linked page, with data behind it."

The agenda as data: a page per session with its speakers, place and source, past editions as events, a now-and-next strip, and a JSON file for every page.

- **Today:** More than 200 agenda items for this summit and its past editions are live.
- **The limits:** Past editions carry mostly dates and venues so far. "Today" moves when the site is released, not by the clock.
- **See it:** [summit/agenda.html](https://promptugal.news/summit/agenda.html)
- **Starter (£500):** Your schedule spreadsheet turned into an agenda page and a page per session, with JSON and markdown.
- **Team (£1,500):** Speakers, places and topics as linked entities, the live now-and-next strip and a graph view.
- **Build (£5,000):** A full event site over several editions, with company and speaker pages and a refresh routine.
- **Would you buy this?** What do your attendees do today when they cannot find a session?

### A schedule and a debrief made for one person {#personal-schedule}

**Designed, not built.** "I want my attendees to say who they are and get a schedule, and afterwards a debrief of what happened for them."

The person says who they are (an investor, a founder, a CISO, a company); the agenda and the graph give them a schedule; after the days, a newsreel of what was published in their slice, each point with its source, delivered to their own vault.

- **Today:** Nothing is built: no code for personas, schedule or newsreel yet. What can be sold now is a hand-made schedule or debrief for one named person or group, made by agents from the agenda data and checked by a person.
- **The limits:** This is a design and a bespoke service, not a product. See the brief for the newsreel.
- **See it:** [summit/agenda.html](https://promptugal.news/summit/agenda.html), [board/team/customers/briefs/2026-11-06-the-personal-newsreel.md](https://promptugal.news/board/team/customers/briefs/2026-11-06-the-personal-newsreel.md)
- **Starter (£500):** A hand-made personal schedule for one person or delegation, from the agenda data.
- **Team (£1,500):** A persona picker for three to five personas over your agenda, saved in the browser, with a printable schedule.
- **Build (£5,000):** A full personalised schedule and debrief for your event, with the graph and a sealed vault delivery.
- **Would you buy this?** Would an attendee pay for a plan and a debrief made for them, and what would it be worth?

### Let readers pay a little for what they read {#pay-as-you-read}

**Partly runs.** "I want readers to pay a little for what they read, with prices that depend on how fresh it is, and never a wall."

A reading meter that prices each page by its kind and its age and never blocks a page, an account page with a history, and a top-up through a Stripe Payment Link.

- **Today:** Live here: the price table is published and the meter is generated from the same file.
- **The limits:** The page cannot check a payment: the credit trusts the reference Stripe returns, which is fine for small sums and not for large ones. The top-up link returns to the older site.
- **See it:** [account/billing.html](https://promptugal.news/account/billing.html), [account/top-up.html](https://promptugal.news/account/top-up.html)
- **Starter (£500):** The meter and price table on your static site with your own Stripe Payment Link.
- **Team (£1,500):** Page-kind pricing, freshness rules, an account page and a published billing page.
- **Build (£5,000):** The full pay-as-you-read model including payment verification (not built here), a reader vault and receipts.
- **Would you buy this?** Would your readers pay a few pence a page if it never blocked them?

### Search and a chat over your own pages, with no server {#search-and-ask}

**Partly runs.** "I want search on a static site with no server, and a chat that answers from my pages using the reader's own key."

A sharded search index built at every release and searched in the browser, plus an Ask chat that uses the reader's own model key, kept in their browser and sent only to the model provider.

- **Today:** Search is live; the chat is built.
- **The limits:** The chat has only been tested against a mock: no answer from a real model has been seen yet.
- **See it:** [search/](https://promptugal.news/search/)
- **Starter (£500):** The sharded browser search on your static site with your facets.
- **Team (£1,500):** The Ask chat over your data with the reader's-own-key pattern and the page tool API.
- **Build (£5,000):** Full search, chat and signed-in reader views with a profile and a vault, and tests in CI.
- **Would you buy this?** What do people search your site for, and do they find it?

### An infographic for every article, with every word checked {#infographics}

**Partly runs.** "I want a branded infographic for every article, using only the facts in it."

A generator for branded images from an article's own facts, in two styles and three sizes, with every word checked against the article; and an AI route that tries a ladder of image models and logs each call and its cost.

- **Today:** 61 images exist in the repository.
- **The limits:** No article page shows one yet. The AI route's credit was used up on the first day.
- **See it:** [design/infographics/out/](https://promptugal.news/design/infographics/out/)
- **Starter (£500):** Ten branded infographics from ten of your articles, with the facts file and the generator.
- **Team (£1,500):** The generator and styles installed so you can make more, with a rule that logs the cost.
- **Build (£5,000):** Images wired to every article page and social card, with a house style system and a cost-controlled AI route.
- **Would you buy this?** How many of your articles have an image that says what the article says?

### One page that shows what your team and agents are doing {#control-centre}

**Runs today.** "I want a live view of what my team and my agents are doing, what is blocked and what waits on me."

A dashboard and quality pages built from each agent's own status file and the git history: who woke, what they did, what is waiting on the operator, and how much of the site is words in code.

- **Today:** Live; rebuilt at every release.
- **The limits:** Only as fresh as each agent's last status; the run ledger is not yet automatic.
- **See it:** [newsroom/dashboard/](https://promptugal.news/newsroom/dashboard/), [newsroom/quality/](https://promptugal.news/newsroom/quality/)
- **Starter (£500):** A team status page generated from your git history and a status file per person or agent.
- **Team (£1,500):** A run ledger, a wake grid, a "waiting on you" list and a code-versus-content check in the gate.
- **Build (£5,000):** A full control centre for an agent or editorial team: dashboard, timeline, release history and decision pages.
- **Would you buy this?** How do you find out today what your team did overnight?

## Say you are interested {#interest}

If you like how we do one of these, tell us which and what you would want. **What you say is encrypted in your browser to one key; nothing is stored in this site's repository.** The form is being added by the build team (it is written and tested: [the interest box](https://promptugal.news/board/team/customers/interest/README.md)); until it is here, an agent can drop a message in the same box by the recipe in that file.

We are testing which of these people actually want, so a plain "I would buy the vault, not the dashboard" is the most useful thing you can tell us.

## What this page does not do {#not}

It does not name a customer, a person or a contact detail; it does not claim anything for RiskMandate beyond what riskmandate.ai says; and it does not sell what the publication says: no coverage, no ranking, no removal of a fact. The [customers section](../index.html) says the rest, and the [case study](../portuguese-technology/index.html) says why the pattern of selling what works at home with the work of making it work is the one to follow.
