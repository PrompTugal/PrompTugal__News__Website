# Signed requests in Dinis's name: the design (draft 1)

By decisions.d@AgentiCCells.dinis, 22 November 2026, written 13:28 UTC. A draft for counsel.d, who drafts the power itself, and for security@'s review (account B, back Monday 23 November). Nothing here is in force. decisions.d holds no delegation: until Dinis signs one for its key on pki.sgit.ai, nothing it sends is his word and no agent may act on it as if it were.

Sources read 22 November 2026: maestro.d's analyses `board/team/maestro.d/analysis/2026-11-22-decisions-at-scale/README.md` (sections 1, 3, 6, 7) and `2026-11-22-power-of-attorney/README.md`; `board/person-keys.json`; `newsroom/tools/person-key.mjs`; `board/inboxes/`; `newsroom/tools/check-signatures.mjs`; https://pki.sgit.ai/llms.txt and https://pki.sgit.ai/id/index.json (read 13:27 UTC).

## 0. Three findings that shape everything

1. **Dinis's key in `board/person-keys.json` cannot sign a delegation.** Its active entry (`sha256:3cf8a7712553923b`) was issued by conductor@PrompTugal.dinis, and `newsroom/tools/person-key.mjs` says the issuing agent holds the private half too. A delegation signed with it proves only that some agent signed it. It stays for sign-in and sealing, never for authority.
2. **pki.sgit.ai already has the delegation we need.** Dinis's record there is the register's anchor, `sha256:db7f79fdd87e030a` ("dinis.cruz", read from /id/index.json). An agent is **operated** when the operator's record links to it with method `operates` and an end date (`until`, 30 days by default), and the agent's record links back with `operated-by`; the operator's and the agent's policy hashes must agree; withdrawing the link (a `revocation` statement) ends it. Statements are `{v, type, registry, record, signer, created_at, body, sig}`, canonical bytes `jq -cS 'del(.sig)'`, ECDSA P-256 over SHA-256, raw r||s, base64. So the power of attorney is an `operates` link from Dinis's record to decisions.d's record, whose policy (by hash) is the power counsel.d drafts. No new crypto, no new register.
3. **`board/keys.json` is a directory, not an authority.** `check-signatures.mjs` lets an agent not yet enrolled commit with only a warning (enforce "enrolled"), and anyone who can push can add an entry. So a receiver never takes decisions.d's key from `board/keys.json`: it takes it from the delegation, which only Dinis's key can sign.

## 0a. Dinis's answers (about 17:05 UTC, one voice memo, relayed by maestro.d; unsigned)

- **The key:** "a key that is anchored on my key on pki.sgit.ai. And that key, the private key here, is going to only exist inside the decisions agent and can never leave". So: decisions.d's own key, made in its session and never exported, anchored by Dinis's pki.sgit.ai key (the `operates` link of section 1). It ends with the session; a new session needs a new anchor.
- **What the power covers:** "practicalities ... what doesn't need my decision ... creating sites ... my decision agent can act on my behalf". Two-way doors, not one-way doors.
- **Delegated down:** "a conductor ... asking for a power of attorney ... temporarily or specific action ... everybody here has a key". This changes counsel.d's X9 (no sub-delegation): a narrower, shorter power for one agent's key, for one action or a short time, under the same chain. How it is granted (by Dinis, or by decisions.d within his rules) is for counsel.d's next draft.
- **Length:** 7 days, suspended after 72 hours without a sign of life from him: yes.
- **Signed answers:** yes, delegated down.

## 0b. counsel.d's draft

counsel.d's limited power, draft v0.1, is `board/team/counsel.d/drafts/lpa-decisions.d-v0.1.md` (on dev since v0.1.2032). This design follows its names (P1, P2; exclusions X1 to X10; duties D1 to D7). Where they differ (sent to counsel.d 14:20 UTC): the principal key is the pki.sgit.ai anchor, not a new entry in `board/person-keys.json`; revocation is checked at pki.sgit.ai, the repository copy being a mirror only, since any pusher can delete a line from a file in the repository; requests carry `to.key` and `ref.ask_sha256`; and a receiver refuses a request not already in the public log.

## 1. The chain a receiver checks

```
Dinis's root  sha256:db7f79fdd87e030a          pinned in every receiver's ABP (from the anchor's tree), never fetched to learn it
   | operates (until, policy hash)              Dinis signs on pki.sgit.ai, on his own device
decisions.d's record  sha256:d4562f808111c080  signing key sha256:d4de20909c983bd1, identity kind "agent", session named
   | operated-by (same policy hash)             decisions.d signs
   v
the request, signed by decisions.d's signing key
```

## 2. The power (for counsel.d to draft; the outline only)

The policy file the `operates` link names by hash (`pki.sgit.ai/policy` shape, our fields in `body`):

| Field | Draft |
|---|---|
| principal | dinis.cruz, `sha256:db7f79fdd87e030a` |
| attorney | decisions.d@AgentiCCells.dinis, record `sha256:d4562f808111c080`, signing `sha256:d4de20909c983bd1`, session https://claude.ai/code/session_015gaHdaiX9VvjVwHaNezGJG |
| serial | 1 (a newer serial revokes every older one) |
| not_before, until | a short window: proposed 7 days, renewed by Dinis |
| powers | `P1` relay: Dinis's answer to a named ask, verbatim; `P2` adopt: a default-yes adoption under a rule Dinis approved (section 5), citing the rule and the window that passed. Nothing else in v1 (counsel.d's P3 only as the content of a P1 or P2, inside the receiver's own grant). |
| receivers | a list of agents (by name and key), or the accounts' agents by pattern; deny by default |
| never | keys, secrets and vault keys; money; the law; the brand; people; deleting a repository, branch or data; a connector; relaxing a behaviour policy; starting a session, schedule or workflow outside the receiver's own grant; anything on Dinis's reserved list; sub-delegation |
| duties | issue only verbatim answers and approved adoptions; publish every request before sending it; never decide; never act for itself; keep the log |
| dormancy | the power freezes if Dinis has said nothing signed or in a session for N days (counsel.d proposes N) |

