// Talk to us from the site (Dinis, 15 November 2026, about 23:30 UTC; conductor@'s routing to dev.places@): the comment
// pane on every page (assets/talk/talk.js), the reader's own talk page (/talk/, the one page besides /login/ and the
// observability drain that loads the keyring: added to KEYRING_PAGES in login.mjs, for security@'s review), and two
// API files: api/v1/talk/config.json (the words from assets/talk/talk.json and the conductor's public, write-only lane
// from board/inbox.json) and api/v1/talk/replies.json (the conductor's answers from board/talk/replies.json, each sealed
// to one person's key with ws-ecies-1; only "to", "about" and "at" are readable).
export const order = 96
export const assets = { css: ['assets/talk/talk.css'], js: ['assets/talk/talk.js'] }
const WORDS = 'assets/talk/talk.json', INBOX = 'board/inbox.json', REPLIES = 'board/talk/replies.json'

const words = ctx => ctx.readJSON(WORDS)
function replies(ctx) {
    if (!ctx.exists(REPLIES)) return []
    try { return (ctx.readJSON(REPLIES).replies || []).filter(r => r && r.envelope && r.envelope.ct && r.envelope.epk && r.envelope.iv) } catch { return [] }
}

export function pages(ctx) {
    const W = words(ctx).words
    return [{ src: WORDS, rel: 'talk/index.html', type: 'site', title: W.talk_title, summary: W.talk_summary, crumbs: [[null, W.talk_title]],
        md: `${W.talk_summary}\n\n{.talk-mount}\n${W.talk_need_key}\n` }]
}

export function api(ctx) {
    const t = words(ctx), inbox = ctx.readJSON(INBOX)
    return [
        { path: 'api/v1/talk/config.json', schema: null, data: { about: t.about, enabled: t.enabled !== false, version: ctx.VERSION, endpoint: inbox.endpoint, vault_id: inbox.vault_id,
            append_token: (inbox.talk_lane && inbox.talk_lane.append_token) || (inbox.public_lane && inbox.public_lane.append_token), lane: inbox.talk_lane ? 'talk_lane' : 'public_lane', format: 'promptugal/comment/v1', replies: 'api/v1/talk/replies.json', recipient: { agent: inbox.agent, fingerprint: inbox.recipient.fingerprint, encrypt: inbox.recipient.encrypt }, words: t.words } },
        { path: 'api/v1/talk/replies.json', schema: null, data: { version: ctx.VERSION, replies: replies(ctx).map(r => ({ envelope: { epk: r.envelope.epk, iv: r.envelope.iv, ct: r.envelope.ct } })) } },
    ]
}

export function validate(gate) {
    const out = []
    let inbox = null
    try { inbox = gate.json(INBOX) } catch { return [`${INBOX} unreadable`] }
    if (!inbox.public_lane || !/^[0-9a-f]{64}$/.test(inbox.public_lane.append_token || '')) out.push(`${INBOX}: no public lane for the comment pane`)
    if (!inbox.recipient || !/BEGIN PUBLIC KEY/.test(inbox.recipient.encrypt || '')) out.push(`${INBOX}: no recipient key to seal comments to`)
    try { const c = gate.json('api/v1/talk/config.json'); if (/PRIVATE KEY|"d"\s*:/.test(JSON.stringify(c))) out.push('api/v1/talk/config.json: holds private key material') } catch { out.push('missing api/v1/talk/config.json') }
    // security@'s 00:05 review: /talk/ loads only the site's own scripts (it holds the keyring), and answers name no one in clear
    try { const h = gate.text('talk/index.html'); for (const m of h.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) out.push(`talk/index.html: loads an outside script (${m[1]}); the page holds the keyring`) } catch { out.push('missing talk/index.html') }
    try { for (const r of gate.json('api/v1/talk/replies.json').replies || []) if (Object.keys(r).some(k => k !== 'envelope') || Object.keys(r.envelope || {}).some(k => !['epk', 'iv', 'ct'].includes(k))) { out.push('api/v1/talk/replies.json: an answer carries something in clear besides its envelope (epk, iv, ct)'); break } } catch { }
    return out
}

export const llms = ctx => `## Talk to us\n- [talk/](talk/index.md): ${words(ctx).words.talk_summary}\n\n`
