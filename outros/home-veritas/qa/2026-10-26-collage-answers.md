# Collage answers — 26 October 2026

## Changes

- Replaced the small icon diagrams with photographic collage scenes and short captions in nine FAQs. Comparisons juxtapose two scenes; sequences use numbered frames. The full original explanation and source remain available.
- Eight related short answers now show collages directly, including /decide/compare. Original short copy and supporting points remain under Look closer. No changes to bookmarks, notes or print data.
- Added a ninth visual explanation: mortgage repayments versus the rest of ownership costs, preserving the principal/interest distinction and other costs from the existing sourced answer.
- Consolidated the four-document icon view into the physical building versus its records. The full FAQ still explains LIM, inspection, title and property file separately.
- Generated three new scenes with the built-in image_gen tool: renting/flexibility, ownership costs and included items. Retained the existing photographic cut-paper style, cobalt scraps and warm photography. No generated text or source claims in the images.
- All visual captions work in English, Brazilian Portuguese, Spanish and Simplified Chinese. Full FAQ text and source URLs are unchanged.

## Assets and prompts

Exact prompts, source PNG paths, tool mode and final workspace paths are recorded in ../ANSWER-COLLAGES.json. New WebP files:

- assets/home-truths/answer-renting.webp — 113,264 bytes
- assets/home-truths/answer-ownership-costs.webp — 105,344 bytes
- assets/home-truths/answer-inclusions.webp — 99,666 bytes

800 px wide with preserved alpha, compressed using Sharp. Original generated PNGs retained. Combined new artwork: 318,274 bytes. Existing imagery is reused and browser-cached. The new HTML images use lazy loading and declared dimensions. No extra libraries or continuous motion.

## Verification

- Ten tests pass, including source sentence preservation across all 68 FAQs / four languages, nine translated visual definitions, existing asset paths, and main-card mapping.
- Build passed. Main JavaScript 32,275 bytes gzip; visual content 6,991 bytes gzip loaded separately.
- Desktop 1440 × 1000: inspected main rent/buy answer with both collages loaded at 257 px wide. No horizontal overflow.
- Mobile 390 × 844: inspected rent/buy and Spanish included-items FAQ. Captions readable, scenes loaded, full explanation and source available, no icon-only illustrations in answer frames.
- Packaged build at 320 × 740: 8 short-answer routes × 4 languages = 32 panels. Every collage loaded, original short explanation accessible, no horizontal overflow. Native lazy images were explicitly decoded in this coverage check to validate every file, including below-viewport frames.
- Browser console: no application errors. Existing font preload-unused warnings appeared during rapid navigation; not changed in this visual task.
- No fresh human or simulated-persona study claimed. Tests cover rendering, content retention and assets, not measured comprehension improvement.

Main files: home-truths.js, home-truths.css, home-truths-answer-visuals.js, home-truths-content.test.js, assets/home-truths/answer-*.webp. Local prototype only; no deployment.
