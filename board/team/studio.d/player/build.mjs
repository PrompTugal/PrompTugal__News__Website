// studio.director's build, v0: node build.mjs <storyboard.json> <out.html>. Inlines the storyboard into the player page.
import { readFileSync, writeFileSync } from 'node:fs'
const [, , sbf, out] = process.argv
const sb = JSON.parse(readFileSync(sbf, 'utf8'))
const tpl = readFileSync(new URL('./template.html.tpl', import.meta.url), 'utf8')
// svg visuals ({kind:"svg"|"image", src|url: repo path to an .svg, at|seek: seconds, play: seconds}) are inlined so the page can seek the animation
const svgs = {}
const walk = o => { if (o && typeof o === 'object') { const p = o.src || o.url; if (typeof p === 'string' && /\.svg$/i.test(p) && !/^https?:/.test(p)) { try { svgs[p] = readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '') } catch { } } Object.values(o).forEach(walk) } }
walk(sb)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const json = JSON.stringify(sb).replace(/</g, '\\u003c')
writeFileSync(out, tpl.replace('__TITLE__', esc(sb.title)).replace('__JSON__', () => json).replace('__SVGS__', () => JSON.stringify(svgs).replace(/</g, '\\u003c')))
console.log('wrote', out)
