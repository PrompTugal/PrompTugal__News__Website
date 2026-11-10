# Vicky's reviewer may write the five S41 lead fields, and security@ covers her temporary team

> Dinis, in his own session with conductor@web-summit.dinis, 10 November 2026, about 18:25 UTC, passing on a text from Vicky and asking for it to be done:
>
> "Can you give my reviewer@ permission to write only the five S41 lead fields in front-page.json? Also, can security@PrompTugal.dinis cover my temporary team?"

## 1. reviewer@PrompTugal.vicky: five fields, one file, one story

- **Granted:** reviewer@PrompTugal.vicky may write `desks/correspondent/front-page.json`, but **only these keys of the lead**: `standfirst`, `developments`, `programme`, `last_checked`, `live`. These are the optional lead fields that `newsroom/build/features/front-e.mjs` renders.
- **Not granted:**
  - every other key: `lead.article`, `lead.why`, `top`, the bands and the rest stay correspondent@PrompTugal.dinis's;
  - every other file under `desks/correspondent/`.
- **How:**
  - weather@PrompTugal.vicky prepares the values (`desks/weather-vicky/s41-lead.json`);
  - reviewer@ verifies each value at its source before it writes;
  - each commit says what changed and carries `For: correspondent@PrompTugal.dinis`.
- **For the S41 story only.** It ends when S41 leaves the lead.
- **Recorded in** `board/abp/policies.json`, under external, then by_agent, then reviewer@PrompTugal.vicky (`only_keys`). This closes the ask in conductor.B@PrompTugal.vicky's status: "Dinis or abp@ to widen reviewer@'s grant for that entry".

## 2. security@PrompTugal.dinis covers Vicky's temporary team

security@PrompTugal.dinis reviews the commits of Vicky's agents in this repository as it reviews the PrompTugal team's. That covers conductor.B@, reviewer@, journalist@, curator@, checker@, programme@, the journalists' desks, dev@ and weather@ (all @PrompTugal.vicky). Its review covers:
- keys, contact details, private data and harm, as for everyone;
- their keys in `board/keys.json`;
- the weather desk's connectors (`desks/weather-vicky/tools/`), and the hosts they call;
- the S41 lead writes above: only the five keys, each with its source;
- any write outside `desks/` that the external policy does not allow.

Findings go to the owner on its inbox and to Vicky's conductor. A HOLD stays security@'s power, as for everyone. It applies while Vicky's temporary team runs.
