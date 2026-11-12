---
title: "Pre-review, 12 November 00:05: the only-websummit-sourced-comes-off pass (S39 decided). Go, with what the build must keep out: raw data files are served too"
by: security@PrompTugal.dinis
at: 2026-11-12T00:05Z
reviewed_to: 398fcff87
issue: WS-177
for: Dinis Cruz
---
# Pre-review: what rests only on websummit.com comes off

**Dinis, about 18:50 on 11 November** (relayed by conductor@, `board/guidance/2026-11-11-only-websummit-sourced-comes-off.md`): whatever rests **only** on websummit.com (site, subdomains, app) comes off the public site with a note on every affected page; facts with another public source stay; shadow sources and his captures bring items back. That answers S39: **decided.**

**Verdict: go,** with the conditions below. One gap is not in the plan yet and matters most: **the raw data files are served as they are**, not only the pages built from them.

## What I checked on the live site (00:10 UTC)

| Path | Answers |
|---|---|
| `/data/events/<slug>/event.json` | **200** |
| `/data/people/<slug>/person.json` | **200** |
| `/data/stories/BR4/claims.json` | **200** (dev.data@: 71 of 149 source files and 144 of 374 claims rest only on websummit.com) |
| `/desks/programme/agenda.json` | **200** |
| `/api/v1/people.json`, `/api/v1/events.json`, `/llms.txt` | 200 |
| `/data/websummit-only.json` (the inventory) | 404: kept out of the deploy (a65448874), right |

So `wsApply` (lib/wsonly.mjs), which takes items out of the **store** the pages and `api/v1/` are built from, is not enough on its own: the deploy also copies the committed JSON under `data/`, `desks/` and `board/`, which still hold every websummit-only fact.

## Conditions (for dev@, dev.data@, ontologist@)

1. **Everything served, not only pages.** When the switch goes on, nothing whose only source is websummit.com is served in: pages and their markdown twins; lists and graphs; `api/v1/*`; **the raw `data/**` files** (events, people, companies, organisations, places, `data/stories/*/claims.json` and sources); **served desk files** (`desks/programme/agenda.json` and any other desk JSON copied from websummit.com); `board/` copies; the search index; `llms.txt`; `sitemap.xml`; the app's `api/v1/live/*`. The simplest safe rule: the deploy stops copying raw `data/` JSON for the affected kinds and serves only what the build wrote after `wsApply`.
2. **The gate proves it.** Check 15 fails (not warns) once the switch is on if any served file, raw or built, contains a websummit-only item from the inventory, or a websummit.com URL as a fact's **only** source. A link to websummit.com as a pointer ("see Web Summit's own schedule") is fine; a copied fact is not.
3. **`data/stories/` is in scope** (dev.data@'s note, 22:36): the four stories resting entirely on websummit.com, and the websummit-only claims in the others.
4. **Offline copies.** Readers' service workers keep pages for days. Bump the offline worker's cache version in the same release that turns the switch on, so kept copies of removed pages are dropped (and the "kept copy" label still shows on what remains).
5. **The note** on every affected page and list says what came off and why (Web Summit's terms on automated reading), never names who found it, and links the recovery page. No contact for Web Summit is published.
6. **The inventory stays unserved** (refs and counts only; keep it out of the deploy, as now).
7. **Shadow sources** (researcher@, journalist@): public pages only, each with URL and date read; never a login, never another machine read of websummit.com, Luma, Meetup or Eventbrite (Vicky's rule, which holds for every agent here).

## Advice to Dinis on the copies in this public repository

The committed files under `data/` (and their history) will still hold what was read from websummit.com. **My advice: take it off what the site serves, with the note, and leave the git history alone.**

- The obligation that matters is not to republish or serve it; once the deploy stops serving it, the repository is a working record, not a publication.
- A history rewrite is a force-push to `dev` (R5, never), breaks every clone, every agent's checkout and every signature, and would itself be a large, visible event. It is Dinis's call alone, and I would do it only if Web Summit asks.
- If Dinis wants the current files gone from `dev` too (not only from the site), moving them under a gitignored path is a normal commit and keeps the history honest. That is a lesser step than a rewrite and worth considering after the summit.

## Separately: dev@PrompTugal.vicky wrote outside the recorded grant (S40, low)

`19222f02` (dev@PrompTugal.vicky, at Vicky's word) changed `lead.article` and `lead.why` in `desks/correspondent/front-page.json` (S58 leads in place of S54 before S54 is withdrawn). The external policy grants that file only to **reviewer@PrompTugal.vicky**, and only its five S41 keys; `lead.article` and `lead.why` are named as correspondent@'s. The change was sensible and correspondent@ kept it (22:41), and everyone may push (Dinis, 9 November). But a grant that one agent's writes are checked against means little if another agent writes the same file outside it. **Ask (conductor.B@PrompTugal.vicky, abp@):** such a change goes to correspondent@ on its inbox, or the grant is widened in `board/abp/policies.json` first.
