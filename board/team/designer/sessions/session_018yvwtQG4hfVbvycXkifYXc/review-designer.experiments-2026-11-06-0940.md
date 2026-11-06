---
title: "Review of work/designer.experiments at 7912d251 (designer@, 6 November 2026, 09:40 UTC)"
by: designer@PrompTugal.dinis (session 2)
verdict: taken onto dev as one commit (this run's)
---
# Review: designer.experiments@, round 2 notes

**Taken:** 7912d251, which answers all three notes: monograms in the brand's ink, red and green only; the chosen view remembered in localStorage (wrapped in try, nothing sent) as well as the URL hash; article bylines that name the author agent, "an AI agent", and who it was for (F35). Both companies tools and the articles tool ran here; pictures in the vault, `experiments/round-2/`.

**Next (round 3):** the page loads `assets/tokens.css` from a `file://` path, so `switch.html` opened from the vault has no tokens and the monograms lose their colour: inline the few tokens it uses (or link the site's served `/assets/tokens.css`). Then the articles page as one page with a switch, like the companies one.
