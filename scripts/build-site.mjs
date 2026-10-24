import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, extname } from "node:path";
import { build, transform } from "esbuild";
import sharp from "sharp";
import { FOODS } from "../foods.js";

const project = new URL("../", import.meta.url);
const distribution = new URL("dist/", project);
const output = new URL("outros/satiety-index/", distribution);
const parent = new URL("outros/", distribution);
const hash = (bytes) =>
  createHash("sha256").update(bytes).digest("hex").slice(0, 12);
const replacements = new Map();
const illustrations = {};

async function hashedAsset(relative, bytes, root = output) {
  const extension = extname(relative);
  const name = `${relative.slice(0, -extension.length)}-${hash(bytes)}${extension}`;
  await mkdir(new URL("./", new URL(name, root)), { recursive: true });
  await writeFile(new URL(name, root), bytes);
  return `./${name}`;
}

await rm(distribution, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("_headers", project), new URL("_headers", distribution));

// Rasterise at each target resolution, not by enlarging the smaller bitmap.
// The editable vector plates and source/provenance files remain untouched.
for (const { id } of FOODS) {
  const source = await readFile(
    new URL(`assets/illustrations/${id}.svg`, project),
  );
  const variants = [];
  for (const width of [640, 768, 1280]) {
    const bytes = await sharp(source, { density: (72 * width) / 640 })
      .resize({ width })
      .webp({ quality: 90, effort: 5 })
      .toBuffer();
    const path = await hashedAsset(
      `assets/illustrations/${id}-${width}.webp`,
      bytes,
    );
    variants.push({ width, path });
  }
  illustrations[id] = {
    src: variants[0].path,
    srcset: variants.map(({ width, path }) => `${path} ${width}w`).join(", "),
  };
}

for (const file of [
  "assets/favicon.svg",
  ...["dm-sans", "instrument-serif", "instrument-serif-italic"].map(
    (name) => `assets/fonts/${name}.woff2`,
  ),
]) {
  replacements.set(
    `./${file}`,
    await hashedAsset(file, await readFile(new URL(file, project))),
  );
}
for (const file of ["DM-Sans-OFL.txt", "Instrument-Serif-OFL.txt"]) {
  await cp(
    new URL(`assets/fonts/${file}`, project),
    new URL(`assets/fonts/${file}`, output),
  );
}

async function javascript(entry, root) {
  const result = await build({
    entryPoints: [new URL(entry, project).pathname],
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2022",
    write: false,
    plugins: [
      {
        name: "responsive-illustrations",
        setup(context) {
          context.onLoad({ filter: /\/illustrations\.js$/ }, () => ({
            contents: `export const ILLUSTRATIONS = ${JSON.stringify(illustrations)};`,
            loader: "js",
          }));
        },
      },
    ],
  });
  return hashedAsset(
    `assets/${basename(entry)}`,
    result.outputFiles[0].contents,
    root,
  );
}

for (const isParent of [false, true]) {
  const prefix = isParent ? "outros/" : "";
  const root = isParent ? parent : output;
  const assetPath = (path) =>
    isParent ? path.replace("./", "./satiety-index/") : path;
  let html = await readFile(new URL(`${prefix}index.html`, project), "utf8");
  let css = await readFile(new URL(`${prefix}styles.css`, project), "utf8");
  for (const [from, to] of replacements) {
    html = html.replaceAll(assetPath(from), assetPath(to));
    css = css.replaceAll(assetPath(from), assetPath(to));
  }
  const styles = (
    await transform(css, { loader: "css", minify: true, target: "es2022" })
  ).code;
  // Small, page-specific styles are inlined to avoid a render-blocking round trip.
  html = html.replace(
    /<link rel="stylesheet" href="[^"]+"\s*\/>/,
    `<style>${styles}</style>`,
  );
  const script = await javascript(`${prefix}app.js`, root);
  html = html.replace(
    /<script (?:type="module" )?src="\.\/app\.js[^\"]*"(?: defer)?><\/script>/,
    `<script type="module" src="${script}"></script>`,
  );
  const srcset = illustrations.potato.srcset
    .split(", ")
    .map((variant) => assetPath(variant))
    .join(", ");
  const sizes = isParent
    ? "(max-width: 767px) calc(100vw - 40px), 620px"
    : "(max-width: 680px) calc(100vw - 72px), (max-width: 1100px) 48vw, 600px";
  html = html.replace(
    `src="${assetPath("./assets/illustrations/potato.svg")}"`,
    `src="${assetPath(illustrations.potato.src)}" srcset="${srcset}" sizes="${sizes}"`,
  );
  await writeFile(new URL("index.html", root), html);
}
console.log(
  `Built both pages, ${FOODS.length * 3} responsive illustrations, bundled scripts and fingerprinted assets.`,
);
