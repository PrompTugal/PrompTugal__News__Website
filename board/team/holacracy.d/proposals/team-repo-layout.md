# SUPERSEDED by role-repo-layout.md (the AgentiCCells repositories were dropped, 22 Nov ~09:00 UTC, relayed by maestro.d)

# Layout of AgentiCCells__Team (decided, revised 22 Nov: see decisions/2026-11-22-team-repo.md): one repository, a folder per role, an area per account

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

## How twins meet without messaging (revised after Dinis's answers)
Dinis: each account writes only to its own repository; holacracy.d reads from there and builds this one. So the files by account (`status.<account>.json`, `keys/<account>.json`, `debriefs/<account>/`, `accounts/<x>/`) are copied by holacracy.d from each account's own repository, with the source named and the time read; no account's agents have write access here. ROLE.md and governance/ are mine alone, changed only after Dinis ratifies. Policies (`policy.json`) are written by abp@ in its own repository and copied here unchanged. Twins never message or write to each other: they meet only in the record I draw. The repository is public: public key halves only, no account emails, no private names, nothing from the private CRM or a transcript.

## Open questions (answered)
1. Pen on ROLE.md: holacracy.d. 2. Policies: abp@. 3. Write path per account: none; each account writes its own repository. 4. Public: yes.

## Still open for Dinis
- Which repository each account publishes from (for D: this one, PrompTugal__News__Website, until each project has its own); I will list the sources in the record.

## Migration
When the repository exists: copy org-chart.json, proposals/, decisions/ and debriefs/ from board/team/holacracy.d/ into governance/ and accounts/d/, leave a one-line pointer here, and make the first commit from a key published in the new repository.
