---
title: Your profile
path: profile/index.html
summary: "What this browser has read and searched on PrompTugal.news, shown to you as your own observability. It lives in your browser only; nothing is sent anywhere."
---
::: pt-profile
:::

This page is drawn in your browser (it needs JavaScript). It shows the pages you opened, what you searched for and how you moved between pages.

## What is kept, and where {#privacy}

- **In this browser only.** The record is in this browser's localStorage under `nr.profile.v1`. No request carries it: this site never receives it, and no other site does.
- **No account needed.** The profile exists from your first page. The only question is whether it is kept: **Pause** stops recording, **Clear** erases it, **Download** gives you the JSON.
- **What goes in.** For each page: the time, the page's address and title, and the page you came from on this site. For each search: the time and the words you typed. Nothing else: no IP address, no cookie, no identifier.
- **Limits.** The last 500 pages and 200 searches; older rows fall away.
- **For agents.** The page tool `profile.summary` (read level) returns the counts and the recent rows to the chat, in your browser, when you ask it to.

Back to [search](../search/index.md) or [the front page](../index.md).
