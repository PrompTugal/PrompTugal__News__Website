#!/usr/bin/env node
/* browser.check.cjs: search, the tool API and the chat pane in Chromium, on the built site, from a local server.
 *
 *   node admin/build/build.mjs && node admin/tests/browser.check.cjs [--dropin]
 *
 * Opens a company page with the clock set to the summit (?now=2026-11-10T11:52Z), checks window.__tool, the "/" key
 * and the instant dropdown, the /search/ page with facets and ?q=, then the chat pane: without a key (the tool console
 * runs search and now by hand), and with a key against a MOCKED openrouter.ai (Playwright answers the request; nothing
 * leaves the machine). Screenshots at 390 and 1280 go to design/shots/feature-search-*.png and feature-chat-*.png.
 * --dropin swaps in the designer's stylesheet (design/site.css) and writes the shots with -dropin in their names.
 * Uses the Playwright already installed (require('playwright')); installs nothing.
 */
'use strict'
const http = require('http')
const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..', '..')
const SHOTS = path.join(ROOT, 'design', 'shots')
const DROPIN = process.argv.includes('--dropin')
const tag = DROPIN ? '-dropin' : ''
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.md': 'text/markdown', '.txt': 'text/plain' }
const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (p.endsWith('/')) p += 'index.html'
    if (DROPIN && p === '/assets/site.css') { res.writeHead(200, { 'content-type': 'text/css' }); res.end('@import url(/design/site.css);'); return }
    const f = path.join(ROOT, p)
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' })
    res.end(fs.readFileSync(f))
})

// what the mocked openrouter.ai says: first two tool calls, then an answer that cites
function sse(events) { return events.map(e => `data: ${JSON.stringify(e)}\n\n`).join('') + 'data: [DONE]\n\n' }
function mockAnswers() {
    let n = 0
    const bodies = []
    const handler = async route => {
        const req = route.request()
        bodies.push({ url: req.url(), auth: req.headers()['authorization'], body: JSON.parse(req.postData() || '{}') })
        n++
        let text
        if (n === 1) text = sse([
            { choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'c1', type: 'function', function: { name: 'now', arguments: '{}' } }] } }] },
            { choices: [{ index: 0, delta: { tool_calls: [{ index: 1, id: 'c2', type: 'function', function: { name: 'agenda', arguments: '{"date":"today","organiser":"web-summit","limit":6}' } }] } }] },
            { choices: [{ index: 0, delta: {}, finish_reason: 'tool_calls' }], usage: { total_tokens: 1800 } },
        ])
        else {
            const tools = bodies[bodies.length - 1].body.messages.filter(m => m.role === 'tool').map(m => JSON.parse(m.content))
            const ag = tools.find(t => t.items) || { items: [] }
            const on = (tools.find(t => t.on_now) || { on_now: [] }).on_now
            const lines = ag.items.slice(0, 4).map(i => `- ${i.start || '?'} [${i.title}](${i.url})${i.where ? ', ' + i.where : ''}`).join('\n')
            const answer = `It is Tuesday 10 November, day 2 of the summit, 11:52 in Lisbon.${on.length ? ` On now: [${on[0].title}](${on[0].url}).` : ''}\n\nFrom Web Summit's programme today:\n${lines}\n\nSources: this newsroom's agenda, from Web Summit's schedule as read on 4 November.`
            text = sse([...answer.match(/.{1,12}/gs).map(p => ({ choices: [{ index: 0, delta: { content: p } }] })), { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { total_tokens: 2400 } }])
        }
        await route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: text })
    }
    return { handler, bodies }
}

