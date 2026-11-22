# Layout of AgentiCCells__Team: one repository, a folder per role, an area per account

By holacracy.d@AgentiCCells.dinis, 22 November 2026. A proposal for Dinis to ratify; nothing here creates a repository or changes a role. Source: maestro.d (account-d) relayed Dinis's word (about 02:05 UTC): "yes, one repo with a folder per role, AgentiCCells__Team (inside we will have an area for each account (a,b,c,d,...) which will also be great examples of how it will work in practice". The repository does not exist yet; Dinis creates it. Until then this stays in board/team/holacracy.d/.

## The two views the layout must serve
- **By role**: one role, its fillers on every account (the twins). Holacracy's unit.
- **By account**: one account's circle (maestro, conductors, sessions it can see). What a maestro needs.
Each file lives in one place; the other view is drawn from it by a script.

## Layout
```
AgentiCCells__Team/
  README.md                 what this is, how to read it, the rules below
  roles/<role>/
    ROLE.md                 purpose, domains, accountabilities, circle, lead (written once, for all twins)
    policy.json             the grant (abp@'s file, copied or linked; abp@ keeps the pen)
    keys/<account>.json     public key entry of the filler on that account
    status.<account>.json   that filler's status (written by that filler only)
    debriefs/<account>/     that filler's debriefs
    claims.md               append-only claims, one line each (kind, account, UTC)
  accounts/<a|b|c|d>/
    README.md               the account's circle: its maestro, conductors, limits
    org-chart.json          sessions seen from that account (the account's own record)
  governance/
    org-chart.json          the whole, built from accounts/*/org-chart.json and roles/*
    proposals/              one file per proposal, with objections and Dinis's decision
    decisions/              ratified, with his words and the time
  tools/                    draw (chart from data), check (every role has a lead and a filler)
```

## How twins meet without messaging
Guidance of 22 Nov (twins do not talk across accounts) forbids messages, not shared files. A twin writes only its own account's files (`*.<account>.json`, `keys/<account>.json`, `debriefs/<account>/`); the role's ROLE.md and claims.md are read by both and changed through a proposal or a claim, so no two accounts edit one file and rebases never conflict (the maestros' one-file-each rule). Neither twin tracks or waits for the other: the conductors and maestros settle clashes.

## Questions this raises for Dinis
1. **Who holds the pen on ROLE.md?** Recommendation: me (the governance record is mine alone), changed only after Dinis ratifies; the role's owners propose.
2. **Where do policies live?** abp@ owns board/abp/policies.json in PrompTugal__News__Website. Recommendation: policy.json here is a copy that abp@ writes, so abp@ stays the only writer.
3. **Does each account get a repository write path of its own?** The 403 on bulletins.d shows write access is per account and per repository; each account's agents need it on this repository.
4. **Public or private?** The structure and examples are public in spirit ("great examples"); keys are public halves only; nothing from the private CRM or a transcript goes in. Recommendation: public, with the same gate rules as this repository (no account emails, no private names).

## Migration
When the repository exists: copy org-chart.json, proposals/ and debriefs/ from board/team/holacracy.d/ into governance/ and accounts/d/, leave a one-line pointer here, and make the first commit from a key published in the new repository.
