// Rewrites the decks table on /investors/decks/ (content/investors/decks.md, between the two marker lines) from what is
// in this folder: every deck (src/*.tpl), every language it has (i18n/<deck>/<lang>.json), its PDFs and its version
// (from the cover); the table is everything between the heading '## The decks {#list}' and '## Changelog'.
// Run after adding a deck or a language: node board/team/investors/decks/tools/decks-page.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const here = path.dirname(fileURLToPath(import.meta.url)), DIR = path.resolve(here, '..'), ROOT = path.resolve(DIR, '../../../..')
const PAGE = path.join(ROOT, 'content/investors/decks.md')
const START = '## The decks {#list}', END = '## Changelog'
const NAMES = { en: 'English', pt: 'Português', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', nl: 'Nederlands', pl: 'Polski', ro: 'Română', el: 'Ελληνικά', sv: 'Svenska', cs: 'Čeština', hu: 'Magyar' }
const FOR = {
    '1-the-investment-case': 'Investors: the problem, our answer, what works, the business, the plan',
    '2-the-industry': 'The argument: how news got here, what people want, provenance, privacy, the landscape',
    '3-the-platform': 'Customers and partners: every feature, live; deploy it or license it',
    '4-the-algarve': 'The Algarve, Portugal and Europe: jobs, talent, news, startups; who we want to work with',
    '5-the-investment': 'Investors: the seed round, who holds a stake, two phases, the three questions',
    '6-the-technology': 'How a few people run many agents: keys, privacy, the mandate, the policies, the record',
    '7-join-us': 'A CEO from the news industry, journalists, strategists, helpers this week',
    '8-do-it-yourself': 'Builders: the open repositories, the stack, the roadmap; the moat is decisions',
    '9-the-tour': 'What is live, as an animated guided tour',
}
const decks = fs.readdirSync(path.join(DIR, 'src')).filter(f => f.endsWith('.tpl')).map(f => f.replace('.tpl', '')).sort()
const rows = decks.map(d => {
    const langs = ['en', ...fs.readdirSync(path.join(DIR, 'i18n', d)).filter(f => f.endsWith('.json') && f !== 'en.json').map(f => f.replace('.json', '')).sort()]
    const en = JSON.parse(fs.readFileSync(path.join(DIR, 'i18n', d, 'en.json'), 'utf8'))
    const title = (en['s00.1'] || d).replace(/^PrompTugal: /, '').replace(/^./, c => c.toUpperCase())
    const version = (Object.values(en).find(v => /^v\d+\.\d+ · /.test(v)) || '').split(' · ')[0]
    const slides = langs.map(l => `[${l.toUpperCase()}](../../investors/decks/${d}/${l === 'en' ? '' : l + '/'}index.html "${NAMES[l] || l}")`).join(' · ')
    const pdfs = langs.filter(l => fs.existsSync(path.join(DIR, d + (l === 'en' ? '' : '.' + l) + '.pdf'))).map(l => `[${l.toUpperCase()}](../../board/team/investors/decks/${d}${l === 'en' ? '' : '.' + l}.pdf)`).join(' · ')
    return `| **${d.split('-')[0]}. ${title}** | ${FOR[d] || ''} | ${slides} | ${pdfs} | ${version} |`
})
const table = [START, '', '| Deck | For | Slides | PDF | Version |', '|---|---|---|---|---|', ...rows, '', END].join('\n')
let s = fs.readFileSync(PAGE, 'utf8')
if (s.includes(START)) s = s.slice(0, s.indexOf(START)) + table + s.slice(s.indexOf(END) + END.length)
else { const i = s.indexOf('| Deck |'), j = s.indexOf('\n\n', i); s = s.slice(0, i) + table + s.slice(j) }
fs.writeFileSync(PAGE, s)
console.log(`decks table: ${decks.length} decks`)
