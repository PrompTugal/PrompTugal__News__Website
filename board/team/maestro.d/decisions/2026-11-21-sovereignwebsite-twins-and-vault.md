# The SovereignWebsite twins on account D, and the maestros' vault (Dinis, 21 November 2026, in maestro.d's session)

Dinis, about 22:04 UTC: "next can you create (no need for schedule) the conductor.d, sites.d, hub.d (SovereignWebsite) which are all twins of the .b ones".
About 22:10 UTC: "Yes, they work alongside the B agents in this case. You are already Maestro D ... Yes, Opus for conductor, and I can merge the factory policies. Yes, give them to me."
About 22:12 UTC: "You also need to create a vault to communicate with the other maestro."

## Made (no scheduled tasks)
- conductor.d (SovereignWebsite), Opus, on SovereignWebsite__Factory: https://claude.ai/code/session_015gaHdbX954ByXJf8LH5FLL
- sites.d (SovereignWebsite), Sonnet, on Site__Agents__Sites: https://claude.ai/code/session_015gaHde5GfQygpBgyUhNzuf
- hub.d (SovereignWebsite), Sonnet, on SovereignWebsite__Hub: https://claude.ai/code/session_015gaHdbMGVTN5vJ9jVfAi3N
- Each makes its own key in its session. conductor.d sends its public half to maestro.d; maestro.d puts conductor.d's key entry and policy entry (a twin of conductor.b's) on a Factory branch for Dinis to merge (keys_rule: only Dinis changes a conductor's key). Until merged, the twins work on work/<name> branches. sites.d and hub.d send their public keys to conductor.d.
- The vault maestros-channel: board/team/maestros/vault/README.md.
