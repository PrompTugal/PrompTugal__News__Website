// /contribute/ (Dinis, 9 November 2026, 20:20 UTC, brief:20261109T2020Z-contribute; board/guidance/2026-11-09-contribute-confirmed.md):
// write for PrompTugal.news. The rules, hour-sized tasks, a form, the collaborators' wall and the beta list.
//   Load       the journalist's words (desks/journalist-promptugal/contribute/page-words.md), designer@'s rules block
//              (design/contribute/rules-fragment.txt), the wall's data (data/site/contributors.json), the lane (board/lanes/signups.json)
//   Transform  the page from the words, by their headings; the forms and the wall from assets/contribute/contribute.tmpl
//   Save       contribute/index.html and its twin
// security@'s six conditions: a sign-up is sealed in the browser and written to a write-only lane that only the Web Summit
// team's private CRM opens; nothing personal is kept on this site; names only with consent; no outside scripts (the gate
// checks the script below); CC BY 4.0 shown; photos: a link only, location removed before anything is published.
import fs from 'node:fs'
import { createHash } from 'node:crypto'
export const order = 90

const R = f => new URL(`../../../${f}`, import.meta.url)
const T = fs.readFileSync(R('assets/contribute/contribute.tmpl'), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const WORDS = 'desks/journalist-promptugal/contribute/page-words.md', RULES = 'design/contribute/rules-fragment.txt', WALL = 'data/site/contributors.json', LANE = 'board/lanes/signups.json'

// the journalist's file, section by section ("## Heading" to the next)
function sections() {
    const t = fs.readFileSync(R(WORDS), 'utf8').split(/\n---\n/).slice(1).join('\n---\n'), out = {}
    for (const s of t.split(/\n## /).slice(1)) { const [h, ...rest] = s.split('\n'); out[h.trim()] = rest.join('\n').trim() }
    return out
}
const slot = n => `\n\nPTCONTRIB-${n}\n\n`

export function pages(ctx) {
    if (!fs.existsSync(R(WORDS))) return []
    const S = sections(), get = k => Object.entries(S).find(([h]) => h.startsWith(k))?.[1] || ''
    const tasks = get('Where to start'), next = get('What happens next'), details = get('Your details')
    const wallLine = get('The wall').replace(/\[[^\]]*\]/g, '').trim(), beta = get('The beta list').replace(/\[[^\]]*\]/g, '').trim()
    const md = [get('Opening'), slot('rules'), `## Where to start: tasks of about an hour {#tasks}\n\n${tasks}`,
        `## How to send it {#send}`, slot('form'), get('How to send it').replace(/\[[^\]]*\]\s*/g, '').trim(),
        `## What happens next {#next}\n\n${next}`, `## Your details {#details}\n\n${details}`,
        `## The wall {#wall}\n\n${wallLine}`, slot('wall'), `## Get the app first {#beta}\n\n${beta.replace(/^\*\*Get the app first\.\*\*\s*/, '')}`, slot('beta'),
        `Everything published from this page is under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): anyone can reuse it, with credit to its author.`].join('\n\n')
    return [{ rel: 'contribute/index.html', src: WORDS, type: 'site', section: 'about', title: get('Title').split('\n')[0] || 'Write for PrompTugal.news',
        summary: get('Summary').split('\n')[0], md,
        // designer@'s share picture: the seven rules, 1200 x 630 (board/spec-contribute-page.md)
        meta: { image: 'design/contribute/rules--share.png', image_alt: 'The rules of the game for writing for PrompTugal.news, in seven lines', image_width: 1200, image_height: 630 }, assets: { css: ['assets/contribute/contribute.css'], js: ['assets/contribute/contribute.js'] },
        postHtml: h => fill(h, ctx) }]
}

