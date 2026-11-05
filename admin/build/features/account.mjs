// The reader's account and their vault: /account/ (balance, history, receipts, export, all in the browser), the
// top-up and the page a payment returns to, and the vault login page; on every page, the vault's boot script
// (assets/vault/boot.js), which puts the Vault button in the top bar, opens the pane on the right, and gives other
// features window.__vault (save, load, list; see assets/vault/README.md). Ported from newsroom.sgit.ai's account pages
// and its Vault pane (a beta there). The pages carry mount points that assets/meter/meter.js and assets/vault/vault.js
// fill; the markdown twins say in words what the browser shows.
import { payLink, TOPUP, PRICES, vendorProblems } from './billing.mjs'

export const order = 71
export const name = 'account'

export const VAULT = 'data/billing/vault.json'
const CRUMB = ['account/index.html', 'Your account']

// a mount point: a paragraph holding only the token becomes a div the browser fills; the twin gets the words instead
const token = id => `NRMOUNT-${id}`
const mount = (id, view, fallbackHtml) => ({ id, view, fallbackHtml })
function withMounts(mounts) {
    return {
        postHtml: html => mounts.reduce((h, m) => h.replace(`<p>${token(m.id)}</p>`, `<div id="nr-${m.id}" class="nr-mount" data-view="${m.view}"><div class="nr-noscript">${m.fallbackHtml}</div></div>`), html),
    }
}

const money = (P, p) => `${P.symbol}${(p / 100).toFixed(2)}`
const hostOf = u => { try { return new URL(u.replace('{CHECKOUT_SESSION_ID}', 'x')).host } catch { return '' } }

