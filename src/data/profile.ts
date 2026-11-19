// Contenido personal del portfolio. Editar acá cambia los textos del sitio sin tocar el diseño.
// Regla: no completar datos que Augusto no haya confirmado (años, cifras, clientes).

export type Photo = { src: string; alt: string };

export interface Education { institution: string; title: string; detail: string }
export interface Experience { place: string; type: string; role: string; detail: string; project?: string }
export interface Tool { name: string; short: string; color: string; use: string }
export interface OwnProject { name: string; description: string; status: 'Publicado' | 'En desarrollo' | 'Próximamente'; url?: string }
export interface Client { name: string; type: string; projects: string[]; extra?: string[] }

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
    { institution: 'Escuela Santísima Virgen Niña', title: 'Educación primaria y secundaria', detail: 'Alberti, provincia de Buenos Aires' },
  ] as Education[],

  experience: [
    {
      place: 'eltrece', type: 'Canal de televisión argentino',
      role: 'Equipo técnico del stream: dirección de cámaras y camarógrafo',
      detail: 'Por amor o por dinero', project: 'por-amor-o-por-dinero',
    },
    {
      place: 'ShowThisNow', type: 'Productora audiovisual',
      role: 'Técnico en producciones en vivo',
      detail: 'Armado de transmisiones: streaming, gráfica, replay, dirección de cámaras y audio',
    },
    {
      place: 'Trabajos freelance', type: 'Fotografía y filmmaking',
      role: 'Fotografía de backstage, books de XV y videos para creadores de contenido',
      detail: 'Edición y entrega de videos para redes',
    },
  ] as Experience[],

  tools: [
    { name: 'Premiere Pro', short: 'Pr', color: '#9999FF', use: 'Edición de video' },
    { name: 'Lightroom', short: 'Lr', color: '#31A8FF', use: 'Revelado y color' },
    { name: 'Photoshop', short: 'Ps', color: '#31C5F0', use: 'Retoque fotográfico' },
    { name: 'vMix', short: 'vM', color: '#F97316', use: 'Producción en vivo' },
    { name: 'OBS Studio', short: 'OBS', color: '#E4E4E7', use: 'Producción en vivo' },
    { name: 'IA aplicada a la web', short: 'IA', color: '#FACC15', use: 'Desarrollo web asistido' },
  ] as Tool[],

  // Proyectos web propios. La idea a futuro es conectarlos con una plataforma para publicar y vender páginas.
  ownProjects: [
    {
      name: 'Este portfolio', status: 'Publicado', url: 'https://github.com/augustolupo22/portfolio-augusto-lupo',
      description: 'Sitio hecho con Astro, credencial 3D interactiva y muro de mensajes conectado a una base de datos.',
    },
    {
      name: 'Página para streams', status: 'En desarrollo',
      description: 'Herramientas para transmisiones en vivo: juegos con gráfica propia y recursos para darle dinamismo al stream.',
    },
    {
      name: 'Plataforma de páginas', status: 'Próximamente',
      description: 'Un espacio para publicar páginas propias, que la gente pueda comprarlas y recibir los pagos online.',
    },
  ] as OwnProject[],

  clients: [
    { name: 'eltrece', type: 'Canal de televisión', projects: ['por-amor-o-por-dinero', 'el-gran-premio-de-la-cocina'], extra: ['Prende, canal de stream'] },
    { name: 'Fiesta Fauda', type: 'Fiesta electrónica', projects: ['fauda'] },
    { name: 'DJ FGL', type: 'Artista', projects: ['dj-fgl'] },
    { name: 'Valen Cortes', type: 'Creadora de contenido', projects: ['valen-cortes'] },
  ] as Client[],

  contact: {
    title: 'Creemos algo juntos.',
    subtitle: '¿Tenés un proyecto en mente? Hagámoslo realidad.',
    email: 'augustolupo030422@gmail.com',
    socials: [
      { label: 'Instagram', handle: '@augusto_lupo', url: 'https://www.instagram.com/augusto_lupo/', icon: 'instagram' },
      { label: 'TikTok', handle: '@augustolupo22', url: 'https://www.tiktok.com/@augustolupo22', icon: 'tiktok' },
      { label: 'Behance', handle: 'augustolupo', url: 'https://www.behance.net/augustolupo', icon: 'behance' },
      { label: 'LinkedIn', handle: 'augusto-lupo', url: 'https://www.linkedin.com/in/augusto-lupo/', icon: 'linkedin' },
    ],
  },
};
