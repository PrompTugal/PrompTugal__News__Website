# The core setup of a GitHub organisation (27 Nov 2026)

Decided by Dinis in c.maestro's session (~14:40 UTC, 27 Nov 2026): "yes to the five core repos, go ahead (and document this as part of the core setup of a AgentCells GH organisation). And yes we will fix the other orgs later." He proposed the first four; c.maestro added Security.

Every new GitHub organisation (first: AgileCells) starts with these five repositories, in this order, before anything else:

| # | Repository | What it is | Why first |
|---|---|---|---|
| 1 | `<Org>__IaC` | The automation: requests, pipeline, DNS, signer check, `team/keys.json` (the trust root) | everything else in the organisation is created from it |
| 2 | `<Org>__Agent__Infrastructure` | the agent that keeps and works on `<Org>__IaC` | IaC has a named owner from day one |
| 3 | `<Org>__Agent__ABP` | the agent behaviour policies: what each agent may and may not touch | policies exist before any agent acts |
| 4 | `<Org>__Agent__Maestro` | coordination: the one channel, routing, briefs, what waits on the owner | the organisation's link to the other accounts and organisations |
| 5 | `<Org>__Agent__Security` | reviews changes to IaC and to the policies | separation of duties: whoever changes infrastructure or policy does not approve it |

Then the website (`<Org>__Site__Website`) and every other site, keeper and cell, each requested through `<Org>__IaC`.

## How a new organisation is bootstrapped

1. The owner creates the GitHub organisation and installs the Claude GitHub App and the existing factory's App (today `agenticcells-site-factory`) on it.
2. An existing IaC (today AgentiCCells__Site__Factory) creates the five core repositories once, seeding `<Org>__IaC` from the SovereignWebsite__IaC template.
3. From then on `<Org>__IaC` creates everything else in its own organisation; each agent home's first commit is its agent's own key.
4. The owner points the domain's DNS (Route 53 zone, nameservers at the registrar); the IaC sets Pages, the custom domain and HTTPS.

## In Agile Cells terms

The organisation is a long-lived cell; the five are its standing roles; every site and project is a cell it starts.

## Not yet aligned (to fix later, Dinis)

AgentiCCells has `__Site__Factory` and `__Agent__Factory` instead of `__IaC` and `__Agent__Infrastructure`, and no ABP or Security homes; SovereignWebsite has SovereignWebsite__IaC and Site__Agent__* homes under its own naming. Both get aligned later.
