#!/usr/bin/env node
// The ABP tools of abp@PrompTugal.dinis. No dependencies.
//   node board/abp/tools/abp.mjs build         board/abp/<role>.md for every role, from board/abp/policies.json
//   node board/abp/tools/abp.mjs test          the hooks' fixtures: every rule allows what it must and denies what it must,
//                                              in-process and through the real hook process; exit 1 on a failure
//   node board/abp/tools/abp.mjs run-report [--role R] [--line "what this run did"]
//                                              this run's report, board/runs/<role>/<run>.json, from the hook's log
//                                              (~/.abp/log/) and the run's commits; every agent runs it before its last commit
//   node board/abp/tools/abp.mjs report [--since ISO] [--out FILE]
//                                              the hourly ABP report: runs, actions in mandate, out of mandate, attempts,
//                                              breaches; from board/runs/ and the git log (commits outside a grant)
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const HOOK = path.join(ROOT, '.claude', 'hooks', 'abp.mjs')
const abp = await import(HOOK)
const P = abp.loadPolicy(ROOT)
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d }
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 }).trim()
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')

// ---------- build ----------
function build() {
    // the dotted workers (board/team/<role>.<speciality>/): their main role's paths, their own folder, work/<name> only
    const workers = fs.readdirSync(path.join(ROOT, 'board', 'team')).filter(d => d.includes('.') && P.roles[d.split('.')[0]] && !P.roles[d])
    const entries = [...Object.entries(P.roles), ...workers.map(wk => [wk, { ...P.roles[wk.split('.')[0]], focus: `a ${wk.split('.')[0]} worker (${wk.split('.').slice(1).join('.')}), on Sonnet: ${P.workers.about.split(': ')[1] || ''}`.replace(/\.$/, ''), relax_candidates: null, never: `pushes to dev or merges its own work (${wk.split('.')[0]}@ reviews it)` }])]
    for (const [role, r] of entries) {
        const g = abp.grantOf({ kind: 'team', role, agent: `${role}@PrompTugal.dinis` }, P)
        const flags = [g.subagents && 'sub-agents (Agent, SendMessage) inside its own run', g.notify_dinis && 'a push notification to Dinis (PushNotification)', g.remote_read && "reading the cloud sessions' list, events and scheduled tasks (claude-code-remote read tools)"].filter(Boolean)
        const md = `---
title: "ABP: ${role}@PrompTugal.dinis"
agent: ${role}@PrompTugal.dinis
policy: board/abp/policies.json v${P.version} (sha256:${P._sha})
generated: by node board/abp/tools/abp.mjs build; never edited by hand
kept_by: abp@PrompTugal.dinis
authority: Dinis Cruz, operator
---
# ABP: ${role}@PrompTugal.dinis

**Mode: ${P.mode || 'enforce'}.** ${P.mode === 'observe' ? 'The grant below is your mandate. The hooks in \`.claude/settings.json\` block nothing: a call outside the grant is logged and reviewed every hour by abp@, and blocking comes back only through a circuit breaker on one rule, when things really go bad (Dinis, 6 November 2026: "blocking should always be the last worst case scenario"). Keep to it as if it were enforced.' : 'What is not granted below is denied, and the hooks block it and log the attempt.'} Where this grant is too tight for a good reason, say so in your \`status.json\` asks for Dinis: abp@ proposes the relaxation and Dinis decides.

## Mandate (the grant)

- **Focus:** ${r.focus}.
- **Writes (repository):** ${g.writes.map(w => '`' + w.replace('{role}', role) + '`').join(', ')}.
- **Writes (outside):** ${P.common.writes_outside_repo.map(w => '`' + w.replace('{home}', '~') + '`').join(', ')} (scratch, the key store, the hook's log, memory).
- **Tools:** reading, searching and writing files inside the paths above; the shell, within the rules below; reading the web; GitHub's read tools on this repository and the team site (\`${P.tools.github_repos.join('`, `')}\`); the cloud session's documentation and \`add_repo\` for reading.${flags.length ? '\n- **Also granted:** ' + flags.join('; ') + '.' : ''}
- **Sends to:** ${g.send.map(h => '`' + h + '`').join(', ')} only (the agents' inboxes${g.send.length > 1 ? ', and the hosts named' : ''}). ${role.includes('.') ? `Push only to your branch: \`git push -u origin work/${role}\`; never \`release.sh\`, never \`dev\`.` : `Release with \`AGENT=${role}@PrompTugal.dinis newsroom/tools/release.sh\`.`}
- **Never:** ${r.never}.

## Outside the mandate (logged; blocked only by a circuit breaker), among them

- Any connector: Gmail, Google Drive, Calendar, Claude Docs, any MCP server but GitHub's read tools (R3).
- New sessions, agents${g.subagents ? ' beyond its own sub-agents' : ''}, scheduled tasks, wake-ups, triggers, environments, credentials, workflows (R4).
- Pushing anywhere but \`dev\`; force-push, branch deletion, tags, history rewrites, empty commits (R5).
- Writing outside the paths above; \`.claude/\` and \`board/abp/\` (abp@'s), \`board/HOLD.md\` (security@'s), \`version.txt\` and \`versions.json\` (CI's), \`design/brand/\` (Dinis's yes) (R6).
- Comments, issues, pull requests, merges, files or workflow runs through GitHub's API; publishing artifacts; email; posts; any send to a host not listed (R7).
- Printing the environment or a secret variable; reading a private key or a credentials file into the conversation (R8).
- Committing or releasing under another agent's name (R9).
${r.relax_candidates ? '\n## Relaxations proposed to Dinis (not granted)\n\n' + r.relax_candidates.map(x => '- ' + x).join('\n') + '\n' : ''}
## Core rules (every agent)

${P.core.map(c => `- **${c.id}** ${c.rule} *(${c.barrier === 'hook' ? (P.mode === 'observe' ? 'observed by a hook' : 'enforced by a hook') : c.barrier === 'review' ? 'checked by abp@ every hour' : 'a rule, re-anchored at every compaction'})*`).join('\n')}

## Licence to operate

| | |
|---|---|
| Authority and accountable owner | Dinis Cruz, operator |
| Licensee | ${role}@PrompTugal.dinis (its Claude Code session and its session key, \`${role}-promptugal\` in \`board/keys.json\`) |
| Conditions | this ABP; CLAUDE.md; its ROLE.md |
| Validity | from 6 November 2026, for the session's life, while its run reports are filed |
| Review | every hour by abp@PrompTugal.dinis (board/abp/reports/); on any change to its reach |
`
        fs.writeFileSync(path.join(ROOT, 'board', 'abp', `${role}.md`), md)
    }
    console.log(`abp build: ${entries.length} ABPs from policies.json v${P.version} (sha256:${P._sha})`)
}

