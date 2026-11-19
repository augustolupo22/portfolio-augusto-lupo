// Genera versiones livianas para la web a partir de los originales.
// Originales: media-originales/ (fuera del repo, ignorado por git).
// Salida:     public/media/ (lo que se publica y se sube al repo).
// Solo se procesan las carpetas del catálogo y el retrato; el resto de los originales no se publica.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import sharp from 'sharp';

const SOURCE = 'media-originales';
const OUTPUT = 'public/media';
const MAX_PHOTO_SIDE = 2400; // px del lado largo
const VIDEO_SHORT_SIDE = 720; // px del lado corto (720p)

const folders = Object.values(JSON.parse(readFileSync('src/data/catalog-folders.json', 'utf8')));
const portrait = 'Foto personal.JPEG';
const force = process.argv.includes('--force');

function isFresh(input, output) {
  return !force && existsSync(output) && statSync(output).mtimeMs >= statSync(input).mtimeMs;
}

async function photo(input, output) {
  if (isFresh(input, output)) return;
  await sharp(input).rotate()
    .resize(MAX_PHOTO_SIDE, MAX_PHOTO_SIDE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true }).toFile(output);
}

function video(input, output) {
  if (isFresh(input, output)) return;
  const [stream] = JSON.parse(execFileSync(ffprobeStatic.path, ['-v', 'error', '-select_streams', 'v:0',
    '-show_streams', '-of', 'json', input])).streams;
  let { width, height } = stream;
  const rotation = stream.side_data_list?.find(d => d.rotation != null)?.rotation ?? stream.tags?.rotate ?? 0;
  if (Math.abs(rotation) % 180 === 90) [width, height] = [height, width];
  const scale = width >= height ? `-2:${Math.min(VIDEO_SHORT_SIDE, height)}` : `${Math.min(VIDEO_SHORT_SIDE, width)}:-2`;
  // Videos largos (más de 2 minutos): menos bitrate para que el archivo quede por debajo de ~50 MB.
  const long = Number(stream.duration) > 120;
  execFileSync(ffmpegPath, ['-v', 'error', '-nostdin', '-y', '-i', input, '-map', '0:v:0', '-map', '0:a:0?',
    '-vf', `scale=${scale}`, '-c:v', 'libx264', '-preset', 'medium', '-crf', long ? '27' : '25',
    '-maxrate', long ? '1.4M' : '3M', '-bufsize', long ? '2.8M' : '6M', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', output]);
}

for (const folder of folders) {
  mkdirSync(`${OUTPUT}/${folder}`, { recursive: true });
  for (const file of readdirSync(`${SOURCE}/${folder}`).sort()) {
    const input = `${SOURCE}/${folder}/${file}`;
    const output = `${OUTPUT}/${folder}/${file}`;
    if (/\.(jpe?g|png|webp)$/i.test(file)) await photo(input, output);
    else if (/\.(mp4|mov|m4v|webm)$/i.test(file)) video(input, output);
    else continue;
    console.log(`ok  ${folder}/${file}`);
  }
}
await photo(`${SOURCE}/${portrait}`, `${OUTPUT}/${portrait}`);
console.log(`ok  ${portrait}`);
