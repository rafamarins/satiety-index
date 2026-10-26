# Home Veritas — accessibility, motion and performance

26 October 2026. Local prototype at http://127.0.0.1:4185/. No deployment.

## Results

| Final Lighthouse 13.5.0 run | Performance | Accessibility | Best practices | LCP | CLS |
|---|---:|---:|---:|---:|---:|
| Mobile homepage | 99 | 100 | 100 | 2.3 s | 0 |
| Mobile open lifestyle answer | 99 | 100 | 100 | 2.0 s | 0 |
| Desktop homepage | 100 | 100 | 100 | 0.5 s | 0 |

Reports: [mobile home](quality-2026-10-26/veritas-home-mobile.report.html), [mobile answer](quality-2026-10-26/veritas-answer-mobile.report.html), [desktop home](quality-2026-10-26/veritas-home-desktop.report.html). Matching JSON files retain settings, measurements and diagnostics. Default Lighthouse mobile simulated throttling, desktop preset for desktop, separate headless Chrome with fresh navigation. These are individual lab runs, not guaranteed scores for every device or route. The original mobile performance score was 75, LCP 9.8 s.

SEO remains 63 because the prototype intentionally blocks indexing. This was retained rather than publishing the educational prototype for a higher score.

## Changes

- Renamed active site branding, page titles, footer, About kicker and translated About labels to Home Veritas. Historical concept galleries and source filenames retain their original names.
- Topic accordions remain independently open; expanding another answer no longer collapses content above it. Native disclosure expansion has no animation or automatic scrolling.
- Prepare visual definitions before rendering the topic, eliminating the late replacement of text with a larger collage. Avoid showing the footer before the initial routed content is ready.
- Search closes on one Escape even with populated input, restores focus, and keeps native modal focus containment.
- Correct semantic heading levels inside topic summaries and language accessible names that now include their visible EN/BR/ES/中文 labels.
- Generate 320/480/640/960 px variants from original WebP artwork, use responsive srcset/sizes, prioritise the first image and defer later overview images. The original artwork stays intact.
- Deliver Anton as a compressed WOFF2 with Latin/extended Latin, punctuation, euro and arrow glyphs retained; Chinese continues using the existing system-font stack. Original TTF and OFL license retained.
- Replace the Python preview with a loopback-only Node server providing gzip text responses, correct MIME types, conditional ETags and revalidation. No public deployment or long-lived stale caching.
- Fix novice fridge/refrigerator search vocabulary and expose principal-versus-cost distinctions in the first expanded rent/buy card, in all four languages.

## Accessibility and interaction evidence

[Automated accessibility record](quality-2026-10-26/accessibility.json): 27 states with no axe violations and no horizontal overflow. Coverage: homepage, open language menu, all 15 topics with all short answers expanded, three translated lifestyle views, deep FAQ content, calculator, populated Search, official links, 320px, desktop and a 720px reflow viewport. Five interaction assertions passed: dialog focus restoration, everyday search, stable independent accordions, no accordion animation, reduced motion.

[Rename checks](quality-2026-10-26/rename-check.json): four additional 320px homepage/locale states passed axe and overflow checks; current About text and visible branding contain Home Veritas. Total 31 automated states. Fresh browser screenshots inspected on mobile and desktop. Forced-colors screenshot inspected: text, borders, disclosure states and links remain distinguishable.

Manual resolution of axe incomplete results:
- `aria-controls` points to the existing unique `language-menu`; expanded menu and keyboard handling checked. The tool requested manual validation despite the target being present.
- Cropped sprite image bounds caused some caption-contrast checks to be incomplete. Rendered captions are outside the clipped image frames, on the solid paper surface. Measured text contrast: ink/paper 18.75:1; blue/white 6.93:1; source links/paper 9.76:1; muted text/paper 6.02:1.

[Interaction timing](quality-2026-10-26/interaction-timing.json): isolated Chrome, 390 × 844, 4× CPU slowdown. Three accordion keyboard activations produced no entries at the 16 ms reporting threshold; Search maximum observed event duration was 40 ms, Escape 16 ms. This is a small lab sample, not field INP. An earlier shared-browser trial during concurrent image generation recorded a 672 ms interaction; the isolated follow-up removed that contention. Do not treat the controlled result as a guarantee under system load.

Native keyboard activation, Escape/focus return, visible focus, reduced motion and forced colors checked. VoiceOver/other actual screen readers and physical assistive devices were not tested. 720px reflow is a viewport proxy, not a physical-device certification.

## Persona result

[Independent novice walkthrough and focused retest](2026-10-26-fresh-collage-persona.md): all eight tasks were ultimately answerable; initial compound search failed and costs required too many expansions. Both were fixed and independently retested. Stable accordion behaviour and populated-Search Escape also passed. Images are strongest for lifestyle and physical-condition-versus-records distinctions; captions remain essential for deposit accounting and legal/lending conditions. Simulated users, not a human study.

## Checks and reproducibility

- npm run check: all 12 tests passed.
- npm run build: passed; updated root and dist package.
- gzip response confirmed live; JavaScript served with Content-Encoding: gzip and Vary: Accept-Encoding.
- npm run dev starts the compressed preview on 127.0.0.1:4185.
- QA scripts use `QA_MODULES_ROOT` pointing at a directory containing puppeteer-core and axe-core. Run `node scripts/check-home-truths-quality.mjs` and `node scripts/check-interaction-timing.mjs` with that environment set. Lighthouse runs used `npx --package lighthouse --package axe-core --package puppeteer-core lighthouse <URL> --chrome-flags='--headless=new' --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=<report>`; desktop also used `--preset=desktop`.
- No Git metadata in this workspace, so no Git diff/commit claim. No commit, push or deployment.

A 100 automated accessibility score is not a full WCAG conformance determination: [Chrome scoring documentation](https://developer.chrome.com/docs/lighthouse/accessibility/scoring/). Core Web Vitals measure LCP, INP and CLS at the 75th percentile of real visits, not a 0–100 score; that field dataset is unavailable for this local prototype: [Web Vitals guidance](https://web.dev/articles/vitals).
