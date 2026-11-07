<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
  .feed { background: var(--panel); border: 1px solid var(--hair); border-top: 8px solid var(--red); padding: 10px 34px 14px; }
  .feed .it { padding: 20px 0; border-bottom: 1px solid var(--hair); }
  .feed .it:last-child { border-bottom: 0; }
  .feed .d { font: 500 19px/1.2 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--green); }
  .feed .t { font: 600 30px/1.2 var(--serif); margin: 8px 0 6px; color: var(--ink); }
  .feed .s { font: 400 20px/1.35 var(--mono); color: var(--ink-3); }
  .feed .lbl { font: 500 20px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--red); padding: 18px 0 8px; }
  .mini h3 { font-size: 32px; margin-bottom: 8px; } .mini p { font: 400 23px/1.42 var(--sans); color: var(--ink-2); }
  .mini { border-left: 6px solid var(--green); padding: 4px 0 4px 26px; margin-bottom: 30px; }
  .mini.r { border-left-color: var(--red); } .mini.c { border-left-color: var(--cobalt); }
  .jobs { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 40px; margin-top: 44px; }
  .jobs div { font: 400 23px/1.38 var(--sans); color: var(--ink-2); border-top: 3px solid var(--ink); padding-top: 14px; }
  .jobs div b { display: block; font: 600 30px/1.15 var(--serif); color: var(--ink); margin-bottom: 6px; }
  .bigstat .v { font: 600 150px/0.95 var(--serif); letter-spacing: -.03em; }
  .bigstat .l { font: 400 26px/1.35 var(--sans); color: var(--ink-2); margin-top: 14px; }
  .slide.ink .bigstat .l { color: #c8c4ba; }
  .smallstat .v { font: 600 66px/1 var(--serif); letter-spacing: -.02em; } .smallstat .l { font: 400 21px/1.35 var(--sans); color: var(--ink-2); margin-top: 8px; }
  .lbl2 { font: 500 20px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); border-bottom: 2px solid var(--ink); padding-bottom: 12px; margin-bottom: 30px; }
  .ask { background: var(--panel); border: 1px solid var(--hair); padding: 30px 30px 32px; position: relative; }
  .ask .q { font: 600 italic 30px/1.25 var(--serif); color: var(--ink); margin: 12px 0 14px; }
  .ask p { font: 400 22px/1.42 var(--sans); color: var(--ink-2); }
  .ask .n { font: 600 64px/1 var(--serif); color: var(--green); }
</style></head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide pic">
  <img class="bg" src="img/hero-algarve.jpg" alt="">
  <div class="veil"></div>
  <div class="head"><span data-i18n="s01.1"></span><span data-i18n="s01.2"></span></div>
  <div class="inner">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:100px;color:#fff" data-i18n="s01.4"></h1>
    <p class="lead" data-i18n="s01.5"></p>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s01.6"></span><span data-i18n="s01.7"></span></div>
</section>

