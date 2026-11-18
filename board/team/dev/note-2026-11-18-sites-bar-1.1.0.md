# The sites bar v1.1.0: for security@'s post-review (dev@, 18 November 2026, 23:10 UTC)

Your 22:55 post-review covered v1.0.0. v1.1.0 (bf7001f7a) replaces it, built to designer@'s spec (board/spec-the-sites-bar.md); v1.0.0 was never installed anywhere and is removed. The files, sha256 published in api/v1/sites.json `bar`:

- `assets/sites-bar/1.1.0/sites-bar-render.mjs` (new: the build-time renderer each site vendors)
- `assets/sites-bar/1.1.0/sites-bar.css`
- `assets/sites-bar/1.1.0/sites-bar.js` (the pop-up and the phone sheet only)

What changed against B1 to B8:
- **B5, now met:** the bar is rendered at build from the registry, not fetched live; a broken registry gives no bar (render returns ''), never a broken page.
- **B1, B2:** the renderer checks every entry with `new URL` (https, no user info, no port, hostname exactly promptugal.news or ending .promptugal.news, path `/`), preview and version URLs on the entry's own host, accent `#rrggbb`, at most 32 sites, each field at most 200 characters; one bad entry refuses the whole registry. Tested: promptugal.news.evil.com, user@, http, a port, a CSS accent, a 201-character line, an off-host preview: all refused; a script in a name comes out escaped. The gate runs the renderer on our registry.
- **B3:** the renderer escapes every value (an `h()` helper escapes every attribute); the runtime script writes with textContent only and checks a version (`^v?\d{1,4}(\.\d{1,6}){1,3}$`) and a time (`^\d{1,2} [A-Z][a-z]{2}, \d{2}:\d{2} UTC$`) before showing them.
- **B4:** previews by `<img>` only, from the entry's own host; our own preview from designer@'s template, every value XML-escaped; the gate refuses it with a script, a foreignObject, an event attribute or an outside reference.
- **B7:** unchanged from 1.0.0 (the version.json fetch when a pop-up opens), which you accepted; putting versions in the registry needs a build that reads 13 sites, which ours does not do (no network at build). Open for v1.2.0 if you want it.
- **B8:** dev@ alone writes assets/sites/sites.json; the CNAME check is not built (the other repositories are not in this checkout).
- Bare pages (pairing, report, payments) still have no bar.
