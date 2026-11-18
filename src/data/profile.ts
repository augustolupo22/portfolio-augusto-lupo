// Contenido personal del portfolio. Editar acá cambia los textos del sitio sin tocar el diseño.
// Regla: no completar datos que Augusto no haya confirmado (años, cifras, clientes, equipo).

export type Photo = { src: string; alt: string };

export interface Education { institution: string; title: string; detail: string }
export interface Experience { place: string; role: string; detail: string; project?: string }
export interface Tool { name: string; short: string; color: string; use: string }
export interface Gear { name: string; type: string }
export interface Client { name: string; type: string; projects: string[] }

export const profile = {
  name: 'Augusto Lupo',
  roles: ['Realizador audiovisual', 'Director de cámaras', 'Filmmaker', 'Fotógrafo'],
  intro: 'Dirijo cámaras en transmisiones en vivo y trabajo de forma independiente en fotografía y video, tanto en estudio como detrás del escenario.',
  portrait: { src: '/media/Foto personal.JPEG', alt: 'Retrato de Augusto Lupo con auriculares en un set de transmisión' } as Photo,
  /** Punto de foco vertical del retrato al recortarlo (0 arriba, 1 abajo). */
  portraitFocus: 0.3,

  about: {
    title: 'Detrás de cámara. Dentro de cada historia.',
    paragraphs: [
      'Soy realizador audiovisual especializado en dirección de cámaras en vivo, producción de contenido, filmmaking y fotografía. Me apasiona contar historias a través de imágenes, combinando creatividad, técnica y narrativa visual.',
      'Disfruto de todo lo que pasa en un set: estudios, grabaciones, coberturas y salidas a fotografiar. Trabajo con prolijidad, responsabilidad y atención a la calidad de cada entrega.',
    ],
  },

  education: [
    { institution: 'Universidad Maimónides', title: 'Licenciatura en Tecnología Multimedial', detail: 'Cursando 4.º año' },
  ] as Education[],

  experience: [
    { place: 'eltrece', role: 'Dirección de streaming y edición de clips', detail: 'Por amor o por dinero', project: 'por-amor-o-por-dinero' },
    { place: 'eltrece', role: 'Fotografía y cobertura en video', detail: 'El Gran Premio de la Cocina', project: 'el-gran-premio-de-la-cocina' },
    { place: 'Freelance', role: 'Fotografía y video', detail: 'Eventos, artistas y contenido para redes' },
  ] as Experience[],

  tools: [
    { name: 'Premiere Pro', short: 'Pr', color: '#9999FF', use: 'Edición de video' },
    { name: 'Lightroom', short: 'Lr', color: '#31A8FF', use: 'Revelado y color' },
    { name: 'Photoshop', short: 'Ps', color: '#31C5F0', use: 'Retoque fotográfico' },
    { name: 'IA aplicada a la web', short: 'IA', color: '#93C5FD', use: 'Desarrollo web asistido' },
  ] as Tool[],

  // Pendiente: Augusto va a pasar el listado de cámaras, lentes y equipos de transmisión.
  gear: [] as Gear[],

  clients: [
    { name: 'eltrece', type: 'Canal de televisión', projects: ['por-amor-o-por-dinero', 'el-gran-premio-de-la-cocina'] },
    { name: 'FAUDA', type: 'Fiesta electrónica', projects: ['fauda'] },
    { name: 'DJ FGL', type: 'Artista', projects: ['dj-fgl'] },
    { name: 'Valen Cortes', type: 'Creadora de contenido', projects: ['valen-cortes'] },
  ] as Client[],

  contact: {
    title: "Let's create something together.",
    subtitle: '¿Tenés un proyecto en mente? Hagámoslo realidad.',
    email: 'augustolupo030422@gmail.com',
    // Agregar Behance y LinkedIn cuando estén los enlaces confirmados.
    socials: [
      { label: 'Instagram', handle: '@augusto_lupo', url: 'https://www.instagram.com/augusto_lupo/', icon: 'instagram' },
      { label: 'TikTok', handle: '@augustolupo22', url: 'https://www.tiktok.com/@augustolupo22', icon: 'tiktok' },
    ],
  },
};
