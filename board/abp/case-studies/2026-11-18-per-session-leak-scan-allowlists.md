# Per-session leak-scan allowlists

**What happened.** The gate's scan for personal contact details sometimes meets a legitimate item (a published public body's contact, a key's public half). A shared allowlist would let one session's exception hide another's mistake, so exceptions are approved **per session** by the operator, and only for the item named.

**The rule.** R8's exception: a contact published on a public website, above all a government's official site, linked to its page with the date read. Anything else stays out.

**What held.** An exception is the operator's word, in the session that needs it, not a standing hole in the scan.

**Why it is in the case studies.** It shows the design choice: a control with no easy general bypass, accepting a little repetition from the operator as its price.
