/* Decks made from the data (data.places@PrompTugal.dinis): Present shows one slide at a time, full screen; arrows,
 * space and page keys move, Escape leaves. Without it the slides are a column you scroll; print gives one a page. */
(function () {
    'use strict'
    const deck = document.querySelector('.pq-deck'); if (!deck) return
    const slides = [...deck.querySelectorAll('.pq-slide')]; if (!slides.length) return
    const bar = document.querySelector('.pq-deckbar')
    let at = 0, count = null
    const show = i => { at = Math.max(0, Math.min(slides.length - 1, i)); slides.forEach((s, k) => s.classList.toggle('pq-on', k === at)); if (count) count.textContent = `${at + 1} / ${slides.length}` }
    function start(i) {
        deck.classList.add('pq-show'); document.documentElement.classList.add('pq-presenting')
        count = document.createElement('span'); count.className = 'pq-count'; document.body.append(count)
        show(i || 0)
        if (deck.requestFullscreen) deck.requestFullscreen().catch(() => {})
    }
    function stop() {
        deck.classList.remove('pq-show'); document.documentElement.classList.remove('pq-presenting')
        slides.forEach(s => s.classList.remove('pq-on')); if (count) { count.remove(); count = null }
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {})
        slides[at].scrollIntoView({ block: 'center' })
    }
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Present'
    btn.addEventListener('click', () => start(0))
    if (bar) bar.append(btn)
    slides.forEach((s, k) => s.addEventListener('dblclick', () => { if (!deck.classList.contains('pq-show')) start(k) }))
    deck.addEventListener('click', e => { if (!deck.classList.contains('pq-show') || e.target.closest('a')) return; show(at + (e.clientX > innerWidth / 3 ? 1 : -1)) })
    document.addEventListener('keydown', e => {
        if (!deck.classList.contains('pq-show')) return
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(at + 1) }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); show(at - 1) }
        else if (e.key === 'Home') show(0); else if (e.key === 'End') show(slides.length - 1)
        else if (e.key === 'Escape') stop()
    })
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && deck.classList.contains('pq-show')) stop() })
})()
