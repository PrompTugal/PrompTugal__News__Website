<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title data-i18n="s00.1"></title>
<meta name="description" content="{{meta.description}}">
<link rel="stylesheet" href="deck.css">
<style>
/* deck 8 only */
code, .code { font: 400 21px/1.35 var(--mono); color: var(--ink); background: var(--paper-2); padding: 2px 8px; }
.slide.ink code { background: #2a2b31; color: var(--paper); }
.steps5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 22px; margin-top: 40px; }
.steps5 .s { background: var(--panel); border: 1px solid var(--hair); border-top: 8px solid var(--green); padding: 24px 22px 24px; display: flex; flex-direction: column; }
.steps5 .s.c { border-top-color: var(--cobalt); } .steps5 .s.r { border-top-color: var(--red); } .steps5 .s.k { border-top-color: var(--ink); }
.steps5 .s .n { font: 600 58px/1 var(--serif); color: var(--green); }
.steps5 .s.c .n { color: var(--cobalt); } .steps5 .s.r .n { color: var(--red); } .steps5 .s.k .n { color: var(--ink); }
.steps5 .s h3 { font-size: 30px; margin: 8px 0 12px; }
.steps5 .s p { font: 400 21px/1.42 var(--sans); color: var(--ink-2); }
.steps5 .s .do { font: 400 20px/1.35 var(--mono); color: var(--ink); background: var(--paper-2); padding: 10px 12px; margin: 12px 0 0; word-break: break-word; }
.steps5 .s .needs { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--hair); font: 500 19px/1.35 var(--mono); color: var(--green); letter-spacing: .02em; }
.lesson { background: var(--panel); border: 1px solid var(--hair); border-left: 10px solid var(--red); padding: 24px 30px 22px; }
.lesson h3 { font-size: 32px; margin-bottom: 10px; }
.lesson p { font: 400 22px/1.42 var(--sans); color: var(--ink-2); }
.lesson p.fix { margin-top: 10px; color: var(--ink); } .lesson p.fix b { color: var(--green); }
.lesson .src { margin-top: 10px; }
.repo { display: grid; grid-template-columns: 560px 1fr 230px; gap: 24px; align-items: baseline; padding: 15px 0; border-bottom: 1px solid var(--hair); }
.repo .u { font: 500 22px/1.3 var(--mono); color: var(--ink); }
.repo .w { font: 400 22px/1.38 var(--sans); color: var(--ink-2); }
.repo .l { font: 500 19px/1.3 var(--mono); color: var(--green); text-align: right; }
.anat { background: var(--panel); border: 1px solid var(--hair); border-top: 8px solid var(--green); }
.anat .row { display: grid; grid-template-columns: 200px 1fr; gap: 18px; padding: 12px 26px; border-bottom: 1px solid var(--hair); align-items: baseline; }
.anat .row:last-child { border-bottom: 0; }
.anat .k { font: 500 19px/1.3 var(--mono); color: var(--ink-3); letter-spacing: .06em; text-transform: uppercase; }
.anat .v { font: 400 22px/1.35 var(--sans); color: var(--ink-2); } .anat .v b { color: var(--ink); }
</style></head>
<body><main class="deck">

<!-- 1 · cover -->
<section class="slide pic lightpic">
  <img class="bg" src="img/hero-diy.jpg" alt="" style="object-position:100% 50%">
  <div class="veil" style="background:linear-gradient(90deg,rgba(246,243,236,1) 0%,rgba(246,243,236,.96) 38%,rgba(246,243,236,.55) 50%,rgba(246,243,236,0) 60%)"></div>
  <div class="head"><span data-i18n="s01.1"></span><span style="background:rgba(246,243,236,.92);padding:6px 10px;margin-top:-6px" data-i18n="s01.2"></span></div>
  <div class="inner" style="max-width:1040px">
    <div class="kicker" data-i18n="s01.3"></div>
    <h1 style="font-size:104px" data-i18n="s01.4"></h1>
    <p class="lead" style="font-size:32px;max-width:900px" data-i18n="s01.5"></p>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s01.6"></span><span style="background:rgba(246,243,236,.9);padding:6px 10px" data-i18n="s01.7"></span></div>
</section>

<!-- 2 · the invitation -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s02.1"></b></span><span data-i18n="s02.2"></span></div>
  <div class="kicker" data-i18n="s02.3"></div>
  <p class="bigquote" style="font-size:68px" data-i18n="s02.4"></p>
  <div class="cols c3" style="margin-top:70px;gap:40px">
    <div class="card g"><div class="n" data-i18n="s02.5"></div><p data-i18n="s02.6"></p></div>
    <div class="card g"><div class="n" data-i18n="s02.7"></div><p data-i18n="s02.8"></p></div>
    <div class="card g"><div class="n" data-i18n="s02.9"></div><p data-i18n="s02.10"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s02.11"></span><span data-i18n="s02.12"></span></div>
</section>

<!-- 3 · what is open -->
<section class="slide">
  <div class="head"><span><b data-i18n="s03.1"></b></span><span data-i18n="s03.2"></span></div>
  <div class="kicker" data-i18n="s03.3"></div>
  <h2 style="font-size:64px" data-i18n="s03.4"></h2>
  <div style="margin-top:30px;border-top:3px solid #121317">
    <div class="repo"><span class="u" data-i18n="s03.5"></span><span class="w" data-i18n="s03.6"></span><span class="l" data-i18n="s03.7"></span></div>
    <div class="repo"><span class="u" data-i18n="s03.8"></span><span class="w" data-i18n="s03.9"></span><span class="l" data-i18n="s03.10"></span></div>
    <div class="repo"><span class="u" data-i18n="s03.11"></span><span class="w" data-i18n="s03.12"></span><span class="l" data-i18n="s03.13"></span></div>
    <div class="repo"><span class="u" data-i18n="s03.14"></span><span class="w" data-i18n="s03.15"></span><span class="l" data-i18n="s03.16"></span></div>
    <div class="repo" style="border-bottom:0"><span class="u" data-i18n="s03.17"></span><span class="w" data-i18n="s03.18"></span><span class="l" data-i18n="s03.19"></span></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:30px;margin-top:34px">
    <div class="stat"><div class="v" style="font-size:72px" data-i18n="s03.20"></div><div class="l" data-i18n="s03.21"></div></div>
    <div class="stat"><div class="v" style="font-size:72px" data-i18n="s03.22"></div><div class="l" data-i18n="s03.23"></div></div>
    <div class="stat"><div class="v" style="font-size:72px" data-i18n="s03.24"></div><div class="l" data-i18n="s03.25"></div></div>
    <div class="stat r"><div class="v" style="font-size:72px" data-i18n="s03.26"></div><div class="l" data-i18n="s03.27"></div></div>
  </div>
  <div class="src" data-i18n="s03.28"></div>
  <div class="foot"><span class="wordmark" data-i18n="s03.29"></span><span data-i18n="s03.30"></span></div>
