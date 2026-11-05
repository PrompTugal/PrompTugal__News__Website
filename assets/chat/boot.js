/* boot.js: the chat's only footprint on a page until it is opened: the Ask button in the top bar (#nr-tools), the
 * floating Ask button on a phone, and a lazy load of chat-core.js and chat.js. After graphs.sgit.ai's boot.js: the page
 * ships no chat code until the reader asks. The pane reopens by itself after the chat opened a page (sessionStorage).
 */
(function (w, d) {
    'use strict'
    const Site = w.NRSite
    if (!Site) return
    const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>'
    const askPage = Site.url('ask/index.html')
    let loading = null
    const script = src => new Promise((ok, no) => { const s = d.createElement('script'); s.src = Site.url(src); s.onload = ok; s.onerror = () => no(new Error(`${src} did not load`)); d.head.appendChild(s) })
    function load() {
        if (w.NRChat) return Promise.resolve(w.NRChat)
        if (!loading) {
            if (!d.querySelector('link[data-nr-chat]')) { const l = d.createElement('link'); l.rel = 'stylesheet'; l.href = Site.url('assets/chat/chat.css'); l.dataset.nrChat = '1'; d.head.appendChild(l) }
            loading = (w.NRChatCore ? Promise.resolve() : script('assets/chat/chat-core.js')).then(() => script('assets/chat/chat.js')).then(() => w.NRChat)
            loading.catch(() => { loading = null })
        }
        return loading
    }
    function open(opts) {
        return load().then(c => { c.open(opts); return c }).catch(e => { for (const b of d.querySelectorAll('.nr-ask')) { b.dataset.err = '1'; b.title = 'The chat did not load: ' + e.message } })
    }
    w.NRAsk = { open, load }

    function init() {
        const tools = Site.mount('nr-tools')
        let ask = tools.querySelector('.ask')
        if (!ask) {
            ask = d.createElement('a')
            ask.className = 'tool ask'
            ask.href = askPage
            ask.innerHTML = `${ICON}Ask`
            tools.appendChild(ask)
        }
        ask.classList.add('nr-ask')
        let fab = d.querySelector('.ask-fab')
        if (!fab) {
            fab = d.createElement('a')
            fab.className = 'ask-fab'
            fab.href = askPage
            fab.innerHTML = `${ICON}Ask`
            d.body.appendChild(fab)
        }
        fab.classList.add('nr-ask')
        for (const b of [ask, fab]) {
            b.setAttribute('aria-controls', 'chat')
            b.setAttribute('aria-label', 'Ask the newsroom')
            b.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); if (w.NRChat && w.NRChat.isOpen()) w.NRChat.close(); else open() })
        }
        let again = false
        try { again = sessionStorage.getItem('nr-chat:open') === '1' } catch (e) { /* fine */ }
        if (again || w.location.hash === '#chat' || new URLSearchParams(w.location.search).get('chat') === '1' || d.getElementById('nr-ask-page')) open({ restore: true })
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init()
})(window, document)