<!-- 2 · a company from the Algarve -->
<section class="slide">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <h2 style="font-size:70px" data-i18n="s02.4"></h2>
  <div class="cols w40 center" style="margin-top:44px;gap:70px">
    <ul class="ticks">
      <li data-i18n="s02.5"></li>
      <li data-i18n="s02.6"></li>
      <li data-i18n="s02.7"></li>
      <li data-i18n="s02.8"></li>
    </ul>
    <svg viewBox="0 0 820 520" width="820" height="520">
      <rect x="0" y="0" width="820" height="520" fill="#dfe8ec"></rect>
      <text x="30" y="480" class="mono" font-size="20" fill="#3f6b82" letter-spacing="3" data-i18n="s02.9"></text>
      <g transform="translate(40,40)">
        <path d="M5,371 L92,161 L97,70 L184,70 L368,91 L506,70 L644,21 L690,35 L713,140 L727,252 L621,294 L534,364 L520,406 L492,371 L405,336 L345,322 L294,322 L212,294 L152,315 L28,378 Z" fill="#f6f3ec" stroke="#595c64" stroke-width="2"></path>
        <g font-size="20" fill="#3f424a">
          <circle cx="152" cy="315" r="7" fill="#595c64"></circle><text x="140" y="300" text-anchor="end" data-i18n="s02.10"></text>
          <circle cx="212" cy="294" r="7" fill="#595c64"></circle><text x="212" y="278" text-anchor="middle" data-i18n="s02.11"></text>
          <circle cx="345" cy="322" r="7" fill="#595c64"></circle><text x="345" y="358" text-anchor="middle" data-i18n="s02.12"></text>
          <circle cx="492" cy="371" r="9" fill="#006600"></circle><text x="470" y="402" text-anchor="end" font-weight="600" fill="#121317" data-i18n="s02.13"></text>
          <circle cx="621" cy="294" r="7" fill="#595c64"></circle><text x="621" y="278" text-anchor="middle" data-i18n="s02.14"></text>
        </g>
        <circle cx="451" cy="282" r="34" fill="none" stroke="#c52830" stroke-width="3" opacity=".5"></circle>
        <circle cx="451" cy="282" r="14" fill="#c52830"></circle>
        <text x="451" y="212" text-anchor="middle" class="serif" font-size="34" font-weight="600" fill="#121317" data-i18n="s02.15"></text>
        <text x="451" y="238" text-anchor="middle" class="mono" font-size="18" fill="#c52830" letter-spacing="1" data-i18n="s02.16"></text>
        <text x="380" y="40" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s02.17"></text>
      </g>
      <text x="790" y="40" text-anchor="end" class="mono" font-size="18" fill="#595c64" data-i18n="s02.18"></text>
    </svg>
  </div>
  <div class="src" data-i18n="s02.19"></div>
  <div class="foot"><span class="wordmark" data-i18n="s02.20"></span><span data-i18n="s02.21"></span></div>
</section>

<!-- 3 · the region's own goal -->
<section class="slide ink">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 style="color:var(--paper);font-size:68px" data-i18n="s03.4"></h2>
  <div class="cols c3" style="margin-top:56px;gap:50px">
    <div class="stat bigstat" style="border-left-color:#ff7a7f"><div class="v" data-i18n="s03.5"></div><div class="l" data-i18n="s03.6"></div></div>
    <div class="stat bigstat" style="border-left-color:#ff7a7f"><div class="v" data-i18n="s03.7"></div><div class="l" data-i18n="s03.8"></div></div>
    <div class="stat bigstat" style="border-left-color:#ff7a7f"><div class="v" data-i18n="s03.9"></div><div class="l" data-i18n="s03.10"></div></div>
  </div>
  <div style="font:500 20px/1 var(--mono);letter-spacing:.14em;color:#9a978f;margin:60px 0 26px;text-transform:uppercase" data-i18n="s03.11"></div>
  <div class="cols c4" style="margin-top:0;gap:40px">
    <div class="stat smallstat"><div class="v" data-i18n="s03.12"></div><div class="l" data-i18n="s03.13"></div></div>
    <div class="stat smallstat"><div class="v" data-i18n="s03.14"></div><div class="l" data-i18n="s03.15"></div></div>
    <div class="stat smallstat"><div class="v" data-i18n="s03.16"></div><div class="l" data-i18n="s03.17"></div></div>
    <div class="stat smallstat"><div class="v" data-i18n="s03.18"></div><div class="l" data-i18n="s03.19"></div></div>
  </div>
  <div class="src" style="color:#9a978f;margin-top:34px" data-i18n="s03.20"></div>
  <div class="foot"><span class="wordmark" data-i18n="s03.21"></span><span data-i18n="s03.22"></span></div>
</section>

