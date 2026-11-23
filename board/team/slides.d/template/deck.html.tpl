<!doctype html>
<!-- slides.d (account-d) deck template v0. Copy to <name>.html outside board/ (the gate reads board/*.html as site pages).
     One file, no dependencies. Keys: arrows, space, PageUp/PageDown, Home/End, F full screen, P presenter window,
     O overview, a number then Enter to jump. Swipe on touch. #/n in the URL is the slide. Print (or tools/pdf.mjs) gives
     one page per slide with every step shown and the notes hidden; ?notes in the URL prints the notes under each slide. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deck title</title>
<style>
  :root {
    --bg: #0d1117; --fg: #f2f4f8; --muted: #9aa4b2; --accent: #ff6b35; --accent-2: #2ec4b6; --card: #161b22; --line: #2a313c;
    --font: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --w: 1600; --h: 900;
  }
  :root[data-theme="light"] { --bg: #fbfaf7; --fg: #14181f; --muted: #5b6573; --card: #ffffff; --line: #e3e0d8; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; background: #000; overflow: hidden; font-family: var(--font); }
  #stage { position: absolute; left: 50%; top: 50%; width: calc(var(--w) * 1px); height: calc(var(--h) * 1px); transform-origin: 0 0; }
  .slide { position: absolute; inset: 0; background: var(--bg); color: var(--fg); padding: 80px 96px 72px; display: none; flex-direction: column; gap: 28px; overflow: hidden; }
  .slide.active { display: flex; }
  .slide h1 { font-size: 84px; line-height: 1.02; margin: 0; letter-spacing: -0.02em; }
  .slide h2 { font-size: 56px; line-height: 1.08; margin: 0; letter-spacing: -0.01em; }
  .slide p, .slide li { font-size: 32px; line-height: 1.35; margin: 0; }
  .slide .kicker { font-size: 22px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); }
  .slide .big { font-size: 160px; font-weight: 800; line-height: 1; color: var(--accent); }
  .slide .muted { color: var(--muted); }
  .slide .grow { flex: 1; min-height: 0; display: flex; gap: 40px; align-items: stretch; }
  .slide .col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .slide .card { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 28px; }
  .slide img.shot { width: 100%; height: 100%; object-fit: contain; object-position: top center; border-radius: 14px; border: 1px solid var(--line); background: var(--card); min-height: 0; }
  .slide.full { padding: 0; }
  .slide.full img.shot { border: 0; border-radius: 0; object-fit: cover; }
  .slide .src { position: absolute; left: 96px; right: 96px; bottom: 26px; font-size: 16px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .slide .src a { color: inherit; }
  .slide .num { position: absolute; right: 36px; bottom: 26px; font-size: 16px; color: var(--muted); }
  .slide aside.notes { display: none; }
  .step { opacity: 0; transform: translateY(18px); transition: opacity .45s ease, transform .45s ease; }
  .step.on { opacity: 1; transform: none; }
  .step.dim-after.on.past { opacity: .35; }
  @media (prefers-reduced-motion: reduce) { .step { transition: none; transform: none; } }
  #progress { position: fixed; left: 0; bottom: 0; height: 4px; background: var(--accent); transition: width .3s; z-index: 5; }
  body.overview { overflow: auto; background: #111; }
  body.overview #stage { position: static; transform: none !important; width: auto; height: auto; display: grid; grid-template-columns: repeat(auto-fill, 400px); gap: 16px; padding: 16px; }
  body.overview .slide { display: flex; position: relative; width: 1600px; height: 900px; zoom: .25; cursor: pointer; outline: 6px solid transparent; }
  body.overview .slide.active { outline-color: var(--accent); }
  body.overview .step { opacity: 1; transform: none; }
  @page { size: 1600px 900px; margin: 0; }
  @media print {
    html, body { overflow: visible; height: auto; background: none; }
    #stage { position: static; transform: none !important; width: 1600px; height: auto; }
    .slide { display: flex !important; position: relative; width: 1600px; height: 900px; page-break-after: always; break-after: page; }
    .step { opacity: 1 !important; transform: none !important; }
    #progress { display: none; }
    body.print-notes .slide { height: auto; min-height: 900px; }
    body.print-notes aside.notes { display: block; font-size: 22px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 16px; margin-top: auto; }
  }
</style>
</head>
<body>
<div id="stage">

  <!-- 1. Title: who it is for, what it asks. -->
  <section class="slide" data-title="Title">
    <div class="kicker">For the reader, in their words</div>
    <h1>One line that says what this deck gets you</h1>
    <p class="muted">Presenter, date, where it lives (the published URL)</p>
    <aside class="notes">Say who this is for and the one ask, in a sentence.</aside>
  </section>

  <!-- 2. The problem, in a number. -->
  <section class="slide" data-title="Problem">
    <div class="kicker">The problem</div>
    <div class="big step">00%</div>
    <h2 class="step">What that number means for this reader</h2>
    <div class="src">Source: <a href="https://example.org">publisher, title</a>, read 2026-11-22</div>
    <aside class="notes">Every number has its source line. No source, no number.</aside>
  </section>

  <!-- 3. Proof: a screenshot of the real thing. -->
  <section class="slide" data-title="Proof">
    <div class="kicker">It exists</div>
    <h2>The real thing, not a mock-up</h2>
    <div class="grow"><img class="shot" src="shots/example.png" alt="Describe the screenshot"></div>
    <div class="src">Screenshot of https://example.org, taken 2026-11-22 16:00 UTC</div>
    <aside class="notes">Point at one thing on the screen.</aside>
  </section>

  <!-- 4. How it works: three steps that build. -->
  <section class="slide" data-title="How">
    <div class="kicker">How it works</div>
    <div class="grow">
      <div class="col card step"><h2>1</h2><p>First step</p></div>
      <div class="col card step"><h2>2</h2><p>Second step</p></div>
      <div class="col card step"><h2>3</h2><p>Third step</p></div>
    </div>
  </section>

  <!-- 5. The ask. -->
  <section class="slide" data-title="Ask">
    <div class="kicker">The ask</div>
    <h1>One thing, with a date</h1>
    <p class="step">What happens next if they say yes</p>
    <aside class="notes">Stop talking after the ask.</aside>
  </section>

</div>
<div id="progress"></div>
<script>
(() => {
  const W = 1600, H = 900
  const stage = document.getElementById('stage'), slides = [...document.querySelectorAll('.slide')]
  const params = new URLSearchParams(location.search)
  if (params.has('notes')) document.body.classList.add('print-notes')
  if (params.get('theme')) document.documentElement.dataset.theme = params.get('theme')
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('deck:' + location.pathname) : null
  let i = 0, s = 0, typed = '', presenter = null, t0 = null
  slides.forEach((el, n) => { const d = document.createElement('div'); d.className = 'num'; d.textContent = (n + 1) + ' / ' + slides.length; el.appendChild(d) })
  const steps = el => [...el.querySelectorAll('.step')]
  function fit() { const k = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${k}) translate(-50%, -50%)`; stage.style.transformOrigin = '0 0'; stage.style.left = '50%'; stage.style.top = '50%' }
  function show(n, k, from) {
    i = Math.max(0, Math.min(slides.length - 1, n)); const st = steps(slides[i]); s = Math.max(0, Math.min(st.length, k))
    slides.forEach((el, m) => el.classList.toggle('active', m === i))
    st.forEach((el, m) => { el.classList.toggle('on', m < s); el.classList.toggle('past', m < s - 1) })
    document.getElementById('progress').style.width = (100 * (i + 1) / slides.length) + '%'
    history.replaceState(null, '', '#/' + (i + 1) + (s ? '.' + s : ''))
    if (chan && from !== 'chan') chan.postMessage({ i, s })
    if (presenter && !presenter.closed) paintPresenter()
  }
  function next() { const n = steps(slides[i]).length; if (s < n) show(i, s + 1); else if (i < slides.length - 1) show(i + 1, 0) }
  function prev() { if (s > 0) show(i, s - 1); else if (i > 0) show(i - 1, steps(slides[i - 1]).length) }
  function fromHash() { const m = location.hash.match(/#\/(\d+)(?:\.(\d+))?/); if (m) show(+m[1] - 1, +(m[2] || 0)); else show(0, 0) }
  function paintPresenter() {
    const d = presenter.document, cur = slides[i], nxt = slides[i + 1]
    d.getElementById('now').textContent = (i + 1) + ' / ' + slides.length + '  ' + (cur.dataset.title || '') + '  step ' + s + ' of ' + steps(cur).length
    d.getElementById('next').textContent = nxt ? 'Next: ' + (nxt.dataset.title || nxt.querySelector('h1,h2')?.textContent || '') : 'Last slide'
    const notes = cur.querySelector('aside.notes'); d.getElementById('notes').innerHTML = notes ? notes.innerHTML : '<i>No notes</i>'
  }
  function openPresenter() {
    presenter = open('', 'presenter', 'width=900,height=600'); if (!presenter) return; t0 = t0 || Date.now()
    presenter.document.write('<title>Presenter</title><body style="font:20px system-ui;background:#111;color:#eee;padding:24px"><div id="now" style="font-size:28px;font-weight:700"></div><div id="timer" style="color:#ff6b35;margin:8px 0"></div><div id="notes" style="font-size:26px;line-height:1.4;margin:20px 0"></div><div id="next" style="color:#9aa4b2"></div><p style="color:#666">Arrows here move the deck too.</p><\/body>')
    presenter.document.close(); presenter.addEventListener('keydown', key)
    const tick = () => { if (presenter.closed) return; const m = Math.floor((Date.now() - t0) / 1000); presenter.document.getElementById('timer').textContent = String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); setTimeout(tick, 1000) }
    tick(); paintPresenter()
  }
  function key(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k) && !(k === 'Enter' && typed)) { e.preventDefault(); next() }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev() }
    else if (k === 'Home') show(0, 0)
    else if (k === 'End') show(slides.length - 1, steps(slides[slides.length - 1]).length)
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.() }
    else if (k === 'p' || k === 'P') openPresenter()
    else if (k === 'o' || k === 'O' || k === 'Escape') document.body.classList.toggle('overview', k === 'Escape' ? false : undefined)
    else if (/^\d$/.test(k)) { typed += k; return }
    if (k === 'Enter' && typed) { show(+typed - 1, 0) }
    typed = ''
  }
  addEventListener('keydown', key)
  addEventListener('resize', fit)
  addEventListener('hashchange', fromHash)
  slides.forEach((el, n) => el.addEventListener('click', () => { if (document.body.classList.contains('overview')) { document.body.classList.remove('overview'); show(n, 0) } }))
  let tx = null, ty = null
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }, { passive: true })
  addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev(); else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) (e.changedTouches[0].clientX > innerWidth / 3 ? next() : prev()); tx = null })
  if (chan) chan.onmessage = e => show(e.data.i, e.data.s, 'chan')
  fit(); fromHash()
})()
</script>
</body>
</html>
