import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';

// Keep original artwork; build smaller delivery sizes without changing the design.
export async function buildResponsiveImages() {
  const directory = 'assets/home-truths';
  const originals = (await readdir(directory)).filter(name => name.endsWith('.webp') && !/-\d+w\.webp$/.test(name));
  for (const name of originals) {
    const source = `${directory}/${name}`;
    const modified = (await stat(source)).mtimeMs;
    for (const width of [320, 480, 640, 960]) {
      const target = `${directory}/${name.replace('.webp', `-${width}w.webp`)}`;
      const existing = await stat(target).catch(() => null);
      if (existing && existing.mtimeMs >= modified) continue;
      await sharp(source).resize({ width }).webp({ quality: 78, effort: 4 }).toFile(target);
    }
  }
}
