import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { FOODS } from "../foods.js";

const require = createRequire(import.meta.url);
const { centreLines } = require("./pen-strokes.cjs");
const { isolatePlate } = require("./isolate-plate.cjs");
const { floors } = require("./subject-contours.cjs");
const { subjectSilhouette } = require("./subject-silhouette.cjs");
const directory = new URL("../assets/illustrations/", import.meta.url);
const files = (await readdir(directory)).filter((name) =>
  name.endsWith(".svg"),
);
assert.equal(files.length, 38);
assert.deepEqual(
  Object.keys(floors).sort(),
  FOODS.map((food) => food.id).sort(),
);
assert.equal(FOODS.find((food) => food.id === "white-bread").score, 100);
let count = 0;
const renderer = process.argv.includes("--render") ? require("sharp") : null;
for (const food of FOODS) {
  const svg = await readFile(new URL(`${food.id}.svg`, directory), "utf8");
  assert.match(svg, /viewBox="0 0 640 460"/);
  assert.doesNotMatch(
    svg,
    /NaN|undefined|<image|<mask|engraving-pass|clipPath|stroke-dash|data-at=|data-duration=|data-drawing-duration=|pathLength=/,
  );
  assert.match(svg, /style="color:#242321" data-palette="natural-cutout"/);
  assert.doesNotMatch(svg, /<rect|illustration-paper/);
  assert.equal((svg.match(/class="food-surface"/g) ?? []).length, 8);
  assert.match(svg, /class="food-surface"[^>]+fill="#f7f6f2"/);
  assert.match(svg, /class="plate-artwork"/);
  assert.equal((svg.match(/class="engraving-tone"/g) ?? []).length, 9);
  const strokes = [
    ...svg.matchAll(
      /class="engraving-stroke" stroke-width="([\d.]+)" d="([^"]+)"/g,
    ),
  ];
  assert.ok(strokes.length > 100, `${food.id}: insufficient actual pen paths`);
  assert.ok(
    strokes.every(([, weight, d]) => Number(weight) > 0 && /^M[\d ]+L/.test(d)),
  );
  assert.ok(svg.length < 3_000_000, `${food.id}: unexpectedly large plate`);
  count += strokes.length;
  if (renderer) {
    const { data, info } = await renderer(Buffer.from(svg))
      .resize(640, 460)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (const [x, y] of [
      [50, 30],
      [590, 30],
      [50, 430],
      [590, 430],
      [320, 24],
      [24, 230],
      [616, 230],
      [320, 436],
    ]) {
      assert.equal(
        data[(y * info.width + x) * 4 + 3],
        0,
        `${food.id}: background must be transparent`,
      );
    }
    let opaque = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 250) opaque++;
    const coverage = opaque / (640 * 460);
    assert.ok(
      coverage > 0.03 && coverage < 0.65,
      `${food.id}: invalid subject matte coverage ${coverage}`,
    );
  }
}

// A single line remains a single open pen path, not the closed border of a blob.
const ink = new Uint8Array(24 * 24);
for (let x = 3; x < 21; x++) ink[12 * 24 + x] = 1;
const lines = centreLines(ink, new Uint8Array(ink.length).fill(80), 24, 24);
assert.equal(lines.length, 1);
assert.equal(lines[0].length, 17);
assert.doesNotMatch(lines[0].d, /Z/);
assert.equal(
  centreLines(new Uint8Array(576), new Uint8Array(576), 24, 24).length,
  0,
);
const atlasCell = Buffer.alloc(40 * 40, 255);
for (let y = 7; y < 26; y++)
  for (let x = 7; x < 30; x++) atlasCell[y * 40 + x] = 40;
atlasCell[39 * 40 + 20] = 60;
const isolated = isolatePlate(atlasCell, 40, 40);
assert.equal(
  isolated[39 * 40 + 20],
  255,
  "Remove the neighbour sliver at the atlas edge",
);
assert.equal(isolated[12 * 40 + 12], 40, "Preserve the main food");
const matte = subjectSilhouette(atlasCell, 40, 40);
assert.equal(matte[0], 0, "Background stays transparent");
assert.equal(
  matte[12 * 40 + 12],
  1,
  "Food stays opaque for natural highlights",
);
console.log(
  `PASS: all 38 transparent cutouts; fixed natural shading; ${count.toLocaleString()} static detail paths; no paper rectangles or drawing animation; white bread = 100%.`,
);
if (renderer)
  console.log(
    "PASS: all 38 rendered SVGs have transparent surrounding pixels and opaque subject interiors.",
  );
