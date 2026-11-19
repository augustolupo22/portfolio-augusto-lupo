import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const folders = JSON.parse(readFileSync('src/data/catalog-folders.json', 'utf8'));
// Portada 16:9 de cada proyecto: [slug, archivo, borde superior del recorte en píxeles del original,
// segundo del video (solo para videos)]. Se conserva todo el ancho original.
const shots = [
  ['el-gran-premio-de-la-cocina', 'DSC00156.jpg', 330],
  ['por-amor-o-por-dinero', 'Back Promo v6.mp4', 250, 5.0],
  ['dj-fgl', '_DSC0929.jpg', 1570],
  ['fauda', '_DSC2023.jpg', 2120],
  ['valen-cortes', 'DSC06657.jpg', 380],
  ['book-xv-delfina', 'VIDEO FINAL PANTALLA.mp4', 0, 45.9],
];
// Con argumentos se regeneran solo esas portadas: npm run covers -- por-amor-o-por-dinero
const only = process.argv.slice(2);
mkdirSync('public/project-covers', { recursive: true });
for (const [slug, file, top, seconds = 0.12] of shots) {
  if (only.length && !only.includes(slug)) continue;
  const path = `media-originales/${folders[slug]}/${file}`;
  const input = file.endsWith('.mp4') ? execFileSync(process.env.FFMPEG || ffmpegPath,
    ['-v', 'error', '-nostdin', '-ss', String(seconds), '-i', path, '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', 'pipe:1'],
    { maxBuffer: 16 * 1024 ** 2 }) : path;
  const { width } = await sharp(input).metadata();
  const unit = Math.floor(width / 16);
  const out = Math.min(unit, 80);
  await sharp(input).extract({ left: Math.floor((width - unit * 16) / 2), top, width: unit * 16, height: unit * 9 })
    .resize(out * 16, out * 9).webp({ quality: 85 }).toFile(`public/project-covers/${slug}.webp`);
}
