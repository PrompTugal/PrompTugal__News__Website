# AWS Marketplace listings for the summit's 17 non-Google partner companies

By researcher@PrompTugal.dinis (account B session), read 7 November 2026 (UTC, about 01:20) in a headless browser on the public AWS Marketplace search (aws.amazon.com/marketplace/search/results?searchTerms="<name>"), no sign-in. Method: a search for the exact company name; I looked at the first results only, and counted a listing as the company's own when the page says "By <that company or its unit>". The search is fuzzy and I did not open each listing: a "no own listing seen" is not proof of none. A marketplace listing shows the company sells there; it is not by itself a partnership statement. Continues batches 1 and 2 (the front-page reads).

| Company | First results on AWS Marketplace | Reading |
|---|---|---|
| 1Password | "1Password Enterprise Password Manager - Business", By 1Password, AWS Specializations, Deployed on AWS; 94 results for the name | own listing, with an AWS Specialization badge |
| Akamai | "Akamai API Security", "App and API Protector Hybrid [BYOL]", both By Akamai, Deployed on AWS; 44 results | own listings |
| Cerebras | "Cerebras Fast Inference Cloud", By Cerebras Systems Inc.; 7 results | own listing (fits batch 1: AWS testimonial) |
| Cisco Outshift | "Cisco Secure Firewall ASA Virtual", By Cisco Systems, Inc., Deployed on AWS; 489 results | Cisco sells there; nothing specific to Outshift seen |
| Datadog | "Datadog Pro (Pay-As-You-Go with 14-day Free Trial)", By Datadog, Deployed on AWS Quick Launch; about 1,000 results | own listing |
| Delinea | "Delinea" By Multipoint Group, "Delinea Implementation Services" By Tec360; 8 results | resold or serviced by partners; no Delinea-published listing among the first results |
| Elastic | "Elastic Cloud (Elasticsearch Service)", By Elastic, AWS Specializations, Deployed on AWS, free trial | own listing |
| Firefox Enterprise (Mozilla) | Searched "Mozilla": nothing by Mozilla among the first results (third-party machine images) | no own listing seen |
| Gcore | Searched "Gcore": results by other sellers (Bright Data, BYNET for Akamai); none by Gcore | no own listing seen |
| Genspark | Results by other sellers only | no own listing seen |
| IBM | "IBM MQ and IBM MQ Advanced (software)", By IBM Software, AWS Specializations; 706 results | own listings |
| KPMG | Results by other sellers (Bright Data, Mphasis); none by KPMG | no own listing seen (its stated alliance is with Microsoft: batch 2) |
| ManageEngine | "ManageEngine OpManager BYOL", By ZOHO Corporation, Deployed on AWS; 340 results | own listings under the parent company Zoho Corporation |
| PitchBook | Results by other sellers only | no own listing seen |
| Runpod | "Runpod Hybrid Cloud", By Runpod, Deployed on AWS; 16 results | own listing (batch 1 saw a customer comparing Runpod to AWS: both can be true) |
| Twilio | "Twilio Segment", By Twilio Segment, AWS Specializations; 845 results | own listing, with a badge |
| VTEX | "VTEX Commerce Suite Enterprise (Global)" and "(US)", By VTEX, AWS Specializations | own listings, with a badge |

## What it shows
- Nine of the 17 have a listing of their own on AWS Marketplace in the first results (1Password, Akamai, Cerebras, Datadog, Elastic, IBM, Runpod, Twilio, VTEX), plus Cisco and ManageEngine under their parent names (Cisco Systems, Zoho Corporation). Delinea is there through partners. Mozilla, Gcore, Genspark, KPMG and PitchBook showed none in the first results.
- Lesson for the lens: batch 1 found "nothing" on the Twilio and VTEX front pages, yet both sell on AWS Marketplace and hold AWS Specializations. A company's own front page understates its cloud ties; the marketplace is the better first source. The same should be tried on the Microsoft and Google Cloud marketplaces.
- Google Cloud's partner finder renders nothing without script, and Microsoft's marketplace answered 403 to a plain fetch in this session; both are next, by a browser read where the site allows it, never by getting round a refusal.
- Edge kinds for the graph, as the earlier batches proposed: "sells on AWS Marketplace" (marketplace listing), "holds an AWS Specialization" (badge on the listing).

## Google Cloud and Microsoft: tried again, 7 November 2026 (about 13:20 UTC), and closed
- **Google Cloud partner finder** (cloud.google.com/find-a-partner, a partner's page and a name search): loads, but shows no text to a browser without sign-in or interaction I can do within my rules (the page body is empty after seven seconds). Not readable by me.
- **Microsoft marketplace and partner directory**: the site shows "One moment, we're checking you're not a bot" and answers 403 to a plain fetch. That is a refusal of automated readers; I do not get round it.
- **Decision:** I stop trying these two directories. The AWS Marketplace result stands alone as marketplace evidence; for Google Cloud and Microsoft the usable sources are each company's own pages (batches 1 and 2), the organiser's own lists (past-summits rounds) and press statements. If Dinis wants the directories, the way is an official partner or marketplace data feed or API, which needs a decision on credentials and terms: not something for this role to arrange.
