// /security/: the public security log (Dinis, 18 November 2026, about 15:15 UTC; board/guidance/2026-11-18-security-findings-published.md).
// Built from security@'s ledger, board/team/security/findings.md (its table rows "| S<n> | ..."). Disclosure: a fixed
// finding in full; any other as id, severity, title, owner and state only, until fixed. Words and the sites' own pages
// in assets/security/security.json. dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
export const order = 59
const LEDGER = 'board/team/security/findings.md'
const W = () => JSON.parse(readFileSync(new URL('../../../assets/security/security.json', import.meta.url), 'utf8'))

// split a table row on the pipes outside backticks (a cell may quote `|| true`)
function cells(line) {
    const out = []; let cur = '', tick = false
    for (const ch of line.trim().replace(/^\|/, '').replace(/\|$/, '')) {
        if (ch === '`') tick = !tick
        if (ch === '|' && !tick) { out.push(cur.trim()); cur = '' } else cur += ch
    }
    out.push(cur.trim()); return out
}

// the state's class from the start of security@'s state cell
export function stateOf(s) {
    const t = s.replace(/\*/g, '').trim().toLowerCase()
    if (/^(closed|fixed|done)\b/.test(t) && !/^closed:\s*acknowledged/.test(t)) return 'fixed'
    if (/^(half done|mostly|partly|mitigated|data fixed)/.test(t)) return 'progress'
    if (/^(accepted|decided|granted|closed:\s*acknowledged)/.test(t) || /^open \(accepted/.test(t)) return 'accepted'
    return 'open'
}

export function findings(md) {
    return md.split('\n').filter(l => /^\|\s*S\d+[a-z]?\s*\|/.test(l)).map(l => {
        const [id, severity, title, owner, state, review] = cells(l)
        return { id, severity, title, owner, state, review, class: stateOf(state) }
    })
}

const flat = s => String(s || '').replace(/\n/g, ' ').replace(/\|/g, '/')

function load(ctx) { try { return findings(readFileSync(new URL(`../../../${LEDGER}`, import.meta.url), 'utf8')) } catch { return [] } }

export function pages(ctx) {
    const w = W(), rows = load(ctx), fixed = rows.filter(r => r.class === 'fixed'), other = rows.filter(r => r.class !== 'fixed')
    const count = Object.entries(w.states).map(([k, v]) => `${v}: ${rows.filter(r => r.class === k).length}`).join(' · ')
    const md = [
        ...w.intro, `**${rows.length}** · ${count}`,
        `## ${w.other_heading} {#open}`, w.other_about,
        '| # | Severity | Finding | Owner | State |', '|---|---|---|---|---|',
        ...other.map(r => `| ${r.id} | ${flat(r.severity)} | ${flat(r.title)} | ${flat(r.owner)} | ${w.states[r.class]} |`),
        `## ${w.fixed_heading} {#fixed}`, w.fixed_about,
        '| # | Severity | Finding | Owner | The fix | Reviews |', '|---|---|---|---|---|---|',
        ...fixed.map(r => `| ${r.id} | ${flat(r.severity)} | ${flat(r.title)} | ${flat(r.owner)} | ${flat(r.state)} | ${flat(r.review)} |`),
        `## ${w.sites_heading} {#sites}`, w.sites_about,
        ...w.sites.map(s => s.live ? `- [${s.name}](${s.url})` : `- ${s.name} (${w.sites_waiting})`),
    ].join('\n\n').replace(/\n\n(\|)/g, '\n$1')
    return [{ rel: 'security/index.html', src: LEDGER, type: 'site', title: w.title, summary: w.summary, md }]
}

export function api(ctx) {
    const w = W(), rows = load(ctx)
    return [{ path: 'api/v1/security/findings.json', schema: null, data: {
        about: w.api_about, version: ctx.VERSION, source: LEDGER,
        findings: rows.map(r => r.class === 'fixed' ? { id: r.id, severity: r.severity, title: r.title, owner: r.owner, state: 'fixed', fix: r.state, reviews: r.review }
            : { id: r.id, severity: r.severity, title: r.title, owner: r.owner, state: r.class }) } }]
}

// the ledger must parse: a log of nothing would say we found nothing
export function validate(gate) {
    let d; try { d = gate.json('api/v1/security/findings.json') } catch { return ['api/v1/security/findings.json is missing'] }
    const bad = d.findings.filter(f => f.state !== 'fixed' && ('fix' in f || 'reviews' in f))
    return [...(d.findings.length ? [] : [`the security log read no finding from ${LEDGER}`]), ...bad.map(f => `${f.id}: an unfixed finding carries its detail`)]
}
