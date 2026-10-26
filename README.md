# The Satiety Index

A monochrome, illustrated exploration of the 1995 Satiety Index study. All 38 foods
have individual engraved plates with natural graphite shading, short entrance
transitions, animated percentages, light/dark themes, and a responsive food chooser
and comparison list.

Live at [rafael.co.nz/outros/satiety-index/](https://rafael.co.nz/outros/satiety-index/).
The [Outros directory](https://rafael.co.nz/outros/) is built from `outros/` in this repository.
To add another project, duplicate the `.project` list item in `outros/index.html`,
then change its number, link, illustration and copy. No JavaScript changes are needed.

## Run locally

```sh
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/>. Local browsing needs no build or package installation.
Use an HTTP server rather than opening `index.html` as a file: the app uses native
ES modules. The source preview displays the original vectors; use the production
preview below to check the smaller, responsive images delivered online.

## Files

- `index.html` — page, research context and attribution.
- `styles.css` — responsive layout, typography and themes.
- `foods.js` — the original 38 scores and food descriptions.
- `study-nutrition.js` — serving weights and nutrients from the original Table 2.
- `study-preparation.js` — preparation context from Table 1, including milk in cereal portions.
- `app.js` — selection, history, image transitions, percentages, themes and filters.
- `food-navigation.js` — scoped arrow shortcuts and touch swipe handling.
- `engravings.js` — image loading, decoding and accessible descriptions.
- `illustrations.js` — source image mapping; replaced by responsive image URLs at build time.
- `assets/illustrations/*.svg` — the 38 original, standalone vector plates.
- `wrangler.jsonc` — Cloudflare static-site configuration.
- `outros/` — the lightweight project directory, with its own layout and theme control.
- `scripts/build-site.mjs` — generates responsive WebP images, bundles scripts and fingerprints public assets.

## Cloudflare deployment

The app stays plain HTML/CSS/JavaScript. Node, Sharp, esbuild and Wrangler are build/deployment tools,
not runtime dependencies. With Node 22 or later:

```sh
npm ci
npm run check
npm run deploy:check
npm run preview
```

Open <http://localhost:8787/outros/satiety-index/> for the production-like preview.
The output directory includes both pages, three sizes of each of the 38 illustrations,
local fonts and their licence notices. Small page-specific styles are inlined;
scripts and images are fingerprinted for long-lived caching. Source vectors,
atlases, older stock artwork, research, QA captures,
credentials and repository files are not published. Unknown paths return 404;
food selection uses URL fragments and does not need an SPA fallback.

After authenticating Wrangler with the intended Cloudflare account:

```sh
npx wrangler login
npm run deploy
```

The Worker is named `satiety-index`. Its routes cover exactly `/favicon.svg`, `/outros`, `/outros/`,
`/outros/assets/*`, `/outros/satiety-index` and `/outros/satiety-index/*`.
There is deliberately no `/outros/*` catch-all: future sibling sites can use their
own hosting without being intercepted by this Worker.
The circular Rafael favicon in `outros/favicon.svg` is published at `/favicon.svg`,
shared by the homepage and the Outros directory. The Satiety Index keeps its own favicon.
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

The comparison introduces the original protocol before the illustrations: approximately
240 calories per portion, 11–13 people per food group, and fullness ratings over two hours.
Illustrations are representative foods, not exact portion sizes. A separate “What newer
research says” section summarises four related trials, reviewed on 26 October 2026,
with source links and limitations. Those findings do not change or extend the 1995 scores.

Each illustrated food shows its Table 2 serving weight and protein, carbohydrate and fat
amounts **per tested portion**, not per 100 g. The paper lists sugars and starch separately:
the displayed carbs value is their sum, rounded to one decimal place; fibre remains separate.
The expandable details preserve sugars, starch, fibre and water, along with preparation,
the fixed 1,000 kJ energy portion and source notes. Milk is included in cereal serving weights;
the separate 220 ml drinking water is not. No food volumes, cup measures or item counts are
inferred. The illustrations remain representative, not scaled portion diagrams.
The compact portion and macro summary sits beside the satiety percentage; the full
nutrition disclosure follows the fullness-response explanation.
The full index also shows each portion weight beside its score, including when filtered
by category. Readers can sort by satiety score or portion weight in either direction;
row numbers follow the selected ordering across all foods. These remain the same
≈240-calorie portions, with milk included for cereals.

Transcribed visually from Holt et al., Table 2 (p. 678), with preparation from Table 1
(pp. 676–677) and the drinking-water protocol on pp. 679–680. The serving-weight
transcription was independently checked. Table 2 superscript `a` is preserved as
`sourceCalculated` for rows marked as calculated from food tables or manufacturer data.
Unmarked rows are not assumed to have been directly measured. Source inconsistencies
(for example, lentils' 222.0 g water alongside a 253 g serving and the other nutrients)
are preserved rather than silently corrected; the disclosure notes that some rows do not reconcile.
[Original paper, author-uploaded PDF](https://www.researchgate.net/profile/Peter-Petocz/publication/15701207_A_Satiety_Index_of_common_foods/links/00b495189da413c16d000000/A-Satiety-Index-of-common-foods.pdf).
The original paper groups porridge among seven breakfast cereals; the site follows that
classification. All satiety scores remain unchanged.

Run the data checks with `node --test scripts/check-study-nutrition.mjs`. With the browser
dependencies described below, run `node scripts/check-study-nutrition.cjs` against
`SATIETY_URL` to check food switching, all nutrient values and the disclosure control.
Run `node scripts/check-ranking.cjs` with the same dependencies and URL to verify
both sort metrics and directions, category filters, selection and responsive layouts.

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

Instrument Serif and DM Sans are self-hosted with their SIL Open Font Licences.
There are no runtime libraries, remote image calls or application analytics.
Percentages use a small, cancelable native animation. The older vendored D3 copy
is retained in source but is no longer loaded or published. Cloudflare may inject
its own analytics and bot-detection scripts at the edge; bot detection is retained.

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
The initial illustration and final score are present in the HTML, with no entrance
animation or count-up delaying the first view. Later selections animate normally.

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

For the built site, serve `dist/` on port 4174 and use the production paths:

```sh
python3 -m http.server 4174 --directory dist
NODE_PATH="$satiety_a11y_tools/node_modules" SATIETY_URL=http://127.0.0.1:4174/outros/satiety-index/ node scripts/check-accessibility.cjs --all
NODE_PATH="$satiety_a11y_tools/node_modules" node scripts/check-runtime.cjs
NODE_PATH="$satiety_a11y_tools/node_modules" node scripts/check-outros.cjs
```

The deployment check enforces compressed HTML/CSS and JavaScript budgets,
image-size budgets, content fingerprints and an explicit public-file allowlist.
The HTML/CSS budget is 12 KiB for Satiety Index (including research and nutrition details)
and 10 KiB for Outros. JavaScript budgets are 10 KiB for Satiety Index (including all
38 nutrition records and preparation notes) and 8 KiB for Outros.
Full Lighthouse reports are local artifacts and are ignored by Git.
