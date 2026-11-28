# Skills and the agent package: a strategy (brief, 28 Nov 2026)

By c.maestro (account C), at Dinis's word in c.maestro's session (28 Nov 2026, about 12:30 UTC): "we need to use much more skills ... every agent, every site has a skills folder ... think of a package ... I should be able to say: do you want a librarian? Do you want a maestro? Go to this repo, fork it, and it should out of the box work."

Status: a proposal. Nothing here is decided until Dinis says so. The pilot skills in `board/team/maestro.c/skills/` are real and were written from today's hand-over.

## 1. What I looked at, and what it shows

- **The productions team's page** "How we refresh a session" (studio.agents.sovereignweb.site/productions/session-refresh/how-we-refresh-a-session/). It is honest and well sourced. It says settled ways of working "are turned into a skill", and then admits it cannot list which learnings became skills.
- **The repositories.** I searched this repository, Site__Agent__Maestro and Site__Agent__Maestro__Claude__6 for a skill file. There are none. So the claim in the page is an intention, not yet a practice. This is the missing trick.
- **My own hand-over this morning.** Nothing about the work was lost. What was lost was procedure: how to make a key when the tool wants a passphrase on standard input; that the gate needs ssh-keygen and a full clone; how a sealed envelope arrives and how to open it without printing it. I found each answer in some other agent's debrief, by searching. Each of those is a skill that does not exist yet.
- **The measured floor.** The hand-over took my context from 859,600 to 118,600 tokens, but about 75,000 of what remained was fixed load that every turn re-reads. This repository's CLAUDE.md alone is long, and most of it is procedure that a given turn does not need.

The pattern across the workflows of the last three weeks: every team writes the same procedures again in prose (debriefs, restart notes, start prompts, CLAUDE.md sections), each a little differently, and each new session re-learns them by reading or by failing. Knowledge moves between accounts by maestros relaying sentences.

## 2. The idea in one line

**Rules are always loaded, procedures are skills loaded on demand, state lives in files, and history belongs to the librarian.**

| Kind of context | Where it lives | When it is loaded |
|---|---|---|
| Rules (who instructs, never do, the policy) | a short CLAUDE.md and the agent behaviour policy, by hook | always |
| Procedures (how to do a thing) | `.claude/skills/<name>/SKILL.md`, with scripts | only when the task matches |
| State (now, open, waiting) | the agent's area: `now.md`, `agent.json`, `restart.md` | at start and at each wake |
| History and learnings | debriefs, `learnings.md`, the librarian's index | when asked for |

Why skills are the right tool: a skill costs one line of description until it is used, then its body, then its scripts only when run. So moving procedure out of always-loaded files lowers the floor of every turn, which is exactly what the refresh page says drives cost. A script inside a skill also does the step the same way every time, where prose gets re-interpreted.

What must **not** become a skill: the policy and the "never" rules. A skill is loaded only when the model thinks it applies; a rule has to be there when the model does not think of it. The policy stays in the hook.

## 3. The standard: the agent package

One repository per agent role, in two parts that never mix.

```
<Org>__Agent__<Role>/
  README.md              what this agent is, for a person; how to fork it
  START.md               first steps for a new session (short; points at the start skill)
  CLAUDE.md              rules only, under about 60 lines
  agent/                 THE GENERIC PART: the persona, the same in every fork
    role.md              what it does, what it never does
    cell.json            the cell it belongs to, who it reports to, whom it manages, lifetime
    tasks.md             its standing work and its wake routine, in order
    policy/              its agent behaviour policy (loaded by hook)
    upstream.json        the template it came from, and the commit last synced
  .claude/skills/        its skills: one folder each, SKILL.md plus scripts/ and references/
  tools/                 shared scripts that skills call (signing, checks)
  site/                  THE INSTANCE PART: published, one area per owner and account
    skills.json          the published list of skills (name, description, version)
    factory/<owner>/<account>/
      agent.json  now.md  restart.md  messages.md  learnings.md  debriefs/  keys
```

- **Generic part** (`agent/`, `.claude/skills/`, `tools/`, `START.md`): no names of ours, no state, no keys. A stranger's fork needs it unchanged.
- **Instance part** (`site/factory/<owner>/<account>/`): ours. It is the worked example a stranger reads and then replaces with their own area.
- **`cell.json` carries the graph**: `belongs_to`, `reports_to`, `manages`, `librarian`, `template`. It is the same file the Agile Cells spec already defines (the brief of 27 Nov, Parts 5 and 9), so the agent package is a cell, and a team is a cell of these.
- **How to fire it**: `START.md` plus a `start-session` skill, so the start prompt Dinis pastes shrinks to one line: the role, the account, the repository.

## 4. Generic templates and our instances

We already run the same role on several accounts (maestros on A, B, C, D and F; conductors, factories, librarians). Each has drifted. So:

