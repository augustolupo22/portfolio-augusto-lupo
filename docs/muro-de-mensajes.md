# Muro de mensajes (fuente dinámica)

## Qué es

Al final del portfolio, en **Contacto**, los visitantes pueden dejar un mensaje público (nombre + texto). Los mensajes se guardan en una base de datos PostgreSQL alojada en [Supabase](https://supabase.com) (plan gratuito) y se leen desde el navegador con su API REST.

Es la fuente dinámica que pide la consigna: el contenido cambia sin volver a publicar el sitio, depende de un servicio externo y tiene que resolver carga, ausencia de datos y errores.

## Qué información se obtiene

`GET /rest/v1/mensajes?select=id,nombre,mensaje,created_at&order=created_at.desc&limit=30`

Devuelve los 30 mensajes más recientes. Al publicar se envía `POST /rest/v1/mensajes` con `{ nombre, mensaje }` y se pide la fila creada (`Prefer: return=representation`) para mostrarla sin recargar.

El código está en `src/lib/guestbook.ts` (acceso a datos, validación, errores) y `src/components/Guestbook.astro` (interfaz y estados).

## Estados que resuelve

| Estado | Qué ve la persona |
|---|---|
| Sin configurar | Si faltan las variables de entorno, el formulario queda deshabilitado y se sugiere escribir por email. |
| Cargando | Tres tarjetas "esqueleto" animadas y `aria-busy="true"`. La lista se pide recién cuando el muro se acerca a la pantalla. |
| Vacío | "Todavía no hay mensajes. ¡Dejá el primero!" |
| Con mensajes | Lista con inicial, nombre, tiempo relativo ("hace 3 horas") y texto. |
| Error al cargar | Mensaje según la causa (sin conexión, demora mayor a 8 s, error del servidor) y botón **Reintentar**. |
| Validación | Errores debajo de cada campo (`aria-invalid`), contador de caracteres que avisa al acercarse al límite. |
| Enviando | Botón deshabilitado con el texto "Publicando…". |
| Enviado | El mensaje aparece arriba de la lista con una animación y se confirma "¡Gracias!". |
| Error al enviar | Se explica el problema y el texto **no se borra** del formulario. |
| Espera | Entre un envío y otro hay que esperar 30 s (control en el navegador). |

## Límites y seguridad

- La clave *publishable* de Supabase (la antigua `anon`) es pública por diseño. Lo que permite hacer la limitan las políticas RLS de la tabla: **solo leer y crear** mensajes; nadie puede editarlos ni borrarlos desde el sitio.
- La base de datos rechaza nombres de más de 40 caracteres y mensajes de más de 280, aunque alguien saltee la validación del navegador.
- El texto de los visitantes se inserta con `textContent`, nunca como HTML, para evitar inyección de código.
- Un campo trampa oculto descarta envíos automáticos simples. No es una protección fuerte contra spam: la moderación se hace desde el panel de Supabase (borrar filas).
- Si Supabase limita pedidos (HTTP 429) se muestra "Probá en un minuto".

## Configuración (una sola vez)

1. Crear un proyecto gratuito en Supabase.
2. En **SQL Editor**, ejecutar:

```sql
create table public.mensajes (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 40),
  mensaje text not null check (char_length(btrim(mensaje)) between 1 and 280),
  created_at timestamptz not null default now()
);

alter table public.mensajes enable row level security;

-- Permisos del rol público (sin esto la API responde 401 "permission denied").
grant select, insert on public.mensajes to anon;

create policy "Cualquiera puede leer mensajes"
  on public.mensajes for select to anon using (true);

create policy "Cualquiera puede dejar un mensaje"
  on public.mensajes for insert to anon
  with check (char_length(btrim(nombre)) between 1 and 40 and char_length(btrim(mensaje)) between 1 and 280);
```

3. En **Project Settings → API** copiar la *Project URL* y la *publishable key*.
4. Cargarlas como variables de entorno:
   - Local: crear `.env` (copiando `.env.example`) con `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`.
   - Vercel: **Settings → Environment Variables**, las mismas dos variables, y volver a desplegar.
