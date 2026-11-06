// Observability (observability@PrompTugal.dinis, 6 November 2026, at Dinis Cruz's word: "replicate what we have on
// web-summit.sgit.ai ... report in that admin section, both what we have today, and the new promptugal site").
// Two things:
//   1. the sender on every page: assets/obs/obs.js (a view and a read per page load, sealed in the browser to the
//      drain key and written to an append lane of PrompTugal's private data vault; config assets/obs/obs.json);
//   2. the explorer, /newsroom/observability/: PrompTugal's traffic only (Dinis, 6 November: "here we shouldn't see the
//      traffic from the other one"), read live in the reader's browser from the public vault's published read key
//      (data/newsroom/observability/vaults.json) by assets/obs/obs-view.js, the team site's explorer ported (overview,
//      dashboard, graph of page flows, agents, pages, people, days and hours, Behind the scenes), with sgit.ai's vault
//      reader (assets/vendor/sgit-ai/2026-11-05/vault-embed.js). A browser holding Dinis's key (assets/obs/keyring.js,
//      his public key in board/person-keys.json) opens the vault keys sealed to him: Open vault, and Drain.
// The drain is newsroom/tools/obs/obs_drain.py (hourly); the agents log their runs with newsroom/tools/agent-log.mjs.
// Everything here is public, at Dinis's word, and the page says so.
import path from 'node:path'
import { esc } from '../lib/markdown.mjs'
import { TABS } from './newsroom.mjs'

export const order = 92
export const name = 'observability'
export const assets = { js: ['assets/obs/obs.js'] }

const REL = 'newsroom/observability/index.html'
const VAULTS = 'data/newsroom/observability/vaults.json'
const href = (from, to) => (path.posix.relative(path.posix.dirname(from), to) || path.posix.basename(to))
const READ_KEY = /^sgit_public_read_[0-9a-f]{64}$/, VID = /^[a-z0-9]{8,12}$/

