# Redesign verification — 24 October 2026

## Readable typography

- Body copy, food names and the selector now use 16px; the desktop introduction
  uses 18px. Secondary labels have a 14px floor in both themes and at every
  breakpoint. Larger editorial headings and study lead are retained.
- Rebalanced the mobile header, study facts, chart labels and ranking rows.
  Preserved the monochrome palette, illustration paper and existing navigation.
- Inspected mobile and desktop views in light and dark themes. Ten rendered
  typography checks confirm the size floor and no default-size text outside the
  viewport. All 78 automated accessibility scans and 28 reflow, text-spacing and
  simulated 200% text-size checks pass. Navigation and illustration checks pass.
- Added the typography checks and four full-page captures to the repeatable
  accessibility audit. See [the accessibility review](ACCESSIBILITY.md) for
  evidence and the remaining physical-device and assistive-technology checks.

## Copy, mobile icons and accessibility

- Removed Replay, its handler and unused styles. Updated failure copy to give a
  valid recovery action. Rewrote page headings, study explanation, all 38 food
  notes, captions, navigation labels and limitations. Original names, categories,
  identifiers, illustration mapping and scores are unchanged.
- Verified every food in both themes: 76 checks for names, scores, descriptions,
  plain captions and the absence of Replay. Checked the image-error state and
  recovery through another selection. No browser errors or warnings.
- Replaced Unicode decorative symbols with consistent inline SVGs, including
  the selected-food marker. Kept the native mobile food picker for accessibility.
- Fixed enlarged-text overflow, improved control/text contrast, list semantics,
  small-screen reading sizes and reduced-motion handling.
- See the [accessibility review](ACCESSIBILITY.md) for automated results, keyboard,
  touch, contrast, text spacing and resize evidence, and remaining human testing.

## Consistent illustration paper and gesture navigation

The user chose a reliable, fixed paper field instead of further automatic
transparent-edge cleanup. The exploratory contour/erosion changes were removed;
the food shading is unchanged. Only the illustration-and-caption panel stays
`#f7f6f2`, with local dark text and light-theme caption/registration colours.
The food information, controls, and rest of the page still follow the theme.

| Before                                        | After                                                                                    | Why                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Pale paper attached to transparent food edges | A consistent paper surface across the whole illustration panel                           | Natural shading without a fragile cutout promise         |
| Buttons and selector only                     | Left/right shortcuts and touch swiping, with existing controls retained                  | Faster browsing without removing accessible alternatives |
| Possible browser gesture conflicts            | Native vertical scrolling and pinch zoom, protected form controls, cancellation handling | Navigation should not hijack other interactions          |

- Reviewed all 38 foods in light and dark on their final paper field; contact
  sheets: [light](qa/paper-panel-light.png), [dark](qa/paper-panel-dark.png).
- All 76 browser selections passed for fixed paper/ink, the correctly themed page,
  correct names/scores, one illustration, and immediate keyboard selections.
- Real ArrowRight/ArrowLeft key presses selected Oranges/Porridge in sequence;
  keyboard selections ran no image animation. A focused selector retained its
  native arrow behaviour without triggering the global shortcut.
- Nine navigation tests passed, covering directions, modifiers, editable/native
  controls, offscreen scope, tiny/vertical/diagonal/mouse drags, cancellation,
  multi-touch, interactive targets, one step per swipe, and listener cleanup.
- Browser pointer-event integration selected the expected next/previous foods
  and ignored vertical/cancelled swipes. Pointer capture was stubbed for synthetic
  events; no physical-phone gesture testing was performed. The live touch surface
  uses `pan-y pinch-zoom`, leaving those gestures to the browser.
- Inspected desktop and 390 px mobile rendering. Checked 320, 390, 768, 1024,
  and 1440 px: no horizontal overflow; panel stays within the viewport.
- Illustration static/render checks, JavaScript syntax, and formatting passed.
  No browser console errors or warnings.

## Previous transparent food cutouts (presentation superseded)

- Rebuilt all 38 SVGs with subject-only light surfaces and transparent
  surroundings. No rectangular paper background, inversion filter, or drawing
  animation remains. Individually reviewed lower outlines separate food from
  ground hatching; soft contact edges avoid hard paper patches.
- Visually reviewed the complete collection on light and dark backgrounds, plus
  the main Crisps view on desktop and at 390 px. Current contact sheets:
  [light](qa/transparent-cutouts-light.png),
  [dark](qa/transparent-cutouts-dark.png).
- Selected every food in both themes: 76 checks passed for natural ink,
  subject surfaces, nine tonal layers, correct labels/scores, one SVG, and no
  legacy paper or stroke-reveal elements.
- Rendered all 38 SVGs to verify transparent surrounding pixels and opaque
  subject interiors. Static illustration checks and JavaScript syntax passed.
