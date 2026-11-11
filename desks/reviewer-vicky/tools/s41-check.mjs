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
// websummit.com is not read by machine (its terms forbid automated reading; Vicky's rule via conductor.B@, 11 Nov 2026, 12:45 UTC).
// Web Summit's word comes from a person's read or the press.
const websummit = { note: 'not read by machine' };
const change = !ipmaSame || false;
console.log(JSON.stringify({ checked, ipma, ipmaSame, websummit, change }, null, 1));