<!-- 4 · the gap: connect the dots -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="kicker red" data-i18n="s04.3"></div>
  <h2 style="font-size:64px" data-i18n="s04.4"></h2>
  <svg viewBox="0 0 1680 600" width="1680" height="600" style="margin-top:20px">
    <defs><marker id="ar4" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#006600"></path></marker></defs>
    <rect x="0" y="0" width="760" height="600" fill="#ece7db"></rect>
    <text x="30" y="44" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s04.5"></text>
    <g stroke="#9d9580" stroke-width="2" stroke-dasharray="6 8" fill="none">
      <line x1="120" y1="150" x2="300" y2="120"></line><line x1="560" y1="180" x2="470" y2="340"></line><line x1="220" y1="330" x2="130" y2="450"></line>
    </g>
    <g font-size="22" text-anchor="middle" fill="#121317">
      <circle cx="120" cy="150" r="30" fill="#006600"></circle><text x="120" y="210" data-i18n="s04.6"></text>
      <circle cx="320" cy="115" r="30" fill="#4caf50"></circle><text x="320" y="175" data-i18n="s04.7"></text>
      <circle cx="580" cy="170" r="30" fill="#1f4fa8"></circle><text x="580" y="230" data-i18n="s04.8"></text>
      <circle cx="230" cy="320" r="30" fill="#c52830"></circle><text x="230" y="380" data-i18n="s04.9"></text>
      <circle cx="470" cy="350" r="30" fill="#121317"></circle><text x="470" y="410" data-i18n="s04.10"></text>
      <circle cx="660" cy="420" r="30" fill="#8a6d1f"></circle><text x="660" y="480" data-i18n="s04.11"></text>
      <circle cx="120" cy="470" r="30" fill="#5a7fc4"></circle><text x="120" y="530" data-i18n="s04.12"></text>
      <circle cx="400" cy="520" r="30" fill="#9d9580"></circle><text x="400" y="580" data-i18n="s04.13"></text>
    </g>
    <line x1="780" y1="300" x2="880" y2="300" stroke="#006600" stroke-width="6" marker-end="url(#ar4)"></line>
    <rect x="910" y="0" width="770" height="600" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect>
    <text x="940" y="44" class="mono" font-size="20" fill="#006600" letter-spacing="2" data-i18n="s04.14"></text>
    <g stroke="#006600" stroke-width="3" opacity=".75">
      <line x1="1295" y1="320" x2="1295" y2="120"></line><line x1="1295" y1="320" x2="1436" y2="179"></line><line x1="1295" y1="320" x2="1495" y2="320"></line><line x1="1295" y1="320" x2="1436" y2="461"></line>
      <line x1="1295" y1="320" x2="1295" y2="520"></line><line x1="1295" y1="320" x2="1154" y2="461"></line><line x1="1295" y1="320" x2="1095" y2="320"></line><line x1="1295" y1="320" x2="1154" y2="179"></line>
    </g>
    <polygon points="1295,120 1436,179 1495,320 1436,461 1295,520 1154,461 1095,320 1154,179" fill="none" stroke="#9d9580" stroke-width="2"></polygon>
    <circle cx="1295" cy="320" r="86" fill="#121317"></circle>
    <text x="1295" y="318" text-anchor="middle" class="serif" font-size="30" font-weight="600" fill="#f6f3ec" data-i18n="s04.15"></text>
    <text x="1295" y="348" text-anchor="middle" font-size="19" fill="#c8c4ba" data-i18n="s04.16"></text>
    <g font-size="22" fill="#121317">
      <circle cx="1295" cy="120" r="28" fill="#006600"></circle><text x="1335" y="100" data-i18n="s04.17"></text>
      <circle cx="1436" cy="179" r="28" fill="#4caf50"></circle><text x="1474" y="170" data-i18n="s04.18"></text>
      <circle cx="1495" cy="320" r="28" fill="#1f4fa8"></circle><text x="1533" y="328" data-i18n="s04.19"></text>
      <circle cx="1436" cy="461" r="28" fill="#c52830"></circle><text x="1474" y="478" data-i18n="s04.20"></text>
      <circle cx="1295" cy="520" r="28" fill="#121317"></circle><text x="1335" y="562" data-i18n="s04.21"></text>
      <circle cx="1154" cy="461" r="28" fill="#8a6d1f"></circle><text x="1116" y="478" text-anchor="end" data-i18n="s04.22"></text>
      <circle cx="1095" cy="320" r="28" fill="#5a7fc4"></circle><text x="1057" y="328" text-anchor="end" data-i18n="s04.23"></text>
      <circle cx="1154" cy="179" r="28" fill="#9d9580"></circle><text x="1116" y="170" text-anchor="end" data-i18n="s04.24"></text>
    </g>
  </svg>
  <div class="src" style="margin-top:14px" data-i18n="s04.25"></div>
  <div class="foot"><span class="wordmark" data-i18n="s04.26"></span><span data-i18n="s04.27"></span></div>
