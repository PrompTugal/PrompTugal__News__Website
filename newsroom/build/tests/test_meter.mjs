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

// --- the config ------------------------------------------------------------------------------------------------
check(CFG.storageKey === 'web-summit.newsroom.meter.v1' && CFG.start === 500 && CFG.minDepth === 0.1, 'this site\'s own storage key, £5.00 to start, never under a tenth')
check(JSON.stringify(CFG.prices) === JSON.stringify(priceTable(P)), 'the meter\'s prices are the published table')
check(CFG.prices.article_fresh === 12 && CFG.prices.article_new === 9 && CFG.prices.article_current === 6 && CFG.prices.article_archive === 3, 'an article: 12p fresh, 9p new, 6p current, 3p archive (the reference\'s numbers)')
check(CFG.prices.company_new === 5 && CFG.prices.company_archive === 2 && CFG.prices.event_fresh === 4 && CFG.prices.person === 1 && CFG.prices.account === 0, 'a company 5p new and 2p archived, an event 4p fresh, a person 1p, the account free')
check(/^https:\/\/buy\.stripe\.com\/6oUfZ9ez65vVgU2fY15os04\?client_reference_id=web-summit-newsroom$/.test(CFG.topup.link) && CFG.topup.amount === 500, 'the top-up is the live payment link, £5.00, with this site\'s reference')
check(kindOf('article', daysAgo(0)) === 'article_fresh' && kindOf('article', daysAgo(3)) === 'article_new' && kindOf('company', daysAgo(20)) === 'company_current' && kindOf('event', daysAgo(90)) === 'event_archive' && kindOf('person', daysAgo(90)) === 'person', 'freshness: a day fresh, a week new, a month current, then archive; reference pages do not decay')

// --- the rules -------------------------------------------------------------------------------------------------
const b = browser()
let m = await load(b, '/articles/an-older-article.html')
m.open({ kind: kindOf('article', daysAgo(60)), date: daysAgo(60), topics: ['article'], title: 'An older article' }); m.reach(0)
let s = st(b)
check(s.log[0].price === 3 && s.log[0].cost === 0.3 && s.balance === 499.7, `opening an archived article charges a tenth of 3p (${s.log[0].cost}p)`)
m.reach(0.5); s = st(b)
check(s.log[0].cost === 1.5, `half of it read costs half (${s.log[0].cost}p)`)
m.reach(0.3); s = st(b)
check(s.log[0].cost === 1.5, 'reading is never un-charged by a smaller share later in the page')
m.reach(1); s = st(b)
check(s.log[0].cost === 3 && s.balance === 497, `read to the end, the whole price (balance ${s.balance})`)
m.rate('useful', 5); s = st(b)
check(s.log[0].cost === 6 && s.balance === 494, 'rated excellent, it costs double')
m.rate('useful', 1); s = st(b)
check(s.log[0].cost === 0 && s.balance === 500, 'rated not useful, it is free')
m.rate('useful', 3)
m.decline('clickbait'); s = st(b)
check(s.balance === 500 && s.log[0].declined && s.log[0].declined.reason === 'clickbait' && s.declined === 3, 'declining refunds the page and keeps the reason')
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
check(s.balance === -10 && m.status === 'reading', `the balance goes below zero and the page still opens (${s.balance})`)
// a company page, new
m = await load(b, '/companies/replit/')
m.open({ kind: kindOf('company', daysAgo(2)), date: daysAgo(2), title: 'Replit' }); m.reach(1)
check(st(b).log[0].kind === 'company_new' && st(b).log[0].cost === 5, 'a company profile from two days ago costs 5p read to the end')
// a new session charges again
b.session = new Store()
m = await load(b, '/companies/replit/')
m.open({ kind: kindOf('company', daysAgo(2)), date: daysAgo(2), title: 'Replit' }); m.reach(0)
check(st(b).log.length === 4 && st(b).log[0].cost === 0.5, 'a new browser session opens the page again, from a tenth')
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
check(m2.status === 'reading' && st(b2).log[0].cost === 1, 'a stored paused flag does not stop the meter')
// storage that refuses
const b3 = browser(); b3.local.fail = true; b3.session.fail = true
const m3 = await load(b3, '/articles/x.html')
m3.open({ kind: kindOf('article', daysAgo(0)), title: 'x' }); m3.reach(1)
check(m3.noStorage && m3.status === 'reading' && m3.state.balance === 488, 'storage that refuses: the meter says so, counts this page in memory, and blocks nothing')

console.log(failed ? `${failed} FAILED` : 'ALL METER CHECKS PASS')
process.exit(failed ? 1 : 0)