export function pages(ctx) {
    const P = ctx.readJSON(PRICES), T = ctx.readJSON(TOPUP), V = ctx.readJSON(VAULT)
    const start = money(P, P.start), amount = money(P, T.amount)
    const elsewhere = hostOf(T.returns_to) !== ctx.HOST
    const returnHost = hostOf(T.returns_to)
    const where = `**Where your data is kept.** Your balance, what you have read and your receipts are kept in this browser's storage, and nothing is sent anywhere unless you choose: a payment (made on Stripe's own page) or [your vault](vault.md). There is no account to make. A new browser, a private window or clearing the site's data starts again with ${start} and no history.`

    const account = {
        rel: 'account/index.html', type: 'account', src: PRICES,
        title: 'Your reading account',
        summary: `A reading meter kept in your browser: every page costs a few pence, charged by how much of it you read, from ${start} of starting credit. Credit can go below zero and nothing is blocked.`,
        md: [
            token('account'),
            '',
            where,
            '',
            '## How it works {#how}',
            '',
            `- **You start with ${start}** of credit in this browser.`,
            `- **You pay for what you read.** Every page has a price of a few pence, set by what kind of page it is and how fresh it is ([the table](billing.md)); you pay the share of it you read on this device, never less than a tenth. Opening a page and leaving costs the minimum.`,
            '- **Once per page per browser session.** Reading further later tops the same charge up; going back costs nothing more.',
            '- **It never blocks.** Credit can go below zero and every page still opens.',
            '- **You can say what a page was worth.** At its foot, rate how useful it was (free to double the price), or decline to pay and say why: the charge is refunded and the reason kept.',
            `- **Top up when it feels fair:** [${amount} on Stripe's page](top-up.md), one payment, nothing renews.`,
            '- **Carry it to another device** with [your vault](vault.md), an encrypted vault opened with your passkey (a beta).',
            '',
            '## Why it works like this {#why}',
            '',
            `To find out whether people pay for reading, a few pence at a time, when nothing forces them to. It is the same meter as newsroom.sgit.ai's, with the same rules; [how a page is priced](billing.md) is published, and generated from the same data file as the meter. Reading this site's markdown twins or [llms.txt](../llms.txt) is not metered.`,
        ].join('\n'),
        twinMd: null,
        ...withMounts([mount('account', 'account', `<p>Your balance, what you have read, your receipts and Export as JSON appear here. The reading account needs JavaScript: it lives in your browser and nowhere else.</p>`)]),
        crumbs: [[null, 'Your account']],
    }
    account.twinMd = account.md.replace(token('account'), `*In a browser, this page shows your balance (you start with ${start}), every page you have read with what it cost, your receipts, and Export as JSON and Restore. It needs JavaScript: the account lives in the reader's browser and nowhere else.*`)

    const afterPay = elsewhere
        ? `**What happens after you pay.** For now this site uses newsroom.sgit.ai's payment link, which is fully configured and takes real payments. Stripe sends you back to the page set on that link, which is **${returnHost}'s** topped-up page, not ours, so the credit lands on newsroom.sgit.ai's own meter. To add it here too, copy the address of the page Stripe returned you to (it ends in \`?session_id=...\`) and paste it into [this site's topped-up page](topped-up.md): it adds ${amount} here, once per payment. When this site has a payment link of its own, Stripe will return you here directly and this paragraph will go.`
        : `**What happens after you pay.** Stripe returns you to [this site's topped-up page](topped-up.md), which adds ${amount} to the balance in this browser, once per payment.`
    const topup = {
        rel: 'account/top-up.html', type: 'account', src: TOPUP,
        title: 'Top up',
        summary: `Add ${amount} of reading credit to the balance kept in your browser: one payment on Stripe's own page, no account, nothing renews.`,
        md: [
            token('topup'),
            '',
            afterPay,
            '',
            `**What is checked.** Nothing, by design: a static page cannot verify a payment, so the topped-up page adds the credit once per payment reference and trusts it, as newsroom.sgit.ai's does. We never see your card; Stripe does.`,
            '',
            '**It is a choice, never a wall.** Every page opens whatever your balance; a top-up is a way of saying the reading was worth something.',
            '',
            where,
        ].join('\n'),
        crumbs: [CRUMB, [null, 'Top up']],
        ...withMounts([mount('topup', 'topup', `<p>Topping up needs JavaScript: the balance lives in your browser. The payment page itself is <a href="${payLink(T)}">Stripe's</a>.</p>`)]),
    }
    topup.twinMd = topup.md.replace(token('topup'), `*In a browser: your balance now, then "Continue to pay ${amount}", which opens Stripe's page: ${payLink(T) || 'no payment link is configured'}.*`)

    const topped = {
        rel: 'account/topped-up.html', type: 'account', src: TOPUP,
        title: 'Topped up',
        summary: `The page a top-up returns to: it adds ${amount} to the balance kept in your browser, once per payment reference.`,
        md: [
            token('topped'),
            '',
            `This is the page a payment returns to. It adds the top-up to the balance kept in this browser, once per payment reference (Stripe's checkout session id), and it does not, and cannot, verify the payment. Building its address by hand gives credit on your own screen and costs the site nothing; that is accepted, as on newsroom.sgit.ai.`,
            '',
            elsewhere ? `If you paid from [the top-up page](top-up.md) and Stripe returned you to ${returnHost}, paste that page's address here and the credit is added to this site too. The two sites keep separate balances, each in its own storage.` : `[Back to the top-up page](top-up.md).`,
        ].join('\n'),
        crumbs: [CRUMB, [null, 'Topped up']],
        ...withMounts([mount('topped', 'topped-up', '<p>Adding the credit needs JavaScript: the balance lives in your browser.</p>')]),
    }
    topped.twinMd = topped.md.replace(token('topped'), '*In a browser, with a payment reference in the address (`?session_id=...`), this page adds the top-up once; without one it offers a box to paste the address Stripe returned you to.*')

    const vault = {
        rel: 'account/vault.html', type: 'account', src: VAULT,
        title: 'Your vault',
        summary: 'Sign in with a passkey and save your reading account (what you read, your top-ups, your ratings) and what other parts of this site keep for you into an encrypted vault only you can open, then open it on another device. A beta, after newsroom.sgit.ai\'s.',
        md: [
            token('vault'),
            '',
            'Your credit and history live in this browser. A vault is their second home: an encrypted folder on a vault server that only you can open, with no password and no email. The page encrypts everything before it leaves; the server holds ciphertext.',
            '',
            '## How it works {#how}',
            '',
            '1. **Sign in with a passkey.** Your phone or laptop unlocks it, the way it unlocks your apps. The passkey gives this page 32 bytes that derive the address and key of a small door vault; nothing is stored to be found.',
            '2. **Create your vault, once.** Three vaults are made: the door, a master that holds your keys, and your reader vault that holds your data. You are shown a recovery code once, for a device without your passkey.',
            '3. **Update it from each device.** This device\'s reads, top-ups and ratings are written as one file of its own, encrypted, in one commit. Nothing is written until you press Update.',
            '4. **Open it on another device** with the same passkey (or the recovery code), and bring your other devices\' reading into that browser, so the balance is the whole account\'s.',
            '',
            '## What creating a vault needs {#access-key}',
            '',
            `${V.access_key.what}`,
            '',
            `**Where it comes from:** ${V.access_key.where}`,
            '',
            `${V.access_key.never}`,
            '',
            '## What is in it {#contents}',
            '',
            '- `activity/devices/<device>.json`: each device\'s own reads (with the share read, the rating and any decline), top-ups and personas, rewritten whole by that device only, so two devices never conflict.',
            '- `activity/account.json`: the one starting credit of the account; totals are worked out from the records, never copied.',
            '- `apps/<feature>/...`: what other parts of this site save for you through the vault, such as conversations with the newsroom\'s agent. Each feature writes only under its own folder.',
            '',
            `**The vault server** is ${V.endpoint}, the one newsroom.sgit.ai uses; the library is the pinned copy that runs dev.vault.sgraph.ai (${V.library}). The keys live in memory and, for the life of this tab, in its session storage; none is written to local storage, and none is sent anywhere but the vault server.`,
            '',
            'This works like the reading vault on newsroom.sgit.ai, where it is a beta. Nothing about the vault is needed to read this site. [Your reading account](index.md).',
        ].join('\n'),
        crumbs: [CRUMB, [null, 'Your vault']],
        ...withMounts([mount('vault', 'vault', '<p>The vault needs JavaScript: it is opened, and encrypted, in your browser.</p>')]),
    }
    vault.twinMd = vault.md.replace(token('vault'), '*In a browser, this page opens the vault pane on the right: sign in with a passkey, create your vault (with an access key), update it from this device, or open it from another.*')

    return [account, topup, topped, vault]
}

