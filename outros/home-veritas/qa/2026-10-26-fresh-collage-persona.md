# Independent simulated novice-buyer walkthrough — 26 October 2026

Persona: NZ first-home buyer with little mortgage/legal knowledge and ordinary digital confidence. Independent agent, Chrome mobile 390 × 844, clean homepage, visible navigation/search only; no code or previous report hints. No human participants. Screenshots were assessed before text snapshots, but captions were visible: this is not a controlled image-only comprehension study.

| Task | Route | Initial result |
|---|---|---|
| Rent/buy full costs | Home → starting out → compare → Look closer → Questions & sources → repayment FAQ | Answer found, but principal/interest distinction too deeply nested. Images communicate flexibility versus bills/repairs. |
| Commute, family, future plans | Starting out → What needs to fit? | Pass. Commute, shared space and possible moves distinguish the three considerations. |
| Can I bid with preapproval? | Search preapproval → answer → Full explanation | Pass with captions: conditional, expires, specific property/final loan still needs approval before bidding. Images alone do not establish conditionality. |
| Inspection versus LIM | Search LIM → answer → Full explanation | Pass. Physical check versus plans/records is visually clear; captions explain the limits. |
| Seller report versus own inspection | Search seller report → answer | Pass with captions. Images distinguish report handover from direct inspection, but legal reliance requires text. |
| Curtains/fridge included? | Search curtains fridge → no match → curtains → answer | Partial initially; recovered. Three scenes convey viewing, written agreement, then recheck. |
| Two deposits paid twice? | Search two deposits → answer | Pass with text. Coins/envelope alone could imply two separate costs; heading and captions clarify one price in stages. |
| Settlement delayed | Search settlement delayed → answer | Pass. Phone → waiting van → keys gives order; lawyer, insurance and contractual qualifications need captions. |

All eight questions were ultimately answered. Six searched legal/finance explanations and rent comparison exposed Full explanation and official sources. External source destinations were located, not revisited or verified in this usability run.

## Findings and remediation

- P2: `curtains fridge` failed despite the relevant answer existing. Added everyday fridge/refrigerator synonyms in all four languages and a regression test.
- P2: costs distinction buried on browse route. Brought debt reduction versus costs into first-layer rent/buy visual captions, including applicable shared levies/ground rent and transaction costs, in all four languages.
- P3: final panel/cautions can be below the mobile fold, especially in Search. Retained clear early labels and complete captions; scrolling still necessary for some answers.
- P3: illustrations explain context better than legal/payment rules. Captions remain essential; no image-only comprehension claim.

Escape/focus recovery, Enter to reopen Search, Tab to Useful links and return to All interest areas worked in the initial walkthrough. Main technical audit subsequently detected Escape on a populated search field could clear text instead of closing; explicit Escape-to-close was added. Automatic closing of sibling accordions was removed. Detailed source text was preserved.

## Focused independent retest

All four checks passed on fresh mobile Chrome 390 × 844:
- `curtains fridge` immediately returned the correct included-items answer.
- First expanded rent/buy card showed debt reduction, ongoing bills and transaction/shared costs without Look closer.
- Opening another accordion left the earlier one open; observed scroll position stayed 0 → 0.
- One Escape closed a populated Search and restored focus to Search.

The original eight-task run was before these fixes; this retest specifically verified the four changed behaviours. No human study or controlled image-only test was performed.
