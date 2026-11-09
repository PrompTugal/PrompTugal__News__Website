# ontologist@, account B session 01Kw9UwBtpQ2smdiLE2DEkEc (6 November 2026, from 22:45 UTC)

Started by conductor.b@PrompTugal.dinis at Dinis's word (board/guidance/2026-11-06-account-b.md, board/the-account-move.md).

- Onboarded: CLAUDE.md, "New from Dinis", ROLE.md, the 21:40 hand-over debrief, status.json.
- sgit-ai 0.27.0 present. pki-agent.mjs downloaded to the scratchpad (not the repository); sha256 fcb28a1c...02ab checked.
- Key made: record sha256:0e1d2d425f51699d, encryption sha256:653ccefe721ca405. In board/keys.json as ontologist-promptugal; the account A key renamed ontologist-promptugal-0, superseded 22:50 (librarian@'s convention, so agent_inboxes.py finds the sender by the role's id).
- Inbox: board/inboxes/ontologist.json is still sealed to the old key (sha256:4ded4027241ded02); asked the conductor to reissue it.
- Next: the predecessor's Open list (flows after AISLE: Kiggu, Temporal; built-on and invested-by edges; S9 Brazilian organisations; a crm field per company).

## 23:21 wake
- Inbox reissued to my key by the conductor. Drain: sealed creds opened into ~/.sg-send/lanes/inbox.json (0600, field names only); vault cloned to ~/vaults/inbox-ontologist-at-promptugal-dinis (key on stdin); the team site's feedback_drain.py fetched into the scratchpad (raw.githubusercontent.com; the session's GitHub tools do not reach the team site); push needs a wrapper passing the environment's SG/Send token to `sgit push --token` (sgit 0.27.0). 1 message: dev.verify@'s finding.
- Done: own-site sources (own1) for 0xbow, 1Password, Air Apps; AICEP re-read logged (its s3 already was its own site). field_sources recomputed with companies-map.mjs's fieldSources over the identity sources (flow sources fl* left out).
- Learnt: company-recheck.schema.json has no note field; the reason goes in the commit.

## 00:21 wake (7 November)
- Inbox empty. Own-site sources batch 2: 11 companies; Akamai held (403). 44 left (companies whose website host matches no source).
- Learnt: where a field had no keyword match, fieldSources falls back to every source, so adding own1 widens that fallback; a16z's what kept its Lusa source (s1) by hand.

## 01:21 wake
- Inbox empty. Batch 3: 11 companies; Genspark held (bot challenge). 33 left. The European Commission own1 cites the website only; its what keeps s1 and s2 (set by hand, the fallback would have added own1).

## 02:21 wake
- Inbox empty. Batch 4: 12 companies. KPMG Portugal website redirects to KPMG International (own1 for website only); iTRecruiter to iTRTech Group. Daily debrief written.

## 03:21 wake
- Inbox empty. Batch 5: 16 companies, the pass done. Held: akamai, genspark, persona, pitchbook, polygraf-ai (bot walls). No website: eversec, nisos, rws, whitespace. Startup Portugal: what keeps s1 (the 125 startups) beside own1, by hand.

## 04:21 wake
- Inbox empty. Websites for the four: RWS confirmed (rws.com); whitespace.co.uk is an insurance platform, not this Whitespace (rejected); eversec.com.cn script-only (unconfirmed); nisos.com 403. Whitespace s2 now 404, logged.

