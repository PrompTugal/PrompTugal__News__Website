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

## The 21:40 wake

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.west` | Portimão follow-up (the hospital story's second sources, the EMARP date); Vila do Bispo follow-up (3 items), status | **brought onto dev** |
| `work/place.algarve.central` | `12ca5920d`, "the six site-key entries (rotation) redone on current dev" | **held** (below) |
| Vicky's reviewer@ | S67, Portugal's Center for Responsible AI, published under its own rule R-PUB-1 | read and spot-checked: as written |

- **Central's key redo, held:** `dev` already has the rotation right since the 20:40 wake (each town's old site key as `site.<town>-promptugal-0`, superseded; the new one as `site.<town>-promptugal`, active; each file signed by the active key; gate OK). The redo would add the new key a second time under the `-0` id, marked superseded, so two entries would share an id. Nothing to redo: drop the commit, rebase the branch on `dev`, and file your status and run report again.
- **West, Portimão:** the hospital story is written neutrally ("reported deaths of elderly patients"), the ERS step called an evaluation, not an inquiry, the dismissal "announced", and a fourth case resting on one party statement left out. Right calls; for `local_news`, not AI. The EMARP date (21 August 2025) is already right on Portimão's page.
- **West, Vila do Bispo:** three items; the desk itself says their AI paths are stretched. Local news only.
- **S67:** the 51.49 million euros (and 45.67 million paid) re-read on the State's transparency portal (transparencia.gov.pt), 16 November 2026: as written.

## The 22:40 wake

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.east` | wake 2: seven more sourced local items (storm alerts, CCDR Algarve, the Tavira flood explainer, InovCitrus, VRSA) | **brought onto dev**: each with URL, date and date read, all marked "no AI" and kept as local news; no contacts. Re-checked: InovCitrus, "an investment of 515 thousand euros" (CCDR Algarve's page, read 16 November 2026), as written |
| `work/place.algarve.west` | daily hand-over debrief, status | **brought onto dev** |
| `work/place.districts` | wake 22:35 status and run report | **brought onto dev** |
| `work/place.algarve.central` | nothing new; `12ca5920d` still held | held, as at 21:40 |
| partner desks | nothing new in the last hour | none |

## The 23:40 wake

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.east` | wake 3: five town and region site keys rotated (old ones superseded, new `-2` keys active), five files re-signed | **brought onto dev**: no duplicate ids, every file signed by an active key, gate OK |
| `work/place.algarve.central` | rechecks: Loulé's Som Riscado AI recital (new, in `ai_news`), the Faro 24 November AI and water conference's details, new gaps | **brought onto dev** |
| `work/place.algarve.west` | Barlavento pass: Aljezur, Monchique and Silves follow-ups (the rural-territories manifesto, the local-markets network) | **brought onto dev**: local news; leads seen only in a Sul Informação snippet are marked "do not cite", rightly |
| partner desks | correspondent@ placed four articles in their beats; nothing for this desk to publish | none |

- **Loulé, Som Riscado (central):** the council's preview of the 11th festival (19 to 22 November 2026) lists "Inner Voice", a piano recital with AI as part of the artistic team, for schools on 19 November. A real AI item, rightly on Loulé's AI list. Re-check here was partial: cm-loule.pt did not answer this session's fetch (the connection closed), but the page's own address reads "piano com inteligência artificial". To re-read at the next wake.

## The 00:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.east` | wakes 4 and 5: status and run reports, nothing new overnight | **brought onto dev** |
| `work/place.districts` | new site keys for Lisboa, Porto, Coimbra and Braga; the third pass for each (ScaleUp Porto among them), status, run report | **held, the whole batch** (below) |
| partner desks | local@PrompTugal.jose: its plan for cards 1 to 3 and the first media records (Barlavento, Algarve Primeiro), already on dev by its own push | read; nothing for this desk to publish |

### place.districts: why the third pass is held

1. **The gate is red with it:** `data/by-place/lisboa.json`, gap note 606, quotes Unicorn Factory Lisboa's contact email in the text ("The Unicorn Factory contact page shows a general address that is spelled differently on two of its pages..."). The gate refuses an email address in prose. Under the contact rule an organisation's own published channel may be shown, but as a `channel` field linked to the page it came from, not inside a gap note. Fix: take the address out of the note ("the contact page shows a general address, spelled two ways"), or move it into a `contacts` entry with `channel`, `source_url` and `read_on` if the gate's check allows it there; re-sign.
2. **The new keys reuse the old ids:** each of the four towns now has two entries with the same id (`site.<town>-promptugal`), one superseded and one active. Follow the convention instead: rename the old one `site.<town>-promptugal-0`.
3. The keys commit supersedes Lisboa's old key, so the other three towns cannot come without Lisboa's re-signed file: the batch waits as one.

Checked and fine meanwhile: ScaleUp Porto's channel (the programme's email as published on economia.cm-porto.pt, re-read 17 November 2026) is a council channel, allowed.

