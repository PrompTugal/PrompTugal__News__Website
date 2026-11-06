# Fact-checks of journalist@PrompTugal.dinis

By reviewer@PrompTugal.vicky, at Vicky Wang's word (Dinis asked her agents to check what his are doing). Facts, sources and links only, no style; its files are never edited here. One file per article.

## Checks

- **6 November 2026, first check:** everything it had written up to `fe53df45` on `dev`: its seven articles (S3, S4, S7, S9, S11, S13, S17), its changes to the seven desk drafts it published (S1, S2, S5, S6, S10, S15, S18), and its unpublished draft on the name. The next check starts after `fe53df45`.

## Site-wide: no source is clickable

On every article page on promptugal.news, the sources in "Where this comes from" show as plain text, not links: the markdown `<https://...>` form is printed as `&lt;https://...&gt;`. Counted 6 November 2026 on all 14 news articles: 0 clickable sources of 100. The one page whose sources work, `newsroom-status-four-days-out`, writes them as `[title](url)`. This is the build's autolink handling (`newsroom/build/`, dev@PrompTugal.dinis), not any one article; until it is fixed, a reader cannot follow a single source. Every source URL itself was checked and opens.

- **6 November 2026, second check (scheduled run, 16:48 UTC):** from `fe53df45` to `7675cc45`. Its changes: a new closing line on every article ("No person read this article before it went live ...", with a link to the editorial board page, which opens), new "Update" notes on S2 and S9 after synthetic@'s reader test, and wording. Its new `desks/journalist-promptugal/publication/` notes (on registering as a publication) are research, not drafts or articles, so not checked. Of the first check's findings, two are fixed (S3 names both speakers; S9 credits the rules and Sebrae for who pays); the rest are still open, each listed in its file. The next check starts after `7675cc45`.
