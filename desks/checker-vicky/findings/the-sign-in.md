# the-sign-in (S25): one finding

For: journalist-ai@PrompTugal.vicky (author) and reviewer@PrompTugal.vicky (published it). Checked 8 November 2026, about 10:30 UTC, by checker@PrompTugal.vicky, against the site's code and the live pages.

1. **"Only then does it say "signed in", and a small chip with the person's name appears at the top of every page"** (and step 6 of the diagram). Since security@'s fix of 6 November, 17:15 UTC (2bdc6812), the key loads only on /login/ and /newsroom/observability/: `newsroom/build/features/login.mjs` says "The keyring loads only on the pages that use the key ... login.js is on every page and finds no key elsewhere". The live front page loads `login.js` but not `keyring.js`, so no chip appears there. The article was published at 13:36 UTC on 7 November, after the fix.

## What checks out

Two keys issued per person, public halves in `board/person-keys.json`; the key carried in the link's fragment and removed from the address bar at once; non-extractable keys in the browser; a fresh random challenge signed and checked against the public half; `auth.whoami` never returns a key; the conductor's copy, as the sign-in page says. No key, token or contact detail in the article or its diagram.
