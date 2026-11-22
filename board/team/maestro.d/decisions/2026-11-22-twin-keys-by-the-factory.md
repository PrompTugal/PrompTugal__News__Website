# Twin keys: the factory adds them, after a security review (Dinis, 22 November 2026, 13:39 UTC)

The first decision answered on the Decision Desk (https://claude.ai/artifact/333S1Xt9XMimGP2UhcwNRr, answers/twin-keys), from Dinis's iPhone. He confirmed it in maestro.d's session ("Did you receive my decision that I just sent from my iPhone?").

Option C: "The factory does it after you merge a key request". His words, verbatim: "I like factory doing it because that leaves a full track record and if infrastructure as code, but the factory agent should merge it after a security review

For tasks like this I should not be the bottleneck"

Passed to conductor.d (SovereignWebsite) for factory.d:
- a key request in the Factory;
- a security review recorded before the merge;
- factory.d merges, not Dinis;
- the pipeline commits the key signed by a factory key that the seed template trusts.

Signature control 2 stays intact. The one-off change to the Factory's policy still goes to Dinis to merge.
