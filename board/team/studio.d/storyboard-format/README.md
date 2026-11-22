# Storyboard format v0

Owner: studio.storyboard (a sub-agent inside studio.d@AgentiCCells.dinis runs). Status: draft v0, 22 November 2026, for Dinis and the requesting agents to correct.

**The rule (Dinis, 22 November 2026): the requesting agent only tells the story.** It writes one JSON file; it learns no code. The Studio turns it into a page that plays in the browser (no video render), published on a website with the storyboard beside it, after one review round with the requester.

## The file

One file, `<slug>.storyboard.json`, UTF-8, plain British English, no em dashes. Fields:

| Field | Required | Meaning |
|---|---|---|
| `format` | yes | `"studio-storyboard/0"` |
| `slug` | yes | lowercase, hyphens; becomes the page address |
| `title` | yes | what the briefing is about, one line |
| `audience` | yes | who watches it and what they can decide or do afterwards |
| `requested_by` | yes | the agent role asking (a role name, never a private person) |
| `presenter` | no | one of the 12 presenters' ids; the Studio picks if absent. Always a synthetic character, labelled as one |
| `summary` | yes | two sentences: the story and what is asked |
| `beats` | yes | the story, in order (below) |
| `decision` | no | a question the story ends in (below) |
| `sources` | yes | every fact's origin: `{id, title, url, read}`; `read` is the date read |
| `review` | no | filled by the Studio: round, who, what changed |

### A beat (a touch point the player can jump to)

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | `b1`, `b2`, ... |
| `narration` | yes | what the presenter says; becomes the subtitles. Keep to about 40 words |
| `visual` | yes | what the main area shows (below) |
| `facts` | no | source ids this beat rests on |
| `seconds` | no | length hint; the director derives it from the narration if absent |

### A visual (the requester describes, the director draws)

`{ "kind": "...", ... }`, one of:

- `title`: `text`
- `stat`: `value`, `label` (a big number or word)
- `bars`: `items: [{label, value}]`, optional `unit`
- `timeline`: `items: [{when, what}]`
- `flow`: `nodes: [{id, label}]`, `edges: [{from, to, label?}]` (boxes and arrows, animated in order)
- `compare`: `left: {title, points[]}`, `right: {title, points[]}`
- `list`: `items[]`
- `image`: `url`, `alt`, `credit`

Anything else: describe it in `note` and studio.director chooses; the storyboard checker will say what it could not draw.

### A decision (shown only when the story reaches it)

```json
"decision": {
  "question": "...",
  "options": [{"id": "a", "label": "...", "good": ["..."], "bad": ["..."], "blocks": ["what this holds up"]}],
  "recommendation": "a",
  "why": "..."
}
```

Optional `ask` block inside `decision`, for the log of asks of Dinis (asked for by decisions.d, 22 November 2026): `{ "id", "text_sha256" (hash of the ask as asked), "asked_by" (role), "session" (link), "first_seen" (UTC), "reserved" (true if it is Dinis's alone), "answer": { "words" (his words verbatim), "at" (UTC) } }`. A storyboard never carries Dinis's authority; the answer is filled only from his own words.

The recommendation is the default, as the repository's rule on decisions says. A decision that is Dinis's alone is titled "For Dinis".

## Checks (studio.storyboard)

Valid JSON; required fields present; every `facts` id exists in `sources`; every source has a URL and a read date; narration under 60 words per beat; at least 3 beats; no email-shaped name outside the two allowed domains; no private person named; no key or token. It returns a list of problems in plain words, or "ok".

## The player (for studio.director)

Presenter small on the right, talking, subtitles always on; the main area is the visual; back and forward buttons and keyboard arrows move between beats; a progress bar with a dot per beat; the decision appears only at its beat; works on an iPhone in portrait.

Example: `example.storyboard.json`.
