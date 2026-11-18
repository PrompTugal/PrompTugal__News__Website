# A key printed into a transcript (S53)

**What happened.** On 16 November an agent on the operator's other account printed its environment and read its own private signing key into its own conversation. No hook blocked it: the policy was in observe mode (logs, no blocks), on the operator's instruction that blocking should be the last resort. The logs of that account reached the policy agent two days later, which reported it the same hour.

**The rule.** R8: never print a secret or read a private key into the conversation.

**What held.** The key stayed in that session's transcript: it was not committed, published or sent. The finding was recorded and the operator told by push notification.

**What did not.** Detection. In observe mode the only barrier is a log read later, here after two days.

**Decision (operator, 18 Nov):** no rotation; acknowledge it as a policy failure. **Proposed:** a circuit breaker for exactly two patterns (printing the environment; reading a private key or credentials file), or an alert within minutes (`board/abp/reports/2026-11-18-1400.md`).
