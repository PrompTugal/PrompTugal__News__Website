// PrompTugal.news by place: the playful local-voice toggle (Dinis's brief, 14 Nov 2026: "Algarvio, with each town's own
// sayings and place references ... the facts stay identical, it is clearly labelled as playful"). Shown only where the
// place's agent has written a voice; the choice is remembered per reader in this browser only.
(function () {
    var frame = document.querySelector('.bp-frame')
    if (!frame || !frame.querySelector('.bp-voice')) return
    var mast = frame.querySelector('.bp-mast')
    if (!mast) return
    var label = document.createElement('p'); label.className = 'bp-voice-label'
    label.textContent = 'Playful local voice: same facts, said the Algarvio way'
    mast.insertBefore(label, mast.firstChild)
    var b = document.createElement('button'); b.type = 'button'; b.className = 'bp-toggle'
    var KEY = 'pt-bp-voice'
    function set(on) { frame.classList.toggle('voice', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'Back to plain English' : 'Say it in Algarvio'; try { localStorage.setItem(KEY, on ? '1' : '0') } catch (e) {} }
    b.addEventListener('click', function () { set(!frame.classList.contains('voice')) })
    mast.appendChild(b)
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
