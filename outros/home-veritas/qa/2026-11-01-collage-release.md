# Collage examples release — 1 November 2026

Rafael approved committing, publishing and pushing the reviewed work. The release includes the earlier beginner journey, content cleanup and contextual links, plus the approved collage examples.

## Changes

- Keep the existing house/cost artwork on Deposit and Mortgage topic pages.
- Promote the reviewed council-records and inspection photographic comparison, with each limitation adjacent to its explanation, in four languages.
- Add accessible 6%/7% controls to highlight the matching repayment and announce the selected amount and difference. Existing calculation and assumptions are unchanged.
- Preserve the adjustable deposit split with reduced-motion support. Reserve 44px for the native select's inset chevron; give the language trigger a 16px right inset.
- Reuse the production example module in the local review page. Retired 3D experiments remain local and are excluded from the commit and public package.

## Verification

- Root `npm run check`: 11 parent tests, 26 Home Veritas tests, illustration validation, combined build and public-file isolation passed (252 public files).
- `scripts/check-contextual-links.mjs` against the built package: 72 states, Chromium and WebKit, four languages, 320/390/1440px. No overflow, accessibility violations or runtime errors. Verified repayment buttons, deposit arithmetic, arrow spacing, collage loading, keyboard behaviour, reduced motion, links and source drawers.
- Inspected mobile Deposit and Records captures and desktop Mortgage capture.
- Local review page: another 72 Chromium/WebKit states passed, with no errors or external runtime requests.
- `git diff --check` passed.
- Detailed local evidence: `collage-release-2026-11-01/report.json` and its screenshots. These generated artifacts stay out of the public package.

## Release path

Push the reviewed commit to `main`; the existing Cloudflare Workers Builds configuration runs `npm run check` then `npx wrangler deploy` for Worker `satiety-index`. Verify the build's exact commit and live example interactions after deployment. No route or infrastructure changes.
