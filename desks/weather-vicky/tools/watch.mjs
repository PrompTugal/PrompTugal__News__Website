#!/usr/bin/env node
// The weather desk's connectors (weather@PrompTugal.vicky, S41): one small reader per official source,
// each taking only the part that matters. No dependencies (Node 18+).
//
//   node desks/weather-vicky/tools/watch.mjs              # read every source, print a JSON summary
//   node desks/weather-vicky/tools/watch.mjs --only ipma  # one reader (ipma, communiques, stations,
//                                                         #   lppt, carrismet, ttsl, gov, websummit)
//   node desks/weather-vicky/tools/watch.mjs --save       # also write desks/weather-vicky/data/<UTC>.json
//
// Public sources only. It keeps no page text beyond the fields below, and never a contact detail.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA = 'Mozilla/5.0 (compatible; promptugal-weather-desk/1.0)';
const now = () => new Date().toISOString().slice(0, 16) + 'Z';

async function get(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
      return { status: r.status, text: await r.text() };
    } catch (e) { last = e; await new Promise(res => setTimeout(res, 2000 * (i + 1))); }
  }
  return { status: 0, text: '', error: String(last?.cause?.code || last?.message || last) };
}

const plain = html => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

// Lisbon stations in IPMA's network (stations.json), for the observed record
const LISBON_STATIONS = { '1200535': 'Lisboa (Geofísico)', '1210580': 'Lisboa, Relógio', '1210762': 'Lisboa, Tapada da Ajuda',
  '7240919': 'Lisboa, Amoreiras', '6215302': 'Lisboa, Carnide (CML)' };

const readers = {
  // IPMA warnings: the Lisbon district (LSB) in full, and which areas are red for wind or rain
  async ipma() {
    const url = 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const all = JSON.parse(r.text);
    const lsb = all.filter(w => w.idAreaAviso === 'LSB' && w.awarenessLevelID !== 'green')
      .map(w => ({ type: w.awarenessTypeName, level: w.awarenessLevelID, start: w.startTime, end: w.endTime, text: w.text }));
    const red = {};
    for (const w of all.filter(w => w.awarenessLevelID === 'red'))
      (red[w.awarenessTypeName] ||= new Set()).add(w.idAreaAviso);
    return { url, status: 200, lisbon: lsb, red_areas: Object.fromEntries(Object.entries(red).map(([k, v]) => [k, [...v].sort()])) };
  },
  // IPMA special communiqués (the named storm), from the RSS feed
  async communiques() {
    const url = 'https://www.ipma.pt/resources.www/rss/comunicados.xml';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const items = [...r.text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map(m => ({
      date: (m[1].match(/<pubDate>(.*?)</) || [])[1], title: ((m[1].match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim() }));
    return { url, status: 200, built: (r.text.match(/<lastBuildDate>(.*?)</) || [])[1], items };
  },
  // IPMA stations: the last hours of mean wind (no gusts in this feed) at Lisbon stations
  async stations() {
    const url = 'https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const o = JSON.parse(r.text); const hours = Object.keys(o).sort().slice(-6);
    const out = {};
    for (const [id, name] of Object.entries(LISBON_STATIONS))
      out[name] = hours.map(h => ({ hour: h, wind_kmh: o[h]?.[id]?.intensidadeVentoKM ?? null, rain_mm: o[h]?.[id]?.precAcumulada ?? null }))
        .filter(x => x.wind_kmh !== null && x.wind_kmh >= 0);
    return { url, status: 200, note: 'hourly mean wind, km/h; -99 means no data', stations: out };
  },
  // Lisbon airport: IPMA's TAF and METAR (gusts), via NOAA's public Aviation Weather API
  async lppt() {
    const taf = await get('https://aviationweather.gov/api/data/taf?ids=LPPT&format=raw');
    const metar = await get('https://aviationweather.gov/api/data/metar?ids=LPPT&hours=3&format=raw');
    const gusts = [...(metar.text || '').matchAll(/(\d{3}|VRB)(\d{2,3})G(\d{2,3})KT/g)].map(m => ({ dir: m[1], kt: +m[2], gust_kt: +m[3], gust_kmh: Math.round(+m[3] * 1.852) }));
    return { url: 'https://aviationweather.gov/api/data/taf?ids=LPPT&format=raw', status: taf.status,
      taf: (taf.text || '').trim(), metar: (metar.text || '').trim().split('\n').slice(0, 6), metar_gusts: gusts };
  },
  // Carris Metropolitana: weather alerts in its public GTFS-RT-shaped feed
  async carrismet() {
    const url = 'https://api.carrismetropolitana.pt/v2/alerts';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const a = JSON.parse(r.text); const w = a.filter(x => x.cause === 'WEATHER');
    const kinds = {};
    for (const x of w) { const k = `${x.header_text?.translation?.[0]?.text} | ${x.effect}`; kinds[k] = (kinds[k] || 0) + 1; }
    return { url, status: 200, total: a.length, weather: w.length, by_header_and_effect: kinds,
      suspensions: w.filter(x => x.effect === 'NO_SERVICE').length };
  },
  // Transtejo/Soflusa ferries: the latest notices from the RSS feed
  async ttsl() {
    const url = 'https://ttsl.pt/avisos/feed/';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const items = [...r.text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 4).map(m => ({
      date: (m[1].match(/<pubDate>(.*?)</) || [])[1], title: (m[1].match(/<title>(.*?)</) || [])[1], link: (m[1].match(/<link>(.*?)</) || [])[1] }));
    return { url, status: 200, items };
  },
  // The government's declaration: is it still for 11 November only, and is there a contingency or calamity?
  async gov() {
    const url = 'https://portugal.gov.pt/gc25/comunicacao/noticias/governo-declara-situacao-de-alerta-em-todo-o-territorio-continental-1';
    const r = await get(url); if (r.status !== 200) return { url, status: r.status, error: r.error };
    const t = plain(r.text);
    const period = (t.match(/entre as 00h00[^;]{10,160}?23h59 do dia \d+ de novembro de \d{4}/) || [])[0] || null;
    return { url, status: 200, period, mentions_contingencia: /situação de contingência/i.test(t), mentions_calamidade: /situação de calamidade/i.test(t) };
  },
  // Web Summit: any weather word on the homepage or the news page (raw page, including its data)
  async websummit() {
    const out = {};
    for (const url of ['https://websummit.com/', 'https://websummit.com/blog/news/']) {
      const r = await get(url);
      const hits = [...new Set((r.text.match(/\b(weather|storm|charles|red warning|ipma|alert situation|wind warning|cancel+ed due|postponed due|closed due)\b/gi) || []).map(s => s.toLowerCase()))];
      out[url] = { status: r.status, bytes: r.text.length, weather_words: hits };
    }
    return out;
  },
};

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const result = { read_at: now(), by: 'weather@PrompTugal.vicky', sources: {} };
for (const [name, fn] of Object.entries(readers)) {
  if (only && name !== only) continue;
  try { result.sources[name] = await fn(); } catch (e) { result.sources[name] = { error: String(e.message || e) }; }
}
const json = JSON.stringify(result, null, 2);
console.log(json);
if (args.includes('--save')) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, result.read_at.replace(/:/g, '') + '.json'), json + '\n');
}
