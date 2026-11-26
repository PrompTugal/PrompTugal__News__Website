#!/usr/bin/env node
/* test_london_page.mjs: a place outside Portugal (London, 26 Nov 2026) has none of the Portuguese sections on its page. Reads the BUILT page, so run the build first
 * (node newsroom/build/build.mjs); with no London page built it says so and passes.   node newsroom/build/tests/test_london_page.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'), f = path.join(root, 'europe/london/index.md')
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
if (!fs.existsSync(f)) { console.log('test_london_page: no europe/london/ page built (not in the registry, or not built): nothing to check'); process.exit(0) }
const md = fs.readFileSync(f, 'utf8'), has = re => re.test(md)
t('no "From Portugal" or "From the Algarve" news section', [has(/^## From Portugal/m), has(/^## From the Algarve/m)], [false, false])
t('no national-articles section of Portuguese stories', has(/^## From PrompTugal\.news \{#national\}/m), false)
t('no Portuguese media list, no IPMA weather box', [has(/\(\.\.\/\.\.\/media\/[a-z-]*(portugal|algarve|rtp|lusa)/i), has(/Forecasts and warnings for London/)], [false, false])
t('the summary does not place London in the Algarve', has(/^> AI and technology in London, in the Algarve/m), false)
t('its parent, a country with no page, is not a link', has(/\]\(\.\.\/united-kingdom\//), false)
t('it names no Portugal breadcrumb', has(/^\*\*Portugal\*\*|^Portugal ›/m), false)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_london_page: OK')