</section>

<!-- 5 · news for the Algarve -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="cols w40" style="margin-top:0;gap:80px;height:100%">
    <div>
      <div class="kicker" data-i18n="s05.3"></div>
      <h2 style="font-size:64px" data-i18n="s05.4"></h2>
      <div style="margin-top:44px">
        <div class="mini"><h3 data-i18n="s05.5"></h3><p data-i18n="s05.6"></p></div>
        <div class="mini r"><h3 data-i18n="s05.7"></h3><p data-i18n="s05.8"></p></div>
        <div class="mini c"><h3 data-i18n="s05.9"></h3><p data-i18n="s05.10"></p></div>
      </div>
    </div>
    <div class="feed" style="align-self:center">
      <div class="lbl" data-i18n="s05.11"></div>
      <div class="it"><div class="d" data-i18n="s05.12"></div><div class="t" data-i18n="s05.13"></div><div class="s" data-i18n="s05.14"></div></div>
      <div class="it"><div class="d" data-i18n="s05.15"></div><div class="t" data-i18n="s05.16"></div><div class="s" data-i18n="s05.17"></div></div>
      <div class="it"><div class="d" data-i18n="s05.18"></div><div class="t" data-i18n="s05.19"></div><div class="s" data-i18n="s05.20"></div></div>
      <div class="it"><div class="d" data-i18n="s05.21"></div><div class="t" data-i18n="s05.22"></div><div class="s" data-i18n="s05.23"></div></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s05.24"></span><span data-i18n="s05.25"></span></div>
</section>