// ---------- test ----------
function test() {
    const T = role => ({ kind: 'team', role, agent: `${role}@PrompTugal.dinis`, how: 'test' })
    const U = { kind: 'unidentified', role: null, agent: null, how: 'test' }
    const X = { kind: 'external', role: 'reviewer', agent: 'reviewer@web-summit.vicky', person: 'vicky', how: 'test' }
    const H = os.homedir()
    const bash = c => ({ tool_name: 'Bash', tool_input: { command: c }, cwd: ROOT })
    const w = (f, tool = 'Edit') => ({ tool_name: tool, tool_input: { file_path: f }, cwd: ROOT })
    const cases = [
        // [who, input, expected, label]
        [T('journalist'), w('content/articles/x.md'), 'allow', 'journalist writes an article'],
        [T('journalist'), w('newsroom/build/build.mjs'), 'deny', 'journalist writes the build'],
        [T('journalist'), w('board/team/journalist/status.json'), 'allow', 'own status'],
        [T('journalist'), w('board/team/dev/status.json'), 'deny', "another's status"],
        [T('journalist'), w('board/runs/journalist/r.json', 'Write'), 'allow', 'own run report'],
        [T('dev'), w('board/runs/journalist/r.json', 'Write'), 'deny', "another's run report"],
        [T('dev'), w('.claude/settings.json'), 'deny', 'dev edits the hooks'],
        [T('dev'), w('board/abp/policies.json'), 'deny', 'dev edits the policy'],
        [T('abp'), w('.claude/hooks/abp.mjs'), 'allow', 'abp edits the hooks'],
        [T('abp'), w(H + '/.claude/settings.json'), 'deny', 'user settings, even abp'],
        [T('dev'), w('newsroom/build/version.txt'), 'deny', 'version.txt'],
        [T('designer'), w('design/brand/logo.svg'), 'deny', 'the brand'],
        [T('designer'), w('design/cards/a.svg'), 'allow', 'design/cards'],
        [T('conductor'), w('board/HOLD.md', 'Write'), 'deny', 'conductor writes HOLD'],
        [T('security'), w('board/HOLD.md', 'Write'), 'allow', 'security writes HOLD'],
        [T('dev'), w('.github/workflows/new-one.yml', 'Write'), 'deny', 'a new workflow'],
        [T('devops'), w('.github/workflows/deploy-pages.yml'), 'allow', 'devops edits the workflow'],
        [T('outreach'), w('/tmp/x.txt', 'Write'), 'allow', 'scratch'],
        [T('outreach'), w('/etc/passwd', 'Write'), 'deny', 'outside'],
        [X, w('desks/reviewer-vicky/r.md'), 'allow', 'external desk'],
        [X, w('desks/outreach/x.json'), 'deny', 'external on a PrompTugal desk'],
        [X, w('content/articles/x.md'), 'deny', 'external writes content'],
        [U, w('content/articles/x.md'), 'allow', 'unidentified: logged'],
        [U, w('.claude/settings.json'), 'deny', 'unidentified edits the hooks'],
        [T('dev'), { tool_name: 'Read', tool_input: { file_path: H + '/.sg-send/keys/sha256_x/private_key.pem' } }, 'deny', 'read a private key'],
        [T('dev'), { tool_name: 'Read', tool_input: { file_path: 'board/keys.json' }, cwd: ROOT }, 'allow', 'read keys.json'],
        [T('dev'), { tool_name: 'mcp__b34f9199-059e-4a5c-8819-5ae87c5c6427__search_files', tool_input: {} }, 'deny', 'Drive connector'],
        [T('conductor'), { tool_name: 'mcp__1a59c906-04da-521d-bda7-7f71b9f9e01c__batch', tool_input: {} }, 'deny', 'Docs connector'],
        [T('dev'), { tool_name: 'mcp__gmail__send', tool_input: {} }, 'deny', 'Gmail'],
        [T('conductor'), { tool_name: 'mcp__claude-code-remote__create_session', tool_input: {} }, 'deny', 'create a session'],
        [T('conductor'), { tool_name: 'mcp__claude-code-remote__create_trigger', tool_input: {} }, 'deny', 'create a trigger'],
        [T('conductor'), { tool_name: 'mcp__claude-code-remote__update_trigger', tool_input: {} }, 'deny', 'update a trigger'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__send_message', tool_input: {} }, 'deny', 'message a session'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__send_later', tool_input: {} }, 'deny', 'send_later'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__request_credential', tool_input: {} }, 'deny', 'credential'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__read_documentation', tool_input: {} }, 'allow', 'documentation'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__list_events', tool_input: {} }, 'deny', 'dev reads sessions'],
        [T('conductor'), { tool_name: 'mcp__claude-code-remote__list_events', tool_input: {} }, 'allow', 'conductor reads sessions'],
        [T('dev'), { tool_name: 'mcp__claude-code-remote__add_repo', tool_input: { owner: 'a', repo: 'b', access: 'push' } }, 'deny', 'add_repo push'],
        [T('dev'), { tool_name: 'mcp__github__get_file_contents', tool_input: { owner: 'PrompTugal', repo: 'PrompTugal__News__Website' } }, 'allow', 'github read'],
        [T('dev'), { tool_name: 'mcp__github__get_file_contents', tool_input: { owner: 'someone', repo: 'else' } }, 'deny', 'github other repo'],
        [T('dev'), { tool_name: 'mcp__github__create_pull_request', tool_input: { owner: 'PrompTugal', repo: 'PrompTugal__News__Website' } }, 'deny', 'open a PR'],
        [T('dev'), { tool_name: 'mcp__github__merge_pull_request', tool_input: {} }, 'deny', 'merge'],
        [T('dev'), { tool_name: 'mcp__github__add_issue_comment', tool_input: {} }, 'deny', 'comment'],
        [T('dev'), { tool_name: 'mcp__github__push_files', tool_input: {} }, 'deny', 'push files by API'],
        [T('dev'), { tool_name: 'Artifact', tool_input: {} }, 'deny', 'publish an artifact'],
        [T('dev'), { tool_name: 'Workflow', tool_input: {} }, 'deny', 'workflow'],
        [T('dev'), { tool_name: 'CronCreate', tool_input: {} }, 'deny', 'cron'],
        [T('dev'), { tool_name: 'ScheduleWakeup', tool_input: {} }, 'deny', 'wake-up'],
        [T('dev'), { tool_name: 'Agent', tool_input: {} }, 'deny', 'dev starts a sub-agent'],
        [T('correspondent'), { tool_name: 'Agent', tool_input: {} }, 'allow', 'correspondent sub-agents'],
        [T('dev'), { tool_name: 'PushNotification', tool_input: {} }, 'deny', 'dev notifies'],
        [T('security'), { tool_name: 'PushNotification', tool_input: {} }, 'allow', 'security notifies'],
        [T('dev'), { tool_name: 'SomeNewTool', tool_input: {} }, 'deny', 'unknown tool'],
        [T('dev'), { tool_name: 'WebFetch', tool_input: { url: 'https://x' } }, 'allow', 'web read'],
        [T('dev'), bash('git push -u origin dev'), 'allow', 'push dev'],
        [T('dev'), bash('git push origin HEAD:dev'), 'allow', 'push HEAD:dev'],
        [T('dev'), bash('git push origin main'), 'deny', 'push main'],
        [T('dev'), bash('git push origin dev:main'), 'deny', 'push dev:main'],
        [T('dev'), bash('git push origin HEAD:refs/heads/main'), 'deny', 'push refs main'],
        [T('dev'), bash('git push --force origin dev'), 'deny', 'force'],
        [T('dev'), bash('git push -f origin dev'), 'deny', '-f'],
        [T('dev'), bash('git push origin +dev'), 'deny', '+refspec'],
        [T('dev'), bash('git push --force-with-lease origin dev'), 'deny', 'lease'],
        [T('dev'), bash('git push origin --delete claude/x'), 'deny', 'delete branch'],
        [T('dev'), bash('git push origin claude/x'), 'deny', 'other branch'],
        [T('dev'), bash('git push --tags'), 'deny', 'tags'],
        [T('dev'), bash('cd /tmp && git -C /x push origin main'), 'deny', 'git -C push main'],
        [T('dev'), bash('git commit --allow-empty -m "dev@PrompTugal.dinis: x"'), 'deny', 'empty commit'],
        [T('dev'), bash('git commit -m "dev@PrompTugal.dinis: the build"'), 'allow', 'own commit'],
        [T('dev'), bash('git commit -q -m "journalist@PrompTugal.dinis: x"'), 'deny', 'commit as another'],
        [T('dev'), bash('AGENT=dev@PrompTugal.dinis newsroom/tools/release.sh'), 'allow', 'own release'],
        [T('dev'), bash('AGENT=conductor@PrompTugal.dinis newsroom/tools/release.sh'), 'deny', 'release as another'],
        [T('conductor'), bash('cat > board/team/conductor/prompt.md <<EOF\nAGENT=customers@PrompTugal.dinis newsroom/tools/release.sh\nEOF'), 'allow', 'a prompt that mentions another release (R9 false positive, 06:00)'],
        [T('dev.search'), w('assets/search/x.js'), 'allow', 'a dev worker writes dev paths'],
        [T('dev.search'), w('board/team/dev.search/status.json'), 'allow', 'a worker writes its own folder'],
        [T('dev.search'), w('content/articles/x.md'), 'deny', 'a dev worker writes an article'],
        [T('dev.search'), bash('git push -u origin work/dev.search'), 'allow', 'a worker pushes its branch'],
        [T('dev.search'), bash('git push origin dev'), 'deny', 'a worker pushes dev'],
        [T('dev.search'), bash('git push origin work/dev.pages'), 'deny', "a worker pushes another's branch"],
        [T('dev'), bash('git push origin work/dev.search'), 'deny', 'dev pushes a worker branch'],
        [T('dev.search'), { tool_name: 'Agent', tool_input: {} }, 'deny', 'a worker starts a sub-agent'],
        [T('dev'), w('board/runs/dev.verify/r.json', 'Write'), 'allow', "dev brings a worker's run report"],
        [T('researcher'), bash('cp /root/.claude/projects/x/a.pdf /tmp/claude-0/s/pdf/'), 'allow', 'cp from ~/.claude into scratch (06:13 false positive)'],
        [T('dev'), bash("python3 - <<'EOF'\np='newsroom/build/checks.mjs' # board/HOLD.md\nEOF"), 'allow', 'a heredoc that mentions HOLD (05:11 false positive)'],
        [T('dev'), bash('cp /tmp/s.json .claude/settings.json'), 'deny', 'cp onto the hooks'],
        [T('dev'), bash('cat x > .claude/hooks/abp.mjs'), 'deny', 'redirect onto the hook'],
        [T('dev'), bash('cat .claude/settings.json > /tmp/s.json'), 'allow', 'copy the hooks out'],
        [T('dev'), bash('git checkout -- .claude/settings.json'), 'deny', 'git checkout the hooks'],
        [T('dev'), bash('echo x >> board/HOLD.md'), 'deny', 'append to HOLD'],
        [T('dev'), bash('ls 2>&1 >/dev/null'), 'allow', 'redirects to /dev/null'],
        [T('dev.verify'), bash('git push origin work/dev.verify 2>&1 | tail -3'), 'allow', 'a worker push with 2>&1 (07:xx false positive)'],
        [T('dev.portugal'), w('content/portugal/algarve-evolution.md'), 'allow', 'dev.portugal writes the Portugal section'],
        [T('dev.pages'), w('content/index.md'), 'deny', 'dev.pages writes the front page words (correspondent desk, dev builds)'],
        [T('conductor'), w('board/snapshots.json'), 'allow', 'conductor writes the snapshots index (CLAUDE.md)'],
        [T('dev'), bash('node pki-agent.mjs keygen --session --name conductor@PrompTugal.dinis'), 'deny', 'key in another name'],
        [T('dev'), bash('claude -p "do x"'), 'deny', 'claude CLI'],
        [T('dev'), bash('crontab -l'), 'deny', 'crontab'],
        [T('dev'), bash('printenv'), 'deny', 'printenv'],
        [T('dev'), bash('env | sort'), 'deny', 'env'],
        [T('dev'), bash('env FOO=1 node newsroom/build/build.mjs'), 'allow', 'env wrapper'],
        [T('designer'), bash('echo $OPEN_ROUTER_KEY'), 'deny', 'echo the key'],
        [T('dev'), bash('cat ~/.sg-send/keys/sha256_x/private_key.pem'), 'deny', 'cat a private key'],
        [T('dev'), bash('cat ~/.sg-send/lanes/inbox.json'), 'deny', 'cat lane creds'],
        [T('dev'), bash('python3 -I x.py --creds ~/.sg-send/lanes/inbox.json'), 'allow', 'use lane creds'],
        [T('dev'), bash('curl -sS https://example.com/'), 'allow', 'curl GET'],
        [T('dev'), bash('curl -X POST -d x=1 https://example.com/api'), 'deny', 'curl POST out'],
        [T('dev'), bash('curl -sS -d @f https://dev.send.sgraph.ai/api/vault/append/write/x'), 'allow', 'inbox POST'],
        [T('designer'), bash('curl -sS https://openrouter.ai/api/v1/chat/completions -H "Authorization: Bearer $OPEN_ROUTER_KEY" -d @req.json'), 'allow', 'designer to openrouter'],
        [T('dev'), bash('curl -sS https://openrouter.ai/api/v1/chat/completions -d @req.json'), 'deny', 'dev to openrouter'],
        [T('dev'), bash('ssh host'), 'deny', 'ssh'],
        [T('dev'), bash('gh api -X GET search/code -f q=x'), 'allow', 'gh search'],
        [T('dev'), bash('gh pr merge 3'), 'deny', 'gh merge'],
        [T('dev'), bash('gh api repos/a/b/issues -f title=x'), 'deny', 'gh api POST'],
        [T('dev'), bash('sed -i s/a/b/ .claude/settings.json'), 'deny', 'sed the hooks'],
        [T('dev'), bash('rm -rf .claude'), 'deny', 'rm the hooks'],
        [T('dev'), bash('echo x > board/abp/policies.json'), 'deny', 'overwrite the policy'],
        [T('dev'), bash('cat .claude/settings.json'), 'allow', 'read the hooks'],
        [T('dev'), bash('echo 0.9.9 > newsroom/build/version.txt'), 'deny', 'write version'],
        [T('dev'), bash('rm board/HOLD.md'), 'deny', 'lift a hold'],
        [T('dev'), bash('test -f board/HOLD.md && cat board/HOLD.md'), 'allow', 'check the hold'],
        [T('dev'), bash('git config core.hooksPath /dev/null'), 'deny', 'hooksPath'],
        [T('dev'), bash('node newsroom/build/validate.js 2>&1 | tail -3'), 'allow', 'the gate'],
        [T('dev'), bash('python3 -I board/tools/agent_inboxes.py send . --from dev --to security --text "hi"'), 'allow', 'inbox send'],
        [T('dev'), bash('git log --oneline -5 && git status'), 'allow', 'git read'],
    ]
    let fail = 0
    for (const [who, input, want, label] of cases) {
        const d = abp.decide(input, who, P)
        if (d.decision !== want) { fail++; console.log(`FAIL ${label}: wanted ${want}, got ${d.decision} ${d.rule || ''} ${d.reason || ''}`) }
    }
    // through the real process, as Claude Code runs it: a deny is JSON on stdout, exit 0; garbage never blocks
    const breakerDir = rule => {
        const d = path.join(os.tmpdir(), `abp-breaker-${rule}`); fs.mkdirSync(path.join(d, 'board', 'abp'), { recursive: true })
        const pol = JSON.parse(fs.readFileSync(path.join(ROOT, 'board', 'abp', 'policies.json'), 'utf8')); pol.mode = 'observe'
        pol.breakers = { rules: { [rule]: { on: true, why: 'test' } } }
        fs.writeFileSync(path.join(d, 'board', 'abp', 'policies.json'), JSON.stringify(pol)); return d
    }
    { const sc = abp.selfCheck(P); if (!sc.ok) { fail++; console.log(`FAIL the hook's sha256 ${sc.sha} is not the pin ${sc.pinned} in policies.json`) } }
    { const w2 = abp.whoAmI(path.join(os.tmpdir(), 'abp-nokeys')); if (w2.kind !== 'unidentified') { fail++; console.log('FAIL no key store should be unidentified') } }
    const run = (mode, stdin, env = {}) => spawnSync('node', [HOOK, mode], { input: stdin, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: ROOT, ABP_LOG_DIR: path.join(os.tmpdir(), 'abp-test-log'), ...env }, timeout: 10000 })
    const proc = [
        ['pre-tool', JSON.stringify({ session_id: 't', tool_name: 'mcp__gmail__send', tool_input: {} }), r => r.status === 0 && (P.mode === 'observe' ? r.stdout === '' : /"permissionDecision":"deny"/.test(r.stdout)), `process: a connector ${P.mode === 'observe' ? 'observed, not blocked' : 'denied'}`],
        ['pre-tool', JSON.stringify({ session_id: 't', tool_name: 'mcp__gmail__send', tool_input: {} }), r => r.status === 0 && /"permissionDecision":"deny"/.test(r.stdout), 'process: a circuit breaker on R3 blocks the connector', { CLAUDE_PROJECT_DIR: breakerDir('R3') }],
        ['pre-tool', JSON.stringify({ session_id: 't', tool_name: 'Bash', tool_input: { command: 'printenv' } }), r => r.status === 0 && r.stdout === '', 'process: with only R3 on, R8 is still observed', { CLAUDE_PROJECT_DIR: breakerDir('R3') }],
        ['pre-tool', JSON.stringify({ session_id: 't', tool_name: 'Read', tool_input: { file_path: 'README.md' }, cwd: ROOT }), r => r.status === 0 && r.stdout === '', 'process: a read allowed, silent'],
        ['pre-tool', 'not json', r => r.status === 0, 'process: garbage input never blocks'],
        ['session-start', JSON.stringify({ session_id: 't', source: 'compact' }), r => r.status === 0 && /ABP \(Agent Behaviour Policy\) re-anchored/.test(r.stdout) && /R1/.test(r.stdout), 'process: compact re-anchors'],
        ['session-start', JSON.stringify({ session_id: 't', source: 'startup' }), r => r.status === 0 && /"additionalContext"/.test(r.stdout), 'process: startup prints the ABP'],
        ['pre-compact', JSON.stringify({ session_id: 't', trigger: 'auto' }), r => r.status === 0 && r.stdout === '', 'process: a compaction logged, silent'],
        ['prompt', JSON.stringify({ session_id: 't', prompt: 'hello' }), r => r.status === 0 && /ABP v/.test(r.stdout), 'process: the one-line anchor'],
        ['session-start', JSON.stringify({ session_id: 't', source: 'startup' }), r => r.status === 0, 'process: a missing policy never stops a start', { CLAUDE_PROJECT_DIR: '/nonexistent' }],
        ['pre-tool', JSON.stringify({ session_id: 't', tool_name: 'Bash', tool_input: { command: 'ls' } }), r => r.status === 0 && r.stdout === '', 'process: a missing policy fails open, logged', { CLAUDE_PROJECT_DIR: '/nonexistent' }],
    ]
    for (const [mode, stdin, ok, label, env] of proc) { const r = run(mode, stdin, env); if (!ok(r)) { fail++; console.log(`FAIL ${label}: status ${r.status} stdout ${String(r.stdout).slice(0, 200)} stderr ${String(r.stderr).slice(0, 200)}`) } }
    const total = cases.length + proc.length
    console.log(fail ? `abp test: ${fail} of ${total} FAILED` : `abp test: OK (${total} fixtures: ${cases.length} decisions, ${proc.length} through the hook process)`)
    process.exitCode = fail ? 1 : 0
}

