// Code from outside dev@'s review (security@'s S30, 8 November): an agent not of this team (its subject is not
// "<role>@PrompTugal.dinis: ...") that last changed a file under newsroom/build/ or assets/ is code dev@ has not reviewed,
// unless its commit is listed in board/team/dev/tools/reviewed.txt ("<commit> <what was read>"). The gate warns, so the
// review happens at dev@'s next wake; it does not fail, so another team's urgent fix still ships.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
export const order = 99
const LIST = 'board/team/dev/tools/reviewed.txt'

export function warn(gate) {
    let log = ''
    try { log = execFileSync('git', ['log', '-n', '400', '--format=@@%h %s', '--name-only', '--', 'newsroom/build', 'assets'], { cwd: gate.ROOT, maxBuffer: 64 * 1024 * 1024 }).toString() } catch { return [] }
    const ok = new Set((fs.existsSync(path.join(gate.ROOT, LIST)) ? fs.readFileSync(path.join(gate.ROOT, LIST), 'utf8') : '').split('\n').map(l => l.split(' ')[0]).filter(Boolean))
    const last = new Map()
    for (const block of log.split('@@').slice(1)) {
        const [head, ...files] = block.split('\n'), [sha, ...subj] = head.split(' '), s = subj.join(' ')
        for (const f of files.map(x => x.trim()).filter(Boolean)) if (!last.has(f)) last.set(f, { sha, s })
    }
    const out = new Map()
    for (const [f, c] of last) if (!/^(site v\d|[a-z0-9.-]+@PrompTugal\.dinis:)/.test(c.s) && !ok.has(c.sha)) out.set(c.sha, [...(out.get(c.sha) || []), f])
    return [...out].map(([sha, fs_]) => `code from outside dev@'s review: ${sha} changed ${fs_.slice(0, 3).join(', ')}${fs_.length > 3 ? ` and ${fs_.length - 3} more` : ''}; dev@ reviews it and lists it in ${LIST}`)
}
