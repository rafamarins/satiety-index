# Home Veritas — Portuguese, Spanish and Chinese journey review

26 October 2026. Local prototype; no deployment.

## Final result

| Language | Interest areas | Topics | Short answers | Unique deeper answers | Natural searches | Calculators |
|---|---:|---:|---:|---:|---:|---:|
| Brazilian Portuguese | 6 | 15 | 45 | 68 | 7 | 3 |
| Spanish | 6 | 15 | 45 | 68 | 7 | 3 |
| Simplified Chinese | 6 | 15 | 45 | 68 | 7 | 3 |

All final browser checks passed, with no page errors. Raw evidence: [multilingual-journey.json](2026-10-26-multilingual-journey.json). Across the three languages: 135 short-answer checks, 204 unique deeper-answer checks and 21 search scenarios. Source panels, About, localized no-results and deep-load errors, language persistence and calculator interaction also passed. Desktop, phone and 320px reflow inspected; no horizontal overflow detected. Rendered screenshots saved as 2026-10-26-journey-pt-BR.png, -es.png and -zh-Hans.png.

## Method

- Two independent read-only agents reviewed Portuguese/Spanish and Chinese source wording against the English guide. They also ran bounded newcomer journeys through actual language controls and visible Search/navigation, using isolated Chrome contexts.
- Main automated sweep selected each language through a real touch interaction, entered all six interest areas through visible links, then checked every topic and all three short disclosures. Full explanations were opened so original paragraphs, checklist-like explanatory points and gotchas could be compared to the corresponding localized data.
- Every topic FAQ panel was opened. All 68 unique questions, complete answers and original source URLs were verified per language; repeated FAQs were deduplicated by stable identity.
- Each of the 21 natural queries had to return its relevant deeper FAQ, and that answer had to contain the full localized wording. Tested query definitions live in multilingual-journey-cases.js.
- Compared rendered pages against substantive English guide strings and checked literal UI translation keys for unintended English fallback. No unlocalized important guide copy was detected. Official scheme/document names remain alongside local explanations. External official destinations may use English and were not re-audited during this test.
- This combines automated functional coverage and agent language review. It is not a human native-speaker study or renewed financial/legal certification.

## Issues found and fixed

### Search

The original search required every query word to occur literally. Ordinary phrases failed despite the answer existing: `quando pagar o sinal`, `nevera incluida`, `atraso na entrega das chaves`, `preaprobación hipoteca` and most unspaced Chinese queries.

Added Portuguese/Spanish question/function words, everyday inflections and relevant synonyms. Chinese now uses word segmentation while preserving domain terms that the general segmenter splits, including 首付, 验房 and 预批. Matched both older 订金/定金 searches and the clarified 合同预付款 terminology. Added relevant search tags so renovation-permission and flood-insurance queries reach the direct permission/risk FAQs as well as topics. Exact word boundaries still prevent LIM matching unrelated words and keep lender preapproval distinct from council consent.

Independent fresh-browser retests passed all original 14 Portuguese/Spanish and seven Chinese questions. The final automated run then required the direct permission FAQ for renovation searches.

### Readability and meaning

- Explained council, body corporate, townhouse, cashback and clawback in Portuguese/Spanish. Kept NZ document names in parentheses alongside explanations.
- Corrected Spanish headline grammar and Portuguese visual labels/phrasing.
- Clarified that the 5% First Home Loan example refers to a deposit, not a loan interest rate; retained eligibility and lender/property assessment qualifications.
- Standardized Chinese CCC and certificate-of-acceptance terms, property rates and offset terminology.
- Replaced inconsistent sales-deposit wording with a neutral advance-payment explanation, preserving that it is part of the purchase price and requires lawyer confirmation.
- Clarified Chinese wording about giving up contractual protections, explained First Home Loan and NHC/EQC, and made budget/planning phrases more natural.
- Focused review caught and corrected agreement errors introduced by glossary expansion and two Chinese fixed/agreed-amount substring errors. Added regression checks for those distinctions.

No material omissions were identified in the reviewed eligibility, conditional lending, property approval, auction timing, inspection/report limitations, consent distinctions, insurance exclusions, settlement rights or calculator assumptions.

## Verification and limits

- npm run check: 14 tests passed, including the 21-query regression matrix and localized terminology checks.
- npm run build: passed, root preview and dist package rebuilt.
- scripts/check-multilingual-journey.mjs: full sweep above passed. It requires QA_MODULES_ROOT containing puppeteer-core and a local Chrome installation. QA_BASE_URL can target another copy of the build.
- A repeated sweep initially clicked an old page element while route rendering was finishing. The harness now waits for the destination heading, rather than merely an existing heading/hash, before acting. Final evidence is from the completed run.
- Human native-speaker testing, physical-device assistive-technology testing and validation of changed external pages remain outside this run.
- No Git metadata in the workspace; no commit/push/deployment performed.
