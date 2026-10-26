# Interest-block navigation — 26 October 2026

## Change

Replaced the sequential stage/card interface with six large interest blocks, related topic blocks, and expandable question blocks. All fifteen topics and forty-five short explanations remain reachable. Existing topic/card deep links still work. Search now groups topics by the same six areas. Saved checks, notes, calculators, FAQs and primary-source links retain their existing behaviour and content.

Main implementation: home-truths-navigation.js, home-truths.js, home-truths.css, home-truths.html. Generated index.html, bundle and dist updated.

## Verified

- `npm run check`: six tests passed, including complete area coverage, route resolution and finance examples.
- `npm run build`: successful. Six areas, fifteen topics, forty-five cards, sixty-four FAQs recorded in the build report.
- Chrome rendered inspection at 1440 × 1000, 390 × 844 and 320 × 740, with reduced motion enabled.
- Root → Finding a home → Home & ownership types: three closed question blocks initially. Opening and switching questions updates the deep link; closing all returns to the topic URL. Browser Back returns to the area.
- Keyboard Enter expands a focused question summary. Escape closes the detail dialog and restores page scrolling.
- All 67 home/area/topic/question routes visited at 320 px: no horizontal overflow or missing headings; all 45 question routes opened their requested question.
- Save button toggled and restored to its original state. Detail panel showed checks, note field, nine relevant FAQs and source links for the tested home-types topic. Existing notes were not edited.
- Search for KiwiSaver returned two topic results and four deeper answers.
- Deposit illustration opened with a $700,000 price, $140,000 contribution and $560,000 loan.
- Packaged `/dist/#/` rendered six blocks with all collage images loaded, no horizontal overflow and no console errors.

## Limits

This is browser/functional QA, not a new human usability study or a fresh financial/legal content review. Note editing and download behaviour were retained, not exhaustively retested in this navigation pass. Existing editorial-review caveats remain in README.md. Six home-screen images total about 1.6 MB; there is no animation loop or 3D runtime.
