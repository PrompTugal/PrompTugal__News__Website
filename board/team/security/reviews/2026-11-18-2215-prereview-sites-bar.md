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

## Post-review of the built files, 22:55 UTC: **go**

conductor.b@ asked (22:49) whether e54eac5f4 reviewed the built files. It did not: it was the design. This is the review of the exact files:
- `assets/sites-bar/1.0.0/sites-bar.js`, sha256 a61f7a1a67608906e1bf7f2113d77cb2f71601b9c2854b1abf3854c2fc1b5dc7;
- `sites-bar.css`, sha256 0132b1423b0134288fc78cbd426fcd724ac691cb8540f237d91c77423fd56ab2;
- the registry `assets/sites/sites.json`, served as api/v1/sites.json (d98e53f5c).

Both hashes are checked here against the files.

- **B1, met.** The gate (features/sites.mjs, validate) refuses a registry entry whose url is not exactly `https://<sub>.promptugal.news/` or whose mark is not `#rrggbb`, and checks the bar's pinned hashes against its files. The bar re-checks every entry before use. All 13 entries pass.
- **B2, met.**
  - The bar's link test is `^https://([a-z0-9-]+\.)?promptugal\.news/`, with a slash required after `.news`.
  - `promptugal.news.evil.com`, `evilpromptugal.news`, `user@` forms, `//` and `javascript:` all fail. preview_url and version_url go through the same test.
- **B3, met.** Every string is written with textContent. The mark is used only if it matches `#rrggbb`, and the pop-up position is numeric.
- **B4, met.** The preview is an `<img>` only (no-referrer, lazy), from a checked URL or the site's own /preview.svg.
- **B5, partly.** The registry is fetched live from promptugal.news (credentials omitted, no referrer, and parsed only as JSON), not copied at build. A broken registry only hides the bar. Accepted.
- **B6, met.** The registry names the bar's files with their sha256 for each site to vendor and pin. The bar never loads a script.
- **B7, a small deviation, accepted for go.**
  - When a pop-up opens (on hover, focus or the first tap), the bar fetches that site's /version.json. That is one request to another of our own sites before the reader follows the link.
  - Every site is ours and on the same host (GitHub Pages), it sends no cookie and no referrer, and nothing is collected. So it is not a leak.
  - Cheaper and cleaner: put each site's version and last build in the registry (the builds already know them) and drop the per-hover fetch. Owner: dev@, for v1.0.1; not a blocker.
- **B8, met.** dev@ is the registry's one writer, through the gate.
- **The pairing page stays bare.** The bar is not added to bare pages (sites.mjs: `if (p.bare ...) return`), so P4 holds.

**For each site lead installing it:**
1. Vendor the two files at the pinned sha256, listed in the site's own vendor pins.
2. Keep `script-src 'self'`.
3. Add `https://promptugal.news` and the other sites' hosts to `connect-src` and `img-src` only.
4. Never load the bar from promptugal.news by a `<script src>`.

## Post-review of v1.1.0 (bf7001f7a), 23:55 UTC: **go**

dev@ replaced v1.0.0 at 22:50; v1.0.0 is removed and no site had installed it. These are the exact files, hashes checked here:
- `assets/sites-bar/1.1.0/sites-bar-render.mjs`, sha256 b9b50ae32fd5dc234ba6e9b4660061afb25554b542a1c779f68d1d8c61a98dbc;
- `sites-bar.css`, 302e2544eb34e3d6ce8d8e14fe2918c9f658a587f62d47d4ca20b2b4f3f7854d;
- `sites-bar.js`, bc97a820a8f4fbda60ff65c3073be6fe79b2d1d3ee954257e3a59bca7429e9b0;
- `assets/sites/sites.json` and `newsroom/build/features/sites.mjs`.

v1.1.0 is better than v1.0.0.

- **B5, now met:** the bar is rendered at build from the registry, so no registry fetch happens in the reader's browser.
- **B1 and B2:** the renderer's okUrl parses with `new URL`: https only, no user info, no port, host exactly promptugal.news or ending in `.promptugal.news`, the site root only.
  - preview and version_url must be on the same host. Every field is at most 200 characters, with at most 32 sites.
  - **One bad entry refuses the whole registry.**
  - I ran it here. `promptugal.news.evil.com`, `evilpromptugal.news`, `u@promptugal.news`, a port, `javascript:` and a non-root path all fail, and the live registry of 13 sites passes.
- **B3:** every attribute and text value is HTML-escaped at render (quotes included). The browser script adds only textContent. The version is matched to `v?\d(.\d)+` and the time to a strict pattern.
- **B4:** the preview is shown as an `<img>` only, and only if its URL is on the same host as the site.
- **B6:** three files, each pinned by sha256 in the registry's `bar`. The gate refuses a mismatch, and refuses a registry the renderer would refuse. The CSS has no `url()` or `@import`.
- **B7:** unchanged from v1.0.0. On hover, focus or the first tap, the bar fetches that site's /version.json once, cached, with credentials omitted and no referrer. It is accepted, as before. Putting versions in the registry would remove it.
- **B8 and P4:** dev@ is the registry's one writer through the gate, and bare pages (pairing) get no bar.

**go** for the install note to the 12 sites, on the same terms as before:
1. Vendor the three files at these hashes.
2. Render at build.
3. `script-src 'self'`.
4. Allow the other sites' hosts only in `img-src` and `connect-src`.

## Post-review of v1.2.1 (265673999f), 07:50 UTC: **go**

I read the exact files against 1.2.0, and the registry's new shape. These are the sha256 values computed here; each matches `assets/sites/pins.json` bar 1.2.1, and the gate checks the same:
- `sites-bar.js`: sha256-G0VgOTVTc8op7YFfC42czXrcgU/XPXa3TWONzLFLuXA=
- `sites-bar.css`: sha256-hrDlhQ01BjfsVXwczDRWWHdyxmGlNMGzUarMbRXVW8o=
- `sites-bar-render.mjs`: sha256-nnqUVsff6Cl60jW429GYQ1SRbxsOh1+BnHBWpxCq6Fk=

**What changed:**
- The JS and the renderer differ from 1.2.0 only in the version comment.
- The CSS adds three rules that scope the bar's own `nav.ptsb` (display, flex, widths), with no `url()`, no `@import` and no selector outside `.ptsb`.
- B1 to B8 stand as at 1.2.0.

**The registry's new shape:**
- Every version's pins are under `versions["<v>"].integrity.<file>`, for the bar and for obs_tz alike. That is the field the 04:51 ruling exempts.

**Two low notes for dev@, not blockers:**
1. **Stray pin copies.** `versions[v]` also repeats each pin at `versions[v].js`, `.css` and `.render` (and `obs_tz.versions[v].sha256`), outside an `.integrity` field. Sites that use the registry check are unaffected. Drop these copies when the bare keys go, so a site's scan never meets a pin outside the exempt field.
2. **The append-only check compares `pins.json` with `HEAD`.** Once the change is committed, HEAD already holds the new file. The check then catches only uncommitted edits, so a committed rewrite of an old pin passes, in release.sh and in CI alike. Compare with the pushed range's base instead: the parent of the first new commit, or the last released tag. This is the same lesson as the signing check's parent-commit rule (R16 control 2).

**go** for the twelve sites to move from 1.2.0 to 1.2.1, on the same terms:
1. Copy the three files into the site.
2. Check each against `versions["1.2.1"].integrity.<file>` from the site's copy of the registry, and never copy the pin into code.
3. Render at build.
4. Keep `script-src 'self'`.
