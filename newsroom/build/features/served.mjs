// What the site serves from folders no reviewer reads as code (security@'s S1: "desks/ serves any file type"). The
// key a person signs in with lives in this origin's browser storage; a document served from promptugal.news could
// use it. So desks/ and data/ may hold no document that runs script: no HTML, XHTML or WebAssembly, and no SVG with a
// script, an event handler, a javascript: link or foreignObject. Scripts kept there as tools (.js, .mjs, .cjs) are
// left out of the deploy (.github/workflows/deploy-pages.yml, the artifact step); the gate checks that rule is there.
import { execFileSync } from 'node:child_process'
export const order = 97
const DIRS = ['desks/', 'data/'], DOC = /\.(html?|xhtml|xht|wasm)$/i, ACTIVE = /<script|\son[a-z]+\s*=|javascript:|<foreignObject/i
export function validate(gate) {
    const out = [], files = execFileSync('git', ['ls-files', ...DIRS], { cwd: gate.ROOT }).toString().split('\n').filter(Boolean)
    for (const f of files) {
        if (DOC.test(f)) out.push(`${f}: a document that can run script, served from ${f.split('/')[0]}/ on this origin (S1): keep it out of the site, or ask dev@`)
        else if (/\.svg$/i.test(f) && ACTIVE.test(gate.text(f))) out.push(`${f}: an SVG with active content (script, an event handler, javascript: or foreignObject), served on this origin (S1)`)
    }
    const wf = gate.text('.github/workflows/deploy-pages.yml')
    for (const d of DIRS) if (!wf.includes(`--exclude '${d}**/*.js'`) || !wf.includes(`--exclude '${d}**/*.mjs'`) || !wf.includes(`--exclude '${d}**/*.cjs'`)) out.push(`.github/workflows/deploy-pages.yml: the artifact step must leave out ${d}'s scripts (--exclude '${d}**/*.js', '*.mjs', '*.cjs'; S1)`)
    return out
}