</section>

<!-- 4 · the stack -->
<section class="slide">
  <div class="head"><span><b data-i18n="s04.1"></b></span><span data-i18n="s04.2"></span></div>
  <div class="kicker" data-i18n="s04.3"></div>
  <h2 style="font-size:54px;max-width:1680px" data-i18n="s04.4"></h2>
  <svg viewBox="0 0 1680 650" width="1680" height="650" style="margin-top:28px">
    <g font-size="24">
      <!-- 8 human -->
      <rect x="0" y="0" width="1680" height="74" fill="#121317"></rect>
      <text x="26" y="47" class="serif" font-size="30" font-weight="600" fill="#f6f3ec" data-i18n="s04.5"></text>
      <text x="470" y="46" fill="#c8c4ba" data-i18n="s04.6"></text>
      <text x="1654" y="46" text-anchor="end" class="mono" font-size="20" fill="#8fd18f" data-i18n="s04.7"></text>
      <!-- 7 agents -->
      <rect x="0" y="82" width="1680" height="74" fill="#e2eedf"></rect>
      <text x="26" y="129" class="serif" font-size="30" font-weight="600" fill="#006600" data-i18n="s04.8"></text>
      <text x="470" y="128" fill="#3f424a" data-i18n="s04.9"></text>
      <text x="1654" y="128" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.10"></text>
      <!-- 6 keys -->
      <rect x="0" y="164" width="1680" height="74" fill="#e2eedf" opacity=".6"></rect>
      <text x="26" y="211" class="serif" font-size="30" font-weight="600" fill="#006600" data-i18n="s04.11"></text>
      <text x="470" y="210" fill="#3f424a" data-i18n="s04.12"></text>
      <text x="1654" y="210" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.13"></text>
      <!-- 5 vault -->
      <rect x="0" y="246" width="1680" height="74" fill="#fffdf8" stroke="#1f4fa8" stroke-width="3"></rect>
      <text x="26" y="293" class="serif" font-size="30" font-weight="600" fill="#1f4fa8" data-i18n="s04.14"></text>
      <text x="470" y="292" fill="#3f424a" data-i18n="s04.15"></text>
      <text x="1654" y="292" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.16"></text>
      <!-- 4 hosting -->
      <rect x="0" y="328" width="1680" height="74" fill="#ece7db"></rect>
      <text x="26" y="375" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s04.17"></text>
      <text x="470" y="374" fill="#3f424a" data-i18n="s04.18"></text>
      <text x="1654" y="374" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.19"></text>
      <!-- 3 CI -->
      <rect x="0" y="410" width="1680" height="74" fill="#ece7db"></rect>
      <text x="26" y="457" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s04.20"></text>
      <text x="470" y="456" fill="#3f424a" data-i18n="s04.21"></text>
      <text x="1654" y="456" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.22"></text>
      <!-- 2 build -->
      <rect x="0" y="492" width="1680" height="74" fill="#ece7db"></rect>
      <text x="26" y="539" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s04.23"></text>
      <text x="470" y="538" fill="#3f424a" data-i18n="s04.24"></text>
      <text x="1654" y="538" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.25"></text>
      <!-- 1 data -->
      <rect x="0" y="574" width="1680" height="74" fill="#121317" opacity=".08"></rect>
      <rect x="0" y="574" width="10" height="74" fill="#c52830"></rect>
      <text x="26" y="621" class="serif" font-size="30" font-weight="600" fill="#121317" data-i18n="s04.26"></text>
      <text x="470" y="620" fill="#3f424a" data-i18n="s04.27"></text>
      <text x="1654" y="620" text-anchor="end" class="mono" font-size="20" fill="#121317" data-i18n="s04.28"></text>
    </g>
  </svg>
  <div class="src" data-i18n="s04.29"></div>
  <div class="foot"><span class="wordmark" data-i18n="s04.30"></span><span data-i18n="s04.31"></span></div>
</section>

<!-- 5 · the machine -->
<section class="slide">
  <div class="head"><span><b data-i18n="s05.1"></b></span><span data-i18n="s05.2"></span></div>
  <div class="kicker" data-i18n="s05.3"></div>
  <h2 style="font-size:64px" data-i18n="s05.4"></h2>
  <div class="flow" style="margin-top:34px">
    <div class="step"><div class="n" data-i18n="s05.5"></div><h3 data-i18n="s05.6"></h3><p data-i18n="s05.7"></p></div>
    <div class="step"><div class="n" data-i18n="s05.8"></div><h3 data-i18n="s05.9"></h3><p data-i18n="s05.10"></p></div>
    <div class="step"><div class="n" data-i18n="s05.11"></div><h3 data-i18n="s05.12"></h3><p data-i18n="s05.13"></p></div>
    <div class="step"><div class="n" data-i18n="s05.14"></div><h3 data-i18n="s05.15"></h3><p data-i18n="s05.16"></p></div>
    <div class="step" style="border:3px solid #006600"><div class="n" data-i18n="s05.17"></div><h3 data-i18n="s05.18"></h3><p data-i18n="s05.19"></p></div>
  </div>
  <div style="margin-top:30px;display:flex;align-items:center;gap:14px 20px;flex-wrap:wrap">
    <span style="font:500 20px/1 var(--mono);letter-spacing:.12em;color:#595c64;margin-right:6px" data-i18n="s05.20"></span>
    <span class="tag" data-i18n="s05.21"></span><span class="tag" data-i18n="s05.22"></span><span class="tag" data-i18n="s05.23"></span><span class="tag k" data-i18n="s05.24"></span>
  </div>
  <div class="cols" style="margin-top:20px;gap:40px">
    <div class="card g" style="padding:26px 30px"><div class="n" data-i18n="s05.25"></div><p data-i18n="s05.26"></p></div>
    <div class="card r" style="padding:26px 30px"><div class="n" data-i18n="s05.27"></div><p data-i18n="s05.28"></p></div>
  </div>
  <div class="src" data-i18n="s05.29"></div>
  <div class="foot"><span class="wordmark" data-i18n="s05.30"></span><span data-i18n="s05.31"></span></div>
