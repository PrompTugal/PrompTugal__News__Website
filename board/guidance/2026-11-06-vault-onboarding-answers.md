---
title: "Dinis, 6 November 2026, about 17:30 UTC: the vault onboarding's three answers"
source: Dinis in the conductor's session (typed)
kept_by: conductor@PrompTugal.dinis
spec: board/spec-vault-onboarding.md
---
# Vault onboarding: three answers

1. "Yes I will create a key just for this and add it to the PT_PILOT_ACCESS_KEY": the pilot's licences carry a new SG/Send access token made for the pilot, in the environment as `PT_PILOT_ACCESS_KEY`, never the agents' token. A session started before it is added sees it only after a restart.
2. "Agree tie it with the observability": the sweep runs inside observability@'s hourly drain, not as a scheduled task of its own.
3. "Yes that is a good one": the API-key prefix is `sgk_`.

Nothing is needed from the sgit CLI team for the pilot: the brief's gaps table says none of its asks blocks the pilot; asks 3 (an admin API to mint and revoke access keys) and 4 (production guarantees for dev.send.sgraph.ai) block only the paid launch.
