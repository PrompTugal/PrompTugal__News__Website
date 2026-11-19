# Brief for writer-10 (newsroom.sgit.ai): the free YouTube page, and how we got there

From conductor.b@PrompTugal.dinis, at Dinis's request in its session (19 November 2026, about 01:20 UTC): "pic2 is an spectacular case study for our current workflow, can you brief the newsroom journalist (which by now is the official one) to write about this (and how we ended up here)". Material for an article; the facts are below with where each is recorded. Write it in the newsroom's own voice and rules.

## The story in one line

In under two hours, a team of agents went from "we have a YouTube key" to a page whose design is bound by six conditions quoted from YouTube's own policies. Every step was taken by a named agent, each answered a question raised by the step before, and the one decision that was a person's was made by the person.

## How we got here (times UTC, 18 to 19 November 2026)

1. **The key.** Dinis created a Google API key restricted to five APIs. videos.b@ tested it (one call, YouTube's Opening Night video, 200) and reported it live at about 00:11. See board/briefs/2026-11-19-google-cloud-apis.md.
2. **The data.** data.b@ built a feed of Web Summit 2026's official YouTube uploads. At about 00:19 it reported that the uploads have no chapters (so a chapter list from a search engine was unconfirmed). It also quoted four of YouTube's API rules, one of them: "API Clients must not charge users to watch content in an embedded YouTube player".
3. **The conflict.** conductor.b@ saw that this clashes with promptugal.news, the one site that bills, and put it to Dinis as a question, not a fix.
4. **The register.** rights@, the licensing side-car started that evening, logged YouTube's terms as finding R6 at about 00:27. It marked commercial use "unclear" until Dinis decided.
5. **The person's idea.** Dinis, at about 01:05: put the videos "in a page that is not charged, which actually is a really powerful case study and example of the power of our custom billing model, since we can be compliant with that requirement by using an IFrame for Google and not charging for that page". Recorded in board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md, section 3.
6. **The policy, quoted.** rights@ read YouTube's Developer Policies and Required Minimum Functionality at the source (19 November; the pages were updated 6 November 2026). At about 01:15 it gave a conditional go with six conditions:
   - C1: never charged or gated;
   - C2: no advertising or sponsorship sold on or around the player;
   - C3: YouTube's own iframe player, of a minimum size, with no overlays;
   - C4: YouTube credited and its Terms linked;
   - C5: nothing from the API kept beyond 30 days;
   - C6: the page not counted as a metered read.

   See board/team/rights/register/google-apis.md, second section.
7. **The build.** dev@ builds a free-page flag and a gate check that no charged page carries a YouTube embed; designer@ designs within C3 and C4; journalist@ writes the page's own explanation. Nothing ships until rights@ checks the built page against C1 to C6.

## What it shows

- **Billing per page, not per site.** The publisher can choose not to charge for a page where another party's terms say it must not.
- **The order:** terms read and quoted before a byte is shown (R15), licence checked (R12), commercial use kept to the site that bills (R13), and no agent accepting terms on anyone's behalf (R14).
- **People and agents:** the agents found the conflict and the exact clause; the idea and the decision were Dinis's.
- **A trail:** every step is a commit or a board file, so the article can link each one.

## Rules for the piece

- **Sources:** link the public files above (github.com/PrompTugal/PrompTugal__News__Website, dev branch), and quote YouTube only from its own pages.
- **Claims:** no claim about YouTube or Google beyond their published text. No claim about RiskMandate beyond riskmandate.ai.
- **People:** name no one but Dinis and the agents.
- **State the status:** the page itself is not yet live, so say so, and that it waits on rights@'s check.
