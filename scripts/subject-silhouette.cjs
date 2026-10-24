// A solid underpainting belongs to the subject, not to the rectangular plate.
// Retain enclosed food highlights, then discard the thin ground hatch marks.
function fillHoles(pixels, width, height, id) {
  const exterior = new Uint8Array(pixels.length);
  const queue = [];
  const add = (i) => {
    if (!pixels[i] && !exterior[i]) {
      exterior[i] = 1;
      queue.push(i);
    }
  };
  for (let x = 0; x < width; x++) {
    add(x);
    add((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    add(y * width);
    add(y * width + width - 1);
  }
  for (let n = 0; n < queue.length; n++) {
    const i = queue[n],
      x = i % width;
    if (x > 0) add(i - 1);
    if (x < width - 1) add(i + 1);
    if (i >= width) add(i - width);
    if (i < pixels.length - width) add(i + width);
  }
  const filled = Uint8Array.from(exterior, (value) => (value ? 0 : 1));
  if (id !== "grapes") return filled;
  // Open spaces enclosed by a vine or its leaf remain background, not highlights.
  const visited = new Uint8Array(pixels.length);
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] || exterior[start] || visited[start]) continue;
    const hole = [start];
    visited[start] = 1;
    let sy = 0;
    for (let n = 0; n < hole.length; n++) {
      const i = hole[n],
        x = i % width;
      sy += Math.floor(i / width);
      for (const j of [
        x ? i - 1 : -1,
        x < width - 1 ? i + 1 : -1,
        i - width,
        i + width,
      ]) {
        if (
          j >= 0 &&
          j < pixels.length &&
          !pixels[j] &&
          !exterior[j] &&
          !visited[j]
        ) {
          visited[j] = 1;
          hole.push(j);
        }
      }
    }
    const upper = sy / hole.length < height * 0.35;
    const open =
      (sy / hole.length < height * 0.2 && hole.length > 20) ||
      (upper && hole.length > 180);
    if (open) for (const i of hole) filled[i] = 0;
  }
  return filled;
}

function morphology(pixels, width, height, radius, dilate) {
  const stride = width + 1;
  const integral = new Uint32Array(stride * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += pixels[y * width + x];
      integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + row;
    }
  }
  const result = new Uint8Array(pixels.length);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - radius),
        x1 = Math.min(width, x + radius + 1);
      const y0 = Math.max(0, y - radius),
        y1 = Math.min(height, y + radius + 1);
      const count =
        integral[y1 * stride + x1] -
        integral[y0 * stride + x1] -
        integral[y1 * stride + x0] +
        integral[y0 * stride + x0];
      result[y * width + x] = dilate
        ? Number(count > 0)
        : Number(count === (2 * radius + 1) ** 2);
    }
  return result;
}

function subjectSilhouette(gray, width, height, radius = 3, id) {
  const ink = Uint8Array.from(gray, (value) => (value < 243 ? 1 : 0));
  const filled = fillHoles(ink, width, height, id);
  const core = morphology(filled, width, height, radius, false);
  const opened = morphology(core, width, height, radius, true);
  return morphology(
    opened,
    width,
    height,
    ["grapes", "french-fries"].includes(id) ? 1 : 2,
    false,
  );
}

module.exports = { subjectSilhouette };
