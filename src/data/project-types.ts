export const categories = ['Dirección de cámaras', 'Filmmaking', 'Fotografía', 'Edición y postproducción', 'Coberturas y eventos'] as const;
export type Category = (typeof categories)[number];
export type ProjectImage = { src: string; alt: string };
export type ProjectVideo = { title: string } & (
  | { type: 'file'; src: string; poster: string; width: number; height: number; captions?: string }
  | { type: 'youtube' | 'vimeo'; id: string }
);

export interface Project {
  slug: string;
  title: string;
  description: string;
  categories: Category[];
  role?: string;
  client?: string;
  tools?: string[];
  year?: number;
  cover?: ProjectImage;
  coverPosition?: string;
  images?: ProjectImage[];
  videos?: ProjectVideo[];
  links?: { href: string; label: string }[];
}
