/* lists.js: the list pages as applications (designer.experiments@'s switch.mjs, the approved mock-ups). Reads the page's
 * own JSON (.ls-data), draws the view (By field, By country, Search first), filters live and keeps the view and the
 * filter in the URL hash and the view in this browser (localStorage, in a try/catch). Nothing leaves the browser.
 * Without script the page shows its static views. dev.pages@PrompTugal.dinis. */
(function () {
    var root = document.querySelector('.ls[data-list="companies"]'); if (!root) return
    var data; try { data = JSON.parse(root.querySelector('.ls-data').textContent) } catch (e) { return }
    var D = data.companies, F = data.fields, out = root.querySelector('.ls-out'), q = root.querySelector('.ls-q'), sel = root.querySelector('.ls-f'), cnt = root.querySelector('.ls-n')
    var V = ['grid', 'directory', 'search'], KEY = 'pt-companies-view', st = { v: 'grid', q: '', f: '' }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
    function add(p) { for (var i = 1; i < arguments.length; i++) p.appendChild(arguments[i]); return p }
    function label(f) { return F[f] || f }
    function mono(n) { var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 3; var m = el('span', 'ls-mono ls-m' + h, n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)); m.setAttribute('aria-hidden', 'true'); return m }
    function link(c) { var a = el('a', null, c.n); a.href = c.id + '/index.html'; return a }
    function group(a, k) { var m = {}; a.forEach(function (c) { (m[k(c)] = m[k(c)] || []).push(c) }); return Object.keys(m).map(function (key) { return [key, m[key]] }).sort(function (x, y) { return y[1].length - x[1].length || x[0].localeCompare(y[0]) }) }
    function card(c) { return add(el('li', 'ls-card'), mono(c.n), add(el('div'), add(el('h3'), link(c)), el('p', null, c.w), el('p', 'ls-meta', c.c + ' \u00b7 ' + label(c.f)))) }
    function head(name, n) { return add(el('h2', null, name + ' '), el('small', null, String(n))) }
    function read() {
        var p = new URLSearchParams(location.hash.slice(1)), sv = ''
        try { sv = localStorage.getItem(KEY) || '' } catch (e) { }
        st.v = V.indexOf(p.get('v')) >= 0 ? p.get('v') : V.indexOf(sv) >= 0 ? sv : 'grid'
        st.q = p.get('q') || ''; st.f = p.get('f') || ''; q.value = st.q; sel.value = st.f
    }
    function write() {
        try { localStorage.setItem(KEY, st.v) } catch (e) { }
        var p = new URLSearchParams(); p.set('v', st.v); if (st.q) p.set('q', st.q); if (st.f) p.set('f', st.f)
        history.replaceState(null, '', '#' + p)
    }
    function render() {
        var needle = st.q.toLowerCase(), l = D.filter(function (c) { return (!st.f || c.f === st.f) && (!needle || (c.n + ' ' + c.w + ' ' + c.c).toLowerCase().indexOf(needle) >= 0) })
        if (st.v === 'search' && needle) l.sort(function (a, b) { return (b.n.toLowerCase().indexOf(needle) >= 0) - (a.n.toLowerCase().indexOf(needle) >= 0) || a.n.localeCompare(b.n) })
        cnt.textContent = l.length + ' of ' + D.length
        root.classList.toggle('ls-sf', st.v === 'search')
        root.querySelectorAll('.ls-seg button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === st.v ? 'true' : 'false') })
        out.textContent = ''
        if (!l.length) out.appendChild(el('p', 'ls-empty', 'No company matches. Clear the search or choose All fields.'))
        else if (st.v === 'grid') group(l, function (c) { return c.f }).forEach(function (g) { var ul = el('ul', 'ls-grid'); g[1].forEach(function (c) { ul.appendChild(card(c)) }); add(out, head(label(g[0]), g[1].length), ul) })
        else if (st.v === 'directory') group(l, function (c) { return c.c }).forEach(function (g) { var ul = el('ul', 'ls-dir'); g[1].forEach(function (c) { ul.appendChild(add(el('li'), link(c), el('span', null, c.w), el('span', 'ls-meta', label(c.f)))) }); add(out, head(g[0], g[1].length), ul) })
        else { var rows = el('ul', 'ls-rows'); l.forEach(function (c) { rows.appendChild(card(c)) }); out.appendChild(rows) }
    }
    var fields = []; D.forEach(function (c) { if (fields.indexOf(c.f) < 0) fields.push(c.f) })
    fields.sort(function (a, b) { return D.filter(function (c) { return c.f === b }).length - D.filter(function (c) { return c.f === a }).length })
    function option(v, t) { var o = el('option', null, t); o.value = v; return o }
    sel.appendChild(option('', 'All fields'))
    fields.forEach(function (f) { sel.appendChild(option(f, label(f) + ' (' + D.filter(function (c) { return c.f === f }).length + ')')) })
    root.querySelectorAll('.ls-seg button').forEach(function (b) { b.addEventListener('click', function () { st.v = b.getAttribute('data-v'); write(); render() }) })
    q.addEventListener('input', function () { st.q = q.value; write(); render() })
    sel.addEventListener('change', function () { st.f = sel.value; write(); render() })
    addEventListener('hashchange', function () { read(); render() })
    read(); render(); document.documentElement.classList.add('ls-on')
})()
