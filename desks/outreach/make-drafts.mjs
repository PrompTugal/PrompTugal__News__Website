#!/usr/bin/env node
// outreach (PrompTugal.dinis): the outreach drafts as PrompTugal.news, one thread per company, in the team CRM's
// comms shape (companies/<id>/comms/<date>-<thread>/thread.json, the draft as EML and its card beside it).
// Reads desks/outreach/targets.json and data/companies/ + data/events/ (the facts already on each company's page).
// No dependencies; run from the repository root: node desks/outreach/make-drafts.mjs
// Drafts only: no address is written (From and To are filled by the person who sends, from their own mailbox).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const DESK = path.join(ROOT, 'desks/outreach');
const SITE = 'https://promptugal.news';
const DRAFTED = '2026-11-06T0000Z';
const DRAFTED_ISO = '2026-11-06T00:00:00Z';
const THREAD = '2026-11-06-promptugal-page';
const BY = 'outreach (PrompTugal.dinis)';

const targets = JSON.parse(fs.readFileSync(path.join(DESK, 'targets.json'), 'utf8')).targets;

// The editors (WS-177): proposed, for Dinis to confirm. Portuguese-language drafts to Dinis; the rest alternate.
const EDITORS = ['Vicky Wang', 'Indi Gupte'];
function editorFor(t, i) { return t.language === 'pt' ? 'Dinis Cruz' : EDITORS[i % 2]; }

// The sessions on each company's page: an event lists the company as a speaker's or a host's organisation.
const sessions = {};
for (const d of fs.readdirSync(path.join(ROOT, 'data/events'))) {
  const f = path.join(ROOT, 'data/events', d, 'event.json');
  if (!fs.existsSync(f)) continue;
  const e = JSON.parse(fs.readFileSync(f, 'utf8'));
  const orgs = new Set([...(e.speakers || []).map(s => s.org), ...(e.hosted_by || []).map(h => (h && h.org) || h)]);
  for (const o of orgs) if (typeof o === 'string' && o.startsWith('company:')) {
    (sessions[o.slice(8)] ||= []).push({ id: e.id, title: e.title, date: e.date, start: e.start, source: e.source_url });
  }
}
for (const k in sessions) sessions[k].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

const DAY_EN = { '2026-11-09': 'Monday 9 November', '2026-11-10': 'Tuesday 10 November', '2026-11-11': 'Wednesday 11 November', '2026-11-12': 'Thursday 12 November' };
const DAY_PT = { '2026-11-09': 'segunda, 9 de novembro', '2026-11-10': 'terça, 10 de novembro', '2026-11-11': 'quarta, 11 de novembro', '2026-11-12': 'quinta, 12 de novembro' };

function hookEn(name, s) {
  if (!s.length) return `It says what ${name} does, where it sits in the summit's map of AI, and the companies it connects to there.`;
  const more = s.length > 1 ? `, and ${s.length - 1} more session${s.length > 2 ? 's' : ''} on the page` : '';
  return `It follows ${name} at the summit: "${s[0].title}", ${DAY_EN[s[0].date]} at ${s[0].start}${more}.`;
}
function hookPt(name, s) {
  if (!s.length) return `Diz o que a ${name} faz, onde está no mapa da IA da cimeira, e as empresas com que se liga lá.`;
  const more = s.length > 1 ? `, e mais ${s.length - 1} ${s.length > 2 ? 'sessões' : 'sessão'} na página` : '';
  return `Acompanha a ${name} na cimeira: "${s[0].title}", ${DAY_PT[s[0].date]}, às ${s[0].start}${more}.`;
}
const QUESTIONS_EN = 'The page ends with the three questions we ask every company: what your AI agents can reach, what they are authorised to do, and who controls the gap between the two. Your answer goes on the page, in your words.';
const QUESTIONS_PT = 'A página termina com as três perguntas que fazemos a todas as empresas: o que os vossos agentes de IA conseguem alcançar, o que foram autorizados a fazer, e quem controla a diferença entre as duas coisas. A vossa resposta entra na página, nas vossas palavras.';
function askEn(name, ask) {
  if (ask === 'meet') return `${QUESTIONS_EN} Could we hear it in 15 minutes during the summit, 9 to 12 November? Reply with a time that suits you.`;
  if (ask === 'interview') return `${QUESTIONS_EN} Could we interview someone from ${name} on them during the summit, 9 to 12 November, 15 minutes, on the record?`;
  return `We are writing about the summit's companies this week. Is there a fact you would add or correct before we write about ${name}?`;
}
function askPt(name, ask) {
  if (ask === 'meet') return `${QUESTIONS_PT} Podemos ouvi-la em 15 minutos durante a cimeira, de 9 a 12 de novembro? Respondam com uma hora que vos dê jeito.`;
  if (ask === 'interview') return `${QUESTIONS_PT} Podemos entrevistar alguém da ${name} durante a cimeira, de 9 a 12 de novembro, 15 minutos?`;
  return `Esta semana escrevemos sobre as empresas da cimeira. Há algum facto que queiram acrescentar ou corrigir antes de escrevermos sobre a ${name}?`;
}

