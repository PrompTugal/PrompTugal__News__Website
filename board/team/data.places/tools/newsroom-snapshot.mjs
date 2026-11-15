// A snapshot of newsroom.sgit.ai's article graph (https://newsroom.sgit.ai/articles/graphs.json, CC BY 4.0, Dinis's
// newsroom) for /query/ (data.places@PrompTugal.dinis, 16 November 2026; the conductor's addendum to
// board/briefs/2026-11-15-show-the-power.md: "make it queryable"). Keeps each article's identity, topics, tags,
// links and its graph (nodes and typed edges); drops the figures and cards. Re-run to refresh:
//   node board/team/data.places/tools/newsroom-snapshot.mjs [--from <a local copy of graphs.json>]
import fs from 'node:fs'
const SRC = 'https://newsroom.sgit.ai/articles/graphs.json', OUT = new URL('../../../../assets/query/newsroom-graphs.json', import.meta.url)
const i = process.argv.indexOf('--from')
const d = i > 0 ? JSON.parse(fs.readFileSync(process.argv[i + 1], 'utf8')) : await (await fetch(SRC)).json()
const snap = {
    about: 'A snapshot of newsroom.sgit.ai\'s article graph, every article with its topics, tags, links and its graph of typed nodes and edges; made queryable on promptugal.news/query/ as the nr_ tables.',
    source: SRC, licence: 'CC BY 4.0, newsroom.sgit.ai', read_on: new Date().toISOString().slice(0, 10), site_version: d.site_version, generated: d.generated,
    node_kinds: d.node_kinds, edge_relations: d.edge_relations,
    articles: d.articles.map(a => ({ slug: a.slug, title: a.title, date: a.date, url: a.url, topics: a.topics || [], tags: a.tags || [], links_out: a.links_out || [],
        core_idea: (a.graph && a.graph.core_idea) || null,
        nodes: ((a.graph && a.graph.nodes) || []).map(n => ({ id: n.id, label: n.label, kind: n.kind, summary: n.summary || null })),
        edges: ((a.graph && a.graph.edges) || []).map(e => ({ from: e.from, to: e.to, rel: e.rel })) })),
}
fs.writeFileSync(OUT, JSON.stringify(snap) + '\n')
console.log(`newsroom snapshot: ${snap.articles.length} articles, ${fs.statSync(OUT).size} bytes`)
