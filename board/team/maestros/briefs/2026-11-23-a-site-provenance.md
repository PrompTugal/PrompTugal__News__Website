# Every site lists every agent that touched it, with provenance (Dinis, 23 Nov 2026 ~23:00 UTC, in a.maestro's session)

Recorded by a.maestro (account-a). Dinis, looking at donna-freed.author.sovereignweb.site:
- "we need to start by listing every agent that work on it ... including the sessions ... link to the respective website, the agent, because remember that every agent should have a website, and inside every website there will be a session"
- "we need to make sure that every single agent that touches a website like this is registered with provenance ... that's also a great way to have a graph and to figure out I can catch everything."

## What exists
Each Factory-seeded site has `site/data/agents.json` and an `/agents/` page. Donna's, for example, lists one agent, donna-freed.d, with its role and session. The list is **hand-kept** ("each site agent adds its own entry"). So it misses:
- sites.d, which started the site;
- the Factory bot, which seeded it;
- any reviewer;
- a link to each agent's own site.

It also drifts whenever an agent forgets to add itself.

## The proposal: derived, not declared, and enforced
1. **Derived by the build.** The build reads the site's git history and its provenance log, and writes `site/data/agents.json`. For each agent it records:
   - the name and the role;
   - the home: the agent's own site, `Site__Agent__<Role>` with its `accounts/<x>/` area;
   - every session (each a link);
   - the first and last commit, and the count;
   - the key fingerprint from the Factory's keys.

   The Factory bot's seed commits, and the Factory request that created the site (with whose word), are included.
2. **Agents that act without committing are logged.** An agent that starts, reviews, relays or decides on a site appends one signed line to `site/data/provenance.jsonl`: who, what, when, session, and the commit or decision id. This covers sites.d starting it, a security review, b.decisions's record, and a maestro's relay.
3. **Enforced.** CI refuses a commit without `Agent:` and `Claude-Session:` trailers, or one signed by a key not on the Factory. This joins signers.mjs's existing check. So no agent can touch a site without being registered.
4. **Shown.** Every page's footer carries "Who made this", linking to `/agents/`. That page shows each agent: name, role, account, a link to its home site, its sessions, what it did and when, newest first. A problem gets a "who to ask" line: the agent that last touched that page.
5. **The graph.** The Hub (and holacracy's team index) aggregates every site's agents.json and provenance.jsonl into one graph: sites, agents, sessions, accounts, decisions. Dinis can start from a site and reach the agent, its session and its home.

## Owners
- **Factory seed, generator and CI check:** factory.c and d.factory, built once in the seed and rolled to every site by org-apply.
- **The page and footer:** d.design with d.sites.
- **The graph:** d.holacracy and the Hub.
- **Review:** security, for the CI check.

First site: Site__Author__Donna-Freed.
