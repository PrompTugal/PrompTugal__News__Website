# Power of attorney for an agent, and a counsel agent

By maestro.d (account-d), 22 November 2026, at Dinis's word in its session (about 12:20 UTC). A proposal and a mapping, not legal advice: the agents here are not lawyers, and nothing in this file is a legal instrument.

Dinis, verbatim: "can you look at the concept of power of attorney, which is kind of what we're talking about here ... I'm giving power of attorney to that agent to make decisions. And this is where ABPs need to be involved ... adding power of attorney to the ABPs ... should we add a lawyer here so we can actually simulate these contracts? ... the whole point of this is to eventually connect this to real humans ... the lawyer agent could also provide advice ... could have the requirement to also get checks from multiple LLMs and eventually be connected to actual real law services ... my interface with real law services for them to start providing validation certification for a workflow that I create."

Sources (read 22 Nov 2026):
- **Types of power of attorney:**
  - American Bar Association: https://www.americanbar.org/groups/senior_lawyers/publications/voice_of_experience/2017/march-2017/pick-the-right-power-attorney-instrument/
  - Texas Law Help: https://texaslawhelp.org/article/powers-of-attorney
  - Minnesota Attorney General: https://www.ag.state.mn.us/consumer/handbooks/probate/CH5.asp
- **The UK system:**
  - GOV.UK: https://www.gov.uk/power-of-attorney
  - Which?: https://whichwills.which.co.uk/what-is-power-of-attorney/
  - Age UK: https://www.ageuk.org.uk/information-advice/money-legal/legal-issues/powers-of-attorney/
- **Agents and agency law:**
  - Authenticated Delegation and Authorized AI Agents: https://arxiv.org/pdf/2501.09674
  - Using Agency Law to Tame AI Agents: https://arxiv.org/pdf/2502.18359
  - AI Agents and the Law: https://arxiv.org/html/2508.08544v1
  - Stanford Law, From Fine Print to Machine Code: https://law.stanford.edu/2025/01/14/from-fine-print-to-machine-code-how-ai-agents-are-rewriting-the-rules-of-engagement
  - Thoughtworks on agentic scope of authority: https://www.thoughtworks.com/insights/articles/governing-autonomous-enterprise-agentic-scope-authority-framework

## The match: it is a power of attorney, and a limited one

A power of attorney is a document by which a **principal** gives an **attorney** (the agent) authority to act for them, within the powers the document grants. The parts the sources agree on, and their counterpart here:

| Power of attorney | The delegation to decisions.d |
|---|---|
| Principal | Dinis |
| Attorney (agent, attorney-in-fact) | decisions.d, identified by its session key and session |
| The instrument, signed by the principal | the delegation, signed on pki.sgit.ai by Dinis's own key |
| **Limited** (special): specific tasks or a period, then it ends | the kinds of request it may issue, and an expiry |
| General: broad authority | not proposed: never a general power |
| Durable: survives the principal's incapacity | not proposed: it should end, or freeze, if Dinis is unreachable for longer than a set time |
| Springing: starts on a trigger | possible later, e.g. only while Dinis is travelling, or only for answers he gave on a decision page |
| Scope: authority is only what the document grants | the ABP of each receiving agent lists what it accepts under the delegation; deny by default |
| Fiduciary duties: act in the principal's interest, within scope, keep records, no conflicts or self-dealing | decisions.d's ABP: issue only Dinis's verbatim answers and default-yes adoptions, log every act publicly, never act for itself, never sub-delegate |
| Revocation takes effect once the attorney (and those relying on it) have notice | revocation on pki.sgit.ai plus a published revocation list that every agent checks before acting |
| A newer power can revoke an older one | each delegation carries a serial; the newest valid one wins |
| Registration (UK lasting powers: with the Office of the Public Guardian, before use) | the delegation and its hash published in the repository before first use: a public register |
| Ratification: the principal may approve an unauthorised act afterwards | Dinis can ratify an out-of-scope request in a session; it is recorded, never assumed |
| Apparent authority: third parties who reasonably believe the agent is authorised can bind the principal | the reason every receiver must verify the chain itself (the "authenticated delegation" paper's point) and never act on a claim of authority |

The UK's two forms show the shape:
- **The ordinary power of attorney** (GOV.UK, Which?) can be limited to a period or to specific activities, needs no registration, and ends if the principal loses capacity. It is the closer model.
- **The lasting power of attorney** must be registered with the Office of the Public Guardian before it can be used, and Age UK notes that a wrongly signed one is rejected. It is the model for the register and the formality.

## What it changes in the ABPs

Each ABP gains a **powers** section, written by abp@ and deny by default. It names:
- which delegations the agent recognises (the principal's key, and the attorney's key);
- which kinds of request it accepts under each, and which it never accepts (keys, money, the law, deletions, connectors, relaxing a policy, until Dinis widens it in a session);
- what it must log when it acts on one.

decisions.d's own ABP holds the attorney's duties above. An act outside the powers is a breach, reported like any other.

## A counsel agent

There is a lawyer-shaped gap. rights@ checks licences and terms and says plainly it gives no legal advice. What Dinis describes is wider:
- drafting and reviewing the instruments themselves (the delegation, the ABP powers sections, the terms of a cell sold to a customer);
- simulating them: what happens on revocation, on an act out of scope, on a compromised key;
- requiring independent checks from several models before anything is marked reviewed;
- in time, being the interface to real law services that validate or certify a workflow.

**Proposed name:** counsel (counsel.d on account D). It works with rights@ and security@, and with abp@ for the powers sections.

**Its rules:**
- It never presents its output as legal advice and never names a real lawyer or firm without their consent.
- Every review lists the models that checked it, and where they disagreed.
- A "certified" mark exists only once a real, named legal service has given it.

A first task could be drafting the first delegation (the limited power for decisions.d) and simulating its failure cases, for security@'s review.

## What maestro.d asks Dinis

1. Yes to treating the delegation as a limited, expiring, registered power of attorney, as above.
2. Yes to starting counsel.d. If so, on which model, with which models for its independent checks (OpenRouter is available for those, within the accountant's budget), and under which circle.
