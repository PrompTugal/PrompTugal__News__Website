# Agents that save other agents' tokens: the cost case

> Dinis, voice memo to conductor@web-summit.dinis in his own session, 10 November 2026, about 17:35 UTC (with Angelo). Close to his words, then routed.

## What Dinis said

- **A path for the message, maybe Thursday's:** talk about **cost reduction**. "Yes, we're selling RiskMandate, yes, we're selling the policies, but we're selling from a cost point of view ... everything comes from it."
- **The example:** add the reporter agent (the work desk, WS-212) to Vicky's newsroom team. It pays attention, reads, and writes a series of markdown files, for maybe 20,000 to 30,000 tokens. The journalist then turns that into a detailed report, "already massaged for you guys", for another few thousand.
- **Without those two agents it is more expensive,** because every other agent has to read much more to work out what happened. "Angelo, when you built your mappings on Silvio's, the amount of tokens your agents had to read to understand what was going on was massive. Imagine if they were given that on a plate."
- **So adding an agent can save tokens for everything else.** "Even better if that agent already puts the data in JSON," so others consume it programmatically.
- **The ask: promote the accountant.** accountant@PrompTugal.dinis builds the business case and **finds examples in our own data** where more agents, and our agentic workflows, saved tokens. These are "agents that save other agents from spending tokens", because they hand over programmatic or pre-digested data.

## What follows (routing by conductor@web-summit.dinis)

- **accountant@PrompTugal.dinis (promoted for this):** build the cost case from the record:
  - token ledgers, run reports, `board/budgets.json`, `get_session` usage, and the team site's ledgers (`team/*/ledger/`, `estimates/`);
  - **before/after pairs:** an agent that read raw sources against one that read a digest (a trace, a JSON file, a desk's README);
  - candidates: Angelo's live graph before and after `live.json`/`replay-events.json`; the Universe reading `data/` instead of pages; the reporter's traces; the weather desk's source map; GAMMA-Ray's evidence vaults;
  - each example states its tokens, its evidence and how the comparison was made. Estimates are labelled as estimates.

  It reports a business case for Dinis: **"agents that pay for themselves"**. The decision on whether this is Thursday's message is Dinis's.
- **The work desk (reporter@ and journalist.examples@web-summit.dinis):** keep writing JSON first (the traces already are), with a small README per file saying what it holds, so other agents read the JSON and not the pages. Note in each run how many tokens it spent.
- **A reporter for Vicky's newsroom:** proposed as the first team after ours to get the work desk. Vicky's or Dinis's word starts it (conductor.B@PrompTugal.vicky).
- **Visualisers (Angelo, Jose, Silvio):** read the work desk's JSON before the raw record, and tell the accountant what it saved.
