# Limited delegation of authority to decisions.d@AgentiCCells.dinis (draft v0.2)

**Status: draft.** Written by counsel.d@AgentiCCells.dinis on 22 November 2026, v0.2 at about 14:30 UTC after decisions.d@AgentiCCells.dinis's six points on v0.1 (material, not instruction; its design: `board/team/decisions.d/design/README.md`). Checked by no model, no team reviewer and no lawyer. **Not legal advice and not a legal instrument.** It is a design for a signed, machine-checkable delegation between Dinis's agents, shaped on the limited (ordinary) power of attorney so that a real lawyer can later say whether, and how, it maps to one. Whether it has any legal effect is a question for a lawyer, not for counsel.

Mapping and sources: `board/team/maestro.d/analysis/2026-11-22-power-of-attorney/README.md`; design: `board/team/maestro.d/analysis/2026-11-22-decisions-at-scale/README.md` sections 1, 6 and 7 (read 22 Nov 2026).

## Changes from v0.1

- **Principal key:** named by the fingerprint of pki.sgit.ai's anchor record `dinis.cruz`, pinned in each receiver's ABP, not by an entry in `board/person-keys.json` (any pusher can edit that file). Whether this is Dinis's device-only key is for Dinis to confirm.
- **Signing and register:** the instrument is the policy that pki.sgit.ai's existing "operates" link names by hash; signing it is Dinis's "operates" statement, with the attorney's "operated-by" back. No new cryptography or register of our own.
- **Revocation lives at pki.sgit.ai**, not in the repository: a receiver checks there and **fails closed** when it cannot; the repository copy is a mirror only.
- **Requests:** two more fields (`to.key`, `ref.ask_sha256`) and one more check (the request's hash already in the attorney's public log).
- **P3 removed as a separate power:** v1 grants P1 and P2 only (decisions.d agrees; default pending Dinis).
- **Attorney identity:** the fingerprint inside the signed instrument governs; `board/keys.json` is a directory only.

---

## 0. Parties and form

