// Dibuja las caras de la credencial y la cinta en <canvas> para usarlas como texturas.
// Así no dependemos de un modelo 3D externo: el diseño de la credencial vive en este archivo.
import * as THREE from 'three';

export interface BadgeData {
  name: string;
  role: string;
  footer: string;
  handle: string;
  site: string;
  portrait?: string;
  /** Punto de foco vertical del retrato (0 = arriba, 1 = abajo). */
  focusY?: number;
}

export const CARD_PX = { w: 800, h: 1125 };
const SANS = '"Geist Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  let cx = x;
  let seed = 7;
  while (cx < x + w) {
    seed = (seed * 9301 + 49297) % 233280;
    const bar = 2 + (seed % 4) * 2;
    ctx.fillRect(cx, y, bar, h);
    cx += bar + 3 + (seed % 3) * 2;
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

async function fontsReady() {
  try {
    await Promise.all([document.fonts.load(`700 80px ${SANS}`), document.fonts.load(`500 24px ${MONO}`)]);
  } catch { /* si la fuente falla se usa la del sistema */ }
}

export async function drawFront(data: BadgeData) {
  await fontsReady();
  const { w, h } = CARD_PX;
  const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = canvas.getContext('2d')!;

  // Base con esquinas redondeadas (el resto queda transparente)
  roundRect(ctx, 0, 0, w, h, 52);
  ctx.save();
  ctx.clip();
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#f8fafc');
  bg.addColorStop(1, '#c7d4e6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ranura para el clip
  ctx.fillStyle = '#0f1b2d';
  roundRect(ctx, w / 2 - 70, 34, 140, 22, 11);
  ctx.fill();

  // Encabezado
  ctx.fillStyle = '#0f1b2d';
  ctx.font = `800 64px ${SANS}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('AL /', 52, 132);
  ctx.font = `500 24px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.fillText('PASE DE RODAJE', w - 52, 126);
  ctx.textAlign = 'left';

  // Retrato
  const px = 48, py = 160, pw = w - 96, ph = 560;
  roundRect(ctx, px, py, pw, ph, 22);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#1c1708';
  ctx.fillRect(px, py, pw, ph);
  if (data.portrait) {
    try {
      const img = await loadImage(data.portrait);
      const scale = Math.max(pw / img.width, ph / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      const focus = data.focusY ?? 0.3;
      const dy = Math.min(0, Math.max(ph - dh, ph / 2 - dh * focus));
      ctx.drawImage(img, px + (pw - dw) / 2, py + dy, dw, dh);
    } catch { /* sin retrato: queda la placa azul */ }
  }
  const shade = ctx.createLinearGradient(0, py + ph * 0.6, 0, py + ph);
  shade.addColorStop(0, 'rgba(9,9,11,0)');
  shade.addColorStop(1, 'rgba(9,9,11,.55)');
  ctx.fillStyle = shade;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  // Datos del titular
  ctx.fillStyle = '#334155';
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText('TITULAR', 52, 790);
  ctx.fillStyle = '#0f1b2d';
  ctx.font = `750 86px ${SANS}`;
  ctx.fillText(data.name, 48, 874);
  ctx.fillStyle = '#A16207';
  ctx.font = `600 26px ${MONO}`;
  ctx.fillText(data.role.toUpperCase(), 52, 922);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(52, 966, w - 104, 2);
  ctx.fillStyle = '#0f1b2d';
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(data.footer.toUpperCase(), 52, 1030);
  barcode(ctx, w - 230, 996, 178, 54, '#0f1b2d');
  ctx.restore();
  return toTexture(canvas);
}

export async function drawBack(data: BadgeData) {
  await fontsReady();
  const { w, h } = CARD_PX;
  const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = canvas.getContext('2d')!;
  roundRect(ctx, 0, 0, w, h, 52);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#0c0c0e';
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.42, w * 0.75);
  glow.addColorStop(0, 'rgba(234,179,8,.55)');
  glow.addColorStop(1, 'rgba(234,179,8,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(148,163,184,.12)';
  for (let x = 0; x <= w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  ctx.fillStyle = '#e2e8f0';
  roundRect(ctx, w / 2 - 70, 34, 140, 22, 11);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = `800 300px ${SANS}`;
  ctx.fillText('AL', w / 2, h * 0.52);
  ctx.fillStyle = '#FDE68A';
  ctx.font = `500 30px ${MONO}`;
  ctx.fillText(data.handle, w / 2, h * 0.64);
  ctx.fillStyle = '#A1A1AA';
  ctx.font = `500 22px ${MONO}`;
  ctx.fillText(data.site, w / 2, h * 0.69);
  barcode(ctx, w / 2 - 150, h - 150, 300, 60, '#e2e8f0');
  ctx.restore();
  return toTexture(canvas);
}

export async function drawBand(text: string) {
  await fontsReady();
  const font = `700 54px ${SANS}`;
  const label = `${text.toUpperCase()}  ✦  `;
  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = font;
  // El ancho del canvas es exactamente dos repeticiones del texto: así la cinta no tiene cortes al repetirse.
  const step = Math.ceil(probe.measureText(label).width);
  const canvas = Object.assign(document.createElement('canvas'), { width: step * 2, height: 128 });
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#422006';
  ctx.fillRect(0, 0, canvas.width, 128);
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 14, canvas.width, 100);
  ctx.fillStyle = '#111111';
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 66);
  ctx.fillText(label, step, 66);
  const texture = toTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
