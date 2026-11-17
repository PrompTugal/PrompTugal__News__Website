# One reader across devices, and the personal PrompTugal.news

Dinis, 17 November 2026, morning, in the conductor's session (account A). His words, condensed by the conductor; the full plan is `board/spec-one-reader-across-devices.md`.

- Make the website quite usable and personalised; the iPhone app and the website give one unified experience, the same logic.
- Use vaults and QR codes. Each device (the iPhone app, the website) has a unique identifier, from a passkey if available, otherwise the browser session, and with it a vault for the device. The user has a vault too: in principle one main, default vault (multiple allowed).
- Pairing: one side shows a QR code with its public key and an append lane key. Taking a photo of it is an authorisation moment, "an authorisation moment to start to communicate. It's not even to access any data. It's just to send data". The other side sends its public key through the append lane; the first checks it and sends back, on the lane, the vault key. Either way round. It could even be another account.
- The vault access key needs to be provided once; it can be shared across devices to keep it smooth. Explore several options.
- Personalisation: what's new, what's relevant to me, in the whole country and in my region; register who the user is from the start. The same data can live in local storage (this website only), independent of the vault.
- Billing: people pay to retain their history, the memory across devices; the first vault creation should be smoother; the access key may be paid later.
- "Work with the other agents, because we're already doing a lot of stuff like this."
