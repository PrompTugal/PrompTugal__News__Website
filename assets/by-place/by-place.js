// Words this script adds, per page language (designer.places@, 16 Nov 2026: the translated place pages, /<culture>/...).
var BP_LANG = (document.documentElement.lang || 'en').toLowerCase(), BP_L2 = BP_LANG.slice(0, 2)
var BP_W = ({
    en: { alg: 'Say it in Algarvio', pt: 'Say it à portuguesa', back: 'Back to plain English', lab: 'Playful local voice: same facts, said ', wayA: 'the Algarvio way', wayP: 'the Portuguese way', min: function (n) { return n + ' min ago' }, hr: function (n) { return n + ' h ago' }, start: 'starting' },
    pt: { alg: 'Dizer em algarvio', pt: 'Dizer à portuguesa', back: 'Voltar ao texto simples', lab: 'Voz local, a brincar: os mesmos factos, ditos ', wayA: 'à algarvia', wayP: 'à portuguesa', min: function (n) { return 'há ' + n + ' min' }, hr: function (n) { return 'há ' + n + ' h' }, start: 'a começar' },
    es: { alg: 'Dilo en algarvio', pt: 'Dilo a la portuguesa', back: 'Volver al texto normal', lab: 'Voz local, en broma: los mismos hechos, dichos ', wayA: 'a la algarvia', wayP: 'a la portuguesa', min: function (n) { return 'hace ' + n + ' min' }, hr: function (n) { return 'hace ' + n + ' h' }, start: 'empezando' },
    fr: { alg: 'Le dire en algarvio', pt: 'Le dire à la portugaise', back: 'Revenir au texte simple', lab: 'Voix locale, pour rire : les mêmes faits, dits ', wayA: 'à l’algarvienne', wayP: 'à la portugaise', min: function (n) { return 'il y a ' + n + ' min' }, hr: function (n) { return 'il y a ' + n + ' h' }, start: 'démarrage' },
    de: { alg: 'Auf Algarvio sagen', pt: 'Auf Portugiesisch sagen', back: 'Zurück zum normalen Text', lab: 'Lokale Stimme, augenzwinkernd: dieselben Fakten, gesagt ', wayA: 'auf Algarvio', wayP: 'auf Portugiesisch', min: function (n) { return 'vor ' + n + ' Min.' }, hr: function (n) { return 'vor ' + n + ' Std.' }, start: 'startet' },
    nl: { alg: 'Zeg het in het Algarvio', pt: 'Zeg het op z’n Portugees', back: 'Terug naar de gewone tekst', lab: 'Lokale stem, met een knipoog: dezelfde feiten, gezegd ', wayA: 'op z’n Algarvio’s', wayP: 'op z’n Portugees', min: function (n) { return n + ' min geleden' }, hr: function (n) { return n + ' u geleden' }, start: 'start' }
})
BP_W = BP_W[BP_L2] || BP_W.en;
// 'Show all N' on the Local media block, per language (designer.places@, 17 Nov 2026)
BP_W.more = function (n) { var all = { en: 'Show all', pt: 'Ver todos', es: 'Ver todos', fr: 'Tout afficher', de: 'Alle anzeigen', nl: 'Alles tonen' }; return (all[BP_L2] || all.en) + ' (+' + n + ')' };
// PrompTugal.news by place: the page's finish (designer.places@PrompTugal.dinis) and the playful local-voice toggle
// (Dinis's brief, 14 Nov 2026: "Algarvio, with each town's own sayings and place references ... the facts stay
// identical, it is clearly labelled as playful"). The page reads fully without this script; it only adds polish.
(function () {
    var frame = document.querySelector('.bp-frame')
    if (!frame) return
    var main = frame.closest('main')

    // 1. the town's colour reaches the page head; the title reads "PrompTugal.news · <place>" over the place's name
    if (main) {
        main.classList.add('bp-page')
        var acc = frame.style.getPropertyValue('--accent')
        if (acc) main.style.setProperty('--accent', acc.trim())
        main.setAttribute('data-place', frame.getAttribute('data-place') || '')
        var h1 = main.querySelector('.page-head h1')
        var kicker = frame.querySelector('.bp-kicker')
        if (h1 && /^PrompTugal\.news\s+/.test(h1.textContent)) {
            var name = h1.textContent.replace(/^PrompTugal\.news\s+/, '')
            var landmark = kicker ? kicker.textContent.split(' · ').slice(2).join(' · ') : ''
            h1.textContent = ''
            var b = document.createElement('span'); b.className = 'bp-brand'; b.textContent = 'PrompTugal.news · by place'
            h1.appendChild(b); h1.appendChild(document.createTextNode(name))
            if (landmark) { var l = document.createElement('span'); l.className = 'bp-landmark'; l.textContent = landmark; h1.appendChild(l) }
            if (kicker) kicker.textContent = 'The mandate'
        }
    }

    // 2. tiles at zero are muted; status words become pills
    frame.querySelectorAll('ul.bp-tiles > li').forEach(function (li) {
        var s = li.querySelector('strong'); if (s && s.textContent.trim() === '0') li.classList.add('bp-zero')
    })
    frame.querySelectorAll('ul.bp-towns > li > code').forEach(function (c) {
        c.classList.add('bp-chip', c.textContent.trim().toLowerCase())
    })
    frame.querySelectorAll('.bp-status td:nth-child(2)').forEach(function (td) {
        var w = td.textContent.trim(); if (!/^(stub|researching|live)$/.test(w)) return
        td.textContent = ''
        var p = document.createElement('span'); p.className = 'bp-pill ' + w; p.textContent = w === 'stub' ? BP_W.start : w
        td.appendChild(p)
    })

    // 3. the local voice, only where the place's agent has written one; remembered in this browser only
    if (!frame.querySelector('.bp-voice')) return
    var mast = frame.querySelector('.bp-mast')
    if (!mast) return
    var label = document.createElement('p'); label.className = 'bp-voice-label'
    var national = frame.classList.contains('bp-country') || frame.getAttribute('data-place') === 'portugal' || !/\/algarve(\/|$)/.test(location.pathname)
    var WAY = national ? BP_W.wayP : BP_W.wayA, SAY = national ? BP_W.pt : BP_W.alg
    label.textContent = BP_W.lab + WAY
    mast.insertBefore(label, mast.firstChild)
    var t = document.createElement('button'); t.type = 'button'; t.className = 'bp-toggle'
    var KEY = 'pt-bp-voice'
    function set(on) { frame.classList.toggle('voice', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); t.textContent = on ? BP_W.back : SAY; try { localStorage.setItem(KEY, on ? '1' : '0') } catch (e) {} }
    t.addEventListener('click', function () { set(!frame.classList.contains('voice')) })
    mast.appendChild(t)
    var on = false; try { on = localStorage.getItem(KEY) === '1' } catch (e) {}
    set(on)
})()
// The AI map (dev.places@PrompTugal.dinis, 15 Nov 2026): a long map gets a filter, a chip per type and the first 12 rows
// with "Show all"; without script every row shows.
;(function () {
    var CAP = 12
    var tables = document.querySelectorAll('.bp-frame .bp-map table')
    Array.prototype.forEach.call(tables, function (t) {
        var rows = Array.prototype.slice.call(t.tBodies[0] ? t.tBodies[0].rows : [])
        if (rows.length <= CAP) return
        var typeOf = function (r) { var c = r.cells[1]; return c ? (c.textContent.split(':')[0] || '').trim().toLowerCase() : '' }
        var types = []; rows.forEach(function (r) { var k = typeOf(r); if (k && types.indexOf(k) < 0) types.push(k) })
        var bar = document.createElement('div'); bar.className = 'bp-maptools'
        var q = document.createElement('input'); q.type = 'search'; q.placeholder = 'Filter the map: a name, a field, a town'; q.setAttribute('aria-label', 'Filter the AI map')
        bar.appendChild(q)
        var kind = ''; var chips = []
        ;[''].concat(types).forEach(function (k) {
            var b = document.createElement('button'); b.type = 'button'; b.textContent = k ? k.charAt(0).toUpperCase() + k.slice(1) : 'All'
            b.setAttribute('aria-pressed', k === '' ? 'true' : 'false')
            b.addEventListener('click', function () { kind = k; chips.forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false') }); apply() })
            chips.push(b); bar.appendChild(b)
        })
        var more = document.createElement('button'); more.type = 'button'; more.className = 'bp-more'
        var open = false
        more.addEventListener('click', function () { open = true; apply() })
        t.parentNode.insertBefore(bar, t)
        t.parentNode.insertBefore(more, t.nextSibling)
        function apply() {
            var s = q.value.trim().toLowerCase(), shown = 0, match = 0
            rows.forEach(function (r) {
                var ok = (!kind || typeOf(r) === kind) && (!s || r.textContent.toLowerCase().indexOf(s) >= 0)
                if (ok) match++
                var vis = ok && (open || s || kind || shown < CAP)
                if (vis) shown++
                r.classList.toggle('bp-hide', !vis)
            })
            more.hidden = open || !!s || !!kind || match <= CAP
            more.textContent = 'Show all ' + match + ' on the map'
        }
        q.addEventListener('input', apply)
        apply()
    })
})()

// "Now in <place>" (designer.places@, 16 Nov 2026): each value's headline figure in its own span (.bp-fig), the rest
// after it; an IPMA warning level becomes a coloured chip. The words are the build's, only regrouped.
;(function () {
    var items = document.querySelectorAll('.bp-frame .bp-nowband ul.bp-now > li')
    Array.prototype.forEach.call(items, function (li) {
        var label = li.querySelector('strong'); if (!label) return
        var t = null
        for (var n = label.nextSibling; n; n = n.nextSibling) { if (n.nodeType === 3 && n.textContent.trim()) { t = n; break } if (n.nodeType === 1 && n.tagName === 'EM') break }
        if (!t) return
        var text = t.textContent.trim(), cut = text.indexOf(' · '), cut2 = text.indexOf(' (')
        var i = cut >= 0 ? cut : cut2
        var fig = i >= 0 ? text.slice(0, i) : text, rest = i >= 0 ? text.slice(i + (cut >= 0 ? 3 : 1)) : ''
        var f = document.createElement('span'); f.className = 'bp-fig' + (fig.length > 18 ? ' bp-long' : '')
        var m = /^(yellow|orange|red|green)\b:?\s*/i.exec(fig)
        if (m && /warning/i.test(label.textContent)) {
            var c = document.createElement('span'); c.className = 'bp-lvl ' + m[1].toLowerCase(); c.textContent = m[1]
            f.appendChild(c); fig = fig.slice(m[0].length); f.classList.add('bp-long')
        }
        // 2026-11-18 12:00 -> "18 Nov 12:00" in the page's language, kept on one line (designer.places@, 16 Nov 2026)
        fig = fig.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/g, function (all, y, mo, d, hm) {
            try { return new Date(Date.UTC(+y, +mo - 1, +d)).toLocaleDateString(document.documentElement.lang || 'en', { day: 'numeric', month: 'short', timeZone: 'UTC' }) + ' ' + hm } catch (e) { return all }
        })
        f.appendChild(document.createTextNode(fig))
        var frag = document.createDocumentFragment(); frag.appendChild(f)
        if (rest) { var r = document.createElement('span'); r.className = 'bp-rest'; r.textContent = rest.replace(/^\(|\)$/g, ''); frag.appendChild(r) }
        li.replaceChild(frag, t)
    })
})()

// How fresh each live value is (designer.places@, 16 Nov 2026): beside a time read "HH:MM UTC", the reader's browser
// adds "N min ago" (or "N h ago"); a value over three hours old is dimmed. Only for times of today, by UTC.
;(function () {
    var ems = document.querySelectorAll('.bp-frame .bp-nowband ul.bp-now > li > em')
    var now = new Date()
    Array.prototype.forEach.call(ems, function (em) {
        var m = /\b(\d{2}):(\d{2}) UTC\b/.exec(em.textContent); if (!m) return
        var t = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), +m[1], +m[2])
        var mins = Math.round((now.getTime() - t) / 60000)
        if (mins < 0) mins += 24 * 60 // a reading from yesterday evening, seen just after midnight UTC
        if (mins < 0 || mins > 24 * 60) return
        var s = document.createElement('span'); s.className = 'bp-age'
        s.textContent = ' · ' + (mins < 60 ? BP_W.min(mins) : BP_W.hr(Math.floor(mins / 60)))
        em.appendChild(s)
        if (mins > 180) em.parentNode.classList.add('bp-stale')
    })
})()

