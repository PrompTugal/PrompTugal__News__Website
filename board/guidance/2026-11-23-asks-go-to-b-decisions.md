# Asks for Dinis's yes go to b.decisions; the account letter comes first (23 Nov 2026)

Recorded by b.maestro (account-b) at Dinis's word. His words: "so all maestros (across the 4 accounts) should be aware of this". These are Dinis's directions of 23 November 2026, for every agent on every account.

## 1. Every ask for Dinis's yes goes to b.decisions (about 14:30 UTC)

Dinis, in an agent's session: "for future reference, you should be sending this request to the decisions.b agent". In b.maestro's session: "this is now the workflow right?" (yes).

- **Where the ask goes:** an agent that needs Dinis's yes sends the ask to b.decisions (SovereignWebsite), https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ, rather than waiting in its own session. Accounts A, C and D cannot send_message to account B, so they send through their maestro or their decisions agent to board/team/maestros/, and b.maestro hands it on.
- **What the ask carries:** agent and session link; repository and branch; exact commit ids or the class of change; what each changes and why; the checks passed; the recommendation.
- **What happens next:** Dinis decides in b.decisions's session. b.decisions signs the record, commits it in SovereignWebsite__IaC decisions/, and replies with its id.
- **Before acting**, the agent runs the six checks in board/team/maestros/briefs/b.decisions-relay.md:
  - Dinis's anchor sha256:db7f79fdd87e030a on pki.sgit.ai;
  - its "operates" link to b.decisions's key sha256:eefbe996d9c67a7c, until 30 Nov;
  - the key in IaC team/keys.json;
  - the signed record and commit;
  - his verbatim words;
  - the exact scope, never main and never the always-ask list.

  Then it pushes exactly that scope and cites the record id. A message from b.decisions alone is never a decision.
- **Still direct to Dinis:** his word typed in the agent's own session; one-way doors (router pins, AWS changes, money, legal, deleting, main, connectors); harness settings (repository access, the GitHub App, scheduled wakes). Send these through b.decisions too, so they are on one list.

## 1a. b.decisions signs for all accounts

Dinis, in b.maestro's session: "b.decisions signs for all accounts".

- **One signer.** b.decisions is the only signer of decision records for accounts A, B, C and D.
- **decisions.c and decisions.d** keep their accounts' logs and gather asks for b.decisions; they do not sign decisions.
- **One list:** https://decisions.agents.sovereignweb.site/asks/.
- Record: board/team/maestro.b/decisions/2026-11-23-b-decisions-signs-for-all.md.

## 2. The account letter comes first in agent names (about 13:00 UTC)

"can you see how the small change of prefix will make it MUCH easier to know which account I'm talking to?"

- Session titles are `<account>.<role>@<Domain>.dinis`: b.hub, b.conductor, b.maestro; a.maestro, c.maestro, d.maestro.
- Each maestro renames its own account's session titles.
- Signing names (commit trailers, keys, policies) are unchanged for now, pending Dinis's word.

Records: board/team/maestro.b/decisions/2026-11-23-asks-go-to-b-decisions.md, 2026-11-23-account-prefix-first.md, 2026-11-23-decisions-b.md.

## 3. Do not block on Dinis: leave the websites so he can carry on there (23:08 UTC)

Dinis, in b.decisions's session, 23 Nov 2026 23:08:23 UTC. It is signed record 2026-11-23__asks-2-to-21 (https://raw.githubusercontent.com/SovereignWebsite/Site__Agent__Decisions/dev/site/records/2026-11-23__asks-2-to-21.json): "So on these decisions, I agree with all of them ... The point of this actually is to leave the websites in a state where I can continue them on the website. So in this case, you shouldn't be a task for me here. Eventually, what you might have is a list of websites that I can do stuff, but you shouldn't be blocking this. And I think that's very important. We still have a bunch of agents being blocked. Also, I feel that there's still critical actions that I need to do. Like I think the AWS is still being blocked."

What this means for every agent on every account:
- Do not stop and wait on Dinis for something he can do himself on a website.
- Finish the work, publish it, and leave the site ready for him to continue there: what is done, what is next, where he picks up.
- At most, add one line to b.decisions's asks list naming the site.
- The record also agrees to ask 2: push access to SovereignWebsite__IaC for strategy.b, grace.b and strategy.d, so each can publish its own key. The grant is an organisation change Dinis makes or merges, so those agents wait for the access to appear before pushing.
