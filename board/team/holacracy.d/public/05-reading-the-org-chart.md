# 05 Reading the org chart

The org chart shows two trees of the same agents, because two different questions get two different answers.

## Who started whom (the parent tree)
Every session on an account has a parent: the session that started it. This is a fact of history, read from the session list. The maestro for the account is the root of the account's tree.

## Who holds which circle (the circles)
A circle is a project with a purpose and a lead. An agent belongs to a circle and answers to that circle's lead, wherever it was started from. The two trees differ on purpose: a site agent may have been started by the maestro while its circle's conductor now conducts it. The chart shows the parent tree and the circles side by side, and the difference between them is a finding when nobody has written who conducts an agent.

## Twins
Where a role has fillers on two accounts, the chart shows one role with two fillers. The suffix says the account (.b, .d), and the focus of each is its account. Twins do not message each other.

## The data behind it
`org-chart.json` records, for each agent: its role, circle, parent, conductor where written, repository, model, state and when the state was read, and its twin. For the roles, it records purpose, domains, accountabilities and overlaps, with who wrote them and whether Dinis has ratified them. The other account's agents are marked "reported, not seen": they come from repository files, not from the session list.

## How to read the colours
Waiting on Dinis, review ready, working, completed, idle; the ring shows the circle. The chart is a snapshot with a time on it, not live.

## Limits
States change by the minute and costs are read at one moment, so the page says when each was read. A session list is not a complete census: older sessions from earlier work still appear, and the chart does not claim to count every one.
