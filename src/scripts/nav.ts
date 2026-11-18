// Menú flotante: marca la sección visible (aria-current) y desliza la "píldora" azul hasta ella.

export function setupNav() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return;
  const pill = nav.querySelector<HTMLElement>('.nav-pill')!;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[data-section]'));

  const movePill = () => {
    const active = nav.querySelector<HTMLElement>('a[aria-current]');
    if (!active) { pill.classList.remove('is-ready'); return; }
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
    // Primera ubicación sin animar, para que no "viaje" al cargar.
    if (!pill.classList.contains('is-ready')) requestAnimationFrame(() => pill.classList.add('is-ready'));
  };
  const setActive = (id: string) => {
    for (const link of links) {
      if (link.dataset.section === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    movePill();
  };

  document.fonts.ready.then(movePill);
  // Si el menú cambia de tamaño (carga de fuentes o estilos, rotación del celular) se reubica la píldora.
  new ResizeObserver(movePill).observe(nav);
  movePill();

  // Solo en la portada se sigue la sección visible.
  const sections = links.map(link => document.getElementById(link.dataset.section!)).filter(Boolean) as HTMLElement[];
  if (sections.length !== links.length) return;
  const update = () => {
    const edge = innerHeight * 0.35;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= edge) current = section;
    if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
    if (!nav.querySelector(`a[data-section="${current.id}"][aria-current]`)) setActive(current.id);
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('pageshow', update);
  addEventListener('load', update);
  addEventListener('intro:done', update);
  update();
}
