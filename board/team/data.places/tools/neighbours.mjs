// The blast radius's data (data.places@PrompTugal.dinis, 16 November 2026; board/briefs/2026-11-16-blast-radius.md):
// for each Algarve municipality, the municipalities it borders, read from the standard sentence of its Portuguese
// Wikipedia article ("O município de X é limitado a norte por ..."), each with the article's revision and the date
// read; and the straight-line distance in km between every two places, from their seats in data/by-place/places.json.
// Quarteira is a city inside Loulé: it borders Loulé (its own municipality) and takes Loulé's neighbours' distances
// from its own seat. A check against DGT's official boundaries (CAOP) is still owed and said so in the file.
//   node board/team/data.places/tools/neighbours.mjs
import fs from 'node:fs'
const ROOT = new URL('../../../../', import.meta.url).pathname
const places = JSON.parse(fs.readFileSync(ROOT + 'data/by-place/places.json', 'utf8')).places.filter((p, _, all) => p.parent === 'algarve' || all.some(q => q.id === p.parent && q.parent === 'algarve'))
const TITLE = { faro: 'Faro', loule: 'Loulé', silves: 'Silves (Portugal)', tavira: 'Tavira', 'vila-real-de-santo-antonio': 'Vila Real de Santo António', portimao: 'Portimão', lagos: 'Lagos (Portugal)', olhao: 'Olhão', albufeira: 'Albufeira', lagoa: 'Lagoa (Algarve)', monchique: 'Monchique', aljezur: 'Aljezur', 'vila-do-bispo': 'Vila do Bispo', 'castro-marim': 'Castro Marim', alcoutim: 'Alcoutim', 'sao-bras-de-alportel': 'São Brás de Alportel' }
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const byName = new Map(places.map(p => [fold(p.name), p.id]))
const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, [lo1, la1] = a, [lo2, la2] = b
    const h = Math.sin(r(la2 - la1) / 2) ** 2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(r(lo2 - lo1) / 2) ** 2; return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10 }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const read_on = new Date().toISOString().slice(0, 10), out = []
for (const [id, title] of Object.entries(TITLE)) {
    let j = null
    for (let k = 0; k < 4 && !j; k++) { const r = await fetch(`https://pt.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext|revid&format=json`, { headers: { 'User-Agent': 'promptugal-data/1.0 (+https://promptugal.news/query/)' } }); if (r.ok) j = await r.json(); else await sleep(4000 * (k + 1)) }
    const t = j && j.parse && j.parse.wikitext['*'] || '', rev = j && j.parse && j.parse.revid
    // the sentence that says what it borders ("é limitado a norte pelo município de ..."); links read after "limitad"
    const m = /[^.\n]*\blimitad[oa]s? a (?:norte|sul|leste|oeste|nordeste|noroeste|sudeste|sudoeste)[^.]*\./i.exec(t)
    const after = m ? m[0].slice(m[0].search(/limitad/i)) : ''
    const links = [...new Set([...after.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map(x => (x[2] || x[1]).trim()))]
    // not a neighbour: the sea, a river, an island, a parish of one of the places (Vila Nova de Cacela is in VRSA)
    const NOT = /oceano|atl[aâ]ntico|^mar\b|^rio\b|^ilha|^ria\b|exclave|andaluz|vila nova de cacela/i
    const borders = links.filter(n => !NOT.test(n) && /^[A-ZÁÉÍÓÚÂÊÔÃÕ]/.test(n)).map(n => ({ name: n, place: byName.get(fold(n.replace(/\s*\(.*\)/, ''))) || null }))
    out.push({ id, source: `https://pt.wikipedia.org/w/index.php?title=${encodeURIComponent(title.replace(/ /g, '_'))}&oldid=${rev}`, revision: rev, read_on, sentence: m ? m[0].replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1') : null, borders })
    console.log(id, rev, borders.map(b => b.place || `(${b.name})`).join(', ') || 'NOT FOUND')
    await sleep(6000)
}
const q = places.find(p => p.id === 'quarteira')
if (q) out.push({ id: 'quarteira', source: null, revision: null, read_on, sentence: 'Quarteira is a city in the municipality of Loulé; its neighbour is its own municipality.', borders: [{ name: 'Loulé', place: 'loule' }] })
const distances = []
for (const a of places) for (const b of places) if (a.id < b.id && a.at && b.at) distances.push([a.id, b.id, km(a.at, b.at)])
const file = { about: 'For each Algarve place, the municipalities it borders (from its Portuguese Wikipedia article, at the revision named, read on the date given) and the straight-line distance in km between every two places (from their seats in data/by-place/places.json). For the blast radius (board/briefs/2026-11-16-blast-radius.md). Not yet checked against DGT\'s official boundaries (CAOP).',
    by: 'data.places@PrompTugal.dinis', made: read_on, check_owed: 'CAOP, https://www.dgterritorio.gov.pt/cartografia/cartografia-tematica/caop', places: out, distances }
fs.writeFileSync(ROOT + 'board/team/data.places/neighbours.json', JSON.stringify(file, null, 2) + '\n')
console.log(`neighbours: ${out.length} places, ${distances.length} distances`)
