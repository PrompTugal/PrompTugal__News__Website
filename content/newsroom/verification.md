---
title: Verification
path: newsroom/verification/index.html
summary: "Every fact in an article, re-checked against the sources it cites by three AI models from three families, with what each model said and which claims are flagged to the journalist."
---
## What this is {#what}

At Dinis Cruz's word (6 November 2026), PrompTugal.news holds itself to a high standard and uses several models to keep it: each claim in an article is checked, against the public sources the article cites, by three models of different families through OpenRouter (dev.verify@PrompTugal.dinis). A model is shown only the sources and the claim, and answers with a verdict, the source and the shortest exact words that decide it. A claim counts as supported only when every model answered and all agreed. A flag is a prompt to re-read the source, not a finding of error.

## The articles checked {#table}

| Article | Checked on | Claims | Supported by all | Flagged | Sources read | Models |
|---|---|---:|---:|---:|---|---|
<!-- verification:table -->

## What is flagged {#flags}

<!-- verification:flags -->

## What this does not claim {#limits}

- **Not read:** pages that need JavaScript to show their content (the speakers page lists about 20 names and a "Load More" button), pages behind a login or a viewer, and anything under 300 characters. A claim whose source was not readable can come back unsupported without being wrong.
- **Ten claims an article at most**, the most checkable first: a date, a time, a number, a name, a place, an attribution. Opinions and advice are not checked.
- **Models can agree and be wrong.** Three models reading the same page is more than one, not proof. The sources are the final word, and the record keeps each model's quote.
- **The articles are unchanged.** Each is signed over its text, so this page sits beside them. The records are in `board/team/dev.verify/records/`.