export function pages(ctx) {
    const vs = ctx.readJSON(VAULTS).vaults
    for (const v of vs) if (!READ_KEY.test(v.read_key) || !VID.test(v.vault_id)) throw new Error(`${VAULTS}: "${v.name}" needs vault_id and a read_key of the form sgit_public_read_<64 hex> (never a vault key)`)
    const obs = ctx.readJSON('assets/obs/obs.json')
    const tabsHtml = `<nav class="adm-tabs" aria-label="Control centre">${TABS.map(([r, l]) => `<a href="${href(REL, r)}"${r === REL ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`
    const tabsMd = `**Control centre:** ${TABS.map(([r, l]) => r === REL ? `**${l}**` : `[${l}](${ctx.link(REL, r)})`).join(' · ')}`
    const v = vs.find(x => x.id === 'promptugal')
    const widget = `<div class="obs-view" data-view="explore" data-base="../../" data-endpoint="https://dev.send.sgraph.ai" data-vault="${v.vault_id}" data-key="${v.read_key}">` +
        `<p class="meta" data-note>Opening vault <code>${v.vault_id}</code> with its published read key, decrypting in your browser…</p><div data-out></div>` +
        `<noscript><p>This explorer is read from the vault by your browser; it needs JavaScript. The data is in the vault below, readable with any sgit client from its read key.</p></noscript></div>`
    const vaultRows = vs.map(v => `| ${v.site} | ${v.name} | \`${v.vault_id}\` | \`${v.read_key}\` | [open](https://dev.vault.sgraph.ai/#${v.read_key}:${v.vault_id}) |`).join('\n')
    const md = `@@OBS:0@@

**Public, for now, at Dinis Cruz's word** (6 November 2026: *"for now all data is also public"*). Who reads promptugal.news and what its agents do, read straight out of an encrypted vault, in your browser, from its published read key: anyone can read what is here, and nothing here names a reader. Anonymous readers are only ever counts: no IP address, no cookie, no user-agent string and no fingerprint is collected, the place lookup's IP is never read, and a city is shown only once five or more tabs came from it. Every record is an untrusted claim: the lanes' tokens are public, so rows can be forged or flooded; a signed agent run names a key on board/keys.json. Click anything: every page, agent, day and hour is a link to its own view, and **Behind the scenes** (the tab on the right) shows each encrypted object fetched and decrypted. Only this site's traffic is here; the team site's is on [its own section](https://web-summit.sgit.ai/observability/index.html).

@@OBS:1@@

## How it works {#how}

| Part | Where | What it does |
|---|---|---|
| The sender | \`assets/obs/obs.js\`, \`assets/obs/obs.json\`, on every page | a **view** when a page loads, a **read** the first time the tab is hidden or closed; the place once per tab (${(obs.geo || []).map(u => new URL(u).host).join(', then ')}, 2.5 s, country, region and city only); sealed to the drain key (${obs.recipient.fingerprint}) and written to one of ${obs.lanes.site.length} append lanes |
| The agents' lane | \`newsroom/tools/agent-log.mjs\` | one record per agent run (what it read, what it did), signed with the agent's session key, into one of ${obs.lanes.agents.length} lanes |
| The data vault | \`${obs.vault_id}\`, **private** | the lanes, the drain key, every record by the hour it happened; private because its read key would give out the lanes' enum key and the drain key, and its rows hold the city of each tab |
| The drain | \`newsroom/tools/obs/obs_drain.py\`, hourly | load (list, fetch), extract (open, verify), save raw, transform each new hour once, save public: the team site's LETS (\`newsroom/tools/obs/obs_lets.py\`, copied) |
| The public vault | \`${vs.find(v => v.id === 'promptugal')?.vault_id}\`, **read key published** | \`latest/\` (summary, pages, agents, runs, places, timeline, flows, feed), a folder per day and hour, \`data/public.json\` |

The vaults' keys are sealed to Dinis's site key (his public key is in \`board/person-keys.json\`; the envelope \`newsroom/observability/sealed/dinis.json\`, ws-ecies-1). In a browser holding that key, this page shows **🔓 Open vault** (the data vault in SG/Vault, in a new window, with its vault key) and **⬇ Drain** (the lanes drained from the browser into the data vault's inbox, still sealed; the hourly drain verifies and counts them). To give this browser the key: open this page with your key link (\`#key=…\`) once, or paste it under Behind the scenes.

## The vaults {#vaults}

| Site | Vault | Id | Read key (public) | |
|---|---|---|---|---|
${vaultRows}

## For agents {#agents}

At the end of every run, every agent of the PrompTugal team logs it (the team site's WS-160):

\`\`\`
node newsroom/tools/agent-log.mjs --agent <role>@PrompTugal.dinis --read repo:CLAUDE.md,repo:REALITY.md,<every URL read> --commits auto --did release:<vX.Y.Z> --trigger person --notes "one line"
\`\`\`

It signs the record with your session key, so the drain names you once its public half is in this repository's board/keys.json (CLAUDE.md, Identity). In a cloud session it uses the proxy by itself.
`
    const twin = md.replace('@@OBS:0@@', tabsMd).replace('@@OBS:1@@', 'The explorer itself is drawn in the browser from the vault below.')
    return [{
        rel: REL, title: 'Observability: who reads what, and which agents ran', type: 'site', src: VAULTS, date: ctx.TODAY, toc: [],
        summary: 'Who reads promptugal.news and what its agents do: traffic by group and hour, pages, page-to-page flows, places, every agent\'s runs, read live in your browser from the public vault. Click anything. Public, at Dinis Cruz\'s word.',
        crumbs: [['newsroom/index.html', 'Control centre'], [null, 'Observability']],
        assets: { css: ['assets/newsroom/newsroom.css'], js: ['assets/vendor/sgit-ai/2026-11-05/vault-embed.js', 'assets/obs/obs-view.js', 'assets/obs/keyring.js'] },
        md, twinMd: twin,
        postHtml: html => html.replace('<p>@@OBS:0@@</p>', tabsHtml).replace('<p>@@OBS:1@@</p>', widget),
    }]
}

export const llms = ctx => `## Observability\n- [newsroom/observability/](${ctx.BASE}newsroom/observability/index.md): who reads promptugal.news (by group, page, flow, place and hour) and which agents ran, read in the browser from its public vault (id and read key on the page). Agents log runs with newsroom/tools/agent-log.mjs.\n\n`

export function validate(gate) {
    const errors = []
    const cfg = gate.json('assets/obs/obs.json')
    if (!cfg.recipient?.encrypt?.includes('BEGIN PUBLIC KEY') || /PRIVATE/.test(JSON.stringify(cfg))) errors.push('assets/obs/obs.json: the recipient must be a public key, and nothing private')
    if (!(cfg.lanes?.site?.length && cfg.lanes?.agents?.length)) errors.push('assets/obs/obs.json: needs site and agents lanes')
    for (const v of gate.json(VAULTS).vaults) if (!READ_KEY.test(v.read_key)) errors.push(`${VAULTS}: ${v.id} holds something that is not a published read key`)
    if (!gate.generated.has(REL)) errors.push(`${REL} was not written`)
    else if (gate.text(REL).includes('@@OBS:')) errors.push(`${REL}: a placeholder was left in`)
    return errors
}
