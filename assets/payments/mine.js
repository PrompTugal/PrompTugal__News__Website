/**
 * mine.js: "Your £5" on /payments/simulated/ (Dinis, 18 November 2026). Reads the meter's reading log from this browser's
 * localStorage (the key from api/v1/billing/meter.json) and the ledger (api/v1/payments/attribution.json), and shows how
 * the example spend would be split across the sources behind the pages read. Nothing is sent: the two fetches are our
 * own public files, and the log never leaves the device. Every string written with textContent. A simulation: no money moves.
 * dev@PrompTugal.dinis.
 */
export function split(log, led) {
    const M = led.model, pool = M.example_spend * (1 - M.kept_for_costs), per = {}, read = new Set()
    for (const e of log || []) {
        const p = String(e && e.path || '').replace(/index\.html$/, '')
        if (read.has(p)) continue
        const pg = led.pages[p] || led.pages[p.replace(/^\/[a-z]{2}(-[A-Za-z]{2,4})?\//, '/')]   // a translated page counts as its English one
        if (!pg) continue
        read.add(p)
        const tot = pg.sources.reduce((a, s) => a + s[1], 0)
        for (const [h, w] of pg.sources) per[h] = (per[h] || 0) + w / tot   // each page read counts once, shared within it by weight
    }
    const n = read.size, rows = Object.entries(per).map(([h, x]) => ({ host: h, share: pool * x / Math.max(n, 1) })).sort((a, b) => b.share - a.share)
    return { pages: n, pool, kept: M.example_spend - pool, rows, paid: rows.filter(r => r.share >= M.minimum_payout) }
}

const root = typeof document !== 'undefined' ? document.getElementById('mine') : null
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e }

async function main() {
    if (!root) return
    const get = async p => (await fetch(new URL(p, location.href).href, { credentials: 'omit' })).json()
    let led, cfg, log = []
    try { [led, cfg] = await Promise.all([get('../../api/v1/payments/attribution.json'), get('../../api/v1/billing/meter.json')]) }
    catch (e) { root.replaceChildren(el('p', 'note', 'The simulation could not load its data.')); return }
    try { const s = JSON.parse(localStorage.getItem(cfg.storageKey) || 'null'); if (s && Array.isArray(s.log)) log = s.log } catch (e) { /* no storage: an empty log */ }
    const r = split(log, led), M = led.model, f = x => M.symbol + x.toFixed(2)
    root.replaceChildren(el('p', 'note', led.simulated))
    if (!r.rows.length) { root.append(el('p', '', 'No pages in this browser\'s reading log yet, or none with sources we can see. Read a few articles or place pages and come back.')); return }
    root.append(el('p', 'pay-total', `${r.pages} page${r.pages === 1 ? '' : 's'} read in this browser · of ${f(M.example_spend)}: ${f(r.kept)} kept for costs, ${f(r.pool)} shared across ${r.rows.length} source${r.rows.length === 1 ? '' : 's'}`))
    const t = el('table'), hd = el('tr'); ['Source', 'Its share', 'Paid now?'].forEach(x => hd.append(el('th', '', x))); t.append(hd)
    for (const x of r.rows.slice(0, 40)) {
        const tr = el('tr'), a = el('a', '', x.host); a.href = 'https://' + x.host + '/'; a.rel = 'noopener noreferrer'
        const td = el('td'); td.append(a); tr.append(td, el('td', '', f(x.share)), el('td', '', x.share >= M.minimum_payout ? 'yes' : `carries over (under ${f(M.minimum_payout)})`)); t.append(tr)
    }
    root.append(t)
    if (r.rows.length > 40) root.append(el('p', 'note', `And ${r.rows.length - 40} more, each under ${f(r.rows[39].share)}.`))
}
if (typeof document !== 'undefined') main()
