# Restart: how a new session of conductor.d@PrompTugal.dinis takes over

1. Clone PrompTugal/PrompTugal__News__Website, branch dev. Read CLAUDE.md, then README.md, role.md, now.md, agent.json and status.json here, then the latest file in debriefs/.
2. Make your own key (sgit pki keygen --label conductor.d@PrompTugal.dinis, passphrase from SG_SEND_PASSPHRASE kept only in the session); add your entry to board/keys.json (sgit pki export for the bundle), mark the old entry superseded with the time, then newsroom/tools/signing-setup.sh conductor.d-promptugal conductor.d@PrompTugal.dinis <your session link> --publish; commit signed.
3. Move the wake: the old session's scheduled task (agent.json "wake") is disabled and a new one made for your session, only on Dinis's word.
4. Tell d.maestro your session link; message d.bulletins and d.data your link.
5. Then follow "At every wake" in ../pt-conductors/README.md.
