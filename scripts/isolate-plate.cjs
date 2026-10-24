// Discard detached slivers from neighbouring atlas cells without losing the
// separate foods in a bunch of grapes, a pile of crisps, or scattered popcorn.
function isolatePlate(gray, width, height) {
  let foreground = Uint8Array.from(gray, (value) => (value < 246 ? 1 : 0));
  for (let pass = 0; pass < 2; pass++) {
    const expanded = Uint8Array.from(foreground);
    for (let y = 1; y < height - 1; y++)
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        if (foreground[i])
          for (const d of [
            -width - 1,
            -width,
            -width + 1,
            -1,
            1,
            width - 1,
            width,
            width + 1,
          ])
            expanded[i + d] = 1;
      }
    foreground = expanded;
  }
  const labels = new Int32Array(gray.length);
  const components = [];
  for (let start = 0; start < foreground.length; start++) {
    if (!foreground[start] || labels[start]) continue;
    const label = components.length + 1;
    const queue = [start];
    labels[start] = label;
    const bounds = { x0: width, x1: 0, y0: height, y1: 0 };
    for (let n = 0; n < queue.length; n++) {
      const i = queue[n],
        x = i % width,
        y = Math.floor(i / width);
      bounds.x0 = Math.min(bounds.x0, x);
      bounds.x1 = Math.max(bounds.x1, x);
      bounds.y0 = Math.min(bounds.y0, y);
      bounds.y1 = Math.max(bounds.y1, y);
      for (const j of [
        x ? i - 1 : -1,
        x < width - 1 ? i + 1 : -1,
        i - width,
        i + width,
      ]) {
        if (j >= 0 && j < foreground.length && foreground[j] && !labels[j]) {
          labels[j] = label;
          queue.push(j);
        }
      }
    }
    components.push({ ...bounds, area: queue.length, label });
  }
  const largest = Math.max(0, ...components.map((c) => c.area));
  const neighbourSliver = (c) =>
    c.area < largest * 0.2 &&
    (c.x0 < 4 || c.y0 < 4 || c.x1 >= width - 4 || c.y1 >= height - 4);
  const primary = components.filter(
    (c) => c.area >= Math.max(80, largest * 0.015) && !neighbourSliver(c),
  );
  const keep = new Set(primary.map((c) => c.label));
  for (const c of components) {
    if (
      !neighbourSliver(c) &&
      primary.some(
        (p) =>
          c.x0 >= p.x0 - 10 &&
          c.x1 <= p.x1 + 10 &&
          c.y0 >= p.y0 - 10 &&
          c.y1 <= p.y1 + 10,
      )
    )
      keep.add(c.label);
  }
  return Buffer.from(
    gray.map((value, i) => (keep.has(labels[i]) ? value : 255)),
  );
}

module.exports = { isolatePlate };
