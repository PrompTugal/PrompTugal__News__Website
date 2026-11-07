<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
/* deck 9, the tour: every slide one live feature. The default (no .active: the PDF, print, all slides stacked) is the FINAL
   frame. The player (deck.js) marks the shown slide .active, and only then the sequence runs, from its first keyframe
   (animation-fill-mode: backwards): the page zooms out, a box draws itself round a feature, an arrow slides in, a numbered
   callout and its caption fade in. Under about 4 seconds a slide. No motion for prefers-reduced-motion, none in print. */
.abs { position: absolute; }
.L { position: absolute; left: 120px; top: 150px; width: 560px; }
.L h2 { font-size: 50px; line-height: 1.06; }
.why { font: 400 26px/1.4 var(--serif); color: var(--ink-2); margin-top: 22px; }
.url { position: absolute; left: 120px; bottom: 132px; font: 400 20px/1.3 var(--mono); color: var(--ink-3); }
.url b { color: var(--green); font-weight: 500; }
.fr { position: absolute; }
.fr.shot .bar { height: 36px; font-size: 15px; }
.vp { position: relative; overflow: hidden; background: var(--paper); }
.vp > img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.ov { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.bx { fill: rgba(197,40,48,.05); stroke: var(--red); stroke-width: 7; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 0; }
.bx.g { stroke: var(--green); fill: rgba(0,102,0,.05); }
.bx.k { stroke: var(--cobalt); fill: rgba(31,79,168,.05); }
.ar { fill: none; stroke: var(--red); stroke-width: 8; stroke-linecap: round; }
.ar.g { stroke: var(--green); }
.pin { position: absolute; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; background: var(--red); color: #fff; font: 600 26px/46px var(--serif); text-align: center; box-shadow: 0 0 0 6px rgba(197,40,48,.22), 0 6px 14px rgba(18,19,23,.3); z-index: 3; }
.pin.g { background: var(--green); box-shadow: 0 0 0 6px rgba(0,102,0,.22), 0 6px 14px rgba(18,19,23,.3); }
.pin.k { background: var(--cobalt); box-shadow: 0 0 0 6px rgba(31,79,168,.22), 0 6px 14px rgba(18,19,23,.3); }
ol.co { list-style: none; margin-top: 26px; }
ol.co li { position: relative; padding-left: 64px; margin: 0 0 14px; font: 400 22px/1.38 var(--sans); color: var(--ink-2); }
ol.co li b { color: var(--ink); display: block; font: 600 25px/1.22 var(--serif); margin-bottom: 2px; }
ol.co li .n { position: absolute; left: 0; top: -1px; width: 44px; height: 44px; border-radius: 50%; background: var(--red); color: #fff; font: 600 24px/44px var(--serif); text-align: center; }
ol.co li .n.g { background: var(--green); } ol.co li .n.k { background: var(--cobalt); }
.mini { font: 400 20px/1.3 var(--mono); color: var(--ink-3); margin-top: 10px; }
.note { position: absolute; background: var(--panel); border-left: 8px solid var(--green); padding: 20px 24px; font: 400 22px/1.42 var(--sans); color: var(--ink-2); box-shadow: 0 20px 40px -20px rgba(18,19,23,.35); }
.note b { color: var(--ink); }
.phone .vp { border-radius: 30px; }
.stop { font: 500 20px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 14px; }
.stop b { color: var(--red); font-weight: 500; }
.pp, .fi, .ar, .bx { transform-box: fill-box; transform-origin: center; }
.urlrow { font: 500 34px/1.3 var(--mono); color: var(--paper); }
.urlrow span { color: #8fd18f; }
@media screen and (prefers-reduced-motion: no-preference) {
  .slide.active .zo { animation: zo 1.5s cubic-bezier(.65,0,.25,1) var(--d,.2s) backwards; }
  .slide.active .bx { animation: draw .8s ease-out var(--d,1.5s) backwards; }
  .slide.active .ln { animation: draw 2.4s cubic-bezier(.5,0,.3,1) var(--d,.3s) backwards; }
  .slide.active .ar { animation: arin .6s cubic-bezier(.2,.8,.3,1) var(--d,2s) backwards; }
  .slide.active .pp { animation: pop .45s cubic-bezier(.3,1.6,.5,1) var(--d,2.2s) backwards; }
  .slide.active .fi { animation: fi .6s ease-out var(--d,2.4s) backwards; }
  .slide.active .rise { animation: fi .7s ease-out var(--d,0s) backwards; }
}
@keyframes zo { from { transform: scale(var(--s,2.2)); } }
@keyframes draw { from { stroke-dashoffset: 100; } }
@keyframes arin { from { opacity: 0; transform: translate(var(--ax,-70px), var(--ay,0px)); } }
@keyframes pop { from { opacity: 0; transform: scale(.2); } }
@keyframes fi { from { opacity: 0; transform: translateY(18px); } }
@media print { .slide * { animation: none !important; } }
</style></head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide ink" style="padding:0">
  <div class="head"><span data-i18n="s01.1"></span><span data-i18n="s01.2"></span></div>
  <div class="abs" style="left:120px;top:180px;width:780px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:104px" data-i18n="s01.4"></h1>
    <p class="lead" style="font-size:31px" data-i18n="s01.5"></p>
    <div style="margin-top:40px"><span class="tag" style="color:#8fd18f" data-i18n="s01.6"></span><span class="tag" style="color:#ff9a9e" data-i18n="s01.7"></span></div>
  </div>
  <div class="shot abs" style="left:950px;top:160px;width:860px;transform:rotate(-1.4deg)"><div class="bar"><i></i><i></i><i></i><span data-i18n="s01.8"></span></div><img src="shots/tour-home.jpg" alt="The front page of PrompTugal.news"></div>
  <div class="phone abs" style="left:1500px;top:420px;width:270px;transform:rotate(3deg)"><img src="shots/tour-m-myday.jpg" alt="My day on a phone"></div>
  <svg class="abs" style="left:1240px;top:640px" width="270" height="140" viewBox="0 0 270 140"><path d="M10 120 C 80 120, 160 100, 240 40" fill="none" stroke="#ff7a7f" stroke-width="6" stroke-linecap="round"></path><path d="M206 44 L240 40 L230 72" fill="none" stroke="#ff7a7f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  <div class="foot"><span class="wordmark" data-i18n="s01.9"></span><span data-i18n="s01.10"></span></div>
</section>

<!-- 2 · The route -->
<section class="slide">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="L" style="width:1680px">
    <div class="stop rise" data-i18n="s02.3"></div>
    <h2 class="rise" style="--d:.05s;max-width:1600px;font-size:60px" data-i18n="s02.4"></h2>
  </div>
  <svg class="abs" style="left:120px;top:350px" width="1680" height="560" viewBox="0 0 1680 560">
    <rect x="0" y="0" width="1183" height="560" fill="#f8e4df" opacity=".55"></rect>
    <rect x="1183" y="0" width="228" height="560" fill="#e2eedf" opacity=".8"></rect>
    <rect x="1411" y="0" width="269" height="560" fill="#dfe6f3"></rect>
    <text x="20" y="40" class="mono" font-size="20" letter-spacing="2" fill="#c52830" data-i18n="s02.5"></text>
    <text x="1200" y="40" class="mono" font-size="20" letter-spacing="2" fill="#006600" data-i18n="s02.6"></text>
    <text x="1428" y="40" class="mono" font-size="19" letter-spacing="1" fill="#1f4fa8" data-i18n="s02.7"></text>
    <path class="ln" d="M100 290 H1582" pathLength="100" stroke="#121317" stroke-width="10" stroke-dasharray="100" fill="none" style="--d:.2s"></path>
    <g class="fi" style="--d:0.45s"><rect x="8.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-home.jpg" x="9.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M100 190 V214 M100 246 V266" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="100" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:0.40s"></circle><text class="fi mono" x="100" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:0.40s" data-i18n="s02.8"></text><text class="fi" x="100" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:0.45s" data-i18n="s02.9"></text><g class="fi" style="--d:0.61s"><rect x="122.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-article.jpg" x="123.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M214 314 V340 M214 372 V382" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="214" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:0.56s"></circle><text class="fi mono" x="214" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:0.56s" data-i18n="s02.10"></text><text class="fi" x="214" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:0.61s" data-i18n="s02.11"></text><g class="fi" style="--d:0.77s"><rect x="236.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-company.jpg" x="237.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M328 190 V214 M328 246 V266" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="328" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:0.72s"></circle><text class="fi mono" x="328" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:0.72s" data-i18n="s02.12"></text><text class="fi" x="328" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:0.77s" data-i18n="s02.13"></text><g class="fi" style="--d:0.93s"><rect x="350.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-graph.jpg" x="351.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M442 314 V340 M442 372 V382" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="442" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:0.88s"></circle><text class="fi mono" x="442" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:0.88s" data-i18n="s02.14"></text><text class="fi" x="442" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:0.93s" data-i18n="s02.15"></text><g class="fi" style="--d:1.09s"><rect x="464.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-search.jpg" x="465.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M556 190 V214 M556 246 V266" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="556" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.04s"></circle><text class="fi mono" x="556" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.04s" data-i18n="s02.16"></text><text class="fi" x="556" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.09s" data-i18n="s02.17"></text><g class="fi" style="--d:1.25s"><rect x="578.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-ask.jpg" x="579.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M670 314 V340 M670 372 V382" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="670" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.20s"></circle><text class="fi mono" x="670" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.20s" data-i18n="s02.18"></text><text class="fi" x="670" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.25s" data-i18n="s02.19"></text><g class="fi" style="--d:1.41s"><rect x="692.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-summit.jpg" x="693.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M784 190 V214 M784 246 V266" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="784" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.36s"></circle><text class="fi mono" x="784" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.36s" data-i18n="s02.20"></text><text class="fi" x="784" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.41s" data-i18n="s02.21"></text><g class="fi" style="--d:1.57s"><rect x="806.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-account.jpg" x="807.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M898 314 V340 M898 372 V382" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="898" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.52s"></circle><text class="fi mono" x="898" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.52s" data-i18n="s02.22"></text><text class="fi" x="898" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.57s" data-i18n="s02.23"></text><g class="fi" style="--d:1.73s"><rect x="920.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-vault.jpg" x="921.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1012 190 V214 M1012 246 V266" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="1012" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.68s"></circle><text class="fi mono" x="1012" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.68s" data-i18n="s02.24"></text><text class="fi" x="1012" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.73s" data-i18n="s02.25"></text><g class="fi" style="--d:1.89s"><rect x="1034.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-ios-full.jpg" x="1035.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1126 314 V340 M1126 372 V382" stroke="#c52830" stroke-width="2"></path></g><circle class="pp" cx="1126" cy="290" r="22" fill="#fffdf8" stroke="#c52830" stroke-width="7" style="--d:1.84s"></circle><text class="fi mono" x="1126" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#c52830" style="--d:1.84s" data-i18n="s02.26"></text><text class="fi" x="1126" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:1.89s" data-i18n="s02.27"></text><g class="fi" style="--d:2.05s"><rect x="1148.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-newsroom.jpg" x="1149.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1240 190 V214 M1240 246 V266" stroke="#006600" stroke-width="2"></path></g><circle class="pp" cx="1240" cy="290" r="22" fill="#fffdf8" stroke="#006600" stroke-width="7" style="--d:2.00s"></circle><text class="fi mono" x="1240" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#006600" style="--d:2.00s" data-i18n="s02.28"></text><text class="fi" x="1240" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:2.05s" data-i18n="s02.29"></text><g class="fi" style="--d:2.21s"><rect x="1262.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-decisions.jpg" x="1263.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1354 314 V340 M1354 372 V382" stroke="#006600" stroke-width="2"></path></g><circle class="pp" cx="1354" cy="290" r="22" fill="#fffdf8" stroke="#006600" stroke-width="7" style="--d:2.16s"></circle><text class="fi mono" x="1354" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#006600" style="--d:2.16s" data-i18n="s02.30"></text><text class="fi" x="1354" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:2.21s" data-i18n="s02.31"></text><g class="fi" style="--d:2.37s"><rect x="1376.0" y="75" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-twin.jpg" x="1377.0" y="76" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1468 190 V214 M1468 246 V266" stroke="#1f4fa8" stroke-width="2"></path></g><circle class="pp" cx="1468" cy="290" r="22" fill="#fffdf8" stroke="#1f4fa8" stroke-width="7" style="--d:2.32s"></circle><text class="fi mono" x="1468" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#1f4fa8" style="--d:2.32s" data-i18n="s02.32"></text><text class="fi" x="1468" y="238" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:2.37s" data-i18n="s02.33"></text><g class="fi" style="--d:2.53s"><rect x="1490.0" y="382" width="184" height="115" fill="#fffdf8" stroke="#9d9580"></rect><image href="shots/tour-investors.jpg" x="1491.0" y="383" width="182" height="113" preserveAspectRatio="xMidYMin slice"></image><path d="M1582 314 V340 M1582 372 V382" stroke="#1f4fa8" stroke-width="2"></path></g><circle class="pp" cx="1582" cy="290" r="22" fill="#fffdf8" stroke="#1f4fa8" stroke-width="7" style="--d:2.48s"></circle><text class="fi mono" x="1582" y="297" text-anchor="middle" font-size="20" font-weight="500" fill="#1f4fa8" style="--d:2.48s" data-i18n="s02.34"></text><text class="fi" x="1582" y="364" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" style="--d:2.53s" data-i18n="s02.35"></text>
    <text class="fi" x="20" y="535" font-size="22" fill="#3f424a" style="--d:2.8s" data-i18n="s02.36"></text>
  </svg>
  <div class="src abs" style="left:120px;top:922px;width:1680px" data-i18n="s02.37"></div>
  <div class="foot"><span class="wordmark" data-i18n="s02.38"></span><span data-i18n="s02.39"></span></div>
</section>

<!-- 3 · The front page -->
<section class="slide">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s03.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s03.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s03.5"></p>
    <ol class="co"><li class="fi" style="--d:1.9s" data-i18n="s03.6"></li><li class="fi" style="--d:2.3s" data-i18n="s03.7"></li><li class="fi" style="--d:2.7s" data-i18n="s03.8"></li><li class="fi" style="--d:3.2s" data-i18n="s03.9"></li></ol>
  </div>
  <div class="shot fr " style="left:710px;top:150px;width:920px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s03.10"></span></div><div class="vp" style="height:575px"><img class="zo" style="--s:2.4;--d:0.2s;transform-origin:50% 18%" src="shots/tour-home.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="136" y="134" width="1168" height="58" rx="8" pathLength="100" style="--d:1.5s"></rect><rect class="bx " x="136" y="214" width="764" height="404" rx="8" pathLength="100" style="--d:1.9s"></rect><rect class="bx " x="943" y="210" width="362" height="290" rx="8" pathLength="100" style="--d:2.3s"></rect><rect class="bx g" x="1022" y="12" width="214" height="50" rx="8" pathLength="100" style="--d:2.9s"></rect><g class="ar g" style="--d:2.7s;--ax:-60px;--ay:40px"><path d="M820 160 L1000 50 M983 79 L1000 50 L966 52"></path></g></svg><div class="pin pp " style="left:90.6%;top:14.9%;--d:1.9s" data-i18n="s03.11"></div><div class="pin pp " style="left:62.5%;top:23.8%;--d:2.3s" data-i18n="s03.12"></div><div class="pin pp " style="left:90.6%;top:23.3%;--d:2.7s" data-i18n="s03.13"></div><div class="pin pp g" style="left:86.8%;top:4.1%;--d:3.2s" data-i18n="s03.14"></div></div></div>
  <div class="shot fr fi" style="--d:3.2s;left:1650px;top:150px;width:150px;"><div class="bar"><i></i><i></i><i></i><span></span></div><div class="vp" style="height:281px"><img src="shots/tour-home-full.jpg" alt=""><svg class="ov" viewBox="0 0 1440 2700" preserveAspectRatio="none"><rect class="bx k" x="20" y="20" width="1400" height="880" rx="8" pathLength="100" style="--d:3.3s"></rect></svg></div></div>
  <p class="mini abs fi" style="left:1650px;top:500px;width:160px;--d:3.4s" data-i18n="s03.15"></p>
  <div class="url" data-i18n="s03.16"></div>
  <div class="foot"><span class="wordmark" data-i18n="s03.17"></span><span data-i18n="s03.18"></span></div>
</section>

<!-- 4 · An article -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s04.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s04.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s04.5"></p>
    <ol class="co"><li class="fi" style="--d:1.9s" data-i18n="s04.6"></li><li class="fi" style="--d:2.4s" data-i18n="s04.7"></li><li class="fi" style="--d:2.8s" data-i18n="s04.8"></li><li class="fi" style="--d:3.3s" data-i18n="s04.9"></li></ol>
  </div>
  <div class="shot fr " style="left:730px;top:150px;width:740px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s04.10"></span></div><div class="vp" style="height:462px"><img src="shots/tour-article.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="136" y="720" width="690" height="50" rx="8" pathLength="100" style="--d:1.5s"></rect><g class="ar " style="--d:1.7s;--ax:60px;--ay:40px"><path d="M1000 860 L840 760 M874 762 L840 760 L857 790"></path></g></svg><div class="pin pp " style="left:57.4%;top:80.0%;--d:1.9s" data-i18n="s04.11"></div></div></div>
  <div class="shot fr " style="left:1500px;top:150px;width:300px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s04.12"></span></div><div class="vp" style="height:585px"><img class="zo" style="--s:2.6;--d:0.3s;transform-origin:0% 0%" src="shots/tour-article-sources.jpg" alt=""><svg class="ov" viewBox="0 0 800 1560" preserveAspectRatio="none"><rect class="bx g" x="18" y="14" width="776" height="496" rx="8" pathLength="100" style="--d:2.0s"></rect><rect class="bx g" x="18" y="524" width="776" height="360" rx="8" pathLength="100" style="--d:2.4s"></rect><rect class="bx k" x="18" y="1430" width="776" height="110" rx="8" pathLength="100" style="--d:2.9s"></rect></svg><div class="pin pp g" style="left:87.5%;top:3.8%;--d:2.4s" data-i18n="s04.13"></div><div class="pin pp g" style="left:87.5%;top:36.5%;--d:2.8s" data-i18n="s04.14"></div><div class="pin pp k" style="left:87.5%;top:89.7%;--d:3.3s" data-i18n="s04.15"></div></div></div>
  <div class="note fi" style="left:730px;top:720px;width:700px;border-left-color:var(--cobalt);--d:3.4s" data-i18n="s04.16"></div>
  <div class="url" data-i18n="s04.17"></div>
  <div class="foot"><span class="wordmark" data-i18n="s04.18"></span><span data-i18n="s04.19"></span></div>
</section>

<!-- 5 · A company -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s05.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s05.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s05.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s05.6"></li><li class="fi" style="--d:2.5s" data-i18n="s05.7"></li><li class="fi" style="--d:3.0s" data-i18n="s05.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s05.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.0;--d:0.2s;transform-origin:33% 58%" src="shots/tour-company.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx g" x="136" y="368" width="736" height="322" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx " x="716" y="646" width="146" height="36" rx="8" pathLength="100" style="--d:2.2s"></rect><rect class="bx " x="136" y="696" width="694" height="108" rx="8" pathLength="100" style="--d:2.6s"></rect><g class="ar " style="--d:2.2s;--ax:60px;--ay:-30px"><path d="M1080 560 L875 655 M895 628 L875 655 L909 657"></path></g></svg><div class="pin pp g" style="left:9.4%;top:40.9%;--d:2.0s" data-i18n="s05.10"></div><div class="pin pp " style="left:59.9%;top:71.8%;--d:2.5s" data-i18n="s05.11"></div><div class="pin pp " style="left:57.6%;top:83.3%;--d:3.0s" data-i18n="s05.12"></div></div></div>
  <div class="url" data-i18n="s05.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s05.14"></span><span data-i18n="s05.15"></span></div>
</section>

<!-- 6 · The graph -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s06.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s06.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s06.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s06.6"></li><li class="fi" style="--d:2.5s" data-i18n="s06.7"></li><li class="fi" style="--d:3.0s" data-i18n="s06.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s06.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.4;--d:0.2s;transform-origin:50% 82%" src="shots/tour-graph.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx g" x="143" y="390" width="1154" height="508" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx " x="320" y="342" width="112" height="42" rx="8" pathLength="100" style="--d:2.1s"></rect><rect class="bx " x="790" y="608" width="300" height="46" rx="8" pathLength="100" style="--d:2.6s"></rect><g class="ar " style="--d:2.2s;--ax:40px;--ay:-40px"><path d="M560 250 L440 340 M454 309 L440 340 L474 335"></path></g></svg><div class="pin pp g" style="left:90.1%;top:43.3%;--d:2.0s" data-i18n="s06.10"></div><div class="pin pp " style="left:30.0%;top:38.0%;--d:2.5s" data-i18n="s06.11"></div><div class="pin pp " style="left:75.7%;top:67.6%;--d:3.0s" data-i18n="s06.12"></div></div></div>
  <div class="url" data-i18n="s06.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s06.14"></span><span data-i18n="s06.15"></span></div>
</section>

<!-- 7 · Search -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s07.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s07.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s07.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s07.6"></li><li class="fi" style="--d:2.5s" data-i18n="s07.7"></li><li class="fi" style="--d:3.0s" data-i18n="s07.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s07.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.2;--d:0.2s;transform-origin:40% 34%" src="shots/tour-search.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="138" y="286" width="1172" height="68" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx g" x="134" y="450" width="1176" height="210" rx="8" pathLength="100" style="--d:2.1s"></rect><rect class="bx " x="136" y="360" width="168" height="58" rx="8" pathLength="100" style="--d:2.6s"></rect><g class="ar " style="--d:2.7s;--ax:50px;--ay:50px"><path d="M520 560 L320 410 M354 415 L320 410 L334 441"></path></g></svg><div class="pin pp " style="left:91.0%;top:31.8%;--d:2.0s" data-i18n="s07.10"></div><div class="pin pp g" style="left:91.0%;top:50.0%;--d:2.5s" data-i18n="s07.11"></div><div class="pin pp " style="left:9.4%;top:43.2%;--d:3.0s" data-i18n="s07.12"></div></div></div>
  <div class="url" data-i18n="s07.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s07.14"></span><span data-i18n="s07.15"></span></div>
</section>

<!-- 8 · Ask the newsroom -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s08.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s08.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s08.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s08.6"></li><li class="fi" style="--d:2.5s" data-i18n="s08.7"></li><li class="fi" style="--d:3.0s" data-i18n="s08.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s08.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.0;--d:0.2s;transform-origin:86% 45%" src="shots/tour-ask.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx g" x="1032" y="4" width="404" height="892" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx " x="1042" y="354" width="302" height="160" rx="8" pathLength="100" style="--d:2.1s"></rect><rect class="bx " x="1044" y="772" width="384" height="64" rx="8" pathLength="100" style="--d:2.6s"></rect><g class="ar " style="--d:2.7s;--ax:-60px;--ay:-20px"><path d="M760 700 L1030 790 M997 796 L1030 790 L1007 765"></path></g></svg><div class="pin pp g" style="left:71.7%;top:3.3%;--d:2.0s" data-i18n="s08.10"></div><div class="pin pp " style="left:93.3%;top:39.3%;--d:2.5s" data-i18n="s08.11"></div><div class="pin pp " style="left:72.5%;top:85.8%;--d:3.0s" data-i18n="s08.12"></div></div></div>
  <div class="url" data-i18n="s08.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s08.14"></span><span data-i18n="s08.15"></span></div>
</section>

<!-- 9 · The summit and My day -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s09.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s09.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s09.5"></p>
    <ol class="co"><li class="fi" style="--d:1.9s" data-i18n="s09.6"></li><li class="fi" style="--d:2.6s" data-i18n="s09.7"></li><li class="fi" style="--d:3.1s" data-i18n="s09.8"></li></ol>
  </div>
  <div class="phone abs " style="left:760px;top:150px;width:328px;"><div class="vp" style="height:649px"><img src="shots/tour-m-summit.jpg" alt=""><svg class="ov" viewBox="0 0 390 844" preserveAspectRatio="none"><rect class="bx " x="8" y="418" width="382" height="64" rx="8" pathLength="100" style="--d:1.5s"></rect><rect class="bx " x="2" y="782" width="386" height="60" rx="8" pathLength="100" style="--d:1.8s"></rect></svg><div class="pin pp " style="left:92.3%;top:49.5%;--d:1.9s" data-i18n="s09.9"></div></div></div>
  <div class="phone abs " style="left:1140px;top:150px;width:328px;"><div class="vp" style="height:649px"><img class="zo" style="--s:2.2;--d:0.3s;transform-origin:30% 52%" src="shots/tour-m-myday.jpg" alt=""><svg class="ov" viewBox="0 0 390 844" preserveAspectRatio="none"><rect class="bx " x="8" y="336" width="374" height="138" rx="8" pathLength="100" style="--d:2.0s"></rect><rect class="bx " x="54" y="414" width="116" height="50" rx="8" pathLength="100" style="--d:2.3s"></rect><rect class="bx g" x="10" y="280" width="370" height="32" rx="8" pathLength="100" style="--d:2.7s"></rect></svg><div class="pin pp " style="left:43.6%;top:49.1%;--d:2.6s" data-i18n="s09.10"></div><div class="pin pp g" style="left:95.4%;top:33.2%;--d:3.1s" data-i18n="s09.11"></div></div></div>
  <div class="note fi" style="left:1530px;top:300px;width:280px;--d:3.3s" data-i18n="s09.12"></div>
  <div class="url" data-i18n="s09.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s09.14"></span><span data-i18n="s09.15"></span></div>
</section>

<!-- 10 · The account and top-up -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s10.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s10.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s10.5"></p>
    <ol class="co"><li class="fi" style="--d:1.9s" data-i18n="s10.6"></li><li class="fi" style="--d:2.4s" data-i18n="s10.7"></li><li class="fi" style="--d:3.1s" data-i18n="s10.8"></li></ol>
  </div>
  <div class="shot fr " style="left:730px;top:150px;width:760px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.9"></span></div><div class="vp" style="height:475px"><img class="zo" style="--s:1.9;--d:0.2s;transform-origin:50% 38%" src="shots/tour-account.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="138" y="314" width="1166" height="148" rx="8" pathLength="100" style="--d:1.5s"></rect><rect class="bx " x="136" y="486" width="840" height="408" rx="8" pathLength="100" style="--d:2.0s"></rect></svg><div class="pin pp " style="left:9.6%;top:34.9%;--d:1.9s" data-i18n="s10.10"></div><div class="pin pp " style="left:62.5%;top:54.0%;--d:2.4s" data-i18n="s10.11"></div></div></div>
  <div class="shot fr fi" style="--d:2.4s;left:1250px;top:480px;width:560px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s10.12"></span></div><div class="vp" style="height:350px"><img src="shots/tour-topup.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx g" x="148" y="284" width="566" height="212" rx="8" pathLength="100" style="--d:2.7s"></rect></svg><div class="pin pp g" style="left:49.6%;top:31.6%;--d:3.1s" data-i18n="s10.13"></div></div></div>
  <div class="url" data-i18n="s10.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s10.15"></span><span data-i18n="s10.16"></span></div>
</section>

<!-- 11 · The vault -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s11.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s11.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s11.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s11.6"></li><li class="fi" style="--d:2.5s" data-i18n="s11.7"></li><li class="fi" style="--d:3.0s" data-i18n="s11.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s11.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.0;--d:0.2s;transform-origin:86% 30%" src="shots/tour-vault.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx g" x="1020" y="4" width="416" height="892" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx " x="1064" y="280" width="152" height="58" rx="8" pathLength="100" style="--d:2.1s"></rect><rect class="bx " x="136" y="516" width="680" height="92" rx="8" pathLength="100" style="--d:2.6s"></rect><g class="ar " style="--d:2.2s;--ax:-50px;--ay:40px"><path d="M880 420 L1050 320 M1033 349 L1050 320 L1016 321"></path></g></svg><div class="pin pp g" style="left:70.8%;top:3.3%;--d:2.0s" data-i18n="s11.10"></div><div class="pin pp " style="left:84.4%;top:31.1%;--d:2.5s" data-i18n="s11.11"></div><div class="pin pp " style="left:56.7%;top:57.3%;--d:3.0s" data-i18n="s11.12"></div></div></div>
  <div class="url" data-i18n="s11.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s11.14"></span><span data-i18n="s11.15"></span></div>
</section>

<!-- 12 · The app -->
<section class="slide">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s12.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s12.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s12.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s12.6"></li><li class="fi" style="--d:2.6s" data-i18n="s12.7"></li></ol>
  </div>
  <div class="shot fr " style="left:1200px;top:140px;width:600px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s12.8"></span></div><div class="vp" style="height:642px"><img class="zo" style="--s:1.8;--d:0.2s;transform-origin:15% 12%" src="shots/tour-ios-full.jpg" alt=""><svg class="ov" viewBox="0 0 1440 1541" preserveAspectRatio="none"><rect class="bx " x="150" y="140" width="640" height="680" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx g" x="150" y="1126" width="1140" height="336" rx="8" pathLength="100" style="--d:2.2s"></rect></svg><div class="pin pp " style="left:54.9%;top:9.1%;--d:2.0s" data-i18n="s12.9"></div><div class="pin pp g" style="left:89.6%;top:73.1%;--d:2.6s" data-i18n="s12.10"></div></div></div>
  <div class="abs" style="left:740px;top:170px;width:400px">
    <div class="stat fi" style="--d:2.8s"><div class="v" data-i18n="s12.11"></div><div class="l" data-i18n="s12.12"></div></div>
    <div class="stat fi" style="margin-top:36px;--d:3.0s"><div class="v" data-i18n="s12.13"></div><div class="l" data-i18n="s12.14"></div></div>
    <div class="stat r fi" style="margin-top:36px;--d:3.2s"><div class="v" style="font-size:64px" data-i18n="s12.15"></div><div class="l" data-i18n="s12.16"></div></div>
  </div>
  <div class="url" data-i18n="s12.17"></div>
  <div class="foot"><span class="wordmark" data-i18n="s12.18"></span><span data-i18n="s12.19"></span></div>
</section>

<!-- 13 · The newsroom -->
<section class="slide">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s13.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s13.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s13.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s13.6"></li><li class="fi" style="--d:2.5s" data-i18n="s13.7"></li><li class="fi" style="--d:3.0s" data-i18n="s13.8"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s13.9"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:2.0;--d:0.2s;transform-origin:30% 62%" src="shots/tour-newsroom.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="160" y="326" width="1124" height="44" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx g" x="160" y="510" width="704" height="152" rx="8" pathLength="100" style="--d:2.1s"></rect><rect class="bx " x="164" y="750" width="1114" height="148" rx="8" pathLength="100" style="--d:2.6s"></rect></svg><div class="pin pp " style="left:89.2%;top:36.2%;--d:2.0s" data-i18n="s13.10"></div><div class="pin pp g" style="left:60.0%;top:56.7%;--d:2.5s" data-i18n="s13.11"></div><div class="pin pp " style="left:88.8%;top:83.3%;--d:3.0s" data-i18n="s13.12"></div></div></div>
  <div class="url" data-i18n="s13.13"></div>
  <div class="foot"><span class="wordmark" data-i18n="s13.14"></span><span data-i18n="s13.15"></span></div>
</section>

<!-- 14 · Decisions -->
<section class="slide">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s14.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s14.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s14.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s14.6"></li><li class="fi" style="--d:2.6s" data-i18n="s14.7"></li></ol>
  </div>
  <div class="shot fr " style="left:760px;top:150px;width:1040px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s14.8"></span></div><div class="vp" style="height:650px"><img class="zo" style="--s:1.9;--d:0.2s;transform-origin:25% 70%" src="shots/tour-decisions.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="134" y="538" width="690" height="360" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx g" x="134" y="360" width="304" height="136" rx="8" pathLength="100" style="--d:2.2s"></rect><g class="ar " style="--d:2.0s;--ax:60px;--ay:-20px"><path d="M1100 520 L840 600 M864 576 L840 600 L873 607"></path></g></svg><div class="pin pp " style="left:57.2%;top:59.8%;--d:2.0s" data-i18n="s14.9"></div><div class="pin pp g" style="left:30.4%;top:40.0%;--d:2.6s" data-i18n="s14.10"></div></div></div>
  <div class="url" data-i18n="s14.11"></div>
  <div class="foot"><span class="wordmark" data-i18n="s14.12"></span><span data-i18n="s14.13"></span></div>
</section>

<!-- 15 · For agents -->
<section class="slide">
  <div class="head"><span><b data-i18n="s15.1"></b></span><span data-i18n="s15.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s15.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s15.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s15.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s15.6"></li><li class="fi" style="--d:2.5s" data-i18n="s15.7"></li><li class="fi" style="--d:3.1s" data-i18n="s15.8"></li></ol>
  </div>
  <div class="shot fr " style="left:720px;top:150px;width:780px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s15.9"></span></div><div class="vp" style="height:488px"><img class="zo" style="--s:2.2;--d:0.2s;transform-origin:0% 0%" src="shots/tour-twin.jpg" alt=""><svg class="ov" viewBox="0 0 960 600" preserveAspectRatio="none"><rect class="bx k" x="4" y="98" width="946" height="40" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx k" x="4" y="172" width="812" height="26" rx="8" pathLength="100" style="--d:2.1s"></rect></svg><div class="pin pp k" style="left:93.8%;top:16.3%;--d:2.0s" data-i18n="s15.10"></div><div class="pin pp k" style="left:85.0%;top:30.8%;--d:2.5s" data-i18n="s15.11"></div></div></div>
  <div class="shot fr fi" style="--d:2.5s;left:1200px;top:520px;width:600px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s15.12"></span></div><div class="vp" style="height:375px"><img src="shots/tour-llms.jpg" alt=""><svg class="ov" viewBox="0 0 960 600" preserveAspectRatio="none"><rect class="bx k" x="4" y="82" width="952" height="54" rx="8" pathLength="100" style="--d:2.8s"></rect><rect class="bx k" x="4" y="144" width="300" height="24" rx="8" pathLength="100" style="--d:3.0s"></rect></svg><div class="pin pp k" style="left:93.8%;top:13.7%;--d:3.1s" data-i18n="s15.13"></div></div></div>
  <div class="url" data-i18n="s15.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s15.15"></span><span data-i18n="s15.16"></span></div>
</section>

<!-- 16 · Investors -->
<section class="slide">
  <div class="head"><span><b data-i18n="s16.1"></b></span><span data-i18n="s16.2"></span></div>
  <div class="L">
    <div class="stop rise" style="--d:0s" data-i18n="s16.3"></div>
    <h2 class="rise" style="--d:.05s" data-i18n="s16.4"></h2>
    <p class="why rise" style="--d:.15s" data-i18n="s16.5"></p>
    <ol class="co"><li class="fi" style="--d:2.0s" data-i18n="s16.6"></li><li class="fi" style="--d:2.5s" data-i18n="s16.7"></li><li class="fi" style="--d:3.1s" data-i18n="s16.8"></li></ol>
  </div>
  <div class="shot fr " style="left:730px;top:150px;width:720px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s16.9"></span></div><div class="vp" style="height:450px"><img class="zo" style="--s:1.8;--d:0.2s;transform-origin:20% 60%" src="shots/tour-investors.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx " x="138" y="622" width="540" height="156" rx="8" pathLength="100" style="--d:1.6s"></rect><rect class="bx g" x="136" y="350" width="256" height="266" rx="8" pathLength="100" style="--d:2.1s"></rect></svg><div class="pin pp " style="left:47.1%;top:69.1%;--d:2.0s" data-i18n="s16.10"></div><div class="pin pp g" style="left:27.2%;top:38.9%;--d:2.5s" data-i18n="s16.11"></div></div></div>
  <div class="shot fr fi" style="--d:2.4s;left:1170px;top:470px;width:640px;"><div class="bar"><i></i><i></i><i></i><span data-i18n="s16.12"></span></div><div class="vp" style="height:400px"><img src="shots/tour-player.jpg" alt=""><svg class="ov" viewBox="0 0 1440 900" preserveAspectRatio="none"><rect class="bx k" x="4" y="2" width="1432" height="52" rx="8" pathLength="100" style="--d:2.7s"></rect></svg><div class="pin pp k" style="left:48.6%;top:6.0%;--d:3.1s" data-i18n="s16.13"></div></div></div>
  <div class="url" data-i18n="s16.14"></div>
  <div class="foot"><span class="wordmark" data-i18n="s16.15"></span><span data-i18n="s16.16"></span></div>
</section>

<!-- 17 · close -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s17.1"></b></span><span data-i18n="s17.2"></span></div>
  <div class="kicker rise" data-i18n="s17.3"></div>
  <h1 class="rise" style="font-size:104px;--d:.1s" data-i18n="s17.4"></h1>
  <div style="margin-top:44px;display:grid;gap:14px">
    <div class="urlrow fi" style="--d:.4s" data-i18n="s17.5"></div>
    <div class="urlrow fi" style="--d:.5s" data-i18n="s17.6"></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px 30px;margin-top:44px"><div class="fi" style="--d:0.60s"><div class="tag" style="color:#8fd18f" data-i18n="s17.7"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.8"></p></div><div class="fi" style="--d:0.72s"><div class="tag" style="color:#8fd18f" data-i18n="s17.9"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.10"></p></div><div class="fi" style="--d:0.84s"><div class="tag" style="color:#8fd18f" data-i18n="s17.11"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.12"></p></div><div class="fi" style="--d:0.96s"><div class="tag" style="color:#8fd18f" data-i18n="s17.13"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.14"></p></div><div class="fi" style="--d:1.08s"><div class="tag" style="color:#8fd18f" data-i18n="s17.15"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.16"></p></div><div class="fi" style="--d:1.20s"><div class="tag" style="color:#8fd18f" data-i18n="s17.17"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.18"></p></div><div class="fi" style="--d:1.32s"><div class="tag" style="color:#8fd18f" data-i18n="s17.19"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.20"></p></div><div class="fi" style="--d:1.44s"><div class="tag" style="color:#8fd18f" data-i18n="s17.21"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s17.22"></p></div><div class="fi" style="--d:1.56s"><div class="tag" style="color:#ff7a7f" data-i18n="s17.23"></div><p class="body" style="color:#f6f3ec;font-size:22px" data-i18n="s17.24"></p></div></div>
  <p class="lead fi" style="font-size:26px;margin-top:20px;--d:1.8s" data-i18n="s17.25"></p>
  <div class="foot"><span class="wordmark" data-i18n="s17.26"></span><span data-i18n="s17.27"></span></div>
</section>

</main><script src="deck.js"></script>

</body></html>
