# The outreach outbox: personalised emails through a vault, approved by Dinis, sent from Gmail

At Dinis's word, 16 November 2026, about 21:55 UTC, in the conductor's session: test drive the CRM and the email cell on
PrompTugal.news's outreach. Tell the newsrooms, organisations and people we know about PrompTugal.news with emails that look
good (screenshots, images), each personalised like a small version of that organisation's page: what we found about them,
the sources, and the invitation (use our sources and data, give us ideas, get involved). Internal tests first, then a few
people outside, then a batch; later, automation for what Dinis signs off.

## The pieces

| Piece | Who | Where |
|---|---|---|
| The outbox vault `promptugal-outreach` (vault id `co57gzld`, dev.send.sgraph.ai) | conductor@ made it; outreach@ writes the drafts | `README.md`, `workflow.json`, `outbox/<NNNN>-<slug>/` |
| A message: `meta.json` (status, from, to, subject, contact source and date read, inline images), `email.html`, `email.md` (plain twin), `img/` | outreach@ (and its writers) | the vault |
| Approval: `status: approved`, `approved_by`, `approved_at` | Dinis | the vault (browser or CRM app) |
| Sending: Gmail in the browser, send-as the RiskMandate agent mailbox, only `approved`, images inlined as CID; writes back `sent_at`, `message_id`, `thread_id` | cell.email (AgentiCCells)'s page | email-cell.agenticcells.site |
| Replies: the mailbox twin links them by `thread_id`; the CRM shows the interaction | cell.email's sync, crm.ios | the twin vault, the CRM app |

## The keys

- The vault key never travels in clear text in a session message, a commit or a page (the classifier refuses it, and
  CLAUDE.md forbids it). It is sealed to the recipient's public key.
- Dinis: sealed to his pki.sgit.ai key (dinis.cruz, record sha256:db7f79fdd87e030a) as a pki.sgit.ai/m/ link and QR, given in his session; and sealed to his site person key at `board/team/conductor/sealed/promptugal-outreach-dinis.json` (ws-ecies-1), and given
  to him in his own session as a QR code.
- cell.email@: sealed to its public key once it publishes one (its own `sgit pki export` bundle or a ws-ecies-1 key).
- outreach@ (account B): sealed to its key in `board/keys.json` once Dinis says the outbox moves to it.

## The rules for the content

- Contacts only as published on a public website (above all an official one), with the page and the date read in `meta.json`.
- Facts only from the site's own sourced pages, each linked. No claim for RiskMandate beyond riskmandate.ai.
- Every email opens like a normal text email (greeting, a few plain paragraphs, sign-off), which reads well in previews; the designed HTML part (screenshots, headings, button) comes after (Dinis, 16 November 2026, from the RiskMandate agent mailbox's sends).
- Every email says it was written by an AI agent for Dinis Cruz. No em-dashes.
- Nothing is sent that is not `approved`. Later automation (rules Dinis signs) is a decision page first.

## Order

1. `0001-test-dinis`: to Dinis, from the RiskMandate agent mailbox (in the vault now, awaiting approval).
2. Two or three internal tests (the team), then three to five people Dinis names outside.
3. The batch: one draft per organisation from the site's own pages (the towns' AI maps, the companies), by outreach@.
