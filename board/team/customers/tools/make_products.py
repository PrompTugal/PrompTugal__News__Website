#!/usr/bin/env python3
"""Writes board/team/customers/products.json (the register of what can be packaged) and the page
content/newsroom/customers/products/index.md from the one table below, so the register and the page cannot disagree.
The table is curated by customers@PrompTugal.dinis from three inventories made on 6 November 2026 by sub-agents that
read the repository and the live site (board/team/customers/inventory/*.json). Edit the table, run this, commit both.
    python3 -I board/team/customers/tools/make_products.py
No secret, key, contact detail or customer in here, ever. Prices are PROPOSALS (Dinis sets them)."""
import json, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
SITE = 'https://promptugal.news/'
LADDER = {'starter': 500, 'team': 1500, 'build': 5000}
SHELVES = {
    'identity': ('Identity and trust', 'Who is who, who can read what, and how to prove it.'),
    'agents': ('Running agents', 'How a team of AI agents is kept in order.'),
    'publishing': ('Publishing, data and events', 'Making a site, a data set or an event that people and machines can use.'),
}
MATURITY = {'runs': 'Runs today', 'partial': 'Partly runs', 'designed': 'Designed, not built'}
P = []
def add(**k): P.append(k)

add(id='agent-identity', shelf='identity', name='Give every agent its own identity', maturity='partial',
    buyer_says='I like how every agent has its own key and I can check who did what.',
    what='A register of public keys, one per agent. Each agent makes its own session key, publishes the public half, and signs what it makes. Commits and articles say who made them, and the build refuses an unsigned article.',
    today='About two dozen agents hold keys in the register; the publishing gate refuses an unsigned article.',
    limits='The keys are session keys, not yet confirmed on the public PKI register; replacing a key and re-issuing inboxes is done by hand; readers cannot verify a signature themselves yet, only the build can.',
    proof=['board/keys.json', 'articles/newsroom-status-four-days-out.md.sig'],
    starter='The register, the key-making step and the commit convention for up to 5 agents, with a one-page runbook.',
    team='A roster of 10 to 25 agents, a gate check that a commit names an active key, and the replaced-key procedure.',
    build='A rotation and re-issue tool, durable key storage, and a link to your own identity or PKI service.',
    ask='Could you say today which agent changed what, and prove it?', refs=['agent-identity-keys', 'signed-articles-gate'])
add(id='sign-in-with-a-key', shelf='identity', name='Sign in with a key on your phone', maturity='partial',
    buyer_says='I like how people sign in with a key on their phone, with no passwords and no accounts to manage.',
    what='A person signs in with a key handed over as a QR code. The sign-in page and the key tool are small, static and need no server of yours.',
    today='Live at /login/; one person has used it.',
    limits='Only one real person has a key so far. The person who issues a key also holds its private half, which the sign-in page says.',
    proof=['login/'],
    starter='The sign-in page and key tool on a static site, for 1 to 10 named people.',
    team='An issuing runbook, revocation and replacement, and signed-in views for one internal dashboard.',
    build='Sign-in tied to your roles and a real access decision, with a security review.',
    ask='Would your users sign in with a key on their phone instead of a password?', refs=['qr-key-sign-in'])
add(id='personal-vault', shelf='identity', name='Give your users a private vault only their passkey opens', maturity='partial',
    buyer_says='I like how the reader\'s data sits in their own encrypted vault that only their passkey opens.',
    what='A passkey derives a key in the browser; the reader\'s data (a schedule, notes, saved pages) is encrypted there and kept in a vault they own, usable on any of their devices with a recovery code.',
    today='The sign-in and vault pane are built and tested against a mock server and a virtual passkey.',
    limits='Nobody can create a vault on the live site yet: it needs an access key that has not been issued. Opening a vault made elsewhere works without it.',
    proof=['account/vault.html'],
    starter='A passkey-only door that derives a key and encrypts one small record in the browser, with no server vault.',
    team='The full vault pane with recovery code and several devices, wired to your access key and one feature that saves into it.',
    build='Production vault hosting, a second-passkey recovery, and a security review of the whole flow.',
    ask='What would your users want to keep in a vault that only they can open?', refs=['passkey-personal-vault'])
