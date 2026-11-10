// The live satellite loop in the home page's lead. STOP-GAP until the frames are served from our own origin (security@, 10 Nov 2026).
// The page ships an empty satellite panel in a <figure data-sat="..."> (the static warning chart is no longer on the home page). As soon as
// this script runs it shows "Loading the latest satellite image...", shows the NEWEST frame with its observation time the moment it
// arrives, and starts the loop as the older frames load. If no satellite image can be loaded it says so, with a link to the story.
//   - IMAGES ONLY: every request is a GetMap for a JPEG; a response that is not an image is dropped unread. No XML, HTML or script is
//     fetched or parsed. The newest frame is found from the fixed 10-minute cadence: the slots from now minus 20 minutes backwards are
//     requested; a slot EUMETSAT has not published yet answers with a copy of the newest frame (or a non-image), so a frame whose bytes
//     equal an older slot's is dropped and the older time is kept.
//   - No credentials, no referrer (fetch credentials omit, referrerPolicy no-referrer). Requests go to view.eumetsat.int only, and the
//     page says so beside the loop. Checks on load, every check minutes (10) and when the tab is visible again.
//   - Shows the newest frame's observation time and age; "Imagery delayed" when it is older than delay (60) minutes.
//   - Plays when at least min frames are in, with a pause button; shows the newest frame, paused, if the reader prefers reduced motion.
(function () {
    var chart = document.querySelector('figure[data-sat]'); if (!chart || !window.fetch) return
    var cfg; try { cfg = JSON.parse(chart.getAttribute('data-sat')) } catch (e) { return }
    var live = cfg && cfg.live; if (!live || !live.wms || !/^https:\/\/view\.eumetsat\.int\//.test(live.wms)) return
    var delayMin = cfg.delay || 60, checkMin = cfg.check || 10, minFrames = cfg.min || 3, TIMEOUT = 30000
    var fig = null, img, btn, now, age, newestEl, msg, frames = [], pool = {}, i = 0, timer = 0, playing = false, started = false, calm = false, busy = false
    var hhmm = function (t) { return t.slice(11, 16) + ' UTC' }
    var last = function () { return frames[frames.length - 1] }
    var isoZ = function (ms) { return new Date(ms).toISOString().replace('.000Z', 'Z') }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e }
    function frameUrl(t) {
        return live.wms + '?service=WMS&version=1.1.1&request=GetMap&layers=' + live.layers + '&styles=' + live.styles + '&format=image/jpeg&transparent=false&srs=EPSG:4326&bbox=' + live.bbox.join(',') +
            '&width=' + live.width + '&height=' + live.height + '&time=' + encodeURIComponent(t)
    }

    // ---- the panel
    function build() {
        fig = el('figure', 'fe-sat is-loading'); fig.setAttribute('data-sat-live', '')
        var view = el('div', 'fe-sat-view'); img = new Image(); img.width = live.width; img.height = live.height; img.alt = cfg.alt || 'Infrared satellite image'; img.hidden = true; view.appendChild(img)
        msg = el('span', 'fe-sat-msg', 'Loading the latest satellite image…'); view.appendChild(msg)
        var pin = el('span', 'fe-sat-pin'); pin.style.left = cfg.lisbon.x + '%'; pin.style.top = cfg.lisbon.y + '%'; pin.appendChild(el('i')); pin.appendChild(document.createTextNode('Lisbon')); view.appendChild(pin)
        now = el('span', 'fe-sat-now'); view.appendChild(now); fig.appendChild(view)
        var cap = el('figcaption'); btn = el('button', 'fe-sat-btn', 'Pause'); btn.type = 'button'; btn.hidden = true; cap.appendChild(btn)
        var t = el('span', 'fe-sat-t', 'Newest frame '); newestEl = document.createElement('time'); t.appendChild(newestEl); age = el('span', 'fe-sat-age'); t.appendChild(age); t.hidden = true; cap.appendChild(t)
        var small = document.createElement('small'); small.appendChild(document.createTextNode('Infrared satellite loop, last ' + (Math.round(live.count * live.step_minutes / 60 * 10) / 10) + ' hours, every ' + live.step_minutes + ' minutes. ' + cfg.credit + ', ' + cfg.product + '; contains modified EUMETSAT Meteosat data. '))
        var link = function (href, text) { var a = document.createElement('a'); a.href = href; a.rel = 'noopener'; a.target = '_blank'; a.textContent = text; return a }
        small.appendChild(link(cfg.terms, 'EUMETSAT terms')); small.appendChild(document.createTextNode(' · ')); small.appendChild(link(cfg.policy, 'Data Policy'))
        small.appendChild(document.createTextNode('. These images load from EUMETSAT (view.eumetsat.int) when this page opens.')); cap.appendChild(small); fig.appendChild(cap)
        btn.addEventListener('click', function () { playing ? pause() : play() })
        chart.parentNode.replaceChild(fig, chart)
    }
    function giveUp() {   // no satellite image: say so, with a link to the story (the static chart is no longer on the home page)
        if (!fig || frames.length) return
        msg.textContent = 'Satellite image unavailable right now. '; var a = document.createElement('a'); a.href = cfg.story; a.textContent = 'Read the story'; msg.appendChild(a); msg.hidden = false
        fig.classList.remove('is-loading'); fig.classList.add('is-unavailable')
    }
    function show(n) { i = n; img.src = frames[n].file; img.hidden = false; msg.hidden = true; fig.classList.remove('is-loading', 'is-unavailable'); now.textContent = hhmm(frames[n].t); now.classList.toggle('is-newest', n === frames.length - 1) }
    function tick() { var next = (i + 1) % frames.length; show(next); timer = setTimeout(tick, next === frames.length - 1 ? 1600 : 450) }
    function play() { if (playing) return; playing = true; btn.textContent = 'Pause'; btn.setAttribute('aria-pressed', 'false'); timer = setTimeout(tick, 450) }
    function pause() { playing = false; clearTimeout(timer); btn.textContent = 'Play'; btn.setAttribute('aria-pressed', 'true') }
    function freshness() {
        if (!fig || !frames.length) return
        var mins = Math.round((Date.now() - Date.parse(last().t)) / 60000); if (!(mins >= 0)) return
        var late = mins > delayMin
        age.textContent = ' · ' + (mins < 90 ? mins + ' min old' : Math.round(mins / 60 * 10) / 10 + ' h old') + (late ? ' · Imagery delayed' : '')
        fig.classList.toggle('is-delayed', late)
    }

    // ---- the frames: held in memory as blobs; a slot counts only if it arrived as a real JPEG of the full size
    function hashOf(buf) { var h = 2166136261, u = new Uint8Array(buf); for (var k = 0; k < u.length; k++) { h ^= u[k]; h = Math.imul(h, 16777619) } return (h >>> 0).toString(16) + ':' + u.length }
    function fetchSlot(t) {
        if (pool[t]) return Promise.resolve(pool[t])
        var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort() }, TIMEOUT)
        return fetch(frameUrl(t), { credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctl ? ctl.signal : undefined }).then(function (r) { return r.ok && /^image\/jpeg/.test(r.headers.get('content-type') || '') ? r.blob() : Promise.reject() }).then(function (blob) {
            return blob.arrayBuffer().then(function (buf) {
                var url = URL.createObjectURL(blob)
                return new Promise(function (ok, no) { var p = new Image(); p.onload = function () { p.naturalWidth === live.width ? ok({ t: t, hash: hashOf(buf), url: url }) : (URL.revokeObjectURL(url), no()) }; p.onerror = function () { URL.revokeObjectURL(url); no() }; p.src = url })
            })
        }).then(function (f) { clearTimeout(to); pool[t] = f; return f }, function (e) { clearTimeout(to); return Promise.reject(e) })
    }
    function slots() {
        var step = live.step_minutes * 60000, top = Math.floor((Date.now() - 20 * 60000) / step) * step, out = []
        for (var k = live.count + 1; k >= 0; k--) out.push(isoZ(top - k * step))
        return out   // oldest first
    }
    // rebuild the frame list from what is held: oldest first, a slot that repeats an older one's bytes (not yet published) is dropped
    function refresh() {
        var seen = {}, kept = []
        Object.keys(pool).sort().forEach(function (t) { var f = pool[t]; if (!seen[f.hash]) { seen[f.hash] = 1; kept.push(f) } else { URL.revokeObjectURL(f.url); delete pool[t] } })
        kept = kept.slice(-live.count)
        Object.keys(pool).forEach(function (t) { if (!kept.some(function (f) { return f.t === t })) { URL.revokeObjectURL(pool[t].url); delete pool[t] } })
        if (!kept.length) return false
        var newest = frames.length ? last().t : '', grew = kept[kept.length - 1].t > newest
        frames = kept.map(function (f) { return { t: f.t, file: f.url } })
        if (!fig) build()
        newestEl.textContent = hhmm(last().t); newestEl.setAttribute('datetime', last().t); newestEl.parentNode.hidden = false; freshness()
        if (!started) {
            show(frames.length - 1)   // the newest frame first, with its observation time
            if (frames.length >= minFrames) { started = true; btn.hidden = false; calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (calm) pause(); else { show(0); play() } }
        } else if (!playing && grew) show(frames.length - 1)
        return true
    }
    // first visit: the newest three slots first (they settle which slot is the newest), then the older frames as they come in
    function firstLoad() {
        var ts = slots(), newest3 = ts.slice(-3), older = ts.slice(0, -3)
        build()
        Promise.all(newest3.map(function (t) { return fetchSlot(t).then(function () {}, function () {}) })).then(function () {
            if (!refresh()) { giveUp(); busy = false; return }
            var left = older.length
            older.slice().reverse().forEach(function (t) { fetchSlot(t).then(function () {}, function () {}).then(function () { refresh(); if (--left === 0) busy = false }) })
            if (!older.length) busy = false
        })
    }
    function check() {
        if (document.hidden || busy) return
        busy = true
        var ts = slots()
        Promise.all(ts.map(function (t) { return fetchSlot(t).then(function () {}, function () {}) })).then(function () { refresh() }).catch(function () {}).then(function () { busy = false })
    }
    function begin() { busy = true; firstLoad() }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { if (playing) clearTimeout(timer) } else { freshness(); check(); if (playing) timer = setTimeout(tick, 450) } })
    begin(); setInterval(check, checkMin * 60000); setInterval(freshness, 60000)
})()