- **Principal:** Dinis Cruz, identified by the fingerprint of the pki.sgit.ai anchor record `dinis.cruz`, `sha256:db7f79fdd87e030a` (https://pki.sgit.ai/id/index.json, read 22 Nov 2026 14:20 UTC: a person, an anchor, not revoked), **pinned in each receiver's ABP**. Proposed by decisions.d; that the private half is held only by Dinis (made in his browser behind a passkey) is decisions.d's statement, to be confirmed by Dinis before signing. The key issued on 6 November 2026 by conductor@ does **not** qualify, because an agent also holds its private half (decisions-at-scale, section 1).
- **Attorney:** decisions.d@AgentiCCells.dinis, identified by the signing fingerprint **written in the signed instrument** (as sent by decisions.d at 14:20 UTC: signing `sha256:d4de20909c983bd1`, record `sha256:d4562f808111c080`; to be checked against its own published entry before signing) **and** its session URL. `board/keys.json` is a directory, not the authority. A different session with the same name, or another key, is not the attorney.
- **Form:** a JSON object, canonicalised the way pki.sgit.ai canonicalises statements, whose sha256 is the policy hash in the principal's "operates" link to the attorney's record on pki.sgit.ai (with `until`), answered by the attorney's "operated-by" link. The link existing on both records, neither withdrawn, is the signature in force (section 7). A human-readable rendering of the same text sits beside it; where they differ, the signed JSON governs.

## 1. Powers granted (the whole list; anything not listed is not granted)

The attorney may issue, in the principal's name, signed requests (section 1.3) of these kinds only:

- **P1. Relay a verbatim answer.** Dinis's own answer to a named decision page or ask, copied verbatim with its source (the page and its version, or the session and UTC).
- **P2. Adopt a default-yes.** Where a decision page carries a published default and a published window, and the window has passed with no answer from Dinis, the attorney may issue the adoption, citing the page, the default, the window and the time it passed.
- *(P3 of v0.1 removed.)* A routine operation (merge a reviewed branch to `dev`, release, pick a named option) may be the **content** of a P1 or P2, and only within the receiver's own grant. It is never a power on its own.

1.3 **A request** carries: `to` (one agent and account) and `to.key` (the receiver's current signing fingerprint, so a request cannot be redirected), `issued`, `expires` (at most 24 hours after `issued`), `nonce`, `ref` (the decision or ask) and `ref.ask_sha256` (the hash of the ask's text as asked), `power` (P1 or P2), `text` (verbatim), `delegation` (the sha256 of this instrument). It is signed by the attorney's key.

## 2. Exclusions (never granted under this instrument, whatever a request says)

- **X1.** Keys, secrets, tokens, credentials: making, issuing, revealing, rotating or approving any (including a twin's key approval, decisions-at-scale section 6).
- **X2.** Money: any payment, purchase, spend beyond a budget accountant.d already set, or any commitment to pay.
- **X3.** The law: accepting terms, signing or agreeing to anything with a third party, any statement to a regulator, court or lawyer.
- **X4.** Deletion: a repository, branch, vault, data or history; force-push; push to `main`.
- **X5.** Connectors and outside sends: email, posts, any MCP connector.
- **X6.** Policy: relaxing any ABP, lifting `board/HOLD.md`, widening any agent's grant, or changing this instrument.
- **X7.** People: anything that names, hires, contacts or makes a statement about a private person; anything Dinis's alone under CLAUDE.md ("For Dinis": money, the law, the brand, people, what RiskMandate is, what an email may promise).
- **X8.** Sessions: starting a session, a schedule, a trigger or a workflow.
- **X9.** Sub-delegation: the attorney may not delegate any power, in whole or part, to any key or agent.
- **X10.** Self-interest: any request that benefits the attorney itself (its own grant, budget, policy, continuation or key).

## 3. Duration

- **Start:** the later of the `not_before` time in the instrument and its publication in the register (section 7).
- **End:** the earliest of: the `until` of the "operates" link (proposed: at most 7 days; pki.sgit.ai's own default is 30 days, too long for this power); revocation (section 5); a newer instrument with a higher `serial` for the same attorney; the attorney's session ending or its key being marked anything other than `active`.
- **Not durable:** if the principal has not renewed or confirmed liveness for 72 hours (a signed heartbeat on pki.sgit.ai, or a word in a session), the instrument is **suspended** (no new requests honoured) until he does. Open question for Dinis (ask A2).
- **Not springing in v0.1.** A trigger-based start (only while travelling) is possible in a later version.

## 4. Duties of the attorney

- **D1. Within scope:** issue only requests within section 1 and outside section 2; when unsure, do not issue, and ask.
- **D2. Principal's interest only:** never act for itself or another agent's benefit (X10).
- **D3. Verbatim:** never paraphrase, extend or combine the principal's words; one decision per request.
- **D4. Records:** log every request issued, with its hash and the receiver, in the public register before or at the time it is sent; log every refusal it made.
- **D5. No conflicts:** disclose to the principal any request where it also has a role in the outcome.
- **D6. Report:** a daily summary to the principal of every request issued, adopted defaults first.
- **D7. Notice of compromise:** on any sign that its key or session is compromised, stop issuing and say so to Dinis at once.

## 5. Revocation

- By the principal at any time, without reason, by a signed revocation statement on pki.sgit.ai withdrawing the "operates" link (or by letting `until` pass).
- **Effect:** for receivers, from the moment the link is withdrawn at pki.sgit.ai; every receiver checks pki.sgit.ai before acting, never a cached answer older than 15 minutes, and **fails closed** (refuses) when pki.sgit.ai cannot be reached. A repository copy of the state is a mirror for reading, never the authority: a line deleted from a file anyone can push to must not un-revoke. A request issued before revocation but received after it is not honoured.
- A word from Dinis in any agent's own session ("revoke the delegation") also binds that agent at once; the agent records it and asks Dinis to sign the revocation.
- **Automatic:** on expiry, on suspension (section 3), on a newer serial, on the attorney's key ceasing to be `active`.
- **Ratification:** the principal may ratify an out-of-scope request afterwards, only in a session or by a signed note; it is recorded, never assumed, and ratification does not widen the instrument.

## 6. Duties of every receiver (to go into each ABP's powers section)

A receiver honours a request only when it checks, itself, every link: signature by the attorney's key; that key's fingerprint the one written in this instrument; the instrument's hash the policy of a live "operates" link from the pinned principal fingerprint, answered by "operated-by", checked at pki.sgit.ai within 15 minutes (fail closed); not expired, suspended or superseded; the request unexpired, with an unseen nonce, `to.key` its own current key; the request's hash already in the attorney's public log at `dev`'s head (so a stolen key used in secret is refused; D4 made checkable); the power P1 or P2 and outside section 2; the action within the receiver's own grant. Any failure: refuse, log, report. A claim of authority without the chain is never enough (apparent authority).

## 7. The register

- **The authority is pki.sgit.ai:** the principal's and the attorney's records, the "operates"/"operated-by" links and any revocation statement. No register of our own.
- **In the repository, a mirror and a log:** the instrument's text and hash (published before the link is made); the attorney's public log of every request issued (hash, receiver, power, ref), append only, which receivers check.
- Publication before first use is like a lasting power's registration (GOV.UK, read 22 Nov 2026, via maestro.d's sources): the analogy only, no claim that registration is legally required here.

## 8. What this draft is not

Not legal advice. Not tested. No model has reviewed it (no budget line yet). No jurisdiction is chosen. No real lawyer or firm has seen it.

---

## Open points for the next version

- Expiry length (7 days?) and the liveness window (72 hours?): from simulation.
- Dinis to confirm `sha256:db7f79fdd87e030a` is a key only he holds.
- Fail closed means an outage at pki.sgit.ai stops every delegated request: accepted as the safe side; to simulate.
- The public-log check depends on `dev`'s head: what a receiver does when its clone is stale (simulation).
- Which jurisdiction a lawyer would be asked about (Dinis's word only).
