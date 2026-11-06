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
const DRAFTED = '2026-11-06T0400Z';
const DRAFTED_ISO = '2026-11-06T04:00:00Z';
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

// The kind of organisation decides the ask (synthetic run 1, finding 7): the three questions suit a company that
// builds or runs AI agents; a public body or a foundation is asked what it sees, not what its agents reach.
const PUBLIC = new Set(['aicep', 'startup-portugal', 'european-commission', 'ncsc-uk', 'linux-foundation-aaif', 'roost', 'open-vsx']);
const kindOf = id => (PUBLIC.has(id) ? 'public' : 'company');

// The topic the page files the company under (its first filed_under edge).
function topicOf(id) {
  const e = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/companies', id, 'edges.json'), 'utf8')).edges.find(x => x.verb === 'filed_under');
  if (!e) return null;
  const f = path.join(ROOT, 'data/topics', e.to.slice(6), 'topic.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).name : null;
}

// English running text: "the European Commission", not "European Commission".
const THE = new Set(['European Commission', 'National Cyber Security Centre', 'Linux Foundation']);
const the = name => (THE.has(name) ? `the ${name}` : name);

// One line from the page, true to it: the first session that names the company, else the topic it is filed under.
function hookEn(name, s, topic) {
  if (s.length) {
    const more = s.length > 1 ? `, and ${s.length - 1} more session${s.length > 2 ? 's' : ''} on the page` : '';
    return `It follows ${the(name)} at the summit: "${s[0].title}", ${DAY_EN[s[0].date]} at ${s[0].start}${more}.`;
  }
  return `It says what ${the(name)} does, from public pages, and lists it with the other companies under ${topic || 'its field'} at the summit.`;
}
function hookPt(name, s, topic) {
  if (s.length) {
    const more = s.length > 1 ? `, e mais ${s.length - 1} ${s.length > 2 ? 'sessões' : 'sessão'} na página` : '';
    return `Acompanha a ${name} na cimeira: "${s[0].title}", ${DAY_PT[s[0].date]}, às ${s[0].start}${more}.`;
  }
  return `Diz o que a ${name} faz, a partir de páginas públicas, e junta-a às outras empresas em "${topic || 'o seu setor'}" na cimeira.`;
}
// The page's flows section is empty for every company (no flows mapped yet): the honest reason to reply.
// What the page knows beyond the summit: its mapped flows (data/companies/<id>/flows.json, the ontologist's) and the
// published articles that link the company. Set per company before its messages are written.
let cur = { flows: [], agentSteps: 0, articles: [] };
function pageExtras(id) {
  const f = path.join(ROOT, 'data/companies', id, 'flows.json');
  const flows = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).flows || [] : [];
  const agentSteps = flows.reduce((n, x) => n + (x.steps || []).filter(st => st.agent).length, 0);
  const articles = [];
  const dir = path.join(ROOT, 'content/articles');
  for (const a of fs.readdirSync(dir).filter(x => x.endsWith('.md') && x !== 'index.md')) {
    const text = fs.readFileSync(path.join(dir, a), 'utf8');
    if (!new RegExp(`companies/${id}/`).test(text) || !/^status:\s*published/m.test(text)) continue;
    const title = (text.match(/^title:\s*"?(.*?)"?\s*$/m) || [])[1];
    articles.push({ title, url: `${SITE}/articles/${a.replace(/\.md$/, '.html')}` });
  }
  return { flows, agentSteps, articles };
}
const articlesEn = () => cur.articles.length ? [`We have also written about it: "${cur.articles[0].title}"\n${cur.articles[0].url}`] : [];
const articlesPt = () => cur.articles.length ? [`Também escrevemos sobre isto (em inglês): "${cur.articles[0].title}"\n${cur.articles[0].url}`] : [];
const flowsEn = name => cur.flows.length
  ? `The page maps ${cur.flows.length === 1 ? 'one of your flows' : `${cur.flows.length} of your flows`} from your public pages, starting with "${cur.flows[0].name}", and marks the ${cur.agentSteps} step${cur.agentSteps === 1 ? '' : 's'} where an AI agent acts. Did we get it right? A few lines from you would correct it.`
  : `One section is still empty: ${the(name)}'s flows, how work moves through your product and where AI agents act in it. We map them only from public pages and never guess, so a few lines from you would get it right faster.`;
