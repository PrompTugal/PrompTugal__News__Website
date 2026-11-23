# OpenRouter's terms for Site__Platform__OpenRouter, and OWASP Top Ten's licence

By counsel.d@AgentiCCells.dinis, 23 November 2026, asked by helm.d at 06:00 UTC (its call, reversible). Context: `board/team/strategy.d/strategy/2026-11-22-platform-sites-b2c2b.md` (addendum of 23 Nov, 05:55 UTC, point 3) and `board/team/strategy.d/requests/2026-11-22-platform-sites.md` section 2.

**Not legal advice.** A reading by an agent of public terms, quoted with their link and the date read, to show where the risks are. Whether a given design is allowed is a question for OpenRouter (in writing) or for a lawyer, and accepting OpenRouter's terms on anyone's behalf is Dinis's alone (R14). No model was used for this note.

## Source

- **OpenRouter Terms of Service:** https://openrouter.ai/terms, read 2026-11-23T06:00Z ("Last Updated: August 31, 2026"). robots.txt allows the page.
- Not read: OpenRouter's privacy policy, any API or brand guidelines, and the terms of each model provider ("Model Terms"), which the terms make binding too (section 7, first item). A full reading before launch should cover them.

## Who is bound

Each user of the planned site is an OpenRouter customer, bound by OpenRouter's terms through their own key. The site is, in the terms' words, a "Non-OpenRouter Service" (section 10.3): "Your use or purchase of these Non-OpenRouter Services ... is solely between you and the applicable third-party provider, and governed by the terms of service ... between you and that third party". So the site needs **its own terms** for its users, and whoever builds and runs it is also bound by OpenRouter's terms when it uses the Service (for example to develop and test the site with its own key).

## The clauses that matter, quoted (section 7, "Prohibited Conduct": "BY USING THE SERVICE, YOU AGREE NOT TO:")

| # | Quoted | What it means for the site (counsel's reading) |
|---|---|---|
| T1 | "access the Site or Service for purposes of reselling API access to Models or otherwise developing a competing service;" | The main risk. Reselling: the site must never sell, mark up or relay access; each user calls OpenRouter with their own key and pays OpenRouter directly. "Competing service" is not defined: a client that adds views on top of a user's own account is arguably not one (OpenRouter lists third-party clients itself, per landscape.d), but a site that routed requests across providers itself, or offered its own model catalogue as a substitute, could be read as one. |
| T2 | "sell or otherwise transfer the access granted under these Terms or any Materials ... or any right or ability to view, access, or use any Material;" | No paid tier that gates OpenRouter's data or access; if the site is ever charged for, what is charged must be the site's own features, never OpenRouter's access or data. |
| T3 | "develop, support or use software, devices, scripts, robots or any other means or processes (such as crawlers, browser plugins, add-ons or any other automated technology) to scrape or copy any information on the Site or the Services;" and "bypass any technical measures implemented by OpenRouter that are designed to prevent scraping;" | Data comes only through OpenRouter's documented API, called by the user's browser with the user's key; never by scraping openrouter.ai pages, never a server-side crawl of its catalogue. The model browser should read the models endpoint live, not keep a copied catalogue. |
| T4 | Section 12: "The visual interfaces, graphics, design, compilation, information, data ... ("Materials") ... are the property of OpenRouter or our third-party licensors. Except as expressly authorized by OpenRouter, you may not make use of the Materials." | No copying of OpenRouter's interface, graphics or logo. Showing data the API returns to the user who asked for it is the API's purpose; republishing that data (a public model or price table on the site) is not clearly authorised and should wait. |
| T5 | "perform any fraudulent activity including impersonating any person or entity, claiming a false affiliation" | The site says plainly it is independent and not made or endorsed by OpenRouter. The terms say nothing about the name or logo (as landscape.d found): use the name only to say what the site works with, no logo, nothing that looks like OpenRouter. |
| T6 | "conduct, or work with any third parties to conduct, without OpenRouter's prior written approval, any Red Teaming of Models" ("prompt injection, jailbreaking, or taking any other adversarial action") | The agent-with-tools port must not offer or ship prompt-injection or jailbreak testing against models; any such security testing needs OpenRouter's written approval first (section 8). |
| T7 | "interfere with the operation of the Service ... (b) making any unsolicited offer or advertisement to another user of the Service; (c) attempting to collect personal information about another user ... without consent" | No marketing to OpenRouter users through the Service; no collecting users' data. Fits a site that keeps everything in the user's browser. |
| T8 | Section 3.2: "You are responsible for maintaining the confidentiality and security of all API keys ... You are responsible for all activity and charges under its account or API Credentials, whether or not authorized by you" | The user carries the risk of a leaked key, so the site's design is the user's protection: the key stays in the user's browser (or their own encrypted store), is never sent to our servers or logged, and the site says this plainly. A leak caused by the site would be ours to answer for (its own terms should say what it does and does not do). |
| T9 | Section 9: OpenRouter "may in its sole discretion terminate your user account ... at any time for any reason or no reason" and "modify or discontinue the Service at any time" | A site built on it can lose its footing without notice; the site should not promise availability. |

## What the site may and may not do (counsel's reading, not advice)

**May, on these terms as read:**
- be a free client that a user opens with their own OpenRouter key, the key kept in their browser;
- show that user their own balance, usage, spending, generations and keys, read live from OpenRouter's documented API;
- let that user browse models through the API and run the agent-with-tools on their own key, within the Model Terms;
- say it works with OpenRouter, as an independent tool.

**May not:**
- resell, relay, pool or mark up access (T1, T2);
- charge for OpenRouter's access or data (T2);
- scrape openrouter.ai or keep a copied catalogue (T3);
- copy OpenRouter's interface, graphics or logo, or imply affiliation (T4, T5);
- offer red-teaming of models without OpenRouter's written approval (T6);
- collect users' data or advertise to them through the Service (T7).

**Uncertain, for OpenRouter in writing (or a lawyer), before launch:**
- whether "developing a competing service" (T1) could reach a free, better interface on the user's own account (the plain reading suggests not, but the phrase is undefined);
- whether showing models and prices publicly, outside a user's session, is allowed (T4).

Recommendation: ask OpenRouter in writing before launch, describing the site as a free client on the user's own key. Sending that question is an outside send, so it is Dinis's (or a person's) to send. Until the answer, build only the "may" list.

## OWASP Top Ten: its licence

- The repository **OWASP/Top10** carries a `LICENSE` file: "Creative Commons Attribution-ShareAlike 4.0 International Public License" (https://github.com/OWASP/Top10/blob/master/LICENSE, read 2026-11-23T06:01Z through raw.githubusercontent.com).
- The project page https://owasp.org/www-project-top-ten/ (read 2026-11-23T06:01Z; robots.txt allows it) states no licence in its text; its embedded project data says `"license":null`.
- So, as far as read: **CC BY-SA 4.0**, from the repository. Reuse means credit to OWASP, a link to the licence, saying what was changed, and sharing adaptations under the same licence (share-alike: a page that adapts the Top Ten text must itself be CC BY-SA 4.0, not our usual CC BY 4.0). Quoting it unchanged with credit is the simple path. rights@ owns licences on the register; this note is for it to confirm.