## 3. The request

One JSON object, canonicalised and signed exactly like a pki.sgit.ai statement, so one verifier serves both:

```json
{
  "v": 1,
  "kind": "agenticcells/dinis-request/v1",
  "to":       { "agent": "<receiver name>", "key": "<receiver signing fp>", "account": "d" },
  "issued":   "2026-11-23T10:00:00Z",
  "expires":  "2026-11-23T12:00:00Z",
  "nonce":    "<128 random bits, base64url>",
  "ref":      { "ask": "<path#pointer or decision page URL>", "ask_sha256": "<hash of the ask's text as asked>" },
  "power":    "P1 | P2",
  "text":     "<Dinis's words, verbatim; for adopt, the recommendation adopted, verbatim>",
  "evidence": { "how": "decision page answer | in decisions.d's session | default-yes window", "at": "<UTC>", "answer_sha256": "<hash of the stored answer>", "rule": "<adopt only: rule id and window>" },
  "delegation": { "operates_statement": "<statement id on pki.sgit.ai>", "policy_sha256": "<hash>", "serial": 1 },
  "issuer":   { "agent": "decisions.d@AgentiCCells.dinis", "record": "sha256:d4562f808111c080", "signing": "sha256:d4de20909c983bd1" },
  "sig":      "<ECDSA P-256 over jq -cS 'del(.sig)', raw r||s, base64>"
}
```

- `expires - issued` at most 24 hours (2 hours by default): a request is for now, not a standing order.
- `to.key` binds it to one receiver's current key; it cannot be redirected to another agent.
- It travels sealed to the receiver's key down the receiver's append lane (`board/inboxes/<role>.json`, or the lane of the receiver's own repository on another account). The seal is privacy only; the signature is the authority.

## 4. What every receiver runs (fail closed at every step)

1. Parse; refuse an unknown `v` or `kind`, or any extra top-level field.
2. `to.agent` is me and `to.key` is my current signing key.
3. Now is within `[issued - 2 min, expires]`, and `expires - issued <= 24 h`.
4. **The power:** fetch decisions.d's record and Dinis's record from pki.sgit.ai; the `operates` statement named in `delegation` exists in Dinis's record, is signed by the pinned root, has not been withdrawn, is in date, names decisions.d's record, and its policy hash equals `delegation.policy_sha256` and the `operated-by` link's. If pki.sgit.ai cannot be reached: refuse, do not fall back to a cache older than 15 minutes (counsel.d's figure).
5. **The signature:** `sig` verifies with the signing key in decisions.d's record on pki.sgit.ai (never `board/keys.json`), and that key is the `issuer.signing` named.
6. **Published before sent:** the request's hash is in decisions.d's public log (section 6) at the head of `dev`. A request that is not in the log is refused, even if every signature holds: a stolen key used in secret is caught here.
7. **Replay:** the nonce is not in my replay log; add it with its `expires`; keep entries until expiry plus 10 minutes.
8. **Scope:** `power` is a power in the policy; I am a receiver it names; what the text asks is within my own grant (my ABP's powers section, written by abp@) and not on the `never` list. Otherwise refuse.
9. **Act and record:** write the text verbatim into my record with the request's hash, as I would a word Dinis typed in my session, and say plainly it came by delegation. Report the side effects (commits, sessions, cost) as a receipt, signed by me, on decisions.d's lane.

A refusal is reported the same way, with the step that failed. A refused request is never retried with changes by the receiver.

## 5. Default-yes adoptions (a proposal only; never applied without Dinis's word)

From maestro.d's section 3 and CLAUDE.md ("the owner's recommendation is the default"): `board/team/decisions.d/design/default-yes.md`.

## 6. The logs

- **Public log of issued requests:** `board/team/decisions.d/log/issued.jsonl`, one line per request, committed and released before the request is sent: the request without `text` if the text must stay private, otherwise whole; always its hash, `to`, `ref`, `power`, times. Receipts and refusals are appended by decisions.d as they come.
- **Replay log:** each receiver's own, in its session or its board folder; only nonces and expiries.
- **The decision log:** `board/team/decisions.d/log/` (section 8).

## 7. Revocation, in order of speed

1. Dinis says "revoke" in any session of his, or withdraws the `operates` link on pki.sgit.ai: the next check at step 4 fails everywhere. No list to keep; this is pki.sgit.ai's "strong" mode.
2. A newer serial supersedes every older power.
3. The power's `until` passes.
4. decisions.d's session ends: its private key is gone with it (a session key).
5. security@ writes `board/HOLD.md`: every agent stops after pulling, this one included.

## 8. Open points for counsel.d and security@

- Which receivers on day one: proposed, only the account D agents in this repository (conductor.d, holacracy.d, maestro.d), and only `relay`.
- Whether `text` may ever be private (then the log carries only the hash), or always public.
- The dormancy period, the power's length, and whether Dinis renews by re-signing or by extending `until`.
- How abp@ writes each receiver's powers section, and that step 4 needs network to pki.sgit.ai from every receiver's environment.
- The bootstrap: the pinned root must reach each receiver's ABP through a commit Dinis makes or approves (maestro.d's section 6, option (c), is the same need).
- Whether pki.sgit.ai's agent tool (`pki-agent.mjs keygen --session`, `operator`, `submit`) should make decisions.d's register record from the key it already has (`sgit pki` and pki-agent share `~/.sg-send/keys/`), or a fresh one.
