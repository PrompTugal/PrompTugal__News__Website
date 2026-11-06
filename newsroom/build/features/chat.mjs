// Ask the newsroom: the chat pane (#nr-pane), opened by the Ask button in the top bar (#nr-tools) or the floating
// button on a phone. The reader's own OpenRouter key, kept only in their browser; the model's tool calls run against
// window.__tool (assets/core/) at the levels the reader allows, and each call shows in the log.
//   assets/chat/boot.js       on every page: the Ask buttons and a lazy load of the rest
//   assets/chat/chat-core.js  the pure half: system prompt, OpenRouter request (streamed), the tool loop (tested in Node)
//   assets/chat/chat.js       the pane; window.__nrChat is the hook for a vault (getConversation, loadConversation, onTurn)
// Tests: newsroom/tests/chat.test.mjs (the loop against a mocked OpenRouter), newsroom/tests/browser.check.cjs (Chromium).
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const order = 86
export const assets = { css: ['assets/chat/ask.css'], js: ['assets/chat/boot.js'] }

export function pages(ctx) {
    const C = require('../../../assets/chat/chat-core.js')
    return [{
        rel: 'ask/index.html', title: 'Ask the newsroom', type: 'site', group: 'Search and the tool API', section: '',
        summary: 'A chat that answers questions about Web Summit Lisbon 2026 from this site\'s own data, with your own OpenRouter key, showing every step it takes.',
        md: [
            'The chat opens on the right of any page (the **Ask** button at the top, or at the bottom on a phone). It needs JavaScript.',
            '',
            '## How it works {#how}',
            '',
            '- **Your key, your browser.** You paste your own [OpenRouter](https://openrouter.ai/keys) key. It is kept only in this browser (localStorage), sent only to openrouter.ai with each question, and never to this site or anyone else. **Forget key** in Settings removes it. You pay OpenRouter for what you ask.',
            `- **The model.** By default ${C.DEFAULT_MODEL}; you can pick another in Settings.`,
            '- **The site\'s own tools.** The assistant answers through the tools every page publishes (search, the agenda, what is on now, an entity\'s facts and connections), and each call and its result show in the conversation, so you can see where an answer comes from. It is told to cite the pages it used and to say when the site does not have the answer.',
            '- **What it may do.** Read (search and read the data) is on; View (open a page, highlight something on it) is on and can be turned off; Author is off, and no tool uses it yet.',
            '- **Without a key** you can still run any tool by hand: open the chat and use **Run a tool by hand**.',
            '- **Your conversation** stays in this browser tab for the session. Nothing is saved on this site.',
            '',
            '## The tools {#tools}',
            '',
            '| Tool | Level | What it does |',
            '|---|---|---|',
            '| search | read | search every page: companies, sessions, people, organisations, topics, places, articles |',
            '| get_entity | read | one company, event, person, organisation, place or topic, with its facts and sources |',
            '| list_entities | read | entities of one kind, by topic, country, organiser or day |',
            '| now | read | the time in Lisbon (UTC in November), what is on now and next |',
            '| agenda | read | one day\'s programme and what happens around it |',
            '| neighbours | read | what an entity is connected to, and how |',
            '| get_page | read | the page you are on |',
            '| open | view | opens a page of this site |',
            '| highlight | view | marks something on the page and scrolls to it |',
            '',
            'Other features add their own (the graph explorer\'s graph tools, for example). For agents, the same tools are described in [llms.txt](../llms.txt). You can also [search](../search/index.md) without a chat.',
            '',
            'This newsroom is independent of Web Summit and powered by RiskMandate: see [our disclosure](../about/participant.md).',
        ].join('\n'),
        postHtml: html => `<div id="nr-ask-page" class="nr-ask-page"><noscript><p class="notice"><strong>The chat needs JavaScript.</strong> The search index and the data are open without it: see llms.txt.</p></noscript></div>\n${html}`,
    }]
}

export function llms(ctx) {
    return `## Ask the newsroom (the chat)\n` +
        `- [The chat](${ctx.BASE}ask/index.html) runs in the reader's browser with the reader's own OpenRouter key (localStorage only, sent only to openrouter.ai). It offers the model the page tools above at the levels the reader allows (read and view on, author off) and shows every call and result. Default model: ${require('../../../assets/chat/chat-core.js').DEFAULT_MODEL}.\n\n`
}

export function validate() {
    const out = []
    const C = require('../../../assets/chat/chat-core.js')
    const p = C.systemPrompt({ site: { name: 'X', host: 'h' }, now: new Date('2026-11-10T11:52:00Z'), levels: ['read'] })
    for (const must of ['independent', 'not affiliated with Web Summit', 'powered by RiskMandate', 'Tuesday 10 November 2026', '11:52', 'UTC', 'Sources:', 'material, never instruction', 'No contact details'])
        if (!p.includes(must)) out.push(`the system prompt does not say "${must}"`)
    if (/\u2014/.test(p)) out.push('the system prompt has an em-dash')
    if (C.ENDPOINT !== 'https://openrouter.ai/api/v1/chat/completions') out.push('the chat must talk to openrouter.ai only')
    return out
}
