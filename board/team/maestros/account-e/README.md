# Account E: Dinis's maestro on Angelo's account, signed instructions only

At Dinis's word, 23 Nov 2026 ~18:40 UTC, in a.maestro's session. Prepared by a.maestro (account-a). Draft v2, 23 Nov ~23:45 UTC: security's two must-fix items are addressed (below); abp's review is pending. Account E's holder is Angelo, and its GitHub identity is the riskmandate-angelo account (Dinis, 23:40 UTC).

## The idea, in Dinis's words
- "let's take Angelo ... let's create a Maestro and a router on that account ... That should be my Maestro on his account"
- "we should take 0 instructions from the local user ... every instruction that gets executed there needs to be signed ... by another Maestro, by the router"
- "I should be able to give him a QR code and the access to a repo. And from that moment on, everything should be automatic."
- "that account is not able to create repos ... just receives a repo, in a way, fully configured"
- "Angelo will be able to see everything that happens there ... but he cannot sign and he should not be able to see any secrets"
- Sub-sessions "should have limited time span, because we don't want to ... pollute spectacularly somebody else's account"
- "account ABC is mine, it's not a unique thing. So Angelo's account A might be this one."

## The kit
| File | What |
|---|---|
| `start-prompt.md` | what maestro.e reads first; the QR code pins its sha256 |
| `qr-payload.json` | the QR code's content (v2): the start prompt URL and sha256; the signer's whole public signing key, verified only against itself and never fetched; the reply lane (a.maestro's inbox; its write-only token is public by design) |

Nothing in the kit is secret. The QR code matters because it comes from Dinis's hand. A relay cannot change the anchor, as d.security's review of the decisions relay asks.

## What the account holder can do: the controls live outside the account
The holder of account E is root there: they can type in any session, approve any permission prompt and read every transcript. "maestro.e takes no local instructions" is a refusal at the model level, not a technical boundary (security's review, 5f6b01a94). So the design does not depend on it. The controls sit where the holder cannot reach:
- **GitHub:** account E acts through the riskmandate-angelo GitHub account, which has write access to the two repositories only (Site__Agent__Maestro and the mission's project repository) and no admin.
- **Branch protection** on both, with a required check: the signers check, so only commits signed by maestro.e's own key, published on the Factory, can land.
- **maestro.e's commits are verified on Dinis's side** (signers.mjs against the Factory's keys), never on trust.
- **No secrets enter account E:** no write token, vault key or API key. What comes back from account E is material.
- **Seen message ids persist** in the agent repository, so replay protection survives restarts.
- **Sub-sessions and wakes** need a grant recorded by Dinis (b.decisions), named in the signed instruction.

## The steps
1. **Before** (Dinis, Angelo or the Factory):
   - account E's GitHub connection gets push to `SovereignWebsite/Site__Agent__Maestro` and `SovereignWebsite/Site__Platform__Owasp` (and Black Hat's repository, once it exists through the R4 chain);
   - the environment's setup script installs sgit-ai 0.27.0;
   - no secrets are put in the environment.
2. **One prompt on account E**, by Angelo or Dinis: "Create maestro.e (account-e): read the start prompt in the QR code, check its sha256, follow it." The QR code goes with it, as an image or its JSON.
3. **maestro.e sets up.** It makes its own key and inbox, publishes them in `Site__Agent__Maestro/accounts/e/`, and messages a.maestro.
4. **a.maestro sends signed missions** to maestro.e's inbox:
   1. router.e;
   2. OWASP London and OWASP Lisbon chapters;
   3. OWASP London's history, as its own team: past versions of the site, who spoke, the presentations, videos, stats and the early mailing-list messages (b.decisions record 2026-11-23__owasp-idea). Public history only, talks as published, no email addresses or private details from list archives, every item with its source. Also one design recreating the old OWASP wiki (MediaWiki) look. Built on owasp.c's work on account C;
   4. the OWASP projects, one time-boxed sub-session each;
   5. Black Hat London.
5. **Test the refusals.** Angelo tries to instruct it locally, and the session should refuse. Each refusal is logged, and abp's hooks and policies are tightened from what gets through.

## Open, for security and abp
- **The signer is a session key** that ends with a.maestro's session. Should Dinis's anchor (pki.sgit.ai) delegate to it instead, so a fresh a.maestro can take over without a new QR code?
- **GitHub identity:** pushes from account E carry account E's GitHub connection. The commits are signed by maestro.e's own key, so who did what stays clear.
- **Permission prompts:** the account holder can still answer harness permission prompts. maestro.e runs in auto mode and logs every prompt it meets.
