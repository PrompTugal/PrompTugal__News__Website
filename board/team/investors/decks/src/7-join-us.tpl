<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
.portrait { background: var(--panel); border: 1px solid var(--hair); padding: 0 0 30px; display: flex; flex-direction: column; }
.portrait .ph { height: 210px; display: flex; align-items: flex-end; justify-content: center; background: var(--paper-2); border-bottom: 8px solid var(--green); }
.portrait.r .ph { border-bottom-color: var(--red); } .portrait.c .ph { border-bottom-color: var(--cobalt); } .portrait.k .ph { border-bottom-color: var(--ink); }
.portrait .who { font: 500 18px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); margin: 26px 28px 10px; }
.portrait h3 { font-size: 34px; margin: 0 28px 14px; }
.portrait p { font: 400 22px/1.42 var(--sans); color: var(--ink-2); margin: 0 28px; }
.portrait p + p { margin-top: 12px; }
.portrait .q { font: italic 400 24px/1.35 var(--serif); color: var(--ink); margin-top: auto; padding-top: 18px; }
.callout { font: 500 20px/1.35 var(--sans); background: var(--ink); color: var(--paper); padding: 12px 18px; position: absolute; max-width: 380px; }
.callout b { color: #8fd18f; font: 500 18px/1 var(--mono); letter-spacing: .1em; display: block; margin-bottom: 6px; }
.seat { border: 4px dashed var(--red); background: var(--red-soft); }
.quote-s { font: italic 400 34px/1.35 var(--serif); color: var(--ink); border-left: 8px solid var(--red); padding-left: 30px; }
.chip { background: rgba(246,243,236,.94); padding: 8px 12px; color: var(--ink-2); }
.quote-s .by { display: block; font: 500 18px/1 var(--mono); font-style: normal; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); margin-top: 16px; }
</style></head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide pic lightpic">
  <img class="bg" src="img/join-seat.jpg" alt="" style="object-position:right center">
  <div class="veil light"></div>
  <div class="head"><span data-i18n="s01.1"></span><span class="chip" data-i18n="s01.2"></span></div>
  <div class="inner" style="max-width:1080px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:96px" data-i18n="s01.4"></h1>
    <p class="lead" style="font-size:40px" data-i18n="s01.5"></p>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s01.6"></span><span class="chip" data-i18n="s01.7"></span></div>
</section>

<!-- 2 · you -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <h2 data-i18n="s02.4"></h2>
  <div class="cols c3" style="margin-top:64px">
    <div class="card g"><div class="n" data-i18n="s02.5"></div><h3 data-i18n="s02.6"></h3><p data-i18n="s02.7"></p></div>
    <div class="card g"><div class="n" data-i18n="s02.8"></div><h3 data-i18n="s02.9"></h3><p data-i18n="s02.10"></p></div>
    <div class="card g"><div class="n" data-i18n="s02.11"></div><h3 data-i18n="s02.12"></h3><p data-i18n="s02.13"></p></div>
  </div>
  <p class="lead" style="margin-top:56px" data-i18n="s02.14"></p>
  <div class="src" style="color:#9a978f" data-i18n="s02.15"></div>
  <div class="foot"><span class="wordmark" data-i18n="s02.16"></span><span data-i18n="s02.17"></span></div>
</section>

