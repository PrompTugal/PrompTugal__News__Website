// The reading meter (brief 7): pence per page, by the kind of page and how fresh it is, times the share read, never
// under a tenth, once per page per browser session, never blocking. The model and the component are newsroom.sgit.ai's
// (sg-meter v1.5.0, vendored unedited at assets/components/sg-meter/v1/v1.5/v1.5.0/) with php.oct.2026.newsroom.sgit.ai's
// price table (type x freshness). One data file, data/billing/prices.json, makes both the meter's config
// (api/v1/billing/meter.json, read by assets/meter/meter.js on every page) and the published billing page
// (/account/billing.html), so the page and the meter cannot disagree. The top-up link is data/billing/topup.json.
// Everything about a reader stays in their browser; nothing here is sent anywhere.
import fs from 'node:fs'
import crypto from 'node:crypto'

export const order = 70
export const name = 'billing'

export const PRICES = 'data/billing/prices.json'
export const TOPUP = 'data/billing/topup.json'
export const METER = 'assets/components/sg-meter/v1/v1.5/v1.5.0'
export const CONFIG = 'api/v1/billing/meter.json'
const BILLING_PAGE = 'account/billing.html'

// half up, as the reference's tables are (4.5 -> 5, 1.5 -> 2)
const round = x => Math.floor(x + 0.5)

/** Every price the meter can charge, in pence: `type` (the base) and, for a type that decays, `type_tier`. */
export function priceTable(P) {
    const out = {}
    for (const t of P.types) {
        out[t.type] = t.base
        if (t.decays) for (const tr of P.tiers) out[`${t.type}_${tr.tier}`] = Math.max(P.floor, round(t.base * tr.multiplier))
    }
    return out
}

/** The tier of a page of the given age in days, as the browser works it out (assets/meter/meter.js does the same). */
export function tierOf(P, days) {
    for (const t of P.tiers) if (t.max_days != null && days <= t.max_days) return t.tier
    return P.tiers[P.tiers.length - 1].tier
}

/** The payment link with this site's reference on it, so a payment says which site it came from. */
export function payLink(T) {
    if (!T.link) return ''
    return T.client_reference_id ? `${T.link}?client_reference_id=${encodeURIComponent(T.client_reference_id)}` : T.link
}

/** The config sg-meter-core reads (window.SG_METER_CONFIG), plus what this site's glue needs to price a page. */
export function meterConfig(ctx) {
    const P = ctx.readJSON(PRICES), T = ctx.readJSON(TOPUP)
    return {
        about: `The reading meter's config for ${ctx.HOST}, made by newsroom/build/features/billing.mjs from ${PRICES} and ${TOPUP}. sg-meter-core (${METER}/sg-meter-core.js) reads it as window.SG_METER_CONFIG; assets/meter/meter.js adds the page's kind (page-type, and its freshness tier when the type decays).`,
        meter: P.meter,
        version: ctx.VERSION,
        storageKey: P.storage_key,
        start: P.start,
        symbol: P.symbol,
        currency: P.currency,
        newDays: P.new_days,
        depth: true,
        minDepth: P.min_share,
        floor: P.floor,
        prices: priceTable(P),
        types: Object.fromEntries(P.types.map(t => [t.type, { as: t.as, base: t.base, decays: t.decays }])),
        tiers: P.tiers.map(t => ({ tier: t.tier, max_days: t.max_days, multiplier: t.multiplier })),
        rating: P.rating,
        topup: { amount: T.amount, link: payLink(T) },
        returns_to: T.returns_to,
        our_return: T.our_return,
        verified: T.verified,
        links: { account: 'account/index.html', topup: 'account/top-up.html', how: BILLING_PAGE },
        links2: { newsroom: 'account/index.html', personas: 'account/index.html' },
        autoKeep: true,
    }
}

const money = (P, p) => `${P.symbol}${(p / 100).toFixed(2)}`
const pence = p => `${p}p`

