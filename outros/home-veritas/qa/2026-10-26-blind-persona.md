# Simulated blind first-home-buyer test — 26 October 2026

## Verdict

The simulated novice found the requested answers and recovered a saved question. There were no category-level dead ends in six desktop tasks. Familiar-word search and buried property terminology were the main friction. Those issues were addressed below. This does **not** establish human comprehension or a human success rate.

## Method

Independent agent persona: NZ renter, first purchase, unfamiliar with property terminology, limited patience. Used only rendered UI, accessibility snapshots, screenshots and DOM interaction. No source, route files or content files were inspected. Separate background browser tab, later closed; other tabs were preserved.

Six desktop tasks, followed by renovation/LIM lookup and saved-note retrieval at 390 × 844. Offer page visually inspected at 1440 × 900. No completion times claimed. Physical-device and screen-reader testing were not run. Initial Saved 0 restored; test note cleared through its visible textarea and checked after reopening.

## Observed paths

| Goal | Actual visible labels followed | Outcome |
|---|---|---|
| KiwiSaver eligibility and whom to ask | What can I afford? → Deposit & KiwiSaver → Ask your provider early | Found provider eligibility, usable amount and process; lawyer timing; balance warning. |
| Viewing checks | Where would I feel at home? → At a home visit → Look past the styling → Ask what has happened here | Found stains, smells, ventilation, leaks, alterations and written evidence. Selling-agent role was clear. |
| Renovation approvals and LIM | What am I really buying? → Records & consents → Do the changes add up? → What does the council know? → More detail, notes & links → LIM and renovated-home questions | Correct material found, but several openings and a long reference list made unfamiliar terms harder to decode. |
| Broker role and questions | Bank & broker chats → Who do you compare? → Know what you could owe → More detail, notes & links → Who is on my side? | Lender coverage and payment questions were clear; role explanation was less prominent. |
| Auction and lawyer timing | How do I get the keys? → Offers & contracts → Do the checks before bidding → Understand what binds you | Clear commitment warnings and professional review before bidding/signing. |
| Save and recover a question | Save these checks → Saved; agreement details → note → Close panel → Saved → Add or edit a note | Count, persistence, mobile retrieval and correct note reopening worked. |

## Confirmed defects and fixes

- **Search, medium:** “renovation” missed “The home has been renovated. What paperwork matters?” while “renovated” found it. Search now matches ordinary variants, related terms and selected multilingual synonyms. Browser recheck: renovation, reforma and roof approval all returned the paperwork answer.
- **Search, low:** “LIM” matched unrelated fragments such as “limit.” Word-aware matching reduced nine answers to the two directly mentioning LIM. Regression test verifies that “borrowing limit” does not match “LIM.”
- **Grammar, low:** “1 saved sets” changed to “1 saved set.” Browser verified.

## Usability concerns and remediation

- **Definitions, medium:** LIM and CCC appeared before explanation. The first council-record answer now defines LIM; CCC is expanded to code compliance certificate. Source clarification checked against [MBIE council records](https://www.building.govt.nz/getting-started/your-rights-and-obligations/homeowner-rights-and-obligations/buying-a-house/what-can-the-council-tell-you-about-the-house) and [MBIE CCC guidance](https://www.building.govt.nz/building-officials/guides-for-building-officials/code-compliance-certificates-cccs). Direct MBIE fetch timed out; indexed official result was available.
- **Reference depth, medium:** records detail exposed 23 FAQ disclosures, with LIM tenth. The seven topic-relevant questions now come first; sixteen wider questions remain under “More related questions.” No answers removed. Browser verified counts.
- **Broker roles, medium:** topic introduction now explains adviser/borrowing and lawyer/legal-risk roles. [FMA mortgage advice](https://www.fma.govt.nz/consumer/getting-advice/mortgage-advice/) and [Settled support team](https://www.settled.govt.nz/buying-a-home/thinking-of-buying/building-your-support-team-when-buying/) checked.
- **Mobile scanning, low:** tall hero delayed choices. Topic artwork reduced to 145 px maximum and a “See the questions” shortcut added. Stable breadcrumbs remain; no camera motion.
- **Exact answers after topics, low:** topic navigation still precedes the answer list. The focused word matching materially reduces noise, but a future human test should compare answer-first search ordering.

## Limits

This was an agent simulation, not independent human research or legal verification of the full guide. Tooling required an input event to clear the test textarea; that was not treated as an application defect. Official external links were not opened by the persona tester. Follow-up engineering checks verified fixes, but the full blind task set was not rerun by a new human/agent persona after changes.
