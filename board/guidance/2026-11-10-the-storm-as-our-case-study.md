# The storm is our case study: a dynamic team, the evidence, and the decision graph

> Dinis, voice memo to conductor@web-summit.dinis in his own session, 10 November 2026, about 17:15 UTC, recorded while showing the platform. Close to his words, then routed by conductor@web-summit.dinis. Builds on the weather desk Vicky's team already runs (weather@PrompTugal.vicky, `desks/weather-vicky/`, S41).

## What Dinis said

1. **This is the case study** for the dynamic agentic teams we can create. "Really focus on all the evidence."
2. **History:** when was the last time an event like this happened, and what was the sequence of events then?
3. **The decision graph:** the decision to shut the summit is not "the mayor arriving one day". There is a tree of decisions. One authority's warning leads to a government or city meeting, which leads to schools and other closures, which leads the summit team to act. "The power of weak signals": the decision to shut down "will be predictable maybe 5 or 10 hours before, as soon as another decision was made". The same goes for the reopening: when is the decision to reopen going to be made?
4. **What happens to participants tomorrow:** the guidance now, transport (is the metro shut?), side events and meetups, whether you can travel in Lisbon at all.
5. **Spin up the agents the situation needs:** a meteorologist, a historian, a researcher, a Portuguese law agent, a Câmara de Lisboa agent. "Figure out what is the best agent that we need to spin up that will give us the right information."
6. **A version of the site focused on this situation**, with the views to show it.
7. **New sources mean new tools:** "every time we find a data source, we're going to build a new connector ... a new tool." That is the custom software written in the next hours that never scaled before.
8. **Show the workflow (for Angelo):** an agent hits an unreadable page, then a request goes to an architect, who writes a plan as a markdown file. The developer implements it, the designer maps it, and a visualisation turns the noise into signal. "That capability is the power of an agentic team."
9. **Why it scales:** the Agent Behaviour Policies (RiskMandate). "We can only afford to do this because we have maximum control of what our agents are doing." The agents run on a loop with handovers (conductor, dev, designer, meteorologist, researcher, journalist, each at its own minute), and every one has a key (PKI).
10. **Journalists are welcome:** "this is not about removing journalists ... if there's journalists out there that want to work with us, we can onboard you ... give you some agents to work with." The route in: https://promptugal.news/contribute/

## What follows (routing by conductor@web-summit.dinis; owners propose, as usual)

- **The weather desk (weather@PrompTugal.vicky, with conductor.B@PrompTugal.vicky):** grows into the dynamic team. Run as sub-agents inside the desk's run, not as new sessions, unless Vicky or Dinis say otherwise:
  - **a meteorologist:** IPMA's warnings, communiqués and station gusts, against the forecast;
  - **a historian:** past red warnings and storms in Lisbon and what was shut and when, each with its source;
  - **a researcher:** the official channels of ANEPC, the government, the Câmara, schools, the metro, CP, Carris, the ports, the airport and Web Summit;
  - **a Portuguese-law agent:** who has the legal power to decide what (the alert, contingency and calamity situations), as published;
  - **a Câmara de Lisboa agent:** the city's own decisions and notices.

  Extend `decision-chain.md` into **the decision graph**: each node a decision-maker and a decision, each edge "this usually follows that", each with its evidence and the time read. Mark what has happened, what is expected, and the lead time history suggests. **Predictions are labelled as analysis, with their reasons**, never as fact.
- **A focused view on pt.news:** one page for this situation. It shows:
  - the decision graph, live;
  - the timeline;
  - what it means for participants tomorrow (transport, venue, side events);
  - the sources;
  - the team of agents behind it and what each did.

  The weather desk proposes; dev.graphs@ and designer@PrompTugal.dinis help with the graph and the layout.
- **Connectors:** each new source the desk finds gets a small tool (a reader, a parser, a watcher), recorded in the desk's README source map.
- **The workflow, visualised (Angelo's team, dashboard@PrompTugal.angelo):** draw the path from "an agent hits an unreadable source" through the architect's plan, the developer, the designer and the visualisation, from the real commits of this story. reporter@web-summit.dinis traces it as an example (WS-212). journalist.examples@web-summit.dinis writes it up.
- **Journalists who want to join:** through /contribute/, with agents of their own, under the same policies.
- **The rules stay:** public sources only, every fact with its source and time; no contact details; the reviewer publishes, not the desk.

## Added a few minutes later: the baseline team, and the work desk

> Dinis, the same session, about 17:25 UTC (close to his words).

- **The baseline for every team:** every team's sessions always have at least **a conductor, a security agent and a developer** ("because you're always going to build stuff"). This is the idea Angelo had.
- **For the next period, also a reporter and a journalist** whose only job is to document what the other agents are doing. They are not the news journalists or the researchers: Vicky's researchers find news, and her journalists write it. These two cover **the agents' work**.
  - **The reporter** is "the one on the ground": it catches what happens and collects the evidence of what the agents did (commits, requests, hand-offs, sources, times).
  - **The journalist** writes the story from that evidence, and that story is what the team visualises.
  - A name for the pair is to be chosen ("agentic journalism" or "work journalism"). conductor@web-summit.dinis proposes **the work desk**: a work reporter and a work journalist per team. The first pair is reporter@web-summit.dinis and journalist.examples@web-summit.dinis (WS-212).
- **They make materials for the visualisers:** text, diagrams, code samples and UI ideas, pushed to Angelo, Jose and Silvio (and their dashboard agents) when they visualise the work.
- **The story to tell first, the detective story of the storm:**
  1. A researcher hits an official Portuguese source and gets a pile of JSON, or a page where only one small part matters. Agents can read it, "but we can do much better".
  2. It sends a request to the conductor: "can somebody build a parser for this?" A parser for only the part that matters, not the whole site.
  3. The conductor fires an architect, who writes a plan as a markdown file.
  4. Then a developer implements it and a designer maps it. They check it, and there is a UI that turns noise into signal.
  5. Then the treasure hunt: where are all the pieces of the puzzle that show who decided what? The schools closed: why, who made the decision, and where did it come from?
- **Go back in time:** how far ahead did we already know this was going to happen? When was the right moment to decide, and what was the probability of the event? The decision graph is checked against what happened, with the lead times.
