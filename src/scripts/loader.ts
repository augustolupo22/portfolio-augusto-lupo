// Pantalla de carga con progreso real. Cada tarea suma su parte al porcentaje:
// tipografías, imágenes visibles al inicio y, en la portada, la credencial (3D o estática).
// Se muestra solo en la primera visita de la sesión y nunca demora más de lo necesario.

const MAX_WAIT = 7000;

export function runLoader() {
  const root = document.documentElement;
  if (!root.classList.contains('is-loading')) return;

  const count = document.querySelector<HTMLElement>('[data-loader-count]')!;
  const label = document.querySelector<HTMLElement>('[data-loader-label]')!;
  const bar = document.querySelector<HTMLElement>('.loader-bar i')!;

  const tasks: { label: string; done: Promise<unknown> }[] = [
    { label: 'Cargando tipografías…', done: document.fonts.ready },
  ];
  const images = Array.from(document.images).filter(img => img.loading !== 'lazy' && !img.complete);
  for (const img of images) {
    tasks.push({ label: 'Revelando fotos…', done: new Promise(r => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }) });
  }
  const badge = document.querySelector('[data-badge]');
  if (badge) {
    // La credencial puede haber avisado antes de que corra este script: se revisa su atributo.
    tasks.push({ label: 'Colgando la credencial…', done: badge.hasAttribute('data-mode') ? Promise.resolve()
      : new Promise(r => window.addEventListener('badge:ready', r, { once: true })) });
  }

  let finished = 0;
  let target = 0;
  let shown = 0;
  label.textContent = tasks[0].label;
  for (const task of tasks) {
    task.done.then(() => {
      finished++;
      target = finished / tasks.length;
      const next = tasks.find((_, i) => i >= finished);
      if (next) label.textContent = next.label;
    });
  }
  const timeout = setTimeout(() => { target = 1; }, MAX_WAIT);

  const tick = () => {
    // Se acerca al objetivo con suavidad, pero rápido si todo ya está listo.
    shown += (target - shown) * (target === 1 ? 0.18 : 0.08);
    if (target - shown < 0.004) shown = target;
    const pct = Math.round(shown * 100);
    count.textContent = String(pct);
    bar.style.setProperty('--p', String(shown));
    if (shown >= 1) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  function finish() {
    clearTimeout(timeout);
    label.textContent = 'Listo';
    try { sessionStorage.setItem('al:intro', '1'); } catch { /* sin almacenamiento: la intro vuelve a mostrarse */ }
    root.classList.add('is-leaving');
    setTimeout(() => {
      root.classList.remove('is-loading', 'is-leaving');
      window.dispatchEvent(new Event('intro:done'));
    }, 850);
  }
}

/** Resuelve cuando ya no hay pantalla de carga (o si nunca la hubo). */
export function introDone() {
  return new Promise<void>(resolve => {
    if (!document.documentElement.classList.contains('is-loading')) resolve();
    else window.addEventListener('intro:done', () => resolve(), { once: true });
  });
}
