/* offline.js: the page's side of the offline mode (the service worker is /sw.js, made by
 * newsroom/build/features/offline.mjs). On every page: registers the worker, adds the web app manifest, says when the
 * reader is offline and when this copy was kept; on an article, a "Save for offline" button. window.PTOffline:
 * save(url), remove(url), saved() (the saved pages), clear() (every copy this site kept on the device). Tools
 * offline.saved (read), offline.save and offline.clear (view). Cache Storage, never localStorage. */
(function () {
    if (!('serviceWorker' in navigator) || !window.caches) return
    var site = function () { return window.NRSite }, url = function (p) { return site() && site().url ? String(site().url(p)) : new URL(p, location.href).href }
    var key = function (u) { var x = new URL(u, location.href); return x.origin + x.pathname }
    var SAVED = 'pt-saved'

    function save(u) {
        u = u || location.href
        var here = key(u) === key(location.href)
        var imgs = here ? [].slice.call(document.querySelectorAll('main img')).map(function (i) { return i.currentSrc || i.src }).filter(function (s) { return s && new URL(s).origin === location.origin }) : []
        return caches.open(SAVED).then(function (c) {
            return Promise.all([u].concat(imgs).map(function (s) {
                return fetch(s, { cache: 'no-cache' }).then(function (r) {
                    if (!r.ok) return
                    var h = new Headers(r.headers); h.set('x-pt-saved', new Date().toISOString()); if (s === u) h.set('x-pt-title', encodeURIComponent(here ? document.title : ''))
                    return r.blob().then(function (b) { return c.put(key(s), new Response(b, { status: r.status, headers: h })) })
                })
            }))
        }).then(function () { return { saved: key(u), images: imgs.length } })
    }
    function remove(u) { return caches.open(SAVED).then(function (c) { return c.delete(key(u || location.href)) }) }
    function saved() {
        return caches.open(SAVED).then(function (c) { return c.keys().then(function (ks) {
            return Promise.all(ks.filter(function (k) { return /\/$|\.html$/.test(new URL(k.url).pathname) }).map(function (k) { return c.match(k).then(function (r) { return { url: k.url, title: decodeURIComponent(r.headers.get('x-pt-title') || ''), saved: r.headers.get('x-pt-saved') } }) }))
        }) })
    }
    function clear() { return caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^pt-/.test(k) }).map(function (k) { return caches.delete(k) })) }).then(function () { return { cleared: true } }) }
    window.PTOffline = { save: save, remove: remove, saved: saved, clear: clear };
    (window.__toolQueue = window.__toolQueue || []).push(
        ['register', 'offline.saved', { level: 'read', description: 'The pages saved for offline on this device.', params: { type: 'object', properties: {} }, run: function () { return saved() } }],
        ['register', 'offline.save', { level: 'view', description: 'Save a page of this site for offline (default: this page).', params: { type: 'object', properties: { url: { type: 'string' } } }, run: function (a) { return save(a && a.url) } }],
        ['register', 'offline.clear', { level: 'view', description: 'Remove every copy this site kept on this device.', params: { type: 'object', properties: {} }, run: function () { return clear() } }])

    function when(iso) { var d = iso ? new Date(iso) : null; return d && !isNaN(d) ? d.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '' }
    function badge() {
        var b = document.querySelector('.pt-offline')
        if (navigator.onLine) { if (b) b.remove(); return }
        caches.match(key(location.href)).then(function (r) {
            if (!b) { b = document.createElement('p'); b.className = 'pt-offline'; b.setAttribute('role', 'status'); var m = document.querySelector('main'); if (m) m.prepend(b) }
            var t = r && when(r.headers.get('x-pt-saved'))
            b.textContent = t ? 'Offline. This copy was kept ' + t + '.' : 'Offline.'
        })
    }
    function button() {
        var meta = document.querySelector('meta[name="page-type"]'), head = document.querySelector('main .page-head')
        if (!meta || meta.content !== 'article' || !head) return
        var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pt-save-offline'
        function draw(on) { btn.textContent = on ? 'Saved for offline (remove)' : 'Save for offline'; btn.setAttribute('aria-pressed', on ? 'true' : 'false') }
        caches.open(SAVED).then(function (c) { return c.match(key(location.href)) }).then(function (r) { draw(!!r) })
        btn.addEventListener('click', function () {
            var on = btn.getAttribute('aria-pressed') === 'true'
            btn.disabled = true
            ;(on ? remove() : save()).then(function () { draw(!on) }, function () { btn.textContent = 'Could not save' }).then(function () { btn.disabled = false })
        })
        head.appendChild(btn)
    }
    // the kill switch (assets/offline/switch.json): off, every worker and copy of this site goes
    function off() {
        return navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister() })) }).then(clear)
    }
    // the footer's control (security@'s condition): clear every copy this site kept on this device
    function clearButton() {
        var slot = document.querySelector('footer .small'); if (!slot || slot.querySelector('.pt-offline-clear')) return
        var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-offline-clear'; b.textContent = 'Clear offline copies'
        b.addEventListener('click', function () { clear().then(function () { b.textContent = 'Offline copies cleared' }) })
        slot.appendChild(document.createTextNode(' · ')); slot.appendChild(b)
    }
    // the offline page's list (designer@'s O3): three groups, each copy with its time; the days in order
    function list() {
        var box = document.querySelector('.offline-list'); if (!box) return
        var title = function (r) { return r.clone().text().then(function (t) { var m = t.match(/<title>([^<]*)<\/title>/); return m ? m[1].replace(/ · PrompTugal\.news$/, '') : '' }) }
        var group = function (name, head) {
            return caches.keys().then(function (ks) { return ks.filter(function (k) { return k === name || (name === 'pt-shell-' && k.indexOf(name) === 0) }) }).then(function (ns) {
                return Promise.all(ns.map(function (n) { return caches.open(n).then(function (c) { return c.keys().then(function (ks) {
                    return Promise.all(ks.filter(function (k) { var p = new URL(k.url).pathname; return /\/$|\.html$/.test(p) && p.indexOf('/offline/') < 0 }).map(function (k) { return c.match(k).then(function (r) { return title(r).then(function (t) { return { url: k.url, title: t, at: r.headers.get('x-pt-saved') } }) }) }))
                }) }) })).then(function (all) { return { head: head, rows: [].concat.apply([], all).filter(function (x) { return x.title }).sort(function (a, b) { return a.url.localeCompare(b.url) }) } })
            })
        }
        Promise.all([group(SAVED, 'Articles you saved'), group('pt-shell-', 'Always kept'), group('pt-pages', 'Read on this device')]).then(function (gs) {
            box.replaceChildren(); var seen = {}
            gs.forEach(function (g) {
                var rows = g.rows.filter(function (x) { return !seen[x.url] && (seen[x.url] = 1) }); if (!rows.length) return
                var h = document.createElement('h2'); h.textContent = g.head; box.appendChild(h)
                var ul = document.createElement('ul'); ul.className = 'rows'
                rows.forEach(function (x) { var li = document.createElement('li'), a = document.createElement('a'); a.href = x.url; a.textContent = x.title; li.appendChild(a); if (x.at) { var s = document.createElement('small'); s.textContent = ' kept ' + when(x.at); li.appendChild(s) } ul.appendChild(li) })
                box.appendChild(ul)
            })
            if (!box.children.length) box.textContent = 'Nothing is kept on this device yet.'
        })
    }
    // offline, a link that opens from a kept copy says so (designer@'s O4)
    function marks() {
        document.querySelectorAll('a.pt-kept').forEach(function (a) { a.classList.remove('pt-kept') })
        if (navigator.onLine) return
        document.querySelectorAll('main a[href], .ctabs a[href]').forEach(function (a) {
            var u = new URL(a.href, location.href); if (u.origin !== location.origin) return
            caches.match(u.origin + u.pathname).then(function (r) { if (r) a.classList.add('pt-kept') })
        })
    }
    function start() {
        if (!document.querySelector('link[rel="manifest"]')) { var l = document.createElement('link'); l.rel = 'manifest'; l.href = url('assets/offline/manifest.webmanifest'); document.head.appendChild(l) }
        fetch(url('assets/offline/switch.json'), { cache: 'no-store' }).then(function (r) { return r.json() }).then(function (sw) {
            if (sw && sw.enabled === false) return off()
            return navigator.serviceWorker.register(url('sw.js'), { scope: url('') })
        }).catch(function () { })
        clearButton()
        badge(); button(); list(); marks()
        addEventListener('online', function () { badge(); marks() }); addEventListener('offline', function () { badge(); marks() })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
})()
