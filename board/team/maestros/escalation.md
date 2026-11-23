# Escalation: no agent stays stuck (proposal v1)

By a.maestro (account-a), 23 Nov 2026 ~22:10 UTC. Dinis's words in a.maestro's session: "these agents ... they can't just be stuck and going, well, I'm stuck ... We really need to find ways to escalate this." It is the companion to the decision flow (F1 to F5) and builds on CLAUDE.md's "Never blocked in silence". Proposed for every maestro; the parts that change policy are Dinis's.

## The ladder, with clocks

| Step | Who | Within | What happens |
|---|---|---|---|
| E0 | the agent | 15 min | Tries the documented route for its blocker class (the runbook below) and asks a peer on the same account for steps. It never routes around a refusal. |
| E1 | its conductor or lead | 1 wake, at most 60 min | The agent writes a **stuck record** (below) into its status and sends it to its lead. The lead unblocks if it can: another agent who holds the access, a different path, or the work re-ordered. |
| E2 | its maestro | 2 h | The maestro classifies the blocker. A known class gets the fleet-wide fix applied to every agent that has it, not one at a time. A cross-account blocker is relayed. Anything only Dinis can do goes to E3. |
| E3 | Dinis, through b.decisions | at once if the blast radius is high, otherwise the next batch | One line per blocker, with a copy-paste answer and the session link, ranked by blast radius. It also goes to his phone through a.ios owner mode, once that is live. |

**Blast radius sets the speed.** Escalate straight to E3, skipping the clocks, when 3 or more agents are blocked by the same thing, or a live site or security item is involved, or work will be lost (for example, an unlanded commit under a key that is about to retire).

**Stuck does not mean idle.** While it waits, an agent:
- parks the blocked piece and records it;
- moves on to the next piece it can do (a twin, docs, or a review);
- backs its wake off to every 2 h after 2 quiet wakes.

## The stuck record (one per blocker, in status.json under stuck[])
- what is blocked, and what it blocks downstream: agents, commits, a demo;
- the class (table below);
- the exact refusal or error text, and what was tried at E0;
- the single ask: who can unblock it, the exact words or action, and where (a session link);
- the cost of waiting: work held, and any deadline;
- since when, and the current step (E0 to E3).

## Blocker classes and their standing fix

Every class that recurs gets an owner who removes it at the root, so it is never asked again one session at a time.

| Class | Today's example | Standing fix (owner) |
|---|---|---|
| **signing key** | a fresh session's guard refuses decrypting its sgit key for git (a.conductor.aws, a.ontology.aws; 9 of 11 sessions were not refused) | short term, one standing yes from Dinis for the exact signing-setup step, as an environment rule, never printed; long term, the git signing key is born as an OpenSSH key (`ssh-keygen`, no decrypt), and the Factory's `ssh_signing` field plus signers.mjs accept it (aws.c, security, factory) |
| **repository access** | an add_repo refused, read-only (a.iam.aws for the Factory; a.ios for the Chiswick repository) | public repositories: a plain clone, no add_repo. Private: one environment-level grant per team, set by Dinis once |
| **key not live** | the .a keys on the Factory (A3) | Factory key landings follow each restart within one wake, in the order: land, retire, then -2 (the restart protocol) |
| **policy path** | abp.json lacks a role (ec2.aws.a) | the role's paths are written into abp.json when the agent is started, not when it first pushes |
| **harness prompt** | a permission prompt in a session nobody watches | a list of every waiting prompt, by session, at the top of Dinis's one list |
| **cross-account relay** | c.maestro paused, so account C goes silent | each account always has a running writer of its from-x.md (maestro or conductor); a silence of more than 2 h is itself escalated |
| **decision** | (already covered) | the decision flow, F1 to F5, and b.decisions |

## Measures (reported in each maestro's state line)
- agents stuck right now, by class and step;
- the oldest stuck age;
- blockers removed at the root this week.
