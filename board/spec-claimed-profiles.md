---
title: "Spec: claimed profiles, the maturity scale and provenance"
by: designer.experiments@PrompTugal.dinis, for designer@, outreach@, ontologist@, dev@ and conductor@
source: Dinis, 6 November 2026, after round 5 (his words relayed in the session; the mock-up is design/experiments/profiles/make.mjs)
status: proposal for review; nothing built
---
# Claimed profiles, the maturity scale and provenance

## What Dinis asked for

1. Companies that **gave us permission** to add more: logos, photos (people), more details.
2. Ask first: the **first outreach** to a company asks for permission and for what else we may add.
3. **"Are you the owner?"** on a page: a message into an **append lane**; we then reach out. We put ourselves there in high profile.
4. A **line** between what we may show without asking (public companies, agencies, data a program may read, such as Wikipedia and official sources) and what we may not (LinkedIn does not allow programs to read it).
5. A **maturity scale** of how filled in a profile is.
6. **Provenance**: for any page, which agent, from which session, wrote it, and what it drew from; to show an author every piece that began with them. The day's graph root is frozen; that root reaches every page of the day, and is also the root of personalisation.

## The scale (computed from data today)

| Level | Name | Earned by | Today (of 120) |
|---|---|---|---|
| 0 | Listed | name and attending | 4 |
| 1 | Described | what, field, country, website | 44 |
| 2 | Sourced | three or more sources, each read and dated | 72 |
| 3 | Public record | matched by a program to Wikipedia or an official register | 0 (no mapping yet) |
| 4 | Claimed | the company gave permission | 0 |

The count is by `design/experiments/profiles/make.mjs`; the rule is a proposal, ontologist@ owns the real one.

## The permission record (a proposal for ontologist@)

One file per grant, beside the company: `data/companies/<id>/permissions.json`. Each entry: `scope` (logo, people-photos, details, or a named person), `granted_by` (a role at the company, never a contact detail), `granted_on`, `evidence` (the message on the append lane or the reply, by id), `licence` (what we may do with it), `revocable: true`, `revoked_on`. A page shows what a grant covers and nothing more. A person's photo needs that person's own yes, or a free licence and a credit. Taking back is one message; the page changes at the next build.

## The claim box

On every company page and later every organisation page: "Is this your company? Tell us." It posts to an **append lane** (the same kind as the agents' inboxes: append-only, sealed to the conductor and outreach@). No address is shown; no one is told "we will email you" before a person has looked. Until the lane exists, the box is a mailto-free message with the company, the sender's role and a way to reach them, held by the conductor. Security@ reviews this before it is built (a public write path).

## Outreach

First message to a company leads with its page, built from public sources: "here is your page; may we add your logo, your people and your own words?" The reply is the permission and goes on the record. outreach@ drafts, a person sends (outreach@'s rule). Government and agency pages need no permission for public data; say so on the page.

## Provenance (the part that is missing today)

An article's front matter names the author agent. It does not name the **session** or the **run**; the run report names the agent, not the article. Proposed: each article and each data file carries `made_by` (agent), `session` (id), `run` (report id) and `drafted_from` (desk draft); the build writes a **provenance graph** (page → author → session → sources → day root), and a section of `/newsroom/` shows it per agent ("everything that started from journalist-europe") and per day (the frozen root and what hangs from it). A provenance agent owns this; see the brief to conductor@.

## Who does what

designer@: takes the mock-up into the system. outreach@: the first message and the permission reply. ontologist@: the record, the scale, the Wikipedia mapping. dev@ and dev.graphs@: the claim box, the per-agent and per-day graph pages. security@: the public write path. conductor@: the provenance agent, and routing.
