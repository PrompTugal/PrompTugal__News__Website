# Notebooks catalogue: index and hand-over

c.notebooks (account C), 28 November 2026. Phase one of the plan (`../2026-11-28-plan.md`), at Dinis's word relayed by c.maestro (about 14:30 UTC): understand what is in github.com/DinisCruz/NotebookLM__Infographics-and-slides, read only, in small chunks. No images generated, no pull request to his repository, no site.

## Done: the whole collection, in six chunks

| Chunk | File | Period | Items |
|---|---|---|---|
| 6 | `2025-12-to-2026-01-older.md` | 15 Dec 2025 to 28 Jan 2026 (by topic, LinkedIn folders, collaborator) | 86 |
| 1 | `2026-01.md` | 29 to 31 Jan 2026 | 19 |
| 2 | `2026-02a.md` | 1 to 10 Feb | 60 |
| 3 | `2026-02b.md` | 11 to 20 Feb | 82 |
| 4 | `2026-02c.md` | 21 to 28 Feb | 28 |
| 5 | `2026-03.md` | 1 to 27 Mar | 56 |

About 330 items in all (the plan's 245 dated plus 86 older; a few folders hold several items), at commit be876c9 (28 March 2026).

## The arc, in one paragraph

December 2025 to January 2026: methods and libraries (osbot-utils, Type_Safe, IFD, Pass-Driven Development, MGraph-AI), essays on GenAI development, the semantic web and data capture. Late January: commissioned deep research turned into infographics, and the repository designing its own ontology. Early February: Issues-FS and "thinking in graphs", and the first agent roles (Librarian, Conductor, Cartographer, Historian, Journalist). Mid February: SG/Send built and shipped by an agentic team of about twenty roles, incidents handled in public, Explorers and Villagers. Late February: trust, PKI, data rooms, AI as the sender, The Cyber Boardroom reactivated. March: first paying customers, the vault as a message plane (the road to SGit), and a run of first-person essays on working with agents.

## The ten stories I would tell first

1. Where this team's roles came from (5 to 20 Feb 2026).
2. An AI team ships SG/Send in a week (12 to 20 Feb).
3. Treat every incident like a crisis: the P3-as-P1 series and INC-001 to 004.
4. Thinking in graphs: seventeen linked documents in two days.
5. The repository that designed its own ontology (31 Jan).
6. The vault becomes the message plane (10 to 17 Mar).
7. The March essays: two altitudes, trust is a spectrum, who reads the code.
8. The Algarve weather campaign (14 Jan), ten months before Algarve Evolution here.
9. The Cyber Boardroom reactivated (27 Feb).
10. Naming SG/Send (8 to 16 Feb).

## What is not done (next session)

- No image has been looked at: "strongest infographics" are chosen from titles and story. Next: view the 30 or so named ones (one download each, small JPGs) and confirm.
- Links back are counted and dated per item but not yet written out as a list of URLs; they are in the `.webloc` files, ready to extract into the graph (phase 1 of the plan).
- Sub-folders inside some items (content filtering, the Grafter, sg-vault, Stackguard, Wikipedia of careers) were counted, not read.
- Names of private people in his files (a beta tester, a collaborator, an investor group) are left out on purpose.

## Where things are

The clone is a blobless shallow clone in this session's scratchpad (`clones/nb`, with `tree.txt` listing all 2,038 paths and `dump.py`, the per-chunk summariser). A new session recreates it with: `GIT_LFS_SKIP_SMUDGE=1 git clone --filter=blob:none --no-checkout --depth 1 https://github.com/DinisCruz/notebooklm__infographics-and-slides nb`, then `git checkout HEAD -- <paths>` for only the Markdown and `.webloc` files it needs. A plain clone stalls (the repository is about 6 GB).
