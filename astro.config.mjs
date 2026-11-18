// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// React se usa solo como "isla" para la credencial 3D; el resto del sitio es HTML estático.
export default defineConfig({
  site: 'https://portfolio-augusto-lupo.vercel.app',
  integrations: [react()],
});
