# Accessibility review

Reviewed on 24 October 2026 against [WCAG 2.1 Level AA](https://www.w3.org/TR/WCAG21/).
This is a local implementation review, not an independent conformance certification.

## Changes made

- Added shared typography sizes: 16px body and control text, an 18px desktop
  introduction, and a 14px minimum for secondary labels. The reading size is
  preserved on mobile; small-screen overrides no longer shrink it. Headings and
  the study's lead paragraph retain their larger editorial sizes.
- Adjusted the mobile header, study facts, ranking rows and score labels for
  larger type. Chart labels now stay in document flow, and the ratio explanation
  can wrap beneath its number when text is enlarged.
- Replaced the remaining symbol-character icons with inline SVGs. Site-authored
  arrows, the selected-food marker and decorative star now use matching outline
  strokes on desktop and mobile. Decorative icons are hidden from assistive
  technology. The food chooser remains a labelled native select, including its
  platform-native picker when opened.
- Increased input and button boundary contrast. The light-theme muted text was
  darkened so it also passes on highlighted food rows.
- Made the header wrap and the mobile food details use one column. Enlarged
  text no longer pushes the score or explanation outside the viewport.
- Increased small explanatory copy and touch control sizes. Site navigation
  buttons and category filters have at least 44-pixel-high targets.
- Converted the ranking to a labelled semantic list with list items. Its selected
  marker is decorative; button names and pressed states convey the information.
- Gave the theme toggle a stable accessible name and retained its pressed state.
  The study link announces that it opens a new tab.
- Disabled CSS transitions and animations completely under reduced motion.
  The existing JavaScript preference guards also suppress the image entrance
  and animated score.

## Verified

The repeatable [audit script](../scripts/check-accessibility.cjs) uses axe-core
4.10.3 and isolated Chromium pages. It writes the complete
[machine-readable report](qa/accessibility.json).

- 78 automated scans: all 38 foods in each theme at 390 CSS pixels, plus one
  desktop food view in each theme at 1440 CSS pixels. Zero reported WCAG A/AA
  or best-practice violations.
- Normal reflow and WCAG text-spacing overrides at 320, 390, 768, 1024 and
  1440 CSS pixels in both themes. A 320 CSS-pixel viewport exercises the reflow width specified
  for a 1280-pixel-wide desktop at 400% zoom. This is not a native browser-zoom test.
- A 200% computed text-size override at 320, 390, 768 and 1440 CSS pixels in both themes.
  No horizontal overflow or tested text/control boxes outside the viewport.
  Captures include [header](qa/text-resize-header.png),
  [food details](qa/text-resize-food.png),
  [ranking row](qa/text-resize-ranking-row.png) and
  [text spacing](qa/text-spacing-mobile.png).
- Ten rendered typography checks across both themes and all five viewport
  widths: no visible text below 14px, body copy and food names at 16–18px,
  and no text extending horizontally outside the viewport at default size.
  Visually inspected the comparison, study, ranking and footer on mobile and
  desktop. Full-page captures: [mobile light](qa/typography-mobile-light.png),
  [mobile dark](qa/typography-mobile-dark.png),
  [desktop light](qa/typography-desktop-light.png),
  [desktop dark](qa/typography-desktop-dark.png).
- Browser keyboard tests for the first-tab skip link, its select target,
  subsequent focus, visible focus outline, arrow navigation and theme activation.
- Chromium accessibility-tree inspection confirms the ranking list and all
  38 list items. Image names, native select labels, live selection/filter status,
  hidden decorative icons and pressed controls were also inspected.
- Browser-generated touch input, not synthetic DOM pointer events, confirms
  both swipe directions and native vertical scrolling without changing food.
  Previous/next buttons and the select remain alternatives to swiping.
- Pointer selection under reduced motion produces the final score immediately
  with no running image or CSS transition. Nine navigation unit tests also pass.
- Existing food identifiers, names, scores and categories remain unchanged.
  Replay was removed and its old error instructions replaced. Image-loading
  failure and subsequent selection were checked in the browser.

The automated scanner marked the desktop illustration caption contrast for
manual review because of its illustrated surroundings. The caption has a solid
paper background. Direct computed-colour verification gives 5.54:1 in both themes.
Control boundaries measure 3.33:1 in light mode and 3.69:1 in dark mode.

## Criteria covered by implementation and checks

| Area                              | WCAG 2.1 criteria                                      | Evidence                                                                                                                  |
| --------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Alternatives and structure        | 1.1.1, 1.3.1, 1.3.2                                    | Named illustrations and score graphic, headings, landmarks, list semantics, complete text scores                          |
| Colour, text and layout           | 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.12            | Text plus graphical scores, contrast scans and measurements, resize and spacing checks                                    |
| Keyboard and focus                | 2.1.1, 2.1.2, 2.4.1, 2.4.2, 2.4.3, 2.4.4, 2.4.6, 2.4.7 | Native controls, skip link, page title, meaningful links, keyboard and focus checks                                       |
| Touch and understandable controls | 2.5.1, 2.5.2, 2.5.3, 3.1.1, 3.2.1, 3.2.2               | Single-pointer alternatives, release/cancel handling, labels, English language declaration, no focus-triggered navigation |
| Robust dynamic updates            | 4.1.1, 4.1.2, 4.1.3                                    | Automated markup/ARIA checks, accessibility tree, pressed states and live status text                                     |

The page has no audio/video, authentication, time limits, transactions, complex
data-entry forms or motion-actuated controls. Arrow keys are not single-character
shortcuts. The site does not restrict screen orientation or disable browser zoom.
Reduced motion and generous touch targets are additional usability measures;
they do not by themselves establish conformance.

## Remaining human validation

Before making a full WCAG conformance claim, test the complete browsing flow
with VoiceOver in Safari on macOS/iOS and NVDA in a Windows browser. Confirm
actual spoken announcements, virtual-cursor order, the native mobile picker,
browser zoom and forced-colour/high-contrast settings. Physical-device and
disabled-user testing have not been performed in this review. Automated results
and a Chromium accessibility tree cannot replace those checks.
