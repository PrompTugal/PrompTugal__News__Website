/* The site's menus in the reader's culture (Dinis, 9 November 19:25: 21 cultures, en-GB by default, never taken from the
 * browser, a globe button, the choice in this browser only). The same choice as the app (localStorage pt-culture). Only
 * the menus change: the sections, the tab bar, the date line's pills; articles stay in English, so the page keeps its
 * direction and each translated label carries its own lang. English readers load nothing more; another culture loads
 * assets/i18n/site.json once. dev@PrompTugal.dinis. */
(function () {
    'use strict'
    var KEY = 'pt-culture', btn = null, I = null, menu = null
    var me = document.currentScript, base = me ? me.src.replace(/assets\/i18n\/site-i18n\.js.*$/, '') : '/'
    function get() { try { return localStorage.getItem(KEY) || '' } catch (e) { return '' } }
    function put(v) { try { localStorage.setItem(KEY, v === 'en-GB' ? '' : v) } catch (e) { } }
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }
    function load() { return I ? Promise.resolve(I) : fetch(base + 'assets/i18n/site.json').then(function (r) { return r.json() }).then(function (j) { I = j; return j }) }
    // the English words, read once from the page, so English is restored without a fetch
    var EN = {}
    function apply(c, W) {
        document.querySelectorAll('[data-nav]').forEach(function (a) {
            var k = a.getAttribute('data-nav'), t = a.querySelector('span') || a
            if (!(k in EN)) EN[k] = t.textContent
            var v = W && W[k] ? W[k] : EN[k]; t.textContent = v
            if (W && c !== 'en-GB') { t.lang = c; t.dir = 'auto' } else { t.removeAttribute('lang'); t.removeAttribute('dir') }
        })
        var more = document.querySelector('.ctabs-more span'); if (more) { if (!('more' in EN)) EN.more = more.textContent; more.textContent = W && W.more || EN.more }
        var app = document.querySelector('.pt-app-btn'); if (app) { if (!('app' in EN)) EN.app = app.textContent; app.textContent = W && W.app || EN.app }
        if (btn) btn.querySelector('span').textContent = c.split('-')[0].toUpperCase()
        var note = document.querySelector('.em-i18n-note'); if (note) note.remove()
        if (W && W.note) { var n = el('p', 'em-i18n-note', W.note); n.lang = c; var dl = document.querySelector('.em-dl'); if (dl) dl.parentNode.insertBefore(n, dl.nextSibling) }
    }
    function choose(c) {
        put(c); close()
        if (c === 'en-GB') { apply('en-GB', null); return }
        load().then(function (j) { apply(c, j.words[c]) }).catch(function () { })
    }
    function close() { if (menu) menu.hidden = true; if (btn) btn.setAttribute('aria-expanded', 'false') }
    function open() {
        load().then(function (j) {
            if (!menu) { menu = el('div', 'em-langs'); menu.setAttribute('role', 'menu'); document.body.appendChild(menu) }
            menu.textContent = ''
            var c = get() || 'en-GB', W = j.words[c] || j.words['en-GB']
            if (c.indexOf('en-') !== 0) { var b = el('button', 'em-lang-back', 'EN · ' + W.back_en); b.type = 'button'; b.addEventListener('click', function () { choose('en-GB') }); menu.appendChild(b) }
            j.cultures.forEach(function (x) { var b = el('button', x.id === c ? 'on' : null, x.name); b.type = 'button'; b.lang = x.id; b.dir = x.dir; b.addEventListener('click', function () { choose(x.id) }); menu.appendChild(b) })
            var r = btn.getBoundingClientRect(); menu.style.top = (r.bottom + window.scrollY + 6) + 'px'; menu.hidden = false; btn.setAttribute('aria-expanded', 'true')
        }).catch(function () { })
    }
    function start() {
        btn = document.querySelector('.em-lang'); if (!btn) return
        btn.hidden = false
        btn.addEventListener('click', function () { if (menu && !menu.hidden) close(); else open() })
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close() })
        var c = get()
        if (c && c !== 'en-GB') load().then(function (j) { if (j.words[c]) apply(c, j.words[c]) }).catch(function () { })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