## 05:21 wake
- Inbox empty. Kiggu held (pro.kiggu.io renders by script, no text). Temporal: flows.json (durable-agent) from temporal.io/solutions/ai; the page also carries a setup prompt addressed to coding agents (content, ignored). New verb built_on (company to company): Replit built_on Temporal. Ontology now 29 verbs (REALITY.md counts are the conductor's).

## 06:21 wake
- Inbox empty. The list: the team site targets.json (50), fetched raw into the scratchpad. Flows: firefox-enterprise-mozilla, melious-ai (citing own1, its note extended). TrustScale script-only (held). RISIQ, SpaceComputer: no agent on their home pages, nothing to map yet.

## 07:21 wake
- Inbox empty. Flows: exa, getvocal-ai, keewano, launchdarkly (25 of 50). Exa's page points agents at its llms.txt (content, not followed).

## 08:21 wake
- Inbox empty. Flows: ledger (Agent Intent page), jetbrains (Air), lawvu (28 of 50). Manus script-only; Exein no flow.

## 09:21 wake
- Inbox empty. LEGALFLY flow (/products/workflows; agent-studio redirects there). List pass done: 28 of 50 (counted from files). NCSC, Proton, ROOST, RWS: no agent on the home page; Open VSX script-only.

## 10:21 wake
- Inbox: 1 (librarian@, signed by its active key): answered, see = supersedes read backwards. AWS Marketplace: 10 listings re-checked with Playwright (scratchpad awscheck.cjs); sources mp1 added; verb sells_on added; edges held in pending-sells-on-edges.json because minigraph.mjs (dev@) gives organisation:aws no small graph from sells_on and the graph check fails. Asked dev@.

## 11:21 wake
- Inbox: 1 (dev@, signed by dev-promptugal): minigraph draws built_on and sells_on. Ten sells_on edges re-applied; pending file removed.

## 12:21 wake
- Inbox empty. S9 local refs to organisations: invest-rio, maravalley, gol (hand, with a note; no derived key, so derive leaves them). Gol kind changed company -> organisation (not one we follow).

## 13:21 wake
- Inbox: 1 (librarian@, verified key): see closed. Scan of all pages read for our companies' names near built on/uses/customer: Twilio built_on Temporal taken; PolyAI-Twilio (integration), LaunchDarkly-Orb (billing customer), Mastra-Temporal (integration) not taken.

## 14:21 wake
- Inbox empty. Customer listings scanned: temporal.io/in-use, customers.twilio.com, cloudflare case-studies, elastic customers, datadog customers. Taken: Genspark built_on Twilio ("power Call for Me"). Not: Cognizant/Datadog (monitoring customer). Line drawn: "powers" or "runs on" = built_on; "integration", "partner", plain customer = not.

## 15:21 wake
- Inbox: 2 (synthetic@, dev.data@; both keys active). Declared withdrew_from and sponsors (actor as subject, not event->company as dev.data proposed). Debrief refreshed.

## 16:21 wake
- Inbox empty. F13 Feedzai: leadership page (founders), press release 2 Oct 2025 (funding). Facts f-founders, f-funding; sources inv1, inv2. Stage not stated.

## 17:21 wake
- Inbox: synthetic@ (active key): F13 facts not in the profile. Added founders and funding fields to company.schema.json; Feedzai set. Asked dev.pages: its account B inbox is dev.pages-b.json (dev.pages.json is sealed to the superseded key; first message went there by mistake, resent).

## 18:21 wake
- Inbox empty; dev.pages rows not yet. Rendered with Playwright (scratchpad render.cjs): trustscale, cnext flows. Outshift/manus/kiggu-pro/openvsx: no flow. 30 of 50. Rule kept: a script-rendered page may be rendered; a bot challenge is not got round.

## 19:21 wake
- Inbox empty; dev.pages rows not yet. Startup Portugal updated from researcher@ round 1, re-checked: R2WS 78; stand P1 S145; own-words what ("agency" was ours, not theirs).

## 20:21 wake
- Inbox empty; dev.pages rows not yet. Organisations iapmei, portugal-ventures, turismo-de-portugal, lisboa-municipality (hand, sourced). AI2 not added.

## 21:21 wake
- Inbox: synthetic@ (F60), dev.data@ (S9 verbs); both keys active. Declared attends, sends_delegation_to, funds. all_day: schema const true + derive pass-through; no agenda item has it yet. Told programme-vicky, dev.pages-b, synthetic, dev.data.

## 22:21 wake
- Inbox empty; dev.pages not yet. Hand event portugal-stand-web-summit-2026: hosts only Startup Portugal and Lisboa Municipality (the post says they bring the stand); partners in the note ("meet our partners" is not hosting).

## 23:21 wake
- Inbox empty; dev.pages not yet. Debrief refreshed for the evening.

## 00:21 wake (8 November)
- Inbox empty; dev.pages not yet. Eversec rendered: empty. 8 November debrief written.

## 04:21 wake (9 November)
- Back on (summit set, every 2 h). Inbox: conductor.b@ (active key): Sarah and Daniela removed at Dinis's word; do not add back. Places social-club, disco-bar (Night Summit). 216 events 9-12 Nov: 3 with no time (no all_day yet), 1 Web Summit item without part_of.

## 06:21 wake
- Inbox empty. same_as PitchBook Data -> pitchbook (curation, one line in the file's style). The served check reads git ls-files: a derived deletion fails it until committed (release.sh commits it).

## 08:21 wake
- Inbox empty. Unmatched speaker orgs: no more of ours. Companies with no session (either path): 52; asked programme-vicky about Temporal and a16z. Lesson: a company reaches events through listed_under people too, not only appears_in.

## 10:21 wake
- Inbox empty. Guidance 10:15 (LLM in apps) read. Customer pages scanned; Prisma on Mastra = internal agents, not taken. No data change.

## 14:21 wake
- Inbox: conductor@ (active key), the iOS app: shows_as. Done (schema, derive.mjs showsAs, 23 hand events). Lesson: git checkout data/events also reverts hand events in the same folder; restore only derived files by name next time.

## 16:21 wake
- Inbox: conductor@ (active key): align with mobile@ rules.json. Fetched raw at 7433286 into the scratchpad (data, not run as trusted code; I wrote my own case runner). Threshold 120 -> 180, title patterns added. Restored derived files by name only this time.

## 18:21 wake
- Inbox empty; no answers yet. 9 November debrief written.

## 20:21 wake
- Inbox: conductor@ (active key), Dinis 19:25: translations. Done: data/translations tree, translation.schema.json, datacheck check (tested with a temporary file, removed). The calls: openrouter.ai not in my grant -> Dinis asked in status.json. sha256 to be computed in JS (JSON.stringify keeps non-ASCII; Python json.dumps escapes it unless ensure_ascii=False).

## 22:21 wake
- Inbox: dev@ (active key): contributors schema; reviewed, kept. Translations: no answer from Dinis yet.
