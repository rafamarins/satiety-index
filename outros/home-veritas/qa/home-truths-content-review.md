# Home truths content review — 26 October 2026

## Delivered

`home-truths-content.js` provides 5 stages, 15 topics, 45 short cards, 135 practical actions and 26 unique primary/official source links. Each card has a specific gotcha. Topic bridges connect the journey. All 10 existing guide chapters remain reachable through `chapterIds`; the existing 64 deeper questions and resource library are preserved without modification.

The entry layer covers deciding, full costs, deposits and KiwiSaver, lenders and brokers, mortgage structure, neighbourhoods, home and title types, viewings, inspections, property records, consents, hazards, insurance, sale methods, contracts, settlement, maintenance and renovation. It deliberately avoids a readiness score, eligibility decision or current interest-rate claim.

## Source checks

These substantive pages were checked through web retrieval/search on 26 October 2026 (NZ date). A current retrieval is not proof that every programme, fee or property-specific situation is covered.

- [NZ Government: first-home help](https://www.govt.nz/browse/housing-and-property/buying-or-selling-a-home/buying-your-first-home/): confirms the First Home Loan route, current closure of the First Home Grant, and provider-led KiwiSaver withdrawal. The short layer does not promise eligibility.
- [Inland Revenue: KiwiSaver first-home withdrawal](https://www.ird.govt.nz/kiwisaver/kiwisaver-individuals/getting-my-kiwisaver-funds-early/getting-my-kiwisaver-for-my-first-home): confirms three-year membership and exclusions/amount restrictions. Existing deeper guidance retains the $1,000 requirement. The short layer directs the reader to confirm their own available amount.
- [FMA: mortgage advice](https://www.fma.govt.nz/consumer/getting-advice/mortgage-advice/), page dated 14 May 2026: supports lender comparisons, commissions and fees, written quotes, and distinctions between cashback and adviser clawback charges.
- [Settled: buying at auction](https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-auction/): confirms the unconditional nature of an auction purchase and the importance of completing checks before bidding.
- [Settled: purchase agreement](https://www.settled.govt.nz/buying-a-home/making-an-offer/understanding-the-sale-and-purchase-agreement-when-buying/): confirms the binding agreement, legal review, conditions, included items and settlement details.
- [Settled: neighbourhood research](https://www.settled.govt.nz/buying-a-home/researching-the-property/learning-about-the-neighbourhood/): supports visits at different times and checking services, development and planning information.
- [Settled: natural hazards](https://www.settled.govt.nz/buying-a-home/researching-the-property/understanding-the-impact-of-natural-hazards/): supports property-specific research, inspection scope, prior claims and checking cover. No claim that a map or report eliminates risk.
- [MBIE: council records](https://www.building.govt.nz/getting-started/your-rights-and-obligations/homeowner-rights-and-obligations/buying-a-house/what-can-the-council-tell-you-about-the-house): substantive indexed page text checked after intermittent direct-fetch timeouts. Confirms property files, LIM records and limits of information reported to the council.
- [MBIE: consent requirements](https://www.building.govt.nz/projects-and-consents/planning-a-successful-build/scope-and-design/check-if-you-need-consents), page dated 15 January 2026: substantive indexed page text checked after intermittent direct-fetch timeouts. Confirms Code obligations, conditional exemptions, council planning requirements and the need for appropriate experts. The prototype does not attempt to classify a particular project as exempt.

The other links reuse the existing project's source registry, reviewed 25 October 2026. Their relevance was checked against the nearby guide; they were not all independently re-researched for this change. The `reviewedOn` label records this targeted editorial pass, not professional certification.

## Checks

- `node --check home-truths-content.js`: passed.
- Module/schema check: 15 topics, 45 cards, 135 actions; every topic has exactly 3 cards and every card exactly 3 checks.
- All intro text is at most 18 words; all card body text at most 30 words.
- Every stage, image key and legacy chapter reference is valid; all 10 legacy chapters are represented.
- All source URLs parse as absolute URLs; topic and card IDs are stable strings suitable for navigation and saved checks.
- A GET reachability pass checked all 26 topic URLs: 25 returned HTTP 200. The Law Society payment-fraud page returned HTTP 403 to the automated request; it is retained from the existing reviewed source registry, but current page access was not verified. HTTP success is a link check, not a substantive editorial review.

## Limits

This is an educational prototype with progressive detail, not an exhaustive legal, lending or technical property assessment. The short layer relies on the deeper guide for exceptions and explanations. Property-specific advice, local council records, current lender terms and insurance underwriting remain necessary. Before public release, a NZ conveyancing/lending editorial review should check both the new summaries and the preserved deeper guide. No calculations, UI, legacy source files or existing content were changed by this task.