add(id='agent-mailboxes', shelf='identity', name='Let agents message each other, and the public message you, privately', maturity='runs',
    buyer_says='I like how your agents message each other privately, and each message says who sent it.',
    what='Write-only lanes on an encrypted vault server. A message is sealed to the recipient\'s key and signed by the sender, then appended to the recipient\'s lane. A public drop box takes messages from anyone. This page\'s own "I am interested" box is one of these.',
    today='An inbox per agent and a public lane, with a signature check on every read.',
    limits='The inbox keys live in one session; the issuer can read every agent\'s mail by design (accepted, on the security page).',
    proof=['board/inbox.json', 'newsroom/security/'],
    starter='A two-agent sealed message lane with the send and drain commands and a one-page guide.',
    team='An inbox per agent for a team, one public write-only drop box, and a signature check on every read.',
    build='An inbox viewer, receipts and counts, lane rotation, and a message policy enforced in code.',
    ask='Do your agents, or your customers, need to send you messages with no server in between?', refs=['agent-inboxes-append-lanes'])
add(id='private-analytics', shelf='identity', name='Know what is read, without tracking anyone', maturity='runs',
    buyer_says='I like how you know what is read without tracking people: nothing identifying, and it is encrypted.',
    what='One anonymous event per page view, encrypted in the browser to a write-only lane; no cookies, no identifiers; Do Not Track honoured; counts only are published.',
    today='Live on every page; the counts page is public.',
    limits='To show a city or country the reader\'s browser asks two outside services for its place, which the site should say plainly (an open security finding). The drain runs in one session.',
    proof=['newsroom/observability/'],
    starter='The sender and a counts-only drain with country-level places for one site.',
    team='The full drain, a public report page, tagged links, and the disclosure text for readers.',
    build='Self-hosted lanes with no outside lookups, and a privacy review for your regulator.',
    ask='Would you publish your reader numbers if you could do it without tracking anyone?', refs=['privacy-first-analytics', 'signed-agent-activity-log'])
add(id='secrets-and-recovery', shelf='identity', name='Never commit a secret; know who holds what; get it back if lost', maturity='partial',
    buyer_says='I need assurance that secrets cannot be committed by accident, and a plan for when a key is lost.',
    what='A gate that refuses key shapes and contact details before they reach a repository, a register of every key and vault and who holds it, a sealed hand-over of a secret to one named person, and a backup plan with a restore test.',
    today='The gate runs on every push; the sealed hand-over runs.',
    limits='The recovery plan has not been rehearsed; nothing holds a durable backup of the keys themselves; hand-over envelopes are not yet signed by the sender.',
    proof=['board/team/security/keys-and-vaults.md', 'board/team/backup/plan.md'],
    starter='A drop-in secret gate with test cases for one repository.',
    team='The gate, a key and vault map, and a loss runbook for your own estate.',
    build='A recovery vault design, a restore drill, and an agent that reviews commits.',
    ask='If the person holding your keys vanished tomorrow, could you get back in?', refs=['key-leak-gate-and-recovery-map', 'sealed-secret-handover', 'backup-and-recovery-planning'])

add(id='agent-behaviour-policies', shelf='agents', name='A written mandate for every agent, kept in front of it', maturity='partial',
    buyer_says='I like that every one of your agents has a written mandate and that it cannot drift out of it.',
    what='One written policy per agent, held as data. It is printed back into the agent\'s context after every summary, so a long session cannot forget it. Every tool call is logged, every run ends with a report, and an hourly review reads them. The idea of an Agent Behaviour Policy and a licence to operate is RiskMandate\'s (riskmandate.ai); what is sold here is our working version of it, and nothing is claimed for RiskMandate beyond what it says itself.',
    today='The policy files, the re-anchoring, the run reports and the hourly review run.',
    limits='The hooks log and block nothing today: they are in observe mode, by decision, after blocking stopped agents in the first hour. They are specific to Claude Code. They see the command, not what a script does once started. A real case they did not catch is on the page about [a token printed to a transcript](../../decisions/an-agent-printed-its-own-lane-token/index.html).',
    proof=['board/abp/policies.json', 'board/abp/reports/2026-11-06-12.md'],
    starter='A policy file and generated per-agent policies for up to 5 of your agents, with the re-anchoring hooks installed.',
    team='Grants for a whole team, the relaxation process, a self-check of the hooks, and a test suite for your rules.',
    build='Adaptation to a runtime other than Claude Code, and a review of your policy against your own governance framework.',
    ask='Could you write, for each of your agents, what it may do and may not do, on one page?', refs=['agent-policy-files-and-reanchoring', 'agent-policy-enforcement-hooks-and-breakers', 'agent-run-reports-and-hourly-review'])
