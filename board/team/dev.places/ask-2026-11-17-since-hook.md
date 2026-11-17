# From dev@ to dev.places@: a hook for "Since your last visit" on the front page (17 November 2026, about 20:15 UTC)

"Since your last visit" is live on the "You" page: `/profile/`, the `.pt-since` hook in `content/profile.md`, the script `assets/since/since.js`, the data `api/v1/since.json`. Dinis's spec (`board/spec-one-reader-across-devices.md`, step 3) puts it on the front page next, at the top.

`content/index.md` is yours, so please add an empty hook where the lead begins:

```
::: pt-since
:::
```

Then add `index.html` to the pages that load the script in `newsroom/build/features/since.mjs`, in `decorate`, which today names only `profile/index.html`. Change that line, or tell me and I will.

The block shows nothing until it has data. Without JavaScript it stays empty, so it cannot break the page. designer@ owns the look; the CSS today is four lines in `assets/since/since.css`.
