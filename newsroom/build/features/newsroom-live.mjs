// Dinis's live map, the data (Dinis, 7 November 2026, about 23:50 UTC; board/team/conductor.b/briefs/2026-11-07-dinis-live-map.md).
//   Load       this repository's history (CI checks it out whole, fetch-depth 0): every commit, its time, its trailers
//   Extract    an exchange per commit whose Agent: is one of Dinis's agents (*@PrompTugal.dinis) or names one in its
//              For: or To: trailers: from the Agent, to each name in For: and To:
//   Transform  the people and agents seen (each with its owner, from the address: <role>@<team>.<person>), and the
//              exchanges in time order with the commit's subject, its body without its trailers, its files and its link;
//              email addresses taken out (the gate's rule: no contact detail), the body cut at 1,200 characters
//   Save       api/v1/newsroom/live.json, for the view (/newsroom/live/, dev.graphs@'s, reviewed by dev@)
// The agents' inboxes are sealed and never read: only what the commits already say in public.
import { execFileSync } from 'node:child_process'
export const order = 90

const MINE = /@PrompTugal\.dinis$/
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]*[A-Za-z]{2,}/g
const AGENT = /^[a-z0-9.-]+@[A-Za-z0-9-]+\.[a-z0-9-]+$/
const SEP = '\u001e', FS = '\u001f'
const names = s => String(s || '').split(/[;,]/).map(x => x.trim()).filter(Boolean)
const ownerOf = n => AGENT.test(n) ? n.split('@')[1].split('.').pop() : n.toLowerCase().split(' ')[0]
const kindOf = n => AGENT.test(n) ? 'agent' : 'person'
const clean = t => t.replace(EMAIL, m => /@(web-summit|PrompTugal)\.[a-z0-9-]+$/i.test(m) ? m : '[address]')

function history(ROOT) {
    const fmt = ['%H', '%cI', '%(trailers:key=Agent,valueonly,separator=;)', '%(trailers:key=For,valueonly,separator=;)', '%(trailers:key=To,valueonly,separator=;)', '%s', '%b'].join(FS)
    let out = ''
    try { out = execFileSync('git', ['log', '--no-merges', '--name-only', `--format=${SEP}${fmt}${FS}`], { cwd: ROOT, maxBuffer: 256 * 1024 * 1024 }).toString() } catch { return [] }
    return out.split(SEP).slice(1).map(c => {
        const [sha, at, agent, forr, to, subject, body, files] = c.split(FS)
        return { sha, at, from: names(agent)[0] || '', to: [...new Set([...names(forr), ...names(to)])], subject, body: (body || '').replace(/^[A-Z][A-Za-z-]+: .*$/gm, '').trim(), files: (files || '').split('\n').map(f => f.trim()).filter(Boolean) }
    })
}

export const api = ctx => {
    const all = history(ctx.ROOT).filter(c => c.from && c.to.length && (MINE.test(c.from) || c.to.some(n => MINE.test(n))))
    const nodes = new Map()
    const add = n => { if (!nodes.has(n)) nodes.set(n, { id: n, kind: kindOf(n), owner: ownerOf(n), mine: MINE.test(n) }) }
    const exchanges = all.map(c => { add(c.from); c.to.forEach(add)
        return { at: c.at, from: c.from, to: c.to.filter(n => n !== c.from), sha: c.sha.slice(0, 12), subject: clean(c.subject), body: clean(c.body).slice(0, 1200), files: c.files.slice(0, 40), link: `${ctx.REPO}/commit/${c.sha}` } })
        .filter(x => x.to.length).sort((a, b) => a.at.localeCompare(b.at))
    return [{ path: 'api/v1/newsroom/live.json', schema: null, data: { about: 'Dinis\'s agents and the agents and people they exchange with, from this repository\'s commits (Agent:, For:, To: trailers); one exchange per commit, in time order. Public: only what the commits say.', version: ctx.VERSION,
        from: exchanges[0]?.at || null, to: exchanges.at(-1)?.at || null, nodes: [...nodes.values()].sort((a, b) => a.owner.localeCompare(b.owner) || a.id.localeCompare(b.id)), exchanges } }]
}