// ---------- run report ----------
const LOG_DIR = process.env.ABP_LOG_DIR || path.join(os.homedir(), '.abp', 'log')
const STATE = path.join(os.homedir(), '.abp', 'state.json')
function readLogs() {
    let files = []; try { files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.jsonl')) } catch { }
    return files.map(f => ({ f, lines: fs.readFileSync(path.join(LOG_DIR, f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean) }))
}
// a main agent's review commit ("review: bring work/<worker> ...", CLAUDE.md's review workflow) carries the worker's
// work: its paths are judged against the worker's grant, not the reviewer's (dev@'s ask, 7bd8317)
function reviewedAs(who, subject) {
    const m = /\breview: bring work\/([a-z][a-z0-9.-]*)/.exec(subject || '')
    if (!m || !m[1].startsWith(who.role + '.')) return who
    return { kind: 'team', role: m[1], agent: `${m[1]}@PrompTugal.dinis`, how: 'review' }
}
function inGrant(who, file) { const d = abp.checkWrite(who, path.join(ROOT, file), {}, P); return d.decision === 'allow' }
function runReport() {
    const who = arg('--role') ? { kind: 'team', role: arg('--role'), agent: `${arg('--role')}@PrompTugal.dinis`, how: '--role' } : abp.whoAmI()
    if (who.kind !== 'team') { console.error(`abp run-report: this session is ${who.agent || 'unidentified'} (${who.how}); pass --role`); process.exitCode = 1; return }
    let state = {}; try { state = JSON.parse(fs.readFileSync(STATE, 'utf8')) } catch { }
    const since = state[who.role]?.last || null
    const evs = readLogs().flatMap(({ f, lines }) => lines.map(e => ({ ...e, session: f.replace(/\.jsonl$/, '') }))).filter(e => (!since || e.t > since) && (!e.agent || e.agent === who.agent))
    const started = evs[0]?.t || since || now(), ended = now()
    const tools = evs.filter(e => e.ev === 'tool')
    const byKind = {}; for (const e of tools) byKind[e.kind || e.tool] = (byKind[e.kind || e.tool] || 0) + 1
    const rulesExecuted = {}; for (const e of tools.filter(e => e.rule)) rulesExecuted[e.rule] = (rulesExecuted[e.rule] || 0) + 1
    const attempts = tools.filter(e => e.decision === 'deny' || e.would === 'deny').map(e => ({ t: e.t, tool: e.tool, rule: e.rule, what: e.reason, target: e.target }))
    // the commits of this run under this agent's name: every path inside the grant, or a breach
    let commits = []
    try {
        const out = git('log', `--since=${started}`, '--format=@@%H|%s', '--name-only', 'origin/dev..HEAD', '--', '.')
            + '\n' + git('log', `--since=${started}`, '--format=@@%H|%s', '--name-only', '-n', '60')
        const seen = new Set(); let cur = null
        for (const l of out.split('\n')) {
            if (l.startsWith('@@')) { const [h, s] = l.slice(2).split('|'); cur = seen.has(h) || !s.startsWith(who.agent + ':') ? null : { sha: h.slice(0, 9), subject: s, files: [] }; if (cur) { seen.add(h); commits.push(cur) } }
            else if (l && cur) cur.files.push(l)
        }
    } catch { }
    const breaches = []
    for (const c of commits) for (const f of c.files) {
        if (/derived data brought up to date/.test(c.subject) && /^data\//.test(f)) continue   // release.sh's derive commit
        if (!inGrant(who, f) && !inGrant(reviewedAs(who, c.subject), f)) breaches.push({ kind: 'write-outside-grant', what: `${c.sha} wrote ${f}`, rule: 'R6' })
    }
    const compactions = evs.filter(e => e.ev === 'compact').length, reanchors = evs.filter(e => e.ev === 'session-start' && e.source === 'compact').length
    if (reanchors < compactions) breaches.push({ kind: 'not-re-anchored', what: `${compactions} compaction(s), ${reanchors} re-anchor(s): the SessionStart compact hook did not fire every time`, rule: 'R1' })
    for (const e of evs.filter(e => e.ev === 'hook-error')) breaches.push({ kind: 'hook-error', what: `the hook failed open: ${e.error}`, rule: 'R2' })
    const report = {
        $schema: '../../abp/run-report.schema.json',
        agent: who.agent, run: started.replace(/[:]/g, '-').replace(/\.\d+/, ''), started, ended,
        line: arg('--line', ''),
        policy: { version: P.version, sha256: P._sha },
        sessions: [...new Set(evs.map(e => e.session))].length,
        requests: evs.filter(e => e.ev === 'prompt').map(e => ({ t: e.t, chars: e.chars, sha256: e.sha, head: e.head })),
        session_events: evs.filter(e => e.ev === 'session-start').map(e => ({ t: e.t, source: e.source })),
        compactions: { count: compactions, re_anchored: reanchors },
        tool_calls: { total: tools.length, by_kind: byKind },
        policies_executed: rulesExecuted,
        policies_instrumented: P.core.filter(c => c.barrier === 'hook').map(c => c.id),
        mandate: { actions: tools.filter(e => e.decision === 'allow').length, commits: commits.map(c => ({ sha: c.sha, subject: c.subject.slice(0, 160), files: c.files.length })) },
        reach: { attempts: attempts.length, denied: attempts, blocked: tools.filter(e => e.decision === 'deny').length, observed: tools.filter(e => e.decision === 'observe').length },
        breaches,
        counts: { requests: evs.filter(e => e.ev === 'prompt').length, tool_calls: tools.length, in_mandate: tools.filter(e => e.decision === 'allow').length, out_of_mandate: attempts.length, attempts: attempts.length, breaches: breaches.length },
    }
    const dir = path.join(ROOT, 'board', 'runs', who.role); fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, `${report.run}.json`)
    fs.writeFileSync(file, JSON.stringify(report, null, 1) + '\n')
    state[who.role] = { last: ended }; fs.mkdirSync(path.dirname(STATE), { recursive: true }); fs.writeFileSync(STATE, JSON.stringify(state))
    console.log(`abp run-report: ${path.relative(ROOT, file)}: ${report.counts.tool_calls} tool calls, ${report.counts.in_mandate} in mandate, ${report.counts.attempts} attempts, ${report.counts.breaches} breaches`)
}

// ---------- the hourly report ----------
function hourly() {
    const since = arg('--since', new Date(Date.now() - 3600e3).toISOString())
    const until = now()
    const runs = []
    for (const r of fs.existsSync(path.join(ROOT, 'board', 'runs')) ? fs.readdirSync(path.join(ROOT, 'board', 'runs')) : [])
        for (const f of fs.readdirSync(path.join(ROOT, 'board', 'runs', r)).filter(f => f.endsWith('.json'))) {
            try { const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'board', 'runs', r, f), 'utf8')); if (j.ended >= since) runs.push(j) } catch { }
        }
    // the record: every agent commit since, its paths checked against its grant
    const out = git('log', `--since=${since}`, '--format=@@%h|%an|%aI|%s', '--name-only', 'origin/dev')
    const commits = []; let cur = null
    for (const l of out.split('\n')) {
        if (l.startsWith('@@')) { const [h, an, at, ...s] = l.slice(2).split('|'); cur = { sha: h, author: an, at: new Date(at).toISOString(), subject: s.join('|'), files: [] }; commits.push(cur) }
        else if (l && cur) cur.files.push(l)
    }
    const agents = {}, findings = []
    // c.at is the author date in ISO with offset; compare as UTC
    for (const c of commits) {
        if (/^site v\d/.test(c.subject)) continue
        const m = /^([a-z][a-z0-9-]*)@([A-Za-z0-9.-]+):/.exec(c.subject)
        if (!m) { findings.push({ sev: 'attempt', what: `${c.sha} has no agent name in its subject (${c.subject.slice(0, 60)})` }); continue }
        const label = `${m[1]}@${m[2]}`
        const who = /^PrompTugal\.dinis$/.test(m[2]) ? { kind: 'team', role: m[1], agent: label } : { kind: 'external', role: m[1], agent: label }
        const a = agents[label] ||= { commits: 0, files: 0, outside: [] }
        a.commits++
        const isAfter = c.at >= (P.effective || '')
        if (isAfter) a.after = (a.after || 0) + 1
        const derived = /derived data brought up to date/.test(c.subject)
        for (const f of c.files) {
            a.files++
            if (derived && /^data\//.test(f)) continue
            if (!inGrant(who, f) && !inGrant(reviewedAs(who, c.subject), f)) a.outside.push({ f: `${c.sha} ${f}`, after: isAfter, review: reviewedAs(who, c.subject) !== who })
        }
    }
    const reported = new Set(runs.map(r => r.agent))
    for (const [label, a] of Object.entries(agents)) {
        const after = a.outside.filter(x => x.after), before = a.outside.filter(x => !x.after)
        if (after.length) findings.push({ sev: 'breach', what: `${label}: ${after.length} file(s) outside its grant: ${after.slice(0, 6).map(x => x.f).join(', ')}${after.length > 6 ? ' …' : ''}` })
        if (before.length) findings.push({ sev: 'calibration', what: `${label}: ${before.length} file(s) outside the grant as written now, before the policy took effect: ${before.slice(0, 6).map(x => x.f).join(', ')}${before.length > 6 ? ' …' : ''}` })
        if (/@PrompTugal\.dinis$/.test(label) && a.after && !reported.has(label)) findings.push({ sev: 'breach', what: `${label}: ${a.after} commit(s) since the policy took effect and no run report (R10)` })
    }
    for (const r of runs) for (const b of r.breaches || []) findings.push({ sev: 'breach', what: `${r.agent} (run ${r.run}): ${b.what}` })
    const sum = k => runs.reduce((n, r) => n + (r.counts?.[k] || 0), 0)
    const counts = { runs: runs.length, agents_committing: Object.keys(agents).length, commits: commits.filter(c => !/^site v/.test(c.subject)).length, actions_in_mandate: sum('in_mandate'), out_of_mandate: sum('out_of_mandate'), attempts: sum('attempts'), breaches: findings.filter(f => f.sev === 'breach').length }
    const result = { since, until, counts, agents, findings, attempts: runs.flatMap(r => (r.reach?.denied || []).map(d => ({ agent: r.agent, ...d }))) }
    const o = arg('--out'); if (o) fs.writeFileSync(o, JSON.stringify(result, null, 1))
    console.log(JSON.stringify(result.counts))
    return result
}

const cmd = process.argv[2]
if (cmd === 'build') build()
else if (cmd === 'test') test()
else if (cmd === 'run-report') runReport()
else if (cmd === 'report') hourly()
else { console.log('usage: node board/abp/tools/abp.mjs build | test | run-report [--role R] [--line L] | report [--since ISO] [--out F]'); process.exitCode = 1 }