</section>

<!-- 6 · an agent, taken apart -->
<section class="slide">
  <div class="head"><span><b data-i18n="s06.1"></b></span><span data-i18n="s06.2"></span></div>
  <div class="kicker" data-i18n="s06.3"></div>
  <h2 style="font-size:58px;max-width:1680px" data-i18n="s06.4"></h2>
  <div class="cols" style="grid-template-columns:1.05fr 1fr;gap:56px;margin-top:36px">
    <div class="anat">
      <div class="row"><span class="k" data-i18n="s06.5"></span><span class="v" data-i18n="s06.6"></span></div>
      <div class="row"><span class="k" data-i18n="s06.7"></span><span class="v" data-i18n="s06.8"></span></div>
      <div class="row"><span class="k" data-i18n="s06.9"></span><span class="v" data-i18n="s06.10"></span></div>
      <div class="row"><span class="k" data-i18n="s06.11"></span><span class="v" data-i18n="s06.12"></span></div>
      <div class="row"><span class="k" data-i18n="s06.13"></span><span class="v" data-i18n="s06.14"></span></div>
      <div class="row"><span class="k" data-i18n="s06.15"></span><span class="v" data-i18n="s06.16"></span></div>
      <div class="row"><span class="k" data-i18n="s06.17"></span><span class="v" data-i18n="s06.18"></span></div>
      <div class="row"><span class="k" data-i18n="s06.19"></span><span class="v" data-i18n="s06.20"></span></div>
    </div>
    <div>
      <h3 style="font-size:34px;margin-bottom:18px" data-i18n="s06.21"></h3>
      <ol class="co" style="list-style:none;counter-reset:co">
        <li style="font:400 23px/1.42 var(--sans);color:#3f424a;margin-bottom:20px" data-i18n="s06.22"></li>
        <li style="font:400 23px/1.42 var(--sans);color:#3f424a;margin-bottom:20px" data-i18n="s06.23"></li>
        <li style="font:400 23px/1.42 var(--sans);color:#3f424a;margin-bottom:20px" data-i18n="s06.24"></li>
      </ol>
      <div style="border-left:8px solid #1f4fa8;padding:6px 0 6px 24px;margin-top:8px">
        <p style="font:400 22px/1.42 var(--sans);color:#3f424a" data-i18n="s06.25"></p>
      </div>
    </div>
  </div>
  <div class="src" data-i18n="s06.26"></div>
  <div class="foot"><span class="wordmark" data-i18n="s06.27"></span><span data-i18n="s06.28"></span></div>
</section>

<!-- 7 · the roadmap, as a flow -->
<section class="slide">
  <div class="head"><span><b data-i18n="s07.1"></b></span><span data-i18n="s07.2"></span></div>
  <div class="kicker" data-i18n="s07.3"></div>
  <h2 style="font-size:64px" data-i18n="s07.4"></h2>
  <svg viewBox="0 0 1680 620" width="1680" height="620" style="margin-top:30px">
    <defs><marker id="ar" markerUnits="userSpaceOnUse" viewBox="0 0 14 14" markerWidth="22" markerHeight="22" refX="10" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#121317"></path></marker></defs>
    <!-- phase bands -->
    <rect x="0" y="0" width="1000" height="44" fill="#e2eedf"></rect><text x="20" y="31" class="mono" font-size="20" fill="#006600" letter-spacing="2" data-i18n="s07.5"></text>
    <rect x="1010" y="0" width="670" height="44" fill="#e3e9f5"></rect><text x="1030" y="31" class="mono" font-size="20" fill="#1f4fa8" letter-spacing="2" data-i18n="s07.6"></text>
    <rect x="0" y="326" width="1000" height="44" fill="#f8e4df"></rect><text x="20" y="357" class="mono" font-size="20" fill="#c52830" letter-spacing="2" data-i18n="s07.7"></text>
    <rect x="1010" y="326" width="670" height="44" fill="#121317"></rect><text x="1030" y="357" class="mono" font-size="20" fill="#f6f3ec" letter-spacing="2" data-i18n="s07.8"></text>
    <!-- row 1 path -->
    <line x1="130" y1="140" x2="1550" y2="140" stroke="#121317" stroke-width="4"></line>
    <path d="M1550,140 C1680,140 1680,466 1550,466" fill="none" stroke="#121317" stroke-width="4"></path>
    <line x1="1550" y1="466" x2="140" y2="466" stroke="#121317" stroke-width="4"></line>
    <g text-anchor="middle">
      <circle cx="130" cy="140" r="40" fill="#006600"></circle><text x="130" y="154" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.9"></text>
      <text x="130" y="220" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.10"></text><text x="130" y="252" class="mono" font-size="19" fill="#595c64" data-i18n="s07.11"></text>
      <circle cx="460" cy="140" r="40" fill="#006600"></circle><text x="460" y="154" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.12"></text>
      <text x="460" y="220" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.13"></text><text x="460" y="252" class="mono" font-size="19" fill="#595c64" data-i18n="s07.14"></text>
      <circle cx="790" cy="140" r="40" fill="#006600"></circle><text x="790" y="154" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.15"></text>
      <text x="790" y="220" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.16"></text><text x="790" y="252" class="mono" font-size="19" fill="#595c64" data-i18n="s07.17"></text>
      <circle cx="1120" cy="140" r="40" fill="#1f4fa8"></circle><text x="1120" y="154" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.18"></text>
      <text x="1120" y="220" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.19"></text><text x="1120" y="252" class="mono" font-size="19" fill="#595c64" data-i18n="s07.20"></text>
      <circle cx="1450" cy="140" r="40" fill="#1f4fa8"></circle><text x="1450" y="154" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.21"></text>
      <text x="1450" y="220" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.22"></text><text x="1450" y="252" class="mono" font-size="19" fill="#595c64" data-i18n="s07.23"></text>
      <circle cx="1450" cy="466" r="40" fill="#1f4fa8"></circle><text x="1450" y="480" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.24"></text>
      <text x="1450" y="546" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.25"></text><text x="1450" y="578" class="mono" font-size="19" fill="#595c64" data-i18n="s07.26"></text>
      <circle cx="1120" cy="466" r="40" fill="#c52830"></circle><text x="1120" y="480" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.27"></text>
      <text x="1120" y="546" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.28"></text><text x="1120" y="578" class="mono" font-size="19" fill="#595c64" data-i18n="s07.29"></text>
      <circle cx="790" cy="466" r="40" fill="#c52830"></circle><text x="790" y="480" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.30"></text>
      <text x="790" y="546" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.31"></text><text x="790" y="578" class="mono" font-size="19" fill="#595c64" data-i18n="s07.32"></text>
      <circle cx="460" cy="466" r="40" fill="#c52830"></circle><text x="460" y="480" class="serif" font-size="40" font-weight="600" fill="#fff" data-i18n="s07.33"></text>
      <text x="460" y="546" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.34"></text><text x="460" y="578" class="mono" font-size="19" fill="#595c64" data-i18n="s07.35"></text>
      <circle cx="130" cy="466" r="48" fill="#121317"></circle><text x="130" y="482" class="serif" font-size="42" font-weight="600" fill="#f6f3ec" data-i18n="s07.36"></text>
      <text x="130" y="554" font-size="26" font-weight="600" fill="#121317" data-i18n="s07.37"></text><text x="130" y="586" class="mono" font-size="19" fill="#595c64" data-i18n="s07.38"></text>
    </g>
  </svg>
  <div class="foot"><span class="wordmark" data-i18n="s07.39"></span><span data-i18n="s07.40"></span></div>
