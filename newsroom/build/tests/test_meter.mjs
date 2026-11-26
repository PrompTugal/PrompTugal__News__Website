#!/usr/bin/env node
/* test_meter.mjs: the reading meter's rules, in Node, against the vendored core and this site's own price table.
 *
 *   node newsroom/build/tests/test_meter.mjs
 *
 * Ported from newsroom.sgit.ai's admin/build/test_meter.mjs (which drives the same core, sg-meter v1.5.0, in Chromium)
 * to Node: the browser's globals the core touches (localStorage, sessionStorage, location, document's events) are
 * stubbed, one fresh module instance per "page load", so the checks are the reference's without a browser:
 *   - the vendored files hash to what assets/components/sg-meter/VENDOR.md records;
 *   - the config is made from data/billing/prices.json (the same function the build uses), with this site's storage key;
 *   - opening a page charges a tenth; half read costs part of the price; read to the end, the whole price;
 *   - usefulness 5 doubles the charge, 1 makes it free; declining refunds and keeps the reason;
 *   - a reload in the same session does not charge again; a new session does;
 *   - the balance goes below zero and nothing is blocked; the meter's own pages are free;
 *   - the return page's credit is added once per payment reference; an export restores into a fresh browser;
 *   - a stored "paused" flag is cleared (v1.4); storage that refuses still lets every page open;
 *   - the price of each kind: type x freshness tier, from the table, as the browser glue names it.
 * The browser glue (assets/meter/meter.js: the share read, the views) is checked by test_billing_browser.mjs.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pathToFileURL } from 'node:url'
import * as config from '../lib/config.mjs'
import { meterConfig, priceTable, tierOf, PRICES, METER } from '../features/billing.mjs'

const ROOT = config.ROOT
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')

// --- the vendored component -----------------------------------------------------------------------------------
const vendor = fs.readFileSync(path.join(ROOT, 'assets/components/sg-meter/VENDOR.md'), 'utf8')
const rows = [...vendor.matchAll(/\| `([^`]+)` \| `([0-9a-f]{64})` \|/g)]
check(rows.length === 5 && rows.every(([, f, h]) => sha(path.join(ROOT, 'assets/components', f)) === h), 'the five vendored files hash to what VENDOR.md records')

// --- a browser, stubbed -----------------------------------------------------------------------------------------
class Store { constructor() { this.m = new Map(); this.fail = false } getItem(k) { if (this.fail) throw new Error('denied'); return this.m.has(k) ? this.m.get(k) : null } setItem(k, v) { if (this.fail) throw new Error('denied'); this.m.set(k, String(v)) } removeItem(k) { this.m.delete(k) } }
if (typeof globalThis.CustomEvent !== 'function') globalThis.CustomEvent = class extends Event { constructor(t, o = {}) { super(t, o); this.detail = o.detail } }
const ctx = { ...config, readJSON: config.readJSON }
const CFG = meterConfig(ctx)
const P = config.readJSON(PRICES)
const browser = () => ({ local: new Store(), session: new Store() })
let loads = 0
/** One page load: a fresh core module, with this browser's storages, at this path. */
async function load(b, pathname) {
    globalThis.localStorage = b.local
    globalThis.sessionStorage = b.session
    globalThis.location = { pathname, host: config.HOST, search: '' }
    globalThis.window = globalThis
    globalThis.window.SG_METER_CONFIG = CFG
    const events = new EventTarget()
    globalThis.document = { getElementById: () => null, documentElement: { getAttribute: () => '' }, dispatchEvent: e => events.dispatchEvent(e) }
    const mod = await import(pathToFileURL(path.join(ROOT, METER, 'sg-meter-core.js')).href + `?load=${++loads}`)
    return mod.meter
}
const kindOf = (type, date) => { const t = CFG.types[type]; return t.decays ? `${type}_${tierOf(P, (Date.now() - Date.parse(date + 'T00:00:00Z')) / 864e5)}` : type }
const daysAgo = n => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10)
const st = b => JSON.parse(b.local.getItem(CFG.storageKey))
// the prices are read from the table, never typed here: they have changed (Dinis, 17 Nov: from 1p, 2p assembled, 3p a signed article; the archive tier a pence less)
const r1 = x => Math.round(x * 10) / 10, pa = CFG.prices.article_archive, pf = CFG.prices.article_fresh, pcn = CFG.prices.company_new, ppl = CFG.prices.place

// --- the config ------------------------------------------------------------------------------------------------
check(CFG.storageKey === P.storage_key && CFG.start === 500 && CFG.minDepth === P.min_share, 'this site\'s own storage key, £5.00 to start, and the minimum share the table says')
check(JSON.stringify(CFG.prices) === JSON.stringify(priceTable(P)), 'the meter\'s prices are the published table')
check(['article_fresh', 'article_new', 'article_current', 'article_archive'].every(k => CFG.prices[k] >= P.floor) && CFG.prices.article_archive <= CFG.prices.article_fresh, 'an article never costs under the floor, and the archive costs no more than a fresh one')
check(CFG.prices.company_archive <= CFG.prices.company_new && CFG.prices.person >= P.floor && CFG.prices.account === 0 && Object.entries(CFG.prices).every(([k, v]) => k === 'account' || v >= P.floor), 'no kind is under the floor except the account, which is free')
const T = config.readJSON('data/billing/topup.json')
check(CFG.topup.amount === 500 && (T.link === '' ? CFG.topup.link === '' : CFG.topup.link.startsWith(T.link)), 'the top-up is £5.00 and its link is the data file\'s: none while PrompTugal.news has no payment link of its own (26 Nov 2026)')
check(kindOf('article', daysAgo(0)) === 'article_fresh' && kindOf('article', daysAgo(3)) === 'article_new' && kindOf('company', daysAgo(20)) === 'company_current' && kindOf('event', daysAgo(90)) === 'event_archive' && kindOf('person', daysAgo(90)) === 'person', 'freshness: a day fresh, a week new, a month current, then archive; reference pages do not decay')

