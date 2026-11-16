#!/usr/bin/env node
// Now in each Algarve place (Dinis, 16 Nov 2026: "reactivate the storm ... what information can we show locally" and "add
// the Faro data, flight data"; board/briefs/2026-11-16-storm-local-data.md). One run reads IPMA's open data
// (https://api.ipma.pt/open-data/, no key) and adsb.lol's public API around Faro airport (no key), politely, one request
// every 2 seconds, and writes data/by-place/now/<place>.json: small JSON, every value with its source and the time read.
// No model is called. Raw responses are never written. Privacy (the storm site's rule, tools/flights-poll.mjs there):
// an airline flight keeps its callsign, airline code and type; every other aircraft is only counted.
//   node board/tools/local-now.mjs            (from the repository root)
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd(), OUT = path.join(ROOT, 'data/by-place/now')
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'board/briefs/2026-11-16-storm-local-map.json'), 'utf8'))
const IPMA = 'https://api.ipma.pt/open-data/'
const FORECAST = { 1080500: 'Faro', 1080800: 'Loulé', 1081100: 'Portimão', 1081505: 'Sagres' }
const SEA = { faro: 1080526, sagres: 1081526 }   // Faro coast, Sagres coast
const WEST = new Set(['vila-do-bispo', 'aljezur', 'lagos'])
const INLAND = new Set(['monchique', 'alcoutim', 'sao-bras-de-alportel', 'silves'])
const LPFR = { lat: 37.0144, lon: -7.9659, nm: 40 }
const LEVEL = { green: 'green', yellow: 'yellow', orange: 'orange', red: 'red' }
const EN = { 'Agitação Marítima': 'rough sea', 'Precipitação': 'rain', 'Vento': 'wind', 'Trovoada': 'thunderstorms', 'Nevoeiro': 'fog', 'Tempo Frio': 'cold', 'Tempo Quente': 'heat', 'Neve': 'snow' }
const RCM = { 1: 'low', 2: 'moderate', 3: 'high', 4: 'very high', 5: 'maximum' }
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const sleep = ms => new Promise(r => setTimeout(r, ms))
const read = {}
async function get(name, url) {
    await sleep(2000)
    try { const r = await fetch(url, { headers: { 'user-agent': 'PrompTugal.news local-now (https://promptugal.news/)' } }); read[name] = { url, at: now(), status: r.status }
        return r.ok ? await r.json() : null } catch (e) { read[name] = { url, at: now(), status: 'error' }; return null }
}

const warnings = await get('warnings', IPMA + 'forecast/warnings/warnings_www.json')
const obs = await get('observations', IPMA + 'observation/meteorology/stations/observations.json')
const daily = {}
for (const id of Object.keys(FORECAST)) daily[id] = await get(`city-daily-${id}`, `${IPMA}forecast/meteorology/cities/daily/${id}.json`)
const rcm = [await get('fire-risk-d0', IPMA + 'forecast/meteorology/rcm/rcm-d0.json'), await get('fire-risk-d1', IPMA + 'forecast/meteorology/rcm/rcm-d1.json'), await get('fire-risk-d2', IPMA + 'forecast/meteorology/rcm/rcm-d2.json')]
const uv = await get('uv', IPMA + 'forecast/meteorology/uv/uv.json')
const sea = await get('sea-forecast-d0', IPMA + 'forecast/oceanography/daily/hp-daily-sea-forecast-day0.json')
const adsb = await get('adsb', `https://api.adsb.lol/v2/point/${LPFR.lat}/${LPFR.lon}/${LPFR.nm}`)

const num = v => (v === undefined || v === null || v === '' || +v === -99) ? null : +v
const lastObs = obs ? Object.keys(obs).sort().pop() : null
const station = id => { const o = lastObs && obs[lastObs][String(id)]; if (!o) return null
    return { at: lastObs.replace(/:00$/, ':00Z'), temp_c: num(o.temperatura), humidity_pct: num(o.humidade), wind_kmh: num(o.intensidadeVentoKM), wind_dir_id: num(o.idDireccVento), rain_mm: num(o.precAcumulada), pressure_hpa: num(o.pressao) } }
const far = (warnings || []).filter(w => w.idAreaAviso === 'FAR').map(w => ({ type: EN[w.awarenessTypeName] || w.awarenessTypeName, type_pt: w.awarenessTypeName, level: LEVEL[w.awarenessLevelID] || w.awarenessLevelID, start: w.startTime, end: w.endTime, text: w.text || '' }))
const active = far.filter(w => w.level !== 'green')
const fire = dico => rcm.map(f => f && f.local && f.local[dico] ? { date: f.dataPrev, level: RCM[f.local[dico].data.rcm] || String(f.local[dico].data.rcm) } : null).filter(Boolean)
const uvOf = id => { const l = (uv || []).filter(x => String(x.globalIdLocal) === String(id)).sort((a, b) => String(b.data).localeCompare(String(a.data)))[0]; return l ? { date: l.data, index: num(l.iUv) } : null }
const seaOf = id => { const s = (sea?.data || []).find(x => String(x.globalIdLocal) === String(id)); return s ? { date: sea.forecastDate || null, waves_max_m: num(s.waveHighMax), sea_max_m: num(s.totalSeaMax), sea_temp_max_c: num(s.sstMax) } : null }

