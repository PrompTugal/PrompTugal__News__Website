// S41 hourly check (reviewer@PrompTugal.vicky): IPMA's Lisbon (LSB) warnings and Web Summit's official pages.
// Prints JSON: { checked, ipma: [...], ipmaSame, websummit: {url: notice-or-null}, change }
// Run from the repository root: node desks/reviewer-vicky/tools/s41-check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// The warnings S41 states (published 10 Nov 2026, 14:34 UTC). Any difference is a change to look at.
const EXPECTED = [
  'Vento|red|2026-11-11T12:00:00|2026-11-11T21:00:00',
  'Precipitação|orange|2026-11-11T05:00:00|2026-11-11T18:00:00',
  'Agitação Marítima|orange|2026-11-11T12:00:00|2026-11-11T21:00:00',
];
const checked = new Date().toISOString().slice(0, 16) + 'Z';
// curl, not fetch: the session's network goes through a proxy that Node's fetch does not use.
const all = JSON.parse(require('child_process').execFileSync('curl',
  ['-sS', '-m', '30', 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json'], { encoding: 'utf8' }));
const ipma = all.filter(w => w.idAreaAviso === 'LSB' && w.awarenessLevelID !== 'green')
  .map(w => `${w.awarenessTypeName}|${w.awarenessLevelID}|${w.startTime}|${w.endTime}`);
const wind = all.find(w => w.idAreaAviso === 'LSB' && w.awarenessTypeName === 'Vento' && w.awarenessLevelID === 'red');
const gustsSame = !!wind && /120 km\/h/.test(wind.text) && /140 km\/h/.test(wind.text);
const ipmaSame = gustsSame && EXPECTED.every(e => ipma.includes(e)) && ipma.filter(s => ['red', 'orange'].includes(s.split('|')[1])).length === EXPECTED.length;

const words = /(weather|wind|storm|IPMA|civil protection|cancel|postpone|closed|suspend|Wednesday|11 November)/i;
const websummit = {};
const b = await chromium.launch();
const p = await b.newPage();
for (const u of ['https://websummit.com/', 'https://websummit.com/blog/news/']) {
  try {
    await p.goto(u, { waitUntil: 'networkidle', timeout: 60000 });
    const t = (await p.innerText('body')).replace(/\s+/g, ' ')
      .replace(/Join the Web Summit network[^.]*\./g, '');
    const m = t.match(words);
    websummit[u] = m ? t.slice(Math.max(0, m.index - 200), m.index + 300) : null;
  } catch (e) { websummit[u] = 'ERROR ' + e.message.split('\n')[0]; }
}
await b.close();
const change = !ipmaSame || Object.values(websummit).some(v => v !== null);
console.log(JSON.stringify({ checked, ipma, ipmaSame, websummit, change }, null, 1));
