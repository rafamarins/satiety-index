# The Satiety Index

A monochrome, illustrated exploration of the 1995 Satiety Index study. All 38 foods
have individual engraved SVG plates with natural graphite shading, short entrance
transitions, animated percentages, light/dark themes, and a responsive food chooser
and comparison list.

Live at [rafael.co.nz/outros/satiety-index/](https://rafael.co.nz/outros/satiety-index/).

## Run locally

```sh
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/>. Local browsing needs no build or package installation.
Use an HTTP server rather than opening `index.html` as a file: the app uses native
ES modules and loads the selected SVG with `fetch`.

## Files

- `index.html` — page, research context and attribution.
- `styles.css` — responsive layout, typography and themes.
- `foods.js` — the original 38 scores and food descriptions.
- `app.js` — selection, history, image transitions, percentages, themes and filters.
- `food-navigation.js` — scoped arrow shortcuts and touch swipe handling.
- `engravings.js` — on-demand SVG loading and caching.
- `assets/illustrations/*.svg` — the 38 original, standalone vector plates.
- `wrangler.jsonc` — Cloudflare static-site configuration.
- `scripts/build-site.mjs` — copies only public runtime assets into `dist/outros/satiety-index/`.

## Cloudflare deployment

The app stays plain HTML/CSS/JavaScript. Node and Wrangler are deployment tools,
not runtime dependencies. With Node 22 or later:

```sh
npm ci
npm run check
npm run deploy:check
npm run preview
```

Open <http://localhost:8787/outros/satiety-index/> for the production-like preview.
The output directory includes the app, 38 illustrations, local fonts, D3 and their
licence notices. Source atlases, older stock artwork, research, QA captures,
credentials and repository files are not published. Unknown paths return 404;
food selection uses URL fragments and does not need an SPA fallback.

After authenticating Wrangler with the intended Cloudflare account:

```sh
npx wrangler login
npm run deploy
```

The Worker is named `satiety-index`. Its routes are limited to
`rafael.co.nz/outros/satiety-index` and `rafael.co.nz/outros/satiety-index/*`.
The `/outros/` parent and sibling sites are not routed through this Worker.
Publishing does not replace the existing website's root, other folders, DNS
records or email setup. The built assets mirror the `/outros/satiety-index/`
directory; relative app URLs work without a rewrite Worker. The same path is
available on the Worker's `workers.dev` URL.

The development dependency `undici` is pinned to its patched 7.30.1 release through
an npm override because the installed Wrangler/Miniflare dependency pins an older
version. It is deployment tooling, not browser code. Recheck this override when
upgrading Wrangler.

`rafamarins/satiety-index` is connected to Cloudflare Workers Builds:

- Production branch: `main`
- Root directory: repository root
- Build command: `npm run check`
- Deploy command: `npx wrangler deploy`

Pushing to `main` starts the production build. Other branches do not deploy.
The **Cloudflare Workers and Pages** GitHub App must include `satiety-index` in
its repository access; without that permission, manual builds can work while
GitHub pushes do not trigger builds.
The local Git remote fetches from the requested HTTPS URL and pushes over SSH,
using the existing GitHub SSH authentication.

Cloudflare installs the locked dependencies before building. Keep deployment
credentials in Cloudflare, never in the repository. See
[Cloudflare's build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Data

White bread = 100%, preserving the original study baseline. Boiled potato has the
highest reported mean score, 323%; croissant has the lowest, 47%. Scores have not
been changed from the supplied PDF table. They measure the relative area under a
two-hour subjective satiety-response curve, not time until hunger returns.

Holt, S.H.A., Brand Miller, J.C., Petocz, P. & Farmakalidis, E. “A Satiety Index of
Common Foods.” _European Journal of Clinical Nutrition_ 49(9), 675–690 (1995).
[Study abstract](https://pubmed.ncbi.nlm.nih.gov/7498104/).

## Artwork and dependencies

The current artwork was generated for this project, then converted into static
SVG pen paths with nine tonal ink strengths. The food silhouettes have opaque
highlights and transparent surroundings. The entire illustration-and-caption panel
uses a consistent light-paper background in both themes; the rest of the page
follows the selected theme. This avoids unreliable cutout halos while preserving
natural shading. Exact prompts, source atlases and regeneration instructions
are in [the illustration provenance](assets/illustrations/PROVENANCE.md).
Illustrations depict representative foods, not the exact study portions or verified
1995 product formulations. Earlier stock-art research is retained in
`assets/ILLUSTRATION-SOURCES.md`; those stock assets are no longer displayed.

D3 7.9.0 is vendored locally with its ISC licence. Instrument Serif and DM Sans are
self-hosted with their SIL Open Font Licences. No runtime CDN, analytics or remote
image calls are needed.

## Interaction

Select a food, use the previous/next buttons, or choose a row from the full index.
The URL records the selected food and browser Back/Forward restores it.
Keyboard selections and reduced-motion settings
show the completed illustration immediately. Requests and transitions are guarded
against stale responses when switching quickly.

The complete artwork is visible immediately. A native 220 ms opacity/6 px lift
transition introduces the complete cutout. There is no stroke drawing, timed
shading, or reveal mask. Rapid switching
cancels the previous entrance and stale requests cannot replace the current food.

Left/right arrow keys browse the visible explorer immediately, except inside
native form controls, editable content, and other controls that own arrow keys.
On touch devices, swipe left across the illustration or food information for the
next food, and right for the previous food. Vertical scrolling and pinch zoom
remain native; cancelled, tiny, vertical and multi-touch gestures do not navigate.
The selector and previous/next buttons remain available.

```sh
node --test scripts/check-navigation.mjs
```

## Illustration checks

```sh
node scripts/check-illustrations.mjs
```

This checks all 38 vector cutouts, natural shading, static detail paths, absence of
paper rectangles and stroke animation, atlas isolation and the white-bread baseline. Inspect the full set
in either theme at <http://127.0.0.1:4173/artifacts/illustrations-review.html>.

With the development tracing dependencies available, `node scripts/check-illustrations.mjs
--render` also renders every SVG and verifies transparent surroundings and opaque
food interiors. Artwork origin and usage notes are in the provenance document.

## Accessibility

The implementation targets WCAG 2.1 AA. The current audit, test coverage and
remaining assistive-technology checks are recorded in
[the accessibility review](artifacts/ACCESSIBILITY.md).
Body copy uses 16–18px and secondary labels are at least 14px across breakpoints.
The audit checks those rendered sizes, both themes, reflow and enlarged text,
and saves mobile/desktop screenshots.

The audit tools are development-only. With Chrome installed, run the local server,
then install the test dependencies outside the project:

```sh
satiety_a11y_tools=$(mktemp -d /tmp/satiety-a11y-tools.XXXXXX)
npm install --prefix "$satiety_a11y_tools" --no-save axe-core@4.10.3 playwright@1.56.1
NODE_PATH="$satiety_a11y_tools/node_modules" node scripts/check-accessibility.cjs --all
```

Set `SATIETY_CHROME_PATH` if Chrome is not in the default macOS application path,
or `SATIETY_URL` to audit another local server. The script writes its results to
`artifacts/qa/accessibility.json`. Automated scans do not certify conformance.
