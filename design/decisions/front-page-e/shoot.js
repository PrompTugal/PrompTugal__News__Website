const { chromium } = require('playwright');
const fs = require('fs');
const src = process.argv[2], out = process.argv[3];
// Remove the lab chrome (brief: no lab bar, no floating button, no palette switcher); block third-party scripts.
const strip = `.lab,[data-design-btn],.pals{display:none!important}`;
// Brand v2.0 mapping (design/brand/brand-tokens.css): designer@ proposal for the build.
const brand = `
html[data-pal][data-mode]{--paper:#f6f3ec;--ink:#121317;--red:#c52830;--green:#006600;--rule:#d8d4cb;--muted:#666860;--card:#fffdf8;--solid:#006600;--on:#f6f3ec}
.band{background:#006600!important;color:#f6f3ec!important}
.kk,.band .badge{color:#f6f3ec!important}
.band h1 mark{background:linear-gradient(transparent 74%,rgba(246,243,236,.45) 74%)!important}
.band p{color:#f6f3ec!important;opacity:.92}.band .by{color:#f6f3ec!important;opacity:.85}
.live{background:#121317!important}.live b{background:#c52830!important;color:#f6f3ec!important}
.brf li:before{color:#006600!important}.brf small,.st .k{color:#c52830!important}
.nx time{background:#006600!important;color:#f6f3ec!important}
.nums{background:#efe6d2!important;color:#121317!important}.nums b{color:#006600!important}.nums span{color:#666860!important}
mark{background:linear-gradient(transparent 58%,#e3f0e3 58%)}
`;
(async () => {
  const b = await chromium.launch();
  for (const [name, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    for (const v of ['mock', 'brand']) {
      const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
      await p.route('**/web-summit.sgit.ai/**', r => r.abort());
      await p.setContent(fs.readFileSync(src, 'utf8'), { waitUntil: 'networkidle' }).catch(()=>{});
      await p.addStyleTag({ content: strip + (v === 'brand' ? brand : '') + '.tk-in{animation:none!important}' });
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${out}/e-${v}--${name}.png`, fullPage: false });
      if (name === 'phone') await p.screenshot({ path: `${out}/e-${v}--${name}-full.png`, fullPage: true });
      await p.close();
    }
  }
  await b.close();
})();