export const assets = { css: ['assets/vault/vault.css'], js: ['assets/vault/boot.js'] }

/** The pane's config, from data/billing/vault.json: public facts only (the endpoint, the constant, where the key will come from). */
export function api(ctx) {
    const V = ctx.readJSON(VAULT)
    return [{
        path: 'api/v1/billing/vault.json', schema: null,
        data: {
            about: `The vault pane's config for ${ctx.HOST}, from ${VAULT} by admin/build/features/account.mjs. Public facts only: no key, token or passphrase is ever here.`,
            endpoint: V.endpoint, door_constant: V.door_constant, library: V.library,
            access_key: { status: V.access_key.status, what: V.access_key.what, where: V.access_key.where },
            hook: 'window.__vault: save(path, json), load(path), list(prefix), status(), open(tab); see assets/vault/README.md',
        },
    }]
}

export function llms(ctx) {
    const V = ctx.readJSON(VAULT)
    return [
        '## Your account and your vault',
        `- ${ctx.BASE}account/index.md: the reading account, kept in the reader's browser (balance, history, receipts, export as JSON).`,
        `- ${ctx.BASE}account/top-up.md and ${ctx.BASE}account/topped-up.md: the top-up and the page a payment returns to.`,
        `- ${ctx.BASE}account/vault.md: the vault (a beta, after newsroom.sgit.ai's): sign in with a passkey, create the vault once with an access key (status: ${V.access_key.status}), update it with this device's reads, top-ups and ratings, open it from another device. Encrypted in the browser; the server (${V.endpoint}) holds ciphertext.`,
        '- For the site\'s own features (in the browser): `window.__vault.save(path, json)` keeps data for the reader, in their browser at once and in their vault when it is open; documented in assets/vault/README.md in the source repository.',
        '',
    ].join('\n') + '\n'
}

export function validate(gate) {
    const out = []
    const V = gate.json(VAULT)
    if (/token|key/i.test(V.endpoint)) out.push(`${VAULT}: the endpoint looks like it carries a credential`)
    // the pages the meter's links point at exist, and the vault library is the pinned, unedited copy
    for (const p of ['account/index.html', 'account/top-up.html', 'account/topped-up.html', 'account/vault.html', 'account/billing.html'])
        if (!gate.generated.has(p)) out.push(`${p} was not built`)
    out.push(...vendorProblems(gate, 'assets/vendor/sg-vault/v0.2.3/VENDOR.md', 'assets/vendor/sg-vault/v0.2.3'))
    out.push(...vendorProblems(gate, 'assets/vendor/sg-vault/VENDOR.md', 'assets/vendor/sg-vault'))
    return out
}
