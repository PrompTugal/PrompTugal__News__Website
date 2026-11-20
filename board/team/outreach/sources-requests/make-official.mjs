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
  const gives = (e.gives || []).map(g => what[g] || g)
  const places = (e.places || []).join(', ')
  const q = String(e.why?.quote || '').replace(/\s+/g, ' ')
  const real = /Disallow:\s*\/\S+|Disallow:\s*\/\s|all rights reserved|todos os direitos/i.test(q) && !/could not read/i.test(q)
  const why = real ? `o registo anota, em ${e.why.page} (lido a ${e.why.read_at}): "${q.slice(0, 200)}"` : 'não encontrámos termos de reutilização que nos autorizem a ler e mostrar esta fonte, e por isso não a lemos'
  const held = !ch.url
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

Hoje não lemos esta fonte: ${why}.${real ? ' Uma regra de acesso não é uma autorização de reutilização, e queremos ouvir-vos.' : ' Queremos ouvir-vos.'}

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