// Faro airport: airline flights by callsign (an ICAO airline code and a flight number); every other aircraft counted only
let airport = null
if (adsb) {
    const airline = [], others = { count: 0 }
    for (const a of adsb.ac || []) { const cs = String(a.flight || '').trim()
        if (/^[A-Z]{3}\d{1,4}[A-Z]{0,2}$/.test(cs)) airline.push({ callsign: cs, airline: cs.slice(0, 3), type: a.t || null, alt_ft: a.alt_baro === 'ground' ? 0 : num(a.alt_baro), on_ground: a.alt_baro === 'ground', ground_speed_kt: num(a.gs) })
        else others.count++ }
    airline.sort((x, y) => x.callsign.localeCompare(y.callsign))
    airport = { icao: 'LPFR', name: 'Faro airport', within_nm: LPFR.nm, at: read.adsb.at, airline, other_aircraft: others.count, source: 'https://api.adsb.lol/', note: 'What adsb.lol\'s community receivers saw within 40 nautical miles at the time read. Airline flights by callsign; other aircraft only counted.' }
}

fs.mkdirSync(OUT, { recursive: true })
const written = []
for (const m of MAP) {
    const f = daily[m.forecast_id]
    const out = {
        place: m.place, read_at: now(), by: 'board/tools/local-now.mjs (conductor@PrompTugal.dinis)',
        about: 'Now in this place, from IPMA\'s open data and (for Faro) adsb.lol: each value with its source and the time read. Not a warning service: follow IPMA (https://www.ipma.pt/) and ANEPC.',
        station: { name: m.station, id: m.station_id, km: m.station_km, reading: station(m.station_id), source: IPMA + 'observation/meteorology/stations/observations.json' },
        forecast: f ? { place: FORECAST[m.forecast_id], id: m.forecast_id, km: m.forecast_km, days: (f.data || []).slice(0, 5).map(d => ({ date: d.forecastDate, t_min_c: num(d.tMin), t_max_c: num(d.tMax), rain_prob_pct: num(d.precipitaProb), weather_type: num(d.idWeatherType) })), source: `${IPMA}forecast/meteorology/cities/daily/${m.forecast_id}.json` } : null,
        warnings: { area: 'FAR (the Faro district)', active, source: IPMA + 'forecast/warnings/warnings_www.json' },
        fire_risk: { municipality: m.dico, days: fire(m.dico), source: IPMA + 'forecast/meteorology/rcm/rcm-d0.json' },
        uv: (() => { const id = WEST.has(m.place) ? 1081525 : 1080500, u = uvOf(id); return u ? { place: id === 1081525 ? 'Sagres' : 'Faro', ...u, source: IPMA + 'forecast/meteorology/uv/uv.json' } : null })(),
        sea: INLAND.has(m.place) ? null : (() => { const id = WEST.has(m.place) || m.place === 'portimao' || m.place === 'lagoa' ? SEA.sagres : SEA.faro, s = seaOf(id); return s ? { coast: id === SEA.sagres ? 'Sagres coast' : 'Faro coast', ...s, source: IPMA + 'forecast/oceanography/daily/hp-daily-sea-forecast-day0.json' } : null })(),
        airport: m.place === 'faro' || m.place === 'olhao' || m.place === 'loule' ? airport : null,
        reads: read,
    }
    fs.writeFileSync(path.join(OUT, `${m.place}.json`), JSON.stringify(out, null, 1) + '\n'); written.push(m.place)
}
// the region: the warnings and the airport, and each place's station temperature
const region = { place: 'algarve', read_at: now(), by: 'board/tools/local-now.mjs (conductor@PrompTugal.dinis)', about: 'Now in the Algarve: IPMA\'s warnings for the Faro district, Faro airport, and each place\'s nearest station. Not a warning service.',
    warnings: { area: 'FAR (the Faro district)', active, source: IPMA + 'forecast/warnings/warnings_www.json' }, airport,
    places: MAP.map(m => ({ place: m.place, station: m.station, temp_c: station(m.station_id)?.temp_c ?? null })), reads: read }
fs.writeFileSync(path.join(OUT, 'algarve.json'), JSON.stringify(region, null, 1) + '\n')
console.log(`local-now: ${written.length + 1} files at ${now()}; observations ${lastObs || 'none'}; warnings active ${active.length}; airport ${airport ? airport.airline.length + ' airline, ' + airport.other_aircraft + ' other' : 'not read'}`)
