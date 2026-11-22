# A .d decision page, with its picture kept for the record: a proposal

By decisions.d@AgentiCCells.dinis, 22 November 2026, written 14:29 UTC, asked by helm.d (circle lead), from Dinis's words in helm.d's session about 14:05 UTC ("you need to present decisions with a decision page ... I need a visualization for those historical purposes"). To agree with studio.d, who draws for the decision agents. A proposal: it extends `board/spec-decisions-pages.md`; it changes no page and no build.

## The page (as the spec, plus four things)

The page stays `content/newsroom/decisions/<slug>.md`, in the spec's seven parts. Four additions to the front matter:

```yaml
questions:                         # one entry per question; a page with one question has one
  - id: purpose                    # stable; an answer and a signed request name it
    question: "..."                # one sentence, as asked
    ask_sha256: "..."              # hash of that sentence, UTF-8, as first published
    reserved: true                 # Dinis's alone (the reserved list), so never default-yes
    recommendation: A
    answer: null                   # Dinis's words, verbatim, when given
    answered_at: null              # UTC
    answered_where: null           # "session <link>" | "Decision Desk" | later "signed request <hash>"
since: 2026-11-22T14:00Z           # e.g.; UTC with the time
storyboard: board/team/<asker>/storyboards/<slug>.storyboard.json
pictures:                          # kept for the record, never overwritten
  asked:   board/team/studio.d/pictures/<slug>/asked.svg     # with its sha256
  decided: board/team/studio.d/pictures/<slug>/decided.svg   # with its sha256
```

## What is drawn

1. **The picture as asked:** the situation and the options side by side, as the asker's storyboard describes them (studio.d's format `studio-storyboard/0`, its `decision` block, with the `ask` fields per question). Frozen when the page is published: a new picture for a changed question, never an edit.
2. **The picture as decided:** the same picture with the chosen option marked, Dinis's words verbatim under it, the time, and where he said it. Made when the answer is recorded.
3. **The connections** (Dinis's "share connect number between", which he confirmed to helm.d about 15:47 UTC meant the connections between decisions and agents): each picture shows which agents asked, reviewed and act on the decision, and which earlier decisions it follows from, by their slugs.

## As built (helm.d, be0d63b2b, 22 November 2026)

The build's front matter takes no nested lists, so a page asks **one question** and carries flat fields: `question_id`, `question`, `ask_sha256`, `reserved`, `recommendation`, `answer`, `answered_at`, `answered_where`, `pictures_asked` (and `pictures_decided` once answered). A page with two questions becomes two pages. helm.d confirmed: the owner copies a Desk answer onto the page verbatim; decisions.d checks it in the log, and checks that `ask_sha256` is the hash of `question` as written (a reworded question shows in the log). This supersedes the `questions:` list above.

## Where it lives

Updated 22 November 2026 after studio.d's answer (14:40 UTC).

| What | Where | Who writes it |
|---|---|---|
| The page | `content/newsroom/decisions/<slug>.md` | the asker (its owner) |
| The storyboard | `board/team/<asker>/storyboards/<slug>.storyboard.json` | the asker |
| The pictures | `board/team/studio.d/pictures/<slug>/asked.svg`, `decided.svg` (studio.d's grant), with a sha256 of each in the page's front matter; copied to `assets/decisions/<slug>/` by the page's owner or dev@ only if a page must serve them | studio.d, drawn from the storyboard |
| The log of every ask and answer | `board/team/decisions.d/log/` | decisions.d, from the pages and status files |

SVG so the picture is text, diffable, signed with the commit, and served as is; a PNG beside it only where a page needs one.

## The order

1. The asker writes the page and the storyboard.
2. studio.d draws "asked" from the storyboard, checks it with its checker, and adds the pictures.
3. Reviewers weigh in on the page (the spec's PT decision order).
4. Dinis answers (session or Desk). The owner copies his words verbatim into `questions[].answer`, with the UTC and where.
5. studio.d draws "decided". decisions.d logs the answer and how long it waited.

## Agreed with studio.d (14:40 UTC)

- Pictures stay in studio.d's folder (its grant is `board/team/studio.d/` only; `assets/` is dev@'s).
- In the storyboard, one entry per question is studio.d's `decisions[]`; its optional `connections` block (`asked_by`, `reviewed_by[]`, `acts[]`, `follows[]`) carries the lines between roles and earlier decisions. Both in studio.d's format README.
- studio.d draws "asked" when a page's storyboard is ready, and "decided" only once Dinis has answered in his own words.

## Open for helm.d

- Whether the Desk's answers are copied onto the page by the owner or by decisions.d (my proposal: the owner, as the spec says; decisions.d checks).
