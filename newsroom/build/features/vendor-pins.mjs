// Every vendored file is the file its VENDOR.md pins (security@'s pre-review condition P6 for the pairing pages,
// board/passes/2026-11-17-pairing-step-1.md; dev@PrompTugal.dinis, 17 November 2026). A table row "| `file` | `<sha256>` |"
// in any assets/vendor/**/VENDOR.md names a file relative to that VENDOR.md; the gate recomputes its SHA-256. A changed
// vendored file is a new dated folder with its own VENDOR.md, never an edit.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
export const order = 98
const ROW = /^\| `([^`]+)` \| `([0-9a-f]{64})` \|/

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name === 'VENDOR.md' ? [path.join(d, e.name)] : [])

export function validate(gate) {
    const out = [], root = path.join(gate.ROOT, 'assets/vendor')
    let files = []
    try { files = walk(root) } catch { return ['assets/vendor/ is missing'] }
    let rows = 0
    for (const v of files) {
        const dir = path.dirname(v), rel = path.relative(gate.ROOT, v)
        for (const line of fs.readFileSync(v, 'utf8').split('\n')) {
            const m = ROW.exec(line)
            if (!m) continue
            rows++
            const f = path.join(dir, m[1])
            if (!f.startsWith(dir + path.sep)) { out.push(`${rel}: ${m[1]} is outside its folder`); continue }
            let sha
            try { sha = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') } catch { out.push(`${rel}: pins ${m[1]}, which is missing`); continue }
            if (sha !== m[2]) out.push(`${rel}: ${m[1]} is not the pinned file (sha256 ${sha.slice(0, 12)}…, pinned ${m[2].slice(0, 12)}…)`)
        }
    }
    if (!rows) out.push('no vendored file is pinned (assets/vendor/**/VENDOR.md)')
    return out
}
