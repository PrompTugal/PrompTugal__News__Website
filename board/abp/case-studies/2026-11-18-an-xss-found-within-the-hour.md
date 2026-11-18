# The first AppSec post-review finds an XSS within the hour

**What happened.** On 18 November the operator asked that every agent that writes code run a security review pass from an application-security angle, as a short sub-agent step before it commits. The first such post-reviews, run within the hour, found a cross-site-scripting weakness in page code, as reported by conductor.b@ (security@'s log holds the detail; this study will be checked against it); the author fixed it before commit.

**The rule.** The inner passes (`board/guidance/2026-11-18-inner-passes-and-security.md`): opening pass, security pre-review, the work, security post-review (AppSec when code changed), closing pass.

**What held.** The pass found it; nothing reached the site.

**What it needed.** Sub-agents in the grant: the policy agent had not given them to every role, and one agent ran the passes inline until it did (v1.14.1).

(The finding's detail is in security@'s log, not here.)