<!-- 6 · distribution -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 style="font-size:64px" data-i18n="s06.4"></h2>
  <svg viewBox="0 0 1680 600" width="1680" height="600" style="margin-top:30px">
    <defs><marker id="ar6" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <text x="0" y="30" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s06.5"></text>
    <text x="560" y="30" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s06.6"></text>
    <text x="1180" y="30" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s06.7"></text>
    <rect x="0" y="210" width="300" height="180" fill="#c52830"></rect>
    <text x="150" y="282" text-anchor="middle" class="serif" font-size="32" font-weight="600" fill="#fff" data-i18n="s06.8"></text>
    <text x="150" y="318" text-anchor="middle" font-size="20" fill="#f8e4df" data-i18n="s06.9"></text>
    <text x="150" y="346" text-anchor="middle" font-size="20" fill="#f8e4df" data-i18n="s06.10"></text>
    <line x1="300" y1="300" x2="400" y2="300" stroke="#006600" stroke-width="5" marker-end="url(#ar6)"></line>
    <rect x="410" y="200" width="130" height="200" fill="#121317"></rect>
    <text x="475" y="292" text-anchor="middle" class="serif" font-size="24" font-weight="600" fill="#f6f3ec" data-i18n="s06.11"></text>
    <text x="475" y="322" text-anchor="middle" class="serif" font-size="24" font-weight="600" fill="#f6f3ec" data-i18n="s06.12"></text>
    <g stroke="#9d9580" stroke-width="2.5" fill="none">
      <path d="M540,300 C580,300 560,90 600,90"></path><path d="M540,300 C580,300 560,190 600,190"></path><path d="M540,300 L600,300"></path><path d="M540,300 C580,300 560,410 600,410"></path><path d="M540,300 C580,300 560,510 600,510"></path>
    </g>
    <g font-size="22" fill="#121317">
      <rect x="600" y="60" width="440" height="62" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="622" y="99" data-i18n="s06.13"></text>
      <rect x="600" y="160" width="440" height="62" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="622" y="199" data-i18n="s06.14"></text>
      <rect x="600" y="270" width="440" height="62" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="622" y="309" data-i18n="s06.15"></text>
      <rect x="600" y="380" width="440" height="62" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="622" y="419" data-i18n="s06.16"></text>
      <rect x="600" y="480" width="440" height="62" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="622" y="519" data-i18n="s06.17"></text>
    </g>
    <g stroke="#006600" stroke-width="3" fill="none" marker-end="url(#ar6)">
      <path d="M1040,91 C1110,91 1100,130 1170,130"></path><path d="M1040,191 C1110,191 1100,150 1170,150"></path>
      <path d="M1040,301 C1110,301 1100,300 1170,300"></path>
      <path d="M1040,411 C1110,411 1100,460 1170,460"></path><path d="M1040,511 C1110,511 1100,480 1170,480"></path>
    </g>
    <g>
      <rect x="1180" y="80" width="500" height="120" fill="#e2eedf"></rect>
      <text x="1206" y="128" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s06.18"></text>
      <text x="1206" y="164" font-size="21" fill="#3f424a" data-i18n="s06.19"></text>
      <rect x="1180" y="240" width="500" height="120" fill="#e2eedf"></rect>
      <text x="1206" y="288" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s06.20"></text>
      <text x="1206" y="324" font-size="21" fill="#3f424a" data-i18n="s06.21"></text>
      <rect x="1180" y="400" width="500" height="120" fill="#121317"></rect>
      <text x="1206" y="448" class="serif" font-size="30" font-weight="600" fill="#f6f3ec" data-i18n="s06.22"></text>
      <text x="1206" y="484" font-size="21" fill="#c8c4ba" data-i18n="s06.23"></text>
    </g>
  </svg>
  <p class="lead" style="margin-top:0;font-size:30px" data-i18n="s06.24"></p>
  <div class="foot"><span class="wordmark" data-i18n="s06.25"></span><span data-i18n="s06.26"></span></div>
</section>

