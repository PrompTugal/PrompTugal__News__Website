// S41 hourly check (reviewer@PrompTugal.vicky): IPMA's Lisbon (LSB) warnings and Web Summit's official pages.
// Prints JSON: { checked, ipma: [...], ipmaSame, websummit: {url: notice-or-null}, change }
// Run from the repository root: node desks/reviewer-vicky/tools/s41-check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// The warnings S41 states (red rain brought forward to 09:00, 10 Nov 2026, 23:51 UTC). Any difference is a change to look at.
const EXPECTED = [
  'Vento|orange|2026-11-11T09:00:00|2026-11-11T21:00:00',
  'Precipitação|red|2026-11-11T09:00:00|2026-11-11T18:00:00',
  'Precipitação|orange|2026-11-11T07:17:00|2026-11-11T09:00:00',
  'Agitação Marítima|orange|2026-11-11T12:00:00|2026-11-11T21:00:00',
];
const checked = new Date().toISOString().slice(0, 16) + 'Z';
// curl, not fetch: the session's network goes through a proxy that Node's fetch does not use.
const all = JSON.parse(require('child_process').execFileSync('curl',
  ['-sS', '-m', '30', 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json'], { encoding: 'utf8' }));
const ipma = all.filter(w => w.idAreaAviso === 'LSB' && w.awarenessLevelID !== 'green')
  .map(w => `${w.awarenessTypeName}|${w.awarenessLevelID}|${w.startTime}|${w.endTime}`);
const wind = all.find(w => w.idAreaAviso === 'LSB' && w.awarenessTypeName === 'Vento' && w.awarenessLevelID !== 'green');
const gustsSame = !!wind && /120 km\/h/.test(wind.text) && !/140 km\/h/.test(wind.text); // since IPMA's 08:15 UTC update, 11 Nov: orange, gusts to 120 km/h
const ipmaSame = gustsSame && EXPECTED.every(e => ipma.includes(e)) && ipma.filter(s => ['red', 'orange'].includes(s.split('|')[1])).length === EXPECTED.length;

const words = /(weather|wind|storm|IPMA|civil protection|cancel|postpone|closed|suspend|Wednesday|11 November|Day 3|Thursday|12 November|event update)/i;
const websummit = {};
const b = await chromium.launch();
const p = await b.newPage();
// /blog/ is where Web Summit posted its Day 2 statement (10 Nov); watched for Day 3 updates too
for (const u of ['https://websummit.com/', 'https://websummit.com/blog/', 'https://websummit.com/blog/news/']) {
  try {
    await p.goto(u, { waitUntil: 'networkidle', timeout: 60000 });
    const t = (await p.innerText('body')).replace(/\s+/g, ' ')
      .replace(/Join the Web Summit network[^.]*\./g, '')
      // Web Summit's own statement of 10 Nov (Day 2 will not take place), already in S41: not a new change
      // its homepage banner (21:32 UTC, 10 Nov) pointing to that statement: also known
      .replace(/Important event update On the advice of the Portuguese Government, Day 2 of Web Summit will not be going ahead due to severe weather warnings\. Please read statement here\./g, '')
      .replace(/Important event update The Government of Portugal has formally advised Web Summit that, due to the risks posed by Storm[^.]*\.{0,3}/g, '');
    const m = t.match(words);
    websummit[u] = m ? t.slice(Math.max(0, m.index - 200), m.index + 300) : null;
  } catch (e) { websummit[u] = 'ERROR ' + e.message.split('\n')[0]; }
}
// Web Summit's statement itself: any edit (a Day 3 update added to it, say) is a change
const POST = 'https://websummit.com/blog/web-summit/important-event-update-2026/';
const KNOWN = "The Government of Portugal has formally advised Web Summit that, due to the risks posed by Storm Charles, including tidal flooding, severe disruption to public transport and the impact of high winds on external structures, Day 2 of Web Summit should not take place. This follows discussions with the Portuguese Government, the National Emergency and Civil Protection Authority (ANEPC), and the Public Security Police (PSP). Web Summit will of course respect the Government’s direction, and accordingly, Day 2 (Wednesday, November 11th) will not take place. The safety and security of our attendees, staff and contractors is always our absolute priority. Web Summit aims to proceed with Day 3 (Thursday, November 12) as planned, following the passing of Storm Charles. We will continue to work closely with the relevant authorities and emergency services, monitor conditions and provide further updates as soon as confirmed information becomes available. Web Summit will communicate directly with those impacted.";
try {
  await p.goto(POST, { waitUntil: 'networkidle', timeout: 60000 });
  const t = (await p.innerText('body')).replace(/\s+/g, ' ');
  // unchanged = the known text, followed directly by the related posts or the footer
  const k = t.indexOf(KNOWN);
  const after = k >= 0 ? t.slice(k + KNOWN.length).trim() : '';
  const same = k >= 0 && /^(Related|Web Summit ©)/.test(after);
  const i = t.indexOf('Web Summit Share');
  websummit[POST] = same ? null : 'STATEMENT CHANGED: ' + t.slice(Math.max(0, (i >= 0 ? i : t.indexOf('Important event update'))), (i >= 0 ? i : 0) + 2500);
} catch (e) { websummit[POST] = 'ERROR ' + e.message.split('\n')[0]; }
await b.close();
const change = !ipmaSame || Object.values(websummit).some(v => v !== null);
console.log(JSON.stringify({ checked, ipma, ipmaSame, websummit, change }, null, 1));
