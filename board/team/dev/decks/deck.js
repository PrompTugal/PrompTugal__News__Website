// The deck player (investors@PrompTugal.dinis, 7 November 2026; Dinis: "a player, customised for multiple decks").
// One 1920x1080 slide at a time, fitted to the window; a toolbar: the decks, the languages, back and forward, the slide
// number, full screen, the PDF, all decks; keys (arrows, space, PageUp/PageDown, Home, End, F for full screen, S to
// stack every slide for scrolling); swipe on a phone; #3 in the address opens slide 3. The current slide gets the class
// "active", so a slide can animate (the live tour). Opened as a file or printed (no #deck-player data): every slide stacked.
(function () {
  // only a slide number is ever taken from the address (security@, 7 November 14:05)
  const slideHash = () => (location.hash.match(/^#\d{1,3}$/) || [''])[0]
    const deck = document.querySelector('.deck'); if (!deck) return
    const slides = [...deck.querySelectorAll('.slide')]
    const mount = document.getElementById('deck-player')
    let data = null; try { data = mount && JSON.parse(mount.dataset.player) } catch (e) { }
    const W = 1920, H = 1080
    const css = `
      .dp-bar{position:fixed;top:0;left:0;right:0;height:52px;display:flex;align-items:center;gap:10px;padding:0 14px;background:#121317;color:#f6f3ec;font:500 14px/1 "IBM Plex Sans",system-ui,sans-serif;z-index:20}
      .dp-bar a,.dp-bar button,.dp-bar select{color:#f6f3ec;background:transparent;border:1px solid #3a3b40;border-radius:6px;height:34px;padding:0 12px;font:inherit;text-decoration:none;display:inline-flex;align-items:center;cursor:pointer}
      .dp-bar a:hover,.dp-bar button:hover{border-color:#8fd18f} .dp-bar .on{background:#006600;border-color:#006600}
      .dp-bar select{max-width:340px;background:#121317} .dp-bar .grow{flex:1} .dp-bar .n{font-family:"IBM Plex Mono",monospace;min-width:72px;text-align:center}
      .dp-bar .brand{font:600 18px/1 Newsreader,Georgia,serif;letter-spacing:-.01em;margin-right:6px;border:0;padding:0}
      .dp-bar .brand .t{color:#ff7a7f}.dp-bar .brand .u{color:#8fd18f} .dp-langs{display:inline-flex;gap:6px} .dp-bar .dp-vote{border-style:dashed;color:#9a978f}
      body.dp-present{overflow:hidden;background:#2a2b2f;margin:0}
      body.dp-present .deck{position:fixed;left:0;top:52px;transform-origin:0 0}
      body.dp-present .slide{display:none;margin:0;box-shadow:none} body.dp-present .slide.active{display:flex}
      body.dp-stack .deck{transform-origin:0 0;margin-top:60px} body.dp-stack{background:#2a2b2f}
      .dp-hint{position:fixed;right:16px;bottom:14px;color:#9a978f;font:400 12px/1 "IBM Plex Mono",monospace;z-index:20}
      @media (max-width:760px){.dp-bar .wide,.dp-bar .brand{display:none}.dp-bar{gap:6px;padding:0 8px}.dp-bar select{max-width:104px;padding:0 6px}.dp-bar a,.dp-bar button{padding:0 8px}.dp-bar .n{min-width:44px}.dp-bar [data-a=full]{display:none}.dp-bar .dp-vote{padding:0 6px}.dp-hint{display:none}}
      @media print{.dp-bar,.dp-hint{display:none} body.dp-stack .deck,body.dp-present .deck{margin:0!important;transform:none!important;position:static!important} body{height:auto!important} body.dp-present .slide{display:flex!important}}`
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)

    let mode = data ? 'present' : 'stack', cur = 0
    const LN = { en: 'EN', pt: 'PT', es: 'ES', fr: 'FR', de: 'DE', it: 'IT', nl: 'NL', pl: 'PL', ro: 'RO', el: 'EL' }
    const nice = n => n.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
    let bar, num
    if (data) {
        bar = document.createElement('div'); bar.className = 'dp-bar'
        const opts = data.decks.map(d => `<option value="${d.href}"${d.name === data.name ? ' selected' : ''}>${d.name.replace(/^(\d+)-.*/, '$1')}. ${nice(d.name)}</option>`).join('')
        const langs = Object.entries(data.langs).map(([l, h]) => `<a href="${h}${slideHash()}" class="${l === data.lang ? 'on' : ''}" hreflang="${l}">${LN[l] || l}</a>`).join('')
        bar.innerHTML = `<a class="brand" href="${data.index}">Promp<span class="t">T</span><span class="u">ugal</span></a>
          <select aria-label="Deck">${opts}</select><span class="dp-langs">${langs}<a class="dp-vote" href="${data.index.replace(/decks\/index\.html$/, 'languages/index.html')}" title="Vote for the next language">+<span class="wide">&nbsp;vote</span></a></span><span class="grow"></span>
          <button data-a="prev" aria-label="Previous">&larr;</button><span class="n"></span><button data-a="next" aria-label="Next">&rarr;</button>
          <button data-a="stack" class="wide" title="All slides (S)">All</button><button data-a="full" title="Full screen (F)">&#x26F6;</button>
          ${data.pdf ? `<a class="wide" href="${data.pdf}" download>PDF</a>` : ''}<a class="wide" href="${data.index}">All decks</a>`
        document.body.prepend(bar); num = bar.querySelector('.n')
        bar.querySelector('select').onchange = e => { location.href = e.target.value }
        bar.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; ({ prev: () => go(cur - 1), next: () => go(cur + 1), stack: toggle, full })[a.dataset.a]() })
        const hint = document.createElement('div'); hint.className = 'dp-hint'; hint.textContent = '← → keys · F full screen · S all slides'; document.body.appendChild(hint)
        setTimeout(() => hint.remove(), 6000)
    }

    function fit() {
        if (mode === 'present') {
            const top = document.fullscreenElement ? 0 : 52, s = Math.min(innerWidth / W, (innerHeight - top) / H)
            deck.style.transform = `scale(${s})`; deck.style.left = ((innerWidth - W * s) / 2) + 'px'; deck.style.top = (top + (innerHeight - top - H * s) / 2) + 'px'
            if (bar) bar.style.display = document.fullscreenElement ? 'none' : 'flex'
        } else {
            const s = Math.min(1, (innerWidth - 32) / W); deck.style.transform = `scale(${s})`; deck.style.left = ''; deck.style.top = ''
            deck.style.marginLeft = ((innerWidth - W * s) / 2) + 'px'; document.body.style.height = (deck.scrollHeight * s + 120) + 'px'
            if (bar) bar.style.display = 'flex'
        }
    }
    function go(i) {
        cur = Math.max(0, Math.min(slides.length - 1, i))
        slides.forEach((s, k) => s.classList.toggle('active', k === cur))
        if (num) num.textContent = `${cur + 1} / ${slides.length}`
        if (mode === 'stack') scrollTo({ top: slides[cur].offsetTop * (deck.getBoundingClientRect().width / W) - 10, behavior: 'smooth' })
        history.replaceState(null, '', '#' + (cur + 1))
    }
    function setMode(m) {
        mode = m; document.body.classList.toggle('dp-present', m === 'present'); document.body.classList.toggle('dp-stack', m === 'stack')
        document.body.style.height = ''; deck.style.marginLeft = ''; fit(); go(cur)
        const b = bar && bar.querySelector('[data-a=stack]'); if (b) b.classList.toggle('on', m === 'stack')
    }
    const toggle = () => setMode(mode === 'present' ? 'stack' : 'present')
    function full() { if (document.fullscreenElement) document.exitFullscreen(); else { if (mode !== 'present') setMode('present'); document.documentElement.requestFullscreen && document.documentElement.requestFullscreen() } }

    addEventListener('resize', fit); document.addEventListener('fullscreenchange', fit); addEventListener('load', fit)
    addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('select,input,textarea')) return
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(cur + 1) }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(cur - 1) }
        else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1)
        else if ((e.key === 'f' || e.key === 'F') && data) full(); else if ((e.key === 's' || e.key === 'S') && data) toggle()
    })
    let x0 = null
    addEventListener('touchstart', e => { x0 = e.touches[0].clientX }, { passive: true })
    addEventListener('touchend', e => { if (x0 === null || mode !== 'present') return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null })
    if (mode === 'stack') addEventListener('scroll', () => { const s = deck.getBoundingClientRect().width / W; let i = 0; slides.forEach((sl, k) => { if (sl.offsetTop * s <= scrollY + innerHeight / 3) i = k }); if (i !== cur) { cur = i; slides.forEach((x, k) => x.classList.toggle('active', k === cur)); if (num) num.textContent = `${cur + 1} / ${slides.length}` } }, { passive: true })
    cur = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1))
    setMode(mode)
})()
