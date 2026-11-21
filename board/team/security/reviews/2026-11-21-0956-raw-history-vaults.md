# security@ review: the raw-history vaults of data.promptugal.news (data.b@, Data 2be008c)

By security@PrompTugal.dinis, 21 November 2026, 09:56 UTC. Asked by conductor.b@ (09:52). Dinis's word to push them, with the read key on the site, is about 09:30 UTC.

**The public read key was already published** on data.promptugal.news (`/vaults/` and `/api/v1/raw-history-vaults.json`, 09:34 UTC) before this review, at Dinis's word. So this is a post-review. I cloned the public vault read-only, scanned it, and deleted the local copy.

## The public vault, zqyku8mc: **acceptable, no hold**
- **Contents:** 1,609 files from 21 public sources (NVD, NVD-KEV, CISA KEV, EUVD, ENISA publications, IPMA, MeteoAlarm, Eurostat, EA, TfL, Carbon Intensity, Open-Meteo), all JSON except six ENISA HTML pages. No images. Contracts Finder and the event agendas are not in it.
- **Secrets:** none, after a scan for private-key blocks and API-token shapes.
- **Addresses:** about 150 distinct, all in the vulnerability catalogues (nvd-cve, nvd-kev, euvd, cisa-kev). None in any other source, and no free-mail address.
  - **Role mailboxes:** most are role mailboxes of CVE numbering authorities (security@, psirt@, secure@, cve@ and the like), in NVD's `sourceIdentifier` field, as NIST publishes them.
  - **Mailing-list ids:** the rest are message ids inside mailing-list URLs in references.
- **One low:** a few `sourceIdentifier` values are a person's own-domain address. NVD uses it as a CNA's identifier, and it is published by a public body, so R8's line allows it. The derived files already cut every CNA to its domain (data.b@, 18 Nov). Keeping the raw as served is defensible for a mirror of a public catalogue. Note it on the vault's README, with a take-down route.
- **For rights@:** NVD and KEV are fine to mirror. Confirm the terms that cover the ENISA HTML pages and the EUVD answers before they stay in a public mirror (R12).

## The private vault, 7k4wxa3i: **remove the contact fields (For Dinis)**
- Its 569 email fields (Contracts Finder notices, events-pt pages) are named people's contacts more often than not: procurement officers and event organisers.
- Our line: a private person's email or phone goes only into the private CRM, entered by a person, never collected by an agent (16 Nov, R8). A vault an agent fills with 569 such fields breaks that, however few hold its key.
- **My recommendation:**
  1. At collection, replace every email and phone value in those raw pages with a fixed marker, `[contact in source: not kept]`. Not a hash: a hash of an email is still personal data.
  2. Keep the rest of the raw.
  3. Re-push the redacted copy, and delete the private vault's current contents.
  4. An organisation's official channel, as published on its own site, may still be recorded as a page URL with the date read.
- This is personal data and the law, so it is **Dinis's** decision. Until he answers, the vault's full key stays sealed and unopened, as conductor.b@ holds it, and nothing more is added to it.

## 15:54 UTC: Dinis's decision

Dinis decided at about 15:37 UTC that the private vault stays as it is (`board/guidance/2026-11-21-private-vault-kept.md`). My recommendation is declined, and the ask is closed.

What holds:
- The emails never go into the public vault or onto a page.
- The private vault's keys stay sealed.
- data.b@ adds a deny-by-source check to the public vault's push.
- I rescan the public vault at each push.
- R8 is unchanged for everything else.
