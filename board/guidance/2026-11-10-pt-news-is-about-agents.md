# pt.news is about agents, and the workflow is the picture

> Dinis, 10 November 2026, about 12:40 UTC. A voice brief, given in conductor@web-summit.dinis's session while he was guiding Indi's agent. Recorded here close to his words, then read. The transcript breaks off at "And then for Jose": that part is still to come.

## What Dinis said

1. **One unified workflow, built on GAMMA-Ray.** "We are going to use what we created for the GAMMA-Ray workflow and the facts that we have there" (gamma-ray.sgit.ai: the Spectrum cards, the mashup of the standards, FACT-Ray). "What that allows us to do is create a mapping on where the teams are, or a particular product, or a particular agent is."
2. **pt.news pivots to agents, completely.** "If somebody wants to learn about agents, wants to be informed about agents, wants to figure out what they're talking about agents, that's the website."
3. **Interviews steer to agents.** When Indi does an interview, it is "less about what the company does, but more what the company is doing with agents". It is already happening, so keep pushing it. A GAMMA-Ray mapping of the company, made **before or after** the interview, is "a really good standard, a really good workflow to start the conversation".
4. **The workflow and its visualisation are one and the same.** A "full-blown, graph-based description and visual elements" of how it works. It is "not just for us to understand it": "we want to be explaining to the users what was the agentic workflow that just happened to do that." Silvio's X-ray already shows it ("we do this, then we do the research ... you see the data flying to the agents"). "Now we have a much better way of mapping this."
5. **A visual virtual newsroom, and a feedback loop.** It shows where the human comes in, where the researcher comes in, where the journalist comes in, and where the agents come in. It maps the hand-offs. For example: "when Indi does the interview, and then when he has to manually copy into the website, and then the agent picks up from there." It is shown to the reader, and "we're going to be using ourselves to manage it": the same picture runs the newsroom.
6. **A full redesign of pt.news around this** ("it might be recycle one of the ones we have there"). The site focuses on:
   - **the content we create**, the interviews;
   - **what is going on at the summit right now**;
   - **the scores we create** (GAMMA-Ray).

   "There's nobody coming there" (read: there are no readers yet, so redesign freely; ask Dinis if that reading is wrong).

## What follows (conductor@web-summit.dinis's routing; owners propose, as usual)

- **conductor@PrompTugal.dinis:** this is the plan's new top line. Turn it into a pass (`board/the-passes.md`) for the redesign. Point the beats, the front page and the newsroom section at agents.
- **designer@ (with designer.experiments@ and sherpa@):** the redesign. Start from this morning's decided direction (B, round 3, with GAMMA-Ray's real cards), since Dinis said recycle. Three blocks lead the page: the interviews, the summit now, the scores. The visual newsroom is a first-class element, not a footer.
- **dev.graphs@ and dev.pages@:** the visual newsroom. One graph per piece, built from the record (the `Agent:`, `Brief:` and `Unit:` trailers, the interview pipeline's stages, the vaults). It shows each actor, human or agent, and each hand-off, in time order, on the piece's own page and live for the whole newsroom. Reuse Silvio's X-ray flow and the team site's /pipeline/ trace. FACT-Ray's actors and bands label who stands behind each fact. dev.pages@ is still waiting for Dinis's word in conductor.b@'s session.
- **journalist@ and Indi's interview team:** every interview asks what the company does **with agents**: what its agents do, on whose behalf, with what reach and controls. Each interview links to that company's GAMMA-Ray card, made before or after the interview (gamma.studio@ makes it).
- **correspondent@ and social.watch@:** "the summit now", filtered to agents.
- **ontologist@:** companies, products and agents in the graph, keyed to GAMMA-Ray's cards, so the mapping of "where a team, a product or an agent is" can be drawn.
- **observability@:** the events behind the picture (who did what, when) for the live newsroom view.
- **The same workflow as the individual pipeline** (team site /the-individual/, WS-210): a person met at the summit, an interview, a GAMMA-Ray card and an article are one flow, drawn the same way.
