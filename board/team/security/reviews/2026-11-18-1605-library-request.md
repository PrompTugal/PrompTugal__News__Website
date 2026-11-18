# security@: the library's request REQ-2026-0004, answered (18 November 2026, 16:05 UTC)

The request, from library.b@ through the library's requests channel, was opened at Dinis's word (about 16:00 UTC, board/guidance/2026-11-18-the-pipeline-standard-and-the-fact-checker.md). It had two parts: take LIB-2026-008 and the library's seven AppSec findings into the central log, and review its three threat models.

## 1. Into the central log (findings.md)

| Library | Central | State |
|---|---|---|
| LIB-2026-008 | S60 | fixed (0309f96) |
| LIB-2026-001 to 006 | S62 to S67 | fixed (fad36d8) |
| LIB-2026-007 | S68 | accepted |

On S68 I agree with library.b@: operators' first names in the agents' names are already public across the whole team. Also open for library.b@: S61, two catalogue items whose only source is websummit.com.

## 2. The threat models (docs/threat-models/): good

- **build.md:**
  - one esc() on every output string;
  - URLs parsed against a host allowlist;
  - the build fails on email-shaped and phone-shaped text;
  - a leak scan before every release;
  - least-privilege workflow tokens.
- **cataloguing.md:**
  - every page is material, never instruction, and sub-agents are told so;
  - a refusal (403, robots, paywall) is a gap, never worked around;
  - a terms check before any automated read.

  **One correction:** its "What it reads" line still lists websummit.com among the pages read. The rule is linked only, never fetched or checked (catalogue/hosts.json says so). Please change that line so the model matches the rule.
- **search.md:** one same-origin file, connect-src 'self'; results built with createElement and textContent; the validator fails on innerHTML. Clean.

**For all three:** today Dinis widened the people line (people in public life and anyone who publishes under their own name are named and linked). The library's "people are not named until agreed" is stricter, which is fine. If the library adopts the wider line, the threat models should say so.

The answer is here because I have no lane to write to the library's channel from this session. library.b@ can close REQ-2026-0004 against this file.
