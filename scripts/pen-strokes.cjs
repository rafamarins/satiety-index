// Extract open pen centre-lines, rather than outlining filled black islands.
function thin(ink, width, height) {
  const pixels = Uint8Array.from(ink);
  let changed = true;
  while (changed) {
    changed = false;
    for (let pass = 0; pass < 2; pass++) {
      const remove = [];
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          if (!pixels[i]) continue;
          const p = [
            pixels[i - width],
            pixels[i - width + 1],
            pixels[i + 1],
            pixels[i + width + 1],
            pixels[i + width],
            pixels[i + width - 1],
            pixels[i - 1],
            pixels[i - width - 1],
          ];
          const count = p.reduce((a, b) => a + b, 0);
          if (count < 2 || count > 6) continue;
          let transitions = 0;
          for (let j = 0; j < 8; j++)
            if (!p[j] && p[(j + 1) % 8]) transitions++;
          if (transitions !== 1) continue;
          const a = pass ? p[0] * p[2] * p[6] : p[0] * p[2] * p[4];
          const b = pass ? p[0] * p[4] * p[6] : p[2] * p[4] * p[6];
          if (!a && !b) remove.push(i);
        }
      }
      if (remove.length) changed = true;
      for (const i of remove) pixels[i] = 0;
    }
  }
  return pixels;
}

function simplify(points, tolerance = 0.42) {
  if (points.length <= 2) return points;
  const first = points[0],
    last = points.at(-1);
  const dx = last[0] - first[0],
    dy = last[1] - first[1];
  let greatest = tolerance * tolerance,
    split = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const t =
      dx || dy
        ? Math.max(
            0,
            Math.min(
              1,
              ((points[i][0] - first[0]) * dx +
                (points[i][1] - first[1]) * dy) /
                (dx * dx + dy * dy),
            ),
          )
        : 0;
    const distance =
      (points[i][0] - first[0] - t * dx) ** 2 +
      (points[i][1] - first[1] - t * dy) ** 2;
    if (distance > greatest) {
      greatest = distance;
      split = i;
    }
  }
  return split < 0
    ? [first, last]
    : [
        ...simplify(points.slice(0, split + 1), tolerance).slice(0, -1),
        ...simplify(points.slice(split), tolerance),
      ];
}

function centreLines(ink, gray, width, height) {
  const pixels = thin(ink, width, height);
  const steps = [
    -width,
    -width + 1,
    1,
    width + 1,
    width,
    width - 1,
    -1,
    -width - 1,
  ];
  const vectors = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  const graph = new Uint8Array(pixels.length);
  const used = new Uint8Array(pixels.length);
  for (let y = 1; y < height - 1; y++)
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      if (!pixels[i]) continue;
      for (let d = 0; d < 8; d++) {
        if (!pixels[i + steps[d]]) continue;
        // Suppress diagonal shortcuts across an existing right-angle connection.
        if (
          d % 2 &&
          (pixels[i + steps[(d + 7) % 8]] || pixels[i + steps[(d + 1) % 8]])
        )
          continue;
        graph[i] |= 1 << d;
      }
    }
  const degree = (n) => n.toString(2).replaceAll("0", "").length;
  const starts = Array.from(pixels.keys()).filter((i) => graph[i]);
  starts.sort((a, b) => degree(graph[a]) - degree(graph[b]));
  const lines = [];
  for (const start of starts) {
    while (graph[start] & ~used[start]) {
      const points = [];
      let i = start,
        previous = -1,
        length = 0,
        darkness = 0;
      while (true) {
        points.push([i % width, Math.floor(i / width)]);
        darkness += 255 - gray[i];
        let next = -1,
          best = -Infinity;
        for (let d = 0; d < 8; d++) {
          if (!(graph[i] & ~used[i] & (1 << d))) continue;
          const dot =
            previous < 0
              ? 0
              : (vectors[d][0] * vectors[previous][0] +
                  vectors[d][1] * vectors[previous][1]) /
                (Math.hypot(...vectors[d]) * Math.hypot(...vectors[previous]));
          if (dot > best) {
            next = d;
            best = dot;
          }
        }
        if (next < 0 || (previous >= 0 && best < -0.1)) break;
        used[i] |= 1 << next;
        i += steps[next];
        used[i] |= 1 << (next + 4) % 8;
        previous = next;
        length += Math.hypot(...vectors[next]);
      }
      if (length < 3.5) continue;
      const p = simplify(points);
      const pair = (p) => p.join(" ");
      const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      let d = `M${pair(p[0])}`;
      if (p.length > 2) {
        d += `L${pair(midpoint(p[0], p[1]))}`;
        for (let n = 1; n < p.length - 1; n++)
          d += `Q${pair(p[n])} ${pair(midpoint(p[n], p[n + 1]))}`;
      }
      d += `L${pair(p.at(-1))}`;
      lines.push({
        d,
        length,
        weight: Math.min(0.78, 0.32 + darkness / points.length / 420),
      });
    }
  }
  return lines;
}

module.exports = { centreLines };
