# Contextual links and worked examples — 1 November 2026

## Changes

- Hide All topics in the homepage footer; retain it on deeper pages.
- Explore goes to the topic grid, including when already on home, with keyboard focus at the section heading.
- Replace three repeated card links with one accurately labelled topic-level details link after the basics. Drawer title now matches that scope.
- Show current-topic links first, deduplicate the optional library, and collapse other topics. Council-record advice appears only for relevant property topics.
- Remove About from search controls and hide the beginner link while searching. Use 'See the buying steps' for direct visitors too.
- Repayment calculator links to mortgage sources even when opened from Budget.
- Add optional worked examples to Deposit, Mortgage and Records: adjustable contribution/loan bar, two hypothetical interest-rate repayments, and a records-versus-inspection scenario. All four languages; no automatic motion. Deposit bar transition is disabled with reduced motion.

## Link audit

Reviewed all internal link placements, six beginner targets, 17 next actions, related topics, FAQ citations and 45 unique external source URLs. 42 returned HTTP 200. Three returned 403 to direct automated requests but were readable through web verification (Law Society payment-fraud article, Auckland Council rating-valuation page and Banking Ombudsman cashback case). No confirmed broken source links. Evidence: `links-examples-2026-11-01/external-links.json`.

Scenario wording was checked against existing reviewed guidance and the primary pages:
- https://www.settled.govt.nz/buying-a-home/thinking-of-buying/thinking-about-your-finances-when-buying/
- https://www.building.govt.nz/getting-started/your-rights-and-obligations/homeowner-rights-and-obligations/buying-a-house/what-can-the-council-tell-you-about-the-house

Amounts are illustrative, not current property prices, rates or lending offers. The rate comparison uses the existing repayment formula: a NZ$560,000 loan over 30 years gives rounded monthly payments of NZ$3,357 at 6% and NZ$3,726 at 7%, a displayed difference of NZ$369. Full assumptions are next to the example.

## Verification

- Home Veritas: 26 tests passed, including arithmetic, multilingual content, search and route coverage.
- New Chromium/WebKit regression: 72 audited example states at 320, 390 and 1440px across four languages. Tested deposit updates, reduced motion, focus, link deduplication, drawer titles, contextual sources and every topic's internal links. No detected accessibility violations, overflow or runtime errors.
- Existing beginner regression: 73 audited states passed in both browsers and all languages.
- Visually inspected mobile Deposit/Records and desktop Mortgage examples.
- Test reports/screenshots: `links-examples-2026-11-01/`.
- No commit/push; unrelated changes preserved.

## Published

Published at https://rafael.co.nz/outros/home-veritas/ on 1 November 2026. Worker version `c69ca529-0841-4405-b5de-d12a9eac3b4e`; previous version `b63537e6-212a-43ac-9061-b433b98ae2d3`. Existing route configuration unchanged.

Root `npm run check` passed (11 parent tests, 26 Home Veritas tests, illustration checks, combined build and public-file isolation). Wrangler dry-run and deployment passed. Live mobile verification passed in all four languages: footer, Explore focus, three examples, updated deposit amounts and deduplicated source lists. Portfolio, Outros, Satiety Index, Home Veritas and the new example stylesheet returned HTTP 200. No runtime errors. Evidence: `links-examples-2026-11-01/live.json`.
