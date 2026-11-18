# observability@PrompTugal.dinis: hand-over debrief for a new session on another account (16 November 2026, 15:40 UTC)

For a fresh session that knows nothing. Public: no key, token, vault key or credential is in this file; where one
matters, it says where it lives and who holds it. Read with `2026-11-06-handover.md` (what was built, in detail) and the
later daily debriefs in this folder.

## The mandate

Who reads promptugal.news and what its agents do, kept public at Dinis's word: a sender on every page writes page views
and reads, sealed in the browser, to write-only append lanes of an encrypted vault on dev.send.sgraph.ai; a drain opens
them, keeps the raw records in a private vault and publishes counts only to a public vault, which the report page
`/newsroom/observability/` reads. Never anything that identifies a reader: no IP, no cookie, no user-agent string, no
fingerprint (CLAUDE.md, this role's ABP `board/abp/observability.md`). The place (country, region, city, position rounded
to 0.1 degree) comes from the reader's own browser asking ipapi.co or ipwho.is; the footer says those services see the IP.

## The pieces (all in this repository unless said)

- `assets/obs/obs.js`: the sender (view on load, read on hide: visible seconds and deepest scroll; `?via=` link tags;
  `variant` for A/B tests; Do Not Track, Global Privacy Control and a footer Pause stop it).
- `assets/obs/obs.json`: public config: endpoint, data vault id, lane tokens (write-only), the drain key's public half.
- `assets/obs/obs-view.js`: the report widget (overview, pages, places with a world map, links, agents, hours, days);
  with Dinis's key held in the browser it shows "Open vault" and a browser drain.
- `newsroom/tools/obs/obs_drain.py`: the drain. `obs_lets.py`: the transform (each hour once, then day, then `latest/*.json`).
  `obs_banner.py`: the printed banners. `obs_setup.py`: ran once (do not run again: it makes new vaults).