// --- the rules -------------------------------------------------------------------------------------------------
const b = browser()
let m = await load(b, '/articles/an-older-article.html')
m.open({ kind: kindOf('article', daysAgo(60)), date: daysAgo(60), topics: ['article'], title: 'An older article' }); m.reach(0)
let s = st(b)
// min_share is 1 since 17 Nov (Dinis: a minimum of 1p per thing): opening a page charges its whole price, whatever share is read. The public copy still speaks of a tenth and of the share read:
// cl-6.dev told the conductor on 26 Nov. If min_share goes back to a fraction, these three checks change back with it.
const open0 = r1(pa * CFG.minDepth)
check(s.log[0].price === pa && s.log[0].cost === open0 && s.balance === r1(500 - open0), `opening an archived article charges ${CFG.minDepth * 100}% of ${pa}p (${s.log[0].cost}p)`)
m.reach(0.5); s = st(b)
check(s.log[0].cost === r1(pa * Math.max(0.5, CFG.minDepth)), `half of it read costs the larger of half and the minimum (${s.log[0].cost}p)`)
m.reach(0.3); s = st(b)
check(s.log[0].cost === r1(pa * Math.max(0.5, CFG.minDepth)), 'reading is never un-charged by a smaller share later in the page')
m.reach(1); s = st(b)
check(s.log[0].cost === pa && s.balance === 500 - pa, `read to the end, the whole price (balance ${s.balance})`)
m.rate('useful', 5); s = st(b)
check(s.log[0].cost === 2 * pa && s.balance === 500 - 2 * pa, 'rated excellent, it costs double')
m.rate('useful', 1); s = st(b)
check(s.log[0].cost === 0 && s.balance === 500, 'rated not useful, it is free')
m.rate('useful', 3)
m.decline('clickbait'); s = st(b)
check(s.balance === 500 && s.log[0].declined && s.log[0].declined.reason === 'clickbait' && s.declined === pa, 'declining refunds the page and keeps the reason')
m = await load(b, '/articles/an-older-article.html')
m.open({ kind: kindOf('article', daysAgo(60)), date: daysAgo(60), title: 'An older article' }); m.reach(1)
s = st(b)
check(s.log.length === 1 && s.balance === 500 && m.status === 'declined', 'a reload in the same session does not charge again, and a declined page stays declined')
// the meter's own pages are free
m = await load(b, '/account/')
m.open({ kind: 'account', title: 'Your reading account' }); m.reach(1)
check(m.status === 'free' && st(b).log.length === 1, 'the account page is free and not logged')
// below zero, nothing blocked
s = st(b); s.balance = 2; b.local.setItem(CFG.storageKey, JSON.stringify(s))
m = await load(b, '/articles/a-fresh-article.html')
m.open({ kind: kindOf('article', daysAgo(0)), date: daysAgo(0), title: 'A fresh article' }); m.reach(1)
s = st(b)
check(s.balance === 2 - pf && s.balance < 0 && m.status === 'reading', `the balance goes below zero and the page still opens (${s.balance})`)
// a company page, new
m = await load(b, '/companies/replit/')
m.open({ kind: kindOf('company', daysAgo(2)), date: daysAgo(2), title: 'Replit' }); m.reach(1)
check(st(b).log[0].kind === 'company_new' && st(b).log[0].cost === pcn, `a company profile from two days ago costs ${pcn}p read to the end`)
// a new session charges again
b.session = new Store()
m = await load(b, '/companies/replit/')
m.open({ kind: kindOf('company', daysAgo(2)), date: daysAgo(2), title: 'Replit' }); m.reach(0)
check(st(b).log.length === 4 && st(b).log[0].cost === r1(pcn * CFG.minDepth), 'a new browser session opens the page again, from the minimum')
// the return page: once per reference
const before = st(b).balance
check(m.credit(500, 'link', 'cs_test_1') === true && m.credit(500, 'link', 'cs_test_1') === false && st(b).balance === before + 500 && st(b).topups.length === 1, 'a payment reference is credited once')
// export, restore into a fresh browser
const exported = b.local.getItem(CFG.storageKey)
const b2 = browser()
let m2 = await load(b2, '/account/')
check(m2.restore('not json') !== '' && m2.restore('{"a":1}') !== '', 'a restore refuses what is not an export')
check(m2.restore(exported) === '' && st(b2).reads === st(b).reads && st(b2).balance === st(b).balance && st(b2).topups.length === 1, 'an export restores balance, history and receipts in another browser')
// v1.4: a stored paused flag is cleared
s = st(b2); s.paused = true; b2.local.setItem(CFG.storageKey, JSON.stringify(s))
m2 = await load(b2, '/places/lisbon/')
m2.open({ kind: 'place', title: 'Lisbon' }); m2.reach(1)
check(m2.status === 'reading' && st(b2).log[0].cost === ppl, 'a stored paused flag does not stop the meter')
// storage that refuses
const b3 = browser(); b3.local.fail = true; b3.session.fail = true
const m3 = await load(b3, '/articles/x.html')
m3.open({ kind: kindOf('article', daysAgo(0)), title: 'x' }); m3.reach(1)
check(m3.noStorage && m3.status === 'reading' && m3.state.balance === 500 - pf, 'storage that refuses: the meter says so, counts this page in memory, and blocks nothing')

console.log(failed ? `${failed} FAILED` : 'ALL METER CHECKS PASS')
process.exit(failed ? 1 : 0)
