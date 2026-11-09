# GAMMA-Ray — Model Name & Concept Specification

**Companion to:** *Agentic Maturity Mapping — 5 Standards Selection & Graph Model Design* (the full technical spec)
**Date:** 2026-11-09

---

## 1. What GAMMA-Ray is

**GAMMA-Ray** is the name of a model for rating any company's agentic AI use across five public maturity standards, with every rating traceable to source-backed evidence, built on graph technology.

The name works at two levels:

- **GAMMA** is the methodology: the five-framework selection, the per-deployment rating rules, and the evidence contract.
- **GAMMA-Ray** is the application of that methodology: the graph layer that sweeps across companies and emits the ratings.

One line: *GAMMA is the model, GAMMA-Ray is the graph.*

## 2. The backronym

**GAMMA-Ray** = **G**raph-**A**nalyzed **M**ulti-framework **M**aturity **A**ssessment with **R**isk-**A**djusted **Y**ield.

- **Graph-Analyzed** — the ratings live in a labeled property graph; every number is a query result, not a spreadsheet cell.
- **Multi-framework** — five complementary standards, one per axis (capability, adoption, engineering, autonomy, governance).
- **Maturity Assessment** — where a company sits, per use case, on each axis.
- **Risk-Adjusted Yield** — the derived headline metric: how much of a company's agentic maturity is real, adjusted for how ungoverned it is.

## 3. Why "gamma ray"

In physics, gamma rays are the most energetic and most penetrating form of electromagnetic radiation — they pass straight through materials that stop ordinary light. The metaphor does real work:

- **Penetration** — GAMMA-Ray sees through vendor marketing and hype to the evidence-graded reality underneath.
- **Five axes** — the ray splits every company across five frameworks, like light through a prism, producing a full spectrum instead of a single level.
- **Non-invasive** — a scan is conducted from public evidence alone; no company cooperation required.

## 4. What a GAMMA-Ray actually is (the deliverable nouns)

The vocabulary nests cleanly: a **scan** produces a **profile**, the profile contains five **scores**, and many scans compose into a **map**.

| Term | What it is | Use it when |
|---|---|---|
| **GAMMA-Ray scan** | The per-company report: five levels, evidence trail, findings | The default deliverable. "Here is your GAMMA-Ray scan of Company X." |
| **GAMMA-Ray profile** | The five-axis fingerprint inside the scan, with the evidence trail | When you want the detail, not the headline. |
| **GAMMA-Ray score** | The single comparable number (risk-adjusted yield or five-axis roll-up) | Rankings, comparisons, quick references. |
| **GAMMA-Ray map** | The population-level view: many scans composed into the mismatch quadrant | Market analysis, sector reports. |

So: **a scan produces a profile, the profile contains scores, and scans compose into a map.**

## 5. Anatomy of a scan

> **GAMMA-Ray scan of Company X**
> Salesforce L2 · Microsoft 300 · SEI Aligned · EAAMM L3 · AAGMM L1
> 4 deployments rated · 17 evidence items (2 at E3, 15 at E2) · Risk-adjusted yield: medium-high
> Headline finding: cross-domain agents in production with no agent registry or human-oversight policy.

Three things every scan delivers:

1. **The profile** — the five levels, one per axis.
2. **The penetration** — the evidence layer, graded E0–E5, showing whether the profile is built on marketing claims or verified artifacts.
3. **The yield** — the risk-adjusted score derived from the mismatch between axes (high capability + low governance = the interesting companies).

## 6. The five axes (summary)

Full detail in the companion spec; reproduced here for standalone reading.

| Axis | Framework | Unit | Levels |
|---|---|---|---|
| Agent capability | [Salesforce Agentic Maturity Model](https://www.salesforce.com/news/stories/agentic-maturity-model/?bc=OTH) | Per use case | 0–4 |
| Org adoption | [Microsoft Agentic AI Adoption Maturity Model](https://learn.microsoft.com/en-us/agents/adoption-maturity-model/) | Per org, 5 pillars | 100–500 |
| Engineering rigor | [SEI/Accenture AI Adoption Maturity Model](https://www.sei.cmu.edu/news/sei-and-accenture-release-ai-adoption-maturity-model-to-help-organizations-scale-ai-with-predictable-outcomes/) | Per org, 8 dimensions | 1–5 |
| Autonomy / human role | [EAAMM](https://www.icaimt.com/2026/agentic-ai.html) | Per use case | L1–L5 |
| Governance controls | [AAGMM](https://arxiv.org/html/2604.16338) (NIST AI RMF + ISO/IEC 42001 aligned, 12 domains) | Per org | L1–L5 |

**Core principle:** ratings attach to deployments (use cases), not companies — a company can be L3 in customer service and L1 in finance. Company-level scores are computed roll-ups, never directly asserted. No rating exists without linked evidence; unevidenced ratings carry confidence 0 and are excluded from analysis.

## 7. The headline analysis: capability vs. governance

The most valuable output is the **mismatch quadrant** — a company with high capability (Salesforce L3+) but low governance (AAGMM L1–L2) is the signature of high autonomy running ahead of oversight. EAAMM's gating rule (governance infrastructure required before advancing beyond L2) says these states shouldn't coexist; when they do, it either signals an evidence gap or overclaiming. Both are findings.

## 8. Naming notes

- **Collision check:** "GAMMA" collides with gamma radiation and ML terms (discount factors, GAN loss), but "GAMMA-Ray" + "maturity" is unclaimed; context disambiguates instantly.
- **Avoid** shortening to "the gamma model" in writing — keep the compound form so the physics metaphor and the product identity stay attached.
- **Capitalization:** GAMMA-Ray (the model/product); "gamma ray" (physics) in lowercase when referring to the actual radiation.
