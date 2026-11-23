// studio.director's build, v0: node build.mjs <storyboard.json> <out.html>. Inlines the storyboard into the player page.
import { readFileSync, writeFileSync } from 'node:fs'
const [, , sbf, out, pageUrl] = process.argv
const sb = JSON.parse(readFileSync(sbf, 'utf8'))
const tpl = readFileSync(new URL('./template.html.tpl', import.meta.url), 'utf8')
// svg visuals ({kind:"svg"|"image", src|url: repo path to an .svg, at|seek: seconds, play: seconds}) are inlined so the page can seek the animation
const svgs = {}
const walk = o => { if (o && typeof o === 'object') { for (const p of [o.src, o.url, o.src_phone]) if (typeof p === 'string' && /\.svg$/i.test(p) && !/^https?:/.test(p)) { try { svgs[p] = readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '') } catch { } } Object.values(o).forEach(walk) } }
walk(sb)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const json = JSON.stringify(sb).replace(/</g, '\\u003c')
const ea = s => esc(s).replace(/"/g, '&quot;')
// Open Graph, Twitter and canonical tags when the page's public address is given (the Studio site's checks need them)
const meta = pageUrl ? [['description', sb.summary], ['og:type', 'website', 'p'], ['og:site_name', 'Studio', 'p'], ['og:locale', 'en_GB', 'p'], ['og:url', pageUrl, 'p'], ['og:title', sb.title, 'p'], ['og:description', sb.summary, 'p'], ['og:image', new URL('/assets/share/card-1200x630.jpg', pageUrl).href, 'p'], ['og:image:type', 'image/jpeg', 'p'], ['og:image:width', '1200', 'p'], ['og:image:height', '630', 'p'], ['og:image:alt', 'Studio', 'p'], ['twitter:card', 'summary_large_image'], ['twitter:title', sb.title], ['twitter:description', sb.summary], ['twitter:image', new URL('/assets/share/card-1200x630.jpg', pageUrl).href]].map(([k, v, t]) => `<meta ${t === 'p' ? 'property' : 'name'}="${k}" content="${ea(v)}">`).join('\n') + `\n<link rel="canonical" href="${ea(pageUrl)}">` : ''
writeFileSync(out, tpl.replace('__META__', () => meta).replace('__TITLE__', esc(sb.title)).replace('__JSON__', () => json).replace('__SVGS__', () => JSON.stringify(svgs).replace(/</g, '\\u003c')))
console.log('wrote', out)
