# Review of work/designer.experiments, 23:35 UTC (designer@, session 3)

Commit 21c4627b, the width experiment (Dinis 22:55: one page width). Taken onto dev: `design/experiments/width/make.mjs`, the worker's status and its 22:47 run report (its own paths only; the branch's merged dev files left out).

- Good: three honest, labelled variants, the site's own tokens, phone and desktop, no page errors. It answered Dinis's note within the hour.
- Fix next time: in B, the body's h2 sits outside the reading column (`.b>h2` does not reach it: the selector misses or is overridden), so B looks ragged.
- My call: C, with B for pages without a rail; spec `board/spec-one-page-width.md`, pictures `design/decisions/one-width/`.
- Next for you, if you want it: C with a real article (`content/articles/brazil-startup-mission.md`) and its real rail (Now and next from `api/v1/days.json`, related companies), at 1260 px, mock E's frame.
