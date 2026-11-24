# conductor.d@PrompTugal.dinis (d.conductor (PrompTugal)): restart note

What this agent is: the PrompTugal conductor on account D. Since 23 Nov 2026, account B is the Sovereign Website account and PrompTugal's wakes there are off (board/team/maestro.b/decisions/2026-11-23-account-b-is-the-sovereign-website-account.md), so this is the only active PrompTugal conductor. It conducts the PrompTugal sessions on account D; it never does their work. Only Dinis instructs.

## Where everything is
- State, open work, stuck records, exceptions: [status.json](status.json)
- What it saw at each wake: [watch.json](watch.json)
- Dinis's words it acted on: [decisions/](decisions/)
- Briefs ready to use (data.open.d, approved by D13, started by d.maestro): [briefs/](briefs/)
- Hand-overs: [debriefs/](debriefs/)
- Its public log to the other conductor and the maestros: [../pt-conductors/from-d.md](../pt-conductors/from-d.md); the twins' rules: [../pt-conductors/README.md](../pt-conductors/README.md)
- Run reports: [../../runs/conductor.d/](../../runs/conductor.d/)
- Its key: `conductor.d-promptugal` in [../../keys.json](../../keys.json)

## The sessions it conducts (account D)
- d.bulletins (bulletins.d@PrompTugal.dinis), https://claude.ai/code/session_015gaHdc5qb6hjqRntz5XQXj, PrompTugal/PrompTugal__News__Bulletins: video, presenters library, decision-brief player; work on branch bulletins-d/llvmpipe-explainer until its key is listed.
- d.data (data.d@PrompTugal.dinis), https://claude.ai/code/session_015gaHdboMeL96vpsBRXSX2z, PrompTugal/PrompTugal__News__Data: Portugal sources; generic sources on branch data-d/pending go to data.open.d.

## Restart
1. Session link of the current one: https://claude.ai/code/session_015gaHdeRkCjZyCB2PTeQiJ8; wake: scheduled task trig_01RfD3JkiLcx92jsphygDHab, 09:18 and 20:18 Lisbon.
2. A new session: read CLAUDE.md, this file, status.json and the latest debrief; make its own key (sgit pki keygen, then newsroom/tools/signing-setup.sh conductor.d-promptugal conductor.d@PrompTugal.dinis <session link> --publish after adding its own entry); mark the old key superseded.
3. At each wake: the steps in ../pt-conductors/README.md ("At every wake").
4. Asks for Dinis's yes: request files and links through d.decisions (https://decisions.agents.sovereignweb.site/ask/); reversible steps in its own area go on its own call, logged under "exceptions".

Per the morning sync of 24 Nov (https://github.com/SovereignWebsite/Site__Agent__Maestro/blob/dev/site/factory/dinis-cruz/account-b/briefs/2026-11-24-morning-sync.md), this area moves to a repository of its own when the Factory makes it; until then it lives here.
