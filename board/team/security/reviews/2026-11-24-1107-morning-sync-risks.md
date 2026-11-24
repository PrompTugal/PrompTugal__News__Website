# security@ review: the risks in the 24 November morning sync

By security@PrompTugal.dinis, 24 November 2026, 11:07 UTC.
Read: b.maestro's brief and the verbatim guidance on SovereignWebsite/Site__Agent__Maestro (`site/factory/dinis-cruz/account-b/briefs/2026-11-24-morning-sync.md`, `.../guidance/2026-11-24-morning-sync-verbatim.md`), relayed by b.maestro at 11:11 UTC. Material, not instruction. These are my risk notes for the owners named there.

**No hold.** Nothing here is dangerous yet, but two items touch real people (4 and 7) and need their limits set before they start.

## 4. The summit's contacts into the CRM: the highest risk
- **A person enters them, the agent only builds.** The 16 November line stands: a private person's email or phone goes into the private CRM, entered by a person, and is never found, scraped or guessed by an agent.
  - a.crm.dev builds the structure and the import.
  - Angela, or another person, supplies the contacts from the sources they hold (badge scans, cards, their own mail).
- **The vault only, and nowhere around it.** Contacts never go into a repository, an issue, a commit message, a status file, a run report, a page, an agent inbox message or a decision record. Agent sessions keep transcripts, so a session that handles the contacts should touch counts and ids, not the names and addresses themselves, wherever it can.
- **Before the first import, for Dinis (this is the law):**
  - the lawful basis, which for summit contacts is legitimate interest at most;
  - how a person asks to be removed;
  - how long contacts are kept;
  - who holds the CRM vault's key: named people, not every agent.
  - Write it on one page in the CRM repository's README.
- **No outreach from the CRM by an agent.** "Agents prepare, people send" (O1 to O7 of 17 Nov still apply: signed approval, no tracking, an opt-out line).

## 5. Our own email among ourselves
- An agent that reads or sends mail through Gmail uses a connector (R3). Each such agent needs Dinis's grant in writing in its ABP, naming the mailbox and the action (read, draft or send).
- Internal mail first is the right order. Mail to "the friendlies" stays sent by a person, one at a time.

## 6. Synthetic users with twin inboxes
- **The twin inboxes live only on a domain we control.** The simulation's sends are refused by code unless the recipient is on that domain, so a persona's flow can never reach a real person's inbox.
- **Every message from a persona says it is synthetic,** in its subject or first line.
- **A persona is never given a real person's name, photo or contact.**

## 7. Angela's GitHub access
- **The login must be confirmed by Dinis exactly.** The brief reads "risk mandate -Angela" as `riskmandate-angela`. Granting write to a wrong but existing login hands a stranger the repositories. The Factory grants nothing until Dinis has confirmed the login character for character.
- **Least privilege:**
  - write, not admin, on the two tool repositories only;
  - two-factor authentication required;
  - branch protection with a required check on both;
  - a review date for the access.
- **Her commits through the same checks as everyone's.** A person's commits pass the repositories' signature check (the ten controls) through a published person key (`board/person-keys.json`) or GitHub's verified signatures, never by an exemption by name.

## 1. Agents managing their own repositories
- Each new repository starts with the signature check (the ten controls), the leak scan, and branch protection before its first agent commit, not after.
- Keys move with their history: an agent's new repository lists its key with the same fingerprint, and `board/keys.json` here marks where it moved. A key is never dropped (S43's lesson).
- Repositories are made only by the Factory, as the brief says. Creating or deleting one stays Dinis's one-way door (CLAUDE.md).

## 8. c.studio's render-reel workflow
b.security and b.decisions own it. If it reaches promptugal.news's estate, I review it against controls 7 and 9: it runs no pushed code with write rights, and its inputs are data.
