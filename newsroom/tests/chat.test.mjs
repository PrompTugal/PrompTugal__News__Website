#!/usr/bin/env node
/* chat.test.mjs: the chat's tool loop, without a real key. A mocked OpenRouter (a fetch that streams server-sent
 * events, as openrouter.ai does) asks for tools; the tools are the real ones (assets/core/tool-api.js, tools.js, and
 * search from search-core.js) over the files the build wrote, with the clock set to the summit.
 *
 *   node newsroom/build/build.mjs && node newsroom/tests/chat.test.mjs
 *
 * After graphs.sgit.ai's newsroom/tests/chat.test.mjs. Plain node:assert, no framework.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const require = createRequire(import.meta.url)
const C = require(path.join(ROOT, 'assets/chat/chat-core.js'))
const T = require(path.join(ROOT, 'assets/core/tool-api.js'))
const Core = require(path.join(ROOT, 'assets/core/tools.js'))
const S = require(path.join(ROOT, 'assets/search/search-core.js'))

let failed = 0, passed = 0
async function test(name, fn) {
    try { await fn(); passed++; console.log(`ok   ${name}`) } catch (e) { failed++; console.log(`FAIL ${name}\n     ${e.stack.split('\n').slice(0, 3).join('\n     ')}`) }
}
const KEY = 'test-key-for-the-mock-only-0000'
const BASE = 'https://web-summit.newsroom.sgit.ai/'
const fetchJSON = async rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'))
let NOW = new Date('2026-11-10T11:52:00Z')

function registry() {
    const api = T.createToolApi()
    const specs = Core.makeCoreTools({ fetchJSON, now: () => NOW, base: BASE, page: n => ({ title: 'A page', text: 'x'.repeat(n) }), navigate: rel => ({ will_open: rel }), highlight: () => ({ found: 1 }) })
    for (const [n, s] of Object.entries(specs)) api.register(n, s)
    api.register('search', S.searchTool(S.createEngine(fetchJSON), BASE))
    return api
}
// a fetch that answers like openrouter.ai: server-sent events, split at awkward places
function mockOpenRouter(script) {
    const calls = []
    const fetch = async (url, init) => {
        calls.push({ url, init, body: JSON.parse(init.body) })
        const turn = script[calls.length - 1]
        if (!turn) throw new Error('the mock has no answer for request ' + calls.length)
        const events = [': OPENROUTER PROCESSING\n\n']
        if (turn.content) for (const piece of turn.content.match(/.{1,7}/gs)) events.push(`data: ${JSON.stringify({ model: init && JSON.parse(init.body).model, choices: [{ index: 0, delta: { content: piece } }] })}\n\n`)
        ;(turn.tool_calls || []).forEach((tc, i) => {
            const args = JSON.stringify(tc.args)
            events.push(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, id: `call_${calls.length}_${i}`, type: 'function', function: { name: tc.name, arguments: '' } }] } }] })}\n\n`)
            for (const half of [args.slice(0, Math.ceil(args.length / 2)), args.slice(Math.ceil(args.length / 2))]) events.push(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, function: { arguments: half } }] } }] })}\n\n`)
        })
        events.push(`data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: turn.tool_calls ? 'tool_calls' : 'stop' }], usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 } })}\n\n`, 'data: [DONE]\n\n')
        const text = events.join('')
        const enc = new TextEncoder()
        const cuts = []
        for (let i = 0; i < text.length; i += 37) cuts.push(text.slice(i, i + 37))   // split mid-line, as networks do
        const body = new ReadableStream({ start(c) { for (const x of cuts) c.enqueue(enc.encode(x)); c.close() } })
        return { ok: true, status: 200, headers: { get: k => k.toLowerCase() === 'content-type' ? 'text/event-stream' : null }, body }
    }
    return { fetch, calls }
}

await test('the system prompt says what the site is, its rules and today\'s date', () => {
    const p = C.systemPrompt({ site: { name: 'PrompTugal.news', host: 'promptugal.news' }, now: new Date('2026-11-05T09:30:00Z'), page: { title: 'Replit', url: BASE + 'companies/replit/index.html' }, levels: ['read', 'view'] })
    for (const s of ['PrompTugal.news', 'independent newsroom at Web Summit Lisbon 2026', 'not affiliated with Web Summit', 'powered by RiskMandate', 'Thursday 5 November 2026', '09:30 in Lisbon', 'starts on Monday 9 November, in 4 days', 'Sources:', 'No contact details', 'The reader is on the page "Replit"', 'open, highlight']) assert.ok(p.includes(s), `missing: ${s}`)
    assert.ok(!p.includes('\u2014'), 'no em-dash')
    assert.ok(C.systemPrompt({ now: new Date('2026-11-11T10:00:00Z'), levels: ['read'] }).includes('day 3 of 4'))
    assert.ok(C.systemPrompt({ now: new Date('2026-11-11T10:00:00Z'), levels: ['read'] }).includes('cannot move the reader\'s page'))
})

await test('the SSE parser survives lines split across chunks, comments and [DONE]', () => {
    const p = C.sseParser()
    const a = p(': OPENROUTER PROCESSING\n\ndata: {"choices":[{"delta":{"content":"Hel')
    const b = p('lo"}}]}\n\ndata: [DONE]\n\n')
    assert.equal(a.length, 0)
    assert.equal(b.length, 1)
    assert.equal(b[0].choices[0].delta.content, 'Hello')
})

await test('the registry: queue contract, levels, argument checks, dotted names, the log', async () => {
    const fake = { __toolQueue: [['register', 'graph.focus', { level: 'view', description: 'focus a node', params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, run: async a => ({ focused: a.id }) }]], dispatchEvent() { } }
    T.install(fake)
    fake.__toolQueue.push(['register', 'late_tool', { level: 'author', description: 'late', run: async () => 'late' }])
    const api = fake.__tool
    assert.deepEqual(api.list().map(t => t.name), ['graph.focus', 'late_tool'])
    assert.equal(api.schemas({ levels: ['view'] })[0].function.name, 'graph__focus')
    assert.deepEqual(await api.call('graph__focus', { id: 'company:replit' }), { focused: 'company:replit' })
    await assert.rejects(api.call('graph.focus', {}), /id is required/)
    await assert.rejects(api.call('late_tool', {}, { levels: ['read', 'view'] }), /author level is not allowed/)
    await assert.rejects(api.call('nope', {}), /no tool called nope/)
    const log = api.log()
    assert.equal(log.length, 4)
    assert.equal(log[0].ok, true)
    assert.equal(log[1].ok, false)
    assert.throws(() => api.register('Bad Name', { run() { } }), /lower case/)
})

await test('complete(): one streamed request to openrouter.ai, the key only in its header, tool calls reassembled', async () => {
    const m = mockOpenRouter([{ tool_calls: [{ name: 'search', args: { query: 'Replit', type: 'company' } }] }])
    const tools = registry().schemas({ levels: ['read'] })
    let deltas = ''
    const r = await C.complete({ fetch: m.fetch, key: KEY, model: C.DEFAULT_MODEL, messages: [{ role: 'user', content: 'hi' }], tools, onDelta: t => { deltas += t } })
    assert.equal(m.calls.length, 1)
    assert.equal(m.calls[0].url, 'https://openrouter.ai/api/v1/chat/completions')
    assert.equal(m.calls[0].init.headers.Authorization, 'Bearer ' + KEY)
    assert.ok(!m.calls[0].init.body.includes(KEY), 'the key is not in the body')
    assert.equal(m.calls[0].body.stream, true)
    assert.equal(m.calls[0].body.model, 'anthropic/claude-sonnet-5')
    assert.ok(m.calls[0].body.tools.some(t => t.function.name === 'agenda') && !m.calls[0].body.tools.some(t => t.function.name === 'open'), 'read tools only')
    assert.equal(r.tool_calls.length, 1)
    assert.equal(r.tool_calls[0].function.name, 'search')
    assert.deepEqual(JSON.parse(r.tool_calls[0].function.arguments), { query: 'Replit', type: 'company' })
    assert.equal(r.usage.total_tokens, 120)
    await assert.rejects(C.complete({ fetch: m.fetch, messages: [] }), /no OpenRouter key/)
    const refused = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'No auth credentials found' } }) })
    await assert.rejects(C.complete({ fetch: refused, key: KEY, messages: [] }), /key was refused \(401\)/)
})

await test('"what is happening today?": the loop runs now and agenda against the data, then answers in words', async () => {
    const api = registry()
    const m = mockOpenRouter([
        { tool_calls: [{ name: 'now', args: {} }, { name: 'agenda', args: { date: 'today', limit: 5 } }] },
        { content: 'Today, Tuesday 10 November, is day 2 of the summit. [Centre Stage](https://web-summit.newsroom.sgit.ai/places/centre-stage/index.html)\n\nSources: the agenda.' },
    ])
    const levels = ['read']
    const messages = [{ role: 'system', content: C.systemPrompt({ now: NOW, levels }) }, { role: 'user', content: 'What is happening today?' }]
    const events = []
    let streamed = ''
    const out = await C.runTurn({
        messages,
        send: msgs => C.complete({ fetch: m.fetch, key: KEY, messages: msgs, tools: api.schemas({ levels }), onDelta: t => { streamed += t } }),
        callTool: (name, args) => api.call(name, args, { via: 'chat', levels }),
        onEvent: e => events.push(e),
    })
    assert.equal(m.calls.length, 2)
    assert.deepEqual(messages.map(x => x.role), ['system', 'user', 'assistant', 'tool', 'tool', 'assistant'])
    const now = JSON.parse(messages[3].content), agenda = JSON.parse(messages[4].content)
    assert.equal(now.date, '2026-11-10')
    assert.equal(now.lisbon_time, '11:52')
    assert.match(now.summit.status, /day 2 of 4/)
    assert.ok(now.next.length > 0, 'something is next')
    assert.equal(agenda.date, '2026-11-10')
    assert.ok(agenda.total >= 50, `the day has its programme (${agenda.total})`)
    assert.equal(agenda.items.length, 5)
    assert.ok(agenda.items.every(i => i.ref.startsWith('event:') && i.url.startsWith(BASE + 'events/')))
    assert.ok(agenda.items.every((i, k, a) => k === 0 || String(a[k - 1].start) <= String(i.start)), 'in time order')
    assert.ok(messages[3].content.length < 6000 && messages[4].content.length < 6000, 'compact results')
    // the second request carries the results back, with matching ids
    const second = m.calls[1].body.messages
    assert.equal(second[2].tool_calls.length, 2)
    assert.equal(second[3].tool_call_id, second[2].tool_calls[0].id)
    assert.match(out.content, /day 2 of the summit/)
    assert.equal(streamed, out.content)
    assert.deepEqual(events.map(e => e.type), ['usage', 'call', 'result', 'call', 'result', 'usage', 'answer'])
    assert.match(events[2].summary, /11:52 Lisbon/)
    assert.equal(api.log().length, 2)
    assert.ok(api.log().every(e => e.via === 'chat' && e.ok))
    assert.ok(!JSON.stringify({ messages, log: api.log(), events }).includes(KEY), 'the key is nowhere in the conversation, the log or the events')
})

await test('a tool the reader has not allowed, or that fails, goes back to the model as an error, not a crash', async () => {
    const api = registry()
    const m = mockOpenRouter([
        { tool_calls: [{ name: 'open', args: { target: 'company:replit' } }, { name: 'get_entity', args: { type: 'company', id: 'no-such-company' } }] },
        { content: 'I cannot open pages for you; here is the link.' },
    ])
    const messages = [{ role: 'system', content: 's' }, { role: 'user', content: 'open Replit' }]
    const events = []
    await C.runTurn({ messages, send: msgs => C.complete({ fetch: m.fetch, key: KEY, messages: msgs, tools: api.schemas({ levels: ['read'] }) }), callTool: (n, a) => api.call(n, a, { via: 'chat', levels: ['read'] }), onEvent: e => events.push(e) })
    assert.match(JSON.parse(messages[3].content).error, /view level is not allowed/)
    assert.match(JSON.parse(messages[4].content).error, /no company with id "no-such-company"/)
    assert.equal(events.filter(e => e.type === 'result' && e.error).length, 2)
    assert.equal(messages[5].content, 'I cannot open pages for you; here is the link.')
})

await test('search, get_entity and neighbours give compact answers with refs and addresses', async () => {
    const api = registry()
    const s = await api.call('search', { query: 'replit' })
    assert.equal(s.results[0].ref, 'company:replit')
    assert.equal(s.results[0].url, BASE + 'companies/replit/index.html')
    const e = await api.call('get_entity', { type: 'company', id: 'replit' })
    assert.equal(e.label, 'Replit')
    assert.ok(e.data.what && e.data.sources && !e.data.derived && !e.data.field_sources)
    assert.equal((await api.call('get_entity', { type: 'company:replit' })).ref, 'company:replit')
    const n = await api.call('neighbours', { type: 'company', id: 'replit' })
    assert.ok(n.total > 0 && n.items.every(i => i.verb && i.ref && i.direction))
    const t = await api.call('neighbours', { type: 'topic', id: 'security' })
    assert.ok(t.by_verb.filed_under >= 20 && t.items.every(i => i.direction === 'in' ? i.verb !== 'classifies' : true), 'a topic\'s neighbours come from its entity file, verbs read forwards')
    const l = await api.call('list_entities', { type: 'company', topic: 'security', country: 'United States' })
    assert.ok(l.total > 5 && l.items.every(i => i.ref.startsWith('company:')))
    const tom = await api.call('agenda', { date: 'tomorrow', organiser: 'other' })
    assert.equal(tom.date, '2026-11-11')
    assert.ok(tom.items.every(i => i.organiser === 'around the summit'))
    NOW = new Date('2026-11-05T10:00:00Z')
    const before = await api.call('now', {})
    assert.equal(before.summit.status, 'before the summit')
    assert.equal(before.summit.days_to_go, 4)
    NOW = new Date('2026-11-10T11:52:00Z')
    const sunday = await api.call('agenda', { date: '2026-11-15' })
    assert.equal(sunday.total, 0)
    assert.match(sunday.note, /Days with items/)
})

await test('the loop stops after the round limit', async () => {
    const messages = [{ role: 'system', content: 's' }, { role: 'user', content: 'loop' }]
    const send = async () => ({ content: '', tool_calls: [{ id: 'x', function: { name: 'now', arguments: '{}' } }] })
    const out = await C.runTurn({ messages, send, callTool: async () => ({}), maxHops: 3 })
    assert.equal(out.stopped, true)
    assert.match(messages[messages.length - 1].content, /Stopped after 3 rounds/)
})

console.log(failed ? `\n${failed} FAILED, ${passed} passed` : `\nALL ${passed} CHAT CHECKS PASS`)
process.exit(failed ? 1 : 0)
