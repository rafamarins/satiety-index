# A connected buyer journey

## Representation decision

Use a connected story + explorable world + searchable field guide. This preserves the existing illustration-led vision while serving two different needs: learning the buying process and finding an answer quickly.

| Approach | Useful for | Cost / limitation |
| --- | --- | --- |
| Linear illustrated story | Explaining sequence and building continuity | Slow for returning readers seeking one detail; can feel like slides |
| Fully branching decision tree | Exploring how circumstances change next actions | Many branches to maintain; risks implying personalised financial advice and hiding unchosen information |
| Story + world + field guide — implemented | One continuous example, optional exploration and fast reference | Requires a clear return to the saved story; adds a small amount of navigation state |

No new renderer, framework, CMS, AI service or runtime dependency is needed. Existing source-backed records remain the reference material. The story lives in a separate small module and refers to those records through existing scene IDs.

## The narrative

Alex is an explicitly fictional first-home buyer. The situation changes from renting, through savings and budgeting, to assembling a team, understanding borrowing, looking at a home, investigating it, considering the sale process, settlement and maintenance.

Ten moments replace ten disconnected introductions in the guided route. Each has a short situation, a meaningful question or takeaway, and a named continuation. Four optional choices cover renting/buying, adviser/direct lender, move-in-ready/renovation example, and negotiation/auction example. Other sale and property types remain accessible in the notes; these options are examples, not a claim to exhaust every circumstance.

Choices are educational, not eligibility inputs. They do not unlock a readiness score or certify a purchase. They affect a later line: renting changes the savings introduction, adviser/direct lender changes the loan introduction, renovation changes the inspection priorities, and auction changes the settlement context. The purchase proceeds only within the fictional example.

Loan understanding now precedes shopping and offers. Narrative order is not a strict real-life workflow: finance, checks and insurance overlap and may need repeating.

## Exploration and reference

- Guided routes: `#story/decide`, `#story/inspect/3` for a note within the story.
- Free exploration remains available through the whole home, pins, topic rail and picker. It does not overwrite the saved story position.
- Resume story returns to the last narrative moment. State and choices stay in the current browser tab.
- Field guide searches all 64 questions, ten checklists (including shortcuts/traps), and 15 official resource entries. It offers grouped entry points instead of presenting every answer at once.
- Search results prioritise direct question matches over incidental mentions in answer text. For example, “insurance” puts the insurance-before-unconditional question first.
- Existing illustrations, small pins, full-scene layout, demand-rendered world and reduced-motion behaviour are retained.

## Verification

- Syntax checks and three financial calculation tests passed; production build passed.
- Independent visible-UI walkthrough at 390×844 and 1440×900: renting consequence, map detour + resume, renovation consequence, insurance field-guide search and official source access all worked. No application-code hints were used in this repeat walkthrough.
- Deterministic browser checks: all ten story moments traversed at 320×568, including all eight choice buttons. No page overflow or clipped story-button content; reading text remained 16px.
- Renting → savings, renovation → checks and exploration → resume verified against rendered text and routes. Story route and choices survive reload.
- “Insurance” returned 16 results across questions, checklists and official links; a checklist result opened the corresponding checklist. Direct insurance question ranked first after the review fix.
- Mobile snapshot accessibility/quality audit: 31 passes, zero failures; performance excluded. No console errors or warnings in checked paths.
- Main JS: 28,925 gzip bytes, world module unchanged at 164,851 gzip bytes. Previous main bundle 25,571 bytes: increase 3,354 bytes. These are file compression sizes, not local server transfer sizes.

## Limits

These are simulated walkthroughs and browser checks, not research with first-home buyers. Short mobile screens still scroll within the reading pane; the illustration and next-step navigation remain visible. No physical-device performance or complete screen-reader study was run. Existing source review is dated 25 October 2026; this pass did not introduce new eligibility rules, rates or legal source claims. No deployment performed.
