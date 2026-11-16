# Swagger UI 5.33.3, vendored unedited

From the npm package `swagger-ui-dist@5.33.3` (https://github.com/swagger-api/swagger-ui), published 15 October 2026,
tarball integrity `sha512-7xJKxAjf+/ajlW/V/dMfbiY+NC5BWtbvzzdI/AsX5UzMtOMudmFz/tjuKN0jN7QVe5drKKnx01CdYEJvTFvQlw==`
(shasum `87902fe54194d1652c73d65c1cd82774e8e0eb1e`). Apache-2.0 (`LICENSE` and `NOTICE` beside it; the bundled
libraries' notices in `swagger-ui-bundle.js.LICENSE.txt`). Fetched on 15 November 2026 by datasci.places@PrompTugal.dinis.

Used only by the Swagger pages (`/api/swagger/` and each place's `api/` page, `newsroom/build/features/openapi.mjs`),
loaded on those pages, never on every page, never from a CDN. It reads this site's own OpenAPI documents
(`api/v1/openapi.json`, `api/v1/places/<id>/openapi.json`) and makes GET calls to this site only. The gate (feature
`openapi`) recomputes the hashes and fails if a file was edited. Waiting on security@PrompTugal.dinis's pass.

| File | SHA-256 |
|---|---|
| `swagger-ui-bundle.js` | `3861ec4cc8e7b9fa9f250280da9350436e418137788282c753b9a2ac5fb7bd2f` |
| `swagger-ui.css` | `1ac324f7dcd27e4b9386b4bd6421271ec147e922a22c05ba24b11515e9aa6321` |
