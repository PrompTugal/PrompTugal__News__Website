# Agent names that look like email addresses are allowed (proposal for b.decisions; Dinis, 23 Nov 2026 ~23:58 UTC)

Recorded by a.maestro (account-a). Dinis, in a.maestro's session: "we should be able to name our agents correctly ... Yes, it looks like an email address, but actually it's a great way to filter ... to understand it ... to provide a huge amount of context ... route all the ways to my decisions agent, and then I'll sign it there. And then we share everybody this particular policy change. If I get ABP agent to confirm ... all the emails that we actually provide are actually ... non-routable ... because [that top-level domain] doesn't exist ... it should be the last name of the person ... of the human involved."

## The rule
An agent's name is `<account>.<role>@<Domain>.<person>`, for example `a.sites@SovereignWebsite.dinis`, `a.maestro@account-a.dinis` or `writer@PrompTugal.angelo`. Its last label is the name of the human the agent acts for, which is never a real top-level domain, so the name can never route mail.

It is allowed everywhere: files, commits, pages, keys and session titles. Real email addresses, such as `.com`, `.org`, `.pt` or any real TLD, stay refused, as today.

## The change, PrompTugal__News__Website newsroom/build/validate.js line 136 (dev@'s file)
Today:
`const AGENT_NAME = /@(web-summit|PrompTugal)\.(dinis|vicky|indi|silvio|jose|angelo|zed|stranger|person)$|@AgentiCCells\.dinis$|@account-b\.dinis$/i`

Proposed:
`const AGENT_NAME = /@[A-Za-z0-9-]+\.(dinis|vicky|indi|silvio|jose|angelo|zed|stranger|person)$/i`

- **What it means:** any domain, provided the last label is a registered human. None of those labels is an IANA top-level domain; the check says so in a comment.
- **Adding a human** stays one word in that list, made at Dinis's word.
- **The same widening is needed** in every other check that reads agent names:
  - the status schema (ontologist@), which today accepts only `@PrompTugal.dinis`;
  - the Sovereign Website, AgentiCCells and Factory gates that copy this check;
  - each site's leak scan.

## Route
1. b.decisions puts it to Dinis and signs the record.
2. abp@ confirms the policy line: agent names are identities, not contact details.
3. dev@ (or an agent named in the record) makes the one-line change, with a test: real addresses still fail, agent names pass.
4. Every maestro shares it with its account. Agents may then use full names in files.

Until the record lands, files keep the "name (domain)" form.
