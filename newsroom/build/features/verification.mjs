// The verification pipeline's record, as a page (dev.verify@, pass the-verification-pipeline). Reads the records that
// newsroom/tools/verify/verify.mjs writes (board/team/dev.verify/records/<slug>/verified.json) and fills the markers of
// content/newsroom/verification.md. The articles themselves are not touched: their signatures cover their twins.
import fs from 'node:fs'
import path from 'node:path'
import { isWithdrawnArticle } from '../lib/withdrawn.mjs'
export const order = 96
const DIR = 'board/team/dev.verify/records'
const records = ROOT => {
    const d = path.join(ROOT, DIR)
    if (!fs.existsSync(d)) return []
    return fs.readdirSync(d).map(s => path.join(d, s, 'verified.json')).filter(f => fs.existsSync(f))
        .map(f => JSON.parse(fs.readFileSync(f, 'utf8'))).filter(r => !isWithdrawnArticle(r.article))   // a withdrawn article is listed nowhere (data/site/withdrawn.json)
        .sort((a, b) => a.article.localeCompare(b.article))
}
const done = r => r.claims.filter(c => c.consensus !== 'unchecked' && c.consensus !== 'incomplete')
const short = m => m.replace(/^.*\//, '')

export const fill = {
    'verification:table': (page, ctx) => records(ctx.ROOT).map(r => {
        const n = done(r).length, ok = done(r).filter(c => c.consensus === 'supported').length
        const read = r.sources.filter(s => s.read !== false && s.status === 200).length
        return `| [${r.article}](${ctx.link(page.rel, `articles/${r.article}.html`)}) | ${r.verified_on} | ${n} | ${ok} | ${n - ok} | ${read} of ${r.sources.length} | ${r.models.map(short).join(', ')} |`
    }).join('\n'),
    'verification:flags': (page, ctx) => records(ctx.ROOT).map(r => {
        const flagged = r.claims.filter(c => c.flag_to_journalist)
        if (!flagged.length) return ''
        return `### ${r.article}\n\n` + flagged.map(c => `- ${c.claim} *(${c.verdicts.map(v => `${short(v.model)}: ${v.verdict}`).join('; ')})*`).join('\n')
    }).filter(Boolean).join('\n\n'),
}
