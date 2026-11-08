// The live map of Dinis's agents (/newsroom/live/; not the summit's live strip, features/live.mjs): who exchanged with whom and when, built at each release from this repository's own
// history. After Angelo's Live view (dev.map@PrompTugal.angelo, people/angelo/app/live.js in SGit-AI/SGit-AI__Website__Web-Summit): the
// same idea (a hexagon, a hub per person, a line per exchange drawn at its real moment, a faint flow as dense as the pair's traffic),
// our own code, data and look. By dev.graphs@PrompTugal.dinis, 7 November 2026 (WS-177; the brief is
// board/team/conductor.b/briefs/2026-11-07-dinis-live-map.md).
//
// What counts as an exchange (only what the commit says in public; the sealed inboxes are never read):
//   f  a commit by agent A with a For: or To: trailer naming B (an agent id, or a person)
//   m  a commit by A whose subject names another agent (for example "librarian@'s inbox re-issued")
//   s  a commit by A that names no one: A at work (a pulse on A's own node)
// Two files: api/v1/newsroom/live.json (who, to whom, when: small, read again by the page) and api/v1/newsroom/live-details.json
// (each commit's subject, body, trailers and files, read when someone taps an exchange). Commit text is public already; lines that hold
// an address or a long token-like string are blanked all the same.
import { execFileSync } from 'node:child_process'
export const order = 93
const REL = 'newsroom/live/index.html', API = 'api/v1/newsroom/live.json', DET = 'api/v1/newsroom/live-details.json'
const REPO = 'https://github.com/promptugal/promptugal__news__website'
const PEOPLE = ['dinis', 'vicky', 'angelo', 'silvio', 'jose', 'indi']
const ID = /^[a-z][a-z0-9.\-]*@[a-z][a-z0-9\-]*(\.[a-z][a-z0-9\-]*)+$/i
const OURS = /@promptugal\.dinis$/i
const ADDR_OK = /@(promptugal|web-summit)\.(dinis|vicky|angelo|silvio|jose|indi)\b/i
const SECRET = /\b(?:[A-Za-z0-9+/_-]{40,}|[a-f0-9]{32,}|sg[kt]_[A-Za-z0-9]{8,})\b/g
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g

const clean = s => String(s || '').split('\n').filter(l => !/^(Co-Authored-By|Claude-Session|Signed-off-by):/i.test(l))
    .map(l => l.replace(EMAIL, m => (ADDR_OK.test(m) ? m : '[address removed]')).replace(SECRET, '[removed]')).join('\n')

const person = id => {
    if (PEOPLE.includes(id)) return id
    const m = String(id).match(/@[^@]*\.([a-z0-9-]+)$/i)
    return m && PEOPLE.includes(m[1].toLowerCase()) ? m[1].toLowerCase() : 'other'
}
// "role@" in a subject is that role on this team; "role@PrompTugal.dinis" and "role@web-summit.vicky" are written in full
const roleRefs = subject => {
    const out = new Set()
    for (const m of subject.matchAll(/\b([a-z][a-z0-9]*(?:\.[a-z0-9]+)*)@(?:(promptugal|web-summit)\.([a-z]+))?(?![A-Za-z0-9])/gi)) {
        const role = m[1].toLowerCase()
        out.add(m[2] ? `${role}@${m[2]}.${m[3]}`.toLowerCase() : `${role}@promptugal.dinis`)
    }
    return out
}
const norm = id => id.toLowerCase()

function targetsOf(text) {
    const out = new Set()
    for (const raw of String(text || '').split(/[;,]|\sand\s/)) {
        const t = raw.trim().replace(/\s*\(.*$/, '')
        if (!t) continue
        if (ID.test(t)) out.add(norm(t))
        else { const w = t.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, ''); if (PEOPLE.includes(w)) out.add(w) }
    }
    return out
}

function history(root) {
    try {
        const out = execFileSync('git', ['log', '--no-merges', '--name-only', '--format=%x1e%H%x1f%cI%x1f%s%x1f%B%x1f'], { cwd: root, maxBuffer: 1 << 28, encoding: 'utf8' })
        return out.split('\x1e').map(r => r.trim() ? r : '').filter(Boolean).map(r => {
            const [sha, at, subject, body, files] = r.split('\x1f')
            return { sha: sha.trim(), at, subject, body: body || '', files: (files || '').split('\n').map(f => f.trim()).filter(Boolean) }
        })
    } catch { return [] }
}

