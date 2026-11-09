/* assets/meter/meter.js: the reading meter on every page of promptugal.news (brief 7).
 *
 * A classic script (the shell loads feature scripts with <script defer>) that:
 *   1. reads the meter's config (api/v1/billing/meter.json, made from data/billing/prices.json and topup.json);
 *   2. loads newsroom.sgit.ai's meter core, vendored unedited (assets/components/sg-meter/v1/v1.5/v1.5.0/sg-meter-core.js),
 *      with this site's storage key, and opens this page on it: the page's kind is its <meta name="page-type">, and,
 *      for a type that decays, its freshness tier from <meta name="page-date"> (fresh, new, current, archive);
 *   3. measures the share of the page READ (a block of text counts once it has been on screen long enough to read it)
 *      and charges that share of the price, never less than a tenth (meter.reach, which only grows);
 *   4. draws, in the designer's classes: the balance chip (.tool.meter) in #nr-tools, the line at the foot of the page
 *      (.meter-line) with the rating and "do not charge me", and the account, top-up and topped-up views on their pages.
 *
 * The rules are the core's and are not changed here: once per page per browser session, never blocking, the balance
 * may go below zero, a usefulness rating re-prices (1 free, 3 the price, 5 double), a decline refunds and keeps the
 * reason, a payment reference is credited once. Everything is kept in this browser's localStorage. Nothing is sent
 * anywhere. Data from pages and readers is only ever set with textContent.
 *
 * For other scripts: window.__meter = { meter, ready (a promise), share() }, and the core's events on document
 * (sg:meter.changed, sg:meter.charged, sg:meter.rated, sg:meter.declined, sg:meter.toppedup, sg:meter.restored).
 */
