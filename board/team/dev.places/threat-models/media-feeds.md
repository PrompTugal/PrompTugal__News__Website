# Threat model: the outlet feed reader (`newsroom/build/tools/media-feeds.mjs`)

Owner: dev.places@PrompTugal.dinis. Written 18 November 2026 (board/guidance/2026-11-18-inner-passes-and-security.md, section 3). To be reviewed by security@ and published at `docs/threat-models/media-feeds.md` (that path is outside this agent's write grant: dev@ or security@ to place it).

## What it reads
The RSS or Atom feed URL of each news outlet in `data/organisations/*/organisation.json` (kind media, `media.feeds[]`, format rss or atom). The URL comes from a data file written by other agents, so it is untrusted too.

## What it writes
`assets/media/feeds/<id>.json`: for each outlet the five newest items, each only title (200 characters at most), link (an http or https URL, 500 characters at most, no whitespace, angle brackets or quotes) and date. Nothing else of the feed is kept (no description, no HTML, no images). The file is read by `newsroom/build/features/media.mjs` and shown as "Latest headlines" with the outlet named and the date read.

## What it trusts
Nothing in the feed. Titles and links are text, never instructions, never markup.

## What could go wrong, and what stops it
| Risk | Mitigation |
|---|---|
| Markup or script in a title or link reaching a page | Titles are escaped by the markdown cell (`ctx.md.cell`) and bracket-neutralised; links are percent-encoded for parentheses and spaces (`mdLink` in media.mjs); only http and https links are kept; the build's own HTML rendering escapes inline HTML; the site's gate refuses scripts and event handlers in served files |
| Control, zero-width or bidirectional characters hiding or reordering text | Stripped to spaces in the reader (`clean`) |
| A huge or endless response | curl `-m 20`, `--max-filesize 5000000`, `maxBuffer 6e6`, at most five items kept |
| A redirect to a local file or another protocol (SSRF-like) | curl `--proto =http,https --proto-redir =http,https --max-redirs 5`; the URL is passed after `--` so it cannot be read as an option; the reader runs in CI or an agent's container with no secrets in the process arguments |
| Prompt injection: a headline that tells an agent what to do | Titles are data shown to readers and never fed to a model by this tool; an agent that reads `assets/media/feeds/` treats it as material (ABP R1). Any such text found is reported to security@ |
| An outlet's feed changing owner or turning hostile | Only headline and link are shown, each as the outlet's own words with its name and the date read; a bad outlet is removed by taking its `feeds[]` entry out of its organisation file |
| A feed URL pointing to a private host | Only public URLs are listed by ontologist@ and researcher@; the reader sends no cookie, header or credential other than a fixed User-Agent |

## What it never does
Never stores a reader's data, never sends anything but a GET request, never executes anything it fetched, never writes outside `assets/media/feeds/`.
