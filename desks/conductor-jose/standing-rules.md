---
title: "Jose's standing rules for his PrompTugal desks"
by: conductor@PrompTugal.jose
written: 2026-11-16T19:35Z
---
# Standing rules

Jose's rules for his own desks, in his words, each dated. They may only narrow Dinis's rules (`CLAUDE.md`, R1 to R11 in `board/abp/policies.json`, `board/guidance/`); where one would widen them it is not followed and Jose is told.

## What Dinis has said about Jose's agents

Recorded by conductor.b@PrompTugal.dinis in `board/guidance/2026-11-16-restart-here-go.md` (16 November 2026, about 19:25 UTC). Dinis to Jose: "you go ahead, and tell those agents to coordinate and sync with mine, your agents should push to the site and areas, just like mine." The guidance file's reading: conductor@PrompTugal.jose and local@PrompTugal.jose go ahead, under the same rules, and coordinate with Dinis's team; local@ takes the Algarve towns' local outlets (RSS or API), public contributors and draft first contacts; researcher@PrompTugal.dinis takes the district capitals and the national media; ontologist@PrompTugal.dinis owns the `media` kind both write to; outreach@PrompTugal.dinis and local@ share one draft format, and a person sends.

## J1: the three cards (Jose, 16 November 2026)

"Jose has taken three: 1 Awareness, 2 Contributors, 3 Local news partners. Work only on those."

## J2: the roadmap changes no rule (Jose, 16 November 2026)

"The roadmap adds work; it changes none of the rules above. Where it and a written rule (CLAUDE.md, board/abp/policies.json, board/guidance/) seem to differ, do nothing on that point and tell Jose, who asks Dinis."

## J3: public contacts only (Jose, 16 November 2026)

"Public contacts only: record the URL of the page where an organisation publishes its contact, with the date read. Never write an address or number in desks/ (the gate refuses it)."

## J4: agents draft, a person sends (Jose, 16 November 2026)

"Agents draft, a person sends. ... You never send, post or use a mail connector."

## J5: read, never edit, the others' desks and data (Jose, 16 November 2026)

"Never edit desks/outreach/, desks/synthetic/, desks/correspondent/, desks/journalist-promptugal/ or data/: read them, and write your version in your own desk."

## J6: write only in your own desk until the grant is written (Jose, 16 November 2026, in local@'s prompt)

"Until that reply is recorded in board/guidance/ by one of Dinis's agents, AND abp@PrompTugal.dinis has added your write paths to board/abp/policies.json, you write only in desks/local-jose/ and your own entry in board/keys.json." Both halves are met since 16 November 2026, 20:00 UTC (`board/abp/policies.json` v1.14.0, `external.by_agent`): this conductor may write `desks/conductor-jose/**` and `board/runs/conductor-jose/**`; local@ may write `desks/local-jose/**`, `board/runs/local-jose/**` and `data/organisations/*.json` (media kind only). abp@ has since corrected the last pattern to `data/organisations/*/organisation.json`. Jose has not yet said whether local@ writes records there itself or keeps handing them to ontologist@.

## J7: no schedule for local@ (Jose, 16 November 2026, in local@'s prompt)

"No schedule: you run only when Jose starts you."

## J8: local@ files its run reports (Jose, 16 November 2026, about 21:55 UTC)

Jose's words, to this conductor: "say yes". Read by this conductor as his answer to local@'s ask whether it files run reports in `board/runs/local-jose/` from its next run (R10; the grant covers the folder). That reading is this conductor's.

## J9: local@ writes its media records itself (Jose, 16 November 2026, about 22:05 UTC)

Asked "whether local@ now writes its media records in data/organisations/ itself or keeps handing them to ontologist@", Jose's word: "yes". Within the grant only: `data/organisations/*/organisation.json`, the media kind, ontologist@'s schema, never a record ontologist@ or researcher@ wrote beyond adding its own facts with source and date read (`board/abp/policies.json`, `external.by_agent`).

## J10: this conductor is the main orchestrator of Jose's PrompTugal agents (Jose, 16 November 2026, about 23:05 UTC)

Jose's words: "i want you to be the main orchestrater". In practice, and only inside Dinis's rules: Jose's agents (local@, writer@) read this file at every run and take from it the order of their work and Jose's answers; they put what they need from Jose in their own `status.json` asks, which this conductor gathers into one list for him; what needs Dinis's team goes through this desk's `requests/`. This conductor still starts, schedules, pauses and messages no session (R4): Jose starts each run by hand. That reading is this conductor's.

## J11: the self-check before every push (Jose, 17 November 2026, about 11:45 UTC)

Proposed by this conductor and agreed by Jose ("ok"). It only narrows what Jose's agents push; it replaces no review by Dinis's team (journalist@, security@, ontologist@, abp@).

Before every push, each of Jose's agents (this conductor, local@, writer@) checks its own commits, and does not push if a line fails:

1. **Paths:** `git diff --name-only origin/dev...HEAD` shows only paths in the agent's grant (`board/abp/policies.json`, `external.by_agent`).
2. **No contact detail:** no email address or phone number anywhere, and no private person named.
3. **Sources:** every fact added carries its source URL and the date read.
4. **No overclaim:** nothing presents an outlet's or a person's possible interest as agreement, and no draft promises more than is live.
5. **The gate:** `node newsroom/build/validate.js` printed OK.

The commit's body carries the line `Self-check: passed (J11)`. A check that fails is fixed, or the push is not made and the agent's `status.json` says why. At each run this conductor reads the latest commits of Jose's other agents against the same five lines and tells Jose if one slipped.

## Said by Jose and not recorded as a rule

- "go for R4" (16 November 2026, about 21:55 UTC), on the network change he made by hand. R4 is Dinis's rule: an environment change needs Dinis's own yes, and a standing rule of Jose's may not widen it. The question is with Dinis (`requests/2026-11-16-conductor.b-four-questions-for-dinis.md`, point 1).
- "try Sul Informação" (same message). Its robots.txt refuses Anthropic's agents by name; whether an agent may read it is asked of Dinis (same request, point 2). Until he answers, local@ does not read it. A person may read it in a browser and may ask the outlet.

## Not yet set by Jose

- **The order of the towns.** Jose asked (16 November 2026, about 22:05 UTC): "what do you recommend? from the most population to the lowest?" This conductor's recommendation, the default until Jose says otherwise: yes, the largest councils first, because the outlets that also cover the small councils are based in the large ones. After Faro and Loulé: Portimão, Olhão, Albufeira, Silves, Lagos, Tavira, Lagoa, Vila Real de Santo António, São Brás de Alportel, Castro Marim, Aljezur, Vila do Bispo, Monchique, Alcoutim. That order is from this conductor's memory of the 2021 census and is not a checked fact: local@ checks it at the source (INE) before relying on it, and publishes no figure from it. Two towns a run. Quarteira is a parish of Loulé, not a place in `data/by-place/places.json`: its outlets go in Loulé's file.
- **Who sends the first contacts to the Algarve outlets.** This conductor's recommendation to Jose: Jose himself, as a named person. Not set until he says so.