<!-- 3 · who we are looking for -->
<section class="slide">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 style="font-size:64px" data-i18n="s03.4"></h2>
  <div class="cols c4" style="margin-top:40px;gap:28px;align-items:stretch">
    <div class="portrait">
      <div class="ph"><svg width="220" height="190" viewBox="0 0 220 190"><circle cx="110" cy="70" r="44" fill="#121317"></circle><path d="M20 190 C20 130 60 112 110 112 C160 112 200 130 200 190 Z" fill="#121317"></path><path d="M110 120 L98 190 L122 190 Z" fill="#006600"></path></svg></div>
      <div class="who" data-i18n="s03.5"></div><h3 data-i18n="s03.6"></h3>
      <p data-i18n="s03.7"></p><p data-i18n="s03.8"></p>
      <p class="q" data-i18n="s03.9"></p>
    </div>
    <div class="portrait r">
      <div class="ph"><svg width="220" height="190" viewBox="0 0 220 190"><circle cx="110" cy="70" r="44" fill="#121317"></circle><path d="M20 190 C20 130 60 112 110 112 C160 112 200 130 200 190 Z" fill="#121317"></path><rect x="138" y="140" width="40" height="30" fill="#c52830"></rect><line x1="146" y1="150" x2="170" y2="150" stroke="#f6f3ec" stroke-width="3"></line><line x1="146" y1="160" x2="164" y2="160" stroke="#f6f3ec" stroke-width="3"></line></svg></div>
      <div class="who" data-i18n="s03.10"></div><h3 data-i18n="s03.11"></h3>
      <p data-i18n="s03.12"></p><p data-i18n="s03.13"></p>
      <p class="q" data-i18n="s03.14"></p>
    </div>
    <div class="portrait c">
      <div class="ph"><svg width="220" height="190" viewBox="0 0 220 190"><circle cx="110" cy="70" r="44" fill="#121317"></circle><path d="M20 190 C20 130 60 112 110 112 C160 112 200 130 200 190 Z" fill="#121317"></path><circle cx="62" cy="160" r="9" fill="#1f4fa8"></circle><circle cx="110" cy="146" r="9" fill="#1f4fa8"></circle><circle cx="158" cy="160" r="9" fill="#1f4fa8"></circle><path d="M62 160 L110 146 L158 160" stroke="#1f4fa8" stroke-width="3" fill="none"></path></svg></div>
      <div class="who" data-i18n="s03.15"></div><h3 data-i18n="s03.16"></h3>
      <p data-i18n="s03.17"></p><p data-i18n="s03.18"></p>
      <p class="q" data-i18n="s03.19"></p>
    </div>
    <div class="portrait k">
      <div class="ph"><svg width="220" height="190" viewBox="0 0 220 190"><circle cx="110" cy="70" r="44" fill="none" stroke="#121317" stroke-width="6"></circle><path d="M20 190 C20 130 60 112 110 112 C160 112 200 130 200 190" fill="none" stroke="#121317" stroke-width="6"></path><path d="M96 70 L106 80 L126 58" stroke="#006600" stroke-width="7" fill="none"></path></svg></div>
      <div class="who" data-i18n="s03.20"></div><h3 data-i18n="s03.21"></h3>
      <p data-i18n="s03.22"></p><p data-i18n="s03.23"></p>
      <p class="q" data-i18n="s03.24"></p>
    </div>
  </div>
  <div class="src" data-i18n="s03.25"></div>
  <div class="foot"><span class="wordmark" data-i18n="s03.26"></span><span data-i18n="s03.27"></span></div>
</section>

<!-- 4 · what you would find: running -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="cols w40 center" style="margin-top:0;height:100%">
    <div>
      <div class="kicker" data-i18n="s04.3"></div>
      <h2 style="font-size:64px" data-i18n="s04.4"></h2>
      <div class="cols" style="grid-template-columns:1fr 1fr;gap:40px;margin-top:50px">
        <div class="stat"><div class="v" data-i18n="s04.5"></div><div class="l" data-i18n="s04.6"></div></div>
        <div class="stat"><div class="v" data-i18n="s04.7"></div><div class="l" data-i18n="s04.8"></div></div>
        <div class="stat r"><div class="v" data-i18n="s04.9"></div><div class="l" data-i18n="s04.10"></div></div>
        <div class="stat r"><div class="v" data-i18n="s04.11"></div><div class="l" data-i18n="s04.12"></div></div>
      </div>
      <div class="src" style="margin-top:32px" data-i18n="s04.13"></div>
    </div>
    <div style="position:relative">
      <div class="shot"><div class="bar"><i></i><i></i><i></i><span data-i18n="s04.14"></span></div><img src="shots/newsroom.jpg" alt="The newsroom page: every agent, every run, the plan and the data"></div>
      <div class="callout" style="left:-40px;bottom:-30px" data-i18n="s04.15"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s04.16"></span><span data-i18n="s04.17"></span></div>
