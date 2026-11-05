# The page tool API: `window.__tool`

Every page of the newsroom publishes its commands on `window.__tool`, for the chat ("Ask the newsroom"), for an agent driving a browser, and for the reader's own console. After graphs.sgit.ai's Tool API Primitive (`v2/universe/skills/SKILL-api.md` there): levels, JSON Schema parameters, every call logged.

| File | What it is |
|---|---|
| `tool-api.js` | the registry: `window.__tool`, the queue, the log. Also `require()`-able in Node (`createToolApi()`, `install(root)`) |
| `site.js` | `window.NRSite`: the site root from the script's own address, `url(rel)`, `local(canonicalUrl)`, `fetchJSON(rel)` (cached), `mount(id)` (`#nr-tools`, `#nr-pane`, `#nr-live`: the designer's mount point, made if the shell has none), `now()` (`?now=2026-11-10T11:52Z` or `window.__nrNow` simulate a moment) |
| `tools.js` | the core tools, registered through the queue; `makeCoreTools(env)` is pure and runs in Node |
| `core.css` | `.nr-hl` (what `highlight` draws), and a no-specificity fallback of the designer's shared components |

They load on every page, in this order, from `admin/build/features/tools.mjs`. Search adds `search` (`assets/search/`); the chat (`assets/chat/`) consumes the API.

## Registering a tool, from any feature, in any order

```js
(window.__toolQueue = window.__toolQueue || []).push(['register', 'graph.focus', {
    level: 'view',                                   // 'read' (data, no side effects) | 'view' (moves the page) | 'author'
    description: 'Select a node in the graph and centre it.',   // what the model reads: say what it does and returns
    params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },   // JSON Schema
    example: { id: 'company:replit' },               // optional: prefills the chat's "Run a tool by hand"
    run: async (args, ctx) => ({ focused: args.id }), // ctx.via: 'chat' | 'console' | 'page'
}])
```

The queue works before and after `tool-api.js` has run: on load it drains what is there, then replaces the queue's `push`, so a later push registers at once. Nothing waits on load order. `['unregister', name]` removes a tool. The chat reads the list at every request, so a tool registered at any time is offered to the model from the next question on.

Names are lower case words joined by `_` or `.` (`graph.focus`). OpenAI-style tool names cannot hold a dot, so `schemas()` sends `graph__focus` to the model and `call()` accepts either.

## Using it

```js
__tool.list({ levels: ['read'] })            // [{ name, level, description, params, example, owner }]
await __tool.call('search', { query: 'replit' }, { via: 'page', levels: ['read', 'view'] })   // checks level and arguments, then runs
__tool.log()                                 // [{ id, at, name, level, args, via, ok, ms, result (400 chars) | error }], last 500
__tool.schemas({ levels: ['read', 'view'] }) // [{ type: 'function', function: { name, description, parameters } }] for OpenRouter
__tool.on(ev => ...)                         // { type: 'register' | 'unregister' | 'call' | 'result', ... }; returns off()
```

Also `tool:ready` and `tool:registered` events on `window`, and graphs.sgit.ai's names (`get_tool_schemas`, `get_levels`, `meta.getLog`).

## The tools

| Tool | Level | Arguments | Returns (compact) |
|---|---|---|---|
| `search` | read | `query`, `type?`, `topic?`, `country?`, `organiser?`, `day?`, `limit?` | `{ total, results: [{ ref, type, title, summary, url, when?, where? }], facets }` |
| `get_entity` | read | `type`, `id` (or `type: 'company:replit'`) | `{ ref, label, url, api, data, links_out, links_in }`, internal fields dropped, arrays cut at 12 |
| `list_entities` | read | `type`, `topic?`, `country?`, `organiser?`, `day?`, `limit?` | `{ total, items: [{ ref, label, summary, url }] }` |
| `now` | read | none | `{ now, lisbon_time, date, day, summit: { status, days_to_go? }, on_now, next }` |
| `agenda` | read | `date?` (YYYY-MM-DD, today, tomorrow, a weekday), `organiser?`, `kind?`, `topic?`, `our_picks?`, `limit?` | `{ date, day, total, items: [{ ref, title, start, end, where, kind, organiser, our_pick, url, status? }] }` |
| `neighbours` | read | `type`, `id`, `verb?`, `limit?` | `{ focus, total, by_verb, items: [{ verb, direction, ref, type, label, url }] }` |
| `get_page` | read | `max_chars?` | `{ url, title, type, date, headings, text }` |
| `open` | view | `target` (a ref, a path, a url of this site, `#anchor`) | from the chat, the page opens when the answer is finished and the chat reopens there |
| `highlight` | view | `target` (a CSS selector or text), `clear?` | `{ found }` |

Lisbon is on UTC in November, so the summit's times are UTC times. The data comes from `/api/v1/` and the search index (`/api/v1/search/docs.json`), fetched from this site only.