<!-- 7 · talent -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="kicker" data-i18n="s07.3"></div>
  <h2 style="font-size:64px" data-i18n="s07.4"></h2>
  <div class="cols w60 center" style="margin-top:36px;gap:60px">
    <svg viewBox="0 0 980 560" width="980" height="560">
      <defs><marker id="ar7" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#595c64"></path></marker></defs>
      <g stroke="#595c64" stroke-width="2.5" marker-end="url(#ar7)">
        <line x1="490" y1="280" x2="210" y2="110"></line><line x1="490" y1="280" x2="780" y2="110"></line><line x1="490" y1="280" x2="180" y2="440"></line><line x1="490" y1="280" x2="800" y2="440"></line><line x1="490" y1="280" x2="490" y2="490"></line>
      </g>
      <g font-size="20" fill="#3f424a" class="mono" text-anchor="middle" stroke="#f6f3ec" stroke-width="10" paint-order="stroke" stroke-linejoin="round">
        <text x="350" y="202" data-i18n="s07.5"></text>
        <text x="635" y="202" data-i18n="s07.6"></text>
        <text x="335" y="367" data-i18n="s07.7"></text>
        <text x="680" y="372" data-i18n="s07.8"></text>
        <text x="490" y="420" data-i18n="s07.9"></text>
      </g>
      <circle cx="490" cy="280" r="92" fill="#121317"></circle>
      <text x="490" y="276" text-anchor="middle" class="serif" font-size="30" font-weight="600" fill="#f6f3ec" data-i18n="s07.10"></text>
      <text x="490" y="306" text-anchor="middle" font-size="19" fill="#c8c4ba" data-i18n="s07.11"></text>
      <g font-size="24" font-weight="600" text-anchor="middle">
        <rect x="80" y="50" width="260" height="70" fill="#006600"></rect><text x="210" y="94" fill="#fff" data-i18n="s07.12"></text>
        <rect x="650" y="50" width="260" height="70" fill="#1f4fa8"></rect><text x="780" y="94" fill="#fff" data-i18n="s07.13"></text>
        <rect x="50" y="440" width="260" height="70" fill="#c52830"></rect><text x="180" y="484" fill="#fff" data-i18n="s07.14"></text>
        <rect x="670" y="440" width="260" height="70" fill="#8a6d1f"></rect><text x="800" y="484" fill="#fff" data-i18n="s07.15"></text>
        <rect x="360" y="490" width="260" height="70" fill="#5a7fc4"></rect><text x="490" y="534" fill="#fff" data-i18n="s07.16"></text>
      </g>
    </svg>
    <div>
      <div class="lbl2" data-i18n="s07.17"></div>
      <div class="smallstat stat" style="margin-bottom:26px"><div class="v" data-i18n="s07.18"></div><div class="l" data-i18n="s07.19"></div></div>
      <div class="smallstat stat" style="margin-bottom:26px"><div class="v" data-i18n="s07.20"></div><div class="l" data-i18n="s07.21"></div></div>
      <div class="smallstat stat r"><div class="v" data-i18n="s07.22"></div><div class="l" data-i18n="s07.23"></div></div>
      <p class="body" style="margin-top:30px;font-size:24px" data-i18n="s07.24"></p>
    </div>
  </div>
  <div class="src" data-i18n="s07.25"></div>
  <div class="foot"><span class="wordmark" data-i18n="s07.26"></span><span data-i18n="s07.27"></span></div>
</section>

<!-- 8 · jobs -->
<section class="slide pic lightpic">
  <img class="bg" src="img/talent-algarve.jpg" alt="">
  <div class="veil light" style="background:linear-gradient(90deg, rgba(246,243,236,.98) 0%, rgba(246,243,236,.95) 46%, rgba(246,243,236,.4) 62%, rgba(246,243,236,0) 75%)"></div>
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="inner" style="max-width:1080px;padding-top:120px;padding-bottom:140px">
    <div class="kicker" data-i18n="s08.3"></div>
    <h2 style="font-size:62px" data-i18n="s08.4"></h2>
    <div class="jobs">
      <div data-i18n="s08.5"></div>
      <div data-i18n="s08.6"></div>
      <div data-i18n="s08.7"></div>
      <div data-i18n="s08.8"></div>
      <div data-i18n="s08.9"></div>
      <div data-i18n="s08.10"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s08.11"></span><span data-i18n="s08.12"></span></div>
</section>

<!-- 9 · helping start startups -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="kicker" data-i18n="s09.3"></div>
  <h2 style="font-size:68px" data-i18n="s09.4"></h2>
  <div class="flow" style="margin-top:50px">
    <div class="step"><div class="n" data-i18n="s09.5"></div><h3 data-i18n="s09.6"></h3><p data-i18n="s09.7"></p></div>
    <div class="step"><div class="n" data-i18n="s09.8"></div><h3 data-i18n="s09.9"></h3><p data-i18n="s09.10"></p></div>
    <div class="step"><div class="n" data-i18n="s09.11"></div><h3 data-i18n="s09.12"></h3><p data-i18n="s09.13"></p></div>
    <div class="step"><div class="n" data-i18n="s09.14"></div><h3 data-i18n="s09.15"></h3><p data-i18n="s09.16"></p></div>
  </div>
  <div class="cols tight" style="margin-top:56px;gap:40px">
    <div class="card r"><div class="n" data-i18n="s09.17"></div><h3 data-i18n="s09.18"></h3><p data-i18n="s09.19"></p></div>
    <div class="card g"><div class="n" data-i18n="s09.20"></div><h3 data-i18n="s09.21"></h3><p data-i18n="s09.22"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s09.23"></span><span data-i18n="s09.24"></span></div>
