# Augusto Lupo | Portfolio audiovisual

Portfolio para clientes, colegas y equipos de producción. Desde una credencial de realizador se pasa a un archivo de trabajos que se puede recorrer por disciplina. La referencia orienta la composición, no el contenido de las fotografías.

## Ejecutar

Desde la raíz, con Node.js LTS (recomendado: 22.19 o posterior) y npm:

```sh
npm ci
npm run dev
```

Abrir la dirección que indique Astro. Para construir la versión estática, ejecutar `npm run build`; para revisarla, `npm run preview`. La carpeta publicable es `dist/`.

## Edición de contenido

- `src/data/profile.ts`: presentación, experiencia, estadísticas y contacto. Agregar Behance a `contact.socials` solo con su URL confirmada.
- Para usar un retrato, colocar la foto autorizada en `media-originales/`, optimizarla (ver abajo) y establecer `portrait: { src: '/media/retrato.webp', alt: 'Retrato de Augusto Lupo' }`. Sin foto, la credencial usa una gráfica de cámara.
- `src/data/projects.ts`: un registro por trabajo. El `slug` debe ser único; el orden determina los enlaces anterior/siguiente. Los formatos de imagen, video, enlace y categorías están definidos en `src/data/project-types.ts`. No completar años ni roles por aproximación.
- Escribir el texto alternativo de cada imagen y agregar subtítulos cuando el audio sea necesario. Los cambios en el catálogo requieren volver a construir y publicar.

### Fotos y videos: originales y versiones web

Los originales en alta calidad viven en `media-originales/` (misma estructura de carpetas que el catálogo). Esa carpeta **no se sube al repositorio** (está en `.gitignore`): pesa más de 2 GB y varios videos superan el límite de 100 MB por archivo de GitHub.

`npm run media` (`scripts/optimize-media.mjs`) genera en `public/media/` las versiones que se publican:

- Fotos: lado largo máximo de 2400 px, JPEG con calidad 80 y orientación corregida.
- Videos: 720p en el lado corto, H.264 (CRF 25, máx. 3 Mb/s), audio AAC 128 kb/s y `faststart` para que empiecen a reproducirse antes de descargarse completos.
- Solo se procesan las carpetas de `src/data/catalog-folders.json` y el retrato. Cualquier otro material en `media-originales/` queda privado.
- Los archivos ya generados y más nuevos que su original se saltean; `npm run media -- --force` regenera todo.

Flujo para sumar material: copiar los originales a `media-originales/<carpeta del trabajo>/`, ejecutar `npm run media`, y si hay videos nuevos, `npm run posters`. `ffmpeg` y `ffprobe` se instalan como dependencias de desarrollo (`ffmpeg-static`, `ffprobe-static`), no hace falta instalarlos aparte.

### Posters de video

Al agregar, renombrar o reemplazar videos, ejecutar `npm run posters` desde la raíz. Por defecto usa los binarios de `ffmpeg-static` y `ffprobe-static`; se pueden reemplazar mediante `FFMPEG` y `FFPROBE`. Solo se procesan videos de las carpetas de `src/data/catalog-folders.json`. El script lee los originales en orden de fotograma y guarda el primero cuya luminancia media supera 28 y cuyo percentil 90 supera 44 (rango de video 16–235), para descartar inicios negros o casi negros.

Versionar los WebP de `public/video-posters/` junto con `src/data/video-posters.json`. No colocar posters junto a los videos: el catálogo los contaría como fotos. En la interfaz, cada `ProjectVideo` con `type: 'file'` expone `poster` (URL pública) y `width`/`height` (dimensiones de presentación del video original) para reservar su proporción antes de cargarlo.

## Decisiones y componentes

Astro genera HTML estático para la portada y las fichas. El CSS se ocupa del diseño y el movimiento; no se necesita React para filtrar una grilla ni una biblioteca de animación para mover la credencial.

- `CameraPass.astro`: compone la credencial con foto opcional y movimiento de profundidad.
- `ProjectIndex.astro`: filtra por disciplina, anuncia el resultado y permite entrar a las fichas. Sin JavaScript mantiene los enlaces al catálogo completo.
- `ProjectCover.astro`, `ProjectGallery.astro` y `ProjectVideos.astro`: separan portada y medios opcionales de cada ficha. Si no hay portada se muestra una placa tipográfica, no material de otra producción.
- `Layout.astro`: navegación compartida, indicador de carga basado en imágenes pendientes y estilos globales. La composición pasa a una columna en celulares, el contenido no depende del hover y el movimiento respeta la preferencia del dispositivo.
- Fuente dinámica: [Retomar recorrido](docs/recorrido.md) lee las últimas fichas abiertas en este navegador. No es una API externa ni un servicio de analítica. El catálogo editorial se mantiene separado de ese historial.

## Bitácora y pendientes

1. La primera base solo mostraba una página en construcción. Se decidió usar Astro y postergar la identidad hasta contar con información personal.
2. A partir de la entrevista se incorporaron formación, trabajos independientes y contacto. La referencia visual dio lugar a una credencial sin foto en vez de usar un retrato ajeno.
3. El nuevo archivo suma nueve producciones a los tres trabajos iniciales. Una ficha por proyecto permite compartir enlaces directos. Se eligió no prolongar la carga ni agregar animaciones que alteren los rostros.

4. Con el material provisto por Augusto se acotó el catálogo a cinco trabajos: El Gran Premio de la Cocina, Por amor o por dinero, DJ FGL, FAUDA y Valen Cortes. Cada ficha toma sus medios de la carpeta configurada bajo `public/media` al reconstruir el sitio. La credencial ahora lleva el retrato personal y las galerías aparecen progresivamente al recorrerlas.

5. Al preparar el repositorio, el material original pesaba 2,3 GB y doce videos superaban los 50 MB (GitHub rechaza archivos de más de 100 MB). Se separaron los originales en `media-originales/` (fuera del repositorio) y se agregó `npm run media`, que genera fotos de hasta 2400 px y videos 720p H.264. El material publicado bajó a 105 MB y el video más pesado a 11 MB. Así el book de XV, que no forma parte del catálogo, ya no se copia al despliegue.

La IA asistió en el diseño inicial, los componentes, la redacción y la verificación técnica. La selección de trabajos, la referencia, los datos personales y los criterios de presentación fueron provistos por Augusto. Antes de publicar, revisar permisos, créditos y peso de los medios. Astro copia todo `public/` al despliegue, incluso carpetas no enlazadas: mantener fuera de `public/` cualquier material que no deba quedar accesible. Pendientes: revisión propia del código, publicación y enlaces definitivos de sitio/repositorio.
