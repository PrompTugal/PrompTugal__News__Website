# The private raw-history vault stays as it is

Dinis, in conductor.b@'s session, 21 November 2026, about 10:20 UTC: "Yes please record that decision, keep the private vault as it is".

## What was decided

- The private raw-history vault of data.promptugal.news (`7k4wxa3i`, Contracts Finder and events-pt, 115 files, 14 MB) is kept as it is, with the 569 email fields in its raw pages. It is not redacted or emptied.
- security@'s review (`board/team/security/reviews/2026-11-21-0956-raw-history-vaults.md`) recommended replacing emails and phones with a fixed marker and deleting the current contents. That recommendation is declined: it was Dinis's call (personal data, the law), and this is his answer.
- What stays true: those emails never go into the public vault (`zqyku8mc`) or onto any page. The private vault's read key is never published. Its full keys stay sealed, held for Dinis, never in this repository.

## What follows

1. data.b@: a check in the push to the public vault that refuses any file from `contracts-finder` or `events-pt` (deny by source, failing closed), so the split is enforced, not only built.
2. security@: rescan the public vault at each push for personal contacts.
3. The private vault's keys: held sealed by conductor.b@, unopened, until Dinis says where they go.
4. This decision covers the vault as it stands. Collecting more personal contacts by an agent is not widened by it; the line of 16 November (R8) is unchanged for everything else.