</section>

<!-- 8 · steps 1 to 5 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s08.1"></b></span><span data-i18n="s08.2"></span></div>
  <div class="kicker" data-i18n="s08.3"></div>
  <h2 style="font-size:58px" data-i18n="s08.4"></h2>
  <div class="steps5">
    <div class="s"><div class="n" data-i18n="s08.5"></div><h3 data-i18n="s08.6"></h3><p data-i18n="s08.7"></p><div class="do" data-i18n="s08.8"></div><div class="needs" data-i18n="s08.9"></div></div>
    <div class="s"><div class="n" data-i18n="s08.10"></div><h3 data-i18n="s08.11"></h3><p data-i18n="s08.12"></p><div class="do" data-i18n="s08.13"></div><div class="needs" data-i18n="s08.14"></div></div>
    <div class="s"><div class="n" data-i18n="s08.15"></div><h3 data-i18n="s08.16"></h3><p data-i18n="s08.17"></p><div class="do" data-i18n="s08.18"></div><div class="needs" data-i18n="s08.19"></div></div>
    <div class="s c"><div class="n" data-i18n="s08.20"></div><h3 data-i18n="s08.21"></h3><p data-i18n="s08.22"></p><div class="do" data-i18n="s08.23"></div><div class="needs" data-i18n="s08.24"></div></div>
    <div class="s c"><div class="n" data-i18n="s08.25"></div><h3 data-i18n="s08.26"></h3><p data-i18n="s08.27"></p><div class="do" data-i18n="s08.28"></div><div class="needs" data-i18n="s08.29"></div></div>
  </div>
  <div class="src" data-i18n="s08.30"></div>
  <div class="foot"><span class="wordmark" data-i18n="s08.31"></span><span data-i18n="s08.32"></span></div>
</section>

<!-- 9 · steps 6 to 10 -->
<section class="slide">
  <div class="head"><span><b data-i18n="s09.1"></b></span><span data-i18n="s09.2"></span></div>
  <div class="kicker" data-i18n="s09.3"></div>
  <h2 style="font-size:58px" data-i18n="s09.4"></h2>
  <div class="steps5">
    <div class="s c"><div class="n" data-i18n="s09.5"></div><h3 data-i18n="s09.6"></h3><p data-i18n="s09.7"></p><div class="do" data-i18n="s09.8"></div><div class="needs" data-i18n="s09.9"></div></div>
    <div class="s r"><div class="n" data-i18n="s09.10"></div><h3 data-i18n="s09.11"></h3><p data-i18n="s09.12"></p><div class="do" data-i18n="s09.13"></div><div class="needs" data-i18n="s09.14"></div></div>
    <div class="s r"><div class="n" data-i18n="s09.15"></div><h3 data-i18n="s09.16"></h3><p data-i18n="s09.17"></p><div class="do" data-i18n="s09.18"></div><div class="needs" data-i18n="s09.19"></div></div>
    <div class="s r"><div class="n" data-i18n="s09.20"></div><h3 data-i18n="s09.21"></h3><p data-i18n="s09.22"></p><div class="do" data-i18n="s09.23"></div><div class="needs" data-i18n="s09.24"></div></div>
    <div class="s k"><div class="n" data-i18n="s09.25"></div><h3 data-i18n="s09.26"></h3><p data-i18n="s09.27"></p><div class="do" data-i18n="s09.28"></div><div class="needs" data-i18n="s09.29"></div></div>
  </div>
  <div class="src" data-i18n="s09.30"></div>
  <div class="foot"><span class="wordmark" data-i18n="s09.31"></span><span data-i18n="s09.32"></span></div>
</section>