;(async () => {
    const { chromium } = require('playwright')
    await new Promise(r => server.listen(0, '127.0.0.1', r))
    const B = `http://127.0.0.1:${server.address().port}/`
    const browser = await chromium.launch()
    const hosts = new Set(), errors = []
    const watch = p => {
        p.on('pageerror', e => errors.push(e.message))
        p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errors.push(m.text()) })
        p.on('request', q => hosts.add(new URL(q.url()).host))
    }
    try {
        // ------------------------------------------------------------ desktop: tools, "/" and the dropdown
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
        const pg = await ctx.newPage(); watch(pg)
        await pg.goto(B + 'companies/replit/index.html?now=2026-11-10T11:52Z', { waitUntil: 'networkidle' })
        const names = await pg.evaluate(() => window.__tool.list().map(t => `${t.name}:${t.level}`))
        check(['search:read', 'get_entity:read', 'list_entities:read', 'now:read', 'agenda:read', 'neighbours:read', 'get_page:read', 'open:view', 'highlight:view'].every(n => names.includes(n)), `window.__tool lists the tools: ${names.join(', ')}`)
        const late = await pg.evaluate(async () => { window.__toolQueue.push(['register', 'graph.ping', { level: 'read', description: 'test', run: async () => 'pong' }]); return window.__tool.call('graph__ping', {}) })
        check(late === 'pong', 'a tool pushed to the queue after load registers at once, and answers by its wire name')
        const pageInfo = await pg.evaluate(() => window.__tool.call('get_page', {}))
        const hl = await pg.evaluate(() => window.__tool.call('highlight', { target: 'Where this comes from' }))
        check(pageInfo.title === 'Replit' && pageInfo.headings.length > 3 && hl.found >= 1 && await pg.locator('mark.nr-hl').count() >= 1, `get_page reads this page (${pageInfo.title}, ${pageInfo.headings.length} headings); highlight marks text (${hl.found})`)
        await pg.evaluate(() => window.__tool.call('highlight', { clear: true }))
        check(await pg.locator('#nr-tools .nr-search-btn').count() === 1 && await pg.locator('#nr-tools .nr-ask').count() === 1, 'the top bar has the Search and Ask buttons (mount point made, as the shell has none yet)')
        await pg.keyboard.press('/')
        await pg.keyboard.type('rep')
        await pg.waitForSelector('.nr-search-float .sp-item', { timeout: 10000 })
        const first = await pg.locator('.nr-search-float .sp-item[aria-selected="true"] .t1').textContent()
        check(/Replit/.test(first), `"/" opens search; "rep" suggests Replit first (${first})`)
        await pg.screenshot({ path: path.join(SHOTS, `feature-search-instant-1280${tag}.png`) })
        await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Escape')
        check(await pg.locator('.nr-search-float .search-pop').isHidden(), 'Escape closes the dropdown')
        // ------------------------------------------------------------ the search page
        await pg.goto(B + 'search/index.html?q=security', { waitUntil: 'networkidle' })
        await pg.waitForFunction(() => document.getElementById('nr-search-page').dataset.ready === 'full', null, { timeout: 15000 })
        const total = Number(await pg.getAttribute('#nr-search-page', 'data-total'))
        check(total > 20 && await pg.locator('#nr-results li.res').count() > 5, `/search/?q=security: ${total} results`)
        await pg.click('#nr-facets button.chip[data-k="type"][data-v="company"]')
        await pg.waitForTimeout(300)
        const kinds = await pg.$$eval('#nr-results .r-kind', els => els.map(e => e.textContent))
        check(kinds.length > 0 && kinds.every(k => k.startsWith('Company')) && /type=company/.test(pg.url()), 'the Companies facet keeps only companies, and is in the address')
        const status = await pg.textContent('#nr-search-status')
        check(/KB, from this site only/.test(status), `the page says what it loaded: ${status}`)
        await pg.screenshot({ path: path.join(SHOTS, `feature-search-1280${tag}.png`), fullPage: false })
        // ------------------------------------------------------------ the chat, without a key: the console
        await pg.goto(B + 'companies/replit/index.html?now=2026-11-10T11:52Z', { waitUntil: 'networkidle' })
        await pg.click('#nr-tools .nr-ask')
        await pg.waitForSelector('#chat:not([hidden])', { timeout: 10000 })
        check(await pg.evaluate(() => document.body.classList.contains('chat-open')), 'Ask opens the pane (body.chat-open)')
        check(/OpenRouter key/.test(await pg.textContent('#chat .chat-log')), 'without a key the pane says what is needed')
        await pg.click('#chat .nr-console summary')
        await pg.selectOption('#nr-console-tool', 'search')
        await pg.fill('#nr-console-args', '{"query":"Michele Catasta"}')
        await pg.click('#chat [data-act="run"]')
        await pg.waitForSelector('#chat .call:not(.running) .out', { timeout: 10000 })
        await pg.selectOption('#nr-console-tool', 'now')
        await pg.fill('#nr-console-args', '{}')
        await pg.click('#chat [data-act="run"]')
        await pg.waitForFunction(() => document.querySelectorAll('#chat .call:not(.running)').length >= 2, null, { timeout: 10000 })
        const outs = await pg.$$eval('#chat .call', els => els.map(e => e.querySelector('code').textContent + ' -> ' + e.querySelector('.out').textContent))
        check(outs.length === 2 && /search/.test(outs[0]) && /result/.test(outs[0]) && /now\(\) -> 11:52 Lisbon/.test(outs[1]), `the console runs search and now by hand: ${outs.join(' | ')}`)
        await pg.screenshot({ path: path.join(SHOTS, `feature-chat-console-1280${tag}.png`) })
        // ------------------------------------------------------------ the chat, with a key, against a mocked openrouter.ai
        const mock = mockAnswers()
        await ctx.route('https://openrouter.ai/**', mock.handler)
        await pg.evaluate(() => window.__toolQueue.push(['register', 'graph.ping', { level: 'read', description: 'a tool registered after the chat opened', run: async () => 'pong' }]))
        await pg.click('#chat [data-act="settings"]')
        await pg.fill('#nr-chat-keyin', 'mock-key-for-the-browser-check')
        await pg.click('#chat [data-act="savekey"]')
        await pg.fill('#nr-chat-q', 'What is happening today?')
        await pg.press('#nr-chat-q', 'Enter')
        await pg.waitForFunction(() => /Sources:/.test((document.querySelector('#chat .msg.bot:last-of-type') || {}).textContent || ''), null, { timeout: 15000 })
        const chatCalls = await pg.$$eval('#chat .call', els => els.map(e => e.querySelector('code').textContent))
        check(mock.bodies.length === 2 && mock.bodies[0].auth === 'Bearer mock-key-for-the-browser-check' && mock.bodies[0].body.model === 'anthropic/claude-sonnet-5', 'two requests went to (the mocked) openrouter.ai, the key in the Authorization header, the default model')
        check(mock.bodies[0].body.tools.some(t => t.function.name === 'graph__ping') && mock.bodies[0].body.tools.some(t => t.function.name === 'open') && !mock.bodies[0].body.tools.some(t => /^author/.test(t.function.description)), 'the model is offered every registered tool at the allowed levels (read and view), including one registered late')
        check(chatCalls.some(c => c.startsWith('now(')) && chatCalls.some(c => c.startsWith('agenda(')), `each tool call shows in the log: ${chatCalls.join(', ')}`)
        const answer = await pg.textContent('#chat .msg.bot:last-of-type')
        check(/day 2 of the summit/.test(answer) && await pg.locator('#chat .msg.bot:last-of-type a').count() >= 2, 'the answer streams in, with links to the pages it used')
        const stored = await pg.evaluate(() => JSON.stringify({ s: sessionStorage.getItem('nr-chat:conversation'), c: window.__nrChat.getConversation(), log: window.__tool.log() }))
        check(!stored.includes('mock-key-for-the-browser-check'), 'the key is not in the conversation, the session store or the tool log')
        check(await pg.evaluate(() => window.__nrChat.getConversation().messages.length) === 5, 'the conversation (user, tool calls, results, answer) is kept for the session, for a vault hook')
        await pg.evaluate(() => { const l = document.querySelector('#chat .chat-log'), u = [...l.querySelectorAll('.msg.user')].pop(); if (u) l.scrollTop = u.offsetTop - l.offsetTop - 8 })
        await pg.screenshot({ path: path.join(SHOTS, `feature-chat-1280${tag}.png`) })
        await pg.click('#chat [data-act="settings"]')
        await pg.click('#chat [data-act="forget"]')
        check(await pg.evaluate(() => localStorage.getItem('nr-chat:key')) === null, 'Forget key removes it from localStorage')
        await pg.click('#chat [data-act="settings"]')
        // ------------------------------------------------------------ phone
        const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
        await ph.route('https://openrouter.ai/**', mockAnswers().handler)
        const pp = await ph.newPage(); watch(pp)
        await pp.goto(B + 'search/index.html?q=centre%20stage&type=event&day=2026-11-10', { waitUntil: 'networkidle' })
        await pp.waitForFunction(() => document.getElementById('nr-search-page').dataset.ready === 'full', null, { timeout: 15000 })
        check(await pp.evaluate(() => document.documentElement.scrollWidth) <= 390, 'search page at 390: nothing scrolls sideways')
        await pp.screenshot({ path: path.join(SHOTS, `feature-search-390${tag}.png`) })
        await pp.goto(B + 'index.html?now=2026-11-10T11:52Z', { waitUntil: 'networkidle' })
        await pp.click('#nr-tools .nr-search-btn')
        await pp.keyboard.type('joao')
        await pp.waitForSelector('.nr-search-float .sp-item', { timeout: 10000 })
        check(/João/.test(await pp.textContent('.nr-search-float .search-pop')), '"joao" finds João on a phone')
        await pp.screenshot({ path: path.join(SHOTS, `feature-search-instant-390${tag}.png`) })
        await pp.keyboard.press('Escape'); await pp.keyboard.press('Escape')
        await pp.goto(B + 'companies/replit/index.html?now=2026-11-10T11:52Z', { waitUntil: 'networkidle' })
        check(await pp.locator('.ask-fab').isVisible(), 'the floating Ask button shows on a phone')
        await pp.click('.ask-fab')
        await pp.waitForSelector('#chat:not([hidden])')
        await pp.evaluate(() => localStorage.setItem('nr-chat:key', 'mock-key-phone'))
        await pp.evaluate(() => window.NRChat.ask('What is happening today?'))
        await pp.waitForFunction(() => /Sources:/.test((document.querySelector('#chat .msg.bot:last-of-type') || {}).textContent || ''), null, { timeout: 15000 })
        const box = await pp.locator('#chat').boundingBox()
        check(box && box.width >= 388 && await pp.evaluate(() => document.documentElement.scrollWidth) <= 390, 'the pane is a full-screen sheet at 390, with no sideways scroll')
        await pp.evaluate(() => { const l = document.querySelector('#chat .chat-log'), u = [...l.querySelectorAll('.msg.user')].pop(); if (u) l.scrollTop = u.offsetTop - l.offsetTop - 8 })
        await pp.screenshot({ path: path.join(SHOTS, `feature-chat-390${tag}.png`) })
        // the conversation survives a page change in the same tab, and the pane reopens
        await pp.goto(B + 'topics/security/index.html', { waitUntil: 'networkidle' })
        await pp.waitForSelector('#chat:not([hidden]) .msg.user', { timeout: 10000 })
        check(true, 'after opening another page the pane reopens with the conversation')
        const others = [...hosts].filter(h => !h.startsWith('127.0.0.1'))
        check(others.every(h => h === 'openrouter.ai'), `no request left for any host but (the mocked) openrouter.ai${others.length ? ': ' + others.join(', ') : ''}`)
        check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`)
    } catch (e) {
        failed++
        console.log('FAIL ' + e.stack)
    } finally {
        await browser.close()
        server.close()
    }
    console.log(failed ? `${failed} FAILED` : 'ALL BROWSER CHECKS PASS')
    process.exit(failed ? 1 : 0)
})()