function fill(h, ctx) {
    const esc = ctx.md.esc, W = JSON.parse(fs.readFileSync(R(WALL), 'utf8')), lane = JSON.parse(fs.readFileSync(R(LANE), 'utf8'))
    const rules = (fs.readFileSync(R(RULES), 'utf8').match(/<section[\s\S]*<\/section>/) || [''])[0]
    const status = `<p class="ct-status" role="status" aria-live="polite">${item('status').replace(/<span /g, '<span hidden ')}</p>`
    const tasks = [...(sections()['Where to start: tasks of about an hour'] || '').matchAll(/^- \*\*([^*]+?)\.?\*\*/gm)].map(m => put(item('task'), { value: esc(m[1]), label: esc(m[1]) })).join('')
    const shown = W.contributors.filter(c => c.name), published = shown.reduce((n, c) => n + c.pieces.length, 0)
    const cards = shown.map(c => put(item('card'), { initial: esc(c.name[0]), name: esc(c.name), pieces: `${c.pieces.length} piece${c.pieces.length === 1 ? '' : 's'} published`, made: esc(c.made || '') })).join('')
        + Array.from({ length: W.unnamed || 0 }, () => put(item('hidden'), { pieces: '' })).join('')
    // the lane, as the page's own data: its write-only token and the public key (public by design: board/lanes/signups.json)
    const cfg = `<script type="application/json" id="ct-lane">${JSON.stringify({ endpoint: lane.endpoint, vault_id: lane.vault_id, append_token: lane.append_token, recipient: { encrypt: lane.recipient.encrypt } }).replace(/</g, '\\u003c')}</script>`
    const block = { rules, form: put(part('form'), { '#tasks': tasks }).replace(/<p class="ct-status"[^>]*><\/p>/, status),
        wall: put(part('wall'), { joined: shown.length + (W.unnamed || 0), submitted: W.submitted || 0, published, '#cards': cards }),
        beta: put(part('beta'), {}).replace(/<p class="ct-status"[^>]*><\/p>/, status) + cfg }
    return h.replace(/<p>PTCONTRIB-([a-z]+)<\/p>/g, (m, n) => block[n] ?? m)
}

export const llms = ctx => `## Contribute\n- [contribute/](${ctx.BASE}contribute/index.md): write for PrompTugal.news: the rules, hour-sized tasks, how to send (no account; sealed to the newsroom's private inbox), the collaborators' wall and the app's beta list.`

// security@'s conditions, kept by the gate: the script talks to the sign-ups lane only, keeps nothing in the browser,
// and loads nothing from outside this site
// security@'s S33: the sign-ups go to one key only, pinned here, so no single commit to board/lanes/signups.json can
// redirect them: the fingerprint it states and the one computed from its key must both be conductor@web-summit.dinis's
const PINNED = 'sha256:ecbb2756634ba022'
export function validate(gate) {
    const js = gate.text('assets/contribute/contribute.js'), out = []
    try {
        const lane = JSON.parse(gate.text(LANE)), der = Buffer.from(lane.recipient.encrypt.replace(/-----[^-]+-----/g, '').replace(/\s/g, ''), 'base64')
        const fp = 'sha256:' + createHash('sha256').update(der).digest('hex').slice(0, 16)
        if (lane.recipient.fingerprint !== PINNED || fp !== PINNED) out.push(`${LANE}: the sign-ups' recipient is not the pinned key ${PINNED} (stated ${lane.recipient.fingerprint}, computed ${fp}); a change of recipient needs security@'s review and this pin changed with it`)
    } catch (e) { out.push(`${LANE}: unreadable (${e.message})`) }
    if (/localStorage|sessionStorage|indexedDB|document\.cookie/.test(js)) out.push('assets/contribute/contribute.js: keeps nothing in the browser (security@ condition 1)')
    if (/https?:\/\//.test(js.replace(/^\s*(\/\/|\/?\*).*$/gm, ''))) out.push('assets/contribute/contribute.js: no outside address in the script (condition 5); the lane comes from the page')
    if ((js.match(/fetch\(/g) || []).length !== 1 || !/\/api\/vault\/append\/write\//.test(js)) out.push('assets/contribute/contribute.js: one fetch, to the write-only lane only')
    return out
}
