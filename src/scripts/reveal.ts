// Aparición progresiva: los elementos con [data-reveal] entran al llegar a la pantalla.
// Los hermanos que aparecen juntos se escalonan (stagger) con un pequeño retraso.
import { introDone } from './loader';

export function setupReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal], .glitch');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('is-revealed'));
    return;
  }
  introDone().then(() => {
    const observer = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((entry, i) => {
        const el = entry.target as HTMLElement;
        el.style.setProperty('--delay', `${Math.min(i, 6) * 80}ms`);
        el.classList.add('is-revealed');
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => observer.observe(el));
  });
}
