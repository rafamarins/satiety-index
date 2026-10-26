# Home Veritas

A working visual prototype for New Zealand first-home buyers. Bold yellow, photographic collage and concise explanations carry the approved concept through the whole journey.

## Preview

This project's source lives in `outros/home-veritas/` in the SatietyIndex repository,
alongside the Outros directory. The repository's `npm run build` builds the public
files at `dist/outros/home-veritas/`. `npm run preview` from the repository root
serves the combined site at http://localhost:8787/outros/home-veritas/ and its
directory entry at http://localhost:8787/outros/. Deployment uses the parent
repository's existing Cloudflare build and exact route configuration.

Run `npm ci`, `npm run check`, `npm run build`, then `npm run dev` from this folder. Open http://127.0.0.1:4185/ or the packaged build at http://127.0.0.1:4185/dist/.

The public path is `/outros/home-veritas/`, linked from the Outros directory.
`dist/` is the generated public package. The previous illustrated-world
prototype is preserved at `world-prototype.html`, with its source files unchanged.
Sketch galleries remain under `concepts/`. The former workspace location,
`rafael.co.nz/first-home-concept`, is a compatibility symlink to this folder.

## The experience

- Six large interest blocks: Starting out, Money & people, Finding a home, Checking a property, Making it happen, and Life as an owner.
- Seventeen topics: rent/buy, full costs, deposit/KiwiSaver, bank/broker conversations, mortgage, real estate agents, sale processes, neighbourhood, home/title types, viewings, inspections, property records/consents, hazards/insurance, offers/contracts, settlement, ongoing ownership and renovation.
- Related topic blocks open three expandable questions: a short explanation, useful things to look into and a specific gotcha. Eleven deeper FAQs have photographic collage comparisons or sequences; eleven short answers show collages directly, including a dedicated lifestyle comparison. All 82 use short reading blocks. Full source wording remains available.
- Breadcrumbs, related topics, browser Back/Forward and deep links. No required sequence or page-through-card controls.
- Search covers all topics, 82 deeper questions and the official resource library. The footer exposes sources and About on mobile.
- Explore and search without accounts, saved answers, personal notes or exports. Questions & sources opens the deeper guidance directly. Language preference is the only app preference currently stored.
- Deposit and principal-and-interest illustrations show the effect of changing inputs. Rates are hypothetical and assumptions are visible; neither is an eligibility assessment or lender quote.
- English, Brazilian Portuguese, Spanish and Simplified Chinese for the complete short guide, navigation and detail views. Language choice persists locally and is shareable through the URL. All 82 FAQs, deeper explanations, resource descriptions, source labels and About copy are translated too. Official external websites keep their own language options.
- Native modal focus management, semantic controls, a skip link, reduced-motion support, responsive layouts and native expandable question controls.

## Files

