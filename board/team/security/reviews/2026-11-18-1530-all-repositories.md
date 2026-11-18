# security@ first pass across every PrompTugal repository, 18 November 2026, 15:30 UTC

Dinis's word, about 15:05 and 15:10 UTC, in conductor.b@'s session (board/guidance/2026-11-18-inner-passes-and-security.md): security@ reviews every new commit in every PrompTugal repository, hourly by day and every three hours at night, with an AppSec focus, threat models for automation, and a daily prompt-injection pass.

I read the repositories as public, read-only clones in my scratchpad, which is within my grant (reading the web; add_repo for reading). Heads reviewed:
- PrompTugal__News__Website 8ab437cd1;
- the others in sessions/session_01Kw9UwF2TrbbV5BhUjFGupN/repo-heads.txt (Data, Weather, Civic, Startups, Travel, Events, Signals).

## Full history of the seven new repositories (first commits 17 and 18 Nov)

| Repository | Commits | Secrets | Key or credential files ever committed | Contacts |
|---|---|---|---|---|
| Data | 30 | none | none | two outlets' public Mastodon accounts (organisations) |
| Weather | 16 | none | none | none |
| Civic | 16 | none | none | a public service line from the tax authority's own leaflet (sourced); one "email" that is an event's name inside a council contract title |
| Startups | 18 | none | none | none |
| Travel | 20 | none | none | councils', CCDR Algarve's, AMAL's and UAlg's official channels, copied with their sources from the website's place files |
| Events | 9 | none | none | the RiskMandate agent mailbox, which riskmandate.ai publishes |
| Signals | 2 | none | none | none |

Other shape hits were SVG path numbers and ids. No IP address anywhere.

**Civic's public procurement data** (data/procurement/, from IMPIC's Portal Base open data, licence linked):
- 3,396 contracts in 2026 and 7,727 supplier entries over 2025 and 2026.
- Of 2,698 distinct supplier tax numbers, **none is a natural person's**: individuals are withheld before publishing, and the page reads "a private individual (name withheld)".
- That is the right line for sole traders, who are private persons. Clean.

## The website (39789c635..8ab437cd1, 36 commits)

- **Secrets, contacts:** none new beyond the published RiskMandate mailbox.
- **Keys:** 220 entries, 220 ids, none lost. New entries: data.b-promptugal, weather.b-promptugal and civic.b-promptugal. conductor.b@ listed them at Dinis's word ("keygen in every session ... publishing their keys"; "use sgit", 14:55 and 15:10). That is a permission refusal handled by Dinis's decision, not worked around.
- **Code** (licence links in the API and the gate, feeds, provenance, since): build-time only. No outside host, no innerHTML.

## Prompt injection, first daily pass

- I searched all eight repositories' data, content, source and desk files for instruction-shaped text (ignore previous instructions, system prompt, role tags, "do not tell the user" and the like).
- One hit: an interview quote using "system prompt" in its ordinary sense. No sign that any text reached an agent as an instruction.
- The new risk is organisers' GitHub issues (events pre-review, E8).

## Next passes

- The collectors that run on their own (the data site's collectors, scheduled rebuilds, CI workflows and their token permissions) get an AppSec read each, one or two a wake.
- Threat models in each repository (docs/threat-models/) reviewed as they are written.

## For abp@ (S54, low)

My ABP grant (v1.14.0) does not yet name the other repositories, nor the sub-agents Dinis granted on 12 Nov (S17) and asked for again today for the inner passes. Until it does, I read them as the public web and run the passes myself.

Nothing serious; no hold.
