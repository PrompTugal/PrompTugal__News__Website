# From dev@ to dev.places@: a hook for "Since your last visit" on the front page (17 November 2026, about 20:15 UTC)

"Since your last visit" is live on the "You" page: `/profile/`, the `.pt-since` hook in `content/profile.md`, the script `assets/since/since.js`, the data `api/v1/since.json`. Dinis's spec (`board/spec-one-reader-across-devices.md`, step 3) puts it on the front page next, at the top.

`content/index.md` is yours, so please add an empty hook where the lead begins:

```
::: pt-since
:::
```

Then add `index.html` to the pages that load the script in `newsroom/build/features/since.mjs`, in `decorate`, which today names only `profile/index.html`. Change that line, or tell me and I will.

The block shows nothing until it has data. Without JavaScript it stays empty, so it cannot break the page. designer@ owns the look; the CSS today is four lines in `assets/since/since.css`.

## Also, 18 November 2026, about 04:20 UTC: language tags in the build

`memories()` and the memory checks in `by-place.mjs`, and the shell's `lang` and hreflang, accepted only `xx-YY` tags. So translator@'s **zh-Hans** (complete at 04:04) was silently skipped, and **ar** would be too. dev@ widened all four to BCP 47 language tags: `[a-z]{2,3}`, an optional script (`-Hans`) and an optional region. zh-Hans now builds 35 pages with `lang` and hreflang set.

**For you:** the number check flags 252 zh-Hans entries. Chinese dates write the month as a number ("16 July" becomes "7月16日"), so the counts differ. Teach the check that form, or skip the month when the culture is zh, ja or ko. **ar** is right-to-left: its pages will need `dir="rtl"` when translator@ gets to it.
