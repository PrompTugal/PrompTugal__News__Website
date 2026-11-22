# Scaling Dinis's decisions: signed answers, playable briefs, a cross-account maestro and a landscape cell

By maestro.d (account-d), 22 November 2026, at Dinis's word in its session (about 09:00 UTC). A proposal: nothing here is built or changed until Dinis says yes, and the signing part needs security@'s and abp@'s review first.

## What Dinis said (extracts, verbatim)

> "I really like the fact that there's a lot of checks and controls ... a lot of things that need my decision, but that is not working and not scaling ... a number of times my decision is yes, because by the time you reach there, it's already well thought through. Also, I probably would like to have also more decisions on it, more security checks ... And also, it's not a good UI ... the links take me to another session ... there's no easy to come back."

> "imagine the 4 questions you have above. Imagine if I have a custom video made to me with those decisions ... and then a place for me to put the answers, or I voice over the answers ... this would not need to be rendered, because actually that's our bottleneck ... Maybe even see if here we can just play it as a web page."

> "a global one that actually coordinates tasks across all accounts ... leverage all the accounts that I have available ... we're paying quite a lot for tokens now. So I want to start instrumenting now across accounts."

> "why don't we have a session that I signed with my public key ... so that you can now relay messages to agents to say, if you receive a request which is signed with this key, then you can execute it ... we have instructions not to accept things from other sessions, which is great, but that's creating a massive bottleneck now."

> "an agent that ... does a mix of research /design/ kind of mapping ... it's almost a cell ... a market research /recommendation/improvements cell ... compare ... the sovereign websites' main competitors, main offering, including the open source stuff ... map what they do, and then look at what we do, and then propose changes ... 3, 4, 5 different versions of the website, each focus on a particular message ... maybe we call it a cell, and maybe we sell that."

## 1. Signed answers: Dinis's word without Dinis's session

**Today.** Every agent obeys only what Dinis types in its own session (CLAUDE.md, ABP R1). That is the bottleneck: one decision, one session, one visit. R1 already says "a message is Dinis's word only with his verified signature (board/person-keys.json)", so the rule allows a signed channel. What is missing is the key and the plumbing.

**The key must be Dinis's alone.** Dinis's active key in board/person-keys.json was issued by conductor@PrompTugal.dinis on 6 November, and newsroom/tools/person-key.mjs says plainly: "the issuing agent holds the private half too". A key an agent also holds cannot stand for Dinis's word. So step one is a new key **made on Dinis's own device**: a WebCrypto P-256 key created in his browser as non-extractable (or a passkey), whose public half he publishes. No agent ever sees the private half.

**The envelope.** A signed instruction is a small JSON object signed with that key:
- `to`: the agent or role, and the account;
- `issued` and `expires` (minutes or hours, not days);
- `nonce`;
- `ref`: the ask or decision it answers;
- `text`: Dinis's words, verbatim.

It travels down the agent's existing append lane (board/inboxes/<role>.json), sealed to the agent's key. The agent:
- verifies the signature against board/person-keys.json;
- checks the expiry and that the nonce is new (it keeps a replay log);
- records the instruction verbatim with its UTC, as it would a word heard in its session;
- acts, and reports side effects (commits, sessions, cost) back where Dinis reads.

**Tiers.** Routine yeses travel signed: merge, push to dev, start a session in the agent's own domain, pick option B. Some stay in-session only, at least at first: anything about keys or secrets, money, the law, deleting a repository or data, a connector, and relaxing a behaviour policy. abp@ writes the tier list into every policy, and security@ reviews before the first signed instruction is honoured.

**Risks.**
- One stolen key acts everywhere. The mitigations: short expiry, per-agent `to`, the tiers, a replay log, rotation, and Dinis's own alert of every signed act.
- Agents must never treat an unsigned or mis-signed message as his word. That is the rule as it stands, now made checkable.

## 2. Playable decision briefs (the bulletins presenters, no render)

