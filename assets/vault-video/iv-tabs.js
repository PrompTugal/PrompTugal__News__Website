// The article and transcript pills on an interview page (journalist@web-summit.indi, 10 November 2026, at Indi Gupte's
// word). The page has <div class="iv-tabs"> with two links (#article, #transcript) and two <div class="iv-panel">.
// Without this script both panels show, one after the other, and the links jump to each. With it, they become tabs:
// one panel at a time, #transcript in the address opens the transcript, the pills sit just under the site's nav while
// the reader scrolls, and switching while scrolled down goes back to the top of the panel.
(() => {
    'use strict'
    const bar = document.querySelector('.iv-tabs'), panels = [...document.querySelectorAll('.iv-panel')]
    const tabs = bar ? [...bar.querySelectorAll('a')] : []
    if (tabs.length !== 2 || panels.length !== 2) return
    const group = tabs[0].parentElement
    group.classList.add('iv-pills'); group.setAttribute('role', 'tablist'); group.setAttribute('aria-label', 'Article or transcript')
    tabs.forEach((t, i) => {
        t.classList.add('iv-pill'); t.setAttribute('role', 'tab'); t.id = 'iv-tab-' + i
        panels[i].setAttribute('role', 'tabpanel'); panels[i].setAttribute('aria-labelledby', t.id)
    })
    const nav = document.querySelector('nav.site')
    const setTop = () => document.documentElement.style.setProperty('--iv-top', (nav && getComputedStyle(nav).position === 'sticky' ? nav.offsetHeight : 0) + 'px')
    setTop(); addEventListener('resize', setTop)
    document.documentElement.classList.add('iv-js')

    function show(i, scroll) {
        tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j })
        const top = parseFloat(getComputedStyle(bar).top) || 0
        if (scroll && bar.getBoundingClientRect().top <= top + 1)
            scrollTo({ top: scrollY + panels[i].getBoundingClientRect().top - bar.offsetHeight - top - 8 })
    }
    const fromHash = () => {
        const h = decodeURIComponent(location.hash.slice(1)), el = h && document.getElementById(h)
        return el && panels[1].contains(el) ? 1 : 0
    }
    group.addEventListener('click', e => {
        const i = tabs.indexOf(e.target.closest('a')); if (i < 0) return
        e.preventDefault(); show(i, true)
        history.replaceState(null, '', i ? '#transcript' : location.pathname + location.search)
    })
    group.addEventListener('keydown', e => {
        const i = tabs.indexOf(document.activeElement); if (i < 0 || !/^Arrow(Left|Right)$/.test(e.key)) return
        tabs[1 - i].focus(); show(1 - i, true)
    })
    addEventListener('hashchange', () => { const i = fromHash(); show(i, false); const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView() })
    const first = fromHash(); show(first, false)
    if (first) bar.scrollIntoView()
})()