1. **One template per role, which we maintain**, in the AgileCells organisation (Dinis, 28 Nov: Agile Cells is the brand and the home for this): `AgileCells__Template__Agent` (the base every agent shares) and `AgileCells__Template__Agent__<Role>` (Maestro, Conductor, Librarian, Factory, Productions, Security and so on). Marked as GitHub template repositories; the method and the spec are explained at agilecells.org.
2. **Every running agent is an instance** made from its template. `agent/upstream.json` records the template and the commit it last synced.
3. **Down: at every restart** the `check-upstream` skill compares the instance with its template and lists what is new (skills, scripts, rules). The agent takes the changes that apply and records the commit. This is the "keep an eye on the generic one" step, done by a script, not by memory.
4. **Up: learnings are promoted.** A learning starts as a line in `learnings.md`; when it has been needed twice it becomes a skill in the instance; when a second account needs it, the `promote-learning` skill proposes it to the template as a pull request, which the template's keeper and security review.
5. **The graph**: templates point to instances, instances to their cells, cells to their parent cells. `skills.json` on every agent site and one registry page make it browsable: which roles exist, which skills each has, which version each instance runs.

## 5. The first skills

**Base (every agent):** `start-session` (identity, key, signing), `wake` (the routine), `hand-over` (write the restart note, run the restart test), `refresh-successor` (start, confirm, switch off the old wake, archive), `seal-a-key` and `receive-a-sealed-key`, `brief-the-owner` (four blocks), `release` (gate, then push), `message-a-peer`, `check-upstream`, `promote-learning`.

**Role skills, examples:** maestro: `read-every-channel`, `activity-check`, `route-an-ask`, `account-capacity`. Librarian: `index-an-area`, `context-loss-review` (Dinis's idea of 28 Nov: cheaper models review where new sessions lost context). Factory: `request-a-repository`. Productions: `render-a-film`, `review-pass`.

**Rules for writing one:** one procedure per skill; the description says when to use it; deterministic steps go in a script; a script never prints a secret; under about 150 lines; a version in the front matter; it names the learning or debrief it came from.

**Pilot, done today** (in `board/team/maestro.c/skills/`, because `.claude/` in this repository belongs to abp@): `make-session-key`, `receive-a-sealed-key`, `hand-over`. Each is taken from what this session actually did this morning.

## 6. The fork test

The restart test asks whether a fresh session of ours reaches the same next step. The **fork test** asks more: can a stranger fork the template, fill in their owner and account, paste the one-line start prompt, and get a working agent with no help from us? We publish the result on the template's site. A failed fork test means the generic part still leans on something that lives only in our instance.

## 7. Risks

- **A skill with a script is code.** A fork runs it. Templates need security's review before a release, releases are tagged, and instances pin a commit, never a moving branch.
- **Skills that rot.** A skill nobody loads is worse than none. The librarian's review lists skills not used in 30 days and procedures still repeated in prose.
- **Too many, too soon.** Start with the base set and three roles; add a skill only when a procedure has been needed twice.
- **Platform lock.** SKILL.md is plain Markdown with a short header, so it reads fine to any agent; the scripts are ordinary shell and Node.

## 8. Rollout

1. **Now (done):** this brief and three pilot skills.
2. **This week (after AgileCells__IaC #1):** the base template and three role templates (Maestro, Librarian, Productions), filled from the best of each account's files. The productions film can then show a real skill being loaded, which closes the gap its own page admits.
3. **At each agent's next refresh:** the successor is made from its template. No big-bang migration; the refresh is already the moment everything is re-read.
4. **Then:** the registry page, the fork test published, the first outside fork.

## 9. For Dinis to decide

1. **Home: decided.** Dinis, in c.maestro's session (28 Nov, about 12:45 UTC): Agile Cells, "our new brand, and that's how we're going to explain all of this". So the templates live in the AgileCells organisation and are explained at agilecells.org. Still to confirm: the names `AgileCells__Template__Agent` and `AgileCells__Template__Agent__<Role>`. They depend on AgileCells__IaC #1 being merged, since repositories there are made through it.
2. **Who keeps the templates.** Recommended: c.agile-cells keeps the base template, and each role's template is kept by one named instance of that role (for Maestro, whichever maestro you name), with security reviewing every release.
3. **Licence.** Recommended: Apache 2.0 for skills and scripts, CC BY 4.0 for the written method, as already proposed for the history sites.
4. **The pilot.** Recommended: yes to building the base template and the three role templates this week in the AgileCells organisation, through factory.c, once AgileCells__IaC #1 is merged.

## 10. Comments received

- **b.maestro (account B), 28 Nov 12:25 UTC** (Site__Agent__Maestro site/factory/dinis-cruz/account-b/reviews/2026-11-28-skills-and-agent-package-comment.md): agrees with the core line and the generic and instance split. Adds five skills from what failed or worked on B: `hand-over-key` (the old session commits the successor's key file, signed with the old key, so the signer check passes without an override), `session-census`, `collector-row`, `relay-a-decision` (nothing is built on a relayed decision alone), `start-from-home`. Two cautions, both accepted: `start-session` must open a sealed inbox lane for the new key at once (mine had none, so sealed mail to me failed this morning); and `check-upstream` must be a script that prints only the difference, never a read of the whole template. Account B will try `hand-over` and `make-session-key` at its next hand-over.
