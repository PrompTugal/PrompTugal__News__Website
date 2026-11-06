/* answer.js: an answer in words on the search page, from the site's own data. The reader's own OpenRouter key (the
 * chat's: localStorage nr-chat:key) is sent only to openrouter.ai; the model reads through the page tools at the read
 * level only (search, get_entity, agenda ...), and every tool it calls is listed under the answer. No key: a link to
 * the chat's settings. Nothing is sent to this site or anyone else. Loaded on every page, acts only on /search/.
 */
(function (w, d) {
    'use strict'
    const Site = w.NRSite
    if (!Site) return
    const LS = (() => { try { return w.localStorage } catch (e) { return null } })()
    const get = k => { try { return LS && LS.getItem(k) } catch (e) { return null } }
    const el = (tag, cls, text) => { const e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    const script = src => new Promise((ok, no) => { const s = d.createElement('script'); s.src = Site.url(src); s.onload = ok; s.onerror = () => no(new Error(src + ' did not load')); d.head.appendChild(s) })
    // the model's text as paragraphs of text nodes, **bold**, and [links](url): built with the DOM, never as HTML
    function show(out, text) {
        out.replaceChildren(...String(text).split(/\n{2,}/).map(par => {
            const p = el('p')
            par.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/).forEach(part => {
                let m
                if ((m = /^\*\*([^*]+)\*\*$/.exec(part))) p.append(el('strong', '', m[1]))
                else if ((m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part))) {
                    const ext = /^https?:\/\//i.test(m[2])
                    if (!ext && !/^[a-z0-9_-]+\//i.test(m[2])) { p.append(m[1]); return }
                    const a = el('a', '', m[1]); a.href = ext ? m[2] : Site.url(m[2])
                    if (ext) { a.target = '_blank'; a.rel = 'noopener' }
                    p.append(a)
                } else p.append(part)
            })
            return p
        }))
    }

    async function answer(q, out, tools) {
        if (!w.NRChatCore) await script('assets/chat/chat-core.js')
        const Core = w.NRChatCore, T = w.__tool
        const key = get('nr-chat:key'), model = get('nr-chat:model') || Core.DEFAULT_MODEL
        if (!key) { show(out, 'An answer in words needs your own OpenRouter key. Add it in the [chat](ask/index.html) (Settings); the results below work without it.'); return }
        let site = {}
        try { site = (await Site.fetchJSON('api/v1/search/docs.json')).site || {} } catch (e) { /* none */ }
        const levels = ['read']
        const messages = [{ role: 'system', content: Core.systemPrompt({ site, now: Site.now(), page: { title: 'Search', url: Site.canonical }, levels }) }, { role: 'user', content: q }]
        const ctrl = new AbortController()
        let text = ''
        const called = []
        await Core.runTurn({
            messages,
            send: msgs => { text = ''; return Core.complete({ key, model, messages: msgs, tools: T.schemas({ levels }), signal: ctrl.signal, referer: Site.base || w.location.origin, title: (site.name || 'Newsroom') + ': Search answer', onDelta: t => { text += t; show(out, text) } }) },
            callTool: (name, args) => T.call(name, args, { via: 'search-answer', levels }),
            onEvent: ev => { if (ev.type === 'call') { called.push(ev.name + '(' + JSON.stringify(ev.args) + ')'); tools.textContent = 'Read through: ' + called.join(' · ') } if (ev.type === 'answer') show(out, ev.content) },
        })
    }

    function init() {
        const m = d.getElementById('nr-search-page')
        if (!m) return
        const q0 = () => (new URLSearchParams(w.location.search).get('q') || '').trim()
        const box = d.createElement('section')
        box.className = 'nr-answer'
        const row = el('p'), btn = el('button', 'btn', 'Answer in words')
        btn.type = 'button'
        row.append(btn, ' ', el('span', 'nr-answer-hint', 'with your own OpenRouter key; only the question and what the tools read go to openrouter.ai'))
        const out = el('div', 'nr-answer-out'), tools = el('p', 'nr-answer-tools')
        out.setAttribute('aria-live', 'polite')
        box.append(row, out, tools)
        const form = m.querySelector('form')
        if (form) form.after(box); else m.prepend(box)
        btn.addEventListener('click', async () => {
            const input = m.querySelector('#nr-q'), q = (input && input.value.trim()) || q0()
            if (!q) { out.textContent = 'Type a question above first.'; return }
            btn.disabled = true; out.textContent = 'Reading the site…'; tools.textContent = ''
            try { await answer(q, out, tools) } catch (e) { out.textContent = 'No answer: ' + e.message } finally { btn.disabled = false }
        })
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init()
})(window, document)
