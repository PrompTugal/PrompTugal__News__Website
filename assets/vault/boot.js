/* assets/vault/boot.js: the vault's small part on every page. A classic script (the shell loads feature scripts with
 * <script defer>); the pane itself (assets/vault/vault.js) and the vault library are loaded only when needed.
 *
 *   - puts the Vault button in the top bar (#nr-tools, made if the shell has none yet), with a count of what this
 *     browser holds that the vault does not;
 *   - opens the pane on the right (#nr-pane) when the button is pressed, on the vault page, on #vault, and on every
 *     page after it was left open (as newsroom.sgit.ai's pane does);
 *   - gives the site's other features window.__vault, the hook to keep data for the reader (assets/vault/README.md):
 *
 *       __vault.save(path, json)   kept in this browser at once, and written to the reader's vault (apps/<path>.json,
 *                                  one commit, published) when the vault is open in this tab with an access key;
 *                                  otherwise it waits for "Update the vault". Resolves { path, where: 'vault'|'browser', at }.
 *       __vault.load(path)         the vault's copy when the vault is open, else this browser's; null when neither has it
 *       __vault.list(prefix)       [{ path, at, where }] for paths under prefix ('chat/' for example)
 *       __vault.remove(path)       from this browser, and from the vault when it is open
 *       __vault.status()           { open, canWrite, device, pending }
 *       __vault.open(tab), __vault.close()
 *
 *     Events on window: nr-vault-saved { path, where }, nr-vault-status { open, canWrite }. A feature that would rather
 *     not call the object can dispatch window event nr-vault-save { detail: { path, data } }.
 *
 * Nothing here sends anything anywhere. A path is "<feature>/<name>[/...]" in [a-z0-9._-]; data is JSON, 256 KB at most.
 */
