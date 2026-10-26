# Artwork, languages and printable checks — 26 October 2026

## Scope

- Corrected the inspection collage to one coherent roof with a wall cutaway. Old asset retained as `qa/inspection-before-roof-fix.webp`; new generation provenance in `HOME-TRUTHS-ARTWORK.json`. Transparent WebP is 231,800 bytes, smaller than the old asset. Browser verified on the interest overview.
- Four language choices: English, Brazilian Portuguese, Spanish, Simplified Chinese. Complete short-guide coverage per translation: six areas, fifteen topics, forty-five cards, 135 checks. UI, saved checks, calculators and printable page translated. IDs and storage keys remain stable.
- Detailed FAQs, shortcuts, About prose and official sources remain English, visibly labelled with `lang` attributes and a translated notice. Machine-assisted translations require human linguistic/domain review before public release.
- Saved → Printable page / Save as PDF opens a dedicated page. It includes all saved sets, checked states, gotchas, notes and full source URLs. Native browser printing; no document service, upload, account or added dependency. Plain-text download retained.

## Verification

- `npm run check`: eight tests passed, including exact locale coverage, stable keys, search regressions and finance calculations.
- `npm run build`: successful, locale chunks included in dist. Main JS about 25 KB gzipped; selected locale 8.5–10 KB gzipped.
- Browser screenshots: desktop English and Portuguese; mobile Portuguese topic and Chinese overview. All four homepages checked at 320 px after fixing a Spanish header overflow.
- 272 route/language combinations (68 routes × four languages) checked at 320 px: no horizontal overflow or missing heading.
- Saved a synthetic council-record set, checked its first item, added a multiline note with Portuguese/Chinese and literal `<b>` text. Printable page preserved content, check state and four sources; text was escaped rather than interpreted as HTML.
- Print button called browser print (instrumented smoke check). Language switching on printable page retained the saved set and unmodified personal note in all three translations.
- A separate fresh headless Chrome profile generated a real two-page Chinese PDF containing three synthetic saved sets. Both pages visually inspected: Chinese glyphs, checked/unchecked symbols, notes and source URLs render; no site navigation, yellow background or image ink. Sample: `qa/print-sample-zh.pdf` (QA data only).
- Shared browser storage restored exactly after test; Saved 0 verified. Print generation used a separate temporary profile, never the user's personal Chrome profile.
- Narrow/mobile print-page layout checked. Native operating-system print dialog and physical printer were not exercised.

## Not a deployment

Local prototype only. No Git metadata exists in this directory. Human usability and translation review remain separate from this functional QA.

## Custom language picker follow-up

Replaced the native select with a compact custom listbox: bold EN / BR / ES / 中文, with NZ / Brazil / Spain / China flags to the right. Selected option is blue; native language names remain in accessible labels. Verified desktop and 320 px mobile rendering, flag placement, 800 text weight, arrow-key navigation plus Enter selection, Escape focus return and outside-click dismissal. Language switch retained content and saved state. Build and all eight tests passed; no browser console errors.
