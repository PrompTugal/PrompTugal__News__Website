# Agentic AI Maturity Mapping — Standards Selection & Graph Model Design

**Purpose:** Select five public maturity standards that, combined, let you rate any company's agentic AI use with graph technology, with every rating traceable to source-backed evidence.

**Date:** 2026-11-09

---

## 1. Selection Criteria

Five standards were selected from ~15 candidates using these criteria:

1. **Publicly documented** — levels and dimensions are published in full, not behind a client paywall (this excludes Gartner's full toolkit and Deloitte's detailed model).
2. **Structured** — discrete dimensions and levels that can be encoded directly as graph nodes and relationships.
3. **Complementary** — each measures a distinct axis; minimal overlap (capability, adoption, engineering, autonomy/human-role, governance).
4. **Evidence-gradable** — level definitions contain observable, checkable indicators rather than vague adjectives.
5. **Technology-agnostic** — not tied to one vendor's product stack (Salesforce kept with caveat: its model is product-agnostic in definition despite the vendor).

---

## 2. The Five Selected Standards

### 2.1 Salesforce Agentic Maturity Model — the *capability* axis

**Source:** [Salesforce News, "The Agentic Maturity Model"](https://www.salesforce.com/news/stories/agentic-maturity-model/?bc=OTH) (published 2025-04-10)

| Level | Name |
|---|---|
| 0 | Fixed Rules and Repetitive Tasks (chatbots/co-pilots, no reasoning) |
| 1 | Information Retrieval Agents (retrieve + recommend, human decides) |
| 2 | Simple Orchestration, Single Domain (autonomous execution, one data silo) |
| 3 | Complex Orchestration, Multiple Domain (harmonized data, cross-domain workflows) |
| 4 | Multi-Agent Orchestration (any-to-any interoperability, supervised) |

**Why chosen:** The cleanest public model of *what agents actually do* — reasoning vs. acting, single vs. multi-domain, single vs. multi-agent. Rated per use case, not per company, which matches how deployments actually vary inside an organization.

**Key encodable detail:** Transition prerequisites are explicit — e.g., Level 2→3 requires separation of duties and least-privilege access for agents; Level 3→4 requires an "agent bus", dynamic agent discovery, fine-grained access control, and layered human/AI supervision.

**Caveat:** Vendor-published (Salesforce sells agent products); presented as a progression framework without a formal scoring rubric.

### 2.2 Microsoft Agentic AI Adoption Maturity Model — the *adoption* axis

**Source:** [Microsoft Learn, "Introduction to the Agentic AI adoption maturity model"](https://learn.microsoft.com/en-us/agents/adoption-maturity-model/)

**Structure:** 5 pillars, each scored across 5 levels (100 Initial → 500 Efficient):

1. AI strategy and experience
2. Business strategy and value
3. Governance and security
4. Technology and data
5. Organization and culture

**Why chosen:** The most granular fully-public organizational adoption model. Each pillar×level cell has observable characteristics (e.g., at Level 400 governance: "agents explicitly classified by purpose, criticality, and autonomy level"; zoned environments: safe / supported / IT-managed). This cell-level detail converts directly into a graph checklist.

**Caveat:** Microsoft-published; the level descriptions reference Microsoft product patterns in places.

### 2.3 SEI/Accenture AI Adoption Maturity Model — the *engineering rigor* axis

**Source:** [SEI CMU news release](https://www.sei.cmu.edu/news/sei-and-accenture-release-ai-adoption-maturity-model-to-help-organizations-scale-ai-with-predictable-outcomes/) and [model overview PDF](https://www.sei.cmu.edu/documents/6413/AI-Maturity-Model-Overview.pdf); free download from the SEI Digital Library.

**Structure:** 8 dimensions, each at one of 5 levels:

- Dimensions: Organizational Strategy, Workforce and Culture, Workflow Re-engineering, Risk and Governance, Data, Engineering, Operations, Ecosystem.
- Levels: Exploratory AI → Implemented AI → Aligned AI → Scaled AI → Future Ready AI.

**Why chosen:** The most engineering-driven and neutral (research institution + consultancy, not an AI vendor). Field-tested; the levels are defined by how completely practices are implemented per dimension, which is directly auditable.

### 2.4 EAAMM (Enterprise Agentic AI Maturity Model) — the *autonomy / human-role* axis

**Source:** [ICAIMT 2026, "Agentic AI in Enterprise Business Processes"](https://www.icaimt.com/2026/agentic-ai.html)

**Structure:** 5 levels defined by the human's role (integrating Feng et al.'s autonomy levels), crossed with 4 readiness dimensions:

| Level | Human role | Meaning |
|---|---|---|
| L1 Assistive | Operator | Explicit prompts; human controls all actions |
| L2 Collaborative | Collaborator | AI suggests; human approves |
| L3 Consultative | Consultant | AI autonomous on routine tasks; human consulted on exceptions |
| L4 Supervisory | Approver | AI independent on complex tasks; human approves critical decisions |
| L5 Autonomous | Observer | Full autonomy within boundaries; human monitors |

Readiness dimensions: governance infrastructure, data architecture, workforce adaptation, risk management (weightable by industry).

**Why chosen:** The human-role framing is the best cross-check axis: it captures *delegation risk* independent of technical capability. It is a diagnostic per use case ("an organization may be at L3 for customer service while remaining at L1 for financial decision support") and has an explicit **gating mechanism** — governance infrastructure is required before advancing beyond L2. Empirically informed: 89% of L3+ organizations had at least partial governance vs. 38% of L1 organizations (χ² = 27.4, p < 0.001, Cramér's V = 0.45).

### 2.5 AAGMM (Agentic AI Governance Maturity Model) — the *governance* axis

**Source:** [arXiv 2604.16338](https://arxiv.org/html/2604.16338)

**Structure:** 5 levels (L1 Ad-hoc → L5 Optimized) across 12 governance domains, each mapped to NIST AI RMF 1.0 and ISO/IEC 42001 clauses:

| ID | Domain | NIST AI RMF | ISO/IEC 42001 |
|---|---|---|---|
| GD-01 | Agent Lifecycle Management | GOV 1.1, 1.3 | 6.1, 8.1 |
| GD-02 | Identity & Access Control | GOV 1.5, MNG 2.3 | 9.2, 9.4 |
| GD-03 | Observability | MEA 2.1, 2.6 | 9.1 |
| GD-04 | Policy Enforcement | GOV 1.2, MNG 4.1 | 5.2, 8.2 |
| GD-05 | Data Governance | MAP 3.1, GOV 1.7 | A.8 |
| GD-06 | Human Oversight | GOV 1.4, MNG 1.3 | 6.2 |
| GD-07 | Sprawl Containment | GOV 6.1, MAP 1.5 | 8.1, 10.1 |
| GD-08 | Audit & Compliance | MEA 2.8, MNG 4.2 | 9.2, 10.2 |
| GD-09 | Inter-Agent Coordination | MAP 3.4, MNG 2.1 | 8.2 |
| GD-10 | Risk Classification | MAP 1.1, 1.2 | 6.1.2 |
| GD-11 | Incident Response | MNG 3.1, 4.1 | A.6.2.5 |
| GD-12 | Continuous Improvement | MEA 3.1, GOV 6.2 | 10.1, 10.2 |

**Why chosen:** The only standards-aligned model (NIST AI RMF + ISO 42001), which gives every governance rating an external anchor. Each level lists **active controls** (e.g., L3: registry, IAM, observability, policy, HITL, audit, risk classification; L4 adds automated policy enforcement and sprawl detection) — these control lists are literally checklist nodes for a graph. Simulation code and data are openly available (GitHub, seed 42).

**Caveat:** Validated by simulation (750 runs), not production deployments; self-assessment instrument is future work.

---

## 3. Why these five (coverage matrix)

| Axis | Standard | Unit of analysis | Levels |
|---|---|---|---|
| Agent capability | Salesforce | Per use case | 0–4 |
| Org adoption | Microsoft | Per organization (5 pillars) | 100–500 |
| Engineering practices | SEI/Accenture | Per organization (8 dimensions) | 1–5 |
| Autonomy / human role | EAAMM | Per use case | L1–L5 |
| Governance controls | AAGMM | Per organization (12 domains) | L1–L5 |

**Rejected candidates and why:**
- **Gartner AI Maturity Model** — stages (Foundational→Transformational) are public but the full toolkit and scoring are client-only ([Gartner](https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit)).
- **Deloitte** — 4-level process-integration model is documented only at summary level ([Perplexity AI maturity overview](https://perplexity.ai/en-GB/hub/blog/ai-maturity)).
- **MIT CISR** — excellent benchmark *population data* (28% / 34% / 31% / 7% across 4 stages) but less granular; keep as an optional benchmarking layer, not a rating axis ([MIT CISR](https://cisr.mit.edu/publication/2025_0801_EnterpriseAIMaturityUpdate_WoernerSebastianWeillKaganer)).
- **WWT, Sema4, Infosys 5E, Progress, OneReach** — single-axis ladders that duplicate coverage of the five selected.

---

## 4. Graph Data Model

Designed for a labeled property graph (Neo4j-style Cypher shown; translates directly to RDF/OWL if preferred).

### 4.1 Node types

```
(:Company {name, sector, hq_country})
(:Deployment {name, description, production: bool, customer_facing: bool})
(:Framework {name, version, source_url})
(:Dimension {name, framework_axis})          // Microsoft pillar, SEI dimension, EAAMM readiness dim, AAGMM domain
(:Level {code, name, rank, framework})        // e.g. Salesforce:0, MSFT:400, SEI:3, EAAMM:L3, AAGMM:L2
(:Control {name, standard_ref})               // AAGMM active controls, EAAMM prerequisites, Salesforce transition requirements
(:Evidence {description, evidence_grade, date_observed})   // E0–E5
(:Source {url, publisher, published_date, trust_tier})
```

### 4.2 Relationship types

```
(:Company)-[:HAS_DEPLOYMENT]->(:Deployment)
(:Deployment)-[:RATED {level, confidence, rated_date}]->(:Dimension)
(:Deployment)-[:ASSESSED_ON]->(:Framework)          // roll-up per framework
(:Evidence)-[:SUPPORTS|CONTRADICTS]->(:Deployment)-[:RATED]->(:Dimension)   // attach evidence to the rating, not just the node
(:Evidence)-[:FROM_SOURCE]->(:Source)
(:Dimension)-[:PART_OF]->(:Framework)
(:Control)-[:REQUIRED_AT]->(:Level)
(:Control)-[:SATISFIED_BY]->(:Evidence)
(:Level)-[:NEXT_LEVEL]->(:Level)                    // ordered ladders enable gap queries
(:Level)-[:ALIGNED_WITH {confidence}]->(:Level)    // cross-framework level alignment (section 5)
```

### 4.3 Design rules (the "fully supported by the data" contract)

1. **No unevidenced ratings.** Every `RATED` relationship must have at least one `SUPPORTS` evidence item; a rating without evidence is stored as `confidence: 0` and excluded from analysis queries.
2. **Evidence is attached to the assessment, not the company** — so contradictory evidence over time is preserved rather than overwritten.
3. **Evidence grades E0–E5** (adapted from the [evidence-graded maturity model for AI agents](https://arxiv.org/html/2610.18603v1)): E0 = claim only; E1 = vendor marketing; E2 = press/independent reporting; E3 = primary sources (filings, docs, talks); E4 = demonstrated artifact (demo, API, code); E5 = independently verified.
4. **Per-deployment rating is primary.** Company-level scores are computed roll-ups, never directly asserted — this mirrors EAAMM's explicit position that a company can be L3 in customer service and L1 in finance.

### 4.4 Worked Cypher

Rate a deployment on Salesforce's ladder:

```cypher
MATCH (c:Company {name: $company})-[:HAS_DEPLOYMENT]->(d:Deployment)-[:RATED]->(dim:Dimension)-[:PART_OF]->(f:Framework {name: 'Salesforce AMM'})
MATCH (dim)<-[:REQUIRED_AT]-(ctl:Control)-[:SATISFIED_BY]->(ev:Evidence)-[:FROM_SOURCE]->(s:Source)
WHERE d = $deployment
RETURN dim.name, ctl.name, ctl.standard_ref, ev.description, ev.evidence_grade, s.url
```

Company profile across all five frameworks:

```cypher
MATCH (c:Company {name: $company})-[:HAS_DEPLOYMENT]->(d:Deployment)-[:RATED]->(dim:Dimension)-[:PART_OF]->(f:Framework)
RETURN f.name, dim.name, avg(r.rank) AS avg_level, count(d) AS deployments
ORDER BY f.name, dim.name
```

Find capability/governance mismatch (the high-risk quadrant):

```cypher
MATCH (c:Company)-[:HAS_DEPLOYMENT]->(d:Deployment)-[:RATED]->(capDim)-[:PART_OF]->(sf:Framework {name: 'Salesforce AMM'})
MATCH (c)-[:ASSESSED_ON]->(governanceLevel:Level)-[:PART_OF]->(aagmm:Framework {name: 'AAGMM'})
WHERE capDim.rank >= 3 AND governanceLevel.rank <= 2
RETURN c.name, d.name, capDim.rank AS capability, governanceLevel.rank AS governance
```

---

## 5. Cross-Framework Level Alignment

Approximate alignment for roll-up analysis (assert as `ALIGNED_WITH` edges with confidence; these are correspondences, not equivalents):

| Rough stage | Salesforce | Microsoft | SEI/Accenture | EAAMM | AAGMM |
|---|---|---|---|---|---|
| Static / assistive | 0 | 100 | Exploratory | L1 | L1 |
| Recommend, human decides | 1 | 200 | Implemented | L2 | L2 |
| Autonomous in one domain | 2 | 300 | Aligned | L3 | L3 |
| Cross-domain orchestration | 3 | 400 | Scaled | L4 | L4 |
| Multi-agent, supervised | 4 | 500 | Future Ready | L5 | L5 |

**Important:** AAGMM (governance) is deliberately treated as *orthogonal* — a company at Salesforce L3 / AAGMM L1 is the signature of high capability with low governance, which EAAMM's gating rule says should not happen (governance required beyond L2). These mismatch cases are the most valuable analysis output.

---

## 6. Analysis Outputs

1. **Per-company profile** — five-axis radar / heatmap (capability, adoption, engineering, autonomy, governance), all cells evidence-linked.
2. **Population benchmark** — optionally compare against MIT CISR's stage distribution (28% / 34% / 31% / 7%) to situate the rated population.
3. **Gap analysis** — `NEXT_LEVEL` traversal shows which controls/evidence are missing to advance a level.
4. **Consistency checks** — cross-framework contradictions (e.g., EAAMM L4 claimed but AAGMM GD-06 Human Oversight at L1) surface either evidence gaps or overclaiming.
5. **Mismatch quadrant** — capability vs. governance scatter, the security-relevant view.

---

## 7. Limitations

- All five are 2025–2026 frameworks in a fast-moving field; expect revisions.
- Two of five are vendor-published (Salesforce, Microsoft) — mitigated by using only their level definitions, not their product claims, and by cross-checking with neutral models (SEI, EAAMM, AAGMM).
- EAAMM and AAGMM are academically grounded but not yet production-validated at scale (AAGMM is simulation-validated only).
- Level alignment across frameworks (section 5) is approximate correspondence, not equivalence — keep it as weighted edges, not hard joins.

## Sources

- [Salesforce — The Agentic Maturity Model](https://www.salesforce.com/news/stories/agentic-maturity-model/?bc=OTH)
- [Microsoft Learn — Agentic AI adoption maturity model](https://learn.microsoft.com/en-us/agents/adoption-maturity-model/)
- [SEI CMU — AI Adoption Maturity Model release](https://www.sei.cmu.edu/news/sei-and-accenture-release-ai-adoption-maturity-model-to-help-organizations-scale-ai-with-predictable-outcomes/)
- [SEI CMU — AI Maturity Model Overview PDF](https://www.sei.cmu.edu/documents/6413/AI-Maturity-Model-Overview.pdf)
- [ICAIMT — EAAMM: Agentic AI in Enterprise Business Processes](https://www.icaimt.com/2026/agentic-ai.html)
- [arXiv — Agentic AI Governance Maturity Model (AAGMM)](https://arxiv.org/html/2604.16338)
- [arXiv — Evidence-Graded Maturity Model for AI Agents](https://arxiv.org/html/2610.18603v1)
- [Gartner — AI Maturity Model toolkit](https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit)
- [MIT CISR — Enterprise AI Maturity](https://cisr.mit.edu/publication/2025_0801_EnterpriseAIMaturityUpdate_WoernerSebastianWeillKaganer)
