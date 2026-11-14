// The reviewer's cover generator (desks/reviewer-vicky/covers/STYLE.md). Run from an empty working folder: node <path>/make-cover.js. Writes <slug>--{card,thumb}.svg and the four PNGs there.
const { chromium } = require('playwright'); const fs = require('fs');
const font = fs.readFileSync(require('path').resolve(__dirname, '../../../../assets/fonts/plex-sans-variable.woff2')).toString('base64');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const style = `<style>@font-face{font-family:"PT Cover Plex Sans";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 700}
.bg{fill:#f6f3ec}.ink{fill:#121317}.ink3{fill:#595c64}.grn{fill:#006600}.box{fill:#ece7db;stroke:#9d9580}
text{font-family:"PT Cover Plex Sans";font-kerning:normal}
@media (prefers-color-scheme:dark){.bg{fill:#111214}.ink{fill:#eceae4}.ink3{fill:#a6a39a}.grn{fill:#6dbb7e}.box{fill:#1a1b1e;stroke:#5f5b51}}</style>`;
const card = c => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-labelledby="t"><title id="t">${esc(c.alt)}</title>${style}<rect class="bg" width="1200" height="630"/>
<rect class="grn" x="60" y="52" width="96" height="8"/>
<text class="ink" x="60" y="140" font-size="72" font-weight="700">${esc(c.title)}</text>
<text class="ink3" x="60" y="200" font-size="42" font-weight="400">${esc(c.sub)}</text>
<rect class="box" x="60" y="236" width="1080" height="270" rx="16" stroke-width="2"/>
<text class="grn" x="100" y="350" font-size="96" font-weight="700">${esc(c.fig)}</text>
<text class="ink" x="100" y="452" font-size="48" font-weight="500">${esc(c.line)}</text>
<text class="ink3" x="60" y="578" font-size="42" font-weight="400">${esc(c.src)}</text></svg>`;
const thumb = c => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480" role="img" aria-labelledby="t"><title id="t">${esc(c.title)}</title>${style}<rect class="bg" width="480" height="480"/>
<rect class="grn" x="40" y="40" width="80" height="8"/>
${c.ttitle.map((l,i)=>`<text class="ink" x="40" y="${124+i*76}" font-size="${c.tts||68}" font-weight="700">${esc(l)}</text>`).join('')}
<rect class="box" x="40" y="292" width="400" height="148" rx="16" stroke-width="2"/>
<text class="grn" x="70" y="398" font-size="${c.tfs||80}" font-weight="700">${esc(c.tfig)}</text></svg>`;
const covers = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, 'covers.json')));
(async () => { const b = await chromium.launch(); let bad = 0;
  for (const c of covers) for (const [size, w, h, f] of [['card',1200,630,card],['thumb',480,480,thumb]]) {
    const svg = f(c); const name = `${c.slug}--${size}.svg`; fs.writeFileSync(name, svg);
    for (const [theme, scheme] of [['paper','light'],['ink','dark']]) {
      const q = await b.newPage({ viewport: { width: w, height: h } }); await q.emulateMedia({ colorScheme: scheme });
      // inline the svg to measure, then render as <img> (how the site shows it)
      await q.setContent(`<body style="margin:0">${svg}</body>`); await q.evaluate(() => document.fonts.ready);
      const m = await q.evaluate(() => [...document.querySelectorAll('text')].map(t => { const r = t.getBBox(); return [t.textContent, Math.round(r.x + r.width), getComputedStyle(t).fontFamily, document.fonts.check('700 40px "PT Cover Plex Sans"')]; }));
      for (const [t, right, fam, ok] of m) { const lim = size === 'card' ? (t === c.fig || t === c.line ? 1100 : 1140) : (t === c.tfig ? 410 : 440); if (right > lim || !ok) { bad++; console.log('OVER', c.slug, size, t, right, lim, ok); } }
      if (theme === 'paper') console.log(c.slug, size, m.map(x => x[0] + ':' + x[1]).join(' | '));
      fs.writeFileSync('r.html', `<body style="margin:0"><img src="${name}" style="width:${w}px;height:${h}px;display:block"></body>`);
      await q.goto('file://' + process.cwd() + '/r.html'); await q.waitForTimeout(600);
      await q.screenshot({ path: `${c.slug}--${theme}--${size}.png`, clip: { x: 0, y: 0, width: w, height: h } }); await q.close(); } }
  await b.close(); console.log('over:', bad); })();