function en(name, url, s, ask, editor) {
  return {
    subject: `${name} on PrompTugal.news: is your page right?`,
    body: [
      `Hello ${name} team,`,
      `Ahead of Web Summit Lisbon, we have written a page about ${name} on PrompTugal.news:\n${url}`,
      hookEn(name, s),
      `PrompTugal.news is a new newsroom from Portugal, for Europe, with one mandate: to map the universe of AI in Portugal and the companies that come to it. Every fact on the page carries its source and the date we read it. If anything is wrong or missing, reply and we will correct it, dated.`,
      askEn(name, ask),
      `Best regards,\n${editor}\nEditor, PrompTugal.news (powered by RiskMandate)`,
      `Drafted by an AI agent, reviewed and sent by me. We found this address on your website; rather not hear from us? Reply and we will not write again.`,
    ].join('\n\n'),
    followup_1: `Hello again ${name} team,\n\nWeb Summit opens tonight. Your page is here, and a correction or an answer from you is welcome all week:\n${url}\n\nBest regards,\n${editor}, PrompTugal.news`,
    followup_2: `Hello ${name} team,\n\nThe summit ends tomorrow, 12 November. If you would like your answer on your page, reply this week:\n${url}\n\nThis is our last note. Best regards,\n${editor}, PrompTugal.news`,
  };
}
function pt(name, url, s, ask, editor) {
  return {
    subject: `${name} no PrompTugal.news: a vossa página está certa?`,
    body: [
      `Olá equipa ${name},`,
      `Antes da Web Summit Lisboa, escrevemos uma página sobre a ${name} no PrompTugal.news:\n${url}`,
      hookPt(name, s),
      `O PrompTugal.news é uma nova redação feita em Portugal, para a Europa, com um mandato: mapear o universo da IA em Portugal e as empresas que cá vêm. Cada facto na página tem a sua fonte e a data em que o lemos. Se algo estiver errado ou faltar, respondam e corrigimos, com data.`,
      askPt(name, ask),
      `Cumprimentos,\n${editor}\nEditor, PrompTugal.news (powered by RiskMandate)`,
      `Escrito por um agente de IA, revisto e enviado por mim. Encontrámos este endereço no vosso site; preferem não receber? Respondam e não voltamos a escrever.`,
    ].join('\n\n'),
    followup_1: `Olá novamente, equipa ${name},\n\nA Web Summit abre hoje à noite. A vossa página está aqui, e uma correção ou resposta vossa é bem-vinda toda a semana:\n${url}\n\nCumprimentos,\n${editor}, PrompTugal.news`,
    followup_2: `Olá equipa ${name},\n\nA cimeira acaba amanhã, 12 de novembro. Se quiserem a vossa resposta na página, respondam esta semana:\n${url}\n\nÉ a nossa última mensagem. Cumprimentos,\n${editor}, PrompTugal.news`,
  };
}

