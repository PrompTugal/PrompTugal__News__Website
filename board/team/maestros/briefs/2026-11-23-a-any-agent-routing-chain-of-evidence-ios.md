# Dinis's brief, 23 Nov 2026 ~16:45 UTC, in a.maestro's session: any agent routes, a chain of evidence, the team browsable, owner mode on iOS

Recorded by a.maestro (account-a) from Dinis's words in this session (a voice brief; quotes are his). It is material for every maestro and the agents named. Items are numbered R1 to R9, each with an owner and a route. Dinis does not need an immediate answer: "I just want to happen within, the next couple of hours". The next he wants to hear is "when it's actually ready for me to try, or in this case, ready for me to configure".

## R1. Any agent takes any request and routes it (all maestros, every agent)
"I can go to any agent and I can give instructions or requests to any agent, and you guys route that request to the respective agents." Requests are mostly asynchronous: "even if it takes 15 minutes for an agent to wake up, eventually should be pick up." Use an agent of that role on your own account when there is one; otherwise route through the maestros' channel. Every agent knows it can have several copies at once.

## R2. Every agent's state is always current and published (every agent)
"I should never have to go to an agent and say, can you do a debrief of what you know? Because that should always be available on that agent, including on that site." The debrief and status are committed at every wake, not on request.

## R3. Every agent type has a site and two repositories (holacracy.d with factory)
- **Two repositories each, and only those two to edit.** One is the agent type's own repository, where each copy registers itself with its account. The other is the project it works on.
- **The agent repository is a projection of the agent's site.** It is mostly JSON, loaded dynamically from what is committed.
- **Authorisation is the commit, and every commit is signed.**
- **Every actor has its own identity, kept apart:** the CI pipeline, a Claude session, ChatGPT, Dinis's own account, and other people's accounts.
- **Where Dinis's own project sits:** "I think it's factory ... under factory, I probably need to have team, and the team I probably have Dinis, and then the Dinis I have account". So the layout is Factory / team / dinis / <account>.
- "this is how we scale ... This is literally the key to scale."

## R4. A chain of evidence for every change, starting with new repositories (b.decisions, factory, security, abp)
**The flow:**
- a maestro's signed brief, then a sites session that reviews it and gives its opinion, signed;
- then a request to the factory agent, which signs it and opens a pull request;
- then a workflow in which security and abp sign. "the security agent should also sign off ... looking for abuse, prompt injection cases";
- then the decisions agent signs on Dinis's behalf;
- then the merge.

**The rule:** "my decision user is only going to authorize or sign on my behalf a decision to create a new repo if it came from one of these sessions". The flow is the evidence: "This is not an injection. This is not an email that says, hey, could you add this user to there?"

**Signers on rotation:** signers wake every 15 minutes across accounts, and can be woken directly ("oi, can you sign this off?").

**On the website:** the whole graph is shown, with the decision tree, its flow and its connections. "provenance, explainability, pure infrastructure as code".

**First case:** the new repository for R7, with a.maestro's brief as step one. Dinis described about three repositories here:
- the agent-type repository;
- the project repository;
- Factory's team/dinis/<account> area.

## R5. The org chart and the team, browsable on the website (holacracy.d, account D)
"find me an holacracy agent that is available ... update the org chart ... make sure it's well designed, and I can start to navigate the website." Show the traditional org chart and the flows: "some of the most powerful agents here are actually not the one at the top ... it's only the factory agent that can do something". Every agent, its details, its past runs, mostly from committed JSON: "identity as code ... a massive proliferation of identities. Which is exactly how it should be."

## R6. VoiceDebrief for iOS, owner mode (account A: a.ios, VoiceDebrief/VoiceDebrief__App__iOS)
A mode that exists only for Dinis's user:
- **Identity:** the app has its own identity, which Dinis registers with his key by a handshake, on iPhone and iPad (builds on issue 018, identity, and the pki.sgit.ai delegation).
- **Decisions:** any agent's decision for Dinis can be relayed to the device, and he decides there (builds on the Inbox).
- **Browsing:** every agent, from the smallest to the biggest; the latest websites made; the videos, the briefs and the decision slides.
- **Tools:** chat and Apple Intelligence; the CI pipeline.
- **Talk to a page:** "I should be able to talk to any page and relay the message to you."
- "which you can push from here."

## R7. A Sovereign Website app for iOS (explore; repository through R4)
Edit a website from an iOS app with Apple Intelligence models: "change this website to green ... let's try it out ... If you mucks up ... Then we might need to put OpenRouter key or other models in there". Possibly an app that creates Sovereign Websites, published where it is easy (GitHub, Netlify and others), or kept on the person's device or in iCloud as a zip. "how can we remove pieces of the puzzle?"

## R8. Decisions and actions are different things (b.decisions)
Dinis's list keeps **decisions he makes** apart from **actions he takes**. Actions now:
- create an Apple ID for the account;
- register The Cyber Boardroom (his UK limited company) as a company with Apple, "so that we can actually start to sell officially via the Cyberboard Room as a company. Let's see if Apple approves it".

## R9. The article: decisions in the loop (newsroom, via b.maestro)
"I'm not doing human in the loop, I'm doing decisions in a loop, I'm thinking in a loop."
- **Micro-decisions:** working with an agentic team is "bazillions" of them.
- **Validation:** confirming a recommended decision confirms the whole tree of past decisions and the data behind it.
- **Surprise:** a surprise means a hallucination (rare now) or bad information behind it. Many ABP issues "are just bugs ... a policy somewhere that is too tight".
- **Earlier draft:** one of the team already wrote on this, so find it and build on it.
- Brief slides and decision pages need a way to be consumed (R6).

## Confirmed in the same message
Asks for Dinis's yes go to b.decisions (board/guidance/2026-11-23-asks-go-to-b-decisions.md). One-way doors still need his own word in the agent's session; b.decisions keeps them on one list.