function billingMd(ctx) {
    const P = ctx.readJSON(PRICES), T = ctx.readJSON(TOPUP), table = priceTable(P)
    const head = `| Page type | Priced as | Base | ${P.tiers.map(t => `${t.tier[0].toUpperCase()}${t.tier.slice(1)} (${t.max_days != null ? `up to ${t.max_days} day${t.max_days === 1 ? '' : 's'}` : 'older'}, x${t.multiplier})`).join(' | ')} | Pages | Why |`
    const sep = `|${'---|'.repeat(5 + P.tiers.length)}`
    const rows = P.types.map(t => `| **${t.type}** | ${t.as} | ${pence(t.base)} | ${P.tiers.map((tr, i) => t.decays ? pence(table[`${t.type}_${tr.tier}`]) : (i === 0 ? pence(t.base) : '·')).join(' | ')} | ${ctx.md.cell(t.pages)} | ${ctx.md.cell(t.why)} |`)
    const ref = P.reference_types || []
    return [
        `This is the table the meter in your browser charges from: both are made from one data file (\`${PRICES}\`), so this page and the meter cannot disagree. The model is the one newsroom.sgit.ai and php.oct.2026.newsroom.sgit.ai run, with this site's own kinds of page mapped onto it. [Your reading account](index.md) shows what you have read and what it cost.`,
        '',
        '## The formula {#formula}',
        '',
        `\`${P.formula}\`, with a floor of ${pence(P.floor)}. You start with ${money(P, P.start)} of credit in this browser.`,
        '',
        '## What a page costs, read to the end {#prices}',
        '',
        head, sep, ...rows,
        '',
        `A dot means the price does not decay: that kind of page costs the same at any age. ${P.age_from}`,
        '',
        '## How fresh a page is {#tiers}',
        '',
        ...P.tiers.map(t => `- **${t.tier[0].toUpperCase()}${t.tier.slice(1)}** (${t.max_days != null ? `up to ${t.max_days} day${t.max_days === 1 ? '' : 's'} old` : 'older'}, x${t.multiplier}). ${t.why}`),
        '',
        '## The rules {#rules}',
        '',
        ...P.rules.map((r, i) => `${i + 1}. ${r}`),
        '',
        '## Rating a page {#rating}',
        '',
        `At the foot of every metered page you can say how useful it was, on five steps that start in the middle. The step sets the price: ${P.rating.price.map((m, i) => `${i + 1} is ${m === 0 ? 'free' : m === 1 ? 'the price' : `x${m}`}`).join(', ')}. Not paying at all, with a reason, is there too: the charge is refunded and the reason kept in your history, in this browser.`,
        '',
        '## Topping up {#topup}',
        '',
        `One payment of ${money(P, T.amount)} on Stripe's own page adds ${money(P, T.amount)} to the balance in your browser: no account, nothing renews. The page the payment returns to adds the credit once per payment reference and cannot check the payment: unverified by design, as on newsroom.sgit.ai. [Top up](top-up.md).`,
        '',
        '## The reference table {#reference}',
        '',
        'The kinds of page the reference model prices, and why. Each of this site\'s types above is priced as one of them, at its base.',
        '',
        '| Reference type | Base | Decays | Why |',
        '|---|---|---|---|',
        ...ref.map(r => `| ${r.type} | ${pence(r.base)} | ${r.decays ? 'yes' : 'no'} | ${ctx.md.cell(r.why)} |`),
        '',
        `For agents: the meter's config, with every price, is [api/v1/billing/meter.json](../${CONFIG}). The component is newsroom.sgit.ai's sg-meter v1.5.0, vendored unedited at \`${METER}/\`.`,
    ].join('\n')
}

export function pages(ctx) {
    return [{
        rel: BILLING_PAGE, src: PRICES, type: 'site',
        title: 'How the reading meter prices a page',
        summary: 'Every page has a price of a few pence, set by what kind of page it is and how fresh it is; you pay the share of it you read, never less than a tenth. The table below is the one the meter charges from.',
        md: billingMd(ctx),
        crumbs: [['account/index.html', 'Your account'], [null, 'How pages are priced']],
    }]
}

export const assets = { css: ['assets/meter/meter.css'], js: ['assets/meter/meter.js'] }

export function api(ctx) {
    return [{ path: CONFIG, data: meterConfig(ctx), schema: null }]
}

export function llms(ctx) {
    const P = ctx.readJSON(PRICES), T = ctx.readJSON(TOPUP)
    return [
        '## The reading meter',
        `- Every page except the meter's own costs a few pence, from ${money(P, P.start)} of starting credit kept in the reader's browser (localStorage key \`${P.storage_key}\`): a base price per page type (the \`page-type\` meta tag) times a freshness multiplier from the page's date (\`page-date\`), times the share read, never under a tenth; once per page per browser session; never blocking; the balance can go below zero; a reader can rate a page (free to double) or decline to pay and say why.`,
        `- The prices: ${ctx.BASE}${BILLING_PAGE.replace(/\.html$/, '.md')} (the table) and ${ctx.BASE}${CONFIG} (the meter's config, same data).`,
        `- Top-ups: one payment of ${money(P, T.amount)} through a Stripe Payment Link (${T.link}); the return page adds the credit once per payment reference, unverified by design.`,
        `- Agents reading the markdown twins or llms.txt are not metered: the meter runs only in a browser, on the HTML pages.`,
        '',
    ].join('\n') + '\n'
}

// ------------------------------------------------------------ the gate's checks for this feature
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const SECRET = /\b(sk|rk)_(live|test)_[A-Za-z0-9]{8,}|\bwhsec_[A-Za-z0-9]{8,}/

