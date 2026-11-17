/* since.js: "Since your last visit" (one reader across devices, step 3: board/spec-one-reader-across-devices.md, "The
 * personal PrompTugal.news"), on the "You" page first, then the front page. From this browser only: the last visit is
 * the newest page view in the profile (localStorage nr.profile.v1) before this visit began (a gap of 30 minutes or
 * more); home is the place the reader picks, or the place page they read most. What is new comes from
 * api/v1/since.json, in three rings: your town, your region, the country. Nothing is sent. dev@PrompTugal.dinis. */
(function () {
    var root = document.querySelector('.pt-since')
    if (!root || !window.fetch) return
    var HOME = 'nr.since.home.v1', GAP = 30 * 60e3
    var get = function (k) { try { return JSON.parse(localStorage.getItem(k)) } catch (e) { return null } }
    var el = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }
    var day = function (s) { return String(s || '').slice(0, 10) }
    var views = ((get('nr.profile.v1') || {}).views || []).map(function (v) { return v.t }).filter(Boolean).sort()
    // walk back from now over this visit (no gap over 30 minutes), then the view before is the last visit
    var last = null, t = Date.now()
    for (var i = views.length - 1; i >= 0; i--) { var v = Date.parse(views[i]); if (t - v > GAP) { last = views[i]; break } t = v }
    fetch(new URL('../api/v1/since.json', location.href).href).then(function (r) { return r.json() }).then(function (d) {
        var byId = {}; d.places.forEach(function (p) { byId[p.id] = p })
        var pathOf = function (p) { return new URL(p.page).pathname }
        // home: the reader's pick, else the place page read most in this browser
        var home = get(HOME)
        if (!home || !byId[home]) {
            var n = {}; ((get('nr.profile.v1') || {}).views || []).forEach(function (v) { d.places.forEach(function (p) { if (p.kind !== 'country' && p.kind !== 'region' && v.p && v.p.indexOf(pathOf(p)) === 0 && v.p.length <= pathOf(p).length + 11) n[p.id] = (n[p.id] || 0) + 1 }) })
            home = Object.keys(n).sort(function (a, b) { return n[b] - n[a] })[0] || null
        }
        var region = home && byId[home] ? byId[home].parent : null
        if (region && byId[region] && byId[region].kind === 'country') region = null
        var since = last ? day(last) : null
        var fresh = d.items.filter(function (x) { return since ? x.date >= since : x.date >= new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10) })
        var rings = [
            home ? { name: byId[home].name, items: fresh.filter(function (x) { return x.rings[0] === home }) } : null,
            region ? { name: byId[region].name, items: fresh.filter(function (x) { return x.rings.indexOf(region) >= 0 && x.rings[0] !== home }) } : null,
            { name: 'Portugal', items: fresh.filter(function (x) { return (!region || x.rings.indexOf(region) < 0) && x.rings[0] !== home }) }
        ].filter(Boolean)
        root.replaceChildren()
        root.append(el('p', 'since-when', since ? 'Since your last visit (' + since + '):' : 'Your first visit from this browser: the last seven days.'))
        // the home picker: towns and cities only
        var lab = el('label', 'since-home', 'Your place: '), sel = el('select')
        sel.append(el('option', '', 'Not set'))
        d.places.filter(function (p) { return p.kind !== 'country' && p.kind !== 'region' }).sort(function (a, b) { return a.name.localeCompare(b.name) }).forEach(function (p) { var o = el('option', '', p.name); o.value = p.id; if (p.id === home) o.selected = true; sel.append(o) })
        sel.addEventListener('change', function () { try { localStorage.setItem(HOME, JSON.stringify(sel.value || null)) } catch (e) { } location.reload() })
        lab.append(sel); root.append(lab)
        rings.forEach(function (r) {
            var sec = el('section', 'since-ring'); sec.append(el('h3', '', r.name + ' · ' + r.items.length + ' new'))
            if (!r.items.length) sec.append(el('p', 'note', 'Nothing new here.'))
            var ul = el('ul'); r.items.slice(0, 6).forEach(function (x) {
                var li = el('li'), a = el('a', '', x.title); a.href = x.url; if (!/^https:\/\/promptugal\.news\//.test(x.url)) { a.target = '_blank'; a.rel = 'noopener' }
                li.append(a, el('span', 'note', ' · ' + [x.publisher, byId[x.place] && byId[x.place].name !== r.name ? byId[x.place].name : null, x.date].filter(Boolean).join(' · '))); ul.append(li)
            })
            sec.append(ul); root.append(sec)
        })
        root.hidden = false
    }).catch(function () { /* nothing shown */ })
})()
