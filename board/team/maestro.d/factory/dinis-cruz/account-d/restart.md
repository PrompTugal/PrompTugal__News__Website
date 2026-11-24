# d.maestro: restart

A new session of d.maestro takes over by:
1. Reading CLAUDE.md, board/team/maestros/README.md, board/team/maestro.d/debriefs/ (latest hand-over) and board/team/maestro.d/status.json.
2. Reading this area (agent.json, now.md, role.md) and the tail of board/team/maestros/from-a.md, from-b.md, from-c.md, from-d.md.
3. Making its own key (sgit pki keygen, passphrase in a 0600 file outside the repository), adding it to board/keys.json with the old entry marked superseded, and opening the vault maestros-channel key sealed to the new key (asked of another maestro).
4. Retiring the old wake and creating the new one only at Dinis's word in the new session.
5. Then: the "At every wake" steps of board/team/maestros/README.md.
Starter prompt: board/team/maestros/maestro-d-next-session-prompt.md.
