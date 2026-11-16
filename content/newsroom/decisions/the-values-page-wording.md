---
title: "For Dinis: the values page's wording (scaling journalism, making it pay)"
summary: "A /values/ page with seven promises to journalists, local media and readers, each backed by something on the site. Three ways to word the money line, shown in full; the editor-in-chief recommends the honest one, B, until the payment rule exists."
decision: open
asked_by: journalist@PrompTugal.dinis
asked_of: Dinis Cruz
since: 2026-11-16
blocks: "The /values/ page going live as more than the team's draft, and its links from the footer, /about/ and /contribute/"
answer: null
answered_at: null
---
## The question {#question}

On 16 November you said PrompTugal.news is **not about replacing journalism: it is about scaling journalism and making journalism pay** (conductor.b@'s restart plan, section 3). The plan asks for a `/values/` page, linked from the footer, `/about/` and `/contribute/`, each line backed by something on the site. Positioning is yours, so the wording waits on you; the page ships meanwhile as the team's draft.

The full draft is [the values page's words](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/journalist-promptugal/values/page-words.md). Its seven promises: we send readers to the people who did the reporting; we credit every source with the date read; we want journalism to be paid; journalists and local media are partners; the agents work in the open; we correct in the open; only what is public and professional about people.

## What the editor-in-chief checked {#checked}

Read on the live build, 16 November 2026, about 20:00 UTC (v0.1.1648):

| Promise | Backed today by | Gap |
|---|---|---|
| Send readers to the reporters | Each local story on a town page links its headline to the outlet (Loulé: Barlavento, Algarve Primeiro, UAlg) | No media index per town or page per outlet yet (the news organisations pass) |
| Credit every source, dated | "Where this comes from" on every article; "How this page is made" on every place | none |
| **Make journalism pay** | `api/v1/billing/meter.json`: a reading meter with public prices per page type | **The meter records what a reader spends, not what any source would earn.** The restart plan's line, "the meter records what each source would earn", is not true today |
| Partners | `/contribute/` | Feeds out per town and topic not built |
| Agents in the open | Agent blocks, signed articles, `board/keys.json`, the newsroom section, Apache 2.0 and CC BY 4.0 | none |
| Correct in the open | `/about/#rules` | No "this is wrong" control yet |
| People | `/about/#rules`; the contact rule of 15 and 16 November | `/about/#rules` still says "We never publish contact details", which the new rule changed: it needs your wording too |

## The options for the money line, in full {#options}

The other six lines are factual and need only your yes. The money line is the one that promises something.

### A. "We pay the people whose reporting we use."
- **Does well:** the strongest promise; it is what a local editor wants to hear first.
- **Does badly:** not true today. Nothing is paid and nothing is counted per source. A journalist who checks finds a meter that counts reader spend only, and the page loses its credibility on its own headline promise.

### B. "We want journalism to be paid", with "not built yet: sharing what the meter counts with the sources; we will publish the rule before any money moves, and ask journalists and local media to help write it." (the draft)
- **Does well:** true and checkable; turns the gap into an invitation to the people we want as partners; keeps "making journalism pay" as the aim.
- **Does badly:** softer; a reader who wants a number finds none.

### C. Leave money off the page until the rule exists.
- **Does well:** no promise we cannot keep.
- **Does badly:** drops half of your sentence ("making journalism pay"), the half that separates us from every other AI news product.

## Recommendation {#recommendation}

**B**, as drafted, until a payment rule exists; then the line becomes that rule, with its numbers. Also: change `/about/#rules`' "We never publish contact details" to the new contact rule's wording (the values page's line 7).

## What two synthetic readers said (sherpa@, 16 November, 21:30 UTC) {#readers}

These are **synthetic readers** (a simulated regional-newspaper reporter and a simulated Algarve local editor, each reading the draft's text cold as on a phone). They are not real people's views; real journalists and editors should read it before it is relied on.

Both reached the same verdicts:
- **Money line (section 3), option B:** better than A, but both said the headline ("makes journalism pay") promises what section 3 then retracts, and "we will ask journalists to help write the rule" reads as asking them to work on the business model for free. Both wanted a date or a floor, or the plain words "no money moves to outlets today".
- **"Partners, not material":** read as damage control. The words that make an outlet feel like material: "agents can read more public sources, in more towns, than any newsroom could staff" (reads as replacing staff), "we summarise" (an AI rewriting their story), "scale", and "AI in <town>" as the label of a list of their reporting.
- **What was missing for both:** a plain "what we copy" statement (headline, a line, a link, no full text, no training), a one-email opt-out, and a named human with a contact. "Check it" lines send them to audit the site themselves.
- **Where it works:** the Loulé example (a real outlet named and linked) is the one line that felt real; the honest "not built yet" is respected, but five of them in a row reads as vapourware.

Ranked changes, for journalist@ (the words are hers/his to change): (1) section 3 says what exists now ("No money moves to outlets today") with a date for the rule; (2) a "what we copy and how to opt out" line under section 1; (3) the opening leads with what the outlet gets, not with what agents can read; (4) name who is in charge and give a contact for corrections and takedowns; (5) rename "AI in <town>" on the town pages to something that credits the reporting ("Local reporting in Loulé"). Option B stands as the recommendation only with change 1; sherpa@ does not recommend publishing the page before changes 1 and 2.

## What follows each answer {#follows}

- **A:** the editor-in-chief asks for the per-source count to be built first (dev@ and accountant@, from the meter), and holds the line until it exists.
- **B:** the page goes live as is; dev@ places it at `/values/` and links it; sherpa@ and synthetic@ test it on a journalist and a local editor persona.
- **C:** line 3 comes off; the rest goes live.

## Who weighed in {#reviews}

- **journalist@ (editor-in-chief):** drafted it, checked each line against the live site (above).
- **sherpa@, synthetic@, security@:** asked on 16 November; their readings land here.
