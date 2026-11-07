<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
/* deck 6 only: diagrams, the policy document, honest notes */
.doc { background: var(--panel); border: 1px solid var(--rule-2); box-shadow: 0 30px 60px -20px rgba(18,19,23,.3); padding: 34px 38px; font: 400 21px/1.45 var(--mono); color: var(--ink-2); }
.doc .t { font: 600 30px/1.2 var(--serif); color: var(--ink); margin-bottom: 6px; }
.doc .m { font: 400 18px/1.3 var(--mono); color: var(--ink-3); margin-bottom: 18px; }
.doc .sec { border-left: 8px solid var(--green); padding: 8px 0 8px 20px; margin: 14px 0; }
.doc .sec.r { border-left-color: var(--red); } .doc .sec.k { border-left-color: var(--ink); } .doc .sec.c { border-left-color: var(--cobalt); }
.doc .sec b { display: block; font: 600 22px/1.3 var(--sans); color: var(--ink); margin-bottom: 4px; }
.num { display: grid; grid-template-columns: 64px 1fr; gap: 18px; align-items: start; margin-bottom: 26px; }
.num .k { width: 56px; height: 56px; border-radius: 50%; background: var(--green); color: #fff; font: 600 30px/56px var(--serif); text-align: center; }
.num .k.r { background: var(--red); } .num .k.i { background: var(--ink); } .num .k.c { background: var(--cobalt); }
.num h3 { font-size: 32px; margin-bottom: 4px; } .num p { font: 400 23px/1.42 var(--sans); color: var(--ink-2); }
.answer { font: 500 20px/1.3 var(--mono); color: #8fd18f; margin-top: 22px; letter-spacing: .04em; }
.qt { font: 400 italic 40px/1.25 var(--serif); color: var(--paper); margin-bottom: 30px; padding-left: 30px; border-left: 6px solid #ff7a7f; }
.qt .who { display: block; font: 500 18px/1.2 var(--mono); font-style: normal; letter-spacing: .1em; text-transform: uppercase; color: #9a978f; margin-top: 12px; }
.note { font: 400 21px/1.45 var(--sans); color: var(--ink-2); background: var(--paper-2); padding: 18px 24px; border-left: 6px solid var(--red); }
.slide.ink .tag { color: #8fd18f; } .slide.ink .tag.w { color: var(--paper); }
.deckrow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 30px; margin-top: 60px; }
.deckrow div { font: 400 22px/1.35 var(--sans); color: #c8c4ba; } .deckrow div b { display: block; font: 500 18px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: #8fd18f; margin-bottom: 8px; }
</style>
</head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide pic">
  <img class="bg" src="img/hero-lanes.jpg" alt="">
  <div class="veil" style="background:linear-gradient(90deg, rgba(18,19,23,.92) 0%, rgba(18,19,23,.78) 40%, rgba(18,19,23,0) 62%)"></div>
  <div class="head"><span data-i18n="s01.1"></span><span data-i18n="s01.2"></span></div>
  <div class="inner" style="max-width:1080px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:100px" data-i18n="s01.4"></h1>
    <p class="lead" data-i18n="s01.5"></p>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s01.6"></span><span data-i18n="s01.7"></span></div>
</section>

<!-- 2 · the multiplier -->
<section class="slide">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <h2 data-i18n="s02.4"></h2>
  <svg viewBox="0 0 1680 500" width="1680" height="500" style="margin-top:44px">
    <g>
      <text x="0" y="26" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s02.5"></text>
      <circle cx="18" cy="72" r="18" fill="#c52830"></circle>
      <g transform="translate(0,112)"><rect x="0" y="0" width="26" height="26" fill="#006600"></rect><rect x="34" y="0" width="26" height="26" fill="#006600"></rect><rect x="68" y="0" width="26" height="26" fill="#006600"></rect><rect x="102" y="0" width="26" height="26" fill="#006600"></rect><rect x="136" y="0" width="26" height="26" fill="#006600"></rect><rect x="0" y="34" width="26" height="26" fill="#006600"></rect><rect x="34" y="34" width="26" height="26" fill="#006600"></rect><rect x="68" y="34" width="26" height="26" fill="#006600"></rect><rect x="102" y="34" width="26" height="26" fill="#006600"></rect><rect x="136" y="34" width="26" height="26" fill="#006600"></rect><rect x="0" y="68" width="26" height="26" fill="#006600"></rect><rect x="34" y="68" width="26" height="26" fill="#006600"></rect><rect x="68" y="68" width="26" height="26" fill="#006600"></rect><rect x="102" y="68" width="26" height="26" fill="#006600"></rect><rect x="136" y="68" width="26" height="26" fill="#006600"></rect><rect x="0" y="102" width="26" height="26" fill="#006600"></rect><rect x="34" y="102" width="26" height="26" fill="#006600"></rect><rect x="68" y="102" width="26" height="26" fill="#006600"></rect><rect x="102" y="102" width="26" height="26" fill="#006600"></rect><rect x="136" y="102" width="26" height="26" fill="#006600"></rect><rect x="0" y="136" width="26" height="26" fill="#006600"></rect><rect x="34" y="136" width="26" height="26" fill="#006600"></rect><rect x="68" y="136" width="26" height="26" fill="#006600"></rect><rect x="102" y="136" width="26" height="26" fill="#006600"></rect><rect x="136" y="136" width="26" height="26" fill="#006600"></rect></g>
      <text x="0" y="410" class="serif" font-size="80" font-weight="600" fill="#121317" data-i18n="s02.6"></text>
      <text x="0" y="452" font-size="22" fill="#3f424a" data-i18n="s02.7"></text>
    </g>
    <g transform="translate(580,0)">
      <text x="0" y="26" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s02.8"></text>
      <circle cx="18" cy="72" r="18" fill="#c52830"></circle><circle cx="58" cy="72" r="18" fill="#c52830"></circle><circle cx="98" cy="72" r="18" fill="#c52830"></circle><circle cx="138" cy="72" r="18" fill="#c52830"></circle><circle cx="178" cy="72" r="18" fill="#c52830"></circle><circle cx="218" cy="72" r="18" fill="#c52830"></circle>
      <g transform="translate(0,112)"><rect x="0" y="0" width="22" height="22" fill="#006600"></rect><rect x="29" y="0" width="22" height="22" fill="#006600"></rect><rect x="58" y="0" width="22" height="22" fill="#006600"></rect><rect x="87" y="0" width="22" height="22" fill="#006600"></rect><rect x="116" y="0" width="22" height="22" fill="#006600"></rect><rect x="145" y="0" width="22" height="22" fill="#006600"></rect><rect x="174" y="0" width="22" height="22" fill="#006600"></rect><rect x="203" y="0" width="22" height="22" fill="#006600"></rect><rect x="232" y="0" width="22" height="22" fill="#006600"></rect><rect x="261" y="0" width="22" height="22" fill="#006600"></rect><rect x="290" y="0" width="22" height="22" fill="#006600"></rect><rect x="319" y="0" width="22" height="22" fill="#006600"></rect><rect x="348" y="0" width="22" height="22" fill="#006600"></rect><rect x="0" y="29" width="22" height="22" fill="#006600"></rect><rect x="29" y="29" width="22" height="22" fill="#006600"></rect><rect x="58" y="29" width="22" height="22" fill="#006600"></rect><rect x="87" y="29" width="22" height="22" fill="#006600"></rect><rect x="116" y="29" width="22" height="22" fill="#006600"></rect><rect x="145" y="29" width="22" height="22" fill="#006600"></rect><rect x="174" y="29" width="22" height="22" fill="#006600"></rect><rect x="203" y="29" width="22" height="22" fill="#006600"></rect><rect x="232" y="29" width="22" height="22" fill="#006600"></rect><rect x="261" y="29" width="22" height="22" fill="#006600"></rect><rect x="290" y="29" width="22" height="22" fill="#006600"></rect><rect x="319" y="29" width="22" height="22" fill="#006600"></rect><rect x="348" y="29" width="22" height="22" fill="#006600"></rect><rect x="0" y="58" width="22" height="22" fill="#006600"></rect><rect x="29" y="58" width="22" height="22" fill="#006600"></rect><rect x="58" y="58" width="22" height="22" fill="#006600"></rect><rect x="87" y="58" width="22" height="22" fill="#006600"></rect><rect x="116" y="58" width="22" height="22" fill="#006600"></rect><rect x="145" y="58" width="22" height="22" fill="#006600"></rect><rect x="174" y="58" width="22" height="22" fill="#006600"></rect><rect x="203" y="58" width="22" height="22" fill="#006600"></rect><rect x="232" y="58" width="22" height="22" fill="#006600"></rect><rect x="261" y="58" width="22" height="22" fill="#006600"></rect><rect x="290" y="58" width="22" height="22" fill="#006600"></rect><rect x="319" y="58" width="22" height="22" fill="#006600"></rect><rect x="348" y="58" width="22" height="22" fill="#006600"></rect><rect x="0" y="87" width="22" height="22" fill="#006600"></rect><rect x="29" y="87" width="22" height="22" fill="#006600"></rect><rect x="58" y="87" width="22" height="22" fill="#006600"></rect><rect x="87" y="87" width="22" height="22" fill="#006600"></rect><rect x="116" y="87" width="22" height="22" fill="#006600"></rect><rect x="145" y="87" width="22" height="22" fill="#006600"></rect><rect x="174" y="87" width="22" height="22" fill="#006600"></rect><rect x="203" y="87" width="22" height="22" fill="#006600"></rect><rect x="232" y="87" width="22" height="22" fill="#006600"></rect><rect x="261" y="87" width="22" height="22" fill="#006600"></rect><rect x="290" y="87" width="22" height="22" fill="#006600"></rect><rect x="319" y="87" width="22" height="22" fill="#006600"></rect><rect x="348" y="87" width="22" height="22" fill="#006600"></rect><rect x="0" y="116" width="22" height="22" fill="#006600"></rect><rect x="29" y="116" width="22" height="22" fill="#006600"></rect><rect x="58" y="116" width="22" height="22" fill="#006600"></rect><rect x="87" y="116" width="22" height="22" fill="#006600"></rect><rect x="116" y="116" width="22" height="22" fill="#006600"></rect><rect x="145" y="116" width="22" height="22" fill="#006600"></rect><rect x="174" y="116" width="22" height="22" fill="#006600"></rect><rect x="203" y="116" width="22" height="22" fill="#006600"></rect><rect x="232" y="116" width="22" height="22" fill="#006600"></rect><rect x="261" y="116" width="22" height="22" fill="#006600"></rect><rect x="290" y="116" width="22" height="22" fill="#006600"></rect><rect x="319" y="116" width="22" height="22" fill="#006600"></rect><rect x="348" y="116" width="22" height="22" fill="#006600"></rect><rect x="0" y="145" width="22" height="22" fill="#006600"></rect><rect x="29" y="145" width="22" height="22" fill="#006600"></rect><rect x="58" y="145" width="22" height="22" fill="#006600"></rect><rect x="87" y="145" width="22" height="22" fill="#006600"></rect><rect x="116" y="145" width="22" height="22" fill="#006600"></rect><rect x="145" y="145" width="22" height="22" fill="#006600"></rect><rect x="174" y="145" width="22" height="22" fill="#006600"></rect><rect x="203" y="145" width="22" height="22" fill="#006600"></rect><rect x="232" y="145" width="22" height="22" fill="#006600"></rect><rect x="261" y="145" width="22" height="22" fill="#006600"></rect><rect x="290" y="145" width="22" height="22" fill="#006600"></rect><rect x="319" y="145" width="22" height="22" fill="#006600"></rect><rect x="348" y="145" width="22" height="22" fill="#006600"></rect><rect x="0" y="174" width="22" height="22" fill="#006600"></rect><rect x="29" y="174" width="22" height="22" fill="#006600"></rect><rect x="58" y="174" width="22" height="22" fill="#006600"></rect><rect x="87" y="174" width="22" height="22" fill="#006600"></rect><rect x="116" y="174" width="22" height="22" fill="#006600"></rect><rect x="145" y="174" width="22" height="22" fill="#006600"></rect><rect x="174" y="174" width="22" height="22" fill="#006600"></rect><rect x="203" y="174" width="22" height="22" fill="#006600"></rect><rect x="232" y="174" width="22" height="22" fill="#006600"></rect><rect x="261" y="174" width="22" height="22" fill="#006600"></rect><rect x="290" y="174" width="22" height="22" fill="#006600"></rect><rect x="319" y="174" width="22" height="22" fill="#006600"></rect><rect x="348" y="174" width="22" height="22" fill="#006600"></rect></g>
      <text x="0" y="410" class="serif" font-size="80" font-weight="600" fill="#121317" data-i18n="s02.9"></text>
      <text x="0" y="452" font-size="22" fill="#3f424a" data-i18n="s02.10"></text>
    </g>
    <g transform="translate(1160,0)">
      <text x="0" y="26" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s02.11"></text>
      <circle cx="18" cy="72" r="18" fill="#c52830" opacity=".35"></circle><text x="48" y="80" font-size="20" fill="#595c64" data-i18n="s02.12"></text>
      <g transform="translate(0,112)"><rect x="0" y="0" width="22" height="22" fill="#006600"></rect><rect x="29" y="0" width="22" height="22" fill="#006600"></rect><rect x="58" y="0" width="22" height="22" fill="#006600"></rect><rect x="87" y="0" width="22" height="22" fill="#006600"></rect><rect x="116" y="0" width="22" height="22" fill="#006600"></rect><rect x="145" y="0" width="22" height="22" fill="#006600"></rect><rect x="174" y="0" width="22" height="22" fill="#006600"></rect><rect x="203" y="0" width="22" height="22" fill="#006600"></rect><rect x="232" y="0" width="22" height="22" fill="#006600"></rect><rect x="261" y="0" width="22" height="22" fill="#006600"></rect><rect x="290" y="0" width="22" height="22" fill="#006600"></rect><rect x="319" y="0" width="22" height="22" fill="#006600"></rect><rect x="348" y="0" width="22" height="22" fill="#006600"></rect><rect x="377" y="0" width="22" height="22" fill="#006600"></rect><rect x="406" y="0" width="22" height="22" fill="#006600"></rect><rect x="0" y="29" width="22" height="22" fill="#006600"></rect><rect x="29" y="29" width="22" height="22" fill="#006600"></rect><rect x="58" y="29" width="22" height="22" fill="#006600"></rect><rect x="87" y="29" width="22" height="22" fill="#006600"></rect><rect x="116" y="29" width="22" height="22" fill="#006600"></rect><rect x="145" y="29" width="22" height="22" fill="#006600"></rect><rect x="174" y="29" width="22" height="22" fill="#006600"></rect><rect x="203" y="29" width="22" height="22" fill="#006600"></rect><rect x="232" y="29" width="22" height="22" fill="#006600"></rect><rect x="261" y="29" width="22" height="22" fill="#006600"></rect><rect x="290" y="29" width="22" height="22" fill="#006600"></rect><rect x="319" y="29" width="22" height="22" fill="#006600"></rect><rect x="348" y="29" width="22" height="22" fill="#006600"></rect><rect x="377" y="29" width="22" height="22" fill="#006600"></rect><rect x="406" y="29" width="22" height="22" fill="#006600"></rect><rect x="0" y="58" width="22" height="22" fill="#006600"></rect><rect x="29" y="58" width="22" height="22" fill="#006600"></rect><rect x="58" y="58" width="22" height="22" fill="#006600"></rect><rect x="87" y="58" width="22" height="22" fill="#006600"></rect><rect x="116" y="58" width="22" height="22" fill="#006600"></rect><rect x="145" y="58" width="22" height="22" fill="#006600"></rect><rect x="174" y="58" width="22" height="22" fill="#006600"></rect><rect x="203" y="58" width="22" height="22" fill="#006600"></rect><rect x="232" y="58" width="22" height="22" fill="#006600"></rect><rect x="261" y="58" width="22" height="22" fill="#006600"></rect><rect x="290" y="58" width="22" height="22" fill="#006600"></rect><rect x="319" y="58" width="22" height="22" fill="#006600"></rect><rect x="348" y="58" width="22" height="22" fill="#006600"></rect><rect x="377" y="58" width="22" height="22" fill="#006600"></rect><rect x="406" y="58" width="22" height="22" fill="#006600"></rect><rect x="0" y="87" width="22" height="22" fill="#006600"></rect><rect x="29" y="87" width="22" height="22" fill="#006600"></rect><rect x="58" y="87" width="22" height="22" fill="#006600"></rect><rect x="87" y="87" width="22" height="22" fill="#006600"></rect><rect x="116" y="87" width="22" height="22" fill="#006600"></rect><rect x="145" y="87" width="22" height="22" fill="#006600"></rect><rect x="174" y="87" width="22" height="22" fill="#006600"></rect><rect x="203" y="87" width="22" height="22" fill="#006600"></rect><rect x="232" y="87" width="22" height="22" fill="#006600"></rect><rect x="261" y="87" width="22" height="22" fill="#006600"></rect><rect x="290" y="87" width="22" height="22" fill="#006600"></rect><rect x="319" y="87" width="22" height="22" fill="#006600"></rect><rect x="348" y="87" width="22" height="22" fill="#006600"></rect><rect x="377" y="87" width="22" height="22" fill="#006600"></rect><rect x="406" y="87" width="22" height="22" fill="#006600"></rect><rect x="0" y="116" width="22" height="22" fill="#006600"></rect><rect x="29" y="116" width="22" height="22" fill="#006600"></rect><rect x="58" y="116" width="22" height="22" fill="#006600"></rect><rect x="87" y="116" width="22" height="22" fill="#006600"></rect><rect x="116" y="116" width="22" height="22" fill="#006600"></rect><rect x="145" y="116" width="22" height="22" fill="#006600"></rect><rect x="174" y="116" width="22" height="22" fill="#006600"></rect><rect x="203" y="116" width="22" height="22" fill="#006600"></rect><rect x="232" y="116" width="22" height="22" fill="#006600"></rect><rect x="261" y="116" width="22" height="22" fill="#006600"></rect><rect x="290" y="116" width="22" height="22" fill="#006600"></rect><rect x="319" y="116" width="22" height="22" fill="#006600"></rect><rect x="348" y="116" width="22" height="22" fill="#006600"></rect><rect x="377" y="116" width="22" height="22" fill="#006600"></rect><rect x="406" y="116" width="22" height="22" fill="#006600"></rect><rect x="0" y="145" width="22" height="22" fill="#006600"></rect><rect x="29" y="145" width="22" height="22" fill="#006600"></rect><rect x="58" y="145" width="22" height="22" fill="#006600"></rect><rect x="87" y="145" width="22" height="22" fill="#006600"></rect><rect x="116" y="145" width="22" height="22" fill="#006600"></rect><rect x="145" y="145" width="22" height="22" fill="#006600"></rect><rect x="174" y="145" width="22" height="22" fill="#006600"></rect><rect x="203" y="145" width="22" height="22" fill="#006600"></rect><rect x="232" y="145" width="22" height="22" fill="#006600"></rect><rect x="261" y="145" width="22" height="22" fill="#006600"></rect><rect x="290" y="145" width="22" height="22" fill="#006600"></rect><rect x="319" y="145" width="22" height="22" fill="#006600"></rect><rect x="348" y="145" width="22" height="22" fill="#006600"></rect><rect x="377" y="145" width="22" height="22" fill="#006600"></rect><rect x="406" y="145" width="22" height="22" fill="#006600"></rect><rect x="0" y="174" width="22" height="22" fill="#006600"></rect><rect x="29" y="174" width="22" height="22" fill="#006600"></rect><rect x="58" y="174" width="22" height="22" fill="#006600"></rect><rect x="87" y="174" width="22" height="22" fill="#006600"></rect><rect x="116" y="174" width="22" height="22" fill="#006600"></rect><rect x="145" y="174" width="22" height="22" fill="#006600"></rect><rect x="174" y="174" width="22" height="22" fill="#006600"></rect><rect x="203" y="174" width="22" height="22" fill="#006600"></rect><rect x="232" y="174" width="22" height="22" fill="#006600"></rect><rect x="261" y="174" width="22" height="22" fill="#006600"></rect><rect x="290" y="174" width="22" height="22" fill="#006600"></rect><rect x="319" y="174" width="22" height="22" fill="#006600"></rect><rect x="348" y="174" width="22" height="22" fill="#006600"></rect><rect x="377" y="174" width="22" height="22" fill="#006600"></rect><rect x="406" y="174" width="22" height="22" fill="#006600"></rect><rect x="0" y="203" width="22" height="22" fill="#006600"></rect><rect x="29" y="203" width="22" height="22" fill="#006600"></rect><rect x="58" y="203" width="22" height="22" fill="#006600"></rect><rect x="87" y="203" width="22" height="22" fill="#006600"></rect><rect x="116" y="203" width="22" height="22" fill="#006600"></rect><rect x="145" y="203" width="22" height="22" fill="#006600"></rect></g>
      <text x="0" y="410" class="serif" font-size="80" font-weight="600" fill="#121317" data-i18n="s02.13"></text>
      <text x="0" y="452" font-size="22" fill="#3f424a" data-i18n="s02.14"></text>
    </g>
    <g transform="translate(0,486)" font-size="20" fill="#3f424a"><circle cx="9" cy="-6" r="9" fill="#c52830"></circle><text x="26" y="0" data-i18n="s02.15"></text><rect x="150" y="-15" width="18" height="18" fill="#006600"></rect><text x="180" y="0" data-i18n="s02.16"></text></g>
  </svg>
  <p class="lead" style="margin-top:6px;max-width:1680px" data-i18n="s02.17"></p>
  <div class="src" data-i18n="s02.18"></div>
  <div class="foot"><span class="wordmark" data-i18n="s02.19"></span><span data-i18n="s02.20"></span></div>
</section>

<!-- 3 · a control problem -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 data-i18n="s03.4"></h2>
  <div class="cols c3" style="margin-top:64px">
    <div class="card g"><div class="n" data-i18n="s03.5"></div><h3 data-i18n="s03.6"></h3><p data-i18n="s03.7"></p><div class="answer" data-i18n="s03.8"></div></div>
    <div class="card g"><div class="n" data-i18n="s03.9"></div><h3 data-i18n="s03.10"></h3><p data-i18n="s03.11"></p><div class="answer" data-i18n="s03.12"></div></div>
    <div class="card g"><div class="n" data-i18n="s03.13"></div><h3 data-i18n="s03.14"></h3><p data-i18n="s03.15"></p><div class="answer" data-i18n="s03.16"></div></div>
  </div>
  <p class="lead" style="margin-top:56px;max-width:1680px" data-i18n="s03.17"></p>
  <div class="foot"><span class="wordmark" data-i18n="s03.18"></span><span data-i18n="s03.19"></span></div>
</section>

<!-- 4 · the stack -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="kicker" data-i18n="s04.3"></div>
  <h2 data-i18n="s04.4"></h2>
  <svg viewBox="0 0 1680 640" width="1680" height="640" style="margin-top:40px">
    <text x="0" y="22" class="mono" font-size="19" fill="#595c64" letter-spacing="2" data-i18n="s04.5"></text>
    <text x="1210" y="22" class="mono" font-size="19" fill="#595c64" letter-spacing="2" data-i18n="s04.6"></text>
    <g transform="translate(0,40)">
      <rect x="0" y="0" width="1160" height="86" fill="#c52830"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#fff" data-i18n="s04.7"></text><text x="30" y="70" font-size="21" fill="#f8e4df" data-i18n="s04.8"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.9"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.10"></text>
    </g>
    <g transform="translate(0,138)">
      <rect x="0" y="0" width="1160" height="86" fill="#121317"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#f6f3ec" data-i18n="s04.11"></text><text x="30" y="70" font-size="21" fill="#c8c4ba" data-i18n="s04.12"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.13"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.14"></text>
    </g>
    <g transform="translate(0,236)">
      <rect x="0" y="0" width="1160" height="86" fill="#006600"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#fff" data-i18n="s04.15"></text><text x="30" y="70" font-size="21" fill="#e2eedf" data-i18n="s04.16"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.17"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.18"></text>
    </g>
    <g transform="translate(0,334)">
      <rect x="0" y="0" width="1160" height="86" fill="#e2eedf" stroke="#006600" stroke-width="3"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#121317" data-i18n="s04.19"></text><text x="30" y="70" font-size="21" fill="#3f424a" data-i18n="s04.20"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.21"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.22"></text>
    </g>
    <g transform="translate(0,432)">
      <rect x="0" y="0" width="1160" height="86" fill="#fffdf8" stroke="#1f4fa8" stroke-width="3"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#121317" data-i18n="s04.23"></text><text x="30" y="70" font-size="21" fill="#3f424a" data-i18n="s04.24"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.25"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.26"></text>
    </g>
    <g transform="translate(0,530)">
      <rect x="0" y="0" width="1160" height="86" fill="#ece7db"></rect>
      <text x="30" y="38" class="serif" font-size="32" font-weight="600" fill="#121317" data-i18n="s04.27"></text><text x="30" y="70" font-size="21" fill="#3f424a" data-i18n="s04.28"></text>
      <line x1="1160" y1="43" x2="1200" y2="43" stroke="#9d9580" stroke-width="2" stroke-dasharray="6 6"></line><text x="1210" y="38" font-size="22" fill="#121317" font-weight="600" data-i18n="s04.29"></text><text x="1210" y="68" font-size="20" fill="#595c64" data-i18n="s04.30"></text>
    </g>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s04.31"></span><span data-i18n="s04.32"></span></div>
</section>

<!-- 5 · identity -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="kicker" data-i18n="s05.3"></div>
  <h2 data-i18n="s05.4"></h2>
  <div class="flow" style="margin-top:40px">
    <div class="step"><div class="n" data-i18n="s05.5"></div><h3 data-i18n="s05.6"></h3><p data-i18n="s05.7"></p></div>
    <div class="step"><div class="n" data-i18n="s05.8"></div><h3 data-i18n="s05.9"></h3><p data-i18n="s05.10"></p></div>
    <div class="step"><div class="n" data-i18n="s05.11"></div><h3 data-i18n="s05.12"></h3><p data-i18n="s05.13"></p></div>
    <div class="step"><div class="n" data-i18n="s05.14"></div><h3 data-i18n="s05.15"></h3><p data-i18n="s05.16"></p></div>
  </div>
  <div class="cols c3" style="margin-top:40px;gap:40px">
    <div class="stat"><div class="v" data-i18n="s05.17"></div><div class="l" data-i18n="s05.18"></div></div>
    <div class="stat"><div class="v" data-i18n="s05.19"></div><div class="l" data-i18n="s05.20"></div></div>
    <div class="stat r"><div class="v" data-i18n="s05.21"></div><div class="l" data-i18n="s05.22"></div></div>
  </div>
  <div class="src" style="margin-top:20px" data-i18n="s05.23"></div>
  <div class="foot"><span class="wordmark" data-i18n="s05.24"></span><span data-i18n="s05.25"></span></div>
</section>

<!-- 6 · private by default -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 data-i18n="s06.4"></h2>
  <svg viewBox="0 0 1680 330" width="1680" height="330" style="margin-top:40px">
    <defs><marker id="ag" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <rect x="0" y="40" width="400" height="220" fill="#fffdf8" stroke="#006600" stroke-width="4"></rect>
    <text x="30" y="90" class="mono" font-size="20" fill="#006600" letter-spacing="2" data-i18n="s06.5"></text>
    <text x="30" y="132" class="serif" font-size="34" font-weight="600" fill="#121317" data-i18n="s06.6"></text>
    <text x="30" y="176" font-size="21" fill="#3f424a" data-i18n="s06.7"></text><text x="30" y="204" font-size="21" fill="#3f424a" data-i18n="s06.8"></text><text x="30" y="232" font-size="21" fill="#3f424a" data-i18n="s06.9"></text>
    <line x1="412" y1="150" x2="606" y2="150" stroke="#006600" stroke-width="5" marker-end="url(#ag)"></line>
    <text x="510" y="128" text-anchor="middle" font-size="20" fill="#121317" font-weight="600" data-i18n="s06.10"></text>
    <text x="510" y="186" text-anchor="middle" font-size="19" fill="#595c64" data-i18n="s06.11"></text>
    <rect x="620" y="20" width="440" height="260" fill="#121317"></rect>
    <text x="840" y="72" text-anchor="middle" class="mono" font-size="20" fill="#8fd18f" letter-spacing="2" data-i18n="s06.12"></text>
    <g fill="#3a3b40"><rect x="680" y="100" width="320" height="26"></rect><rect x="680" y="136" width="320" height="26"></rect><rect x="680" y="172" width="320" height="26"></rect></g>
    <text x="840" y="120" text-anchor="middle" class="mono" font-size="18" fill="#9a978f" data-i18n="s06.13"></text><text x="840" y="156" text-anchor="middle" class="mono" font-size="18" fill="#9a978f" data-i18n="s06.14"></text><text x="840" y="192" text-anchor="middle" class="mono" font-size="18" fill="#9a978f" data-i18n="s06.15"></text>
    <text x="840" y="242" text-anchor="middle" font-size="21" fill="#f6f3ec" data-i18n="s06.16"></text>
    <line x1="1072" y1="150" x2="1266" y2="150" stroke="#006600" stroke-width="5" marker-end="url(#ag)"></line>
    <text x="1170" y="128" text-anchor="middle" font-size="20" fill="#121317" font-weight="600" data-i18n="s06.17"></text>
    <rect x="1280" y="40" width="400" height="220" fill="#fffdf8" stroke="#006600" stroke-width="4"></rect>
    <text x="1310" y="90" class="mono" font-size="20" fill="#006600" letter-spacing="2" data-i18n="s06.18"></text>
    <text x="1310" y="132" class="serif" font-size="34" font-weight="600" fill="#121317" data-i18n="s06.19"></text>
    <text x="1310" y="176" font-size="21" fill="#3f424a" data-i18n="s06.20"></text><text x="1310" y="204" font-size="21" fill="#3f424a" data-i18n="s06.21"></text><text x="1310" y="232" font-size="21" fill="#3f424a" data-i18n="s06.22"></text>
    <text x="0" y="318" font-size="20" fill="#595c64" data-i18n="s06.23"></text>
  </svg>
  <div class="cols c3 tight" style="margin-top:36px;gap:30px">
    <div class="card c"><div class="n" data-i18n="s06.24"></div><h3 data-i18n="s06.25"></h3><p data-i18n="s06.26"></p></div>
    <div class="card c"><div class="n" data-i18n="s06.27"></div><h3 data-i18n="s06.28"></h3><p data-i18n="s06.29"></p></div>
    <div class="card c"><div class="n" data-i18n="s06.30"></div><h3 data-i18n="s06.31"></h3><p data-i18n="s06.32"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s06.33"></span><span data-i18n="s06.34"></span></div>
</section>

<!-- 7 · reach, mandate, gap -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="kicker" data-i18n="s07.3"></div>
  <h2 data-i18n="s07.4"></h2>
  <div class="cols w60 center" style="margin-top:36px;gap:56px">
    <svg viewBox="0 0 900 600" width="900" height="600">
      <defs><pattern id="hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#f8e4df"></rect><line x1="0" y1="0" x2="0" y2="18" stroke="#c52830" stroke-width="5" opacity=".55"></line></pattern></defs>
      <rect x="10" y="10" width="880" height="580" rx="28" fill="url(#hatch)" stroke="#c52830" stroke-width="4"></rect>
      <text x="44" y="62" class="mono" font-size="22" fill="#c52830" letter-spacing="2" font-weight="500" data-i18n="s07.5"></text>
      <text x="44" y="94" font-size="21" fill="#121317" data-i18n="s07.6"></text>
      <rect x="150" y="160" width="430" height="300" rx="20" fill="#e2eedf" stroke="#006600" stroke-width="5"></rect>
      <text x="180" y="212" class="mono" font-size="22" fill="#006600" letter-spacing="2" font-weight="500" data-i18n="s07.7"></text>
      <text x="180" y="248" font-size="21" fill="#121317" data-i18n="s07.8"></text>
      <text x="180" y="330" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s07.9"></text>
      <text x="180" y="366" font-size="20" fill="#3f424a" data-i18n="s07.10"></text>
      <rect x="590" y="440" width="270" height="120" fill="#fffdf8" stroke="#c52830" stroke-width="3"></rect>
      <text x="610" y="480" class="mono" font-size="22" fill="#c52830" letter-spacing="2" font-weight="500" data-i18n="s07.11"></text>
      <text x="610" y="512" font-size="20" fill="#121317" data-i18n="s07.12"></text>
      <text x="610" y="540" font-size="20" fill="#121317" data-i18n="s07.13"></text>
      <rect x="140" y="150" width="450" height="320" rx="26" fill="none" stroke="#121317" stroke-width="3" stroke-dasharray="12 9"></rect>
      <text x="150" y="138" class="mono" font-size="20" fill="#121317" letter-spacing="1" data-i18n="s07.14"></text>
    </svg>
    <div>
      <div class="num"><div class="k r" data-i18n="s07.15"></div><div><h3 data-i18n="s07.16"></h3><p data-i18n="s07.17"></p></div></div>
      <div class="num"><div class="k" data-i18n="s07.18"></div><div><h3 data-i18n="s07.19"></h3><p data-i18n="s07.20"></p></div></div>
      <div class="num"><div class="k r" data-i18n="s07.21"></div><div><h3 data-i18n="s07.22"></h3><p data-i18n="s07.23"></p></div></div>
      <div class="num"><div class="k i" data-i18n="s07.24"></div><div><h3 data-i18n="s07.25"></h3><p data-i18n="s07.26"></p></div></div>
    </div>
  </div>
  <div class="src" style="margin-top:4px" data-i18n="s07.27"></div>
  <div class="foot"><span class="wordmark" data-i18n="s07.28"></span><span data-i18n="s07.29"></span></div>
</section>

<!-- 8 · barriers -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="kicker" data-i18n="s08.3"></div>
  <h2 data-i18n="s08.4"></h2>
  <svg viewBox="0 0 1680 560" width="1680" height="560" style="margin-top:40px">
    <line x1="0" y1="540" x2="1680" y2="540" stroke="#121317" stroke-width="3"></line>
    <g>
      <rect x="0" y="440" width="390" height="100" fill="#ece7db"></rect>
      <text x="24" y="482" class="serif" font-size="36" font-weight="600" fill="#595c64" data-i18n="s08.5"></text>
      <text x="24" y="518" font-size="21" fill="#595c64" data-i18n="s08.6"></text>
    </g>
    <g>
      <rect x="430" y="320" width="390" height="220" fill="#f8e4df"></rect>
      <text x="454" y="362" class="serif" font-size="36" font-weight="600" fill="#121317" data-i18n="s08.7"></text>
      <text x="454" y="398" font-size="21" fill="#3f424a" data-i18n="s08.8"></text><text x="454" y="426" font-size="21" fill="#3f424a" data-i18n="s08.9"></text>
      <text x="454" y="476" class="mono" font-size="18" fill="#c52830" letter-spacing="1" data-i18n="s08.10"></text><text x="454" y="502" class="mono" font-size="18" fill="#c52830" letter-spacing="1" data-i18n="s08.11"></text>
    </g>
    <g>
      <rect x="860" y="200" width="390" height="340" fill="#fffdf8" stroke="#1f4fa8" stroke-width="3"></rect>
      <text x="884" y="242" class="serif" font-size="36" font-weight="600" fill="#121317" data-i18n="s08.12"></text>
      <text x="884" y="278" font-size="21" fill="#3f424a" data-i18n="s08.13"></text><text x="884" y="306" font-size="21" fill="#3f424a" data-i18n="s08.14"></text><text x="884" y="334" font-size="21" fill="#3f424a" data-i18n="s08.15"></text>
      <text x="884" y="400" class="mono" font-size="18" fill="#1f4fa8" letter-spacing="1" data-i18n="s08.16"></text><text x="884" y="426" class="mono" font-size="18" fill="#1f4fa8" letter-spacing="1" data-i18n="s08.17"></text><text x="884" y="452" class="mono" font-size="18" fill="#1f4fa8" letter-spacing="1" data-i18n="s08.18"></text><text x="884" y="478" class="mono" font-size="18" fill="#1f4fa8" letter-spacing="1" data-i18n="s08.19"></text>
    </g>
    <g>
      <rect x="1290" y="40" width="390" height="500" fill="#006600"></rect>
      <text x="1314" y="86" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s08.20"></text>
      <text x="1314" y="124" font-size="21" fill="#e2eedf" data-i18n="s08.21"></text><text x="1314" y="152" font-size="21" fill="#e2eedf" data-i18n="s08.22"></text>
      <text x="1314" y="214" class="mono" font-size="18" fill="#fff" letter-spacing="1" data-i18n="s08.23"></text>
      <text x="1314" y="256" font-size="21" fill="#fff" data-i18n="s08.24"></text>
      <text x="1314" y="296" font-size="21" fill="#fff" data-i18n="s08.25"></text>
      <text x="1314" y="336" font-size="21" fill="#fff" data-i18n="s08.26"></text><text x="1314" y="364" font-size="21" fill="#fff" data-i18n="s08.27"></text>
      <text x="1314" y="430" class="mono" font-size="18" fill="#e2eedf" letter-spacing="1" data-i18n="s08.28"></text><text x="1314" y="456" class="mono" font-size="18" fill="#e2eedf" letter-spacing="1" data-i18n="s08.29"></text>
    </g>
  </svg>
  <div class="src" data-i18n="s08.30"></div>
  <div class="foot"><span class="wordmark" data-i18n="s08.31"></span><span data-i18n="s08.32"></span></div>
</section>

<!-- 9 · one policy per agent -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="cols w40 center" style="margin-top:0;height:100%;gap:72px">
    <div class="doc">
      <div class="t" data-i18n="s09.3"></div>
      <div class="m" data-i18n="s09.4"></div>
      <div class="sec" data-i18n="s09.5"></div>
      <div class="sec r" data-i18n="s09.6"></div>
      <div class="sec k" data-i18n="s09.7"></div>
      <div class="sec c" data-i18n="s09.8"></div>
    </div>
    <div>
      <div class="kicker" data-i18n="s09.9"></div>
      <h2 style="font-size:66px" data-i18n="s09.10"></h2>
      <ul class="ticks" style="margin-top:40px">
        <li data-i18n="s09.11"></li>
        <li data-i18n="s09.12"></li>
        <li data-i18n="s09.13"></li>
        <li data-i18n="s09.14"></li>
      </ul>
      <div class="src" data-i18n="s09.15"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s09.16"></span><span data-i18n="s09.17"></span></div>
</section>

<!-- 10 · hooks -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 data-i18n="s10.4"></h2>
  <svg viewBox="0 0 1680 600" width="1680" height="600" style="margin-top:30px">
    <defs><marker id="ak" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#121317"></path></marker><marker id="ag2" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker><marker id="ar" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#c52830"></path></marker></defs>
    <text x="0" y="24" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s10.5"></text>
    <rect x="0" y="44" width="340" height="96" fill="#ece7db"></rect><text x="24" y="86" font-size="23" font-weight="600" fill="#121317" data-i18n="s10.6"></text><text x="24" y="118" font-size="21" fill="#3f424a" data-i18n="s10.7"></text>
    <line x1="350" y1="92" x2="440" y2="92" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
    <rect x="450" y="44" width="560" height="96" fill="#006600"></rect><text x="474" y="86" font-size="23" font-weight="600" fill="#fff" data-i18n="s10.8"></text><text x="474" y="118" font-size="21" fill="#e2eedf" data-i18n="s10.9"></text>
    <line x1="1020" y1="92" x2="1110" y2="92" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
    <rect x="1120" y="44" width="560" height="96" fill="#fffdf8" stroke="#006600" stroke-width="3"></rect><text x="1144" y="86" font-size="23" font-weight="600" fill="#121317" data-i18n="s10.10"></text><text x="1144" y="118" font-size="21" fill="#3f424a" data-i18n="s10.11"></text>

    <text x="0" y="200" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s10.12"></text>
    <rect x="0" y="220" width="340" height="96" fill="#ece7db"></rect><text x="24" y="262" font-size="23" font-weight="600" fill="#121317" data-i18n="s10.13"></text><text x="24" y="294" font-size="21" fill="#3f424a" data-i18n="s10.14"></text>
    <line x1="350" y1="268" x2="440" y2="268" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
    <rect x="450" y="220" width="320" height="96" fill="#121317"></rect><text x="474" y="262" font-size="23" font-weight="600" fill="#f6f3ec" data-i18n="s10.15"></text><text x="474" y="294" font-size="21" fill="#c8c4ba" data-i18n="s10.16"></text>
    <line x1="780" y1="268" x2="850" y2="268" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
    <polygon points="960,208 1080,268 960,328 840,268" fill="#fffdf8" stroke="#121317" stroke-width="3"></polygon><text x="960" y="262" text-anchor="middle" font-size="21" font-weight="600" fill="#121317" data-i18n="s10.17"></text><text x="960" y="288" text-anchor="middle" font-size="21" font-weight="600" fill="#121317" data-i18n="s10.18"></text>
    <path d="M1080,268 L1180,268 L1180,232 L1200,232" fill="none" stroke="#006600" stroke-width="3" marker-end="url(#ag2)"></path>
    <rect x="1210" y="200" width="470" height="64" fill="#e2eedf"></rect><text x="1230" y="242" font-size="22" fill="#121317" data-i18n="s10.19"></text>
    <path d="M1180,268 L1180,316 L1200,316" fill="none" stroke="#c52830" stroke-width="3" marker-end="url(#ar)"></path>
    <rect x="1210" y="284" width="470" height="64" fill="#f8e4df"></rect><text x="1230" y="326" font-size="22" fill="#121317" data-i18n="s10.20"></text>
    <path d="M960,328 L960,400 L1200,400" fill="none" stroke="#9d9580" stroke-width="3" stroke-dasharray="8 7" marker-end="url(#ak)"></path>
    <rect x="1210" y="368" width="470" height="64" fill="#121317"></rect><text x="1230" y="410" font-size="22" fill="#f6f3ec" data-i18n="s10.21"></text>
    <text x="984" y="386" font-size="19" fill="#595c64" data-i18n="s10.22"></text>

    <text x="0" y="484" class="mono" font-size="20" fill="#595c64" letter-spacing="2" data-i18n="s10.23"></text>
    <g font-size="21" fill="#121317">
      <rect x="0" y="504" width="380" height="72" fill="#fffdf8" stroke="#d9d2c1"></rect><text x="22" y="548" data-i18n="s10.24"></text>
      <line x1="390" y1="540" x2="440" y2="540" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
      <rect x="450" y="504" width="380" height="72" fill="#fffdf8" stroke="#d9d2c1"></rect><text x="472" y="548" data-i18n="s10.25"></text>
      <line x1="840" y1="540" x2="890" y2="540" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
      <rect x="900" y="504" width="380" height="72" fill="#fffdf8" stroke="#d9d2c1"></rect><text x="922" y="548" data-i18n="s10.26"></text>
      <line x1="1290" y1="540" x2="1340" y2="540" stroke="#121317" stroke-width="3" marker-end="url(#ak)"></line>
      <rect x="1350" y="504" width="330" height="72" fill="#c52830"></rect><text x="1372" y="548" fill="#fff" font-weight="600" data-i18n="s10.27"></text>
    </g>
  </svg>
  <div class="src" style="margin-top:8px" data-i18n="s10.28"></div>
  <div class="foot"><span class="wordmark" data-i18n="s10.29"></span><span data-i18n="s10.30"></span></div>
</section>

<!-- 11 · a day in the life -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="kicker" data-i18n="s11.3"></div>
  <h2 data-i18n="s11.4"></h2>
  <div class="tl" style="grid-template-columns:repeat(7,1fr);margin-top:80px">
    <div class="ev"><div class="d" data-i18n="s11.5"></div><h3 data-i18n="s11.6"></h3><p data-i18n="s11.7"></p></div>
    <div class="ev"><div class="d" data-i18n="s11.8"></div><h3 data-i18n="s11.9"></h3><p data-i18n="s11.10"></p></div>
    <div class="ev"><div class="d" data-i18n="s11.11"></div><h3 data-i18n="s11.12"></h3><p data-i18n="s11.13"></p></div>
    <div class="ev now"><div class="d" data-i18n="s11.14"></div><h3 data-i18n="s11.15"></h3><p data-i18n="s11.16"></p></div>
    <div class="ev"><div class="d" data-i18n="s11.17"></div><h3 data-i18n="s11.18"></h3><p data-i18n="s11.19"></p></div>
    <div class="ev"><div class="d" data-i18n="s11.20"></div><h3 data-i18n="s11.21"></h3><p data-i18n="s11.22"></p></div>
    <div class="ev r"><div class="d" data-i18n="s11.23"></div><h3 data-i18n="s11.24"></h3><p data-i18n="s11.25"></p></div>
  </div>
  <svg viewBox="0 0 1680 110" width="1680" height="110" style="margin-top:40px">
    <defs><marker id="al" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#006600"></path></marker></defs>
    <path d="M1460,6 L1460,60 Q1460,86 1434,86 L40,86 Q14,86 14,60 L14,22" fill="none" stroke="#006600" stroke-width="4" stroke-dasharray="12 8" marker-end="url(#al)"></path>
    <text x="740" y="58" text-anchor="middle" font-size="22" fill="#006600" font-weight="600" data-i18n="s11.26"></text>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s11.27"></span><span data-i18n="s11.28"></span></div>
</section>

<!-- 12 · the record -->
<section class="slide">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 data-i18n="s12.4"></h2>
  <div class="cols w60" style="margin-top:44px;gap:64px">
    <div>
      <svg viewBox="0 0 960 300" width="960" height="300">
        <text x="0" y="24" class="mono" font-size="19" fill="#595c64" letter-spacing="2" data-i18n="s12.5"></text>
        <rect x="0" y="50" width="860" height="78" fill="#006600"></rect><text x="24" y="100" font-size="26" font-weight="600" fill="#fff" data-i18n="s12.6"></text>
        <rect x="0" y="146" width="87" height="78" fill="#c52830"></rect><text x="104" y="196" font-size="26" font-weight="600" fill="#121317" data-i18n="s12.7"></text>
        <text x="0" y="280" font-size="21" fill="#3f424a" data-i18n="s12.8"></text>
      </svg>
      <div class="cols c4" style="margin-top:20px;gap:24px">
        <div class="stat"><div class="v" style="font-size:64px" data-i18n="s12.9"></div><div class="l" data-i18n="s12.10"></div></div>
        <div class="stat"><div class="v" style="font-size:64px" data-i18n="s12.11"></div><div class="l" data-i18n="s12.12"></div></div>
        <div class="stat"><div class="v" style="font-size:64px" data-i18n="s12.13"></div><div class="l" data-i18n="s12.14"></div></div>
        <div class="stat r"><div class="v" style="font-size:64px" data-i18n="s12.15"></div><div class="l" data-i18n="s12.16"></div></div>
      </div>
    </div>
    <div>
      <div class="card r"><div class="n" data-i18n="s12.17"></div><h3 data-i18n="s12.18"></h3><p data-i18n="s12.19"></p></div>
      <div class="note" style="margin-top:30px" data-i18n="s12.20"></div>
    </div>
  </div>
  <div class="src" data-i18n="s12.21"></div>
  <div class="foot"><span class="wordmark" data-i18n="s12.22"></span><span data-i18n="s12.23"></span></div>
</section>

<!-- 13 · the gap, honestly -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="kicker" data-i18n="s13.3"></div>
  <h2 data-i18n="s13.4"></h2>
  <div class="cols" style="margin-top:56px;gap:80px">
    <div>
      <div class="kicker" style="color:#ff7a7f;margin-bottom:20px" data-i18n="s13.5"></div>
      <ul class="ticks x">
        <li data-i18n="s13.6"></li>
        <li data-i18n="s13.7"></li>
        <li data-i18n="s13.8"></li>
        <li data-i18n="s13.9"></li>
      </ul>
    </div>
    <div>
      <div class="qt" data-i18n="s13.10"></div>
      <div class="qt" data-i18n="s13.11"></div>
      <div class="qt" data-i18n="s13.12"></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s13.13"></span><span data-i18n="s13.14"></span></div>
</section>

<!-- 14 · next phases -->
<section class="slide">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="kicker" data-i18n="s14.3"></div>
  <h2 data-i18n="s14.4"></h2>
  <div class="tl" style="grid-template-columns:repeat(4,1fr);margin-top:60px">
    <div class="ev now"><div class="d" data-i18n="s14.5"></div><h3 data-i18n="s14.6"></h3><p data-i18n="s14.7"></p></div>
    <div class="ev"><div class="d" data-i18n="s14.8"></div><h3 data-i18n="s14.9"></h3><p data-i18n="s14.10"></p></div>
    <div class="ev"><div class="d" data-i18n="s14.11"></div><h3 data-i18n="s14.12"></h3><p data-i18n="s14.13"></p></div>
    <div class="ev r"><div class="d" data-i18n="s14.14"></div><h3 data-i18n="s14.15"></h3><p data-i18n="s14.16"></p></div>
  </div>
  <div class="vs" style="margin-top:56px">
    <div class="side old"><h3 data-i18n="s14.17"></h3><p class="body" data-i18n="s14.18"></p></div>
    <div class="mid" data-i18n="s14.19"></div>
    <div class="side new"><h3 data-i18n="s14.20"></h3><p class="body" data-i18n="s14.21"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s14.22"></span><span data-i18n="s14.23"></span></div>
</section>

<!-- 15 · the moat -->
<section class="slide">
  <div class="head"><span><b data-i18n="s15.1"></b></span><span data-i18n="s15.2"></span></div>
  <div class="kicker" data-i18n="s15.3"></div>
  <h2 data-i18n="s15.4"></h2>
  <svg viewBox="0 0 1680 600" width="1680" height="600" style="margin-top:30px">
    <defs><marker id="am" viewBox="0 0 12 12" markerWidth="22" markerHeight="22" markerUnits="userSpaceOnUse" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#c52830"></path></marker></defs>
    <line x1="120" y1="20" x2="120" y2="520" stroke="#121317" stroke-width="3"></line>
    <line x1="120" y1="520" x2="1680" y2="520" stroke="#121317" stroke-width="3"></line>
    <text x="96" y="270" font-size="20" fill="#595c64" transform="rotate(-90 96 270)" text-anchor="middle" data-i18n="s15.5"></text>
    <g font-size="20" fill="#595c64" class="mono" letter-spacing="1"><text x="300" y="556" text-anchor="middle" data-i18n="s15.6"></text><text x="680" y="556" text-anchor="middle" data-i18n="s15.7"></text><text x="1060" y="556" text-anchor="middle" data-i18n="s15.8"></text><text x="1450" y="556" text-anchor="middle" data-i18n="s15.9"></text></g>
    <g stroke="#d9d2c1" stroke-width="2" stroke-dasharray="4 8"><line x1="490" y1="20" x2="490" y2="520"></line><line x1="870" y1="20" x2="870" y2="520"></line><line x1="1250" y1="20" x2="1250" y2="520"></line></g>
    <!-- links -->
    <g stroke="#9d9580" stroke-width="2"><line x1="1060" y1="70" x2="720" y2="200"></line><line x1="720" y1="200" x2="560" y2="320"></line><line x1="720" y1="200" x2="1440" y2="440"></line><line x1="560" y1="320" x2="1000" y2="440"></line><line x1="560" y1="320" x2="330" y2="440"></line></g>
    <!-- nodes -->
    <circle cx="1060" cy="70" r="16" fill="#121317"></circle><text x="1086" y="64" font-size="22" font-weight="600" fill="#121317" data-i18n="s15.10"></text><text x="1086" y="92" font-size="19" fill="#595c64" data-i18n="s15.11"></text>
    <circle cx="720" cy="200" r="22" fill="#006600"></circle><text x="690" y="190" font-size="22" font-weight="600" fill="#121317" text-anchor="end" data-i18n="s15.12"></text><text x="690" y="218" font-size="19" fill="#595c64" text-anchor="end" data-i18n="s15.13"></text>
    <circle cx="560" cy="320" r="22" fill="#006600"></circle><text x="526" y="306" font-size="22" font-weight="600" fill="#121317" text-anchor="end" data-i18n="s15.14"></text><text x="526" y="334" font-size="19" fill="#595c64" text-anchor="end" data-i18n="s15.15"></text>
    <circle cx="1440" cy="440" r="16" fill="#fffdf8" stroke="#121317" stroke-width="3"></circle><text x="1440" y="486" font-size="22" font-weight="600" fill="#121317" text-anchor="middle" data-i18n="s15.16"></text>
    <circle cx="1000" cy="440" r="16" fill="#fffdf8" stroke="#1f4fa8" stroke-width="4"></circle><text x="1000" y="486" font-size="22" font-weight="600" fill="#121317" text-anchor="middle" data-i18n="s15.17"></text>
    <circle cx="330" cy="440" r="16" fill="#fffdf8" stroke="#c52830" stroke-width="4"></circle><text x="330" y="486" font-size="22" font-weight="600" fill="#121317" text-anchor="middle" data-i18n="s15.18"></text>
    <!-- movement -->
    <line x1="742" y1="200" x2="742" y2="200"></line>
    <path d="M590,320 L840,320" stroke="#c52830" stroke-width="3" stroke-dasharray="10 8" fill="none" marker-end="url(#am)"></path>
    <path d="M354,440 L540,440" stroke="#c52830" stroke-width="3" stroke-dasharray="10 8" fill="none" marker-end="url(#am)"></path>
    <path d="M1462,440 L1640,440" stroke="#c52830" stroke-width="3" stroke-dasharray="10 8" fill="none" marker-end="url(#am)"></path>
    <rect x="140" y="30" width="560" height="120" fill="#fffdf8" stroke="#c52830" stroke-width="2"></rect>
    <text x="160" y="66" class="mono" font-size="18" fill="#c52830" letter-spacing="2" data-i18n="s15.19"></text>
    <text x="160" y="100" font-size="22" fill="#121317" data-i18n="s15.20"></text>
    <text x="160" y="130" font-size="22" fill="#121317" font-weight="600" data-i18n="s15.21"></text>
  </svg>
  <p class="lead" style="margin-top:0;font-size:30px;max-width:1680px" data-i18n="s15.22"></p>
  <div class="foot"><span class="wordmark" data-i18n="s15.23"></span><span data-i18n="s15.24"></span></div>
</section>

<!-- 16 · close -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s16.1"></b></span><span data-i18n="s16.2"></span></div>
  <p class="bigquote" style="font-size:66px" data-i18n="s16.3"></p>
  <div class="deckrow">
    <div data-i18n="s16.4"></div>
    <div data-i18n="s16.5"></div>
    <div data-i18n="s16.6"></div>
    <div data-i18n="s16.7"></div>
    <div data-i18n="s16.8"></div>
    <div data-i18n="s16.9"></div>
    <div data-i18n="s16.10"></div>
    <div data-i18n="s16.11"></div>
  </div>
  <div style="margin-top:50px"><span class="tag" data-i18n="s16.12"></span><span class="tag w" data-i18n="s16.13"></span><span class="tag w" data-i18n="s16.14"></span></div>
  <div class="foot"><span class="wordmark" data-i18n="s16.15"></span><span data-i18n="s16.16"></span></div>
</section>

</main><script src="deck.js"></script>
</body></html>
