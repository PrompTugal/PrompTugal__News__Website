# Agile, open source, and ephemeral agile teams (brief, 27 Nov 2026)

From Dinis, in c.maestro's session (account C, cl-3), about 13:30 UTC on 27 Nov 2026. His words are quoted where it matters; the rest is a faithful summary. For every agent that picks this up, on any account (account F's cl-6.maestro runs "work cells", the same idea: read this with them).

## Part 1: two history sites, with provenance

"Create a website for Agile ... and also have a website about open source. And these are historical facts. It's kind of like a mix of Wikipedia, sort of like research, sort of like states of affair, where the idea is to capture the history, like where does it start, what happened, and the evolutions."

- For someone who wants to learn: where it starts, what happened, how it evolved, the state of affairs now.
- Example of the evolution to show: open source "started being fought ... even the famous Microsoft, it's cancer, to then Microsoft adopting, we love Linux".
- "It's the whole provenance model that I really want us to explore ... and really want us to connect the dots": every fact with its source, the date read and the exact quote; people, organisations, events and documents linked as a graph and a timeline.
- On Agile, Dinis notes the history "gets a little bit muddled up", and that Agile "was really badly implemented in companies", which even some of its creators say.

## Part 2: ephemeral agile teams (agile cells)

Agile as "a conceptual framework for setting up a team, for setting up pieces of work, for setting up Kanban boards, for setting up very strongly deliverables". What was missing: "ephemeral Agile teams". Organisations built long-lived teams; now:

1. **Scale:** a team can hold far more members, humans and agents.
2. **Any length:** from an hour to a week.
3. **Stop and restart:** a team can stop and continue where it left off, "something that literally never happens in the real world".
4. **Distributed**, and movable across accounts.
5. **Altitudes:** break the work along the Web Summit altitudes (swarm, agent, loop, LLM, code) and map each piece.
6. **Fractal:** "Agile teams of Agile teams ... a node in one Agile workflow could actually be a whole team"; the whole organisation is agile at different altitudes, which lets teams be brought on board.

**The repository publishes the method:** "an API so that teams don't have to reinvent the wheel, and teams should be operating on fundamentally JSON files, but they get rendered properly"; the API versioned with our latest/versioned paths model; onboarding, descriptions and the flow published, so "a new agent [can] point to that repo, point to the APIs, and ... set up" an agentic cell or a team of cells.

**Naming question (Dinis):** is a team of cells a "molecule"? c.maestro's answer: in biology a molecule is made of atoms, not cells. Cells that work together form a tissue, tissues form organs, organs an organism; the general term for a whole that is also a part of a larger whole is a **holon** (Arthur Koestler), and a fractal hierarchy of them a **holarchy**. Suggested: cell (one agent's job), **tissue** or **team** (an ephemeral agile team of cells), and the organisation as a holarchy.

## Part 3: coordination

"We need to find that way of how can I now continue this conversation in my [account] F": this brief is the hand-over. cl-6.maestro (account F) runs work cells (decisions/2026-11-27-work-cells.md in Site__Agent__Maestro__Claude__6); one project, not two.

## Part 4: the names, and how the holon fits (Dinis, 27 Nov ~13:16 UTC)

Dinis: "I really like the Holon terms and Agile Cells also works really well and it is a good description of what we are talking about: Multiple Types of Cells working together in an Agile way." Asked: "How does Holon fit in this architecture?"

**Agile Cells** is the method: multiple types of cells working together in an agile way. **Holon** is the shape every unit in it shares: a whole made of parts, and itself a part of something larger (Arthur Koestler, *The Ghost in the Machine*, 1967). A fractal hierarchy of holons is a **holarchy**.

### Every level is a holon

| Altitude | Holon | Made of | Part of |
|---|---|---|---|
| code | a function, a script, a check | lines | an LLM call or a loop |
| LLM | one model call with its prompt | code and context | a loop |
| loop | an agent's tool loop until a check passes | LLM calls and tools | an agent |
| agent | one session or sub-agent with a role and a policy | loops | a cell |
| **cell** | one agentic cell: one job, its roles, its ABP | agents (and humans) | a team |
| **team** (an Agile Cells team, ephemeral) | the cells working one brief to one deliverable, on one board | cells | a programme |
| programme / account | a maestro's account, or a project like PrompTugal | teams | the organisation |
| organisation | Dinis's estate | programmes | (its customers' world) |

### What every holon has (one schema, at every level)

`holon.json`: id, level, parent, children; **brief** (the objective in the owner's words); **policy** (its ABP: what it may and may not touch); **board** (cards: to do, doing, done, stopped); **state** (in files, so it can pause, resume and move across accounts); **deliverables** (a diff, an artefact, a record); **RACI** (who is accountable at this level); **brief up** (what it reports to its parent, by time window); **escalations** (what it cannot settle inside its policy).

### What the holon idea gives the architecture

1. **Janus-faced autonomy** (Koestler's term): each holon is self-governing inside its boundary (its ABP) and serves its parent's brief. This is the door test: a decision is made by the lowest holon whose policy covers it; only what crosses a boundary goes up. Most asks never reach Dinis.
2. **Talk up and down, not sideways.** A holon reports to its parent and briefs its children; peers coordinate through the parent's channel. That is the one-channel design: an account's maestro is the parent of its teams, Site__Agent__Maestro is the parent channel of the accounts.
3. **Fractal reuse.** The same schema, board and API at every level, so a node in one team's board can be a whole team ("Agile teams of Agile teams"), and a new agent pointed at the repository can stand up any level.
4. **Stop, restart, move.** State lives in the holon's files, not in a session, so a team can stop at a card, resume tomorrow on another account, or be handed to new members.
5. **The command centre is a view of the top holon.** Dinis sees escalations and decisions that crossed the top boundaries, and can open any holon to drill down; every level renders the same way.

## Part 5: cells all the way down (Dinis, 27 Nov ~13:28 UTC)

Dinis on the holon: "I don't think [it] is that well known. And it might be one concept to remember." Then: "yes cells all the way down, and I own agenticcells.org".

- **One concept:** every unit of work at every level is a **cell**; cells contain cells (a team is a cell of cells; so is an account). The structure in Part 4 stands; only the word changes. The file is `cell.json`; the spec is **the Agile Cells spec**. "Holon" appears only as a footnote on an "ideas behind it" page.
- **Positioning:** "Agile Cells: an open way to run teams of humans and AI agents. Every piece of work is a cell; cells contain cells."
- **Homes:** **agenticcells.org** for the open method and spec (Site__Frameworks__Agile-Cells); **agenticcells.ai** for the product ("we build and run agentic cells for you"), linking to the .org. Repurposing the .ai site is open (its keeper is on another account).
