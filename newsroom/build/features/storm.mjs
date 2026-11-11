// /storm/charles/: the first preview (v1) of the storm page for S41, at Vicky Wang's word, 10 November 2026.
// From the weather desk's sourced facts only (desks/weather-vicky/live.md and s41-lead.json), held as
// desks/dev-vicky/storm/charles.json: the official alerts, Web Summit's Wednesday status, what attendees need to know,
// a timestamped timeline with a source link on every line. No forecast of our own, no advice beyond the authorities'.
// Published only after reviewer@PrompTugal.vicky has verified every line and Vicky has approved.
import fs from 'node:fs'
import path from 'node:path'
export const order = 74

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const stamp = z => { const m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d:\d\d)Z$/.exec(z || ''); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[4]} UTC` : '' }
const hhmm = z => (/T(\d\d:\d\d)Z$/.exec(z || '') || [, ''])[1]
const safe = u => /^https:\/\/[^\s)]+$/.test(u || '') ? u : ''
const src = (u, label = 'source') => safe(u) ? ` [${label}](${safe(u)})` : ''

const SHOWN = 5   // designer@'s S2: the timeline shows its newest five, the rest folded as "Earlier (N)"
export function pages(ctx) {
    let D
    try { D = JSON.parse(fs.readFileSync(path.join(ctx.ROOT, 'desks/dev-vicky/storm/charles.json'), 'utf8')) } catch { return [] }
    const out = []
    if (D.lead) out.push('::: storm-lead', `**${D.lead.headline}**`, '', D.lead.text, '', `*${D.lead.source_label} ${D.lead.source_note}* ${src(D.lead.src, 'Web Summit\'s statement')}`, ':::', '')
    out.push('::: storm-checked', `${D.ipma_read ? `IPMA's warnings were re-read at ${stamp(D.ipma_read)}; every other line carries the time it was read (the weather desk's last full check was ${stamp(D.desk_last_check)}).` : `Last checked by the weather desk at ${stamp(D.desk_last_check)}.`} Lisbon time is UTC in November. Everything below is what the official sources say, with the time we read each one; we make no forecast of our own and give no advice beyond the authorities'. Where we cite the press, it is labelled.`, ':::', '')
    out.push('## The official alerts', '')
    for (const a of D.alerts) out.push(`::: storm-alert ${a.level}`, `**${a.who}** · read ${stamp(a.read)} ·${src(a.src)}`, '', a.what, ':::', '')
    out.push("## Web Summit's Wednesday", '')
    out.push('::: storm-alert summit', `**Web Summit** · read ${stamp(D.summit.read)} ·${src(D.summit.src)}`, '', D.summit.status, ':::', '')
    out.push('**Not announced, and not inferred:**', '', ...D.summit.open.map(t => `- ${t}`), '')
    out.push('## What attendees need to know', '', '**From the authorities:**', '')
    for (const a of D.attendees.from_authorities) out.push(`- ${a.text} (read ${stamp(a.read)};${src(a.src)})`)
    out.push('', '**Transport, from each operator:**', '')
    for (const t of D.attendees.transport) out.push(`- **${t.name}.** ${t.text}${t.src ? ` (read ${stamp(t.read)};${src(t.src)})` : ''}`)
    out.push('', '**Not announced yet:**', '', ...D.attendees.not_announced.map(t => `- ${t}`), '')
    out.push('## Timeline', '', 'Newest first. Every line has its source.', '')
    const entry = e => `- **${stamp(e.t)}.** ${e.text}${src(e.src)}`
    for (const e of D.timeline.slice(0, SHOWN)) out.push(entry(e))
    if (D.timeline.length > SHOWN) { out.push('', '::: storm-earlier'); for (const e of D.timeline.slice(SHOWN)) out.push(entry(e)); out.push(':::') }
    out.push('', 'Source for all of it: the weather desk\'s facts list, kept up to date and checked hourly.')
    // pointers named in the data (Vicky, 11 Nov 2026): a secondary source used only to find changes; every fact keeps its official source (desks/conductor-vicky/sources/storm-charles.md)
    for (const x of D.extra_sources || []) if (safe(x.url) && x.name && x.text) out.push('', `[${x.name}](${safe(x.url)}), ${x.text}`)
    return [{
        rel: 'storm/charles/index.html', title: D.lead ? 'Web Summit Day 2 will not take place' : 'Storm Charles and Web Summit: what the authorities have said for Wednesday',
        summary: D.lead ? `Storm Charles: what Web Summit has said, the official alerts, what attendees need to know, and a timeline with sources.` : `The official alerts, Web Summit's Wednesday status and what attendees need to know, with a timeline. Last checked ${hhmm(D.desk_last_check)} UTC.`,
        md: out.join('\n'), type: 'story', section: 'news', layout: 'wide', assets: { css: ['assets/storm/storm.css'], js: ['assets/storm/storm.js'] },   // S3: a story page marks News, not Now
        postHtml: h => h.replace('<div class="storm-checked">', `<div class="storm-checked" data-at="${D.ipma_read || D.desk_last_check}">`)
            .replace(/<div class="storm-earlier">([\s\S]*?)<\/div>/, (m, inner) => `<details class="storm-earlier"><summary>Earlier (${D.timeline.length - SHOWN})</summary>${inner}</details>`),
    }]
}