<!-- 10 · one wake -->
<section class="slide">
  <div class="head"><span><b data-i18n="s10.1"></b></span><span data-i18n="s10.2"></span></div>
  <div class="kicker" data-i18n="s10.3"></div>
  <h2 style="font-size:62px" data-i18n="s10.4"></h2>
  <div class="cols" style="grid-template-columns:780px 1fr;gap:40px;margin-top:26px;align-items:center">
    <svg viewBox="0 0 780 640" width="780" height="640">
      <defs><marker id="cw" markerUnits="userSpaceOnUse" viewBox="0 0 14 14" markerWidth="20" markerHeight="20" refX="7" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#006600"></path></marker></defs>
      <circle cx="360" cy="320" r="232" fill="none" stroke="#d9d2c1" stroke-width="4"></circle>
      <path d="M360,88 A232,232 0 1 1 196,156" fill="none" stroke="#006600" stroke-width="5" stroke-dasharray="12 10" marker-end="url(#cw)"></path>
      <circle cx="360" cy="320" r="108" fill="#121317"></circle>
      <text x="360" y="306" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#f6f3ec" data-i18n="s10.5"></text>
      <text x="360" y="352" text-anchor="middle" class="serif" font-size="40" font-weight="600" fill="#8fd18f" data-i18n="s10.6"></text>
      <g font-size="22" font-weight="600" fill="#121317">
        <circle cx="360" cy="88" r="26" fill="#006600"></circle><text x="360" y="96" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.7"></text><text x="400" y="46" data-i18n="s10.8"></text>
        <circle cx="524" cy="156" r="26" fill="#c52830"></circle><text x="524" y="164" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.9"></text><text x="560" y="140" data-i18n="s10.10"></text><text x="560" y="166" font-weight="400" font-size="19" class="mono" fill="#c52830" data-i18n="s10.11"></text>
        <circle cx="592" cy="320" r="26" fill="#006600"></circle><text x="592" y="328" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.12"></text><text x="632" y="300" data-i18n="s10.13"></text><text x="632" y="326" data-i18n="s10.14"></text>
        <circle cx="524" cy="484" r="26" fill="#006600"></circle><text x="524" y="492" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.15"></text><text x="562" y="532" data-i18n="s10.16"></text>
        <circle cx="360" cy="552" r="26" fill="#006600"></circle><text x="360" y="560" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.17"></text><text x="360" y="614" text-anchor="middle" data-i18n="s10.18"></text>
        <circle cx="196" cy="484" r="26" fill="#006600"></circle><text x="196" y="492" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.19"></text><text x="40" y="540" data-i18n="s10.20"></text>
        <circle cx="128" cy="320" r="26" fill="#006600"></circle><text x="128" y="328" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.21"></text><text x="0" y="276" data-i18n="s10.22"></text>
        <circle cx="196" cy="156" r="26" fill="#006600"></circle><text x="196" y="164" text-anchor="middle" fill="#fff" class="serif" font-size="26" data-i18n="s10.23"></text><text x="10" y="92" data-i18n="s10.24"></text><text x="10" y="118" data-i18n="s10.25"></text>
      </g>
    </svg>
    <div>
      <div class="card g" style="padding:24px 30px;margin-bottom:22px"><div class="n" data-i18n="s10.26"></div><p data-i18n="s10.27"></p></div>
      <div class="card c" style="padding:24px 30px;margin-bottom:22px"><div class="n" data-i18n="s10.28"></div><p data-i18n="s10.29"></p></div>
      <div class="card r" style="padding:24px 30px"><div class="n" data-i18n="s10.30"></div><p data-i18n="s10.31"></p></div>
    </div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s10.32"></span><span data-i18n="s10.33"></span></div>
</section>

<!-- 11 · what you will hit -->
<section class="slide">
  <div class="head"><span><b data-i18n="s11.1"></b></span><span data-i18n="s11.2"></span></div>
  <div class="kicker" data-i18n="s11.3"></div>
  <h2 style="font-size:58px" data-i18n="s11.4"></h2>
  <div class="cols" style="gap:28px;margin-top:30px">
    <div class="lesson"><h3 data-i18n="s11.5"></h3><p data-i18n="s11.6"></p><p class="fix" data-i18n="s11.7"></p><div class="src" data-i18n="s11.8"></div></div>
    <div class="lesson"><h3 data-i18n="s11.9"></h3><p data-i18n="s11.10"></p><p class="fix" data-i18n="s11.11"></p><div class="src" data-i18n="s11.12"></div></div>
    <div class="lesson"><h3 data-i18n="s11.13"></h3><p data-i18n="s11.14"></p><p class="fix" data-i18n="s11.15"></p><div class="src" data-i18n="s11.16"></div></div>
    <div class="lesson"><h3 data-i18n="s11.17"></h3><p data-i18n="s11.18"></p><p class="fix" data-i18n="s11.19"></p><div class="src" data-i18n="s11.20"></div></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s11.21"></span><span data-i18n="s11.22"></span></div>
</section>

