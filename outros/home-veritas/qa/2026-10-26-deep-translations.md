# Complete reference translation and reading-flow QA — 26 October 2026

## Changes

- Added Brazilian Portuguese, Spanish and Simplified Chinese reference files. Each covers 10 chapters, 68 FAQs, 41 chapter checklist items, 15 resources and 26 topic-source labels. All source URLs remain unchanged.
- About, source review notes, artwork alt text and error states translated. Removed English-reference banners. External sites may still open in English; the source library makes that boundary clear.
- Reference data stays lazy-loaded and cached separately per language. English search identity is retained as non-rendered metadata so topic grouping and searches remain stable across translations.
- Corrected the language arrow with a centred CSS chevron, independent of font baseline. Browser measurement: 0 px difference between trigger and chevron-box vertical centres.
- Added four source-backed FAQs from the research audit: process order, report timing, included curtains/appliances and settlement delays.
- Added direct Questions & answers access on each topic. Reading views display optional reminder bullets; only Saved provides completion checkboxes. Matched FAQ answers precede broad topics in search.

## Checks

- Nine tests passed: finance, route/data integrity, short and deep translation coverage, stable storage keys, source URL equality, multilingual grouping and search variants including curtains/appliances/delays.
- Build passed; final application about 30 KB gzip, selected short translation 9–11 KB gzip, selected reference translation 15–18 KB gzip. No translation API or new runtime dependency.
- 60 topic answer panels (15 topics × four languages) opened at 320 px. All had answers; all disclosures expanded; no horizontal overflow. There were 155 answer occurrences across topics per language (shared topics repeat some of the same 68 unique answers).
- Portuguese FAQ screenshot and Spanish/Chinese detail-panel contents checked. Shortcuts, FAQs, resource descriptions and About text are translated; no stale English-reference notice or forced English lang attributes remained in tested panels.
- Saved a synthetic Spanish reminder, ticked an action in Saved, and opened printable page. Check state and translated source label rendered correctly. Original browser storage restored.
- Detailed independent persona results and research sources: `qa/2026-10-26-buyer-question-research.md`. Earlier six-task pass: `qa/2026-10-26-blind-persona.md`.

- Packaged-build smoke check at 320 px: Spanish inclusions FAQ loaded with translated answer and source label; no horizontal overflow, arrow centre difference 0 px, and no browser console warnings or errors.

## Limits

Agent-assisted translation and simulated persona testing do not substitute for human linguistic or usability review. No physical-phone or screen-reader certification is claimed. General content remains educational, not property-specific advice. Local prototype only; no deployment.
