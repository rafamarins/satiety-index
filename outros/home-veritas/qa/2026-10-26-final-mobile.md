# Home Veritas — final mobile regression check

26 October 2026, Pacific/Auckland. Current built prototype on http://127.0.0.1:4185/. Local preview restarted before testing. No application defects were found in this pass; no product code changed.

## Fresh Lighthouse results

Lighthouse 13.5.0, Chrome, default simulated mobile throttling. Each navigation used a fresh headless browser. Runs were sequential, after functional/accessibility checks finished, to avoid concurrent audit workloads. Single run per language/view; no failed performance samples were discarded or replaced.

| Language | Homepage performance | Open answer performance | Accessibility, both | Best practices, both | LCP home / answer | CLS, both |
|---|---:|---:|---:|---:|---:|---:|
| English | 99 | 99 | 100 | 100 | 2.1 s / 2.0 s | 0 |
| Brazilian Portuguese | 99 | 99 | 100 | 100 | 2.0 s / 2.0 s | 0 |
| Spanish | 99 | 99 | 100 | 100 | 2.0 s / 2.0 s | 0 |
| Simplified Chinese | 99 | 99 | 100 | 100 | 2.1 s / 2.0 s | 0 |

All eight runs completed without Lighthouse run warnings. All eight had 0 ms total blocking time. SEO remains 63 because this educational prototype intentionally retains noindex; this was not altered for scoring.

Evidence: [summary JSON](final-mobile-2026-10-26/lighthouse-summary.json), [English home](final-mobile-2026-10-26/en-home.report.html), [English answer](final-mobile-2026-10-26/en-answer.report.html), [Portuguese home](final-mobile-2026-10-26/pt-BR-home.report.html), [Portuguese answer](final-mobile-2026-10-26/pt-BR-answer.report.html), [Spanish home](final-mobile-2026-10-26/es-home.report.html), [Spanish answer](final-mobile-2026-10-26/es-answer.report.html), [Chinese home](final-mobile-2026-10-26/zh-Hans-home.report.html), [Chinese answer](final-mobile-2026-10-26/zh-Hans-answer.report.html). Matching raw JSON reports retain exact metrics/settings.

## Functional and accessibility coverage

[Full browser evidence](final-mobile-2026-10-26/journey-accessibility.json): 264 states passed axe-core 4.14.0 checks tagged WCAG 2 A/AA, 2.1 AA, 2.2 AA and best practice, with zero violations and no horizontal overflow.

In each of the four languages:
- Entered all 6 interest areas through visible homepage links.
- Checked all 15 topics, all 45 short answers and all 68 unique deeper answers, including complete source wording and source URLs.
- Confirmed 7 ordinary search queries return the intended FAQ and full answer: 28 searches total.
- Exercised all 3 calculator entry points and changed a value to confirm the result updates.
- Checked source panels, About, real language-picker taps, reload persistence, translated empty search and optional-deep-content load failure.
- Verified phone viewport 390 × 844, narrow reflow 320 × 844 and landscape 844 × 390.

No page errors or English fallback paragraphs were detected in non-English content. Official NZ names remain accompanied by explanations; linked external websites retain their own language options.

Axe requested manual review for two known patterns: the language control's referenced menu and contrast around clipped sprite sheets. The menu target exists and its native interaction is covered. Rendered screenshots show text outside the clipped frames; the existing solid foreground/background colors retain the contrast ratios documented in the earlier quality report. Native text contrast was not inferred from the illustrations.

English, Portuguese and Spanish 320px screenshots inspected; Chinese 390px collage inspected in a fresh browser page. Content and disclosure controls remained readable, with no overlapping text. Narrow and landscape screenshots for all four languages are saved under final-mobile-2026-10-26/.

## Keyboard, motion and interaction timing

[Interaction evidence](final-mobile-2026-10-26/interactions.json): isolated mobile Chrome at 390 × 844 with 4× CPU slowdown, native keyboard interactions.

All four languages passed:
- Enter opens the next accordion while keeping the previous answer open.
- Selected summary stayed in place: 0 px shift in every language; no accordion animations.
- Visible keyboard focus outline present.
- One Escape closes a populated Search and restores focus to Search.
- Language menu Arrow/Escape handling restores trigger focus.
- Reduced-motion mode has no active animations.

Largest observed event duration in this small lab sequence: English 32 ms, Portuguese 32 ms, Spanish 32 ms, Chinese 96 ms. Event reporting threshold 16 ms. These samples are not field INP.

## Build and checks

- npm run check: 14 tests passed.
- npm run build: passed; root preview and dist rebuilt before auditing.
- Runtime entry: 80,053 bytes / 27,518 bytes gzip. Stylesheet: 26,282 bytes / 6,431 bytes gzip.
- Preview server delivers compressed text and ETag revalidation.
- No Git metadata in this workspace; no commit, push or deployment.

The audit scripts were extended to accept all four languages, optional axe scanning, a mobile-only viewport sweep and separate evidence destinations. An initial English search assertion incorrectly expected the insurance-policy FAQ for a flood-risk query; that test expectation was corrected to the relevant flood-risk FAQ. This was a harness correction, not a product failure.

Reproduce functional/a11y checks with QA_MODULES_ROOT pointing to a directory containing puppeteer-core and axe-core:

```
QA_LANGUAGES=en,pt-BR,es,zh-Hans QA_AXE=1 QA_MOBILE_ONLY=1 QA_OUTPUT=qa/final-mobile-2026-10-26/journey-accessibility.json node scripts/check-multilingual-journey.mjs
node scripts/check-mobile-lighthouse.mjs
node scripts/check-mobile-interactions.mjs
```

## Limits

These are local lab results for the tested build. Field Core Web Vitals, actual screen-reader sessions, physical devices and native-speaker human studies were not measured in this pass. A 100 automated accessibility score does not establish full WCAG conformance. See the [earlier quality report](2026-10-26-quality-audit.md) for methodology/source references and the [multilingual journey review](2026-10-26-multilingual-journey.md) for language-review findings.