add(id='agent-team', shelf='agents', name='A team of agents run like a newsroom', maturity='partial',
    buyer_says='I like how you manage your agents: who owns what, who reviews whom, and how you swap one out.',
    what='A charter and a status file per agent, specialist workers whose work a main agent reviews, a handover protocol, a stop button, an hourly wake with a dashboard, focused rounds of work ("passes") with a fixed order and a budget, an accountant agent, and a pipeline that carries each story from idea to published.',
    today='About two dozen agents run on it now: the roles, the wake, the dashboard and the review gate run.',
    limits='No pass has closed yet. Budgets warn and do not stop. The handover has run once and the stop button has never been used.',
    proof=['newsroom/dashboard/', 'newsroom/stories/', 'board/the-passes.md'],
    starter='Charter and status-file templates and a review-branch workflow for a team of 3 to 5 agents.',
    team='Worker branches, the review gate, per-agent keys, the handover protocol and a stop file for a team of 10.',
    build='A roster dashboard and a rehearsed handover for each of your roles.',
    ask='How do you decide today what each of your agents may start, and who reads what it did?', refs=['agent-team-structure-roles-workers-handover', 'hourly-wake-protocol-and-conductor-dashboard', 'agent-passes-focused-rounds', 'agent-budgets-and-accountant', 'story-pipeline-projects-and-open-tasks'])
add(id='invented-readers', shelf='agents', name='Invented readers test your pages', maturity='runs',
    buyer_says='I like that your agents tested the site as a founder, a CISO and a journalist would, and told you what lost them.',
    what='A set of invented readers (a founder, a CISO, a journalist, an investor, someone who has just had an outreach email) read the pages on a phone and a desktop and report what works, what confuses and what loses them, plus a reader\'s-guide agent that ranks the fixes.',
    today='Eight rounds run; findings, screenshots and a scoreboard are public.',
    limits='These are a language model\'s guesses, not evidence about real readers, and the page says so. Most findings had no recorded decision at the time of reading.',
    proof=['newsroom/synthetic.html'],
    starter='One round of 4 to 5 invented readers on your top pages, a ranked findings list and screenshots.',
    team='A findings ledger with owners, a re-read after each fix, and a scoreboard page.',
    build='A reader\'s-guide agent reviewing every release and wiring findings into your tracker.',
    ask='When did someone who is not you last try your site cold, and what did they say?', refs=['synthetic-readers-and-sherpa-review'])
add(id='commit-reviewer', shelf='agents', name='A second agent that checks what the first one commits', maturity='partial',
    buyer_says='I like that a separate agent checks what the others commit, and that you know which key lives where.',
    what='A security agent reads commits for keys, contact details, private data and harm before and after each pass, keeps a ledger of findings with owners, and can stop the team with a hold file.',
    today='A public security page, a findings ledger and a keys-and-vaults register.',
    limits='Most findings were still open when this was read; a review is only as good as the fixes. Keys live in session containers and are not yet backed up.',
    proof=['newsroom/security/'],
    starter='A commit-review checklist and gate checks for secrets and contact details in your agents\' repository.',
    team='A security agent with a findings ledger, a hold file, and pre- and post-reviews of each pass.',
    build='A key and vault register and a recovery plan for session and key loss.',
    ask='Who looks at what your agents commit before it goes live?', refs=['agent-security-review-and-keys-register'])

add(id='publish-a-site', shelf='publishing', name='Publish a site like this one, that people and AI both read', maturity='runs',
    buyer_says='I want to publish a website like this, where every change is checked and versioned, and AI can read it.',
    what='A build with no dependencies, a gate of checks that must print OK before anything ships, CI that numbers every release, one command to release, and for every page a markdown twin, an llms.txt, a sitemap and a JSON API, with signed articles.',
    today='Every page here is built this way; every release is public.',
    limits='The browser tests are run by hand; CI runs the gate only. Protection of the main branch is not set.',
    proof=['newsroom/versions.html', 'llms.txt', 'api/'],
    starter='The machine stood up in your repository with your brand shell, one content section and the gate green.',
    team='A data-driven section (your products or events), custom checks in the gate, and the release flow.',
    build='A full publication on the machine: data model, several sections, JSON API, markdown twins, signed articles and CI.',
    ask='Could an AI assistant read your website as well as a person can?', refs=['static-publishing-machine', 'agent-readable-site-surface'])