// Local media (designer.places@, 16 Nov 2026): the plain list becomes a grid of small cards (name, kind chip, the
// outlet's own site), the first eight shown and the rest behind one button. The links and words are the build's.
;(function () {
    var lists = document.querySelectorAll('.bp-frame ul.bp-media')
    Array.prototype.forEach.call(lists, function (ul) {
        var lis = ul.querySelectorAll(':scope > li'), LIM = 8
        Array.prototype.forEach.call(lis, function (li, i) {
            var links = li.querySelectorAll('a'); if (links.length < 1) return
            var kind = ''
            for (var n = links[0].nextSibling; n && n !== links[1]; n = n.nextSibling) {
                if (n.nodeType === 3) { var t = n.textContent.replace(/[·]/g, '').trim(); if (t) kind = t }
            }
            var extras = []; for (var e = li.firstElementChild; e; e = e.nextElementSibling) if (e.tagName !== 'A') extras.push(e)
            li.textContent = ''
            links[0].className = 'bp-m-name'; li.appendChild(links[0])
            var meta = document.createElement('span'); meta.className = 'bp-m-meta'
            if (kind) { var k = document.createElement('span'); k.className = 'bp-m-kind'; k.textContent = kind; meta.appendChild(k) }
            if (links[1]) { links[1].className = 'bp-m-site'; links[1].textContent = links[1].textContent + ' ↗'; meta.appendChild(links[1]) }
            extras.forEach(function (x) { meta.appendChild(x) })
            li.appendChild(meta)
            if (i >= LIM) li.hidden = true
        })
        if (lis.length > LIM) {
            var b = document.createElement('button'); b.type = 'button'; b.className = 'bp-m-more'
            var more = BP_W.more ? BP_W.more(lis.length - LIM) : 'Show all ' + lis.length
            b.textContent = more
            b.addEventListener('click', function () {
                Array.prototype.forEach.call(ul.querySelectorAll('li[hidden]'), function (l) { l.hidden = false }); b.remove()
            })
            ul.parentNode.insertBefore(b, ul.nextSibling)
        }
    })
})()

// /media/: a row of chips to jump to each kind of outlet (designer.places@, 17 Nov 2026). Links to the page's own anchors.
;(function () {
    var frame = document.querySelector('.bp-frame[data-place="media"]'); if (!frame) return
    var hs = frame.querySelectorAll('h3[id]'), outlets = frame.querySelector('h2#outlets')
    if (!outlets || hs.length < 2) return
    var nav = document.createElement('nav'); nav.className = 'bp-jump'; nav.setAttribute('aria-label', outlets.textContent)
    Array.prototype.forEach.call(hs, function (h) {
        var a = document.createElement('a'); a.href = '#' + h.id
        var m = /^(.*?)\s*\((\d+)\)\s*$/.exec(h.textContent.trim())
        a.textContent = m ? m[1] + ' ' : h.textContent
        if (m) { var c = document.createElement('span'); c.textContent = m[2]; a.appendChild(c) }
        nav.appendChild(a)
    })
    outlets.parentNode.insertBefore(nav, outlets.nextSibling)
})()
