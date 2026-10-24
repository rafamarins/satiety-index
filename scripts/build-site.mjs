import { cp, mkdir, rm } from "node:fs/promises";
import { FOODS } from "../foods.js";

const project = new URL("../", import.meta.url);
const output = new URL("dist/", project);
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "foods.js",
  "engravings.js",
  "food-navigation.js",
  "_headers",
  ...FOODS.map(({ id }) => `assets/illustrations/${id}.svg`),
];

await rm(output, { recursive: true, force: true });
await mkdir(new URL("assets/illustrations/", output), { recursive: true });
await Promise.all(
  files.map((file) => cp(new URL(file, project), new URL(file, output))),
);
await cp(
  new URL("assets/favicon.svg", project),
  new URL("assets/favicon.svg", output),
);
for (const directory of ["assets/fonts", "assets/vendor"]) {
  await cp(new URL(directory, project), new URL(directory, output), {
    recursive: true,
  });
}
console.log(
  `Built dist/ with ${FOODS.length} illustrations and local fonts/library licences.`,
);
