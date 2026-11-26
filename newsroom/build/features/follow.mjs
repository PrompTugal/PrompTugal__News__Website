// Follow (the conductor's PT decision of 26 Nov 2026, on synthetic@'s F58, "no way to subscribe"): a page that lists the feeds the site already
// makes (the articles, each place, each topic; lib/feeds.mjs), with a Follow link in the header and the footer. No email sign-up: what an email
// may promise is Dinis's. The lists are made from data, never typed: the places from data/by-place/places.json, the topics from the store.
import fs from 'node:fs'
import path from 'node:path'
export const order = 60

const rd = (ctx, f) => { try { return JSON.parse(fs.readFileSync(path.join(ctx.ROOT, f), 'utf8')) } catch { return null } }

export const fill = {
    'follow:places': (page, ctx) => {
        const places = (rd(ctx, 'data/by-place/places.json') || { places: [] }).places
        return places.map(p => `- ${ctx.md.esc(p.name)}: [RSS](${ctx.link(page.rel, `api/v1/by-place/${p.id}/feed.xml`)}), [JSON Feed](${ctx.link(page.rel, `api/v1/by-place/${p.id}/feed.json`)})`).join('\n')
    },
    'follow:topics': (page, ctx) => ctx.store.topics
        .map(t => `- ${ctx.md.esc(t.name)}: [RSS](${ctx.link(page.rel, `api/v1/topics/${t.id}/feed.xml`)}), [JSON Feed](${ctx.link(page.rel, `api/v1/topics/${t.id}/feed.json`)})`).join('\n'),
}
