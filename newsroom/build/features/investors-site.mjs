// The investor site (investors@PrompTugal.dinis, 7 November 2026, at Dinis Cruz's word: "treat that investors area as
// literally a standalone website, which also should be in the four languages ... every page I can easily swap
// language ... very visual"; board/team/investors/dinis-2026-11-07-the-investor-site.md). For dev@'s review.
//   Load       board/team/investors/site/: site.json (languages, audiences and their routes, the library, the decks),
//              tpl/<name>.tpl (the layouts, with {{x}}, {{{raw}}}, {{#list}}...{{/list}}, {{^none}}...{{/none}}, {{> partial}}),
//              i18n/<lang>.json (every word of the visual pages, English filling a gap), md/<page>.<lang>.md (the long
//              pages), articles/<slug>.<lang>.md, img/ (covers and slide thumbnails); the decks' words for their titles
//   Transform  each page in each language into a page with its own markup (page.raw, as features/decks.mjs): English at
//              /investors/<page>/, the others at /investors/<lang>/<page>/; the same page in every language one click
//              away; hreflang alternates; <meta name="variant" content="inv-<page>"> for observability's lane. A link written
//              "/investors/<page>/" in the words or layouts resolves to the page in its own language
//   Save       the pages, and api/v1/investors/site.css (copied out of board/). No script of investors@'s is served:
//              the pages carry only assets/obs/obs.js (S1b)
import fs from 'node:fs'
export const order = 62

const B = 'board/team/investors/', S = B + 'site/', DK = B + 'decks/'
// persona.js is served only from dev@'s reviewed copy (security@'s S1b), as the deck player is; investors@'s copy is S + 'persona.js'
export const PERSONA = 'board/team/dev/investors/persona.js'
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const strip = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim()
const merge = (a, b) => { if (Array.isArray(a) || typeof a !== 'object' || a === null) return b ?? a; const o = { ...a }; for (const k in b || {}) o[k] = k in a ? merge(a[k], b[k]) : b[k]; return o }
const nice = t => t.replace(/^Investors: ?/, '').replace(/^./, c => c.toUpperCase())
const NAMES = { en: ['EN', 'English'], pt: ['PT', 'Português'], es: ['ES', 'Español'], fr: ['FR', 'Français'] }

