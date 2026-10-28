# Mobile icon correction — 28 October 2026

The reported iPhone screenshot shows a Unicode northeast arrow rendered as a
blue emoji inside each card's outline. CSS font selection cannot reliably control
emoji presentation across operating systems, so navigation no longer uses text
characters as icons.

## Changes

- Added a small inline SVG helper with strokes that inherit each control's colour.
- Replaced card, related-topic, back, jump, source-link and action arrows, including
  icons in translated labels, search results and the detail-load failure fallback.
- Replaced text menu, search, close and accordion +/- controls with SVG geometry.
  The open accordion hides the vertical stroke without animation.
- Preserved the existing square outlines and dimensions. Icons are centred, have
  explicit dimensions, are hidden from assistive technology and cannot take focus.
- Removed the source-list pseudo-element arrow and the unused old dropdown glyph.
  The language flags and existing geometric dropdown chevron retain their design.
- Kept translation keys and content intact; decorative arrow characters are removed
  only when rendering the translated action label.

## Verification

- All 15 Home Veritas content/calculation tests pass.
- Parent build and strict deployment validation pass: 251 public files and all
  script, image and stylesheet budgets maintained. No new runtime dependencies or
  icon/font requests. Entry JavaScript is 28,345 bytes gzipped; CSS is 6,480 bytes
  gzipped.
- `scripts/check-mobile-icons.mjs`: 64 states in Chrome and Playwright WebKit 26.4,
  with English, Brazilian Portuguese, Spanish and Simplified Chinese. Covers home
  widths 320/428/1440, area/topic links, accordions, deeper answers, sources and
  search, including native keyboard dialog closure/focus restoration.
- All 64 states have zero axe violations, no horizontal overflow and no navigation
  glyphs in link/button text or generated CSS. Every decorative SVG has the correct
  namespace, `aria-hidden="true"` and `focusable="false"`.
- All six card arrows remain centred and have identical SVG bounds when the holder
  is forced to use Apple Color Emoji.
- Chrome and WebKit Portuguese renders inspected. Local screenshots and JSON are
  under `qa/mobile-icons-2026-10-28/`, excluded from Git and deployment.
- Sequential default mobile Lighthouse checks on all four home-page languages:
  performance 99, accessibility 100, best practices 100, CLS 0, LCP about 2.0–2.1 s.
  SEO remains 63 because the prototype intentionally retains `noindex`.
- `git diff --check` passes. Existing unrelated Outros screenshot modifications
  were preserved.

WebKit provides a Safari-engine regression check; this is not a physical iPhone
test or a complete accessibility certification. The user-provided screenshot is
the evidence of the original device failure.

Run the focused browser check from this folder with an external Playwright/axe
installation (and installed Chromium/WebKit engines):

```sh
QA_MODULES_ROOT=/absolute/path/to/node_modules node scripts/check-mobile-icons.mjs
```

Set `QA_AXE_PATH` to the absolute `axe.min.js` path if installed separately. Optional
`QA_BASE_URL`, `QA_REPORT_DIR` and `QA_ENGINES` override the preview, output folder
and comma-separated browser list. Raw test outputs are kept locally.
