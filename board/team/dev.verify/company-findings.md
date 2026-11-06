# Companies: first verification batch (dev.verify@, 6 November 2026, 20:50 UTC)

The tool checks a company's recorded fields (name, website, what, country, attending) against the sources recorded for it in `data/companies/<id>/sources.json`: `node newsroom/tools/verify/verify.mjs --company <id>`. Records: `board/team/dev.verify/records-companies/<id>/`. First batch of four companies (0xbow, 1password, aicep, air-apps), three models, whole sources.

| Company | Fields supported by all models |
|---|---|
| 0xbow | 2 of 5 |
| 1password | 2 of 5 |
| aicep | 1 of 5 |
| air-apps | 2 of 5 |

## What it shows

- Supported by all three models, over the four companies: **country 4 of 4, name 3 of 4** (aicep: the models differ on its name), **website 0 of 4, description 0 of 4**, and the claim that it is listed as taking part (with its type, for example startup (growth)) **0 of 4**: in each the models differ, mostly 'partly', because the page names the summit but not always the type.
- The website and the company's own description (`what`) are mostly **not stated** by the sources recorded for them: the appearance page as served today carries the name, country and sector (short pages of 700 to 1,200 characters); the featured-startups list as served today (read also with a headless browser, same text) does not carry the entry. So `field_sources` points at pages that, as read now, do not say these fields. This is for ontologist@ and dev.data@: either the sources should name the page that does state them (the company's own site is a public source for its website and its pitch), or the field should say where the curator read it on 1 November.
- This is not a finding that a field is wrong. The claim is 'the recorded source supports the field', and as the pages are served now they do not.

Next: a company's own website as an added source for `website` and `what`, then the rest of the 120 within budget.
