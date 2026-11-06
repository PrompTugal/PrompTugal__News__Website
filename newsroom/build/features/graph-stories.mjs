// The best of the graph (/graph/stories/): each preset view of the explorer with what it is telling you and a link that opens
// it. The captions are data (assets/graph/captions.json), also shown under the explorer's bar. By dev.graphs@PrompTugal.dinis.
import fs from 'node:fs'
import path from 'node:path'
export const order = 87
const REL = 'graph/stories/index.html'
const read = ctx => JSON.parse(fs.readFileSync(path.join(ctx.ROOT || process.cwd(), 'assets/graph/captions.json'), 'utf8')).presets

export function pages(ctx) {
    const caps = read(ctx)
    const body = Object.entries(caps).map(([key, c]) => `## ${c.title} {#${key}}\n\n${c.caption}\n\n[Open this view in the graph](${ctx.link(REL, 'graph/index.html')}?preset=${key})\n`).join('\n')
    const md = `Each picture below is a ready-made view of [the graph](${ctx.link(REL, 'graph/index.html')}), with a sentence on what it is telling you. Open one and keep exploring from it: every link opens the explorer on that view.\n\n${body}\nThe other graph pictures: [centres of gravity](${ctx.link(REL, 'graph/gravity/index.html')}), [the industry map](${ctx.link(REL, 'graph/industry/index.html')}), [RiskMandate's ring](${ctx.link(REL, 'graph/riskmandate/index.html')}).\n`
    return [{ rel: REL, src: 'assets/graph/captions.json', type: 'data', title: 'The best of the graph', summary: 'Eight ready-made views of the graph, each with a sentence on what it is telling you.', crumbs: [['graph/index.html', 'The graph'], [null, 'The best of']], toc: [], md }]
}

export function validate(gate) {
    const out = []
    try {
        const caps = JSON.parse(gate.text('assets/graph/captions.json')).presets
        const keys = [...gate.text('assets/graph/engine.js').matchAll(/key: '([\w-]+)', label/g)].map(m => m[1])
        for (const k of keys) if (!caps[k]) out.push(`assets/graph/captions.json has no caption for the preset ${k}`)
        for (const k of Object.keys(caps)) if (!keys.includes(k)) out.push(`assets/graph/captions.json has a caption for a preset that does not exist: ${k}`)
    } catch (e) { out.push(`cannot check the captions: ${e.message}`) }
    return out
}