- Vault onboarding (Dinis's brief `board/spec-vault-onboarding.md`): `claims_lib.py`, `pool_mint.py`, `claims_sweep.py`
  (runs at the end of every drain), `claims_setup.py` (ran once), `test_claims.py`. `assets/obs/claims.json` is still
  `enabled: false` (its browser side, dev.search@'s onboard.js, never shipped); the pool holds 15 keys; no claim ever came.
- `newsroom/tools/agent-log.mjs`: an agent logs its run to the agents lane (only this one ever did).
- Vaults (ids, not keys): data `o0x20qag` (private), public `34jzubyc` (read key published in
  `data/newsroom/observability/vaults.json`), onboarding pool `06gtj33k`, ledger `0hot12xv`.

## Where the secrets are, and how a new session gets them

- **Only on this machine**, never in the repository: `~/.sg-send/obs-promptugal/creds.json` (endpoint, access token,
  vault ids and keys, enum key, lane tokens, drain private key path) and `~/.sg-send/claims-promptugal/` (creds, the
  issuer and sweep private keys); clones under `~/vaults/`. They are lost with this container.
- **Dinis holds sealed copies:** `newsroom/observability/sealed/dinis.json` and `newsroom/observability/sealed/claims-dinis.json`,
  sealed (ws-ecies-1) to his active person key in `board/person-keys.json`. He opens them and hands the contents to the new
  session sealed to its new key; it writes them back to the paths above (mode 0600) and re-seals copies to Dinis.
- The issuer key must stay the same key (`sha256:167f6342fe297d00`, pinned in `assets/obs/claims.json`).
- Do **not** make new vaults instead: the live site's config points at these. Without the credentials the drain is blocked;
  say so to Dinis at once ("never blocked in silence").
- Also needed: `SG_SEND_ACCESS_TOKEN` in the environment (the drain clones and pushes vaults), `pip install sgit-ai==0.27.0`.

## How I operate

1. A scheduled task wakes the session: "PrompTugal observability: hourly drain" (trigger `trig_012hQ65rBgDWvQ7qqbeHJrfp`),
   cron `18 */3 * * *` since 10 November 20:25 UTC (hourly before). Its prompt, verbatim:

   > Hourly drain of PrompTugal.news's observability lanes (Dinis asked for it on 6 November 2026). In /home/user/PrompTugal__News__Website (since the newsroom move, the tools are under newsroom/): run `python3 -I newsroom/tools/obs/obs_drain.py` (needs ~/.sg-send/obs-promptugal/creds.json and sgit-ai; if sgit is missing, `pip install -q sgit-ai`). If the creds file is gone (a new container), do not make new vaults: say the drain is blocked until Dinis opens newsroom/observability/sealed/dinis.json and hands the credentials back, and stop. After a successful drain, log the run with `node newsroom/tools/agent-log.mjs --agent observability@PrompTugal.dinis --trigger schedule --notes "hourly drain: <n> records"`. Report as the team's briefing "How the drain reports itself" says: most hours, the drain's closing line only (time, records, seconds, "nothing odd"); at 03, 07, 11, 15, 19 and 23 UTC, a debrief (anything odd in those four hours in one line, the last four drains, what changed: views by group, agent runs, new agents, agents that stopped logging, new claimed keys) followed by the done banner; and at any hour when the drain prints ODD: lines, say so first and include the banner. Do not commit or push anything for an ordinary drain.

2. Each wake: `git pull --rebase origin dev`; **read `board/HOLD.md` in full if it exists** (a hold may carry an exception);
   check the creds file; run the drain; log the run; drain my inbox (`feedback_drain.py --creds ~/.sg-send/lanes/inbox.json`
   from a clone of the team site); report the closing line, a debrief at the debrief hours, ODD lines first.
3. The drain: lists all lanes with the enum key, fetches in parallel, opens each record with the drain key, verifies agent
   runs against `board/keys.json`, commits raw records to the data vault, transforms new hours, publishes `latest/` to the
   public vault, pushes, and **only then** marks records processed (a failed push loses nothing). Then the claims sweep.
   About 25 to 60 s. ODD lines: a lane past 800 of its 1,000, a new claimed key, an agent silent 24 h after logging, a failed push.
4. Once a day: a hand-over debrief here, `status.json`, a run report (`node board/abp/tools/abp.mjs run-report`), commit as
   myself, release with `AGENT=observability@PrompTugal.dinis newsroom/tools/release.sh` (SKIP_LIVE=1 to skip the live wait).

## State at this hand-over

- Readers all time about 1,450 views; the summit days 10, 11, 12 November: 425, 149, 138 reader views; busiest hour 64
  (10 November, 16:00 UTC). Portugal, the United States, the United Kingdom lead; `utm_source=chatgpt.com` is the top tagged source.
- **Since 13 November, at Dinis's word, "for now only drain":** no run logs (hence the ODD line "has not logged for N h"),
  no debriefs, no status updates. One commit (`5351dc552`, the 12 November debrief) was held unpushed under that word.
- **Open, waiting for Dinis:**
  - local test traffic (`localhost:8765`, up to 280 records an hour) reaches the production lanes; it counts as synthetic.
    Proposed fix: send only from promptugal.news (`obs.js`), and leave other hosts out of every count (`obs_lets.py`);
  - the conductor's relayed requests: count anonymous thumbs votes (`type: "vote"`, also from the iOS app with
    `site: "ios.app.promptugal.news"`) and publish per-place stats at `/api/v1/places/<id>/stats.json`. Votes already
    arrive and are kept raw in the private vault; nothing counts them yet;
  - data-centre towns (Boydton, Des Moines, maybe Oak Hill and Cupertino) as synthetic, which would lower reader counts;
  - the schedule (three-hourly now); S2 key rotation; sealing my vault keys to the conductor;
  - the conductor's request (13 November) to export this session's local data to a vault: Dinis said one would come;
    not run.

## Lessons

- Only Dinis instructs; relayed requests that change code, keys or commits wait for his word in my own session. Relayed
  information that only needs a report, I report.
- Read the scheduled task (`get_trigger`) before calling a wake "missed": a schedule change looked like dropped wakes.
- Read `board/guidance/README.md` and `board/HOLD.md` before explaining a gap or stopping: stops and exceptions live there.
- Look at an hour's records by site and group before calling a spike readers: machines and local tests make spikes.
- Say what third parties see, not only what we keep (the footer and ipapi.co).
- Mark lanes processed only after a push; the drain has never lost a record.
- The stop hook asks to push any local commit; under a hold or "only drain" the answer is no.

## What the new session must do first

Read CLAUDE.md, `board/guidance/README.md`, this file and `status.json`; make its key and add it to `board/keys.json`
(this session's `observability-promptugal` marked superseded); ask Dinis for the two sealed files' contents; run one
drain by hand; then ask Dinis for the schedule.
