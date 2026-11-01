# Home Veritas worked-examples draft — 1 November 2026

Status: Rafael approved publication on 1 November 2026. The reviewed examples are now integrated into the main guide; this local page remains a review surface.

Preview: http://127.0.0.1:4186/concepts/2026-11-01-illustrations/

## Current direction

Rafael rejected the dimensional icon direction because it brought little explanatory value and conflicted with the site's photographic collage identity. The active draft now reuses the existing photographic cut-outs, torn cobalt paper, yellow background and Anton/DM Sans typography. No new image assets or icon system were introduced in this revision.

- Deposit: the existing house/cost collage accompanies an adjustable deposit/loan split. Changing10%/20% updates the real amounts and proportional bar.
- Mortgage: the existing collage accompanies a6%/7% payment comparison. Selecting a rate highlights the matching repayment and announces the amount/difference. Assumptions remain visible.
- Records: existing council-document and building-inspection collages sit beside specific explanations and limitations. Both are visible for comparison; there is no decorative animation or play button.
- Dropdowns retain custom chevrons inset16px,44px right padding and native keyboard behaviour.
- Four languages, keyboard tabs and reduced-motion support remain.

Only the contribution bar moves as its value changes. No WebGL, iframe, animated icons or Three.js is loaded by the active draft. The earlier3D board files are retained in `superseded-3d/` as historical source, not linked from this preview. The old renderer/assets/motion test outside that folder also belong to the superseded experiment and are not used by the current page.

## Files and verification

`index.html`, `draft.css`, `draft.js` own this isolated review page. The review page shares the production example module and existing image assets.

`../../scripts/check-illustration-draft.mjs` is the current verification entry point. It checks72 states across Chromium/WebKit, four languages, three topics and320/390/1280px layouts, including accessibility, overflow, dropdown spacing, deposit math, rate selection, collage references, keyboard behaviour, reduced motion and absence of retired3D embeds. Current evidence: `qa/collage-report.json`, `qa/collage-draft-desktop.png` and `qa/collage-*-mobile.png`.

Release checks and publication are recorded in `../../qa/2026-11-01-collage-release.md`. Historical 3D files remain local and are excluded from the release.
