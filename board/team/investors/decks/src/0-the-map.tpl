<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
/* deck 0, the map: the other nine decks as one story. Thumbnails of their slides are framed as small screens. */
.abs { position: absolute; }
.scr { background: var(--panel); border: 1px solid var(--rule-2); box-shadow: 0 22px 44px -18px rgba(18,19,23,.4); overflow: hidden; }
.scr .bar { height: 30px; background: var(--paper-2); border-bottom: 1px solid var(--hair); display: flex; align-items: center; gap: 8px; padding: 0 12px; font: 400 15px/1 var(--mono); color: var(--ink-3); }
.scr .bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--hair); display: inline-block; }
.scr .bar span { margin-left: 10px; }
.scr img { display: block; width: 100%; }
.slide.ink .scr { border-color: #3a3b40; box-shadow: 0 26px 50px -18px rgba(0,0,0,.7); }
.badge { position: absolute; width: 54px; height: 54px; border-radius: 50%; background: var(--red); color: #fff; font: 600 30px/54px var(--serif); text-align: center; box-shadow: 0 0 0 6px rgba(197,40,48,.25); z-index: 2; }
.badge.g { background: var(--green); box-shadow: 0 0 0 6px rgba(0,102,0,.25); }
/* the pair slides: the best argument of two decks */
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 34px; }
.pair .dk { font: 500 20px/1.2 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--green); margin-bottom: 14px; }
.pair .dk b { color: var(--red); font-weight: 500; }
.pair .scr { width: 100%; }
.q { font: 400 italic 31px/1.3 var(--serif); color: var(--ink); border-left: 8px solid var(--red); padding: 4px 0 4px 26px; margin-top: 26px; }
.q.g { border-left-color: var(--green); }
.why2 { font: 400 22px/1.42 var(--sans); color: var(--ink-2); margin-top: 14px; padding-left: 34px; }
.why2 b { color: var(--ink); }
/* routes */
.route { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.chip { display: inline-block; min-width: 46px; height: 46px; padding: 0 10px; border-radius: 23px; background: var(--ink); color: var(--paper); font: 600 26px/46px var(--serif); text-align: center; }
.chip.g { background: var(--green); } .chip.r { background: var(--red); }
.arr { font: 400 24px/1 var(--mono); color: var(--ink-3); }
.mins { font: 500 20px/1 var(--mono); color: var(--ink-3); letter-spacing: .06em; margin-top: 18px; }
.mins b { color: var(--green); font-weight: 500; }
.rc { background: var(--panel); border: 1px solid var(--hair); border-top: 8px solid var(--green); padding: 24px 28px 26px; }
.rc.r { border-top-color: var(--red); } .rc.c { border-top-color: var(--cobalt); } .rc.k { border-top-color: var(--ink); }
.rc h3 { font-size: 31px; } .rc p { font: 400 21px/1.4 var(--sans); color: var(--ink-2); margin-top: 8px; }
/* the wall */
.wall { display: grid; grid-template-columns: repeat(6, 1fr); gap: 30px 26px; margin-top: 40px; }
.wall .scr .bar { height: 26px; font-size: 14px; }
.wall .t { font: 500 18px/1.2 var(--mono); color: var(--ink-3); margin-top: 9px; letter-spacing: .04em; }
.wall .t b { color: var(--green); font-weight: 500; }
.wall > div:nth-child(odd) .scr { transform: rotate(-0.8deg); } .wall > div:nth-child(even) .scr { transform: rotate(0.7deg); }
/* the closing list */
.ten { display: grid; grid-template-columns: repeat(5, 1fr); gap: 18px; margin-top: 36px; }
.ten > div { border: 1px solid #3a3b40; border-top: 6px solid #4caf50; padding: 18px 20px 20px; background: #1d1e23; }
.ten > div.me { border-top-color: #ff7a7f; }
.ten .n { font: 600 40px/1 var(--serif); color: #8fd18f; }
.ten div.me .n { color: #ff7a7f; }
.ten .w { font: 400 21px/1.3 var(--sans); color: #e6e2d8; margin-top: 8px; }
.urlrow { font: 500 34px/1.3 var(--mono); color: var(--paper); }
.urlrow span { color: #8fd18f; }
</style></head>
<body><main class="deck">

<!-- 1 · cover: a collage of the nine covers -->
<section class="slide ink" style="padding:0">
  <div class="head"><span data-i18n="s01.1"></span><span data-i18n="s01.2"></span></div>
  <div class="abs" style="left:120px;top:220px;width:700px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:108px" data-i18n="s01.4"></h1>
    <p class="lead" style="font-size:31px" data-i18n="s01.5"></p>
  </div>
  <div class="scr abs" style="left:880px;top:200px;width:300px;transform:rotate(-2deg)"><img src="img/map/d1-01.jpg" alt="Deck 1 cover"></div>
  <div class="scr abs" style="left:1210px;top:186px;width:300px;transform:rotate(1.2deg)"><img src="img/map/d2-01.jpg" alt="Deck 2 cover"></div>
  <div class="scr abs" style="left:1540px;top:206px;width:300px;transform:rotate(-1deg)"><img src="img/map/d3-01.jpg" alt="Deck 3 cover"></div>
  <div class="scr abs" style="left:870px;top:428px;width:300px;transform:rotate(1.4deg)"><img src="img/map/d4-01.jpg" alt="Deck 4 cover"></div>
  <div class="scr abs" style="left:1205px;top:422px;width:300px;transform:rotate(-0.8deg)"><img src="img/map/d5-01.jpg" alt="Deck 5 cover"></div>
  <div class="scr abs" style="left:1545px;top:436px;width:300px;transform:rotate(1.8deg)"><img src="img/map/d6-01.jpg" alt="Deck 6 cover"></div>
  <div class="scr abs" style="left:885px;top:656px;width:300px;transform:rotate(-1.2deg)"><img src="img/map/d7-01.jpg" alt="Deck 7 cover"></div>
  <div class="scr abs" style="left:1215px;top:660px;width:300px;transform:rotate(1deg)"><img src="img/map/d8-01.jpg" alt="Deck 8 cover"></div>
  <div class="scr abs" style="left:1540px;top:650px;width:300px;transform:rotate(-1.6deg)"><img src="img/map/d9-01.jpg" alt="Deck 9 cover"></div>
  <div class="badge g" style="left:858px;top:178px" data-i18n="s01.6"></div><div class="badge g" style="left:1190px;top:164px" data-i18n="s01.7"></div><div class="badge g" style="left:1520px;top:184px" data-i18n="s01.8"></div>
  <div class="badge g" style="left:848px;top:406px" data-i18n="s01.9"></div><div class="badge" style="left:1184px;top:400px" data-i18n="s01.10"></div><div class="badge g" style="left:1524px;top:414px" data-i18n="s01.11"></div>
  <div class="badge" style="left:864px;top:634px" data-i18n="s01.12"></div><div class="badge g" style="left:1194px;top:638px" data-i18n="s01.13"></div><div class="badge g" style="left:1518px;top:628px" data-i18n="s01.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s01.15"></span><span data-i18n="s01.16"></span></div>
</section>

<!-- 2 · the story in one line, and why nine decks -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <h2 style="max-width:1640px" data-i18n="s02.4"></h2>
  <div class="cols c3" style="margin-top:64px">
    <div class="card g"><div class="n" data-i18n="s02.5"></div><h3 data-i18n="s02.6"></h3><p data-i18n="s02.7"></p></div>
    <div class="card g"><div class="n" data-i18n="s02.8"></div><h3 data-i18n="s02.9"></h3><p data-i18n="s02.10"></p></div>
    <div class="card r"><div class="n" data-i18n="s02.11"></div><h3 data-i18n="s02.12"></h3><p data-i18n="s02.13"></p></div>
  </div>
  <div class="src" data-i18n="s02.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s02.15"></span><span data-i18n="s02.16"></span></div>
</section>

<!-- 3 · the map: the nine decks as a journey -->
<section class="slide">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 style="font-size:64px" data-i18n="s03.4"></h2>
  <svg viewBox="0 0 1680 640" width="1680" height="640" style="margin-top:26px">
    <path d="M60 120 H1420 C1640 120 1640 420 1420 420 H300" fill="none" stroke="#121317" stroke-width="5"></path>
    <path d="M60 144 C 60 330, 120 420, 236 420" fill="none" stroke="#c52830" stroke-width="5" stroke-dasharray="10 8"></path>
    <path d="M216 404 L240 420 L216 436" fill="none" stroke="#c52830" stroke-width="5"></path>
    <text x="0" y="300" class="mono" font-size="18" fill="#c52830" transform="rotate(-90 22 300)" text-anchor="middle" data-i18n="s03.5"></text>
    <!-- start: deck 0 -->
    <circle cx="60" cy="120" r="22" fill="#c52830"></circle><text x="60" y="128" text-anchor="middle" class="serif" font-size="24" font-weight="600" fill="#fff" data-i18n="s03.6"></text>
    <text x="20" y="62" class="mono" font-size="18" fill="#c52830" letter-spacing="2" data-i18n="s03.7"></text>
    <!-- row 1 -->
    <g transform="translate(300,120)">
      <circle r="56" fill="#006600"></circle><text y="12" text-anchor="middle" class="serif" font-size="36" font-weight="600" fill="#fff" data-i18n="s03.8"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#006600" letter-spacing="3" data-i18n="s03.9"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.10"></text>
      <text y="128" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.11"></text>
      <text y="162" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.12"></text>
    </g>
    <g transform="translate(660,120)">
      <circle r="56" fill="#006600"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.13"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#006600" letter-spacing="3" data-i18n="s03.14"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.15"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.16"></text>
    </g>
    <g transform="translate(1020,120)">
      <circle r="56" fill="#006600"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.17"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#006600" letter-spacing="3" data-i18n="s03.18"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.19"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.20"></text>
    </g>
    <g transform="translate(1380,120)">
      <circle r="56" fill="#006600"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.21"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#006600" letter-spacing="3" data-i18n="s03.22"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.23"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.24"></text>
    </g>
    <!-- row 2, right to left -->
    <g transform="translate(1380,420)">
      <circle r="56" fill="#c52830"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.25"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#c52830" letter-spacing="3" data-i18n="s03.26"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.27"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.28"></text>
    </g>
    <g transform="translate(1020,420)">
      <circle r="56" fill="#c52830"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.29"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#c52830" letter-spacing="3" data-i18n="s03.30"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.31"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.32"></text>
    </g>
    <g transform="translate(660,420)">
      <circle r="56" fill="#1f4fa8"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.33"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#1f4fa8" letter-spacing="3" data-i18n="s03.34"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.35"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.36"></text>
    </g>
    <g transform="translate(300,420)">
      <circle r="56" fill="#121317"></circle><text y="13" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s03.37"></text>
      <text y="-74" text-anchor="middle" class="mono" font-size="20" fill="#121317" letter-spacing="3" data-i18n="s03.38"></text>
      <text y="96" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#121317" data-i18n="s03.39"></text>
      <text y="130" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s03.40"></text>
    </g>
    <!-- legend -->
    <g transform="translate(0,632)" font-size="20" fill="#3f424a">
      <circle cx="10" cy="-7" r="10" fill="#006600"></circle><text x="30" y="0" data-i18n="s03.41"></text>
      <circle cx="330" cy="-7" r="10" fill="#c52830"></circle><text x="350" y="0" data-i18n="s03.42"></text>
      <circle cx="640" cy="-7" r="10" fill="#1f4fa8"></circle><text x="660" y="0" data-i18n="s03.43"></text>
      <circle cx="810" cy="-7" r="10" fill="#121317"></circle><text x="830" y="0" data-i18n="s03.44"></text>
      <text x="1100" y="0" class="mono" font-size="18" fill="#c52830" data-i18n="s03.45"></text>
    </g>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s03.46"></span><span data-i18n="s03.47"></span></div>
</section>

<!-- 4 · the narrative arc -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="kicker" data-i18n="s04.3"></div>
  <h2 data-i18n="s04.4"></h2>
  <div class="tl" style="grid-template-columns:repeat(8,1fr);margin-top:64px">
    <div class="ev r"><div class="d" data-i18n="s04.5"></div><h3 style="font-size:28px" data-i18n="s04.6"></h3><p style="font-size:21px" data-i18n="s04.7"></p></div>
    <div class="ev r"><div class="d" data-i18n="s04.8"></div><h3 style="font-size:28px" data-i18n="s04.9"></h3><p style="font-size:21px" data-i18n="s04.10"></p></div>
    <div class="ev"><div class="d" data-i18n="s04.11"></div><h3 style="font-size:28px" data-i18n="s04.12"></h3><p style="font-size:21px" data-i18n="s04.13"></p></div>
    <div class="ev"><div class="d" data-i18n="s04.14"></div><h3 style="font-size:28px" data-i18n="s04.15"></h3><p style="font-size:21px" data-i18n="s04.16"></p></div>
    <div class="ev"><div class="d" data-i18n="s04.17"></div><h3 style="font-size:28px" data-i18n="s04.18"></h3><p style="font-size:21px" data-i18n="s04.19"></p></div>
    <div class="ev"><div class="d" data-i18n="s04.20"></div><h3 style="font-size:28px" data-i18n="s04.21"></h3><p style="font-size:21px" data-i18n="s04.22"></p></div>
    <div class="ev"><div class="d" data-i18n="s04.23"></div><h3 style="font-size:28px" data-i18n="s04.24"></h3><p style="font-size:21px" data-i18n="s04.25"></p></div>
    <div class="ev now"><div class="d" data-i18n="s04.26"></div><h3 style="font-size:28px" data-i18n="s04.27"></h3><p style="font-size:21px" data-i18n="s04.28"></p></div>
  </div>
  <svg viewBox="0 0 1680 120" width="1680" height="120" style="margin-top:44px">
    <defs><linearGradient id="arc" x1="0" x2="1"><stop offset="0" stop-color="#c52830"></stop><stop offset="1" stop-color="#006600"></stop></linearGradient></defs>
    <path d="M0 100 C 500 100, 900 20, 1660 14" fill="none" stroke="url(#arc)" stroke-width="10" stroke-linecap="round"></path>
    <text x="0" y="68" class="mono" font-size="20" fill="#c52830" letter-spacing="2" data-i18n="s04.29"></text>
    <text x="1660" y="62" text-anchor="end" class="mono" font-size="20" fill="#006600" letter-spacing="2" data-i18n="s04.30"></text>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s04.31"></span><span data-i18n="s04.32"></span></div>
</section>

<!-- 5 · decks 1 and 2 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="kicker" data-i18n="s05.3"></div>
  <h2 style="font-size:60px" data-i18n="s05.4"></h2>
  <div class="pair">
    <div>
      <div class="dk" data-i18n="s05.5"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.6"></span></div><img src="img/map/d1-04.jpg" alt="Deck 1, slide 4: we sell time, the experience and trust"></div>
      <div class="q" data-i18n="s05.7"></div>
      <div class="why2" data-i18n="s05.8"></div>
    </div>
    <div>
      <div class="dk" data-i18n="s05.9"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.10"></span></div><img src="img/map/d2-07.jpg" alt="Deck 2, slide 7: the bridge, five days against fifty-seven"></div>
      <div class="q g" data-i18n="s05.11"></div>
      <div class="why2" data-i18n="s05.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s05.13"></span><span data-i18n="s05.14"></span></div>
</section>

<!-- 6 · decks 3 and 4 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 style="font-size:60px" data-i18n="s06.4"></h2>
  <div class="pair">
    <div>
      <div class="dk" data-i18n="s06.5"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s06.6"></span></div><img src="img/map/d3-17.jpg" alt="Deck 3, slide 17: three days from the first commit"></div>
      <div class="q g" data-i18n="s06.7"></div>
      <div class="why2" data-i18n="s06.8"></div>
    </div>
    <div>
      <div class="dk" data-i18n="s06.9"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s06.10"></span></div><img src="img/map/d4-15.jpg" alt="Deck 4, slide 15: the Algarve, Portugal and the European Union"></div>
      <div class="q" data-i18n="s06.11"></div>
      <div class="why2" data-i18n="s06.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s06.13"></span><span data-i18n="s06.14"></span></div>
</section>

<!-- 7 · decks 5 and 6 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="kicker" data-i18n="s07.3"></div>
  <h2 style="font-size:60px" data-i18n="s07.4"></h2>
  <div class="pair">
    <div>
      <div class="dk" data-i18n="s07.5"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s07.6"></span></div><img src="img/map/d5-15.jpg" alt="Deck 5, slide 15: the investor's three questions"></div>
      <div class="q" data-i18n="s07.7"></div>
      <div class="why2" data-i18n="s07.8"></div>
    </div>
    <div>
      <div class="dk" data-i18n="s07.9"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s07.10"></span></div><img src="img/map/d6-02.jpg" alt="Deck 6, slide 2: one person, about twenty agents"></div>
      <div class="q g" data-i18n="s07.11"></div>
      <div class="why2" data-i18n="s07.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s07.13"></span><span data-i18n="s07.14"></span></div>
</section>

<!-- 8 · decks 7 and 8 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="kicker" data-i18n="s08.3"></div>
  <h2 style="font-size:60px" data-i18n="s08.4"></h2>
  <div class="pair">
    <div>
      <div class="dk" data-i18n="s08.5"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s08.6"></span></div><img src="img/map/d7-07.jpg" alt="Deck 7, slide 7: Dinis builds the technology, you run the company"></div>
      <div class="q" data-i18n="s08.7"></div>
      <div class="why2" data-i18n="s08.8"></div>
    </div>
    <div>
      <div class="dk" data-i18n="s08.9"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s08.10"></span></div><img src="img/map/d8-13.jpg" alt="Deck 8, slide 13: the moat is decisions"></div>
      <div class="q g" data-i18n="s08.11"></div>
      <div class="why2" data-i18n="s08.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s08.13"></span><span data-i18n="s08.14"></span></div>
</section>

<!-- 9 · deck 9, and the line that runs through them all -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="kicker" data-i18n="s09.3"></div>
  <h2 style="font-size:60px" data-i18n="s09.4"></h2>
  <div class="pair">
    <div>
      <div class="dk" data-i18n="s09.5"></div>
      <div class="scr"><div class="bar"><i></i><i></i><i></i><span data-i18n="s09.6"></span></div><img src="img/map/d9-04.jpg" alt="Deck 9, slide 4: every fact with its source, every article signed"></div>
      <div class="q g" data-i18n="s09.7"></div>
      <div class="why2" data-i18n="s09.8"></div>
    </div>
    <div style="background:var(--ink);color:var(--paper);padding:44px 48px;align-self:stretch;display:flex;flex-direction:column">
      <div class="dk" style="color:#8fd18f" data-i18n="s09.9"></div>
      <p style="font:400 italic 46px/1.22 var(--serif);margin-top:18px" data-i18n="s09.10"></p>
      <p style="font:400 23px/1.45 var(--sans);color:#c8c4ba;margin-top:30px" data-i18n="s09.11"></p>
      <p class="src" style="color:#9a978f;margin-top:auto" data-i18n="s09.12"></p>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s09.13"></span><span data-i18n="s09.14"></span></div>
</section>

<!-- 10 · the collage wall -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 style="font-size:60px" data-i18n="s10.4"></h2>
  <div class="wall">
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d1-04.jpg" alt=""></div><div class="t" data-i18n="s10.5"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d1-07.jpg" alt=""></div><div class="t" data-i18n="s10.6"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d2-05.jpg" alt=""></div><div class="t" data-i18n="s10.7"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d2-07.jpg" alt=""></div><div class="t" data-i18n="s10.8"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d3-03.jpg" alt=""></div><div class="t" data-i18n="s10.9"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d3-17.jpg" alt=""></div><div class="t" data-i18n="s10.10"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d4-01.jpg" alt=""></div><div class="t" data-i18n="s10.11"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d4-15.jpg" alt=""></div><div class="t" data-i18n="s10.12"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d5-11.jpg" alt=""></div><div class="t" data-i18n="s10.13"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d5-15.jpg" alt=""></div><div class="t" data-i18n="s10.14"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d6-02.jpg" alt=""></div><div class="t" data-i18n="s10.15"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d6-08.jpg" alt=""></div><div class="t" data-i18n="s10.16"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d7-07.jpg" alt=""></div><div class="t" data-i18n="s10.17"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d7-10.jpg" alt=""></div><div class="t" data-i18n="s10.18"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d8-13.jpg" alt=""></div><div class="t" data-i18n="s10.19"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d8-15.jpg" alt=""></div><div class="t" data-i18n="s10.20"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d9-04.jpg" alt=""></div><div class="t" data-i18n="s10.21"></div></div>
    <div><div class="scr"><div class="bar"><i></i><i></i><i></i></div><img src="img/map/d9-06.jpg" alt=""></div><div class="t" data-i18n="s10.22"></div></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s10.23"></span><span data-i18n="s10.24"></span></div>
</section>

<!-- 11 · which route for you -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="kicker" data-i18n="s11.3"></div>
  <h2 style="font-size:60px" data-i18n="s11.4"></h2>
  <div class="cols c3" style="margin-top:38px;gap:30px">
    <div class="rc r"><h3 data-i18n="s11.5"></h3><p data-i18n="s11.6"></p><div class="route"><span class="chip r" data-i18n="s11.7"></span><span class="arr" data-i18n="s11.8"></span><span class="chip r" data-i18n="s11.9"></span><span class="arr" data-i18n="s11.10"></span><span class="chip r" data-i18n="s11.11"></span><span class="arr" data-i18n="s11.12"></span><span class="chip r" data-i18n="s11.13"></span></div><div class="mins" data-i18n="s11.14"></div></div>
    <div class="rc g"><h3 data-i18n="s11.15"></h3><p data-i18n="s11.16"></p><div class="route"><span class="chip g" data-i18n="s11.17"></span><span class="arr" data-i18n="s11.18"></span><span class="chip g" data-i18n="s11.19"></span><span class="arr" data-i18n="s11.20"></span><span class="chip g" data-i18n="s11.21"></span></div><div class="mins" data-i18n="s11.22"></div></div>
    <div class="rc k"><h3 data-i18n="s11.23"></h3><p data-i18n="s11.24"></p><div class="route"><span class="chip" data-i18n="s11.25"></span><span class="arr" data-i18n="s11.26"></span><span class="chip" data-i18n="s11.27"></span><span class="arr" data-i18n="s11.28"></span><span class="chip" data-i18n="s11.29"></span><span class="arr" data-i18n="s11.30"></span><span class="chip" data-i18n="s11.31"></span></div><div class="mins" data-i18n="s11.32"></div></div>
    <div class="rc c"><h3 data-i18n="s11.33"></h3><p data-i18n="s11.34"></p><div class="route"><span class="chip" data-i18n="s11.35"></span><span class="arr" data-i18n="s11.36"></span><span class="chip" data-i18n="s11.37"></span><span class="arr" data-i18n="s11.38"></span><span class="chip" data-i18n="s11.39"></span></div><div class="mins" data-i18n="s11.40"></div></div>
    <div class="rc g"><h3 data-i18n="s11.41"></h3><p data-i18n="s11.42"></p><div class="route"><span class="chip g" data-i18n="s11.43"></span><span class="arr" data-i18n="s11.44"></span><span class="chip g" data-i18n="s11.45"></span><span class="arr" data-i18n="s11.46"></span><span class="chip g" data-i18n="s11.47"></span></div><div class="mins" data-i18n="s11.48"></div></div>
    <div class="rc c"><h3 data-i18n="s11.49"></h3><p data-i18n="s11.50"></p><div class="route"><span class="chip" style="background:#1f4fa8" data-i18n="s11.51"></span><span class="arr" data-i18n="s11.52"></span><span class="chip" style="background:#1f4fa8" data-i18n="s11.53"></span><span class="arr" data-i18n="s11.54"></span><span class="chip" style="background:#1f4fa8" data-i18n="s11.55"></span></div><div class="mins" data-i18n="s11.56"></div></div>
  </div>
  <div class="src" data-i18n="s11.57"></div>
  <div class="foot"><span class="wordmark" data-i18n="s11.58"></span><span data-i18n="s11.59"></span></div>
</section>

<!-- 12 · read them all in sequence -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 style="font-size:60px" data-i18n="s12.4"></h2>
  <svg viewBox="0 0 1680 560" width="1680" height="560" style="margin-top:40px">
    <text x="0" y="24" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s12.5"></text>
    <!-- 159 slides over 1680px: 10.566 px a slide -->
    <g transform="translate(0,48)">
      <rect x="0" y="0" width="146" height="110" fill="#c52830"></rect><text x="73" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.6"></text>
      <rect x="150" y="0" width="154" height="110" fill="#006600"></rect><text x="227" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.7"></text>
      <rect x="308" y="0" width="165" height="110" fill="#006600" opacity=".85"></rect><text x="390" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.8"></text>
      <rect x="477" y="0" width="186" height="110" fill="#006600"></rect><text x="570" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.9"></text>
      <rect x="667" y="0" width="154" height="110" fill="#006600" opacity=".85"></rect><text x="744" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.10"></text>
      <rect x="825" y="0" width="165" height="110" fill="#c52830"></rect><text x="907" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.11"></text>
      <rect x="994" y="0" width="165" height="110" fill="#006600"></rect><text x="1076" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.12"></text>
      <rect x="1163" y="0" width="144" height="110" fill="#c52830" opacity=".85"></rect><text x="1235" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.13"></text>
      <rect x="1311" y="0" width="186" height="110" fill="#1f4fa8"></rect><text x="1404" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.14"></text>
      <rect x="1501" y="0" width="179" height="110" fill="#121317"></rect><text x="1590" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.15"></text>
      <g font-size="19" fill="#3f424a" text-anchor="middle" class="mono">
        <text x="73" y="142" data-i18n="s12.16"></text><text x="227" y="142" data-i18n="s12.17"></text><text x="390" y="142" data-i18n="s12.18"></text><text x="570" y="142" data-i18n="s12.19"></text><text x="744" y="142" data-i18n="s12.20"></text>
        <text x="907" y="142" data-i18n="s12.21"></text><text x="1076" y="142" data-i18n="s12.22"></text><text x="1235" y="142" data-i18n="s12.23"></text><text x="1404" y="142" data-i18n="s12.24"></text><text x="1590" y="142" data-i18n="s12.25"></text>
      </g>
      <g font-size="20" fill="#595c64" class="mono"><text x="0" y="186" data-i18n="s12.26"></text><text x="820" y="186" text-anchor="middle" data-i18n="s12.27"></text><text x="1680" y="186" text-anchor="end" data-i18n="s12.28"></text></g>
      <path d="M825 -6 V128" stroke="#121317" stroke-width="3" stroke-dasharray="6 6"></path>
    </g>
    <text x="0" y="318" class="mono" font-size="20" fill="#c52830" letter-spacing="2" data-i18n="s12.29"></text>
    <g transform="translate(0,342)">
      <rect x="0" y="0" width="179" height="110" fill="#121317"></rect><text x="89" y="66" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s12.30"></text>
      <path d="M192 55 H232" stroke="#c52830" stroke-width="5"></path><path d="M222 43 L236 55 L222 67" fill="none" stroke="#c52830" stroke-width="5"></path>
      <rect x="250" y="0" width="1430" height="110" fill="#ece7db"></rect>
      <text x="290" y="48" class="serif" font-size="32" font-weight="600" fill="#121317" data-i18n="s12.31"></text>
      <text x="290" y="86" font-size="22" fill="#3f424a" data-i18n="s12.32"></text>
    </g>
  </svg>
  <div class="src" data-i18n="s12.33"></div>
  <div class="foot"><span class="wordmark" data-i18n="s12.34"></span><span data-i18n="s12.35"></span></div>
</section>

<!-- 13 · what we want from you now -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="kicker red" data-i18n="s13.3"></div>
  <h2 data-i18n="s13.4"></h2>
  <div class="flow" style="margin-top:60px">
    <div class="step"><div class="n" data-i18n="s13.5"></div><h3 data-i18n="s13.6"></h3><p data-i18n="s13.7"></p></div>
    <div class="step"><div class="n" data-i18n="s13.8"></div><h3 data-i18n="s13.9"></h3><p data-i18n="s13.10"></p></div>
    <div class="step"><div class="n" data-i18n="s13.11"></div><h3 data-i18n="s13.12"></h3><p data-i18n="s13.13"></p></div>
    <div class="step"><div class="n" data-i18n="s13.14"></div><h3 data-i18n="s13.15"></h3><p data-i18n="s13.16"></p></div>
  </div>
  <div class="src" data-i18n="s13.17"></div>
  <div class="foot"><span class="wordmark" data-i18n="s13.18"></span><span data-i18n="s13.19"></span></div>
</section>

<!-- 14 · close: all ten decks -->
<section class="slide ink v">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="kicker" data-i18n="s14.3"></div>
  <h2 style="font-size:72px" data-i18n="s14.4"></h2>
  <div class="ten">
    <div class="me"><div class="n" data-i18n="s14.5"></div><div class="w" data-i18n="s14.6"></div></div>
    <div><div class="n" data-i18n="s14.7"></div><div class="w" data-i18n="s14.8"></div></div>
    <div><div class="n" data-i18n="s14.9"></div><div class="w" data-i18n="s14.10"></div></div>
    <div><div class="n" data-i18n="s14.11"></div><div class="w" data-i18n="s14.12"></div></div>
    <div><div class="n" data-i18n="s14.13"></div><div class="w" data-i18n="s14.14"></div></div>
    <div><div class="n" data-i18n="s14.15"></div><div class="w" data-i18n="s14.16"></div></div>
    <div><div class="n" data-i18n="s14.17"></div><div class="w" data-i18n="s14.18"></div></div>
    <div><div class="n" data-i18n="s14.19"></div><div class="w" data-i18n="s14.20"></div></div>
    <div><div class="n" data-i18n="s14.21"></div><div class="w" data-i18n="s14.22"></div></div>
    <div><div class="n" data-i18n="s14.23"></div><div class="w" data-i18n="s14.24"></div></div>
  </div>
  <p class="urlrow" style="margin-top:34px" data-i18n="s14.25"></p>
  <p class="lead" style="font-size:28px;margin-top:14px" data-i18n="s14.26"></p>
  <div class="foot"><span class="wordmark" data-i18n="s14.27"></span><span data-i18n="s14.28"></span></div>
</section>

</main>
<script src="deck.js"></script>

</body></html>
