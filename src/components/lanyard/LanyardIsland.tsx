// Isla de React que decide si se puede mostrar la credencial 3D.
// Si el dispositivo no la soporta (táctil, "reducir movimiento", sin WebGL o error),
// no descarga Three.js y queda visible la credencial estática que renderiza Astro.
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import type { BadgeData } from './textures';

const LanyardScene = lazy(() => import('./LanyardScene'));

function supports3D() {
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 900px)').matches) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** Avisa al loader y al contenedor en qué modo quedó la credencial. */
function announce(mode: '3d' | 'static') {
  document.querySelector('[data-badge]')?.setAttribute('data-mode', mode);
  window.dispatchEvent(new CustomEvent('badge:ready', { detail: mode }));
}

class Fallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { announce('static'); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function LanyardIsland({ data }: { data: BadgeData }) {
  const [enabled, setEnabled] = useState(false);
  const [grabbed, setGrabbed] = useState(false);

  useEffect(() => {
    if (supports3D()) setEnabled(true);
    else announce('static');
  }, []);

  if (!enabled) return null;
  return (
    <Fallback>
      <Suspense fallback={null}>
        <LanyardScene data={data} onReady={() => announce('3d')} onGrab={() => setGrabbed(true)} />
      </Suspense>
      <p className={`badge-hint${grabbed ? ' is-done' : ''}`} aria-hidden="true">Arrastrá la credencial ↻</p>
    </Fallback>
  );
}
