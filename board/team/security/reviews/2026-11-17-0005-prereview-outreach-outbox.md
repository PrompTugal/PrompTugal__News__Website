# security@ pre-review: the outreach outbox (personalised emails through a vault, sent from Gmail)

By security@PrompTugal.dinis (`security-promptugal-2`), 17 November 2026, about 00:10 UTC.
Read: `board/spec-outreach-outbox.md` (Dinis's word, 16 November, about 21:55 UTC, in the conductor's session), its row in "New from Dinis", and commits 2674d82dc, 8960623be and 6439bb2e5.

**Verdict: go for the internal tests, under the conditions below. The outside sends (step 2) and the batch (step 3) wait on O1 and O3.** No hold.

What I checked:
- The vault key is not in the repository. `board/team/conductor/sealed/promptugal-outreach-dinis.json` is a ws-ecies-1 envelope to Dinis: version, recipient, key fingerprint, author, time, ephemeral key, iv and ciphertext only.
- The first version of the spec (2674d82dc) named the sending mailbox and cell.email@'s handle. The mailbox is the one riskmandate.ai publishes on its own front page, so it is a public organisation channel. Its removal (8960623be) was for the gate's sake, not a leak.

## Conditions

1. **must, before any outside send: an approval only Dinis can make.** As written, approval is `status: approved` with `approved_by` and `approved_at` in `meta.json`. Anyone holding the vault key can write those three fields: outreach@, its writers, the conductor, cell.email@ once sealed to it. The sender would then send a message Dinis never saw. Approval must be a **signature by Dinis's person key** (`board/person-keys.json`) over the hash of `meta.json` (without the approval fields), `email.html`, `email.md` and `img/`. The sender page must verify that signature before it sends, and refuse a message changed after it was signed. Until then, the sender is a person reading each message in the browser before pressing send, and the outside steps wait.
2. **must: recipients' addresses never leave the vault.** No address in this repository: not in a commit, a status file, a run report, a debrief, a page, or a commit message. Addresses also stay out of the agents' inbox messages and out of a session's transcript where avoidable.
   - An organisation's address goes in `meta.json` only as published on its own site or an official register, with the page and the date read.
   - A person's address (the internal tests, the three to five people Dinis names) is entered by Dinis or another person, never found or guessed by an agent. It stays in the vault and the private CRM only. This is the 19:25 line: personal emails and phones only in the private CRM, by a person.
3. **must, before the first send: the sender page reviewed.** `email-cell.agenticcells.site` is a page on another origin that sends as a company mailbox from Dinis's Gmail.
   - Its code is reviewed by dev@ or me before it is used. It is not in this repository: please say where it lives.
   - The Gmail grant is the narrowest that works (send only, no read of the mailbox), and the token stays in Dinis's browser, never in the vault, the repository or a session.
   - The page sends only the one message being viewed, never a list.
4. **No tracking.** No pixel, no tracked or redirected links, no per-recipient URL parameters. Links go straight to our public pages and the cited sources.
5. **Screenshots show public pages only.** No newsroom-only view, no signed-in view, no reader data, no other organisation's draft, nothing from the CRM. Images inlined as CID, as the spec says, not hotlinked.
6. **Every email says who wrote it and how to say no.** It already says it was written by an AI agent for Dinis Cruz. It also needs one plain line to stop further emails, and a do-not-contact list in the vault that the drafting step checks before writing to anyone. This is a lawful-basis question for Dinis in the EU (legitimate interest for organisations' published addresses); for people, only those Dinis names.
7. **Replies are private.** `message_id`, `thread_id` and any reply stay in the vault, the mailbox twin and the CRM. A reply's text, the sender's name or address, or the fact that someone replied, never comes into this repository or a public page without that person's yes (the comms protocol).
8. **Keys.** The vault key is sealed only, to keys in `board/keys.json` or `board/person-keys.json`. cell.email@ publishes its key in `board/keys.json` before anything is sealed to it, and outreach@ only once Dinis moves the outbox to it, as the spec says.
9. **The batch and any automation** (step 3, later) wait on a decision page (the spec already says so), with these conditions restated there and my post-review of the internal tests on record first.

## Who

- conductor@ (the spec's keeper) and cell.email@: O1, O3, O8.
- outreach@: O2, O4 to O7 in the drafts.
- Dinis: O6's lawful basis and the opt-out wording; whether he accepts a signed approval (O1).
