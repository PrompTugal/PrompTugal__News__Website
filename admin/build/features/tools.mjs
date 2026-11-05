// The page tool API: window.__tool on every page (assets/core/tool-api.js), the helpers every interactive feature uses
// (assets/core/site.js) and the core tools (assets/core/tools.js): get_entity, list_entities, now, agenda, neighbours,
// get_page (read); open, highlight (view). Features add their own tools through the queue, in any order:
//   (window.__toolQueue = window.__toolQueue || []).push(['register', name, spec])
// The contract: assets/core/README.md and admin/build/README.md ("The page tool API").
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const order = 5
export const assets = { css: ['assets/core/core.css'], js: ['assets/core/tool-api.js', 'assets/core/site.js', 'assets/core/tools.js'] }

export function llms(ctx) {
    return `## The page tool API (for agents in a browser)\n` +
        `Every page publishes its commands on \`window.__tool\` (assets/core/tool-api.js; contract in ${ctx.REPO}/blob/dev/assets/core/README.md). \`__tool.list()\` names them with their level and JSON Schema; \`await __tool.call(name, args)\` runs one; \`__tool.log()\` is the interaction log; \`__tool.schemas({levels: ['read']})\` gives OpenAI-style tool definitions. Levels: read (data, no side effects), view (moves the reader's page: open, highlight), author (none yet).\n` +
        `- read: search {query, type?, topic?, country?, organiser?, day?, limit?}; get_entity {type, id}; list_entities {type, topic?, country?, organiser?, day?}; now {}; agenda {date?, organiser?, kind?, topic?, our_picks?}; neighbours {type, id, verb?}; get_page {}\n` +
        `- view: open {target}; highlight {target, clear?}\n` +
        `- Other features add theirs (graph.* from the graph explorer) through the queue \`(window.__toolQueue = window.__toolQueue || []).push(['register', name, spec])\`.\n` +
        `- Times are Lisbon time, which is UTC in November. Results are compact: refs (type:id), labels, a few fields, and the page and API addresses.\n\n`
}

export function validate() {
    const out = []
    // the queue contract: what is pushed before the registry loads is registered when it loads, and after it, at once
    const T = require('../../../assets/core/tool-api.js')
    const fake = { __toolQueue: [['register', 'early.one', { level: 'read', description: 'x', run: async () => 1 }]], dispatchEvent() { } }
    T.install(fake)
    fake.__toolQueue.push(['register', 'late_one', { level: 'view', description: 'y', run: async a => a.n * 2, params: { type: 'object', properties: { n: { type: 'number' } }, required: ['n'] } }])
    const names = fake.__tool.list().map(t => t.name)
    if (!names.includes('early.one') || !names.includes('late_one')) out.push(`the queue contract is broken: registered ${names.join(', ')}`)
    if (fake.__tool.schemas()[0].function.name !== 'early__one') out.push('a dotted tool name should go to the model as early__one')
    // the core tools are all there, at their levels
    const C = require('../../../assets/core/tools.js')
    const specs = C.makeCoreTools({ fetchJSON: async () => ({}), now: () => new Date(), page: () => ({}), navigate: () => ({}), highlight: () => ({}) })
    const want = { get_entity: 'read', list_entities: 'read', now: 'read', agenda: 'read', neighbours: 'read', get_page: 'read', open: 'view', highlight: 'view' }
    for (const [n, l] of Object.entries(want)) if (!specs[n] || specs[n].level !== l) out.push(`core tool ${n} is missing or not at level ${l}`)
    return out
}
