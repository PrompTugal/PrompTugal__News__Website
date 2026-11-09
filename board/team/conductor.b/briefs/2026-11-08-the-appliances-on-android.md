---
title: "The two appliances on Android phones and tablets: what it would take"
for: Dinis
written: 2026-11-08T16:30Z by conductor.b@PrompTugal.dinis
asked: "Next can you look at what it would take to also run our two appliances modes on an android phone and tablet" (Dinis, 8 November 2026, about 16:15 UTC)
issue: WS-177
---
# The two appliances on Android: what it would take

**In short:** the *appliance* part (a locked, single-purpose device on the agent's own account) fits Android better than the iPad. The *app* part does not exist on Android at all: today's app is 22,352 lines of Swift with nothing shared. Before the summit, the realistic Android story is the website (promptugal.news and riskmandate.ai) in a locked browser kiosk. A real Android app is a few weeks of work after the summit.

Read from: PrompTugal/PrompTugal__App__iOS at v0.1.59 (dev, 7 Nov 18:06 UTC), and the For Dinis page /newsroom/decisions/the-riskmandate-agent-ipad/. Android facts below come from general platform knowledge, not checked at a source today. Re-check them before anything is promised.

## 1. The appliance part: Android is the easier platform

| | iPad (today's plan) | Android phone or tablet |
|---|---|---|
| One-app lock | Guided Access or Single App Mode (supervised, through Apple Business or Configurator) | **Lock task mode** for a "dedicated device" (Android Enterprise), set at provisioning by a QR code or zero-touch |
| Device account | Apple ID on the agent's Google Workspace email (memo 3) | **The same Google Workspace account signs in natively**, and Workspace's own endpoint management can manage the device. No second identity system. |
| Management | An MDM, Apple Business | Android Management API or Workspace endpoint management; Samsung Knox on Galaxy tablets |
| Installing our app | TestFlight or the App Store, after Apple's review | **Managed Google Play private app** for our own devices, with no public listing. A public Play listing needs a Play Console account (one-off fee, identity verified) and Google's review. |
| Developer mode on the agentic devices (Dinis's rule) | Xcode, a Mac and developer mode | Developer options and adb; apps can be sideloaded and even built on the device (for example in Termux). Easier, and so on a sold device it must stay **off** unless the customer asks. |
| Local model ("let's see if we can make it there") | Apple's on-device models, or a bundled model | Gemini Nano (AICore) on recent Pixel and Galaxy flagships only; or a bundled small model (MediaPipe LLM inference). It depends on the device. |
| Hardware cost | iPad from £429 (Apple UK, read 13:50) | From about £150 to £1,000+, so wider price bands. Check prices before quoting. |

## 2. The app part: a port, not a switch

The iOS app is native SwiftUI with no third-party packages. What each piece needs on Android:

| iOS app feature (lines) | Apple framework used | Android equivalent | Weight |
|---|---|---|---|
| Shell: the website with the sidebar (1,043) and the web bridge (736) | WebKit | Android WebView and a JavaScript interface | small |
| Vault reader SGitVault (2,508), vault unlock, key wrap, device signer (1,526) | CryptoKit, Security (Keychain), CommonCrypto | javax.crypto or Tink (AES-GCM, X25519, P-256, HKDF), Android Keystore. **Must be byte-compatible with the Swift vault and the sgit tools: the risky part, so port the vault package's tests first.** | large |
| Passkey vault unlock (PRF), behind a flag | AuthenticationServices | Credential Manager. PRF support on Android is uneven, so check it per device. | medium, later |
| Biometric unlock | LocalAuthentication | BiometricPrompt | small |
| Lanes, the agents' inboxes (1,793) | CryptoKit | as for the vault | medium |
| Ask and AI with OpenRouter (2,170) | Foundation | OkHttp or Ktor; the key in Keystore | medium |
| Dashboards (2,490) | Swift Charts | Compose charts (for example Vico) | medium |
| Schedule, agenda (1,783), calendar | EventKit | the CalendarContract provider | medium |
| Team, Coordination, News (3,148) | SwiftUI | Jetpack Compose | medium |
| Widgets, Siri intents | WidgetKit, AppIntents | Glance widgets, App Actions and shortcuts | small |
| Reading credit (5 and 20) | StoreKit | Google Play Billing (consumables) | small, plus Play's rules |
| Notifications, background refresh | UserNotifications, BackgroundTasks | notifications, WorkManager | small |
| Voice and scanning (Field Reporter) | Speech, VisionKit, AVFoundation | SpeechRecognizer, ML Kit document scanner, CameraX and Media3 | medium |

**Three ways to build it:**

- **A. A thin Android shell first (recommended).** A Kotlin app that is mostly the WebView shell, plus the vault reader, unlock and lanes in Kotlin, provisioned as a dedicated device in lock task mode. It gives both appliances on Android for most of the value: the RiskMandate Appliance is mostly the RiskMandate pages over a local, isolated vault. About 1 to 2 weeks for one dev with agents, most of it spent on vault compatibility.
- **B. A full native port in Kotlin and Compose.** Every feature above. About 4 to 8 weeks, then a second codebase to keep level with iOS for good.
- **C. A shared core (Kotlin Multiplatform, or the vault in Rust for both).** The vault and lanes are written once and both apps call them. It is the right long-term shape if both platforms stay, but it reworks the iOS app, so not before the summit.

These sizes are my estimate from the line counts, not a dev's. Ask the iOS team's conductor to size A and B properly.

## 3. Each appliance on Android

- **RiskMandate Appliance.** It fits well: a dedicated Android tablet in lock task mode, the agent's Workspace account, the RiskMandate app (way A) with the environment's vault held on the device only. A local model only on devices with AICore, or a bundled small model. Phones work too ("the appliance in your pocket"), which iPads cannot offer.
- **PrompTugal Field Reporter.** It works, with different extras. Final Cut Pro is not on Android, and other editors (for example LumaFusion; Adobe's mobile range has changed) need a check before they are named. Galaxy tablets with DeX and a keyboard are a credible field laptop. Lock task mode should be *off* or allow several apps here, because a reporter needs camera, editor and our app.

## 4. What must be true first, and what is Dinis's

1. **Who builds it.** No Android agent exists. A new session (for example android@ios.PrompTugal.dinis, under the iOS team's conductor) is Dinis's word only (ABP R4).
2. **The Play Console account and who holds it**, as for the Apple account (memo 3): the agent's Workspace account with a person on it. It is Dinis's call, and identity verification is in a person's name.
3. **Whether Android is in the For Dinis page's offer**, and at what price bands (money and the brand are Dinis's). It belongs on /newsroom/decisions/the-riskmandate-agent-ipad/ as a third column, written by customers@ if Dinis says yes.
4. **This week:** nothing sold for Android. At the stand, an Android tablet can show the sites in a browser kiosk (Chrome with lock task mode, or a free kiosk app), with no app.

## What follows each answer

- **"Yes, way A after the summit":** I brief the iOS team's conductor (conductor@ios.PrompTugal.dinis) for an Android lane at your word; customers@ adds Android to the decision page; designer@ the box sleeve for an Android tablet.
- **"Later":** this brief stays as the reference, and the iPad plan goes on unchanged.
- **"Use a shared core (C)":** the iOS team plans the vault and lanes in a shared core first, and Android follows.
