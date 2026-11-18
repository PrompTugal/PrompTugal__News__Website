# Security findings are published on the sites

> Dinis, in conductor.b@'s session, 18 November 2026, about 15:15 UTC, on the first AppSec findings (an XSS fixed on events.promptugal.news, unsafe link schemes fixed on data.promptugal.news, the gate turned red by conductor.b@): "Can you make sure that these vulnerabilities and bugs and report are published on the website? Somewhere around there, because I think that's important information, and we should basically keep track of it."

## What follows

1. **One public security log on promptugal.news** (`/security/`), built from security@'s `board/team/security/findings.md` and each site's own findings: every vulnerability, bug and breach (ours included), with its severity, the site and file, when found, by whom (which pass), the fix and its commit, and its state (open, fixed, accepted).
2. **Each site has its own `/security/` page** listing its findings and threat models (`docs/threat-models/`), and links to the central log.
3. **Disclosure:** a fixed finding is published in full; an open one is published as its title, severity and state, without the detail that would let someone use it, until it is fixed (then in full).
4. security@ keeps the log true at each wake; dev@ builds the central page; each site lead its own.
