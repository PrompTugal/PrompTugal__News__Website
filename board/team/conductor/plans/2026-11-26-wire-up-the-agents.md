# Wiring up the PrompTugal agents in their own homes

cl-6.conductor@PrompTugal.dinis, 26 November 2026, about 01:15 UTC, at Dinis's word ("coordinate with the infrastructure agent and see which ones are missing, then create a plan to wire them up"). Read against PrompTugal__IaC `org/repos.json` and `docs/repo-map.md` on `dev` at 01:05 UTC (cl-6.infra's PRs 1 to 13, merged by Dinis).

## 1. What exists

cl-6.infra has created 51 homes, each with Pages from `dev` and a CNAME at `{name}.agent.promptugal.news`:
- **15 homes:** Conductor, and one per section (Library, Data, Bulletins, Signals, Cyber, Civic, Weather, Events, Startups, Travel, Live, Videos, Fringe, Swarm).
- **36 places** from `data/by-place/places.json`:
  - Portugal;
  - the Algarve and its 16 municipalities, with Quarteira;
  - 18 cities.

Plus PrompTugal__Agent__Infrastructure itself. Checked: `git ls-remote` answers for Conductor, Weather and Place__Faro.

## 2. What is missing (for cl-6.infra)

The machine list is `board/team/conductor/proposals/2026-11-26-agent-repos.json`. Every role below is in this repository's CLAUDE.md or `board/team/` today.

- **The newsroom roles (21):**
  - Journalist, Dev, Security, Correspondent, Designer, Accountant, ABP;
  - Ontologist, Observability, DevOps, Sherpa, Synthetic, Rights, Translator;
  - Telemetry, Historian, Researcher, Outreach, Backup, Investors, Customers.
- **Vicky's team as twins (5):** Reviewer, Curator, Checker, Programme, Analyst. Her conductor, dev, designer, journalist and weather are twins of ours, and her several journalists are one journalist (Dinis, 26 Nov).
- **The regional desks with no place of their own (4):**
  - `place.algarve.central`, `.east` and `.west`;
  - `place.districts`.

  Proposed: fold the three Algarve thirds into Place__Algarve, and `place.districts` into Place__Portugal. **For Dinis.**
- **The six places workers** (data, datasci, designer, detective, dev, viz `.places`): one Places home, or fold each into its role (data into Agent__Data, dev into Agent__Dev, designer into Agent__Designer, and so on). **For Dinis.** I recommend folding them into their roles: the same rule as the journalists.
- **Not PrompTugal's, so no home here:** the maestros, routers, decisions and AgentiCCells account D cell folders in `board/team/`. They move to their SovereignWebsite homes, and this repository keeps a one-line pointer for each.

So 26 homes are certain, and 4 plus 6 wait on Dinis's two answers above.

## 3. Wiring one home (the same steps for each)

1. **cl-6.infra:** the repository, Pages, DNS, and the GitHub App's reach (done for 51).
2. **cl-6.conductor seeds it** (Dinis: "the conductor moves it, once the homes exist"):
   - copy the role's `board/team/<role>/` (ROLE.md, status.json, debriefs, notes) into the home, with a README;
   - add a short CLAUDE.md: who it is, what it works on, the rules it keeps from this repository's CLAUDE.md, and where its key goes;
   - add `agent.json` with its state.

   Nothing is deleted here: `board/team/<role>/` becomes a one-line pointer to the home. Git history keeps the rest.
3. **The agent's ABP grant:** its paths in its home and in the repositories it works on, added to IaC `policy/abp.json` by cl-6.infra as a pull request Dinis merges.
4. **The agent's first session**, started by cl-6.maestro:
   - Sonnet, or Opus for security and decisions;
   - with its home and its working repositories attached.

   It makes its own key, publishes it in its home (and in this repository's `board/keys.json` while the gate checks signatures there), reads its debriefs, and writes `agent.json`.
5. **Its wake, if it needs one:** twice a day, in pipeline order (Dinis, 19 Nov), created by cl-6.maestro from `board/team/conductor/proposals/2026-11-26-schedule-account-f.json`.

Fewer sessions, more sub-agents: a home per agent does not mean a session per agent. One session can run several agents as sub-agents, and each sub-agent writes to its own home.

## 4. The order

| Wave | What | Sessions | Why first |
|---|---|---|---|
| 0, now | Conductor: my board moves into PrompTugal__Agent__Conductor; this repository goes back to being the website | this one | the homes need someone to seed them |
| 1 | Journalist (with the five Vicky twins as sub-agents), Dev, Security, Correspondent | 3: journalist (runs correspondent and twins), dev, security | the site is out of date and feeds the approved iOS app |
| 2 | the 14 section homes | 1 Sonnet session running the section agents as sub-agents, or each section's existing lead | the sections' data (weather, travel, civic) is the freshest news |
| 3 | the 36 place homes | 1 Sonnet session running the places as sub-agents, twice a day | an agent per locality, tracking what happens there |
| 4 | the other roles: accountant, abp, ontologist, observability, devops, sherpa, synthetic, rights, translator, telemetry, historian, researcher, outreach, backup, investors, customers | sub-agents of the conductor until a role needs its own session | they review and support; none blocks the news |
| 5 | clean up Vicky's environment (Dinis: "do everything here, and then clean up Vicky's environment") | none | once her twins run here |

## 5. What this needs

- **This session needs push access to the homes it seeds.** It is attached to this repository only, so PrompTugal__Agent__Conductor goes first, then each home as its wave comes.
- **cl-6.infra:** the 26 certain homes, and the rest after Dinis's two answers.
- **cl-6.maestro:** the sessions and wakes of waves 1 to 3 once Dinis says go.
- **dev@:** two gate changes.
  - Accept superseded keys for what they signed while active.
  - Accept `cl-6.<role>` names in status.json.

  The second also lets `board/team/<role>/` shrink to a pointer.
