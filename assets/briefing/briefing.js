// "Brief me on this page": a short slideshow built from a JSON block the page carries (script#briefing, filled at build
// from the page's own data). Plain DOM, textContent only, no third-party script. By dev.graphs@PrompTugal.dinis.
(() => {
    const tag = document.getElementById('briefing'); if (!tag) return
    let B; try { B = JSON.parse(tag.textContent) } catch { return }
    const el = (t, props, ...kids) => { const x = Object.assign(document.createElement(t), props); x.append(...kids); return x }
    const btn = el('button', { type: 'button', className: 'chip brief-open', textContent: B.button })
    const h1 = document.querySelector('main h1, h1'); if (!h1) return
    h1.insertAdjacentElement('afterend', el('p', { className: 'brief-cta' }, btn))
    let dlg, i = 0, last
    const stat = (s) => s.stat ? el('p', { className: 'brief-stat' }, el('strong', { textContent: s.stat }), ' ', el('span', { textContent: s.statLabel || '' })) : ''
    function render() {
        const s = B.slides[i], body = dlg.querySelector('.brief-body')
        body.replaceChildren(el('h2', { textContent: s.title }), stat(s), el('p', { textContent: s.text }))
        if (s.href) body.append(el('p', {}, el('a', { href: B.root + s.href, textContent: s.link || s.href })))
        dlg.querySelector('.brief-n').textContent = B.label.replace('{n}', i + 1).replace('{total}', B.slides.length)
        dlg.querySelector('.brief-dots').replaceChildren(...B.slides.map((_, k) => el('span', { className: k === i ? 'on' : '' })))
        dlg.querySelector('[data-prev]').disabled = i === 0
        dlg.querySelector('[data-next]').disabled = i === B.slides.length - 1
    }
    const close = () => { dlg.hidden = true; document.removeEventListener('keydown', key); (last || btn).focus() }
    function key(e) {
        if (e.key === 'Escape') close()
        else if (e.key === 'ArrowRight' && i < B.slides.length - 1) { i++; render() }
        else if (e.key === 'ArrowLeft' && i > 0) { i--; render() }
        else if (e.key === 'Tab') { const f = [...dlg.querySelectorAll('button:not(:disabled), a')]; if (!f.length) return; const a = document.activeElement, first = f[0], lastEl = f[f.length - 1]
            if (e.shiftKey && a === first) { e.preventDefault(); lastEl.focus() } else if (!e.shiftKey && a === lastEl) { e.preventDefault(); first.focus() } }
    }
    function open() {
        last = document.activeElement
        if (!dlg) {
            dlg = el('div', { className: 'brief', hidden: true }, el('div', { className: 'brief-card' },
                el('div', { className: 'brief-body' }), el('div', { className: 'brief-dots' }), el('p', { className: 'brief-n' }),
                el('div', { className: 'brief-nav' }, el('button', { type: 'button', className: 'chip', textContent: B.prev }), el('button', { type: 'button', className: 'chip', textContent: B.next }), el('button', { type: 'button', className: 'chip', textContent: B.close }))))
            const b = dlg.querySelectorAll('.brief-nav button'); b[0].dataset.prev = ''; b[1].dataset.next = ''
            b[0].addEventListener('click', () => { if (i > 0) { i--; render() } }); b[1].addEventListener('click', () => { if (i < B.slides.length - 1) { i++; render() } }); b[2].addEventListener('click', close)
            dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', B.button)
            dlg.addEventListener('click', e => { if (e.target === dlg) close() })
            document.body.append(dlg)
        }
        i = 0; render(); dlg.hidden = false; document.addEventListener('keydown', key); dlg.querySelector('[data-next]').focus()
    }
    btn.addEventListener('click', open)
})()
