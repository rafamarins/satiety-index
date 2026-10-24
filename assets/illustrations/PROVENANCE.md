# Original engraved food plates

Created for this project on 24 October 2026 with the built-in image generation
tool, directed from the user's pen-and-ink engraving references. The recorded
workflow generated new illustrations rather than importing stock-pack assets.
This is provenance, not an independent originality or IP-clearance assessment.
They are representative foods, not verified depictions of the
exact products, preparation methods or portions used in the 1995 study.

All 38 runtime illustrations are standalone SVG files, with individual open pen
paths and nine strengths of graphite shading. Ink is fixed at `#242321`; opaque
`#f7f6f2` highlights follow only the food silhouette, not a rectangular paper
background. Outside the subject is transparent. The live illustration-and-caption
panel deliberately stays light-paper (`#f7f6f2`) in both themes, blending the
remaining contact hatching into a consistent surface instead of promising perfect
transparent cutouts. Only this panel is light in dark mode. Neither ink nor
highlights inherit the surrounding page's theme colour. The five original source atlases are kept in
`sources/`, together with the exact prompt set in `sources/prompts.json`.
The selected replacements for brown rice and potato come from atlas 05; the
earlier candidates in atlases 03 and 04 are not used.

`scripts/build-plates.cjs` crops each atlas cell and removes detached fragments
from neighbouring cells. A local contrast threshold isolates fine ink;
Zhang–Suen thinning reduces it to centre-lines. The connected paths are simplified
and rounded into individual, static quadratic pen strokes.
`subject-silhouette.cjs` extracts the solid subject, preserving background openings
in vine stems. `subject-contours.cjs` contains individually reviewed lower outlines
that separate food surfaces from ground hatching. The underpainting softly tapers
at contact edges and is traced into eight static opacity bands. This is editable
vector geometry; no new raster artwork was generated for the transparency change.
Nine separately traced tonal layers preserve material and volume instead of
flattening the artwork to a single black/white threshold. Both themes preserve
natural shading: lit surfaces remain light, recesses and cast shadows remain dark.

There is no drawing animation, timed shading, reveal mask, or embedded raster.
The complete cutout enters with a native 220 ms opacity/lift transition.
Keyboard input and reduced motion show it immediately.
Runtime loads only the selected SVG; original PNG atlases
and tracing tools are never downloaded by the site.

To regenerate, install the development-only tools in a temporary folder, then run
from the project root (replace the example tools directory with your own):

```sh
npm install --prefix /tmp/satiety-art-tools --no-save sharp potrace
NODE_PATH=/tmp/satiety-art-tools/node_modules node scripts/build-plates.cjs
node scripts/check-illustrations.mjs
NODE_PATH=/tmp/satiety-art-tools/node_modules node scripts/check-illustrations.mjs --render
```

Optional food IDs restrict regeneration, for example `node scripts/build-plates.cjs
grapes crackers`. The complete light/dark visual review is at
`artifacts/illustrations-review.html` when served locally.

The percentage animation uses a local copy of D3 7.9.0; its ISC licence is preserved in
`assets/vendor/D3-LICENSE.txt`. Instrument Serif and DM Sans are self-hosted with
their original SIL Open Font Licences in `assets/fonts/`.

## Origin and usage

The current 38 illustrations are generated project assets, not the older stock
illustrations retained in `assets/tasty-icons-free/`. The live app loads only
`assets/illustrations/*.svg`; the earlier stock files retain their own licences if
reused or redistributed. They are not covered by the generated-art statement.

[OpenAI's Terms of Use](https://openai.com/policies/terms-of-use/) assign its rights
in output to the user, to the extent permitted by law. This supports commercial
use subject to the terms, but does not guarantee uniqueness, copyright protection,
or clearance of third-party rights. Users must also have the rights required for
their inputs. No stock-artist attribution requirement was identified for these
generated images. No additional OpenAI brand credit was identified as required.

The site includes a plain “AI-generated illustrations” disclosure, consistent with
not representing AI output as human-generated; see the
[sharing and publication policy](https://openai.com/policies/sharing-publication-policy/).
The original research citation and the separate font/library licence notices remain.
