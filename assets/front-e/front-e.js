/* front-e.js: E, one of the home page's designs (Silvio's mock E; assets/design/ chooses between them). Once the page
 * is drawn: the countdown to Opening Night (gone after it), and Now and next drops what has ended. */
(function () {
    function pad(n) { return (n < 10 ? '0' : '') + n }
    function ready() {
        var cd = document.querySelector('.fe-cd'), at = cd && Date.parse(cd.getAttribute('data-at'))
        function tick() {
            var d = at - Date.now()
            if (!(d > 0)) { if (cd) cd.hidden = true; return false }
            var D = Math.floor(d / 864e5), H = Math.floor(d / 36e5) % 24, M = Math.floor(d / 6e4) % 60
            cd.querySelector('[data-cd]').textContent = D + 'd ' + H + 'h ' + pad(M) + 'm'
            return true
        }
        if (cd && tick()) setInterval(tick, 30000)
        var now = Date.now(), shown = 0
        document.querySelectorAll('.fe-nx li[data-end]').forEach(function (li) {
            var end = Date.parse(li.getAttribute('data-end'))
            if (end && end < now) li.remove(); else if (++shown > 6) li.remove()
        })
    }
    // the interviews band (features/interviews.mjs) is in the page's body, which E's design hides: bring it into E,
    // right after the lead (sherpa@'s R5, 10 November: on a phone no reader saw either interview)
    function interviews() {
        var band = document.querySelector('.interviews-band'), lead = document.querySelector('.fe .fe-band')
        if (!band || !lead || lead.parentNode.querySelector(':scope > .fe-iv')) return
        var box = document.createElement('section'); box.className = 'fe-iv fe-w'; box.appendChild(band); lead.parentNode.insertBefore(box, lead.nextSibling)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { ready(); interviews() }); else { ready(); interviews() }
})()
