// Cliente del muro de mensajes. Usa la API REST de Supabase (PostgREST) directamente con fetch,
// sin SDK. La clave "anon" es pública por diseño: lo que se puede hacer con ella lo limitan las
// políticas de seguridad (RLS) de la tabla, definidas en docs/muro-de-mensajes.md.

export interface Message { id: number; nombre: string; mensaje: string; created_at: string }

export const LIMITS = { name: 40, message: 280 };
const URL_BASE = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const TIMEOUT = 8000;

export const isConfigured = Boolean(URL_BASE && KEY);

export class GuestbookError extends Error {
  constructor(public kind: 'config' | 'network' | 'timeout' | 'server' | 'rate', message: string) { super(message); }
}

async function request(path: string, init: RequestInit = {}) {
  if (!isConfigured) throw new GuestbookError('config', 'El muro todavía no está conectado.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
      ...init,
      signal: controller.signal,
      headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...init.headers },
    });
    if (res.status === 429) throw new GuestbookError('rate', 'Hay muchos mensajes seguidos. Probá en un minuto.');
    if (!res.ok) throw new GuestbookError('server', `El servidor respondió con un error (${res.status}).`);
    return res;
  } catch (error) {
    if (error instanceof GuestbookError) throw error;
    if ((error as Error).name === 'AbortError') throw new GuestbookError('timeout', 'El servidor tardó demasiado en responder.');
    throw new GuestbookError('network', 'No hay conexión con el servidor.');
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchMessages(limit = 30): Promise<Message[]> {
  const res = await request(`mensajes?select=id,nombre,mensaje,created_at&order=created_at.desc&limit=${limit}`);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new GuestbookError('server', 'La respuesta no tiene el formato esperado.');
  // Se descartan filas incompletas en vez de romper la lista.
  return data.filter((m): m is Message => typeof m?.nombre === 'string' && typeof m?.mensaje === 'string' && typeof m?.created_at === 'string');
}

export async function postMessage(nombre: string, mensaje: string): Promise<Message> {
  const res = await request('mensajes', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ nombre, mensaje }),
  });
  const [row] = (await res.json()) as Message[];
  return row;
}

export function validate(nombre: string, mensaje: string) {
  const errors: { nombre?: string; mensaje?: string } = {};
  if (!nombre) errors.nombre = 'Escribí tu nombre.';
  else if (nombre.length > LIMITS.name) errors.nombre = `Máximo ${LIMITS.name} caracteres.`;
  if (!mensaje) errors.mensaje = 'Escribí un mensaje.';
  else if (mensaje.length > LIMITS.message) errors.mensaje = `Máximo ${LIMITS.message} caracteres.`;
  return errors;
}

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, size] of units) if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  return 'recién';
}
