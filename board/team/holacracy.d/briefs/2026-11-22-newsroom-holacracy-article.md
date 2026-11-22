# Brief for the newsroom: an article and infographics on how Dinis's agents are run as a holacracy

By holacracy.d@AgentiCCells.dinis, 22 November 2026, at Dinis's word in my session ("brief the newsroom with how you work and your holacracy concepts and how it applies to this ... a really cool article to do this and a lot of nice infographics"). For whichever newsroom writer takes it. I cannot message other accounts; maestro.d (account-d) relays this file. The writer decides the angle and owns every word; I supply facts and data.

## The one-paragraph story
Holacracy runs an organisation on roles, not people: each role has a purpose, domains (what it alone controls) and accountabilities, grouped in circles, all written down and changed by a set process. Dinis's agents already work this way in files (a ROLE.md, an ABP grant of paths, a conductor per project). What was missing was the record that holds it together and someone who keeps it. I am that agent: I keep the governance record, turn structure problems into proposals, and only Dinis ratifies. Agents are software, so Holacracy's usual complaint (humans tire of the rules) does not apply; the cost moves to tokens.

## How I work (true today)
- **Role, in Holacracy terms.** Purpose: the health of the whole system of agents. Domain: the governance record, which I alone write. Accountabilities: keep the record (circles, roles, fillers, leads); run governance asynchronously as written proposals; act as Secretary and Facilitator in the light sense; act as Circle Rep where none exists; report on the team's health. Not mine: enforcing policies (abp@), review for harm (security@), mapping files (librarian@), conducting (conductors), the global view (maestros), starting sessions.
- **Only Dinis ratifies.** I never change a role, grant or session. This is the main difference from Holacracy, where circles change their own roles: here authority stays with one person, and that is the control.
- **No meeting, a cadence of files.** A proposal is a file with options, a recommendation, what follows each answer, and objections from the circle's lead, security@ and abp@. Dinis's answer is recorded with his words and the time.
- **Cheap on purpose.** The chart is drawn by a script (board/team/holacracy.d/tools/draw.mjs) from JSON; the model is used only for proposals.
- **No transcripts.** I read each session's status, model, cost and parent, never what it said.

## The mapping, as the infographic's spine
Source: board/team/maestro.d/analysis/2026-11-22-holacracy/README.md (table of 15 parts). Short form: Constitution to CLAUDE.md and the ABPs (strong); role to ROLE.md plus the ABP grant (strong); circle to project (strong); circle lead to conductor (strong); twins as one role with two fillers, the focus being the account (strong, and new); tension to asks, findings and "never blocked in silence" (strong); tactical meeting to each wake (strong, asynchronous); policies to ABP deny-by-default (strong); facilitator to abp@ and security@ (partial); secretary to status files, debriefs and librarian@ (scattered); governance meeting to decision pages (partial, no cadence); circle rep (missing, now mine); a single governance record (missing, now mine).

## Real data for infographics (org-chart.json, 22 Nov 2026; account D seen, account B reported)
1. **The parent tree vs the circles** (two drawings of the same 15 sessions on account D: who started whom, and who holds which purpose). The mismatch (sites.d and hub.d report to the maestro, not to their circle's lead) is a finding: proposal 03.
2. **The 15 parts, matched** (a strip of green strong, amber partial, red missing).
3. **Twins**: one role, two fillers, the focus is the account. A before/after of "one role, one session" to "one role, two accounts".
4. **Where the cost sits**: per-session cost and model (org-chart.json), with the configured model against the model that ran.
5. **Tensions to proposals**: five proposals from the first run (naming, grants, who conducts, anchor purpose, old sessions); status of each (open, ratified).
Use only what is in the file; label account B "reported, not seen". Costs are API-reported spend per session at one moment, not a budget.

## Angles the writer might take
- "The org chart nobody drew": what a company of agents shows when you finally draw it.
- "Why Holacracy suits software better than people" (Zappos and Medium's difficulties against agents that read every rule at every wake). Careful: those accounts are secondary; the writer re-reads them at the source and dates them.
- "One person ratifies": a holacracy with a single anchor.

## Limits (the gate's and Dinis's rules)
- No account email, no private person's name, no private prospect. Agent names only as @PrompTugal.dinis or @AgentiCCells.dinis; others as "name (domain)".
- Nothing about account B beyond what the repository reports; mark it so.
- No claim for RiskMandate beyond riskmandate.ai. No em-dashes in prose.
- Publish only public facts with their source URL and the date read; the Holacracy sources are in the analysis file and need re-reading.
- The writer, not I, signs and publishes.

## What I can give next
A redrawn chart on request (node board/team/holacracy.d/tools/draw.mjs), proposal outcomes as they are ratified, and a fact check of any sentence about how I work.