add(id='sourced-knowledge-graph', shelf='publishing', name='A database of your market where every fact has its source', maturity='runs',
    buyer_says='I want a database of my market where every fact has a source and a date, and I can see how things connect.',
    what='Entities as JSON folders with schemas, a small ontology, data derived from the hand-edited files, a source and a date read for every claim, re-checks, and an explorer that walks the graph.',
    today='About 1,600 nodes in the live explorer, with a JSON file per entity.',
    limits='Re-checks are run by hand. No source capture is yet tied to a vault. Wikipedia has been read as data for one article only, and its page is not live.',
    proof=['graph/', 'api/'],
    starter='A schema and folder layout for one entity type from your data, with sources and read dates, checked by the gate.',
    team='A small ontology, a derivation from your spreadsheets or CRM, the gate, and a JSON API.',
    build='A full sourced knowledge base for your market with a re-check routine and the explorer.',
    ask='Which ten things in your market would you most like to see connected, with sources?', refs=['knowledge-graph-and-sourced-data', 'graph-explorer', 'wikipedia-as-data'])
add(id='event-site', shelf='publishing', name='An event site where every session, speaker and company is linked', maturity='runs',
    buyer_says='I want an event site where every session, speaker, stage and company is a linked page, with data behind it.',
    what='The agenda as data: a page per session with its speakers, place and source, past editions as events, a now-and-next strip, and a JSON file for every page.',
    today='More than 200 agenda items for this summit and its past editions are live.',
    limits='Past editions carry mostly dates and venues so far. "Today" moves when the site is released, not by the clock.',
    proof=['summit/agenda.html'],
    starter='Your schedule spreadsheet turned into an agenda page and a page per session, with JSON and markdown.',
    team='Speakers, places and topics as linked entities, the live now-and-next strip and a graph view.',
    build='A full event site over several editions, with company and speaker pages and a refresh routine.',
    ask='What do your attendees do today when they cannot find a session?', refs=['event-agenda-and-past-editions'])
add(id='personal-schedule', shelf='publishing', name='A schedule and a debrief made for one person', maturity='designed',
    buyer_says='I want my attendees to say who they are and get a schedule, and afterwards a debrief of what happened for them.',
    what='The person says who they are (an investor, a founder, a CISO, a company); the agenda and the graph give them a schedule; after the days, a newsreel of what was published in their slice, each point with its source, delivered to their own vault.',
    today='Nothing is built: no code for personas, schedule or newsreel yet. What can be sold now is a hand-made schedule or debrief for one named person or group, made by agents from the agenda data and checked by a person.',
    limits='This is a design and a bespoke service, not a product. See the brief for the newsreel.',
    proof=['summit/agenda.html', 'board/team/customers/briefs/2026-11-06-the-personal-newsreel.md'],
    starter='A hand-made personal schedule for one person or delegation, from the agenda data.',
    team='A persona picker for three to five personas over your agenda, saved in the browser, with a printable schedule.',
    build='A full personalised schedule and debrief for your event, with the graph and a sealed vault delivery.',
    ask='Would an attendee pay for a plan and a debrief made for them, and what would it be worth?', refs=['personal-schedule-from-personas'])
add(id='pay-as-you-read', shelf='publishing', name='Let readers pay a little for what they read', maturity='partial',
    buyer_says='I want readers to pay a little for what they read, with prices that depend on how fresh it is, and never a wall.',
    what='A reading meter that prices each page by its kind and its age and never blocks a page, an account page with a history, and a top-up through a Stripe Payment Link.',
    today='Live here: the price table is published and the meter is generated from the same file.',
    limits='The page cannot check a payment: the credit trusts the reference Stripe returns, which is fine for small sums and not for large ones. The top-up link returns to the older site.',
    proof=['account/billing.html', 'account/top-up.html'],
    starter='The meter and price table on your static site with your own Stripe Payment Link.',
    team='Page-kind pricing, freshness rules, an account page and a published billing page.',
    build='The full pay-as-you-read model including payment verification (not built here), a reader vault and receipts.',
    ask='Would your readers pay a few pence a page if it never blocked them?', refs=['reading-meter-and-account'])
add(id='search-and-ask', shelf='publishing', name='Search and a chat over your own pages, with no server', maturity='partial',
    buyer_says='I want search on a static site with no server, and a chat that answers from my pages using the reader\'s own key.',
    what='A sharded search index built at every release and searched in the browser, plus an Ask chat that uses the reader\'s own model key, kept in their browser and sent only to the model provider.',
    today='Search is live; the chat is built.',
    limits='The chat has only been tested against a mock: no answer from a real model has been seen yet.',
    proof=['search/'],
    starter='The sharded browser search on your static site with your facets.',
    team='The Ask chat over your data with the reader\'s-own-key pattern and the page tool API.',
    build='Full search, chat and signed-in reader views with a profile and a vault, and tests in CI.',
    ask='What do people search your site for, and do they find it?', refs=['search-and-ask-chat'])
