// Fondo de estrellas en <canvas>: titilan, se desplazan levemente con el scroll (parallax)
// y cada tanto cruza una estrella fugaz. Con "reducir movimiento" se dibuja una sola vez.

interface Star { x: number; y: number; r: number; a: number; speed: number; phase: number; depth: number }
interface Meteor { x: number; y: number; vx: number; vy: number; life: number }

export function startStarfield(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let stars: Star[] = [];
  let meteor: Meteor | null = null;
  let nextMeteor = performance.now() + 3000;
  let w = 0, h = 0, dpr = 1, frame = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.min(260, Math.round(w * h / 7000));
    stars = Array.from({ length: total }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() < 0.9 ? Math.random() * 0.9 + 0.3 : Math.random() * 1.4 + 1,
      a: Math.random() * 0.6 + 0.25, speed: Math.random() * 1.5 + 0.4, phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.25 + 0.05,
    }));
  }

  function draw(time: number) {
    ctx!.clearRect(0, 0, w, h);
    const scroll = scrollY;
    for (const s of stars) {
      const twinkle = still.matches ? 1 : 0.65 + 0.35 * Math.sin(time / 1000 * s.speed + s.phase);
      const y = ((s.y - scroll * s.depth) % h + h) % h;
      ctx!.globalAlpha = s.a * twinkle;
      ctx!.fillStyle = s.r > 1.2 ? '#bfdbfe' : '#e2e8f0';
      ctx!.beginPath();
      ctx!.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    if (!still.matches) {
      if (!meteor && time > nextMeteor) {
        meteor = { x: Math.random() * w * 0.7 + w * 0.3, y: Math.random() * h * 0.4, vx: -9, vy: 4, life: 1 };
      }
      if (meteor) {
        const tail = ctx!.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 14, meteor.y - meteor.vy * 14);
        tail.addColorStop(0, `rgba(191,219,254,${meteor.life})`);
        tail.addColorStop(1, 'rgba(191,219,254,0)');
        ctx!.globalAlpha = 1;
        ctx!.strokeStyle = tail;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(meteor.x, meteor.y);
        ctx!.lineTo(meteor.x - meteor.vx * 14, meteor.y - meteor.vy * 14);
        ctx!.stroke();
        meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life -= 0.012;
        if (meteor.life <= 0 || meteor.x < -200 || meteor.y > h + 200) {
          meteor = null;
          nextMeteor = time + 4000 + Math.random() * 6000;
        }
      }
    }
    ctx!.globalAlpha = 1;
  }

  function loop(time: number) {
    draw(time);
    frame = requestAnimationFrame(loop);
  }
  function start() {
    cancelAnimationFrame(frame);
    if (still.matches) draw(0);
    else frame = requestAnimationFrame(loop);
  }

  resize();
  start();
  addEventListener('resize', () => { resize(); if (still.matches) draw(0); });
  addEventListener('scroll', () => { if (still.matches) draw(0); }, { passive: true });
  still.addEventListener('change', start);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else start();
  });
}
