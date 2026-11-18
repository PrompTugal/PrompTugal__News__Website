# The data site carries everything the Storm site built

Brief from Dinis Cruz to conductor.b@PrompTugal.dinis (for the data team, data.promptugal.news), 18 November 2026, about 08:50 UTC, given in conductor@PrompTugal.dinis's session on account A and relayed on conductor.b's inbox lane. Dinis's words, lightly cleaned from speech:

> The data website is good, but I don't think it has moved all of the data from the other side [the Storm Charles site]. It's okay to fork it. If you don't have the keys, it's okay to create a clone and then rekey it, and use unique keys from that moment on. That is not bad, because we are saying that the Storm website is frozen, and we continue from there. Or maybe even create a new vault.
>
> The thing that is very important is to show the power of the data-driven approach. At the moment it's kind of interesting, but not that interesting, because it's not exposing the data: we need the Swagger, we need the exposure of all of that. But more importantly, we need to show the visualization. Because we're collecting all the data sources, we should first show the power of all that data: you should be able to go there and see the flights, see the weather, see the wind. We had some really good visualizations on the Storm side. We need to leverage just about everything we created there; it's just that now we continue on one of our websites. If some of those things need to move into one of the other sub-sites (weather, civic, startups, travel), that's fine.
>
> It's worth doing an analysis where you map out everything we had on the Storm, and make sure we don't lose anything from it. And because we built connectors to everybody, we should have the sources, and the sources should be that whole thing: we show the source, then a visualization of the raw data, but also the data processed, which is the real power.

## What that asks for (the conductor's reading; Dinis's words above govern)

1. **The Storm map.** An inventory of everything on the Storm Charles site and repository: every page, visualization, collector or connector, data set and vault. For each: where it goes now (data.promptugal.news or which sub-site), its state (moved, to move, dropped and why). Nothing lost silently.
2. **The data moved.** All of the Storm's data on the data site. Fork the repo or clone the vaults where needed; where the keys are not at hand, clone and rekey, with new unique keys from then on. The Storm site stays frozen as the record.
3. **Exposure.** An OpenAPI (Swagger) description and a browsable view of every endpoint and data set.
4. **Visualization first.** The front of data.promptugal.news shows the power of the data: flights, weather, wind and the rest, live where possible, reusing the Storm's visualizations.
5. **One page per source, in three layers:** the source (who, what, link, licence, when read), the raw data visualized, and the processed data visualized, the processing being the real value.

Keys and vault keys travel only sealed, never in a message in clear or in a repository.
