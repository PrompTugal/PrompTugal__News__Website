// The reader's own day (6 November 2026, Dinis's personal schedule, "start small ... local storage ... a vault if they have
// one"): assets/schedule/schedule.js puts an "Add to my day" button on every event page and beside every event of an
// agenda list, and draws /my-day/ (its words: content/my-day.md). In the browser (localStorage) and, if the vault is
// open, in the vault (agenda/picks). Page tool schedule.picks (read).
export const order = 88
export const assets = { css: ['assets/schedule/schedule.css'], js: ['assets/schedule/schedule.js'] }

export const llms = ctx => `## My day\n- [my-day/](${ctx.BASE}my-day/index.md): the sessions a reader picked, by day, kept in their own browser (and in their vault if open). Page tool: schedule.picks (read).`

export function validate(gate) {
    const out = [], js = gate.text('assets/schedule/schedule.js')
    if (/fetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(js)) out.push('assets/schedule/schedule.js: the picks must never leave the browser (no fetch, XHR, beacon or socket)')
    if (/—/.test(js)) out.push('assets/schedule/schedule.js: an em-dash')
    return out
}