<!-- 12 · the map -->
<section class="slide">
  <div class="head"><span><b data-i18n="s12.1"></b></span><span data-i18n="s12.2"></span></div>
  <div class="kicker" data-i18n="s12.3"></div>
  <h2 style="font-size:60px;max-width:1680px" data-i18n="s12.4"></h2>
  <svg viewBox="0 0 1680 604" width="1680" height="604" style="margin-top:30px">
    <defs>
      <marker id="mg" markerUnits="userSpaceOnUse" viewBox="0 0 14 14" markerWidth="24" markerHeight="24" refX="10" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#006600"></path></marker>
      <marker id="mk" markerUnits="userSpaceOnUse" viewBox="0 0 14 14" markerWidth="24" markerHeight="24" refX="10" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#121317"></path></marker>
      <marker id="mr" markerUnits="userSpaceOnUse" viewBox="0 0 14 14" markerWidth="24" markerHeight="24" refX="10" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#c52830"></path></marker>
    </defs>
    <rect x="60" y="0" width="400" height="560" fill="#e2eedf" opacity=".6"></rect>
    <text x="80" y="34" class="mono" font-size="19" fill="#006600" letter-spacing="2" data-i18n="s12.5"></text>
    <line x1="460" y1="0" x2="460" y2="560" stroke="#d9d2c1" stroke-width="2" stroke-dasharray="6 6"></line><line x1="860" y1="0" x2="860" y2="560" stroke="#d9d2c1" stroke-width="2" stroke-dasharray="6 6"></line><line x1="1260" y1="0" x2="1260" y2="560" stroke="#d9d2c1" stroke-width="2" stroke-dasharray="6 6"></line>
    <line x1="60" y1="560" x2="1670" y2="560" stroke="#121317" stroke-width="3" marker-end="url(#mk)"></line>
    <line x1="30" y1="560" x2="30" y2="6" stroke="#121317" stroke-width="3" marker-end="url(#mk)"></line>
    <text transform="translate(20,290) rotate(-90)" text-anchor="middle" class="mono" font-size="18" fill="#595c64" letter-spacing="1" data-i18n="s12.6"></text>
    <text x="260" y="594" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="1" data-i18n="s12.7"></text><text x="660" y="594" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="1" data-i18n="s12.8"></text><text x="1060" y="594" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="1" data-i18n="s12.9"></text><text x="1460" y="594" text-anchor="middle" class="mono" font-size="20" fill="#595c64" letter-spacing="1" data-i18n="s12.10"></text>
    <!-- links -->
    <g stroke="#9d9580" stroke-width="2">
      <line x1="980" y1="40" x2="900" y2="110"></line>
      <line x1="900" y1="110" x2="260" y2="200"></line><line x1="900" y1="110" x2="620" y2="300"></line><line x1="900" y1="110" x2="1460" y2="250"></line>
      <line x1="260" y1="200" x2="620" y2="300"></line><line x1="260" y1="200" x2="900" y2="400"></line>
      <line x1="620" y1="300" x2="900" y2="400"></line>
      <line x1="900" y1="400" x2="1460" y2="400"></line><line x1="900" y1="400" x2="1120" y2="490"></line>
      <line x1="1460" y1="250" x2="1560" y2="500"></line><line x1="1460" y1="250" x2="1120" y2="490"></line>
    </g>
    <circle cx="980" cy="40" r="17" fill="#121317"></circle><text x="1008" y="48" font-size="24" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.11"></text>
    <circle cx="900" cy="110" r="15" fill="#006600"></circle><text x="926" y="118" font-size="24" font-weight="600" fill="#006600" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.12"></text>
    <!-- execution -->
    <circle cx="260" cy="200" r="24" fill="#006600"></circle><text x="260" y="248" text-anchor="middle" font-size="24" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.13"></text><text x="260" y="276" text-anchor="middle" font-size="19" class="mono" fill="#006600" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.14"></text><text x="260" y="300" text-anchor="middle" font-size="19" class="mono" fill="#006600" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.15"></text>
    <!-- editorial -->
    <circle cx="620" cy="300" r="15" fill="#fffdf8" stroke="#121317" stroke-width="5"></circle><text x="620" y="342" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.16"></text>
    <!-- agents coordinated -->
    <line x1="919" y1="400" x2="1060" y2="400" stroke="#121317" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#mk)"></line>
    <circle cx="900" cy="400" r="15" fill="#fffdf8" stroke="#121317" stroke-width="5"></circle><text x="900" y="442" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.17"></text><text x="900" y="468" text-anchor="middle" font-size="19" class="mono" fill="#595c64" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.18"></text>
    <!-- the code: moved by open source -->
    <circle cx="700" cy="200" r="13" fill="none" stroke="#c52830" stroke-width="3" stroke-dasharray="5 4"></circle>
    <path d="M716,206 C900,230 1200,240 1436,250" fill="none" stroke="#c52830" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#mr)"></path>
    <text x="1010" y="214" text-anchor="middle" font-size="20" class="mono" fill="#c52830" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.19"></text>
    <circle cx="1460" cy="250" r="17" fill="#fffdf8" stroke="#c52830" stroke-width="5"></circle><text x="1460" y="296" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.20"></text><text x="1460" y="322" text-anchor="middle" font-size="19" class="mono" fill="#595c64" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.21"></text>
    <!-- models -->
    <circle cx="1460" cy="400" r="15" fill="#fffdf8" stroke="#595c64" stroke-width="5"></circle><text x="1460" y="442" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.22"></text>
    <circle cx="1120" cy="490" r="15" fill="#fffdf8" stroke="#595c64" stroke-width="5"></circle><text x="1120" y="532" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.23"></text>
    <circle cx="1560" cy="500" r="15" fill="#fffdf8" stroke="#595c64" stroke-width="5"></circle><text x="1560" y="542" text-anchor="middle" font-size="22" font-weight="600" fill="#121317" paint-order="stroke" stroke="#f6f3ec" stroke-width="7" stroke-linejoin="round" data-i18n="s12.24"></text>
  </svg>
  <div style="display:flex;gap:30px;align-items:center;margin-top:14px;font:400 21px/1 var(--sans);color:#3f424a;white-space:nowrap">
    <span><svg width="22" height="22"><circle cx="11" cy="11" r="9" fill="#006600"></circle></svg> <span data-i18n="s12.28"></span></span>
    <span><svg width="48" height="14"><line x1="0" y1="7" x2="48" y2="7" stroke="#c52830" stroke-width="4" stroke-dasharray="9 6"></line></svg> <span data-i18n="s12.29"></span></span>
    <span class="src" style="margin:0 0 0 auto" data-i18n="s12.25"></span>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s12.26"></span><span data-i18n="s12.27"></span></div>
</section>

<!-- 13 · the moat is decisions -->
<section class="slide">
  <div class="head"><span><b data-i18n="x13.1"></b></span><span data-i18n="x13.2"></span></div>
  <div class="kicker" data-i18n="x13.3"></div>
  <h2 style="font-size:64px;max-width:1680px" data-i18n="x13.4"></h2>
  <p class="lead" style="font-size:29px;margin-top:14px;max-width:1680px" data-i18n="x13.5"></p>
  <div class="cols c4 tight" style="margin-top:28px;gap:26px;align-items:stretch">
    <div class="card g"><div class="n" data-i18n="x13.6"></div><h3 data-i18n="x13.7"></h3><p data-i18n="x13.8"></p></div>
    <div class="card g"><div class="n" data-i18n="x13.9"></div><h3 data-i18n="x13.10"></h3><p data-i18n="x13.11"></p></div>
    <div class="card c"><div class="n" data-i18n="x13.12"></div><h3 data-i18n="x13.13"></h3><p data-i18n="x13.14"></p></div>
    <div class="card r"><div class="n" data-i18n="x13.15"></div><h3 data-i18n="x13.16"></h3><p data-i18n="x13.17"></p></div>
  </div>
  <div style="display:flex;align-items:baseline;gap:24px;margin-top:30px"><span class="kicker" style="margin:0;font-size:20px;white-space:nowrap" data-i18n="x13.18"></span><span style="font:400 italic 26px/1.3 var(--serif);color:var(--ink-2)" data-i18n="x13.19"></span></div>
  <svg viewBox="0 0 1680 150" width="1680" height="150" style="margin-top:14px">
    <line x1="20" y1="30" x2="1660" y2="30" stroke="#121317" stroke-width="4"></line>
    <g font-size="22" font-weight="600" fill="#121317">
      <circle cx="40" cy="30" r="14" fill="#f6f3ec" stroke="#006600" stroke-width="6"></circle><text x="20" y="82" class="mono" font-size="20" font-weight="500" fill="#006600" data-i18n="x13.20"></text><text x="20" y="110" data-i18n="x13.21"></text><text x="20" y="136" font-weight="400" font-size="20" fill="#3f424a" data-i18n="x13.22"></text>
      <circle cx="380" cy="30" r="14" fill="#f6f3ec" stroke="#006600" stroke-width="6"></circle><text x="360" y="82" class="mono" font-size="20" font-weight="500" fill="#006600" data-i18n="x13.23"></text><text x="360" y="110" data-i18n="x13.24"></text><text x="360" y="136" font-weight="400" font-size="20" fill="#3f424a" data-i18n="x13.25"></text>
      <circle cx="720" cy="30" r="14" fill="#f6f3ec" stroke="#006600" stroke-width="6"></circle><text x="700" y="82" class="mono" font-size="20" font-weight="500" fill="#006600" data-i18n="x13.26"></text><text x="700" y="110" data-i18n="x13.27"></text><text x="700" y="136" font-weight="400" font-size="20" fill="#3f424a" data-i18n="x13.28"></text>
      <circle cx="1060" cy="30" r="14" fill="#f6f3ec" stroke="#1f4fa8" stroke-width="6"></circle><text x="1040" y="82" class="mono" font-size="20" font-weight="500" fill="#1f4fa8" data-i18n="x13.29"></text><text x="1040" y="110" data-i18n="x13.30"></text><text x="1040" y="136" font-weight="400" font-size="20" fill="#3f424a" data-i18n="x13.31"></text>
      <circle cx="1400" cy="30" r="16" fill="#c52830"></circle><text x="1380" y="82" class="mono" font-size="20" font-weight="500" fill="#c52830" data-i18n="x13.32"></text><text x="1380" y="110" data-i18n="x13.33"></text><text x="1380" y="136" font-weight="400" font-size="20" fill="#3f424a" data-i18n="x13.34"></text>
    </g>
  </svg>
  <div class="src" style="margin-top:8px" data-i18n="x13.35"></div>
  <div class="foot"><span class="wordmark" data-i18n="x13.36"></span><span data-i18n="x13.37"></span></div>
