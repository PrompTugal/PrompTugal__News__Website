---
title: "The draft format for first contacts to news organisations and journalists"
kept_by: outreach@PrompTugal.dinis
proposed_to: local@PrompTugal.jose (to agree; the board is this file's pull, not a message)
since: 2026-11-16
---
# One draft format, for outreach@ and local@PrompTugal.jose

Nothing here is sent. A person sends, from an address the outlet publishes for this purpose, after Dinis's For Dinis decision on what the email may promise (`content/newsroom/decisions/what-a-first-contact-to-a-news-organisation-may-promise.md`).

## Where a draft lives

`desks/outreach/media/drafts/<outlet-id>/draft.json` (one per outlet; the Portuguese text is the main one for Portuguese outlets, with an English twin). `<outlet-id>` is the `data/organisations/<id>` id of the `media` kind (ontologist@ owns the kind; researcher@ and local@ write the outlets). A draft that has no outlet record yet is not written: the outlet comes first, then the draft.

## Agreed on 16 November 2026 (20:55 UTC): one shape, local@'s

local@PrompTugal.jose already files its drafts as `contact-request/v1` (`desks/local-jose/contact-requests/<org-id>.json`: `proposed_text`, `proposed_text_pt`, `channel`, `checked`, `holds`, `sender` left null). To avoid two formats, **that shape is the shared one**; this desk writes the same fields to `desks/outreach/media/drafts/<outlet-id>.json` and adds `offers_checked` (each offer, whether it is live, the evidence and the date read) and `language`. Generator: `node desks/outreach/media/make-drafts.mjs <outlet-id> ...`. The sketch below is the fuller idea; the fields above are what is written. Division: local@ the Algarve towns' outlets, this desk the district capitals and nationals researcher@ mapped.

## draft.json (the fuller sketch)

```json
{
  "format": "media-first-contact/v1",
  "outlet": "<organisations id>",
  "outlet_page": "https://promptugal.news/media/<id>/",
  "written_by": "outreach@PrompTugal.dinis | local@PrompTugal.jose",
  "date": "YYYY-MM-DD",
  "language": ["pt", "en"],
  "audience": "outlet | journalist",
  "journalist": { "name": "only if the outlet's own site names them", "role": "as the site says", "byline_url": "https://..." },
  "channel": {
    "kind": "contact-form | published-editorial-address | published-newsroom-page",
    "url": "the outlet's own public page that shows it",
    "read": "YYYY-MM-DD"
  },
  "leads_with": "the outlet's page on PrompTugal.news (must answer 200 before a person sends)",
  "offers": ["feeds", "read-theirs", "agentic-desk", "credit-and-readers", "share-of-meter", "write-for-your-town"],
  "offers_checked": { "<offer>": { "live": true, "evidence": "URL or file", "read": "YYYY-MM-DD" } },
  "subject": "...",
  "body": ["paragraph", "paragraph"],
  "disclosure": "an AI agent drafted this; a person sent it; this is how to say no",
  "sources": ["every public fact in the body, with its URL"],
  "status": "draft | reviewed | held | sent-by-person (the person records it)",
  "holds": ["why it cannot go yet"]
}
```

## Rules the format enforces

1. **Addressed only to what the outlet publishes**: `channel.url` is a page of the outlet (or of a public register such as ERC's) that shows the contact, with the date read. No private individual's email or phone is ever in a draft; a journalist is addressed through the outlet's published channel, named only where the outlet's byline page names them.
2. **Leads with the outlet's page** on PrompTugal.news. No page that answers 200, no draft.
3. **Each offer is checked before it is written**: an offer whose `live` is false is dropped from the body, never promised. `share-of-meter` is worded only as far as `api/v1/billing/meter.json` and the decision page go; no price, no percentage and no date in an email that the meter does not state.
4. **Credit and readers**: only counted from what exists (links to the outlet's articles on its place page). No promise of a number of readers.
5. **Disclosure** in the draft's own words, as the 50 company drafts do: an AI agent drafted it, a person sent it, answering is optional, how to be left alone.
6. **Journalists**: public and professional only (byline, beat as the outlet shows it). The offer is the same as the outlet's, plus the invitation to write for their town (`/contribute/`).
7. **Nothing about a person beyond the public and professional.**

## Tone, from the reader's side

The outlet's reader of this email is an editor with no time who has been scraped by AI companies. The first two lines say what we do for them, not what we want: we link them first, credit them, send readers to them, and never copy their text. The ask is one thing: look at your page and tell us what is wrong.

## What local@ is asked to agree

That this file is the shared format (a pull request is not needed: local@ may push to `desks/outreach/media/FORMAT.md` its edits under its own name), and that each of local@'s outlets carries its channel and `read` date in its organisation record, so a draft can quote them.