</section>

<!-- 5 · what you would find: the standards -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="cols w60 center" style="margin-top:0;height:100%">
    <div style="position:relative">
      <div class="shot"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.3"></span></div><img src="shots/p3-article-sources.jpg" alt="The end of an article: where it comes from, who made it, signed" style="height:640px;object-fit:cover;object-position:top"></div>
      <div class="callout" style="right:-30px;top:60px" data-i18n="s05.4"></div>
      <div class="callout" style="right:-30px;top:330px" data-i18n="s05.5"></div>
      <div class="callout" style="right:-30px;top:540px" data-i18n="s05.6"></div>
    </div>
    <div>
      <div class="kicker" data-i18n="s05.7"></div>
      <h2 style="font-size:60px" data-i18n="s05.8"></h2>
      <ul class="ticks" style="margin-top:40px">
        <li data-i18n="s05.9"></li>
        <li data-i18n="s05.10"></li>
        <li data-i18n="s05.11"></li>
        <li data-i18n="s05.12"></li>
      </ul>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s05.13"></span><span data-i18n="s05.14"></span></div>
</section>

<!-- 6 · agents do the repeatable work -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 data-i18n="s06.4"></h2>
  <svg viewBox="0 0 1680 560" width="1680" height="560" style="margin-top:36px">
    <defs><marker id="ar" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <!-- axis -->
    <line x1="0" y1="510" x2="1640" y2="510" stroke="#121317" stroke-width="3" marker-end="url(#ar)"></line>
    <text x="0" y="548" class="mono" font-size="19" fill="#595c64" letter-spacing="2" data-i18n="s06.5"></text>
    <text x="1640" y="548" class="mono" font-size="19" fill="#595c64" letter-spacing="2" text-anchor="end" data-i18n="s06.6"></text>
    <!-- agent zone -->
    <rect x="0" y="0" width="980" height="480" fill="#e2eedf"></rect>
    <text x="30" y="46" class="serif" font-size="34" font-weight="600" fill="#006600" data-i18n="s06.7"></text>
    <g font-size="23" fill="#121317">
      <rect x="30" y="80" width="440" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="52" y="116" data-i18n="s06.8"></text>
      <rect x="500" y="80" width="450" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="522" y="116" data-i18n="s06.9"></text>
      <rect x="30" y="156" width="440" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="52" y="192" data-i18n="s06.10"></text>
      <rect x="500" y="156" width="450" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="522" y="192" data-i18n="s06.11"></text>
      <rect x="30" y="232" width="440" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="52" y="268" data-i18n="s06.12"></text>
      <rect x="500" y="232" width="450" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="522" y="268" data-i18n="s06.13"></text>
      <rect x="30" y="308" width="440" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="52" y="344" data-i18n="s06.14"></text>
      <rect x="500" y="308" width="450" height="56" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="522" y="344" data-i18n="s06.15"></text>
    </g>
    <text x="30" y="430" font-size="22" fill="#3f424a" data-i18n="s06.16"></text>
    <!-- human zone -->
    <rect x="1010" y="0" width="630" height="480" fill="#fffdf8" stroke="#c52830" stroke-width="4"></rect>
    <text x="1040" y="46" class="serif" font-size="34" font-weight="600" fill="#c52830" data-i18n="s06.17"></text>
    <g font-size="25" fill="#121317">
      <text x="1040" y="112" data-i18n="s06.18"></text>
      <text x="1040" y="168" data-i18n="s06.19"></text>
      <text x="1040" y="224" data-i18n="s06.20"></text>
      <text x="1040" y="280" data-i18n="s06.21"></text>
      <text x="1040" y="336" data-i18n="s06.22"></text>
      <text x="1040" y="392" data-i18n="s06.23"></text>
    </g>
    <text x="1040" y="450" font-size="22" fill="#3f424a" data-i18n="s06.24"></text>
  </svg>
  <div class="src" style="margin-top:6px" data-i18n="s06.25"></div>
  <div class="foot"><span class="wordmark" data-i18n="s06.26"></span><span data-i18n="s06.27"></span></div>
</section>

