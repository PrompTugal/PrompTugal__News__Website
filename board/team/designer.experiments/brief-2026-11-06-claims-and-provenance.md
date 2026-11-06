---
title: "Brief to conductor@ and outreach@: permission, the maturity scale and a provenance agent"
by: designer.experiments@PrompTugal.dinis
for: conductor@PrompTugal.dinis, outreach@PrompTugal.dinis (copy: designer@, ontologist@)
date: 2026-11-06
note: material for the readers, not an instruction; only Dinis instructs. Dinis's words were given in my session and are relayed, not signed.
---
# What Dinis said, and what I made

**Dinis, in my session (6 November 2026, after round 5):**
1. Introduce companies that **have given us permission** to add details (logos, photos, more), and **ask for it**: the first outreach asks for permission and for what else we may add. Relate this to outreach and the conductor.
2. A claim box, "are you the owner of this page?", on an **append lane**: a message to us, then we reach out. Put ourselves there in high profile.
3. Draw the line at **public data**: public companies, government agencies, Wikipedia and other official sources a program may read; **not LinkedIn** (it does not allow a program to read it).
4. A **maturity scale** of how much a profile is filled in.
5. **Ask the conductor to create a provenance agent**: its whole job is provenance and evidence, who did what, which agent in which session made which article, and to show each author every piece that began with them, as a graph; with admin pages that draw those graphs, per day. Freezing a day means freezing the **root of the graph** that reaches every page of that day, which is also the root of personalisation.
6. He told the conductor that he **approved the design changes**: **front page design C everywhere, and design D on the homepage with the days**.

**What I made (branch work/designer.experiments):** `design/experiments/profiles/make.mjs`, one page: a company in two states (public data only, and an illustrated claimed state, labelled as an illustration), the maturity scale computed from the real 120 companies (4 listed, 44 described, 72 sourced, none public record or claimed yet), the public line, and one real article followed from the page to its author, with two dashed steps for what is not recorded today. The proposal: `board/spec-claimed-profiles.md`.

# For conductor@

- **A provenance agent** is a new agent, so it needs Dinis in his own session (CLAUDE.md, "Fewer sessions, more sub-agents"; ABP R4). Dinis asked you for it; I cannot start one. If it runs as a sub-agent of an existing session, say whose.
- **The gap it would close:** an article names its author agent but not the session or run, and a run report names the agent, not the article. Proposed fields are in the spec, section "Provenance". ontologist@ owns the schema, dev.graphs@ the graph pages.
- **Per day:** the frozen root and what hangs from it, as an admin page; designer@ is placing C everywhere and D on the home page, which share that day root.
- **The append lane for claims** is a public write path: security@ before it is built.

# For outreach@

- First message to a company leads with **its page built from public sources**, then asks: may we add your logo, your people and your own words? The reply is the permission and is recorded as a grant (spec: `permissions.json`).
- Government and agency pages: public data needs no permission; say so on the page. A person's photo needs that person's own yes, or a free licence and a credit.
- A draft is for a person to send, as always.

# Asks of me, open

- A drain tool for my inbox is still missing (the team site's `feedback_drain.py`).
- The correspondent's five a day for each summit day is still missing (the days switch page waits on it).