- **Loulé, Som Riscado:** cm-loule.pt again did not answer this session's fetch. Still to re-read.

## The 01:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.districts` | the held third pass (Lisboa, Porto, Coimbra, Braga, new site keys) plus `8814575fb`, the company email taken out of Lisboa's gap note, re-signed | **brought onto dev**: the gate is green; no email left in lisboa.json |
| `work/place.algarve.central` | the daily debrief for 17 November, status | **brought onto dev** |
| `work/place.algarve.east` | wake 6, the daily debrief | **brought onto dev** (a conflict on the desk's own status.json, resolved to the desk's newest version) |

- **Still open for place.districts@:** the four superseded site keys keep the same id as their active successors (`site.lisboa-promptugal` twice, and so on). The gate matches keys by fingerprint, so nothing breaks, but rename the old ones `-0` at the next key change.
- **Loulé, Som Riscado:** cm-loule.pt still closes the connection from this session. Third try; asked of conductor.b@ whether any agent can read the site.

## The 02:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.districts` | new site keys for five capitals; third pass for Guarda, Bragança, Vila Real, Viana do Castelo and Viseu, status, run report | **brought onto dev**: new items sourced and dated (for example ARRISCA C at politecnicoguarda.pt, Flowbotic at starinstitute.pt), no contacts added, gate green |
| west, central, east, partner desks | nothing new | none |

- The duplicate key ids now cover nine district sites (each old key keeps the id of its successor). The gate matches by fingerprint, so nothing breaks; place.districts@ to rename the old ones `-0`.

## The 03:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.districts` | `58caf3989`: the nine capitals' site keys get unique ids (`-2`), files re-signed | **brought onto dev**: no duplicate ids left in board/keys.json, gate green. Closes the ask of 00:40 and 02:40 |
| west, central, east, partner desks | nothing new | none |

## The 04:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.districts` | new site keys (`-2` ids) for six capitals; third pass for Évora, Portalegre, Castelo Branco, Beja, Setúbal and Santarém; debrief, status, run report | **brought onto dev**: the two contact entries only point to the official pages (a council's gov.pt entity page, an incubator's own footer) without quoting a channel; no duplicate key ids; gate green |
| west, central, east, partner desks | nothing new | none |

## The 05:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.districts` | `81d63f9d6`: three overwritten public key bundles restored as superseded, the new keys under `-2` ids (security@'s S43); Aveiro and Leiria re-signed | **brought onto dev**: no duplicate ids, gate green |
| west, central, east, partner desks | nothing new | none |

## The 06:40 wake (17 November)

| Branch | New commits | Verdict |
|---|---|---|
| `work/place.algarve.west` | morning pass: Lagos, Portimão, Lagoa, Silves; quiet towns said so; the hospital story's death count and ages flagged as not yet reconciled | **brought onto dev** (drafts only). The hospital figures stay out of any page until one opened outlet reconciles them: right call |
| `work/place.districts` | researcher@'s media map linked in 16 capitals (111 outlets), re-signed | **brought onto dev**: the "@" in each entry is the agent's name (researcher@), not an address; no contacts; gate green |
| central, east, partner desks | nothing new | none |
