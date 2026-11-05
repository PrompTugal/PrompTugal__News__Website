/* chat.js: "Ask the newsroom", the right-hand pane (#nr-pane). Loaded by boot.js when the reader asks.
 *
 * The OpenRouter workflow of graphs.sgit.ai: the reader pastes their own key, kept only in this browser's
 * localStorage (nr-chat:key), sent only to openrouter.ai, never logged, never in the page or the conversation, with a
 * Forget key button. A model picker (default anthropic/claude-sonnet-5). The tool loop (chat-core.js) offers the
 * model every tool on window.__tool at the levels the reader allows (read on, view on, author off; Settings), runs its
 * calls there and shows each call and its result in the log. Tools registered at any time are offered at the next
 * request. Without a key, the pane says what is needed and still runs tools by hand (the console).
 *
 * The conversation lives in sessionStorage for the session. For a vault (a later feature), window.__nrChat has
 * getConversation(), loadConversation(c) and onTurn(fn), and every finished turn fires `nr:chat-turn` on window with
 * { detail: { conversation } }. The key is never part of a conversation.
 * Markup and classes are the designer's (design/README.md, .chat ...).
 */
(function (w, d) {
    'use strict'
    const Core = w.NRChatCore, Site = w.NRSite
    if (!Core || !Site || w.NRChat) return
    const K = { key: 'nr-chat:key', model: 'nr-chat:model', levels: 'nr-chat:levels', conv: 'nr-chat:conversation', open: 'nr-chat:open' }
    const get = (s, k, def) => { try { const v = s.getItem(k); return v === null ? def : v } catch (e) { return def } }
    const set = (s, k, v) => { try { if (v === null || v === undefined) s.removeItem(k); else s.setItem(k, v) } catch (e) { /* storage blocked */ } }
    const LS = (() => { try { return w.localStorage } catch (e) { return null } })()
    const SS = (() => { try { return w.sessionStorage } catch (e) { return null } })()
    const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    const SEND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
    const STOP = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor"/></svg>'
    const SUGGEST = ['What is happening today?', 'Which security companies are at the summit?', 'Who speaks on Centre Stage on Tuesday?', 'What is next on the agenda?']
    const tool = () => w.__tool

    const st = {
        built: false, busy: false, abort: null, tokens: 0,
        levels: (() => { try { return JSON.parse(get(LS, K.levels, '')) } catch (e) { return null } })() || { read: true, view: true, author: false },
        conv: null,
        turnListeners: new Set(),
    }
    const allowed = () => ['read', 'view', 'author'].filter(l => st.levels[l])
    const key = () => get(LS, K.key, '')
    const model = () => get(LS, K.model, '') || Core.DEFAULT_MODEL
    const fresh = () => ({ version: 1, started: new Date().toISOString(), model: model(), messages: [], items: [] })
    function loadConv() { try { st.conv = JSON.parse(get(SS, K.conv, '')) } catch (e) { st.conv = null } if (!st.conv || !Array.isArray(st.conv.items)) st.conv = fresh() }
    const saveConv = () => set(SS, K.conv, JSON.stringify(st.conv))

    let pane, log, input, sendBtn, keyLine, settings, consoleSel, consoleArgs
    /* ---------------------------------------------------------------- markup */
    function build() {
        st.built = true
        loadConv()
        const root = Site.mount('nr-pane')
        pane = d.createElement('aside')
        pane.className = 'chat nr-chat'
        pane.id = 'chat'
        pane.hidden = true
        pane.setAttribute('aria-label', 'Ask the newsroom')
        pane.innerHTML = `
<header class="chat-head"><div><h2>Ask the newsroom</h2><span class="scope">Answers from this site's tools, with sources</span></div><span class="spacer"></span>
<button type="button" data-act="settings" aria-expanded="false" aria-controls="nr-chat-settings">Settings</button><button type="button" data-act="new" title="Start a new conversation">New</button><button type="button" data-act="close" aria-label="Close the chat">Close</button></header>
<div class="chat-key" id="nr-chat-key"></div>
<div class="nr-chat-settings" id="nr-chat-settings" hidden>
  <div class="field"><label for="nr-chat-keyin">Your OpenRouter key</label>
    <div class="nr-row"><input id="nr-chat-keyin" class="input" type="password" autocomplete="off" spellcheck="false" placeholder="Paste your key"><button type="button" class="btn primary" data-act="savekey">Save</button></div>
    <span class="hint">Kept only in this browser (localStorage) and sent only to openrouter.ai, with each question. Get one at <a href="https://openrouter.ai/keys" rel="noopener" target="_blank">openrouter.ai/keys</a>; you pay OpenRouter for what you ask.</span>
    <p class="nr-row"><button type="button" class="btn quiet" data-act="forget">Forget key</button><span class="nr-keystate"></span></p></div>
  <div class="field"><label for="nr-chat-model">Model</label>
    <select id="nr-chat-model" class="input">${Core.MODELS.map(([id, label]) => `<option value="${esc(id)}">${esc(label)}</option>`).join('')}<option value="__other">Another OpenRouter model…</option></select>
    <input id="nr-chat-model-other" class="input" type="text" placeholder="provider/model, as OpenRouter names it" hidden></div>
  <fieldset class="field nr-levels"><legend>What the assistant may do</legend>
    <label><input type="checkbox" data-level="read"> Read: search and read the site's data</label>
    <label><input type="checkbox" data-level="view"> View: open pages and highlight things for you</label>
    <label><input type="checkbox" data-level="author"> Author: change things (no tool uses it yet)</label></fieldset>
</div>
<div class="chat-log" role="log" aria-live="polite"></div>
<details class="nr-console"><summary>Run a tool by hand</summary>
  <div class="nr-console-body"><label class="visually-hidden" for="nr-console-tool">Tool</label><select id="nr-console-tool" class="input"></select>
  <label class="visually-hidden" for="nr-console-args">Arguments (JSON)</label><textarea id="nr-console-args" class="input" rows="2" spellcheck="false"></textarea>
  <button type="button" class="btn quiet" data-act="run">Run</button><p class="nr-console-desc"></p></div></details>
<form class="chat-input"><label class="visually-hidden" for="nr-chat-q">Your question</label><textarea id="nr-chat-q" rows="1" placeholder="Ask about the summit"></textarea><button type="submit" aria-label="Send">${SEND}</button></form>
<p class="chat-foot">You bring the key and pay your provider for each answer; it stays in this browser and goes only to openrouter.ai. Every tool call shows above as it happens. Independent of Web Summit; powered by RiskMandate.</p>`
        root.appendChild(pane)
        log = pane.querySelector('.chat-log')
        input = pane.querySelector('#nr-chat-q')
        sendBtn = pane.querySelector('.chat-input button')
        keyLine = pane.querySelector('#nr-chat-key')
        settings = pane.querySelector('#nr-chat-settings')
        consoleSel = pane.querySelector('#nr-console-tool')
        consoleArgs = pane.querySelector('#nr-console-args')

        pane.addEventListener('click', onClick)
        pane.querySelector('form.chat-input').addEventListener('submit', e => { e.preventDefault(); if (st.busy) stop(); else ask(input.value) })
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (!st.busy) ask(input.value) } })
        input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(140, input.scrollHeight) + 'px' })
        pane.addEventListener('keydown', e => { if (e.key === 'Escape' && !e.defaultPrevented) close() })
        const sel = pane.querySelector('#nr-chat-model'), other = pane.querySelector('#nr-chat-model-other')
        const m = model()
        if (Core.MODELS.some(x => x[0] === m)) sel.value = m; else { sel.value = '__other'; other.hidden = false; other.value = m }
        sel.addEventListener('change', () => { other.hidden = sel.value !== '__other'; if (sel.value !== '__other') { set(LS, K.model, sel.value === Core.DEFAULT_MODEL ? null : sel.value); renderKey() } else other.focus() })
        other.addEventListener('change', () => { const v = other.value.trim(); if (/^[\w.-]+\/[\w.:-]+$/.test(v)) { set(LS, K.model, v); renderKey() } })
        for (const cb of pane.querySelectorAll('.nr-levels input')) {
            cb.checked = !!st.levels[cb.dataset.level]
            cb.addEventListener('change', () => { st.levels[cb.dataset.level] = cb.checked; set(LS, K.levels, JSON.stringify(st.levels)); renderKey() })
        }
        consoleSel.addEventListener('change', fillConsoleArgs)
        if (tool()) tool().on(ev => { if (ev.type === 'register' || ev.type === 'unregister') refreshConsole() })
        w.addEventListener('tool:registered', refreshConsole)
        refreshConsole()
        renderKey()
        renderAll()
    }

    function onClick(e) {
        const b = e.target.closest('[data-act]')
        if (b) {
            const act = b.dataset.act
            if (act === 'close') close()
            else if (act === 'settings') toggleSettings()
            else if (act === 'new') newConversation()
            else if (act === 'savekey') saveKey()
            else if (act === 'forget') forgetKey()
            else if (act === 'run') runConsole()
            else if (act === 'suggest') { if (key()) ask(b.textContent); else { input.value = b.textContent; toggleSettings(true) } }
            else if (act === 'opensettings') toggleSettings(true)
            return
        }
        const a = e.target.closest('.chat-log a[href]')
        if (a && a.origin === w.location.origin) { remember(true) }
    }
    function toggleSettings(force) {
        const on = force !== undefined ? force : settings.hidden
        settings.hidden = !on
        pane.querySelector('[data-act="settings"]').setAttribute('aria-expanded', String(on))
        if (on && !key()) pane.querySelector('#nr-chat-keyin').focus()
    }
    function saveKey() {
        const inp = pane.querySelector('#nr-chat-keyin')
        const v = inp.value.trim()
        inp.value = ''
        if (!v) return
        set(LS, K.key, v)
        renderKey()
        const note = /^sk-or-/.test(v) ? 'Saved in this browser.' : 'Saved. OpenRouter keys usually start with sk-or-; if answers fail, check it.'
        pane.querySelector('.nr-keystate').textContent = note
        toggleSettings(false)
        if (input.value.trim()) ask(input.value); else input.focus()
    }
    function forgetKey() {
        set(LS, K.key, null)
        pane.querySelector('.nr-keystate').textContent = 'Forgotten: the key is no longer in this browser.'
        renderKey()
    }
    function renderKey() {
        const has = !!key()
        keyLine.innerHTML = has
            ? `<span class="ok">● Connected</span><span class="nr-keynote">your OpenRouter key, kept in this browser</span><span class="model">${esc(model())}</span><span class="nr-lv">${esc(allowed().join(' · ') || 'no tools')}</span>${st.tokens ? `<span>${st.tokens.toLocaleString('en-GB')} tokens so far</span>` : ''}`
            : `<span class="nr-nokey">○ No key</span><span>To ask in words, add your own OpenRouter key.</span><button type="button" class="btn quiet nr-small" data-act="opensettings">Add a key</button>`
        pane.querySelector('.nr-keystate').textContent = pane.querySelector('.nr-keystate').textContent || (has ? 'A key is saved in this browser.' : 'No key is saved.')
        pane.classList.toggle('nr-has-key', has)
        const intro = log && log.querySelector('.nr-intro')
        if (intro) intro.outerHTML = introHtml()
    }

    /* ---------------------------------------------------------------- rendering the log */
    function md(text) {
        // a small, safe markdown: escaped first; paragraphs, lists, **bold**, *em*, `code`, [links](http or site paths)
        const inline = s => esc(s)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
            .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
                const raw = u.replace(/&amp;/g, '&')
                if (!/^(https?:\/\/|[a-z0-9_-]+\/|#)/i.test(raw) || /^javascript:/i.test(raw)) return t
                const href = Site.local(raw)
                const ext = !href.startsWith(Site.root) && !/^#/.test(href)
                return `<a href="${esc(href)}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`
            })
        // line by line: runs of list items become a list, headings a bold line, the rest paragraphs
        const out = []
        let para = [], list = null
        const flushPara = () => { if (para.length) { const b = para.join('\n'); out.push(`<p${/^sources?:/i.test(b) ? ' class="cites"' : ''}>${para.map(inline).join('<br>')}</p>`); para = [] } }
        const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null } }
        for (const line of String(text || '').replace(/\r/g, '').split('\n')) {
            const li = /^\s*([-*\u2022]|\d+\.)\s+(.*)$/.exec(line)
            if (!line.trim()) { flushPara(); flushList(); continue }
            if (li) { flushPara(); const tag = /\d/.test(li[1]) ? 'ol' : 'ul'; if (list && list.tag !== tag) flushList(); list = list || { tag, items: [] }; list.items.push(li[2]); continue }
            flushList()
            if (/^#{1,4}\s/.test(line)) { flushPara(); out.push(`<p><strong>${inline(line.replace(/^#+\s/, ''))}</strong></p>`); continue }
            para.push(line)
        }
        flushPara(); flushList()
        return out.join('')
    }
    const callText = (name, args) => `${name}(${args && Object.keys(args).length ? JSON.stringify(args) : ''})`
    function itemHtml(it) {
        if (it.kind === 'user') return `<div class="msg user"><p>${esc(it.text)}</p></div>`
        if (it.kind === 'bot') return `<div class="msg bot">${md(it.text) || '<p>…</p>'}</div>`
        if (it.kind === 'note') return `<div class="msg note${it.error ? ' error' : ''}"><p>${esc(it.text)}</p></div>`
        if (it.kind === 'calls') return `<ol class="calls">${it.calls.map(callHtml).join('')}</ol>`
        if (it.kind === 'intro') return introHtml()
        return ''
    }
    function callHtml(c) {
        const st2 = c.state === 'running' ? '…' : c.state === 'error' ? '✗' : '✓'
        const body = c.state === 'running' ? '' : `<details class="detail"><summary>${c.state === 'error' ? 'Error' : 'Result'}${c.via === 'console' ? ' · run by hand' : ''}</summary><pre>${esc(c.output || '')}</pre></details>`
        return `<li class="call${c.state === 'running' ? ' running' : ''}${c.state === 'error' ? ' error' : ''}" data-id="${esc(c.id)}"><span class="st" aria-label="${c.state}">${st2}</span><code>${esc(callText(c.name, c.args))}</code><span class="out">${esc(c.summary || '')}</span>${body}</li>`
    }
    function introHtml() {
        const has = !!key()
        return `<div class="msg bot nr-intro"><p>Ask about Web Summit Lisbon 2026 and the companies, sessions and people this newsroom follows. Answers come from this site's own data, through the tools you see run below each question, with their sources.</p>${has ? '' : '<p class="nr-need">To ask in words you need your own <a href="https://openrouter.ai/keys" rel="noopener" target="_blank">OpenRouter key</a> (Settings). Without one, you can still run the tools by hand: open <b>Run a tool by hand</b> below.</p>'}<p class="nr-suggest">${SUGGEST.map(s => `<button type="button" class="chip" data-act="suggest">${esc(s)}</button>`).join('')}</p></div>`
    }
    function renderAll() {
        if (!st.conv.items.length) st.conv.items.push({ kind: 'intro' })
        log.innerHTML = st.conv.items.map(itemHtml).join('')
        log.scrollTop = log.scrollHeight
    }
    function push(it) {
        st.conv.items.push(it)
        log.insertAdjacentHTML('beforeend', itemHtml(it))
        log.scrollTop = log.scrollHeight
        saveConv()
        return it
    }
    const lastEl = () => log.lastElementChild
    function callsItem() {
        const last = st.conv.items[st.conv.items.length - 1]
        if (last && last.kind === 'calls') return last
        return push({ kind: 'calls', calls: [] })
    }
    function updateCall(c) {
        const el = log.querySelector(`.call[data-id="${CSS.escape(c.id)}"]`)
        if (el) el.outerHTML = callHtml(c)
        else { const ol = lastEl(); if (ol && ol.matches('ol.calls')) ol.insertAdjacentHTML('beforeend', callHtml(c)) }
        log.scrollTop = log.scrollHeight
        saveConv()
    }

    /* ---------------------------------------------------------------- the tool console (no key needed) */
    function refreshConsole() {
        if (!consoleSel || !tool()) return
        const cur = consoleSel.value
        const list = tool().list()
        consoleSel.innerHTML = list.map(t => `<option value="${esc(t.name)}">${esc(t.name)} · ${esc(t.level)}</option>`).join('')
        if (list.some(t => t.name === cur)) consoleSel.value = cur
        else if (list.some(t => t.name === 'search')) consoleSel.value = 'search'
        if (!consoleArgs.value || cur !== consoleSel.value) fillConsoleArgs()
    }
    function fillConsoleArgs() {
        const t = tool() && tool().get(consoleSel.value)
        if (!t) return
        consoleArgs.value = JSON.stringify(t.example || {})
        pane.querySelector('.nr-console-desc').textContent = t.description
    }
    async function runConsole(nameArg, argsArg) {
        const name = nameArg || consoleSel.value
        let args
        try { args = argsArg || (consoleArgs.value.trim() ? JSON.parse(consoleArgs.value) : {}) } catch (e) { push({ kind: 'note', text: 'The arguments are not valid JSON.', error: true }); return }
        const c = { id: 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, args, state: 'running', via: 'console' }
        callsItem().calls.push(c)
        updateCall(c)
        try {
            const r = await tool().call(name, args, { via: 'console' })
            Object.assign(c, { state: 'ok', summary: Core.summarise(name, r), output: JSON.stringify(r, null, 2).slice(0, 20000) })
        } catch (e) {
            Object.assign(c, { state: 'error', summary: 'error: ' + e.message, output: e.message })
        }
        updateCall(c)
        return c
    }

    /* ---------------------------------------------------------------- asking */
    async function siteInfo() {
        try { return (await Site.fetchJSON('api/v1/search/docs.json')).site || {} } catch (e) { return {} }
    }
    async function ask(text) {
        text = String(text || '').trim()
        if (!text || st.busy) return
        if (!key()) { push({ kind: 'note', text: 'Add your OpenRouter key in Settings to ask in words. You can still run the tools by hand below.' }); toggleSettings(true); return }
        input.value = ''
        input.style.height = ''
        push({ kind: 'user', text })
        busy(true)
        const site = await siteInfo()
        const pageTitle = (d.querySelector('main h1') || {}).textContent || d.title
        const system = Core.systemPrompt({ site, now: Site.now(), page: { title: pageTitle, url: Site.canonical }, levels: allowed() })
        st.conv.model = model()
        st.conv.messages.push({ role: 'user', content: text })
        const messages = [{ role: 'system', content: system }, ...st.conv.messages]
        const before = messages.length
        let bot = null, botText = ''
        const ctrl = st.abort = new AbortController()
        const pending = new Map()
        try {
            await Core.runTurn({
                messages,
                send: msgs => {
                    bot = null; botText = ''
                    return Core.complete({
                        key: key(), model: model(), messages: msgs, tools: tool() ? tool().schemas({ levels: allowed() }) : [], signal: ctrl.signal,
                        referer: Site.base || w.location.origin, title: (site.name || 'Newsroom') + ': Ask the newsroom',
                        onDelta: t => {
                            botText += t
                            if (!bot) bot = push({ kind: 'bot', text: '' })
                            bot.text = botText
                            const el = lastEl()
                            if (el && el.matches('.msg.bot')) el.innerHTML = md(botText)
                            log.scrollTop = log.scrollHeight
                        },
                    })
                },
                callTool: (name, args) => tool().call(name, args, { via: 'chat', levels: allowed() }),
                onEvent: ev => {
                    if (ev.type === 'call') {
                        if (bot && !bot.text.trim()) { st.conv.items.pop(); lastEl().remove() }
                        bot = null
                        const c = { id: ev.id || ('c' + Math.random().toString(36).slice(2)), name: (tool() && tool().fromWire(ev.name)) || ev.name, args: ev.args, state: 'running', via: 'chat' }
                        pending.set(ev.id, c)
                        callsItem().calls.push(c)
                        updateCall(c)
                    } else if (ev.type === 'result') {
                        const c = pending.get(ev.id)
                        if (!c) return
                        Object.assign(c, ev.error ? { state: 'error', summary: ev.summary, output: ev.error } : { state: 'ok', summary: ev.summary, output: JSON.stringify(ev.result, null, 2).slice(0, 20000) })
                        updateCall(c)
                    } else if (ev.type === 'usage' && ev.usage) {
                        st.tokens += ev.usage.total_tokens || 0
                        renderKey()
                    } else if (ev.type === 'answer') {
                        if (!bot && ev.content) push({ kind: 'bot', text: ev.content })
                        else if (bot) { bot.text = ev.content; const el = lastEl(); if (el && el.matches('.msg.bot')) el.innerHTML = md(ev.content) }
                    } else if (ev.type === 'stopped') push({ kind: 'note', text: ev.reason })
                },
            })
            st.conv.messages.push(...messages.slice(before))
        } catch (e) {
            if (e.name === 'AbortError') push({ kind: 'note', text: 'Stopped.' })
            else push({ kind: 'note', text: e.message, error: true })
            st.conv.messages.push(...messages.slice(before).filter(m => m.role !== 'tool' && !(m.tool_calls)))
            if (st.conv.messages[st.conv.messages.length - 1].role === 'user') st.conv.messages.push({ role: 'assistant', content: '(no answer: ' + (e.name === 'AbortError' ? 'stopped' : 'error') + ')' })
        } finally {
            st.abort = null
            busy(false)
            saveConv()
            turnSettled()
        }
        if (w.__nrPendingOpen) { const u = w.__nrPendingOpen; w.__nrPendingOpen = null; remember(true); setTimeout(() => { w.location.href = u }, 600) }
    }
    function stop() { if (st.abort) st.abort.abort() }
    function busy(on) {
        st.busy = on
        pane.classList.toggle('nr-busy', on)
        sendBtn.innerHTML = on ? STOP : SEND
        sendBtn.setAttribute('aria-label', on ? 'Stop' : 'Send')
    }
    function newConversation() {
        stop()
        st.conv = fresh()
        saveConv()
        renderAll()
        input.focus()
    }
    const conversation = () => JSON.parse(JSON.stringify(st.conv))
    function turnSettled() {
        const c = conversation()
        for (const fn of st.turnListeners) { try { fn(c) } catch (e) { /* a listener's own failure */ } }
        try { w.dispatchEvent(new CustomEvent('nr:chat-turn', { detail: { conversation: c } })) } catch (e) { /* fine */ }
    }

    /* ---------------------------------------------------------------- open, close */
    function remember(on) { set(SS, K.open, on ? '1' : null) }
    function open(opts) {
        if (!st.built) build()
        pane.hidden = false
        d.body.classList.add('chat-open')
        for (const b of d.querySelectorAll('.nr-ask')) b.setAttribute('aria-expanded', 'true')
        remember(true)
        if (!(opts && opts.restore)) setTimeout(() => (key() ? input : pane.querySelector('[data-act="settings"]')).focus(), 30)
    }
    function close() {
        if (!pane) return
        pane.hidden = true
        d.body.classList.remove('chat-open')
        for (const b of d.querySelectorAll('.nr-ask')) b.setAttribute('aria-expanded', 'false')
        remember(false)
        const b = d.querySelector('.tool.nr-ask')
        if (b && b.offsetParent) b.focus()
    }

    w.NRChat = { open, close, isOpen: () => !!pane && !pane.hidden, ask: t => { open(); return ask(t) }, runTool: (n, a) => { open(); return runConsole(n, a) }, newConversation }
    // the hook for the vault (and for anything else that keeps conversations): no key is ever in a conversation
    w.__nrChat = {
        getConversation: () => (st.conv ? conversation() : null),
        loadConversation(c) { if (!c || !Array.isArray(c.items) || !Array.isArray(c.messages)) throw new Error('not a conversation'); if (!st.built) build(); st.conv = JSON.parse(JSON.stringify(c)); saveConv(); renderAll() },
        onTurn(fn) { st.turnListeners.add(fn); return () => st.turnListeners.delete(fn) },
    }
})(window, document)
