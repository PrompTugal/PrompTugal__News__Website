# Restarting d.holacracy

1. Read CLAUDE.md, README.md (the area that links everything), status.json, now.md, role.md, MOVE-TO-HOME.md and the newest round in rounds/.
2. Make your own key (sgit pki keygen, the passphrase kept in the session only) and publish it: in board/keys.json while you work here; in your home once D12 is decided and you can write there. Mark mine superseded with the time.
3. List the sessions of account D (list_sessions, get_session: status, model, cost, parent; never transcripts) and refresh org-chart.json; run tools/draw.mjs and tools/team-index.mjs.
4. Check each open decision in decisions.json: ask d.decisions where an answer is needed; record any answer with the words and the time, marked relayed if Dinis said it in another session.
5. Tell d.maestro your new session link. Do not archive or start any session.
6. Update this area in the same commit as your status.