<!-- 7 · role: CEO -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="kicker" data-i18n="s07.3"></div>
  <h2 data-i18n="s07.4"></h2>
  <div class="cols" style="grid-template-columns:1fr 1.5fr;gap:60px;margin-top:50px;align-items:stretch">
    <div class="card"><div class="n" data-i18n="s07.5"></div><h3 data-i18n="s07.6"></h3><p data-i18n="s07.7"></p><p style="margin-top:16px" data-i18n="s07.8"></p></div>
    <div class="card r seat"><div class="n" style="color:#c52830" data-i18n="s07.9"></div><h3 data-i18n="s07.10"></h3>
      <ul class="ticks" style="margin-top:14px">
        <li data-i18n="s07.11"></li>
        <li data-i18n="s07.12"></li>
        <li data-i18n="s07.13"></li>
        <li data-i18n="s07.14"></li>
      </ul>
    </div>
  </div>
  <p class="lead" style="margin-top:44px;font-size:30px" data-i18n="s07.15"></p>
  <div class="src" data-i18n="s07.16"></div>
  <div class="foot"><span class="wordmark" data-i18n="s07.17"></span><span data-i18n="s07.18"></span></div>
</section>

<!-- 8 · role: journalists and strategists -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="kicker" data-i18n="s08.3"></div>
  <h2 data-i18n="s08.4"></h2>
  <svg viewBox="0 0 1680 470" width="1680" height="470" style="margin-top:40px">
    <defs><marker id="b" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <rect x="0" y="150" width="290" height="160" fill="#c52830"></rect>
    <text x="145" y="218" text-anchor="middle" class="serif" font-size="36" font-weight="600" fill="#fff" data-i18n="s08.5"></text>
    <text x="145" y="256" text-anchor="middle" font-size="21" fill="#f8e4df" data-i18n="s08.6"></text>
    <text x="145" y="284" text-anchor="middle" font-size="21" fill="#f8e4df" data-i18n="s08.7"></text>
    <line x1="290" y1="230" x2="380" y2="230" stroke="#006600" stroke-width="4" marker-end="url(#b)"></line>
    <g font-size="23">
      <rect x="390" y="20" width="300" height="120" fill="#e2eedf" stroke="#006600" stroke-width="2"></rect><text x="540" y="70" text-anchor="middle" font-weight="600" fill="#121317" data-i18n="s08.8"></text><text x="540" y="104" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s08.9"></text>
      <rect x="390" y="170" width="300" height="120" fill="#e2eedf" stroke="#006600" stroke-width="2"></rect><text x="540" y="220" text-anchor="middle" font-weight="600" fill="#121317" data-i18n="s08.10"></text><text x="540" y="254" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s08.11"></text>
      <rect x="390" y="320" width="300" height="120" fill="#e2eedf" stroke="#006600" stroke-width="2"></rect><text x="540" y="370" text-anchor="middle" font-weight="600" fill="#121317" data-i18n="s08.12"></text><text x="540" y="404" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s08.13"></text>
      <line x1="690" y1="80" x2="790" y2="230" stroke="#9d9580" stroke-width="2"></line><line x1="690" y1="230" x2="790" y2="230" stroke="#9d9580" stroke-width="2"></line><line x1="690" y1="380" x2="790" y2="230" stroke="#9d9580" stroke-width="2"></line>
      <rect x="800" y="150" width="280" height="160" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect><text x="940" y="214" text-anchor="middle" font-weight="600" fill="#121317" data-i18n="s08.14"></text><text x="940" y="248" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s08.15"></text><text x="940" y="276" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s08.16"></text>
      <line x1="1080" y1="230" x2="1170" y2="230" stroke="#006600" stroke-width="4" marker-end="url(#b)"></line>
      <rect x="1180" y="150" width="220" height="160" fill="#121317"></rect><text x="1290" y="218" text-anchor="middle" font-weight="600" fill="#f6f3ec" data-i18n="s08.17"></text><text x="1290" y="252" text-anchor="middle" font-size="20" fill="#c8c4ba" data-i18n="s08.18"></text><text x="1290" y="278" text-anchor="middle" font-size="20" fill="#c8c4ba" data-i18n="s08.19"></text>
      <line x1="1400" y1="230" x2="1470" y2="230" stroke="#006600" stroke-width="4" marker-end="url(#b)"></line>
      <rect x="1480" y="150" width="190" height="160" fill="#006600"></rect><text x="1575" y="218" text-anchor="middle" font-weight="600" fill="#fff" data-i18n="s08.20"></text><text x="1575" y="252" text-anchor="middle" font-size="20" fill="#e2eedf" data-i18n="s08.21"></text><text x="1575" y="278" text-anchor="middle" font-size="20" fill="#e2eedf" data-i18n="s08.22"></text>
    </g>
  </svg>
  <div class="cols" style="margin-top:20px;gap:40px">
    <div class="card r" style="padding:26px 30px"><div class="n" data-i18n="s08.23"></div><p data-i18n="s08.24"></p></div>
    <div class="card c" style="padding:26px 30px"><div class="n" data-i18n="s08.25"></div><p data-i18n="s08.26"></p></div>
  </div>
  <div class="src" data-i18n="s08.27"></div>
  <div class="foot"><span class="wordmark" data-i18n="s08.28"></span><span data-i18n="s08.29"></span></div>
