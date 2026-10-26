# Verification — 25 October 2026

## Full-scene hotspot revision — 26 October 2026

Removed selection zoom and the separate scene navigation list. The whole illustration remains fitted in view; the original hotspots remain clickable in reading mode. A dark active marker plus a faint outline identifies the selected part. The larger reading area remains. The selected state follows the displayed scene, so selecting another home hotspot changes the note without swapping to an unrelated set of controls.

Verified desktop 1440×900 and mobile 390×844 visually. At 320×568, traversed the home scene and every chapter: one selected hotspot, none clipped or overlapping, and no page overflow. Adjusted compact hotspot positions where labels collided. No console errors/warnings. Syntax, build and all three finance tests passed. Final mobile Lighthouse snapshot: 31 passed, zero failed (`lighthouse-full-scene.json`). The preview server was restarted at port 4185.

The earlier zoom and list details below describe superseded iterations.

## Motion and reading revision

The latest revision keeps all scene destinations visible in a fixed navigator during reading, highlights the current choice, and uses a gentle 1.3× zoom. Map navigation is also visible on phones. Topic text gets most of the screen and larger type; the scene is quieter while reading. ArrowUp/ArrowDown and PageUp/PageDown scroll the reading pane rather than unexpectedly changing chapter. Escape returns to the scene.

- Syntax, three finance tests and build passed after integration.
- Desktop 1440×900 and mobile 390×844 / 320×568 visually inspected. Scene destinations remain visible; page dimensions stay within the viewport. Long text scrolls within the reading pane.
- Switching through the fixed scene navigator, quick chapter changes, return-to-scene, reduced motion and unavailable-WebGL fallback exercised. No stuck loading or inert state after rapid navigation.
- In a local Chrome sample with 4× CPU slowdown, home ambient animation made 53 draw calls in 2.2 seconds; reading made zero in 1.2 seconds after the transition. The focus transition sample had 79 frames, p95 and maximum frame intervals of 16.8 ms. This test preceded the later reduction from 1.8× to 1.3× zoom and addition of fixed scene navigation; it is bounded local evidence, not a physical-device guarantee.
- Reduced-motion mode: zero idle draw calls in a 1.5-second sample.
- Final small-mobile reading Lighthouse snapshot: 31 passed, zero failed (`lighthouse-motion.json`). No console warnings/errors on the normal renderer. The simulated WebGL failure uses the intended image fallback.
- No extra dependencies or media assets. Main bundle approximately 25 KB gzip; separate world approximately 165 KB gzip (see `build.json`).

The original zero-idle-draw result below describes the earlier static-world version. The current home scene deliberately animates in short 24 fps cycles separated by rest; it pauses while reading, hidden, or motion is off.

## Original concept checks

- JavaScript syntax checks and all three targeted finance tests (`npm run check`).
- Production build, then browser smoke test of `/dist/`; one current world chunk, no source PNGs or unused original hero shipped.
- Desktop 1440×900, mobile 390×844 and compact 320×568 browser inspection. The page fits the viewport without horizontal or page-level vertical overflow. Notes and small-screen chapter text have their own scrolling area.
- All ten chapters, scene hotspots, search, notes, checklists, deposit control and mortgage calculator exercised. Rapid navigation ends on the requested chapter without stuck loading/inert state.
- At 320×568 the six home hotspots are fully within the scene and do not overlap; start action remains visible.
- Keyboard skip link preserves the selected chapter and focuses its heading. Chapter rail uses visible labels as accessible names.
- Reduced motion, HTML fallback with WebGL unavailable, and back/forward cache restoration exercised.
- Final Lighthouse snapshot of the packaged home screen: 31 passed audits, zero failed. Accessibility, best practices, SEO and agentic browsing categories returned 100. Snapshot excludes performance and is not a full accessibility certification. Report: `lighthouse.json`.
- No console errors/warnings observed during the main navigation checks.

## Performance observations

Local desktop sampling recorded zero WebGL draw calls during 1.3 seconds at rest. One transition sample covered 74 animation frames averaging 16.37 ms, worst 16.8 ms. This is bounded local evidence, not a guarantee for every browser/device. Mobile viewport emulation is not a physical low-end phone test.

Bundle byte counts and gzip measurements are in `build.json`; illustration sizes are in `images.json`. Gzip sizes describe artifacts, since the local preview server does not enable compression.

## Source links

31 unique URLs checked: 28 returned successful HTTP responses. Three returned HTTP 403 to the automated checker: Auckland Council rating valuations, a Banking Ombudsman cashback case and the NZ Law Society email-fraud page. These were read during source research, but automated availability remains unverified. No 404 was found. See `links.json` and `../SOURCES.md`.

## Visual record and limits

`world-desktop.png` shows the current single-screen concept. The older `desktop.png` belongs to the superseded scrolling design and should not be used as the current preview.

This is a local concept, not a deployed service. It has broad coverage but has not received a professional legal/lending editorial sign-off. There is no claim that one generic checklist covers every property or buyer.

## 26 October 2026 — pins, orientation and persona walkthroughs

See [the persona review](persona-review-2026-10-26.md) for canonical findings, changes, tested tasks, evidence and limitations. Stable map/reader proportions, small labelled 44px-target pins, explicit map/chapter/note routes, named Next actions and short fixed-frame transitions replace the previous shifting layout and camera travel. Build and checks passed; all 37 pins passed at 320/390/1440px; final mobile Lighthouse snapshot had 31 passes and no failed audits. Three simulated persona task paths completed. No real participants or physical-device results are claimed.

## 26 October 2026 — connected buyer story and reference structure

[Story design and verification](story-design-2026-10-26.md) records the representation comparison, implemented hybrid, narrative choices, preserved free exploration and unified field guide. Independent UI paths and all ten moments at 320px passed; mobile snapshot audit 31 passes/0 failures. Real-reader comprehension remains untested.
