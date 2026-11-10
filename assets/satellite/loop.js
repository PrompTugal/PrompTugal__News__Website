// The live satellite loop in the home page's lead. The page ships the lead's static chart in a <figure data-sat="...">; this
// script asks EUMETSAT for the newest Meteosat infrared frames and, once enough of them have loaded, swaps the loop in for the
// chart. If the feed cannot be reached or too few frames load, the chart stays. Nothing is stored on the site.
//   - On load, and every check minutes (10), and when the tab becomes visible again: one GET of the layer's small capabilities
//     document (about 8 KB, public, CORS open), whose time dimension gives the newest observation time.
//   - If that is newer than what is shown, the last N frames are requested from the Web Map Service and swapped in once loaded.
//   - Shows the newest frame's observation time and age; "Imagery delayed" when it is older than delay (60) minutes.
//   - Plays on load, with a pause button; starts paused when the reader prefers reduced motion.
// Requests go to view.eumetsat.int only; no cookie, credential or reader information is sent.
(function () {
    var chart = document.querySelector('figure[data-sat]'); if (!chart || !window.fetch) return
    var cfg; try { cfg = JSON.parse(chart.getAttribute('data-sat')) } catch (e) { return }
    var live = cfg && cfg.live; if (!live || !live.caps || !live.wms) return
    var delayMin = cfg.delay || 60, checkMin = cfg.check || 10, minFrames = cfg.min || 3
    var fig = null, img, btn, now, age, newestEl, frames = [], i = 0, timer = 0, playing = false, calm = false
    var hhmm = function (t) { return t.slice(11, 16) + ' UTC' }
    var last = function () { return frames[frames.length - 1] }
    var isoZ = function (ms) { return new Date(ms).toISOString().replace('.000Z', 'Z') }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e }

    function frameUrl(t) {
        return live.wms + '?service=WMS&version=1.1.1&request=GetMap&layers=' + live.layers + '&styles=' + live.styles + '&format=image/jpeg&transparent=false&srs=EPSG:4326&bbox=' + live.bbox.join(',') +
            '&width=' + live.width + '&height=' + live.height + '&time=' + encodeURIComponent(t)
    }
    function build() {
        fig = el('figure', 'fe-sat'); fig.setAttribute('data-sat-live', '')
        var view = el('div', 'fe-sat-view'); img = new Image(); img.width = live.width; img.height = live.height; img.alt = cfg.alt || 'Infrared satellite image'; view.appendChild(img)
        var pin = el('span', 'fe-sat-pin'); pin.style.left = cfg.lisbon.x + '%'; pin.style.top = cfg.lisbon.y + '%'; pin.appendChild(el('i')); pin.appendChild(document.createTextNode('Lisbon')); view.appendChild(pin)
        now = el('span', 'fe-sat-now'); view.appendChild(now); fig.appendChild(view)
        var cap = el('figcaption'); btn = el('button', 'fe-sat-btn', 'Pause'); btn.type = 'button'; cap.appendChild(btn)
        var t = el('span', 'fe-sat-t', 'Newest frame '); newestEl = document.createElement('time'); t.appendChild(newestEl); age = el('span', 'fe-sat-age'); t.appendChild(age); cap.appendChild(t)
        var small = document.createElement('small'); small.appendChild(document.createTextNode('Infrared satellite loop, last ' + (Math.round(live.count * live.step_minutes / 60 * 10) / 10) + ' hours, every ' + live.step_minutes + ' minutes. ' + cfg.credit + '. '))
        var a = document.createElement('a'); a.href = cfg.source_url; a.rel = 'noopener'; a.textContent = 'EUMETSAT'; small.appendChild(a); cap.appendChild(small); fig.appendChild(cap)
        btn.addEventListener('click', function () { playing ? pause() : play() })
    }
    function show(n) { i = n; img.src = frames[n].file; now.textContent = hhmm(frames[n].t); now.classList.toggle('is-newest', n === frames.length - 1) }
    function tick() { var next = (i + 1) % frames.length; show(next); timer = setTimeout(tick, next === frames.length - 1 ? 1600 : 450) }
    function play() { if (playing) return; playing = true; btn.textContent = 'Pause'; btn.setAttribute('aria-pressed', 'false'); timer = setTimeout(tick, 450) }
    function pause() { playing = false; clearTimeout(timer); btn.textContent = 'Play'; btn.setAttribute('aria-pressed', 'true') }
    function freshness() {
        if (!frames.length) return
        var mins = Math.round((Date.now() - Date.parse(last().t)) / 60000); if (!(mins >= 0)) return
        var late = mins > delayMin
        age.textContent = ' · ' + (mins < 90 ? mins + ' min old' : Math.round(mins / 60 * 10) / 10 + ' h old') + (late ? ' · Imagery delayed' : '')
        fig.classList.toggle('is-delayed', late)
    }
    // frames are held in memory as blobs: the loop never asks the network for a picture it already has, whatever the cache says,
    // and a refresh fetches only the times it does not hold (normally one). A frame counts only if it arrived as a real picture.
    var held = {}   // time -> object URL
    function fetchFrame(f) {
        if (held[f.t]) return Promise.resolve(held[f.t])
        return fetch(f.file, { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { return r.ok && /^image\//.test(r.headers.get('content-type') || '') ? r.blob() : Promise.reject() }).then(function (blob) {
            var url = URL.createObjectURL(blob)
            return new Promise(function (ok, no) { var p = new Image(); p.onload = function () { p.naturalWidth === live.width ? ok(url) : (URL.revokeObjectURL(url), no()) }; p.onerror = function () { URL.revokeObjectURL(url); no() }; p.src = url })
        }).then(function (url) { held[f.t] = url; return url })
    }
    function load(list, done) {
        var out = []; var left = list.length
        list.forEach(function (f, n) { fetchFrame(f).then(function (url) { out[n] = { t: f.t, file: url } }, function () {}).then(function () { if (--left === 0) done(out.filter(Boolean)) }) })
    }
    function adopt(list) {
        if (list.length < minFrames) return
        var first = !fig; if (first) build()
        var keep = {}; list.forEach(function (f) { keep[f.t] = 1 }); Object.keys(held).forEach(function (t) { if (!keep[t]) { URL.revokeObjectURL(held[t]); delete held[t] } })
        frames = list; newestEl.textContent = hhmm(last().t); newestEl.setAttribute('datetime', last().t); freshness()
        if (first) { chart.parentNode.replaceChild(fig, chart); calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; show(calm ? frames.length - 1 : 0); if (calm) pause(); else play() }
        else if (!playing) show(frames.length - 1)
    }
    function check() {
        if (document.hidden) return
        fetch(live.caps, { cache: 'no-cache', credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { return r.ok ? r.text() : Promise.reject() }).then(function (xml) {
            var m = /<Dimension name="time"[^>]*>[^<]*\/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.\d+)?Z\/PT(\d+)M/.exec(xml); if (!m) return
            var end = Date.parse(m[1] + 'Z'), step = +m[2] * 60000
            if (frames.length && !(end > Date.parse(last().t))) return
            var list = []; for (var k = live.count - 1; k >= 0; k--) { var t = isoZ(end - k * step); list.push({ t: t, file: frameUrl(t) }) }
            load(list, adopt)
        }).catch(function () { /* keep what is shown: the chart, or the frames already loaded; the age keeps counting */ })
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { if (playing) clearTimeout(timer) } else { freshness(); check(); if (playing) timer = setTimeout(tick, 450) } })
    check(); setInterval(check, checkMin * 60000); setInterval(freshness, 60000)
})()