</section>

<!-- 9 · the team today -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="kicker" data-i18n="s09.3"></div>
  <h2 data-i18n="s09.4"></h2>
  <svg viewBox="0 0 1680 420" width="1680" height="420" style="margin-top:50px">
    <!-- generations axis -->
    <line x1="0" y1="330" x2="1680" y2="330" stroke="#121317" stroke-width="3"></line>
    <text x="0" y="372" class="mono" font-size="19" fill="#595c64" letter-spacing="2" data-i18n="s09.5"></text>
    <text x="1680" y="372" class="mono" font-size="19" fill="#595c64" letter-spacing="2" text-anchor="end" data-i18n="s09.6"></text>
    <!-- Gen Z cluster -->
    <g fill="#006600"><circle cx="120" cy="250" r="34"></circle><circle cx="210" cy="230" r="34"></circle><circle cx="300" cy="255" r="34"></circle><circle cx="390" cy="232" r="34"></circle><circle cx="165" cy="160" r="34"></circle><circle cx="345" cy="160" r="34"></circle></g>
    <text x="255" y="90" text-anchor="middle" class="serif" font-size="32" font-weight="600" fill="#006600" data-i18n="s09.7"></text>
    <text x="255" y="122" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s09.8"></text>
    <!-- Gen X -->
    <g fill="#121317"><circle cx="1460" cy="245" r="34"></circle><circle cx="1550" cy="230" r="34"></circle></g>
    <text x="1500" y="160" text-anchor="middle" class="serif" font-size="32" font-weight="600" fill="#121317" data-i18n="s09.9"></text>
    <text x="1500" y="192" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s09.10"></text>
    <!-- the empty seats -->
    <g fill="#f8e4df" stroke="#c52830" stroke-width="4" stroke-dasharray="10 8"><circle cx="1050" cy="245" r="42"></circle><circle cx="1170" cy="245" r="42"></circle></g>
    <text x="1110" y="252" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#c52830" data-i18n="s09.11"></text>
    <text x="1110" y="132" text-anchor="middle" class="serif" font-size="32" font-weight="600" fill="#c52830" data-i18n="s09.12"></text>
    <text x="1110" y="164" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s09.13"></text>
    <!-- bridges -->
    <path d="M430 240 C 650 180, 850 200, 1000 240" fill="none" stroke="#9d9580" stroke-width="3" stroke-dasharray="6 8"></path>
    <path d="M1215 245 L1420 245" fill="none" stroke="#9d9580" stroke-width="3" stroke-dasharray="6 8"></path>
  </svg>
  <div class="cols c3" style="margin-top:30px;gap:36px">
    <div class="stat"><div class="v" style="font-size:72px" data-i18n="s09.14"></div><div class="l" data-i18n="s09.15"></div></div>
    <div class="stat"><div class="v" style="font-size:72px" data-i18n="s09.16"></div><div class="l" data-i18n="s09.17"></div></div>
    <div class="stat r"><div class="v" style="font-size:72px" data-i18n="s09.18"></div><div class="l" data-i18n="s09.19"></div></div>
  </div>
  <div class="src" data-i18n="s09.20"></div>
  <div class="foot"><span class="wordmark" data-i18n="s09.21"></span><span data-i18n="s09.22"></span></div>
