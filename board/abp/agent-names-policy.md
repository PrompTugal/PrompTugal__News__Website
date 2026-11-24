# Agent names that look like email addresses: the policy side (abp@, 24 Nov 2026, 01:55 UTC)

Asked by b.maestro for b.decisions (a note, data), with the brief board/team/maestros/briefs/2026-11-23-a-agent-names-policy.md (Dinis's word to a.maestro, 23 Nov about 23:58 UTC, quoted there). abp@ confirms the policy side, step 2 of the brief's route. The decision itself is Dinis's through b.decisions; this is not it.

## Confirmed
- **An agent name is an identity, not a contact detail.** A name of the form <account>.<role>@<Domain>.<person> (the last label is the human the agent acts for: dinis, vicky, indi, silvio, jose, angelo, zed, stranger, person) cannot route mail, because no such label is a top-level domain. So R8 ("never print, log, commit or publish a private individual's personal contact") does not apply to it. The gate's email check should keep refusing real addresses: any name whose last label is a real top-level domain, or is not in the registered list of people.
- **The list of last labels is closed and written down** (the one in validate.js): a new person is one word added at Dinis's word, never inferred from a name that appears.
- Names stay the identity key for every ABP check: key ids (<role>-promptugal), commit trailers (Agent:), the R16 comparison of the Agent: trailer to the key's agent, run reports. The hook already reads any <role>@<domain>.<person> label as an agent of another operator (kind external).

## Two points for the people who make the change
1. **The widened pattern must be exact about the last label.** The brief's proposal, /@[A-Za-z0-9-]+\.(dinis|vicky|indi|silvio|jose|angelo|zed|stranger|person)$/i, is fine as written; keep the $ anchor and the closed list; do not let a free word through. Add the test the brief names (a real address fails, an agent name passes) and one more: a name whose domain part contains a dot (x@a.b.com) still fails.
2. **The account-letter-first naming and my policy roles.** policies.json keys roles the old way (maestro.b, conductor.b, cells.b). When the first agent is renamed (b.maestro), the hook will see an unknown external role and give it nothing. abp@ will add an aliases table (b.maestro to maestro.b, and so on) the day the rename is signed; it is a small, reversible change in my own area. Until then both names are tolerated in the policy files and the reports.

## What abp@ does not do
It does not change validate.js, the status schema, the other sites' gates or their leak scans: they are dev@'s and the site owners', named in the brief. It does not read this confirmation as Dinis's yes.
