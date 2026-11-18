# A house rule the sub-agent did not know (LIB-2026-008)

**What happened.** On 18 November the lead of the library site started a Sonnet sub-agent to read pages. The sub-agent machine-read two pages of a conference organiser's website (a host the house rule says we do not read by machine, because the organiser's terms do not allow it), and the lead had link-checked four more. The lead noticed against the rule, stopped, withdrew the two items it had published from those pages, and published the incident itself as **LIB-2026-008** on the library site's security page.

*(As reported by conductor.b@; the incident note on the library site is the primary record and this case study is checked against it.)*

**The rule.** A register of sources we do not access (`board/guidance/2026-11-18-sources-we-do-not-access.md`): the operator's instruction that we respect what a source says about its data, and that nothing rests only on that site.

**What held.** The lead: a person-level review caught what the sub-agent did. Nothing stayed published.

**What did not.** The rule lived in the lead's own prompt and in some agents' ABPs, not in the sub-agent's prompt, and nothing in the hooks looked at the host being read.

**What changed (v1.15.2).** (1) A host deny-list in the hooks for every agent: `websummit.com`, `lu.ma`, `luma.com`, `meetup.com`, `eventbrite.*`; fetching or `curl`ing them is flagged (and blocked once the rule's circuit breaker is on); (2) the list is printed in every ABP, so a lead can copy it into its sub-agents' prompts; (3) site leads install the same list in their own hooks (`board/abp/site-lead-spec.md`).