</section>

<!-- 10 · Gen ZX founders -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 style="font-size:96px" data-i18n="s10.4"></h2>
  <svg viewBox="0 0 1680 200" width="1680" height="200" style="margin-top:60px">
    <rect x="0" y="40" width="560" height="120" fill="#006600"></rect><text x="280" y="114" text-anchor="middle" class="serif" font-size="46" font-weight="600" fill="#fff" data-i18n="s10.5"></text>
    <text x="700" y="118" text-anchor="middle" class="serif" font-size="70" font-weight="600" fill="#8fd18f" data-i18n="s10.6"></text>
    <rect x="840" y="40" width="560" height="120" fill="#f6f3ec"></rect><text x="1120" y="114" text-anchor="middle" class="serif" font-size="46" font-weight="600" fill="#121317" data-i18n="s10.7"></text>
    <text x="1460" y="118" class="serif" font-size="70" font-weight="600" fill="#8fd18f" data-i18n="s10.8"></text>
    <text x="1540" y="114" class="serif" font-size="46" font-weight="600" fill="#ff7a7f" data-i18n="s10.9"></text>
  </svg>
  <p class="lead" style="margin-top:40px" data-i18n="s10.10"></p>
  <p class="lead" style="font-size:26px;margin-top:30px" data-i18n="s10.11"></p>
  <div class="src" style="color:#9a978f" data-i18n="s10.12"></div>
  <div class="foot"><span class="wordmark" data-i18n="s10.13"></span><span data-i18n="s10.14"></span></div>
</section>

<!-- 11 · how it would work -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="kicker" data-i18n="s11.3"></div>
  <h2 data-i18n="s11.4"></h2>
  <svg viewBox="0 0 1680 400" width="1680" height="400" style="margin-top:40px">
    <defs><marker id="c" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <!-- staircase -->
    <rect x="0" y="260" width="520" height="140" fill="#e2eedf" stroke="#006600" stroke-width="3"></rect>
    <rect x="560" y="140" width="520" height="260" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect>
    <rect x="1120" y="20" width="560" height="380" fill="#006600"></rect>
    <text x="30" y="306" class="serif" font-size="50" font-weight="600" fill="#006600" data-i18n="s11.5"></text>
    <text x="80" y="304" class="serif" font-size="34" font-weight="600" fill="#121317" data-i18n="s11.6"></text>
    <text x="30" y="346" font-size="22" fill="#3f424a" data-i18n="s11.7"></text>
    <text x="30" y="376" font-size="22" fill="#3f424a" data-i18n="s11.8"></text>
    <text x="590" y="186" class="serif" font-size="50" font-weight="600" fill="#006600" data-i18n="s11.9"></text>
    <text x="640" y="184" class="serif" font-size="34" font-weight="600" fill="#121317" data-i18n="s11.10"></text>
    <text x="590" y="226" font-size="22" fill="#3f424a" data-i18n="s11.11"></text>
    <text x="590" y="256" font-size="22" fill="#3f424a" data-i18n="s11.12"></text>
    <text x="590" y="286" font-size="22" fill="#3f424a" data-i18n="s11.13"></text>
    <text x="1150" y="66" class="serif" font-size="50" font-weight="600" fill="#8fd18f" data-i18n="s11.14"></text>
    <text x="1200" y="64" class="serif" font-size="34" font-weight="600" fill="#fff" data-i18n="s11.15"></text>
    <text x="1150" y="106" font-size="22" fill="#e2eedf" data-i18n="s11.16"></text>
    <text x="1150" y="136" font-size="22" fill="#e2eedf" data-i18n="s11.17"></text>
    <text x="1150" y="166" font-size="22" fill="#e2eedf" data-i18n="s11.18"></text>
    <path d="M300 250 C 380 180, 460 160, 550 170" fill="none" stroke="#006600" stroke-width="4" marker-end="url(#c)"></path>
    <path d="M860 130 C 940 60, 1020 50, 1110 55" fill="none" stroke="#006600" stroke-width="4" marker-end="url(#c)"></path>
  </svg>
  <div class="quote-s" style="margin-top:40px" data-i18n="s11.19"></div>
  <div class="foot"><span class="wordmark" data-i18n="s11.20"></span><span data-i18n="s11.21"></span></div>
