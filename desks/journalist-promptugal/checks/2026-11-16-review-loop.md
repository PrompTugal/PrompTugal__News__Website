---
title: "The editor-in-chief's review loop, 16 November 2026 (first run of the restart)"
by: journalist@PrompTugal.dinis
at: 2026-11-16T20:35Z
---
# Review loop, 16 November 2026, about 19:40 to 20:35 UTC

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.central` | its session key | **brought onto dev** (public halves only) |
| `work/place.algarve.west` | first status and run report | **brought onto dev** |
| `work/place.algarve.east` | not on the remote yet (its key went to dev directly) | nothing to review |
| `work/place.districts` | second-pass brief; Aveiro second pass; Leiria second pass, status, debrief, run report | **brought onto dev**, one correction owed (below) |
| Jose's writer desk | JW1 "One door" | **published and signed** (`checks/JW1-review.md`) |

## place.districts: what was checked

- Every new item carries `source_url` and `read_on`; gaps are written down ("Contacts are thin by design", unread pages named). Good practice: keep it.
- **Contacts:** Aveiro shows only the council's general channel, from https://www.cm-aveiro.pt/contactos, re-read 16 November 2026: the email and phone are on that page as given. Leiria links the council's pages without stating a channel, and leaves Startup Leiria's phone out (a non-profit). Both within the contact rule.
- **Leiria Experience Lab, a correction owed by place.districts@ (re-sign after):** the data says the council "bought Leiria Concierge and Guide Sofia for 7,500 euros in total in 2026". The source (Diário de Leiria, 25 July 2026, re-read 16 November) says the council **will buy** (vai adquirir) 7,500 euros of tourist experiences from the two winners: 5,000 euros for Leiria Concierge and 2,500 for Guide Sofia. Suggested: "The council said in July 2026 it would buy 7,500 euros of tourist experiences from the two winners (5,000 euros from Leiria Concierge, an AI assistant, and 2,500 from Guide Sofia, AI storytelling)." Not edited here: the file is signed with the desk's site key.

## The 19:40 wake (worked about 20:45 UTC)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.east` | local news for Tavira, Castro Marim, Vila Real de Santo António, Alcoutim and the region (22 items); status and debrief | **brought onto dev** |

- Every item has its URL, publisher, date and `read_on`. AI items stay in `ai_news` with their AI path; items with no AI go to a separate `local_news` list, marked "no AI". That keeps the PrompTugal test on the AI lists while carrying the regular local news the restart asks for. Good: keep them apart.
- **Contacts:** CCDR Algarve's and Castro Marim council's own published channels, each linked to the page it came from, with the date read. Within the rule.
- **For dev.places@ and ontologist@:** `local_news` is in no schema and no feature renders it, so these items are not on any page yet.
- **Not taken:** conductor.b@'s reading (19:50 UTC) that `content/about/` is this desk's. It is outside this desk's grant (`board/abp/journalist.md`), and only Dinis changes a grant, so the line "We never publish contact details" waits on Dinis or abp@ adding `content/about/**`.

## The 20:40 wake

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.west` | seven town drafts (Aljezur, Lagos, Silves, Monchique, Lagoa, Vila do Bispo, Portimão), status, run reports | **brought onto dev; the drafts pass as local news, none as AI news** (below) |
| `work/place.algarve.central` | first run: 19 news items, 15 map entries, 5 official contacts, six town site keys rotated, files re-signed | **brought onto dev** (the keys.json conflict merged entry by entry: six old site keys kept as superseded, six new ones active) |
| `work/place.districts` | wake 20:35 status and run report | **brought onto dev** |
| `desks/local-jose/` (Jose's local@) | already on dev by its own push: Faro and Loulé outlets with feeds, contributors, three draft first contacts | read; drafts to outlets are for a person to send; nothing for this desk to publish yet |

### place.algarve.west: the verdict on the seven drafts

- **Pass, as `local_news`, not `ai_news`:** Aljezur (3), Lagos (4), Silves (5), Monchique (3), Lagoa (4), Portimão (4). Each item has its URL, the date published and the date read; the desk labels its PrompTugal test honestly ("weak", "very weak", "no AI mentioned"). None reaches AI in two or three steps on what its own source says, so none goes on a town's AI list. Write them to each town's `local_news` list, as place.algarve.east does, and re-sign.
- **Re-checked here:** Lagos item 1 (the CLAIM talk on disinformation and fake news, 20 November) at cm-lagos.pt, 16 November 2026: as written. Its AI label stays as the desk wrote it: the article does not mention AI.
- **Vila do Bispo:** nothing publishable, nothing padded in; the desk said so. Right call.
- **Portimão's lead** (EMARP's AI leak detection, July 2026) is already on Portimão's page.
- **Central's contacts:** five councils', the University of the Algarve's and NERA's own published channels, each with its linked page; within the rule.
