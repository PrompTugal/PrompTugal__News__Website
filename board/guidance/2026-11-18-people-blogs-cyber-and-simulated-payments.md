# People who publish in public, blogs, the cyber signals, and a simulated payout to sources

> Dinis, in conductor.b@'s session, 18 November 2026, about 15:25 to 15:35 UTC.

## Blogs and people

> "Blogs, what about people that publish things in their websites? ... they paste it public ... a big part of the flow here is to create monetization angles ... as we get revenue from usage, as we get revenue from traffic, we want to pay as much as we can directly to the source that makes sense for that income ... especially in Portugal, there's quite a lot of really good ones."

> "The blog is a person, so we name them ... It's not just organization ... if it's public individuals, surely if it's members of government, surely it's public office ... if I post something, I'm okay to be quoted ... part of this is to amplify content created ... make sure that the content, the creator is actually get paid ... we need to draw the line on, yes, if it feels like private information, but if somebody published something publicly, we should be linking them ... the professional writing, like ... we're doing with the blogging ... never a personal contact."

**The line, from now on (it widens the "organisations only" line of 2026-11-18-social-signals.md):**
1. **Named and linked:** people in public office and public life (members of government, officials, elected representatives), and anyone who publishes in public under their own name (a blog, a newsletter, a public post, a talk): their published words, linked, attributed by the name they published under, quoted briefly where it helps.
2. **Never:** private information (home, family, health, anything that feels private), a personal contact (email, phone, address), anything behind a login, anything the person did not publish themselves.
3. **Their own channel decides:** what they published, where; a take-down on request; a source can claim its entry on the register (a file on its own site) to opt in, correct or opt out.
4. **Blogs, newsletters and podcasts are collected** by their RSS or Atom feeds (data.b@, on the register), shown by title, byline as published, date and link with our own one-line summary (signals.b@, a "voices" section), and linked into the graph (library.b@).

## Cyber signals

> "Collecting data for cybersecurity related materials like CVEs ... advice from ... Portugal, but also things like Shodan and things like the flows ... we don't want to publish any personal data ... from a threat intelligence and open source intelligence ... we put the limitations ... at least it's worth taking a look." And to conductor.b@'s proposal: "Yeah, agreed."

- **Sources onto the register first** (data.b@, terms checked, nothing collected until checked): CNCS and CERT.PT, CNPD decisions, ENISA and the EUVD, NVD and CVE.org, CISA's known-exploited list, Portuguese vendors' CVEs and disclosure programmes, Shadowserver's country dashboards, Cloudflare Radar, RIPEstat and IODA, abuse.ch and phishing feeds by country, incidents as reported by outlets; Shodan and Censys aggregates only if Dinis adds a key.
- **The limits, published:** aggregates only, never a list of IPs, hosts or devices; no victim data and no link to a leak site; anything specific to an organisation reported privately to CERT.PT or CNCS, never published; no scanning of our own; labelled as weak signals, not an audit. security@ reviews the limits.
- **A site of its own, cyber.promptugal.news**, when Dinis creates `PrompTugal/PrompTugal__News__Cyber`.

## A simulated payout to sources

> "Can you ask the dev to already [operationalise] the whole payment thing? ... there isn't payments at the moment. But can we try to get a sense of how would we distribute the payments for individuals, and then maybe put a note there saying this is simulated ... how would that person, so for example, me, if I have ... spent £5, then how would that fit?"

- **dev@ builds `/payments/simulated/` on promptugal.news**, every page marked **"Simulated. No payment is made or collected; no money moves."**
- **The attribution ledger** (data.b@ and dev@): per source (an outlet, a blogger, a public body, a data provider, an organiser, a platform), how often its work appears, is cited, is linked and is followed, per page and per site, from the evidence and licence fields every item already carries and the anonymous page-view counts.
- **The model, with its assumptions stated and Dinis's to change:** revenue in (a reader's spend, traffic), a share kept for costs (shown as an assumption), the rest split across the sources behind what was read, by weight (cited fact, quoted words, data set, discovery evidence), with a minimum before a payout.
- **"My £5" in the browser:** a reader's own reading log stays on their device (the meter already keeps one); the page computes, in the browser, how that reader's £5 would be split across the sources behind what they read, and shows it. Nothing about the reader is sent to us.
- How much to keep and when anyone is paid is Dinis's alone (a "For Dinis" decision page when it is real).

## The live cameras site and the Google APIs (Dinis, about 17:30 to 17:55 UTC)

- Dinis on public cameras: a site to list and show the live public camera feeds in the places we cover; the AgentiCCells factory is creating the repository (the live site). conductor.b@'s rules, proposed: official cameras of public bodies and operators' own embeds or links only; never re-host, record or store frames; no face or plate recognition; metadata and status history only; never an unsecured private camera (Insecam-style); take-down on request.
- Dinis: "add those free Google API keys to the web page with instructions": videos.b@ extends videos.promptugal.news/how/ with YouTube Data, Fact Check Tools, Knowledge Graph Search, PageSpeed Insights, Books and Web Risk, in a Google Cloud project separate from the Gmail OAuth one.
- Dinis: "see what is going on with the IPMA data ... the data is not being refreshed": data.promptugal.news's IPMA collectors were fresh (read 17:41 UTC); promptugal.news's live-now (refreshed only by datasci.places@'s session, last 16:15) and weather.promptugal.news (last built 16:19, its hourly rebuild not running) were stale; owners told to read data.promptugal.news live.
