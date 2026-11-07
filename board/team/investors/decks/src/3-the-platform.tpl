<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
/* deck 3 only: annotated screenshots, layered composition, callout lists */
.scr { position: relative; }
.scr img { display: block; width: 100%; }
.pin { position: absolute; width: 50px; height: 50px; margin: -25px 0 0 -25px; border-radius: 50%; background: var(--red); color: #fff; font: 600 28px/50px var(--serif); text-align: center; box-shadow: 0 0 0 7px rgba(197,40,48,.22), 0 6px 14px rgba(18,19,23,.3); z-index: 3; }
.pin.g { background: var(--green); box-shadow: 0 0 0 7px rgba(0,102,0,.22), 0 6px 14px rgba(18,19,23,.3); }
.hot { position: absolute; border: 4px solid var(--red); border-radius: 8px; z-index: 2; background: rgba(197,40,48,.06); }
.hot.g { border-color: var(--green); background: rgba(0,102,0,.06); }
ol.co { list-style: none; counter-reset: co; margin-top: 8px; }
ol.co li { counter-increment: co; position: relative; padding-left: 70px; margin: 0 0 22px; font: 400 23px/1.4 var(--sans); color: var(--ink-2); }
ol.co li::before { content: counter(co); position: absolute; left: 0; top: -2px; width: 46px; height: 46px; border-radius: 50%; background: var(--red); color: #fff; font: 600 26px/46px var(--serif); text-align: center; }
ol.co.g li::before { background: var(--green); }
ol.co li b { color: var(--ink); display: block; font: 600 26px/1.25 var(--serif); margin-bottom: 2px; }
.slide.ink ol.co li { color: #c8c4ba; } .slide.ink ol.co li b { color: var(--paper); }
.stage { position: relative; }
.abs { position: absolute; }
.shot.sm .bar { height: 34px; font-size: 15px; }
.badge { display: inline-block; font: 500 18px/1 var(--mono); letter-spacing: .1em; text-transform: uppercase; background: var(--red); color: #fff; padding: 10px 14px; }
.badge.g { background: var(--green); } .badge.k { background: var(--ink); }
.note { background: var(--panel); border-left: 8px solid var(--green); padding: 22px 26px; font: 400 23px/1.42 var(--sans); color: var(--ink-2); box-shadow: 0 20px 40px -20px rgba(18,19,23,.3); }
.note b { color: var(--ink); }
.note.r { border-left-color: var(--red); }
.aud { background: var(--panel); border: 1px solid var(--hair); border-top: 8px solid var(--green); padding: 28px 26px 30px; }
.aud .n { font: 500 19px/1 var(--mono); letter-spacing: .12em; color: var(--green); margin-bottom: 14px; }
.aud h3 { font-size: 32px; margin-bottom: 10px; } .aud p { font: 400 22px/1.42 var(--sans); color: var(--ink-2); }
.bignum { font: 600 120px/1 var(--serif); letter-spacing: -.03em; }
.sgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 34px 40px; }
.sgrid .stat .v { font-size: 84px; }
.urlrow { font: 500 36px/1.3 var(--mono); color: var(--paper); }
.urlrow span { color: #8fd18f; }
</style></head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide ink" style="padding:0">
  <div class="head"><span data-i18n="s01.1"></span><span data-i18n="s01.2"></span></div>
  <div class="abs" style="left:120px;top:190px;width:760px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:100px" data-i18n="s01.4"></h1>
    <p class="lead" style="font-size:31px" data-i18n="s01.5"></p>
    <div style="margin-top:44px"><span class="tag" style="color:#8fd18f" data-i18n="s01.6"></span><span class="tag" style="color:#ff9a9e" data-i18n="s01.7"></span></div>
  </div>
  <div class="shot abs" style="left:930px;top:150px;width:880px;transform:rotate(-1.2deg)"><div class="bar"><i></i><i></i><i></i><span data-i18n="s01.8"></span></div><img src="shots/p3-article.jpg" alt="A PrompTugal.news article"></div>
  <div class="phone abs" style="left:1190px;top:430px;width:240px;transform:rotate(-3deg)"><img src="shots/p3-m-ask.jpg" alt="Ask the newsroom on a phone"></div>
  <div class="phone abs" style="left:1520px;top:400px;width:250px;transform:rotate(2.5deg)"><img src="shots/p3-m-myday.jpg" alt="My day on a phone"></div>
  <div class="foot"><span class="wordmark" data-i18n="s01.9"></span><span data-i18n="s01.10"></span></div>
</section>

<!-- 2 · what it is -->
<section class="slide">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <h2 data-i18n="s02.4"></h2>
  <div style="margin-top:46px;background:var(--ink);color:var(--paper);padding:30px 40px;display:grid;grid-template-columns:auto 1fr;gap:40px;align-items:center">
    <div style="font:600 40px/1.1 var(--serif)" data-i18n="s02.5"></div>
    <div style="font:400 25px/1.45 var(--sans);color:#c8c4ba" data-i18n="s02.6"></div>
  </div>
  <svg viewBox="0 0 1680 46" width="1680" height="46" style="display:block"><g stroke="#006600" stroke-width="3" fill="none"><path d="M168 0 V40"></path><path d="M504 0 V40"></path><path d="M840 0 V40"></path><path d="M1176 0 V40"></path><path d="M1512 0 V40"></path></g><g fill="#006600"><path d="M160 32 L168 46 L176 32z"></path><path d="M496 32 L504 46 L512 32z"></path><path d="M832 32 L840 46 L848 32z"></path><path d="M1168 32 L1176 46 L1184 32z"></path><path d="M1504 32 L1512 46 L1520 32z"></path></g></svg>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px">
    <div class="aud"><div class="n" data-i18n="s02.7"></div><h3 data-i18n="s02.8"></h3><p data-i18n="s02.9"></p></div>
    <div class="aud"><div class="n" data-i18n="s02.10"></div><h3 data-i18n="s02.11"></h3><p data-i18n="s02.12"></p></div>
    <div class="aud"><div class="n" data-i18n="s02.13"></div><h3 data-i18n="s02.14"></h3><p data-i18n="s02.15"></p></div>
    <div class="aud" style="border-top-color:var(--red)"><div class="n" style="color:var(--red)" data-i18n="s02.16"></div><h3 data-i18n="s02.17"></h3><p data-i18n="s02.18"></p></div>
    <div class="aud" style="border-top-color:var(--cobalt)"><div class="n" style="color:var(--cobalt)" data-i18n="s02.19"></div><h3 data-i18n="s02.20"></h3><p data-i18n="s02.21"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s02.22"></span><span data-i18n="s02.23"></span></div>
</section>

<!-- 3 · the map -->
<section class="slide">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 style="font-size:64px" data-i18n="s03.4"></h2>
  <svg viewBox="0 0 1680 640" width="1680" height="640" style="margin-top:30px">
    <defs><marker id="m3" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker>
      <marker id="m3k" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#3f424a"></path></marker></defs>
    <!-- labels -->
    <g class="mono" font-size="19" letter-spacing="2" fill="#595c64">
      <text x="0" y="58" data-i18n="s03.5"></text><text x="0" y="82" data-i18n="s03.6"></text>
      <text x="0" y="300" data-i18n="s03.7"></text><text x="0" y="324" data-i18n="s03.8"></text>
      <text x="0" y="520" data-i18n="s03.9"></text><text x="0" y="544" data-i18n="s03.10"></text>
    </g>
    <!-- layer 1 -->
    <g font-size="22">
      <rect x="200" y="18" width="200" height="110" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="300" y="64" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.11"></text><text x="300" y="96" text-anchor="middle" fill="#595c64" font-size="19" data-i18n="s03.12"></text>
      <rect x="418" y="18" width="200" height="110" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="518" y="64" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.13"></text><text x="518" y="96" text-anchor="middle" fill="#595c64" font-size="19" data-i18n="s03.14"></text>
      <rect x="636" y="18" width="200" height="110" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="736" y="64" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.15"></text><text x="736" y="96" text-anchor="middle" fill="#595c64" font-size="19" data-i18n="s03.16"></text>
      <rect x="854" y="18" width="200" height="110" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="954" y="64" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.17"></text><text x="954" y="96" text-anchor="middle" fill="#595c64" font-size="19" data-i18n="s03.18"></text>
      <rect x="1072" y="18" width="200" height="110" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="1172" y="64" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.19"></text><text x="1172" y="96" text-anchor="middle" fill="#595c64" font-size="19" data-i18n="s03.20"></text>
    </g>
    <!-- vault column -->
    <rect x="1340" y="0" width="340" height="640" fill="#e2eedf"></rect>
    <text x="1510" y="40" text-anchor="middle" class="mono" font-size="19" letter-spacing="2" fill="#006600" data-i18n="s03.21"></text>
    <rect x="1370" y="62" width="280" height="150" fill="#006600"></rect>
    <text x="1510" y="112" text-anchor="middle" class="serif" font-size="30" font-weight="600" fill="#fff" data-i18n="s03.22"></text>
    <text x="1510" y="146" text-anchor="middle" font-size="20" fill="#e2eedf" data-i18n="s03.23"></text>
    <text x="1510" y="174" text-anchor="middle" font-size="20" fill="#e2eedf" data-i18n="s03.24"></text>
    <line x1="1276" y1="73" x2="1364" y2="120" stroke="#006600" stroke-width="4" marker-end="url(#m3)"></line>
    <g font-size="21" fill="#121317">
      <text x="1390" y="270" data-i18n="s03.25"></text>
      <text x="1390" y="306" data-i18n="s03.26"></text>
      <text x="1390" y="342" data-i18n="s03.27"></text>
      <text x="1390" y="378" data-i18n="s03.28"></text>
      <text x="1390" y="438" font-weight="600" data-i18n="s03.29"></text>
      <text x="1390" y="468" font-weight="600" data-i18n="s03.30"></text>
      <text x="1390" y="498" font-weight="600" data-i18n="s03.31"></text>
    </g>
    <path d="M1370 530 C 1300 560, 1240 560, 1210 545" stroke="#006600" stroke-width="3" fill="none" stroke-dasharray="8 6" marker-end="url(#m3)"></path>
    <!-- the line -->
    <line x1="200" y1="176" x2="1320" y2="176" stroke="#c52830" stroke-width="4" stroke-dasharray="14 10"></line>
    <rect x="300" y="157" width="920" height="38" fill="#f6f3ec"></rect>
    <text x="760" y="184" text-anchor="middle" font-size="22" font-weight="600" fill="#c52830" data-i18n="s03.32"></text>
    <!-- layer 2 -->
    <g>
      <rect x="200" y="236" width="230" height="130" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect><text x="315" y="286" text-anchor="middle" class="serif" font-size="27" font-weight="600" data-i18n="s03.33"></text><text x="315" y="318" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s03.34"></text><text x="315" y="344" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s03.35"></text>
      <line x1="430" y1="301" x2="490" y2="301" stroke="#006600" stroke-width="4" marker-end="url(#m3)"></line>
      <rect x="500" y="236" width="230" height="130" fill="#121317"></rect><text x="615" y="286" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#f6f3ec" data-i18n="s03.36"></text><text x="615" y="318" text-anchor="middle" font-size="19" fill="#c8c4ba" data-i18n="s03.37"></text><text x="615" y="344" text-anchor="middle" font-size="19" fill="#c8c4ba" data-i18n="s03.38"></text>
      <line x1="730" y1="301" x2="790" y2="301" stroke="#006600" stroke-width="4" marker-end="url(#m3)"></line>
      <rect x="800" y="236" width="230" height="130" fill="#006600"></rect><text x="915" y="286" text-anchor="middle" class="serif" font-size="27" font-weight="600" fill="#fff" data-i18n="s03.39"></text><text x="915" y="318" text-anchor="middle" font-size="19" fill="#e2eedf" data-i18n="s03.40"></text><text x="915" y="344" text-anchor="middle" font-size="19" fill="#e2eedf" data-i18n="s03.41"></text>
      <line x1="1030" y1="301" x2="1090" y2="301" stroke="#006600" stroke-width="4" marker-end="url(#m3)"></line>
      <rect x="1100" y="236" width="210" height="130" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="1205" y="282" text-anchor="middle" class="serif" font-size="25" font-weight="600" data-i18n="s03.42"></text><text x="1205" y="314" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s03.43"></text><text x="1205" y="340" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s03.44"></text>
      <line x1="1205" y1="236" x2="1205" y2="200" stroke="#3f424a" stroke-width="3" marker-end="url(#m3k)"></line>
    </g>
    <!-- layer 3 -->
    <rect x="200" y="420" width="1110" height="210" fill="#fffdf8" stroke="#d9d2c1"></rect>
    <line x1="315" y1="420" x2="315" y2="376" stroke="#3f424a" stroke-width="3" marker-end="url(#m3k)"></line>
    <text x="230" y="466" class="serif" font-size="30" font-weight="600" data-i18n="s03.45"></text>
    <text x="230" y="498" font-size="20" fill="#595c64" data-i18n="s03.46"></text>
    <text x="230" y="524" font-size="20" fill="#595c64" data-i18n="s03.47"></text>
    <g font-size="21">
      <rect x="230" y="556" width="150" height="44" fill="#e2eedf"></rect><text x="305" y="585" text-anchor="middle" data-i18n="s03.48"></text>
      <rect x="392" y="556" width="130" height="44" fill="#e2eedf"></rect><text x="457" y="585" text-anchor="middle" data-i18n="s03.49"></text>
      <rect x="534" y="556" width="130" height="44" fill="#e2eedf"></rect><text x="599" y="585" text-anchor="middle" data-i18n="s03.50"></text>
    </g>
    <g font-size="21">
      <rect x="230" y="608" width="0" height="0"></rect>
    </g>
    <!-- mini graph -->
    <g stroke="#9d9580" stroke-width="2">
      <line x1="760" y1="520" x2="880" y2="470"></line><line x1="760" y1="520" x2="860" y2="590"></line><line x1="880" y1="470" x2="1010" y2="500"></line><line x1="860" y1="590" x2="1010" y2="500"></line><line x1="1010" y1="500" x2="1130" y2="455"></line><line x1="1010" y1="500" x2="1150" y2="580"></line><line x1="1130" y1="455" x2="1250" y2="510"></line><line x1="1150" y1="580" x2="1250" y2="510"></line><line x1="880" y1="470" x2="980" y2="600"></line>
    </g>
    <g font-size="19" fill="#3f424a">
      <circle cx="760" cy="520" r="15" fill="#006600"></circle><text x="760" y="556" text-anchor="middle" data-i18n="s03.51"></text>
      <circle cx="880" cy="470" r="13" fill="#fffdf8" stroke="#121317" stroke-width="3"></circle><text x="880" y="446" text-anchor="middle" data-i18n="s03.52"></text>
      <path d="M1010 482 L1028 512 L992 512z" fill="#c52830"></path><text x="1010" y="540" text-anchor="middle" data-i18n="s03.53"></text>
      <rect x="848" y="578" width="24" height="24" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect><text x="815" y="618" text-anchor="middle" data-i18n="s03.54"></text>
      <circle cx="1130" cy="455" r="13" fill="#1f4fa8"></circle><text x="1130" y="438" text-anchor="middle" dx="20" data-i18n="s03.55"></text>
      <rect x="1138" y="568" width="24" height="24" fill="#fffdf8" stroke="#1f4fa8" stroke-width="3" stroke-dasharray="4 3"></rect><text x="1150" y="618" text-anchor="middle" data-i18n="s03.56"></text>
      <circle cx="1250" cy="510" r="15" fill="#006600"></circle><circle cx="980" cy="600" r="11" fill="#006600"></circle>
    </g>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s03.57"></span><span data-i18n="s03.58"></span></div>
</section>

<!-- 4 · articles -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="stage" style="height:864px">
    <div class="abs" style="left:0;top:0;width:610px">
      <div class="kicker" data-i18n="s04.3"></div>
      <h2 style="font-size:58px" data-i18n="s04.4"></h2>
      <ol class="co" style="margin-top:30px">
        <li data-i18n="s04.5"></li>
        <li data-i18n="s04.6"></li>
        <li data-i18n="s04.7"></li>
        <li data-i18n="s04.8"></li>
        <li data-i18n="s04.9"></li>
      </ol>
    </div>
    <div class="shot abs" style="left:680px;top:0;width:1000px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s04.10"></span></div>
      <div class="scr"><img src="shots/p3-article.jpg" alt="An article page">
        <div class="hot" style="left:4.5%;top:41%;width:53%;height:9%"></div><div class="pin" style="left:4%;top:38%" data-i18n="s04.11"></div>
        <div class="hot" style="left:4.5%;top:82%;width:30%;height:5.5%"></div><div class="pin" style="left:37%;top:84.5%" data-i18n="s04.12"></div>
        <div class="pin" style="left:30%;top:74%" data-i18n="s04.13"></div>
      </div></div>
    <div class="shot sm abs" style="left:1100px;top:330px;width:580px;box-shadow:0 30px 70px -10px rgba(18,19,23,.5)"><div class="bar"><i></i><i></i><i></i><span data-i18n="s04.14"></span></div>
      <div class="scr"><img src="shots/p3-article-sources.jpg" alt="The sources and signature of the article">
        <div class="pin" style="left:93%;top:8%" data-i18n="s04.15"></div>
        <div class="pin" style="left:93%;top:57%" data-i18n="s04.16"></div>
        <div class="hot g" style="left:3%;top:86%;width:84%;height:13%"></div>
      </div></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s04.17"></span><span data-i18n="s04.18"></span></div>
</section>

<!-- 5 · companies and the graph -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="kicker" data-i18n="s05.3"></div>
  <h2 style="font-size:60px" data-i18n="s05.4"></h2>
  <div class="stage" style="height:640px;margin-top:36px">
    <div class="shot abs" style="left:0;top:0;width:960px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.5"></span></div>
      <div class="scr"><img src="shots/p3-company.jpg" alt="A company profile">
        <div class="hot" style="left:10%;top:40%;width:70%;height:35%"></div><div class="pin" style="left:82%;top:44%" data-i18n="s05.6"></div>
        <div class="pin" style="left:41%;top:33%" data-i18n="s05.7"></div>
        <div class="pin" style="left:8%;top:81%" data-i18n="s05.8"></div>
      </div></div>
    <div class="abs" style="left:1010px;top:0;width:670px">
      <div class="shot sm"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.9"></span></div><img src="img/card-brazil.png" alt="Brazil's startup mission, a graph card"></div>
      <ol class="co" style="margin-top:34px">
        <li data-i18n="s05.10"></li>
        <li data-i18n="s05.11"></li>
        <li data-i18n="s05.12"></li>
      </ol>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s05.13"></span><span data-i18n="s05.14"></span></div>
</section>

<!-- 6 · search and ask -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 style="font-size:60px" data-i18n="s06.4"></h2>
  <div class="stage" style="height:620px;margin-top:36px">
    <div class="shot abs" style="left:0;top:0;width:900px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s06.5"></span></div>
      <div class="scr"><img src="shots/p3-search.jpg" alt="Search">
        <div class="pin" style="left:93%;top:35%" data-i18n="s06.6"></div>
        <div class="hot g" style="left:9%;top:40.5%;width:12%;height:5%"></div><div class="pin g" style="left:24%;top:43%" data-i18n="s06.7"></div>
        <div class="pin" style="left:93%;top:57%" data-i18n="s06.8"></div>
      </div></div>
    <div class="phone abs" style="left:950px;top:-10px;width:290px"><img src="shots/p3-m-ask.jpg" alt="Ask the newsroom on a phone"></div>
    <div class="abs" style="left:1290px;top:0;width:390px">
      <ol class="co">
        <li data-i18n="s06.9"></li>
        <li data-i18n="s06.10"></li>
        <li data-i18n="s06.11"></li>
      </ol>
      <div class="note" style="margin-top:20px" data-i18n="s06.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s06.13"></span><span data-i18n="s06.14"></span></div>
</section>

<!-- 7 · the summit and my day -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="cols center" style="grid-template-columns:600px 1fr;gap:50px;margin-top:0;height:100%">
    <div>
      <div class="kicker" data-i18n="s07.3"></div>
      <h2 style="font-size:62px" data-i18n="s07.4"></h2>
      <ol class="co g" style="margin-top:34px">
        <li data-i18n="s07.5"></li>
        <li data-i18n="s07.6"></li>
        <li data-i18n="s07.7"></li>
      </ol>
    </div>
    <div style="position:relative;height:840px">
      <div class="phone abs" style="left:0;top:60px;width:330px"><img src="shots/m-summit.jpg" alt="The summit on a phone"></div>
      <div class="phone abs" style="left:380px;top:0;width:360px;box-shadow:0 40px 80px -20px rgba(18,19,23,.55)"><img src="shots/p3-m-myday.jpg" alt="My day on a phone"></div>
      <div class="pin g" style="left:30px;top:350px" data-i18n="s07.8"></div>
      <div class="pin g" style="left:700px;top:360px" data-i18n="s07.9"></div>
      <div class="pin g" style="left:740px;top:170px" data-i18n="s07.10"></div>
      <div class="note abs" style="left:790px;top:150px;width:200px;padding:18px 20px;font-size:21px" data-i18n="s07.11"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s07.12"></span><span data-i18n="s07.13"></span></div>
</section>

<!-- 8 · personalisation without tracking -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="kicker" data-i18n="s08.3"></div>
  <h2 style="font-size:62px" data-i18n="s08.4"></h2>
  <svg viewBox="0 0 1680 620" width="1680" height="620" style="margin-top:30px">
    <defs><marker id="m8" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <!-- content graph, public -->
    <rect x="0" y="0" width="560" height="560" fill="#fffdf8" stroke="#d9d2c1"></rect>
    <text x="30" y="46" class="mono" font-size="19" letter-spacing="2" fill="#595c64" data-i18n="s08.5"></text>
    <text x="30" y="88" class="serif" font-size="34" font-weight="600" data-i18n="s08.6"></text>
    <g stroke="#9d9580" stroke-width="2"><line x1="120" y1="230" x2="260" y2="180"></line><line x1="120" y1="230" x2="210" y2="340"></line><line x1="260" y1="180" x2="400" y2="240"></line><line x1="210" y1="340" x2="400" y2="240"></line><line x1="400" y1="240" x2="470" y2="380"></line><line x1="210" y1="340" x2="330" y2="430"></line><line x1="330" y1="430" x2="470" y2="380"></line><line x1="120" y1="230" x2="100" y2="420"></line></g>
    <g font-size="20" fill="#3f424a">
      <circle cx="120" cy="230" r="17" fill="#006600"></circle><text x="120" y="200" text-anchor="middle" data-i18n="s08.7"></text>
      <path d="M260 162 L280 196 L240 196z" fill="#c52830"></path><text x="270" y="152" text-anchor="middle" data-i18n="s08.8"></text>
      <circle cx="210" cy="340" r="15" fill="#fffdf8" stroke="#121317" stroke-width="3"></circle><text x="210" y="378" text-anchor="middle" data-i18n="s08.9"></text>
      <rect x="388" y="228" width="26" height="26" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect><text x="430" y="216" text-anchor="middle" data-i18n="s08.10"></text>
      <circle cx="470" cy="380" r="13" fill="#1f4fa8"></circle><text x="470" y="414" text-anchor="middle" data-i18n="s08.11"></text>
      <rect x="312" y="414" width="36" height="30" fill="#e2eedf" stroke="#006600" stroke-width="2"></rect><text x="330" y="476" text-anchor="middle" data-i18n="s08.12"></text>
      <circle cx="100" cy="420" r="11" fill="#006600"></circle>
    </g>
    <text x="30" y="530" font-size="21" fill="#3f424a" data-i18n="s08.13"></text>
    <!-- the person graph -->
    <rect x="1120" y="0" width="560" height="560" fill="#e2eedf"></rect>
    <text x="1150" y="46" class="mono" font-size="19" letter-spacing="2" fill="#006600" data-i18n="s08.14"></text>
    <text x="1150" y="88" class="serif" font-size="34" font-weight="600" data-i18n="s08.15"></text>
    <g stroke="#006600" stroke-width="2" opacity=".6"><line x1="1400" y1="290" x2="1250" y2="190"></line><line x1="1400" y1="290" x2="1560" y2="190"></line><line x1="1400" y1="290" x2="1250" y2="410"></line><line x1="1400" y1="290" x2="1560" y2="410"></line></g>
    <g font-size="20" fill="#121317">
      <circle cx="1400" cy="290" r="44" fill="#121317"></circle><text x="1400" y="297" text-anchor="middle" fill="#f6f3ec" font-weight="600" data-i18n="s08.16"></text>
      <rect x="1180" y="168" width="140" height="44" rx="22" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1250" y="197" text-anchor="middle" data-i18n="s08.17"></text>
      <rect x="1470" y="168" width="180" height="44" rx="22" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1560" y="197" text-anchor="middle" data-i18n="s08.18"></text>
      <rect x="1160" y="388" width="180" height="44" rx="22" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1250" y="417" text-anchor="middle" data-i18n="s08.19"></text>
      <rect x="1470" y="388" width="180" height="44" rx="22" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1560" y="417" text-anchor="middle" data-i18n="s08.20"></text>
    </g>
    <text x="1150" y="530" font-size="21" fill="#3f424a" data-i18n="s08.21"></text>
    <!-- the meeting -->
    <rect x="610" y="90" width="460" height="380" rx="26" fill="#121317"></rect>
    <rect x="630" y="110" width="420" height="340" rx="14" fill="#1d1e23"></rect>
    <text x="840" y="158" text-anchor="middle" class="mono" font-size="19" letter-spacing="2" fill="#8fd18f" data-i18n="s08.22"></text>
    <text x="840" y="214" text-anchor="middle" class="serif" font-size="34" font-weight="600" fill="#f6f3ec" data-i18n="s08.23"></text>
    <g font-size="21" fill="#c8c4ba">
      <text x="660" y="272" data-i18n="s08.24"></text>
      <text x="660" y="312" data-i18n="s08.25"></text>
      <text x="660" y="352" data-i18n="s08.26"></text>
      <text x="660" y="400" fill="#8fd18f" data-i18n="s08.27"></text>
    </g>
    <line x1="562" y1="280" x2="604" y2="280" stroke="#006600" stroke-width="5" marker-end="url(#m8)"></line>
    <line x1="1118" y1="280" x2="1076" y2="280" stroke="#006600" stroke-width="5" marker-end="url(#m8)"></line>
    <text x="840" y="530" text-anchor="middle" font-size="24" font-weight="600" fill="#c52830" data-i18n="s08.28"></text>
    <text x="840" y="566" text-anchor="middle" font-size="21" fill="#3f424a" data-i18n="s08.29"></text>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s08.30"></span><span data-i18n="s08.31"></span></div>
</section>

<!-- 9 · micropayments -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="kicker red" data-i18n="s09.3"></div>
  <h2 style="font-size:60px" data-i18n="s09.4"></h2>
  <div class="flow" style="margin-top:34px">
    <div class="step" style="padding:22px 24px"><div class="n" style="font-size:44px" data-i18n="s09.5"></div><h3 data-i18n="s09.6"></h3><p data-i18n="s09.7"></p></div>
    <div class="step" style="padding:22px 24px"><div class="n" style="font-size:44px" data-i18n="s09.8"></div><h3 data-i18n="s09.9"></h3><p data-i18n="s09.10"></p></div>
    <div class="step" style="padding:22px 24px"><div class="n" style="font-size:44px" data-i18n="s09.11"></div><h3 data-i18n="s09.12"></h3><p data-i18n="s09.13"></p></div>
    <div class="step" style="padding:22px 24px"><div class="n" style="font-size:44px" data-i18n="s09.14"></div><h3 data-i18n="s09.15"></h3><p data-i18n="s09.16"></p></div>
  </div>
  <div class="stage" style="height:430px;margin-top:34px">
    <div class="shot abs" style="left:0;top:0;width:1000px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s09.17"></span></div>
      <div class="scr" style="height:388px;overflow:hidden"><img src="shots/account.jpg" alt="The reading account" style="margin-top:-150px">
        <div class="pin" style="left:24%;top:30%" data-i18n="s09.18"></div>
        <div class="pin" style="left:68%;top:20%" data-i18n="s09.19"></div>
        <div class="hot" style="left:57%;top:55%;width:12%;height:42%"></div><div class="pin" style="left:63%;top:51%" data-i18n="s09.20"></div>
      </div></div>
    <div class="abs" style="left:1050px;top:0;width:630px">
      <div class="note" style="font-size:24px" data-i18n="s09.21"></div>
      <div class="note r" style="margin-top:24px;font-size:24px" data-i18n="s09.22"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s09.23"></span><span data-i18n="s09.24"></span></div>
</section>

<!-- 10 · the vault -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 style="font-size:60px" data-i18n="s10.4"></h2>
  <div class="stage" style="height:640px;margin-top:36px">
    <div class="shot abs" style="left:0;top:0;width:1000px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.5"></span></div>
      <div class="scr"><img src="shots/vault.jpg" alt="The vault">
        <div class="hot g" style="left:86%;top:30%;width:11%;height:7%"></div><div class="pin g" style="left:84%;top:33.5%" data-i18n="s10.6"></div>
        <div class="pin g" style="left:84%;top:47%" data-i18n="s10.7"></div>
        <div class="pin g" style="left:84%;top:69%" data-i18n="s10.8"></div>
        <div class="hot" style="left:54.5%;top:58%;width:25%;height:9%"></div><div class="pin" style="left:54%;top:62.5%" data-i18n="s10.9"></div>
      </div></div>
    <div class="abs" style="left:1050px;top:0;width:630px">
      <ol class="co g">
        <li data-i18n="s10.10"></li>
        <li data-i18n="s10.11"></li>
        <li data-i18n="s10.12"></li>
      </ol>
      <ol class="co" start="4" style="counter-reset:co 3">
        <li data-i18n="s10.13"></li>
      </ol>
      <svg viewBox="0 0 630 120" width="630" height="120" style="margin-top:6px">
        <rect x="0" y="20" width="170" height="80" fill="#006600"></rect><text x="85" y="68" text-anchor="middle" fill="#fff" font-size="22" font-weight="600" data-i18n="s10.14"></text>
        <line x1="175" y1="60" x2="445" y2="60" stroke="#121317" stroke-width="3" stroke-dasharray="9 7"></line>
        <text x="310" y="46" text-anchor="middle" class="mono" font-size="19" fill="#c52830" data-i18n="s10.15"></text>
        <text x="310" y="88" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s10.16"></text>
        <rect x="455" y="20" width="175" height="80" fill="#fffdf8" stroke="#121317" stroke-width="2"></rect><text x="542" y="68" text-anchor="middle" font-size="22" font-weight="600" data-i18n="s10.17"></text>
      </svg>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s10.18"></span><span data-i18n="s10.19"></span></div>
</section>

<!-- 11 · the iOS app -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="cols center" style="grid-template-columns:560px 1fr;gap:56px;margin-top:0;height:100%">
    <div>
      <div class="kicker red" data-i18n="s11.3"></div>
      <h2 style="font-size:64px" data-i18n="s11.4"></h2>
      <p class="lead" style="font-size:28px" data-i18n="s11.5"></p>
      <div style="display:flex;gap:40px;margin-top:40px">
        <div class="stat r"><div class="v" style="font-size:72px" data-i18n="s11.6"></div><div class="l" data-i18n="s11.7"></div></div>
        <div class="stat"><div class="v" style="font-size:72px" data-i18n="s11.8"></div><div class="l" data-i18n="s11.9"></div></div>
      </div>
      <div class="src" style="margin-top:26px" data-i18n="s11.10"></div>
    </div>
    <div style="position:relative;height:820px">
      <div class="shot abs" style="left:0;top:0;width:1000px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s11.11"></span></div><img src="shots/p3-ios.jpg" alt="The app's site"></div>
      <div class="shot sm abs" style="left:200px;top:400px;width:820px;box-shadow:0 30px 70px -10px rgba(18,19,23,.5)"><div class="bar"><i></i><i></i><i></i><span data-i18n="s11.12"></span></div><img src="shots/p3-ios-platforms.jpg" alt="Two platforms, one app"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s11.13"></span><span data-i18n="s11.14"></span></div>
</section>

<!-- 12 · made for agents -->
<section class="slide">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 style="font-size:60px" data-i18n="s12.4"></h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:36px;margin-top:40px">
    <div>
      <div class="shot sm"><div class="bar"><i></i><i></i><i></i><span data-i18n="s12.5"></span></div><img src="shots/p3-twin.jpg" alt="A markdown twin" style="height:300px;object-fit:cover;object-position:top left"></div>
      <h3 style="margin-top:24px;font-size:32px" data-i18n="s12.6"></h3>
      <p class="body" style="font-size:22px" data-i18n="s12.7"></p>
    </div>
    <div>
      <div class="shot sm"><div class="bar"><i></i><i></i><i></i><span data-i18n="s12.8"></span></div><img src="shots/p3-llms.jpg" alt="llms.txt" style="height:300px;object-fit:cover;object-position:top left"></div>
      <h3 style="margin-top:24px;font-size:32px" data-i18n="s12.9"></h3>
      <p class="body" style="font-size:22px" data-i18n="s12.10"></p>
    </div>
    <div>
      <div class="shot sm"><div class="bar"><i></i><i></i><i></i><span data-i18n="s12.11"></span></div><img src="shots/p3-apijson.jpg" alt="The JSON index" style="height:300px;object-fit:cover;object-position:top left"></div>
      <h3 style="margin-top:24px;font-size:32px" data-i18n="s12.12"></h3>
      <p class="body" style="font-size:22px" data-i18n="s12.13"></p>
    </div>
  </div>
  <div class="note" style="margin-top:34px;font-size:24px" data-i18n="s12.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s12.15"></span><span data-i18n="s12.16"></span></div>
</section>

<!-- 13 · the newsroom in the open -->
<section class="slide">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="kicker" data-i18n="s13.3"></div>
  <h2 style="font-size:60px" data-i18n="s13.4"></h2>
  <div class="stage" style="height:640px;margin-top:36px">
    <div class="shot abs" style="left:0;top:0;width:720px"><div class="bar"><i></i><i></i><i></i><span data-i18n="s13.5"></span></div>
      <div class="scr"><img src="shots/newsroom.jpg" alt="The newsroom control centre">
        <div class="hot" style="left:11%;top:58%;width:66%;height:15%"></div><div class="pin" style="left:11%;top:58%" data-i18n="s13.6"></div>
        <div class="pin" style="left:7%;top:38%" data-i18n="s13.7"></div>
      </div></div>
    <div class="shot sm abs" style="left:580px;top:220px;width:600px;box-shadow:0 30px 70px -10px rgba(18,19,23,.5)"><div class="bar"><i></i><i></i><i></i><span data-i18n="s13.8"></span></div>
      <div class="scr"><img src="shots/decisions.jpg" alt="Decisions as pages"><div class="pin" style="left:8%;top:72%" data-i18n="s13.9"></div></div></div>
    <div class="abs" style="left:1220px;top:0;width:460px">
      <ol class="co">
        <li data-i18n="s13.10"></li>
        <li data-i18n="s13.11"></li>
        <li data-i18n="s13.12"></li>
      </ol>
      <div class="note" style="margin-top:10px" data-i18n="s13.13"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s13.14"></span><span data-i18n="s13.15"></span></div>
</section>

<!-- 14 · the agentic team -->
<section class="slide ink">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="kicker" data-i18n="s14.3"></div>
  <h2 style="font-size:60px" data-i18n="s14.4"></h2>
  <svg viewBox="0 0 1680 560" width="1680" height="560" style="margin-top:34px">
    <rect x="0" y="0" width="300" height="120" fill="#f6f3ec"></rect>
    <text x="150" y="50" text-anchor="middle" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s14.5"></text>
    <text x="150" y="86" text-anchor="middle" font-size="20" fill="#3f424a" data-i18n="s14.6"></text>
    <line x1="150" y1="120" x2="150" y2="170" stroke="#8fd18f" stroke-width="3"></line>
    <line x1="150" y1="170" x2="1000" y2="170" stroke="#8fd18f" stroke-width="3"></line>
    <g font-size="20">
      <g fill="#1d1e23" stroke="#4caf50" stroke-width="1.5">
        <rect x="0" y="200" width="190" height="46"></rect><rect x="205" y="200" width="190" height="46"></rect><rect x="410" y="200" width="190" height="46"></rect><rect x="615" y="200" width="190" height="46"></rect><rect x="820" y="200" width="190" height="46"></rect>
        <rect x="0" y="258" width="190" height="46"></rect><rect x="205" y="258" width="190" height="46"></rect><rect x="410" y="258" width="190" height="46"></rect><rect x="615" y="258" width="190" height="46"></rect><rect x="820" y="258" width="190" height="46"></rect>
        <rect x="0" y="316" width="190" height="46"></rect><rect x="205" y="316" width="190" height="46"></rect><rect x="410" y="316" width="190" height="46"></rect><rect x="615" y="316" width="190" height="46"></rect><rect x="820" y="316" width="190" height="46"></rect>
        <rect x="0" y="374" width="190" height="46"></rect><rect x="205" y="374" width="190" height="46"></rect><rect x="410" y="374" width="190" height="46"></rect><rect x="615" y="374" width="190" height="46"></rect><rect x="820" y="374" width="190" height="46"></rect>
        <rect x="0" y="432" width="190" height="46"></rect><rect x="205" y="432" width="190" height="46"></rect><rect x="410" y="432" width="190" height="46"></rect><rect x="615" y="432" width="190" height="46"></rect><rect x="820" y="432" width="190" height="46"></rect>
      </g>
      <g fill="#f6f3ec" class="mono" font-size="19">
        <text x="16" y="230" data-i18n="s14.7"></text><text x="221" y="230" data-i18n="s14.8"></text><text x="426" y="230" data-i18n="s14.9"></text><text x="631" y="230" data-i18n="s14.10"></text><text x="836" y="230" data-i18n="s14.11"></text>
        <text x="16" y="288" data-i18n="s14.12"></text><text x="221" y="288" data-i18n="s14.13"></text><text x="426" y="288" data-i18n="s14.14"></text><text x="631" y="288" data-i18n="s14.15"></text><text x="836" y="288" data-i18n="s14.16"></text>
        <text x="16" y="346" data-i18n="s14.17"></text><text x="221" y="346" data-i18n="s14.18"></text><text x="426" y="346" data-i18n="s14.19"></text><text x="631" y="346" data-i18n="s14.20"></text><text x="836" y="346" data-i18n="s14.21"></text>
        <text x="16" y="404" data-i18n="s14.22"></text><text x="221" y="404" data-i18n="s14.23"></text><text x="426" y="404" data-i18n="s14.24"></text><text x="631" y="404" data-i18n="s14.25"></text><text x="836" y="404" data-i18n="s14.26"></text>
        <text x="16" y="462" data-i18n="s14.27"></text><text x="221" y="462" data-i18n="s14.28"></text><text x="426" y="462" data-i18n="s14.29"></text><text x="631" y="462" data-i18n="s14.30"></text><text x="836" y="462" data-i18n="s14.31"></text>
      </g>
    </g>
    <text x="0" y="530" font-size="21" fill="#c8c4ba" data-i18n="s14.32"></text>
    <!-- each agent carries -->
    <text x="1100" y="30" class="mono" font-size="19" letter-spacing="2" fill="#8fd18f" data-i18n="s14.33"></text>
    <g>
      <rect x="1100" y="56" width="580" height="100" fill="#1d1e23" stroke="#3a3b40"></rect><text x="1130" y="98" class="serif" font-size="28" font-weight="600" fill="#f6f3ec" data-i18n="s14.34"></text><text x="1130" y="132" font-size="20" fill="#c8c4ba" data-i18n="s14.35"></text>
      <rect x="1100" y="170" width="580" height="100" fill="#1d1e23" stroke="#3a3b40"></rect><text x="1130" y="212" class="serif" font-size="28" font-weight="600" fill="#f6f3ec" data-i18n="s14.36"></text><text x="1130" y="246" font-size="20" fill="#c8c4ba" data-i18n="s14.37"></text>
      <rect x="1100" y="284" width="580" height="100" fill="#1d1e23" stroke="#3a3b40"></rect><text x="1130" y="326" class="serif" font-size="28" font-weight="600" fill="#f6f3ec" data-i18n="s14.38"></text><text x="1130" y="360" font-size="20" fill="#c8c4ba" data-i18n="s14.39"></text>
      <rect x="1100" y="398" width="580" height="100" fill="#1d1e23" stroke="#3a3b40"></rect><text x="1130" y="440" class="serif" font-size="28" font-weight="600" fill="#f6f3ec" data-i18n="s14.40"></text><text x="1130" y="474" font-size="20" fill="#c8c4ba" data-i18n="s14.41"></text>
    </g>
    <line x1="1020" y1="330" x2="1090" y2="330" stroke="#4caf50" stroke-width="4"></line>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s14.42"></span><span data-i18n="s14.43"></span></div>
</section>

<!-- 15 · customisation, next -->
<section class="slide">
  <div class="head"><span><b data-i18n="s15.1"></b></span><span data-i18n="s15.2"></span></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div><div class="kicker" data-i18n="s15.3"></div>
      <h2 style="font-size:60px" data-i18n="s15.4"></h2></div>
    <span class="badge" style="margin-top:6px;white-space:nowrap" data-i18n="s15.5"></span>
  </div>
  <svg viewBox="0 0 1680 600" width="1680" height="600" style="margin-top:34px">
    <g stroke="#c52830" stroke-width="2" stroke-dasharray="10 7" fill="#fffdf8"><rect x="0" y="0" width="540" height="540"></rect><rect x="570" y="0" width="540" height="540"></rect><rect x="1140" y="0" width="540" height="540"></rect></g>
    <!-- A team -->
    <text x="30" y="46" class="mono" font-size="19" letter-spacing="2" fill="#c52830" data-i18n="s15.6"></text>
    <text x="30" y="92" class="serif" font-size="32" font-weight="600" data-i18n="s15.7"></text>
    <g font-size="19" fill="#595c64"><text x="150" y="140" data-i18n="s15.8"></text><text x="270" y="140" data-i18n="s15.9"></text><text x="390" y="140" data-i18n="s15.10"></text></g>
    <g font-size="20">
      <text x="30" y="186" font-weight="600" data-i18n="s15.11"></text><rect x="140" y="164" width="110" height="34" fill="#006600"></rect><rect x="380" y="164" width="130" height="34" fill="#006600"></rect>
      <text x="30" y="240" font-weight="600" data-i18n="s15.12"></text><rect x="200" y="218" width="150" height="34" fill="#1f4fa8"></rect>
      <text x="30" y="294" font-weight="600" data-i18n="s15.13"></text><rect x="140" y="272" width="80" height="34" fill="#006600"></rect><rect x="300" y="272" width="190" height="34" fill="#c52830"></rect>
      <text x="30" y="348" font-weight="600" data-i18n="s15.14"></text><rect x="260" y="326" width="120" height="34" fill="#1f4fa8"></rect>
    </g>
    <text x="30" y="420" font-size="21" fill="#3f424a" data-i18n="s15.15"></text>
    <text x="30" y="450" font-size="21" fill="#3f424a" data-i18n="s15.16"></text>
    <text x="30" y="480" font-size="21" fill="#3f424a" data-i18n="s15.17"></text>
    <!-- briefings -->
    <text x="600" y="46" class="mono" font-size="19" letter-spacing="2" fill="#c52830" data-i18n="s15.18"></text>
    <text x="600" y="92" class="serif" font-size="32" font-weight="600" data-i18n="s15.19"></text>
    <rect x="600" y="130" width="480" height="120" fill="#e2eedf"></rect>
    <text x="620" y="166" class="mono" font-size="19" fill="#006600" data-i18n="s15.20"></text>
    <text x="620" y="200" font-size="21" data-i18n="s15.21"></text>
    <text x="620" y="230" font-size="21" data-i18n="s15.22"></text>
    <rect x="600" y="270" width="480" height="76" fill="#121317"></rect>
    <text x="840" y="317" text-anchor="middle" class="serif" font-size="26" font-weight="600" fill="#f6f3ec" data-i18n="s15.23"></text>
    <rect x="600" y="366" width="480" height="120" fill="#e2eedf"></rect>
    <text x="620" y="402" class="mono" font-size="19" fill="#006600" data-i18n="s15.24"></text>
    <text x="620" y="436" font-size="21" data-i18n="s15.25"></text>
    <text x="620" y="466" font-size="21" data-i18n="s15.26"></text>
    <!-- one day -->
    <text x="1170" y="46" class="mono" font-size="19" letter-spacing="2" fill="#c52830" data-i18n="s15.27"></text>
    <text x="1170" y="92" class="serif" font-size="32" font-weight="600" data-i18n="s15.28"></text>
    <rect x="1290" y="120" width="240" height="390" rx="30" fill="#121317"></rect>
    <rect x="1304" y="136" width="212" height="358" rx="18" fill="#f6f3ec"></rect>
    <text x="1410" y="176" text-anchor="middle" class="serif" font-size="22" font-weight="600" data-i18n="s15.29"></text>
    <g font-size="18"><rect x="1318" y="196" width="184" height="52" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1330" y="228" data-i18n="s15.30"></text>
      <rect x="1318" y="258" width="184" height="52" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1330" y="290" data-i18n="s15.31"></text>
      <rect x="1318" y="320" width="184" height="52" fill="#fffdf8" stroke="#006600" stroke-width="2"></rect><text x="1330" y="352" data-i18n="s15.32"></text>
      <rect x="1318" y="382" width="184" height="96" fill="#e2eedf"></rect><text x="1330" y="414" data-i18n="s15.33"></text><text x="1330" y="440" data-i18n="s15.34"></text><text x="1330" y="464" data-i18n="s15.35"></text></g>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s15.36"></span><span data-i18n="s15.37"></span></div>
</section>

<!-- 16 · deploy it -->
<section class="slide">
  <div class="head"><span><b data-i18n="s16.1"></b></span><span data-i18n="s16.2"></span></div>
  <div class="kicker" data-i18n="s16.3"></div>
  <h2 style="font-size:64px" data-i18n="s16.4"></h2>
  <div class="cols c3" style="margin-top:50px">
    <div class="card g"><div class="n" data-i18n="s16.5"></div><h3 data-i18n="s16.6"></h3><p data-i18n="s16.7"></p></div>
    <div class="card g"><div class="n" data-i18n="s16.8"></div><h3 data-i18n="s16.9"></h3><p data-i18n="s16.10"></p></div>
    <div class="card r"><div class="n" data-i18n="s16.11"></div><h3 data-i18n="s16.12"></h3><p data-i18n="s16.13"></p></div>
  </div>
  <div class="vs" style="margin-top:46px;grid-template-columns:1fr 90px 1fr">
    <div class="side old" style="padding:30px 36px"><h3 style="font-size:32px;margin-bottom:12px" data-i18n="s16.14"></h3><p class="body" style="font-size:24px" data-i18n="s16.15"></p></div>
    <div class="mid" data-i18n="s16.16"></div>
    <div class="side new" style="padding:30px 36px"><h3 style="font-size:32px;margin-bottom:12px" data-i18n="s16.17"></h3><p class="body" style="font-size:24px" data-i18n="s16.18"></p></div>
  </div>
  <div class="src" style="margin-top:26px" data-i18n="s16.19"></div>
  <div class="foot"><span class="wordmark" data-i18n="s16.20"></span><span data-i18n="s16.21"></span></div>
</section>

<!-- 17 · in numbers -->
<section class="slide">
  <div class="head"><span><b data-i18n="s17.1"></b></span><span data-i18n="s17.2"></span></div>
  <div class="kicker" data-i18n="s17.3"></div>
  <h2 style="font-size:60px" data-i18n="s17.4"></h2>
  <div class="sgrid" style="margin-top:46px">
    <div class="stat"><div class="v" data-i18n="s17.5"></div><div class="l" data-i18n="s17.6"></div></div>
    <div class="stat r"><div class="v" data-i18n="s17.7"></div><div class="l" data-i18n="s17.8"></div></div>
    <div class="stat"><div class="v" data-i18n="s17.9"></div><div class="l" data-i18n="s17.10"></div></div>
    <div class="stat"><div class="v" data-i18n="s17.11"></div><div class="l" data-i18n="s17.12"></div></div>
  </div>
  <svg viewBox="0 0 1680 230" width="1680" height="230" style="margin-top:50px">
    <line x1="0" y1="110" x2="1500" y2="110" stroke="#9d9580" stroke-width="10"></line>
    <rect x="1500" y="96" width="180" height="28" fill="#c52830"></rect>
    <g fill="#121317"><circle cx="0" cy="110" r="12"></circle><circle cx="560" cy="110" r="12"></circle><circle cx="1000" cy="110" r="12"></circle><circle cx="1260" cy="110" r="12"></circle></g>
    <g font-size="20" fill="#3f424a">
      <text x="0" y="66" class="mono" fill="#006600" data-i18n="s17.13"></text><text x="0" y="160" font-weight="600" fill="#121317" data-i18n="s17.14"></text><text x="0" y="188" data-i18n="s17.15"></text>
      <text x="560" y="66" class="mono" fill="#006600" data-i18n="s17.16"></text><text x="560" y="160" font-weight="600" fill="#121317" data-i18n="s17.17"></text><text x="560" y="188" data-i18n="s17.18"></text>
      <text x="1000" y="66" class="mono" fill="#006600" data-i18n="s17.19"></text><text x="1000" y="160" font-weight="600" fill="#121317" data-i18n="s17.20"></text><text x="1000" y="188" data-i18n="s17.21"></text>
      <text x="1260" y="66" class="mono" fill="#006600" data-i18n="s17.22"></text><text x="1260" y="160" font-weight="600" fill="#121317" data-i18n="s17.23"></text><text x="1260" y="188" data-i18n="s17.24"></text>
    </g>
    <text x="1680" y="66" text-anchor="end" class="mono" font-size="20" fill="#c52830" data-i18n="s17.25"></text>
    <text x="1680" y="160" text-anchor="end" font-size="20" font-weight="600" fill="#c52830" data-i18n="s17.26"></text>
    <text x="1680" y="188" text-anchor="end" font-size="20" fill="#3f424a" data-i18n="s17.27"></text>
  </svg>
  <p class="lead" style="margin-top:10px;font-size:30px" data-i18n="s17.28"></p>
  <div class="src" style="margin-top:20px" data-i18n="s17.29"></div>
  <div class="foot"><span class="wordmark" data-i18n="s17.30"></span><span data-i18n="s17.31"></span></div>
</section>

<!-- 18 · close -->
<section class="slide ink" style="padding:0">
  <div class="head"><span><b data-i18n="s18.1"></b></span><span data-i18n="s18.2"></span></div>
  <div class="abs" style="left:120px;top:190px;width:900px">
    <div class="kicker" data-i18n="s18.3"></div>
    <h1 style="font-size:96px" data-i18n="s18.4"></h1>
    <div style="margin-top:56px;display:grid;gap:18px">
      <div class="urlrow" data-i18n="s18.5"></div>
      <div class="urlrow" data-i18n="s18.6"></div>
      <div class="urlrow" data-i18n="s18.7"></div>
    </div>
    <p class="lead" style="font-size:28px;margin-top:44px" data-i18n="s18.8"></p>
  </div>
  <div class="phone abs" style="left:1090px;top:150px;width:340px;transform:rotate(-3deg)"><img src="shots/p3-m-article.jpg" alt="An article on a phone"></div>
  <div class="phone abs" style="left:1450px;top:210px;width:340px;transform:rotate(3deg)"><img src="shots/p3-m-company.jpg" alt="A company on a phone"></div>
  <div class="foot"><span class="wordmark" data-i18n="s18.9"></span><span data-i18n="s18.10"></span></div>
</section>

</main><script src="deck.js"></script>
</body></html>
