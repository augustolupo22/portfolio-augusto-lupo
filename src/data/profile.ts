export type Photo = { src: string; alt: string };
type Experience = {
  title: string;
  description: string;
  logo?: Photo;
  image?: Photo;
  video?: { src: string; title: string; captions?: string };
};

const experience: Experience[] = [
  { title: 'Dirección de cámaras', description: 'Dirección de cámaras para transmisiones en vivo.' },
  { title: 'Realización independiente', description: 'Fotografía de DJs detrás de escena, producciones de moda y realización de fotos y video para fiestas de quince.' },
];

export const profile = {
  name: 'Augusto Lupo',
  subtitle: 'Realizador Audiovisual · Director de Cámaras · Filmmaker · Fotógrafo',
  intro: 'Dirijo cámaras en transmisiones en vivo y trabajo de forma independiente en fotografía y video, tanto en estudio como detrás del escenario.',
  portrait: { src: '/media/Foto personal.JPEG', alt: 'Retrato de Augusto Lupo' } as Photo | null,
  about: {
    title: 'Detrás de cámara. Dentro de cada historia.',
    description: 'Soy Augusto Lupo, realizador audiovisual especializado en dirección de cámaras en vivo, producción de contenido, filmmaking y fotografía. Me apasiona contar historias a través de imágenes, combinando creatividad, técnica y narrativa visual.',
    education: 'Soy estudiante de 4.º año de la Licenciatura en Tecnología Multimedial en la Universidad Maimónides. Trabajo como realizador audiovisual, director de cámaras para streaming, fotógrafo y filmmaker freelance.',
    approach: 'Disfruto estar en sets, estudios y grabaciones, siempre buscando trabajar con prolijidad, responsabilidad y atención a la calidad.',
  },
  stats: [{ value: '4.º', label: 'Año de la carrera' }, { value: experience.length, label: 'Áreas de experiencia' }],
  experience,
  contact: {
    title: "Let's create something together.",
    subtitle: '¿Tenés un proyecto en mente? Hagámoslo realidad.',
    email: 'augustolupo030422@gmail.com',
    // Agregar Behance únicamente cuando haya un enlace confirmado.
    socials: [
      { label: 'Instagram', handle: '@augusto_lupo', url: 'https://www.instagram.com/augusto_lupo/' },
      { label: 'TikTok', handle: '@augustolupo22', url: 'https://www.tiktok.com/@augustolupo22' },
    ],
  },
};