add(id='infographics', shelf='publishing', name='An infographic for every article, with every word checked', maturity='partial',
    buyer_says='I want a branded infographic for every article, using only the facts in it.',
    what='A generator for branded images from an article\'s own facts, in two styles and three sizes, with every word checked against the article; and an AI route that tries a ladder of image models and logs each call and its cost.',
    today='61 images exist in the repository.',
    limits='No article page shows one yet. The AI route\'s credit was used up on the first day.',
    proof=['design/infographics/out/'],
    starter='Ten branded infographics from ten of your articles, with the facts file and the generator.',
    team='The generator and styles installed so you can make more, with a rule that logs the cost.',
    build='Images wired to every article page and social card, with a house style system and a cost-controlled AI route.',
    ask='How many of your articles have an image that says what the article says?', refs=['ai-article-images-and-infographics'])
add(id='control-centre', shelf='publishing', name='One page that shows what your team and agents are doing', maturity='runs',
    buyer_says='I want a live view of what my team and my agents are doing, what is blocked and what waits on me.',
    what='A dashboard and quality pages built from each agent\'s own status file and the git history: who woke, what they did, what is waiting on the operator, and how much of the site is words in code.',
    today='Live; rebuilt at every release.',
    limits='Only as fresh as each agent\'s last status; the run ledger is not yet automatic.',
    proof=['newsroom/dashboard/', 'newsroom/quality/'],
    starter='A team status page generated from your git history and a status file per person or agent.',
    team='A run ledger, a wake grid, a "waiting on you" list and a code-versus-content check in the gate.',
    build='A full control centre for an agent or editorial team: dashboard, timeline, release history and decision pages.',
    ask='How do you find out today what your team did overnight?', refs=['newsroom-dashboard-and-quality-pages'])
add(id='made-by-agents-method', shelf='agents', name='A book, a deck or a small newsroom made by agents, with every claim sourced', maturity='partial',
    buyer_says='I want what Dinis did with his book and presentation: agents that map, find the evidence, visualise and review, round the clock.',
    what='The multi-pass method: one agent maps the subject, another finds the evidence, another visualises, another reviews, over hours, with each round one change and a budget. The team\'s earlier book work is its model, recorded in the historian\'s brief.',
    today='The method runs here as passes; the book itself is Dinis\'s earlier work and is not part of this repository.',
    limits='It is a method and a service, not a program: its results depend on the people who run it. No pass here has closed yet.',
    proof=['board/the-passes.md', 'board/briefs/2026-11-06-what-the-book-team-did.md'],
    starter='One piece (a chapter, a deck of ten slides or a report) made by the method, with the record of how.',
    team='A longer work made by the method with a reviewer set, a findings ledger and a hand-over.',
    build='A finished book, deck or small newsroom, with a hand-over so you can do the next one.',
    ask='What would you make if the research and checking took hours instead of weeks?', refs=[])

def stamp():
    out = {'about': 'The register of the technology this team has made work and could package as pieces of work, one row per product; written by board/team/customers/tools/make_products.py from the table in it, which is curated from three inventories by sub-agents of 6 November 2026 (board/team/customers/inventory/). Prices are proposals: Dinis sets them. The code is open source (Apache-2.0); what is sold is making it work for a buyer. Nothing here is a customer, a contact detail or a secret.',
           'updated': '2026-11-06', 'ladder_gbp': LADDER, 'shelves': {k: {'name': v[0], 'line': v[1]} for k, v in SHELVES.items()}, 'maturity': MATURITY, 'products': P}
    json.dump(out, open(os.path.join(ROOT, 'board/team/customers/products.json'), 'w'), indent=2, ensure_ascii=False)

def link(p):
    # a repo path or a site path; every proof is served by the site
    return f'[{p}]({SITE}{p})'

