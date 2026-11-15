// The cast, drawn in code: one construction for every agent, after the book's cast (One Human, Nine Agents, Nineteen
// Hours, LAB 27): a square head with a face, a body in the agent's colour, one thing on the head and one in the hand,
// and four moods (happy, worried, stressed, unhappy). The looks and words are assets/viz/cast.json; the drawing is
// assets/viz/cast.tmpl. Also the template helper the other viz-* features use (tmpl, fill, xesc).
// Not a feature by itself (it exports no hook). By viz.places@PrompTugal.dinis, 15 November 2026.

export const xesc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const fill = (t, v) => String(t || '').replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] ?? '')

// a template file: sections, each after a comment line holding only its name
const TM = new Map()
export function tmpl(ctx, file) {
    if (!TM.has(file)) {
        const parts = ctx.readText(file).split(/\n?<!-- ([\w-]+) -->\n/)
        const t = {}
        for (let i = 1; i < parts.length; i += 2) t[parts[i]] = parts[i + 1].trim()
        TM.set(file, t)
    }
    return TM.get(file)
}

let CAST = null
export function cast(ctx) {
    if (!CAST) CAST = ctx.readJSON('assets/viz/cast.json')
    return CAST
}

export function lookOf(ctx, role, accent) {
    const c = cast(ctx)
    const l = c.looks.find(x => new RegExp(x.match).test(role)) || c.looks[c.looks.length - 1]
    const colour = l.colour === 'accent' ? (/^#[0-9a-f]{6}$/i.test(accent || '') ? accent : '#1f5f3f') : l.colour
    return { ...l, colour }
}

// the conductor's face is its clock, so its hands carry the mood (as in the book)
const HANDS = { happy: [300, 60], worried: [270, 90], stressed: [140, 220], unhappy: [240, 120] }
const hand = (deg, len) => { const r = (deg - 90) * Math.PI / 180; return `M40 30L${(40 + len * Math.cos(r)).toFixed(1)} ${(30 + len * Math.sin(r)).toFixed(1)}` }

function parts(ctx, role, accent, mood) {
    const T = tmpl(ctx, 'assets/viz/cast.tmpl'), L = lookOf(ctx, role, accent), c = L.colour
    const hs = HANDS[mood] || HANDS.happy
    const face = L.look === 'conductor' ? fill(T.clock, { h1: hand(hs[0], 8), h2: hand(hs[1], 10) })
        : (/^(researcher|reviewer)$/.test(L.look) ? T['eyes-glasses'] : T.eyes) + (T[`mouth-${mood}`] || '')
    return {
        L, face, c,
        hat: fill(T[`hat-${L.look}`] || '', { c }), prop: fill(T[`prop-${L.look}`] || '', { c }),
        body: fill(T[`body-${L.look}`] || T.body, { c }),
    }
}

// one character, as an SVG string; size is its rendered height in px
export function figure(ctx, { role, accent, mood = 'happy', size = 96, title = '' }) {
    const P = parts(ctx, role, accent, mood)
    return fill(tmpl(ctx, 'assets/viz/cast.tmpl').fig, { ...P, mood: xesc(mood), w: Math.round(size * 0.8), h: size, title: xesc(title || `${role}, ${mood}`) })
}

// just the head, small, for strips and counters
export function head(ctx, { role, accent, mood = 'happy', size = 28, title = '' }) {
    const P = parts(ctx, role, accent, mood)
    return fill(tmpl(ctx, 'assets/viz/cast.tmpl').headonly, { ...P, mood: xesc(mood), w: Math.round(size * 1.12), h: size, title: xesc(title || role) })
}
