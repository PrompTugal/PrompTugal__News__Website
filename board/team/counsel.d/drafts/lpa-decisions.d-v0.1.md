# Limited delegation of authority to decisions.d@AgentiCCells.dinis (draft v0.1)

**Status: draft.** Written by counsel.d@AgentiCCells.dinis on 22 November 2026. Checked by no model, no team reviewer and no lawyer. **Not legal advice and not a legal instrument.** It is a design for a signed, machine-checkable delegation between Dinis's agents, shaped on the limited (ordinary) power of attorney so that a real lawyer can later say whether, and how, it maps to one. Whether it has any legal effect is a question for a lawyer, not for counsel.

Mapping and sources: `board/team/maestro.d/analysis/2026-11-22-power-of-attorney/README.md`; design: `board/team/maestro.d/analysis/2026-11-22-decisions-at-scale/README.md` sections 1, 6 and 7 (read 22 Nov 2026).

---

## 0. Parties and form

- **Principal:** Dinis Cruz, identified by a signing key made and kept on his own device and published in `board/person-keys.json` with `"role": "principal-device"`. The key issued on 6 November 2026 by conductor@ does **not** qualify, because an agent also holds its private half (decisions-at-scale, section 1).
- **Attorney:** decisions.d@AgentiCCells.dinis, identified by **both** its key id in `board/keys.json` (signing fingerprint stated in the instrument) **and** its session URL. A different session with the same name is not the attorney.
- **Form:** a JSON object, canonicalised, signed by the principal on pki.sgit.ai, published with its sha256 before first use (section 7). A human-readable rendering of the same text sits beside it; where they differ, the signed JSON governs.

## 1. Powers granted (the whole list; anything not listed is not granted)

The attorney may issue, in the principal's name, signed requests (section 1.3) of these kinds only:

- **P1. Relay a verbatim answer.** Dinis's own answer to a named decision page or ask, copied verbatim with its source (the page and its version, or the session and UTC).
- **P2. Adopt a default-yes.** Where a decision page carries a published default and a published window, and the window has passed with no answer from Dinis, the attorney may issue the adoption, citing the page, the default, the window and the time it passed.
- **P3. Routine operations within a receiver's own domain**, only when they are the content of a P1 or P2: merge a reviewed branch to `dev`, release to `dev`, pick a named option on a decision page.

1.3 **A request** carries: `to` (one agent and account), `issued`, `expires` (at most 24 hours after `issued`), `nonce`, `ref` (the decision or ask), `power` (P1, P2 or P3), `text` (verbatim), `delegation` (the sha256 of this instrument). It is signed by the attorney's key.

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
- **End:** the earliest of: `expires` (proposed: at most 7 days after signing in v0.1, to be tuned by simulation); revocation (section 5); a newer instrument with a higher `serial` for the same attorney; the attorney's session ending or its key being marked anything other than `active`.
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

- By the principal at any time, without reason, by a signed revocation on pki.sgit.ai naming the instrument's sha256, published in the register's revocation list.
- **Effect:** for receivers, from the moment the revocation is in the published list; every receiver checks the list before acting, never a cached copy older than (proposed) 15 minutes. A request issued before revocation but received after it is not honoured.
- A word from Dinis in any agent's own session ("revoke the delegation") also binds that agent at once; the agent records it and asks Dinis to sign the revocation.
- **Automatic:** on expiry, on suspension (section 3), on a newer serial, on the attorney's key ceasing to be `active`.
- **Ratification:** the principal may ratify an out-of-scope request afterwards, only in a session or by a signed note; it is recorded, never assumed, and ratification does not widen the instrument.

## 6. Duties of every receiver (to go into each ABP's powers section)

A receiver honours a request only when it checks, itself, every link: signature by the attorney's key; the key named in this instrument; the instrument signed by the principal's device key; the instrument in the register and not revoked, expired, suspended or superseded; the request unexpired with an unseen nonce; the power within section 1 and outside section 2; the action within the receiver's own grant. Any failure: refuse, log, report. A claim of authority without the chain is never enough (apparent authority).

## 7. The register

- `board/delegations/` (proposed path): each instrument's signed JSON, its sha256, the time published; `revocations.json`; `requests.log` of every request issued (hash, receiver, power, ref).
- Publication before first use, like a lasting power's registration (GOV.UK, read 22 Nov 2026, via maestro.d's sources): the analogy only, no claim that registration is legally required here.

## 8. What this draft is not

Not legal advice. Not tested. No model has reviewed it. No jurisdiction is chosen. No real lawyer or firm has seen it.

---

## Open points for the next version

- Expiry length (7 days?) and the liveness window (72 hours?): from simulation.
- Whether P3 belongs in v1 at all, or P1 and P2 only.
- Where Dinis's device key and the register live, and who may write the register (security@).
- Which jurisdiction a lawyer would be asked about (Dinis's word only).
