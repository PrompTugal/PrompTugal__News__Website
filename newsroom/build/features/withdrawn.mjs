// Withdrawn pages (data/site/withdrawn.json; the team site's people/vicky/decisions.md, standing answer 47, 11 Nov 2026:
// Vicky, relaying Dinis's decision on the Web Summit takedown; built by dev@PrompTugal.vicky). Each withdrawn article and
// story page keeps its address and shows only the notice, "Withdrawn on 11 November 2026.", with no reason; it is
// noindex and unlisted (out of llms.txt and the sitemap), and lib/content.mjs and lib/data.mjs leave the article or story
// out of everything else (indexes, front page, search, company pages, story board, lists). Its signed twin is left out of
// the deploy (features/served.mjs adds it to the deploy's exclude list). Nothing is deleted.
import { withdrawn } from '../lib/withdrawn.mjs'
export const order = 1

export const relsOf = () => { const W = withdrawn(); return [...[...W.articles].map(s => `articles/${s}.html`), ...[...W.stories].map(id => `newsroom/stories/${id}/index.html`)] }
export const sigsOf = () => [...withdrawn().articles].map(s => `articles/${s}.md.sig`)

export function pages(ctx) {
    const W = withdrawn()
    if (!W.notice) return []
    return relsOf().map(rel => ({ rel, title: W.notice, summary: '', md: '', meta: { title: W.notice }, type: 'site', listed: false, noindex: true, withdrawn: true, crumbs: [] }))
}

export function validate(gate) {
    const W = withdrawn(), out = []
    if (!W.notice) return W.articles.size || W.stories.size ? ['withdrawn: data/site/withdrawn.json lists pages but has no notice'] : []
    const drop = new Set(gate.text('api/v1/deploy-exclude.txt').split('\n').filter(Boolean).map(l => l.slice(1)))
    for (const rel of relsOf()) {
        if (!gate.generated.has(rel)) { out.push(`withdrawn: ${rel} was not built`); continue }
        const h = gate.text(rel)
        if (!h.includes(W.notice)) out.push(`withdrawn: ${rel} does not show the notice`)
        if (!/<meta name="robots" content="noindex/.test(h)) out.push(`withdrawn: ${rel} is not noindex`)
    }
    for (const s of sigsOf()) if (!drop.has(s)) out.push(`withdrawn: ${s} is not left out of the deploy`)
    for (const f of ['llms.txt', 'sitemap.xml']) { const t = gate.text(f); for (const rel of relsOf()) if (t.includes(rel)) out.push(`withdrawn: ${f} still names ${rel}`) }
    return out
}
