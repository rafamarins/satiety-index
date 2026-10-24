import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { FOODS } from "../foods.js";

const output = new URL("../dist/", import.meta.url);
const expected = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "foods.js",
  "engravings.js",
  "food-navigation.js",
  "_headers",
  "assets/favicon.svg",
  "assets/fonts/dm-sans.woff2",
  "assets/fonts/instrument-serif.woff2",
  "assets/fonts/instrument-serif-italic.woff2",
  "assets/fonts/DM-Sans-OFL.txt",
  "assets/fonts/Instrument-Serif-OFL.txt",
  "assets/vendor/d3.min.js",
  "assets/vendor/D3-LICENSE.txt",
  ...FOODS.map(({ id }) => `assets/illustrations/${id}.svg`),
]);
const files = [];
for (const file of await readdir(output, { recursive: true })) {
  const info = await stat(new URL(file, output));
  if (!info.isFile()) continue;
  files.push(file);
  assert.ok(info.size > 0, `Empty asset: ${file}`);
  assert.ok(info.size < 25 * 1024 * 1024, `Oversized asset: ${file}`);
}
assert.deepEqual(
  new Set(files),
  expected,
  "Unexpected or missing public files",
);
const headers = await readFile(new URL("_headers", output), "utf8");
assert.match(headers, /X-Content-Type-Options: nosniff/);
assert.match(headers, /X-Frame-Options: DENY/);
console.log(
  `PASS: ${files.length} public files; all 38 illustrations, licences and security headers; no source atlases, tooling or QA files.`,
);
