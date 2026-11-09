/* The app beside the news (board/briefs/2026-11-09-the-app-on-the-web.md): an "App" button in the top bar. On a wide
 * screen it opens /app/ in a phone-shaped pane on the right and moves the site to the left, so nothing is hidden; on a
 * narrow one it opens /app/ itself, full screen. The pane's state is remembered in this browser only. dev@PrompTugal.dinis. */
(function () {
    'use strict'
    if (window.top !== window) return
    var home = document.querySelector('.ctop-home'); if (!home) return
    var up = (home.getAttribute('href') || 'index.html').replace(/index\.html$/, ''), url = up + 'app/index.html', KEY = 'pt-app-pane', WIDE = 1100
    var html = document.documentElement, pane = null
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }
    function remember(v) { try { localStorage.setItem(KEY, v ? '1' : '') } catch (e) { } }
    function make() {
        pane = el('aside', 'pt-pane'); pane.setAttribute('aria-label', 'The PrompTugal app')
        var bar = el('div', 'pt-pane-bar'), close = el('button', null, 'Close')   // Full screen is in the app's own bar (designer@'s AP3)
        close.type = 'button'; close.addEventListener('click', function () { set(false) })
        bar.appendChild(el('b', null, 'The app')); bar.appendChild(close)
        var phone = el('div', 'pt-pane-phone'), frame = el('iframe'); frame.title = 'The PrompTugal app'; frame.src = url
        phone.appendChild(frame); pane.appendChild(bar); pane.appendChild(phone); document.body.appendChild(pane)
    }
    function set(open) {
        if (open && !pane) make()
        if (pane) pane.hidden = !open
        html.classList.toggle('pt-pane-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); remember(open)
    }
    var btn = el('button', 'pt-app-btn', 'App'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.title = 'Open the summit app'
    btn.addEventListener('click', function () { if (innerWidth < WIDE) location.href = url; else set(!html.classList.contains('pt-pane-open')) })
    function place() { var slot = document.querySelector('.ctop-tools'); if (slot) slot.insertBefore(btn, slot.firstChild) }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place()
    addEventListener('resize', function () { if (innerWidth < WIDE && html.classList.contains('pt-pane-open')) set(false) })
    var was = ''; try { was = localStorage.getItem(KEY) } catch (e) { }
    if (was && innerWidth >= WIDE) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { set(true) }); else set(true) }
})()
