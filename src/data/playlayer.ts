// Página de Playlayer (/playlayer): datos de venta. Completar cuando estén definidos;
// mientras checkoutUrl esté vacío, el botón de compra lleva a escribirle a Augusto por Instagram.
// Regla: no poner precios ni promesas que Augusto no haya confirmado.

export const playlayer = {
  /** true = todavía en desarrollo: se muestra el aviso y el botón pide que le avisen en vez de comprar. */
  enDesarrollo: true,
  /** Link de checkout del producto en Polar (por ejemplo https://buy.polar.sh/polar_cl_…). */
  checkoutUrl: '',
  /** Precio tal cual se muestra (por ejemplo 'USD 49'). Vacío = no se muestra. */
  price: '',
  /** Detalle bajo el precio (por ejemplo 'Pago único'). */
  priceNote: '',
  /** Video de presentación en YouTube (solo el ID). Vacío = no se muestra. */
  youtubeId: '',
  /** Mientras no haya checkout: dónde escribir para comprarlo. */
  contactUrl: 'https://ig.me/m/augusto_lupo',
  devices: 3,
  offlineDays: 14,
};

export const games = [
  { id: 'rueda', name: 'Letra a Letra', text: 'Una pregunta por letra: acierto, pasa o fallo, contra reloj. Hasta 6 jugadores, cada uno con su rueda.' },
  { id: 'paletas', name: 'Paletas', text: 'Cada talento elige en secreto desde su celular y la paleta se revela cuando vos decidís.' },
  { id: 'pulsadores', name: 'Pulsadores', text: 'Cada participante pulsa desde su celular (o un botón USB) y el overlay muestra quién llegó primero.' },
  { id: 'ruleta', name: 'Ruleta de sorteo', text: 'Una rueda que gira con nombres, premios o consignas cargadas por vos.' },
  { id: 'palabra', name: 'Ahorcado', text: 'Adivinar una palabra o frase letra por letra, por turnos y con puntaje.' },
  { id: 'completa', name: 'Completá la respuesta', text: 'La respuesta en casilleros con letras de pista, contra reloj.' },
  { id: 'tutti', name: 'Tutti Frutti', text: 'Letra al azar, categorías y reloj. Cargás y corregís: los puntos salen solos.' },
  { id: 'imagen', name: 'Imagen tapada', text: 'Una foto que se destapa por piezas o se despixela: cuanto antes la adivinan, más puntos.' },
  { id: 'pistas', name: 'Pistas en cuenta regresiva', text: 'Pistas que se revelan de a una: cuantas menos hacen falta, más puntos.' },
];
