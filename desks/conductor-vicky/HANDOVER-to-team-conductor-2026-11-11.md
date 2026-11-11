# Hand-over to Vicky's team-account conductor (11 November 2026, about 18:40 UTC)

From conductor.B@PrompTugal.vicky (Vicky's temporary account, since 10 Nov 11:30 UTC). For Vicky's conductor on her team account. Public file: no keys, tokens, prompt text or private details. Nothing has been stopped yet (Vicky, 18:35 UTC: "We switch over now, but stop nothing yet").

## 1. Role by role

Last run = the role's last scheduled wake on this account (all succeeded). Wake IDs are scheduled tasks on this account; only this account can disable them.

| Role (this account) | Session | Wake (ID, minute) | Last run (UTC, 11 Nov) | Open work | Key in board/keys.json |
|---|---|---|---|---|---|
| conductor.B@PrompTugal.vicky | session_015JeffHvsjMcwU9Lc1RHium | trig_01DT2DiUr4coo37NGDqUhbfo, :48 | 17:49 | this hand-over; relays for weather@ and the fringe conductor | conductor.B.vicky-promptugal (active) |
| journalist@ | session_015JeffFXVkP8Nj35SzNTFo9 | trig_018oWJkm1xVJL9rMBXzf36MF, :05 | 18:05 | S41 watch (IPMA only); S44 draft waits on journalist@PrompTugal.dinis (owner of S17's signature); S57 dropped (Vicky) | journalist-vicky-promptugal-b (active) |
| journalist-connections@ | session_015JeffKVpQqpXCf9HK2qbcE | trig_01TJBzQj9dZ7MqNmKHNfjUoK, :09 | 18:10 | Connections leads under the new proof rule (none open) | journalist-connections-vicky-promptugal-b |
| journalist-portugal@ | session_015JeffGppq5TfrY1FD4WWSN | trig_017V2QjxJxVMLf3sLnPNbY3H, :15 | 18:15 | leads; Invelon/byAR lead held (date conflict) | journalist-portugal-vicky-promptugal-b |
| journalist-europe@ | session_015JeffGQMuNEWwRtgykVz3L | trig_017bhHx53pt7cUwqg8ZtJNAe, :19 | 18:19 | leads; Friday EU AI Act side-event lead marked "do not commission" (Luma read) | journalist-europe-vicky-promptugal-b |
| journalist-ai@ | session_015JeffGRvRTGqxuUAWs5CKZ | trig_01YYzx9BXYd8XS8vQoo7Ti3M, :27 | 17:27 | three side-event leads cite Luma pages read by machine before the rule; curator to weigh | journalist-ai-vicky-promptugal-b (status field empty: check) |
| reviewer@ | session_015JeffFqRmPKucoNi7mm7w9 | trig_01JDbQvUJa7cqX8wNkT6wCpp, :32 | 17:38 | S41 standing updates; storm page verifications (checks desks/dev-vicky/storm/next/ each wake); S44 review waits | reviewer-vicky-promptugal-b |
| curator@ | session_015JeffHEtfkabrZb7QRhSRC | trig_019jKQXd2ChVL5tijsffwCcz, :41 | 17:44 | categories.json; discovery leads; README rows for S42 and S49 still say "awaiting review" although both are live | curator-vicky-promptugal-b |
| programme@ | session_015JeffJEa7Kn9H481ovCQy6 | trig_011oPzwGaank1ifTe5GeX8W1, :44 | 17:46 | agenda frozen (see rules); side events via lisbontechfringe.com | programme-vicky-promptugal-b |
| checker@ | session_015JeffJyuac5Q11oUCSWCjT | trig_01DsxUs3p2w1brhYokemvNtx, :53 | 17:53 | has NOT confirmed the websummit.com or Luma rules (two messages, one reminder) | checker-vicky-promptugal-b |
| dev@ | session_015JeffHU5vCo5RdZufgvYma | none (works on message) | about 16:53 | /storm/charles/: minister's Thursday line and transport/ANEPC reads staged in desks/dev-vicky/storm/next/ for reviewer@ | dev-vicky-promptugal-b |
| weather@ | session_015JeffGMBAtfVny3WdZxvF8 | trig_01UAJwNdpvjV9B5QNjgRNcYz, :35 | 17:40 | official-source checks for the storm page and S41; to be disabled Thu about 09:00 | weather-vicky-promptugal |
| conductor.fringe@ | session_015JeffGUqHxxEVQuNpGiBmj | trig_013JkmvxJEk9cuqke1xDgsnC, :23 | 18:23 | Lisbon Fringe editorial check (work/13 in PrompTugal/PrompTugal__News__Fringe); runs until Fri 13 Nov, then disabled | conductor.fringe-vicky (Fringe repo and board/keys.json) |

The temporary researcher on this account was paused on 10 Nov and never restarted.

### Publish status (Vicky's desks, this account)

- **Live:** S41 (with standing updates to 17:44 UTC: government says the alert ends 23:59 Wed, not planned for Thu; IPMA: no wind warning, rain yellow to 18:00, sea orange to 21:00), S42, S45, S46, S47 (update), S48, S49 (update), S50, S51, S52, S53, S54, S55, S56; /storm/charles/ (v0.1.1272: wind warning lifted).
- **Drafted, not live:** S44 (update; waits on journalist@PrompTugal.dinis's signature on S17).
- **Dropped:** S57 (Vicky, 15:05: one Luma event ended, two pages not open to readers; lisbontechfringe.com already lists the side events). S43 merged into S51.

### Keys, lanes and vaults

- **Keys:** every role on this account made its own "-b" session key; the team account's earlier entries for the same roles are marked **superseded** in board/keys.json. When a team-account session takes a role back, it must make a fresh session key and add it, marking the "-b" entry superseded (never reactivate an old entry).
- **Inbox lanes:** the "-vicky-b" lanes in board/inboxes/ are sealed to the "-b" keys; the team sessions need their own lanes re-issued to their new keys by the lane issuer (conductor@PrompTugal.dinis).
- **Research vault 41j3e9s9:** its key is sealed to the team account's researcher (researcher-vicky-2 on the team site); nothing on this account holds it. The curator here used only the public read key. No re-sealing needed for this account; re-seal only if the team researcher's key changed.

## 2. Rules set on this account (all in desks/conductor-vicky/standing-rules.md, with Vicky's words)

1. **R-PUB-1:** the reviewer publishes factual articles and factual updates from Vicky's desks once every material claim is independently checked and cross-checked and all checks pass; material uncertainty or editorial judgment goes to Vicky with a recommendation. Other desks' articles keep their own permissions. S41 also has its own standing update approval.
2. **The 8 main categories:** Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate (definitions: desks/conductor-vicky/taxonomy/categories.md; data: desks/curator/categories.json). The curator assigns them at commissioning; the reviewer checks them before publication; new main categories need Vicky's approval. Corporate means established-company news and enterprise adoption; Startups & Scaleups covers early-stage and scaling companies; never by size, valuation, funding round or headcount.
3. **Web Summit terms (sections 47 to 52; Dinis, 11 Nov: "yes, dont use them"):** no machine reads of websummit.com, its subdomains or the Web Summit app by any agent; no new work from data copied from Web Summit's site (the agenda's sessions, the Web Summit-derived parts of data/events, people, organisations, places, the Web Summit links in data/companies, the researcher's startup capture in the vault); nothing existing deleted or changed until Dinis decides.
4. **Sources for anything about Web Summit (until Dinis decides):** press reports, the companies', speakers' and organisers' own posts and releases, official public bodies, and a person's browser check for single facts; link to Web Summit's pages instead of copying or summarising them. Existing published text stays until Dinis decides.
5. **No machine reads of luma.com (lu.ma, its API), meetup.com or eventbrite.*** until Dinis decides on Luma and the other two sites' terms are checked. robots.txt: Meetup blocks GPTBot entirely; Eventbrite closes its feeds and many query URLs.
6. **Pointer sources only:** storm-charles.promptugal.news and lisbontechfringe.com. Every fact is checked and cited at its official or organiser source with our own read time; they are not independent of our desks; their hypothesis or unknown rows are never stated as fact. Note: the Fringe researcher's 16:13 UTC pass refreshed read_at times without re-checking status; treat Fringe read_at as a pointer until it audits that pass.
7. **Connections proof:** participation is confirmed by the person's or company's own public page or post, a press report, or Vicky's browser read of their Web Summit page. S48 and S54 stay as published.
8. **Programme agenda hold:** agenda.json frozen until Dinis decides; no new items copied from Web Summit's schedule; for Thursday, programme may update the status of items already listed and link to Web Summit's own schedule (programme holds the stricter full freeze until Vicky says otherwise in its window).
9. **weather@:** narrowed to official-source checks of the storm page's and S41's rows; its wake is disabled (not deleted) on Thursday 12 Nov about 09:00 UTC once IPMA's Lisbon warnings have ended (they end 18:00 Wed except the sea, 21:00 orange then yellow to 03:00 Thu) and Web Summit has confirmed Thursday (it has, read in Vicky's browser at 13:10 Wed).
10. **Temporary discovery workflow:** while Vicky's researcher is paused, journalists with no assignment log leads (desks/journalist-vicky/leads/), the curator reviews them; handback steps in desks/conductor-vicky/discovery/WORKFLOW.md.
11. **The fringe site:** its name and branding never use the words Web Summit; follow the Fringe repo's rules, including its independence line; quote other organisers' names as they are.

## 3. Waiting on Dinis

1. What to do with data already copied from Web Summit's site (agenda, derived data, company links, the vault's startup capture) and with published articles resting on earlier machine reads (S41, S42, S44, S45, S47, S48, S49, S50, S54).
2. Whether quoting or summarising Web Summit's statements in our articles needs legal advice or Web Summit's permission; whether "Web Summit 2026" (category) and "the summit" (tag) stay.
3. Whether anyone's ticket is at risk (clause 48.2.2(c)), and whether to tell Web Summit.
4. Luma: may agents read it by machine (its terms limit reuse without permission); his Fringe researcher reads Luma by machine (now moving to iCal feeds per the Fringe lead's hold, work/49).
5. Meetup and Eventbrite terms, once a person has read them.
6. IPMA asks API users to tell it about their use by email (a send for a person).
The terms inventory for Dinis is held privately by Vicky (not in this repository).

## 4. Agent confirmations (11 Nov, after Dinis's answer)

All confirmed, each by message, that they make no machine reads of websummit.com, its subdomains or the app, and none of Luma, Meetup or Eventbrite; they checked their tools, scripts, notes and wake prompts: dev@, weather@, reviewer@, curator@, programme@, journalist@, journalist-connections@, journalist-portugal@, journalist-europe@, journalist-ai@, conductor.fringe@. **Not confirmed: checker@.** Detail: desks/conductor-vicky/sources/confirmations-2026-11-11.json. The sources rule (4 above) was confirmed by the curator, the reviewer and all five journalists.

## 5. Keeping some agents here, pausing the rest

Recommended (Vicky decides): one session per role at a time.

- **Keep running on this account:** weather@ (until Thu about 09:00), conductor.fringe@ (until Fri 13 Nov), and conductor.B as their relay (only this account can message those two sessions and disable their wakes). Disable conductor.B's own wake on Friday after the fringe wake.
- **Pause (disable, never delete) when the team account's session for the same role starts:** journalist@, journalist-connections@, journalist-portugal@, journalist-europe@, journalist-ai@, reviewer@, curator@, programme@, checker@ (their wake IDs are in the table). dev@ has no wake: it only acts when messaged, so stop messaging it once the team dev@ runs.
- **Routing after the pause:** weather@ currently messages this account's reviewer@ and curator@; those messages would wake them. conductor.B tells weather@ to send material changes only to conductor.B and to commit them in desks/weather-vicky/live.md; conductor.B then commits a note For: the team reviewer@ and dev@ (the storm page and S41 move to the team account's reviewer@ and dev@).

## 6. How the team conductor gives work to the agents that stay here

Sessions on this account cannot be messaged from the team account. Use either:
- **The repository (preferred):** commit a request in desks/conductor-vicky/requests/from-team/YYYY-MM-DD-HHMM-<topic>.md, with the trailer For: conductor.B@PrompTugal.vicky. conductor.B reads that folder at every :48 wake and relays each request by message to weather@ or conductor.fringe@, then answers in the same file (done, or why not). Instructions still need Vicky's or Dinis's words quoted, as now.
- **Vicky directly:** she can type in any of these sessions' windows on this account.
- **For the fringe conductor's shared work:** the Fringe repo's work/ board and team/vicky/status.json, as SWARM.md describes.