(function () {
    'use strict'
    var script = document.currentScript
    var ROOT = new URL('../../', script ? script.src : location.href)
    var K = { session: 'web-summit.newsroom.vault.session', open: 'web-summit.newsroom.vault.open', items: 'web-summit.newsroom.vault.items', last: 'web-summit.newsroom.vault.last-sync' }
    var MAX = 256 * 1024
    var PATH = /^[a-z0-9][a-z0-9-]*(\/[A-Za-z0-9][A-Za-z0-9._-]*)+$/
    var mod = null
    var load = function () { return mod || (mod = import(new URL('assets/vault/vault.js', ROOT).href)) }

    var ls = {
        get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch (e) { return d } },
        set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch (e) { return false } },
    }
    var session = function () { try { return JSON.parse(sessionStorage.getItem(K.session) || 'null') } catch (e) { return null } }
    var items = function () { var s = ls.get(K.items, null); return s && s.items ? s : { v: 1, items: {} } }
    var norm = function (p) { p = String(p || '').replace(/^\/+/, '').replace(/\.json$/, ''); return PATH.test(p) && p.indexOf('..') < 0 ? p : null }
    var emit = function (name, detail) { try { window.dispatchEvent(new CustomEvent(name, { detail: detail })) } catch (e) { /* fine */ } }

    function badge() {
        var b = document.getElementById('nr-vault-btn')
        if (!b) return
        var s = items(), n = Object.keys(s.items).filter(function (k) { return !s.items[k].in_vault }).length
        var p = b.querySelector('.pend')
        if (p) { p.textContent = n ? String(n) : ''; p.hidden = !n }
        b.classList.toggle('on', !!session())
    }

    var api = {
        version: 1,
        save: function (path, data) {
            var p = norm(path)
            if (!p) return Promise.reject(new Error('__vault.save: the path must be "<feature>/<name>", in a-z, 0-9, ".", "_" and "-": ' + path))
            var text
            try { text = JSON.stringify(data) } catch (e) { return Promise.reject(new Error('__vault.save: the data is not JSON')) }
            if (text === undefined) return Promise.reject(new Error('__vault.save: the data is not JSON'))
            if (text.length > MAX) return Promise.reject(new Error('__vault.save: ' + text.length + ' bytes; 256 KB at most'))
            var at = new Date().toISOString(), s = items()
            s.items[p] = { at: at, data: data, in_vault: false }
            var kept = ls.set(K.items, s)
            badge()
            var rec = session()
            if (!rec || !rec.token) { emit('nr-vault-saved', { path: p, where: kept ? 'browser' : 'nowhere' }); return Promise.resolve({ path: p, where: kept ? 'browser' : 'nowhere', at: at }) }
            return load().then(function (m) { return m.saveItem(p, data) }).then(function () {
                var s2 = items(); if (s2.items[p] && s2.items[p].at === at) { s2.items[p].in_vault = true; s2.items[p].vault_at = new Date().toISOString(); ls.set(K.items, s2) }
                badge(); emit('nr-vault-saved', { path: p, where: 'vault' })
                return { path: p, where: 'vault', at: at }
            }, function (e) {
                emit('nr-vault-saved', { path: p, where: 'browser', error: String(e && e.message || e) })
                return { path: p, where: 'browser', at: at, error: String(e && e.message || e) }
            })
        },
        load: function (path) {
            var p = norm(path)
            if (!p) return Promise.resolve(null)
            var local = items().items[p]
            if (!session()) return Promise.resolve(local ? local.data : null)
            return load().then(function (m) { return m.loadItem(p) }).then(function (v) { return v != null ? v : (local ? local.data : null) }, function () { return local ? local.data : null })
        },
        list: function (prefix) {
            var pre = String(prefix || '').replace(/^\/+/, '')
            var s = items(), out = {}
            Object.keys(s.items).forEach(function (k) { if (k.indexOf(pre) === 0) out[k] = { path: k, at: s.items[k].at, where: s.items[k].in_vault ? 'both' : 'browser' } })
            if (!session()) return Promise.resolve(Object.keys(out).sort().map(function (k) { return out[k] }))
            return load().then(function (m) { return m.listItems(pre) }).then(function (inVault) {
                (inVault || []).forEach(function (k) { out[k] = out[k] ? { path: k, at: out[k].at, where: 'both' } : { path: k, at: null, where: 'vault' } })
                return Object.keys(out).sort().map(function (k) { return out[k] })
            }, function () { return Object.keys(out).sort().map(function (k) { return out[k] }) })
        },
        remove: function (path) {
            var p = norm(path); if (!p) return Promise.resolve(false)
            var s = items(), had = !!s.items[p]; delete s.items[p]; ls.set(K.items, s); badge()
            if (!session()) return Promise.resolve(had)
            return load().then(function (m) { return m.removeItem(p) }).then(function (v) { return had || v }, function () { return had })
        },
        status: function () {
            var rec = session(), s = items()
            var raw = function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }
            return { open: !!rec, canWrite: !!(rec && rec.token), device: raw('web-summit.newsroom.device'),
                     pending: Object.keys(s.items).filter(function (k) { return !s.items[k].in_vault }).length, last_update: raw(K.last) }
        },
        open: function (tab) { return load().then(function (m) { m.open(tab || 'vault') }) },
        close: function () { if (mod) return load().then(function (m) { m.close() }) },
    }
    window.__vault = api
    window.addEventListener('nr-vault-save', function (e) { var d = e.detail || {}; api.save(d.path, d.data).catch(function (err) { console.warn(err.message) }) })

    // the Vault button, in the top bar
    function button() {
        var t = document.getElementById('nr-tools')
        if (!t) {
            t = document.createElement('div'); t.className = 'tools'; t.id = 'nr-tools'
            var row = document.querySelector('nav.site .row') || document.querySelector('nav.site')
            if (row) row.append(t); else document.body.prepend(t)
        }
        if (document.getElementById('nr-vault-btn')) return
        var own = t.querySelector('.vault-btn')                                       // the shell's own button, if it draws one
        if (own) { own.id = 'nr-vault-btn'; own.addEventListener('click', function (e) { e.preventDefault(); load().then(function (m) { m.toggle() }) }); badge(); return }
        var b = document.createElement('button')
        b.type = 'button'; b.className = 'tool vault-btn'; b.id = 'nr-vault-btn'
        b.setAttribute('aria-controls', 'nr-vault-pane'); b.setAttribute('aria-expanded', 'false')
        b.title = 'Your vault: your reading account, carried between your devices'
        var dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden', 'true')
        var label = document.createElement('span'); label.textContent = 'Vault'
        var pend = document.createElement('span'); pend.className = 'pend'; pend.hidden = true
        b.append(dot, label, pend)
        b.addEventListener('click', function () { load().then(function (m) { m.toggle() }) })
        t.append(b)
        badge()
    }
    button()

    // open on arrival: the vault page, #vault, or a pane left open on the page before
    var remembered = ''; try { remembered = sessionStorage.getItem(K.open) || '' } catch (e) { /* fine */ }
    var onVaultPage = !!document.getElementById('nr-vault')
    if (onVaultPage) {
        var m0 = document.getElementById('nr-vault')
        var go = document.createElement('p')
        var open = document.createElement('button'); open.type = 'button'; open.className = 'btn primary'; open.id = 'nr-vault-open'; open.textContent = 'Open your vault'
        open.addEventListener('click', function () { api.open('vault') })
        go.append(open)
        m0.replaceChildren(go)
    }
    if (onVaultPage || location.hash === '#vault' || remembered) api.open(remembered || 'vault')
})()
