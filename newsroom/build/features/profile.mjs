// The reader's own profile (6 November 2026, at Dinis's word: "the user profile should already exist ... the only
// question is whether it gets captured and saved"; privacy first). assets/profile/profile.js, on every page, keeps
// in the reader's browser (localStorage, never sent) the pages read and the searches; a person icon in #nr-tools
// opens /profile/ (its words: content/profile.md), the reader's own observability, with Pause, Clear and Download.
export const order = 87
export const assets = { js: ['assets/profile/profile.js'] }

export const llms = ctx => `## Your profile\n- [profile/](${ctx.BASE}profile/index.md): the pages a reader read and the searches they made, kept in their own browser (localStorage, never sent anywhere), shown to them with Pause, Clear and Download. Page tool: profile.summary (read).`

export function validate(gate) {
    const out = [], js = gate.text('assets/profile/profile.js')
    if (/fetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(js)) out.push('assets/profile/profile.js: the profile must never leave the browser (no fetch, XHR, beacon or socket)')
    if (/—/.test(js)) out.push('assets/profile/profile.js: an em-dash')
    return out
}
