// /principles/ and /report/ for promptugal.news (Dinis, 18 November 2026, about 15:00 UTC: one set of principles and one
// way to report for every site; an encrypted drop and a monitored inbox: board/guidance/2026-11-18-principles-and-reports.md).
// Words from events.b@'s draft (events.promptugal.news/principles/ and /report/), in assets/principles/principles.md and
// assets/report/report.md, for journalist@ to revise. The corrections log from assets/report/corrections.json. The report
// page is bare (no obs.js, no site-wide script, a meta CSP: nothing that identifies the reader), with the drop
// (assets/report/drop.js) sealing to the recipients' public keys, published at api/v1/report/drop.json.
// dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
export const order = 58
const A = p => readFileSync(new URL(`../../../assets/${p}`, import.meta.url), 'utf8')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// the recipients' public bundles: the agent keys from board/keys.json, the person keys from board/person-keys.json (active)
function recipients(ctx, drop) {
    const keys = ctx.readJSON('board/keys.json').keys, people = ctx.readJSON('board/person-keys.json').keys
    return drop.recipients.map(id => {
        // an agent: its pki.sgit.ai bundle (RSA-OAEP, the v2 envelope); a person: their P-256 key (ws-ecies-1, as
        // newsroom/tools/person-key.mjs seals and assets/login/keyring.js opens)
        const a = keys.find(k => k.id === id && k.status === 'active' && k.bundle)
        if (a) return { id, kind: 'agent', who: a.agent, fingerprint: a.bundle.fingerprint, bundle: a.bundle }
        const p = people.find(k => k.person === id && k.status === 'active' && k.encrypt && k.encrypt.kty === 'EC')
        return p ? { id, kind: 'person', who: p.person, fingerprint: p.fingerprint, encrypt: { kty: 'EC', crv: p.encrypt.crv, x: p.encrypt.x, y: p.encrypt.y } } : null
    }).filter(Boolean)
}

function correctionsMd(log, none) {
    const rows = (log.corrections || [])
    return `## Corrections log {#corrections}\n\n` + (rows.length
        ? `| Date | Page | What was wrong | What we did |\n|---|---|---|---|\n` + rows.map(c => `| ${c.date} | ${c.page ? `[${c.page_title || c.page}](${c.page})` : ''} | ${String(c.what || '').replace(/\|/g, '/')} | ${String(c.done || '').replace(/\|/g, '/')} |`).join('\n')
        : none.replace('{started}', log.started)) + '\n'
}

export function pages(ctx) {
    const drop = JSON.parse(A('report/drop.json')), log = JSON.parse(A('report/corrections.json')), W = drop.pages
    const lane = drop.lane && drop.lane.endpoint ? drop.lane.endpoint : null
    const csp = `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'${lane ? ' ' + lane : ''}; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`
    // one page per principle and concept (Dinis, 18 November 2026, about 16:00 UTC: board/guidance/2026-11-18-the-pipeline-standard-and-the-fact-checker.md),
    // drafted from his guidance in assets/principles/concepts.json for journalist@ to revise; listed on /principles/
    const C = JSON.parse(A('principles/concepts.json')), GH = 'https://github.com/promptugal/promptugal__news__website/blob/dev/'
    const H = W.concepts
    const list = `## ${H.list_heading} {#concepts}\n\n${C.intro}\n\n` + C.concepts.map(c => `- [${c.title}](${c.id}/index.html): ${c.summary}`).join('\n')
    const concept = c => ({ rel: `principles/${c.id}/index.html`, src: 'assets/principles/concepts.json', type: 'site', title: c.title, summary: c.summary,
        crumbs: [['principles/index.html', W.principles.title], [null, c.title]],
        md: [c.summary, `## ${H.do}`, c.do.map(x => `- ${x}`).join('\n'), `## ${H.never}`, c.never.map(x => `- ${x}`).join('\n'),
            `## ${H.check}`, c.check.map(x => `- [${x.text}](${x.href})`).join('\n'),
            H.word.replace('{guidance}', `[${c.guidance.replace(/^board\/guidance\//, '')}](${GH}${c.guidance})`)].join('\n\n') })
    return [
        { rel: 'principles/index.html', src: 'assets/principles/principles.md', type: 'site', title: W.principles.title, summary: W.principles.summary,
          md: A('principles/principles.md') + '\n\n' + list },
        ...C.concepts.map(concept),
        { rel: 'report/index.html', src: 'assets/report/report.md', type: 'site', bare: true,
          head: `<meta http-equiv="Content-Security-Policy" content="${esc(csp)}">\n<meta name="referrer" content="no-referrer">`,
          title: W.report.title, summary: W.report.summary,
          assets: { module: ['assets/report/drop.js'], css: ['assets/report/drop.css'] },
          md: A('report/report.md') + '\n\n' + correctionsMd(log, W.report.no_corrections),
          postHtml: html => html.replace('<h2 id="process">', `<div id="drop" class="drop"><p>${esc(W.report.no_js)}</p></div>\n<h2 id="process">`) },
    ]
}

export function api(ctx) {
    const drop = JSON.parse(A('report/drop.json'))
    return [{ path: 'api/v1/report/drop.json', schema: null, data: {
        about: drop.pages.report.api_about,
        version: ctx.VERSION, kind: 'promptugal.news/report-drop/v1', recipients: recipients(ctx, drop), lane: drop.lane } }]
}

// every recipient must be found with an active key, so a report is never sealed to nobody
export function validate(gate) {
    let d; try { d = gate.json('api/v1/report/drop.json') } catch { return ['api/v1/report/drop.json is missing'] }
    return d.recipients.length === 2 ? [] : [`the drop has ${d.recipients.length} recipient key(s), not 2 (conductor.b-promptugal and Dinis's active person key)`]
}