</section>

<!-- 10 · what we already did -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 style="font-size:60px" data-i18n="s10.4"></h2>
  <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:44px;margin-top:36px;align-items:start">
    <div>
      <div class="shot"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.5"></span></div><img src="shots/algarve.jpg" alt="The Algarve Evolution page on PrompTugal.news" style="height:500px;object-fit:cover;object-position:top"></div>
      <div class="caption" data-i18n="s10.6"></div>
    </div>
    <div>
      <div class="shot"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.7"></span></div><img src="shots/ae-network.jpg" alt="The interactive network of Algarve Evolution" style="height:300px;object-fit:cover;object-position:center 40%"></div>
      <div class="shot" style="margin-top:22px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.8"></span></div><img src="shots/ae-timeline.jpg" alt="The Algarve Evolution timeline" style="height:150px;object-fit:cover;object-position:left top"></div>
      <div class="caption" data-i18n="s10.9"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s10.10"></span><span data-i18n="s10.11"></span></div>
</section>

<!-- 11 · the flywheel -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="cols w40 center" style="margin-top:0;height:100%;grid-template-columns:1fr 1.35fr;gap:40px">
    <div>
      <div class="kicker" data-i18n="s11.3"></div>
      <h2 style="font-size:66px" data-i18n="s11.4"></h2>
      <p class="lead" style="font-size:30px" data-i18n="s11.5"></p>
    </div>
    <svg viewBox="0 0 940 800" width="940" height="800">
      <defs><marker id="ar11" markerUnits="userSpaceOnUse" markerWidth="30" markerHeight="30" refX="24" refY="15" orient="auto"><path d="M0,0 L30,15 L0,30 z" fill="#006600"></path></marker></defs>
      <circle cx="470" cy="400" r="290" fill="none" stroke="#e2eedf" stroke-width="44"></circle>
      <g fill="none" stroke="#006600" stroke-width="6" marker-end="url(#ar11)">
        <path d="M662,183 A290,290 0 0 1 735,325"></path>
        <path d="M735,475 A290,290 0 0 1 680,600"></path>
        <path d="M270,610 A290,290 0 0 1 205,475"></path>
        <path d="M205,325 A290,290 0 0 1 280,183"></path>
      </g>
      <g text-anchor="middle">
        <rect x="290" y="56" width="360" height="120" fill="#c52830"></rect>
        <text x="470" y="108" class="serif" font-size="34" font-weight="600" fill="#fff" data-i18n="s11.6"></text>
        <text x="470" y="144" font-size="21" fill="#f8e4df" data-i18n="s11.7"></text>
        <rect x="580" y="340" width="350" height="120" fill="#121317"></rect>
        <text x="755" y="392" class="serif" font-size="34" font-weight="600" fill="#f6f3ec" data-i18n="s11.8"></text>
        <text x="755" y="428" font-size="21" fill="#c8c4ba" data-i18n="s11.9"></text>
        <rect x="270" y="630" width="400" height="120" fill="#1f4fa8"></rect>
        <text x="470" y="682" class="serif" font-size="32" font-weight="600" fill="#fff" data-i18n="s11.10"></text>
        <text x="470" y="718" font-size="21" fill="#dfe6f5" data-i18n="s11.11"></text>
        <rect x="10" y="340" width="350" height="120" fill="#006600"></rect>
        <text x="185" y="392" class="serif" font-size="34" font-weight="600" fill="#fff" data-i18n="s11.12"></text>
        <text x="185" y="428" font-size="21" fill="#e2eedf" data-i18n="s11.13"></text>
      </g>
      <text x="470" y="388" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s11.14"></text>
      <text x="470" y="420" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s11.15"></text>
    </svg>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s11.16"></span><span data-i18n="s11.17"></span></div>
