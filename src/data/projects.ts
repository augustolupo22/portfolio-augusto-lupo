import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Project, ProjectImage, ProjectVideo } from './project-types';
import folders from './catalog-folders.json';
import posters from './video-posters.json';

const videoMetadata: Record<string, Pick<Extract<ProjectVideo, { type: 'file' }>, 'poster' | 'width' | 'height'>> = posters;

function event(project: Project & { slug: keyof typeof folders }): Project {
  const folder = folders[project.slug];
  const files = readdirSync(join('public', 'media', folder), { withFileTypes: true })
    .filter(entry => entry.isFile()).map(entry => entry.name).sort();
  const images: ProjectImage[] = [];
  const videos: ProjectVideo[] = [];
  for (const file of files) {
    const src = `/media/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
    if (/\.(jpe?g|png|webp|avif)$/i.test(file)) {
      images.push({ src, alt: `${project.title}, fotografía ${images.length + 1}` });
    } else if (/\.(mp4|webm|m4v|mov|ogv)$/i.test(file)) {
      const metadata = videoMetadata[`${folder}/${file}`];
      if (!metadata) throw new Error(`Falta poster para ${folder}/${file}. Ejecutar node scripts/video-posters.mjs`);
      videos.push({ type: 'file', src, title: file.replace(/\.[^.]+$/, ''), ...metadata });
    }
  }
  return { ...project, images, videos };
}

export const projects: Project[] = [
  event({
    slug: 'el-gran-premio-de-la-cocina', title: 'El Gran Premio de la Cocina',
    client: 'eltrece', role: 'Fotografía y cobertura en video',
    cover: { src: '/project-covers/el-gran-premio-de-la-cocina.webp', alt: 'Los dos conductores en el estudio de El Gran Premio de la Cocina' },
    description: 'Fotografía y cobertura en video del programa de eltrece.',
    categories: ['Fotografía', 'Filmmaking', 'Coberturas y eventos'],
  }),
  event({
    slug: 'por-amor-o-por-dinero', title: 'Por amor o por dinero',
    client: 'eltrece', role: 'Dirección de streaming · Edición de clips · Edición del backstage de promos',
    cover: { src: '/project-covers/por-amor-o-por-dinero.webp', alt: 'El conductor sonriendo frente al croma durante la grabación de la promo' },
    description: 'Dirección de streaming, edición de clips y backstage de las promos de eltrece.',
    categories: ['Dirección de cámaras', 'Edición y postproducción'],
  }),
  event({
    slug: 'dj-fgl', title: 'Dj - Fernando Goncalves Lema (FGL)',
    client: 'DJ FGL', role: 'Fotografía de backstage',
    cover: { src: '/project-covers/dj-fgl.webp', alt: 'Figura en lo alto de una escalera contra el cielo azul' },
    description: 'Fotografías del rodaje del video de presentación de la fiesta de Fernando Goncalves Lema (FGL).',
    categories: ['Fotografía', 'Coberturas y eventos'],
  }),
  event({
    slug: 'fauda', title: 'Fiesta Fauda - Fiesta electrónica',
    client: 'Fiesta Fauda', role: 'Fotografía del evento',
    cover: { src: '/project-covers/fauda.webp', alt: 'DJ con auriculares frente a la consola en la Fiesta Fauda' },
    description: 'Cobertura fotográfica de la fiesta electrónica Fauda.',
    categories: ['Fotografía', 'Coberturas y eventos'],
  }),
  event({
    slug: 'valen-cortes', title: 'Valen Cortes',
    client: 'Valen Cortes', role: 'Fotografía y video para redes', tools: ['Premiere Pro', 'Lightroom'],
    cover: { src: '/project-covers/valen-cortes.webp', alt: 'Valen Cortes sentada en un café' },
    description: 'Fotografía y video de moda y lifestyle para las redes de Valen Cortes.',
    categories: ['Fotografía', 'Filmmaking'],
  }),
  event({
    slug: 'book-xv-delfina', title: 'Book XV años - Delfina',
    role: 'Fotografía y video', tools: ['Premiere Pro', 'Lightroom'],
    cover: { src: '/project-covers/book-xv-delfina.webp', alt: 'La cumpleañera en un campo de flores amarillas' },
    description: 'Fotos y videos para la cumpleañera, incluido el video de entrada para su fiesta de quince.',
    categories: ['Fotografía', 'Filmmaking', 'Edición y postproducción'],
  }),
];