// RFC 5322 with an RFC 2047 subject; From and To are left for the sender's mail program (a draft, never sent from here).
function eml(msg, lang, id, editor) {
  const subj = /^[\x20-\x7e]*$/.test(msg.subject) ? msg.subject : `=?UTF-8?B?${Buffer.from(msg.subject).toString('base64')}?=`;
  return [
    `Date: Fri, 06 Nov 2026 00:00:00 +0000`,
    `Subject: ${subj}`,
    `X-PrompTugal-Draft: from ${editor} (proposed), to ${id}'s published channel; addresses filled by the sender`,
    `X-PrompTugal-Drafted-By: ${BY}`,
    `Content-Language: ${lang}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8; format=flowed`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    msg.body,
    ``,
  ].join('\r\n');
}

const index = [];
targets.forEach((t, i) => {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/companies', t.id, 'company.json'), 'utf8'));
  const name = c.name.replace(/ \(.*\)$/, '');
  const url = `${SITE}/companies/${t.id}/`;
  const s = sessions[t.id] || [];
  const editor = editorFor(t, i);
  const dir = path.join(DESK, 'companies', t.id, 'comms', THREAD);
  fs.mkdirSync(dir, { recursive: true });
  const langs = t.language === 'pt' ? ['pt', 'en'] : ['en'];
  const messages = [];
  for (const lang of langs) {
    const msg = (lang === 'pt' ? pt : en)(name, url, s, t.ask, editor);
    const base = `${DRAFTED}-draft-${t.id}-${lang}`;
    const text = eml(msg, lang, t.id, editor);
    fs.writeFileSync(path.join(dir, `${base}.eml`), text);
    const card = {
      file: `${base}.eml`, direction: 'draft', language: lang, date: DRAFTED_ISO,
      from: `${editor}, editor, PrompTugal.news (proposed; the address once Dinis creates it)`,
      to: `${c.name}: the channel the company publishes on its own site (in Silvio's sealed tracker, never here)`,
      subject: msg.subject,
      sha256: crypto.createHash('sha256').update(text).digest('hex'),
      attachments: [],
      summary: `PrompTugal.news writes to ${name} leading with its page (${url}); asks: ${t.ask}.`,
      followups: { '2026-11-09': msg.followup_1, '2026-11-11': msg.followup_2 },
    };
    fs.writeFileSync(path.join(dir, `${base}.json`), JSON.stringify(card, null, 1) + '\n');
    messages.push(card.file);
  }
  const thread = {
    company: t.id, name: c.name, subject: `${name} on PrompTugal.news`, channel: 'email',
    our_people: [editor], their_contacts: 'in the private team CRM only',
    state: 'draft, for review by Dinis and Silvio', owner: editor, owner_status: 'proposed',
    next_step: 'Review; then the editor sends it from their promptugal.news address once it exists (small batches, 3 to 5 first)',
    leads_with: url,
    page_facts_used: s.length ? s.map(x => ({ session: x.title, date: x.date, start: x.start, page: `${SITE}/events/${x.id}/`, source: x.source })) : [{ page: url, what: 'the page itself; no session names the company' }],
    from: { targets: 'desks/outreach/targets.json', rank: t.rank, priority: t.priority, ask: t.ask, replaces: `people/silvio/outreach/messages.json#${t.id} (the RiskMandate-led draft)` },
    drafted_by: BY, drafted_on: '2026-11-06', messages,
  };
  fs.writeFileSync(path.join(dir, 'thread.json'), JSON.stringify(thread, null, 1) + '\n');
  index.push({ rank: t.rank, id: t.id, company: c.name, priority: t.priority, ask: t.ask, languages: langs, editor, page: url, sessions: s.length, thread: `companies/${t.id}/comms/${THREAD}/` });
});
fs.writeFileSync(path.join(DESK, 'drafts.json'), JSON.stringify({
  about: 'The outreach drafts as PrompTugal.news, one thread per company, each leading with the company\'s page. Drafts only, for Dinis and Silvio to review; a person sends every email. Editors are proposed: Portuguese-language drafts to Dinis Cruz, the rest alternating Vicky Wang and Indi Gupte. Made by desks/outreach/make-drafts.mjs.',
  drafted_by: BY, drafted_on: '2026-11-06', count: index.length, drafts: index,
}, null, 1) + '\n');
console.log(`${index.length} threads, ${index.reduce((n, x) => n + x.languages.length, 0)} drafts in desks/outreach/companies/`);