</section>

<!-- 12 · what we ask of the ecosystem -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 style="font-size:68px" data-i18n="s12.4"></h2>
  <div class="cols c4" style="margin-top:56px;gap:28px">
    <div class="ask" style="border-top:8px solid var(--green)"><div class="n" data-i18n="s12.5"></div><div class="q" data-i18n="s12.6"></div><p data-i18n="s12.7"></p></div>
    <div class="ask" style="border-top:8px solid var(--red)"><div class="n" data-i18n="s12.8"></div><div class="q" data-i18n="s12.9"></div><p data-i18n="s12.10"></p></div>
    <div class="ask" style="border-top:8px solid var(--cobalt)"><div class="n" data-i18n="s12.11"></div><div class="q" data-i18n="s12.12"></div><p data-i18n="s12.13"></p></div>
    <div class="ask" style="border-top:8px solid var(--ink)"><div class="n" data-i18n="s12.14"></div><div class="q" data-i18n="s12.15"></div><p data-i18n="s12.16"></p></div>
  </div>
  <p class="lead" style="margin-top:56px" data-i18n="s12.17"></p>
  <div class="foot"><span class="wordmark" data-i18n="s12.18"></span><span data-i18n="s12.19"></span></div>
</section>

<!-- 13 · timeline -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="kicker" data-i18n="s13.3"></div>
  <h2 style="font-size:68px" data-i18n="s13.4"></h2>
  <div class="tl" style="grid-template-columns:repeat(6,1fr);margin-top:80px">
    <div class="ev"><div class="d" data-i18n="s13.5"></div><h3 data-i18n="s13.6"></h3><p data-i18n="s13.7"></p></div>
    <div class="ev"><div class="d" data-i18n="s13.8"></div><h3 data-i18n="s13.9"></h3><p data-i18n="s13.10"></p></div>
    <div class="ev now"><div class="d" data-i18n="s13.11"></div><h3 data-i18n="s13.12"></h3><p data-i18n="s13.13"></p></div>
    <div class="ev r"><div class="d" data-i18n="s13.14"></div><h3 data-i18n="s13.15"></h3><p data-i18n="s13.16"></p></div>
    <div class="ev"><div class="d" data-i18n="s13.17"></div><h3 data-i18n="s13.18"></h3><p data-i18n="s13.19"></p></div>
    <div class="ev"><div class="d" data-i18n="s13.20"></div><h3 data-i18n="s13.21"></h3><p data-i18n="s13.22"></p></div>
  </div>
  <div class="src" style="margin-top:60px" data-i18n="s13.23"></div>
  <div class="foot"><span class="wordmark" data-i18n="s13.24"></span><span data-i18n="s13.25"></span></div>
</section>

<!-- 14 · close -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="bigquote" style="color:var(--paper)" data-i18n="s14.3"></div>
  <div class="cols c4" style="margin-top:90px;gap:30px">
    <div><div class="tag" style="color:#8fd18f" data-i18n="s14.4"></div><p class="body" style="color:#c8c4ba" data-i18n="s14.5"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s14.6"></div><p class="body" style="color:#c8c4ba" data-i18n="s14.7"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s14.8"></div><p class="body" style="color:#c8c4ba" data-i18n="s14.9"></p></div>
    <div><div class="tag" style="color:#ff7a7f" data-i18n="s14.10"></div><p class="body" style="color:var(--paper)"><b data-i18n="s14.11"></b></p></div>
  </div>
  <p class="lead" style="margin-top:60px" data-i18n="s14.12"></p>
  <div class="foot"><span class="wordmark" data-i18n="s14.13"></span><span data-i18n="s14.14"></span></div>
</section>

</main><script src="deck.js"></script>
</body></html>