(function () {
    'use strict'
    var script = document.currentScript
    var ROOT = new URL('../../', script ? script.src : location.href)            // assets/meter/ -> the site root
    var CORE = 'assets/components/sg-meter/v1/v1.5/v1.5.0/sg-meter-core.js'
    var CONFIG = 'api/v1/billing/meter.json'
    var at = function (p) { return new URL(p, ROOT).href }

    // ------------------------------------------------------------ small helpers
    function h(tag, attrs) {
        var el = document.createElement(tag)
        for (var k in (attrs || {})) {
            var v = attrs[k]
            if (v === false || v == null) continue
            if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v)
            else el.setAttribute(k, v === true ? '' : v)
        }
        for (var i = 2; i < arguments.length; i++) add(el, arguments[i])
        return el
    }
    function add(el, kid) {
        if (kid == null || kid === false) return
        if (Array.isArray(kid)) { kid.forEach(function (k) { add(el, k) }); return }
        el.append(kid instanceof Node ? kid : String(kid))
    }
    // replaceChildren would print a null as text: drop the nulls first
    function put(el) { var kids = [].slice.call(arguments, 1).filter(function (k) { return k != null && k !== false }); el.replaceChildren.apply(el, kids) }
    var meta = function (n) { var m = document.querySelector('meta[name="' + n + '"]'); return m ? m.getAttribute('content') || '' : '' }
    var when = function (iso) { try { return new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) } catch (e) { return String(iso || '').slice(0, 16) } }

    // ------------------------------------------------------------ the page's kind: its type, and how fresh it is
    function tierOf(cfg, date) {
        var days = date ? (Date.now() - Date.parse(date + 'T00:00:00Z')) / 864e5 : 1e9
        for (var i = 0; i < cfg.tiers.length; i++) if (cfg.tiers[i].max_days != null && days <= cfg.tiers[i].max_days) return cfg.tiers[i].tier
        return cfg.tiers[cfg.tiers.length - 1].tier
    }
    function kindOf(cfg) {
        var type = meta('page-type') || 'site', date = meta('page-date')
        var t = cfg.types[type]
        if (!t) return { type: type, kind: 'site', tier: '' }
        if (!t.decays || !date) return { type: type, kind: type, tier: '' }
        var tier = tierOf(cfg, date)
        return { type: type, kind: type + '_' + tier, tier: tier }
    }
    var kindLabel = function (kind) { return String(kind || '').replace('_', ' · ') }

    // ------------------------------------------------------------ the mount points (the designer's shell will have them)
    function tools() {
        var t = document.getElementById('nr-tools')
        if (t) return t
        t = h('div', { class: 'tools', id: 'nr-tools' })
        var row = document.querySelector('nav.site .row') || document.querySelector('nav.site')
        if (row) row.append(t); else document.body.prepend(t)
        return t
    }

    // ------------------------------------------------------------ the share read
    /**
     * A block of text (a paragraph, a list item, a heading, a table row, a picture) counts as read once it has been on
     * screen, in a visible tab, for long enough to read it: 40 ms a word (a skim at 1,500 words a minute), at least
     * 0.4 s and at most 6 s. The share read is the words of the blocks read over all the words. Scrolling past is not
     * reading: a fast scroll to the end leaves the minimum.
     */
    function measure(onShare) {
        var main = document.querySelector('main') || document.body
        var all = [].slice.call(main.querySelectorAll('.lead, .body p, .body li, .body h2, .body h3, .body pre, .body blockquote, .body tr, .body dt, .body dd'))
        var blocks = all.filter(function (el) {
            if (el.closest('.nr-mount, .meter-line, .agent-block')) return false
            for (var p = el.parentElement; p && p !== main; p = p.parentElement) if (all.indexOf(p) >= 0) return false
            return true
        }).map(function (el) {
            var words = Math.max(1, (el.textContent || '').trim().split(/\s+/).length)
            return { el: el, words: words, need: Math.min(6000, Math.max(400, words * 40)), seen: 0, on: false, read: false }
        })
        var total = blocks.reduce(function (s, b) { return s + b.words }, 0)
        var share = 0
        api.share = function () { return share }
        if (!total || !('IntersectionObserver' in window)) return
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var b = blocks.find(function (x) { return x.el === e.target })
                if (!b) return
                var vh = window.innerHeight || 800
                b.on = e.isIntersecting && (e.intersectionRatio >= 0.6 || e.intersectionRect.height >= vh * 0.5)
            })
        }, { threshold: [0, 0.3, 0.6, 0.9, 1] })
        blocks.forEach(function (b) { io.observe(b.el) })
        var last = performance.now()
        setInterval(function () {
            var now = performance.now(), dt = Math.min(1000, now - last)
            last = now
            if (document.visibilityState === 'hidden') return
            var changed = false
            blocks.forEach(function (b) {
                if (b.read || !b.on) return
                b.seen += dt
                if (b.seen >= b.need) { b.read = true; changed = true; io.unobserve(b.el) }
            })
            if (!changed) return
            var read = blocks.reduce(function (s, b) { return s + (b.read ? b.words : 0) }, 0)
            share = read / total
            onShare(share)
        }, 250)
    }

    // ------------------------------------------------------------ the views
    var api = { ready: null, meter: null, share: function () { return 0 } }
    window.__meter = api

    function chip(m) {
        var t = tools()
        var a = document.getElementById('nr-meter-chip') || t.querySelector('.meter')      // the shell's own chip, if it draws one
        if (a && !a.id) { a.id = 'nr-meter-chip'; a.href = at(m.cfg.links.account) }
        if (!a) {
            a = h('a', { class: 'tool meter', id: 'nr-meter-chip', href: at(m.cfg.links.account) })
            var vb = document.getElementById('nr-vault-btn')
            if (vb && vb.parentNode === t) t.insertBefore(a, vb); else t.append(a)
        }
        var b = m.state.balance
        a.classList.toggle('is-low', b < 100)
        a.classList.toggle('is-neg', b < 0)
        a.replaceChildren('Free credit')   // no ticking amount (designer@'s A2): it is in the title, the label and /account/
        a.setAttribute('aria-label', 'Reading credit ' + m.money(b) + ', kept in this browser: your account')
        a.title = b < 0 ? 'You have read ' + m.money(-b) + ' more than your credit. Nothing is blocked; top up whenever it feels fair. Kept in this browser only.' : 'Free to read: nothing is charged. Credit left: ' + m.money(b) + ', kept in this browser only; top up only if you want to'
    }

    var REASONS = [['clickbait', 'The headline promised more than the page gave'], ['not-relevant', 'Not relevant to me'], ['did-not-read', 'I did not really read it'], ['other', 'Another reason']]
    var USEFUL = ['Not useful', 'A little', 'As priced', 'Very', 'Excellent']

    function footLine(m, k) {
        var body = document.querySelector('main .body')
        if (!body || m.status === 'free' || m.status === 'idle' || !m.entry) return
        var line = document.getElementById('nr-meter-line')
        if (!line) { line = h('div', { class: 'meter-line nr-meter-line', id: 'nr-meter-line', role: 'note' }); body.append(line) }
        var e = m.entry, s = m.state
        // one line, collapsed (designer@'s A2, board/spec-the-reading-credit.md): the numbers open on a tap
        var wasOpen = line.querySelector('details.nr-foot') && line.querySelector('details.nr-foot').open
        var fold = function (kids) { return h('details', { class: 'nr-foot', open: wasOpen }, h('summary', {}, 'Free to read. ', h('a', { href: at(m.cfg.links.account) }, 'How the reading credit works')), h('div', { class: 'nr-foot-in' }, kids)) }
        var bal = h('span', {}, 'Balance ', h('a', { href: at(m.cfg.links.account) }, h('b', {}, m.money(s.balance))))
        if (m.status === 'declined' || e.declined) {
            var why = (REASONS.find(function (r) { return r[0] === (e.declined && e.declined.reason) }) || ['', 'no reason given'])[1]
            line.replaceChildren(fold([h('span', {}, h('b', {}, 'Not charged. '), 'You said: ' + why + '. Kept in your history, in this browser only.'), bal]))
            return
        }
        var pct = Math.round((e.depth || 0) * 100)
        var r = e.rating || {}
        var open = line.querySelector('details') && line.querySelector('details').open
        var reasons = line.querySelector('.nr-reasons') && !line.querySelector('.nr-reasons').hidden
        var reasonBox = h('div', { class: 'nr-reasons', hidden: !reasons },
            h('p', { class: 'nr-q' }, 'Why not?'),
            REASONS.map(function (x) { return h('button', { type: 'button', class: 'chip', onclick: function () { m.decline(x[0]) } }, x[1]) }))
        line.replaceChildren(fold([
            h('span', {}, 'This page ', h('b', {}, m.pence(e.cost)), ' of ' + m.pence(m.price * (r.useful ? m.cfg.rating.price[r.useful - 1] : 1)) + ' · read ' + pct + '%'),
            h('span', { class: 'meter-bar', 'aria-hidden': 'true' }, h('i', { style: 'width:' + pct + '%' })),
            bal,
            h('details', { class: 'nr-rate', open: open },
                h('summary', {}, 'Rate it, or do not pay for it'),
                h('p', { class: 'nr-q', id: 'nr-q-useful' }, 'How useful was it? It sets the price: not useful is free, excellent is double.'),
                h('div', { class: 'nr-scale', role: 'group', 'aria-labelledby': 'nr-q-useful' },
                    USEFUL.map(function (lab, i) {
                        var on = (r.useful || 3) === i + 1
                        return h('button', { type: 'button', class: 'chip' + (r.useful ? '' : ' untouched'), 'aria-pressed': on ? 'true' : 'false', onclick: function () { m.rate('useful', i + 1) } }, (i + 1) + ' ' + lab)
                    })),
                h('p', { class: 'nr-q' }, h('button', { type: 'button', class: 'btn quiet nr-decline', onclick: function () { var x = line.querySelector('.nr-reasons'); x.hidden = !x.hidden } }, 'Do not charge me for this page')),
                reasonBox,
                h('p', { class: 'nr-small' }, 'Priced as ' + kindLabel(e.kind) + ': ' + m.pence(m.price) + ' read to the end. ', h('a', { href: at(m.cfg.links.how) }, 'How pages are priced'), '. Kept in this browser only.'))]))
    }

    // the account page: balance, history, receipts, export and restore
    function accountView(m, el) {
        var s = m.state
        var showAll = el.getAttribute('data-all') === '1'
        var log = s.log || []
        var rows = (showAll ? log : log.slice(0, 50)).map(function (e) {
            var cost = e.declined ? h('span', {}, 'declined', h('br'), h('span', { class: 'meta' }, (REASONS.find(function (r) { return r[0] === e.declined.reason }) || ['', ''])[1])) : m.pence(e.cost)
            return h('tr', {},
                h('td', {}, h('a', { href: e.path }, e.title || e.path), h('br'), h('span', { class: 'meta' }, when(e.at) + (e.device ? ' · from another device' : ''))),
                h('td', {}, kindLabel(e.kind)),
                h('td', { class: 'num' }, Math.round((e.depth || 0) * 100) + '%'),
                h('td', { class: 'num' }, e.rating && e.rating.useful ? e.rating.useful + '/5' : '·'),
                h('td', { class: 'num' }, cost))
        })
        var file = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', id: 'nr-restore-file' })
        var out = h('p', { class: 'meta', id: 'nr-account-out', 'aria-live': 'polite' })
        file.addEventListener('change', function () {
            var f = file.files && file.files[0]
            if (!f) return
            if (!confirm('Replace the reading account in this browser with the one in ' + f.name + '?')) return
            f.text().then(function (t) { var err = m.restore(t); out.textContent = err || 'Restored from ' + f.name + '.' })
        })
        var tops = (s.topups || []).map(function (t) {
            return h('li', {}, h('b', {}, String(t.ref)), ' ' + when(t.at) + ': ' + m.money(t.credit) + ' of credit, ' + (t.source === 'link' ? 'from the payment page (not verified by this page)' : 'simulated, nothing charged') + (t.device ? ', from another device' : ''))
        })
        put(el,
            h('div', { class: 'balance-card' },
                h('div', {},
                    h('p', { class: 'label' }, 'Balance'),
                    h('p', { class: 'amount', id: 'nr-balance' }, m.money(s.balance)),
                    h('p', { class: 'sub' }, (s.reads || 0) + ' page' + (s.reads === 1 ? '' : 's') + ' opened in this browser · ' + m.money(s.spent || 0) + ' spent' + (s.declined ? ' · ' + m.money(s.declined) + ' declined' : '') + ((s.topups || []).length ? ' · ' + s.topups.length + ' top-up' + (s.topups.length === 1 ? '' : 's') : '')),
                    m.noStorage ? h('p', { class: 'sub warn' }, 'This browser refuses to keep a balance (private mode or blocked storage): the meter counts this page only.') : null),
                h('div', { class: 'actions' },
                    h('a', { class: 'btn primary', href: at(m.cfg.links.topup) }, 'Top up ' + m.money(m.cfg.topup.amount)),
                    h('button', { type: 'button', class: 'btn quiet', onclick: function () { if (window.__vault) window.__vault.open('vault') } }, 'Carry it to another device'))),
            h('h2', { id: 'history' }, 'What you have read'),
            rows.length
                ? h('div', { class: 'table' }, h('table', { class: 'ledger' },
                    h('thead', {}, h('tr', {}, h('th', {}, 'Page'), h('th', {}, 'Kind'), h('th', { class: 'num' }, 'Read'), h('th', { class: 'num' }, 'Rated'), h('th', { class: 'num' }, 'Charged'))),
                    h('tbody', {}, rows)))
                : h('p', { class: 'empty' }, 'Nothing yet: the pages you read appear here, with what each cost.'),
            log.length > 50 && !showAll ? h('p', {}, h('button', { type: 'button', class: 'btn quiet', onclick: function () { el.setAttribute('data-all', '1'); accountView(m, el) } }, 'Show all ' + log.length)) : null,
            h('h2', { id: 'receipts' }, 'Receipts'),
            tops.length ? h('ul', {}, tops) : h('p', { class: 'empty' }, 'No top-ups yet.'),
            h('h2', { id: 'export' }, 'Your data'),
            h('p', {}, 'Everything above is in this browser’s storage and nowhere else, unless you put it in your vault. Export it as a file to keep, or restore one into this browser (it replaces what is here).'),
            h('p', { class: 'nr-actions' },
                h('button', { type: 'button', class: 'btn quiet', id: 'nr-export', onclick: function () { exportJson(m) } }, 'Export as JSON'),
                h('label', { class: 'btn quiet', for: 'nr-restore-file' }, 'Restore from a file'), file),
            out)
    }
    function exportJson(m) {
        var blob = new Blob([JSON.stringify(m.state, null, 1)], { type: 'application/json' })
        var a = h('a', { href: URL.createObjectURL(blob), download: 'reading-account-' + location.host + '-' + new Date().toISOString().slice(0, 10) + '.json' })
        document.body.append(a); a.click(); a.remove()
    }

    var hostOf = function (u) { try { return new URL(String(u).replace('{CHECKOUT_SESSION_ID}', 'x')).host } catch (e) { return '' } }

    // the top-up page: three steps and the real payment link
    function topupView(m, el) {
        var t = m.cfg.topup, s = m.state
        var elsewhere = hostOf(m.cfg.returns_to) !== location.host && hostOf(m.cfg.returns_to) !== hostOf(m.cfg.our_return) ? hostOf(m.cfg.returns_to) : ''
        if (!t.link) {
            el.replaceChildren(h('p', { class: 'notice' }, 'Top-ups are switched off on this site for now: no payment link is configured. Every page still opens.'))
            return
        }
        el.replaceChildren(
            h('ol', { class: 'steps' },
                h('li', { class: 'done' }, h('strong', {}, 'Your balance now'), h('br'), h('span', { class: 'meta' }, m.money(s.balance) + ', in this browser')),
                h('li', {}, h('strong', {}, 'Pay ' + m.money(t.amount) + ' by card'), h('br'), h('span', { class: 'meta' }, 'On Stripe’s own page. We never see your card.')),
                h('li', {}, h('strong', {}, 'Come back, with ' + m.money(s.balance + t.amount)), h('br'),
                    h('span', { class: 'meta' }, elsewhere
                        ? 'Stripe returns you to ' + elsewhere + '’s topped-up page (this site shares its payment link for now). Copy that page’s address and paste it into this site’s topped-up page to add the credit here.'
                        : 'Stripe returns you to this site’s topped-up page, which adds it once.'))),
            h('p', {}, h('a', { class: 'btn primary nr-pay', id: 'nr-pay', href: t.link, rel: 'noopener', onclick: function () { try { localStorage.setItem(m.cfg.storageKey + '.paying', new Date().toISOString()) } catch (e) { /* fine */ } } }, 'Continue to pay ' + m.money(t.amount))),
            h('p', {}, h('a', { class: 'btn quiet', href: at(m.cfg.links.account) }, 'Not now')))
    }

    // the page a payment returns to: once per payment reference, unverified by design
    function toppedView(m, el) {
        var t = m.cfg.topup
        var done = function (added, id) {
            el.replaceChildren(h('div', { class: 'balance-card' },
                h('div', {},
                    h('p', { class: 'label' }, added ? 'Thank you' : 'Already added'),
                    h('p', { class: 'amount', id: 'nr-topped-amount' }, added ? m.money(t.amount) + ' added' : 'Nothing more'),
                    h('p', { class: 'sub' }, added ? 'Your balance in this browser is now ' + m.money(m.state.balance) + '. Stripe emails the receipt. Reference ' + id.slice(0, 18) + '…'
                                                   : 'This payment was added to this browser before. Balance ' + m.money(m.state.balance) + '.')),
                h('div', { class: 'actions' }, h('a', { class: 'btn primary', href: at(m.cfg.links.account) }, 'Your account'))))
        }
        var q = location.search.match(/[?&]session_id=([^&]+)/)
        if (q) { var id = decodeURIComponent(q[1]).slice(0, 120); done(m.credit(t.amount, 'link', id), id); return }
        var input = h('input', { type: 'text', class: 'input', id: 'nr-paste', autocomplete: 'off', placeholder: 'https://newsroom.sgit.ai/account/topped-up.html?session_id=cs_live_…' })
        var msg = h('p', { class: 'meta', 'aria-live': 'polite' })
        el.replaceChildren(
            h('p', {}, 'There is no payment reference in this page’s address. If Stripe returned you to another page after paying, paste its address here.'),
            h('div', { class: 'field' }, h('label', { for: 'nr-paste' }, 'The address Stripe returned you to'), input, h('span', { class: 'hint' }, 'It ends in ?session_id=… Only that reference is read; it is kept in this browser to add the credit once.')),
            h('p', {}, h('button', { type: 'button', class: 'btn primary', id: 'nr-paste-add', onclick: function () {
                var v = input.value.trim(), mm = v.match(/session_id=([A-Za-z0-9_]+)/) || v.match(/^(cs_[A-Za-z0-9_]+)$/)
                if (!mm) { msg.textContent = 'That has no payment reference in it: it should contain session_id= followed by an id starting cs_.'; return }
                done(m.credit(t.amount, 'link', mm[1]), mm[1])
            } }, 'Add the credit')),
            msg)
    }

    // ------------------------------------------------------------ boot
    api.ready = (async function () {
        var cfg
        try { var r = await fetch(at(CONFIG), { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status); cfg = await r.json() }
        catch (e) { console.warn('reading meter: no config (' + e.message + '); nothing is charged'); return null }
        cfg.root = ROOT.href
        window.SG_METER_CONFIG = cfg
        var mod = await import(at(CORE))
        var m = mod.meter
        api.meter = m
        var k = kindOf(cfg)
        m.open({ kind: k.kind, date: meta('page-date'), topics: [k.type], title: (document.querySelector('main h1') || {}).textContent || document.title })
        if (m.status === 'reading') m.reach(0)                       // opening a page costs the minimum, a tenth
        var paint = function () {
            chip(m)
            footLine(m, k)
            var a = document.getElementById('nr-account'); if (a) accountView(m, a)
            var t = document.getElementById('nr-topup'); if (t) topupView(m, t)
        }
        var tu = document.getElementById('nr-topped'); if (tu) toppedView(m, tu)
        paint()
        document.addEventListener('sg:meter.changed', paint)
        if (m.status === 'reading') measure(function (share) { m.reach(share) })
        return m
    })()
})()
