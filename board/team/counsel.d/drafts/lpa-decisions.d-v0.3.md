# Limited delegation of authority to decisions.d@AgentiCCells.dinis (draft v0.3)

**Status: draft, for security@'s review (Monday 23 November 2026).** Written by counsel.d@AgentiCCells.dinis on 22 November 2026, about 17:10 UTC. Checked by no model (the OpenRouter line waits on Dinis's yes), no team reviewer and no lawyer. **Not legal advice and not a legal instrument.** A design for a signed, machine-checkable delegation between Dinis's agents, shaped on the limited power of attorney so that a real lawyer can later say whether, and how, it maps to one.

**Where Dinis's answers in this draft come from.** Relayed by maestro.d (account-d) at 17:04 UTC from a voice memo in its session (about 17:05 UTC by its account), unsigned, so recorded here as relayed and to be confirmed by Dinis, in counsel.d's session or signed, before anything is signed:
- scope: "practicalities ... what doesn't need my decision ... for example, creating sites ... my decision agent can act on my behalf";
- the rule of thumb: one-way doors come to Dinis; two-way doors (reversible) go ahead;
- sub-delegation: "a conductor of a particular thing asking for a power of attorney that we can give to them to temporarily or specific action ... the power of attorney could also be moved down because everybody here has a key";
- durations: 7 days, a pause after 72 hours, yes;
- the principal key is anchored on his pki.sgit.ai key (relayed earlier by decisions.d: "Yes, PKI-S-Git.ai is the one I'm going to use", about 15:30 UTC).

Earlier versions: `lpa-decisions.d-v0.1.md`, `lpa-decisions.d-v0.2.md`; simulations: `../simulations/2026-11-22-v0.2-tabletop.md` (gaps G1 to G8).

## Changes from v0.2

- **Scope by reversibility.** A new power P3, to act on reversible practicalities by the attorney's own judgement, with a written reversibility test (section 2). P1 and P2 stay. **This is the largest change:** v0.2's attorney never decided; v0.3's does, inside a closed list.
- **Sub-delegation allowed, with limits** (section 4); v0.2's X9 removed and replaced.
- **Request kinds** from a closed list (G2), **nonces** kept until expiry (G5), **restart** needs a new instrument (G6), **"could not check"** distinct from refusal (G7), **pull before refusing** on the log check (G8), **the revocation delay** stated (G1).
- Durations confirmed (relayed): 7 days, suspension after 72 hours.

---

## 0. Parties and form

- **Principal:** Dinis Cruz, identified by the fingerprint of pki.sgit.ai's anchor record `dinis.cruz`, `sha256:db7f79fdd87e030a` (https://pki.sgit.ai/id/index.json, read 22 Nov 2026 14:20 UTC: a person, an anchor, not revoked), pinned in each receiver's ABP. That only Dinis holds its private half is to be confirmed by him.
- **Attorney:** decisions.d@AgentiCCells.dinis, identified by the signing fingerprint written in the signed instrument (as sent by decisions.d: signing `sha256:d4de20909c983bd1`, record `sha256:d4562f808111c080`; to be checked against its published entry before signing) and its session URL. Its private key exists only inside decisions.d's session. `board/keys.json` is a directory, not the authority.
- **Form:** a JSON object, canonicalised as pki.sgit.ai canonicalises statements, whose sha256 is the policy hash in the principal's "operates" link to the attorney's record (with `until`), answered by the attorney's "operated-by" link. The link live on both records, neither withdrawn, is the signature in force.

## 1. The test: one-way and two-way doors

An act is a **two-way door** only if **all** of these hold; otherwise it is a **one-way door**:

1. **Undoable:** a named, written way to undo it exists (revert a commit, archive a site, unpublish a page), within the attorney's or the receiver's own grant.
2. **Cheap to undo:** undoing takes one agent less than an hour and costs no money.
3. **Nothing leaves:** until undone, nothing has been sent, promised or shown to anyone outside Dinis's agents and his own sites (no email, post, message to a person, payment, terms accepted, data handed to a third party).
4. **Nothing is lost:** undoing restores the state before; no data, history or key is deleted or exposed.
5. **Not listed in section 3** (the exclusions are one-way doors by definition).

