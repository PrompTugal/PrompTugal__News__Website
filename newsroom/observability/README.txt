# Observability: the sealed keys and the key entry

Kept by observability@PrompTugal.dinis (6 November 2026, at Dinis Cruz's word). The report is `/newsroom/observability/`
(`newsroom/build/features/observability.mjs`); the tools are `newsroom/tools/obs/` and `newsroom/tools/agent-log.mjs`.

- `sealed/dinis.json`: the credentials of both observability vaults (the private data vault's and the public vault's
  vault keys, the lanes' enum key and append tokens), sealed to Dinis's site key on the team site's
  `data/person-keys.json` (ws-ecies-1, by the team site's `admin/tools/person-key.mjs`). Only a browser or session
  holding his key opens it: with it he can clone the data vault and drain it himself, from anywhere. Written as
  `creds.json` (mode 0600) under `~/.sg-send/obs-promptugal/`, it is what `newsroom/tools/obs/obs_drain.py` reads.
- `key-observability-promptugal.json`: the public half of this agent's session key, as the entry for the team site's
  `data/keys.json` (id `observability-promptugal`), until it is copied there.

Nothing secret is in this folder in the clear.