export function build(root) {
    const commits = history(root).reverse()
    const nodes = new Map(), idx = id => { if (!nodes.has(id)) nodes.set(id, nodes.size); return nodes.get(id) }
    const events = [], details = {}
    for (const c of commits) {
        if (/^site v\d/.test(c.subject)) continue   // CI's release commit repeats the agent's own commit
        const trailers = {}
        for (const l of c.body.split('\n')) { const m = l.match(/^(Agent|Issue|For|To):\s*(.+)$/); if (m && !trailers[m[1]]) trailers[m[1]] = m[2].trim() }
        const prefix = c.subject.match(/^([a-z][a-z0-9.\-]*@[A-Za-z][A-Za-z0-9\-]*(?:\.[A-Za-z0-9\-]+)+):/)
        let actor = trailers.Agent && ID.test(trailers.Agent.split(/[;,]/)[0].trim()) ? norm(trailers.Agent.split(/[;,]/)[0].trim()) : prefix ? norm(prefix[1]) : null
        if (!actor) continue
        const tf = targetsOf([trailers.For, trailers.To].filter(Boolean).join(';'))
        const subj = prefix ? c.subject.slice(prefix[0].length) : c.subject
        const tm = new Set([...roleRefs(subj)].filter(t => t !== actor && !tf.has(t)))
        const ours = OURS.test(actor) || [...tf, ...tm].some(t => OURS.test(t) || t === 'dinis')
        if (!ours) continue
        tf.delete(actor)
        const kind = tf.size ? 'f' : tm.size ? 'm' : 's'
        const tg = [...(tf.size ? tf : tm)]
        const minute = Math.floor(Date.parse(c.at) / 6e4), sha = c.sha.slice(0, 7)
        events.push([minute, idx(actor), kind, tg.map(idx), sha])
        const own = c.body.split('\n').filter(l => !/^(Agent|Issue|For|To|Co-Authored-By|Claude-Session):/.test(l)).join('\n').trim()
        const bodyText = own.startsWith(c.subject) ? own.slice(c.subject.length).trim() : own
        details[sha] = { at: c.at, s: clean(c.subject).slice(0, 300), b: clean(bodyText).slice(0, 1500), t: Object.fromEntries(Object.entries(trailers).map(([k, v]) => [k, clean(v).slice(0, 200)])), n: c.files.length, f: c.files.slice(0, 12), k: kind }
    }
    const list = [...nodes.keys()]
    return { events, details, agents: list.map(id => ({ id, person: person(id) })), from: events.length ? new Date(events[0][0] * 6e4).toISOString() : null }
}

export function api(ctx) {
    const root = ctx.ROOT || process.cwd(), b = build(root)
    const built = new Date().toISOString()
    return [
        { path: API, schema: null, data: { id: 'newsroom-live', about: 'Exchanges between Dinis\'s agents and the ones they talk to, from this repository\'s commits: events are [minute since 1970, agent index, kind (f For/To trailer, m named in the subject, s at work), [target indexes], short sha]. Who, to whom, when; the words of each commit are in live-details.json. The sealed inboxes are never read.', built_at: built, from: b.from, repo: REPO, agents: b.agents, events: b.events } },
        { path: DET, schema: null, data: { id: 'newsroom-live-details', about: 'Each commit behind live.json: subject, body, trailers, files. Public already; addresses and token-like strings are blanked.', built_at: built, commits: b.details } },
    ]
}

export function decorate(page, ctx) {
    if (page.rel !== REL) return
    const html = `<div class="lv" id="lv" data-data="../../${API}" data-details="../../${DET}" data-repo="${REPO}"></div>`
    page.assets = { css: ['assets/newsroom/live.css'], js: ['assets/newsroom/live.js'] }
    const prev = page.postHtml
    page.postHtml = h => html + '\n' + (prev ? prev(h) : h)
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/newsroom/live.js', 'assets/newsroom/live.css']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try { if (!gate.text(REL).includes('id="lv"')) out.push(`${REL} does not carry the live map`) } catch { out.push(`missing ${REL}`) }
    try {
        const d = gate.json(API), det = gate.json(DET).commits, n = d.agents.length
        for (const e of d.events) {
            if (e[1] >= n || e[3].some(t => t >= n)) out.push(`live.json: an event names an agent that does not exist (${e[4]})`)
            if (!det[e[4]]) out.push(`live.json: no details for ${e[4]}`)
        }
        if (!d.events.length) out.push('live.json: no events')
        if (!d.agents.some(a => OURS.test(a.id))) out.push('live.json: none of Dinis\'s agents is in it')
        if (/[A-Za-z0-9._%+-]+@(?!(promptugal|web-summit)\.)[A-Za-z0-9-]+\.[A-Za-z]{2,}/i.test(JSON.stringify(det))) out.push('live-details.json: an address that is not an agent id')
    } catch (e) { out.push(`cannot check the live map data: ${e.message}`) }
    return out
}