def page():
    L = []
    L.append('---')
    L.append('title: What we can package: the products')
    L.append('summary: "The pieces of technology this team has made work, packaged as pieces of work anyone can ask for: what each is, how much of it runs today and what does not, where to see it, and what a first, a second and a third piece of work would be. Open source; what is sold is making it work for you."')
    L.append('---')
    L.append('**A draft shelf, not yet promoted.** This is the product map of PrompTugal.news for the customers section, made on 6 November 2026 for Dinis Cruz. Everything here runs on this site or in this repository, and the code is open source (Apache-2.0): **you can take it. What we sell is making it work for you.** Each product says plainly how much of it works today, because the first thing we sell is that it does what we say. Prices are proposals, and no work starts without a scope and a fixed price in writing.')
    L.append('')
    L.append('## How to read this {#read}')
    L.append('')
    L.append('| Label | Meaning |')
    L.append('|---|---|')
    L.append('| **Runs today** | it works on this site now; you can see it |')
    L.append('| **Partly runs** | it works with a limit, stated on its card |')
    L.append('| **Designed, not built** | described and costed; what we can do now is a bespoke job |')
    L.append('')
    L.append(f'**{len(P)} products on three shelves.** ' + ' '.join(f'{SHELVES[s][0]}: {sum(1 for p in P if p["shelf"] == s)}.' for s in SHELVES))
    L.append('')
    L.append('| Product | How much runs | Say it like this |')
    L.append('|---|---|---|')
    for p in P:
        L.append(f'| [{p["name"]}](#{p["id"]}) | {MATURITY[p["maturity"]]} | "{p["buyer_says"]}" |')
    L.append('')
    L.append('## Three sizes of work {#ladder}')
    L.append('')
    L.append('Every product comes in the same three sizes, so the choice is *which product*, not *which price*. **Proposals, to be set by Dinis.**')
    L.append('')
    L.append('| Size | Proposed price | Shape |')
    L.append('|---|---|---|')
    L.append('| **Starter** | £500 | one small piece set up and shown working, in about a week |')
    L.append('| **Team** | £1,500 | the version for a team, with the checks and a hand-over, in about two weeks |')
    L.append('| **Build** | £5,000 | the full version made to your needs, with a review and a hand-over |')
    L.append('')
    L.append('Delivery is by a named partner with this team\'s agents; a person checks it and hands it over; a person sends the invoice. Nothing is sold that is not described on its card.')
    for s, (nm, line) in SHELVES.items():
        L.append('')
        L.append(f'## {nm} {{#shelf-{s}}}')
        L.append('')
        L.append(f'*{line}*')
        for p in [q for q in P if q['shelf'] == s]:
            L.append('')
            L.append(f'### {p["name"]} {{#{p["id"]}}}')
            L.append('')
            L.append(f'**{MATURITY[p["maturity"]]}.** "{p["buyer_says"]}"')
            L.append('')
            L.append(p['what'])
            L.append('')
            L.append(f'- **Today:** {p["today"]}')
            L.append(f'- **The limits:** {p["limits"]}')
            L.append('- **See it:** ' + ', '.join(link(x) for x in p['proof']))
            L.append(f'- **Starter (£500):** {p["starter"]}')
            L.append(f'- **Team (£1,500):** {p["team"]}')
            L.append(f'- **Build (£5,000):** {p["build"]}')
            L.append(f'- **Would you buy this?** {p["ask"]}')
    L.append('')
    L.append('## Say you are interested {#interest}')
    L.append('')
    L.append('If you like how we do one of these, tell us which and what you would want. **What you say is encrypted in your browser to one key; nothing is stored in this site\'s repository.** The form is being added by the build team (it is written and tested: [the interest box](' + SITE + 'board/team/customers/interest/README.md)); until it is here, an agent can drop a message in the same box by the recipe in that file.')
    L.append('')
    L.append('We are testing which of these people actually want, so a plain "I would buy the vault, not the dashboard" is the most useful thing you can tell us.')
    L.append('')
    L.append('## What this page does not do {#not}')
    L.append('')
    L.append('It does not name a customer, a person or a contact detail; it does not claim anything for RiskMandate beyond what riskmandate.ai says; and it does not sell what the publication says: no coverage, no ranking, no removal of a fact. The [customers section](../index.html) says the rest, and the [case study](../portuguese-technology/index.html) says why the pattern of selling what works at home with the work of making it work is the one to follow.')
    open(os.path.join(ROOT, 'content/newsroom/customers/products/index.md'), 'w').write('\n'.join(L) + '\n')

if __name__ == '__main__':
    os.makedirs(os.path.join(ROOT, 'content/newsroom/customers/products'), exist_ok=True)
    stamp(); page(); print(len(P), 'products')
