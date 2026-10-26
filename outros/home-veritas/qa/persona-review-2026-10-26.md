# First-home journey: persona review and fixes

26 October 2026. Local concept at http://127.0.0.1:4185/.

## Scope and method

Simulated persona walkthroughs, not research with real participants. We followed the NZ Votes pattern: a bounded task, observable actions and outcomes, canonical findings, then a repeat walkthrough. Knowledge, goal, device and input needs were kept separate from age. The independent baseline design assessment included source inspection; the post-change persona journeys used visible browser UI without application-code hints. Browser emulation does not establish comprehension or physical-device accessibility.

The original brief remains the product contract: a short, visual NZ first-home story in the Satiety Index design family; explore people and places like a small game; keep the scene whole, text readable, motion light, and deeper checklists, traps, FAQs and official sources available.

## Findings and changes

| Finding | Evidence before | Resolution |
| --- | --- | --- |
| FH01: Two screens claimed the same location | Your money opened deposit text over the home; opening its illustration changed the scene without changing `#deposit`. | Map previews use `#home/deposit`, chapters `#deposit`, notes `#deposit/1`. Reload and Back restore the correct view. Preview and Open chapter labels explain the handoff. |
| FH02: Selection moved the reader's bearings | Desktop column widths changed; mobile lead changed from 12px to 16px. | Stable scene and reading proportions in all states. Mobile body stays 16px, desktop 17px. A visible cue identifies more text below the reading pane. |
| FH03: Bulky controls covered the artwork | Pill backgrounds masked people and house details, but mobile hit height was only 32px. | 16–18px visible markers, light attached labels, transparent 44px hit height. Check, ring and underlined label indicate selection. No separate hotspot list. |
| FH04: Motion competed with navigation | 800ms camera flights, zoom out/in, pointer parallax and separate text movement. | 240ms fixed-frame scene dissolve, 180ms text opacity only. No pointer parallax or accidental swipe-to-change chapter. Idle home gestures remain; reading, hidden tabs and reduced motion pause them. |
| FH05: Facts lacked a clear next action | Generic arrow, ten equal steps, Questions shown only as 64 on mobile. | Plain story stages, one practical next move per chapter, named Next destination, visible Questions label. Existing deeper content preserved. |
| FH06: Small-screen retest found clipping | New Next control clipped its destination; 320px tap rectangles could intersect. | Corrected button sizing and spread compact pins into available scene space. Rechecked all 37 pins at 320, 390 and 1440px. |
| FH07: Checklist reload lost work | Ticks reset on reload. | Checked items and chapter visits persist in the current browser tab, with accurate copy. Storage failures fall back to in-memory operation. |

## Repeated persona tasks

| Perspective | Task and actual actions | Result |
| --- | --- | --- |
| Beginner renter, mobile 390×844 | Home → Your money → Open chapter 02: Deposit → KiwiSaver → browser Back | Answer and Kāinga Ora source found. Preview/chapter distinction explicit; Back restores deposit overview. Scene does not resize when the note opens. |
| Buyer preparing an offer, mobile 390×844 | Map → The checks → See the checklist → Questions → insurance question → renovated-home paperwork | Found insurance timing, lender/cover cautions, consents, code compliance certificates and certificate-of-acceptance limits, with sources. |
| Confident reader, age 67, keyboard and reduced motion | Home → ArrowRight to Decide → six Tabs to Questions → Enter → Escape | Motion reported disabled. Correct chapter questions opened; closing restored focus to the trigger. Age was not used as a proxy for ability. |

The first two perspectives vary knowledge and urgency, not age-related assumptions. No separate age-comparison study was run. These are successful tested paths, not evidence of learning, lower anxiety or purchase readiness.

## Design assessment

The paper, engraving, charcoal and rust identity is coherent. The principal issue was orientation, not insufficient decoration. Retain the whole home as a map preview because the user explicitly requested it. The extra Open chapter action is an intentional trade-off: it preserves the world and makes the transition explicit; a direct route remains available through the chapter rail and chapter picker.

Baseline Nielsen heuristic judgments, 0–4: status 2; real-world match 3; control 2; consistency 2; prevention 3; recognition 2; efficiency 2; minimalism 2; recovery 2; help 3. Total 23/40. These are reviewer judgments, not measured human usability. No artificial post-change score is asserted.

The scoped CLI detector returned zero findings in index.html. Live detector injection on a fresh local page reported seven rule categories, including tiny text, wide tracking, clipped positioned children and a thin-border/large-shadow dialog. Tiny navigation/body typography reinforced the manual findings. The clipped scene container is intentional for its canvas; independent pin bounds checks establish that navigation is visible. Eyebrow tracking and the existing paper drawer treatment were retained. Detector output alone did not detect the navigation model problem. The temporary detector server was stopped after capture.

## Verification

- `npm run check`: syntax checks and all three financial calculation tests passed.
- `npm run build`: passed; ten chapters, 64 FAQs and 15 resource entries retained.
- All 37 hotspot activations checked at 320×568, 390×844 and 1440×900: no intersecting tap rectangles, clipped pins, missing selected state or selection-driven scene size change. No horizontal page overflow. All pin targets at least 44px high.
- Mobile named Next destination fits its button; source text remains 16px. Long notes can scroll independently while the map and journey controls remain visible.
- Preview reload preserves `#home/deposit` and its selected pin. Note URLs are restored on reload; native Back restored the overview in the persona walkthrough.
- Reduced motion and native keyboard drawer open/close/focus return verified in the independent walkthrough.
- Mobile Lighthouse snapshot: 31 audits passed, zero failed. This excludes performance and is not full accessibility certification.
- No browser console errors or warnings in the checked final page.
- Main JS: 25,571 bytes gzip; separately loaded world: 164,851 bytes gzip. No new runtime dependencies. The local Python server does not gzip transfer; these are build sizes.

Evidence: [desktop](persona-desktop-2026-10-26.webp), [mobile](persona-mobile-2026-10-26.webp), [Lighthouse](lighthouse-persona-2026-10-26.json), [CLI detector](critique-detector-2026-10-26.json).

## Remaining limits

Real buyer comprehension, complete VoiceOver traversal and physical lower-powered phone performance were not tested. Narrow/short screens still need scrolling within longer notes; the new cue makes that explicit. The guide is a concept, not an exhaustive property-specific legal or lending checklist. Source facts were not revised in this UI pass; the existing 25 October source review remains the content baseline. No deployment performed.
