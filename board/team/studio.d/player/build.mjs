// studio.director's build, v0: node build.mjs <storyboard.json> <out.html>. Inlines the storyboard into the player page.
import { readFileSync, writeFileSync } from 'node:fs'
const [, , sbf, out] = process.argv
const sb = JSON.parse(readFileSync(sbf, 'utf8'))
const tpl = readFileSync(new URL('./template.html.tpl', import.meta.url), 'utf8')
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const json = JSON.stringify(sb).replace(/</g, '\\u003c')
writeFileSync(out, tpl.replace('__TITLE__', esc(sb.title)).replace('__JSON__', () => json))
console.log('wrote', out)