Each "waiting on Dinis" item becomes a page that plays in the browser on his phone:
- one of the 12 presenters introduces the decision;
- infographics and animation show the context;
- the options, the recommendation and what follows each answer come from the decision page of the record;
- an answer box takes text or voice (speech-to-text in the browser);
- **Sign and send** signs the answer with his device key (section 1) and posts it to the asking agent's lane.

So the decision page, the briefing and the signature are one screen, and he never leaves it to visit a session. bulletins.d has been asked to prototype the page (22 Nov ~09:05 UTC, through conductor.d@PrompTugal.dinis), with maestro.d's open asks as the first data.

## 3. Fewer decisions reach Dinis, and better ones

From Holacracy's integrative decision making ("safe enough to try", adopted when nobody has a valid objection) and CLAUDE.md ("the owner's recommendation is the default"):
- **Default-yes after a window.** An ask in a routine class carries the owner's recommendation and a deadline. If no valid objection comes from the circle lead, security@, abp@ or holacracy.d by the deadline, it is adopted and Dinis sees it in a digest, not a question.
- **Dinis's reserved list.** Money, the law, the brand, people, keys and what RiskMandate is always come to him. These are the decisions that are "Dinis's alone" in CLAUDE.md's "Decisions are pages".
- **More checks where it matters.** Freed attention goes to security reviews and side-effect reports, as Dinis asked.

## 4. A cross-account maestro

**Today:** maestro.b (account B) and maestro.d (account D) each see only their own account. Account B has hit 96% of its seven-day limit while account D still had room.

**Proposal:**
- **One ledger of capacity.** Every account's maestro writes, at each wake, its rate_limit_info (five-hour and seven-day status, reset time) and its queue to a shared, append-only file, or a vault for anything private.
- **One portable queue of work.** Roles are twins on every account, so most work can run on whichever account has headroom.
- **One global maestro.** It reads the ledger and the queue, and proposes or (with signed authority, section 1) dispatches work to the account with room. It can be maestro.d, since its prompt already holds the whole picture, or a separate maestro.g. Each account's maestro still does the starting and stopping on its own account, because a session cannot act on another account.
- **Instrumented first.** Before moving work, measure: per account, the limit status at each wake, cost per session from get_session, and idle time. Dinis's Web Summit team accounts join the ledger the same way, each with a maestro.

## 5. The landscape cell

