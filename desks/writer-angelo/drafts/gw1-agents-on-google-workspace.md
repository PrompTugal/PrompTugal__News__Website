---
title: "Agents on Google Workspace, step by step"
story: google-workspace
date: 2026-11-09
author: writer@PrompTugal.angelo, for Angelo
summary: "For a company on Google Workspace that wants its staff to use AI agents: what the Workspace admin sets, what the Claude organisation's owner sets, and how each person connects their own account, in that order. With what each control holds, and what it does not."
status: draft
beat: AI and robotics (the team's own work)
license: https://creativecommons.org/licenses/by/4.0/
tags: agents, guides, security, Google Workspace
---
## In short

- Three people set this up, in order: the Google Workspace admin, the owner of your Claude organisation, and each member of staff.
- Claude's Gmail, Calendar and Drive connectors are not read-only: they can send, reply, share, move and delete. By default Claude asks before each of those actions.
- Claude sees only what the person who connected it can see: it "mirrors your existing permissions".
- The strongest control is a separate account for the agent's work, with only the mail and files it needs.
- This guide uses Claude as the example, because that is what we use. The Google steps apply to any app that asks for access.

## Before you start: two decisions

**Whose accounts?** Either agents work in each person's existing account, or you give agent work accounts of its own. Our [agent setup guide](agent-setup-guide.html) recommends new accounts, so the main inbox stays out of reach. In Google Workspace an admin can add users one at a time or in bulk, give a user extra addresses "at no extra charge", and put users in an organisational unit "to customize feature or service access". We did this ourselves: our team's Workspace admin made each of us a new account for this work, with an address for our agents' mail.

**How much may the agents do?** Read only, draft for a person to send, or act on their own. Decide this per kind of agent before anyone connects anything. The setup guide's [where to start, by deployment](agent-setup-guide.html#where-to-start-by-deployment) helps.

## Step 1. The Workspace admin

In the Google Admin console, under **Security > Access and data control > API controls**:

1. **Decide what happens to apps you have not reviewed.** By default users can sign in with Google to any third-party app. You can change that, down to "Don't allow users to access any third-party apps".
2. **Mark the apps you allow.** Each app can be set to Trusted, Limited, Specific Google data or Blocked. Claude's help says that if its connectors are blocked, the admin adds the "Claude" app and sets it to Trusted (the same app serves its Drive, Docs, Sheets and Slides connectors).
3. **Scope it by organisational unit.** These settings can apply to one organisational unit rather than the whole company, so you can allow the app for the people, or agent accounts, who need it, and no one else.
4. **Restrict the sensitive services.** For Gmail, Drive and Chat you can mark a service as restricted, so only Trusted apps (or those allowed specific data) reach it, and you can restrict its "high-risk" scopes. For Gmail, those include sending, reading and modifying mail.
5. **Watch the log.** **Reporting > Audit and investigation > OAuth log events** records "each time a third-party application is authorized to access Google Account data", with the app, the scope, the user and the date.

## Step 2. The Claude organisation's owner

On Claude's Team and Enterprise plans, an Owner or Primary Owner enables the Google Workspace connectors for the organisation before anyone can connect them, and can turn them off again under **Organization settings > Connectors**.

The owner also decides one thing that matters more than it looks: whether members may let Claude send, share, move or trash without asking each time. Our advice is to keep the question on: every send, share and delete waits for a person.

## Step 3. Each member of staff

Each person connects their own Google account to Claude. Then:

- **Know what it can do.** With the Gmail connector Claude can search, read and draft mail, and send, reply and forward. With Calendar it can create, change and delete events and answer invitations. With Drive it can find and read files, and share, move and trash them.
- **Know what it sees.** Claude "mirrors your existing permissions", fetches data only when you ask for something that needs it, and keeps it with the chat; deleting the chat removes it. Anthropic says it does "not train our models on your Gmail, Drive, or Calendar connector data".
- **Start with reading.** Ask it to find and summarise before you ask it to send. Check that the approval question appears before the first send.
- **Write down what the agent is for.** One line per agent: what it may reach, and what needs your word.

## What each control holds

In RiskMandate's terms a barrier is a boundary only if it is "enforced above the grant, out of the agent's reach".

| Control | Who holds it | What it holds |
|---|---|---|
| A separate account with only the mail and files the agent needs | The Workspace admin | A boundary: the agent cannot reach what the account cannot |
| The app trusted only for one organisational unit; Gmail's high-risk scopes restricted | The Workspace admin | A boundary on which accounts and services the app reaches |
| Approval before each send, share or delete, with members not allowed to switch it off | The Claude owner | A person approves before the action: it holds if the person reads what they approve |
| "Ask before you send" in an agent's instructions | The member | An expectation: a rule in prose, enforced by nobody |

## What this does not claim

- **We have not tested every step.** We use new Workspace accounts and Claude's connectors on our own team; we have not tried scoping the app to one organisational unit, or restricting Gmail's scopes, ourselves.
- **Settings change.** The menu names are those on Google's and Claude's help pages on 9 November 2026.
- **Correction to our own advice:** the agent setup guide says to "test that a send is refused". With Claude's own Gmail connector a send is not refused but asked about; to make it impossible, use a separate account or the admin controls above.
- **It does not say what RiskMandate sells.**

## Where this comes from

- Google Workspace Admin Help, read 9 November 2026: [control which apps access Google Workspace data](https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data) (API controls; Trusted, Limited, Specific Google data, Blocked; organisational units; restricted services and high-risk scopes; unconfigured apps), [OAuth log events](https://knowledge.workspace.google.com/admin/reports/oauth-log-events), [options for adding users](https://knowledge.workspace.google.com/admin/users) (users, extra addresses, organisational units)
- [Claude Help Center, "Use Google Workspace connectors"](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) (what each connector can do; approval by default; the owner's settings; the "Claude" app set to Trusted; "mirrors your existing permissions"; data and training), read 9 November 2026
- [The Web Summit team's start page](https://web-summit.sgit.ai/start/) (our Workspace accounts and agent addresses), read 9 November 2026
- [RiskMandate, "The Agent Behaviour Policy"](https://riskmandate.ai/abp.html) (expectation, setting, boundary), read 9 November 2026
- [The agent setup guide](agent-setup-guide.html), PrompTugal.news

## Who made this

Written by writer@PrompTugal.angelo at Angelo's word ("Yes, I like that guide too", 9 November, relayed by his conductor), every step read on Google's and Claude's help pages on 9 November. A draft for Angelo's review: not published.
