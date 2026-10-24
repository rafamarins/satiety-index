// Development-only: convert the original generated engraving sheets to monochrome SVG plates.
// Runtime has no dependency on these tools. See assets/illustrations/PROVENANCE.md.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const { Potrace } = require("potrace");
const { renderCurve } = require("potrace/lib/utils");
const { centreLines } = require("./pen-strokes.cjs");
const { isolatePlate } = require("./isolate-plate.cjs");
const { subjectSilhouette } = require("./subject-silhouette.cjs");
const { floorAt } = require("./subject-contours.cjs");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "assets/illustrations");
const sheets = [
  {
    file: "atlas-01.png",
    grid: 3,
    foods: [
      "croissant",
      "cake",
      "doughnuts",
      "cookies",
      "crackers",
      "mars",
      "peanuts",
      "yogurt",
      "crisps",
    ],
  },
  {
    file: "atlas-02.png",
    grid: 3,
    foods: [
      "ice-cream",
      "jellybeans",
      "popcorn",
      "porridge",
      "muesli",
      "sustain",
      "special-k",
      "cornflakes",
      "honeysmacks",
    ],
  },
  {
    file: "atlas-03.png",
    grid: 3,
    foods: [
      "all-bran",
      "white-bread",
      "french-fries",
      "white-pasta",
      null,
      "white-rice",
      "grain-bread",
      "wholemeal-bread",
      "brown-pasta",
    ],
  },
  {
    file: "atlas-04.png",
    grid: 3,
    foods: [
      null,
      "lentils",
      "cheese",
      "eggs",
      "baked-beans",
      "beef",
      "ling-fish",
      "bananas",
      "grapes",
    ],
  },
  {
    file: "atlas-05.png",
    grid: 2,
    foods: ["apples", "oranges", "brown-rice", "potato"],
  },
];

