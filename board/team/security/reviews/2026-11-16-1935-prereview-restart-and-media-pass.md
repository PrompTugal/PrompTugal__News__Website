# security@ pre-review: the restart on this account, and the news organisations pass

By security@PrompTugal.dinis (new session, key `security-promptugal-2`), 16 November 2026, about 19:35 UTC.
Read: `board/team/conductor.b/plans/2026-11-16-restart-here.md` (sections 2, 4, 5, 6) and Dinis's go, `board/guidance/2026-11-16-restart-here-go.md` (19:25 UTC).

**Verdict: go for both, under the conditions below.** Nothing here calls for a hold. The conditions marked **must** are to be met before the work they name ships; the rest are asked of their owner and tracked in `findings.md`.

## A. The restart (plan sections 2, 5)

Checked in this session: the environment has the three named secrets set (presence only, values never read), `sgit-ai` is 0.27.0, `pki-agent.mjs` from pki.sgit.ai still hashes to the pinned `sha256 fcb28a1c...`, and account A's scheduled tasks are recorded `disabled` since 15:26Z in `board/schedule.json`.

1. **must (every new session): a new key, never a copied one.** Check `pki-agent.mjs`'s sha256 against the pin before running it; `keygen --session`; add the public half under a new id; mark the old entry `superseded` with the time; **never delete an old entry** (old signatures are checked against it: S43). This session's first prompt again gave the tool's URL without its pin (S24 recurs, conductor.b@): please add the pin line to every first prompt.
2. **must: one session per role.** Before a role starts here, its account-A task stays disabled (it is) and its old session is not resumed. From the time a role's new key is in `board/keys.json`, any commit under that role's name signed or released by the old session is flagged to Dinis (CLAUDE.md). I check this at every wake.
3. **must: lanes and inboxes re-issued, not carried.** Every lane in `board/inbox.json` and every `board/inboxes/<role>.json` credential is sealed to an old key. conductor.b@ re-issues each, sealed to the new key, then retires the old vault. Until then an agent cannot read its inbox: that is a gap in coverage, not a reason to copy a credential from account A.
4. **must: nothing from account A's machines.** No private key, lane credential, vault key, drain credential or transcript is pasted into a session here as "context". The debriefs in this repository are the context; they were written public-safe.
5. **The release queue before the crowd (dev@).** Twenty agents racing `release.sh` caused stale and lost writes before (S43 came from a merge of `board/keys.json`). dev@'s queue goes first, as the plan says.
6. **Writers on `work/<role>` branches.** I review `work/*` and `preview/*` at each wake as well as `dev`; reviewers bring onto `dev` only what passed the gate.
7. **Jose's agents** (conductor@ and local@PrompTugal.jose, now with Dinis's go): a key in `board/keys.json` before the first commit under the name (conductor@'s is there, 18:39); the same rules, the commit convention, `release.sh`. local@ has no key yet.
8. **Transcripts here (S22).** Once the sessions are running, I scan this account's transcripts for printed secrets with `board/team/security/tools/transcript_extract.py`, as I did on account A.

## B. The news organisations and journalists pass (plan section 4; guidance item 3)

Dinis's line (19:25): **a contact published on a public website may be shown, the official channel, linked to its page, with the date read; a private person's email or phone goes only to the private CRM, by a person, never into this repository.** The plan's line, which Dinis called "exactly the line": on the site, the outlet's own published contact page and its editors and journalists by name and role; **not** a person's email or phone.

### Contacts

1. **must: organisation channels only.** In `data/organisations/<id>.json` (kind `media`) and on `/media/<id>/`, a contact is the outlet's own published channel: its contact page URL, its generic newsroom or editorial address, its switchboard, its contact form. Each in `contacts[]` with `source` (the page it was read on, on the outlet's own domain or the ERC register) and `read` (the date).
2. **must: no person's email or phone in the repository**, even where an outlet's staff page publishes a journalist's direct address. Those go to the private CRM by a person (comms protocol), or nowhere. If Dinis later wants named journalists' published work addresses shown, that is his change of the line; until then, no.
3. **must (dev@, before the first media record lands): the gate holds it.** As for S42: an email in a `media` record must be on the outlet's own domain, in a `contacts[]` entry with source and date; the gate refuses one whose local part looks like a person's name (`first.last`, `flast`, a name that matches a journalist in the same record) and refuses any phone in a journalist's entry. A rule in prose did not hold before; a gate check does.
4. **Never quote a contact in a review, debrief, status file or commit message.** Describe it ("the outlet's generic address") instead. The gate rejected my own review for this once.

### People (journalists, editors, owners)

5. **must: public and professional only.** For a journalist: name, role, beat, outlet, links to their bylines on the outlet's site. No home town, no personal social accounts, no personal life, no photo unless the outlet publishes it under a free licence (researcher@'s rule for photos). An owner who is a private person is named only where the ERC register or the outlet names them, as owner.
6. **A "this is wrong / take me off" control** on every outlet and journalist page (the control Dinis asked for on every entity, 15 Nov 23:55), and a removal within a day of a request.

### Reading their sites and feeds

7. **must: polite, public, keyless.** No login, no paywall bypass, no scraping a site whose terms forbid automated reading (the websummit.com lesson, S39): check the terms of the ERC register and of each outlet before a machine reads them; where they forbid it, read by hand. A user agent that names the site, a low rate, `robots.txt` respected.
8. **must: feeds read by our build or a scheduled tool, never in a reader's browser** (S38's lesson). Headlines, dates and links only, sending readers to the outlet; no full text (their copyright); images not hotlinked from readers' browsers.
9. **must: feed content is untrusted input.** Escaped as text, never put into `innerHTML`; links only `http:`/`https:`; size and time limits on each fetch; the list of feed hosts in one file the gate can read. dev.places@ asks me for a code review before the reader merges.
10. **Our feeds out** carry no reader data and no tracking.

### Outreach and money

11. **must: drafts only, a person sends** (R7). A draft names only the outlet's published channel. Drafts by outreach@ and local@PrompTugal.jose share one format.
12. **must: no promise of money without Dinis.** The plan's draft offers "a share of what the meter counts" and the values page says "We pay". What an email may promise, and money, are Dinis's alone (CLAUDE.md, Decisions). Until a For Dinis decision page records his answer, drafts and the values page may describe the meter (`api/v1/billing/meter.json`) as what it records, not as a payment offered.

## What follows

- conductor.b@: S24 (pin in first prompts), lanes and inboxes re-issued (A3), link this pre-review from the pass file when it is opened.
- dev@: B3 (the gate check for media records), B9 (code review of the feed reader).
- ontologist@: the `media` schema carries `contacts[]` with `source` and `read`, and no contact fields on a journalist.
- researcher@, local@PrompTugal.jose, outreach@: B1, B2, B5, B7, B11, B12.
- I post-review the first media records and the first feed reader as they land.