</section>

<!-- 14 · if you copy us, you help us -->
<section class="slide">
  <div class="head"><span><b data-i18n="x14.1"></b></span><span data-i18n="x14.2"></span></div>
  <div class="kicker" data-i18n="x14.3"></div>
  <h2 style="font-size:64px" data-i18n="x14.4"></h2>
  <p class="lead" style="font-size:29px;margin-top:14px;max-width:1680px" data-i18n="x14.5"></p>
  <div style="display:grid;grid-template-columns:330px 70px 1fr;align-items:stretch;margin-top:30px">
    <div style="background:#121317;color:#f6f3ec;padding:28px 28px;display:flex;flex-direction:column;justify-content:center"><div style="font:500 19px/1.2 var(--mono);letter-spacing:.1em;color:#8fd18f;margin-bottom:12px" data-i18n="x14.6"></div><div style="font:600 32px/1.18 var(--serif)" data-i18n="x14.7"></div></div>
    <svg viewBox="0 0 70 200" width="70" height="100%" preserveAspectRatio="none" style="align-self:center;height:60px"><path d="M8,100 L52,100" stroke="#006600" stroke-width="8"></path><path d="M44,70 L66,100 L44,130 z" fill="#006600"></path></svg>
    <div class="cols c3 tight" style="margin-top:0;gap:22px;align-items:stretch">
      <div class="card g"><div class="n" data-i18n="x14.8"></div><h3 data-i18n="x14.9"></h3><p data-i18n="x14.10"></p></div>
      <div class="card g"><div class="n" data-i18n="x14.11"></div><h3 data-i18n="x14.12"></h3><p data-i18n="x14.13"></p></div>
      <div class="card c"><div class="n" data-i18n="x14.14"></div><h3 data-i18n="x14.15"></h3><p data-i18n="x14.16"></p></div>
    </div>
  </div>
  <div class="vs" style="margin-top:30px;grid-template-columns:1fr 80px 1fr">
    <div class="side new" style="padding:26px 34px"><div class="tag" data-i18n="x14.17"></div><h3 style="font-size:34px;margin:6px 0 8px" data-i18n="x14.18"></h3><p style="font:400 23px/1.4 var(--sans);color:var(--ink-2)" data-i18n="x14.19"></p></div>
    <div class="mid" style="font-size:40px" data-i18n="x14.20"></div>
    <div class="side old" style="padding:26px 34px"><div class="tag r" data-i18n="x14.21"></div><h3 style="font-size:34px;margin:6px 0 8px" data-i18n="x14.22"></h3><p style="font:400 23px/1.4 var(--sans);color:var(--ink-2)" data-i18n="x14.23"></p></div>
  </div>
  <div style="display:flex;align-items:baseline;justify-content:space-between;gap:40px;margin-top:30px">
    <span style="font:600 44px/1.1 var(--serif);color:#006600;white-space:nowrap" data-i18n="x14.24"></span>
    <span style="font:400 italic 27px/1.3 var(--serif);color:var(--ink-2);text-align:right" data-i18n="x14.25"></span>
  </div>
  <div class="src" style="margin-top:10px" data-i18n="x14.26"></div>
  <div class="foot"><span class="wordmark" data-i18n="x14.27"></span><span data-i18n="x14.28"></span></div>
</section>

