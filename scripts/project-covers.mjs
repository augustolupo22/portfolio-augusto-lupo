import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const folders = JSON.parse(readFileSync('src/data/catalog-folders.json', 'utf8'));
// Top of each editorial crop in source pixels. Keep the original horizontal field.
const shots = [
  ['el-gran-premio-de-la-cocina', 'DSC00156.jpg', 330],
  ['por-amor-o-por-dinero', 'Back Promo v6.mp4', 230],
  ['dj-fgl', '_DSC0929.jpg', 1570],
  ['fauda', '_DSC2023.jpg', 2120],
  ['valen-cortes', 'DSC06657.jpg', 380],
];
mkdirSync('public/project-covers', { recursive: true });
for (const [slug, file, top] of shots) {
  const path = `media-originales/${folders[slug]}/${file}`;
  const input = file.endsWith('.mp4') ? execFileSync(process.env.FFMPEG || ffmpegPath,
    ['-v', 'error', '-nostdin', '-ss', '0.12', '-i', path, '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', 'pipe:1'],
    { maxBuffer: 16 * 1024 ** 2 }) : path;
  const { width } = await sharp(input).metadata();
  const unit = Math.floor(width / 16);
  const out = Math.min(unit, 80);
  await sharp(input).extract({ left: Math.floor((width - unit * 16) / 2), top, width: unit * 16, height: unit * 9 })
    .resize(out * 16, out * 9).webp({ quality: 85 }).toFile(`public/project-covers/${slug}.webp`);
}
