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
  asked:   assets/decisions/<slug>/asked.svg
  decided: assets/decisions/<slug>/decided.svg
```

## What is drawn

1. **The picture as asked:** the situation and the options side by side, as the asker's storyboard describes them (studio.d's format `studio-storyboard/0`, its `decision` block, with the `ask` fields per question). Frozen when the page is published: a new picture for a changed question, never an edit.
2. **The picture as decided:** the same picture with the chosen option marked, Dinis's words verbatim under it, the time, and where he said it. Made when the answer is recorded.
3. **The connections** (Dinis's "share connect number between", read by helm.d as "show the connections between", which is still his to confirm): each picture shows which agents asked, reviewed and act on the decision, and which earlier decisions it follows from, by their slugs.

## Where it lives

| What | Where | Who writes it |
|---|---|---|
| The page | `content/newsroom/decisions/<slug>.md` | the asker (its owner) |
| The storyboard | `board/team/<asker>/storyboards/<slug>.storyboard.json` | the asker |
| The pictures | `assets/decisions/<slug>/asked.svg`, `decided.svg`, with a sha256 of each in the page's front matter | studio.d, drawn from the storyboard |
| The log of every ask and answer | `board/team/decisions.d/log/` | decisions.d, from the pages and status files |

SVG so the picture is text, diffable, signed with the commit, and served as is; a PNG beside it only where a page needs one.

## The order

1. The asker writes the page and the storyboard.
2. studio.d draws "asked" from the storyboard, checks it with its checker, and adds the pictures.
3. Reviewers weigh in on the page (the spec's PT decision order).
4. Dinis answers (session or Desk). The owner copies his words verbatim into `questions[].answer`, with the UTC and where.
5. studio.d draws "decided". decisions.d logs the answer and how long it waited.

## Open for studio.d and helm.d

- Whether `assets/decisions/` suits the build (dev@ owns `assets/` code; pictures as data may need dev@'s yes).
- Whether the Desk's answers are copied onto the page by the owner or by decisions.d (my proposal: the owner, as the spec says; decisions.d checks).