// a small mustache: {{a.b}} escaped, {{{a}}} as is, {{#a}}..{{/a}} (a list: once per item; true: once), {{^a}}..{{/a}}, {{> p}}
function mustache(T) {
    const get = (stack, name) => { if (name === '.') return stack[stack.length - 1]; const [h, ...r] = name.split('.'); for (let i = stack.length - 1; i >= 0; i--) { const c = stack[i]; if (c && typeof c === 'object' && h in c) return r.reduce((v, k) => v?.[k], c[h]) } }
    const run = (src, stack) => src.replace(/\{\{([#^])\s*([\w.]+)\s*\}\}([\s\S]*?)\{\{\/\s*\2\s*\}\}|\{\{\{\s*([\w.]+)\s*\}\}\}|\{\{>\s*([\w-]+)\s*\}\}|\{\{\s*([\w.]+)\s*\}\}/g, (m, kind, name, inner, raw, part, key) => {
        if (kind) { const v = get(stack, name), empty = !v || (Array.isArray(v) && !v.length); return kind === '^' ? (empty ? run(inner, stack) : '') : empty ? '' : Array.isArray(v) ? v.map(x => run(inner, [...stack, x])).join('') : run(inner, typeof v === 'object' ? [...stack, v] : stack) }
        if (raw) return String(get(stack, raw) ?? '')
        if (part) return run(T(part), stack)
        return esc(get(stack, key))
    })
    return (name, view) => run(T(name), [view])
}

function load(ctx) {
    if (!fs.existsSync(ctx.R(S + 'site.json'))) return null
    const read = p => fs.readFileSync(ctx.R(p), 'utf8'), json = p => JSON.parse(read(p)), has = p => fs.existsSync(ctx.R(p))
    const cfg = json(S + 'site.json'), en = json(S + 'i18n/en.json')
    const T = Object.fromEntries(cfg.langs.map(l => [l, l === 'en' || !has(`${S}i18n/${l}.json`) ? en : merge(en, json(`${S}i18n/${l}.json`))]))
    const cache = {}, tpl = n => cache[n] ??= (has(`${S}tpl/${n}.tpl`) ? read(`${S}tpl/${n}.tpl`) : '')
    const decks = cfg.decks.filter(d => has(`${DK}src/${d}.tpl`))
    const deckLangs = d => ['en', ...(has(`${DK}i18n/${d}`) ? fs.readdirSync(ctx.R(`${DK}i18n/${d}`)).filter(f => f.endsWith('.json') && f !== 'en.json').map(f => f.slice(0, -5)) : [])]
    const deckWords = (d, l) => has(`${DK}i18n/${d}/${deckLangs(d).includes(l) ? l : 'en'}.json`) ? json(`${DK}i18n/${d}/${deckLangs(d).includes(l) ? l : 'en'}.json`) : {}
    const md = (dir, name, l) => { for (const x of [l, 'en']) { const p = `${S}${dir}/${name}.${x}.md`; if (has(p)) return { ...ctx.md.frontMatter(read(p)), lang: x, src: p } } return null }
    const articles = has(S + 'articles') ? [...new Set(fs.readdirSync(ctx.R(S + 'articles')).filter(f => f.endsWith('.en.md')).map(f => f.slice(0, -6)))].sort() : []
    return { cfg, T, render: mustache(tpl), decks, deckLangs, deckWords, md, articles, has }
}

const relOf = (page, lang) => `investors/${lang === 'en' ? '' : lang + '/'}${page === 'home' ? '' : page + '/'}index.html`

export function pages(ctx) {
    const X = load(ctx); if (!X) return []
    const { cfg, T, render, decks, deckLangs, deckWords, md, articles, has } = X
    const aud = Object.keys(cfg.audiences)
    const lib = [...cfg.library, 'changelog'].filter(p => md('md', p, 'en'))
    const known = new Set(['home', ...aud, 'decks', 'sequence', 'contact', 'thanks', 'articles', 'library', 'for-you', 'personas', ...lib, ...articles.map(a => 'articles/' + a)])
    const deckRel = (d, l) => `investors/decks/${d}/${l !== 'en' && deckLangs(d).includes(l) ? l + '/' : ''}index.html`
    const pdf = (d, l) => { for (const x of [l, 'en']) { const p = `${DK}${d}${x === 'en' ? '' : '.' + x}.pdf`; if (has(p)) return '/' + p } return '' }
    const deckTitle = (d, l) => nice((deckWords(d, l)['s00.1'] || d).replace(/^PrompTugal ?: ?/, ''))
    const img = p => has(B + p) ? '/' + B + p : ''
    const cover = (d, l) => img(`site/img/covers/${d}.${l}.jpg`) || img(`site/img/covers/${d}.en.jpg`)

    // a link written "/investors/x/", "/investors/decks/<deck>/" or "/companies/" to its path from this page, in its language
    const resolve = (u, l, up) => {
        const [p0, frag] = u.split('#'), [p, q] = p0.split('?'), tail = (q ? '?' + q : '') + (frag ? '#' + frag : '')
        let m
        if (p === '/investors/' || p === '/investors/index.html') return up + relOf('home', l) + tail
        if ((m = p.match(/^\/investors\/decks\/(\d[a-z0-9-]*)\/(?:(?:en|pt|es|fr)\/)?(?:index\.html)?$/))) return up + deckRel(m[1], l) + tail
        if ((m = p.match(/^\/investors\/((?:articles\/)?[a-z0-9-]+)\/(?:index\.html)?$/)) && known.has(m[1])) return up + relOf(m[1], l) + tail
        return up + p.slice(1) + (p.endsWith('/') ? 'index.html' : '') + tail
    }
    const OUT = /^https?:\/\/(?!(?:www\.)?promptugal\.news[/"])/
    const fixLinks = (html, l, up) => html.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (m, a, u) => `${a}="${resolve(u, l, up)}"`)
        .replace(/url\('(\/(?!\/)[^']*)'\)/g, (m, u) => `url('${resolve(u, l, up)}')`)
        .replace(/<a ([^>]*?)href="([^"]*)"([^>]*)>/g, (m, a, u, b) => !OUT.test(u) || /target=/.test(a + b) ? m : `<a ${a}href="${u}"${b} target="_blank" rel="noopener">`)

    const libTitle = (p, l) => nice(md('md', p, l).meta.title || p)
    const navOf = (keys, page, l) => keys.map(a => ({ href: `/investors/${a}/`, label: T[l].shell.nav[a], current: page === a || page.startsWith(a + '/') }))
    function page({ page, l, title, summary, body, src }) {
        const rel = relOf(page, l), up = '../'.repeat(rel.split('/').length - 1), variant = page.replace(/\//g, '-')
        const html = render('shell', { lang: l, title, summary, variant, up, sh: T[l].shell, body, personaJs: has(PERSONA),
            alt: cfg.langs.map(x => ({ code: x, href: ctx.BASE + relOf(page, x) })),
            nav: navOf(aud, page, l), nav2: navOf(['decks', 'articles', 'contact'], page, l),
            langs: cfg.langs.map(x => ({ code: x, label: NAMES[x][0], name: NAMES[x][1], href: up + relOf(page, x), current: x === l })),
            lib: [...lib.filter(p => p !== 'language-vote').map(p => ({ href: `/investors/${p}/`, label: libTitle(p, l) })), { href: '/investors/personas/', label: T[l].personas.title }] })
        return { rel, src: src || S + 'site.json', type: 'site', raw: fixLinks(html, l, up), title, summary, section: 'about', md: `# ${title}\n\n${summary}\n\n${strip(fixLinks(body, l, up))}\n` }
    }
    const fbv = (p, l) => ({ fb: T[l].feedback, fbv: Object.fromEntries([['interested', 'interested'], ['more', 'more'], ['notforme', 'not-for-me']].map(([k, s]) => [k, `/investors/thanks/?via=fb-${p.replace(/\//g, '-')}-${s}`])) })
    const deckView = (d, l, min) => ({ href: `/investors/decks/${d}/`, cover: cover(d, l), n: d.split('-')[0], min, title: deckTitle(d, l), for: T[l].decks.for[d] || '', pdf: pdf(d, l) })
    const articleView = (a, l) => { const m = md('articles', a, l); return { href: `/investors/articles/${a}/`, title: m.meta.title, summary: m.meta.summary } }

    const out = []
    for (const l of cfg.langs) {
        const t = T[l], base = { t, ...fbv('home', l) }
        out.push(page({ page: 'home', l, title: t.home.title, summary: t.home.summary, body: render('home', { ...base, h: t.home, heroImg: img('decks/img/hero-newsroom.jpg'), hasMap: decks.includes('0-the-map'),
            cards: aud.map(a => ({ href: `/investors/${a}/`, img: img(cfg.audiences[a].img), k: t.shell.nav[a], ...t.home.cards[a] })),
            wall: decks.map(d => ({ href: `/investors/decks/${d}/`, title: deckTitle(d, l), cover: cover(d, l) })).filter(x => x.cover),
            hasArticles: articles.length > 0, articles: articles.map(a => articleView(a, l)) }) }))
        for (const a of aud) {
            const A = t.aud[a], c = cfg.audiences[a]
            out.push(page({ page: a, l, title: A.title, summary: A.summary, body: render('audience', { t, ...fbv(a, l), A, heroImg: img(c.img),
                points: A.points.map((p, i) => ({ ...p, i: i + 1 })), route: c.route.filter(([d]) => decks.includes(d)).map(([d, min]) => deckView(d, l, min)),
                more: c.library.filter(p => lib.includes(p)).map(p => ({ href: `/investors/${p}/`, label: libTitle(p, l) })) }) }))
        }
        out.push(page({ page: 'decks', l, title: t.decks.title, summary: t.decks.summary, body: render('decks', { t, ...fbv('decks', l), D: t.decks, cards: decks.map(d => deckView(d, l)) }) }))
        out.push(page({ page: 'sequence', l, title: t.sequence.title, summary: t.sequence.summary, body: render('sequence', { t, Q: t.sequence, decks: decks.map(d => {
            const dir = `site/img/slides/${has(`${S}img/slides/${l}/${d}`) ? l : 'en'}/${d}`, files = has(B + dir) ? fs.readdirSync(ctx.R(B + dir)).filter(f => f.endsWith('.jpg')).sort() : []
            return { id: d, n: d.split('-')[0], title: deckTitle(d, l), href: `/investors/decks/${d}/`, for: t.decks.for[d] || '', count: files.length, slides: files.map((f, i) => ({ i: i + 1, src: `/${B}${dir}/${f}`, href: `/investors/decks/${d}/#${i + 1}` })) } }) }) }))
        out.push(page({ page: 'contact', l, title: t.contact.title, summary: t.contact.summary, body: render('contact', { t, C: t.contact, email: cfg.contact,
            mails: Object.values(t.contact.subjects).map(s => ({ label: s, href: `mailto:${cfg.contact}?subject=${encodeURIComponent(s)}` })) }) }))
        out.push(page({ page: 'thanks', l, title: t.thanks.title, summary: t.thanks.summary, body: render('thanks', { t, H: t.thanks }) }))
        out.push(page({ page: 'articles', l, title: t.articles.title, summary: t.articles.summary, body: render('articles', { t, ...fbv('articles', l), AR: t.articles, articles: articles.map(a => articleView(a, l)) }) }))
        for (const a of articles) {
            const m = md('articles', a, l)
            out.push(page({ page: 'articles/' + a, l, title: m.meta.title, summary: m.meta.summary, src: m.src, body: render('article', { t, ...fbv('article-' + a, l), ...m.meta, fallback: m.lang !== l ? NAMES[m.lang][1] : '',
                html: ctx.md.render(m.body).html, linkedin: (m.meta.linkedin || '').replace(/\\n/g, '\n'), share: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ctx.BASE + relOf('articles/' + a, l))}` }) }))
        }
        const demo = has(S + 'personas/demo.json') ? JSON.parse(fs.readFileSync(ctx.R(S + 'personas/demo.json'), 'utf8')).personas : []
        out.push(page({ page: 'personas', l, title: t.personas.title, summary: t.personas.summary, body: render('personas', { t, P: t.personas, F: t.foryou, served: has(PERSONA),
            demos: demo.map(d => ({ ...d, aud: t.shell.nav[d.audience] || d.audience, qr: img('site/' + d.qr), link: '/investors/' + d.link.slice(d.link.indexOf('#')) })) }) }))
        out.push(page({ page: 'for-you', l, title: t.foryou.title, summary: t.foryou.summary, body: render('foryou', { t, F: t.foryou }) }))
        out.push(page({ page: 'library', l, title: t.library.title, summary: t.library.summary, body: render('library', { t, LB: t.library, items: lib.map(p => ({ href: `/investors/${p}/`, title: libTitle(p, l), summary: md('md', p, l).meta.summary || '' })) }) }))
        for (const p of lib) {
            const m = md('md', p, l)
            out.push(page({ page: p, l, title: libTitle(p, l), summary: m.meta.summary || '', src: m.src, body: render('page', { t, ...fbv(p, l), title: libTitle(p, l), fallback: m.lang !== l ? NAMES[m.lang][1] : '', html: ctx.md.render(m.body).html }) }))
        }
    }
    return out
}

export const api = ctx => [[S + 'site.css', 'api/v1/investors/site.css'], [PERSONA, 'api/v1/investors/persona.js']].filter(([f]) => fs.existsSync(ctx.R(f))).map(([f, path]) => ({ path, schema: null, data: fs.readFileSync(ctx.R(f), 'utf8') }))

// investors@'s working copy of persona.js differs from the served one: dev@ reviews it and brings it to board/team/dev/investors/
export function warn(gate) { const a = gate.ROOT + '/' + S + 'persona.js', b = gate.ROOT + '/' + PERSONA; return fs.existsSync(a) && (!fs.existsSync(b) || fs.readFileSync(a, 'utf8') !== fs.readFileSync(b, 'utf8')) ? [`${S}persona.js differs from ${PERSONA} (served): dev@ and security@ review it before it is served`] : [] }
