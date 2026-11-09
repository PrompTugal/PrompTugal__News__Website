/* lists.js: the list pages as applications (designer.experiments@'s switch.mjs, the approved mock-ups): companies and
 * people. Reads the page's own JSON (.ls-data), draws the view, filters live, and keeps the view and the search in the
 * URL hash and the view in this browser (localStorage, in a try/catch). Nothing leaves the browser. Without script the
 * page shows its static views. DOM built with createElement, never markup in strings. dev.pages@PrompTugal.dinis. */
(function () {
    var root = document.querySelector('.ls[data-list]'); if (!root) return
    var kind = root.getAttribute('data-list'), data; try { data = JSON.parse(root.querySelector('.ls-data').textContent) } catch (e) { return }
    data.companies = data.companies || []; data.people = data.people || []; data.fields = data.fields || {}
    var out = root.querySelector('.ls-out'), q = root.querySelector('.ls-q'), sel = root.querySelector('.ls-f'), cnt = root.querySelector('.ls-n')
    var st = { v: '', q: '', f: '' }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    function add(p) { for (var i = 1; i < arguments.length; i++) p.appendChild(arguments[i]); return p }
    function a(text, href) { var x = el('a', null, text); x.href = href; return x }
    function head(name, n) { return add(el('h2', null, name + ' '), el('small', null, String(n))) }
    function group(list, k) { var m = {}; list.forEach(function (c) { (m[k(c)] = m[k(c)] || []).push(c) }); return Object.keys(m).map(function (key) { return [key, m[key]] }).sort(function (x, y) { return y[1].length - x[1].length || x[0].localeCompare(y[0]) }) }
    function mono(n) { var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 3; var m = el('span', 'ls-mono ls-m' + h, n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)); m.setAttribute('aria-hidden', 'true'); return m }
    function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's') }

    var L = {
        companies: {
            key: 'pt-companies-view', views: ['grid', 'directory', 'search'], total: data.companies.length,
            match: function (c, s) { return (!st.f || c.f === st.f) && (!s || (c.n + ' ' + c.w + ' ' + c.c).toLowerCase().indexOf(s) >= 0) },
            empty: 'No company matches. Clear the search or choose All fields.',
            card: function (c) { return add(el('li', 'ls-card'), mono(c.n), add(el('div'), add(el('h3'), a(c.n, c.id + '/index.html')), el('p', null, c.w), el('p', 'ls-meta', c.c + ' · ' + (data.fields[c.f] || c.f)))) },
            draw: function (l, s) {
                var self = this
                if (st.v === 'grid') group(l, function (c) { return c.f }).forEach(function (g) { var ul = el('ul', 'ls-grid'); g[1].forEach(function (c) { ul.appendChild(self.card(c)) }); add(out, head(data.fields[g[0]] || g[0], g[1].length), ul) })
                else if (st.v === 'directory') group(l, function (c) { return c.c }).forEach(function (g) { var ul = el('ul', 'ls-dir'); g[1].forEach(function (c) { ul.appendChild(add(el('li'), a(c.n, c.id + '/index.html'), el('span', null, c.w), el('span', 'ls-meta', data.fields[c.f] || c.f))) }); add(out, head(g[0], g[1].length), ul) })
                else { if (s) l.sort(function (x, y) { return (y.n.toLowerCase().indexOf(s) >= 0) - (x.n.toLowerCase().indexOf(s) >= 0) || x.n.localeCompare(y.n) }); var rows = el('ul', 'ls-rows'); l.forEach(function (c) { rows.appendChild(self.card(c)) }); out.appendChild(rows) }
            },
        },
        people: {
            key: 'pt-people-view', views: ['org', 'session', 'az'], total: data.people.length,
            match: function (p, s) { return !s || (p.n + ' ' + p.r + ' ' + p.o + ' ' + p.e.map(function (e) { return e[0] }).join(' ')).toLowerCase().indexOf(s) >= 0 },
            empty: 'No one matches. Clear the search.',
            card: function (p) { var d = add(el('div'), add(el('h3'), a(p.n, p.id + '/index.html')), el('p', null, p.r + (p.r && p.o ? ', ' : '') + p.o)); if (p.e.length) d.appendChild(el('p', 'ls-meta', plural(p.e.length, 'session'))); return add(el('li', 'ls-card'), d) },
            draw: function (l) {
                var self = this
                if (st.v === 'org') {
                    var gs = group(l, function (p) { return p.o || 'Organisation not listed' }), singles = [], unlisted = null
                    gs.forEach(function (g) { if (g[0] === 'Organisation not listed') unlisted = g; else if (g[1].length > 1) { var ul = el('ul', 'ls-grid ls-narrow'); g[1].forEach(function (p) { ul.appendChild(self.card(p)) }); add(out, head(g[0], g[1].length), ul) } else singles.push(g[1][0]) })
                    if (singles.length) { var one = el('ul', 'ls-grid ls-narrow'); singles.forEach(function (p) { one.appendChild(self.card(p)) }); add(out, head('Organisations with one person listed', singles.length), one) }
                    if (unlisted) { var un = el('ul', 'ls-grid ls-narrow'); unlisted[1].forEach(function (p) { un.appendChild(self.card(p)) }); add(out, head(unlisted[0], unlisted[1].length), un) }
                }
                else if (st.v === 'session') {
                    var by = {}; l.forEach(function (p) { p.e.forEach(function (e) { (by[e[2]] = by[e[2]] || { t: e[0], w: e[1], id: e[2], p: [] }).p.push(p) }) })
                    var ss = Object.keys(by).map(function (k) { return by[k] }).filter(function (x) { return x.p.length > 1 }).sort(function (x, y) { return y.p.length - x.p.length || x.w.localeCompare(y.w) })
                    ss.forEach(function (x) { var ppl = el('div', 'ls-ppl'); x.p.forEach(function (p) { ppl.appendChild(a(p.n + (p.o ? ' · ' + p.o : ''), p.id + '/index.html')) }); add(out, add(el('div', 'ls-sess'), el('span', 'ls-meta', x.w + ' · ' + x.p.length + ' on stage'), add(el('h3'), a(x.t, '../events/' + x.id + '/index.html')), ppl)) })
                    if (!ss.length) out.appendChild(el('p', 'ls-empty', 'No session in this search has two or more people listed.'))
                } else {
                    var letters = []; l.forEach(function (p) { var c = p.n[0].toUpperCase(); if (letters.indexOf(c) < 0) letters.push(c) })
                    var nav = el('p', 'ls-az'); letters.forEach(function (c) { nav.appendChild(a(c, '#az-' + c)) }); out.appendChild(nav)
                    var last = ''; l.forEach(function (p) { var c = p.n[0].toUpperCase(); if (c !== last) { last = c; var h = head(c, l.filter(function (x) { return x.n[0].toUpperCase() === c }).length); h.id = 'az-' + c; out.appendChild(h) }
                        out.appendChild(add(el('div', 'ls-row'), add(el('h3'), a(p.n, p.id + '/index.html')), el('p', null, p.r + (p.r && p.o ? ', ' : '') + p.o))) })
                }
            },
        },
    }[kind]
    if (!L) return

    function read() {
        var p = new URLSearchParams(location.hash.slice(1)), sv = ''
        try { sv = localStorage.getItem(L.key) || '' } catch (e) { }
        st.v = L.views.indexOf(p.get('v')) >= 0 ? p.get('v') : L.views.indexOf(sv) >= 0 ? sv : L.views[0]
        st.q = p.get('q') || ''; st.f = p.get('f') || ''; q.value = st.q; if (sel) sel.value = st.f
    }
    function write() {
        try { localStorage.setItem(L.key, st.v) } catch (e) { }
        var p = new URLSearchParams(); p.set('v', st.v); if (st.q) p.set('q', st.q); if (st.f) p.set('f', st.f)
        history.replaceState(null, '', '#' + p)
    }
    function render() {
        var s = st.q.toLowerCase(), l = (kind === 'companies' ? data.companies : data.people).filter(function (x) { return L.match(x, s) })
        cnt.textContent = l.length + ' of ' + L.total
        root.classList.toggle('ls-sf', st.v === 'search')
        root.querySelectorAll('.ls-seg button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === st.v ? 'true' : 'false') })
        out.textContent = ''
        if (!l.length) out.appendChild(el('p', 'ls-empty', L.empty)); else L.draw(l, s)
    }
    if (sel) {
        var D = data.companies, fields = []; D.forEach(function (c) { if (fields.indexOf(c.f) < 0) fields.push(c.f) })
        fields.sort(function (x, y) { return D.filter(function (c) { return c.f === y }).length - D.filter(function (c) { return c.f === x }).length })
        var opt = function (v, t) { var o = el('option', null, t); o.value = v; return o }
        sel.appendChild(opt('', 'All fields'))
        fields.forEach(function (f) { sel.appendChild(opt(f, (data.fields[f] || f) + ' (' + D.filter(function (c) { return c.f === f }).length + ')')) })
        sel.addEventListener('change', function () { st.f = sel.value; write(); render() })
    }
    root.querySelectorAll('.ls-seg button').forEach(function (b) { b.addEventListener('click', function () { st.v = b.getAttribute('data-v'); write(); render() }) })
    q.addEventListener('input', function () { st.q = q.value; write(); render() })
    addEventListener('hashchange', function () { read(); render() })
    read(); render(); document.documentElement.classList.add('ls-on')
})()
