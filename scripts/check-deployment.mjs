import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { readdir, readFile, stat } from "node:fs/promises";
import { FOODS } from "../foods.js";

const output = new URL("../dist/", import.meta.url);
const staticFiles = new Set([
  "_headers",
  "outros/index.html",
  "outros/satiety-index/index.html",
  ...["DM-Sans-OFL.txt", "Instrument-Serif-OFL.txt"].map(
    (file) => `outros/satiety-index/assets/fonts/${file}`,
  ),
]);
const hashed = [
  "outros/assets/app.js",
  "outros/satiety-index/assets/app.js",
  "outros/satiety-index/assets/favicon.svg",
  ...["dm-sans", "instrument-serif", "instrument-serif-italic"].map(
    (name) => `outros/satiety-index/assets/fonts/${name}.woff2`,
  ),
  ...FOODS.flatMap(({ id }) =>
    [640, 1280].map(
      (width) =>
        `outros/satiety-index/assets/illustrations/${id}-${width}.webp`,
    ),
  ),
];
const files = [];
const seen = new Set();
for (const file of await readdir(output, { recursive: true })) {
  const info = await stat(new URL(file, output));
  if (!info.isFile()) continue;
  files.push(file);
  assert.ok(info.size > 0, `Empty asset: ${file}`);
  assert.ok(info.size < 25 * 1024 * 1024, `Oversized asset: ${file}`);
  if (staticFiles.has(file)) continue;
  const unversioned = file.replace(/-[a-f0-9]{12}(\.[^.]+)$/, "$1");
  assert.ok(hashed.includes(unversioned), `Unexpected public asset: ${file}`);
  assert.notEqual(unversioned, file, `Missing fingerprint: ${file}`);
  assert.ok(!seen.has(unversioned), `Duplicate version of ${unversioned}`);
  const digest = createHash("sha256")
    .update(await readFile(new URL(file, output)))
    .digest("hex")
    .slice(0, 12);
  assert.ok(file.includes(`-${digest}.`), `Incorrect fingerprint: ${file}`);
  if (file.endsWith(".js"))
    assert.ok(
      gzipSync(await readFile(new URL(file, output))).length < 8 * 1024,
      `JavaScript budget exceeded: ${file}`,
    );
  if (file.endsWith(".webp"))
    assert.ok(
      info.size < (file.includes("-1280-") ? 220 : 85) * 1024,
      `Image budget exceeded: ${file}`,
    );
  seen.add(unversioned);
}
assert.deepEqual(
  new Set(files.map((file) => file.replace(/-[a-f0-9]{12}(\.[^.]+)$/, "$1"))),
  new Set([...staticFiles, ...hashed]),
  "Unexpected or missing public files",
);
const headers = await readFile(new URL("_headers", output), "utf8");
assert.match(headers, /X-Content-Type-Options: nosniff/);
assert.match(headers, /X-Frame-Options: DENY/);
assert.match(headers, /max-age=31536000, immutable/);
for (const file of ["outros/index.html", "outros/satiety-index/index.html"]) {
  const html = await readFile(new URL(file, output), "utf8");
  assert.ok(
    gzipSync(html).length < 10 * 1024,
    `HTML/CSS budget exceeded: ${file}`,
  );
  assert.doesNotMatch(html, /d3\.min\.js|styles\.css|potato\.svg|app\.js\?/);
  assert.match(html, /srcset="[^\"]+640w, [^\"]+1280w"/);
}
console.log(
  `PASS: ${files.length} public files; both pages, 38 responsive illustrations, licences and security/cache headers; no source atlases, tooling or QA files.`,
);
