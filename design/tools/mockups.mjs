#!/usr/bin/env node
// Writes the design mockups (design/mockups/*.html) from the repository's real data:
// desks/programme/agenda.json, data/companies.json and content/articles/. No dependencies.
//   node design/tools/mockups.mjs
import fs from 'node:fs'
import { R, LIVE, NAME, VERSION, AGENDA, COMPANIES, CO, CATEGORY, esc, DAYS, LONGDAY, place, KIND, KCLASS, isOfficial, linkOf, speaker, who, items, find, start, NOW_DAY, slot, ICON, MARK, page, write } from './lib.mjs'
import { frontPage } from './page-front.mjs'
import { articlePage } from './page-article.mjs'
import { companyPage, personPage, topicPage } from './page-entities.mjs'
import { eventsPage } from './page-events.mjs'
import { riskmandatePage, aboutPage } from './page-about.mjs'
import { chatPage, searchPage, searchInstantPage, graphPage, accountPage, topupPage, vaultPage } from './page-features.mjs'

fs.mkdirSync(R('design/mockups'), { recursive: true })
const pages = { 'index.html': frontPage, 'article.html': articlePage, 'company.html': companyPage, 'person.html': personPage, 'topic.html': topicPage, 'events.html': eventsPage, 'riskmandate.html': riskmandatePage, 'about.html': aboutPage, 'chat.html': chatPage, 'search.html': searchPage, 'search-instant.html': searchInstantPage, 'graph.html': graphPage, 'account.html': accountPage, 'topup.html': topupPage, 'vault.html': vaultPage }
const only = process.argv.slice(2)
for (const [name, fn] of Object.entries(pages)) if (!only.length || only.includes(name)) write(name, fn(name))