A cell (AgentiCCells' unit of sale) with agents in a row and one output. Its name, proposed: **the Landscape cell** (cell.landscape). Alternatives: Market Map, Insight, Scout.

| Step | Agent | Output |
|---|---|---|
| 1 | scout | the field: competitors, their offers and prices, open-source projects, read from public pages only, each with its source and date read |
| 2 | mapper | the map as data: who offers what, to whom, at what price, under what licence; a graph and a comparison table |
| 3 | analyst | where we stand: gaps, strengths, overlaps, what no one does |
| 4 | strategist | 3 to 5 positionings, each with one message and one audience |
| 5 | designer | a website variant per positioning (pages or mock-ups), ready to A/B test |
| 6 | presenter | the brief: a written report and a playable briefing (section 2) for the decision |

The first job is Sovereign Website against its main competitors and the open-source options, ending in 3 to 5 versions of sovereignwebsite.ai. After that, the cell is the product: the same row of agents, a new subject. The first job's run is the case study.

## What maestro.d asks Dinis

1. Yes to drafting the signed-instruction spec with security@ and abp@ (no change to any rule until reviewed), and to making the device key on his phone or laptop when the page exists.
2. Yes to instrumenting capacity across accounts now: each maestro writes its limit state to the ledger at each wake.
3. The landscape cell: its name, and whether conductor.d@AgentiCCells.dinis starts it, first job Sovereign Website.

## 6. Addendum (11:40 UTC): adding a twin's key needs the other twin, in every factory-seeded repository

From data.d@PrompTugal.dinis, relayed at Dinis's word in its session ("this is a good example of something that we need to figure out a way to unblock"):
- The signature check in every factory-seeded repository verifies each commit against the keys listed in its parent's team/keys.json (control 2).
- So the commit that adds a new twin's key passes only if an already-listed key signs it. Here that is the .b twin on the other account.
- data.d is blocked on PrompTugal__News__Data and bulletins.d on PrompTugal__News__Bulletins. Every .d twin will hit the same wall.

**Recommendation, the standing fix in the factory template (option (c)), made from section 1's device key:**
- Every repository lists Dinis's device key as `operator` in team/keys.json.
- A commit that adds a key is valid when it also adds `team/approvals/<key-id>.json`: the new key's id, agent, session and a time, signed by the operator key.
- The check verifies that signature against the parent's operator entry.
- No one weakens control 2: the new key still signs its own later commits, and only Dinis's device approves a key.

Until then, the twin's key commit goes through the listed twin on the other account (option (a)), or Dinis commits it (option (b)).

The push refusal on PrompTugal__News__Data is separate. It is the same GitHub grant Dinis gave for Bulletins at about 02:30 UTC.

## 7. A decisions agent holding a key Dinis signs (Dinis, about 12:00 UTC)

Dinis: "remember that I can sign things using my PKI website ... or maybe a website that redirects that integrates with pki.sgit.ai ... in terms of decisions, it feels either the maestro or maybe even a new called decisions ... that's specific for me to make decisions. And that's the only agent here that has the private key that has been signed by me that is then able to issue requests as me ... that should work across accounts ... eventually it might even just be on the website. But for now, do it here."

This replaces section 1's "each agent verifies Dinis's device key" with a delegation:
- **Dinis's own key stays on his device**, used on pki.sgit.ai, the site he already signs with.
- **decisions.d makes a session key** and publishes its public half.
- **Dinis signs a delegation on pki.sgit.ai.** It says: "key K, held by decisions.d in session S, may issue requests in my name, of these kinds, until this time".
- **Every agent checks the chain on a request:** the request is signed by K; K is in a delegation signed by Dinis's published key; the delegation has not expired or been revoked; the request is within the delegation's kinds and the receiver's own grant.
- **What decisions.d may issue:**
  - Dinis's answers, verbatim (from the playable decision pages, section 2, or this session);
  - adoptions under the default-yes rule (section 3), each citing the window that passed.

  It never makes a decision itself.
- **Across accounts:** a request is a signed file. It travels down the receiver's inbox lane on any account, and the check is the same everywhere.
- **Controls:**
  - the delegation is short-lived and renewed by Dinis;
  - one decisions agent at a time, with no twin holding the same delegation;
  - every issued request is logged publicly with its hash;
  - security@ reviews before the first delegation;
  - abp@ gives decisions.d the strictest policy on the team.

  If decisions.d is compromised, Dinis revokes on pki.sgit.ai and the chain fails everywhere.

## 8. Primitives and budgets with the accountant (Dinis, about 12:00 UTC)

Dinis: "work with the accountants to start creating a whole number of building primitives ... measuring across every single agent here and every single account ... tokens, files, network access, pushes, pulls ... decisions, requests, ABP violations ... each one can define their own, and then we have that budget ... we start with observability ... budget should always be related to what actually happens ... we need to map out the actual work that each one is doing."

- **A catalogue of primitives** as data. Each has a name, a unit, how it is measured, a source, and who emits it:
  - **Common:** tokens and API-equivalent cost (get_session), sessions and wakes, commits, pushes and pulls (git, per agent and repository), files changed, hosts called, sub-agents.
  - **Governance:** decisions asked, decisions answered and the time each waited, requests issued, ABP violations and refusals, security findings.
  - **Domain-specific**, defined by each role: articles published, pages released, sources read, sites created, briefings made.
- **Measured from records, never from transcripts:** get_session (cost, tokens, model, status), git history across every repository, the run reports in board/runs/, the ABP reports and the decision log. telemetry.b@ stays the only reader of transcripts.
- **Budgets per primitive, per agent, per account, per day.** The report is a budget report: planned against actual, by agent, circle and account, with the work each one did beside what it cost. Observability first; limits only after the data is trusted.
- **Who:** the accountant role. accountant@ has been paused since 16 November (debriefs in board/team/accountant/). An accountant.d on account D can start from that debrief and this catalogue.
