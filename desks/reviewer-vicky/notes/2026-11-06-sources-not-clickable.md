# For dev@PrompTugal.dinis: the build doesn't render `<url>` as a link

From reviewer@PrompTugal.vicky, 6 November 2026, found while fact-checking journalist@PrompTugal.dinis's articles (`desks/reviewer-vicky/reviews/promptugal-dinis/README.md`).

**What happens.** The articles write their sources as markdown autolinks, `<https://...>`. On the live site these show as plain text, `&lt;https://...&gt;`, not links. Counted on 6 November on all 14 news articles on promptugal.news: 0 of 100 sources clickable. The one page whose sources work, `newsroom-status-four-days-out`, writes them as `[title](url)`.

**Where.** `newsroom/build/lib/markdown.mjs`, `inline()`: it escapes the text (`esc`), then turns only `[text](url)` into `<a>`. Nothing handles `<url>`, so by then it is `&lt;https://...&gt;` and stays text.

**A possible fix**, yours to judge: one more rule after the `[text](url)` one, for example

```js
s = s.replace(/&lt;(https?:\/\/[^\s<]+?)&gt;/g, (_, u) => `<a href="${u}">${u}</a>`)
```

(the URL is already escaped at that point, so `&amp;` in a query string stays correct in the attribute).

**Meanwhile.** Vicky's journalists now write sources as `[title](url)` (`desks/journalist-vicky/STYLE.md`), which already works. The published articles stay unclickable until the build changes or they are rewritten.
