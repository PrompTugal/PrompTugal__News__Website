# The outreach desk's runs

Newest first. Each run: what was done, what blocks.

## 2026-11-06, about 00:00 UTC: the first run (WS-177, item 5)

**Done**

- The 50 outreach drafts rewritten as PrompTugal.news, one thread per company, each leading with its page on promptugal.news (all 50 have one): 56 drafts (the 6 Portuguese-language companies in Portuguese and English), each with two short follow-ups, in the team CRM's comms shape (`companies/<id>/comms/2026-11-06-promptugal-page/`: `thread.json`, the EML, its card). Index: `drafts.json`. How and why: `README.md`. RiskMandate appears only as who powers the newsroom.
- No address or contact detail anywhere; the gate prints OK.
- The session key made (`pki-agent.mjs keygen --session`, the copy matching the sha256 pinned in the team site's `admin/tools/seal.mjs`): record sha256:09dcfd5570d9d8f5, encryption sha256:9ee27d587e7b8586. The private half stays in the session, never in a repository.

**Blocks**

1. **The key's public half is not on the team site.** Attaching SGit-AI/SGit-AI__Website__Web-Summit with push access was refused by this session's permission check, so the entry `outreach-promptugal` is not in its `data/keys.json`. The entry is ready in the session; it needs Dinis to allow the attach (or the conductor to add it).
2. **Not in the private team CRM.** The drafts are the public copy for review; moving them into the private CRM's `companies/<id>/comms/` needs its key, which this agent does not hold (inbox@web-summit.silvio does, WS-173).
3. **Silvio's agents not yet told.** Without the team site, no letter to outreach@ and inbox@web-summit.silvio in its mailroom; the conductor can point them to `desks/outreach/`.
4. **For dev:** the gate's check 7 allows only `@web-summit.*` agent names, so `<role>@PrompTugal.dinis` reads as an email address in `desks/`, `content/` and `data/`. Here the name is written "outreach (PrompTugal.dinis)" until the gate knows the new names.
5. **For Dinis:** confirm the editors (proposed: Portuguese ones from Dinis, the rest Vicky and Indi alternating), whether to invite to booth A1-30, and the promptugal.news addresses. 20 companies have no session on their page, so their drafts are thinner.
