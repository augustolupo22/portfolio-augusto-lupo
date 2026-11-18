import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

const ffmpeg = process.env.FFMPEG || ffmpegPath;
const ffprobe = process.env.FFPROBE || ffprobeStatic.path;
const folders = JSON.parse(readFileSync('src/data/catalog-folders.json', 'utf8'));
const manifest = {};
for (const [slug, folder] of Object.entries(folders)) {
  const dir = `media-originales/${folder}`;
  for (const file of readdirSync(dir).sort().filter(f => /\.(mp4|webm|m4v|mov|ogv)$/i.test(f))) {
    const input = `${dir}/${file}`;
    const [stream] = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-select_streams', 'v:0',
      '-show_streams', '-of', 'json', input])).streams;
    let { width, height } = stream;
    const rotation = stream.side_data_list?.find(d => d.rotation != null)?.rotation ?? stream.tags?.rotate ?? 0;
    if (Math.abs(rotation) % 180 === 90) [width, height] = [height, width];

    // TV-range luma: reject near-black frames, including fades and tiny bright specks.
    const scale = width >= height ? "'min(720,iw)':-2" : "-2:'min(720,ih)'";
    const filter = `scale=${scale}:out_range=tv,format=yuv420p,signalstats,` +
      'metadata=select:key=lavfi.signalstats.YAVG:value=28:function=greater,' +
      'metadata=select:key=lavfi.signalstats.YHIGH:value=44:function=greater';
    const image = execFileSync(ffmpeg, ['-v', 'error', '-nostdin', '-i', input, '-map', '0:v:0',
      '-vf', filter, '-frames:v', '1', '-vsync', '0',
      '-c:v', 'libwebp', '-quality', '73', '-f', 'image2pipe', 'pipe:1']);
    if (!image.length) throw new Error(`Sin fotograma visible: ${input}`);
    const name = `${file}.webp`;
    mkdirSync(`public/video-posters/${slug}`, { recursive: true });
    writeFileSync(`public/video-posters/${slug}/${name}`, image);
    manifest[`${folder}/${file}`] = { poster: `/video-posters/${slug}/${encodeURIComponent(name)}`, width, height };
    console.log(`${file}: ${width}x${height}, ${image.length} bytes`);
  }
}
writeFileSync('src/data/video-posters.json', JSON.stringify(manifest, null, 2) + '\n');
