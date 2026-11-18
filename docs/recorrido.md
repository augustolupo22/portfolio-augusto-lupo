# Retomar recorrido

La fuente dinámica es el historial local de visitas, no el catálogo de proyectos. Abrir una ficha, incluso por enlace directo o al volver con el navegador, coloca su identificador al principio. Se conservan hasta cinco fichas distintas. Ver el índice, filtrar o enfocar un enlace no registra visitas.

El índice cruza esos identificadores con el catálogo publicado para mostrar títulos y enlaces vigentes. La lista permite volver a trabajos recientes para compararlos. Se relee al regresar al índice y cuando otra pestaña del mismo sitio cambia el historial. Si no hay coincidencias, se muestra un estado vacío sin sugerencias inventadas.

`localStorage` conserva únicamente la lista ordenada de identificadores en `portfolio:recorrido:v1`, sin nombres de visitantes, fechas ni identificadores de usuario. No se envía al servidor. El recorrido pertenece al perfil de navegador y al origen del sitio, no a una persona; puede persistir entre sesiones. **Borrar historial** elimina solo esa clave.

Sin JavaScript, la sección permanece oculta y las fichas siguen siendo enlaces normales. Si el almacenamiento está bloqueado, lleno o dañado, se informa de la operación fallida sin impedir la navegación. El índice permite intentar borrar un historial ilegible.
