# Outros integration — 26 October 2026

## Result

Moved the full project source into `SatietyIndex/outros/home-veritas/` and added
project 03 to `outros/index.html`, using the existing directory layout and Home
Veritas's yellow collage. The original workspace path is a compatibility symlink
to this folder, so existing local references remain valid without a second copy.

The parent build generates Home Veritas and copies only its public package to
`dist/outros/home-veritas/`. Its exact Cloudflare routes, revalidation rules and
hashed-script cache rules are included in the parent configuration. No production
deployment, commit or push was performed.

## Verified

- Parent `npm run check`: 11 existing navigation/nutrition tests, illustration
  validation, 15 Home Veritas tests, combined build and deployment allowlist pass.
- Public package: 251 files across the directory and both local projects. Source,
  concepts, development tools and QA artifacts are excluded. Home Veritas script,
  stylesheet and image budgets pass.
- Wrangler deployment dry run passes. Its path-route notice is expected for this
  existing static-assets routing pattern.
- Directory browser check: eight combinations of 320/390/768/1440 px and light/dark
  themes pass automated accessibility, image decoding, reflow and text-spacing
  checks. Keyboard skip link, theme persistence, all three project links, no-JS
  reading and navigation pass. New screenshots were written under
  `/tmp/home-veritas-outros-qa/`; the four previously modified tracked directory
  screenshots were preserved.
- Full Home Veritas journey at the nested URL passes in English, Brazilian
  Portuguese, Spanish and Simplified Chinese. Each locale covers six interest
  areas, 17 topics, 51 short answers, 82 deeper answers, 14 searches and three
  calculators. Across 316 rendered states: zero automated axe violations, no
  horizontal overflow, no detected English-copy leaks and no page errors.
- Language choice, reload, localized missing-search results and localized failed
  detail-loading states pass from the nested path.
- Fresh default mobile Lighthouse runs, sequentially, on all four localized home
  pages: performance 99, accessibility 100, best practices 100; CLS 0 and LCP
  approximately 2.0–2.1 seconds. SEO remains 63 with the prototype's intentional
  `noindex` retained. These are local lab measurements, not field Web Vitals or
  full accessibility certification.
- Wrangler's local asset runtime returns a 307 from the slashless Home Veritas URL
  to its slash form, preserving `?lang=pt-BR`; the entry returns 200 with the
  configured security and cache headers. A private QA report URL returns 404.
- Desktop directory and mobile Home Veritas renders inspected in Chrome.
- `git diff --check` passes.

Raw journey and Lighthouse reports are retained locally under
`qa/outros-integration-2026-10-26/` and excluded from Git/public output. This is a
relocation regression check; no new human persona study was conducted.

## Local previews

- Combined directory: http://127.0.0.1:4186/outros/
- Combined Home Veritas: http://127.0.0.1:4186/outros/home-veritas/
- Existing standalone preview: http://127.0.0.1:4185/

For a fresh production-like preview, run `npm run preview` from the SatietyIndex
repository root and use http://localhost:8787/outros/home-veritas/.