</section>

<!-- 12 · the stake -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 data-i18n="s12.4"></h2>
  <div class="cols c3" style="margin-top:60px">
    <div class="card g"><div class="n" data-i18n="s12.5"></div><h3 data-i18n="s12.6"></h3><p data-i18n="s12.7"></p></div>
    <div class="card g"><div class="n" data-i18n="s12.8"></div><h3 data-i18n="s12.9"></h3><p data-i18n="s12.10"></p></div>
    <div class="card r"><div class="n" data-i18n="s12.11"></div><h3 data-i18n="s12.12"></h3><p data-i18n="s12.13"></p></div>
  </div>
  <p class="lead" style="margin-top:56px" data-i18n="s12.14"></p>
  <div class="src" data-i18n="s12.15"></div>
  <div class="foot"><span class="wordmark" data-i18n="s12.16"></span><span data-i18n="s12.17"></span></div>
</section>

<!-- 13 · start this week -->
<section class="slide">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="cols w60 center" style="margin-top:0;height:100%">
    <div>
      <div class="kicker red" data-i18n="s13.3"></div>
      <h2 style="font-size:66px" data-i18n="s13.4"></h2>
      <ul class="ticks" style="margin-top:40px">
        <li data-i18n="s13.5"></li>
        <li data-i18n="s13.6"></li>
        <li data-i18n="s13.7"></li>
        <li data-i18n="s13.8"></li>
      </ul>
      <p class="lead" style="font-size:28px;margin-top:30px" data-i18n="s13.9"></p>
    </div>
    <div style="display:flex;gap:34px;justify-content:center;align-items:flex-start">
      <div class="phone"><img src="shots/m-summit.jpg" alt="The summit on a phone"></div>
      <div class="phone" style="margin-top:90px"><img src="shots/m-myday.jpg" alt="My day on a phone"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s13.10"></span><span data-i18n="s13.11"></span></div>
</section>

<!-- 14 · close -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="bigquote" data-i18n="s14.3"></div>
  <div class="flow" style="margin-top:64px">
    <div class="step" style="background:#1d1e23;border-color:#3a3b40"><div class="n" style="color:#8fd18f" data-i18n="s14.4"></div><h3 style="color:#f6f3ec" data-i18n="s14.5"></h3><p style="color:#c8c4ba" data-i18n="s14.6"></p></div>
    <div class="step" style="background:#1d1e23;border-color:#3a3b40"><div class="n" style="color:#8fd18f" data-i18n="s14.7"></div><h3 style="color:#f6f3ec" data-i18n="s14.8"></h3><p style="color:#c8c4ba" data-i18n="s14.9"></p></div>
    <div class="step" style="background:#1d1e23;border-color:#3a3b40"><div class="n" style="color:#8fd18f" data-i18n="s14.10"></div><h3 style="color:#f6f3ec" data-i18n="s14.11"></h3><p style="color:#c8c4ba" data-i18n="s14.12"></p></div>
  </div>
  <div style="margin-top:50px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 0;color:#c8c4ba;font:400 22px/1.4 var(--sans)">
    <span class="tag" style="color:#8fd18f" data-i18n="s14.13"></span><span class="tag" style="color:#8fd18f" data-i18n="s14.14"></span><span class="tag" style="color:#8fd18f" data-i18n="s14.15"></span><span class="tag" style="color:#8fd18f" data-i18n="s14.16"></span><span class="tag" style="color:#f6f3ec" data-i18n="s14.17"></span>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s14.18"></span><span data-i18n="s14.19"></span></div>
</section>

</main><script src="deck.js"></script>
</body></html>