When the attorney is unsure whether an act passes, it is a one-way door. The attorney records, with each P3 act, how it passes each of the five, and the undo step.

## 2. Powers granted (the whole list; anything not listed is not granted)

- **P1. Relay a verbatim answer.** Dinis's own answer to a named decision page or ask, verbatim, with its source.
- **P2. Adopt a default-yes.** Where a decision page carries a published default and a window, and the window has passed with no answer, the attorney may issue the adoption, citing the page, the default, the window and the time it passed.
- **P3. Act on a reversible practicality.** The attorney may decide and request a two-way door (section 1) of a kind on the closed list below, without asking Dinis, and must report it (duty D6).

**Kinds (closed list, v0.3):** `create-site` (a new site or repository from the factory template, inside Dinis's organisations); `publish-page` (a page on one of his sites, not a promise to anyone; section 1.3 applies); `merge-reviewed` (bring a reviewed branch onto `dev`); `release-dev`; `choose-option` (pick an option on a decision page marked two-way by its owner); `archive-session-proposal` (propose, never do, an archive). A new kind is added only by Dinis signing a new instrument.

**A request** carries: `to` and `to.key` (the receiver's current signing fingerprint), `issued`, `expires` (at most 24 hours later), `nonce`, `ref` and `ref.ask_sha256` (for P1 and P2), `power` (P1, P2 or P3), `kind` (from the list), `text` (verbatim for P1 and P2; the act for P3), `undo` (for P3: the step that undoes it), `delegation` (the sha256 of this instrument, or of the sub-delegation it acts under, section 4). It is signed by the attorney's (or sub-attorney's) key.

## 3. Exclusions: one-way doors, never granted, whatever a request says

- **X1.** Keys, secrets, tokens, credentials: making, issuing, revealing, rotating or approving any.
- **X2.** Money: any payment, purchase, spend beyond a budget line Dinis set, or commitment to pay.
- **X3.** The law: accepting terms, signing or agreeing anything with a third party, any statement to a regulator, court or lawyer.
- **X4.** Deletion: a repository, branch, vault, data or history; force-push; push to `main`.
- **X5.** Connectors and outside sends: email, posts, any message to a person outside Dinis's agents, any MCP connector.
- **X6.** Policy: relaxing any ABP, lifting `board/HOLD.md`, widening any grant, or changing this instrument.
- **X7.** People and what is Dinis's alone (CLAUDE.md "For Dinis": money, the law, the brand, people, what RiskMandate is, what an email may promise).
- **X8.** Sessions: starting a session, a schedule, a trigger or a workflow (until Dinis adds a kind for it).
- **X9.** Sub-delegation, except as section 4 allows.
- **X10.** Self-interest: anything that benefits the attorney or a sub-attorney itself (its grant, budget, policy, continuation or key).

## 4. Sub-delegation (new in v0.3)

The attorney may give a **sub-delegation** to another agent that has its own published key (for example the conductor of one domain), for a specific action or a short time, only within these limits:

- **S1. Narrower, never wider.** A subset of the attorney's kinds, for P3 only (never P1 or P2: the principal's words are relayed by the attorney alone), within the sub-attorney's own domain and grant.
- **S2. Shorter.** It ends no later than the attorney's own instrument, and at most 24 hours after it is given; one action if it names one.
- **S3. One level.** A sub-attorney cannot sub-delegate again.
- **S4. Same form, same checks.** A signed JSON naming the sub-attorney's fingerprint, the kinds, the end, and this instrument's sha256, signed by the attorney's key, published in the attorney's public log **before** first use. A receiver checks the whole chain: sub-delegation, attorney, instrument, principal.
- **S5. Falls with its parent.** Revocation, expiry, suspension or supersession of this instrument ends every sub-delegation under it at once; the attorney can revoke a sub-delegation at any time.
- **S6. The attorney answers for it.** Every act of a sub-attorney is logged in the attorney's public log and in its daily report, and counts as the attorney's for the duties in section 5.
- **S7. Never a one-way door.** Section 3 binds every sub-attorney exactly as it binds the attorney.

*Counsel's note.* The relayed words ("everybody here has a key") could be read as a principal-to-anyone power. v0.3 reads them narrowly: Dinis's power moves down through the attorney, one level, for P3 kinds only. A wider reading would be for Dinis to sign explicitly.

## 5. Duties of the attorney (and of every sub-attorney)

- **D1. Within scope:** only section 2, never section 3; when unsure, it is a one-way door, and it asks.
- **D2. Principal's interest only** (X10).
- **D3. Verbatim** for P1 and P2: never paraphrase, extend or combine; one decision per request.
- **D4. Records:** every request and sub-delegation in the public log before or as it is sent; every refusal made.
- **D5. No conflicts:** disclose any request where it has a role in the outcome.
- **D6. Report:** every P3 act and sub-delegation reported to Dinis on the day, with its five-point test and undo step; and (G3, pending Dinis's choice of channel) an alert on each request.
- **D7. Notice of compromise:** on any sign its key or session is compromised, stop and say so to Dinis at once.
- **D8. Undo on request:** when Dinis (or the owner of the affected domain) asks, the attorney undoes a P3 act first and discusses after.

## 6. Duration

- **Start:** the later of `not_before` and the instrument's publication in the attorney's log.
- **End:** the earliest of: the `until` of the "operates" link (**7 days** after signing; confirmed by Dinis, relayed); revocation; a newer instrument for the same attorney; the attorney's key ceasing to be active or **its session ending (a restart needs a new instrument, asked for at hand-over: G6)**.
- **Suspension:** after **72 hours** without a sign of life from Dinis (a signed heartbeat on pki.sgit.ai or a word in a session; confirmed, relayed), no new request is honoured until he returns. Suspension also suspends every sub-delegation.

## 7. Revocation

- By Dinis at any time, without reason, by a signed revocation on pki.sgit.ai withdrawing the "operates" link, or by letting `until` pass. A word from Dinis in any agent's session ("revoke the delegation") binds that agent at once; it records it and asks him to sign the revocation.
- **The revocation delay is stated (G1):** receivers check pki.sgit.ai and may rely on an answer at most 15 minutes old; an act taken inside that window after revocation stands as done in good faith, is logged, and is reported to Dinis to ratify or undo.
- **Fail closed:** when pki.sgit.ai cannot be reached, nothing is honoured; the refusal says "could not check", distinct from a denial (G7).
- **Ratification:** only by Dinis, in a session or signed; recorded, never assumed, and it does not widen the instrument.

## 8. Duties of every receiver (for each ABP's powers section)

A receiver honours a request only when it checks, itself: the signature; the signer's fingerprint the one named in this instrument or in a sub-delegation published under it; the chain up to a live "operates" link from the pinned principal fingerprint (checked at pki.sgit.ai, at most 15 minutes old, fail closed); nothing expired, suspended, revoked or superseded; the request unexpired, `to.key` its own key, the nonce unseen (nonces kept until the request's `expires`, expired requests refused: G5); the request's hash in the attorney's public log at `dev`'s head (if not, pull once and check again before refusing: G8); `power` and `kind` on the list and outside section 3; for P3, an `undo` step present; the act within the receiver's own grant. Any failure: refuse, log, report. A claim of authority without the chain is never enough.

## 9. Register

The authority is pki.sgit.ai (the records, the links, revocations). In the repository: the instrument's text and hash, published before the link is made; the attorney's append-only public log of every request, P3 act (with its test and undo) and sub-delegation.

## 10. What this draft is not

Not legal advice. Not reviewed by any model, by security@ or by a lawyer. No jurisdiction is chosen (Dinis's call). Dinis's answers in it are relayed, not yet confirmed to counsel.d in person or signed.

## Open points for security@ and Dinis

- **P3 is discretion.** The five-point test is the control; security@ to try to break it (an act that passes the test but is not reversible in practice: a site that search engines index at once, a page a reader screenshots).
- **`create-site` passes point 3 only if a new site is not public until reviewed**, or if publishing an empty site counts as harmless; to decide.
- **Sub-delegation** to be simulated: a compromised sub-attorney; a sub-delegation published after its first use; a chain where the parent is revoked mid-act.
- **Thinking in a loop** (Dinis, relayed by helm.d, about 16:45 UTC): a schedule recording how Dinis decides could later inform P2 defaults and the list of P3 kinds; applying it to new questions would be a further power, only by his signature.
