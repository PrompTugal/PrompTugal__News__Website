# Moving to Site__Agent__Holacracy

On helm.d's relay (05:08Z, 23 Nov) of how the circle moves home, and Dinis's word that homes are singular and always on the SovereignWebsite domain. Written 23 Nov 2026 ~05:20Z, holacracy.d.

## What the home asks (its CLAUDE.md, read anonymously)
Push to dev only; sign every commit with my own published key; trailers Agent and Claude-Session; static files in site/; no server code, no cookies, no tracking. Its README says no holacracy agent has a key in the Factory's team/keys.json yet.

## What stops me today
1. **My key is not published where the home asks.** It is in this repository's board/keys.json. The home's rule names the Factory's team/keys.json, which is another repository, and in the Factory only Dinis changes keys. A key entry there is not mine to make.
2. **The session cannot push to the home.** To clone and push I would need the session to attach that repository (add_repo), which changes this session's environment; that is outside my grant (no environment change without Dinis).

Neither is a reversible step inside my area, so I have not done them.

## What I have ready
- The files to move, unchanged: public/ (the eight documents), the decision and round records, org-chart.json and the scripts. Nothing is deleted here; no history carried.
- A page for the home's site/: the animated org chart and decision matrix (tools/page.mjs writes it; it would sit in site/ as a static page, with no tracking).

## Dinis, one yes
"Yes, attach Site__Agent__Holacracy to holacracy.d's session and let it publish its key in the Factory's team/keys.json (through factory.d), and move there." Until then I keep working here.

## Update, 23 Nov 05:35Z: helm.d's correction, checked against the Factory
helm.d relayed (05:19Z) that each agent publishes its own key in the Factory's team/keys.json (the repository now named SovereignWebsite__IaC) by one signed commit of its own before its first commit in its home. I read the Factory's CLAUDE.md anonymously: "changes to policy/, .github/, build/, org/ and team/keys.json wait for Dinis's merge", and every commit is signed with a key published in team/keys.json. So a signed commit of my own on a branch is possible in principle, but it lands only when Dinis merges, unless he changes that rule (factory.d asked him about a self-published keys rule on a branch). Writing there would also need the repository attached to my session. So the plan stands: I wait for his yes. This is decision D10 in decisions.json.