function walkFiles(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const n of fs.readdirSync(dir)) { const p = `${dir}/${n}`; if (fs.statSync(p).isDirectory()) walkFiles(p, out); else out.push(p) }
    return out
}

/** The rows `| \`file\` | \`sha256\` |` of a VENDOR.md, checked against the files beside it (folder `base`). */
export function vendorProblems(gate, vendorMd, base) {
    const out = []
    if (!fs.existsSync(gate.R(vendorMd))) return [`${vendorMd} is missing`]
    const rows = [...gate.text(vendorMd).matchAll(/\| `([^`]+)` \| `([0-9a-f]{64})` \|/g)]
    if (!rows.length) out.push(`${vendorMd} records no SHA-256`)
    for (const [, f, h] of rows) {
        const p = gate.R(`${base}/${f}`)
        if (!fs.existsSync(p)) out.push(`${base}/${f}: recorded in ${vendorMd} and missing`)
        else if (sha(p) !== h) out.push(`${base}/${f}: its SHA-256 differs from ${vendorMd}: a vendored file was edited`)
    }
    return out
}

export function validate(gate) {
    const out = []
    const P = gate.json(PRICES), T = gate.json(TOPUP)
    // every page type the gate knows has a price, and every type is priced as a reference type at its base
    const known = (gate.text('newsroom/build/validate.js').match(/const TYPES = \[([^\]]+)\]/) || [, ''])[1].match(/'([a-z]+)'/g).map(s => s.slice(1, -1))
    const mine = new Map(P.types.map(t => [t.type, t]))
    for (const t of known) if (!mine.has(t)) out.push(`${PRICES}: page type "${t}" has no price`)
    const ref = new Map((P.reference_types || []).map(r => [r.type, r]))
    for (const t of P.types) {
        const r = ref.get(t.as)
        if (!r) out.push(`${PRICES}: ${t.type} is priced as "${t.as}", which is not a reference type`)
        else if (r.base !== t.base || r.decays !== t.decays) out.push(`${PRICES}: ${t.type} is priced as ${t.as} but its base or decay differs from the reference's`)
        if (t.type === 'account' ? t.base !== 0 : t.base < P.floor) out.push(`${PRICES}: ${t.type} costs ${t.base}p (only the meter's own pages are free, and nothing else is under the floor)`)
    }
    // the published config is the table
    if (gate.generated.has(CONFIG)) {
        const c = gate.json(CONFIG), want = priceTable(P)
        if (JSON.stringify(c.prices) !== JSON.stringify(want)) out.push(`${CONFIG}: its prices are not ${PRICES}'s table`)
        if (c.storageKey !== P.storage_key || c.start !== P.start) out.push(`${CONFIG}: storage key or starting credit differs from ${PRICES}`)
        if (c.topup.amount !== T.amount || !String(c.topup.link).startsWith(T.link)) out.push(`${CONFIG}: the top-up differs from ${TOPUP}`)
    } else out.push(`${CONFIG} was not built`)
    // the published page carries every price of the table
    if (gate.generated.has(BILLING_PAGE.replace(/\.html$/, '.md'))) {
        const twin = gate.text(BILLING_PAGE.replace(/\.html$/, '.md')), table = priceTable(P)
        for (const t of P.types) {
            const row = twin.split('\n').find(l => l.startsWith(`| **${t.type}** |`))
            if (!row) { out.push(`${BILLING_PAGE}: no row for ${t.type}`); continue }
            const cells = row.split('|').map(s => s.trim())
            const want = t.decays ? P.tiers.map(tr => `${table[`${t.type}_${tr.tier}`]}p`) : [`${t.base}p`]
            for (const w of want) if (!cells.includes(w)) out.push(`${BILLING_PAGE}: the ${t.type} row does not show ${w}`)
        }
    }
    // the meter is vendored unedited, at its immutable path
    out.push(...vendorProblems(gate, 'assets/components/sg-meter/VENDOR.md', 'assets/components'))
    for (const f of ['sg-meter-core.js', 'sg-meter.js', 'sg-meter.css', 'sg-meter.tpl']) if (!fs.existsSync(gate.R(`${METER}/${f}`))) out.push(`${METER}/${f} is missing`)
    // a payment link is public; a Stripe key or webhook secret never belongs here
    for (const f of [...walkFiles(gate.R('data/billing')), ...walkFiles(gate.R('assets/meter')), ...walkFiles(gate.R('assets/vault'))])
        if (SECRET.test(fs.readFileSync(f, 'utf8'))) out.push(`${f.slice(gate.R('').length)}: a Stripe secret key, restricted key or webhook secret shape: never in the repository`)
    if (T.link && !/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/.test(T.link)) out.push(`${TOPUP}: the link is not a Stripe Payment Link`)
    return out
}
