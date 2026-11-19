# Augusto Lupo | Portfolio audiovisual

Portfolio de un realizador audiovisual (director de cámaras, filmmaker y fotógrafo) para **clientes, colegas y posibles empleadores**. La experiencia se presenta como un "pase de rodaje": se entra por una credencial colgante en 3D que se puede agarrar y sacudir, se recorre un archivo de trabajos reales filtrable por disciplina, y se cierra con un muro donde los visitantes dejan su mensaje.

## Enlaces

- Sitio publicado: https://portfolio-augusto-lupo.vercel.app
- Repositorio: https://github.com/augustolupo22/portfolio-augusto-lupo

El sitio se publica en Vercel: cada push a `main` genera un nuevo deploy de producción automáticamente.

## Ejecutar

Desde la raíz, con Node.js LTS (recomendado: 22.19 o posterior) y npm:

```sh
npm ci
npm run dev
```

Abrir la dirección que indique Astro. Para construir la versión estática, ejecutar `npm run build`; para revisarla, `npm run preview`. La carpeta publicable es `dist/`.

Para que funcione el muro de mensajes en local, copiar `.env.example` como `.env` y completar las credenciales de Supabase (ver [Muro de mensajes](docs/muro-de-mensajes.md)). Sin ellas el sitio funciona igual y el muro muestra que no está conectado.

## Edición de contenido

- `src/data/profile.ts`: presentación, roles, formación, experiencia, herramientas, proyectos web propios, clientes y contacto (con Instagram, TikTok, Behance y LinkedIn). Las estadísticas de "Sobre mí" se calculan solas a partir del catálogo.
- Retrato: `profile.portrait` (foto) y `profile.portraitFocus` (punto de foco vertical al recortarla en la credencial).
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

## Tecnologías y decisiones

- **Astro 5** genera HTML estático para la portada y las fichas. Casi toda la interacción es JavaScript liviano dentro de cada componente.
- **React + Three.js (React Three Fiber, Drei, Rapier)** solo para la credencial 3D, como *isla* de Astro (`client:only`). Se eligió porque la física de una cinta colgante (cuerdas, gravedad, arrastre) es el elemento más memorable de la referencia y no se puede resolver con CSS. Para no castigar a todos los dispositivos, el paquete 3D se descarga **solo** en pantallas grandes con mouse, con WebGL y sin "reducir movimiento". En el resto se ve una credencial estática hecha con HTML/CSS.
- **CSS propio** (sin Tailwind): tokens de color en `src/styles/global.css`, tarjetas de vidrio, brillo azul y animaciones con `transition`/`@keyframes`. Tipografías **Geist** y **Geist Mono** autoalojadas con Fontsource.
- **Supabase** (API REST) como fuente dinámica del muro de mensajes.
- **Vercel** para el despliegue continuo desde GitHub.

## Componentes propios relevantes

| Componente | Responsabilidad |
|---|---|
| `lanyard/LanyardIsland.tsx` + `LanyardScene.tsx` + `textures.ts` | Credencial 3D con física: tres tramos de cinta unidos por *rope joints* sostienen una tarjeta rígida que se puede arrastrar. Las caras de la tarjeta y la cinta se dibujan en `<canvas>` con el retrato y los datos de `profile.ts` (no hay modelo 3D externo). Decide si el dispositivo soporta 3D; si no, deja la versión estática. |
| `CameraPass.astro` | Credencial estática (HTML/CSS): versión sin JavaScript, para celulares y para quien prefiere menos movimiento. |
| `PortfolioTabs.astro` | Pestañas accesibles (patrón ARIA, flechas del teclado) entre Proyectos, Herramientas, Proyectos web y Clientes; filtros de proyectos por disciplina con conteo, anuncio del resultado para lectores de pantalla, estado vacío y transiciones (View Transitions API). |
| `Guestbook.astro` + `lib/guestbook.ts` | Muro de mensajes: lectura y escritura en Supabase con todos sus estados. |
| `ProjectGallery.astro` | Galería en columnas con visor a pantalla completa (`<dialog>`): flechas, Escape, deslizar en celular, contador y devolución del foco. |
| `Hero.astro`, `About.astro`, `Contact.astro` | Secciones de la portada. `About` calcula sus cifras desde el catálogo (no hay números escritos a mano). |
| `Layout.astro` + `scripts/` | Pantalla de carga con progreso real (`loader.ts`), fondo de estrellas en canvas (`starfield.ts`), menú con indicador de sección activa (`nav.ts`) y aparición al hacer scroll (`reveal.ts`). |

## Fuente dinámica: muro de mensajes

Los visitantes dejan un mensaje que se guarda en Supabase y aparece en el muro. La API utilizada, los estados (sin configurar, cargando, vacío, error con reintento, validación, enviando, enviado, espera), la seguridad y la configuración están en **[docs/muro-de-mensajes.md](docs/muro-de-mensajes.md)**.

## Interacción y estados

- **Credencial 3D**: se arrastra y se suelta; la física responde. La pista "Arrastrá la credencial" desaparece después del primer agarre.
- **Pantalla de carga**: el porcentaje sigue tareas reales (tipografías, imágenes del inicio, credencial lista). Si todo ya está listo termina enseguida y nunca supera los 7 s. Solo aparece en la primera visita de la sesión.
- **Portfolio**: pestaña activa, filtro activo, resultado anunciado y estado vacío con "Ver todos".
- **Muro**: ver la tabla de estados en la documentación.
- **Contacto**: copiar el email confirma "¡Copiado!" (o explica si el navegador no lo permite).

