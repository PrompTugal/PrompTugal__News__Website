# Digital twins as backups, OAuth from the website, and small browser components (24 Nov 2026)

Dinis, in b.maestro's session, about 00:05 UTC on 24 November 2026, as strategy (his full message, word for word: `2026-11-24-twins-backups-and-browser-components-verbatim.md`): "I'm trying to find these sort of use cases that we can see that we provide a unique capability, because that's what will drive traffic, that's what will drive activities." The quotes below are his. What is not quoted is b.maestro's summary.

## The ideas

1. **Backups from digital twins.** "one ridiculously powerful capability here is ... the ability to create backups using our digital twins from data ... at the moment, there is no backup for G Calendar effective, but we can create one ... even without a vault ... into local storage using the local twin." Calendar and Gmail first ("forget about contacts, let's go for calendar and for Gmail").
2. **Better access to your own data.** "a much more effective way to communicate data ... the Gmail filter is ridiculous ... we should be able to build that information and download that information, and it should all be done through the browser."
3. **The twin is a graph, version controlled.** "the digital twin is fundamentally a graph-based version of ... Gmail or calendar". It is "a version controlled, Git version of email", which "can even be encrypted with a user's key, so it's even double encrypted". See twins.sgit.ai, the twin primitive, which is design except for one built twin.
4. **OAuth from the website, not a connector.** "I want to move away from the MCP connector, or maybe the MCP connector only has read access ... a workflow where we use OAuth from the website ... when I'm on the website ... I can do the refresh, and I can upload and I can update my digital twin."
5. **Live while the tab is open.** "as long as that tab is open, we actually have real-time access to email, kind of ... check the email every couple of minutes ... back off if there is no action ... or maybe it depends on the time of the day." Local storage is "a full-blown database", and the vault stores the data and the twin.
6. **The swarm is reachable from the page.** It can reach "an agent on the browser, and ... an agent, running on Claude, that we can wake up using messages and communicate with our entire swarm".
7. **Policies and a secure harness in the browser.** "agent behavior and policies that actually run on this environment, run on the browser ... implementing a kind of S harness on the browser". The secure harness "enforces the constraints that we want to put on an agent or an action".
8. **Local models in the browser,** which "can already do quite a lot of logic".
9. **Small components, small repositories.** "the whole logic here is to create these very small repos that people can use and can contribute, and that's the power of open source. Everything is small little components ... a component which is local models ... add that component to the site, and now we have a local model capability ... Same way ... with the Gmail capability". Variations of the Gmail twin get "all sorts of secure variations of access to email ... a lot of security controls, a lot of checks on top".

## Who takes what (b.maestro's routing; owners decide how)

- **Gmail and Calendar twin, OAuth in the browser, tab-open sync with back-off, backups (local storage first, then vault), version-controlled and user-key encrypted:** the Gmail and CRM team on account A (a.mail.conductor, a.mail.dev). Calendar is a natural first, as Dinis said.
- **The use cases that drive traffic** (backup, filter, download, secure variations) and how they are told: strategy.b, with d.strategy.
- **Components as small repositories** (local models, the Gmail capability, the browser harness and policies), each added to a site to give it the capability: b.conductor (SovereignWebsite), with b.factory and b.sites, through IaC requests. abp@ on policies in the browser.
- **An article on the idea:** b.newsroom, when Dinis says go.

## Notes for the owners (b.maestro's, to check)

- **Google's verification differs by scope.** Calendar's read scope is classed "sensitive" (app verification). Gmail's read scopes are "restricted", which for a published app also means an annual third-party security assessment. That is another reason Calendar first is right. Dinis's earlier "fork it yourself" route (each organisation creates its own Google app and does OAuth in its own domain) changes who carries that burden. Check the current rules on Google's pages before relying on this note.
- **Keep tokens in the browser.** The OAuth token stays in the browser; only the twin, encrypted, goes to a vault. Nothing goes through our servers or into a repository.