- Rapid selection through all 38 foods settled on the correct final food and
  score, with one illustration and no running animation. Reduced-motion pointer
  selection of Crisps showed 91% immediately; real keyboard activation selected
  Yogurt at 88%, retained button focus, and ran no image animation.
- Rechecked 320, 390, 768, 1024, and 1440 px after layout settled: no horizontal
  overflow; artwork stays within the viewport. The native entrance remains
  220 ms and finishes cleanly. No browser errors or warnings. Formatting passed.
- Added an AI-generated-art disclosure and documented the generated-art origin,
  output ownership terms, third-party-rights caveat, and separate historic stock
  licences in the illustration provenance. Research and dependency credits remain.

## Previous natural shading and short image entrances (paper superseded)

- All 38 plates now have intrinsic graphite (`#242321`) and paper (`#f7f6f2`)
  colours. Theme changes affect the surrounding page, not the food's lighting.
- Selected all 38 foods in both themes (76 browser checks): fixed ink/paper
  colours, complete tonal layers, correct labels/scores, no inversion filters,
  no stroke-animation metadata, and one current illustration. All passed.
- Removed stroke drawing and timed shading. The complete artwork enters using
  only opacity and transform, with a 220 ms native animation; paper stays still.
  Local samples showed partial entrance at 45/128 ms and no animation at 295 ms,
  with all shading present and no dash animation throughout.
- Rapidly selected all 38 foods: the final plate and score were correct, one SVG
  remained, and no animations or stroke timing attributes were left running.
- Real keyboard activation selected Apples at 197% with no entrance animation
  and retained focus. Reduced-motion pointer selection of Cheese at 146% was
  also immediate, with zero running image animations.
- Checked 320, 390, 768, 1024 and 1440 px: no horizontal overflow; paper fits.
  Inspected desktop/mobile rendering and the full light/dark contact sheets.
- JavaScript syntax and illustration checks passed. No browser errors/warnings.
- Current contact sheets: [light](qa/natural-shading-light.png),
  [dark](qa/natural-shading-dark.png).

## Previous stroke-by-stroke refinement (superseded)

- Rebuilt and visually reviewed the complete set of 38 plates in both themes.
  Review page: [all illustrations](illustrations-review.html).
- Replaced the 45 horizontal mask passes with real, open centre-line paths.
  The actual pen marks animate; nine tonal strengths restore material detail.
- Removed detached neighbouring-atlas fragments found during the full-set review.
- No whole-image fade-in. A local browser sample showed partial pen paths at
  109 ms, full shading by 709 ms and the completed drawing at 1309 ms.
  These are local measurements, not a promise about network or device speed.
- All 38 plates were selected and checked in the browser at 390 px with reduced
  motion: correct labels and scores, nine tonal layers, valid in-bounds drawing,
  no running drawing animation, and no horizontal overflow.
- Rapid animated selection through all 38 foods confirmed partial, growing pen
  strokes on every plate. After settling, only the final selected SVG remained,
  with no pending dash offsets and the correct score. No console errors/warnings.
- Rechecked 320, 390, 768, 1024 and 1440 px widths without horizontal overflow.
  Real keyboard activation selected Apples at 197% immediately, with no drawing
  animation, and retained focus on the next-food button.
- JavaScript syntax, illustration checks, and formatting checks passed.
- Final contact sheets: [light](qa/illustrations-light.png),
  [dark](qa/illustrations-dark.png).
- `node scripts/check-illustrations.mjs` covers all 38 files, open pen paths,
  absence of masks/raster embeddings, atlas isolation, and the 100% bread baseline.

## Earlier redesign checks

The following checks were recorded for the preceding redesign, before the
stroke-by-stroke refinement above.

- All 38 foods load a non-empty SVG; all scores match the previous dataset.
- White bread remains the 100% baseline, with boiled potato at 323%.
- Checked 320, 390, 768, 1024 and 1440 pixel layouts; no horizontal overflow.
- Inspected light/dark desktop and mobile rendering.
- Verified the food chooser, previous/next wrap, all six category filters,
  browser Back/Forward, redraw, rapid selection changes and asynchronous asset
  ordering. Only the final selected plate remains after transitions complete.
- Verified actual keyboard activation and focus order. Keyboard and reduced-motion
  selections render immediately; animated selections finish at the correct score.
- Desktop drawing sample: 106 animation frames over approximately 1.75 seconds,
  median frame interval 16.7 ms, 95th percentile 16.8 ms. This is a local desktop
  sample, not a claim about all devices.
- JavaScript syntax and Prettier checks pass. Browser reports no errors or warnings.

Lighthouse snapshot results: Accessibility 100, Best Practices 100, SEO 100, with
no failed audits. These are snapshot checks; they do not include a performance score.

- [Desktop, light](qa/desktop-light.json)
- [Mobile, light](qa/mobile-light.json)
- [Desktop, dark](qa/desktop-dark.json)

Artwork creation and source prompts: [provenance](../assets/illustrations/PROVENANCE.md).
