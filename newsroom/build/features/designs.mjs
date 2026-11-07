// The home page's designs (Dinis, 6 November 2026, about 23:20 UTC; board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md):
// today's page as the default, Silvio's mocks A to G as options, each a layout built from data by its own feature
// (front-e.mjs for E) and placed before the frame with data-design-of="<id>". This feature offers the ones built:
// the picker (assets/design/: design.tmpl, design.css, design.js, ported from Silvio's lab toggle) through the marker
// <!-- front:designs -->, which comes after every design's marker in content/index.md; and the switch in <head>.
import fs from 'node:fs'
import path from 'node:path'
export const order = 24

const DIR = 'assets/design/'
const T = fs.readFileSync(new URL(`../../../${DIR}design.tmpl`, import.meta.url), 'utf8')
const LIST = JSON.parse(fs.readFileSync(new URL(`../../../${DIR}designs.json`, import.meta.url), 'utf8'))
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
let builtIds = [LIST.default]

export const fill = {
    'front:designs': (page, ctx) => {
        const esc = ctx.md.esc, on = page.before || ''
        const built = LIST.designs.filter(d => d.id === LIST.default || on.includes(`data-design-of="${d.id}"`))
        builtIds = built.map(d => d.id)
        if (built.length < 2) return ''
        const shot = id => fs.existsSync(path.join(ctx.ROOT, `${DIR}shots/${id}.jpg`)) ? `${DIR}shots/${id}.jpg` : ''
        const cards = built.map(d => put(item('card'), { id: d.id, name: esc(d.name), note: esc(d.note), default: d.id === LIST.default ? item('default') : '',
            pic: shot(d.id) ? put(item('pic'), { src: shot(d.id) }) : put(item('nopic'), { name: esc(d.name) }) })).join('')
        page.credit = LIST.credit
        page.before = on + put(part('picker'), { default_name: esc(built[0].name), count: built.length, '#cards': cards })
        return ''
    },
}

// the home page carries the picker's look and the switch (in <head>, told which designs are built)
export function decorate(p) {
    if (p.rel !== 'index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), `${DIR}design.css`],
        head: [...(p.assets?.head || []), { src: `${DIR}design.js`, data: { default: LIST.default, designs: () => builtIds.join(' ') } }] }
}