function trace(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const tracer = new Potrace({
      threshold: 128,
      turdSize: 3,
      optTolerance: 0.5,
      ...options,
    });
    tracer.loadImage(buffer, (error) => {
      if (error) return reject(error);
      tracer.getPathTag();
      resolve(tracer._pathlist);
    });
  });
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  for (const sheet of sheets) {
    const input = path.join(output, "sources", sheet.file);
    const { width, height } = await sharp(input).metadata();
    for (const [index, id] of sheet.foods.entries()) {
      if (
        !id ||
        (process.argv.length > 2 && !process.argv.slice(2).includes(id))
      )
        continue;
      const left = Math.round(((index % sheet.grid) * width) / sheet.grid);
      const top = Math.round(
        (Math.floor(index / sheet.grid) * height) / sheet.grid,
      );
      const right = Math.round(
        (((index % sheet.grid) + 1) * width) / sheet.grid,
      );
      const bottom = Math.round(
        ((Math.floor(index / sheet.grid) + 1) * height) / sheet.grid,
      );
      const cell = await sharp(input)
        .extract({ left, top, width: right - left, height: bottom - top })
        .flatten({ background: "#fff" })
        .grayscale()
        .png()
        .toBuffer();
      const { data: raw, info } = await sharp(cell)
        .extractChannel(0)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const data = isolatePlate(raw, info.width, info.height);
      let minX = info.width,
        minY = info.height,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          if (data[(y * info.width + x) * info.channels] > 205) continue;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
      const w = maxX - minX + 1,
        h = maxY - minY + 1;
      const cropped = await sharp(data, {
        raw: { width: info.width, height: info.height, channels: 1 },
      })
        .extract({ left: minX, top: minY, width: w, height: h })
        .extractChannel(0)
        .raw()
        .toBuffer();
      // Local threshold keeps the fine ink while removing broad gray/sepia washes.
      const integral = new Float64Array((w + 1) * (h + 1));
      for (let yy = 0; yy < h; yy++) {
        let row = 0;
        for (let xx = 0; xx < w; xx++) {
          row += cropped[yy * w + xx];
          integral[(yy + 1) * (w + 1) + xx + 1] =
            integral[yy * (w + 1) + xx + 1] + row;
        }
      }
      const ink = new Uint8Array(w * h);
      for (let yy = 0; yy < h; yy++)
        for (let xx = 0; xx < w; xx++) {
          const x0 = Math.max(0, xx - 4),
            x1 = Math.min(w, xx + 5);
          const y0 = Math.max(0, yy - 4),
            y1 = Math.min(h, yy + 5);
          const sum =
            integral[y1 * (w + 1) + x1] -
            integral[y0 * (w + 1) + x1] -
            integral[y1 * (w + 1) + x0] +
            integral[y0 * (w + 1) + x0];
          const mean = sum / ((x1 - x0) * (y1 - y0));
          const value = cropped[yy * w + xx];
          if (value < mean - 8 && value < 225) ink[yy * w + xx] = 1;
        }
      const scale = Math.min(504 / w, 356 / h);
      const x = (640 - w * scale) / 2,
        y = (460 - h * scale) / 2;
      const precision = (d) =>
        d
          .replace(/-?\d+\.\d+/g, (n) => String(Number(Number(n).toFixed(1))))
          .replace(/\s*([A-Z])\s*/g, "$1")
          .replace(/,\s+/g, ",");
      const smooth = await sharp(cropped, {
        raw: { width: w, height: h, channels: 1 },
      })
        .blur(0.55)
        .png()
        .toBuffer();
      // Separate ink strengths retain volume and material, instead of turning
      // every crumb, reflection and hatch into the same opaque black/white mark.
      const levels = [
        [246, 244],
        [230, 222],
        [209, 199],
        [185, 174],
        [158, 147],
        [130, 120],
        [102, 93],
        [74, 66],
        [46, 39],
      ];
      const tonePaths = [];
      let previousValue = 255;
      for (const [threshold, value] of levels) {
        const paths = await trace(smooth, {
          threshold,
          turdSize: 7,
          optTolerance: 0.8,
        });
        const d = paths.map((p) => precision(renderCurve(p.curve))).join(" ");
        const opacity = (1 - value / previousValue).toFixed(3);
        previousValue = value;
        tonePaths.push(
          `<path class="engraving-tone" fill="currentColor" opacity="${opacity}" fill-rule="evenodd" d="${d}"/>`,
        );
      }
      const lines = centreLines(ink, cropped, w, h);
      const silhouette = subjectSilhouette(
        cropped,
        w,
        h,
        ["french-fries", "grapes"].includes(id) ? 2 : 3,
        id,
      );
      const alpha = Uint8Array.from(silhouette, (value, i) => {
        const yy = Math.floor(i / w),
          xx = i % w;
        const cellX = (minX + xx) / info.width,
          cellY = (minY + yy) / info.height;
        // The fillet is served on a real plate: preserve the broad white plate
        // face where its deliberately broken pen rim is not a closed component.
        if (
          id === "ling-fish" &&
          ((cellX - 0.51) / 0.5) ** 2 + ((cellY - 0.445) / 0.325) ** 2 < 1
        )
          value = 1;
        if (!value) return 0;
        if (id === "jellybeans") {
          const beans = [
            [0.39, 0.35, 0.13, 0.095, 0.35],
            [0.23, 0.49, 0.15, 0.095, -0.35],
            [0.65, 0.41, 0.15, 0.1, -0.75],
            [0.36, 0.65, 0.105, 0.15, 0.2],
            [0.59, 0.74, 0.16, 0.105, -0.6],
            [0.85, 0.59, 0.09, 0.145, -0.4],
          ];
          const inside = beans.some(([cx, cy, rx, ry, a]) => {
            const dx = cellX - cx,
              dy = cellY - cy,
              u = dx * Math.cos(a) + dy * Math.sin(a),
              v = -dx * Math.sin(a) + dy * Math.cos(a);
            return (u / rx) ** 2 + (v / ry) ** 2 < 1;
          });
          if (!inside) return 0;
        }
        const floor = floorAt(id, (minX + xx) / info.width) * info.height;
        const distance = (floor - minY - yy) * scale;
        return Math.round(Math.max(0, Math.min(1, distance / 12)) * 255);
      });
      const surfaces = [];
      for (let band = 0; band < 8; band++) {
        const threshold = Math.round(1 + (band * 254) / 7);
        const previous = band / 8,
          target = (band + 1) / 8;
        const opacity = (target - previous) / (1 - previous);
        const bitmap = await sharp(
          Buffer.from(
            Uint8Array.from(alpha, (value) => (value >= threshold ? 0 : 255)),
          ),
          {
            raw: { width: w, height: h, channels: 1 },
          },
        )
          .png()
          .toBuffer();
        const d = (await trace(bitmap, { turdSize: 12, optTolerance: 0.4 }))
          .map((p) => precision(renderCurve(p.curve)))
          .join(" ");
        surfaces.push(
          `<path class="food-surface" fill="#f7f6f2" fill-rule="evenodd" opacity="${opacity.toFixed(3)}" d="${d}"/>`,
        );
      }
      const strokes = lines
        .map(
          (line) =>
            `<path class="engraving-stroke" stroke-width="${line.weight.toFixed(2)}" d="${line.d}"/>`,
        )
        .join("");
      // Opaque highlights follow the food silhouette; everything outside it is
      // transparent. Fixed graphite still preserves natural light and shadow.
      const svg = `<svg class="food-illustration engraved-plate" style="color:#242321" data-palette="natural-cutout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 460" role="img" aria-label="Engraved illustration of ${id.replaceAll("-", " ")}"><g class="plate-artwork"><g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)})">${surfaces.join("")}<g class="engraving-tones">${tonePaths.join("")}</g><g class="engraving-lines" opacity="0.32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${strokes}</g></g></g></svg>\n`;
      await fs.writeFile(path.join(output, `${id}.svg`), svg);
      console.log(
        `${id}: natural graphite shading, ${Math.round(svg.length / 1024)} KB`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
