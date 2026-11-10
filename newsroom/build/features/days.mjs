// The summit's days (guidance 6 Nov 13:20 UTC, board/spec-the-summit-days.md): a page for each of the eight days,
// Friday 6 to Friday 13 November, under the strip of days. One day reads three ways, switched by the link followed
// (CSS :target): C five things (the default), A a timeline of every session, B the sessions grouped by stage.
// The five are the highest-ranked items of the day for now; the correspondent's own pick will replace them.
// A past day says it is the past. Rebuilding the site as it was that day (S2) is not built yet, and the page says so.
import fs from 'node:fs'
import { slotLine, slotList } from '../lib/present.mjs'
import { load, rank, KIND, STRIP_DAYS, stripMd, cancelledDays } from './agenda.mjs'
export const order = 60
export const assets = { js: ['assets/days/days.js'] }

// the correspondent's own five for a day (data/front/days.json: { days: { "<date>": { picks: ["<event id>", ...] } } }), when it
// has written them; otherwise the ranked five below
// the correspondent's day_picks in desks/correspondent/front-page.json first (synthetic@'s F54: data/front/ is outside
// its grant), then data/front/days.json for a day it has not picked
const readDays = (f, k) => { try { const j = JSON.parse(fs.readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8')); return (k ? j[k] : j)?.days || {} } catch { return {} } }
const PICKS = { ...readDays('data/front/days.json'), ...readDays('desks/correspondent/front-page.json', 'day_picks') }
const DW = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')).days_page
const byTime = (a, b) => (a.time || '').localeCompare(b.time || '')

function dayPage(ctx, d, i) {
    const { itemsOn, TODAY, DAY } = load(ctx), rel = `days/${d}/index.html`, items = itemsOn(d)
    const line = e => slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })
    const rk = e => e.kind === 'registration' && d >= '2026-11-10' ? 4 : rank(e)   // on conference days registration is not the highlight
    const picked = (PICKS[d]?.picks || []).map(id => items.find(e => e.id === id.replace(/^event:/, ''))).filter(Boolean)
    const five = picked.length ? [...picked].sort(byTime) : [...items].sort((a, b) => rk(a) - rk(b) || byTime(a, b)).slice(0, 5).sort(byTime)
    const stages = [...new Set(items.map(e => e.where || 'Place not listed'))].sort()
    const when = d < TODAY ? 'past' : d === TODAY ? 'today' : 'future'
    const banner = {
        past: `**The past: ${DAY(d)}.** This day has gone. Below is what was on, as we hold it today. The site as it looked at the end of that day is planned and not built yet. [Back to today](${ctx.link(rel, 'index.html')}).`,
        today: `**Today: ${DAY(d)}.** What is on today, then the other days in the strip above.`,
        future: `**Planned: ${DAY(d)}**, as listed on ${DAY(TODAY)}. Times and rooms can move: each item links to its source.`,
    }[when]
    const off = cancelledDays()[d]   // the correspondent's 'did not take place' (10 November: Day 2 cancelled)
    const shown = off ? `**${DAY(d)} did not take place.** ${off.replace(/\.?$/, '.')}` : banner
    const prev = STRIP_DAYS[i - 1], next = STRIP_DAYS[i + 1]
    const md = `${stripMd(ctx, rel, d)}\n\n{.notice .brand}\n${shown}\n\n` +
        (items.length ? `{.view-switch}\n[Five things](#v-five) · [Every session, by time](#v-all) · [By stage](#v-stages)\n\n` +
            `::: view view-five\n#### Five things {#v-five}\n\n${picked.length || d < TODAY ? '' : `*${DW.unpicked}*\n\n`}${slotList(five.map(line))}\n\n` +
            (items.length > 5 ? `::: fold\n#### ${d === TODAY ? DW.else_today : DW.else_other} (${items.length - 5}) {#else}\n\n${slotList([...items].filter(e => !five.includes(e)).sort(byTime).map(line))}\n:::\n` : '') + `:::\n\n` +
            `::: view view-all\n#### Every session, by time ({#v-all})\n\n${slotList([...items].sort(byTime).map(line))}\n:::\n\n`.replace(' ({#v-all})', ' {#v-all}') +
            `::: view view-stages\n#### By stage {#v-stages}\n\n${stages.map(w => `### ${ctx.md.cell(w)}\n\n${slotList(items.filter(e => (e.where || 'Place not listed') === w).sort(byTime).map(line))}`).join('\n\n')}\n:::\n\n`
            : `Nothing from our programme is listed for ${DAY(d)} yet. [The full agenda](${ctx.link(rel, 'summit/agenda.html')}).\n\n`) +
        `{.more-line}\n${prev ? `[Earlier: ${DAY(prev)}](${ctx.link(rel, `days/${prev}/index.html`)})` : ''}${prev && next ? ' · ' : ''}${next ? `[Later: ${DAY(next)}](${ctx.link(rel, `days/${next}/index.html`)})` : ''} · [All the days](${ctx.link(rel, 'days/index.html')}) · [The full agenda](${ctx.link(rel, 'summit/agenda.html')})`
    return {
        src: 'data/events/', rel, type: 'site', date: TODAY, section: 'agenda',
        crumbs: [['summit/index.html', 'The summit'], [null, DAY(d)]],
        title: `${DAY(d)}: ${d < TODAY ? DW.title_was : DW.title_on}`,
        summary: `${items.length} item${items.length === 1 ? '' : 's'} in our programme on ${DAY(d)}, Web Summit Lisbon week: ${d < TODAY ? DW.summary_was : DW.summary_on}`,
        md,
    }
}

// the days' own front door (the brief of 9 November: /days/ returned 404): the strip, then each day with its count and its five things
function daysIndex(ctx) {
    const { itemsOn, TODAY, DAY } = load(ctx), rel = 'days/index.html'
    // sherpa@'s D1: during the summit the page opens on today and what is coming; the days gone follow below
    const order = [...STRIP_DAYS.filter(d => d >= TODAY), ...STRIP_DAYS.filter(d => d < TODAY)]
    const body = order.map(d => {
        const items = itemsOn(d), rk = e => e.kind === 'registration' && d >= '2026-11-10' ? 4 : rank(e)
        const picked = (PICKS[d]?.picks || []).map(id => items.find(e => e.id === id.replace(/^event:/, ''))).filter(Boolean)
        const five = picked.length ? [...picked].sort(byTime) : [...items].sort((a, b) => rk(a) - rk(b) || byTime(a, b)).slice(0, 5).sort(byTime)
        const line = e => slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })
        return `## [${DAY(d)}](${ctx.link(rel, `days/${d}/index.html`)})${d === TODAY ? ' (today)' : ''} {#d-${d}}\n\n${items.length} in our programme.\n\n${slotList(five.map(line))}`
    }).join('\n\n')
    return { src: 'data/events/', rel, type: 'site', date: TODAY, section: 'agenda', crumbs: [['summit/index.html', 'The summit'], [null, 'The days']], layout: 'wide',
        title: 'The days', summary: 'The eight days of Web Summit Lisbon week, Friday 6 to Friday 13 November: five things to plan around on each, then the whole day.',
        md: `${stripMd(ctx, rel)}\n\nEach day has a page with its five things, every session by time, and the sessions by stage.\n\n${body}` }
}
export function pages(ctx) { return [daysIndex(ctx), ...STRIP_DAYS.map((d, i) => dayPage(ctx, d, i))] }

