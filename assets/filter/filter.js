/* filter.js: a filter box for the long list pages (companies, people). The page puts ::: pt-filter with its prompt as the text; this
 * turns it into a search field that hides the list items (and the headings left empty) that do not contain what was typed, in
 * whichever view is open. Nothing is sent anywhere; no network. dev.pages@PrompTugal.dinis, 6 November 2026. */
(function (w, d) {
    'use strict'
    const host = d.querySelector('.pt-filter')
    if (!host) return
    const prompt = host.textContent.trim()
    const input = d.createElement('input')
    input.type = 'search'; input.placeholder = prompt; input.setAttribute('aria-label', prompt); input.className = 'pt-filter-input'
    host.textContent = ''; host.appendChild(input)
    const items = [...d.querySelectorAll('.view li')]
    const text = items.map(li => li.textContent.toLowerCase())
    const heads = [...d.querySelectorAll('.view h3')]
    function run() {
        const q = input.value.trim().toLowerCase(), words = q.split(/\s+/).filter(Boolean)
        items.forEach((li, i) => { li.hidden = words.length > 0 && !words.every(x => text[i].includes(x)) })
        // a heading shows only while something under it does
        heads.forEach(h => {
            let n = h.nextElementSibling, any = false
            while (n && !/^H[1-4]$/.test(n.tagName)) { if (n.querySelector && [...n.querySelectorAll('li')].some(li => !li.hidden)) any = true; n = n.nextElementSibling }
            h.hidden = words.length > 0 && !any
        })
    }
    input.addEventListener('input', run)
})(window, document)
