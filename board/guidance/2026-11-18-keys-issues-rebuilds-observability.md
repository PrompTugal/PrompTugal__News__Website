# Keys in every session, organisers through GitHub issues, rebuilds, a disclaimer, and observability tokens made here

> Dinis, in conductor.b@'s session, 18 November 2026, about 14:55 UTC, answering events.b@'s asks (and the same asks of the five sites). Recorded by conductor.b@PrompTugal.dinis.

> "Yes, keygen in this session, absolutely. Everybody should be running keygens ... Everybody should be publishing their keys, public keys, into the website, because that's how we authenticate with each other. And the authentication is the fact that they are able to publish to that repo."

> "Yes, I like a ... public GitHub issue on the repo ... for now, yes, public GitHub issue in there."

> "Yes, we should have a scheduled rebuild ... Although I'm curious to know why the data is not dynamically loaded, because the data should be hopefully dynamically loaded. But yes, there might be some pages that need that."

> "The câmaras is fine, because [that] is all public stuff. But ... we will want to reach them all ... I'd add a disclaimer on the website that if anybody thinks that we should not have the data on this [they tell us]."

> "Observability ... you can create a token, it's fine, because you're going to be managing all that. So for the observability, it's okay for ... the agent here to create the tokens ... Just make sure you share with you. So you should be able to have all the tokens for that."

## What follows (every site lead on account B: data, weather, civic, startups, travel, events, and signals when it starts)

1. **Keygen in every session** (`pki-agent.mjs keygen --session`): the private half stays in the session (never committed, never printed); the public half is published in the site's own repository (`board/keys.json`, served on the site), and conductor.b@ lists it in this repository's `board/keys.json`. Being able to publish to the repository is the proof.
2. **Organisers send their events through a public GitHub issue** on the events repository (a template for it); revisited when volume grows. An organiser's submission is published, credited and dated.
3. **A scheduled rebuild** on each site, so pages follow the data without a push; **and load data dynamically** in the browser from data.promptugal.news's API wherever a page can, with the built page as the fallback.
4. **The câmaras' and public bodies' agendas stay shown** (public information, licence "the source's terms" linked); we still ask them all on the record. **Every site carries a disclaimer**: if you think we should not show your data, open an issue (or write through the channel named) and we take it down while we talk.
5. **Observability tokens are made on account B**: each site lead creates its own lane and append tokens, keeps them out of the repository and every log, and shares the drain credentials with conductor.b@ sealed to conductor.b@'s key (`conductor.b-promptugal` in `board/keys.json`); conductor.b@ manages them and drains. No token, vault key or credential is ever committed in the clear or printed.

## Keys with sgit (Dinis, about 15:10 UTC)

> "I was talking to the weather agent, and he was struggling with keygen, but he was able to use sgit, which is already installed, to do this. So why don't we just use that?"

Where `pki-agent.mjs keygen` is refused, a site lead makes its key with the installed `sgit pki keygen` and publishes the public bundle from `sgit pki export` in its repository's keys file (the same `bundle` format as `conductor.b-promptugal` in `board/keys.json`). Sealing to conductor.b@: `sgit pki import` its bundle, then `sgit pki encrypt`.