// Offline-first data: one JSON file per day (api/v1/days/<date>.json) and an index of them (api/v1/days.json), small enough for the
// service worker to cache whole (dev@), so a day's schedule and the reader's picks open with no network.
export const api = ctx => {
    const { itemsOn, TODAY, DAY } = load(ctx), W = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')).offline
    const days = STRIP_DAYS.map(d => {
        const items = itemsOn(d).sort(byTime).map(e => ({ id: e.id, time: e.time || null, title: e.what, kind: KIND[e.kind] || e.kind, where: e.where || null, page: `${ctx.BASE}events/${e.id}/`, source: e.session_url || e.source_url || null }))
        return { date: d, label: DAY(d), when: d < TODAY ? 'past' : d === TODAY ? 'today' : 'future', page: `${ctx.BASE}days/${d}/`, count: items.length, items }
    })
    return [
        { path: 'api/v1/days.json', schema: null, data: { about: W.about, version: ctx.VERSION, updated: TODAY, days: days.map(({ items, ...d }) => ({ ...d, data: `${ctx.BASE}api/v1/days/${d.date}.json` })) } },
        ...days.map(d => ({ path: `api/v1/days/${d.date}.json`, schema: null, data: { about: W.about, version: ctx.VERSION, ...d, ...(cancelledDays()[d.date] ? { cancelled: cancelledDays()[d.date] } : {}) } })),
    ]
}
