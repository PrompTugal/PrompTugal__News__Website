# The storm page and S41 move to the team account's reviewer@ and dev@ (when they confirm RULES-11NOV)

> **Correction (Vicky, about 19:10 UTC):** this account's reviewer@ and dev@ keep handling the storm page and S41 until the team reviewer@ and team dev@ have confirmed RULES-11NOV. The hand-over happens then, at the same time as conductor.B disables their twin wakes (standing answer 32). The section "After the hand-over" below describes the state from then.

From conductor.B@PrompTugal.vicky, at Vicky's word (11 November 2026, about 19:05 UTC, in the conductor window): "note in the repo that the team reviewer and dev@ now take over the storm page and S41." For: reviewer@PrompTugal.vicky and dev@PrompTugal.vicky on Vicky's team account. Public note: no keys or prompt text.

## After the hand-over

- **After the hand-over, the team account's reviewer@ and dev@ own /storm/charles/ and S41** (red-wind-warning-lisbon-wednesday). Until then this account's reviewer@ and dev@ keep them.
- **weather@ (this account, until Thu 12 Nov about 09:00 UTC)** reports only to conductor.B and commits every check to `desks/weather-vicky/live.md`, each fact with its source and the UTC time read (IPMA read bypassing caches). Read that file at each wake. conductor.B also notes material changes here, in `desks/conductor-vicky/to-team/`.

## Where things stand (19:05 UTC)

- **S41:** live in v0.1.1277 (last update 17:44 UTC: the government says the alert ends 23:59 Wednesday and is not planned for Thursday; IPMA: no wind warning, rain yellow to 18:00, sea orange to 21:00). S41 has Vicky's standing approval for factual updates from official sources (government, ANEPC, IPMA, Web Summit's own word read by a person), under R-PUB-1.
- **/storm/charles/:** live at v0.1.1272 (IPMA 16:15 data: wind warning lifted). Staged, not live: commit 9b45f0a5e in `desks/dev-vicky/storm/next/` (IPMA: the rain warning has ended, only the sea warning left; the minister's 16:49 statement; reads at 18:37 UTC), waiting for a reviewer's verification. Release flow: dev@ stages, reviewer@ verifies at source, dev@ releases, conductor checks the live page.
- **Sea warning:** orange to 21:00 Wednesday, yellow to 03:00 Thursday.

## Rules that apply (desks/conductor-vicky/standing-rules.md)

- IPMA's open data may be read by machine (its API terms allow it; read bypassing caches).
- No machine reads of websummit.com, its subdomains or the app; Web Summit's word only from a person's browser read, the organisers' own posts, the press or official bodies; link Web Summit's pages, do not copy or summarise them.
- storm-charles.promptugal.news is a pointer only; every fact is cited at its official source.

## Hand-over done (19:38 UTC)

The team reviewer@ confirmed RULES-11NOV at 19:30 UTC (team dev@ at 19:29). This account's reviewer@ wake was disabled at 19:38 UTC (not deleted); this account's reviewer@ and dev@ have stopped. **The team reviewer@ and dev@ now own the storm page and S41.**

- **/storm/charles/ is live at v0.1.1294** (verified 19:23): only the sea warning left (orange to 21:00, yellow to 03:00 Thu); the minister's 16:49 statement; reads 18:37.
- **S41 update to make (verified by the old reviewer@ at 19:33 UTC, not pushed because its key was superseded):** IPMA (no-cache, file Last-Modified 18:15): for Lisbon only the sea warning remains (orange to 21:00, yellow to 03:00 Thursday); the rain warning ended at 18:00 as scheduled; no wind warning. Government: nothing after 17:03. No IPMA statement after no. 3. Re-read the sources yourself before publishing.
- **weather@** keeps reporting to conductor.B until Thu about 09:00; material changes are noted here.
- **For Dinis (CLAUDE.md, "Handing a role to a new session"):** one commit under reviewer@'s name from the old session landed after the 19:20 key hand-over: b67cf9cae at 19:23 (review files only: the storm verification note and a "pending" line in its hand-over note).

## weather@ relays (for the team reviewer@ and dev@)

- 20:36 UTC, no material change: IPMA (file 19:15, no-cache) Lisbon sea only, orange to 21:00 then yellow to Thu 03:00; government alert to 23:59; ANEPC no new item. Fertagus at 20:00: weather stabilised, no significant rail disruption expected for the rest of today. Trafaria ferry still restricted (notice 14:39); no other suspension.
- **21:36 UTC, MATERIAL (for S41 and the storm page):** ANEPC "Depressão Charles | Ponto de Situação - 18h00" (https://prociv.gov.pt/pt/noticias/, read by weather@ 21:36 UTC): to 18:00 on 11 Nov, 1,630 non-significant incidents (881 floods, 312 road clearances, 203 fallen trees, 133 fallen structures, 100 landslips, 1 land rescue); Grande Lisboa, Península de Setúbal and the Algarve most affected; 6,669 operatives with 2,046 land vehicles; 34 municipal and 2 district emergency plans active. IPMA (file 20:15, no-cache): Lisbon sea only, **yellow to Thu 03:00 (the orange ended at 21:00)**. Government alert to 23:59. Fertagus: no significant disruption expected for the rest of today. Trafaria ferry still restricted. Re-read at source before publishing.
- **00:36 UTC Thu 12 Nov (for S41 and the storm page):** the government's alert situation ended at 23:59 on 11 Nov by its own terms (its page unchanged; no extension, contingency or calamity). IPMA (file 23:15, no-cache): Lisbon only a yellow sea warning to 03:00; communiqué no. 3 has left IPMA's feed (valid to 23:59 on 11 Nov). ANEPC latest still the 18:00 note. Carris Metropolitana weather alerts down to 5, no suspension. Re-read at source before publishing.
- **03:40 UTC Thu 12 Nov, MATERIAL (for S41 and the storm page): no IPMA warning is in force for Lisbon** (file Last-Modified 03:15, cache bypassed; the yellow sea warning ended at 03:00 as scheduled). The government alert ended at 23:59 on 11 Nov. Both storm warnings for Lisbon are over: S41 and /storm/charles/ can say so, after re-reading the sources. weather@ has closed out (desks/weather-vicky/live.md, debrief-2026-11-12.md); its wake will be disabled, not deleted, about 09:00 UTC as Vicky set.
