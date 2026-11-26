# The Command Centre: decide, be briefed, escalate (v2)

c.maestro (account-c), 26 Nov 2026, from Dinis's words in c.maestro's session (~19:30 UTC), in short: a much better way to see what was done in the last 4 hours, day and week; not only his problem but every manager's; at scale, complexity brings decision paralysis; not every decision needs making at every moment, and stopping is good ("we did a bit, we moved the needle, and then we continue"); but being briefed is essential. Today's running commentary mixes the crucial with the FYI. He wants something like RACI, a way to make decisions and be briefed, and a fast escalation path now that there are customers and users. The primitives: an iOS app given to this team, sgit vaults (two-way, append lanes, pushed UIs, even editing the website), the data (repositories, AWS twin, Gmail), and keys (public/private, his passkey).

## 1. Principles

1. **Every message has a class.** Escalate, Decide, Brief, FYI. Nothing reaches Dinis unclassed. An Escalate interrupts; a Decide waits in a queue; a Brief is read when he chooses; an FYI is never pushed.
2. **Every item has a RACI.** Responsible (the agent doing it), Accountable (the one person or maestro who answers for it), Consulted (reviewers, e.g. security), Informed (who sees it). Dinis is Accountable only where the rules say so (one-way doors); everything else names an agent.
3. **Stop is an outcome, not a failure.** Every Decide offers "yes", "no", "not now" and "stop here"; every piece of work can end with "done enough". The app shows what stopped and why, so stopping is visible and cheap to resume.
4. **Briefs are by time window.** Last 4 hours, last day, last week: what moved, what stopped, what is waiting, by account and by project. Visual first, text second.
5. **One place.** Accounts, agents, decisions, mail, sites and costs in one app, not five tabs and six inboxes.

## 2. The four surfaces

| Surface | Answers | Content |
|---|---|---|
| **Now** | Is anything on fire? | Escalations only: security incident, customer or user problem, account near its limit, agent blocked on Dinis, red gate on a live site, deploy stuck. Push notification, one tap to acknowledge, a named owner and a timer. |
| **Decide** | What needs me? | One queue across all accounts: the ask, the recommendation first, options, RACI, deadline, link. Answers: yes / no / not now (with a date) / stop here, plus a note; signed with the device key. |
| **Brief** | What happened? | 4 h / 1 d / 1 w: a timeline per account and project (shipped, stopped, waiting), a short written brief by each maestro, and what changed on the live sites (screenshots). |
| **Inbox** | What came in? | The Gmail tool's triage across Dinis's inboxes: needs reply / waiting / FYI, drafts made by agents; send from the phone via OAuth after review. |

Plus **Map** (accounts, maestros, agents, sites, repositories, keys, state) and, later, **Act** (edit a site's page through its vault).

## 3. The primitives and how they fit

- **The iOS app (native):** the reader and the remote control. Renders the four surfaces natively; holds the device key (Secure Enclave) and Dinis's passkey for sign-in and for signing answers.
- **Vaults (sgit):** the transport and the store. Each account's maestro writes its feeds into a vault every wake: `now`, `asks`, `brief`, `escalations` (one JSON record each, signed). Public parts in clear; private parts (people, prospects, mail) sealed to the readers' keys. Two-way: the app appends answers to the asker's append lane. A vault can also carry a small HTML UI the app shows in a web view, so a new view ships without an App Store release.
- **Data:** repositories (commits, gates, releases), the maestros' channels, decision records, the AWS twin (costs, alarms, resources), the Gmail tool, and each account's capacity.
- **Keys and PKI:** every record signed by its agent's published key; every answer signed by Dinis's device key, bound to his passkey; b.decisions and each account's decisions agent turn signed answers into records. Read keys per person decide who sees what (Angela and the team see their part).

## 4. Record shapes (draft, one per class)

Common fields: `id`, `class` (escalate|decide|brief|fyi), `account` (cl-N), `project`, `title`, `summary` (two lines), `raci` {responsible, accountable, consulted[], informed[]}, `links[]`, `created`, `signed_by`.

- **escalate:** `severity` (sev1 security or customer harm; sev2 live site or account at limit; sev3 blocked agent), `owner`, `ack_by` (time), `status`.
- **decide:** `recommendation`, `options[]` (each with does-well / does-badly), `deadline`, `one_way_door` (bool), `answer` (filled by the app: yes|no|not-now|stop + note + signature).
- **brief:** `window` (4h|1d|1w), `shipped[]`, `stopped[]` (with why), `waiting[]`, `numbers` (capacity, cost).
- **fyi:** text and link only; never pushed.

## 5. The escalation path

- **sev1 (security incident, customer or user harmed, a secret exposed):** any agent raises it; it goes straight to Now with a push and to security@; security can write HOLD; Dinis acknowledges within the hour or the maestro of that account stops the affected work.
- **sev2 (live site down, red gate on a live site, account at its limit):** to Now and to the owning maestro; the maestro acts within its own call (reversible steps) and reports.
- **sev3 (agent blocked on Dinis):** to Decide, top of the queue, with the exact ask.
- No other class may push.

## 6. Which app

| Option | Does well | Does badly |
|---|---|---|
| **VoiceDebrief iOS** (a.ios, account A) | Already has an Owner section reading `owner.feed/v1` (agents, sites, briefs, decisions): the closest to this; a personal app, so private views fit | Built on account A; this team needs push access and a hand-over with a.ios |
| **PrompTugal iOS** (c.ios, account C) | Team and TestFlight pipeline already on account C; sealed lanes to the conductor (PTTalk) exist | A public news app in App Review; a private command centre does not belong in its listing |
| **A new SGit-AI app** | Clean, named for vaults | Starts from nothing; a new App Store record |

**Recommendation:** VoiceDebrief, with the team on account C (c.ios's workers have the skills and room), coordinating with a.ios so one session owns the Owner section; PrompTugal stays the public news app.

## 7. Slices (each a TestFlight build)

1. **Brief and Map, read-only (1 to 2 days):** every maestro writes `brief` (4h) and `now` each wake to its account vault; the app shows the timeline and the map.
2. **Decide (2 to 3 days):** maestros move every "waiting on Dinis" line into `decide` records; the app shows one queue; answers still go back by hand.
3. **Signed answers (3 to 5 days):** device key + passkey; answers appended to lanes; b.decisions records them; security@ reviews first; one-way doors stay out until Dinis says so.
4. **Now and escalation (with 3):** push notifications for sev1/sev2 only.
5. **Inbox (next week):** the Gmail tool's triage feed and OAuth send after review.
6. **AWS and Act (later):** AWS twin numbers in Brief; editing a page through its vault.

## 8. What changes for the agents now (no app needed)

From the next wake, every maestro (and c.maestro first) writes its brief to Dinis in four labelled blocks: **Escalate**, **Decide**, **Brief**, **FYI**, with the RACI owner on each Decide. The same records later feed the app.

## 9. Open for Dinis

1. VoiceDebrief or PrompTugal (or a new app)?
2. Is a tap on the phone, signed with the device key, enough for a one-way door, or only for routine asks?
3. Who else gets read keys (Angela, the team) and to which parts?
4. Which inboxes join the Inbox surface first?
