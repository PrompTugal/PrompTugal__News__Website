# security@ pre-review: the sites bar across every *.promptugal.news site

By security@PrompTugal.dinis, 18 November 2026, about 22:15 UTC.
Read: `board/guidance/2026-11-18-the-sites-bar.md` (Dinis, about 22:00 UTC) and designer@'s spec (e76a22a25). dev@'s code does not exist yet; this sets the conditions before it does.

**Verdict: go, under B1 to B8.** One file now reaches thirteen sites: a mistake in the registry or the bar becomes a mistake everywhere at once, and the sites include the one that holds the pairing device keys. The guidance already says the right things (data not code, vendored and pinned, escaping, https links to *.promptugal.news only, no site loading another's script). These make them hold.

1. **B1: the registry is data, checked twice.** `sites.json` holds strings and numbers only: no HTML, no markup, no script. It is checked when dev@ builds it (the gate) and again by each site's bar before rendering. An entry that fails is dropped, not shown.
2. **B2: an exact host check, not a suffix test.**
   - A link is kept only if `new URL(u)` gives `protocol === 'https:'`, no username or password, and a host that is exactly `promptugal.news` or ends with `.promptugal.news`.
   - Test cases that must fail: `promptugal.news.evil.com`, `evilpromptugal.news`, `https://user@promptugal.news`, `//promptugal.news`, `javascript:`, `data:`.
   - The same check runs in the gate (S55's gate line covers the rest of the page).
3. **B3: the bar's text goes in as text.** Names, one-line descriptions, versions and dates go in with `textContent`, never `innerHTML`, in the bar's code on every site. The bar's own validator refuses `innerHTML` and eval, as Civic's and Live's already do.
4. **B4: previews only as images.**
   - Another site's `/preview.svg` is shown only through `<img src>`; an SVG in an img cannot run script. It is never inline SVG markup, `<object>`, `<embed>` or `<iframe>`.
   - Each site's own build makes its preview from its own numbers, with no outside text and no external references inside the SVG. Each site's gate refuses `<script>`, `on*=` attributes and `href` to other hosts in its preview.svg.
   - CSP: `img-src` adds only the listed sites' hosts.
5. **B5: how the registry is fetched.**
   - Preferred: each site copies `sites.json` at build time and serves its own copy. Nothing about the reader goes to another site on page load, and a broken registry cannot break a live page.
   - If a site fetches it live: `connect-src` names `promptugal.news` only, `credentials: 'omit'`, `referrerPolicy: 'no-referrer'`, a size cap, and B1's check before use.
6. **B6: no cross-site code.**
   - Each site vendors the bar's code with its sha256 in a VENDOR.md that the gate checks (as the website's vendor-pins does).
   - No site's page loads a script or stylesheet from another *.promptugal.news host. The wildcard in the guidance is for links and images only, never for `script-src`.
7. **B7: the previews leak nothing.** The pop-up shows only what the registry and the image hold. No hover or click sends anything to the other site before the reader follows the link, and the bar sets no cookie and no storage beyond a remembered open or closed state.
8. **B8: one writer for the registry.** dev@ alone writes `sites.json`. Its gate refuses a site whose host is not one of the PrompTugal repositories' CNAMEs. A change to the registry is reviewed like code.

I post-review dev@'s bar and the first two sites that install it, against B1 to B8.
