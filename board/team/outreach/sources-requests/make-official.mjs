// Drafts the on-the-record request (Portuguese) for each public body on the register of sources we do not read.
// Run from the repository root.
// Reads the register entry from data.promptugal.news (our own site) and a channel table read from the body's own official site.
// Usage: node board/team/outreach/sources-requests/make-official.mjs <id> [<id> ...]
// Output: official/<id>.md. Nothing is sent: a person sends. No address or phone is written: the channel is a page URL.
import fs from 'fs'
const ids = process.argv.slice(2)
const channels = JSON.parse(fs.readFileSync('board/team/outreach/sources-requests/official/.channels.json', 'utf8'))
const what = { events: 'a sua agenda pública de eventos', news: 'as suas notícias públicas (título, data e ligação)', notices: 'os seus avisos públicos', schedules: 'os seus horários públicos' }
for (const id of ids) {
  const e = await (await fetch(`https://data.promptugal.news/api/v1/sources/${id}.json`)).json()
  const ch = channels[id] || {}
  const known = (e.gives || []).filter(g => what[g]).map(g => what[g])
  const gives = known.length ? known : [`os dados públicos de "${e.name}"`]
  const places = (e.places || []).join(', ')
  const q = String(e.why?.quote || '').replace(/\s+/g, ' ')
  const copyright = /all rights reserved|todos os direitos/i.test(q)
  const botOnly = /^User-agent:\s*(?!\*)\S+/i.test(q) && !/User-agent:\s*\*/i.test(q)
  const real = /Disallow:\s*\/\S+|Disallow:\s*\/\s|all rights reserved|todos os direitos/i.test(q) && !/could not read/i.test(q) && !botOnly
  const why = real ? `o registo anota, em ${e.why.page} (lido a ${e.why.read_at}): "${q.slice(0, 200)}"` : 'não encontrámos termos de reutilização que nos autorizem a ler e mostrar esta fonte, e por isso não a lemos'
  const held = !ch.url
  if ((e.places || []).includes('london') && !(e.places || []).includes('portugal')) {
    const wEn = { events: 'its public events listings', news: 'its public news (title, date and link)', notices: 'its public notices', schedules: 'its public schedules' }
    const kEn = (e.gives || []).filter(g => wEn[g]).map(g => wEn[g])
    const gEn = kEn.length ? kEn : [`the public data of "${e.name}"`]
    const qE = String(e.why?.quote || '').replace(/\s+/g, ' ')
    const copyE = /copyright|all rights reserved/i.test(qE) && !/could not read|answered \d|404|403/i.test(qE)
    const botOnlyE = /^User-agent:\s*(?!\*)\S+/i.test(qE) && !/User-agent:\s*\*/i.test(qE)
    const disE = /Disallow:\s*\/\S*/i.test(qE) && !/could not read/i.test(qE) && !botOnlyE
    const whyE = (copyE || disE) ? `the register records, at ${e.why.page} (read ${e.why.read_at}): "${qE.slice(0, 200)}"${copyE ? ' We respect that notice and so we ask for your permission.' : ' An access rule is not a licence to reuse, and we want to hear from you.'}` : 'we found no reuse terms that allow us to read and show it, so we do not read it. We want to hear from you.'
    const bodyEn = `---
organisation: ${e.owner}
register: https://data.promptugal.news/api/v1/sources/${id}.json (status ${e.status}, read ${new Date().toISOString().slice(0, 10)})
kind: ${e.kind}
channel_page: ${ch.url || 'NONE FOUND: a person finds the official contact or press page of this body and records its URL and the date read here before sending'}
channel_read: ${ch.read || ''}
language: en
status: ${held ? 'HELD (no channel read yet)' : 'draft, for a person to send'}
---
Subject: Could PrompTugal.news show ${gEn[0]}? A request for permission

Hello ${e.owner} team,

PrompTugal.news is a newsroom for the places of Portugal and London made by AI agents, with every fact linked to its source and the date we read it: https://promptugal.news/

We would like to show ${gEn.join(' and ')} on our London pages, linked to your page and credited to ${e.owner}, so that readers go on to the official source: ${e.url}

We do not read this source today: ${whyE}

We ask for an official answer:

1. May a site like ours show ${gEn[0]}, linked and credited to ${e.owner}, and under which licence?
2. If so, through which interface should we read it (a feed, an iCal file, open data, an API or another)?
3. If not, please tell us and we will not read it.

We honour your robots.txt and your crawl delay, we read nothing behind a login and we do not copy full texts. Until you answer, we do not read this source.

Your answer, or no answer after 14 days, is recorded as given on our public register of sources, with the date: https://data.promptugal.news/sources/not-read/

Kind regards,
[the sender, for a person to choose]
PrompTugal.news

Written by an AI agent for Dinis Cruz, reviewed and sent by a person. We found this contact on your official website${ch.url ? `: ${ch.url} (read ${ch.read})` : ' (to be recorded by the sender)'}. If you would rather not hear from us again, reply and we will not write again.
`
    fs.writeFileSync(`board/team/outreach/sources-requests/official/${id}.md`, bodyEn)
    console.log(id, held ? 'HELD' : 'ready', ch.url || '')
    continue
  }
  const body = `---
organisation: ${e.owner}
register: https://data.promptugal.news/api/v1/sources/${id}.json (status ${e.status}, read ${new Date().toISOString().slice(0, 10)})
kind: ${e.kind}
channel_page: ${ch.url || 'NONE FOUND: a person finds the official contact or press page of this body and records its URL and the date read here before sending'}
channel_read: ${ch.read || ''}
language: pt
status: ${held ? 'HELD (no channel read yet)' : 'draft, for a person to send'}
---
Assunto: Podemos mostrar ${gives[0] || 'os vossos dados públicos'} no PrompTugal.news? Um pedido de autorização

Exmos. Senhores (${e.owner}),

O PrompTugal.news é uma redação para os lugares de Portugal feita por agentes de IA, com cada facto ligado à sua fonte e à data em que o lemos: https://promptugal.news/

Gostaríamos de mostrar ${gives.join(' e ') || 'os vossos dados públicos'} (${places}) nas nossas páginas, com ligação para a vossa página e crédito a ${e.owner}, para que os leitores sigam para a fonte oficial: ${e.url}

Hoje não lemos esta fonte: ${why}.${copyright ? ' Respeitamos esse aviso e por isso pedimos a vossa autorização.' : real ? ' Uma regra de acesso não é uma autorização de reutilização, e queremos ouvir-vos.' : ' Queremos ouvir-vos.'}

Pedimos uma resposta oficial:

1. Podem permitir que um sítio como o nosso mostre ${gives[0] || 'estes dados públicos'}, com ligação e crédito a ${e.owner}, e sob que licença?
2. Se sim, por que interface os devemos ler (um feed, um ficheiro iCal, dados abertos, uma API ou outra)?
3. Se não, digam-nos e não os leremos.

Respeitamos o vosso robots.txt e o intervalo entre pedidos; não lemos nada atrás de um login e não copiamos textos completos. Até haver resposta, não lemos esta fonte.

A vossa resposta, ou a falta dela ao fim de 14 dias, fica registada tal como foi dada no registo público das nossas fontes, com a data: https://data.promptugal.news/sources/not-read/

Com os melhores cumprimentos,
[quem envia, a escolher por uma pessoa]
PrompTugal.news

Escrito por um agente de IA para Dinis Cruz, revisto e enviado por uma pessoa. Encontrámos este contacto no vosso sítio oficial${ch.url ? `: ${ch.url} (lido a ${ch.read})` : ' (a registar por quem enviar)'}. Se preferirem não receber mais mensagens nossas, respondam e não voltamos a escrever.
`
  fs.writeFileSync(`board/team/outreach/sources-requests/official/${id}.md`, body)
  console.log(id, held ? 'HELD' : 'ready', ch.url || '')
}
