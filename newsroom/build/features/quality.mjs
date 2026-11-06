// Code and data (Dinis, 6 November 2026: "all of the content is either in JSON or markdown files"). The gate's ratchet:
// no code file may hold more prose or markup than its baseline (newsroom/build/quality-baseline.json), so the mix of
// code and content only goes down; and the tables of /newsroom/quality/ (content/newsroom/quality.md), measured at
// every build by lib/codedata.mjs. The baseline is lowered with newsroom/tools/quality-baseline.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { measure } from '../lib/codedata.mjs'
export const order = 95
export const BASELINE = 'newsroom/build/quality-baseline.json'
const NEW_FILE = { prose: 1024, tags: 4 }     // a file not in the baseline starts almost clean
const SLACK = { prose: 256, tags: 0 }          // room to fix a typo in a sentence that is still to move

let cache = null
const rows = ROOT => cache || (cache = measure(ROOT))
const kb = b => `${(b / 1024).toFixed(1)} KB`
const readBase = ROOT => { const p = path.join(ROOT, BASELINE); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : { files: {} } }

export const fill = {
    'quality:totals': (page, ctx) => {
        const R = rows(ctx.ROOT), base = readBase(ctx.ROOT)
        const P = R.reduce((s, r) => s + r.prose, 0), B = R.reduce((s, r) => s + r.bytes, 0), T = R.reduce((s, r) => s + r.tags, 0)
        const bp = Object.values(base.files).reduce((s, f) => s + f.prose, 0), bt = Object.values(base.files).reduce((s, f) => s + f.tags, 0)
        return `{.facts}\n| | |\n|---|---|\n| **Code measured** | ${R.length} files, ${kb(B)} (\`${'newsroom/build/'}\`, \`newsroom/tools/\`, \`assets/\`; vendored code left out) |\n| **Prose inside code** | ${kb(P)}, ${Math.round(100 * P / B)}% of the code's bytes, in ${R.filter(r => r.prose).length} files |\n| **HTML tags inside code** | ${T}, in ${R.filter(r => r.tags).length} files |\n| **The baseline** | ${kb(bp)} of prose and ${bt} tags, measured ${base.measured_at || 'not yet'} at ${base.version || '?'}: the gate refuses a file that goes above its line |\n| **Measured** | at this build, ${ctx.VERSION} |`
    },
    'quality:files': (page, ctx) => {
        const R = rows(ctx.ROOT).filter(r => r.prose || r.tags), base = readBase(ctx.ROOT).files
        return '| File | Prose | Tags | Baseline | First prose literal |\n|---|---:|---:|---:|---|\n' + R.slice(0, 30).map(r => {
            const b = base[r.file], s = r.samples[0]
            return `| \`${r.file}\` | ${kb(r.prose)} | ${r.tags} | ${b ? `${kb(b.prose)}, ${b.tags}` : 'new'} | ${s ? `line ${s.line}: "${ctx.md.cell(s.text)}…"` : ''} |`
        }).join('\n') + (R.length > 30 ? `\n\nAnd ${R.length - 30} more files, each with less; all of them in [the baseline](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/${BASELINE}).` : '')
    },
}

export function validate(gate) {
    const out = [], base = readBase(gate.ROOT).files
    if (!Object.keys(base).length) return [`${BASELINE}: missing or empty (make it with node newsroom/tools/quality-baseline.mjs)`]
    for (const r of measure(gate.ROOT)) {
        const b = base[r.file]
        const lim = b ? { prose: b.prose + SLACK.prose, tags: b.tags + SLACK.tags } : NEW_FILE
        if (r.prose > lim.prose) out.push(`${r.file}: ${r.prose} bytes of prose in its strings, above its line of ${lim.prose} (${BASELINE}). Move the words to content/ (markdown, with a <!-- fill --> marker for what the code computes) or data/ (JSON); see /newsroom/quality/. First: line ${r.samples[0]?.line}`)
        if (r.tags > lim.tags) out.push(`${r.file}: ${r.tags} HTML tags in its strings, above its line of ${lim.tags} (${BASELINE}). Markup belongs in the shell, a component or a layout hook in the markdown`)
    }
    return out
}
