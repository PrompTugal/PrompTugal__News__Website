// The news app on the web (Dinis, 9 November 2026, about 14:40 UTC: "I want to run the iPhone app on the web";
// board/briefs/2026-11-09-the-app-on-the-web.md). Step 1, today: the schedule, picks, clashes, free time and Add to
// Calendar, at /app/, and an "App" button on every page that opens it in a phone-shaped pane beside the news (full screen
// on a phone).
//   Load       the component assets/app/ (app.tmpl: the page and its words; app.js, app.css: the app; pane.js, pane.css: the pane)
//   Transform  /app/ as a page that brings its own markup (page.raw, so no site frame inside the phone), its twin the words
//   Save       app/index.html and its twin; the pane's script and style on every page
// The app reads the public programme (api/v1/days/); the reader's picks are the site's own (nr.schedule.v1, shared with
// "Add to my day" and /my-day/) and never leave the browser (checked below).
import fs from 'node:fs'
export const order = 89

const T = fs.readFileSync(new URL('../../../assets/app/app.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const SUMMARY = 'The Web Summit programme as an app in your browser: pick sessions, see clashes and free time, add them to your calendar. No store, no account; your picks stay on your device.'

export const assets = { css: ['assets/app/pane.css'], js: ['assets/app/pane.js'] }

export function pages() {
    const raw = part('page').replace(/\{\{up\}\}/g, '../').replace(/\{\{summary\}\}/g, SUMMARY)
    return [{
        rel: 'app/index.html', src: 'assets/app/app.tmpl', type: 'site', raw, title: 'The app', summary: SUMMARY, section: 'agenda',
        md: `${SUMMARY}\n\n- The programme by day, with a search.\n- Add a session to your picks (the same picks as "Add to my day" on the site and [My day](../my-day/index.md)).\n- My picks: clashes between them, and the free time in between.\n- Add to Calendar: one session, or all your picks, as an .ics file every calendar opens.\n\nIt needs JavaScript. The programme comes from [the days' data](../api/v1/days.json); times are Lisbon time and can change.`,
    }]
}

export const llms = ctx => `## The app\n- [app/](${ctx.BASE}app/index.md): the summit programme as a web app (picks, clashes, free time, calendar files); picks stay in the browser.`

// the picks never leave the browser: the app reads the programme and nothing else goes out
export function validate(gate) {
    const js = gate.text('assets/app/app.js'), out = []
    if (/XMLHttpRequest|sendBeacon|WebSocket|method:\s*['"]POST/i.test(js)) out.push('assets/app/app.js: the app only reads the programme (no XHR, beacon, socket or POST)')
    for (const m of js.matchAll(/fetch\(([^)]*)\)/g)) if (!/api\/v1\/days/.test(m[1])) out.push(`assets/app/app.js: a fetch outside the programme's data (${m[1].slice(0, 40)})`)
    return out
}