## Responsive y accesibilidad

- Probado a 375 px (celular) y en escritorio. En celular las grillas pasan a una columna, la credencial es estática y el menú entra completo.
- Teclado: enlace "Saltar al contenido", foco visible en todos los controles, pestañas con flechas, visor de fotos con Escape y devolución del foco.
- Lectores de pantalla: los roles que se "escriben" solos tienen su texto completo oculto visualmente; filtros y muro anuncian cambios con `role="status"`; las imágenes tienen texto alternativo; la credencial 3D es decorativa (`aria-hidden`) y su información está en el texto de la portada.
- `prefers-reduced-motion`: sin 3D, sin estrellas animadas, sin escritura automática ni apariciones.
- Contraste: texto principal #F8FAFC y secundario #A1A1AA sobre fondo #09090B. Sobre el amarillo de acento (#EAB308) el texto es oscuro (#111).

## Limitaciones conocidas y mejoras posibles

- La escena 3D pesa cerca de 1,1 MB comprimida (Three.js + motor de física). Se descarga solo en escritorio, pero podría aligerarse.
- El muro no tiene moderación automática: los mensajes se moderan a mano desde Supabase.
- El Book XV años todavía tiene solo videos: faltan cargar las fotos.
- La plataforma para publicar y vender páginas es una idea a futuro (figura como "Próximamente").

## Créditos

- Referencia visual: video de un portfolio con credencial colgante compartido en TikTok. Se tomó la estructura general (intro con porcentaje, credencial, pestañas, muro de mensajes); los textos, fotos, datos y el diseño de la credencial son propios.
- Tipografías Geist y Geist Mono (SIL Open Font License) vía Fontsource.
- Librerías: Astro, React, Three.js, React Three Fiber, Drei, Rapier y MeshLine (licencias MIT / Apache 2.0).
- Fotos y videos: trabajos de Augusto Lupo. Los derechos de las producciones pertenecen a sus respectivos clientes.

## Bitácora y pendientes

1. La primera base solo mostraba una página en construcción. Se decidió usar Astro y postergar la identidad hasta contar con información personal.
2. A partir de la entrevista se incorporaron formación, trabajos independientes y contacto. La referencia visual dio lugar a una credencial sin foto en vez de usar un retrato ajeno.
3. El nuevo archivo suma nueve producciones a los tres trabajos iniciales. Una ficha por proyecto permite compartir enlaces directos. Se eligió no prolongar la carga ni agregar animaciones que alteren los rostros.

4. Con el material provisto por Augusto se acotó el catálogo a cinco trabajos: El Gran Premio de la Cocina, Por amor o por dinero, DJ FGL, FAUDA y Valen Cortes. Cada ficha toma sus medios de la carpeta configurada bajo `public/media` al reconstruir el sitio. La credencial ahora lleva el retrato personal y las galerías aparecen progresivamente al recorrerlas.

5. Al preparar el repositorio, el material original pesaba 2,3 GB y doce videos superaban los 50 MB (GitHub rechaza archivos de más de 100 MB). Se separaron los originales en `media-originales/` (fuera del repositorio) y se agregó `npm run media`, que genera fotos de hasta 2400 px y videos 720p H.264. El material publicado bajó a 105 MB y el video más pesado a 11 MB. Así el book de XV, que no forma parte del catálogo, ya no se copia al despliegue.

6. Se tomó como referencia el video de un portfolio con credencial colgante y se rearmó el sitio con esa estructura: intro con porcentaje real, credencial 3D con física (React Three Fiber + Rapier), "Sobre mí" con formación, experiencia y cifras del catálogo, portfolio con pestañas y filtros, fichas con visor de fotos y contacto con muro de mensajes. El historial local de visitas ("Retomar recorrido") se reemplazó por el muro conectado a Supabase, una fuente dinámica más significativa. Decisiones de Augusto: credencial 3D arrastrable, muro de mensajes como fuente dinámica y pestañas Proyectos, Herramientas, Equipo y Clientes.

7. Correcciones de Augusto: todo el sitio en español ("Creemos algo juntos."), experiencia reescrita (eltrece, ShowThisNow y trabajos freelance), formación con la escuela Santísima Virgen Niña, vMix y OBS en herramientas, Behance y LinkedIn en redes, la pestaña Equipo se reemplazó por **Proyectos web** propios, "Prende" en clientes de eltrece, títulos nuevos para DJ FGL y Fauda, nuevo proyecto **Book XV años - Delfina** y una portada de "Por amor o por dinero" donde se ve mejor al conductor. El color de acento pasó de azul a **amarillo**, para seguir la estética de las portadas de su Instagram. La credencial 3D ahora se dibuja en una capa del ancho de la pantalla: al arrastrarla solo se corta en los bordes del navegador, y los clics siguen llegando a los botones que quedan debajo.

La IA asistió en el diseño inicial, los componentes, la redacción y la verificación técnica. La selección de trabajos, la referencia, los datos personales y los criterios de presentación fueron provistos por Augusto. Antes de publicar, revisar permisos, créditos y peso de los medios. Astro copia todo `public/` al despliegue, incluso carpetas no enlazadas: mantener fuera de `public/` cualquier material que no deba quedar accesible. Pendientes: revisión propia del código.