<!-- 15 · an investor who builds it themselves -->
<section class="slide">
  <div class="head"><span><b data-i18n="x15.1"></b></span><span data-i18n="x15.2"></span></div>
  <div class="kicker" data-i18n="x15.3"></div>
  <h2 style="font-size:60px;max-width:1680px" data-i18n="x15.4"></h2>
  <div style="display:grid;grid-template-columns:880px 1fr;gap:40px;margin-top:24px;align-items:center">
    <svg viewBox="0 0 880 520" width="880" height="520">
      <g opacity=".2">
        <circle cx="410" cy="172" r="130" fill="#006600"></circle>
        <circle cx="496" cy="234" r="130" fill="#1f4fa8"></circle>
        <circle cx="463" cy="335" r="130" fill="#c52830"></circle>
        <circle cx="357" cy="335" r="130" fill="#121317"></circle>
        <circle cx="324" cy="234" r="130" fill="#9d9580"></circle>
      </g>
      <g fill="none" stroke-width="3">
        <circle cx="410" cy="172" r="130" stroke="#006600"></circle>
        <circle cx="496" cy="234" r="130" stroke="#1f4fa8"></circle>
        <circle cx="463" cy="335" r="130" stroke="#c52830"></circle>
        <circle cx="357" cy="335" r="130" stroke="#121317"></circle>
        <circle cx="324" cy="234" r="130" stroke="#9d9580"></circle>
      </g>
      <g font-size="24" font-weight="600" fill="#121317">
        <text x="410" y="28" text-anchor="middle" fill="#006600" data-i18n="x15.5"></text>
        <text x="640" y="222" fill="#1f4fa8" data-i18n="x15.6"></text><text x="640" y="252" fill="#1f4fa8" data-i18n="x15.7"></text>
        <text x="590" y="456" fill="#c52830" data-i18n="x15.8"></text>
        <text x="236" y="456" text-anchor="end" data-i18n="x15.9"></text>
        <text x="180" y="222" text-anchor="end" fill="#595c64" data-i18n="x15.10"></text><text x="180" y="252" text-anchor="end" fill="#595c64" data-i18n="x15.11"></text>
      </g>
      <circle cx="410" cy="262" r="46" fill="#121317"></circle>
      <text x="410" y="270" text-anchor="middle" class="serif" font-size="25" font-weight="600" fill="#f6f3ec" data-i18n="x15.12"></text>
    </svg>
    <div>
      <div class="kicker" style="margin-bottom:14px;font-size:20px" data-i18n="x15.13"></div>
      <ul class="ticks" style="margin-top:0">
        <li style="font-size:26px;margin-bottom:10px" data-i18n="x15.14"></li>
        <li style="font-size:26px;margin-bottom:10px" data-i18n="x15.15"></li>
        <li style="font-size:26px;margin-bottom:10px" data-i18n="x15.16"></li>
        <li style="font-size:26px;margin-bottom:10px" data-i18n="x15.17"></li>
      </ul>
      <p style="font:400 italic 30px/1.35 var(--serif);color:var(--ink);border-left:8px solid #c52830;padding-left:24px;margin-top:20px" data-i18n="x15.18"></p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px">
        <div style="border:3px solid #006600;background:var(--panel);padding:16px 22px"><div style="font:500 19px/1.2 var(--mono);letter-spacing:.1em;color:#006600" data-i18n="x15.19"></div><div style="font:600 30px/1.2 var(--serif);margin-top:6px" data-i18n="x15.20"></div></div>
        <div style="border:3px solid #9d9580;background:var(--paper-2);padding:16px 22px"><div style="font:500 19px/1.2 var(--mono);letter-spacing:.1em;color:#595c64" data-i18n="x15.21"></div><div style="font:600 30px/1.2 var(--serif);margin-top:6px" data-i18n="x15.22"></div></div>
      </div>
    </div>
  </div>
  <p style="font:400 26px/1.35 var(--sans);color:var(--ink-2);margin-top:18px;border-top:2px solid #121317;padding-top:14px" data-i18n="x15.23"></p>
  <div class="src" style="margin-top:8px" data-i18n="x15.24"></div>
  <div class="foot"><span class="wordmark" data-i18n="x15.25"></span><span data-i18n="x15.26"></span></div>
</section>

<!-- 16 · will you? -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s13.1"></b></span><span data-i18n="s13.2"></span></div>
  <div class="kicker" data-i18n="s13.3"></div>
  <h2 style="font-size:72px" data-i18n="s13.4"></h2>
  <p class="lead" style="margin-top:20px" data-i18n="s13.5"></p>
  <div class="cols c4" style="margin-top:56px;gap:28px">
    <div class="card g" style="padding:30px 28px"><div class="n" data-i18n="s13.6"></div><h3 style="color:#f6f3ec" data-i18n="s13.7"></h3><p data-i18n="s13.8"></p></div>
    <div class="card g" style="padding:30px 28px"><div class="n" data-i18n="s13.9"></div><h3 style="color:#f6f3ec" data-i18n="s13.10"></h3><p data-i18n="s13.11"></p></div>
    <div class="card g" style="padding:30px 28px"><div class="n" data-i18n="s13.12"></div><h3 style="color:#f6f3ec" data-i18n="s13.13"></h3><p data-i18n="s13.14"></p></div>
    <div class="card g" style="padding:30px 28px;border-top-color:#ff7a7f"><div class="n" data-i18n="s13.15"></div><h3 style="color:#f6f3ec" data-i18n="s13.16"></h3><p data-i18n="s13.17"></p></div>
  </div>
  <div class="src" style="color:#9a978f;margin-top:30px" data-i18n="s13.18"></div>
  <div class="foot"><span class="wordmark" data-i18n="s13.19"></span><span data-i18n="s13.20"></span></div>
</section>

<!-- 17 · or do it with us -->
<section class="slide v">
  <div class="head"><span><b data-i18n="s14.1"></b></span><span data-i18n="s14.2"></span></div>
  <div class="kicker" data-i18n="s14.3"></div>
  <h2 data-i18n="s14.4"></h2>
  <p class="lead" data-i18n="s14.5"></p>
  <div class="cols c3" style="margin-top:56px;gap:36px">
    <div class="card g"><div class="n" data-i18n="s14.6"></div><h3 data-i18n="s14.7"></h3><p data-i18n="s14.8"></p></div>
    <div class="card c"><div class="n" data-i18n="s14.9"></div><h3 data-i18n="s14.10"></h3><p data-i18n="s14.11"></p></div>
    <div class="card r"><div class="n" data-i18n="s14.12"></div><h3 data-i18n="s14.13"></h3><p data-i18n="s14.14"></p></div>
  </div>
  <p class="body" style="margin-top:44px" data-i18n="s14.15"></p>
  <div class="src" data-i18n="s14.16"></div>
  <div class="foot"><span class="wordmark" data-i18n="s14.17"></span><span data-i18n="s14.18"></span></div>
</section>

<!-- 18 · close -->
<section class="slide v ink">
  <div class="head"><span><b data-i18n="s15.1"></b></span><span data-i18n="s15.2"></span></div>
  <div class="kicker" data-i18n="s15.3"></div>
  <h1 style="font-size:120px" data-i18n="s15.4"></h1>
  <p class="lead" style="margin-top:34px" data-i18n="s15.5"></p>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:18px 30px;margin-top:64px">
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.6"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.7"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.8"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.9"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.10"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.11"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.12"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.13"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.14"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.15"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.16"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.17"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="s15.18"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="s15.19"></p></div>
    <div><div class="tag" style="color:#ff7a7f" data-i18n="s15.20"></div><p class="body" style="color:#f6f3ec;font-size:22px" data-i18n="s15.21"></p></div>
    <div><div class="tag" style="color:#8fd18f" data-i18n="y15.1"></div><p class="body" style="color:#c8c4ba;font-size:22px" data-i18n="y15.2"></p></div>
  </div>
  <div class="foot"><span class="wordmark" data-i18n="s15.22"></span><span data-i18n="s15.23"></span></div>
</section>

</main><script src="deck.js"></script>
</body></html>
