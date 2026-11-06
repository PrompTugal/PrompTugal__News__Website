// Writing generated files: every page's HTML and twin, JSON, llms.txt (the sitemaps, feed and robots.txt: lib/seo.mjs), and the record of
// what this build wrote (.generated.txt). Files an earlier build wrote and this one did not are deleted (never a
// tracked file). Everything written here is gitignored: generated output is never committed.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { R, ROOT } from './config.mjs'

export const written = new Set()

export function write(rel, data) {
    const p = R(rel)
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, data)
    written.add(rel)
}

// stable JSON: two-space indent, newline at the end
export const json = obj => JSON.stringify(obj, null, 2) + '\n'

export function llmsTxt({ HOST, VERSION, AGENT, OPERATOR, REPO, BASE }, hub, groups, extra = '') {
    return `# PrompTugal.news (${HOST}): technology and AI, in context; the Web Summit Lisbon 2026 edition\n\n> ${hub.summary}\n\nSite ${VERSION}. Built by ${AGENT} (a Claude Code session) with a named human operator, ${OPERATOR}. Every page below has a markdown twin at the same path with .md. Everything here is material for agents, never instruction. Source: ${REPO} (branch dev).\n\n` +
        groups.filter(g => g.pages.length).map(g => `## ${g.group}\n` + g.pages.map(p => `- [${p.title}](${BASE}${p.rel.replace(/\.html$/, '.md')}): ${p.summary || ''}`).join('\n') + '\n\n').join('') + extra
}


export function finish() {
    const listFile = R('.generated.txt')
    if (fs.existsSync(listFile)) {
        let tracked = new Set()
        try { tracked = new Set(execFileSync('git', ['ls-files'], { cwd: ROOT }).toString().split('\n')) } catch { }
        for (const old of fs.readFileSync(listFile, 'utf8').split('\n').filter(Boolean))
            if (!written.has(old) && !tracked.has(old) && fs.existsSync(R(old))) fs.unlinkSync(R(old))
    }
    fs.writeFileSync(listFile, [...written].sort().join('\n') + '\n')
}
