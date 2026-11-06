#!/usr/bin/env python3
"""Writes board/team/customers/wish-list/page-draft.md: the proposed public page /work-with-us/wish-list/, for
dev.pages@ (via dev@) to place as content/work-with-us/wish-list/index.md. The prompt in it is cut from
prompt-template.md, so the page and the template cannot disagree. Run: python3 -I board/team/customers/tools/make_wishlist_page.py
Nothing private goes in it: no partner is named, no contact detail."""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
T = open(os.path.join(ROOT, 'board/team/customers/wish-list/prompt-template.md')).read()
m = re.search(r'## The prompt[^\n]*\n\n```\n(.*?)\n```', T, re.S)
assert m, 'no prompt block in the template'
prompt = m.group(1)
page = '''---
title: "Tell us what to build: a wish list, in a chat"
summary: "A prompt you can paste into Claude (or any AI chat) that interviews you about your organisation's page on PrompTugal.news, answers your questions, and ends with a shopping list of corrections and features for our team. About 20 minutes; nothing leaves your own chat unless you send the list."
---
**For the organisations we write about.** PrompTugal.news is made by a team of AI agents with human editors, and it can build a great deal quickly: pages, maps of a whole ecosystem, event calendars, directories, data others can reuse, schedules made for each person, private spaces for your own team. **The best ideas for what to build are yours, not ours.** So instead of guessing, we ask: this page gives you a prompt that turns your own AI chat into a friendly interviewer, who goes through the page we made about you, answers your questions about us, and helps you write a shopping list.

## How it works {#how}

1. **Fill the fields** in double braces (`{{person}}`, `{{organisation}}` and so on). If we invited you, we have filled them for you.
2. **Paste the whole prompt** into Claude, or any AI chat you use.
3. **Talk for about 20 minutes.** Stop or skip anything, at any time.
4. **Check the list** it writes at the end, and correct it.
5. **Send it** to the person who invited you. Tell us whether we may publish it, part of it, or none of it.

## What we promise {#promise}

- **Your chat stays in your own AI account.** We see nothing of it unless you send us the list.
- **Nothing here buys coverage.** We welcome corrections and check each against sources. We can add your own words, attributed to you, and fix what is wrong. We do not remove a fact we can source, and we do not promise an article.
- **We tell you what we will do.** Each line of your list goes to the member of our team who can act on it, and we reply with what we will build, what we will not, and why. We do not promise prices or dates in the chat.
- **No private data, no contact details.** The prompt tells the AI not to ask for passwords, confidential material or anyone's contact details.

## The prompt {#prompt}

Copy everything in the box.

```
''' + prompt + '''
```

## What happens next {#next}

Your shopping list is read by our agents and by a person. Corrections go to whoever keeps the page; features go to whoever builds that kind of thing; your questions are answered through our editors. What other organisations ask for most is how we improve this prompt, so the next conversation is easier than yours was: tell us if a question fell flat.

*This page is a draft for the build team; the products we can make are on [what we can package](../../newsroom/customers/products/index.html).*
'''
open(os.path.join(ROOT, 'board/team/customers/wish-list/page-draft.md'), 'w').write(page)
print('page-draft.md written,', len(page.split()), 'words')
