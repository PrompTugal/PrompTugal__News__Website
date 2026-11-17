// Drafts first contacts to news organisations from data/organisations/<id>/organisation.json (kind "media").
// Usage: node desks/outreach/media/make-drafts.mjs <id> [<id> ...]   (no id: nothing; this desk drafts a few at a time)
// Output: desks/outreach/media/drafts/<id>.json in the shared contact-request/v1 shape local@PrompTugal.jose uses.
// Only offers that are live are written. Nothing is sent: a person sends.
import fs from 'fs'
const ids = process.argv.slice(2)
const today = '2026-11-16'
const PAGE = id => `https://promptugal.news/organisations/${id}/`
const CONTRIBUTE = 'https://promptugal.news/contribute/'
const METER = 'https://promptugal.news/api/v1/billing/meter.json'
const T = {
  pt: {
    subj: n => `Assunto: ${n} no PrompTugal.news: podem ver se a vossa página está certa?`,
    body: (n, page, place, site, feed, place_line) => [
      `Olá equipa do ${n},`,
      `O PrompTugal.news é uma redação nova, feita em Portugal por agentes de IA, que acompanha a tecnologia e a inteligência artificial por terra, com cada facto ligado à sua fonte. Criámos uma página para o ${n}:\n${page}`,
      `A página liga primeiro ao vosso site (${site}) e ao vosso feed (${feed}), com a data em que os lemos. Não copiamos o vosso texto: ligamos, damos crédito e enviamos os leitores para a notícia original.${place_line}`,
      `Como obtivemos os dados: lemos o vosso feed RSS público (${feed}) e as páginas públicas do vosso site; não usamos nada que esteja atrás de um login. Têm uma API, um feed ou dados abertos que possamos usar em vez disso? Se sim, passamos a usá-los.`,
      `Pedimos uma coisa: podem ver se o que lá está é correto? Se algo estiver errado, respondam e corrigimos na própria página, com data.`,
      `Se alguém da vossa redação quiser escrever connosco sobre a sua terra, a página para colaborar é esta:\n${CONTRIBUTE}\nO que publicamos fica com a licença CC BY 4.0, com crédito ao autor. Por agora não há pagamento.`,
      `Queremos, no futuro, partilhar com os meios locais parte do que o nosso contador de leitura regista pelo trabalho que ligamos e citamos. Isso ainda não está construído; dizemos-vos as condições antes de existir. O contador, hoje, está aqui: ${METER}`,
      `As páginas estão, por agora, em inglês. Responder é opcional.`,
      `Cumprimentos,\n[quem envia, a escolher por uma pessoa]\nPrompTugal.news`,
      `Escrito por um agente de IA para Dinis Cruz, revisto e enviado por uma pessoa. Encontrámos este contacto no vosso site. Se preferirem não receber mais mensagens nossas, respondam e não voltamos a escrever.`
    ]
  },
  en: {
    subj: n => `Subject: ${n} on PrompTugal.news: could you check your page is right?`,
    body: (n, page, place, site, feed, place_line) => [
      `Hello ${n} team,`,
      `PrompTugal.news is a new newsroom, made in Portugal by AI agents, that follows technology and AI place by place, every fact linked to its source. We have built a page for ${n}:\n${page}`,
      `The page links first to your site (${site}) and your feed (${feed}), with the date we read them. We do not copy your text: we link, credit and send readers to the original story.${place_line}`,
      `How we got the data: we read your public RSS feed (${feed}) and the public pages of your site; we use nothing behind a login. Do you have an API, a feed or open data we could use instead? If so, we will switch to it.`,
      `We ask one thing: could you check that what is there is right? If anything is wrong, reply and we correct it on the page itself, dated.`,
      `If anyone in your newsroom would like to write with us about their place, the page for contributors is this one:\n${CONTRIBUTE}\nWhat we publish is under CC BY 4.0, with credit to its author. There is no payment for now.`,
      `In time we want to share with news outlets part of what our reading meter counts for the work we link and cite. That is not built yet; we will tell you the terms before it exists. The meter today is here: ${METER}`,
      `The pages are in English. Answering is optional.`,
      `Best regards,\n[the sender, for a person to choose]\nPrompTugal.news`,
      `Written by an AI agent for Dinis Cruz, reviewed and sent by a person. We found this contact on your website. If you would rather not hear from us again, reply and we will not write again.`
    ]
  }
}
fs.mkdirSync('desks/outreach/media/drafts', { recursive: true })
for (const id of ids) {
  const d = JSON.parse(fs.readFileSync(`data/organisations/${id}/organisation.json`, 'utf8'))
  if (d.kind !== 'media' || !d.media?.contact?.page || !d.media?.feeds?.length) { console.log('skip', id, '(no media record, contact page or feed)'); continue }
  const m = d.media, n = d.name, lang = m.language.includes('en') ? 'en' : 'pt'
  const placeId = (m.places_covered[0] || '').replace('place:', '')
  const placeName = JSON.parse(fs.readFileSync(`data/by-place/${placeId}.json`, 'utf8')).name || placeId
  const placeUrl = `https://promptugal.news/portugal/${placeId}/`
  const placeHtml = fs.existsSync(`portugal/${placeId}/index.html`) ? fs.readFileSync(`portugal/${placeId}/index.html`, 'utf8') : ''
  const host = new URL(m.website).hostname.replace(/^www\./, '')
  const linked = host && placeHtml.includes(host)
  const place_line = linked ? (lang === 'pt' ? `\nA nossa página de ${placeName} também liga a vocês: ${placeUrl}` : `\nOur ${placeName} page links to you too: ${placeUrl}`) : ''
  const t = T[lang], other = T[lang === 'pt' ? 'en' : 'pt']
  const args = [n, PAGE(id), placeId, m.website, m.feeds[0].url, place_line]
  const out = {
    type: 'contact-request/v1', from: 'outreach@PrompTugal.dinis', company: id,
    purpose: `Ask ${n} to check its page on PrompTugal.news and invite it to write for its place`,
    share: [PAGE(id), CONTRIBUTE, METER, ...(linked ? [placeUrl] : [])],
    language: lang,
    ['proposed_text' + (lang === 'pt' ? '_pt' : '')]: [t.subj(n), ...t.body(...args)].join('\n\n'),
    sender: null, sender_note: 'left for a person to choose', by: null,
    channel: { kind: 'published-newsroom-page', url: m.contact.page, read: m.contact.source.read_at, note: "the outlet's own page; a person reads the address there. No address or number is copied into this repository." },
    offers_checked: {
      'page-check': { live: true, evidence: PAGE(id), read: today },
      'link-and-credit': { live: true, evidence: 'the outlet page links its site and feed with the date read', read: today },
      'place-page-links-outlet': { live: linked, evidence: placeUrl, read: today },
      'write-for-your-place': { live: true, evidence: CONTRIBUTE + ' (CC BY 4.0, no payment for now)', read: today },
      'share-of-meter': { live: false, evidence: 'no per-source wallet exists; worded only as intent, option B of the decision page', read: today },
      'feeds-out': { live: false, evidence: 'no per-place feed in REALITY.md; not offered', read: today },
      'agentic-desk': { live: false, evidence: 'not built; not offered', read: today }
    },
    data_access: { how_read: 'public RSS feed and public pages, nothing behind a login', feed: m.feeds[0].url, asks_for_api_or_open_data: true },
    status: 'draft',
    holds: [
      'Nothing is sent by an agent. A person reviews, chooses the sender and sends.',
      "Dinis's decision on what a first email may promise is open (content/newsroom/decisions/what-a-first-contact-to-a-news-organisation-may-promise.md). The money paragraph is option B's line; if he picks another option it changes or goes.",
      'A person opens the outlet page and the contact page before sending, and checks both still answer and say what the draft says.',
      'The pages are in English only; the draft says so.',
      'No RiskMandate line and no publisher line: Dinis took RiskMandate off the site (7 Nov) and the publisher question is open on the decision page.'
    ]
  }
  fs.writeFileSync(`desks/outreach/media/drafts/${id}.json`, JSON.stringify(out, null, 1) + '\n')
  console.log('drafted', id, lang, linked ? '(place page links it)' : '')
}
