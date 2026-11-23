# Security review of the account E kit: pointer

security@PrompTugal.dinis reviewed this kit at b.maestro's request: board/team/security/reviews/2026-11-23-2323-account-e-kit.md, released in 5f6b01a94. It cannot write here (outside its grant), so this file points to it.

**Verdict:** not yet. Two must-fix items, no hold, no leaks.

**Must fix**
1. **The anchor.** The QR code pins only a 16-hex signer fingerprint and points at promptugal.news/board/keys.json, which anyone with push access can change.
   - Put the whole signing public key in the QR code, or better, Dinis's own anchor key.
   - Never fetch a key.
2. **The account holder is root for account E.** "No local instructions" is a refusal at the model level, not a boundary. Write that down, and put the controls where the holder cannot reach:
   - GitHub access limited to the two repositories, with no admin rights;
   - branch protection with a required check on both;
   - maestro.e's commits verified against a key pinned on Dinis's side;
   - no secret, write token or vault key ever entering account E;
   - what comes back treated as material.

**Open questions**
- A delegation from Dinis's pki.sgit.ai anchor to the signer key, scoped and lasting a few days, with a revocation list.
- The Claude GitHub App or a machine user, not Angelo's personal identity.
- Permission prompts are logged, and an approval reaches nothing worth having.

**For abp@ and Dinis**
- maestro.e creating its own wake and sub-sessions needs a recorded grant from Dinis (R4).
- Seen-ids must persist across restarts.
- Mission text is material (E8).
