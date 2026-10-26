# Answer-specific collages — 26 October 2026

## Change

Replaced reused generic collages in eight visual FAQ explanations with dedicated photographic sheets. Added a three-scene lifestyle comparison to decide/life. The rent/buy FAQ retains two existing collages exclusively. Nine short answers now show visual explanations; all nine existing visual FAQs remain covered. Complete source wording and URLs remain available underneath.

Nine new sheets distinguish repayments/upkeep, purchase price/sales deposit, preapproval/property approval, the buying sequence, inspection/records, seller report/own inspection, included items, settlement delays and lifestyle needs. Corrected preapproval artwork to show a bank adviser rather than a building inspector. No save/export controls were restored.

Captions shortened across English, Brazilian Portuguese, Spanish and Simplified Chinese. Existing English FAQ visual copy reduced from approximately 420 to 340 words; the added lifestyle comparison is separate. Removed a duplicated lifestyle warning from its visual note; the original gotcha remains.

## Assets and presentation

Prompts, original files and the semantic correction are recorded in ../ANSWER-SPECIFIC-COLLAGES.json. Built-in image generation; local 1200 × 800 WebP assets with alpha. Nine files range 105,930–280,854 bytes. Each answer uses one cached sheet, cropped by CSS into independent scenes. Two-scene sheets show the upper 62.5% to retain the full foreground objects. Three/four-scene sheets use quadrants. Mobile three-scene comparisons use the same two-plus-one layout as sequences, collapsing to one column at 360px and below.

## Verification

- npm run check: all 11 tests passed. Visual tests check four-language coverage, source sentence retention, all image paths, valid unique panels and no shared generic assets across unrelated explanations.
- npm run build: passed. Initial JavaScript about 26 KB gzip; on-demand visual definitions about 6.7 KB gzip.
- Live Chrome, dedicated QA page 13: desktop 1440 × 1000 screenshot inspected for decide/life.
- Phone 390 × 844 screenshots inspected for lifestyle, records, chattels and the sales-deposit FAQ; complete scenes visible, readable captions, no horizontal overflow.
- 320 × 844 browser sweep: 36 cases (9 visual short answers × 4 languages), all images decoded, complete explanations present, no horizontal overflow, no save controls.
- Sales-deposit FAQ: two images loaded, Full explanation retained, official Settled source link retained.
- No browser console errors in final check.
- QA automation initially timed out during rapid language/hash transitions; adding a short rendering-settlement wait allowed all 36 checks to finish. No product change was needed for this automation timing issue.

This is implementation/rendering QA, not a fresh human or simulated persona study. The preceding persona report remains 2026-10-26-collage-persona-retest.md. No legal/financial content rules were changed or newly certified. No deployment. Workspace has no Git metadata.
