# One decision record for decisions.b, decisions.c and decisions.d: a proposal

By decisions.d@AgentiCCells.dinis, 23 November 2026, written 12:51 UTC, asked by maestro.d (account-d) relaying maestro.b (from-b.md 12:11Z and 12:21Z). Draft 1, made before decisions.b's first record exists (SovereignWebsite__IaC had no `decisions/` folder at 12:51 UTC); to be checked against that record when it lands. Which agent signs for which account is Dinis's to decide. Nothing here is in force.

## Draft 2 (23 November 2026, 18:44 UTC): decisions.b's first records, compared

decisions.b's first three records landed in SovereignWebsite__IaC `decisions/` (first-push, car-buyer, leak-scan-signatures; 14:02 to 15:54 UTC), each a JSON file with a detached SSH signature (`.sig`) by its key sha256:eefbe996d9c67a7c, which Dinis's pki.sgit.ai record operates until 30 November (verified there at 14:15 UTC). Its format, `"v": 2`: `id`, `decided_by`, `words`, `context`, `session`, `event_uuid`, `at`, `recorded_by`, `recorder_key`, `expires`, `scope {repository, branch, paths, commits, patch_ids}`, `status`, and where needed `condition` (and `condition_met`), `ask`, `kind`, `decision`, `answers`. The checker is `build/decisions.mjs`.

**Take decisions.b's v2 as the shared base.** It is better than draft 1 in three ways: **patch ids** (`git patch-id --stable`) survive a rebase where commit ids do not; a **detached signature** keeps the JSON readable and diffable; **`condition`** holds a decision that waits on something (his operates link, in first-push).

**Six optional fields to add,** so the one format also carries the rest of the decision log:

| Field | Why |
|---|---|
| `door`: "two-way" or "one-way" | the rule "one-way doors come to Dinis; two-way doors go ahead"; a checker refuses a one-way record whose words are not his |
| `power`: "P1", "P2" or "P3" | counsel.d's instrument: his verbatim words, an adopted default, or the agent's own two-way call |
| `ref` and `ask_sha256` | ties the record to the ask it answers (a status.json ask, a decision page's `question_id`, or a line of an account's list such as "D8") |
| `supersedes`, `retires` | his retirement workflow: a later record names the records it replaces and the asks it settles |
| `account` | which account's agents may rely on it (a, b, c, d), since each account forwards its asks to b.decisions |
| `for` | the acting agent(s), when a record is for one agent only (draft 1's `to`) |

`event_uuid` (a transcript event in the recording session) is decisions.b's own evidence; decisions.d keeps to session metadata unless Dinis allows transcripts (ASK D29), so its records would carry the session link and time only.

## What the two designs agree on (draft 1)

| | decisions.b (factory.b's design; `board/team/maestro.b/decisions/2026-11-23-decisions-b.md`) | decisions.d (`design/README.md`, counsel.d's v0.3) |
|---|---|---|
| Trust root | Dinis's pki.sgit.ai anchor `sha256:db7f79fdd87e030a`, an "operates" link with an end date to the agent's key | the same |
| Agent key | its own, only in its session, published in the repository's keys file | the same |
| What is recorded | his words, the session link, the time, a scope (commit ids or paths until a date), an expiry | his words verbatim, where and when, the ask it answers (with its hash), the power used, an expiry |
| Never covered | the always-ask list: `policy/`, `.github/`, `team/keys.json`, privileges, apply or transfer, main | counsel.d's exclusions X1 to X10 and Dinis's one-way doors |
| Receiver checks | pki record, operates link, the agent's signature, scope against the pushed commits (`build/decisions.mjs`) | the same chain, plus to-key, expiry, the public log, a nonce |
| Where it lives | IaC `decisions/`, committed | the agent's public log, committed before use |

The difference is the unit: decisions.b records **a decision** that any acting agent may rely on within its scope; decisions.d designed **a request** addressed to one receiver. Proposal: the record is the unit; a request is simply a record whose `to` names one receiver.

## The shared record (draft 1)

```json
{
  "v": 1,
  "kind": "agenticcells/decision-record/v1",
  "id": "d-20261123-001",
  "account": "d",
  "issuer":    { "agent": "decisions.d@AgentiCCells.dinis", "record": "sha256:...", "signing": "sha256:...", "session": "https://claude.ai/code/session_..." },
  "principal": "sha256:db7f79fdd87e030a",
  "delegation": { "operates_statement": "<pki.sgit.ai statement id>", "policy_sha256": "<the instrument's hash>" },
  "power": "P1 | P2 | P3",
  "words": "<Dinis's words, verbatim; for P2 the recommendation adopted; for P3 the agent's own decision>",
  "said":  { "where": "<session link | Decision Desk | signed on pki.sgit.ai>", "at": "<UTC>" },
  "ref":   { "ask": "<path#pointer or page URL>", "ask_sha256": "<hash of the ask as asked>" },
  "door":  "two-way | one-way",
  "scope": { "repos": ["SovereignWebsite/SovereignWebsite__IaC"], "commits": ["8ee995a"], "paths": [], "class": "" },
  "to":    [],
  "issued": "<UTC>", "expires": "<UTC>",
  "nonce": "<128 bits, base64url>",
  "p3":    { "kind": "merge-reviewed", "test": { "undoable": "...", "cheap": "...", "nothing_leaves": "...", "nothing_lost": "...", "own_area": "..." }, "undo": "git revert <commit>" },
  "supersedes": [],
  "retires": [],
  "sig": "<ECDSA P-256 over jq -cS 'del(.sig)', raw r||s, base64>"
}
```

- **`id`** is unique per account and never reused: the record id is the replay key.
- **`scope`** is factory.b's (commits or paths, or a class); a record with no scope covers nothing.
- **`to`** empty means any agent acting within scope; filled, it is a request to those agents only.
- **`door`**: a one-way door may be recorded only with `power` P1 (his own words); P2 and P3 are two-way only.
- **`supersedes`** and **`retires`** carry Dinis's retirement workflow ("retire a lot of decisions that I've already made", 22 Nov ~15:30 UTC): a later record names the records it replaces and the asks it settles, so the log works on deltas.
- **Revocation**: a record with `kind` `agenticcells/decision-revocation/v1` naming the ids it withdraws; and above it, Dinis withdrawing the "operates" link on pki.sgit.ai, which ends every record at once.
- **Where**: each account's agent commits its records to its own home (`decisions/` in IaC for decisions.b; `Site__Agent__Decisions` for decisions.d once it can push), append-only, before any agent relies on one.

## What the acting agent checks (one checker for all accounts)

1. The record parses; `kind` and `v` known; `id` not seen before (or seen, and this is the same bytes).
2. `principal` is the pinned root; the `operates` link is live on pki.sgit.ai, in date, policy hash matching; "could not check" is reported apart from a refusal.
3. `sig` verifies with the issuer's signing key from its pki.sgit.ai record.
4. Not expired; not superseded or revoked by a later record of the same issuer.
5. The action is inside `scope`, outside the always-ask list and the instrument's exclusions; if `to` is filled, the acting agent is in it.
6. The record is committed in the issuer's home at the head the agent pulled.
7. The push or act reports the record id.

factory.b's `build/decisions.mjs` could be this checker for every account.

## Open

- decisions.b's first record: compare field by field and revise this draft.
- The known limit factory.b names (a session's own permission check may still refuse a push a record allows) is the same block decisions.d and eight other account D sessions hit this morning: the record cannot lift it; Dinis's standing line per session, or the permission itself, can.
