# Home truths prototype review — 26 October 2026

## Build and content

- Five stages, fifteen topics, forty-five short explorations and 135 practical actions.
- Every existing detailed chapter remains mapped; 64 FAQs preserved.
- `npm run check`: five tests passed (three financial tests and two content/reference tests).
- `npm run build`: passed; creates root entry and isolated public package.
- Primary-source checks are recorded separately in `home-truths-content-review.md`.

## Browser checks

Chrome, local server. Desktop 1440×1000 and mobile emulation at 390×844 and 320×740; reduced motion enabled for deterministic inspection.

- All fifteen topic routes render their correct titles and load the local artwork at desktop width.
- All forty-five card routes render the correct selected question at 320px with no horizontal page overflow.
- Search for KiwiSaver returns four detailed answers and relevant topic results.
- Saved checklist and a question note survive reload. Saved → edit note opens the correct topic and retains the note.
- Native dialog remains open with background scroll locked after the edit-note transition.
- Useful links is reachable through All topics on mobile; its complete resource list loads.
- Changing the illustrative deposit from 20% to 10% on a $700,000 example changes the contribution from $140,000 to $70,000 and loan from $560,000 to $630,000.
- Setting the $560,000, 30-year monthly repayment example to 0% displays approximately $1,556 per month, $560,000 total and $0 interest.
- Browser Back restores the earlier offer-method card after moving to the auction card.
- The packaged build at /dist/ loads the inspection screen and its lazy-loaded FAQ/source chunks. Tab stays inside the native dialog; Escape closes it and restores focus to Go deeper. No JavaScript console errors were observed; background-tab font preload timing warnings occurred.
- QA-created saved state was removed and the pre-test storage value restored.

## Review fixes

An independent code review identified two issues. Both were fixed and then exercised in the browser:

1. A queued native close event could invalidate a newly reopened detail dialog. Close-event cleanup now only applies while the dialog is actually closed.
2. The mobile footer hid the sole entry points to the full source library and About. Both are now also available in All topics.

Mobile headings and image height were reduced to bring the reading area closer to the top. A Read the checks shortcut lets task-focused visitors jump directly to the content.

## Simulated personas — not human research

- Overwhelmed first buyer: begin with rent/buy; use the five stages and named Next actions. No required quiz or completion gate.
- Visitor heading to an open home: search for a relevant question, jump to viewings/inspection, save a set of checks and add a question. Saved sets work on return.
- Returning buyer preparing an offer: directly access sale methods/auction guidance and its sources without completing earlier stages.

These are scenario checks and code review, not evidence of real-user comprehension. Physical-device testing, human usability sessions and professional NZ editorial review remain before a public release.