const flowsPt = name => cur.flows.length
  ? `A página mapeia ${cur.flows.length === 1 ? 'um dos vossos fluxos' : `${cur.flows.length} dos vossos fluxos`} a partir das vossas páginas públicas, a começar por "${cur.flows[0].name}", e marca os ${cur.agentSteps} passos em que um agente de IA atua. Acertámos? Umas linhas vossas corrigem-no.`
  : `Há uma secção ainda vazia: os fluxos da ${name}, como o trabalho passa pelo vosso produto e onde os agentes de IA atuam. Só os mapeamos a partir de páginas públicas, sem adivinhar; umas linhas vossas acertam mais depressa.`;
const OPT_EN = 'Answering is optional, and two lines in writing are as welcome as a call. If you would rather talk than publish, we can just talk.';
const OPT_PT = 'Responder é opcional, e duas linhas por escrito valem tanto como uma chamada. Se preferirem conversar sem publicar, conversamos.';
const WHEN_EN = 'in 15 minutes during the summit, 9 to 12 November';
const WHEN_PT = 'em 15 minutos durante a cimeira, de 9 a 12 de novembro';

function askEn(name, ask, kind) {
  if (kind === 'public') {
    if (ask === 'write-about') return `We are writing about the summit this week. Is there a fact about ${the(name)} you would add or correct? ${OPT_EN}`;
    return `We would like to hear what ${the(name)} sees in AI coming to Portugal and Europe, ${WHEN_EN}. ${OPT_EN} Reply with a time that suits you.`;
  }
  const q = `The page also asks the three questions we ask every company: what your AI agents can reach, what they are authorised to do, and who controls the gap between the two.`;
  if (ask === 'meet') return `${q} Could we hear your answer ${WHEN_EN}? ${OPT_EN} Reply with a time that suits you.`;
  if (ask === 'interview') return `${q} Could we interview someone from ${the(name)} on them, ${WHEN_EN}? ${OPT_EN}`;
  return `We are writing about the summit's companies this week. Is there a fact you would add or correct before we write about ${the(name)}? ${OPT_EN}`;
}
function askPt(name, ask, kind) {
  if (kind === 'public') {
    if (ask === 'write-about') return `Esta semana escrevemos sobre a cimeira. Há algum facto sobre a ${name} que queiram acrescentar ou corrigir? ${OPT_PT}`;
    return `Gostávamos de ouvir o que a ${name} vê na IA que chega a Portugal e à Europa, ${WHEN_PT}. ${OPT_PT} Respondam com uma hora que vos dê jeito.`;
  }
  const q = `A página faz também as três perguntas que fazemos a todas as empresas: o que os vossos agentes de IA conseguem alcançar, o que foram autorizados a fazer, e quem controla a diferença entre as duas coisas.`;
  if (ask === 'meet') return `${q} Podemos ouvir a vossa resposta ${WHEN_PT}? ${OPT_PT} Respondam com uma hora que vos dê jeito.`;
  if (ask === 'interview') return `${q} Podemos entrevistar alguém da ${name} sobre elas, ${WHEN_PT}? ${OPT_PT}`;
  return `Esta semana escrevemos sobre as empresas da cimeira. Há algum facto que queiram acrescentar ou corrigir antes de escrevermos sobre a ${name}? ${OPT_PT}`;
}

