# Visual answers and saved references — 26 October 2026

## Product changes

- Removed completion checkboxes from Saved as well as reading and print views. Save now bookmarks a short answer or an individual FAQ, with sources and optional personal notes. Its purpose is to carry useful information into a viewing or adviser conversation.
- Preserved existing saved card keys, notes and dormant checked state. No stored completion data is deleted; it simply has no interface now.
- Eight confusing FAQ subjects now have compact comparisons or sequences: rent/buy, deposit meanings, pre-approval, buying order, property documents, seller reports, included items and settlement delays.
- Visual summaries are translated into English, Brazilian Portuguese, Spanish and Simplified Chinese. Existing qualifications remain visible in the diagram notes; complete original answers are available through Full explanation.
- All 68 answers use short sentence blocks. Short opening fragments are paired with the following sentence. The detailed topic overview reuses its existing collage; shortcuts are broken into short blocks too.
- No factual source text or source URLs were changed. Diagrams summarize the existing reviewed guidance and do not replace it.

## Checks

- Ten tests pass. New coverage checks every FAQ in all four languages for sentence-content preservation, 68 unique/stable saved FAQ keys, and eight visual summaries per language. Existing finance, route, localization, search and source checks pass.
- Build passed. Initial JavaScript: 32,055 bytes gzip. Visual copy: 6,297 bytes gzip, loaded only alongside deeper reference material. Inline SVG illustrations add no image downloads or new dependencies.
- Browser: desktop 1440 × 1000; mobile 390 × 844 and 320 × 740. Reviewed rent/buy comparison and topic detail screenshots. The 390 px Portuguese comparison fits two columns; 320 px comparisons stack.
- Packaged build: seven relevant topic panels × four languages opened at 320 px. Expanded FAQs and full explanations. No horizontal overflow or checkboxes. Inspection's legacy /inspect alias resolved to /inspection. No console warnings or errors.
- Saved one short answer and one FAQ, added a synthetic note, reloaded: both answers and the note remained. Printable page had both answers, note and three source links, with no checkbox glyphs. Changing to Chinese translated both saved answers while preserving the user's note verbatim.
- Seeded an earlier-format saved card with checked state and a note. The answer and note appeared; editing a note retained the old checked state without displaying completion controls.
- Captured the generated text Blob: answer title, explanation, note and source URLs present; no checkbox markup. One initial assertion used an incorrect expected title and was corrected to compare against the actual saved heading and answer.
- Original browser storage restored after synthetic tests. Only the QA-owned tab was operated.

## Limits

These are implementation and browser checks, not new human usability evidence. Earlier simulated persona findings remain in the buyer-question research report. No physical printer, new PDF file, physical device or screen-reader review was run for this change. Local prototype only; no deployment.

## Main files

- home-truths.js / home-truths.css — reading layout and saved-answer flow.
- home-truths-answer-layout.js — sentence-preserving blocks and small SVG illustrations.
- home-truths-answer-visuals.js — curated, translated visual summaries.
- home-truths-reference.js — stable FAQ bookmark keys.
- home-truths-i18n.js — updated saved-answer language.
- home-truths-content.test.js — retained content and multilingual identity checks.
