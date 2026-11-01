# Home Veritas content cleanup — 1 November 2026

## Scope

Reviewed the beginner steps, all 17 short topics and 51 cards, deeper FAQ/checklists, visual explanations, resource descriptions and shared interface text. Preserved the existing yellow/cobalt palette, typography, artwork and page structure.

- Removed the source-review footer from Start here and repeated review dates from topic/link panels.
- Replaced the lengthy About panel with the guide's purpose, a short professional-advice boundary and author link.
- Removed internal topic counts, prototype wording, production commentary and repeated instructions about using the site.
- Replaced slogan-like copy with direct questions, concrete checks and explicit calculator labels.
- Updated English, Portuguese, Spanish and Simplified Chinese copy.
- Retained source links, useful dates such as scheme closure dates, calculator assumptions and substantive financial/property cautions. This is an editorial pass, not a fresh certification of every inherited fact.

## Verification

- Home Veritas: 22 tests passed, including content/translation coverage, visual answer identity, search ranking, routing and calculator logic.
- Browser regression expanded to include About and Useful links in all languages, plus removal of obsolete metadata. Chromium and WebKit: 73 audited states, no detected accessibility violations, horizontal overflow or runtime errors.
- Visually inspected mobile home and Start here footer after cleanup. Existing desktop/mobile screenshot coverage retained in the regression.
- Fixed an undersized author-link tap target found in the first About-panel check; the repeated check passed.
- Evidence: `cleanup-2026-11-01/report.json` and adjacent screenshots. Broader build/deployment verification recorded below when complete.

No source URLs, financial formulae, eligibility conditions or property-specific protections were removed. Existing unrelated changes and earlier work remain uncommitted.

## Published and verified

Published at https://rafael.co.nz/outros/home-veritas/ on 1 November 2026 using the existing `satiety-index` Worker and unchanged routes.

- New version: `b63537e6-212a-43ac-9061-b433b98ae2d3`.
- Previous version: `fba2cca1-b738-4c91-b1ed-18bb75aeec27`.
- Root `npm run check` passed: 11 parent tests, 22 Home Veritas tests, illustration checks, combined build and public-package isolation check.
- Final browser run after all deep copy edits: 73 states passed in Chromium/WebKit.
- Wrangler dry-run and deployment passed.
- Live mobile checks passed for Start here, About, Useful links and Deposit in all four languages. Removed boilerplate is absent, source links remain, and no runtime errors were observed.
- Portfolio, Outros, Satiety Index and Home Veritas each returned HTTP 200. Evidence: `cleanup-2026-11-01/live.json`.
- No commit or push. Existing unrelated changes were preserved. Local preview: http://127.0.0.1:4186/.
