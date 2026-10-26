# Collage novice-buyer retest — 26 October 2026

## Verdict and limits

Independent agent simulation in real Chrome, with no code, route or previous-report hints. Desktop 1440 × 1000 followed by selected mobile tasks at 390 × 844. Initial outcome: seven passes, one partial discovery failure. Three targeted retests passed after fixes. A subsequent smoke test passed after the user requested removal of saving/exporting.

This is not human research or proof of image-only comprehension. Collages helped orient the simulated reader; captions carried financial/legal specifics. No category dead ends or lost navigation context were observed in the tested paths. Images, wording and navigation were assessed through rendered screenshots and visible UI. Approximate clicks below are observations, not timing or population statistics. No source destinations, physical devices or full screen-reader workflow were checked. The tester used only its own isolated tabs, closed them afterwards, and did not modify saved data or notes.

## Initial tasks

| Goal | Visible path | Result |
| --- | --- | --- |
| Understand rent/buy | Home → Is buying right for me? → Compare whole picture (2 clicks) | Pass with captions. Suitcase suggests moving/flexibility; umbrella/tools suggest ownership responsibilities. Image alone does not identify interest/rates/insurance. |
| Compare rent with mortgage repayments | Comparison → Look closer → More detail → repayment FAQ (~5 clicks from home) | Pass. Correct principal/interest distinction, other bills and transaction costs. Repetition delayed the deeper answer. |
| Find preapproval guidance | Search “preapproval”, then “pre-approval” | Partial discovery: first spelling failed. Recovered FAQ correctly explained conditional approval, expiry, actual-property/final-loan checks and confirmation before unconditional commitment. |
| Separate inspection/paperwork; seller reports | Search inspection → LIM FAQ → seller-report FAQ | Pass. Condition/limits versus records; seller-report commissioning, date, exclusions and legal reliance; own inspections also limited. |
| Know what stays | Mobile search curtains → FAQ | Pass. Ask, write the list, check before signing and compare before settlement. Potential ambiguity in the displayed ≠ symbol. |
| Deal with settlement delay | Search settlement delays → first FAQ | Pass. Lawyer escalation, flexible plans, confirmation before keys; no automatic rights assumed. |
| Return and change area | Deep FAQ → Close → Explore → Checking a property | Pass. Expanded main answer and focus restored; switching areas clear. |
| Discover Saved's purpose | Saved → empty view | Pass for discovery only. It described keeping answers/questions for a viewing or adviser. This feature was subsequently removed at the user's request. |

## Changes prompted by observations

1. **Search:** normalize preapproval, pre-approval, pre approval, pre‑approval and preapproved. Added Portuguese/Spanish equivalents and Chinese mapping. Regression checks prevent confusing these with council/building consent.
2. **Critical wording:** replaced the hard-to-distinguish ≠ headline with “Seeing it doesn’t mean it stays.” All four languages use explicit words.
3. **Repeated layers:** the detail panel now starts with related FAQs. Removed the repeated short summary/collage and moved shortcuts after the questions. Original short content remains on the main answer; full FAQ explanations and sources remain available.
4. **User-requested simplification:** removed Save answer, Saved, notes, print/PDF and download controls and code. Main detail action is Questions & sources. Retired saved/print URLs resolve to the overview. Old browser data is left untouched, but no longer read or written; language preference remains.

## Targeted independent retests

Fresh isolated mobile tab at 390 × 844:

- Both preapproval and pre approval find and open the correct finance FAQ: pass.
- Curtains headline clearly says “Seeing it doesn’t mean it stays.” with no mathematical-symbol ambiguity: pass.
- Details open directly to questions; repayment FAQ visible as the second entry, full explanation and Settled source present: pass.
- Close restores expanded comparison, scroll context and focus to the detail control: pass.

## Final simplified-flow smoke test

A further fresh isolated mobile tab:

- Home → What can I afford? → The whole cost → Everyday bills → Questions & sources → “Which costs keep coming after I move in?” worked (5 clicks).
- Ongoing costs, property-specific figures/future increases and source links remained clear.
- Close restored Everyday bills and focused Questions & sources.
- Search preapproval still worked.
- No saved, note or export controls in the sampled header, main answer, details or search answer.

## Engineering checks

- Eleven tests passed, including the new preapproval spelling regression and retired-route fallback. Build passed.
- Packaged mobile UI checked in English, Portuguese, Spanish and Simplified Chinese: no retired controls, translated Questions & sources / detail headings, available FAQ source links, no horizontal overflow.
- Remaining caution: repeated house/key/document imagery does not uniquely identify different contract types. Keep captions visible. A real novice-user study is still needed to measure understanding; no image-only comprehension claim is made.

Main changes: home-truths-search.js, home-truths-answer-visuals.js, home-truths.js, home-truths.html, home-truths.css, home-truths-navigation.js, home-truths-i18n.js, home-truths-answer-layout.js and home-truths-content.test.js. No deployment.
