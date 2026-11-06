// Decisions as pages (board/spec-decisions-pages.md, row 1 for dev@): /newsroom/decisions/ (its words:
// content/newsroom/decisions/index.md), built from every content page whose front matter has `decision: open|decided`
// (asked_by, asked_of, since, blocks, answer, answered_at). Open ones oldest first; decided ones with the answer and
// its date. The dashboard's "Now" lists the open ones too (features/dashboard.mjs reads decisionsOf).
export const order = 76
const INDEX = 'newsroom/decisions/index.html', API = 'api/v1/newsroom/decisions.json'
export const decisionsOf = ctx => ctx.content.filter(p => p.meta && /^(open|decided)$/.test(String(p.meta.decision || '')))
    .map(p => ({ title: p.meta.title, rel: p.rel, state: p.meta.decision, asked_by: p.meta.asked_by || null, asked_of: p.meta.asked_of || null, since: p.meta.since || null, blocks: p.meta.blocks || null, answer: p.meta.answer && p.meta.answer !== 'null' ? p.meta.answer : null, answered_at: p.meta.answered_at && p.meta.answered_at !== 'null' ? p.meta.answered_at : null })).map(d => ({ ...d, for_dinis: /\bfor dinis\b/i.test(d.title) }))
    .sort((a, b) => String(a.since || '').localeCompare(String(b.since || '')))
// whose: a decision titled "For Dinis" waits on him (money, the law, the brand, people, RiskMandate, what an email may
// promise); every other one is a PT decision, the team's: the owner decides and ships (CLAUDE.md, "Decisions are pages")
export const forDinis = d => /\bfor dinis\b/i.test(d.title)
const cell = (ctx, s) => ctx.md.cell(String(s ?? ''))
export const fill = {
    'decisions:open': (p, ctx) => {
        const O = decisionsOf(ctx).filter(d => d.state === 'open' && forDinis(d))
        return O.length ? '| Since | Decision | Asked by | What it blocks |\n|---|---|---|---|\n' + O.map(d => `| ${cell(ctx, String(d.since || '').replace('T', ' '))} | [${cell(ctx, d.title)}](${ctx.link(INDEX, d.rel)}) | ${cell(ctx, d.asked_by)} | ${cell(ctx, d.blocks)} |`).join('\n') : 'Nothing waits on Dinis.'
    },
    'decisions:team': (p, ctx) => {
        const O = decisionsOf(ctx).filter(d => d.state === 'open' && !forDinis(d))
        return O.length ? '| Since | Decision | Owner | What it blocks |\n|---|---|---|---|\n' + O.map(d => `| ${cell(ctx, String(d.since || '').replace('T', ' '))} | [${cell(ctx, d.title)}](${ctx.link(INDEX, d.rel)}) | ${cell(ctx, d.asked_by)} | ${cell(ctx, d.blocks)} |`).join('\n') : 'None open.'
    },
    'decisions:decided': (p, ctx) => {
        const D = decisionsOf(ctx).filter(d => d.state === 'decided')
        return D.length ? '| Answered | Decision | Answer |\n|---|---|---|\n' + D.map(d => `| ${cell(ctx, d.answered_at)} | [${cell(ctx, d.title)}](${ctx.link(INDEX, d.rel)}) | ${cell(ctx, d.answer)} |`).join('\n') : 'None yet.'
    },
    'decisions:api': (p, ctx) => `[${API}](${ctx.link(INDEX, API)})`,
}
export const api = ctx => [{ path: API, data: { built: ctx.VERSION, decisions: decisionsOf(ctx) }, schema: null }]
export const llms = ctx => `## Decisions\n- [newsroom/decisions/](${ctx.BASE}newsroom/decisions/index.md): every decision waiting on Dinis, each a page with its options in full; as data: [${API}](${ctx.BASE}${API}).\n\n`
