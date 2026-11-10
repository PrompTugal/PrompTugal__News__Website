// The live satellite loop in the home page's lead. STOP-GAP until the frames are served from our own origin (security@, 10 Nov 2026).
// The page ships the lead's static chart in a <figure data-sat="...">; this script requests the newest Meteosat infrared frames and,
// once enough have loaded, swaps the loop in for the chart. If none can be loaded the chart stays. Nothing is stored on the site.
//   - IMAGES ONLY: every request is a GetMap for a JPEG; a response that is not an image is dropped unread. No XML, HTML or script is
//     fetched or parsed. The newest frame is found from the fixed 10-minute cadence: the slots from now minus 20 minutes backwards are
//     requested; a slot EUMETSAT has not published yet answers with a copy of the newest frame (or a non-image), so a frame whose bytes
//     equal an older slot's is dropped and the older time is kept.
//   - No credentials, no referrer (fetch credentials omit, referrerPolicy no-referrer). Requests go to view.eumetsat.int only, and the
//     page says so beside the loop. Checks on load, every check minutes (10) and when the tab is visible again.
//   - Shows the newest frame's observation time and age; "Imagery delayed" when it is older than delay (60) minutes.
//   - Plays on load, with a pause button; starts paused when the reader prefers reduced motion.
(function () {
    var chart = document.querySelector('figure[data-sat]'); if (!chart || !window.fetch) return
    var cfg; try { cfg = JSON.parse(chart.getAttribute('data-sat')) } catch (e) { return }
    var live = cfg && cfg.live; if (!live || !live.wms || !/^https:\/\/view\.eumetsat\.int\//.test(live.wms)) return
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
        var small = document.createElement('small'); small.appendChild(document.createTextNode('Infrared satellite loop, last ' + (Math.round(live.count * live.step_minutes / 60 * 10) / 10) + ' hours, every ' + live.step_minutes + ' minutes. ' + cfg.credit + ', ' + cfg.product + '; contains modified EUMETSAT Meteosat data. '))
        var link = function (href, text) { var a = document.createElement('a'); a.href = href; a.rel = 'noopener'; a.target = '_blank'; a.textContent = text; return a }
        small.appendChild(link(cfg.terms, 'EUMETSAT terms')); small.appendChild(document.createTextNode(' · ')); small.appendChild(link(cfg.policy, 'Data Policy'))
        small.appendChild(document.createTextNode('. These images load from EUMETSAT (view.eumetsat.int) when this page opens.')); cap.appendChild(small); fig.appendChild(cap)
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
    // frames are held in memory as blobs: the loop never asks the network for a picture it already has, and a refresh fetches only the
    // slots it does not hold. A frame counts only if it arrived as a real picture of the full size.
    var held = {}, urls = {}   // time -> { hash, blob } ; time -> object URL
    function hashOf(buf) { var h = 2166136261, u = new Uint8Array(buf); for (var k = 0; k < u.length; k++) { h ^= u[k]; h = Math.imul(h, 16777619) } return (h >>> 0).toString(16) + ':' + u.length }
    function fetchSlot(t) {
        if (held[t]) return Promise.resolve(held[t])
        return fetch(frameUrl(t), { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { return r.ok && /^image\/jpeg/.test(r.headers.get('content-type') || '') ? r.blob() : Promise.reject() }).then(function (blob) {
            return blob.arrayBuffer().then(function (buf) { return { hash: hashOf(buf), blob: blob } })
        }).then(function (f) { held[t] = f; return f })
    }
    function decodes(url) { return new Promise(function (ok) { var p = new Image(); p.onload = function () { ok(p.naturalWidth === live.width) }; p.onerror = function () { ok(false) }; p.src = url }) }
    function slots() {
        var step = live.step_minutes * 60000, top = Math.floor((Date.now() - 20 * 60000) / step) * step, out = []
        for (var k = live.count + 1; k >= 0; k--) out.push(isoZ(top - k * step))
        return out
    }
    function check() {
        if (document.hidden) return
        var ts = slots(), got = []
        Promise.all(ts.map(function (t, n) { return fetchSlot(t).then(function (f) { got[n] = { t: t, f: f } }, function () {}) })).then(function () {
            var kept = [], seen = {}
            got.filter(Boolean).forEach(function (g) { if (!seen[g.f.hash]) { seen[g.f.hash] = 1; kept.push(g) } else delete held[g.t] })   // ascending: an unpublished slot repeats the newest frame, so the earliest time stays
            kept = kept.slice(-live.count)
            if (kept.length < minFrames || (frames.length && !(kept[kept.length - 1].t > last().t))) return
            return Promise.all(kept.map(function (g) { return urls[g.t] ? Promise.resolve(true) : (urls[g.t] = URL.createObjectURL(g.f.blob), decodes(urls[g.t])) })).then(function (oks) {
                var list = kept.filter(function (g, n) { return oks[n] }).map(function (g) { return { t: g.t, file: urls[g.t] } })
                Object.keys(urls).forEach(function (t) { if (!list.some(function (f) { return f.t === t })) { URL.revokeObjectURL(urls[t]); delete urls[t]; delete held[t] } })
                adopt(list)
            })
        }).catch(function () { /* keep what is shown: the chart, or the frames already loaded; the age keeps counting */ })
    }
    function adopt(list) {
        if (list.length < minFrames) return
        var first = !fig; if (first) build()
        frames = list; newestEl.textContent = hhmm(last().t); newestEl.setAttribute('datetime', last().t); freshness()
        if (first) { chart.parentNode.replaceChild(fig, chart); calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; show(calm ? frames.length - 1 : 0); if (calm) pause(); else play() }
        else if (!playing) show(frames.length - 1)
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { if (playing) clearTimeout(timer) } else { freshness(); check(); if (playing) timer = setTimeout(tick, 450) } })
    check(); setInterval(check, checkMin * 60000); setInterval(freshness, 60000)
})()