- `home-truths.html` is the HTML source; the build copies it to `index.html`.
- `home-truths.js`, `home-truths.css`: prototype behaviour and responsive layout.
- `home-truths-i18n.js`, `locales/`: UI translations and lazy-loaded translations of all 17 topics / 51 short cards and 82 FAQs.
- `home-truths-answer-layout.js`, `home-truths-answer-visuals.js`: sentence-preserving reading blocks and eleven curated FAQ collages plus a lifestyle comparison in all four languages. Visual copy loads on demand with the detailed guide.
- `home-truths-reference.js`: localizes deeper references while preserving source URLs and stable search/grouping identity.
- `home-truths-search.js`: word-aware search, familiar word variants and related-FAQ grouping.
- `home-truths-navigation.js`: six interest areas and validated home/area/topic/question routes.
- `agents-sales-content.js`, `agents-sales-reference.js`, `agents-sales-visuals.js`: explicit agent-role and sale-process guidance, source links and visual comparisons.
- `AGENTS-SALES-ARTWORK.json`: built-in image-generation prompts, originals and local artwork paths.
- `qa/2026-10-26-agents-sales.md`: source review, new coverage, translations and verification.
- `home-truths-content.js`: five stages, seventeen topics, fifty-one short cards and primary source links.
- `guide-content.js`, `resources.js`: preserved detailed content and source library, loaded on demand.
- `finance.js`, `finance.test.js`: repayment calculation and targeted tests.
- `home-truths-content.test.js`: stage, route, content, visual and source-reference checks.
- `build-home-truths.js`, `build-responsive-images.js`: bundle the application, create responsive image variants and build the public package.
- `serve-home-truths.js`: local preview with compressed text responses and conditional caching.
- `scripts/check-home-truths-quality.mjs`, `scripts/check-interaction-timing.mjs`: isolated Chrome/axe and keyboard interaction checks.
- `scripts/check-multilingual-journey.mjs`: full three-language topic, FAQ, search, calculator, source and error-state coverage.
- `qa/2026-10-26-final-mobile.md`: final four-language mobile regression, accessibility and fresh Lighthouse results.
- `scripts/check-mobile-lighthouse.mjs`, `scripts/check-mobile-interactions.mjs`: sequential performance and mobile keyboard/motion checks.
- `qa/2026-10-26-multilingual-journey.md`: language review findings, fixes, final evidence and limitations.
- `scripts/check-language-switching.mjs`: real mouse, touch and keyboard locale-switch regression checks.
- `qa/2026-10-26-language-switching.md`: language selection failure, correction and verification.
- `qa/2026-10-26-quality-audit.md`: accessibility, motion, Lighthouse results and limitations.
- `qa/2026-10-26-fresh-collage-persona.md`: latest independent novice simulation and remediation retest.
- `assets/home-truths/`: compressed topic and answer collages. `HOME-TRUTHS-ARTWORK.json` records generation prompts and sketch references. Original generation outputs remain in Codex storage; the runtime only uses workspace assets.
- `qa/home-truths-content-review.md`: source verification and limitations.
- `qa/2026-10-26-buyer-question-research.md`: public-discussion research, content coverage, ten blind scenarios and follow-up fixes.
- `ANSWER-SPECIFIC-COLLAGES.json`: prompts, originals, correction and workspace paths for the nine new answer-specific sheets.
- `qa/2026-10-26-specific-collages.md`: crop, mobile, language and preservation checks.
- `ANSWER-COLLAGES.json`: new image prompts, built-in image generation provenance, originals and workspace asset paths.
- `qa/2026-10-26-collage-persona-retest.md`: independent novice simulation, fixes, targeted retests and final simplified navigation check.
- `qa/2026-10-26-collage-answers.md`: collage answer implementation and browser checks.
- `qa/2026-10-26-visual-answers.md`: visual answers, saved-answer redesign and browser checks.
- `qa/2026-10-26-deep-translations.md`: complete reference translation, reminder UX and browser checks.
- `qa/2026-10-26-blind-persona.md`: simulated novice-buyer tasks, findings and remediation evidence.
- `qa/2026-10-26-languages-print.md`: locale, saved-state and print validation. Historical report; the saved/print feature has since been removed.
- `qa/home-truths-block-flow.md`: checks for the current interest-block navigation.
- `qa/home-truths-review.md`: browser checks and simulated persona review.
- `qa/home-truths-build.json`: current image sizes and bundle measurements.

## Performance

The initial JavaScript and its shared source-link chunk total about 30 KB gzipped. The on-demand visual summaries add about 8 KB gzipped. Eleven answer-specific WebP sheets provide distinct scenes. Responsive 320/480/640/960 px variants avoid downloading the 1200 px original on small screens. A single lazily loaded sheet serves two to four panels. Two earlier 800 px collages now appear only in the rent/buy comparison. A selected non-English short-guide translation adds about 11–12 KB gzipped. Deeper reference translations add about 18–21 KB gzipped only when opened. Detailed content is split into two chunks, about 17 KB gzipped together, and requested only when needed. The seven original WebP collages are approximately 195–352 KB each. The overview requests appropriately sized collages, prioritises the first image and lazily loads later tiles; topic pages can reuse the same cached assets. Fonts are local. There are no third-party runtime requests, WebGL dependencies or continuous animation in this prototype. Accordions open instantly without closing other answers. Optional hover transitions respect reduced motion. Visual answers are prepared before the topic is rendered to avoid a late text-to-image swap.

These are file measurements, not a device performance certification. The local Node preview server compresses text responses and supports ETag revalidation. A public host should also enable compression and appropriate caching. Check the generated build report for exact sizes.

## Content status

Short-guide source review: 26 October 2026. Detailed-guide review: 25 October 2026. The new targeted pass checked primary guidance on support/KiwiSaver, brokers, auctions/contracts, neighbourhoods, consents and hazards. It does not re-certify every inherited answer. Some source sites block automated retrieval; see the review notes.

This is educational content, not an exhaustive property assessment or individual financial/legal advice. Circumstances vary by buyer, building, council, lender and insurer. A public release still needs NZ conveyancing/lending editorial review and human usability testing. The photo collages are AI-generated illustrative scenes, not actual inspected properties or technical drawings.

Anton and DM Sans are self-hosted under their included OFL licenses. Previous world-prototype dependencies remain installed for the preserved version, but are not bundled into Home Veritas.