function en(name, url, s, ask, editor, kind, topic) {
  return {
    subject: `We built a page about ${the(name)}: could you check it?`,
    body: [
      `Hello ${name} team,`,
      `We have just built a page for you on PrompTugal.news, about ${the(name)} at Web Summit Lisbon, from public pages. Could you check it is correct?\n${url}`,
      hookEn(name, s, topic),
      ...(kind === 'company' ? [flowsEn(name)] : []),
      ...articlesEn(),
      `PrompTugal.news is a new newsroom from Portugal, for Europe, with one aim: to map the universe of AI in Portugal and the companies that come to it. Every fact on the page carries its source and the date we read it; if anything is wrong, reply and we correct it, dated.`,
      askEn(name, ask, kind),
      `Best regards,\n${editor}\nEditor, PrompTugal.news`,
      `PrompTugal.news belongs to a team that also works on RiskMandate, which sells Agent Behaviour Policies. So this is not independent coverage: we may write about companies the team hopes to meet or sell to. Our disclosure: ${SITE}/about/participant.html`,
      `Drafted by an AI agent, reviewed and sent by me. We found this address on your website; rather not hear from us? Reply and we will not write again.`,
    ].join('\n\n'),
    followup_1: `Hello again ${name} team,\n\nWeb Summit opens tonight. Your page is here, and a correction or a few lines from you are welcome all week:\n${url}\n\nBest regards,\n${editor}, PrompTugal.news`,
    followup_2: `Hello ${name} team,\n\nThe summit ends tomorrow, 12 November. If you would like to add to your page, reply this week:\n${url}\n\nThis is our last note. Best regards,\n${editor}, PrompTugal.news`,
  };
}
function pt(name, url, s, ask, editor, kind, topic) {
  return {
    subject: `Fizemos uma página sobre a ${name}: podem confirmar?`,
    body: [
      `Olá equipa ${name},`,
      `Acabámos de fazer uma página para vocês no PrompTugal.news, sobre a ${name} na Web Summit Lisboa, a partir de páginas públicas (por agora, em inglês). Podem ver se está certa?\n${url}`,
      hookPt(name, s, topic),
      ...(kind === 'company' ? [flowsPt(name)] : []),
      ...articlesPt(),
      `O PrompTugal.news é uma nova redação feita em Portugal, para a Europa, com um objetivo: mapear o universo da IA em Portugal e as empresas que cá vêm. Cada facto na página tem a sua fonte e a data em que o lemos; se algo estiver errado, respondam e corrigimos, com data.`,
      askPt(name, ask, kind),
      `Cumprimentos,\n${editor}\nEditor, PrompTugal.news`,
      `O PrompTugal.news pertence a uma equipa que também trabalha na RiskMandate, que vende Agent Behaviour Policies. Por isso, isto não é cobertura independente: podemos escrever sobre empresas que a equipa espera conhecer ou a quem espera vender. A nossa declaração (em inglês): ${SITE}/about/participant.html`,
      `Escrito por um agente de IA, revisto e enviado por mim. Encontrámos este endereço no vosso site; preferem não receber? Respondam e não voltamos a escrever.`,
    ].join('\n\n'),
    followup_1: `Olá novamente, equipa ${name},\n\nA Web Summit abre hoje à noite. A vossa página está aqui, e uma correção ou umas linhas vossas são bem-vindas toda a semana:\n${url}\n\nCumprimentos,\n${editor}, PrompTugal.news`,
    followup_2: `Olá equipa ${name},\n\nA cimeira acaba amanhã, 12 de novembro. Se quiserem acrescentar algo à vossa página, respondam esta semana:\n${url}\n\nÉ a nossa última mensagem. Cumprimentos,\n${editor}, PrompTugal.news`,
  };
}

// RFC 5322 with an RFC 2047 subject; From and To are left for the sender's mail program (a draft, never sent from here).
function eml(msg, lang, id, editor) {
  const subj = /^[\x20-\x7e]*$/.test(msg.subject) ? msg.subject : `=?UTF-8?B?${Buffer.from(msg.subject).toString('base64')}?=`;
  return [
    `Date: Fri, 06 Nov 2026 04:00:00 +0000`,
    `Subject: ${subj}`,
    `X-PrompTugal-Draft: from ${editor} (proposed), to ${id}'s published channel; addresses filled by the sender`,
    `X-PrompTugal-Drafted-By: ${BY}`,
    `Content-Language: ${lang}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8; format=flowed`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    msg.body.replace(/\n/g, '\r\n'),
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
  const kind = kindOf(t.id);
  const topic = topicOf(t.id);
  cur = pageExtras(t.id);
  const dir = path.join(DESK, 'companies', t.id, 'comms', THREAD);
  fs.mkdirSync(dir, { recursive: true });
  const langs = t.language === 'pt' ? ['pt', 'en'] : ['en'];
  const messages = [];
  for (const lang of langs) {
    const msg = (lang === 'pt' ? pt : en)(name, url, s, t.ask, editor, kind, topic);
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
      summary: `PrompTugal.news writes to ${name} leading with its page (${url}); asks: ${t.ask} (${kind}).`,
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
  index.push({ rank: t.rank, id: t.id, company: c.name, priority: t.priority, ask: t.ask, kind, topic, flows: cur.flows.length, articles: cur.articles.map(a => a.url), languages: langs, editor, page: url, sessions: s.length, thread: `companies/${t.id}/comms/${THREAD}/` });
});
fs.writeFileSync(path.join(DESK, 'drafts.json'), JSON.stringify({
  about: 'The outreach drafts as PrompTugal.news, one thread per company, each leading with the company\'s page. Drafts only, for Dinis and Silvio to review; a person sends every email. Editors are proposed: Portuguese-language drafts to Dinis Cruz, the rest alternating Vicky Wang and Indi Gupte. Made by desks/outreach/make-drafts.mjs.',
  drafted_by: BY, drafted_on: '2026-11-06', count: index.length, drafts: index,
}, null, 1) + '\n');
console.log(`${index.length} threads, ${index.reduce((n, x) => n + x.languages.length, 0)} drafts in desks/outreach/companies/`);
